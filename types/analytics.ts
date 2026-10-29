export type AnalyticsEventName =
  | "quiz_completed"
  | "email_capture_submit"
  | "card_detail_viewed"
  | "card_cta_clicked"
  // Recorded server-side by /go/ only; not accepted from the browser.
  | "outbound_click";

export type AnalyticsPayload = {
  eventName: AnalyticsEventName;
  sourcePage: string;
  sourceCard?: string | null;
  metadata?: Record<string, unknown>;
};
