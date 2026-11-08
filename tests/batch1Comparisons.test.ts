import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { articles } from "@/data/articles";
import {
  articleBatch1Comparisons,
  inkBreakEvenBonusSpend,
  ownerNet,
  reserveTravelCrossover,
  ventureXVsPlatinum,
} from "@/data/articlesBatch1Comparisons";
import { computeBreakEven, parseInputs, presets, type FieldName } from "@/lib/feeBreakEven";
import { walletCards } from "@/data/walletScenarios";

const CASH_OUT = { chaseUltimateRewards: 1, amexMembershipRewards: 1, capitalOneMiles: 1 };
const round = (value: number) => Math.round(value);
const CALCULATOR = "/tools/annual-fee-break-even-calculator";

test("Venture X vs Platinum: published Year-2 nets and credit break-evens", () => {
  const nets = Object.fromEntries(Object.entries(ventureXVsPlatinum).map(([id, r]) => [id, [round(r.vx), round(r.plat), round(r.both), round(r.needed)]]));
  assert.deepEqual(nets, {
    home: [1855, 1225, 1656, 1155],
    balanced: [2645, 2844, 3477, 1015],
    travel: [3475, 4809, 5542, 260],
  });
});

test("Ink vs Spark: 3x-category spend where Ink alone pulls ahead", () => {
  assert.equal(inkBreakEvenBonusSpend(100000), 11000);
  assert.equal(inkBreakEvenBonusSpend(200000), 28000);
  // Cashing points out at 1¢ moves the break-even far up.
  assert.equal(inkBreakEvenBonusSpend(200000, CASH_OUT), 105000);
});

test("Gold vs Reserve: Reserve overtakes Gold near $19,200 of direct travel", () => {
  assert.equal(reserveTravelCrossover(), 19200);
});

test("personal vs business: adding Ink helps at every spend, Spark only at cash-out", () => {
  const gain = (wallet: number, biz: number, valuation = {}) => round(ownerNet(wallet, biz, valuation).net - ownerNet(0, biz, valuation).net);
  assert.equal(gain(1, 0), 145);
  assert.equal(gain(1, 1), 625);
  assert.equal(gain(2, 0), -150);
  assert.equal(gain(2, 1, CASH_OUT), 545);
});

const raw = (overrides: Partial<Record<FieldName, string>> = {}): Record<FieldName, string> => ({
  annualFee: "325",
  bonusSpend: "12000",
  bonusRate: "4",
  otherSpend: "0",
  otherRate: "1",
  centsPerPoint: "1.7",
  creditsUsed: "0",
  ...overrides,
});

test("calculator: hand-checked Amex Gold example", () => {
  const { inputs } = parseInputs(raw());
  assert.ok(inputs);
  const result = computeBreakEven(inputs);
  // $12,000 × 4 × 1.7¢ = $816; minus $325 = $491; a 2% card earns $240 on the same spend.
  assert.equal(round(result.rewards), 816);
  assert.equal(round(result.net), 491);
  assert.equal(round(result.baseline), 240);
  assert.equal(round(result.vsBaseline), 251);
  assert.equal(result.verdict, "beats-baseline");
  assert.equal(result.creditsToBreakEven, 0);
  // Tie point: $325 / (6.8% − 2%) = $6,771.
  assert.equal(round(result.bonusSpendToBreakEven ?? -1), 6771);
});

test("calculator: credits needed and tie points behave at the edges", () => {
  const below = computeBreakEven(parseInputs(raw({ bonusSpend: "3000" })).inputs!);
  assert.equal(below.verdict, "below-baseline");
  // Baseline $60 − rewards $204 + fee $325 = $181 of credits to tie.
  assert.equal(round(below.creditsToBreakEven), 181);

  // A bonus rate that does not beat 2% can never break even on spend.
  const flat = computeBreakEven(parseInputs(raw({ bonusRate: "1", centsPerPoint: "1" })).inputs!);
  assert.equal(flat.bonusSpendToBreakEven, null);

  // Credits that already exceed the fee: any bonus spend is a gain.
  const covered = computeBreakEven(parseInputs(raw({ creditsUsed: "400", bonusSpend: "0" })).inputs!);
  assert.equal(covered.bonusSpendToBreakEven, 0);
  assert.equal(covered.verdict, "beats-baseline");

  // Exactly at the tie point the verdict is a tie.
  const tie = computeBreakEven(parseInputs(raw({ bonusSpend: "6770.8333" })).inputs!);
  assert.equal(tie.verdict, "ties-baseline");

  // A $0 fee 2% card is the baseline itself.
  const baseline = computeBreakEven(parseInputs(raw({ annualFee: "0", bonusRate: "2", centsPerPoint: "1" })).inputs!);
  assert.equal(baseline.verdict, "ties-baseline");
});

test("calculator: validation rejects blank, non-numeric and out-of-range values", () => {
  assert.match(parseInputs(raw({ annualFee: "" })).errors.annualFee ?? "", /required/);
  assert.match(parseInputs(raw({ bonusSpend: "abc" })).errors.bonusSpend ?? "", /must be a number/);
  assert.match(parseInputs(raw({ annualFee: "-5" })).errors.annualFee ?? "", /between/);
  assert.match(parseInputs(raw({ centsPerPoint: "9" })).errors.centsPerPoint ?? "", /between/);
  assert.match(parseInputs(raw({ otherSpend: "Infinity" })).errors.otherSpend ?? "", /must be a number/);
  assert.equal(parseInputs(raw({ bonusSpend: "abc" })).inputs, undefined);
  // Formatting characters are accepted.
  assert.equal(parseInputs(raw({ bonusSpend: "$12,000", annualFee: " 325 " })).inputs?.bonusSpend, 12000);
});

test("calculator presets use the verified wallet-model fees", () => {
  const fee = (id: string) => presets.find((preset) => preset.id === id)?.values.annualFee;
  assert.equal(fee("amex-gold"), walletCards.amexGold.annualFee);
  assert.equal(fee("chase-sapphire-reserve"), walletCards.sapphireReserve.annualFee);
  assert.equal(fee("amex-platinum"), walletCards.amexPlatinum.annualFee);
  assert.equal(fee("capital-one-venture-x"), walletCards.ventureX.annualFee);
  assert.equal(fee("ink-business-preferred"), walletCards.inkPreferred.annualFee);
});

test("batch 1 articles: registered, unique, linked, and within metadata limits", () => {
  const slugs = new Set(articles.map((article) => article.slug));
  assert.equal(slugs.size, articles.length);
  assert.equal(new Set(articles.map((article) => article.title)).size, articles.length);
  assert.equal(articleBatch1Comparisons.length, 4);
  for (const article of articleBatch1Comparisons) {
    assert.ok(slugs.has(article.slug), article.slug);
    const text = JSON.stringify(article);
    for (const [, linked] of text.matchAll(/\/articles\/([a-z0-9-]+)/g)) assert.ok(slugs.has(linked), `${article.slug} links to missing ${linked}`);
    for (const related of article.relatedArticles ?? []) assert.ok(slugs.has(related.slug ?? ""), `${article.slug} related ${related.slug}`);
    assert.ok(text.includes("](/)"), `${article.slug} has a quiz link`);
    assert.ok(text.includes(CALCULATOR), `${article.slug} links to the calculator`);
    assert.ok(text.includes("/affiliate-disclosure"), `${article.slug} links to the disclosure`);
    assert.ok((article.metaDescription ?? "").length <= 160, `${article.slug} meta description length`);
  }
});

test("calculator route is in the sitemap", () => {
  assert.ok(readFileSync("app/sitemap.ts", "utf8").includes(`"${CALCULATOR}"`));
});
