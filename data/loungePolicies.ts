import { compareCard, networkCost, type CardLoungePolicy, type Party } from "@/lib/loungeModel";

// Lounge guest policies for the first slice of cards (Issue #21). Every number and
// rule below is a claim in quality/issuer-claims.json (listed per row), checked
// against the issuer's own pages by `npm run verify:claims -- --issuers` in CI.
// Anything an issuer page does not state is "unknown" and shown as "Not published".
export const LOUNGE_POLICIES_VERIFIED_AT = "2026-11-09";

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
        kind: "priority-pass",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: 27,
        authorizedUsers: "included",
        conditions: ["Primary cardmembers and authorized users each get their own membership and two free guests.", "Some lounges limit or refuse guests."],
        claims: ["chase-sapphire-reserve/priority-pass-authorized-users", "chase-sapphire-reserve/priority-pass-guest-fee"],
      },
      {
        id: "sapphire-lounges",
        name: "Chase Sapphire Lounges by The Club",
        kind: "issuer",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        conditions: ["Chase's product page states access with up to two guests; it does not publish a fee for a third guest."],
        claims: ["chase-sapphire-reserve/lounge-network"],
      },
      {
        id: "maple-leaf",
        name: "Air Canada Maple Leaf Lounges",
        kind: "airline",
        memberVisits: "unknown",
        freeGuests: 1,
        guestFee: 59,
        authorizedUsers: "unknown",
        conditions: ["Same-day boarding pass on a Star Alliance flight required for the cardmember and guests.", "Additional-guest fee is $59 USD at U.S. lounges (local currency elsewhere)."],
        claims: ["chase-sapphire-reserve/maple-leaf", "chase-sapphire-reserve/maple-leaf-fee"],
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
        kind: "issuer",
        memberVisits: "unknown",
        freeGuests: 0,
        spendUnlock: { spend: 75000, freeGuests: 2 },
        guestFee: 50,
        childGuestFee: 30,
        authorizedUsers: "included",
        conditions: [
          "Guests must be on the same flight as the Card Member.",
          "Two complimentary guests per visit only after $75,000 in eligible purchases on the account in a calendar year.",
          "Additional Platinum Card Members on the account are admitted on the same terms.",
          "International locations may have different guest policies.",
        ],
        claims: [
          "amex-platinum/centurion-guest-fee",
          "amex-platinum/centurion-75k-guests",
          "amex-platinum/centurion-additional-cards",
          "amex-platinum/centurion-same-flight",
        ],
      },
      {
        id: "priority-pass",
        name: "Priority Pass lounges",
        kind: "priority-pass",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        conditions: ["Enrollment required.", "Guests beyond two pay Priority Pass's own guest fee, which Amex does not publish on its page.", "Some lounges limit or refuse guests."],
        claims: ["amex-platinum/lounge-network", "amex-platinum/priority-pass-two-guests"],
      },
      {
        id: "escape",
        name: "Escape Lounges",
        kind: "partner",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        conditions: ["Two guests at no additional cost."],
        claims: ["amex-platinum/escape-two-guests"],
      },
      {
        id: "plaza-premium",
        name: "Plaza Premium Lounges",
        kind: "partner",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        conditions: ["Up to two complimentary guests."],
        claims: ["amex-platinum/plaza-two-guests"],
      },
      {
        id: "delta-sky-club",
        name: "Delta Sky Club",
        kind: "airline",
        memberVisits: 10,
        freeGuests: 0,
        guestFee: 50,
        authorizedUsers: "unknown",
        conditions: [
          "10 Visits a year, only when flying a same-day eligible Delta flight.",
          "Visits cannot be used for guests: up to two guests or immediate family pay $50 per person per visit.",
        ],
        claims: ["amex-platinum/lounge-network", "amex-platinum/sky-club-guests"],
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
        kind: "issuer",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        conditions: ["Described for Venture X primary cardholders; authorized-user access is not stated on the product page."],
        claims: ["capital-one-venture-x/lounge-two-guests", "capital-one-venture-x/primary-cardholders"],
      },
      {
        id: "priority-pass",
        name: "Priority Pass lounges (Partner Lounge Network)",
        kind: "priority-pass",
        memberVisits: "unknown",
        freeGuests: 2,
        guestFee: "unknown",
        authorizedUsers: "unknown",
        conditions: ["Enrollment required.", "Some lounges limit or refuse guests."],
        claims: ["capital-one-venture-x/lounge-two-guests", "capital-one-venture-x/priority-pass-enroll"],
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
