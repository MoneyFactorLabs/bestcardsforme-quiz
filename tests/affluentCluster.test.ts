import assert from "node:assert/strict";
import test from "node:test";
import { articles } from "@/data/articles";
import {
  bestStrategyWallet,
  businessResult,
  holdingBoth,
  ladderResults,
  platinumBreakEvenCredits,
  rankSecondCards,
} from "@/data/articlesAffluentCluster";
import { cardsFor, profileSpend, walletCards } from "@/data/walletScenarios";
import { incrementalValue, walletValue } from "@/lib/walletModel";

const CASH_OUT = { chaseUltimateRewards: 1, amexMembershipRewards: 1, capitalOneMiles: 1 };
const round = (value: number) => Math.round(value);

test("wallet model routes each dollar to the best card and respects caps", () => {
  const result = walletValue([walletCards.amexGold, walletCards.doubleCash], { groceries: 30000, other: 10000 });
  // $25,000 of groceries at 4x MR (1.7¢) = $1,700; $5,000 over the cap goes to the 2% card = $100; other $10,000 at 2% = $200.
  assert.equal(round(result.rewards), 2000);
  assert.equal(result.fees, 325);
});

test("overlapping perks count once per wallet", () => {
  const cards = cardsFor("travel");
  const both = walletValue([cards.sapphireReserve, cards.amexPlatinum], {});
  const reserveCredits = walletValue([cards.sapphireReserve], {}).credits;
  const platinumCredits = walletValue([cards.amexPlatinum], {}).credits;
  // Lounge access ($350 in this profile) is in both cards' credits but counted once together.
  assert.equal(round(both.credits), round(reserveCredits + platinumCredits - 350));
});

test("Spark Cash Plus fee is refunded only when $150,000 lands on the card", () => {
  assert.equal(walletValue([walletCards.sparkCashPlus], { other: 150000 }).fees, 0);
  assert.equal(walletValue([walletCards.sparkCashPlus], { other: 149999 }).fees, 150);
});

test("200k-400k strategy: headline results match the published worked examples", () => {
  assert.equal(bestStrategyWallet("home").wallet.label, "Amex Gold + Citi Double Cash");
  assert.equal(round(bestStrategyWallet("home").result.net), 2634);
  assert.equal(bestStrategyWallet("travel").wallet.label, "Amex Platinum + Amex Gold + Double Cash");
  assert.equal(round(bestStrategyWallet("travel").result.net), 6094);
  // Example 1 comparison wallet: Reserve + Freedom Unlimited, home-centered.
  const c = cardsFor("home");
  assert.equal(round(walletValue([c.sapphireReserve, c.freedomUnlimited], profileSpend("home")).net), 1751);
  // Example 2 claim: without the $600 hotel credit the Platinum wallet falls behind the Reserve + Gold wallet.
  const t = cardsFor("travel");
  const noHotel = { ...t.amexPlatinum, credits: t.amexPlatinum.credits.filter((credit) => !credit.name.includes("FHR")) };
  const platinumWithoutHotel = walletValue([noHotel, t.amexGold, t.doubleCash], profileSpend("travel")).net;
  const reserveGold = walletValue([t.sapphireReserve, t.freedomUnlimited, t.amexGold], profileSpend("travel")).net;
  assert.ok(platinumWithoutHotel < reserveGold);
});

test("second card: Gold leads when points are transferred, a 2% card leads at cash-out", () => {
  assert.equal(rankSecondCards("reserve", "balanced")[0].candidate.label, "Amex Gold");
  assert.equal(round(rankSecondCards("reserve", "balanced")[0].gain), 969);
  assert.equal(rankSecondCards("platinum", "balanced")[0].candidate.label, "Amex Gold");
  assert.equal(round(rankSecondCards("platinum", "balanced")[0].gain), 1375);
  const reserveCash = rankSecondCards("reserve", "balanced", CASH_OUT);
  const platinumCash = rankSecondCards("platinum", "balanced", CASH_OUT);
  assert.equal(reserveCash[0].candidate.label, "Citi Double Cash");
  assert.equal(platinumCash[0].candidate.label, "Citi Double Cash");
  // The dek says Venture X is close behind in both cash-out rankings.
  assert.equal(reserveCash[1].candidate.label, "Capital One Venture X");
  assert.equal(platinumCash[1].candidate.label, "Capital One Venture X");
});

test("incremental value equals the change in the whole wallet", () => {
  const c = cardsFor("balanced");
  const spend = profileSpend("balanced");
  const gain = incrementalValue([c.sapphireReserve], [c.amexGold], spend);
  assert.equal(round(gain), round(walletValue([c.sapphireReserve, c.amexGold], spend).net - walletValue([c.sapphireReserve], spend).net));
});

test("fee stacking: second premium card helps travelers, hurts the home-centered household", () => {
  assert.deepEqual(
    { home: round(holdingBoth.gain.home), balanced: round(holdingBoth.gain.balanced), travel: round(holdingBoth.gain.travel) },
    { home: -307, balanced: 508, travel: 1203 },
  );
  // A third card (Amex Gold) pays in every profile.
  for (const id of ["home", "balanced", "travel"] as const) assert.ok((ladderResults(id)[2].marginal ?? 0) > 0);
  // Break-even credits: travel needs fewer credits than home because more flight spend earns 5x.
  assert.ok(platinumBreakEvenCredits("travel") < platinumBreakEvenCredits("home"));
  assert.equal(round(platinumBreakEvenCredits("home")), 832);
});

test("high-spend LLC: pairing Ink and Spark beats either card alone", () => {
  for (const profile of [0, 1]) {
    assert.ok(businessResult(profile, 2).net > businessResult(profile, 0).net);
    assert.ok(businessResult(profile, 2).net > businessResult(profile, 1).net);
  }
  assert.equal(round(businessResult(0, 2).net), 5435);
  assert.equal(businessResult(0, 2).fees, 245);
  assert.equal(round(businessResult(1, 2).net), 12105);
  // At 1¢ per point, Ink alone falls below Spark alone (published sensitivity).
  assert.ok(businessResult(0, 0, CASH_OUT).net < businessResult(0, 1, CASH_OUT).net);
});

test("cluster articles are registered, unique, and link only to real articles", () => {
  const slugs = new Set(articles.map((article) => article.slug));
  assert.equal(slugs.size, articles.length);
  const titles = new Set(articles.map((article) => article.title));
  assert.equal(titles.size, articles.length);
  for (const slug of [
    "credit-card-strategy-200k-400k-household-income-2026",
    "best-second-credit-card-for-premium-card-owners-2026",
    "multiple-premium-credit-cards-vs-one-2026",
  ]) {
    const article = articles.find((candidate) => candidate.slug === slug);
    assert.ok(article, slug);
    const text = JSON.stringify(article);
    for (const [, linked] of text.matchAll(/\/articles\/([a-z0-9-]+)/g)) assert.ok(slugs.has(linked), `${slug} links to missing ${linked}`);
    for (const related of article.relatedArticles ?? []) assert.ok(slugs.has(related.slug ?? ""), `${slug} related ${related.slug}`);
    assert.ok(text.includes("](/)"), `${slug} has a quiz link`);
    assert.ok((article.metaDescription ?? "").length <= 160, `${slug} meta description length`);
  }
});
