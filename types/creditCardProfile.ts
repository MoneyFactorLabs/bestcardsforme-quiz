export type MoneyFactorScores = {
  rewardsValue: number;
  feeJustification: number;
  travelUtility: number;
  everydayUse: number;
  beginnerFriendliness: number;
  overall: number;
};

export type CreditCardAffiliateStatus = "placeholder" | "not_active" | "future_partner";

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
};
