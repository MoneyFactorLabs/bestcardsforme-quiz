import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrustPageLayout } from "@/components/TrustPageLayout";
import { getTrustPage } from "@/data/trustPages";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Standards | BestCardsForMe",
  description:
    "BestCardsForMe editorial standards: how we maintain independence, disclose affiliate relationships, and ensure every card recommendation is based on honest math.",
  alternates: {
    canonical: absoluteUrl("/editorial-standards"),
  },
};

export default function EditorialStandardsPage() {
  const page = getTrustPage("editorial-standards");

  if (!page) return null;

  return (
    <main className="min-h-screen">
      <Header />
      <TrustPageLayout page={page} />
      <Footer />
    </main>
  );
}
