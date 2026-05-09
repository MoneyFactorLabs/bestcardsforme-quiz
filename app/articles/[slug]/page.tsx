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
