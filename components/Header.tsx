import Link from "next/link";

const navLinkBase =
  "focus-ring flex h-11 w-full items-center justify-center rounded-md border px-4 py-2 text-center text-sm font-bold leading-5 transition";

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
            className="grid w-full grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-2 md:w-[31rem] md:grid-cols-3 md:justify-end"
          >
            <Link
              href="/#quiz"
              className={`${navLinkBase} border-gold bg-gold text-navy hover:border-[#caa42f] hover:bg-[#caa42f]`}
            >
              Start Quiz
            </Link>
            <Link
              href="/articles"
              className={`${navLinkBase} border-blue-gray bg-white text-mid-navy hover:border-navy hover:text-navy`}
            >
              Browse Articles
            </Link>
            <Link
              href="/cards"
              className={`${navLinkBase} border-blue-gray bg-white text-mid-navy hover:border-navy hover:text-navy`}
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
