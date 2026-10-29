import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cards } from "@/data/cards";
import { getAffiliateDestination } from "@/lib/affiliateLinks";
import { classifyOutboundClick, dedupeCookieName, handleGoRequest } from "@/lib/outboundClicks";
import type { AnalyticsPayload } from "@/types/analytics";

const site = "https://bestcardsforme.com";
const goRequest = (path: string, headers: Record<string, string> = {}) =>
  new Request(`${site}${path}`, { headers: { "user-agent": "Mozilla/5.0 Safari", ...headers } });

function run(request: Request, slug: string, card = cards.find((item) => item.affiliateSlug === slug)) {
  const recorded: AnalyticsPayload[] = [];
  const tasks: (() => Promise<void>)[] = [];
  const response = handleGoRequest(
    request,
    card,
    getAffiliateDestination(slug),
    async (event) => {
      recorded.push(event);
    },
    (task) => tasks.push(task),
  );
  return { response, recorded, tasks };
}

describe("/go/ redirects", () => {
  it("keep the existing 307 redirect target for every card", () => {
    cards.forEach((card) => {
      const { response } = run(goRequest(`/go/${card.affiliateSlug}`), card.affiliateSlug);
      assert.equal(response.status, 307);
      assert.equal(response.headers.get("location"), new URL(getAffiliateDestination(card.affiliateSlug), site).toString());
    });
  });

  it("record one outbound click after the response, with source page and campaign", async () => {
    const { response, recorded, tasks } = run(
      goRequest("/go/citi-double-cash?utm_source=newsletter", {
        referer: `${site}/articles/best-no-annual-fee-credit-card-2026?utm_campaign=oct`,
      }),
      "citi-double-cash",
    );

    assert.equal(recorded.length, 0, "recording waits until after the response");
    await Promise.all(tasks.map((task) => task()));
    assert.equal(recorded.length, 1);
    assert.equal(recorded[0].eventName, "outbound_click");
    assert.equal(recorded[0].sourceCard, "citi-double-cash");
    assert.equal(recorded[0].sourcePage, "/articles/best-no-annual-fee-credit-card-2026");
    assert.equal(recorded[0].metadata?.utm_source, "newsletter");
    assert.equal(recorded[0].metadata?.utm_campaign, "oct");
    assert.match(String(recorded[0].metadata?.clickId), /^[0-9a-f-]{36}$/);
    assert.match(response.headers.get("set-cookie") || "", new RegExp(`^${dedupeCookieName("citi-double-cash")}=1;`));
  });

  it("store no personal data", async () => {
    const { recorded, tasks } = run(
      goRequest("/go/citi-double-cash", { referer: "https://www.google.com/search?q=private+query", "x-forwarded-for": "203.0.113.9" }),
      "citi-double-cash",
    );
    await Promise.all(tasks.map((task) => task()));
    const stored = JSON.stringify(recorded);

    assert.equal(recorded[0].sourcePage, "external:www.google.com");
    for (const fragment of ["203.0.113.9", "private", "Safari"]) assert.ok(!stored.includes(fragment), fragment);
  });

  it("skip prefetches, bots, and repeat clicks within the dedupe window", () => {
    const skipped = (headers: Record<string, string>) => run(goRequest("/go/amex-gold", headers), "amex-gold");

    const headerSets: Record<string, string>[] = [
      { "next-router-prefetch": "1" },
      { purpose: "prefetch" },
      { "sec-purpose": "prefetch;prerender" },
      { "user-agent": "Googlebot/2.1" },
      { cookie: `theme=dark; ${dedupeCookieName("amex-gold")}=1` },
    ];
    for (const headers of headerSets) {
      const { response, tasks } = skipped(headers);
      assert.equal(tasks.length, 0, JSON.stringify(headers));
      assert.equal(response.status, 307, "the redirect still works");
      assert.equal(response.headers.get("set-cookie"), null);
    }
  });

  it("do not record unknown slugs and still send them home", () => {
    const { response, tasks } = run(goRequest("/go/not-a-card"), "not-a-card");
    assert.equal(tasks.length, 0);
    assert.equal(response.headers.get("location"), `${site}/`);
  });

  it("pass the click ID to an external affiliate URL when the card defines a sub-ID parameter", async () => {
    const card = { id: "test-card", affiliateSubIdParam: "sid" };
    const request = goRequest("/go/test-card");
    const recorded: AnalyticsPayload[] = [];
    const tasks: (() => Promise<void>)[] = [];
    const response = handleGoRequest(
      request,
      card,
      "https://www.anrdoezrs.net/click-123?url=x",
      async (event) => {
        recorded.push(event);
      },
      (task) => tasks.push(task),
    );
    await Promise.all(tasks.map((task) => task()));
    const location = new URL(response.headers.get("location") || "");

    assert.equal(location.searchParams.get("sid"), recorded[0].metadata?.clickId);
    assert.equal(recorded[0].metadata?.destinationType, "issuer");
  });

  it("classify only GET requests as clicks", () => {
    const head = new Request(`${site}/go/amex-gold`, { method: "HEAD" });
    assert.deepEqual(classifyOutboundClick(head, "amex-gold", "/cards/amex-gold", "id"), { record: false, reason: "method" });
  });
});
