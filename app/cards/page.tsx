import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { ProductIndexLayout } from "@/components/platform/ProductIndexLayout";
import {
  getAllCreditCardProfileSlugs,
  getCreditCardProfileBySlug,
} from "@/data/creditCardProfiles";
import { absoluteUrl } from "@/lib/site";
import { buildCardsIndexStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Credit Card Profiles | BestCardsForMe by MoneyFactor",
  description:
    "Structured BestCardsForMe credit card profiles with MoneyFactor scores, annual-fee math, rewards summaries, perks, and who should skip each card.",
  alternates: {
    canonical: absoluteUrl("/cards"),
  },
};

function formatAnnualFee(annualFee: number) {
  return annualFee === 0 ? "$0" : `$${annualFee}`;
}

export default function CardsIndexPage() {
  const profiles = getAllCreditCardProfileSlugs()
    .map((slug) => getCreditCardProfileBySlug(slug))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile));

  return (
    <main className="min-h-screen">
      <JsonLd data={buildCardsIndexStructuredData(profiles)} />
      <Header />
      <ProductIndexLayout
        eyebrow="Credit card profiles"
        title="Structured card reviews built for real-life fit."
        description="Compare premium and everyday cards through annual fees, realistic rewards, perks, skip conditions, and MoneyFactor scores."
        items={profiles.map((profile) => ({
          title: profile.cardName,
          href: `/cards/${profile.slug}`,
          eyebrow: profile.issuer,
          description: profile.bestFor,
          meta: [
            { label: "Fee", value: formatAnnualFee(profile.annualFee) },
            { label: "Score", value: `${profile.moneyFactorScores.overall.toFixed(1)}/10` },
            { label: "Status", value: profile.affiliateStatus.replace("_", " ") },
          ],
          ctaLabel: "View card profile",
        }))}
      />
      <Footer />
    </main>
  );
}
