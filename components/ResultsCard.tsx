import Link from "next/link";
import type { RecommendedCard } from "@/types/card";

type ResultsCardProps = {
  recommendation: RecommendedCard;
  rank: number;
};

export function ResultsCard({ recommendation, rank }: ResultsCardProps) {
  const { card } = recommendation;
  const scoreBand =
    recommendation.score >= 90
      ? "Exceptional fit"
      : recommendation.score >= 82
        ? "Strong fit"
        : "Qualified fit";

  return (
    <article className="overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft">
      <div className="border-b border-blue-gray/60 bg-[#f8fafc] px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">#{rank} match</p>
              <span className="rounded-full border border-blue-gray/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-mid-navy/70">
                {scoreBand}
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">{card.name}</h3>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-mid-navy/70">
              Best for someone like you when: {card.bestFor.toLowerCase()}
            </p>
          </div>
          <div className="rounded-md bg-navy px-4 py-3 text-white shadow-sm sm:min-w-40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-gray">
              MoneyFactor Fit Score
            </p>
            <p className="mt-1 text-3xl font-semibold">{recommendation.score}/100</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${recommendation.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-blue-gray/70 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
              Annual fee
            </p>
            <p className="mt-1 text-lg font-semibold text-navy">${card.annualFee}</p>
          </div>
          <div className="rounded-md border border-blue-gray/70 bg-white p-4 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
              Realistic annual value
            </p>
            <p className="mt-1 text-lg font-semibold text-navy">{card.realisticAnnualValue}</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-md bg-[#f5f8fb] p-4">
            <p className="font-semibold text-navy">Why it fits your answers</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-mid-navy/80">
              {recommendation.explanationBullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            <div className="rounded-md border border-blue-gray/70 bg-white p-4">
              <p className="text-sm font-semibold text-navy">Profile-specific caution</p>
              <p className="mt-2 text-sm leading-6 text-mid-navy/75">
                {recommendation.cautionBullet}
              </p>
            </div>
            <div className="rounded-md border border-gold/50 bg-gold/10 p-4">
              <p className="text-sm font-semibold text-navy">Decision-engine read</p>
              <p className="mt-2 text-sm leading-6 text-mid-navy/75">
                This card made the shortlist because its likely utility clears enough of the annual
                fee, rewards, and complexity tests for your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-mid-navy/60">
            Decision-engine ranking based on fit, estimated value captured, and usage assumptions.
          </p>
          <Link
            href={`/cards/${card.id}`}
            className="focus-ring inline-flex w-full justify-center rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white sm:w-auto"
          >
            Read honest review
          </Link>
        </div>
      </div>
    </article>
  );
}
