import Link from "next/link";

export function Header() {
  return (
    <header>
      <div className="border-b border-blue-gray/60 bg-navy px-4 py-2 text-center text-xs font-semibold leading-5 text-blue-gray sm:px-8">
        BestCardsForMe by MoneyFactor may receive compensation from partners, but recommendations are driven by
        independent MoneyFactor scoring and editorial review.
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="focus-ring rounded-sm transition hover:text-mid-navy">
          <p className="text-xl font-semibold tracking-[0.02em] text-navy">BestCardsForMe</p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mid-navy/70">
            by MoneyFactor
          </p>
        </Link>
        <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap gap-2 md:justify-end"
          >
            <Link
              href="/#quiz"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-gold bg-gold px-4 py-2 text-sm font-bold text-navy transition hover:border-[#caa42f] hover:bg-[#caa42f]"
            >
              Start Quiz
            </Link>
            <Link
              href="/articles"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-blue-gray bg-white px-4 py-2 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
            >
              Browse Articles
            </Link>
            <Link
              href="/cards"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-blue-gray bg-white px-4 py-2 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
            >
              Explore Cards
            </Link>
          </nav>
          <p className="hidden max-w-xs text-right text-sm font-medium text-mid-navy sm:block">
            The real math behind every credit card decision.
          </p>
        </div>
      </div>
    </header>
  );
}
