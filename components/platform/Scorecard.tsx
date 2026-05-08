export type ScorecardMetric = {
  label: string;
  value: number;
};

export type ScorecardProps = {
  eyebrow?: string;
  title?: string;
  summary?: string;
  overallLabel?: string;
  overallScore: number;
  metrics: ScorecardMetric[];
};

function clampScore(score: number) {
  return Math.max(0, Math.min(10, score));
}

export function Scorecard({
  eyebrow = "MoneyFactor Scorecard",
  title = "Scored for practical value",
  summary,
  overallLabel = "Overall",
  overallScore,
  metrics,
}: ScorecardProps) {
  return (
    <section className="rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="eyebrow-wrap text-sm font-bold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold text-navy sm:text-2xl">{title}</h2>
          {summary && (
            <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/85">{summary}</p>
          )}
        </div>
        <div className="rounded-lg border border-gold/60 bg-gold/10 px-5 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/65">
            {overallLabel}
          </p>
          <p className="mt-1 text-4xl font-semibold text-navy">{overallScore.toFixed(1)}</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mid-navy/65">/ 10</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {metrics.map((metric) => {
          const score = clampScore(metric.value);

          return (
            <div key={metric.label} className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-navy">{metric.label}</p>
                <p className="text-sm font-bold text-mid-navy">{score}/10</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-gray/70">
                <div className="h-full rounded-full bg-gold" style={{ width: `${score * 10}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
