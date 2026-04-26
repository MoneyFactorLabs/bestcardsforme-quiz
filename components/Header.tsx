export function Header() {
  return (
    <header>
      <div className="border-b border-blue-gray/60 bg-navy px-4 py-2 text-center text-xs font-semibold leading-5 text-blue-gray sm:px-8">
        BestCardsForMe by MoneyFactor may receive compensation from partners, but recommendations are driven by
        independent MoneyFactor scoring and editorial review.
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div>
          <p className="text-xl font-semibold tracking-[0.02em] text-navy">BestCardsForMe</p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mid-navy/70">
            by MoneyFactor
          </p>
        </div>
        <p className="hidden max-w-xs text-right text-sm font-medium text-mid-navy sm:block">
          The real math behind every credit card decision.
        </p>
      </div>
    </header>
  );
}
