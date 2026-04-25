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
  "1500to3000": 8,
  "3000to6000": 16,
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

function feeScore(annualFee: number, comfort: AnnualFeeComfort) {
  if (comfort === "zero") return annualFee === 0 ? 22 : -36;
  if (comfort === "under100") return annualFee <= 100 ? 20 : annualFee <= 400 ? -10 : -30;
  if (comfort === "100to400") return annualFee <= 400 ? 18 : -12;
  return annualFee >= 400 ? 14 : 10;
}

function getSpendMultiplier(answers: QuizAnswers, card: CreditCard) {
  if (answers.monthlySpend === "under1500" && card.annualFee >= 400) return -8;
  if (answers.monthlySpend === "6000plus" && card.annualFee > 0) return 8;
  if (answers.monthlySpend === "3000to6000" && card.annualFee > 0) return 5;
  return 0;
}

function explainFee(card: CreditCard, comfort: AnnualFeeComfort) {
  if (card.annualFee === 0) return "No annual fee keeps the math simple and low-risk.";
  if (comfort === "zero") return "The annual fee is above your stated comfort zone, so the score is penalized.";
  if (comfort === "400plus" && card.annualFee >= 400) {
    return "You are open to premium fees, so the engine focuses on whether perks can offset the cost.";
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
    bullets.push("Lounge access meaningfully improves the estimated value for your profile.");
  }

  if (card.simplicityFit.includes(answers.simplicity)) {
    bullets.push(
      answers.simplicity === "simple"
        ? "The rewards structure can work without heavy points optimization."
        : "The card has enough upside for someone willing to optimize rewards."
    );
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
  if (answers.mainGoal === "balanceTransfer" && card.annualFee === 0) score += 10;
  if (answers.mainGoal === "business" && card.businessOnly) score += 22;

  score += feeScore(card.annualFee, answers.annualFeeComfort);
  score += spendScore[answers.monthlySpend];
  score += getSpendMultiplier(answers, card);

  if (card.categoryFit.includes(answers.topCategory)) score += 18;
  if (card.categoryFit.includes("mixed") && answers.topCategory === "mixed") score += 10;

  if (card.travelFit.includes(answers.travelFrequency)) score += 18;
  if (answers.travelFrequency === "rarely" && card.annualFee >= 400) score -= 24;
  if (["3to5", "monthly"].includes(answers.travelFrequency) && card.type.includes("travel")) score += 10;

  if (answers.loungeAccess === "yes") score += card.loungeValue === "high" ? 20 : -10;
  if (answers.loungeAccess === "maybe") score += card.loungeValue === "high" ? 8 : 2;
  if (answers.loungeAccess === "no" && card.loungeValue === "high") score -= 8;

  if (card.simplicityFit.includes(answers.simplicity)) score += 12;
  if (answers.simplicity === "simple" && card.annualFee >= 400) score -= 12;
  if (answers.simplicity === "pointsStrategy" && card.type.includes("travel")) score += 8;

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
    answers.mainGoal === "cashBack" || answers.travelFrequency === "rarely"
      ? "Practical value seeker"
      : answers.loungeAccess === "yes" && ["3to5", "monthly"].includes(answers.travelFrequency)
        ? "Premium travel optimizer"
        : answers.mainGoal === "business"
          ? "Business rewards builder"
          : "Flexible rewards strategist";

  const summary = `Based on your answers, you look like a ${title.toLowerCase()}: your priority is ${goalLabels[answers.mainGoal]}, your highest spend is ${categoryLabels[answers.topCategory]}, and ${feeLanguage[answers.annualFeeComfort]}. The best-fit cards below favor ${optimizerLanguage} over flashy issuer marketing.`;

  const signals = [
    `Primary goal: ${goalLabels[answers.mainGoal]}`,
    `Spend signal: ${categoryLabels[answers.topCategory]}`,
    `Travel pattern: ${travelLabels[answers.travelFrequency]}`,
    `Fee posture: ${feeLanguage[answers.annualFeeComfort]}`,
  ];

  return { title, summary, signals };
}
