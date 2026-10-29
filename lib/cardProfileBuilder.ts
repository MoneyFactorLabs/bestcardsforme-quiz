import { buildValueAnalysis, type CreditLine, type RewardCurrency, type SpendLine } from "@/lib/cardValueModel";
import type {
  CardAlternative,
  CardFactCheck,
  CreditCardProfile,
  MoneyFactorScores,
  ScoringCategory,
} from "@/types/creditCardProfile";

type SubScores = Omit<MoneyFactorScores, "overall">;

// Overall score weights by card category. Travel weights reproduce the hand-scored
// premium travel profiles within ±0.6; cash-back and business cards shift weight
// away from travel perks they never claim to offer.
export const scoreWeights: Record<ScoringCategory, SubScores> = {
  travel: { rewardsValue: 0.3, feeJustification: 0.25, travelUtility: 0.2, everydayUse: 0.15, beginnerFriendliness: 0.1 },
  cashback: { rewardsValue: 0.35, feeJustification: 0.25, travelUtility: 0.05, everydayUse: 0.25, beginnerFriendliness: 0.1 },
  business: { rewardsValue: 0.35, feeJustification: 0.25, travelUtility: 0.1, everydayUse: 0.2, beginnerFriendliness: 0.1 },
};

const scoreLabels: Record<keyof SubScores, string> = {
  rewardsValue: "rewards",
  feeJustification: "fee defensibility",
  travelUtility: "travel utility",
  everydayUse: "everyday use",
  beginnerFriendliness: "ease of management",
};

export function weightedOverall(scores: SubScores, category: ScoringCategory) {
  const weights = scoreWeights[category];
  const total = (Object.keys(weights) as (keyof SubScores)[]).reduce(
    (sum, key) => sum + scores[key] * weights[key],
    0,
  );

  return Math.round(total * 10) / 10;
}

export function describeScoreWeights(category: ScoringCategory) {
  const weights = scoreWeights[category];
  const parts = (Object.keys(weights) as (keyof SubScores)[]).map(
    (key) => `${scoreLabels[key]} ${Math.round(weights[key] * 100)}%`,
  );

  return `The overall score is a weighted average for ${
    category === "cashback" ? "cash-back" : category
  } cards: ${parts.join(", ")}.`;
}

export type CardProfileSpec = {
  slug: string;
  cardName: string;
  issuer: string;
  annualFee: number;
  annualFeeNote?: string;
  scoringCategory: ScoringCategory;
  // Short earn phrase for the meta description, e.g. "2% flat cash back".
  headline: string;
  bestFor: string;
  rewardsSummary: string;
  earnRates: string[];
  creditsSummary: string;
  travelPerks: string;
  transferPartners: string;
  recommendedUserTypes: string[];
  skipIf: string[];
  marketingOverstates: string[];
  alternatives: CardAlternative[];
  relatedArticleSlugs: string[];
  reviewedAt: string;
  factCheck: CardFactCheck;
  scores: SubScores | "withheld";
  valueModel?: {
    currency: RewardCurrency;
    spend: SpendLine[];
    credits: CreditLine[];
    alternateValuation?: { currency: RewardCurrency; scenario: string };
  };
};

export function buildCardProfile(spec: CardProfileSpec): CreditCardProfile {
  const withheld = spec.scores === "withheld";
  const subScores: SubScores = withheld
    ? { rewardsValue: 0, feeJustification: 0, travelUtility: 0, everydayUse: 0, beginnerFriendliness: 0 }
    : (spec.scores as SubScores);
  const year = spec.reviewedAt.slice(0, 4);
  const feeText = spec.annualFee === 0 ? "$0" : `$${spec.annualFee}`;

  return {
    slug: spec.slug,
    cardName: spec.cardName,
    issuer: spec.issuer,
    annualFee: spec.annualFee,
    annualFeeNote: spec.annualFeeNote,
    bestFor: spec.bestFor,
    rewardsSummary: spec.rewardsSummary,
    creditsSummary: spec.creditsSummary,
    travelPerks: spec.travelPerks,
    transferPartners: spec.transferPartners,
    recommendedUserTypes: spec.recommendedUserTypes,
    skipIf: spec.skipIf,
    moneyFactorScores: {
      ...subScores,
      overall: withheld ? 0 : weightedOverall(subScores, spec.scoringCategory),
    },
    scoringCategory: spec.scoringCategory,
    scoreStatus: withheld ? "withheld" : "scored",
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: `/go/${spec.slug}`,
    relatedArticleSlugs: spec.relatedArticleSlugs,
    reviewedAt: spec.reviewedAt,
    metaDescription: `${spec.cardName} review (${year}): ${feeText} annual fee, ${spec.headline}. Year-2 value math, who should skip it, and alternatives.`,
    earnRates: spec.earnRates,
    valueAnalysis: spec.valueModel
      ? buildValueAnalysis({ annualFee: spec.annualFee, ...spec.valueModel })
      : undefined,
    marketingOverstates: spec.marketingOverstates,
    alternatives: spec.alternatives,
    factCheck: spec.factCheck,
  };
}
