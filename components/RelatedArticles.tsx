import {
  RelatedArticles as PlatformRelatedArticles,
  type RelatedArticleItem,
} from "@/components/platform/RelatedArticles";
import type { ArticleRelatedSuggestion, EditorialArticle } from "@/types/article";

type RelatedArticlesProps = {
  suggestions: ArticleRelatedSuggestion[];
  articles?: EditorialArticle[];
};

function resolveSuggestion(
  suggestion: ArticleRelatedSuggestion,
  articles: EditorialArticle[] = [],
) {
  const matchedArticle = suggestion.slug
    ? articles.find((article) => article.slug === suggestion.slug)
    : undefined;

  const href = suggestion.href || (suggestion.slug ? `/articles/${suggestion.slug}` : "#");

  return {
    href,
    label: suggestion.label || matchedArticle?.category || "Related analysis",
    title: suggestion.title || matchedArticle?.title || "Related BestCardsForMe analysis",
    dek: suggestion.dek || matchedArticle?.dek || "Continue with another MoneyFactor comparison.",
  };
}

export function RelatedArticles({ suggestions, articles }: RelatedArticlesProps) {
  if (suggestions.length === 0) return null;

  const items: RelatedArticleItem[] = suggestions.map((suggestion) =>
    resolveSuggestion(suggestion, articles),
  );

  return <PlatformRelatedArticles items={items} />;
}
