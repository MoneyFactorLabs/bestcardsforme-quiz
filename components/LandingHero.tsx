type LandingHeroProps = {
  onStart: () => void;
};

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20 lg:pt-14">
      <div>
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-gold">
          MoneyFactor decision engine
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
      </div>
      <div className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft">
        <div className="rounded-md bg-navy p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-gray">
            Honest annual value
          </p>
          <div className="mt-8 space-y-5">
            {[
              ["Travel credits used", "$300"],
              ["Estimated rewards earned", "$420"],
              ["Annual fee drag", "-$95"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="text-sm text-blue-gray">{label}</span>
                <span className="text-lg font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-md bg-white/10 p-4">
            <p className="text-sm text-blue-gray">Estimated net value</p>
            <p className="mt-1 text-3xl font-semibold text-white">$625/year</p>
          </div>
        </div>
      </div>
    </section>
  );
}
