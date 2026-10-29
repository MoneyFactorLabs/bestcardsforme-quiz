export type MoneyFactorScores = {
  rewardsValue: number;
  feeJustification: number;
  travelUtility: number;
  everydayUse: number;
  beginnerFriendliness: number;
  overall: number;
};

export type CreditCardAffiliateStatus = "placeholder" | "not_active" | "future_partner";

// Which weighting profile the overall score uses. Cash-back and business cards
// are not penalized for lacking lounge-style travel perks they never promise.
export type ScoringCategory = "travel" | "cashback" | "business";

// "withheld" is used when the product itself is in flux and no honest score exists.
export type ScoreStatus = "scored" | "withheld";

export type FactStatus = "verified" | "changed" | "unverified" | "discontinued";

export type FactFlag = {
  status: FactStatus;
  note: string;
};

export type CardFactCheck = {
  checkedAt: string;
  method: string;
  flags: FactFlag[];
};

export type CardAlternative = {
  slug: string;
  reason: string;
};

export type ValueLine = {
  label: string;
  value: string;
  emphasis?: boolean;
};

// Pre-computed Year-2 value analysis (welcome bonus excluded), produced by
// lib/cardValueModel.ts so every number on the page traces back to stated assumptions.
export type CardValueAnalysis = {
  // Rewards plus friction-adjusted credits, before the annual fee.
  grossAnnualValue: number;
  summary: string;
  assumptions: string[];
  lines: ValueLine[];
  breakEven: string;
  alternateValuation?: string;
};

export type CreditCardProfile = {
  slug: string;
  cardName: string;
  issuer: string;
  annualFee: number;
  bestFor: string;
  rewardsSummary: string;
  creditsSummary: string;
  travelPerks: string;
  transferPartners: string;
  recommendedUserTypes: string[];
  skipIf: string[];
  moneyFactorScores: MoneyFactorScores;
  affiliateStatus: CreditCardAffiliateStatus;
  affiliateUrlPlaceholder: string;
  relatedArticleSlugs: string[];
  reviewedAt: string;
  scoringCategory?: ScoringCategory;
  scoreStatus?: ScoreStatus;
  annualFeeNote?: string;
  metaDescription?: string;
  earnRates?: string[];
  valueAnalysis?: CardValueAnalysis;
  marketingOverstates?: string[];
  alternatives?: CardAlternative[];
  factCheck?: CardFactCheck;
};
