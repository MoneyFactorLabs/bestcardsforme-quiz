import type { QuizQuestionDefinition } from "@/types/quiz";

export const quizQuestions: QuizQuestionDefinition[] = [
  {
    id: "creditScore",
    eyebrow: "Credit profile",
    question: "What is your estimated credit score range?",
    options: [
      { label: "Excellent 740+", value: "excellent" },
      { label: "Good 700-739", value: "good" },
      { label: "Fair 640-699", value: "fair" },
      { label: "Rebuilding under 640", value: "rebuilding" },
    ],
  },
  {
    id: "mainGoal",
    eyebrow: "Main goal",
    question: "What do you most want from a new card?",
    options: [
      { label: "Travel rewards", value: "travel" },
      { label: "Cash back", value: "cashBack" },
      { label: "Hotel perks", value: "hotel" },
      { label: "Airline perks", value: "airline" },
      { label: "Balance transfer / low APR", value: "balanceTransfer" },
      { label: "Business expenses", value: "business" },
    ],
  },
  {
    id: "annualFeeComfort",
    eyebrow: "Annual fee",
    question: "What annual fee range are you comfortable with?",
    options: [
      { label: "$0 only", value: "zero" },
      { label: "Under $100", value: "under100" },
      { label: "$100-$400", value: "100to400" },
      { label: "$400+", value: "400plus" },
    ],
  },
  {
    id: "monthlySpend",
    eyebrow: "Monthly spend",
    question: "What is your approximate monthly card spend?",
    options: [
      { label: "Under $1,500", value: "under1500" },
      { label: "$1,500-$3,000", value: "1500to3000" },
      { label: "$3,000-$6,000", value: "3000to6000" },
      { label: "$6,000+", value: "6000plus" },
    ],
  },
  {
    id: "topCategory",
    eyebrow: "Top category",
    question: "Where do you spend the most?",
    options: [
      { label: "Groceries", value: "groceries" },
      { label: "Dining", value: "dining" },
      { label: "Travel", value: "travel" },
      { label: "Gas", value: "gas" },
      { label: "Online shopping", value: "onlineShopping" },
      { label: "Mixed / not sure", value: "mixed" },
    ],
  },
  {
    id: "travelFrequency",
    eyebrow: "Travel",
    question: "How often do you travel?",
    options: [
      { label: "Rarely", value: "rarely" },
      { label: "1-2 trips/year", value: "1to2" },
      { label: "3-5 trips/year", value: "3to5" },
      { label: "Monthly or more", value: "monthly" },
    ],
  },
  {
    id: "loungeAccess",
    eyebrow: "Lounges",
    question: "Do you value airport lounge access?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Maybe, if the math works", value: "maybe" },
    ],
  },
  {
    id: "simplicity",
    eyebrow: "Reward style",
    question: "Do you prefer simple rewards or maximizing points?",
    options: [
      { label: "Keep it simple", value: "simple" },
      { label: "I'll optimize if value is high", value: "optimizeIfHigh" },
      { label: "I love points strategy", value: "pointsStrategy" },
    ],
  },
  {
    id: "businessCards",
    eyebrow: "Business cards",
    question: "Are you open to business cards?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Not sure", value: "notSure" },
    ],
  },
];
