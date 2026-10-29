import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildValueAnalysis, computeValueModel } from "@/lib/cardValueModel";

// Expected values below are worked by hand, not produced by the model.
describe("computeValueModel", () => {
  it("treats a $0, 2% flat card as the baseline", () => {
    const result = computeValueModel({
      annualFee: 0,
      currency: "cash",
      spend: [{ category: "All purchases", annualSpend: 24000, earnRate: 2 }],
      credits: [],
    });

    // 24,000 × 2% = 480, identical to the baseline.
    assert.equal(result.rewardsValue, 480);
    assert.equal(result.baselineValue, 480);
    assert.equal(result.vsBaseline, 0);
    assert.equal(result.isBaselineCard, true);
  });

  it("values transferable points and solves bonus-spend break-even", () => {
    const result = computeValueModel({
      annualFee: 95,
      currency: "chaseUltimateRewards",
      spend: [
        { category: "Dining", annualSpend: 10000, earnRate: 3 },
        { category: "Everything else", annualSpend: 10000, earnRate: 1 },
      ],
      credits: [],
    });

    // Rewards: 10,000 × 3 × 1.6¢ = $480; 10,000 × 1 × 1.6¢ = $160.
    assert.equal(Math.round(result.rewardsValue), 640);
    assert.equal(Math.round(result.netValue), 545);
    assert.equal(result.baselineValue, 400);
    assert.equal(Math.round(result.vsBaseline), 145);
    // Bonus margin 4.8% − 2% = 2.8%; non-bonus drag 10,000 × (1.6% − 2%) = −$40.
    // Break-even bonus spend = (95 + 40) / 0.028 = $4,821.43.
    assert.ok(result.bonusSpendBreakEven !== null);
    assert.ok(Math.abs(result.bonusSpendBreakEven - 4821.43) < 0.01);
  });

  it("friction-adjusts credits and reports the credits needed to tie the baseline", () => {
    const result = computeValueModel({
      annualFee: 150,
      currency: "unitedMiles",
      spend: [{ category: "Everything else", annualSpend: 10000, earnRate: 1 }],
      credits: [{ name: "Credit", faceValue: 100, captureRate: 0.4 }],
    });

    // Rewards 10,000 × 1.2¢ = $120; credits 100 × 0.4 = $40; net = 120 + 40 − 150 = $10.
    assert.equal(Math.round(result.rewardsValue), 120);
    assert.equal(result.creditsCaptured, 40);
    assert.equal(Math.round(result.netValue), 10);
    // Credits needed to tie a 2% card: 200 − 120 + 150 = $230.
    assert.equal(Math.round(result.creditsNeededToMatchBaseline), 230);
  });

  it("returns no break-even when no category beats 2%", () => {
    const result = computeValueModel({
      annualFee: 0,
      currency: "cash",
      spend: [{ category: "Everything else", annualSpend: 10000, earnRate: 1.5 }],
      credits: [],
    });

    assert.equal(result.bonusSpendBreakEven, null);
    assert.equal(result.vsBaseline, -50);
  });
});

describe("buildValueAnalysis", () => {
  it("reports gross value and emphasizes the comparison rows", () => {
    const analysis = buildValueAnalysis({
      annualFee: 95,
      currency: "cash",
      spend: [{ category: "Groceries", annualSpend: 6000, earnRate: 6 }],
      credits: [],
    });

    assert.equal(analysis.grossAnnualValue, 360);
    assert.deepEqual(
      analysis.lines.filter((line) => line.emphasis).map((line) => line.label.split(" ")[0]),
      ["Year-2", "$0,", "Difference"],
    );
  });
});
