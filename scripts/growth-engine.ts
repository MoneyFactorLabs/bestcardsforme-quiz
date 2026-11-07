// BCFM Growth Engine: Search Console exports → ranked, non-duplicate content
// opportunities → reviewable briefs and a weekly report. Read-only: it writes
// markdown files and never publishes, posts, or calls an external API.
//
// Usage: npm run growth -- --manifest growth/inputs/<week>.json [--out growth/<week>] [--top 12]
//
// The manifest names the export files (see ops/GROWTH_ENGINE.md):
// { "label", "currentRange", "previousRange", "source",
//   "totals": { "current": {clicks, impressions, position}, "previous": {...} },
//   "current": ["Pages.csv", "Queries.csv"], "previous": ["Pages-prev.csv"] }
import fs from "node:fs";
import path from "node:path";
import { articles } from "@/data/articles";
import { candidates } from "@/data/growth/candidates";
import { creditCardProfiles } from "@/data/creditCardProfiles";
import { type GscDataset, type GscMetrics, ctr, isLowVolume, mergeDatasets, parseGscExport } from "@/lib/growth/gsc";
import { type Opportunity, rankOpportunities } from "@/lib/growth/opportunities";

type Manifest = {
  label: string;
  source: string;
  currentRange: string;
  previousRange?: string;
  totals?: { current?: GscMetrics; previous?: GscMetrics };
  current: string[];
  previous?: string[];
};

const args = process.argv.slice(2);
const option = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const manifestPath = option("--manifest");
if (!manifestPath) {
  console.error("Usage: npm run growth -- --manifest growth/inputs/<week>.json [--out dir] [--top 12]");
  process.exit(1);
}
const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const base = path.dirname(manifestPath);
const read = (file: string) => parseGscExport(fs.readFileSync(path.resolve(base, file), "utf8"));
const data: GscDataset = mergeDatasets(manifest.current.map(read), (manifest.previous ?? []).map(read));
const top = Number(option("--top")) || 12;
const outDir = option("--out") ?? path.join("growth", manifest.label);
const today = new Date();

const json = (file: string) => (fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {});
const claims = json("quality/issuer-claims.json").products ?? {};
const sources = json("quality/issuer-sources.json").cards ?? {};
const control = Object.keys(json("quality/control-pages.json").pages ?? {}).map((route) => route.replace("/articles/", ""));

const opportunities = rankOpportunities(candidates, data, {
  articles,
  verifiedProducts: new Set(Object.keys(claims)),
  feeOnlyProducts: new Set(Object.keys(sources)),
  protectedSlugs: new Set(control),
  today,
});

// --- Formatting helpers ------------------------------------------------------
const fmtInt = (value: number | null | undefined) => (value === null || value === undefined ? "—" : Math.round(value).toLocaleString("en-US"));
const fmtPos = (value: number | null | undefined) => (value === null || value === undefined ? "—" : value.toFixed(1));
const fmtPct = (value: number | null) => (value === null ? "—" : `${(value * 100).toFixed(2)}%`);
const change = (now: number | null | undefined, before: number | null | undefined) =>
  now === null || now === undefined || before === null || before === undefined || before === 0
    ? "—"
    : `${now >= before ? "+" : ""}${Math.round(((now - before) / before) * 100)}%`;
const table = (columns: string[], rows: string[][]) =>
  [`| ${columns.join(" | ")} |`, `|${columns.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n");
// Products registered for fact checks that have no BCFM card profile.
const otherProductNames: Record<string, string> = {
  "capital-one-spark-cash-plus": "Capital One Spark Cash Plus",
  "amex-business-platinum": "Amex Business Platinum",
  "amex-business-gold": "Amex Business Gold",
};
const cardTitle = (id: string) => creditCardProfiles.find((profile) => profile.slug === id)?.cardName ?? otherProductNames[id] ?? id;
const articleTitle = (href: string) => {
  const slug = href.replace("/articles/", "");
  return articles.find((article) => article.slug === slug)?.title ?? href;
};

// --- Weekly report -----------------------------------------------------------
function weeklyReport() {
  const pages = data.rows.filter((row) => row.dimension === "page");
  const queries = data.rows.filter((row) => row.dimension === "query");
  const totals = manifest.totals;
  const lines: string[] = [];
  lines.push(`# BCFM Growth Engine weekly report: ${manifest.label}`, "");
  lines.push(`- Current period: ${manifest.currentRange}${manifest.previousRange ? `; previous: ${manifest.previousRange}` : ""}`);
  lines.push(`- Source: ${manifest.source}`);
  lines.push(`- Generated ${today.toISOString().slice(0, 10)} by \`npm run growth\`. Search Console figures are as exported; nothing here is forecast.`);
  for (const note of data.notes) lines.push(`- Data note: ${note}`);
  if (queries.length === 0) lines.push("- **No query-level export was provided.** Opportunity evidence is page-level only; add Queries.csv next week.");
  lines.push("");

  if (totals?.current) {
    lines.push("## Site totals", "");
    lines.push(
      table(
        ["Metric", "Previous", "Current", "Change"],
        [
          ["Impressions", fmtInt(totals.previous?.impressions), fmtInt(totals.current.impressions), change(totals.current.impressions, totals.previous?.impressions)],
          ["Clicks", fmtInt(totals.previous?.clicks), fmtInt(totals.current.clicks), change(totals.current.clicks, totals.previous?.clicks)],
          ["CTR", fmtPct(totals.previous ? ctr(totals.previous) : null), fmtPct(ctr(totals.current)), "—"],
          ["Average position", fmtPos(totals.previous?.position), fmtPos(totals.current.position), "—"],
        ],
      ),
      "",
      "Small sample: week-over-week changes this size do not establish cause.",
      "",
    );
  }

  if (pages.length) {
    lines.push("## Pages", "");
    const sorted = [...pages].sort((a, b) => (b.current?.impressions ?? 0) - (a.current?.impressions ?? 0));
    lines.push(
      table(
        ["Page", "Impressions", "Prev.", "Clicks", "Position", "Flags"],
        sorted.map((row) => [
          `\`${row.key}\``,
          fmtInt(row.current?.impressions),
          fmtInt(row.previous?.impressions),
          fmtInt(row.current?.clicks),
          fmtPos(row.current?.position),
          [isLowVolume(row) ? "low volume" : "", row.previous ? "" : "no previous data", control.some((slug) => row.key.endsWith(slug)) ? "control" : ""]
            .filter(Boolean)
            .join(", ") || "—",
        ]),
      ),
      "",
    );
    const withBoth = pages.filter((row) => row.current && row.previous && !isLowVolume(row));
    const wins = withBoth.filter((row) => (row.current!.impressions > row.previous!.impressions * 1.3) || row.current!.clicks > row.previous!.clicks);
    const regressions = withBoth.filter((row) => row.current!.impressions < row.previous!.impressions * 0.7);
    lines.push("## Wins and regressions", "");
    lines.push(wins.length ? wins.map((row) => `- Win: \`${row.key}\` ${fmtInt(row.previous!.impressions)} → ${fmtInt(row.current!.impressions)} impressions`).join("\n") : "- No page-level wins measurable (needs both periods and ≥ 20 impressions).");
    lines.push(regressions.length ? regressions.map((row) => `- Regression: \`${row.key}\` ${fmtInt(row.previous!.impressions)} → ${fmtInt(row.current!.impressions)} impressions`).join("\n") : "- No page-level regressions measurable.");
    lines.push("");
  }

  lines.push("## Ranked opportunities", "");
  lines.push(
    table(
      ["#", "Opportunity", "Type", "Status", "Score", "Evidence", "Nearest existing page"],
      opportunities.map((item, index) => [
        String(index + 1),
        item.candidate.title,
        item.candidate.kind,
        item.status,
        String(item.score),
        item.evidence.impressions ? `${fmtInt(item.evidence.impressions)} impr., pos ${fmtPos(item.evidence.position)}` : "none yet",
        item.nearest ? `${item.nearest.slug} (${item.nearest.similarity.toFixed(2)})` : "—",
      ]),
    ),
    "",
    "Score = evidence (log impressions, max 30) + ranking headroom (max 15) + differentiation (calculation model 15 + verified-facts coverage 10) + conversion intent (max 15) + segment priority (max 10) − effort − overlap. Statuses: **brief** ready; **needs-facts** register issuer terms first; **hold** recently rewritten; **protected** control page; **duplicate** would cannibalize an existing page.",
    "",
  );

  const next = opportunities.filter((item) => item.status === "brief").slice(0, 5);
  lines.push("## Proposed next batch", "");
  lines.push(next.map((item, index) => `${index + 1}. ${item.candidate.title} (${item.candidate.kind === "new" ? "new page" : "improve existing"}) — [brief](briefs/${item.candidate.id}.md)`).join("\n"));
  lines.push("", "Founder approval is required before any brief becomes a draft PR.", "");
  return lines.join("\n");
}

// --- Briefs ------------------------------------------------------------------
function brief(item: Opportunity) {
  const { candidate } = item;
  const lines: string[] = [];
  lines.push(`# Brief: ${candidate.title}`, "");
  lines.push(`_Status: **${item.status}** · score ${item.score} · generated ${today.toISOString().slice(0, 10)} from ${manifest.label}. Draft only; not published._`, "");
  lines.push(
    table(
      ["Field", "Value"],
      [
        ["Type", candidate.kind === "new" ? "New page" : "Improve existing page"],
        ["Canonical target", `\`/articles/${candidate.slug}\``],
        ["Segment", candidate.segment],
        ["Primary intent", candidate.intent],
        ["Conversion intent", ["", "informational", "comparing", "choosing / applying"][candidate.conversionIntent]],
        ["Effort", ["", "reuse existing model", "extend model or data", "new model or tool"][candidate.effort]],
      ],
    ),
    "",
  );
  lines.push("## Search evidence", "");
  if (item.evidence.impressions === 0) lines.push("No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.");
  else
    lines.push(
      `${fmtInt(item.evidence.impressions)} impressions${item.evidence.previousImpressions !== null ? ` (previous period ${fmtInt(item.evidence.previousImpressions)})` : ""}, ${fmtInt(item.evidence.clicks)} clicks, average position ${fmtPos(item.evidence.position)}${item.evidence.lowVolume ? " (low volume)" : ""}.`,
    );
  if (item.evidence.matchedQueries.length)
    lines.push("", table(["Query", "Impressions", "Position"], item.evidence.matchedQueries.map((query) => [query.query, fmtInt(query.impressions), fmtPos(query.position)])));
  lines.push("");
  lines.push("## Unique angle", "", candidate.angle, "");
  if (item.nearest)
    lines.push(
      `Nearest existing page: [${item.nearest.title}](/articles/${item.nearest.slug}) (similarity ${item.nearest.similarity.toFixed(2)}). ${item.nearest.similarity >= 0.35 ? "The draft must say in its first section how it differs and link to that page." : "Distinct intent."}`,
      "",
    );
  lines.push("## Calculation model", "", `${candidate.calculation.model}: ${candidate.calculation.description}`, "");
  if (candidate.preview) {
    const preview = candidate.preview();
    lines.push(`**${preview.caption}**`, "", table(preview.columns, preview.rows), "");
  }
  lines.push("## Assumptions to state on the page", "", ...(candidate.assumptions.length ? candidate.assumptions : ["Year 2, no welcome bonuses, methodology point values"]).map((line) => `- ${line}`), "");
  lines.push("## Sources to verify before drafting", "");
  lines.push(item.verifiedProducts.length ? `- Verified against issuer pages (quality/issuer-claims.json): ${item.verifiedProducts.map(cardTitle).join(", ")}` : "- No products verified yet");
  if (item.productsToVerify.length) lines.push(`- **Add to quality/issuer-claims.json first:** ${item.productsToVerify.map(cardTitle).join(", ")}`);
  lines.push("- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.", "");
  lines.push("## Internal links", "", ...(candidate.internalLinks.length ? candidate.internalLinks.map((href) => `- [${href.startsWith("/articles/") ? articleTitle(href) : href}](${href})`) : ["- (none planned)"]), "");
  lines.push(
    "## Calls to action",
    "",
    candidate.cta.quiz ? "- Quiz: link `/` from the bottom line." : "- No quiz CTA.",
    ...candidate.cta.cards.map((id) => `- Card review: [/cards/${id}](/cards/${id}); outbound only through \`/go/${id}\``),
    "",
  );
  if (item.reasons.length) lines.push("## Engine notes", "", ...item.reasons.map((reason) => `- ${reason}`), "");
  lines.push(
    "## Definition of done",
    "",
    "- Figures computed in code (wallet or card value model) and pinned in a test",
    "- Issuer claims registered and verified in CI; no invented offers, credits or review dates",
    "- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages",
    "- `npm run qa` passes; the control article is unchanged",
    "- Founder approves the PR",
    "",
  );
  return lines.join("\n");
}

fs.mkdirSync(path.join(outDir, "briefs"), { recursive: true });
const briefed = opportunities.filter((item) => item.status === "brief" || item.status === "needs-facts").slice(0, top);
for (const item of briefed) fs.writeFileSync(path.join(outDir, "briefs", `${item.candidate.id}.md`), brief(item));
fs.writeFileSync(path.join(outDir, "report.md"), weeklyReport());
console.log(`Growth Engine: ${opportunities.length} candidates scored; ${briefed.length} briefs and a weekly report written to ${outDir}`);
for (const item of opportunities) console.log(`  ${item.status.padEnd(11)} ${String(item.score).padStart(3)}  ${item.candidate.id}`);
