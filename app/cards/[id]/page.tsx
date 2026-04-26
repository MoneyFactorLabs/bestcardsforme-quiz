import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { cards } from "@/data/cards";

type CardDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type EditorialSectionProps = {
  title: string;
  children: ReactNode;
};

type BulletSectionProps = {
  title: string;
  items: string[];
};

function EditorialSection({ title, children }: EditorialSectionProps) {
  return (
    <section className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-3 h-1 w-12 rounded-full bg-gold" />
      <h2 className="text-xl font-semibold text-navy sm:text-2xl">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-mid-navy/75">{children}</div>
    </section>
  );
}

function BulletSection({ title, items }: BulletSectionProps) {
  return (
    <EditorialSection title={title}>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </EditorialSection>
  );
}

export function generateStaticParams() {
  return cards.map((card) => ({
    id: card.id,
  }));
}

export async function generateMetadata({ params }: CardDetailsPageProps) {
  const { id } = await params;
  const card = cards.find((item) => item.id === id);

  return {
    title: card ? `${card.name} Honest Review | BestCardsForMe` : "Card Review | BestCardsForMe",
    description: card
      ? `MoneyFactor honest-math review of ${card.name}, including realistic annual value, perks, drawbacks, and who should avoid it.`
      : "BestCardsForMe honest credit card review.",
  };
}

export default async function CardDetailsPage({ params }: CardDetailsPageProps) {
  const { id } = await params;
  const card = cards.find((item) => item.id === id);

  if (!card) notFound();

  return (
    <main className="min-h-screen">
      <Header />
      <article className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-10">
        <Link
          href="/"
          className="focus-ring inline-flex rounded-md border border-blue-gray bg-white px-4 py-2 text-sm font-bold text-mid-navy transition hover:border-navy hover:text-navy"
        >
          Back to quiz
        </Link>

        <header className="mt-5 overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft">
          <div className="bg-navy px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
                  BestCardsForMe Honest Review
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-gray">
                  by MoneyFactor
                </p>
                <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
                  {card.name}
                </h1>
              </div>
              <div className="rounded-md border border-white/15 bg-white/10 px-4 py-3 md:max-w-56">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-gray">
                  Editorial lens
                </p>
                <p className="mt-2 text-sm leading-6 text-white">
                  Net value, fit, and tradeoffs before issuer marketing.
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-7 text-blue-gray sm:text-lg sm:leading-8">
              A plain-English review of where this card can create real annual value, where the
              marketing can get ahead of the math, and who should skip it.
            </p>
          </div>

          <div className="grid gap-px bg-blue-gray/70 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Annual fee", `$${card.annualFee}`],
              ["Current public offer", card.currentPublicOffer],
              ["Realistic annual value", card.realisticAnnualValue],
              ["Rewards type", card.type],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/60">
                  {label}
                </p>
                <p className="mt-2 text-lg font-semibold capitalize leading-6 text-navy">{value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="grid gap-5">
            <section className="rounded-lg border border-blue-gray/70 bg-[#f8fafc] p-5 shadow-soft sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
                Independent scoring callout
              </p>
              <p className="mt-2 text-sm leading-7 text-mid-navy/75">
                MoneyFactor reviews compare the card's likely annual value against its fee,
                friction, and real-world usage requirements. A higher-fee card can be worthwhile,
                but only when the benefits are likely to be captured.
              </p>
            </section>
            <BulletSection title="Why this card can be valuable" items={card.whyValuable} />
            <BulletSection
              title="Where the issuer marketing overstates value"
              items={card.marketingOverstates}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <EditorialSection title="Best for">
                <p>{card.bestFor}</p>
              </EditorialSection>
              <EditorialSection title="Who should avoid it">
                <p>{card.avoidIf}</p>
              </EditorialSection>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <BulletSection title="Key perks" items={card.keyPerks} />
              <BulletSection title="Honest drawbacks" items={card.honestDrawbacks} />
            </div>

            <EditorialSection title="MoneyFactor verdict">
              <p className="text-base leading-8 text-mid-navy/80">{card.moneyFactorVerdict}</p>
            </EditorialSection>

            <Disclaimer />
          </div>

          <aside className="overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft lg:sticky lg:top-5">
            <div className="bg-navy p-5 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Next step</p>
              <h2 className="mt-2 text-2xl font-semibold">Check terms before you apply</h2>
              <p className="mt-3 text-sm leading-6 text-blue-gray">
                Offers, fees, credits, and eligibility rules can change. Review the issuer's
                current terms before making an application decision.
              </p>
            </div>

            <div className="grid gap-3 p-5">
              <Link
                href={`/go/${card.affiliateSlug}`}
                className="focus-ring inline-flex justify-center rounded-md bg-gold px-5 py-3 text-sm font-bold text-navy transition hover:bg-[#caa42f]"
              >
                Read issuer terms
              </Link>
              <Link
                href="#offer-updates"
                className="focus-ring inline-flex justify-center rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
              >
                Get offer updates by email
              </Link>

              <div id="issuer-terms" className="rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4">
                <p className="text-sm font-semibold text-navy">Issuer terms and offer details</p>
                <p className="mt-2 text-sm leading-6 text-mid-navy/70">
                  Terms can change without notice. We treat issuer details as the source of truth
                  before any application decision.
                </p>
              </div>

              <div id="offer-updates" className="rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4">
                <p className="text-sm font-semibold text-navy">Offer updates</p>
                <p className="mt-2 text-sm leading-6 text-mid-navy/70">
                  Join the offer-watch list for this card. We use this request to understand which
                  reviews readers want kept closest to current public terms.
                </p>
                <div className="mt-4">
                  <LeadCaptureForm
                    sourcePage="card_detail"
                    sourceCard={card.id}
                    inputId={`${card.id}-offer-email`}
                    buttonLabel="Get offer updates"
                    successMessage={`You're on the offer-watch list for ${card.name}.`}
                    variant="light"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
