// Outbound click and conversion report from Supabase.
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run report:outbound [-- --days 30] [-- --qa]
// Business views exclude QA clicks (utm_source=bcfm-qa*); --qa lists those clicks instead.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to run the outbound report.");
  process.exit(1);
}

const daysFlag = process.argv.indexOf("--days");
const days = daysFlag > -1 ? Number(process.argv[daysFlag + 1]) : 30;
const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const supabase = createClient(url, key, { auth: { persistSession: false } });

if (process.argv.includes("--qa")) {
  const { data: qa, error: qaError } = await supabase
    .from("outbound_clicks_qa")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  if (qaError) throw new Error(qaError.message);
  console.log(`QA outbound clicks since ${since}: ${qa.length}`);
  qa.forEach((row) =>
    console.log(`  ${row.created_at}  ${row.card_id}  ${row.source_page}  ${row.utm_campaign || "(none)"}  ${row.click_id}`),
  );
  process.exit(0);
}

const { data: daily, error } = await supabase.from("outbound_clicks_daily").select("*").gte("day", since);
if (error) throw new Error(error.message);

const total = (rows, key) =>
  Object.entries(
    rows.reduce((sums, row) => ({ ...sums, [row[key]]: (sums[row[key]] || 0) + Number(row.clicks) }), {}),
  ).sort((a, b) => b[1] - a[1]);

console.log(`Outbound clicks since ${since}: ${daily.reduce((sum, row) => sum + Number(row.clicks), 0)}`);
for (const [label, key] of [
  ["By card", "card_id"],
  ["By source page", "source_page"],
  ["By campaign", "utm_campaign"],
]) {
  console.log(`\n${label}`);
  total(daily, key).slice(0, 15).forEach(([name, clicks]) => console.log(`  ${String(clicks).padStart(5)}  ${name}`));
}

const { data: conversions } = await supabase.from("outbound_click_conversions").select("*");
const converted = (conversions || []).filter((row) => Number(row.conversions) > 0);
console.log(
  converted.length > 0
    ? `\nConversions (all time)\n${converted.map((row) => `  ${row.card_id}: ${row.conversions}/${row.clicks} clicks, ${row.commission} commission`).join("\n")}`
    : "\nConversions: none recorded yet (requires affiliate network reports in affiliate_conversions).",
);
