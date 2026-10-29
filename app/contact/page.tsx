import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { getTrustPage } from "@/data/trustPages";
import { absoluteUrl } from "@/lib/site";

export const metadata = {
  title: "Contact and Editorial Standards | BestCardsForMe by MoneyFactor",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  const page = getTrustPage("contact");

  if (!page) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <TrustPageLayout page={page} />
      <Footer />
    </main>
  );
}
