import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { articles, getArticleBySlug } from "@/data/articles";
import type { EditorialArticle } from "@/types/article";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = "https://www.bestcardsforme.com";

function getArticleUrl(slug: string) {
  return `${siteUrl}/articles/${slug}`;
}

function getArticleDescription(article: EditorialArticle) {
  return article.metaDescription || article.dek;
}

function stripArticleMarkup(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function buildArticleStructuredData(article: EditorialArticle) {
  const url = getArticleUrl(article.slug);
  const description = getArticleDescription(article);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      headline: article.title,
      description,
      datePublished: article.updatedAt,
      dateModified: article.updatedAt,
      author: {
        "@type": "Person",
        name: "Tim Finiki",
        url: `${siteUrl}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "MoneyFactor",
        url: siteUrl,
      },
      isPartOf: {
        "@type": "WebSite",
        name: "BestCardsForMe by MoneyFactor",
        url: siteUrl,
      },
    },
  ];

  if (article.faqs && article.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: stripArticleMarkup(faq.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripArticleMarkup(faq.answer),
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return {
    title: article ? `${article.title} | BestCardsForMe` : "Article | BestCardsForMe",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleStructuredData(article)),
        }}
      />
      <Header />
      <ArticleLayout article={article} />
      <Footer />
    </main>
  );
}
