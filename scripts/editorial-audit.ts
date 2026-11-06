// Read-only editorial inventory and internal-link audit.
// Usage: npm run audit:editorial [-- --gsc path/to/pages.csv] [-- --out report.md] [-- --stale-days N]
//
// Errors (exit 1): duplicate slugs, titles, meta descriptions, or SEO titles; links
// from articles to /articles/ or /cards/ pages that do not exist.
// Warnings (reported, exit 0): orphan articles (no contextual link from another
// article or card profile), articles not reviewed within --stale-days (default
// 180), articles with no entry in the issuer claim registry, and, when a GSC
// export is supplied, pages whose impressions fell 30% or more period over period.
//
// The optional GSC CSV needs a header row with: page, impressions,
// previous_impressions (clicks / previous_clicks optional). Export from Search
// Console or Windsor.ai; nothing here calls an external API.
import fs from "node:fs";
import path from "node:path";
import { articles } from "@/data/articles";
import { cards } from "@/data/cards";
import { creditCardProfiles } from "@/data/creditCardProfiles";
import { articleInternalLinkMap } from "@/lib/articleInternalLinks";

const args = process.argv.slice(2);
const option = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const staleDays = Number(option("--stale-days")) || 180;
const today = new Date();

const articleSlugs = new Set(articles.map((article) => article.slug));
const cardSlugs = new Set([...cards.map((card) => card.id), ...creditCardProfiles.map((profile) => profile.slug)]);
const errors: string[] = [];
const warnings: string[] = [];

function duplicates(label: string, values: [string, string | undefined][]) {
  const seen = new Map<string, string>();
  for (const [slug, value] of values) {
    if (!value) continue;
    const key = value.trim().toLowerCase();
    if (seen.has(key)) errors.push(`Duplicate ${label}: "${value}" on ${seen.get(key)} and ${slug}`);
    else seen.set(key, slug);
  }
}

duplicates("slug", articles.map((article) => [article.slug, article.slug]));
duplicates("title", articles.map((article) => [article.slug, article.title]));
duplicates("meta description", articles.map((article) => [article.slug, article.metaDescription]));

// Contextual links: in-text links, related articles, decision paths, and card profile pages.
const incoming = new Map<string, Set<string>>(articles.map((article) => [article.slug, new Set()]));
const link = (from: string, to: string) => incoming.get(to)?.add(from);

for (const article of articles) {
  const text = JSON.stringify(article);
  for (const [, slug] of text.matchAll(/\/articles\/([a-z0-9-]+)/g)) {
    if (!articleSlugs.has(slug)) errors.push(`${article.slug}: links to missing article /articles/${slug}`);
    else if (slug !== article.slug) link(article.slug, slug);
  }
  for (const [, slug] of text.matchAll(/\/(?:cards|go)\/([a-z0-9-]+)/g)) {
    if (!cardSlugs.has(slug)) errors.push(`${article.slug}: links to missing card /cards/${slug}`);
  }
  for (const related of article.relatedArticles ?? []) {
    if (!related.slug) continue;
    if (!articleSlugs.has(related.slug)) errors.push(`${article.slug}: related article ${related.slug} does not exist`);
    else link(article.slug, related.slug);
  }
  for (const cta of article.cardCtas ?? []) {
    if (!cardSlugs.has(cta.cardId)) errors.push(`${article.slug}: card CTA ${cta.cardId} does not exist`);
  }
}
for (const [from, links] of Object.entries(articleInternalLinkMap)) {
  for (const target of links) {
    if (!articleSlugs.has(target.slug)) errors.push(`Decision path from ${from} points to missing ${target.slug}`);
    else link(from, target.slug);
  }
}
for (const profile of creditCardProfiles) {
  for (const slug of profile.relatedArticleSlugs) {
    if (!articleSlugs.has(slug)) errors.push(`/cards/${profile.slug}: related article ${slug} does not exist`);
    else link(`/cards/${profile.slug}`, slug);
  }
}

const claimsFile = path.join(process.cwd(), "quality/issuer-claims.json");
const claimRegistry: Record<string, { usedIn: string[] }> = fs.existsSync(claimsFile)
  ? JSON.parse(fs.readFileSync(claimsFile, "utf8")).products
  : {};
const sourcedArticles = new Set(Object.values(claimRegistry).flatMap((product) => product.usedIn));

const rows = articles.map((article) => {
  const ageDays = Math.floor((today.getTime() - new Date(article.updatedAt).getTime()) / 86400000);
  const inbound = incoming.get(article.slug)?.size ?? 0;
  if (inbound === 0) warnings.push(`Orphan: ${article.slug} has no contextual links from other articles or card pages`);
  if (ageDays > staleDays) warnings.push(`Stale: ${article.slug} last reviewed ${article.updatedAt} (${ageDays} days ago)`);
  const sourced = sourcedArticles.has(article.slug);
  return { article, ageDays, inbound, sourced };
});
const unsourced = rows.filter((row) => !row.sourced).length;
if (unsourced > 0) warnings.push(`${unsourced} of ${articles.length} articles have no issuer terms in quality/issuer-claims.json (fees are still checked for quiz cards)`);

// Optional Search Console traction check from an exported CSV.
let gscSection = "Search Console data: not connected (pass `--gsc <export.csv>` to flag pages losing impressions).";
const gscPath = option("--gsc");
if (gscPath) {
  const [header, ...lines] = fs.readFileSync(gscPath, "utf8").trim().split(/\r?\n/);
  const columns = header.split(",").map((name) => name.trim().toLowerCase());
  const index = (name: string) => columns.indexOf(name);
  const losing: string[] = [];
  for (const line of lines) {
    const cells = line.split(",");
    const page = cells[index("page")];
    const now = Number(cells[index("impressions")]);
    const before = Number(cells[index("previous_impressions")]);
    if (before >= 20 && now <= before * 0.7) {
      losing.push(`${page}: ${before} → ${now} impressions (${Math.round((1 - now / before) * 100)}% down)`);
    }
  }
  losing.forEach((entry) => warnings.push(`Losing traction: ${entry}`));
  gscSection = `Search Console data: ${lines.length} pages from ${path.basename(gscPath)}; ${losing.length} lost 30%+ of impressions.`;
}

const report = [
  `# Editorial audit (${today.toISOString().slice(0, 10)})`,
  "",
  `${articles.length} articles · ${errors.length} errors · ${warnings.length} warnings · stale after ${staleDays} days`,
  "",
  gscSection,
  "",
  "## Errors",
  ...(errors.length ? errors.map((entry) => `- ${entry}`) : ["- None"]),
  "",
  "## Warnings",
  ...(warnings.length ? warnings.map((entry) => `- ${entry}`) : ["- None"]),
  "",
  "## Inventory",
  "",
  "| Article | Category | Reviewed | Inbound links | Issuer claims registered |",
  "|---|---|---|---|---|",
  ...rows
    .sort((a, b) => a.inbound - b.inbound)
    .map(
      ({ article, inbound, sourced }) =>
        `| [${article.title}](/articles/${article.slug}) | ${article.category} | ${article.updatedAt} | ${inbound} | ${sourced ? "yes" : "no"} |`,
    ),
  "",
].join("\n");

const out = option("--out");
if (out) fs.writeFileSync(out, report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
console.log(report);
if (errors.length > 0) process.exit(1);
