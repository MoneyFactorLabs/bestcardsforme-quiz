import Link from "next/link";

export function Footer() {
  const links = [
    ["Our Methodology", "/methodology"],
    ["Editorial Standards", "/editorial-standards"],
    ["Affiliate Disclosure", "/affiliate-disclosure"],
    ["About MoneyFactor", "/about"],
  ];

  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-mid-navy/65 sm:px-8">
      <div className="grid gap-5 border-t border-blue-gray/70 pt-6 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="font-semibold text-navy">BestCardsForMe by MoneyFactor</p>
          <p className="mt-1">MoneyFactor — The Real Math Behind Every Money Decision</p>
          <p className="mt-3 text-xs leading-5 text-mid-navy/55">
            Educational estimates only. Verify current issuer terms before applying.
          </p>
        </div>
        <nav aria-label="Publisher trust pages" className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
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
