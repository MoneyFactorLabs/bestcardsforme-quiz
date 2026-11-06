import type { ArticleTable, EditorialArticle } from "@/types/article";
import {
  formatDollars as usd,
  formatSigned as signed,
  type ValuationOverride,
  type WalletCard,
  walletValue,
} from "@/lib/walletModel";
import {
  cardsFor,
  householdProfiles,
  LOUNGE_VISIT_VALUE,
  profileSpend,
  TERMS_CHECKED_AT,
} from "@/data/walletScenarios";

// Every dollar figure in these articles is computed from lib/walletModel.ts and
// data/walletScenarios.ts at build time; tests/affluentCluster.test.ts pins the
// headline results so a model or terms change cannot silently rewrite them.

type ProfileId = (typeof householdProfiles)[number]["id"];

const UPDATED_AT = "2026-11-06";
const REVIEWED_BY = "Tim, founder and editor of BestCardsForMe";
const CASH_OUT: ValuationOverride = { chaseUltimateRewards: 1, amexMembershipRewards: 1, capitalOneMiles: 1 };

const disclosure = {
  heading: "Editorial disclosure",
  body: "This article is general information, not personalized financial advice. Card terms change; confirm current rates, credits, and fees on the issuer's site before applying. BestCardsForMe by MoneyFactor may receive compensation from issuers in the future; our wallet math does not change based on compensation.",
  label: "Read our disclosure",
  href: "/affiliate-disclosure",
};

const assumptionsBullets = [
  "**Year-2 math.** Welcome bonuses are excluded; every annual fee is paid in full.",
  "**Point values** follow [our methodology](/methodology): Chase Ultimate Rewards 1.6¢, Amex Membership Rewards 1.7¢, Capital One miles 1.4¢, cash back 1¢. A cash-out sensitivity at 1¢ per point is shown separately.",
  "**Routing.** Each dollar goes to the card in the wallet that returns the most on it, respecting caps (Amex Gold: $50,000 restaurants, $25,000 U.S. supermarkets).",
  "**Booking channel.** Flights and hotels are booked direct. Portal bonuses (Chase Travel 8x, Capital One Travel 5x–10x, prepaid Amex Travel hotels 5x) are not assumed.",
  `**Lounges** are valued at $${LOUNGE_VISIT_VALUE} a visit and counted once per wallet, even when two cards grant access.`,
  `**Issuer terms** were checked on ${TERMS_CHECKED_AT} and are re-verified against issuer pages by our automated claim check.`,
];

function profile(id: ProfileId) {
  return householdProfiles.find((candidate) => candidate.id === id)!;
}

function net(id: ProfileId, pick: (cards: ReturnType<typeof cardsFor>) => WalletCard[], valuation: ValuationOverride = {}) {
  return walletValue(pick(cardsFor(id)), profileSpend(id), valuation);
}

function addOn(
  id: ProfileId,
  base: (cards: ReturnType<typeof cardsFor>) => WalletCard[],
  added: (cards: ReturnType<typeof cardsFor>) => WalletCard[],
  valuation: ValuationOverride = {},
) {
  const cards = cardsFor(id);
  const spend = profileSpend(id);
  return (
    walletValue([...base(cards), ...added(cards)], spend, valuation).net - walletValue(base(cards), spend, valuation).net
  );
}

function spendTable(): ArticleTable {
  return {
    columns: ["Profile", "Groceries", "Dining", "Airfare", "Hotels", "Gas", "Everything else", "Total", "Lounge visits"],
    rows: householdProfiles.map(({ label, spend, loungeVisits }) => [
      `**${label}**`,
      usd(spend.groceries ?? 0),
      usd(spend.dining ?? 0),
      usd(spend.airfare ?? 0),
      usd(spend.hotels ?? 0),
      usd(spend.gas ?? 0),
      usd(spend.other ?? 0),
      usd(Object.values(spend).reduce((sum, amount) => sum + (amount ?? 0), 0)),
      String(loungeVisits),
    ]),
  };
}

// ---------------------------------------------------------------------------
// 1. $200k–$400k household strategy by spend mix
// ---------------------------------------------------------------------------

type Wallet = { label: string; fee: string; pick: (cards: ReturnType<typeof cardsFor>) => WalletCard[] };

export const strategyWallets: Wallet[] = [
  { label: "Citi Double Cash alone", fee: "$0", pick: (c) => [c.doubleCash] },
  { label: "Capital One Venture X alone", fee: "$395", pick: (c) => [c.ventureX] },
  { label: "Amex Gold + Citi Double Cash", fee: "$325", pick: (c) => [c.amexGold, c.doubleCash] },
  { label: "Sapphire Reserve + Freedom Unlimited", fee: "$795", pick: (c) => [c.sapphireReserve, c.freedomUnlimited] },
  {
    label: "Sapphire Reserve + Freedom Unlimited + Amex Gold",
    fee: "$1,120",
    pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexGold],
  },
  { label: "Amex Platinum + Amex Gold + Double Cash", fee: "$1,220", pick: (c) => [c.amexPlatinum, c.amexGold, c.doubleCash] },
];

export function bestStrategyWallet(id: ProfileId, valuation: ValuationOverride = {}) {
  return strategyWallets
    .map((wallet) => ({ wallet, result: net(id, wallet.pick, valuation) }))
    .sort((a, b) => b.result.net - a.result.net)[0];
}

function strategyTable(valuation: ValuationOverride = {}): ArticleTable {
  return {
    columns: ["Wallet", "Annual fees", ...householdProfiles.map((p) => p.label)],
    rows: strategyWallets.map((wallet) => [
      `**${wallet.label}**`,
      wallet.fee,
      ...householdProfiles.map((p) => {
        const result = net(p.id, wallet.pick, valuation);
        return `${usd(result.net)} (${signed(result.vsBaseline)})`;
      }),
    ]),
  };
}

function breakdown(id: ProfileId, pick: Wallet["pick"]) {
  const result = net(id, pick);
  return `rewards ${usd(result.rewards)} + credits and perks ${usd(result.credits)} − fees ${usd(result.fees)} = **${usd(result.net)}**`;
}

const goldPick: Wallet["pick"] = (c) => [c.amexGold, c.doubleCash];
const reservePick: Wallet["pick"] = (c) => [c.sapphireReserve, c.freedomUnlimited];
const reserveGoldPick: Wallet["pick"] = (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexGold];
const platGoldPick: Wallet["pick"] = (c) => [c.amexPlatinum, c.amexGold, c.doubleCash];

const homeBest = bestStrategyWallet("home");
const balancedBest = bestStrategyWallet("balanced");
const travelBest = bestStrategyWallet("travel");
const travelBestCash = bestStrategyWallet("travel", CASH_OUT);
const homeBestCash = bestStrategyWallet("home", CASH_OUT);
const balancedRunnerUp = strategyWallets
  .map((wallet) => ({ wallet, result: net("balanced", wallet.pick) }))
  .sort((a, b) => b.result.net - a.result.net)[1];

function winnerAtCashOut(best: typeof homeBest, cash: typeof homeBest) {
  return `${best.wallet.label === cash.wallet.label ? "is still" : "becomes"} **${cash.wallet.label}** (${usd(cash.result.net)})`;
}

const strategyArticle: EditorialArticle = {
  slug: "credit-card-strategy-200k-400k-household-income-2026",
  eyebrow: "Household Wallet Strategy",
  title: "Credit Card Strategy for $200k–$400k Households: Spend Mix Beats Income (2026)",
  metaDescription:
    "At $200k–$400k of income, spend mix and travel pick the right cards. Year-2 net value for three household profiles across six wallets, math shown.",
  dek: `Two households earning $300,000 can need opposite wallets. In our Year-2 model, a home-centered household nets the most from **${homeBest.wallet.label}** (${usd(homeBest.result.net)} a year), while a travel-heavy one nets the most from **${travelBest.wallet.label}** (${usd(travelBest.result.net)}). Income only tells you which cards you can get approved for; your spend mix and how often you travel decide which ones pay.`,
  category: "Card stack strategy",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "10 min read",
  comparisonMetrics: [
    { label: "Home-centered winner", value: `${homeBest.wallet.label} (${usd(homeBest.result.net)}/yr)` },
    { label: "Balanced winner", value: `${balancedBest.wallet.label} (${usd(balancedBest.result.net)}/yr)` },
    { label: "Travel-heavy winner", value: `${travelBest.wallet.label} (${usd(travelBest.result.net)}/yr)` },
    { label: "MoneyFactor lens", value: "Net value after fees, not income bracket" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `For a household earning $200,000–$400,000, the best credit card setup depends on where the money goes. We ran the same six wallets through three spend profiles. For a home-centered household, **${homeBest.wallet.label}** wins at only $325 in fees. The ultra-premium **${travelBest.wallet.label}** takes over only once travel is regular, and for the balanced household it beats **${balancedRunnerUp.wallet.label}** by just ${usd(balancedBest.result.net - balancedRunnerUp.result.net)} a year, which is well inside the uncertainty of the credit assumptions.`,
        "The common mistake at this income is buying the most premium card you qualify for. A $795 or $895 card only pays when its credits and travel categories match habits you already have. This guide shows the math for each profile so you can find yours. For an overview of the premium card stacks themselves, see our [high-income household guide](/articles/best-credit-card-high-income-households-2026).",
      ],
    },
    {
      heading: "Why income is the wrong starting point",
      body: [
        "Income sets your approval odds and your fee tolerance. It does not set your earn. A card's value comes from three things: how much you spend in its bonus categories, how many of its credits you use without changing behavior, and whether you redeem points well enough to beat cash back.",
        "Two $300,000 households illustrate the gap. One spends heavily on groceries and kids' activities and takes two trips a year. The other flies monthly for work and books hotels on most trips. Give them the same premium card and one of them overpays.",
      ],
    },
    {
      heading: "The three spend profiles",
      body: [
        "Each profile is an illustrative annual card-spend budget, not income: $70,000 to $110,000 a year of spending that goes on cards, excluding mortgage, taxes and savings. Pick the profile closest to your own statements.",
      ],
      table: spendTable(),
      bullets: householdProfiles.map((p) => `**${p.label}:** ${p.description}.`),
    },
    {
      heading: "Year-2 net value by wallet",
      body: [
        "Each cell shows net annual value (rewards plus credits you realistically use, minus annual fees), with the difference versus a $0, 2% flat card on the same spending in parentheses. Higher is better.",
      ],
      table: strategyTable(),
    },
    {
      heading: "Worked example 1: the home-centered household",
      body: [
        `Groceries are this household's biggest category at ${usd(profile("home").spend.groceries ?? 0)} a year, and it rarely sees a lounge. **Amex Gold + Double Cash** sends groceries and dining to Gold at 4x and everything else to Double Cash at 2%: ${breakdown("home", goldPick)}.`,
        `**Sapphire Reserve + Freedom Unlimited** looks stronger on paper but earns 1.5x–1x on groceries and only captures the $300 travel credit cleanly: ${breakdown("home", reservePick)}. That is ${usd(net("home", goldPick).net - net("home", reservePick).net)} a year less than the Gold wallet, mostly because this household cannot use The Edit or lounge benefits it is paying for.`,
      ],
    },
    {
      heading: "Worked example 2: the travel-heavy household",
      body: [
        `With ${usd(profile("travel").spend.airfare ?? 0)} of airfare and ${usd(profile("travel").spend.hotels ?? 0)} of hotels booked direct, the Reserve's 4x on direct travel and its hotel and travel credits start to matter. **Sapphire Reserve + Freedom Unlimited + Amex Gold** nets ${breakdown("travel", reserveGoldPick)}.`,
        `**Amex Platinum + Gold + Double Cash** earns 5x on flights and captures the full $600 hotel credit in this profile: ${breakdown("travel", platGoldPick)}. The Platinum wallet wins here because this household books prepaid luxury stays every year. Without those stays the hotel credit is worth $0 and the ranking flips.`,
      ],
    },
    {
      heading: "Sensitivity: what changes the answer",
      body: [
        `**If you cash points out at 1¢ instead of transferring them,** premium points cards lose much of their edge. At 1¢ a point, the home-centered winner ${winnerAtCashOut(homeBest, homeBestCash)} and the travel-heavy winner ${winnerAtCashOut(travelBest, travelBestCash)}, but every premium wallet's lead over a plain 2% card shrinks sharply (compare the table below with the one above).`,
        "**If you use half the credits we assume,** subtract half of each wallet's credit line from the worked examples above. Ultra-premium wallets carry $1,000+ of credits in the travel-heavy profile, so they are the most exposed to over-optimistic credit math.",
        "**If you book through issuer portals,** the Reserve (8x on Chase Travel) and Venture X (up to 10x on Capital One Travel hotels) earn more than shown. We leave portal earnings out because portal prices and cancellation terms differ from booking direct.",
      ],
      table: { ...strategyTable(CASH_OUT), columns: ["Wallet at 1¢ per point", "Annual fees", ...householdProfiles.map((p) => p.label)] },
    },
    {
      heading: "How to choose your wallet",
      body: [],
      bullets: [
        "**Find your largest category first.** If it is groceries or dining, start with Amex Gold. If it is direct airfare and hotels, start with a Reserve or Platinum.",
        "**Count only credits you already spend on.** A credit you have to remember to use, at a merchant you would not otherwise visit, belongs at 0–25% of face value.",
        "**Add a 2% card for everything else.** Every premium card in this guide earns 1x outside its categories; routing that spend to a 2% card is free value.",
        "**Decide how you redeem before you choose.** If you will not transfer points to airline or hotel partners, compare wallets in the 1¢ table.",
        "Not sure which profile is yours? [Take the BestCardsForMe quiz](/) for a recommendation built on your own spending.",
      ],
    },
    {
      heading: "Assumptions and limitations",
      body: [
        "These are illustrative households, not predictions for yours. Change any input and the ranking can change; that is the point of the exercise.",
      ],
      bullets: assumptionsBullets,
    },
    {
      heading: "Bottom line",
      body: [
        `At $200k–$400k of income, a two-card setup is usually enough. A home-centered household should build around Amex Gold and a 2% card. A travel-heavy household can justify a $795 or $895 card when it actually uses the hotel and travel credits. The best premium card is the one whose credits you would have spent money on anyway.`,
        "Next: if you already hold a premium card, see [the best second card for Platinum and Reserve owners](/articles/best-second-credit-card-for-premium-card-owners-2026); if you are weighing two premium cards at once, read [the annual-fee stacking math](/articles/multiple-premium-credit-cards-vs-one-2026).",
      ],
    },
  ],
  cardCtas: [
    { cardId: "amex-gold", headline: "Read the Amex Gold profile", body: "The grocery and dining anchor for home-centered households." },
    { cardId: "chase-sapphire-reserve", headline: "Read the Sapphire Reserve profile", body: "When direct travel and the Reserve's credits fit your year." },
    { cardId: "citi-double-cash", headline: "Read the Double Cash profile", body: "The 2% baseline every wallet in this guide has to beat." },
  ],
  relatedArticles: [
    { slug: "best-credit-card-high-income-households-2026" },
    { slug: "best-second-credit-card-for-premium-card-owners-2026" },
    { slug: "multiple-premium-credit-cards-vs-one-2026" },
  ],
  faqs: [
    {
      question: "What credit card should I have if I earn $300,000 a year?",
      answer: `It depends on your spend mix, not your income. In our model, a grocery-heavy household nets the most from ${homeBest.wallet.label}, while a household that travels monthly nets the most from ${travelBest.wallet.label}.`,
    },
    {
      question: "Is a premium card always worth it at a high income?",
      answer:
        "No. A premium card is worth its fee only when you use its credits and travel categories without changing your behavior. A home-centered household in our model does better with a $325 Amex Gold and a $0 2% card than with a $795 Sapphire Reserve.",
    },
    {
      question: "How many credit cards does a high-income household need?",
      answer:
        "Usually two or three: one card for the biggest category, one 2% card for everything else, and a premium travel card only if the household travels often enough to use its credits.",
    },
    {
      question: "Do these numbers include welcome bonuses?",
      answer: "No. We model Year 2, when the fee is due again and the bonus is gone, because that is the value you keep.",
    },
  ],
  disclosureCta: disclosure,
};

// ---------------------------------------------------------------------------
// 2. Best second card for premium-card owners
// ---------------------------------------------------------------------------

type Candidate = { label: string; fee: string; pick: (cards: ReturnType<typeof cardsFor>) => WalletCard[] };

const reserveCandidates: Candidate[] = [
  { label: "Chase Freedom Unlimited", fee: "$0", pick: (c) => [c.freedomUnlimited] },
  { label: "Citi Double Cash", fee: "$0", pick: (c) => [c.doubleCash] },
  { label: "Amex Gold", fee: "$325", pick: (c) => [c.amexGold] },
  { label: "Capital One Venture X", fee: "$395", pick: (c) => [c.ventureX] },
  { label: "Amex Platinum", fee: "$895", pick: (c) => [c.amexPlatinum] },
];

// Freedom Unlimited is left out for Platinum owners: without a Sapphire card it earns cash back at 1.5%, below a 2% card.
const platinumCandidates: Candidate[] = [
  { label: "Citi Double Cash", fee: "$0", pick: (c) => [c.doubleCash] },
  { label: "Amex Gold", fee: "$325", pick: (c) => [c.amexGold] },
  { label: "Capital One Venture X", fee: "$395", pick: (c) => [c.ventureX] },
  { label: "Chase Sapphire Reserve", fee: "$795", pick: (c) => [c.sapphireReserve] },
];

const reserveBase = (c: ReturnType<typeof cardsFor>) => [c.sapphireReserve];
const platinumBase = (c: ReturnType<typeof cardsFor>) => [c.amexPlatinum];

export function rankSecondCards(base: "reserve" | "platinum", id: ProfileId, valuation: ValuationOverride = {}) {
  const candidates = base === "reserve" ? reserveCandidates : platinumCandidates;
  const basePick = base === "reserve" ? reserveBase : platinumBase;
  return candidates
    .map((candidate) => ({ candidate, gain: addOn(id, basePick, candidate.pick, valuation) }))
    .sort((a, b) => b.gain - a.gain);
}

function secondCardTable(base: "reserve" | "platinum"): ArticleTable {
  const candidates = base === "reserve" ? reserveCandidates : platinumCandidates;
  const basePick = base === "reserve" ? reserveBase : platinumBase;
  return {
    columns: ["Second card", "Fee", "Balanced (points transferred)", "Travel-heavy (points transferred)", "Balanced at 1¢ cash-out"],
    rows: candidates.map((candidate) => [
      `**${candidate.label}**`,
      candidate.fee,
      signed(addOn("balanced", basePick, candidate.pick)),
      signed(addOn("travel", basePick, candidate.pick)),
      signed(addOn("balanced", basePick, candidate.pick, CASH_OUT)),
    ]),
  };
}

const reserveTop = rankSecondCards("reserve", "balanced")[0];
const reserveTopCash = rankSecondCards("reserve", "balanced", CASH_OUT)[0];
const platinumTop = rankSecondCards("platinum", "balanced")[0];
const platinumTopCash = rankSecondCards("platinum", "balanced", CASH_OUT)[0];

function pairPhrase(reserveLabel: string, platinumLabel: string) {
  return reserveLabel === platinumLabel
    ? `**${reserveLabel}** for both Sapphire Reserve and Amex Platinum owners`
    : `**${reserveLabel}** for Sapphire Reserve owners and **${platinumLabel}** for Amex Platinum owners`;
}

const goldWithReserve = (() => {
  const c = cardsFor("balanced");
  const spend = profileSpend("balanced");
  const alone = walletValue([c.sapphireReserve], spend);
  const both = walletValue([c.sapphireReserve, c.amexGold], spend);
  return { alone, both, gain: both.net - alone.net, extraRewards: both.rewards - alone.rewards, goldCredits: both.credits - alone.credits };
})();

const doubleCashWithPlatinum = (() => {
  const c = cardsFor("balanced");
  const spend = profileSpend("balanced");
  const other = (spend.other ?? 0) + (spend.gas ?? 0) + (spend.groceries ?? 0) + (spend.dining ?? 0) + (spend.hotels ?? 0);
  return {
    routed: other,
    gainPoints: addOn("balanced", platinumBase, (cards) => [cards.doubleCash]),
    gainCash: addOn("balanced", platinumBase, (cards) => [cards.doubleCash], CASH_OUT),
    platinumOnly: walletValue([c.amexPlatinum], spend),
  };
})();

const secondCardArticle: EditorialArticle = {
  slug: "best-second-credit-card-for-premium-card-owners-2026",
  eyebrow: "Premium Wallet Strategy",
  title: "Best Second Card If You Already Have Amex Platinum or Sapphire Reserve (2026)",
  metaDescription:
    "The best second card for Amex Platinum or Sapphire Reserve owners, ranked by incremental Year-2 value after fees, with a cash-out sensitivity.",
  dek: `If you already pay for a Platinum or Sapphire Reserve, the next card should fill the categories your premium card earns 1x on, not duplicate its perks. In our model, the best second card for a Reserve owner is **${reserveTop.candidate.label}** (${signed(reserveTop.gain)} a year) and for a Platinum owner it is **${platinumTop.candidate.label}** (${signed(platinumTop.gain)}). If you cash points out instead of transferring them, ${reserveTopCash.candidate.label} climbs to the top for both, with Venture X close behind.`,
  category: "Card stack strategy",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "9 min read",
  comparisonMetrics: [
    { label: "Best second card with Sapphire Reserve", value: `${reserveTop.candidate.label} (${signed(reserveTop.gain)}/yr)` },
    { label: "Best second card with Amex Platinum", value: `${platinumTop.candidate.label} (${signed(platinumTop.gain)}/yr)` },
    {
      label: "If you cash points out at 1¢",
      value:
        reserveTopCash.candidate.label === platinumTopCash.candidate.label
          ? `${reserveTopCash.candidate.label} for both`
          : `${reserveTopCash.candidate.label} / ${platinumTopCash.candidate.label}`,
    },
    { label: "MoneyFactor lens", value: "Incremental value over the wallet you already have" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `Most "best card" lists rank cards in isolation. If you already hold a premium card, the question is different: what does a second card add on top of what you have, after its own fee? For a balanced household (${usd(householdProfiles[1].spend.dining ?? 0)} dining, ${usd(householdProfiles[1].spend.groceries ?? 0)} groceries, $16,000 of direct travel), the answer is ${pairPhrase(reserveTop.candidate.label, platinumTop.candidate.label)}.`,
        "Both premium cards earn 1x outside travel (and dining, for the Reserve). The second card's job is to cover the spending your premium card ignores, which is usually groceries, dining and everything else.",
      ],
    },
    {
      heading: "If you have the Chase Sapphire Reserve",
      body: [
        "Incremental Year-2 value of adding each card to a Sapphire Reserve, after the second card's fee. Lounge access already comes with the Reserve, so a second lounge card adds nothing on that line.",
      ],
      table: secondCardTable("reserve"),
    },
    {
      heading: "If you have the Amex Platinum",
      body: [
        "The Platinum earns 5x on flights and 1x almost everywhere else, so it leaves far more spending uncovered than the Reserve. That is why second cards add more value here.",
      ],
      table: secondCardTable("platinum"),
    },
    {
      heading: "Worked example 1: Amex Gold next to a Sapphire Reserve",
      body: [
        `For the balanced household, the Reserve alone nets ${usd(goldWithReserve.alone.net)} a year. Adding Amex Gold moves ${usd(householdProfiles[1].spend.groceries ?? 0)} of groceries from 1x to 4x and dining from 3x Ultimate Rewards to 4x Membership Rewards, adding ${usd(goldWithReserve.extraRewards)} of rewards. Counting ${usd(goldWithReserve.goldCredits)} of Gold credits used (half of the dining, Uber Cash and Resy credits) and the $325 fee, the wallet nets ${usd(goldWithReserve.both.net)}: **${signed(goldWithReserve.gain)}** a year.`,
        "The catch is a second points currency. Gold earns Membership Rewards, the Reserve earns Ultimate Rewards, and the two do not combine. The gain is real only if you will redeem both.",
      ],
    },
    {
      heading: "Worked example 2: a 2% card next to an Amex Platinum",
      body: [
        `The Platinum alone nets ${usd(doubleCashWithPlatinum.platinumOnly.net)} for the balanced household, but ${usd(doubleCashWithPlatinum.routed)} of its spending earns 1x. Valued at 1.7¢ a point, moving that spend to a 2% card adds only **${signed(doubleCashWithPlatinum.gainPoints)}** a year, because 2% cash is barely more than 1x at 1.7¢.`,
        `If you redeem Membership Rewards for about 1¢ each, the same switch is worth **${signed(doubleCashWithPlatinum.gainCash)}**. Your redemption habits decide whether the "boring" 2% card is a rounding error or your most valuable second card.`,
      ],
    },
    {
      heading: "How to pick your second card",
      body: [],
      bullets: [
        "**List your premium card's 1x categories.** That spending is where a second card earns its keep.",
        "**Prefer the same points currency** (Freedom Unlimited with the Reserve, Gold with the Platinum) when you transfer points. One pool redeems better than two half-pools.",
        "**Do not pay twice for the same perk.** A second lounge card adds no lounge value; a second travel credit only helps if you travel enough to use both.",
        "**If you cash out, think in cash.** At 1¢ per point, a $0 2% card or Venture X's 2x on everything usually beats a second category card.",
        "Want this for your own spending? [Take the BestCardsForMe quiz](/).",
      ],
    },
    {
      heading: "Assumptions and limitations",
      body: [
        "The tables use the balanced and travel-heavy households from our [$200k–$400k strategy guide](/articles/credit-card-strategy-200k-400k-household-income-2026). Gains are the change in the whole wallet's net value, so they already account for spending that moves off your premium card.",
      ],
      bullets: assumptionsBullets,
    },
    {
      heading: "Bottom line",
      body: [
        `If you transfer points, the best second card in our model is ${pairPhrase(reserveTop.candidate.label, platinumTop.candidate.label)}. If you cash points out rather than transferring them, the answer shifts to ${pairPhrase(reserveTopCash.candidate.label, platinumTopCash.candidate.label)}. Holding both premium cards is a separate decision, covered in [the multiple premium cards math](/articles/multiple-premium-credit-cards-vs-one-2026) and in [Amex Platinum vs Sapphire Reserve](/articles/amex-platinum-vs-chase-sapphire-reserve-2026).`,
      ],
    },
  ],
  cardCtas: [
    { cardId: "amex-gold", headline: "Read the Amex Gold profile", body: "The usual second card for dining- and grocery-heavy premium owners." },
    { cardId: "chase-freedom-unlimited", headline: "Read the Freedom Unlimited profile", body: "Earns Ultimate Rewards when paired with a Sapphire card." },
    { cardId: "capital-one-venture-x", headline: "Read the Venture X profile", body: "A 2x-everywhere card with a $300 travel credit, strongest for cash-out redeemers." },
  ],
  relatedArticles: [
    { slug: "credit-card-strategy-200k-400k-household-income-2026" },
    { slug: "multiple-premium-credit-cards-vs-one-2026" },
    { slug: "amex-platinum-vs-chase-sapphire-reserve-2026" },
  ],
  faqs: [
    {
      question: "What is the best card to pair with the Chase Sapphire Reserve?",
      answer: `For a balanced household that transfers points, ${reserveTop.candidate.label} adds the most in our model (${signed(reserveTop.gain)} a year after fees). If you cash points out, ${reserveTopCash.candidate.label} comes out ahead.`,
    },
    {
      question: "What is the best card to pair with the Amex Platinum?",
      answer: `${platinumTop.candidate.label} adds the most for a balanced household in our model (${signed(platinumTop.gain)} a year after fees), because the Platinum earns 1x on groceries and dining.`,
    },
    {
      question: "Should my second card earn the same points as my premium card?",
      answer:
        "Usually yes, if you transfer points: one pool is easier to use well. If you cash points out, the currency matters less than the earn rate, and a 2% card is often the better second card.",
    },
  ],
  disclosureCta: disclosure,
};

// ---------------------------------------------------------------------------
// 3. Two or three premium cards vs one
// ---------------------------------------------------------------------------

type Ladder = { step: string; fees: number; pick: (cards: ReturnType<typeof cardsFor>) => WalletCard[] };

const ladder: Ladder[] = [
  { step: "One premium card: Sapphire Reserve + Freedom Unlimited", fees: 795, pick: (c) => [c.sapphireReserve, c.freedomUnlimited] },
  { step: "Two premium cards: + Amex Platinum", fees: 1690, pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexPlatinum] },
  {
    step: "Three premium-fee cards: + Amex Gold",
    fees: 2015,
    pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexPlatinum, c.amexGold],
  },
];

export function ladderResults(id: ProfileId, valuation: ValuationOverride = {}) {
  return ladder.map((rung, index) => {
    const result = net(id, rung.pick, valuation);
    const previous = index > 0 ? net(id, ladder[index - 1].pick, valuation).net : null;
    return { rung, result, marginal: previous === null ? null : result.net - previous };
  });
}

function ladderTable(valuation: ValuationOverride = {}): ArticleTable {
  return {
    columns: ["Wallet", "Total annual fees", ...householdProfiles.map((p) => `${p.label} net (change)`)],
    rows: ladder.map((rung, index) => [
      `**${rung.step}**`,
      usd(rung.fees),
      ...householdProfiles.map((p) => {
        const step = ladderResults(p.id, valuation)[index];
        return step.marginal === null ? usd(step.result.net) : `${usd(step.result.net)} (${signed(step.marginal)})`;
      }),
    ]),
  };
}

// Credits the added Platinum must deliver for the second premium card to break even.
export function platinumBreakEvenCredits(id: ProfileId) {
  const c = cardsFor(id);
  const spend = profileSpend(id);
  const base = [c.sapphireReserve, c.freedomUnlimited];
  const noCredits = { ...c.amexPlatinum, credits: [] };
  const gainWithoutCredits = walletValue([...base, noCredits], spend).net - walletValue(base, spend).net;
  return Math.max(0, -gainWithoutCredits);
}

const platinumAdd = Object.fromEntries(
  householdProfiles.map((p) => [p.id, ladderResults(p.id)[1].marginal ?? 0]),
) as Record<ProfileId, number>;
const platinumAddCash = Object.fromEntries(
  householdProfiles.map((p) => [p.id, ladderResults(p.id, CASH_OUT)[1].marginal ?? 0]),
) as Record<ProfileId, number>;

const stackingArticle: EditorialArticle = {
  slug: "multiple-premium-credit-cards-vs-one-2026",
  eyebrow: "Annual Fee Math",
  title: "Two or Three Premium Credit Cards vs One: The Annual-Fee Stacking Math (2026)",
  metaDescription:
    "Are two or three premium cards worth $1,690–$2,015 in fees? Break-even math for stacking Sapphire Reserve, Amex Platinum and Gold.",
  dek: `Adding an Amex Platinum to a Sapphire Reserve wallet raises annual fees from $795 to $1,690. In our Year-2 model that second premium card adds **${signed(platinumAdd.travel)}** a year for a travel-heavy household, **${signed(platinumAdd.balanced)}** for a balanced one, and **${signed(platinumAdd.home)}** for a home-centered one. Stacking pays only when each card's credits are used and its categories carry real spend.`,
  category: "Card stack strategy",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "9 min read",
  comparisonMetrics: [
    { label: "Fees: one vs two vs three premium cards", value: "$795 → $1,690 → $2,015" },
    { label: "Second premium card, travel-heavy", value: `${signed(platinumAdd.travel)} a year` },
    { label: "Second premium card, home-centered", value: `${signed(platinumAdd.home)} a year` },
    { label: "MoneyFactor lens", value: "Marginal value of each added fee" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `Holding two or three premium cards is worth it only when each additional card clears its own fee on spending and credits you already have. In our model, a second premium card (Amex Platinum added to a Sapphire Reserve) is worth ${signed(platinumAdd.travel)} a year to a travel-heavy household and ${signed(platinumAdd.home)} to a home-centered one. Adding Amex Gold as a third card pays in every profile, because it covers groceries and dining that both premium cards earn little on.`,
        "The trap is judging a card by its headline credits. Once you hold one premium card, a second one duplicates lounge access and travel protections, so only its unique categories and credits count.",
      ],
    },
    {
      heading: "The fee ladder: one, two, three cards",
      body: [
        "Net annual value for each wallet, with the change from the previous rung in parentheses. Every wallet keeps Freedom Unlimited for non-bonus spend.",
      ],
      table: ladderTable(),
    },
    {
      heading: "Break-even: how much Platinum credit you must use",
      body: [
        "Strip out the Platinum's credits and look only at what its earning adds next to a Reserve, minus its $895 fee. The shortfall is the value of credits you must actually use for the second premium card to break even.",
      ],
      table: {
        columns: ["Household", "Platinum credits needed to break even", "Credits we assume are used", "Second-card result"],
        rows: householdProfiles.map((p) => {
          const assumed = cardsFor(p.id).amexPlatinum.credits.reduce(
            (sum, credit) => (credit.overlapGroup ? sum : sum + credit.faceValue * credit.captureRate),
            0,
          );
          return [`**${p.label}**`, usd(platinumBreakEvenCredits(p.id)), usd(assumed), signed(platinumAdd[p.id])];
        }),
      },
    },
    {
      heading: "Worked example 1: the travel-heavy household",
      body: [
        `This household spends ${usd(profile("travel").spend.airfare ?? 0)} a year on airfare and books prepaid luxury hotels, so the Platinum's 5x on flights and full $600 hotel credit both land. The Platinum needs ${usd(platinumBreakEvenCredits("travel"))} of used credits to break even next to the Reserve; we assume it uses more than that, and the second card adds ${signed(platinumAdd.travel)}.`,
        "Lounge access is counted once. The household already has lounges through the Reserve, so the Platinum's Centurion and Priority Pass access adds no value in this model unless you would choose Centurion over the lounges you already have.",
      ],
    },
    {
      heading: "Worked example 2: the home-centered household",
      body: [
        `This household spends ${usd(profile("home").spend.airfare ?? 0)} on airfare and skips prepaid luxury hotels. The Platinum's flight bonus barely registers, its hotel and CLEAR+ credits go unused, and the second premium card nets **${signed(platinumAdd.home)}** a year. The same household gains more by adding a $325 Amex Gold than by adding an $895 Platinum.`,
      ],
    },
    {
      heading: "Sensitivity: cash-out redemptions",
      body: [
        `At 1¢ per point, the Platinum's 5x on flights is worth less and the stacking case weakens: the second premium card adds ${signed(platinumAddCash.travel)} for the travel-heavy household and ${signed(platinumAddCash.home)} for the home-centered one.`,
      ],
      table: { ...ladderTable(CASH_OUT), columns: ["Wallet at 1¢ per point", "Total annual fees", ...householdProfiles.map((p) => `${p.label} net (change)`)] },
    },
    {
      heading: "When a second or third premium card makes sense",
      body: [],
      bullets: [
        "**Each card has a job no other card in the wallet does.** For example: Reserve for direct travel and dining, Platinum for flights and prepaid luxury hotels, Gold for groceries.",
        "**The credits match purchases you already make.** Count them at the share you would really use, not face value.",
        "**You redeem both currencies.** Two points programs only pay when you transfer or redeem both well.",
        "**Two cardholders split the wallet.** When partners each hold one premium card, the overlap is smaller because both travelers get lounge access.",
        "If none of these apply, one premium card plus a 2% card is the stronger setup. [Take the quiz](/) to check your own numbers.",
      ],
    },
    {
      heading: "Assumptions and limitations",
      body: [
        "Household profiles come from our [$200k–$400k strategy guide](/articles/credit-card-strategy-200k-400k-household-income-2026). For a head-to-head on the two premium cards, see [Amex Platinum vs Sapphire Reserve](/articles/amex-platinum-vs-chase-sapphire-reserve-2026).",
      ],
      bullets: assumptionsBullets,
    },
    {
      heading: "Bottom line",
      body: [
        "Annual fees stack linearly; benefits do not. The second premium card pays only for households that travel often enough to use its unique credits, and the third card should almost always be a category card such as Amex Gold rather than another premium travel card.",
      ],
    },
  ],
  cardCtas: [
    { cardId: "chase-sapphire-reserve", headline: "Read the Sapphire Reserve profile", body: "The first premium card in this model's ladder." },
    { cardId: "amex-platinum", headline: "Read the Amex Platinum profile", body: "What its credits are worth when you use them, and when you do not." },
    { cardId: "amex-gold", headline: "Read the Amex Gold profile", body: "The category card that pays as a third card in every profile." },
  ],
  relatedArticles: [
    { slug: "amex-platinum-vs-chase-sapphire-reserve-2026" },
    { slug: "best-second-credit-card-for-premium-card-owners-2026" },
    { slug: "credit-card-strategy-200k-400k-household-income-2026" },
  ],
  faqs: [
    {
      question: "Is it worth having two premium credit cards?",
      answer: `Only if the second card's unique categories and credits clear its fee. In our model, adding an Amex Platinum to a Sapphire Reserve is worth ${signed(platinumAdd.travel)} a year to a travel-heavy household and ${signed(platinumAdd.home)} to a home-centered one.`,
    },
    {
      question: "Do lounge benefits add up if I hold two premium cards?",
      answer:
        "Mostly no. You can only sit in one lounge at a time, so we count lounge access once per wallet. A second card adds lounge value only when it opens lounges you would actually prefer, such as Centurion at your home airport.",
    },
    {
      question: "What is the best third card for a premium-card household?",
      answer:
        "A category card that covers what the premium cards miss. In our model that is Amex Gold, which earns 4x on groceries and dining where the Platinum earns 1x.",
    },
  ],
  disclosureCta: disclosure,
};

export const articleAffluentCluster: EditorialArticle[] = [strategyArticle, secondCardArticle, stackingArticle];

// Used by the Amex Platinum vs Sapphire Reserve comparison's "holding both" section.
export const holdingBoth = {
  gain: platinumAdd,
  gainCashOut: platinumAddCash,
  breakEvenCredits: Object.fromEntries(householdProfiles.map((p) => [p.id, platinumBreakEvenCredits(p.id)])) as Record<
    ProfileId,
    number
  >,
};

// ---------------------------------------------------------------------------
// 4. High-spend LLC section (added to the existing LLC article)
// ---------------------------------------------------------------------------

const businessProfiles = [
  { label: "$200,000 charged, $60,000 in Ink 3x categories", spend: { businessBonus: 60000, businessOther: 140000 } },
  { label: "$400,000 charged, $150,000 in Ink 3x categories", spend: { businessBonus: 150000, businessOther: 250000 } },
];

const businessWallets: Wallet[] = [
  { label: "Ink Business Preferred alone", fee: "$95", pick: (c) => [c.inkPreferred] },
  { label: "Spark Cash Plus alone", fee: "$150, refunded at $150,000 of spend", pick: (c) => [c.sparkCashPlus] },
  { label: "Ink Preferred for 3x categories + Spark Cash Plus for the rest", fee: "$95–$245", pick: (c) => [c.inkPreferred, c.sparkCashPlus] },
];

export function businessResult(profileIndex: number, walletIndex: number, valuation: ValuationOverride = {}) {
  return walletValue(businessWallets[walletIndex].pick(cardsFor("balanced")), businessProfiles[profileIndex].spend, valuation);
}

function businessTable(): ArticleTable {
  return {
    columns: ["Wallet", "Annual fee", ...businessProfiles.flatMap((p) => [`${p.label} (points at 1.6¢)`, "Same, cashed out at 1¢"])],
    rows: businessWallets.map((wallet, walletIndex) => [
      `**${wallet.label}**`,
      wallet.fee,
      ...businessProfiles.flatMap((_, profileIndex) => [
        usd(businessResult(profileIndex, walletIndex).net),
        usd(businessResult(profileIndex, walletIndex, CASH_OUT).net),
      ]),
    ]),
  };
}

const pairSmall = businessResult(0, 2);
const inkSmall = businessResult(0, 0);
const sparkSmall = businessResult(0, 1);
const inkSmallCash = businessResult(0, 0, CASH_OUT);
const pairLarge = businessResult(1, 2);

export const highSpendLlcSection = {
  heading: "High business spend: when your LLC charges $200,000+ a year",
  body: [
    "At high volume, two things the profiles above gloss over start to matter: the Ink Business Preferred's 3x stops at $150,000 a year of combined travel, shipping, internet/phone and advertising spend, and the Spark Cash Plus refunds its $150 fee in any year you spend $150,000 or more on it. A two-card setup that routes each dollar to the better card usually wins.",
    `**Worked example 1: $200,000 charged, $60,000 of it in 3x categories.** Ink Preferred alone nets ${usd(inkSmall.net)} at our 1.6¢ point value; Spark Cash Plus alone nets ${usd(sparkSmall.net)} (2% on everything, fee refunded). Using Ink for the 3x categories and Spark for everything else nets ${usd(pairSmall.net)}: rewards ${usd(pairSmall.rewards)} minus ${usd(pairSmall.fees)} of fees, because only $140,000 lands on the Spark and its fee is no longer refunded.`,
    `**Worked example 2: $400,000 charged, $150,000 in 3x categories.** The Ink's 3x is fully used and the Spark still clears $150,000, so the pair nets ${usd(pairLarge.net)} on just $95 of fees.`,
    `**Sensitivity: if you cash points out at 1¢.** Ink's 1x on non-bonus spend is worth 1¢, below Spark's 2%, so Ink Preferred alone drops to ${usd(inkSmallCash.net)} in example 1, below Spark Cash Plus alone. Owners who will not transfer Ultimate Rewards to travel partners should use Ink only for its 3x categories, or skip it.`,
    "Assumptions: Year 2 (no welcome bonuses), Ultimate Rewards valued at 1.6¢ per [our methodology](/methodology), and no premium business travel card in the wallet. For multi-employee or multi-million-dollar businesses, see the [business-owner card strategy](/articles/best-credit-card-for-business-owners-2026).",
  ],
  table: businessTable(),
};
