import { type WalletCard, type WalletSpend, withCapture } from "@/lib/walletModel";

// Card terms below are tracked in quality/issuer-claims.json and checked against
// issuer pages by `npm run verify:claims -- --issuers` (CI). Capture rates are
// MoneyFactor assumptions, stated on every article that uses them.
export const TERMS_CHECKED_AT = "2026-11-06";

// Lounge visits valued at $35 each (a meal and a seat you would otherwise buy).
export const LOUNGE_VISIT_VALUE = 35;

const lounge = (visits: number) => ({
  name: "Lounge access",
  faceValue: visits * LOUNGE_VISIT_VALUE,
  captureRate: 1,
  overlapGroup: "lounge",
});

export const walletCards = {
  sapphireReserve: {
    id: "chase-sapphire-reserve",
    name: "Chase Sapphire Reserve",
    annualFee: 795,
    currency: "chaseUltimateRewards",
    // Flights and hotels booked direct earn 4x; Chase Travel bookings (8x) are not assumed.
    earn: { airfare: { rate: 4 }, hotels: { rate: 4 }, dining: { rate: 3 }, other: { rate: 1 } },
    credits: [
      { name: "$300 travel credit", faceValue: 300, captureRate: 1 },
      { name: "$500 The Edit hotel credit", faceValue: 500, captureRate: 0 },
      { name: "$300 Exclusive Tables dining credit", faceValue: 300, captureRate: 0.25 },
      { name: "$300 StubHub credit", faceValue: 300, captureRate: 0.25 },
    ],
  },
  amexPlatinum: {
    id: "amex-platinum",
    name: "Amex Platinum",
    annualFee: 895,
    currency: "amexMembershipRewards",
    // 5x on flights booked direct; hotels booked direct (not prepaid via Amex Travel) earn 1x.
    earn: { airfare: { rate: 5 }, other: { rate: 1 } },
    credits: [
      { name: "$600 FHR/Hotel Collection credit", faceValue: 600, captureRate: 0 },
      { name: "$200 airline fee credit", faceValue: 200, captureRate: 0.5 },
      { name: "$200 Uber Cash", faceValue: 200, captureRate: 0.5 },
      { name: "$400 Resy credit", faceValue: 400, captureRate: 0.25 },
      { name: "$300 digital entertainment credit", faceValue: 300, captureRate: 0.5 },
      { name: "$219 CLEAR+ credit", faceValue: 219, captureRate: 0 },
      { name: "$300 lululemon credit", faceValue: 300, captureRate: 0.25 },
    ],
  },
  amexGold: {
    id: "amex-gold",
    name: "Amex Gold",
    annualFee: 325,
    currency: "amexMembershipRewards",
    earn: {
      dining: { rate: 4, cap: 50000 },
      groceries: { rate: 4, cap: 25000 },
      airfare: { rate: 3 },
      other: { rate: 1 },
    },
    credits: [
      { name: "$120 dining credit", faceValue: 120, captureRate: 0.5 },
      { name: "$120 Uber Cash", faceValue: 120, captureRate: 0.5 },
      { name: "$100 Resy credit", faceValue: 100, captureRate: 0.5 },
      { name: "$84 Dunkin' credit", faceValue: 84, captureRate: 0 },
    ],
  },
  ventureX: {
    id: "capital-one-venture-x",
    name: "Capital One Venture X",
    annualFee: 395,
    currency: "capitalOneMiles",
    // Portal bonus rates (Capital One Travel) are not assumed.
    earn: { other: { rate: 2 } },
    credits: [
      { name: "$300 Capital One Travel credit", faceValue: 300, captureRate: 0.8 },
      { name: "10,000 anniversary miles", faceValue: 140, captureRate: 1 },
    ],
  },
  freedomUnlimited: {
    id: "chase-freedom-unlimited",
    name: "Chase Freedom Unlimited",
    annualFee: 0,
    // Valued as Ultimate Rewards because it is only modeled next to a Sapphire card.
    currency: "chaseUltimateRewards",
    earn: { dining: { rate: 3 }, other: { rate: 1.5 } },
    credits: [],
  },
  doubleCash: {
    id: "citi-double-cash",
    name: "Citi Double Cash",
    annualFee: 0,
    currency: "cash",
    earn: { other: { rate: 2 } },
    credits: [],
  },
  inkPreferred: {
    id: "ink-business-preferred",
    name: "Chase Ink Business Preferred",
    annualFee: 95,
    currency: "chaseUltimateRewards",
    // 3x applies to the first $150,000 of combined travel, shipping, internet/phone and ad spend.
    earn: { businessBonus: { rate: 3, cap: 150000 }, other: { rate: 1 } },
    credits: [],
  },
  sparkCashPlus: {
    id: "capital-one-spark-cash-plus",
    name: "Capital One Spark Cash Plus",
    annualFee: 150,
    currency: "cash",
    earn: { other: { rate: 2 } },
    credits: [],
    feeWaivedAtSpend: 150000,
  },
} satisfies Record<string, WalletCard>;

export type HouseholdProfile = {
  id: "home" | "balanced" | "travel";
  label: string;
  description: string;
  spend: WalletSpend;
  loungeVisits: number;
};

export const householdProfiles: HouseholdProfile[] = [
  {
    id: "home",
    label: "Home-centered",
    description: "Two or three trips a year, big grocery and household spend, rarely in an airport lounge",
    spend: { groceries: 18000, dining: 9000, airfare: 3000, hotels: 2000, gas: 4000, other: 34000 },
    loungeVisits: 0,
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Five or six trips a year, dining out weekly, a couple of premium hotel nights",
    spend: { groceries: 15000, dining: 15000, airfare: 9000, hotels: 7000, gas: 4000, other: 40000 },
    loungeVisits: 4,
  },
  {
    id: "travel",
    label: "Travel-heavy",
    description: "Monthly travel, frequent lounge use, prepaid luxury hotel stays most years",
    spend: { groceries: 12000, dining: 18000, airfare: 24000, hotels: 16000, gas: 3000, other: 37000 },
    loungeVisits: 10,
  },
];

// How much of each premium credit a household in each profile realistically uses.
const captureByProfile: Record<HouseholdProfile["id"], Record<string, Record<string, number>>> = {
  home: {
    sapphireReserve: { "$500 The Edit hotel credit": 0, "$300 Exclusive Tables dining credit": 0.25, "$300 StubHub credit": 0.25 },
    amexPlatinum: {
      "$600 FHR/Hotel Collection credit": 0,
      "$200 airline fee credit": 0.5,
      "$200 Uber Cash": 0.5,
      "$400 Resy credit": 0.25,
      "$219 CLEAR+ credit": 0,
    },
    ventureX: { "$300 Capital One Travel credit": 0.5 },
  },
  balanced: {
    sapphireReserve: { "$500 The Edit hotel credit": 0.5, "$300 Exclusive Tables dining credit": 0.5, "$300 StubHub credit": 0.25 },
    amexPlatinum: {
      "$600 FHR/Hotel Collection credit": 0.5,
      "$200 airline fee credit": 0.75,
      "$200 Uber Cash": 0.6,
      "$400 Resy credit": 0.5,
      "$219 CLEAR+ credit": 1,
    },
    ventureX: { "$300 Capital One Travel credit": 0.8 },
  },
  travel: {
    sapphireReserve: { "$500 The Edit hotel credit": 1, "$300 Exclusive Tables dining credit": 0.5, "$300 StubHub credit": 0.25 },
    amexPlatinum: {
      "$600 FHR/Hotel Collection credit": 1,
      "$200 airline fee credit": 1,
      "$200 Uber Cash": 0.75,
      "$400 Resy credit": 0.5,
      "$219 CLEAR+ credit": 1,
    },
    ventureX: { "$300 Capital One Travel credit": 1 },
  },
};

// The cards as a household in this profile would use them (credit capture + lounge visits).
export function cardsFor(profileId: HouseholdProfile["id"]) {
  const profile = householdProfiles.find((candidate) => candidate.id === profileId)!;
  const capture = captureByProfile[profileId];
  const withLounge = (card: WalletCard): WalletCard =>
    profile.loungeVisits > 0 ? { ...card, credits: [...card.credits, lounge(profile.loungeVisits)] } : card;
  return {
    ...walletCards,
    sapphireReserve: withLounge(withCapture(walletCards.sapphireReserve, capture.sapphireReserve)),
    amexPlatinum: withLounge(withCapture(walletCards.amexPlatinum, capture.amexPlatinum)),
    ventureX: withLounge(withCapture(walletCards.ventureX, capture.ventureX)),
  } satisfies Record<keyof typeof walletCards, WalletCard>;
}

export function profileSpend(profileId: HouseholdProfile["id"]) {
  return householdProfiles.find((candidate) => candidate.id === profileId)!.spend;
}
