import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { articles, getArticleBySlug } from "@/data/articles";
import { absoluteUrl } from "@/lib/site";
import { buildArticleStructuredData } from "@/lib/structuredData";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getArticleUrl(slug: string) {
  return absoluteUrl(`/articles/${slug}`);
}

const articleSeoTitleOverrides: Record<string, string> = {
  "amex-platinum-vs-chase-sapphire-reserve-2026":
    "Amex Platinum vs Chase Sapphire Reserve 2026",
  "is-chase-sapphire-reserve-worth-it-2026":
    "Chase Sapphire Reserve $795 Fee 2026: Worth It?",
  "best-credit-card-for-dining-restaurants-2026":
    "Best Dining Credit Card 2026: Cash Back vs Points",
  "credit-card-strategy-200k-400k-household-income-2026":
    "Credit Card Strategy for $200k–$400k Households (2026)",
  "best-second-credit-card-for-premium-card-owners-2026":
    "Best Second Card for Amex Platinum or Sapphire Reserve Owners",
  "multiple-premium-credit-cards-vs-one-2026":
    "Two or Three Premium Cards vs One: Annual-Fee Math (2026)",
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return {
    title: article
      ? `${articleSeoTitleOverrides[article.slug] || article.title} | BestCardsForMe`
      : "Article | BestCardsForMe",
    description:
      article?.metaDescription || article?.dek || "BestCardsForMe credit card comparison article.",
    alternates: article
      ? {
          canonical: getArticleUrl(article.slug),
        }
      : undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <main className="min-h-screen">
      <JsonLd data={buildArticleStructuredData(article)} />
      <Header />
      <ArticleLayout article={article} />
      <Footer />
    </main>
  );
}
