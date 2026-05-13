import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { getTrustPage } from "@/data/trustPages";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Methodology | BestCardsForMe",
  description:
    "How BestCardsForMe scores and ranks credit cards: the MoneyFactor formula that converts annual fees, rewards rates, and perks into a single dollar-value number.",
  alternates: {
    canonical: absoluteUrl("/methodology"),
  },
};

export default function MethodologyPage() {
  const page = getTrustPage("methodology");

  if (!page) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <TrustPageLayout page={page} />
      <Footer />
    </main>
  );
}
