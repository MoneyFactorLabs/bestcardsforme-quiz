import { cards } from "@/data/cards";
import { pointValuations } from "@/lib/cardValueModel";
import type { CreditCard } from "@/types/card";
import type { QuizAnswers, SpendingCategory } from "@/types/quiz";

type Category = Exclude<SpendingCategory, "mixed">;
type Rate = { rate: number; cap?: number };
type RewardProfile = { base: number; bonus?: Partial<Record<Category, Rate>> };

// Standard cash redemption rates, verified November 19, 2026. This model
// omits portals, rotating categories, point pooling, credits and perks.
const rewardProfiles: Partial<Record<string, RewardProfile>> = {
  // https://www.citi.com/credit-cards/citi-double-cash-credit-card
  "citi-double-cash": { base: 2 },
  // https://creditcards.wellsfargo.com/active-cash-credit-card/
  "wells-fargo-active-cash": { base: 2 },
  // https://www.chase.com/personal/credit-cards/freedom/unlimited
  "chase-freedom-unlimited": { base: 1.5, bonus: { dining: { rate: 3 } } },
  // https://www.chase.com/personal/credit-cards/freedom/flex
  "chase-freedom-flex": { base: 1, bonus: { dining: { rate: 3 } } },
  // https://www.americanexpress.com/en-us/account/get-started/bce/earn-rewards
  "blue-cash-everyday": {
    base: 1,
    bonus: { groceries: { rate: 3, cap: 6000 }, gas: { rate: 3, cap: 6000 }, onlineShopping: { rate: 3, cap: 6000 } },
  },
  // https://www.americanexpress.com/en-us/account/get-started/bcp/earn-rewards
  "blue-cash-preferred": {
    base: 1,
    bonus: { groceries: { rate: 6, cap: 6000 }, gas: { rate: 3 } },
  },
};

const monthlySpend = { under1500: 750, "1500to3000": 2250, "3000to6000": 4500, "6000plus": 6000 };
const feeLimits = { zero: 0, under100: 99, "100to400": 400, "400plus": Infinity };

function rewards(profiles: RewardProfile[], category: SpendingCategory, annualSpend: number) {
  const base = Math.max(...profiles.map((profile) => profile.base));
  // All non-bonus spending uses the strongest catch-all card.
  let value = annualSpend * base;
  if (category === "mixed") return value * pointValuations.cash.centsPerPoint / 100;

  let remaining = annualSpend / 4;
  const bonuses = profiles.flatMap((profile) => {
    const bonus = profile.bonus?.[category];
    return bonus && bonus.rate > base ? [bonus] : [];
  }).sort((a, b) => b.rate - a.rate);

  for (const bonus of bonuses) {
    const allocated = Math.min(remaining, bonus.cap ?? remaining);
    value += allocated * (bonus.rate - base);
    remaining -= allocated;
  }
  return value * pointValuations.cash.centsPerPoint / 100;
}

export function compareOwnedPortfolio(answers: QuizAnswers, ownedIds: readonly string[], hasUnlistedCard = false) {
  if (!ownedIds.length && !hasUnlistedCard) return { kind: "skipped" } as const;
  const owned = new Set(ownedIds);
  const profiles = [...owned].map((id) => Object.hasOwn(rewardProfiles, id) ? rewardProfiles[id] : undefined);
  if (hasUnlistedCard || profiles.some((profile) => !profile) || answers.mainGoal === "balanceTransfer" || answers.mainGoal === "business") {
    return { kind: "unavailable" } as const;
  }

  const knownProfiles = profiles.filter((profile): profile is RewardProfile => Boolean(profile));
  const annualSpend = monthlySpend[answers.monthlySpend] * 12;
  const baseline = rewards(knownProfiles, answers.topCategory, annualSpend);
  const compared: { card: CreditCard; annualGain: number }[] = [];
  for (const card of cards) {
    const profile = rewardProfiles[card.id];
    if (!profile || owned.has(card.id) || card.availability === "discontinued" || card.annualFee > feeLimits[answers.annualFeeComfort]) continue;
    const annualGain = rewards([...knownProfiles, profile], answers.topCategory, annualSpend) - baseline - card.annualFee;
    compared.push({ card, annualGain });
  }

  return {
    kind: "compared",
    annualSpend,
    comparedCount: compared.length,
    additions: compared.filter((item) => item.annualGain >= 25).sort((a, b) => b.annualGain - a.annualGain).slice(0, 3),
  } as const;
}
