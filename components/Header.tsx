export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <div>
        <p className="text-xl font-semibold tracking-[0.02em] text-navy">BestCardsForMe</p>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mid-navy/70">
          by MoneyFactor
        </p>
      </div>
      <p className="hidden max-w-xs text-right text-sm font-medium text-mid-navy sm:block">
        The real math behind every credit card decision.
      </p>
    </header>
  );
}
