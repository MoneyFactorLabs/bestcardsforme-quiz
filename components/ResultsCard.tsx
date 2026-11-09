import Link from "next/link";
import type { RecommendedCard } from "@/types/card";

type ResultsCardProps = {
  recommendation: RecommendedCard;
  rank: number;
};

const money = (value: number) => `$${Math.abs(Math.round(value)).toLocaleString("en-US")}`;

export function fitLabel(score: number) {
  return score >= 90 ? "Exceptional fit" : score >= 82 ? "Strong fit" : "Qualified fit";
}

// The estimate the engine ranks on: value likely captured for these answers, minus the annual fee.
export function NetValuePanel({ recommendation, compact = false }: { recommendation: RecommendedCard; compact?: boolean }) {
  const { card, estimatedNetValue: net } = recommendation;
  const captured = net + card.annualFee;
  const clears = net >= 0;
  return (
    <div className="rounded-lg border border-line bg-surface p-4 sm:p-5" data-testid="net-value-panel">
      <p className="text-sm font-semibold text-mid-navy">Estimated net value for your answers</p>
      <p className={`mt-1 font-semibold tabular-nums tracking-tight ${compact ? "text-3xl" : "text-4xl sm:text-5xl"} ${clears ? "text-positive" : "text-negative"}`}>
        {clears ? "+" : "−"}
        {money(net)}
        <span className="ml-1 text-base font-medium text-mid-navy/70">/ year</span>
      </p>
      <p className="mt-1 text-sm text-mid-navy/75">
        {clears ? `after the ${money(card.annualFee)} annual fee` : `short of covering the ${money(card.annualFee)} annual fee`}
      </p>
      <dl className="mt-4 grid gap-1.5 border-t border-line pt-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-mid-navy/75">Value you would likely capture</dt>
          <dd className="font-semibold tabular-nums text-navy">{money(captured)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mid-navy/75">Annual fee</dt>
          <dd className="font-semibold tabular-nums text-navy">{card.annualFee ? `−${money(card.annualFee)}` : "$0"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-mid-navy/75">Typical range, before fee</dt>
          <dd className="whitespace-nowrap font-semibold tabular-nums text-navy">
            {money(card.valueEstimateLow)}–{money(card.valueEstimateHigh)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function ResultsCard({ recommendation, rank }: ResultsCardProps) {
  const { card } = recommendation;
  const isTop = rank === 1;

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-card ${isTop ? "border-gold/70 ring-1 ring-gold/40" : "border-line"}`}
      aria-labelledby={`result-${card.id}`}
    >
      {/* Mobile order: name, value, reasons. Desktop: reasons left, value column right. */}
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-x-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${isTop ? "bg-navy text-white" : "bg-surface text-navy"}`}>
              {isTop ? "Best match" : `#${rank} match`}
            </span>
            <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-mid-navy">
              {fitLabel(recommendation.score)} · fit score <span className="tabular-nums">{recommendation.score}</span>/100
            </span>
          </div>
          <h3 id={`result-${card.id}`} className="mt-3 scroll-mt-4 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
            {card.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-mid-navy/75">Best for {card.bestFor.charAt(0).toLowerCase() + card.bestFor.slice(1)}</p>
        </div>

        <div className="grid content-start gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <NetValuePanel recommendation={recommendation} />
          <Link
            href={`/cards/${card.id}`}
            className="focus-ring inline-flex w-full items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-mid-navy"
          >
            Read the full review →
          </Link>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <h4 className="text-sm font-semibold text-navy">Why it fits your answers</h4>
          <ul className="mt-2 space-y-2 text-[0.95rem] leading-6 text-mid-navy/85">
            {recommendation.explanationBullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-positive">
                  <path fill="currentColor" d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5.9-5.9 1.1 1.1z" />
                </svg>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-md border-l-4 border-gold bg-gold/10 px-3 py-2 text-sm leading-6 text-mid-navy/85">
            <span className="font-semibold text-navy">Watch out: </span>
            {recommendation.cautionBullet}
          </p>
        </div>
      </div>
      <details className="border-t border-line bg-surface/60 px-5 py-3 text-sm sm:px-7">
        <summary className="cursor-pointer font-semibold text-navy">How this estimate works</summary>
        <p className="mt-2 max-w-3xl leading-6 text-mid-navy/80">
          We start from the middle of this card&apos;s typical yearly value range ({money(card.valueEstimateLow)}–{money(card.valueEstimateHigh)} in
          rewards and credits a household realistically uses), scale it by how well your spending, goals, travel, lounge and reward-style answers match the
          card, and subtract the annual fee. It is an estimate for comparing cards, not a guarantee; welcome bonuses are not included. The full
          review shows the line-by-line math.
        </p>
      </details>
    </article>
  );
}
