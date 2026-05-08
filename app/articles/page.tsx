import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { articles } from "@/data/articles";
import { buildArticlesIndexStructuredData } from "@/lib/structuredData";

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

function cleanExcerpt(value: string) {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ArticlesIndexPage() {
  const [featuredArticle, ...otherArticles] = articles;
  const spotlightArticles = otherArticles.slice(0, 2);
  const latestArticles = otherArticles.slice(2);

  return (
    <main className="min-h-screen">
      <JsonLd data={buildArticlesIndexStructuredData(articles)} />
      <Header />
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
        <header className="overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
          <div className="bg-navy px-5 py-8 text-white sm:px-8 sm:py-10">
            <p className="eyebrow-wrap text-sm font-bold uppercase tracking-[0.22em] text-gold">
              BestCardsForMe Articles
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
              Credit card comparisons built on real financial math.
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-blue-gray sm:text-lg sm:leading-8">
              Premium editorial analysis for readers who want net value, break-even math, and
              honest tradeoffs before choosing a card.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["Live guides", `${articles.length}`],
                ["Review standard", "Net annual value"],
                ["Editorial lens", "Independent scoring"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-gray">
                    {label}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {featuredArticle && (
          <article className="mt-7 overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-5 sm:p-7">
                <p className="eyebrow-wrap text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Featured honest-math analysis
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-4xl">
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="transition hover:text-mid-navy"
                  >
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-mid-navy/85">
                  {cleanExcerpt(featuredArticle.dek)}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredArticle.comparisonMetrics?.slice(0, 3).map((metric) => (
                    <span
                      key={metric.label}
                      className="rounded-md border border-blue-gray/70 bg-[#f8fafc] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-mid-navy/70"
                    >
                      {metric.label}: {metric.value}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="focus-ring mt-6 inline-flex rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-mid-navy"
                >
                  Read featured analysis
                </Link>
              </div>
              <div className="border-t border-blue-gray/70 bg-[#f8fafc] p-5 sm:p-7 lg:border-l lg:border-t-0">
                <p className="text-sm font-semibold text-navy">MoneyFactor editorial promise</p>
                <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/80">
                  Articles prioritize renewal economics, realistic benefit capture, and profile fit
                  over issuer-stated headline value or short-lived welcome offers.
                </p>
                <div className="mt-5 grid gap-3">
                  {["Break-even math", "FAQ clarity", "Internal card profiles"].map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-blue-gray/70 bg-white px-4 py-3 text-sm font-semibold text-mid-navy"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}

        {spotlightArticles.length > 0 && (
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {spotlightArticles.map((article) => (
              <article
                key={article.slug}
                className="rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-6"
              >
                <p className="eyebrow-wrap text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {article.category}
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight text-navy">
                  <Link href={`/articles/${article.slug}`} className="transition hover:text-mid-navy">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm font-medium leading-7 text-mid-navy/85">
                  {cleanExcerpt(article.dek)}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-blue-gray/70 pt-4">
                  <p className="text-sm font-semibold text-mid-navy/70">
                    {formatDate(article.updatedAt)} - {article.readingTime}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="focus-ring rounded-md border border-navy px-4 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
                  >
                    Read
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3 rounded-lg border border-gold/40 bg-gold/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-navy">Want a personalized answer first?</p>
            <p className="mt-1 text-sm leading-6 text-mid-navy/75">
              The quiz ranks cards against your answers, then the articles explain the broader math.
            </p>
          </div>
          <Link
            href="/"
            className="focus-ring rounded-md bg-navy px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-mid-navy"
          >
            Start the quiz
          </Link>
        </div>

        <div className="mt-7 grid gap-6">
          {latestArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="eyebrow-wrap text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    {article.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight text-navy sm:text-3xl">
                    <Link href={`/articles/${article.slug}`} className="transition hover:text-mid-navy">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-mid-navy/90">
                    {cleanExcerpt(article.dek)}
                  </p>
                </div>
                <div className="shrink-0 rounded-md border border-blue-gray/70 bg-[#f8fafc] px-4 py-3 text-sm font-medium text-mid-navy/85 md:max-w-52">
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
