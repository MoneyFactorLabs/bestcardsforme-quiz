import Link from "next/link";
import type { ReactNode } from "react";
import { RecommendationCTA, type RecommendationCTAProps } from "@/components/platform/RecommendationCTA";
import { RelatedArticles, type RelatedArticleItem } from "@/components/platform/RelatedArticles";
import { Scorecard, type ScorecardProps } from "@/components/platform/Scorecard";

export type ProductProfileSection = {
  title: string;
  body?: string;
  items?: string[];
  rows?: { label: string; value: string; emphasis?: boolean }[];
  links?: { href: string; label: string; description: string }[];
  footnotes?: string[];
};

export type ProductProfileLayoutProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta: { label: string; value: string }[];
  reviewedLabel: string;
  scorecard?: ScorecardProps;
  sections: ProductProfileSection[];
  recommendationCta: RecommendationCTAProps;
  relatedArticles?: RelatedArticleItem[];
  sidebar?: ReactNode;
  children?: ReactNode;
};

function ProductSection({ section }: { section: ProductProfileSection }) {
  return (
    <section className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-3 h-1 w-12 rounded-full bg-gold" />
      <h2 className="text-xl font-semibold text-navy sm:text-2xl">{section.title}</h2>
      {section.body && (
        <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/80">{section.body}</p>
      )}
      {section.items && section.items.length > 0 && (
        <ul className="mt-3 space-y-3 text-sm font-medium leading-7 text-mid-navy/80">
          {section.items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.rows && section.rows.length > 0 && (
        <dl className="mt-4 divide-y divide-blue-gray/60 overflow-hidden rounded-md border border-blue-gray/70 text-sm">
          {section.rows.map((row, index) => (
            <div
              key={index}
              className={`flex items-start justify-between gap-4 px-4 py-3 ${
                row.emphasis ? "bg-gold/10 font-bold text-navy" : "bg-white text-mid-navy/85"
              }`}
            >
              <dt className="min-w-0 font-medium">{row.label}</dt>
              <dd className="shrink-0 font-bold text-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {section.links && section.links.length > 0 && (
        <ul className="mt-3 grid gap-3">
          {section.links.map((link) => (
            <li key={link.href} className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
              <Link
                href={link.href}
                className="font-bold text-navy underline decoration-gold/70 underline-offset-4 transition hover:text-mid-navy"
              >
                {link.label}
              </Link>
              <p className="mt-1 text-sm font-medium leading-6 text-mid-navy/80">{link.description}</p>
            </li>
          ))}
        </ul>
      )}
      {section.footnotes?.map((footnote, index) => (
        <p key={index} className="mt-3 text-sm font-medium leading-7 text-mid-navy/80">
          {footnote}
        </p>
      ))}
    </section>
  );
}

export function ProductProfileLayout({
  backHref,
  backLabel,
  eyebrow,
  title,
  subtitle,
  meta,
  reviewedLabel,
  scorecard,
  sections,
  recommendationCta,
  relatedArticles,
  sidebar,
  children,
}: ProductProfileLayoutProps) {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-10">
      <Link
        href={backHref}
        className="focus-ring inline-flex rounded-md border border-blue-gray bg-white px-4 py-2 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
      >
        {backLabel}
      </Link>

      <header className="mt-5 overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft">
        <div className="bg-navy px-5 py-7 text-white sm:px-8 sm:py-9">
          <p className="eyebrow-wrap text-sm font-bold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-3xl text-base leading-7 text-blue-gray sm:text-lg sm:leading-8">
              {subtitle}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            {[reviewedLabel, "Independent MoneyFactor scoring", "Issuer terms can change"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-gray"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="grid gap-px bg-blue-gray/70 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label} className="bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold leading-6 text-navy">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="mt-5 rounded-lg border border-gold/40 bg-gold/10 p-5">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              MoneyFactor review posture
            </p>
            <h2 className="mt-2 text-xl font-semibold text-navy">
              We review the card as a household decision, not a marketing offer.
            </h2>
          </div>
          <p className="text-sm font-medium leading-7 text-mid-navy/80">
            The scorecard below weighs rewards, annual-fee justification, travel utility, everyday
            usefulness, and management complexity before the call-to-action appears.
          </p>
        </div>
      </section>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="grid min-w-0 gap-5">
          {scorecard && <Scorecard {...scorecard} />}

          {sections.map((section) => (
            <ProductSection key={section.title} section={section} />
          ))}

          <RecommendationCTA {...recommendationCta} />

          {relatedArticles && relatedArticles.length > 0 && (
            <RelatedArticles items={relatedArticles} />
          )}

          {children}
        </div>

        {sidebar && <div className="min-w-0 w-full">{sidebar}</div>}
      </div>
    </article>
  );
}
