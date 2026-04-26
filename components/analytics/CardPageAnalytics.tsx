"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analyticsClient";

type CardPageAnalyticsProps = {
  cardId: string;
};

export function CardPageAnalytics({ cardId }: CardPageAnalyticsProps) {
  useEffect(() => {
    trackEvent({
      eventName: "card_detail_viewed",
      sourcePage: "card_detail",
      sourceCard: cardId,
    });
  }, [cardId]);

  return null;
}
