// Lounge guest-cost math. Policies live in data/loungePolicies.ts and every number
// there is a claim in quality/issuer-claims.json checked against issuer pages.
// "unknown" is a first-class value: the model never guesses a fee or a guest count.

export type Known<T> = T | "unknown";

export type LoungeNetworkKind = "issuer" | "priority-pass" | "airline" | "partner";

export type NetworkAccess = {
  id: string;
  name: string;
  kind: LoungeNetworkKind;
  // Visits a year the cardholder gets; "unlimited" only when the issuer says so.
  cardholderVisits: Known<number | "unlimited">;
  visitCondition?: string;
  // Guests admitted free with each eligible member, per visit.
  freeGuests: Known<number>;
  freeGuestsCondition?: string;
  // Fee per additional guest, per visit (USD).
  guestFee: Known<number>;
  authorizedUsers: Known<"included" | "not-included">;
  authorizedUserNote?: string;
  enrollmentRequired?: boolean;
  conditions: string[];
  // "<product id>/<claim id>" entries in quality/issuer-claims.json backing this row.
  claims: string[];
};

export type CardLoungePolicy = {
  cardSlug: string;
  cardName: string;
  issuer: string;
  annualFee: number;
  sourceUrl: string;
  verifiedAt: string;
  networks: NetworkAccess[];
  caveats: string[];
};

export type Party = {
  // People travelling together, including the cardholder.
  travelers: number;
  // How many of them hold their own card on the account (primary + authorized users).
  cardMembers: number;
  visitsPerYear: number;
};

export type NetworkCost = {
  network: NetworkAccess;
  payingGuestsPerVisit: Known<number>;
  annualGuestCost: Known<number>;
  // True when the visit count exceeds a published annual cap.
  exceedsVisitCap: boolean;
};

export const PARTY_LIMITS = {
  travelers: { min: 1, max: 10 },
  cardMembers: { min: 1, max: 10 },
  visitsPerYear: { min: 0, max: 200 },
} as const;

export function validateParty(party: Party): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(PARTY_LIMITS) as (keyof Party)[]) {
    const value = party[key];
    const { min, max } = PARTY_LIMITS[key];
    if (!Number.isInteger(value) || value < min || value > max) errors.push(`${key} must be a whole number from ${min} to ${max}.`);
  }
  if (party.cardMembers > party.travelers) errors.push("cardMembers cannot exceed travelers.");
  return errors;
}

// Guests who would pay on one visit to this network.
export function payingGuests(network: NetworkAccess, party: Party): Known<number> {
  // Card members only count as members when the network admits authorized users.
  const members = network.authorizedUsers === "included" ? party.cardMembers : 1;
  if (network.authorizedUsers === "unknown" && party.cardMembers > 1) return "unknown";
  const guests = party.travelers - members;
  if (guests <= 0) return 0;
  if (network.freeGuests === "unknown") return "unknown";
  // Each eligible member may bring the free-guest allowance.
  return Math.max(0, guests - network.freeGuests * members);
}

export function networkCost(network: NetworkAccess, party: Party): NetworkCost {
  const paying = payingGuests(network, party);
  const cap = network.cardholderVisits;
  const exceedsVisitCap = typeof cap === "number" && party.visitsPerYear > cap;
  let annualGuestCost: Known<number>;
  if (paying === "unknown") annualGuestCost = "unknown";
  else if (paying === 0) annualGuestCost = 0;
  else if (network.guestFee === "unknown") annualGuestCost = "unknown";
  else annualGuestCost = paying * network.guestFee * party.visitsPerYear;
  return { network, payingGuestsPerVisit: paying, annualGuestCost, exceedsVisitCap };
}

// Cheapest known option for this party on a card, ignoring networks whose cost is unknown.
export function cheapestNetwork(policy: CardLoungePolicy, party: Party): NetworkCost | undefined {
  const known = policy.networks
    .map((network) => networkCost(network, party))
    .filter((cost): cost is NetworkCost & { annualGuestCost: number } => typeof cost.annualGuestCost === "number" && !cost.exceedsVisitCap);
  return known.sort((a, b) => a.annualGuestCost - b.annualGuestCost)[0];
}
