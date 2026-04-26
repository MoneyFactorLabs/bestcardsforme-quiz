import { cards } from "@/data/cards";
import type { CreditCard, RecommendedCard } from "@/types/card";
import type {
  AnnualFeeComfort,
  CreditScoreRange,
  MainGoal,
  MonthlySpend,
  QuizAnswers,
  SpendingCategory,
  TravelFrequency,
} from "@/types/quiz";

const creditScoreRank: Record<CreditScoreRange, number> = {
  rebuilding: 0,
  fair: 1,
  good: 2,
  excellent: 3,
};

const spendScore: Record<MonthlySpend, number> = {
  under1500: 0,
  "1500to3000": 7,
  "3000to6000": 15,
  "6000plus": 24,
};

const goalLabels: Record<MainGoal, string> = {
  travel: "travel rewards",
  cashBack: "cash back",
  hotel: "hotel perks",
  airline: "airline perks",
  balanceTransfer: "balance transfer or low APR value",
  business: "business expense rewards",
};

const categoryLabels: Record<SpendingCategory, string> = {
  groceries: "groceries",
  dining: "dining",
  travel: "travel",
  gas: "gas",
  onlineShopping: "online shopping",
  mixed: "mixed everyday spending",
};

const travelLabels: Record<TravelFrequency, string> = {
  rarely: "rare travel",
  "1to2": "occasional travel",
  "3to5": "regular travel",
  monthly: "frequent travel",
};

function getCapturedAnnualValue(card: CreditCard, answers: QuizAnswers) {
  const midpoint = (card.valueEstimateLow + card.valueEstimateHigh) / 2;
  let captureRate = 0.48;

  if (answers.monthlySpend === "1500to3000") captureRate += 0.08;
  if (answers.monthlySpend === "3000to6000") captureRate += 0.18;
  if (answers.monthlySpend === "6000plus") captureRate += 0.28;

  if (card.goalFit.includes(answers.mainGoal)) captureRate += 0.12;
  if (card.categoryFit.includes(answers.topCategory)) captureRate += 0.1;
  if (card.travelFit.includes(answers.travelFrequency)) captureRate += 0.1;

  if (answers.simplicity === "optimizeIfHigh") captureRate += 0.1;
  if (answers.simplicity === "pointsStrategy") captureRate += 0.16;
  if (answers.simplicity === "simple" && card.annualFee >= 400) captureRate -= 0.18;

  if (answers.loungeAccess === "yes" && card.loungeValue === "high") captureRate += 0.13;
  if (answers.loungeAccess === "maybe" && card.loungeValue === "high") captureRate += 0.06;
  if (answers.loungeAccess === "no" && card.loungeValue === "high") captureRate -= 0.14;

  if (answers.travelFrequency === "rarely" && card.annualFee >= 400) captureRate -= 0.28;
  if (answers.travelFrequency === "monthly" && card.type.includes("travel")) captureRate += 0.14;

  const boundedRate = Math.max(0.22, Math.min(1.08, captureRate));
  return Math.round(midpoint * boundedRate - card.annualFee);
}

function valueCaptureScore(card: CreditCard, answers: QuizAnswers) {
  const capturedValue = getCapturedAnnualValue(card, answers);

  if (capturedValue >= 350) return 32;
  if (capturedValue >= 200) return 24;
  if (capturedValue >= 100) return 16;
  if (capturedValue >= 0) return 8;
  if (answers.annualFeeComfort === "zero") return -18;
  return -8;
}

function feeAndUtilizationScore(card: CreditCard, answers: QuizAnswers) {
  const isPremium = card.annualFee >= 395;
  const isLowFee = card.annualFee > 0 && card.annualFee < 150;

  if (answers.annualFeeComfort === "zero") return card.annualFee === 0 ? 20 : -42;

  let score = 0;

  if (answers.annualFeeComfort === "under100") {
    if (card.annualFee === 0) score += 12;
    else if (card.annualFee <= 100) score += 18;
    else if (card.annualFee <= 400) score -= 6;
    else score -= 24;
  }

  if (answers.annualFeeComfort === "100to400") {
    if (card.annualFee <= 400) score += isLowFee ? 15 : 18;
    else score -= 10;
  }

  if (answers.annualFeeComfort === "400plus") {
    score += isPremium ? 16 : 8;
  }

  if (isPremium) {
    const supportedByTravel = ["3to5", "monthly"].includes(answers.travelFrequency);
    const supportedByPerks = answers.loungeAccess !== "no" && card.loungeValue === "high";
    const supportedByOptimization = answers.simplicity !== "simple";

    if (supportedByTravel) score += 10;
    if (supportedByPerks) score += 10;
    if (supportedByOptimization) score += 8;
    if (!supportedByTravel && !supportedByPerks) score -= 18;
  }

  return score;
}

function getSpendMultiplier(answers: QuizAnswers, card: CreditCard) {
  if (answers.monthlySpend === "under1500" && card.annualFee >= 400) return -10;
  if (answers.monthlySpend === "6000plus" && card.annualFee > 0) return 12;
  if (answers.monthlySpend === "3000to6000" && card.annualFee > 0) return 8;
  return 0;
}

function explainFee(card: CreditCard, comfort: AnnualFeeComfort) {
  if (card.annualFee === 0) return "No annual fee keeps the math simple and low-risk.";
  if (comfort === "zero") return "The annual fee is above your stated comfort zone, so the score is penalized.";
  if (comfort === "400plus" && card.annualFee >= 400) {
    return "You are open to premium fees, so the engine tests whether your perk usage can capture enough net value.";
  }
  return `The $${card.annualFee} annual fee fits within or near your stated comfort range.`;
}

function buildExplanation(card: CreditCard, answers: QuizAnswers): string[] {
  const bullets: string[] = [];

  if (card.goalFit.includes(answers.mainGoal)) {
    bullets.push(`Strong match for your stated ${goalLabels[answers.mainGoal]} priority.`);
  }

  if (card.categoryFit.includes(answers.topCategory)) {
    bullets.push(`Rewards line up with your ${categoryLabels[answers.topCategory]} spending pattern.`);
  }

  if (card.travelFit.includes(answers.travelFrequency)) {
    bullets.push(`Travel benefits look appropriate for a ${travelLabels[answers.travelFrequency]} profile.`);
  }

  if (answers.loungeAccess !== "no" && card.loungeValue === "high") {
    bullets.push("Premium lounge access is treated as captured value because your answers support using it.");
  }

  if (card.simplicityFit.includes(answers.simplicity)) {
    bullets.push(
      answers.simplicity === "simple"
        ? "The rewards structure can work without heavy points optimization."
        : "The card has enough premium upside for a household willing to optimize rewards."
    );
  }

  const capturedValue = getCapturedAnnualValue(card, answers);
  if (capturedValue > 0) {
    bullets.push(`Estimated captured net value clears the annual fee by about $${capturedValue}.`);
  }

  bullets.push(explainFee(card, answers.annualFeeComfort));

  return bullets.slice(0, 4);
}

function buildLowerFitReason(card: CreditCard, answers: QuizAnswers) {
  if (card.businessOnly && answers.businessCards === "no") {
    return "It ranked lower because you said you are not open to business cards.";
  }

  if (answers.annualFeeComfort === "zero" && card.annualFee > 0) {
    return `It ranked lower because its $${card.annualFee} annual fee conflicts with your $0-fee preference.`;
  }

  if (answers.travelFrequency === "rarely" && card.annualFee >= 400) {
    return "It ranked lower because premium travel perks are hard to justify when you rarely travel.";
  }

  if (answers.loungeAccess === "no" && card.loungeValue === "high") {
    return "It ranked lower because a meaningful part of its value comes from lounge access you do not prioritize.";
  }

  if (!card.goalFit.includes(answers.mainGoal)) {
    return `It ranked lower because it is not primarily built around your ${goalLabels[answers.mainGoal]} goal.`;
  }

  if (!card.categoryFit.includes(answers.topCategory)) {
    return `It ranked lower because its strongest rewards do not directly match your ${categoryLabels[answers.topCategory]} spend.`;
  }

  return "It ranked lower because the winning cards produced a cleaner value fit for your answers.";
}

function scoreCard(card: CreditCard, answers: QuizAnswers) {
  let score = 40;

  if (card.goalFit.includes(answers.mainGoal)) score += 28;
  if (answers.mainGoal === "balanceTransfer" && card.annualFee === 0) score += 14;
  if (answers.mainGoal === "business" && card.businessOnly) score += 22;

  score += feeAndUtilizationScore(card, answers);
  score += valueCaptureScore(card, answers);
  score += spendScore[answers.monthlySpend];
  score += getSpendMultiplier(answers, card);

  if (card.categoryFit.includes(answers.topCategory)) score += 18;
  if (card.categoryFit.includes("mixed") && answers.topCategory === "mixed") score += 10;

  if (card.travelFit.includes(answers.travelFrequency)) score += 18;
  if (answers.travelFrequency === "rarely" && card.annualFee >= 400) score -= 24;
  if (["3to5", "monthly"].includes(answers.travelFrequency) && card.type.includes("travel")) score += 16;

  if (answers.loungeAccess === "yes") score += card.loungeValue === "high" ? 26 : -10;
  if (answers.loungeAccess === "maybe") score += card.loungeValue === "high" ? 12 : 2;
  if (answers.loungeAccess === "no" && card.loungeValue === "high") score -= 8;

  if (card.simplicityFit.includes(answers.simplicity)) score += 12;
  if (answers.simplicity === "simple" && card.annualFee >= 400) score -= 12;
  if (answers.simplicity === "pointsStrategy" && card.type.includes("travel")) score += 16;
  if (answers.simplicity !== "simple" && answers.monthlySpend === "6000plus" && card.annualFee === 0) {
    score -= 12;
  }
  if (answers.simplicity !== "simple" && answers.annualFeeComfort === "400plus" && card.annualFee === 0) {
    score -= 14;
  }

  if (card.businessOnly) {
    if (answers.businessCards === "yes") score += 18;
    if (answers.businessCards === "notSure") score -= 4;
    if (answers.businessCards === "no") score -= 60;
  } else if (answers.businessCards === "no") {
    score += 4;
  }

  const userCreditRank = creditScoreRank[answers.creditScore];
  const requiredCreditRank = creditScoreRank[card.minimumCreditScore];
  if (userCreditRank >= requiredCreditRank) {
    score += 12;
  } else {
    score -= (requiredCreditRank - userCreditRank) * 22;
  }

  if (
    answers.creditScore === "excellent" &&
    answers.monthlySpend === "6000plus" &&
    answers.simplicity !== "simple" &&
    card.annualFee >= 395
  ) {
    score += 12;
  }

  return Math.max(0, Math.round(score));
}

export function getRecommendations(answers: QuizAnswers): RecommendedCard[] {
  return getRankedRecommendations(answers).slice(0, 3);
}

export function getRankedRecommendations(answers: QuizAnswers): RecommendedCard[] {
  return cards
    .map((card) => ({
      card,
      score: scoreCard(card, answers),
      explanationBullets: buildExplanation(card, answers),
      cautionBullet: card.avoidIf,
      lowerFitReason: buildLowerFitReason(card, answers),
    }))
    .sort((a, b) => b.score - a.score);
}

export function getPopularNonFits(answers: QuizAnswers): RecommendedCard[] {
  const winners = new Set(getRecommendations(answers).map((recommendation) => recommendation.card.id));
  const recognizableOrder = [
    "amex-platinum",
    "chase-sapphire-reserve",
    "capital-one-venture-x",
    "chase-sapphire-preferred",
    "citi-double-cash",
    "chase-freedom-unlimited",
  ];

  return getRankedRecommendations(answers)
    .filter((recommendation) => !winners.has(recommendation.card.id))
    .sort((a, b) => {
      const aIndex = recognizableOrder.indexOf(a.card.id);
      const bIndex = recognizableOrder.indexOf(b.card.id);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    })
    .slice(0, 2);
}

export function getProfileSummary(answers: QuizAnswers) {
  const feeLanguage: Record<AnnualFeeComfort, string> = {
    zero: "you want the math to work without an annual fee",
    under100: "you are open to a modest fee when it clearly earns its keep",
    "100to400": "you will consider mid-tier fees if the value is obvious",
    "400plus": "you are open to premium fees when the credits and perks are realistic",
  };

  const optimizerLanguage = {
    simple: "simple, low-maintenance rewards",
    optimizeIfHigh: "optimization when the upside is clear",
    pointsStrategy: "a more advanced points strategy",
  }[answers.simplicity];

  const title =
    answers.mainGoal === "business"
      ? "Executive business rewards operator"
      : answers.loungeAccess === "yes" && ["3to5", "monthly"].includes(answers.travelFrequency)
        ? "Premium travel value strategist"
        : answers.simplicity === "pointsStrategy" && answers.monthlySpend !== "under1500"
          ? "Affluent points optimizer"
          : answers.annualFeeComfort === "zero" || answers.simplicity === "simple"
            ? "Disciplined simplicity-first household"
            : "Premium-value rewards household";

  const summary = `Based on your answers, you look like a ${title.toLowerCase()}: your priority is ${goalLabels[answers.mainGoal]}, your highest spend is ${categoryLabels[answers.topCategory]}, and ${feeLanguage[answers.annualFeeComfort]}. The best-fit cards below favor ${optimizerLanguage} over flashy issuer marketing.`;

  const signals = [
    `Primary goal: ${goalLabels[answers.mainGoal]}`,
    `Spend signal: ${categoryLabels[answers.topCategory]}`,
    `Travel pattern: ${travelLabels[answers.travelFrequency]}`,
    `Fee posture: ${feeLanguage[answers.annualFeeComfort]}`,
  ];

  return { title, summary, signals };
}
