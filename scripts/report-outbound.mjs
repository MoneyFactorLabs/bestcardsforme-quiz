// Outbound click and conversion report from Supabase.
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run report:outbound [-- --days 30]
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
