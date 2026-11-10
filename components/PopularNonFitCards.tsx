import Link from "next/link";
import type { RecommendedCard } from "@/types/card";

type PopularNonFitCardsProps = {
  cards: RecommendedCard[];
};

export function PopularNonFitCards({ cards }: PopularNonFitCardsProps) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4">
        <p className="text-sm font-semibold text-accent-ink">Honest exclusions</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-navy">Popular cards that may not fit your profile</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((recommendation) => (
          <article key={recommendation.card.id} className="flex flex-col rounded-lg border border-line bg-surface/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-navy">{recommendation.card.name}</h3>
              <span className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-mid-navy">
                fit <span className="tabular-nums">{recommendation.score}</span>/100
              </span>
            </div>
            <p className="mt-1 flex-1 text-sm leading-6 text-mid-navy/75">{recommendation.lowerFitReason}</p>
            <Link
              href={`/cards/${recommendation.card.id}`}
              className="focus-ring mt-3 self-start text-sm font-semibold text-navy underline decoration-accent/60 underline-offset-4 hover:text-mid-navy"
            >
              See why →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
