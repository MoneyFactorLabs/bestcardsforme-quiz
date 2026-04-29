import Link from "next/link";
import type { EditorialArticle } from "@/types/article";
import type { CreditCard } from "@/types/card";

type ResolvedCardCta = NonNullable<EditorialArticle["cardCtas"]>[number] & {
  card: CreditCard;
};

type RecommendedCardItem = {
  card: CreditCard;
  headline: string;
  reasoning: string;
  bestFor: string;
  trigger: string;
};

type ArticleRecommendedCardsProps = {
  article: EditorialArticle;
  cardCtas?: ResolvedCardCta[];
};

function formatAnnualFee(card: CreditCard) {
  return card.annualFee === 0 ? "$0" : `$${card.annualFee}`;
}

function getSectionVariation(article: EditorialArticle) {
  const text = `${article.title} ${article.category}`.toLowerCase();

  if (text.includes(" vs ") || text.includes("compare")) {
    return {
      eyebrow: "Comparison recommendation",
      heading: "Recommended cards from this comparison",
      intro:
        "Use these as the practical next-step cards after weighing the tradeoffs above.",
    };
  }

  if (text.includes("strategy") || text.includes("high-income") || text.includes("business")) {
    return {
      eyebrow: "Strategy recommendation",
      heading: "Recommended cards for this strategy",
      intro:
        "These cards are the clearest product anchors for the strategy discussed in this guide.",
    };
  }

  if (text.startsWith("best ") || text.includes("best credit card")) {
    return {
      eyebrow: "Best-of recommendation",
      heading: "Recommended cards from this guide",
      intro:
        "These are the most relevant card profiles to compare before checking current issuer terms.",
    };
  }

  return {
    eyebrow: "Standalone recommendation",
    heading: "Recommended cards for this review",
    intro:
      "Use these card profiles to decide whether this card, a downgrade path, or an adjacent alternative fits better.",
  };
}

function getPrimaryRecommendation(article: EditorialArticle, cardCtas: ResolvedCardCta[]) {
  if (!article.recommendationCta?.cardId) return undefined;

  const existing = cardCtas.find((cta) => cta.card.id === article.recommendationCta?.cardId);
  if (existing) return existing;

  return undefined;
}

function buildTrigger(card: CreditCard) {
  if (card.annualFee === 0) {
    return `Choose it when ${card.bestFor.toLowerCase()} and you want to avoid annual-fee break-even pressure.`;
  }

  return `Choose it when ${card.bestFor.toLowerCase()} and the ${formatAnnualFee(
    card,
  )} annual fee clears your realistic usage.`;
}

function buildItems(article: EditorialArticle, cardCtas: ResolvedCardCta[]) {
  const primary = getPrimaryRecommendation(article, cardCtas);
  const ordered = primary
    ? [primary, ...cardCtas.filter((cta) => cta.card.id !== primary.card.id)]
    : cardCtas;

  return ordered.slice(0, 4).map(
    (cta): RecommendedCardItem => ({
      card: cta.card,
      headline: cta.headline.replace(/^BestCardsForMe profile:\s*/i, ""),
      reasoning: cta.body,
      bestFor: cta.card.bestFor,
      trigger: buildTrigger(cta.card),
    }),
  );
}

export function ArticleRecommendedCards({ article, cardCtas = [] }: ArticleRecommendedCardsProps) {
  const items = buildItems(article, cardCtas);

  if (items.length === 0) return null;

  const variation = getSectionVariation(article);

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
      <div className="bg-navy px-5 py-6 text-white sm:px-7">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
          {variation.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">{variation.heading}</h2>
        <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-blue-gray">
          {variation.intro}
        </p>
      </div>

      <div className="grid gap-px bg-blue-gray/70">
        {items.map((item) => (
          <article key={item.card.id} className="bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  {formatAnnualFee(item.card)} annual fee
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-tight text-navy">
                  {item.card.name}
                </h3>
                <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/90">
                  {item.reasoning}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-mid-navy/55">
                      Best for
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-navy">
                      {item.bestFor}
                    </p>
                  </div>
                  <div className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-mid-navy/55">
                      Trigger
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-navy">
                      {item.trigger}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:min-w-56">
                <Link
                  href={`/cards/${item.card.id}`}
                  className="focus-ring rounded-md border border-navy px-4 py-3 text-center text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
                >
                  Read the full review →
                </Link>
                <Link
                  href={`/go/${item.card.affiliateSlug}`}
                  className="focus-ring rounded-md bg-gold px-4 py-3 text-center text-sm font-bold text-navy transition hover:bg-[#caa42f]"
                >
                  Check current terms →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-blue-gray/70 bg-[#f8fafc] px-5 py-4 sm:px-7">
        <p className="text-xs font-medium leading-5 text-mid-navy/70">
          BestCardsForMe may receive compensation from partners, but recommendations are based on
          independent MoneyFactor scoring, realistic annual-value math, and editorial review.
          Always verify current issuer terms before applying.
        </p>
      </div>
    </section>
  );
}
