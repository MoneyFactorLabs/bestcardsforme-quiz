import Link from "next/link";
import type { ReactNode } from "react";
import type { TrustPage } from "@/data/trustPages";

type TrustPageLayoutProps = {
  page: TrustPage;
};

function renderInlineText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${token}-${match.index}`} className="font-bold text-navy">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={`${token}-${match.index}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        nodes.push(
          <Link
            key={`${href}-${match.index}`}
            href={href}
            className="font-bold text-navy underline decoration-gold/70 underline-offset-4 transition hover:text-mid-navy"
          >
            {label}
          </Link>
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function TrustPageLayout({ page }: TrustPageLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
      <header className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">{page.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-mid-navy/75 sm:text-lg">{page.summary}</p>
      </header>

      <div className="mt-5 grid gap-5">
        {page.sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6"
          >
            <h2 className="text-xl font-semibold text-navy">{section.heading}</h2>
            <div className="mt-3 space-y-4 text-sm leading-7 text-mid-navy/75">
              {section.blocks
                ? section.blocks.map((block, index) => {
                    if (block.type === "subheading") {
                      return (
                        <h3
                          key={`${block.heading}-${index}`}
                          className="pt-2 text-base font-semibold text-navy"
                        >
                          {block.heading}
                        </h3>
                      );
                    }

                    if (block.type === "bullets") {
                      return (
                        <ul
                          key={`bullets-${index}`}
                          className="grid gap-3 border-t border-blue-gray/60 pt-4"
                        >
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 rounded-md border border-blue-gray/60 bg-[#f8fafc] p-3"
                            >
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                              <span>{renderInlineText(item)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return <p key={`${block.text}-${index}`}>{renderInlineText(block.text)}</p>;
                  })
                : section.body?.map((paragraph) => (
                    <p key={paragraph}>{renderInlineText(paragraph)}</p>
                  ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
