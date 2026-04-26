import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { AnalyticsPayload } from "@/types/analytics";

export async function recordAnalyticsEvent({
  eventName,
  sourcePage,
  sourceCard,
  metadata,
}: AnalyticsPayload) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    console.warn("Analytics event skipped because Supabase is not configured:", eventName);
    return;
  }

  const { error } = await supabase.from("analytics_events").insert({
    event_name: eventName,
    source_page: sourcePage,
    source_card: sourceCard || null,
    metadata: metadata || {},
  });

  if (error) {
    console.error("Supabase analytics insert failed:", error.message);
  }
}
