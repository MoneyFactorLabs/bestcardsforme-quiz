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
  | "travel/dining"
  | "travel/hotel"
  | "travel/airline"
  | "cash back"
  | "groceries/cash back"
  | "cash back / starter"
  | "business cash back"
  | "business";

export type CreditCard = {
  id: string;
  name: string;
  annualFee: number;
  valueEstimateLow: number;
  valueEstimateHigh: number;
  type: CardType;
  bestFor: string;
  realisticAnnualValue: string;
  avoidIf: string;
  currentPublicOffer: string;
  issuerTermsUrl?: string;
  whyValuable: string[];
  marketingOverstates: string[];
  keyPerks: string[];
  honestDrawbacks: string[];
  moneyFactorVerdict: string;
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
  lowerFitReason: string;
};
