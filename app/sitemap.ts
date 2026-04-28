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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedAt,
    })),
    ...getAllCreditCardProfileSlugs().map((slug) => ({
      url: absoluteUrl(`/cards/${slug}`),
      lastModified: now,
    })),
  ];
}
