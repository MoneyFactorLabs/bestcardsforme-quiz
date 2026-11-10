import { getRecommendations } from "@/lib/recommendationEngine";
import type { QuizAnswers } from "@/types/quiz";

// The homepage example is a real engine result for this stated sample profile,
// never a hand-written number. Change the profile here and the example follows.
export const EXAMPLE_ANSWERS: QuizAnswers = {
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

export const EXAMPLE_PROFILE_LABEL = "Travel-focused, dines out often, 3-5 trips a year, $3,000-$6,000 a month on cards";

export function getExampleRecommendation() {
  const [top, ...rest] = getRecommendations(EXAMPLE_ANSWERS);
  return { top, runnersUp: rest };
}
