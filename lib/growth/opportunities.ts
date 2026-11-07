import type { Candidate } from "@/data/growth/candidates";
import { type GscDataset, type GscMetrics, isLowVolume, LOW_VOLUME_IMPRESSIONS } from "@/lib/growth/gsc";
import type { EditorialArticle } from "@/types/article";

// Scores content candidates against Search Console evidence and the existing
// article inventory. Every point in the score comes from a named component so
// an editor can see why one brief outranks another. No keyword volumes or
// ranking forecasts are invented: evidence is observed impressions only.

export type Status =
  | "brief" // ready to brief
  | "hold" // recently rewritten; wait for Google to recrawl
  | "protected" // control page; never edited
  | "duplicate" // would cannibalize an existing page
  | "needs-facts"; // briefable, but issuer terms must be registered first

export type ScoreParts = {
  evidence: number;
  headroom: number;
  differentiation: number;
  conversion: number;
  segment: number;
  effort: number;
  overlap: number;
};

export type Opportunity = {
  candidate: Candidate;
  status: Status;
  score: number;
  parts: ScoreParts;
  evidence: {
    impressions: number;
    previousImpressions: number | null;
    clicks: number;
    position: number | null;
    matchedQueries: { query: string; impressions: number; position: number | null }[];
    lowVolume: boolean;
  };
  nearest: { slug: string; title: string; similarity: number } | null;
  verifiedProducts: string[];
  productsToVerify: string[];
  reasons: string[];
};

export type ScoringContext = {
  articles: EditorialArticle[];
  // Products whose terms are checked against issuer pages (quality/issuer-claims.json).
  verifiedProducts: Set<string>;
  // Products with only a registered fee check (quality/issuer-sources.json).
  feeOnlyProducts: Set<string>;
  protectedSlugs: Set<string>;
  today: Date;
  // Improve candidates rewritten more recently than this are held for recrawl.
  recrawlDays?: number;
};

// Similarity at or above this is a duplicate intent; between REVIEW and it, a warning.
export const DUPLICATE_SIMILARITY = 0.5;
export const REVIEW_SIMILARITY = 0.35;

const STOPWORDS = new Set(
  "a an the and or for of to in on with by is it its it's at as be are your you my i me we our vs versus which what when how do does should 2026 2025 card cards credit best worth year".split(
    " ",
  ),
);

export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$ ]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    .map((word) => (word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word));
}

function vector(text: string) {
  const counts = new Map<string, number>();
  for (const word of tokens(text)) counts.set(word, (counts.get(word) ?? 0) + 1);
  return counts;
}

export function similarity(a: string, b: string) {
  const va = vector(a);
  const vb = vector(b);
  let dot = 0;
  for (const [word, count] of va) dot += count * (vb.get(word) ?? 0);
  const norm = (v: Map<string, number>) => Math.sqrt([...v.values()].reduce((sum, count) => sum + count * count, 0));
  return dot === 0 ? 0 : dot / (norm(va) * norm(vb));
}

// Compares what the page is about: title plus primary intent for the
// candidate, title plus meta description for existing articles.
export function nearestArticle(candidate: Candidate, articles: EditorialArticle[]) {
  const subject = `${candidate.title} ${candidate.intent}`;
  return articles
    .filter((article) => article.slug !== candidate.slug)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      similarity: similarity(subject, `${article.title} ${article.metaDescription ?? ""}`),
    }))
    .sort((a, b) => b.similarity - a.similarity)[0] ?? null;
}

function sumMetrics(list: (GscMetrics | null)[]) {
  const present = list.filter((item): item is GscMetrics => item !== null);
  if (present.length === 0) return null;
  const impressions = present.reduce((sum, item) => sum + item.impressions, 0);
  const weighted = present.filter((item) => item.position !== null);
  const weight = weighted.reduce((sum, item) => sum + item.impressions, 0);
  return {
    clicks: present.reduce((sum, item) => sum + item.clicks, 0),
    impressions,
    position: weight ? weighted.reduce((sum, item) => sum + (item.position ?? 0) * item.impressions, 0) / weight : null,
  };
}

export function collectEvidence(candidate: Candidate, data: GscDataset) {
  const patterns = candidate.queryPatterns.map((pattern) => new RegExp(pattern, "i"));
  const queries = data.rows.filter((row) => row.dimension === "query" && patterns.some((pattern) => pattern.test(row.key)));
  const page = candidate.kind === "improve" ? data.rows.find((row) => row.dimension === "page" && row.key === `/articles/${candidate.slug}`) : undefined;
  // A page row already contains its queries' impressions, so use it when present.
  const current = page ? page.current : sumMetrics(queries.map((row) => row.current));
  const previous = page ? page.previous : sumMetrics(queries.map((row) => row.previous));
  return {
    impressions: current?.impressions ?? 0,
    previousImpressions: previous ? previous.impressions : null,
    clicks: current?.clicks ?? 0,
    position: current?.position ?? null,
    matchedQueries: queries
      .map((row) => ({ query: row.key, impressions: row.current?.impressions ?? 0, position: row.current?.position ?? null }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10),
    lowVolume: page ? isLowVolume(page) : (current?.impressions ?? 0) < LOW_VOLUME_IMPRESSIONS,
  };
}

function headroomPoints(position: number | null) {
  if (position === null) return 0;
  if (position <= 3) return 2;
  if (position <= 7) return 6;
  if (position <= 20) return 15; // page one edge and page two: most upside per edit
  if (position <= 50) return 10;
  return 6;
}

export function scoreCandidate(candidate: Candidate, data: GscDataset, context: ScoringContext): Opportunity {
  const evidence = collectEvidence(candidate, data);
  const nearest = candidate.kind === "new" ? nearestArticle(candidate, context.articles) : null;
  const verifiedProducts = candidate.products.filter((id) => context.verifiedProducts.has(id));
  const productsToVerify = candidate.products.filter((id) => !context.verifiedProducts.has(id));
  const coverage = candidate.products.length ? verifiedProducts.length / candidate.products.length : 1;
  const reasons: string[] = [];

  const parts: ScoreParts = {
    // Observed impressions only, log-scaled: 10 → 10, 100 → 20, 1,000 → 30.
    evidence: Math.min(30, Math.round(10 * Math.log10(1 + evidence.impressions))),
    headroom: headroomPoints(evidence.position),
    differentiation: (candidate.calculation.model === "none" ? 0 : 15) + Math.round(10 * coverage),
    conversion: candidate.conversionIntent * 5,
    segment: candidate.segment === "everyday" ? 4 : 10,
    effort: (1 - candidate.effort) * 5,
    overlap: 0,
  };

  let status: Status = "brief";
  if (context.protectedSlugs.has(candidate.slug)) {
    status = "protected";
    reasons.push("Control page: never edited. Support it with inbound links from new adjacent pages.");
  }
  if (candidate.kind === "improve" && status === "brief") {
    const article = context.articles.find((item) => item.slug === candidate.slug);
    if (!article) {
      status = "duplicate";
      reasons.push(`Improve target /articles/${candidate.slug} does not exist.`);
    } else {
      const ageDays = Math.floor((context.today.getTime() - new Date(article.updatedAt).getTime()) / 86400000);
      if (ageDays < (context.recrawlDays ?? 30)) {
        status = "hold";
        reasons.push(`Rewritten ${article.updatedAt} (${ageDays} days ago); wait for Google to recrawl before editing again.`);
      }
    }
  }
  if (candidate.kind === "new") {
    if (context.articles.some((article) => article.slug === candidate.slug)) {
      status = "duplicate";
      reasons.push("Slug already exists.");
    } else if (nearest && nearest.similarity >= DUPLICATE_SIMILARITY) {
      status = "duplicate";
      reasons.push(`Same intent as /articles/${nearest.slug} (similarity ${nearest.similarity.toFixed(2)}); improve that page instead.`);
    } else if (nearest && nearest.similarity >= REVIEW_SIMILARITY) {
      parts.overlap = -10;
      reasons.push(`Partial overlap with /articles/${nearest.slug} (similarity ${nearest.similarity.toFixed(2)}); the brief must state how the angle differs.`);
    }
  }
  if (status === "brief" && productsToVerify.length > 0 && verifiedProducts.length === 0 && candidate.products.length > 0) {
    status = "needs-facts";
  }
  if (productsToVerify.length > 0) {
    const feeOnly = productsToVerify.filter((id) => context.feeOnlyProducts.has(id));
    reasons.push(
      `Register issuer terms before drafting: ${productsToVerify.join(", ")}${feeOnly.length ? ` (fee already checked for ${feeOnly.join(", ")})` : ""}.`,
    );
  }
  if (evidence.impressions === 0) reasons.push("No Search Console evidence yet: a hypothesis to test, not a measured demand.");
  else if (evidence.lowVolume) reasons.push(`Low volume (< ${LOW_VOLUME_IMPRESSIONS} impressions): treat movement as noise.`);

  const score = Object.values(parts).reduce((sum, value) => sum + value, 0);
  return { candidate, status, score, parts, evidence, nearest, verifiedProducts, productsToVerify, reasons };
}

// Briefable statuses rank together by score; the rest follow.
const STATUS_ORDER: Record<Status, number> = { brief: 0, "needs-facts": 0, hold: 1, protected: 2, duplicate: 3 };

export function rankOpportunities(candidates: Candidate[], data: GscDataset, context: ScoringContext) {
  return candidates
    .map((candidate) => scoreCandidate(candidate, data, context))
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.score - a.score);
}
