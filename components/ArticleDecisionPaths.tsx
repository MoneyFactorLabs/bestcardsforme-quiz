import Link from "next/link";
import { articleInternalLinkMap } from "@/lib/articleInternalLinks";
import type { EditorialArticle } from "@/types/article";

type ArticleDecisionPathsProps = {
  article: EditorialArticle;
  articles: EditorialArticle[];
};

export function ArticleDecisionPaths({ article, articles }: ArticleDecisionPathsProps) {
  const links = (articleInternalLinkMap[article.slug] || [])
    .map((link) => ({
      ...link,
      article: articles.find((candidate) => candidate.slug === link.slug),
    }))
    .filter((link): link is typeof link & { article: EditorialArticle } => Boolean(link.article))
    .slice(0, 5);

  if (links.length === 0) return null;

  return (
    <section className="min-w-0 rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
            Decision paths
          </p>
          <h2 className="mt-2 text-xl font-semibold text-navy">Where to go from this guide</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-mid-navy/85">
            These internal links follow the MoneyFactor map for upgrade, downgrade, comparison,
            and adjacent-category decisions.
          </p>
        </div>
        <Link
          href="/methodology"
          className="focus-ring shrink-0 rounded-md border border-blue-gray px-4 py-2 text-center text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
        >
          Review methodology
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <Link
            key={link.slug}
            href={`/articles/${link.slug}`}
            className="focus-ring rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4 transition hover:border-gold hover:bg-white"
          >
            <p className="text-sm font-bold text-navy">{link.anchor}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-mid-navy/55">
              {link.reason}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
