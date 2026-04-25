export type CreditScoreRange = "excellent" | "good" | "fair" | "rebuilding";
export type MainGoal =
  | "travel"
  | "cashBack"
  | "hotel"
  | "airline"
  | "balanceTransfer"
  | "business";
export type AnnualFeeComfort = "zero" | "under100" | "100to400" | "400plus";
export type MonthlySpend = "under1500" | "1500to3000" | "3000to6000" | "6000plus";
export type SpendingCategory =
  | "groceries"
  | "dining"
  | "travel"
  | "gas"
  | "onlineShopping"
  | "mixed";
export type TravelFrequency = "rarely" | "1to2" | "3to5" | "monthly";
export type LoungePreference = "yes" | "no" | "maybe";
export type SimplicityPreference = "simple" | "optimizeIfHigh" | "pointsStrategy";
export type BusinessOpenness = "yes" | "no" | "notSure";

export type QuizAnswers = {
  creditScore: CreditScoreRange;
  mainGoal: MainGoal;
  annualFeeComfort: AnnualFeeComfort;
  monthlySpend: MonthlySpend;
  topCategory: SpendingCategory;
  travelFrequency: TravelFrequency;
  loungeAccess: LoungePreference;
  simplicity: SimplicityPreference;
  businessCards: BusinessOpenness;
};

export type QuizQuestionOption<T extends string = string> = {
  label: string;
  value: T;
};

export type QuizQuestionDefinition<K extends keyof QuizAnswers = keyof QuizAnswers> = {
  id: K;
  eyebrow: string;
  question: string;
  options: QuizQuestionOption<QuizAnswers[K]>[];
};
