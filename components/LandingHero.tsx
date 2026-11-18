import Link from "next/link";
import { fitLabel } from "@/components/ResultsCard";
import { CardArt } from "@/components/CardArt";
import { ValueBar } from "@/components/ValueBar";
import { quizQuestions } from "@/data/questions";
import { EXAMPLE_PROFILE_LABEL, getExampleRecommendation } from "@/lib/exampleRecommendation";

type LandingHeroProps = {
  onStart: () => void;
};

const Check = ({ className = "text-positive" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-4 w-4 shrink-0 ${className}`}>
    <path fill="currentColor" d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5.9-5.9 1.1 1.1z" />
  </svg>
);

const tools = [
  {
    href: "/tools/annual-fee-break-even-calculator",
    title: "Annual-fee break-even calculator",
    body: "Does a fee pay for itself at your spending?",
    tag: "Calculator",
  },
  {
    href: "/credit-card-lounge-access",
    title: "Lounge access and guest costs",
    body: "Which cards open which lounges, and what guests cost.",
    tag: "Guide",
  },
  {
    href: "/articles",
    title: "Card-vs-card comparisons",
    body: "Year-2 math for the matchups people actually weigh.",
    tag: "Articles",
  },
];

const steps = [
  { n: "1", title: `Answer ${quizQuestions.length} questions`, body: "Spending, travel, fee comfort, reward style." },
  { n: "2", title: "We price every card for you", body: "Rewards and credits you would really use." },
  { n: "3", title: "See net value after fees", body: "Dollars per year, with the math shown." },
];

export function LandingHero({ onStart }: LandingHeroProps) {
  const { top } = getExampleRecommendation();
  const trust = ["No signup, no credit check", "Rankings independent of issuer payouts"];
  const captured = top.estimatedNetValue + top.card.annualFee;

  return (
    <>
      <section id="quiz" className="scroll-mt-6 bg-navy text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-14 lg:pb-16 lg:pt-14">
          <div>
            <p className="text-sm font-semibold text-accent-bright">A MoneyFactor decision engine</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Find the credit card that actually fits you.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-blue-gray">
              Answer a few questions and we&apos;ll estimate which cards are worth the annual fee for your real spending, in dollars per year,
              with the math shown.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onStart}
                className="focus-ring rounded-md bg-accent px-8 py-4 text-lg font-bold text-navy shadow-soft transition hover:bg-accent-hover focus-visible:ring-offset-navy"
              >
                Start quiz
              </button>
              <Link
                href="/methodology"
                className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-white underline decoration-accent-bright/70 underline-offset-4 hover:text-blue-gray focus-visible:ring-offset-navy"
              >
                How we score cards
              </Link>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-sm font-medium text-blue-gray sm:flex-row sm:flex-wrap sm:gap-x-6">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="text-accent-bright" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside aria-labelledby="example-result-heading" className="rounded-2xl bg-white p-5 text-navy shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p id="example-result-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">
                Example result
              </p>
              <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">Best match</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <CardArt id={top.card.id} annualFee={top.card.annualFee} type={top.card.type} size="sm" context="hero" />
              <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight text-navy">{top.card.name}</h2>
                <p className="text-sm text-mid-navy/75">
                  {fitLabel(top.score)} · fit <span className="tabular-nums">{top.score}</span>/100
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-surface p-4">
              <p className="text-sm font-semibold text-mid-navy">Estimated net value</p>
              <p className={`mt-1 text-4xl font-semibold tabular-nums tracking-tight ${top.estimatedNetValue >= 0 ? "text-positive" : "text-negative"}`}>
                {top.estimatedNetValue >= 0 ? "+" : "−"}${Math.abs(Math.round(top.estimatedNetValue)).toLocaleString("en-US")}
                <span className="ml-1 text-base font-medium text-mid-navy/70">/ year</span>
              </p>
              <div className="mt-3">
                <ValueBar captured={captured} annualFee={top.card.annualFee} scaleMax={top.card.valueEstimateHigh} />
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-mid-navy/85">
              {top.explanationBullets.slice(0, 2).map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <Check />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-xs leading-5 text-mid-navy/80">
              Sample profile: {EXAMPLE_PROFILE_LABEL}. Computed by the same engine that scores your answers; not a recommendation for you.
            </p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
          <h2 id="how-heading" className="text-sm font-semibold text-accent-ink">
            How it works
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-4 rounded-xl border border-line bg-white p-4 shadow-card">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-accent-bright">
                  {step.n}
                </span>
                <span>
                  <span className="block font-semibold text-navy">{step.title}</span>
                  <span className="mt-0.5 block text-sm text-mid-navy/75">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onStart}
            className="focus-ring mt-6 w-full rounded-md bg-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-mid-navy sm:w-auto"
          >
            Find my card →
          </button>
        </div>
      </section>

      <section aria-labelledby="tools-heading" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
          <h2 id="tools-heading" className="text-lg font-semibold text-navy">
            More ways to check the math
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="focus-ring group flex flex-col rounded-xl border border-line bg-surface p-5 transition hover:border-accent hover:bg-white"
              >
                <span className="self-start rounded-full bg-navy px-2.5 py-0.5 text-xs font-bold text-accent-bright">{tool.tag}</span>
                <span className="mt-3 font-semibold text-navy group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                  {tool.title} →
                </span>
                <span className="mt-1 text-sm text-mid-navy/75">{tool.body}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
