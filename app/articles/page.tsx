import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Credit Card Articles | BestCardsForMe by MoneyFactor",
  description:
    "Long-form credit card comparisons from BestCardsForMe by MoneyFactor, built around realistic annual value and household fit.",
};

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default function ArticlesIndexPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
        <header className="overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft">
          <div className="bg-navy px-5 py-8 text-white sm:px-8 sm:py-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
              BestCardsForMe Articles
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
              Credit card comparisons built on real financial math.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-blue-gray sm:text-lg sm:leading-8">
              Premium editorial analysis for readers who want net value, break-even math, and
              honest tradeoffs before choosing a card.
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-5">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    {article.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight text-navy sm:text-3xl">
                    <Link href={`/articles/${article.slug}`} className="transition hover:text-mid-navy">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-mid-navy/75">
                    {article.dek}
                  </p>
                </div>
                <div className="shrink-0 rounded-md border border-blue-gray/70 bg-[#f8fafc] px-4 py-3 text-sm text-mid-navy/70 md:max-w-52">
                  <p className="font-semibold text-navy">{formatDate(article.updatedAt)}</p>
                  <p className="mt-1">{article.readingTime}</p>
                </div>
              </div>
              <Link
                href={`/articles/${article.slug}`}
                className="focus-ring mt-5 inline-flex rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-mid-navy"
              >
                Read analysis
              </Link>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
