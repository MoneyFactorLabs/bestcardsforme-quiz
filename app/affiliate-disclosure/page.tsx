import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { getTrustPage } from "@/data/trustPages";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | BestCardsForMe",
  description:
    "BestCardsForMe affiliate disclosure: we may earn a commission when you apply through our links, but it never influences our card rankings or recommendations.",
  alternates: {
    canonical: absoluteUrl("/affiliate-disclosure"),
  },
};

export default function AffiliateDisclosurePage() {
  const page = getTrustPage("affiliate-disclosure");

  if (!page) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <TrustPageLayout page={page} />
      <Footer />
    </main>
  );
}
