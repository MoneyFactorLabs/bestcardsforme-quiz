import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cards } from "@/data/cards";

type CardDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return cards.map((card) => ({
    id: card.id,
  }));
}

export async function generateMetadata({ params }: CardDetailsPageProps) {
  const { id } = await params;
  const card = cards.find((item) => item.id === id);

  return {
    title: card ? `${card.name} | BestCardsForMe` : "Card Details | BestCardsForMe",
  };
}

export default async function CardDetailsPage({ params }: CardDetailsPageProps) {
  const { id } = await params;
  const card = cards.find((item) => item.id === id);

  if (!card) notFound();

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto w-full max-w-5xl px-4 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-10">
        <Link
          href="/"
          className="focus-ring inline-flex rounded-md border border-blue-gray px-4 py-2 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
        >
          Back to quiz
        </Link>

        <article className="mt-5 rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
            Placeholder card detail
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-5xl">
            {card.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-mid-navy/80">
            This V1.5 detail page is ready for deeper editorial review, offer checks, and future
            affiliate disclosures. For now, it keeps the same honest-math framing from the quiz.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-[#f5f8fb] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
                Annual fee
              </p>
              <p className="mt-1 text-xl font-semibold text-navy">${card.annualFee}</p>
            </div>
            <div className="rounded-md bg-[#f5f8fb] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
                Estimated value
              </p>
              <p className="mt-1 text-xl font-semibold text-navy">{card.realisticAnnualValue}</p>
            </div>
            <div className="rounded-md bg-[#f5f8fb] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">Type</p>
              <p className="mt-1 text-xl font-semibold capitalize text-navy">{card.type}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <section className="rounded-md border border-blue-gray/70 p-4">
              <h2 className="text-lg font-semibold text-navy">Best for</h2>
              <p className="mt-2 text-sm leading-6 text-mid-navy/75">{card.bestFor}</p>
            </section>
            <section className="rounded-md border border-blue-gray/70 p-4">
              <h2 className="text-lg font-semibold text-navy">Who should be careful</h2>
              <p className="mt-2 text-sm leading-6 text-mid-navy/75">{card.avoidIf}</p>
            </section>
          </div>

          <button
            type="button"
            className="focus-ring mt-7 rounded-md bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:bg-[#caa42f]"
          >
            Placeholder apply/review CTA
          </button>
        </article>

        <div className="mt-5">
          <Disclaimer />
        </div>
      </section>
      <Footer />
    </main>
  );
}
