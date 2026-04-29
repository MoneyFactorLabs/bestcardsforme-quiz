import { RecommendationCTA } from "@/components/platform/RecommendationCTA";
import type { ArticleRecommendationCta } from "@/types/article";

type ArticleAffiliateCtaProps = {
  recommendation: ArticleRecommendationCta;
};

function getApprovedButtonLabel(label?: string) {
  if (!label) return "Check current terms →";

  const normalized = label.toLowerCase();

  if (normalized.includes("review")) return "Read the full review →";
  if (normalized.includes("offer")) return "Verify current offer →";

  return "Check current terms →";
}

export function ArticleAffiliateCta({ recommendation }: ArticleAffiliateCtaProps) {
  const href = recommendation.href || (recommendation.cardId ? `/go/${recommendation.cardId}` : "#");

  return (
    <RecommendationCTA
      productName={recommendation.cardName}
      whyWeLikeIt={recommendation.whyWeLikeIt}
      annualFee={recommendation.annualFee}
      bestFor={recommendation.bestFor}
      buttonLabel={getApprovedButtonLabel(recommendation.buttonLabel)}
      href={href}
      disclosure={
        recommendation.disclosure ||
        "This placement is editorial and educational. BestCardsForMe may receive compensation in the future, but ranking logic is based on consumer fit and net value."
      }
    />
  );
}
