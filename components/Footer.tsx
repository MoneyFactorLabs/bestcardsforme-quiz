import Link from "next/link";

export function Footer() {
  const links = [
    ["Our Methodology", "/methodology"],
    ["Editorial Standards", "/editorial-standards"],
    ["Affiliate Disclosure", "/affiliate-disclosure"],
    ["About MoneyFactor", "/about"],
    ["Contact", "mailto:editorial@moneyfactor.io"],
  ];

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-mid-navy/70 sm:px-8">
      <div className="grid gap-6 border-t border-blue-gray/70 pt-7 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="text-lg font-semibold text-navy">BestCardsForMe by MoneyFactor</p>
          <p className="mt-1 font-medium">Independent credit card analysis built on realistic annual-value math.</p>
          <p className="mt-3 text-xs leading-5 text-mid-navy/55">
            BestCardsForMe may receive compensation from partners. Editorial rankings are based on
            MoneyFactor scoring, consumer fit, and net value estimates. Verify current issuer terms
            before applying.
          </p>
        </div>
        <nav
          aria-label="Publisher trust pages"
          className="flex max-w-md flex-wrap gap-x-4 gap-y-2 md:justify-end md:text-right"
        >
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="font-semibold text-mid-navy transition hover:text-navy">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
