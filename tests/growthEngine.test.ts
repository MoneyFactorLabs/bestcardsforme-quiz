import assert from "node:assert/strict";
import test from "node:test";
import { articles } from "@/data/articles";
import { type Candidate, candidates } from "@/data/growth/candidates";
import { isLowVolume, mergeDatasets, parseCsv, parseGscExport } from "@/lib/growth/gsc";
import { nearestArticle, rankOpportunities, scoreCandidate, type ScoringContext } from "@/lib/growth/opportunities";

const context: ScoringContext = {
  articles,
  verifiedProducts: new Set(["ink-business-preferred", "capital-one-spark-cash-plus", "amex-platinum"]),
  feeOnlyProducts: new Set(["citi-double-cash"]),
  protectedSlugs: new Set(["best-credit-card-high-income-households-2026"]),
  today: new Date("2026-11-07"),
};

const base: Candidate = {
  id: "test",
  kind: "new",
  slug: "test-page-2026",
  title: "Ink Business Preferred vs Spark Cash Plus for a Growing Agency",
  segment: "business",
  intent: "Which business card should an agency owner hold?",
  queryPatterns: ["spark cash"],
  angle: "",
  calculation: { model: "wallet", description: "" },
  assumptions: [],
  products: ["ink-business-preferred", "capital-one-spark-cash-plus"],
  internalLinks: [],
  cta: { quiz: true, cards: [] },
  conversionIntent: 3,
  effort: 1,
};

test("parses quoted CSV cells, BOMs and CRLF", () => {
  assert.deepEqual(parseCsv('﻿a,"b, c","d ""e"""\r\n1,2,3\r\n'), [
    ["a", "b, c", 'd "e"'],
    ["1", "2", "3"],
  ]);
});

test("reads a Search Console Compare-mode Queries export", () => {
  const data = parseGscExport(
    [
      "Top queries,Last 7 days Clicks,Previous 7 days Clicks,Last 7 days Impressions,Previous 7 days Impressions,Last 7 days CTR,Previous 7 days CTR,Last 7 days Position,Previous 7 days Position",
      "spark cash plus vs ink,2,0,120,40,1.67%,0%,11.2,18.4",
    ].join("\n"),
  );
  assert.equal(data.rows[0].dimension, "query");
  assert.deepEqual(data.rows[0].current, { clicks: 2, impressions: 120, position: 11.2 });
  assert.deepEqual(data.rows[0].previous, { clicks: 0, impressions: 40, position: 18.4 });
  assert.deepEqual(data.notes, []);
});

test("reads single-period Pages exports, strips origins, and merges a previous period", () => {
  const current = parseGscExport("Top pages,Clicks,Impressions,CTR,Position\nhttps://bestcardsforme.com/articles/x/,1,200,0.5%,9.2\n");
  assert.equal(current.rows[0].key, "/articles/x");
  assert.equal(current.rows[0].previous, null);
  assert.match(current.notes[0], /one period only/);
  const previous = parseGscExport("Top pages,Clicks,Impressions,CTR,Position\nhttps://bestcardsforme.com/articles/x,0,80,0%,12\n");
  const merged = mergeDatasets([current], [previous]);
  assert.deepEqual(merged.rows[0].previous, { clicks: 0, impressions: 80, position: 12 });
  assert.deepEqual(merged.notes, []);
});

test("reads long-format exports into the last 7 days vs the 7 before, weighting position by impressions", () => {
  const lines = ["date,page,clicks,impressions,position"];
  for (let day = 1; day <= 14; day += 1) {
    const date = new Date(Date.UTC(2026, 9, 20 + day)).toISOString().slice(0, 10);
    lines.push(`${date},/articles/x,${day > 7 ? 1 : 0},${day > 7 ? 30 : 10},${day > 7 ? 10 : 20}`);
  }
  lines.push("2026-11-03,/articles/x,0,90,20");
  const data = parseGscExport(lines.join("\n"));
  assert.equal(data.currentRange, "2026-10-28..2026-11-03");
  const row = data.rows[0];
  assert.equal(row.current?.impressions, 7 * 30 + 90);
  assert.equal(row.current?.clicks, 7);
  assert.equal(row.current?.position, (210 * 10 + 90 * 20) / 300);
  assert.equal(row.previous?.impressions, 70);
});

test("rejects an unknown export layout instead of guessing", () => {
  assert.throws(() => parseGscExport("foo,bar\n1,2\n"), /Unrecognized Search Console export/);
});

test("flags low volume only when both periods are under 20 impressions", () => {
  assert.equal(isLowVolume({ dimension: "query", key: "q", current: { clicks: 0, impressions: 12, position: 30 }, previous: null }), true);
  assert.equal(isLowVolume({ dimension: "query", key: "q", current: { clicks: 0, impressions: 25, position: 30 }, previous: null }), false);
});

test("score components are transparent and evidence comes only from matched rows", () => {
  const data = parseGscExport("Top queries,Clicks,Impressions,CTR,Position\nspark cash plus,1,99,1%,15\nunrelated query,0,500,0%,5\n");
  const result = scoreCandidate(base, data, context);
  assert.equal(result.evidence.impressions, 99);
  assert.deepEqual(result.parts, { evidence: 20, headroom: 15, differentiation: 25, conversion: 15, segment: 10, effort: 0, overlap: result.parts.overlap });
  assert.equal(result.score, Object.values(result.parts).reduce((sum, value) => sum + value, 0));
});

test("no evidence is reported as a hypothesis, never as demand", () => {
  const result = scoreCandidate(base, { rows: [], notes: [] }, context);
  assert.equal(result.parts.evidence, 0);
  assert.ok(result.reasons.some((reason) => reason.includes("hypothesis")));
});

test("guards: duplicate intent, protected control page, recently rewritten page, unregistered facts", () => {
  const empty = { rows: [], notes: [] };
  const byId = Object.fromEntries(rankOpportunities(candidates, empty, context).map((item) => [item.candidate.id, item]));
  assert.equal(byId["platinum-occasional-travelers"].status, "duplicate");
  assert.equal(byId["best-card-to-pair-with-reserve"].status, "duplicate");
  assert.equal(byId["support-high-income-control"].status, "protected");
  assert.equal(byId["improve-dining"].status, "hold");
  assert.equal(scoreCandidate({ ...base, products: ["citi-double-cash"] }, empty, context).status, "needs-facts");
  assert.equal(scoreCandidate({ ...base, slug: articles[0].slug }, empty, context).status, "duplicate");
});

test("every catalog candidate is well formed and links only to real pages", () => {
  const slugs = new Set(articles.map((article) => article.slug));
  const ids = new Set<string>();
  for (const candidate of candidates) {
    assert.ok(!ids.has(candidate.id), `duplicate id ${candidate.id}`);
    ids.add(candidate.id);
    if (candidate.kind === "improve") assert.ok(slugs.has(candidate.slug), `${candidate.id} improves a missing page`);
    for (const href of candidate.internalLinks.filter((link) => link.startsWith("/articles/"))) {
      assert.ok(slugs.has(href.slice("/articles/".length)), `${candidate.id} links to missing ${href}`);
    }
    candidate.queryPatterns.forEach((pattern) => new RegExp(pattern));
    if (candidate.preview) assert.ok(candidate.preview().rows.length > 0);
  }
});

test("the real catalog yields at least 10 briefable, non-duplicate opportunities", () => {
  const ranked = rankOpportunities(candidates, { rows: [], notes: [] }, context);
  const briefable = ranked.filter((item) => item.status === "brief" || item.status === "needs-facts");
  assert.ok(briefable.length >= 10, `only ${briefable.length} briefable`);
  for (const item of briefable.filter((entry) => entry.candidate.kind === "new")) {
    assert.ok((nearestArticle(item.candidate, articles)?.similarity ?? 0) < 0.5, item.candidate.id);
  }
});
