import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getArticleBySlug } from "@/data/articles";
import { BASELINE_CASH_BACK_RATE, pointValuations } from "@/lib/cardValueModel";

// Recomputes every number in the dining decision matrix from the published
// point valuations, so the article cannot drift from the methodology.
const article = getArticleBySlug("best-credit-card-for-dining-restaurants-2026");
assert.ok(article, "dining article exists");

const effective = {
  savor: { fee: 0, rate: 3 * pointValuations.cash.centsPerPoint },
  sapphirePreferred: { fee: 95, rate: 3 * pointValuations.chaseUltimateRewards.centsPerPoint },
  strataPremier: { fee: 95, rate: 3 * pointValuations.citiThankYou.centsPerPoint },
  amexGold: { fee: 325, rate: 4 * pointValuations.amexMembershipRewards.centsPerPoint },
  sapphireReserve: { fee: 795, rate: 3 * pointValuations.chaseUltimateRewards.centsPerPoint },
};
type CardKey = keyof typeof effective;

// Year-2 value above a $0, 2% flat card for the same dining spend.
const aboveBaseline = (card: CardKey, spend: number) =>
  Math.round((spend * (effective[card].rate - BASELINE_CASH_BACK_RATE)) / 100 - effective[card].fee);
const breakEven = (card: CardKey) =>
  Math.round(effective[card].fee / ((effective[card].rate - BASELINE_CASH_BACK_RATE) / 100));
const groceryLift = aboveBaseline("amexGold", 6000) + effective.amexGold.fee; // $6,000 U.S. supermarkets at 4x, fee already counted

const signed = (value: number) => `${value < 0 ? "−" : "+"}$${Math.abs(value).toLocaleString("en-US")}`;
const dollars = (value: number) => `$${value.toLocaleString("en-US")}`;

const section = (heading: string) => {
  const found = article.sections.find((item) => item.heading === heading);
  assert.ok(found, heading);
  return found;
};
const text = JSON.stringify(article);

describe("dining decision matrix", () => {
  it("matches independently calculated example values", () => {
    // Hand-worked: Sapphire Preferred at $10,000 dining = 10,000 × (4.8% − 2%) − $95 = $185.
    assert.equal(aboveBaseline("sapphirePreferred", 10000), 185);
    // Amex Gold at $5,000 dining = 5,000 × (6.8% − 2%) − $325 = −$85.
    assert.equal(aboveBaseline("amexGold", 5000), -85);
    // Amex Gold break-even = $325 / 4.8% = $6,770.83.
    assert.equal(breakEven("amexGold"), 6771);
  });

  it("prints the computed value in every matrix cell", () => {
    const rows = section("The dining decision matrix").table?.rows;
    assert.ok(rows);
    const tiers = [2400, 5000, 10000];

    rows.forEach((row, index) => {
      const spend = tiers[index];
      assert.ok(row[0].includes(`$${spend.toLocaleString("en-US")}/yr`), row[0]);
      assert.equal(row[1], signed(aboveBaseline("savor", spend)));
      assert.equal(row[2], signed(aboveBaseline("sapphirePreferred", spend)));
      assert.ok(row[3].startsWith(`${signed(aboveBaseline("amexGold", spend))} dining only`), row[3]);
      assert.ok(row[3].includes(signed(aboveBaseline("amexGold", spend) + groceryLift)), row[3]);
      assert.equal(row[4], signed(aboveBaseline("sapphireReserve", spend)));
    });
  });

  it("prints the computed break-even for every card", () => {
    const rows = section("How the matrix is calculated").table?.rows;
    assert.ok(rows);
    const byCard: Record<string, CardKey> = {
      "Chase Sapphire Preferred": "sapphirePreferred",
      "Citi Strata Premier": "strataPremier",
      "Amex Gold": "amexGold",
      "Chase Sapphire Reserve": "sapphireReserve",
    };

    Object.entries(byCard).forEach(([name, card]) => {
      const row = rows.find((item) => item[0].includes(name));
      assert.ok(row, name);
      assert.ok(row[3].startsWith(`${effective[card].rate.toFixed(1)}%`), `${name} effective rate`);
      assert.ok(row[4].startsWith(`${dollars(breakEven(card))}/yr`), `${name} break-even: ${row[4]}`);
    });
  });

  it("keeps the monthly thresholds in the intro and FAQs consistent", () => {
    const monthly = (card: CardKey) => Math.round(breakEven(card) / 12);

    assert.equal(monthly("sapphirePreferred"), 283);
    assert.equal(monthly("amexGold"), 564);
    assert.ok(article.dek.includes(`$${monthly("sapphirePreferred")} a month`));
    assert.ok(article.dek.includes(`$${monthly("amexGold")} a month`));
    // Cash-out at 1¢: 3% − 2% = 1%, so $95 / 1% = $9,500.
    assert.ok(text.includes(`$${(95 / 0.01).toLocaleString("en-US")} a year of dining just to tie`));
    // Each $50 of used credits lowers Gold's break-even by 50 / 4.8% ≈ $1,040.
    assert.ok(text.includes(`about $${(Math.round(50 / 0.048 / 10) * 10).toLocaleString("en-US")}`));
  });
});
