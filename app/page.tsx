import type { Metadata } from "next";
import { HomeQuiz } from "@/components/HomeQuiz";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "BestCardsForMe Quiz by MoneyFactor",
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return <HomeQuiz />;
}
