import type { RecommendedCard } from "@/types/card";

const money = (value: number) => `$${Math.abs(Math.round(value)).toLocaleString("en-US")}`;

// Side-by-side summary of the shortlist: the estimated net value is the headline number.
export function ShortlistAtAGlance({ recommendations }: { recommendations: RecommendedCard[] }) {
  return (
    <section aria-labelledby="glance-heading" className="rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
      <h2 id="glance-heading" className="text-sm font-semibold text-navy">
        Your shortlist at a glance
      </h2>
      <p className="mt-1 text-sm leading-6 text-mid-navy/75">
        Ranked by overall fit to your answers. Estimated net value is one input, alongside your goal, fee comfort and the perks you are
        likely to use.
      </p>
      <ol className="mt-3 grid gap-3 md:grid-cols-3">
        {recommendations.map((recommendation, index) => {
          const net = recommendation.estimatedNetValue;
          return (
            <li key={recommendation.card.id}>
              <a
                href={`#result-${recommendation.card.id}`}
                className={`focus-ring flex h-full items-center justify-between gap-3 rounded-lg border p-3 transition hover:border-navy/40 md:block md:p-4 ${index === 0 ? "border-gold/70 bg-gold/5" : "border-line bg-surface/60"}`}
              >
                <div>
                  <p className="text-xs font-bold text-mid-navy/70">{index === 0 ? "Best match" : `#${index + 1}`}</p>
                  <p className="mt-0.5 font-semibold leading-snug text-navy">{recommendation.card.name}</p>
                  <p className="mt-1 text-xs text-mid-navy/70 md:hidden">
                    <span className="tabular-nums">{recommendation.card.annualFee ? `${money(recommendation.card.annualFee)} fee` : "No annual fee"}</span>
                    {" · "}fit <span className="tabular-nums">{recommendation.score}</span>/100
                  </p>
                </div>
                <p className={`shrink-0 text-xl font-semibold tabular-nums tracking-tight md:mt-2 md:text-2xl ${net >= 0 ? "text-positive" : "text-negative"}`}>
                  {net >= 0 ? "+" : "−"}
                  {money(net)}
                  <span className="ml-1 text-sm font-medium text-mid-navy/70">/ yr</span>
                </p>
                <p className="mt-1 hidden text-xs text-mid-navy/70 md:block">
                  <span className="tabular-nums">{recommendation.card.annualFee ? `${money(recommendation.card.annualFee)} fee` : "No annual fee"}</span>
                  {" · "}fit <span className="tabular-nums">{recommendation.score}</span>/100
                </p>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
