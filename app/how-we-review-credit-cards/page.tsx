import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { getTrustPage } from "@/data/trustPages";

export const metadata = {
  title: "How We Review Credit Cards | BestCardsForMe",
  description:
    "How BestCardsForMe by MoneyFactor reviews credit cards using scoring methodology, annual-fee math, rewards analysis, travel-perk valuation, and editorial independence.",
};

export default function HowWeReviewCreditCardsPage() {
  const page = getTrustPage("how-we-review-credit-cards");

  if (!page) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <TrustPageLayout page={page} />
      <Footer />
    </main>
  );
}
