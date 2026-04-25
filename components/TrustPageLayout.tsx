import type { TrustPage } from "@/data/trustPages";

type TrustPageLayoutProps = {
  page: TrustPage;
};

export function TrustPageLayout({ page }: TrustPageLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
      <header className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">{page.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-mid-navy/78 sm:text-lg">{page.summary}</p>
      </header>

      <div className="mt-5 grid gap-5">
        {page.sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6"
          >
            <h2 className="text-xl font-semibold text-navy">{section.heading}</h2>
            <div className="mt-3 space-y-4 text-sm leading-7 text-mid-navy/78">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
