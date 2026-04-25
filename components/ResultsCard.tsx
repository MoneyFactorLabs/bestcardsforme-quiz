import type { RecommendedCard } from "@/types/card";

type ResultsCardProps = {
  recommendation: RecommendedCard;
  rank: number;
};

export function ResultsCard({ recommendation, rank }: ResultsCardProps) {
  const { card } = recommendation;

  return (
    <article className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">#{rank} match</p>
          <h3 className="mt-2 text-2xl font-semibold text-navy">{card.name}</h3>
          <p className="mt-1 text-sm font-medium text-mid-navy/70">Best for: {card.bestFor}</p>
        </div>
        <div className="rounded-md bg-navy px-4 py-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-gray">Score</p>
          <p className="text-2xl font-semibold">{recommendation.score}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-[#f5f8fb] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">Annual fee</p>
          <p className="mt-1 text-lg font-semibold text-navy">${card.annualFee}</p>
        </div>
        <div className="rounded-md bg-[#f5f8fb] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
            Realistic annual value
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">{card.realisticAnnualValue}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="font-semibold text-navy">Why it fits</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-mid-navy/80">
          {recommendation.explanationBullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-md border border-blue-gray/70 bg-white p-4">
        <p className="text-sm font-semibold text-navy">Caution</p>
        <p className="mt-1 text-sm leading-6 text-mid-navy/75">{recommendation.cautionBullet}</p>
      </div>

      <button
        type="button"
        className="focus-ring mt-5 w-full rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white sm:w-auto"
      >
        Review card details
      </button>
    </article>
  );
}
