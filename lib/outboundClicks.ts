import type { AnalyticsPayload } from "@/types/analytics";

// Outbound /go/ clicks are recorded server-side, once per redirect, so every
// CTA on every page is counted the same way. Nothing identifying is stored:
// no IP address, user agent, or cookie value beyond a per-card dedupe flag.

export const DEDUPE_WINDOW_SECONDS = 30 * 60;
const CAMPAIGN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse/i;

export const dedupeCookieName = (cardId: string) => `bcfm_go_${cardId.replace(/[^a-z0-9-]/gi, "")}`;

export type OutboundClickDecision =
  | { record: false; reason: "prefetch" | "bot" | "duplicate" | "method" }
  | { record: true; event: AnalyticsPayload & { metadata: Record<string, unknown> }; setDedupeCookie: true };

function campaignFrom(...urls: (URL | undefined)[]) {
  const campaign: Record<string, string> = {};
  for (const url of urls) {
    for (const param of CAMPAIGN_PARAMS) {
      const value = url?.searchParams.get(param);
      if (value && !campaign[param]) campaign[param] = value.slice(0, 100);
    }
  }
  return campaign;
}

export function classifyOutboundClick(
  request: Request,
  cardId: string,
  destination: string,
  clickId: string,
): OutboundClickDecision {
  if (request.method !== "GET") return { record: false, reason: "method" };

  // Next.js <Link> prefetches /go/ targets that scroll into view; those are not clicks.
  const headers = request.headers;
  if (
    headers.get("next-router-prefetch") ||
    headers.get("purpose") === "prefetch" ||
    headers.get("sec-purpose")?.includes("prefetch")
  ) {
    return { record: false, reason: "prefetch" };
  }

  if (BOT_PATTERN.test(headers.get("user-agent") || "")) return { record: false, reason: "bot" };

  const cookies = headers.get("cookie") || "";
  if (cookies.split(/;\s*/).some((cookie) => cookie.startsWith(`${dedupeCookieName(cardId)}=`))) {
    return { record: false, reason: "duplicate" };
  }

  const requestUrl = new URL(request.url);
  const referrerHeader = headers.get("referer");
  let referrer: URL | undefined;
  try {
    referrer = referrerHeader ? new URL(referrerHeader) : undefined;
  } catch {
    referrer = undefined;
  }
  // Only same-site paths are kept; external referrers are reduced to their host.
  const sameSite = referrer && referrer.host === requestUrl.host;
  const sourcePage = sameSite ? referrer!.pathname : referrer ? `external:${referrer.host}` : "direct";

  return {
    record: true,
    setDedupeCookie: true,
    event: {
      eventName: "outbound_click",
      sourcePage,
      sourceCard: cardId,
      metadata: {
        clickId,
        destinationType: destination.startsWith("/") ? "internal" : "issuer",
        ...campaignFrom(requestUrl, sameSite ? referrer : undefined),
      },
    },
  };
}

type GoCard = { id: string; affiliateSubIdParam?: string };

// Builds the /go/ redirect. The status (307) and destinations are unchanged
// from the original route; recording is handed to `schedule` so it runs after
// the response is sent (Next.js `after`) and never delays the redirect.
export function handleGoRequest(
  request: Request,
  card: GoCard | undefined,
  destination: string,
  record: (event: AnalyticsPayload) => Promise<void>,
  schedule: (task: () => Promise<void>) => void,
) {
  const clickId = crypto.randomUUID();
  const target = new URL(destination, request.url);
  const decision = card ? classifyOutboundClick(request, card.id, destination, clickId) : undefined;

  // Pass the click ID to the affiliate network so conversions can be joined back.
  if (decision?.record && card?.affiliateSubIdParam && target.origin !== new URL(request.url).origin) {
    target.searchParams.set(card.affiliateSubIdParam, clickId);
  }

  const response = new Response(null, {
    status: 307,
    headers: { Location: target.toString(), "Cache-Control": "no-store" },
  });

  if (card && decision?.record) {
    response.headers.append(
      "Set-Cookie",
      `${dedupeCookieName(card.id)}=1; Max-Age=${DEDUPE_WINDOW_SECONDS}; Path=/go; HttpOnly; SameSite=Lax`,
    );
    schedule(() => record(decision.event));
  }

  return response;
}
