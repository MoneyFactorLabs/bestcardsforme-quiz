export type AnalyticsEventName =
  | "quiz_completed"
  | "email_capture_submit"
  | "card_detail_viewed"
  | "card_cta_clicked";

export type AnalyticsPayload = {
  eventName: AnalyticsEventName;
  sourcePage: string;
  sourceCard?: string | null;
  metadata?: Record<string, unknown>;
};
