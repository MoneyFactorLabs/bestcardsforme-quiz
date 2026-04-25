import Link from "next/link";
import type { RecommendedCard } from "@/types/card";

type PopularNonFitCardsProps = {
  cards: RecommendedCard[];
};

export function PopularNonFitCards({ cards }: PopularNonFitCardsProps) {
  return (
    <section className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Honest exclusions</p>
        <h2 className="mt-2 text-2xl font-semibold text-navy">
          Popular cards that may not fit your profile
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((recommendation) => (
          <article key={recommendation.card.id} className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-navy">{recommendation.card.name}</h3>
                <p className="mt-1 text-sm text-mid-navy/70">{recommendation.lowerFitReason}</p>
              </div>
              <span className="rounded-md bg-white px-3 py-2 text-sm font-bold text-mid-navy">
                {recommendation.score}
              </span>
            </div>
            <Link
              href={`/cards/${recommendation.card.id}`}
              className="focus-ring mt-4 inline-flex rounded-md border border-mid-navy px-4 py-2 text-sm font-bold text-mid-navy transition hover:bg-mid-navy hover:text-white"
            >
              See why
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
