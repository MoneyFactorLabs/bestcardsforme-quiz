const money = (value: number) => `$${Math.abs(Math.round(value)).toLocaleString("en-US")}`;

type ValueBarProps = {
  // Value the engine estimates this household would capture in a year (before the fee).
  captured: number;
  annualFee: number;
  // Common scale so bars for different cards are comparable; defaults to this card alone.
  scaleMax?: number;
  tone?: "light" | "dark";
};

// Value-vs-fee bar: the full bar is the value captured; the first slice is eaten by the
// annual fee, the rest is what the household keeps. Built only from the engine's own numbers.
export function ValueBar({ captured, annualFee, scaleMax, tone = "light" }: ValueBarProps) {
  const max = Math.max(scaleMax ?? 0, captured, annualFee, 1);
  const pct = (value: number) => `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
  const keeps = captured - annualFee;
  const feeCovered = Math.min(annualFee, captured);
  const track = tone === "dark" ? "bg-white/15" : "bg-line";
  const feeFill = tone === "dark" ? "bg-white/45" : "bg-navy/25";
  const label =
    keeps >= 0
      ? `About ${money(captured)} of value a year: ${money(annualFee)} covers the annual fee and ${money(keeps)} is left.`
      : `About ${money(captured)} of value a year, ${money(keeps)} short of the ${money(annualFee)} annual fee.`;

  return (
    <div role="img" aria-label={label} className="w-full">
      <div className={`relative h-3 w-full overflow-hidden rounded-full ${track}`}>
        <span className={`absolute inset-y-0 left-0 ${feeFill}`} style={{ width: pct(feeCovered) }} />
        {keeps > 0 ? (
          <span className="absolute inset-y-0 bg-accent" style={{ left: pct(annualFee), width: pct(keeps) }} />
        ) : null}
        {keeps < 0 ? (
          <span
            className="absolute inset-y-0 border-2 border-dashed border-negative/70"
            style={{ left: pct(captured), width: pct(-keeps) }}
          />
        ) : null}
      </div>
      <div className={`mt-1.5 flex justify-between gap-3 text-xs ${tone === "dark" ? "text-blue-gray" : "text-mid-navy/75"}`}>
        <span>
          <span aria-hidden="true" className={`mr-1 inline-block h-2 w-2 rounded-sm ${feeFill}`} />
          Fee {money(annualFee)}
        </span>
        <span>
          <span aria-hidden="true" className="mr-1 inline-block h-2 w-2 rounded-sm bg-accent" />
          {keeps >= 0 ? `You keep ${money(keeps)}` : `Short ${money(keeps)}`}
        </span>
      </div>
    </div>
  );
}
