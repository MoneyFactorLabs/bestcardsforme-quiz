import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cards } from "@/data/cards";
import { quizQuestions as questions } from "@/data/questions";
import { getPopularNonFits, getRankedRecommendations, getRecommendations } from "@/lib/recommendationEngine";
import { compareOwnedPortfolio } from "@/lib/ownedPortfolio";
import type { QuizAnswers } from "@/types/quiz";

const baseAnswers: QuizAnswers = {
  creditScore: "excellent",
  mainGoal: "travel",
  annualFeeComfort: "100to400",
  monthlySpend: "3000to6000",
  topCategory: "dining",
  travelFrequency: "3to5",
  loungeAccess: "maybe",
  simplicity: "optimizeIfHigh",
  businessCards: "no",
};

// Deterministic pseudo-random walk over every question's options.
function* answerSamples(count: number) {
  let seed = 7;
  for (let i = 0; i < count; i += 1) {
    const answers = { ...baseAnswers } as Record<string, string>;
    questions.forEach((question) => {
      seed = (seed * 48271) % 2147483647;
      answers[question.id] = question.options[seed % question.options.length].value;
    });
    yield answers as QuizAnswers;
  }
}

describe("quiz recommendations", () => {
  it("excludes exact owned variants and keeps the default ranking for unknown cards", () => {
    const owned = ["chase-sapphire-reserve", "amex-platinum", "bilt-mastercard"];
    assert.deepEqual(getRecommendations(baseAnswers, []), getRecommendations(baseAnswers));
    assert.deepEqual(getRecommendations(baseAnswers, ["unknown"]), getRecommendations(baseAnswers));
    assert.deepEqual(getRecommendations(baseAnswers, [...owned, owned[0]]), getRecommendations(baseAnswers, owned));
    const remaining = getRankedRecommendations(baseAnswers, owned).map(({ card }) => card.id);
    assert.ok(owned.every((id) => !remaining.includes(id)));
    assert.ok(remaining.includes("chase-sapphire-preferred"));
    assert.ok(getPopularNonFits(baseAnswers, owned).every(({ card }) => !owned.includes(card.id)));
    assert.deepEqual(getRecommendations(baseAnswers, cards.map(({ id }) => id)), []);
  });

  it("never recommend a discontinued card and always return three valid cards", () => {
    const discontinued = new Set(cards.filter((card) => card.availability === "discontinued").map((card) => card.id));
    assert.ok(discontinued.size > 0, "fixture expects at least one discontinued card");

    for (const answers of answerSamples(3000)) {
      const recommendations = getRecommendations(answers);
      assert.equal(recommendations.length, 3);
      assert.equal(new Set(recommendations.map((item) => item.card.id)).size, 3);
      recommendations.forEach((item, index) => {
        assert.ok(!discontinued.has(item.card.id), `${item.card.id} recommended for ${JSON.stringify(answers)}`);
        assert.ok(item.score >= 35 && item.score <= 100, `score ${item.score}`);
        if (index > 0) assert.ok(item.score <= recommendations[index - 1].score);
      });
    }
  });

  it("respect a zero-annual-fee preference for cash-back households", () => {
    const recommendations = getRecommendations({
      ...baseAnswers,
      mainGoal: "cashBack",
      annualFeeComfort: "zero",
      topCategory: "mixed",
      travelFrequency: "rarely",
      simplicity: "simple",
    });

    assert.deepEqual(
      recommendations.map((item) => item.card.annualFee),
      [0, 0, 0],
    );
  });

  it("surface a business card for business owners", () => {
    const recommendations = getRecommendations({ ...baseAnswers, mainGoal: "business", businessCards: "yes" });

    assert.ok(recommendations.some((item) => item.card.businessOnly || item.card.type.startsWith("business")));
  });
});

describe("owned-card rewards comparison", () => {
  it("routes grocery spend to the best available rate and charges only the new fee", () => {
    const answers = { ...baseAnswers, topCategory: "groceries" } as const;
    const result = compareOwnedPortfolio(answers, ["citi-double-cash", "blue-cash-everyday", "blue-cash-everyday"]);
    assert.equal(result.kind, "compared");
    if (result.kind !== "compared") return;
    assert.equal(result.annualSpend, 54000);
    // First $6k moves from 3% to 6%. The portfolio still uses Everyday
    // on the next $6k and the 2% card for the rest.
    assert.deepEqual(result.additions.map(({ card, annualGain }) => [card.id, annualGain]), [
      ["blue-cash-preferred", 145],
    ]);
  });

  it("applies the fee preference and does not assume rewards for unlisted cards", () => {
    const answers = { ...baseAnswers, topCategory: "groceries", annualFeeComfort: "zero" } as const;
    const result = compareOwnedPortfolio(answers, ["citi-double-cash", "blue-cash-everyday"]);
    assert.equal(result.kind, "compared");
    if (result.kind === "compared") assert.deepEqual(result.additions, []);
    assert.equal(compareOwnedPortfolio(answers, ["citi-double-cash"], true).kind, "unavailable");
    assert.equal(compareOwnedPortfolio(answers, ["bilt-mastercard"]).kind, "unavailable");
    assert.equal(compareOwnedPortfolio(answers, ["unknown"]).kind, "unavailable");
    assert.equal(compareOwnedPortfolio(answers, []).kind, "skipped");
  });
});
