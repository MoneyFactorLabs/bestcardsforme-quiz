import { CardArt } from "@/components/CardArt";
import { ValueBar } from "@/components/ValueBar";
import type { RecommendedCard } from "@/types/card";

const money = (value: number) => `$${Math.abs(Math.round(value)).toLocaleString("en-US")}`;

// Side-by-side summary of the shortlist, designed to sit on the navy results band. The
// estimated net value is the headline number; the bars share one scale so cards compare.
export function ShortlistAtAGlance({ recommendations }: { recommendations: RecommendedCard[] }) {
  const scaleMax = Math.max(1, ...recommendations.map((r) => r.estimatedNetValue + r.card.annualFee));
  return (
    <section aria-labelledby="glance-heading">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="glance-heading" className="text-sm font-semibold text-white">
          Your shortlist at a glance
        </h2>
        <p className="text-xs text-blue-gray">Ranked by overall fit. Net value is one input, alongside goal, fee comfort and likely perks.</p>
      </div>
      <ol className="mt-3 grid gap-2 md:grid-cols-3 md:gap-3">
        {recommendations.map((recommendation, index) => {
          const net = recommendation.estimatedNetValue;
          const { card } = recommendation;
          return (
            <li key={card.id}>
              <a
                href={`#result-${card.id}`}
                className={`focus-ring block h-full rounded-xl border p-3 transition md:p-4 hover:-translate-y-0.5 ${
                  index === 0 ? "border-accent bg-white" : "border-white/15 bg-white/95"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CardArt id={card.id} annualFee={card.annualFee} type={card.type} size="xs" context="glance" className="hidden md:inline-block" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-accent-ink">{index === 0 ? "Best match" : `#${index + 1} match`}</p>
                    <p className="truncate font-semibold leading-snug text-navy">{card.name}</p>
                  </div>
                  <p className={`shrink-0 text-xl font-semibold tabular-nums tracking-tight md:hidden ${net >= 0 ? "text-positive" : "text-negative"}`}>
                    {net >= 0 ? "+" : "−"}
                    {money(net)}
                    <span className="ml-0.5 text-xs font-medium text-mid-navy/70">/yr</span>
                  </p>
                </div>
                <p className={`mt-3 hidden text-2xl font-semibold tabular-nums tracking-tight md:block ${net >= 0 ? "text-positive" : "text-negative"}`}>
                  {net >= 0 ? "+" : "−"}
                  {money(net)}
                  <span className="ml-1 text-sm font-medium text-mid-navy/70">/ yr after fee</span>
                </p>
                <div className="mt-2">
                  <ValueBar captured={net + card.annualFee} annualFee={card.annualFee} scaleMax={scaleMax} />
                </div>
                <p className="mt-2 hidden text-xs text-mid-navy/70 md:block">
                  fit score <span className="tabular-nums">{recommendation.score}</span>/100
                </p>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
