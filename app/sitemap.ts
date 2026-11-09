import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { creditCardProfiles, getAllCreditCardProfileSlugs } from "@/data/creditCardProfiles";
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
  "/tools/annual-fee-break-even-calculator",
  "/credit-card-lounge-access",
];

function sitemapEntry(url: string, lastModified?: string | Date): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(url),
    ...(lastModified ? { lastModified } : {}),
  };
}

// lastmod is only set from real review dates. Stamping every page with the build
// time on each deploy makes lastmod unreliable, and Google ignores it when it is.
const cardReviewedAt = new Map(creditCardProfiles.map((profile) => [profile.slug, profile.reviewedAt]));

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    ...staticRoutes.map((route) => sitemapEntry(route)),
    ...articles.map((article) => sitemapEntry(`/articles/${article.slug}`, article.updatedAt)),
    ...getAllCreditCardProfileSlugs().map((slug) => sitemapEntry(`/cards/${slug}`, cardReviewedAt.get(slug))),
  ];
  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();

  entries.forEach((entry) => {
    uniqueEntries.set(entry.url, entry);
  });

  return Array.from(uniqueEntries.values());
}
