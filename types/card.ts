import type {
  CreditScoreRange,
  MainGoal,
  SimplicityPreference,
  SpendingCategory,
  TravelFrequency,
} from "./quiz";

export type CardType =
  | "travel"
  | "travel/lounge"
  | "cash back"
  | "groceries/cash back"
  | "cash back / starter"
  | "business";

export type CreditCard = {
  id: string;
  name: string;
  annualFee: number;
  type: CardType;
  bestFor: string;
  realisticAnnualValue: string;
  avoidIf: string;
  goalFit: MainGoal[];
  categoryFit: SpendingCategory[];
  travelFit: TravelFrequency[];
  simplicityFit: SimplicityPreference[];
  minimumCreditScore: CreditScoreRange;
  loungeValue: "high" | "medium" | "low";
  businessOnly?: boolean;
};

export type RecommendedCard = {
  card: CreditCard;
  score: number;
  explanationBullets: string[];
  cautionBullet: string;
};
