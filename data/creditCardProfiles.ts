import { cards } from "@/data/cards";
import type { CreditCardProfile } from "@/types/creditCardProfile";

export const creditCardProfiles: CreditCardProfile[] = [
  {
    slug: "chase-sapphire-reserve",
    cardName: "Chase Sapphire Reserve",
    issuer: "Chase",
    annualFee: 795,
    bestFor: "Frequent travelers who use travel credits, lounges, and Chase Ultimate Rewards strategically",
    rewardsSummary:
      "Best for travel and dining households that redeem Chase Ultimate Rewards through transfer partners or high-value travel redemptions.",
    creditsSummary:
      "The flexible travel credit is the easiest value to capture; lifestyle credits require more active tracking and should be discounted unless they match existing behavior.",
    travelPerks:
      "Strong travel protections, airport lounge access, and premium Chase travel benefits for households that fly regularly.",
    transferPartners:
      "Chase Ultimate Rewards airline and hotel partners, including United, Southwest, Hyatt, British Airways, Air Canada, and others.",
    recommendedUserTypes: [
      "Frequent travelers who fly at least several times per year",
      "Households willing to track credits and redeem points strategically",
      "Chase ecosystem users who value travel protections and lounge access",
    ],
    skipIf: [
      "You travel rarely",
      "You prefer simple cash back",
      "You will not track credits or use airport lounges",
    ],
    moneyFactorScores: {
      rewardsValue: 8,
      feeJustification: 7,
      travelUtility: 9,
      everydayUse: 7,
      beginnerFriendliness: 4,
      overall: 7.6,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/chase-sapphire-reserve",
    relatedArticleSlugs: [
      "is-chase-sapphire-reserve-worth-it-2026",
      "is-chase-sapphire-preferred-best-95-travel-card-2026",
      "is-amex-platinum-worth-it-2026",
      "is-capital-one-venture-x-worth-it-2026",
    ],
  },
  {
    slug: "chase-sapphire-preferred",
    cardName: "Chase Sapphire Preferred",
    issuer: "Chase",
    annualFee: 95,
    bestFor: "Moderate travelers who want flexible points without a premium annual fee",
    rewardsSummary:
      "A balanced transferable-points card for dining, travel, and everyday households that want upside without a high fee.",
    creditsSummary:
      "Lower-fee value comes mostly from rewards and travel protections rather than a large credit stack.",
    travelPerks:
      "Useful travel protections and Chase transfer-partner access, but no meaningful premium lounge footprint.",
    transferPartners:
      "Chase Ultimate Rewards airline and hotel partners, including Hyatt, United, Southwest, British Airways, and Air Canada.",
    recommendedUserTypes: [
      "Moderate travelers who want flexible points",
      "Users building a Chase points strategy",
      "Households that want an easier downgrade path from Sapphire Reserve",
    ],
    skipIf: [
      "You need premium airport lounge access",
      "You want the simplest flat-rate cash-back setup",
      "You will not use travel points at all",
    ],
    moneyFactorScores: {
      rewardsValue: 7,
      feeJustification: 9,
      travelUtility: 7,
      everydayUse: 8,
      beginnerFriendliness: 8,
      overall: 7.8,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/chase-sapphire-preferred",
    relatedArticleSlugs: [
      "is-chase-sapphire-preferred-best-95-travel-card-2026",
      "is-chase-sapphire-reserve-worth-it-2026",
      "is-capital-one-venture-x-worth-it-2026",
    ],
  },
  {
    slug: "amex-platinum",
    cardName: "American Express Platinum",
    issuer: "American Express",
    annualFee: 895,
    bestFor: "Frequent travelers who can use Centurion Lounge access and multiple lifestyle credits",
    rewardsSummary:
      "Strong on flights and prepaid hotel bookings through Amex Travel, but weak for most everyday spending categories.",
    creditsSummary:
      "Large stated credit value can be real for engaged users, but the calendar and enrollment burden is high.",
    travelPerks:
      "Centurion Lounge access, Priority Pass access, hotel status, premium travel credits, and travel-service benefits.",
    transferPartners:
      "American Express Membership Rewards airline and hotel partners, including Delta, British Airways, Air Canada, ANA, Hilton, Marriott, and others.",
    recommendedUserTypes: [
      "Frequent flyers who value Centurion Lounge access",
      "Households already using Amex lifestyle partners",
      "Travel optimizers comfortable managing a high-fee card",
    ],
    skipIf: [
      "You travel only occasionally",
      "You dislike tracking monthly or partner-specific credits",
      "You want one card for strong grocery and dining rewards",
    ],
    moneyFactorScores: {
      rewardsValue: 7,
      feeJustification: 6,
      travelUtility: 10,
      everydayUse: 4,
      beginnerFriendliness: 3,
      overall: 7.0,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/amex-platinum",
    relatedArticleSlugs: [
      "is-amex-platinum-worth-it-2026",
      "is-chase-sapphire-reserve-worth-it-2026",
      "is-capital-one-venture-x-worth-it-2026",
    ],
  },
  {
    slug: "capital-one-venture-x",
    cardName: "Capital One Venture X",
    issuer: "Capital One",
    annualFee: 395,
    bestFor: "Travelers who want premium perks at a lower effective fee than ultra-premium cards",
    rewardsSummary:
      "Simple base earning and transferable miles make it easier to use than many premium competitors.",
    creditsSummary:
      "The main value depends on using the travel credit and anniversary miles without treating portal-bound benefits as cash.",
    travelPerks:
      "Premium travel benefits, lounge access, and a lower fee tier than Sapphire Reserve or Amex Platinum.",
    transferPartners:
      "Capital One airline and hotel partners, including Air Canada, British Airways, Turkish Airlines, Flying Blue, Wyndham, and others.",
    recommendedUserTypes: [
      "Travelers who want premium value without the highest annual fees",
      "Users comfortable with Capital One Travel portal credits",
      "Households that like simple everyday earning",
    ],
    skipIf: [
      "You dislike portal bookings",
      "You rarely travel",
      "You want a richer set of domestic airline transfer options",
    ],
    moneyFactorScores: {
      rewardsValue: 8,
      feeJustification: 8,
      travelUtility: 8,
      everydayUse: 8,
      beginnerFriendliness: 7,
      overall: 8.0,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/capital-one-venture-x",
    relatedArticleSlugs: [
      "is-capital-one-venture-x-worth-it-2026",
      "is-chase-sapphire-preferred-best-95-travel-card-2026",
      "is-chase-sapphire-reserve-worth-it-2026",
      "hilton-aspire-vs-marriott-bonvoy-brilliant-2026",
    ],
  },
  {
    slug: "hilton-aspire",
    cardName: "Hilton Honors Aspire",
    issuer: "American Express",
    annualFee: 550,
    bestFor: "Hilton loyalists who can use hotel credits, premium status, and annual travel benefits",
    rewardsSummary:
      "Best value comes from Hilton stays and Hilton-specific benefits rather than general everyday spending.",
    creditsSummary:
      "Credits and certificates can offset the fee for loyal Hilton travelers, but they require planning and brand fit.",
    travelPerks:
      "Hilton-focused premium hotel benefits, potential resort value, and status-driven upgrades for loyal users.",
    transferPartners:
      "Hilton Honors ecosystem. Transferable-bank partner strategy is not the main reason to hold this card.",
    recommendedUserTypes: [
      "Households with predictable Hilton stays",
      "Travelers who value hotel status and property credits",
      "Users who can plan around annual hotel benefits",
    ],
    skipIf: [
      "You are not loyal to Hilton",
      "You want flexible rewards across hotel brands",
      "You dislike managing hotel credits and certificates",
    ],
    moneyFactorScores: {
      rewardsValue: 7,
      feeJustification: 7,
      travelUtility: 8,
      everydayUse: 4,
      beginnerFriendliness: 5,
      overall: 6.8,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/hilton-aspire",
    relatedArticleSlugs: [
      "is-hilton-honors-aspire-worth-it-2026",
      "hilton-aspire-vs-marriott-bonvoy-brilliant-2026",
      "is-marriott-bonvoy-brilliant-worth-it-2026",
    ],
  },
  {
    slug: "marriott-bonvoy-brilliant",
    cardName: "Marriott Bonvoy Brilliant",
    issuer: "American Express",
    annualFee: 650,
    bestFor: "Marriott loyalists who can use premium hotel credits, status, and annual night value",
    rewardsSummary:
      "Most compelling for Marriott-heavy travelers, not as a general-purpose rewards card.",
    creditsSummary:
      "Hotel credits and annual-night-style value can be meaningful, but only if the household already stays with Marriott.",
    travelPerks:
      "Premium Marriott status, hotel-related credits, and property benefits for brand-loyal travelers.",
    transferPartners:
      "Marriott Bonvoy ecosystem. Flexible transfer value is secondary to Marriott-specific hotel utility.",
    recommendedUserTypes: [
      "Marriott loyalists with regular paid stays",
      "Travelers who value hotel status and premium property treatment",
      "Households that can reliably use annual hotel benefits",
    ],
    skipIf: [
      "You are not loyal to Marriott",
      "You want simple cash-like rewards",
      "You do not want to plan around hotel certificates or credits",
    ],
    moneyFactorScores: {
      rewardsValue: 6,
      feeJustification: 6,
      travelUtility: 8,
      everydayUse: 4,
      beginnerFriendliness: 4,
      overall: 6.3,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/marriott-bonvoy-brilliant",
    relatedArticleSlugs: [
      "is-marriott-bonvoy-brilliant-worth-it-2026",
      "hilton-aspire-vs-marriott-bonvoy-brilliant-2026",
      "is-hilton-honors-aspire-worth-it-2026",
    ],
  },
  {
    slug: "amex-gold",
    cardName: "American Express Gold",
    issuer: "American Express",
    annualFee: 325,
    bestFor: "Households with heavy dining and grocery spend who can use food-related credits",
    rewardsSummary:
      "High grocery and dining earning can create strong value for households that redeem Membership Rewards well.",
    creditsSummary:
      "Food-related credits help justify the fee when they replace spending the household already intended to make.",
    travelPerks:
      "Not a lounge card; travel value comes mainly from Membership Rewards transfer partners.",
    transferPartners:
      "American Express Membership Rewards airline and hotel partners, including Delta, British Airways, Air Canada, ANA, Hilton, Marriott, and others.",
    recommendedUserTypes: [
      "High grocery-spend households",
      "Dining-heavy users who value transferable points",
      "Travel optimizers who do not need lounge access from this card",
    ],
    skipIf: [
      "You want airport lounge access",
      "You prefer simple cash back",
      "You will not use food-related credits or transfer partners",
    ],
    moneyFactorScores: {
      rewardsValue: 9,
      feeJustification: 8,
      travelUtility: 5,
      everydayUse: 9,
      beginnerFriendliness: 6,
      overall: 7.8,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: "/go/amex-gold",
    relatedArticleSlugs: ["best-grocery-credit-card-high-spend-households-2026"],
  },
];

function fallbackProfileFromLegacyCard(slug: string): CreditCardProfile | undefined {
  const legacyCard = cards.find((card) => card.id === slug);

  if (!legacyCard) return undefined;

  return {
    slug: legacyCard.id,
    cardName: legacyCard.name,
    issuer: "Issuer details pending",
    annualFee: legacyCard.annualFee,
    bestFor: legacyCard.bestFor,
    rewardsSummary: legacyCard.moneyFactorVerdict,
    creditsSummary: legacyCard.currentPublicOffer,
    travelPerks: legacyCard.keyPerks.join(" "),
    transferPartners: "Transfer-partner details vary by issuer and should be verified before applying.",
    recommendedUserTypes: legacyCard.whyValuable,
    skipIf: legacyCard.honestDrawbacks,
    moneyFactorScores: {
      rewardsValue: 6,
      feeJustification: legacyCard.annualFee === 0 ? 9 : 6,
      travelUtility: legacyCard.loungeValue === "high" ? 8 : legacyCard.loungeValue === "medium" ? 6 : 3,
      everydayUse: 6,
      beginnerFriendliness: legacyCard.annualFee === 0 ? 8 : 5,
      overall: 6.2,
    },
    affiliateStatus: "placeholder",
    affiliateUrlPlaceholder: `/go/${legacyCard.affiliateSlug}`,
    relatedArticleSlugs: [],
  };
}

export function getCreditCardProfileBySlug(slug: string) {
  return (
    creditCardProfiles.find((profile) => profile.slug === slug) ||
    fallbackProfileFromLegacyCard(slug)
  );
}

export function getAllCreditCardProfileSlugs() {
  const slugs = new Set<string>([
    ...creditCardProfiles.map((profile) => profile.slug),
    ...cards.map((card) => card.id),
  ]);

  return Array.from(slugs);
}
