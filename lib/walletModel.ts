import { BASELINE_CASH_BACK_RATE, pointValuations, type RewardCurrency } from "@/lib/cardValueModel";

// Year-2 wallet math for multi-card articles: every dollar of spend goes to the
// card in the wallet that returns the most on it (respecting caps), credits count
// at a stated capture rate, overlapping perks (e.g. lounge access on two cards)
// count once, and every annual fee is paid. Welcome bonuses are excluded.

export type WalletCategory =
  | "groceries"
  | "dining"
  | "airfare"
  | "hotels"
  | "gas"
  | "other"
  | "businessBonus"
  | "businessOther";

export type WalletEarn = {
  // Points (or percent, for cash back) per dollar.
  rate: number;
  // Annual spend the rate applies to; spend above it falls to the next-best option.
  cap?: number;
};

export type WalletCredit = {
  name: string;
  faceValue: number;
  // Share of face value the household realistically captures (0-1).
  captureRate: number;
  // Perks that duplicate across cards (lounge access) count once per wallet: the highest value wins.
  overlapGroup?: string;
};

export type WalletCard = {
  id: string;
  name: string;
  annualFee: number;
  currency: RewardCurrency;
  // "other" is the card's base rate for any category it does not list.
  earn: Partial<Record<WalletCategory, WalletEarn>> & { other: WalletEarn };
  credits: WalletCredit[];
  // Annual fee refunded when at least this much spend goes on the card (e.g. Spark Cash Plus).
  feeWaivedAtSpend?: number;
};

export type WalletSpend = Partial<Record<WalletCategory, number>>;

export type WalletAllocation = {
  category: WalletCategory;
  cardId: string;
  amount: number;
  value: number;
};

export type WalletResult = {
  cardIds: string[];
  totalSpend: number;
  rewards: number;
  credits: number;
  fees: number;
  net: number;
  // Net value minus what a $0, 2% flat card earns on the same spend.
  vsBaseline: number;
  allocations: WalletAllocation[];
};

// Optional per-currency cents-per-point override, e.g. { amexMembershipRewards: 1 } for a cash-out sensitivity.
export type ValuationOverride = Partial<Record<RewardCurrency, number>>;

function centsPerDollar(card: WalletCard, earn: WalletEarn, valuation: ValuationOverride) {
  return earn.rate * (valuation[card.currency] ?? pointValuations[card.currency].centsPerPoint);
}

export function walletValue(cards: WalletCard[], spend: WalletSpend, valuation: ValuationOverride = {}): WalletResult {
  const allocations: WalletAllocation[] = [];
  const spendByCard = new Map<string, number>();

  for (const [category, amount] of Object.entries(spend) as [WalletCategory, number][]) {
    const options = cards
      .map((card) => ({ card, earn: card.earn[category] ?? card.earn.other }))
      .sort((a, b) => centsPerDollar(b.card, b.earn, valuation) - centsPerDollar(a.card, a.earn, valuation));
    let remaining = amount;
    for (const { card, earn } of options) {
      if (remaining <= 0) break;
      const used = Math.min(remaining, earn.cap ?? Infinity);
      allocations.push({ category, cardId: card.id, amount: used, value: (used * centsPerDollar(card, earn, valuation)) / 100 });
      spendByCard.set(card.id, (spendByCard.get(card.id) ?? 0) + used);
      remaining -= used;
    }
  }

  const overlap = new Map<string, number>();
  let credits = 0;
  for (const credit of cards.flatMap((card) => card.credits)) {
    const captured = credit.faceValue * credit.captureRate;
    if (credit.overlapGroup) overlap.set(credit.overlapGroup, Math.max(overlap.get(credit.overlapGroup) ?? 0, captured));
    else credits += captured;
  }
  credits += [...overlap.values()].reduce((sum, value) => sum + value, 0);

  const fees = cards.reduce(
    (sum, card) => sum + (card.feeWaivedAtSpend && (spendByCard.get(card.id) ?? 0) >= card.feeWaivedAtSpend ? 0 : card.annualFee),
    0,
  );
  const rewards = allocations.reduce((sum, allocation) => sum + allocation.value, 0);
  const totalSpend = Object.values(spend).reduce((sum, amount) => sum + (amount ?? 0), 0);
  const net = rewards + credits - fees;

  return {
    cardIds: cards.map((card) => card.id),
    totalSpend,
    rewards,
    credits,
    fees,
    net,
    vsBaseline: net - (totalSpend * BASELINE_CASH_BACK_RATE) / 100,
    allocations,
  };
}

// What adding `added` to an existing wallet is worth, after its fee.
export function incrementalValue(
  existing: WalletCard[],
  added: WalletCard[],
  spend: WalletSpend,
  valuation: ValuationOverride = {},
) {
  return walletValue([...existing, ...added], spend, valuation).net - walletValue(existing, spend, valuation).net;
}

// Same card, different capture assumptions (credits only).
export function withCapture(card: WalletCard, captureRates: Record<string, number>): WalletCard {
  return {
    ...card,
    credits: card.credits.map((credit) =>
      credit.name in captureRates ? { ...credit, captureRate: captureRates[credit.name] } : credit,
    ),
  };
}

export function formatDollars(value: number) {
  const rounded = Math.round(Math.abs(value));
  return `${value < 0 && rounded !== 0 ? "−" : ""}$${rounded.toLocaleString("en-US")}`;
}

export function formatSigned(value: number) {
  const rounded = Math.round(value);
  if (rounded === 0) return "$0";
  return `${rounded > 0 ? "+" : "−"}$${Math.abs(rounded).toLocaleString("en-US")}`;
}
