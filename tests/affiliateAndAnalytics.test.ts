import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST } from "@/app/api/events/route";
import { cards } from "@/data/cards";
import { getCreditCardProfileBySlug } from "@/data/creditCardProfiles";
import { getAffiliateDestination } from "@/lib/affiliateLinks";

describe("affiliate routing", () => {
  it("sends every /go/ slug to a live destination", () => {
    cards.forEach((card) => {
      const destination = getAffiliateDestination(card.affiliateSlug);
      if (destination.startsWith("/")) {
        const [path] = destination.split("#");
        const slug = path.replace(/^\/cards\//, "");
        assert.ok(path === "/" || getCreditCardProfileBySlug(slug), `${card.affiliateSlug} -> ${destination}`);
      } else {
        assert.match(destination, /^https:\/\//, `${card.affiliateSlug} must use https`);
      }
    });
  });

  it("falls back to the homepage for unknown slugs", () => {
    assert.equal(getAffiliateDestination("not-a-card"), "/");
  });
});

describe("analytics event endpoint", () => {
  const post = (body: unknown) =>
    POST(new Request("http://localhost/api/events", { method: "POST", body: JSON.stringify(body) }));

  it("rejects unknown events", async () => {
    assert.equal((await post({ eventName: "page_scrolled" })).status, 400);
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/events", { method: "POST", body: "{" }));
    assert.equal(response.status, 400);
  });

  it("accepts every tracked event name", async () => {
    for (const eventName of ["quiz_completed", "email_capture_submit", "card_detail_viewed", "card_cta_clicked"]) {
      const response = await post({ eventName, sourcePage: "test", sourceCard: "citi-double-cash" });
      assert.equal(response.status, 200, eventName);
    }
  });
});
