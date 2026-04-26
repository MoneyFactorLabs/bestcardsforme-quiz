import { cards } from "@/data/cards";

const fallbackDestination = "/";

export function getAffiliateDestination(slug: string) {
  const card = cards.find((item) => item.affiliateSlug === slug);

  if (!card) {
    return fallbackDestination;
  }

  // Future affiliate URLs should be swapped in card.affiliateDestinationUrl.
  // Keep this centralized so compliance review, tracking, and issuer routing
  // can be managed in one place instead of scattered across UI components.
  return card.affiliateDestinationUrl || card.issuerTermsUrl || fallbackDestination;
}
