import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { CardPageAnalytics } from "@/components/analytics/CardPageAnalytics";
import { CardReviewActions } from "@/components/analytics/CardReviewActions";
import { ProductProfileLayout } from "@/components/platform/ProductProfileLayout";
import { articles } from "@/data/articles";
import {
  getAllCreditCardProfileSlugs,
  getCreditCardProfileBySlug,
} from "@/data/creditCardProfiles";
import { describeScoreWeights } from "@/lib/cardProfileBuilder";
import { absoluteUrl } from "@/lib/site";
import { buildCardProfileStructuredData } from "@/lib/structuredData";
import type { ProductProfileSection } from "@/components/platform/ProductProfileLayout";
import type { CreditCardProfile, FactStatus } from "@/types/creditCardProfile";

type CardDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatAnnualFee(annualFee: number) {
  return annualFee === 0 ? "$0" : `$${annualFee}`;
}

function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatReviewedLabel(reviewedAt: string) {
  const month = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
    parseIsoDate(reviewedAt),
  );

  return `Reviewed & updated ${month}`;
}

function formatCheckedDate(checkedAt: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    parseIsoDate(checkedAt),
  );
}

const factStatusLabels: Record<FactStatus, string> = {
  verified: "Verified",
  changed: "Changed",
  unverified: "Not yet verified",
  discontinued: "Discontinued",
};

// Article deks are written in inline markdown; related-article cards render plain text.
function stripInlineMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function getRelatedArticleItems(profile: CreditCardProfile) {
  return profile.relatedArticleSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article))
    .map((article) => ({
      title: article.title,
      href: `/articles/${article.slug}`,
      dek: stripInlineMarkdown(article.dek),
      label: article.category,
    }));
}

function getScorecard(profile: CreditCardProfile) {
  if (profile.scoreStatus === "withheld") return undefined;

  return {
    title: "Scored for credit-card fit",
    summary: profile.scoringCategory
      ? `MoneyFactor scores weigh realistic rewards, fee defensibility, travel utility, everyday usefulness, and how easy the card is to manage. ${describeScoreWeights(
          profile.scoringCategory,
        )}`
      : "MoneyFactor scores weigh realistic rewards, fee defensibility, travel utility, everyday usefulness, and how easy the card is to manage.",
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

function getProfileSections(profile: CreditCardProfile): ProductProfileSection[] {
  const credits: ProductProfileSection = {
    title: "Credits and perks",
    body: profile.creditsSummary,
    items: [profile.travelPerks, profile.transferPartners],
  };
  const fit: ProductProfileSection[] = [
    { title: "Who should get it", items: profile.recommendedUserTypes },
    { title: "Who should skip it", items: profile.skipIf },
  ];

  // Hand-written premium profiles keep their original layout.
  if (!profile.factCheck) {
    return [{ title: "Rewards summary", body: profile.rewardsSummary }, credits, ...fit];
  }

  const sections: ProductProfileSection[] = [];

  if (profile.scoreStatus === "withheld") {
    sections.push({
      title: "Profile status: under re-review",
      body: "This card changed materially and we have not yet verified the replacement terms, so we are not publishing a score or value estimate. The facts we could confirm are below.",
    });
  }

  sections.push(
    { title: "Rewards summary", body: profile.rewardsSummary },
    { title: "Earn rates", items: profile.earnRates },
  );

  if (profile.valueAnalysis) {
    sections.push({
      title: "Year-2 value math",
      body: profile.valueAnalysis.summary,
      rows: profile.valueAnalysis.lines,
      footnotes: [
        profile.valueAnalysis.breakEven,
        ...(profile.valueAnalysis.alternateValuation ? [profile.valueAnalysis.alternateValuation] : []),
      ],
    });
    sections.push({ title: "Assumptions behind the math", items: profile.valueAnalysis.assumptions });
  }

  sections.push(credits);

  if (profile.marketingOverstates?.length) {
    sections.push({ title: "What the marketing overstates", items: profile.marketingOverstates });
  }

  sections.push(...fit);

  const alternatives = (profile.alternatives ?? [])
    .map((alternative) => ({ alternative, target: getCreditCardProfileBySlug(alternative.slug) }))
    .filter((entry): entry is { alternative: typeof entry.alternative; target: CreditCardProfile } =>
      Boolean(entry.target),
    );
  if (alternatives.length > 0) {
    sections.push({
      title: "Alternatives to compare",
      links: alternatives.map(({ alternative, target }) => ({
        href: `/cards/${target.slug}`,
        label: `${target.cardName} (${formatAnnualFee(target.annualFee)} annual fee)`,
        description: alternative.reason,
      })),
    });
  }

  sections.push({
    title: "Fact check",
    body: `Checked ${formatCheckedDate(profile.factCheck.checkedAt)}. ${profile.factCheck.method}`,
    items: profile.factCheck.flags.map((flag) => `${factStatusLabels[flag.status]}: ${flag.note}`),
  });

  return sections;
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
      ? profile.metaDescription ||
        `MoneyFactor profile for ${profile.cardName}, including annual fee, best fit, rewards, perks, who should get it, and who should skip it.`
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
      <JsonLd data={buildCardProfileStructuredData(profile)} />
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
          { label: "Annual fee", value: profile.annualFeeNote || formatAnnualFee(profile.annualFee) },
          { label: "Best for", value: profile.bestFor },
          {
            label: "Terms status",
            value: profile.factCheck
              ? `Checked ${formatCheckedDate(profile.factCheck.checkedAt)}; verify before applying`
              : "Verify before applying",
          },
        ]}
        reviewedLabel={formatReviewedLabel(profile.reviewedAt)}
        scorecard={getScorecard(profile)}
        sections={getProfileSections(profile)}
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
