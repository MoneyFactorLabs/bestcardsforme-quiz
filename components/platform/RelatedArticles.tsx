import Link from "next/link";

export type RelatedArticleItem = {
  title: string;
  href: string;
  dek?: string;
  label?: string;
};

export type RelatedArticlesProps = {
  title?: string;
  items: RelatedArticleItem[];
};

export function RelatedArticles({ title = "Related analysis", items }: RelatedArticlesProps) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-4 h-1.5 w-14 rounded-full bg-gold" />
      <h2 className="text-xl font-semibold text-navy sm:text-2xl">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="focus-ring rounded-md border border-blue-gray/70 bg-[#f8fafc] p-4 transition hover:border-gold hover:bg-white"
          >
            {item.label && (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                {item.label}
              </p>
            )}
            <h3 className="mt-2 text-base font-semibold leading-6 text-navy">{item.title}</h3>
            {item.dek && (
              <p className="mt-2 text-sm font-medium leading-6 text-mid-navy/80">{item.dek}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
