"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analyticsClient";

type CardReviewActionsProps = {
  cardId: string;
  affiliateSlug: string;
};

export function CardReviewActions({ cardId, affiliateSlug }: CardReviewActionsProps) {
  // /go/ clicks are counted server-side as outbound_click, so only the
  // on-page offer-updates CTA is tracked here.
  function trackCtaClick(cta: "get_offer_updates") {
    trackEvent({
      eventName: "card_cta_clicked",
      sourcePage: "card_detail",
      sourceCard: cardId,
      metadata: {
        cta,
      },
    });
  }

  return (
    <>
      <Link
        href={`/go/${affiliateSlug}`}
        prefetch={false}
        className="focus-ring inline-flex justify-center rounded-md bg-gold px-5 py-3 text-sm font-bold text-navy transition hover:bg-[#caa42f]"
      >
        Read issuer terms
      </Link>
      <Link
        href="#offer-updates"
        onClick={() => trackCtaClick("get_offer_updates")}
        className="focus-ring inline-flex justify-center rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
      >
        Get offer updates by email
      </Link>
    </>
  );
}
