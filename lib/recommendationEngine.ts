import { cards } from "@/data/cards";
import type { CreditCard, RecommendedCard } from "@/types/card";
import type {
  AnnualFeeComfort,
  CreditScoreRange,
  MonthlySpend,
  QuizAnswers,
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
    bullets.push(`Strong match for your ${answers.mainGoal === "cashBack" ? "cash back" : answers.mainGoal} goal.`);
  }

  if (card.categoryFit.includes(answers.topCategory)) {
    bullets.push("Rewards line up with your top spending category.");
  }

  if (card.travelFit.includes(answers.travelFrequency)) {
    bullets.push("Travel benefits look appropriate for how often you are on the road.");
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
  return cards
    .map((card) => ({
      card,
      score: scoreCard(card, answers),
      explanationBullets: buildExplanation(card, answers),
      cautionBullet: card.avoidIf,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
