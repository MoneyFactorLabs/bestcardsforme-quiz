import { compareCard, networkCost, type CardLoungePolicy, type LoungeNetworkId, type LoungeNetworkInfo, type Party } from "@/lib/loungeModel";

// Lounge guest policies for the first slice of cards (Issue #21). Every number,
// eligibility rule and restriction below is a claim in quality/issuer-claims.json
// (listed per row), checked against issuer pages by `npm run verify:claims -- --issuers`
// in CI and weekly. Anything an issuer page does not state is "unknown" and shown as
// "Not published". Scope: the three cards below only; not an exhaustive list of
// every card that reaches these lounges.
export const LOUNGE_POLICIES_VERIFIED_AT = "2026-11-09";

// Canonical lounge networks. Cards point at these ids, so the network-first view can
// group every covered card that reaches a network. Scope is networks per card, not
// individual lounge locations: BestCardsForMe helps choose a card, not plan a trip.
export const loungeNetworks: Record<LoungeNetworkId, LoungeNetworkInfo> = {
  "priority-pass": { id: "priority-pass", name: "Priority Pass", kind: "priority-pass", operator: "Collinson (Priority Pass)" },
  centurion: { id: "centurion", name: "Amex Centurion Lounges", kind: "issuer", operator: "American Express" },
  "sapphire-lounges": { id: "sapphire-lounges", name: "Chase Sapphire Lounges by The Club", kind: "issuer", operator: "Chase" },
  "capital-one-lounges": { id: "capital-one-lounges", name: "Capital One Lounges and Landings", kind: "issuer", operator: "Capital One" },
  "delta-sky-club": { id: "delta-sky-club", name: "Delta Sky Club", kind: "airline", operator: "Delta Air Lines" },
  "maple-leaf": { id: "maple-leaf", name: "Air Canada Maple Leaf Lounges", kind: "airline", operator: "Air Canada" },
  escape: { id: "escape", name: "Escape Lounges", kind: "partner", operator: "Escape Lounges" },
  "plaza-premium": { id: "plaza-premium", name: "Plaza Premium Lounges", kind: "partner", operator: "Plaza Premium Group" },
};

export const loungePolicies: CardLoungePolicy[] = [
  {
    cardSlug: "chase-sapphire-reserve",
    cardName: "Chase Sapphire Reserve",
    issuer: "Chase",
    annualFee: 795,
    walletKey: "sapphireReserve",
    sourceUrl: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    verifiedAt: LOUNGE_POLICIES_VERIFIED_AT,
    summary:
      "Priority Pass for the primary cardmember and every authorized user, two free guests each, then $27 a guest. Chase Sapphire Lounges also admit up to two guests.",
    networks: [
      {
        id: "priority-pass",
        name: "Priority Pass lounges",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: 27,
        authorizedUsers: "included",
        claims: ["chase-sapphire-reserve/priority-pass-authorized-users", "chase-sapphire-reserve/priority-pass-guest-fee"],
        restrictions: [
          { text: "Primary cardmembers and authorized users each have their own access, with up to two guests each.", claim: "chase-sapphire-reserve/priority-pass-authorized-users" },
        ],
      },
      {
        id: "sapphire-lounges",
        name: "Chase Sapphire Lounges by The Club",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        claims: ["chase-sapphire-reserve/lounge-network"],
        restrictions: [{ text: "Up to two guests; Chase's page does not publish a fee for a third guest.", claim: "chase-sapphire-reserve/lounge-network" }],
      },
      {
        id: "maple-leaf",
        name: "Air Canada Maple Leaf Lounges",
        memberVisits: "unknown",
        freeGuests: 1,
        guestFee: 59,
        authorizedUsers: "unknown",
        claims: ["chase-sapphire-reserve/maple-leaf", "chase-sapphire-reserve/maple-leaf-fee"],
        restrictions: [
          { text: "Cardmember and guests need a same-day or overnight boarding pass on a Star Alliance-operated flight.", claim: "chase-sapphire-reserve/maple-leaf-star-alliance" },
          { text: "One free guest; additional guests $59 USD at U.S. lounges (local currency elsewhere).", claim: "chase-sapphire-reserve/maple-leaf-fee" },
        ],
      },
    ],
    caveats: [
      "Authorized users get Priority Pass in their own right, which is how a family of four can enter free: two card members, two guests each.",
    ],
  },
  {
    cardSlug: "amex-platinum",
    cardName: "Amex Platinum",
    issuer: "American Express",
    annualFee: 895,
    walletKey: "amexPlatinum",
    sourceUrl: "https://www.americanexpress.com/en-us/travel/lounges/the-platinum-card/",
    verifiedAt: LOUNGE_POLICIES_VERIFIED_AT,
    summary:
      "The biggest network, but Centurion Lounge guests cost $50 ($30 for ages 2-17) unless the account spends $75,000 in a calendar year. Priority Pass, Escape and Plaza Premium lounges admit two free guests.",
    networks: [
      {
        id: "centurion",
        name: "Centurion Lounges",
        memberVisits: "unknown",
        freeGuests: 0,
        spendUnlock: { spend: 75000, freeGuests: 2 },
        guestFee: 50,
        childGuestFee: 30,
        authorizedUsers: "included",
        claims: [
          "amex-platinum/centurion-guest-fee",
          "amex-platinum/centurion-75k-guests",
          "amex-platinum/centurion-additional-cards",
          "amex-platinum/centurion-same-flight",
        ],
        restrictions: [
          { text: "Guests pay $50 ($30 ages 2-17) per location unless the account spent $75,000+ in eligible purchases in a calendar year.", claim: "amex-platinum/centurion-75k-guests" },
          { text: "Guests must be on the same flight as the Card Member.", claim: "amex-platinum/centurion-same-flight" },
          { text: "Card Members must arrive within 3 hours of their departing flight.", claim: "amex-platinum/centurion-arrival-window" },
          { text: "Guest policies at international locations may vary.", claim: "amex-platinum/centurion-international" },
        ],
      },
      {
        id: "priority-pass",
        name: "Priority Pass lounges",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        claims: ["amex-platinum/lounge-network", "amex-platinum/priority-pass-two-guests"],
        restrictions: [
          { text: "Enrollment required.", claim: "amex-platinum/lounge-network" },
          { text: "Guests beyond two pay Priority Pass's own guest fee, which Amex does not publish.", claim: "amex-platinum/priority-pass-two-guests" },
          { text: "Some lounges limit the number of guests or admit none.", claim: "amex-platinum/priority-pass-guest-limits" },
        ],
      },
      {
        id: "escape",
        name: "Escape Lounges",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        claims: ["amex-platinum/escape-two-guests"],
        restrictions: [{ text: "Two guests at no additional cost.", claim: "amex-platinum/escape-two-guests" }],
      },
      {
        id: "plaza-premium",
        name: "Plaza Premium Lounges",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        claims: ["amex-platinum/plaza-two-guests"],
        restrictions: [{ text: "Boarding pass for same-day travel required.", claim: "amex-platinum/plaza-same-day" }],
      },
      {
        id: "delta-sky-club",
        name: "Delta Sky Club",
        memberVisits: 10,
        freeGuests: 0,
        guestFee: 50,
        authorizedUsers: "unknown",
        claims: ["amex-platinum/sky-club-same-day-delta", "amex-platinum/sky-club-guests"],
        restrictions: [
          { text: "10 Visits per Medallion Year (Feb 1-Jan 31), only on a same-day ticket on a Delta-operated or Delta-marketed flight.", claim: "amex-platinum/sky-club-same-day-delta" },
          { text: "Not available on Delta Main Basic fares, for the Card Member or guests.", claim: "amex-platinum/sky-club-basic-economy" },
          { text: "Visits cannot be used for guests: up to two guests or immediate family pay $50 per person per visit.", claim: "amex-platinum/sky-club-guests" },
          { text: "Guests must also be flying a same-day Delta-operated flight.", claim: "amex-platinum/sky-club-guest-same-day" },
        ],
      },
    ],
    caveats: [
      "No complimentary Centurion guests below $75,000 of annual spend is the rule that decides most family comparisons.",
    ],
  },
  {
    cardSlug: "capital-one-venture-x",
    cardName: "Capital One Venture X",
    issuer: "Capital One",
    annualFee: 395,
    walletKey: "ventureX",
    sourceUrl: "https://www.capitalone.com/credit-cards/venture-x/",
    verifiedAt: LOUNGE_POLICIES_VERIFIED_AT,
    summary:
      "Complimentary access for the cardholder and two guests at 1,300+ lounges, including Capital One Lounges and its Partner Lounge Network. Capital One's page describes access for primary cardholders and does not publish a third-guest fee.",
    networks: [
      {
        id: "capital-one-lounges",
        name: "Capital One Lounges and Landings",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        claims: ["capital-one-venture-x/lounge-two-guests", "capital-one-venture-x/primary-cardholders"],
        restrictions: [
          { text: "Described for Venture X primary cardholders; authorized-user access is not stated.", claim: "capital-one-venture-x/primary-cardholders" },
        ],
      },
      {
        id: "priority-pass",
        name: "Priority Pass lounges",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        claims: ["capital-one-venture-x/lounge-two-guests", "capital-one-venture-x/priority-pass-enroll"],
        restrictions: [{ text: "Enrollment required.", claim: "capital-one-venture-x/priority-pass-enroll" }],
      },
    ],
    caveats: ["Fees for a third guest and authorized-user lounge rules are not on Capital One's product page; check your card's terms before you rely on them."],
  },
];

export function getLoungePolicy(cardSlug: string) {
  return loungePolicies.find((policy) => policy.cardSlug === cardSlug);
}

// Worked example used on the lounge page: two adults, two children (2-17), one card member, six visits a year.
export const FAMILY_PARTY: Party = { adults: 2, children: 2, cardMembers: 1, visitsPerYear: 6, meetsSpendUnlock: false };

export function familyExample(party: Party = FAMILY_PARTY) {
  const network = (cardSlug: string, id: string) => getLoungePolicy(cardSlug)!.networks.find((candidate) => candidate.id === id)!;
  return {
    reservePriorityPass: networkCost(network("chase-sapphire-reserve", "priority-pass"), party),
    reservePriorityPassWithAu: networkCost(network("chase-sapphire-reserve", "priority-pass"), { ...party, cardMembers: 2 }),
    platinumCenturion: networkCost(network("amex-platinum", "centurion"), party),
    platinumCenturion75k: networkCost(network("amex-platinum", "centurion"), { ...party, meetsSpendUnlock: true }),
    platinumPriorityPass: networkCost(network("amex-platinum", "priority-pass"), party),
    ventureXLounges: networkCost(network("capital-one-venture-x", "capital-one-lounges"), party),
    cheapest: loungePolicies.map((policy) => compareCard(policy, party)),
  };
}
