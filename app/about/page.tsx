import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { getTrustPage } from "@/data/trustPages";

export const metadata = {
  title: "About MoneyFactor | BestCardsForMe",
};

export default function AboutPage() {
  const page = getTrustPage("about");

  if (!page) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <TrustPageLayout page={page} />
      <Footer />
    </main>
  );
}
