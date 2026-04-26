import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analyticsServer";
import type { AnalyticsEventName } from "@/types/analytics";

const allowedEvents = new Set<AnalyticsEventName>([
  "quiz_completed",
  "email_capture_submit",
  "card_detail_viewed",
  "card_cta_clicked",
]);

type EventPayload = {
  eventName?: AnalyticsEventName;
  sourcePage?: string;
  sourceCard?: string | null;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let payload: EventPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!payload.eventName || !allowedEvents.has(payload.eventName)) {
    return NextResponse.json({ error: "Unknown event." }, { status: 400 });
  }

  await recordAnalyticsEvent({
    eventName: payload.eventName,
    sourcePage: payload.sourcePage?.trim() || "unknown",
    sourceCard: payload.sourceCard?.trim() || null,
    metadata: payload.metadata || {},
  });

  return NextResponse.json({ ok: true });
}
