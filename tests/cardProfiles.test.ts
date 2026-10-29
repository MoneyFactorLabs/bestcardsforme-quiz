import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cardProfileSpecs } from "@/data/cardProfileSpecs";
import { cards } from "@/data/cards";
import { creditCardProfiles, getCreditCardProfileBySlug } from "@/data/creditCardProfiles";
import { weightedOverall } from "@/lib/cardProfileBuilder";
import { validateCardProfiles } from "@/lib/cardProfileValidation";
import { computeValueModel } from "@/lib/cardValueModel";

describe("card profiles", () => {
  it("pass build-time validation", () => {
    assert.deepEqual(validateCardProfiles(creditCardProfiles, cards), []);
  });

  it("cover every quiz card", () => {
    cards.forEach((card) => assert.ok(getCreditCardProfileBySlug(card.id), card.id));
  });

  it("compute overall scores from the category weights", () => {
    // Citi Double Cash, cash-back weights: 6×.35 + 10×.25 + 2×.05 + 9×.25 + 9×.10 = 7.85 → 7.9
    assert.equal(
      weightedOverall(
        { rewardsValue: 6, feeJustification: 10, travelUtility: 2, everydayUse: 9, beginnerFriendliness: 9 },
        "cashback",
      ),
      7.9,
    );
    assert.equal(getCreditCardProfileBySlug("citi-double-cash")?.moneyFactorScores.overall, 7.9);
  });

  it("keep hand-checked Year-2 values for the priority cards", () => {
    const net = (slug: string) => {
      const spec = cardProfileSpecs.find((item) => item.slug === slug);
      assert.ok(spec?.valueModel, slug);
      return Math.round(computeValueModel({ annualFee: spec.annualFee, ...spec.valueModel }).netValue);
    };

    // Citi Double Cash: 24,000 × 2% = $480, no fee.
    assert.equal(net("citi-double-cash"), 480);
    // United Explorer: miles (2,000+3,000+500)×2 + 14,500 = 25,500 × 1.2¢ = $306;
    // credits 360 + 59 + 40 + 36 + 12.5 + 75 = $582.50; net = 306 + 582.5 − 150 = $738.50.
    assert.equal(net("united-explorer"), 739);
    // Ink Business Preferred: 17,400 × 3 + 20,000 = 72,200 pts × 1.6¢ = $1,155.20 − $95 = $1,060.20.
    assert.equal(net("ink-business-preferred"), 1060);
  });

  it("withhold the score of the discontinued Bilt Mastercard", () => {
    assert.equal(getCreditCardProfileBySlug("bilt-mastercard")?.scoreStatus, "withheld");
    assert.equal(cards.find((card) => card.id === "bilt-mastercard")?.availability, "discontinued");
  });
});
