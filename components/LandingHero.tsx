type LandingHeroProps = {
  onStart: () => void;
};

export function LandingHero({ onStart }: LandingHeroProps) {
  const trustSignals = [
    "No signup required",
    "No credit pull",
    "Updated 2026 assumptions",
    "Honest methodology",
  ];

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 pt-6 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-20 lg:pt-10">
      <div>
        <p className="eyebrow-wrap mb-4 text-sm font-bold uppercase tracking-[0.24em] text-gold">
          A MoneyFactor decision engine
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-navy sm:text-5xl lg:text-6xl">
          Find the credit card that actually fits you.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-mid-navy/80">
          Answer a few questions and we'll estimate which cards are worth the annual fee for
          your real spending pattern.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onStart}
            className="focus-ring rounded-md bg-gold px-7 py-4 text-base font-bold text-navy shadow-soft transition hover:-translate-y-0.5 hover:bg-[#caa42f]"
          >
            Start quiz
          </button>
          <p className="text-sm font-medium text-mid-navy/70">
            No signup required. No credit check. No issuer bias.
          </p>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {trustSignals.map((item) => (
            <div
              key={item}
              className="rounded-md border border-blue-gray/70 bg-white/90 px-4 py-3 text-sm font-semibold text-mid-navy shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 rounded-lg border border-blue-gray/70 bg-white/80 p-4 shadow-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mid-navy/55">
              Independent scoring
            </p>
            <p className="mt-2 text-sm leading-6 text-mid-navy/75">
              Fee tolerance, perk usage, spending categories, and realistic annual value are weighed
              before any card is ranked.
            </p>
          </div>
          <div className="border-t border-blue-gray/60 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mid-navy/55">
              MoneyFactor platform
            </p>
            <p className="mt-2 text-sm leading-6 text-mid-navy/75">
              Independent credit card recommendations built on real financial math.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-blue-gray/70 bg-white p-3 shadow-soft sm:p-5">
        <div className="overflow-hidden rounded-md bg-navy text-white">
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Recommendation framework
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Premium value, not card hype.</h2>
            <p className="mt-2 text-sm leading-6 text-blue-gray">
              The quiz turns lifestyle answers into a ranked card shortlist with the fee drag and
              usage friction kept visible.
            </p>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            {[
              ["Likely value captured", "$625/yr"],
              ["Annual fee test", "Pass"],
              ["Perk utilization", "High"],
            ].map(([label, value]) => (
              <div key={label} className="bg-navy px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-gray">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="p-5 sm:p-6">
            <div className="rounded-md border border-white/10 bg-white/10 p-4">
              <p className="text-sm font-semibold text-white">Methodology note</p>
              <p className="mt-2 text-sm leading-6 text-blue-gray">
                We discount credits and perks when the user's answers suggest they are unlikely to
                be used. Terms can change, so final issuer details should always be verified.
              </p>
            </div>
            <div className="mt-4 rounded-md border border-white/10 bg-[#0b1726] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                Example value bridge
              </p>
              <div className="mt-4 space-y-3">
              {[
                ["Travel credits likely used", "$300"],
                ["Rewards from actual spend", "$420"],
                ["Annual fee drag", "-$95"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm text-blue-gray">{label}</span>
                  <span className="text-lg font-semibold">{value}</span>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
