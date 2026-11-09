import Link from "next/link";
import { NetValuePanel, fitLabel } from "@/components/ResultsCard";
import { quizQuestions } from "@/data/questions";
import { EXAMPLE_PROFILE_LABEL, getExampleRecommendation } from "@/lib/exampleRecommendation";

type LandingHeroProps = {
  onStart: () => void;
};

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-positive">
    <path fill="currentColor" d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5.9-5.9 1.1 1.1z" />
  </svg>
);

const tools = [
  {
    href: "/tools/annual-fee-break-even-calculator",
    title: "Annual-fee break-even calculator",
    body: "See whether a fee pays for itself at your spending, against a no-fee 2% card.",
  },
  {
    href: "/credit-card-lounge-access",
    title: "Lounge access and guest costs",
    body: "Which cards get you into which lounges, and what bringing your family costs.",
  },
  {
    href: "/articles",
    title: "Card-vs-card comparisons",
    body: "Year-2 math for the matchups people actually weigh, with every assumption shown.",
  },
];

export function LandingHero({ onStart }: LandingHeroProps) {
  const { top } = getExampleRecommendation();
  const trust = [`${quizQuestions.length} questions`, "No signup, no credit check", "Rankings independent of issuer payouts"];

  return (
    <>
      <section
        id="quiz"
        className="scroll-mt-6 mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-center lg:gap-14 lg:pb-16 lg:pt-10"
      >
        <div>
          <p className="text-sm font-semibold text-gold-ink">A MoneyFactor decision engine</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
            Find the credit card that actually fits you.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-mid-navy/80">
            Answer a few questions and we&apos;ll estimate which cards are worth the annual fee for your real spending, in dollars
            per year, with the math shown.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="focus-ring rounded-md bg-gold px-7 py-4 text-base font-bold text-navy shadow-card transition hover:bg-[#caa42f]"
            >
              Start quiz
            </button>
            <Link href="/methodology" className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-mid-navy underline decoration-gold/60 underline-offset-4 hover:text-navy">
              How we score cards
            </Link>
          </div>
          <ul className="mt-6 flex flex-col gap-2 text-sm font-medium text-mid-navy sm:flex-row sm:flex-wrap sm:gap-x-6">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside aria-labelledby="example-result-heading" className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p id="example-result-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-gold-ink">
              Example result
            </p>
            <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">Best match</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-mid-navy/75">Sample profile: {EXAMPLE_PROFILE_LABEL}.</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy">{top.card.name}</h2>
          <p className="text-sm text-mid-navy/75">
            {fitLabel(top.score)} · fit score <span className="tabular-nums">{top.score}</span>/100
          </p>
          <div className="mt-4">
            <NetValuePanel recommendation={top} compact />
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-mid-navy/85">
            {top.explanationBullets.slice(0, 2).map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <Check />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-xs leading-5 text-mid-navy/65">
            Computed by the same engine that scores your answers. Your result depends on your spending; this is not a recommendation for you.
          </p>
        </aside>
      </section>

      <section aria-labelledby="tools-heading" className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-8">
        <h2 id="tools-heading" className="text-lg font-semibold text-navy">
          More ways to check the math
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="focus-ring group rounded-xl border border-line bg-white p-5 shadow-card transition hover:border-navy/40"
            >
              <p className="font-semibold text-navy group-hover:underline group-hover:decoration-gold/70 group-hover:underline-offset-4">{tool.title} →</p>
              <p className="mt-2 text-sm leading-6 text-mid-navy/75">{tool.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
