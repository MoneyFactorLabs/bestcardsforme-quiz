import assert from "node:assert/strict";
import test from "node:test";
import { quizQuestions } from "@/data/questions";
import { EXAMPLE_ANSWERS, EXAMPLE_PROFILE_LABEL, getExampleRecommendation } from "@/lib/exampleRecommendation";
import { getRankedRecommendations, getRecommendations } from "@/lib/recommendationEngine";
import type { QuizAnswers } from "@/types/quiz";

// Every combination would be 6,912 profiles; a deterministic sample covers each option many times.
function* samples(count: number) {
  let seed = 11;
  for (let i = 0; i < count; i += 1) {
    const answers: Record<string, string> = {};
    for (const question of quizQuestions) {
      seed = (seed * 48271) % 2147483647;
      answers[question.id] = question.options[seed % question.options.length].value;
    }
    yield answers as QuizAnswers;
  }
}

test("displayed net value is the figure the engine's own explanation quotes", () => {
  for (const answers of samples(300)) {
    for (const recommendation of getRankedRecommendations(answers)) {
      assert.ok(Number.isInteger(recommendation.estimatedNetValue));
      const quoted = recommendation.explanationBullets.join(" ").match(/clears the annual fee by about \$(\d+)/);
      if (quoted) assert.equal(Number(quoted[1]), recommendation.estimatedNetValue, recommendation.card.id);
      // The breakdown on the page: captured value = net + fee, and it never exceeds the published range ceiling by more than the engine's 8% cap.
      const captured = recommendation.estimatedNetValue + recommendation.card.annualFee;
      assert.ok(captured >= 0, `${recommendation.card.id} captured value`);
      assert.ok(captured <= Math.ceil(((recommendation.card.valueEstimateLow + recommendation.card.valueEstimateHigh) / 2) * 1.08) + 1);
    }
  }
});

test("exposing the value does not change ranking or fit scores", () => {
  for (const answers of samples(100)) {
    const ranked = getRankedRecommendations(answers);
    const scores = ranked.map((recommendation) => recommendation.score);
    assert.deepEqual(scores, [...scores].sort((a, b) => b - a), "still ordered by fit score");
    assert.deepEqual(getRecommendations(answers).map((r) => r.card.id), ranked.slice(0, 3).map((r) => r.card.id));
  }
});

test("homepage example is a real engine result for the stated sample profile", () => {
  const { top } = getExampleRecommendation();
  assert.deepEqual(top, getRecommendations(EXAMPLE_ANSWERS)[0]);
  // The label describes the answers actually used.
  const option = (id: keyof QuizAnswers) => quizQuestions.find((question) => question.id === id)!.options.find((o) => o.value === EXAMPLE_ANSWERS[id])!.label;
  assert.ok(EXAMPLE_PROFILE_LABEL.includes(option("monthlySpend")), "spend bracket matches");
  assert.ok(EXAMPLE_PROFILE_LABEL.includes(option("travelFrequency").replace(" trips/year", "")), "travel frequency matches");
  assert.equal(EXAMPLE_ANSWERS.mainGoal, "travel");
  assert.equal(EXAMPLE_ANSWERS.topCategory, "dining");
});
