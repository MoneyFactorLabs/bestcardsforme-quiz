import type { CardValueAnalysis, ValueLine } from "@/types/creditCardProfile";

// Conservative cents-per-point values. The first four mirror the published
// methodology table (data/trustPages.ts); airline currencies are provisional
// BCFM values until the methodology page lists them.
export const pointValuations = {
  cash: { centsPerPoint: 1, label: "cash back", published: true },
  chaseUltimateRewards: { centsPerPoint: 1.6, label: "Chase Ultimate Rewards point", published: true },
  amexMembershipRewards: { centsPerPoint: 1.7, label: "Amex Membership Rewards point", published: true },
  citiThankYou: { centsPerPoint: 1.5, label: "Citi ThankYou point", published: true },
  capitalOneMiles: { centsPerPoint: 1.4, label: "Capital One mile", published: true },
  unitedMiles: { centsPerPoint: 1.2, label: "United MileagePlus mile", published: false },
  southwestPoints: { centsPerPoint: 1.3, label: "Southwest Rapid Rewards point", published: false },
} as const;

export type RewardCurrency = keyof typeof pointValuations;

// The comparison every card has to beat: a $0-fee card earning 2% on everything.
export const BASELINE_CASH_BACK_RATE = 2;

export type SpendLine = {
  category: string;
  annualSpend: number;
  // Points (or percent, for cash back) earned per dollar.
  earnRate: number;
};

export type CreditLine = {
  name: string;
  faceValue: number;
  // Share of face value a typical target household realistically captures (0-1).
  captureRate: number;
  note?: string;
};

export type ValueModelInput = {
  annualFee: number;
  currency: RewardCurrency;
  spend: SpendLine[];
  credits: CreditLine[];
  alternateValuation?: {
    currency: RewardCurrency;
    scenario: string;
  };
};

export type ValueModelResult = {
  totalSpend: number;
  rewardsValue: number;
  creditsCaptured: number;
  netValue: number;
  baselineValue: number;
  vsBaseline: number;
  creditsNeededToMatchBaseline: number;
  bonusSpend: number;
  bonusSpendBreakEven: number | null;
  isBaselineCard: boolean;
};

function money(value: number) {
  const rounded = Math.round(Math.abs(value));
  return `$${rounded.toLocaleString("en-US")}`;
}

function signedMoney(value: number) {
  if (Math.round(value) === 0) return "$0";
  return `${value > 0 ? "+" : "−"}${money(value)}`;
}

function rewardsFor(spend: SpendLine[], centsPerPoint: number) {
  return spend.reduce((sum, line) => sum + (line.annualSpend * line.earnRate * centsPerPoint) / 100, 0);
}

function formatRate(line: SpendLine, currency: RewardCurrency) {
  return currency === "cash" ? `${line.earnRate}%` : `${line.earnRate}x`;
}

export function computeValueModel(input: ValueModelInput): ValueModelResult {
  const { centsPerPoint } = pointValuations[input.currency];
  const totalSpend = input.spend.reduce((sum, line) => sum + line.annualSpend, 0);
  const rewardsValue = rewardsFor(input.spend, centsPerPoint);
  const creditsCaptured = input.credits.reduce(
    (sum, credit) => sum + credit.faceValue * credit.captureRate,
    0,
  );
  const netValue = rewardsValue + creditsCaptured - input.annualFee;
  const baselineValue = (totalSpend * BASELINE_CASH_BACK_RATE) / 100;

  // Margin (in dollars) each spend line earns over the 2% baseline.
  const margin = (line: SpendLine) =>
    (line.annualSpend * (line.earnRate * centsPerPoint - BASELINE_CASH_BACK_RATE)) / 100;
  const bonusLines = input.spend.filter((line) => line.earnRate * centsPerPoint > BASELINE_CASH_BACK_RATE);
  const otherLines = input.spend.filter((line) => line.earnRate * centsPerPoint <= BASELINE_CASH_BACK_RATE);
  const bonusSpend = bonusLines.reduce((sum, line) => sum + line.annualSpend, 0);
  const bonusMarginPerDollar =
    bonusSpend > 0 ? bonusLines.reduce((sum, line) => sum + margin(line), 0) / bonusSpend : 0;
  const otherMargin = otherLines.reduce((sum, line) => sum + margin(line), 0);

  // Bonus-category spend (at the assumed mix) where the card ties the baseline.
  const bonusSpendBreakEven =
    bonusMarginPerDollar > 0
      ? (input.annualFee - creditsCaptured - otherMargin) / bonusMarginPerDollar
      : null;

  const isBaselineCard =
    input.annualFee === 0 &&
    creditsCaptured === 0 &&
    input.spend.every((line) => line.earnRate * centsPerPoint === BASELINE_CASH_BACK_RATE);

  return {
    totalSpend,
    rewardsValue,
    creditsCaptured,
    netValue,
    baselineValue,
    vsBaseline: netValue - baselineValue,
    creditsNeededToMatchBaseline: Math.max(0, baselineValue - rewardsValue + input.annualFee),
    bonusSpend,
    bonusSpendBreakEven,
    isBaselineCard,
  };
}

function describeBreakEven(input: ValueModelInput, result: ValueModelResult) {
  if (result.isBaselineCard) {
    return "This card is the baseline: every other card profile is measured against a $0-fee card earning 2% on everything.";
  }

  if (result.creditsCaptured > 0) {
    return `At this spending, the card has to deliver about ${money(
      result.creditsNeededToMatchBaseline,
    )} a year in credits and perks you actually use just to tie a $0, 2% flat-rate card. Our assumptions count ${money(
      result.creditsCaptured,
    )}; if your real usage is lower, the gap closes quickly.`;
  }

  if (result.bonusSpendBreakEven === null) {
    return "On cash value alone, no category on this card beats a 2% flat-rate card at this spending; its case rests on perks or point pooling.";
  }

  if (result.bonusSpendBreakEven <= 0) {
    return "At this spending mix the card beats a $0, 2% flat-rate card even before its bonus categories add anything.";
  }

  return `At this spending mix, the card beats a $0, 2% flat-rate card once about ${money(
    result.bonusSpendBreakEven,
  )} a year runs through its bonus categories (we assume ${money(result.bonusSpend)}).${
    input.annualFee > 0 ? " Below that, the annual fee is not paying for itself." : ""
  }`;
}

function describeComparison(vsBaseline: number) {
  if (Math.abs(vsBaseline) < 25) return "about the same as";
  return vsBaseline > 0 ? `${money(vsBaseline)} more than` : `${money(vsBaseline)} less than`;
}

export function buildValueAnalysis(input: ValueModelInput): CardValueAnalysis {
  const result = computeValueModel(input);
  const valuation = pointValuations[input.currency];

  const lines: ValueLine[] = [
    ...input.spend.map((line) => ({
      label: `${line.category}: ${money(line.annualSpend)} at ${formatRate(line, input.currency)}`,
      value: money((line.annualSpend * line.earnRate * valuation.centsPerPoint) / 100),
    })),
    ...(input.credits.length > 0
      ? [{ label: "Credits and perks captured (friction-adjusted)", value: money(result.creditsCaptured) }]
      : []),
    { label: "Annual fee (Year 2)", value: input.annualFee === 0 ? "$0" : `−${money(input.annualFee)}` },
    { label: "Year-2 net value", value: money(result.netValue), emphasis: true },
    {
      label: `$0, 2% flat-card baseline on the same ${money(result.totalSpend)}`,
      value: money(result.baselineValue),
      emphasis: true,
    },
    { label: "Difference vs. baseline", value: signedMoney(result.vsBaseline), emphasis: true },
  ];

  const assumptions = [
    `${money(result.totalSpend)} of annual spending on this card, split as shown.`,
    input.currency === "cash"
      ? "Rewards valued as cash back at 1¢ each."
      : `Rewards valued at ${valuation.centsPerPoint}¢ per ${valuation.label}${
          valuation.published ? " (published MoneyFactor methodology)" : " (provisional MoneyFactor valuation)"
        }.`,
    "Welcome bonus excluded: this is Year-2 math, when the card has to earn its keep.",
    ...input.credits.map(
      (credit) =>
        `${credit.name}: ${money(credit.faceValue)} face value counted at ${Math.round(
          credit.captureRate * 100,
        )}% = ${money(credit.faceValue * credit.captureRate)}.${credit.note ? ` ${credit.note}` : ""}`,
    ),
  ];

  let alternateValuation: string | undefined;
  if (input.alternateValuation) {
    const alt = pointValuations[input.alternateValuation.currency];
    const altRewards = rewardsFor(input.spend, alt.centsPerPoint);
    const altNet = altRewards + result.creditsCaptured - input.annualFee;
    alternateValuation = `If you ${input.alternateValuation.scenario}, the same spending is worth about ${money(
      altRewards,
    )} in rewards at ${alt.centsPerPoint}¢ per point: a Year-2 net of ${money(altNet)}, ${describeComparison(
      altNet - result.baselineValue,
    )} the 2% baseline.`;
  }

  return {
    summary: result.isBaselineCard
      ? `Year-2 value of about ${money(result.netValue)} on ${money(
          result.totalSpend,
        )} of annual spending, with no fee or credits to offset.`
      : `Year-2 net value of about ${money(result.netValue)} on ${money(
          result.totalSpend,
        )} of annual spending: ${describeComparison(result.vsBaseline)} a $0, 2% flat-rate card.`,
    assumptions,
    lines,
    breakEven: describeBreakEven(input, result),
    alternateValuation,
  };
}
