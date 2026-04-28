import type { EditorialArticle } from "@/types/article";

export const articles: EditorialArticle[] = [];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
