"use client";

import type { AnalyticsEventName } from "@/types/analytics";

type TrackEventInput = {
  eventName: AnalyticsEventName;
  sourcePage: string;
  sourceCard?: string | null;
  metadata?: Record<string, unknown>;
};

export function trackEvent(input: TrackEventInput) {
  const payload = JSON.stringify(input);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}
