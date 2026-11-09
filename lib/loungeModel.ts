// Lounge guest-cost math. Policies live in data/loungePolicies.ts and every number
// there is a claim in quality/issuer-claims.json checked against issuer pages.
// "unknown" is a first-class value: the model never guesses a fee or a guest count.

export type Known<T> = T | "unknown";

export type LoungeNetworkKind = "issuer" | "priority-pass" | "airline" | "partner";

export type NetworkAccess = {
  id: string;
  name: string;
  kind: LoungeNetworkKind;
  // Visits a year included for the card member; "unlimited" only when the issuer says so.
  memberVisits: Known<number | "unlimited">;
  // Guests admitted free with each eligible member, per visit.
  freeGuests: Known<number>;
  // Free guests after a published annual spend threshold (e.g. Centurion after $75,000).
  spendUnlock?: { spend: number; freeGuests: number };
  // Fee per paying guest per visit (USD); childGuestFee applies to ages 2-17 where published.
  guestFee: Known<number>;
  childGuestFee?: number;
  // Whether authorized users / additional card members on the account get their own access.
  authorizedUsers: Known<"included" | "not-included">;
  conditions: string[];
  // "<product id>/<claim id>" entries in quality/issuer-claims.json backing this row.
  claims: string[];
};

export type CardLoungePolicy = {
  cardSlug: string;
  cardName: string;
  issuer: string;
  annualFee: number;
  // Key in data/walletScenarios.ts walletCards, for Year-2 card economics.
  walletKey: "sapphireReserve" | "amexPlatinum" | "ventureX";
  sourceUrl: string;
  verifiedAt: string;
  summary: string;
  networks: NetworkAccess[];
  caveats: string[];
};

export type Party = {
  // Adults travelling together, including the cardholder.
  adults: number;
  // Children aged 2-17 (under-2s are not counted; most lounges admit them free).
  children: number;
  // Travellers who hold their own card on the account (primary + authorized users), all adults.
  cardMembers: number;
  visitsPerYear: number;
  // The household meets a card's published spend threshold for complimentary guests.
  meetsSpendUnlock: boolean;
};

export const PARTY_LIMITS = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
  cardMembers: { min: 1, max: 9 },
  visitsPerYear: { min: 0, max: 200 },
} as const;

export type PartyError = { field: keyof typeof PARTY_LIMITS; message: string };

export function validateParty(party: Party): PartyError[] {
  const errors: PartyError[] = [];
  for (const field of Object.keys(PARTY_LIMITS) as (keyof typeof PARTY_LIMITS)[]) {
    const value = party[field];
    const { min, max } = PARTY_LIMITS[field];
    if (!Number.isInteger(value) || value < min || value > max) errors.push({ field, message: `Enter a whole number from ${min} to ${max}.` });
  }
  if (!errors.length && party.cardMembers > party.adults) {
    errors.push({ field: "cardMembers", message: "Can't be more than the number of adults travelling." });
  }
  return errors;
}

export type NetworkCost = {
  network: NetworkAccess;
  // Card members this network admits in their own right.
  members: number;
  freeGuestsPerVisit: Known<number>;
  payingAdults: Known<number>;
  payingChildren: Known<number>;
  perVisit: Known<number>;
  annual: Known<number>;
  // Visits a year above a published cap (paid separately; not priced here).
  exceedsMemberVisits: boolean;
};

export function networkCost(network: NetworkAccess, party: Party): NetworkCost {
  const auKnown = network.authorizedUsers !== "unknown" || party.cardMembers === 1;
  const members = network.authorizedUsers === "included" ? party.cardMembers : 1;
  const exceedsMemberVisits = typeof network.memberVisits === "number" && party.visitsPerYear > network.memberVisits;
  const base = { network, members, exceedsMemberVisits };

  if (!auKnown) {
    return { ...base, freeGuestsPerVisit: "unknown", payingAdults: "unknown", payingChildren: "unknown", perVisit: "unknown", annual: "unknown" };
  }
  const freePerMember = party.meetsSpendUnlock && network.spendUnlock ? network.spendUnlock.freeGuests : network.freeGuests;
  const guestAdults = party.adults - members;
  const guestChildren = party.children;
  if (guestAdults + guestChildren === 0) {
    return { ...base, freeGuestsPerVisit: freePerMember, payingAdults: 0, payingChildren: 0, perVisit: 0, annual: 0 };
  }
  if (freePerMember === "unknown") {
    return { ...base, freeGuestsPerVisit: "unknown", payingAdults: "unknown", payingChildren: "unknown", perVisit: "unknown", annual: "unknown" };
  }
  // Free places go to adults first, the costlier guests where a child rate exists.
  let free = freePerMember * members;
  const payingAdults = Math.max(0, guestAdults - free);
  free = Math.max(0, free - guestAdults);
  const payingChildren = Math.max(0, guestChildren - free);
  if (payingAdults + payingChildren === 0) {
    return { ...base, freeGuestsPerVisit: freePerMember, payingAdults, payingChildren, perVisit: 0, annual: 0 };
  }
  if (network.guestFee === "unknown") {
    return { ...base, freeGuestsPerVisit: freePerMember, payingAdults, payingChildren, perVisit: "unknown", annual: "unknown" };
  }
  const perVisit = payingAdults * network.guestFee + payingChildren * (network.childGuestFee ?? network.guestFee);
  return { ...base, freeGuestsPerVisit: freePerMember, payingAdults, payingChildren, perVisit, annual: perVisit * party.visitsPerYear };
}

export type CardLoungeResult = {
  policy: CardLoungePolicy;
  costs: NetworkCost[];
  // Lowest known annual guest cost on a network without a visit cap the party exceeds.
  cheapest?: NetworkCost & { annual: number };
};

export function compareCard(policy: CardLoungePolicy, party: Party): CardLoungeResult {
  const costs = policy.networks.map((network) => networkCost(network, party));
  const cheapest = costs
    .filter((cost): cost is NetworkCost & { annual: number } => typeof cost.annual === "number" && !cost.exceedsMemberVisits)
    .sort((a, b) => a.annual - b.annual)[0];
  return { policy, costs, cheapest };
}
