import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoneyFactor — Financial Decision Engines",
  description:
    "MoneyFactor builds plain-English financial decision engines that help consumers compare credit cards, leases, home costs, and other major financial choices using transparent math.",
  alternates: {
    canonical: "https://moneyfactor.io",
  },
};

const futureEngines = [
  {
    name: "LeaseFactor",
    description: "Auto lease math, money factor, residuals, and lease deal quality.",
  },
  {
    name: "HomeFactor",
    description:
      "True cost of homeownership, including taxes, insurance, maintenance, and utilities.",
  },
  {
    name: "InsuranceFactor / LoanFactor",
    description: "Future finance decision engines for high-stakes comparison shopping.",
  },
];

export default function MoneyFactorLandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fb] text-navy">
      <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="rounded-lg border border-blue-gray/70 bg-white shadow-soft">
          <div className="border-b border-blue-gray/70 px-5 py-5 sm:px-8">
            <p className="text-xl font-semibold tracking-[0.02em]">MoneyFactor</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-mid-navy/65">
              The Real Math Behind Every Money Decision
            </p>
          </div>
          <div className="px-5 py-10 sm:px-8 sm:py-14">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
              Parent company
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              MoneyFactor builds plain-English financial decision engines.
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-mid-navy/80">
              We help consumers make high-intent financial decisions using transparent math,
              structured comparisons, and practical recommendations.
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-5">
          <section className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
            <h2 className="text-2xl font-semibold">What MoneyFactor Does</h2>
            <ul className="mt-5 grid gap-3 text-sm font-medium leading-7 text-mid-navy/80">
              {[
                "Builds decision engines for confusing financial choices.",
                "Uses conservative math, clear tradeoffs, and structured scoring.",
                "Focuses on financial decisions where consumers are often overwhelmed by marketing or unclear pricing.",
              ].map((item) => (
                <li key={item} className="flex gap-3 rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft">
            <div className="bg-navy p-5 text-white sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
                Active vertical
              </p>
              <h2 className="mt-3 text-3xl font-semibold">BestCardsForMe</h2>
              <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-blue-gray">
                Credit card comparison and recommendation engine focused on premium cards,
                annual-fee math, rewards value, and realistic usage.
              </p>
            </div>
            <div className="p-5 sm:p-7">
              <a
                href="https://bestcardsforme.com"
                className="focus-ring inline-flex rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-mid-navy"
              >
                Visit BestCardsForMe
              </a>
            </div>
          </section>

          <section className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
            <h2 className="text-2xl font-semibold">Future Engines</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/75">
              These are planned future verticals, not active products yet.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {futureEngines.map((engine) => (
                <article
                  key={engine.name}
                  className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4"
                >
                  <h3 className="text-lg font-semibold">{engine.name}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-mid-navy/75">
                    {engine.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-7">
            <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/75">
              For editorial, partnership, or company inquiries, email{" "}
              <a
                href="mailto:tim@moneyfactor.io"
                className="font-bold text-navy underline decoration-gold/70 underline-offset-4 transition hover:text-mid-navy"
              >
                tim@moneyfactor.io
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
