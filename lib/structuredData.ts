import { absoluteUrl, siteConfig } from "@/lib/site";
import type { EditorialArticle } from "@/types/article";
import type { CreditCardProfile } from "@/types/creditCardProfile";

type SchemaNode = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function stripSchemaText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSchemaGraph(graph: SchemaNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildSiteStructuredData() {
  return buildSchemaGraph([
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "MoneyFactor",
      url: siteConfig.url,
      brand: {
        "@type": "Brand",
        name: siteConfig.name,
      },
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
    },
  ]);
}

export function buildBreadcrumbList(items: BreadcrumbItem[], currentPath: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(currentPath)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleStructuredData(article: EditorialArticle) {
  const path = `/articles/${article.slug}`;
  const url = absoluteUrl(path);
  const graph: SchemaNode[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      headline: article.title,
      description: stripSchemaText(article.metaDescription || article.dek),
      datePublished: article.updatedAt,
      dateModified: article.updatedAt,
      author: {
        "@type": "Person",
        name: "Tim",
        url: absoluteUrl("/about"),
      },
      publisher: {
        "@id": absoluteUrl("/#organization"),
      },
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
    },
    buildBreadcrumbList(
      [
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
        { name: article.title, path },
      ],
      path
    ),
  ];

  if (article.faqs && article.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: stripSchemaText(faq.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripSchemaText(faq.answer),
        },
      })),
    });
  }

  return buildSchemaGraph(graph);
}

export function buildArticlesIndexStructuredData(articles: EditorialArticle[]) {
  const path = "/articles";

  return buildSchemaGraph([
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      name: "Credit Card Articles",
      description:
        "Long-form credit card comparisons from BestCardsForMe by MoneyFactor, built around realistic annual value and household fit.",
      url: absoluteUrl(path),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
    },
    buildBreadcrumbList(
      [
        { name: "Home", path: "/" },
        { name: "Articles", path },
      ],
      path
    ),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl(path)}#itemlist`,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: absoluteUrl(`/articles/${article.slug}`),
      })),
    },
  ]);
}

export function buildCardsIndexStructuredData(profiles: CreditCardProfile[]) {
  const path = "/cards";

  return buildSchemaGraph([
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      name: "Credit Card Profiles",
      description:
        "Structured BestCardsForMe credit card profiles with MoneyFactor scores, annual-fee math, rewards summaries, perks, and skip conditions.",
      url: absoluteUrl(path),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
    },
    buildBreadcrumbList(
      [
        { name: "Home", path: "/" },
        { name: "Cards", path },
      ],
      path
    ),
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl(path)}#itemlist`,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: profile.cardName,
        url: absoluteUrl(`/cards/${profile.slug}`),
      })),
    },
  ]);
}

export function buildCardProfileStructuredData(profile: CreditCardProfile) {
  const path = `/cards/${profile.slug}`;
  const url = absoluteUrl(path);

  return buildSchemaGraph([
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: `${profile.cardName} Review`,
      description: stripSchemaText(profile.bestFor),
      url,
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      breadcrumb: {
        "@id": `${url}#breadcrumb`,
      },
      about: {
        "@id": `${url}#financial-product`,
      },
    },
    buildBreadcrumbList(
      [
        { name: "Home", path: "/" },
        { name: "Cards", path: "/cards" },
        { name: profile.cardName, path },
      ],
      path
    ),
    {
      "@type": "FinancialProduct",
      "@id": `${url}#financial-product`,
      name: profile.cardName,
      description: stripSchemaText(profile.bestFor),
      url,
      category: "Credit card",
      provider: {
        "@type": "Organization",
        name: profile.issuer,
      },
      feesAndCommissionsSpecification: `Annual fee: ${
        profile.annualFee === 0 ? "$0" : `$${profile.annualFee}`
      }`,
    },
  ]);
}

export function buildTrustPageStructuredData(page: { slug: string; title: string; summary: string }) {
  const path = `/${page.slug}`;

  return buildSchemaGraph([
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      name: page.title,
      description: stripSchemaText(page.summary),
      url: absoluteUrl(path),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      breadcrumb: {
        "@id": `${absoluteUrl(path)}#breadcrumb`,
      },
    },
    buildBreadcrumbList(
      [
        { name: "Home", path: "/" },
        { name: page.title, path },
      ],
      path
    ),
  ]);
}
