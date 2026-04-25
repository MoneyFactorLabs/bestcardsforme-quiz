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
      <h2 className="text-xl font-semibold text-navy">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-mid-navy/78">{children}</div>
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
          <div className="bg-navy px-5 py-6 text-white sm:px-8 sm:py-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
              BestCardsForMe Honest Review
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-gray">
              by MoneyFactor
            </p>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
              {card.name}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-blue-gray sm:text-lg sm:leading-8">
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
              <p className="text-base leading-8 text-mid-navy/82">{card.moneyFactorVerdict}</p>
            </EditorialSection>

            <Disclaimer />
          </div>

          <aside className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft lg:sticky lg:top-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Next step</p>
            <h2 className="mt-2 text-2xl font-semibold text-navy">Check terms before you apply</h2>
            <p className="mt-3 text-sm leading-6 text-mid-navy/75">
              Offers, fees, credits, and eligibility rules can change. V2 keeps these actions as
              placeholders until affiliate and issuer compliance workflows are ready.
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href="#issuer-terms-placeholder"
                className="focus-ring inline-flex justify-center rounded-md bg-gold px-5 py-3 text-sm font-bold text-navy transition hover:bg-[#caa42f]"
              >
                Read issuer terms
              </Link>
              <Link
                href="#offer-updates-placeholder"
                className="focus-ring inline-flex justify-center rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
              >
                Get offer updates by email
              </Link>
            </div>

            <div
              id="issuer-terms-placeholder"
              className="mt-6 rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4"
            >
              <p className="text-sm font-semibold text-navy">Issuer terms placeholder</p>
              <p className="mt-2 text-sm leading-6 text-mid-navy/70">
                No affiliate or issuer link is connected yet. This slot is reserved for compliant
                terms routing.
              </p>
            </div>

            <div
              id="offer-updates-placeholder"
              className="mt-3 rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4"
            >
              <p className="text-sm font-semibold text-navy">Offer updates placeholder</p>
              <p className="mt-2 text-sm leading-6 text-mid-navy/70">
                Join the offer-watch list for this card. We will store the request securely and
                connect real sends after the email provider workflow is approved.
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
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
