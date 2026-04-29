import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { CardPageAnalytics } from "@/components/analytics/CardPageAnalytics";
import { CardReviewActions } from "@/components/analytics/CardReviewActions";
import { ProductProfileLayout } from "@/components/platform/ProductProfileLayout";
import { articles } from "@/data/articles";
import {
  getAllCreditCardProfileSlugs,
  getCreditCardProfileBySlug,
} from "@/data/creditCardProfiles";
import { absoluteUrl } from "@/lib/site";
import type { CreditCardProfile } from "@/types/creditCardProfile";

type CardDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatAnnualFee(annualFee: number) {
  return annualFee === 0 ? "$0" : `$${annualFee}`;
}

function getRelatedArticleItems(profile: CreditCardProfile) {
  return profile.relatedArticleSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article))
    .map((article) => ({
      title: article.title,
      href: `/articles/${article.slug}`,
      dek: article.dek,
      label: article.category,
    }));
}

function getScorecard(profile: CreditCardProfile) {
  return {
    title: "Scored for credit-card fit",
    summary:
      "MoneyFactor scores weigh realistic rewards, fee defensibility, travel utility, everyday usefulness, and how easy the card is to manage.",
    overallScore: profile.moneyFactorScores.overall,
    metrics: [
      { label: "Rewards Value", value: profile.moneyFactorScores.rewardsValue },
      { label: "Fee Justification", value: profile.moneyFactorScores.feeJustification },
      { label: "Travel Utility", value: profile.moneyFactorScores.travelUtility },
      { label: "Everyday Use", value: profile.moneyFactorScores.everydayUse },
      { label: "Beginner Friendliness", value: profile.moneyFactorScores.beginnerFriendliness },
    ],
  };
}

export function generateStaticParams() {
  return getAllCreditCardProfileSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CardDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getCreditCardProfileBySlug(slug);

  return {
    title: profile
      ? `${profile.cardName} Review | BestCardsForMe by MoneyFactor`
      : "Card Review | BestCardsForMe",
    description: profile
      ? `MoneyFactor profile for ${profile.cardName}, including annual fee, best fit, rewards, perks, who should get it, and who should skip it.`
      : "BestCardsForMe honest credit card review.",
    alternates: profile
      ? {
          canonical: absoluteUrl(`/cards/${profile.slug}`),
        }
      : undefined,
  };
}

export default async function CardDetailsPage({ params }: CardDetailsPageProps) {
  const { slug } = await params;
  const profile = getCreditCardProfileBySlug(slug);

  if (!profile) notFound();

  return (
    <main className="min-h-screen">
      <CardPageAnalytics cardId={profile.slug} />
      <Header />
      <ProductProfileLayout
        backHref="/cards"
        backLabel="Back to card profiles"
        eyebrow="BestCardsForMe Honest Review"
        title={profile.cardName}
        subtitle={`${profile.issuer} credit card profile built around realistic annual value, fee math, and user fit.`}
        meta={[
          { label: "Issuer", value: profile.issuer },
          { label: "Annual fee", value: formatAnnualFee(profile.annualFee) },
          { label: "Best for", value: profile.bestFor },
          { label: "Terms status", value: "Verify before applying" },
        ]}
        scorecard={getScorecard(profile)}
        sections={[
          {
            title: "Rewards summary",
            body: profile.rewardsSummary,
          },
          {
            title: "Credits and perks",
            body: profile.creditsSummary,
            items: [profile.travelPerks, profile.transferPartners],
          },
          {
            title: "Who should get it",
            items: profile.recommendedUserTypes,
          },
          {
            title: "Who should skip it",
            items: profile.skipIf,
          },
        ]}
        recommendationCta={{
          productName: profile.cardName,
          whyWeLikeIt: profile.bestFor,
          annualFee: formatAnnualFee(profile.annualFee),
          bestFor: profile.bestFor,
          href: profile.affiliateUrlPlaceholder,
          buttonLabel: "Check current terms →",
        }}
        relatedArticles={getRelatedArticleItems(profile)}
        sidebar={
          <aside className="w-full overflow-hidden rounded-lg border border-blue-gray/70 bg-white shadow-soft lg:sticky lg:top-5">
            <div className="bg-navy p-5 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Next step</p>
              <h2 className="mt-2 text-2xl font-semibold">Verify terms before applying</h2>
              <p className="mt-3 text-sm leading-6 text-blue-gray">
                Offers, fees, credits, and eligibility rules can change. Treat issuer terms as the
                source of truth before any application decision.
              </p>
            </div>

            <div className="grid gap-3 p-5">
              <div className="rounded-md border border-gold/50 bg-gold/10 p-4">
                <p className="text-sm font-semibold text-navy">Profile decision checks</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-mid-navy/75">
                  <li>Annual fee clears realistic usage</li>
                  <li>Perks match your travel or spending pattern</li>
                  <li>Drawbacks are visible before you apply</li>
                </ul>
              </div>

              <CardReviewActions cardId={profile.slug} affiliateSlug={profile.slug} />

              <div id="issuer-terms" className="rounded-md border border-blue-gray/70 bg-[#f5f8fb] p-4">
                <p className="text-sm font-semibold text-navy">Issuer terms</p>
                <p className="mt-2 text-sm leading-6 text-mid-navy/70">
                  Future affiliate or issuer URLs should be routed through the centralized `/go/`
                  path after compliance review.
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
                    sourceCard={profile.slug}
                    inputId={`${profile.slug}-offer-email`}
                    buttonLabel="Get offer updates"
                    successMessage={`You're on the offer-watch list for ${profile.cardName}.`}
                    variant="light"
                  />
                </div>
              </div>
            </div>
          </aside>
        }
      >
        <Disclaimer />
      </ProductProfileLayout>
      <Footer />
    </main>
  );
}
