import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { getAllCreditCardProfileSlugs } from "@/data/creditCardProfiles";
import { absoluteUrl } from "@/lib/site";

const staticRoutes = [
  "/",
  "/articles",
  "/cards",
  "/about",
  "/methodology",
  "/how-we-review-credit-cards",
  "/editorial-standards",
  "/affiliate-disclosure",
  "/contact",
];

function sitemapEntry(url: string, lastModified?: string | Date): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(url),
    ...(lastModified ? { lastModified } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries = [
    ...staticRoutes.map((route) => sitemapEntry(route, now)),
    ...articles.map((article) => sitemapEntry(`/articles/${article.slug}`, article.updatedAt)),
    ...getAllCreditCardProfileSlugs().map((slug) => sitemapEntry(`/cards/${slug}`, now)),
  ];
  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();

  entries.forEach((entry) => {
    uniqueEntries.set(entry.url, entry);
  });

  return Array.from(uniqueEntries.values());
}
