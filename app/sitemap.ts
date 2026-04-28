import type { MetadataRoute } from "next";
import { cards } from "@/data/cards";
import { articles } from "@/data/articles";
import { absoluteUrl } from "@/lib/site";

const staticRoutes = [
  "/",
  "/articles",
  "/about",
  "/methodology",
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
    ...cards.map((card) => ({
      url: absoluteUrl(`/cards/${card.id}`),
      lastModified: now,
    })),
  ];
}
