import { BASELINE_CASH_BACK_RATE, computeValueModel, pointValuations } from "@/lib/cardValueModel";
import { walletCards } from "@/data/walletScenarios";

// Annual-fee break-even calculator: the card value model (Year 2, no welcome
// bonus, measured against a $0 card earning 2% on everything) with the user's
// own spend, earn rates, point value and the credits they would use anyway.

export type FeeInputs = {
  annualFee: number;
  bonusSpend: number;
  bonusRate: number;
  otherSpend: number;
  otherRate: number;
  centsPerPoint: number;
  creditsUsed: number;
};

export type FieldName = keyof FeeInputs;

export const FIELD_LIMITS: Record<FieldName, { min: number; max: number; label: string }> = {
  annualFee: { min: 0, max: 5000, label: "Annual fee" },
  bonusSpend: { min: 0, max: 2_000_000, label: "Yearly spend in the card's bonus categories" },
  bonusRate: { min: 0, max: 25, label: "Bonus-category earn rate" },
  otherSpend: { min: 0, max: 2_000_000, label: "Yearly spend on everything else" },
  otherRate: { min: 0, max: 10, label: "Earn rate on everything else" },
  centsPerPoint: { min: 0.1, max: 3, label: "Value per point" },
  creditsUsed: { min: 0, max: 10_000, label: "Credits you would use anyway" },
};

export type FeeResult = {
  rewards: number;
  credits: number;
  net: number;
  baseline: number;
  vsBaseline: number;
  // Credits (in dollars) the card must deliver to tie the 2% baseline at this spend.
  creditsToBreakEven: number;
  // Bonus-category spend at which the card ties the baseline, other inputs held; null if no amount can.
  bonusSpendToBreakEven: number | null;
  verdict: "beats-baseline" | "ties-baseline" | "below-baseline";
};

// Parses raw form values. Returns per-field errors instead of guessing.
export function parseInputs(raw: Record<FieldName, string>): { inputs?: FeeInputs; errors: Partial<Record<FieldName, string>> } {
  const errors: Partial<Record<FieldName, string>> = {};
  const values = {} as FeeInputs;
  for (const field of Object.keys(FIELD_LIMITS) as FieldName[]) {
    const { min, max, label } = FIELD_LIMITS[field];
    const text = (raw[field] ?? "").replace(/[$,\s¢x%]/gi, "");
    if (text === "") {
      errors[field] = `${label} is required.`;
      continue;
    }
    const value = Number(text);
    if (!Number.isFinite(value)) errors[field] = `${label} must be a number.`;
    else if (value < min || value > max) errors[field] = `${label} must be between ${min.toLocaleString("en-US")} and ${max.toLocaleString("en-US")}.`;
    else values[field] = value;
  }
  return Object.keys(errors).length ? { errors } : { inputs: values, errors };
}

export function computeBreakEven(inputs: FeeInputs): FeeResult {
  // Express points as percent cash back (points per dollar × cents per point) so the
  // card value model can run with the user's own valuation.
  const result = computeValueModel({
    annualFee: inputs.annualFee,
    currency: "cash",
    spend: [
      { category: "Bonus categories", annualSpend: inputs.bonusSpend, earnRate: inputs.bonusRate * inputs.centsPerPoint },
      { category: "Everything else", annualSpend: inputs.otherSpend, earnRate: inputs.otherRate * inputs.centsPerPoint },
    ],
    credits: inputs.creditsUsed > 0 ? [{ name: "Credits you would use anyway", faceValue: inputs.creditsUsed, captureRate: 1 }] : [],
  });

  // Break-even bonus spend, solved directly so it stays defined when current bonus spend is zero.
  const bonusMargin = (inputs.bonusRate * inputs.centsPerPoint - BASELINE_CASH_BACK_RATE) / 100;
  const otherMargin = (inputs.otherSpend * (inputs.otherRate * inputs.centsPerPoint - BASELINE_CASH_BACK_RATE)) / 100;
  const gap = inputs.annualFee - inputs.creditsUsed - otherMargin;
  const bonusSpendToBreakEven = gap <= 0 ? 0 : bonusMargin > 0 ? gap / bonusMargin : null;

  const vsBaseline = result.vsBaseline;
  return {
    rewards: result.rewardsValue,
    credits: result.creditsCaptured,
    net: result.netValue,
    baseline: result.baselineValue,
    vsBaseline,
    creditsToBreakEven: Math.max(0, result.creditsNeededToMatchBaseline),
    bonusSpendToBreakEven,
    verdict: Math.abs(vsBaseline) < 0.5 ? "ties-baseline" : vsBaseline > 0 ? "beats-baseline" : "below-baseline",
  };
}

export type Preset = { id: string; label: string; note: string; values: Omit<FeeInputs, "bonusSpend" | "otherSpend" | "creditsUsed"> };

const cpp = (currency: keyof typeof pointValuations) => pointValuations[currency].centsPerPoint;

// Presets use the verified terms already in data/walletScenarios.ts; the user supplies spend and credits.
export const presets: Preset[] = [
  {
    id: "amex-gold",
    label: "Amex Gold",
    note: "Bonus categories: restaurants and U.S. supermarkets (4x, capped at $50,000 and $25,000 a year).",
    values: { annualFee: walletCards.amexGold.annualFee, bonusRate: 4, otherRate: 1, centsPerPoint: cpp("amexMembershipRewards") },
  },
  {
    id: "chase-sapphire-reserve",
    label: "Chase Sapphire Reserve",
    note: "Bonus categories: flights and hotels booked direct (4x). Dining earns 3x; Chase Travel 8x.",
    values: { annualFee: walletCards.sapphireReserve.annualFee, bonusRate: 4, otherRate: 1, centsPerPoint: cpp("chaseUltimateRewards") },
  },
  {
    id: "amex-platinum",
    label: "Amex Platinum",
    note: "Bonus category: flights booked direct or through Amex Travel (5x).",
    values: { annualFee: walletCards.amexPlatinum.annualFee, bonusRate: 5, otherRate: 1, centsPerPoint: cpp("amexMembershipRewards") },
  },
  {
    id: "capital-one-venture-x",
    label: "Capital One Venture X",
    note: "2 miles per dollar on everything; put all spend in either row.",
    values: { annualFee: walletCards.ventureX.annualFee, bonusRate: 2, otherRate: 2, centsPerPoint: cpp("capitalOneMiles") },
  },
  {
    id: "ink-business-preferred",
    label: "Chase Ink Business Preferred",
    note: "Bonus categories: travel, shipping, internet/cable/phone and social/search ads (3x on the first $150,000 a year).",
    values: { annualFee: walletCards.inkPreferred.annualFee, bonusRate: 3, otherRate: 1, centsPerPoint: cpp("chaseUltimateRewards") },
  },
];
