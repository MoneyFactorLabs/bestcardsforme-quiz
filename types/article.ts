export type ArticleTable = {
  columns: string[];
  rows: string[][];
};

export type ArticleSubsection = {
  heading: string;
  body?: string[];
  table?: ArticleTable;
  bullets?: string[];
};

export type ArticleSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  table?: ArticleTable;
  subsections?: ArticleSubsection[];
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleMetric = {
  label: string;
  value: string;
};

export type ArticleCardCta = {
  cardId: string;
  headline: string;
  body: string;
  label?: string;
};

export type ArticleDisclosureCta = {
  heading: string;
  body: string;
  label: string;
  href: string;
};

export type ArticleScorecard = {
  rewardsValue: number;
  feeJustification: number;
  travelUtility: number;
  everydayUse: number;
  beginnerFriendliness: number;
  overallScore: number;
  summary?: string;
};

export type ArticleRecommendationCta = {
  cardId?: string;
  cardName: string;
  whyWeLikeIt: string;
  annualFee: string;
  bestFor: string;
  buttonLabel?: string;
  href?: string;
  disclosure?: string;
};

export type ArticleRelatedSuggestion = {
  slug?: string;
  title?: string;
  dek?: string;
  label?: string;
  href?: string;
};

export type EditorialArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  metaDescription?: string;
  dek: string;
  category: string;
  updatedAt: string;
  reviewedBy: string;
  readingTime: string;
  comparisonMetrics?: ArticleMetric[];
  scorecard?: ArticleScorecard;
  sections: ArticleSection[];
  recommendationCta?: ArticleRecommendationCta;
  cardCtas?: ArticleCardCta[];
  relatedArticles?: ArticleRelatedSuggestion[];
  faqs?: ArticleFaq[];
  disclosureCta?: ArticleDisclosureCta;
};
