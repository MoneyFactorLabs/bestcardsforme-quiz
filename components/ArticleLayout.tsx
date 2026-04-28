import Link from "next/link";
import type { ReactNode } from "react";
import { ArticleAffiliateCta } from "@/components/ArticleAffiliateCta";
import { ArticleMoneyFactorScorecard } from "@/components/ArticleMoneyFactorScorecard";
import { RelatedArticles } from "@/components/RelatedArticles";
import { articles } from "@/data/articles";
import { cards } from "@/data/cards";
import type { CreditCard } from "@/types/card";
import type { ArticleTable, EditorialArticle } from "@/types/article";

type ArticleLayoutProps = {
  article: EditorialArticle;
};

type ResolvedCardCta = NonNullable<EditorialArticle["cardCtas"]>[number] & {
  card: CreditCard;
};

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function renderPlainText(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const financialPattern =
    /([-+]?\$\d+(?:,\d{3})*(?:\s*(?:-|to)\s*[-+]?\$?\d+(?:,\d{3})*)?(?:\s*(?:per year|annually))?|\d{1,3}(?:-\d{1,3})%)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = financialPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <span
        key={`${keyPrefix}-money-${match.index}`}
        className="rounded-sm bg-gold/10 px-1 font-bold text-navy"
      >
        {match[0]}
      </span>
    );

    lastIndex = financialPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderInlineText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...renderPlainText(text.slice(lastIndex, match.index), `plain-${lastIndex}`));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(
        <strong
          key={`${token}-${match.index}`}
          className="rounded-sm bg-gold/10 px-1 font-bold text-navy"
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={`${token}-${match.index}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        nodes.push(
          <Link
            key={`${href}-${match.index}`}
            href={href}
            className="font-bold text-navy underline decoration-gold/70 underline-offset-4 transition hover:text-mid-navy"
          >
            {label}
          </Link>
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(...renderPlainText(text.slice(lastIndex), `plain-${lastIndex}`));
  }

  return nodes;
}

function ArticleDataTable({ table }: { table: ArticleTable }) {
  return (
    <div className="mt-4 min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-blue-gray/70 bg-white">
      <div className="min-w-0 w-full max-w-full overflow-x-auto">
        <table className="w-full min-w-[720px] divide-y divide-blue-gray/70 text-left text-sm">
          <thead className="bg-navy text-white">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-blue-gray"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-gray/60">
            {table.rows.map((row) => (
              <tr key={row.join("|")} className="bg-white even:bg-[#f8fafc]">
                {row.map((cell, index) => (
                  <td
                    key={`${row.join("|")}-${index}`}
                    className={`px-4 py-4 align-top leading-7 text-mid-navy/90 ${
                      index === 0 ? "font-bold text-navy" : "font-medium"
                    }`}
                  >
                    {renderInlineText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ArticleLayout({ article }: ArticleLayoutProps) {
  const cardCtas = article.cardCtas
    ?.map((cta) => ({
      ...cta,
      card: cards.find((card) => card.id === cta.cardId),
    }))
    .filter((cta): cta is ResolvedCardCta => Boolean(cta.card));

  return (
    <article className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-10">
      <Link
        href="/"
        className="focus-ring inline-flex rounded-md border border-blue-gray bg-white px-4 py-2 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
      >
        Back to BestCardsForMe
      </Link>

      <header className="mt-5 overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
        <div className="bg-navy px-5 py-8 text-white sm:px-8 sm:py-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
            {article.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-blue-gray sm:text-lg sm:leading-8">
            {article.dek}
          </p>
        </div>

        <div className="grid gap-px bg-blue-gray/70 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Category", article.category],
            ["Updated", formatDate(article.updatedAt)],
            ["Reviewed by", article.reviewedBy],
            ["Read time", article.readingTime],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
                {label}
              </p>
              <p className="mt-2 text-lg font-bold leading-6 text-navy">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="mt-7 grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="grid min-w-0 gap-6 sm:gap-7">
          <section className="min-w-0 rounded-lg border border-blue-gray/80 bg-[#f8fafc] p-5 shadow-soft sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Editorial standard
            </p>
            <p className="mt-2 text-sm font-medium leading-7 text-mid-navy/85">
              BestCardsForMe articles are built around realistic annual value, fit, issuer-term
              caveats, and plain-English tradeoffs. Compensation may exist, but editorial judgment
              is designed around consumer value.
            </p>
          </section>

          {article.comparisonMetrics && article.comparisonMetrics.length > 0 && (
            <section className="min-w-0 rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7">
              <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
              <h2 className="text-xl font-semibold text-navy sm:text-2xl">
                Comparison snapshot
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {article.comparisonMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/55">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-lg font-bold leading-7 text-navy">
                      {renderInlineText(metric.value)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {article.scorecard && <ArticleMoneyFactorScorecard scorecard={article.scorecard} />}

          {article.sections.map((section) => (
            <section
              key={section.heading}
              className="min-w-0 rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7"
            >
              <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
              <h2 className="text-xl font-semibold text-navy sm:text-2xl">{section.heading}</h2>
              <div className="mt-4 space-y-5 text-[1.02rem] font-medium leading-8 text-mid-navy/90">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{renderInlineText(paragraph)}</p>
                ))}
                {section.table && <ArticleDataTable table={section.table} />}
                {section.subsections && (
                  <div className="grid gap-5 pt-1">
                    {section.subsections.map((subsection) => (
                      <div
                        key={subsection.heading}
                        className="rounded-lg border border-blue-gray/70 bg-[#f8fafc] p-4 sm:p-5"
                      >
                        <h3 className="text-lg font-semibold text-navy">{subsection.heading}</h3>
                        {subsection.body && (
                          <div className="mt-3 space-y-3 text-[0.98rem] font-medium leading-8 text-mid-navy/90">
                            {subsection.body.map((paragraph) => (
                              <p key={paragraph}>{renderInlineText(paragraph)}</p>
                            ))}
                          </div>
                        )}
                        {subsection.table && <ArticleDataTable table={subsection.table} />}
                        {subsection.bullets && (
                          <ul className="mt-4 grid gap-3 border-t border-blue-gray/60 pt-4 text-[0.95rem] font-medium leading-7 text-mid-navy/90">
                            {subsection.bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex gap-3 rounded-md border border-blue-gray/60 bg-white p-3 sm:p-4"
                              >
                                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                                <span>{renderInlineText(bullet)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="grid gap-3 border-t border-blue-gray/60 pt-4 text-[0.95rem] font-medium leading-7 text-mid-navy/90">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 rounded-md border border-blue-gray/60 bg-[#f8fafc] p-3 sm:p-4"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{renderInlineText(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {article.recommendationCta && (
            <ArticleAffiliateCta recommendation={article.recommendationCta} />
          )}

          {cardCtas && cardCtas.length > 0 && (
            <section className="min-w-0 rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7">
              <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
              <h2 className="text-xl font-semibold text-navy sm:text-2xl">
                Related card reviews
              </h2>
              <div className="mt-4 grid gap-4">
                {cardCtas.map(({ card, headline, body, label }) => (
                  <div
                    key={card.id}
                    className="rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4"
                  >
                    <p className="text-base font-semibold text-navy">{headline}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-mid-navy/85">{body}</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-mid-navy/80">{card.name}</p>
                      <Link
                        href={`/cards/${card.id}`}
                        className="focus-ring rounded-md bg-navy px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-mid-navy"
                      >
                        {label || "Read honest review"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <RelatedArticles suggestions={article.relatedArticles} articles={articles} />
          )}

          {article.faqs && article.faqs.length > 0 && (
            <section className="min-w-0 rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7">
              <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
              <h2 className="text-xl font-semibold text-navy sm:text-2xl">FAQ</h2>
              <div className="mt-4 grid gap-3">
                {article.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-md border border-blue-gray/60 bg-[#f8fafc] p-4"
                  >
                    <h3 className="text-base font-semibold text-navy">{faq.question}</h3>
                    <p className="mt-2 text-sm font-medium leading-7 text-mid-navy/90">
                      {renderInlineText(faq.answer)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft lg:sticky lg:top-5">
          <div className="bg-navy p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
              MoneyFactor lens
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Read for net value</h2>
            <p className="mt-3 text-sm leading-6 text-blue-gray">
              The strongest card is the one whose benefits are likely to be used after fees,
              restrictions, and redemption friction.
            </p>
          </div>
          <div className="grid gap-3 p-5">
            <Link
              href="/"
              className="focus-ring rounded-md bg-gold px-4 py-3 text-center text-sm font-bold text-navy transition hover:bg-[#caa42f]"
            >
              Take the card quiz
            </Link>
            <Link
              href="/methodology"
              className="focus-ring rounded-md border border-blue-gray px-4 py-3 text-center text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
            >
              View methodology
            </Link>
            {article.disclosureCta && (
              <div className="rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4">
                <p className="text-sm font-semibold text-navy">{article.disclosureCta.heading}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-mid-navy/85">
                  {article.disclosureCta.body}
                </p>
                <Link
                  href={article.disclosureCta.href}
                  className="mt-3 inline-flex text-sm font-bold text-mid-navy transition hover:text-navy"
                >
                  {article.disclosureCta.label}
                </Link>
              </div>
            )}
            <div className="rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4">
              <p className="text-sm font-semibold text-navy">Terms can change</p>
              <p className="mt-2 text-sm font-medium leading-6 text-mid-navy/85">
                Issuer terms, public offers, fees, credits, and eligibility rules should be
                verified before any application decision.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
