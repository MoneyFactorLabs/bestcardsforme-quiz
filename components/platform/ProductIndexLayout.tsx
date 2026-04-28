import Link from "next/link";

export type ProductIndexItem = {
  title: string;
  href: string;
  eyebrow?: string;
  description: string;
  meta: { label: string; value: string }[];
  ctaLabel?: string;
};

export type ProductIndexLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: ProductIndexItem[];
};

export function ProductIndexLayout({ eyebrow, title, description, items }: ProductIndexLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
      <header className="overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
        <div className="bg-navy px-5 py-8 text-white sm:px-8 sm:py-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-blue-gray sm:text-lg sm:leading-8">
            {description}
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["Profiles", `${items.length}`],
              ["Methodology", "MoneyFactor scorecard"],
              ["Use case", "Compare before applying"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-gray">
                  {label}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-7 rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Structured recommendation layer
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-navy">Card profiles built for comparison.</h2>
          </div>
          <p className="text-sm font-medium leading-7 text-mid-navy/80">
            Each profile keeps the core decision fields visible: annual fee, score, reward utility,
            skip conditions, and related editorial analysis.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.href} className="rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex h-full flex-col">
            <div className="flex flex-col gap-4">
              <div>
                {item.eyebrow && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    {item.eyebrow}
                  </p>
                )}
                <h2 className="mt-2 text-2xl font-semibold leading-tight text-navy sm:text-3xl">
                  <Link href={item.href} className="transition hover:text-mid-navy">
                    {item.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-mid-navy/90">
                  {item.description}
                </p>
              </div>
              <div className="grid gap-2 rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4 text-sm font-medium text-mid-navy/85 sm:grid-cols-3">
                {item.meta.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mid-navy/55">
                      {metric.label}
                    </p>
                    <p className="mt-1 font-semibold text-navy">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href={item.href}
              className="focus-ring mt-5 inline-flex justify-center rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-mid-navy sm:justify-start"
            >
              {item.ctaLabel || "View profile"}
            </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
