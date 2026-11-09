import type { ArticleTable, EditorialArticle } from "@/types/article";
import {
  formatDollars as usd,
  formatSigned as signed,
  type ValuationOverride,
  type WalletCard,
  type WalletSpend,
  walletValue,
} from "@/lib/walletModel";
import { cardsFor, householdProfiles, LOUNGE_VISIT_VALUE, profileSpend, TERMS_CHECKED_AT, walletCards } from "@/data/walletScenarios";

// Publish Batch 1 (Issue #19): four comparisons from the Growth Engine briefs.
// Every dollar figure is computed by lib/walletModel.ts at build time and the
// headline results are pinned in tests/batch1Comparisons.test.ts. Card terms
// are registered in quality/issuer-claims.json and verified on issuer pages.

type ProfileId = (typeof householdProfiles)[number]["id"];
type Cards = ReturnType<typeof cardsFor>;
type Pick = (cards: Cards) => WalletCard[];

const UPDATED_AT = "2026-11-07";
const REVIEWED_BY = "Tim, founder and editor of BestCardsForMe";
const CASH_OUT: ValuationOverride = { chaseUltimateRewards: 1, amexMembershipRewards: 1, capitalOneMiles: 1 };

const disclosure = {
  heading: "Editorial disclosure",
  body: "General information, not personalized financial or tax advice. Card terms change; confirm current rates, credits and fees on the issuer's site before applying. BestCardsForMe by MoneyFactor may earn compensation from issuers in the future; it never changes the math or the ranking.",
  label: "Read our disclosure",
  href: "/affiliate-disclosure",
};

const householdAssumptions = [
  "**Year-2 math.** Welcome bonuses are excluded; every annual fee is paid.",
  "**Point values** follow [our methodology](/methodology): Chase Ultimate Rewards 1.6¢, Amex Membership Rewards 1.7¢, Capital One miles 1.4¢, cash back 1¢. A 1¢ cash-out sensitivity is shown separately.",
  "**Households** are the three spend profiles from our [$200k–$400k strategy guide](/articles/credit-card-strategy-200k-400k-household-income-2026); credits count at the share each profile realistically uses.",
  "**Direct booking.** Portal-only bonuses (Chase Travel, Capital One Travel, prepaid Amex Travel hotels) are not assumed.",
  `**Lounges** are valued at $${LOUNGE_VISIT_VALUE} a visit and counted once per wallet.`,
  `**Issuer terms** checked ${TERMS_CHECKED_AT} and re-verified against issuer pages by our automated claim check.`,
];

const businessAssumptions = [
  "**Year-2 math.** Welcome bonuses are excluded; every annual fee is paid unless the issuer refunds it.",
  "**Ink Business Preferred** earns 3x on the first $150,000 a year of combined travel, shipping, internet/cable/phone and social/search advertising, 1x after that and on everything else. Points valued at 1.6¢ (transferred or redeemed for travel) with a 1¢ cash-out sensitivity.",
  "**Spark Cash Plus** earns 2% on every purchase; its $150 annual fee is refunded in any year with $150,000 or more of spending on the card.",
  "**Routing.** When a wallet holds more than one card, each dollar goes to the card that returns the most on it.",
  `**Issuer terms** checked ${TERMS_CHECKED_AT} and re-verified against issuer pages by our automated claim check.`,
];

const net = (id: ProfileId, pick: Pick, valuation: ValuationOverride = {}) => walletValue(pick(cardsFor(id)), profileSpend(id), valuation);

function profileTable(rows: { label: string; fee: string; pick: Pick }[], valuation: ValuationOverride = {}): ArticleTable {
  return {
    columns: ["Wallet", "Annual fees", ...householdProfiles.map((p) => p.label)],
    rows: rows.map((row) => [
      `**${row.label}**`,
      row.fee,
      ...householdProfiles.map((p) => {
        const result = net(p.id, row.pick, valuation);
        return `${usd(result.net)} (${signed(result.vsBaseline)})`;
      }),
    ]),
  };
}

function breakdown(id: ProfileId, pick: Pick) {
  const result = net(id, pick);
  return `rewards ${usd(result.rewards)} + credits and perks ${usd(result.credits)} − fees ${usd(result.fees)} = **${usd(result.net)}**`;
}

// ---------------------------------------------------------------------------
// 1. Capital One Venture X vs Amex Platinum
// ---------------------------------------------------------------------------

const vx: Pick = (c) => [c.ventureX];
const plat: Pick = (c) => [c.amexPlatinum, c.doubleCash];
const vxPlat: Pick = (c) => [c.ventureX, c.amexPlatinum];

// Platinum credits a household must use for Platinum + Double Cash to match Venture X alone.
export function platinumCreditsToMatchVentureX(id: ProfileId) {
  const c = cardsFor(id);
  const spend = profileSpend(id);
  const noCredits = { ...c.amexPlatinum, credits: c.amexPlatinum.credits.filter((credit) => credit.overlapGroup) };
  return walletValue([c.ventureX], spend).net - walletValue([noCredits, c.doubleCash], spend).net;
}

export const ventureXVsPlatinum = Object.fromEntries(
  householdProfiles.map((p) => [p.id, { vx: net(p.id, vx).net, plat: net(p.id, plat).net, both: net(p.id, vxPlat).net, needed: platinumCreditsToMatchVentureX(p.id) }]),
) as Record<ProfileId, { vx: number; plat: number; both: number; needed: number }>;

const platCreditsAssumed = (id: ProfileId) =>
  cardsFor(id).amexPlatinum.credits.reduce((sum, credit) => (credit.overlapGroup ? sum : sum + credit.faceValue * credit.captureRate), 0);

const winner = (a: number, b: number, aLabel: string, bLabel: string) => (a >= b ? aLabel : bLabel);

const ventureXArticle: EditorialArticle = {
  slug: "capital-one-venture-x-vs-amex-platinum-2026",
  eyebrow: "Premium Card Comparison",
  title: "Capital One Venture X vs Amex Platinum: $395 vs $895, Which Pays More? (2026)",
  metaDescription:
    "Venture X ($395) vs Amex Platinum ($895): Year-2 net value for three households, the Platinum credits needed to justify the $500 gap, and when to hold both.",
  dek: `The Amex Platinum costs $500 a year more than the Capital One Venture X. In our Year-2 model it earns that back only when you use its hotel, airline and lifestyle credits: the Platinum wallet wins for a travel-heavy household (${usd(ventureXVsPlatinum.travel.plat)} vs ${usd(ventureXVsPlatinum.travel.vx)}), while the Venture X wins for a home-centered one (${usd(ventureXVsPlatinum.home.vx)} vs ${usd(ventureXVsPlatinum.home.plat)}).`,
  category: "Premium travel cards",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "8 min read",
  comparisonMetrics: [
    { label: "Annual fees", value: "Venture X $395 vs Amex Platinum $895" },
    { label: "Home-centered household", value: `${winner(ventureXVsPlatinum.home.vx, ventureXVsPlatinum.home.plat, "Venture X", "Platinum")} wins` },
    { label: "Travel-heavy household", value: `${winner(ventureXVsPlatinum.travel.vx, ventureXVsPlatinum.travel.plat, "Venture X", "Platinum")} wins` },
    { label: "MoneyFactor lens", value: "Credits you actually use decide it" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `Choose the **Capital One Venture X** if you want premium travel perks with little upkeep: it earns 2 miles per dollar on everything, has a $300 annual credit for Capital One Travel bookings and adds 10,000 anniversary miles. Choose the **Amex Platinum** only if you will use its credits (up to $600 a year for prepaid Fine Hotels + Resorts or The Hotel Collection stays, $200 in airline fees, $200 Uber Cash, $400 at Resy restaurants, $300 in digital entertainment and more) and fly enough for 5x on flights to matter.`,
        `In our model the Platinum (paired with a 2% card for non-travel spending) wins only for the travel-heavy household. For the home-centered household the Venture X nets ${usd(ventureXVsPlatinum.home.vx - ventureXVsPlatinum.home.plat)} more a year. If you are deciding whether a premium card fits at all, start with [Is the Venture X worth it?](/articles/is-capital-one-venture-x-worth-it-2026) or [Is the Amex Platinum worth it?](/articles/is-amex-platinum-worth-it-2026).`,
      ],
    },
    {
      heading: "How the two cards earn",
      body: ["Terms below are checked against both issuers' pages by our automated claim check."],
      table: {
        columns: ["", "Capital One Venture X", "Amex Platinum"],
        rows: [
          ["**Annual fee**", "$395", "$895"],
          ["**Everyday earning**", "2 miles per dollar on every purchase", "1x on most purchases outside flights and prepaid Amex Travel hotels"],
          ["**Flights**", "2x booked direct (portal bonuses not assumed here)", "5x booked directly with airlines or through Amex Travel"],
          ["**Biggest credits**", "$300 a year for Capital One Travel bookings; 10,000 miles each anniversary", "Up to $600 hotel (prepaid FHR/Hotel Collection), $400 Resy, $300 digital entertainment, $300 lululemon, $200 airline fees, $200 Uber Cash, $219 CLEAR+"],
          ["**Lounges**", "Cardholder plus two free guests at Capital One and partner lounges", "Centurion Lounges ($50 a guest unless the account spends $75,000 a year), Priority Pass and more; [guest rules compared](/credit-card-lounge-access)"],
          ["**Upkeep**", "One portal credit to use", "Several monthly, quarterly and semiannual credits to track"],
        ],
      },
    },
    {
      heading: "Year-2 net value by household",
      body: ["Net annual value (rewards plus credits realistically used, minus fees); difference versus a $0, 2% flat card on the same spending in parentheses."],
      table: profileTable([
        { label: "Venture X alone", fee: "$395", pick: vx },
        { label: "Amex Platinum + Citi Double Cash", fee: "$895", pick: plat },
        { label: "Venture X + Amex Platinum", fee: "$1,290", pick: vxPlat },
      ]),
    },
    {
      heading: "Worked example 1: the home-centered household",
      body: [
        `Two or three trips a year and no prepaid luxury hotel stays. **Venture X:** ${breakdown("home", vx)}. **Platinum + Double Cash:** ${breakdown("home", plat)}.`,
        `The Platinum's flight bonus covers only ${usd(profileSpend("home").airfare ?? 0)} of airfare and its $600 hotel credit goes unused. To match the Venture X, this household would need to use about ${usd(ventureXVsPlatinum.home.needed)} of Platinum credits a year; we assume ${usd(platCreditsAssumed("home"))}.`,
      ],
    },
    {
      heading: "Worked example 2: the travel-heavy household",
      body: [
        `Monthly travel, ${usd(profileSpend("travel").airfare ?? 0)} of airfare and prepaid luxury stays most years. **Venture X:** ${breakdown("travel", vx)}. **Platinum + Double Cash:** ${breakdown("travel", plat)}.`,
        `Here the Platinum's 5x on flights and full hotel credit land on spending that already happens. It needs about ${usd(ventureXVsPlatinum.travel.needed)} of used credits to match the Venture X; this household uses about ${usd(platCreditsAssumed("travel"))}.`,
      ],
    },
    {
      heading: "Sensitivity: cash-out redemptions",
      body: [
        "Valued at 1¢ per point or mile, both cards lose value, the Platinum more because more of its value is in points from 5x flights. Credits are unchanged.",
      ],
      table: { ...profileTable([
        { label: "Venture X alone", fee: "$395", pick: vx },
        { label: "Amex Platinum + Citi Double Cash", fee: "$895", pick: plat },
      ], CASH_OUT), columns: ["Wallet at 1¢ per point", "Annual fees", ...householdProfiles.map((p) => p.label)] },
    },
    {
      heading: "Holding both",
      body: [
        `Together they cost $1,290 a year. Holding both adds ${signed(ventureXVsPlatinum.travel.both - Math.max(ventureXVsPlatinum.travel.vx, ventureXVsPlatinum.travel.plat))} for the travel-heavy household over its better single wallet and ${signed(ventureXVsPlatinum.home.both - Math.max(ventureXVsPlatinum.home.vx, ventureXVsPlatinum.home.plat))} for the home-centered one. The fee math for stacking premium cards is in [two or three premium cards vs one](/articles/multiple-premium-credit-cards-vs-one-2026).`,
      ],
    },
    {
      heading: "Assumptions and limitations",
      body: ["Illustrative households, not predictions for yours. [Take the BestCardsForMe quiz](/) for a recommendation built on your own spending, or test any card's fee in the [annual fee break-even calculator](/tools/annual-fee-break-even-calculator)."],
      bullets: householdAssumptions,
    },
  ],
  cardCtas: [
    { cardId: "capital-one-venture-x", headline: "Read the Venture X profile", body: "The low-upkeep premium travel card." },
    { cardId: "amex-platinum", headline: "Read the Amex Platinum profile", body: "What its credits are worth when you use them." },
  ],
  relatedArticles: [
    { slug: "is-capital-one-venture-x-worth-it-2026" },
    { slug: "is-amex-platinum-worth-it-2026" },
    { slug: "multiple-premium-credit-cards-vs-one-2026" },
    { slug: "best-credit-card-high-income-households-2026" },
  ],
  faqs: [
    {
      question: "Is the Amex Platinum worth $500 more than the Venture X?",
      answer: `Only if you use its credits. In our model a home-centered household would need about ${usd(ventureXVsPlatinum.home.needed)} of Platinum credits a year to match the Venture X; a travel-heavy household needs about ${usd(ventureXVsPlatinum.travel.needed)}.`,
    },
    {
      question: "Which card is better for someone who doesn't want to track credits?",
      answer: "The Venture X. Its value comes from 2 miles per dollar on everything, one travel credit and anniversary miles, while the Platinum's value depends on using several separate credits.",
    },
  ],
  disclosureCta: disclosure,
};

// ---------------------------------------------------------------------------
// 2. Ink Business Preferred vs Spark Cash Plus
// ---------------------------------------------------------------------------

const ink = [walletCards.inkPreferred];
const spark = [walletCards.sparkCashPlus];
const inkSpark = [walletCards.inkPreferred, walletCards.sparkCashPlus];
const bizSpends = [
  { label: "$60k charged ($20k in 3x categories)", bonus: 20000, other: 40000 },
  { label: "$120k charged ($40k in 3x)", bonus: 40000, other: 80000 },
  { label: "$200k charged ($60k in 3x)", bonus: 60000, other: 140000 },
  { label: "$400k charged ($150k in 3x)", bonus: 150000, other: 250000 },
];
const bizNet = (cards: WalletCard[], bonus: number, other: number, valuation: ValuationOverride = {}) =>
  walletValue(cards, { businessBonus: bonus, businessOther: other }, valuation);

// Smallest 3x-category spend (in $1,000 steps) at which Ink alone beats Spark alone, for a given total spend.
export function inkBreakEvenBonusSpend(total: number, valuation: ValuationOverride = {}) {
  for (let bonus = 0; bonus <= total; bonus += 1000) {
    if (bizNet(ink, bonus, total - bonus, valuation).net > bizNet(spark, bonus, total - bonus, valuation).net) return bonus;
  }
  return null;
}

function bizTable(valuation: ValuationOverride = {}): ArticleTable {
  return {
    columns: ["Wallet", ...bizSpends.map((s) => s.label)],
    rows: [
      ["**Ink Business Preferred**", ink],
      ["**Spark Cash Plus**", spark],
      ["**Both (each dollar to the better card)**", inkSpark],
    ].map(([label, cards]) => [label as string, ...bizSpends.map((s) => usd(bizNet(cards as WalletCard[], s.bonus, s.other, valuation).net))]),
  };
}

const breakEven100 = inkBreakEvenBonusSpend(100000);
const breakEven200 = inkBreakEvenBonusSpend(200000);
const breakEven200Cash = inkBreakEvenBonusSpend(200000, CASH_OUT);
const pair200 = bizNet(inkSpark, 60000, 140000);
const pair400 = bizNet(inkSpark, 150000, 250000);

const inkSparkArticle: EditorialArticle = {
  slug: "ink-business-preferred-vs-spark-cash-plus-2026",
  eyebrow: "Business Card Comparison",
  title: "Ink Business Preferred vs Spark Cash Plus: Which Wins at Your Business Spend? (2026)",
  metaDescription:
    "Chase Ink Business Preferred vs Capital One Spark Cash Plus: Year-2 net value by business spend, the 3x-category break-even, and when to hold both.",
  dek: `Ink Business Preferred wins when enough of your spending lands in its 3x categories (travel, shipping, internet/phone and social/search ads) and you use the points well; Spark Cash Plus wins on simple, high-volume spending. At $200,000 a year the Ink pulls ahead once about ${usd(breakEven200 ?? 0)} is in its 3x categories, and holding both nets ${usd(pair200.net)}.`,
  category: "Business credit cards",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "7 min read",
  comparisonMetrics: [
    { label: "Annual fees", value: "Ink $95 vs Spark $150 (refunded at $150k spend)" },
    { label: "Ink beats Spark at $200k spend once", value: `≈${usd(breakEven200 ?? 0)} is in 3x categories` },
    { label: "Both cards at $400k spend", value: `${usd(pair400.net)} a year` },
    { label: "MoneyFactor lens", value: "Your spend mix, not the card's marketing" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `**Ink Business Preferred** ($95) earns 3x points on the first $150,000 a year of combined travel, shipping, internet/cable/phone and social/search advertising, and 1x on everything else. **Spark Cash Plus** ($150) earns 2% cash back on every purchase and refunds its fee in any year you spend $150,000 or more.`,
        `So the Ink needs a meaningful share of spending in its 3x categories to beat a flat 2%. At $100,000 a year that share is about ${usd(breakEven100 ?? 0)}; at $200,000 it is about ${usd(breakEven200 ?? 0)}. If you cash points out at 1¢ instead of transferring them, the threshold at $200,000 rises to about ${breakEven200Cash === null ? "never" : usd(breakEven200Cash)}.`,
      ],
    },
    {
      heading: "Year-2 net value by business spend",
      body: ["Points valued at 1.6¢. The last row routes each dollar to the better card: Ink for its 3x categories, Spark for everything else."],
      table: bizTable(),
    },
    {
      heading: "Worked example 1: $200,000 a year, $60,000 in 3x categories",
      body: [
        `**Ink alone:** ${usd(bizNet(ink, 60000, 140000).rewards)} in rewards minus the $95 fee = **${usd(bizNet(ink, 60000, 140000).net)}**. **Spark alone:** 2% of $200,000 = $4,000, fee refunded = **${usd(bizNet(spark, 60000, 140000).net)}**.`,
        `**Both:** the Ink takes the $60,000 of 3x spend and the Spark the other $140,000. Because only $140,000 lands on the Spark, its fee is not refunded: ${usd(pair200.rewards)} in rewards minus ${usd(pair200.fees)} in fees = **${usd(pair200.net)}**.`,
      ],
    },
    {
      heading: "Worked example 2: $400,000 a year, $150,000 in 3x categories",
      body: [
        `The Ink's 3x is fully used up to its $150,000 cap and the Spark still carries $250,000, so its fee is refunded. Both cards together net **${usd(pair400.net)}** on $95 of fees, against ${usd(bizNet(ink, 150000, 250000).net)} for the Ink alone and ${usd(bizNet(spark, 150000, 250000).net)} for the Spark alone.`,
      ],
    },
    {
      heading: "Sensitivity: cashing points out at 1¢",
      body: ["The Ink's 1x on non-bonus spending is then worth 1¢, half the Spark's 2%. Owners who will not transfer Ultimate Rewards should use the Ink only for its 3x categories, or skip it."],
      table: { ...bizTable(CASH_OUT), columns: ["Wallet at 1¢ per point", ...bizSpends.map((s) => s.label)] },
    },
    {
      heading: "Assumptions and limitations",
      body: [
        "Business spend mixes vary widely; plug your own numbers into the [annual fee break-even calculator](/tools/annual-fee-break-even-calculator). For a full LLC card lineup see the [LLC owner guide](/articles/best-business-credit-card-for-llc-owner-2026); for larger teams see [business-owner card strategy](/articles/best-credit-card-for-business-owners-2026). [Take the quiz](/) for a recommendation built on your own spending.",
      ],
      bullets: businessAssumptions,
    },
  ],
  cardCtas: [{ cardId: "ink-business-preferred", headline: "Read the Ink Business Preferred profile", body: "Its 3x categories, cap and Year-2 math." }],
  relatedArticles: [
    { slug: "best-business-credit-card-for-llc-owner-2026" },
    { slug: "best-credit-card-for-business-owners-2026" },
    { slug: "personal-vs-business-credit-card-for-business-spending-2026" },
  ],
  faqs: [
    {
      question: "Is the Ink Business Preferred better than the Spark Cash Plus?",
      answer: `It depends on your spend mix. At $200,000 a year the Ink wins once about ${usd(breakEven200 ?? 0)} of spending is in its 3x categories and you value points at 1.6¢; below that, the Spark's flat 2% wins.`,
    },
    {
      question: "Does Capital One refund the Spark Cash Plus annual fee?",
      answer: "Capital One refunds the $150 annual fee in any year you spend $150,000 or more on the card. Confirm the current terms on Capital One's site.",
    },
  ],
  disclosureCta: disclosure,
};

// ---------------------------------------------------------------------------
// 3. Amex Gold vs Chase Sapphire Reserve
// ---------------------------------------------------------------------------

const gold: Pick = (c) => [c.amexGold, c.doubleCash];
const reserve: Pick = (c) => [c.sapphireReserve, c.freedomUnlimited];
const all3: Pick = (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexGold];

// Annual direct travel spend (airfare + hotels) at which the Reserve wallet overtakes
// the Gold wallet for the balanced household, scaling its travel up or down.
export function reserveTravelCrossover() {
  const base = profileSpend("balanced");
  const c = cardsFor("balanced");
  const travel = (base.airfare ?? 0) + (base.hotels ?? 0);
  for (let factor = 0; factor <= 4; factor += 0.01) {
    const spend: WalletSpend = { ...base, airfare: (base.airfare ?? 0) * factor, hotels: (base.hotels ?? 0) * factor };
    if (walletValue(reserve(c), spend).net > walletValue(gold(c), spend).net) return Math.round((travel * factor) / 100) * 100;
  }
  return null;
}

const crossover = reserveTravelCrossover();
const goldVsReserve = Object.fromEntries(
  householdProfiles.map((p) => [p.id, { gold: net(p.id, gold).net, reserve: net(p.id, reserve).net, all: net(p.id, all3).net }]),
) as Record<ProfileId, { gold: number; reserve: number; all: number }>;

const goldReserveArticle: EditorialArticle = {
  slug: "amex-gold-vs-chase-sapphire-reserve-2026",
  eyebrow: "Premium Card Comparison",
  title: "Amex Gold vs Chase Sapphire Reserve: $325 vs $795 for a Dining-Heavy Household (2026)",
  metaDescription:
    "Amex Gold ($325) vs Chase Sapphire Reserve ($795): Year-2 net value for three households, the travel spend where the Reserve overtakes, and when to hold both.",
  dek: `For a household that mostly eats out and buys groceries, the $325 Amex Gold beats the $795 Sapphire Reserve. The Reserve takes over once direct travel passes roughly ${crossover === null ? "a level our profiles never reach" : `${usd(crossover)} a year`} in our balanced household, and holding both wins once you travel and dine heavily.`,
  category: "Dining and grocery cards",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "8 min read",
  comparisonMetrics: [
    { label: "Annual fees", value: "Amex Gold $325 vs Sapphire Reserve $795" },
    { label: "Reserve overtakes Gold at", value: crossover === null ? "n/a" : `≈${usd(crossover)}/yr direct travel` },
    { label: "Home-centered household", value: `${winner(goldVsReserve.home.gold, goldVsReserve.home.reserve, "Gold", "Reserve")} wins` },
    { label: "MoneyFactor lens", value: "Where your money goes, not prestige" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `The **Amex Gold** earns 4x points at restaurants worldwide (up to $50,000 a year) and at U.S. supermarkets (up to $25,000 a year), with dining, Uber Cash and Resy credits. The **Sapphire Reserve** earns 8x on Chase Travel, 4x on flights and hotels booked direct and 3x on dining, with a $300 travel credit and larger hotel, dining and StubHub credits.`,
        `If groceries and restaurants are most of your spending, the Gold wins at less than half the fee. If you travel enough, the Reserve's travel earning and credits take over. This page compares the two cards head-to-head; for the broader dining category see the [best dining card guide](/articles/best-credit-card-for-dining-restaurants-2026).`,
      ],
    },
    {
      heading: "Year-2 net value by household",
      body: ["The Gold is paired with a 2% card and the Reserve with Freedom Unlimited, so both wallets earn sensibly outside their bonus categories."],
      table: profileTable([
        { label: "Amex Gold + Citi Double Cash", fee: "$325", pick: gold },
        { label: "Sapphire Reserve + Freedom Unlimited", fee: "$795", pick: reserve },
        { label: "Reserve + Freedom Unlimited + Gold", fee: "$1,120", pick: all3 },
      ]),
    },
    {
      heading: "Worked example 1: the home-centered household",
      body: [
        `${usd(profileSpend("home").groceries ?? 0)} of groceries and ${usd(profileSpend("home").dining ?? 0)} of dining a year, two or three trips. **Gold + Double Cash:** ${breakdown("home", gold)}. **Reserve + Freedom Unlimited:** ${breakdown("home", reserve)}.`,
      ],
    },
    {
      heading: "Worked example 2: the travel-heavy household",
      body: [
        `${usd((profileSpend("travel").airfare ?? 0) + (profileSpend("travel").hotels ?? 0))} of direct travel and ${usd(profileSpend("travel").dining ?? 0)} of dining. **Reserve + Freedom Unlimited:** ${breakdown("travel", reserve)}. **Gold + Double Cash:** ${breakdown("travel", gold)}. Adding the Gold to the Reserve wallet is worth ${signed(goldVsReserve.travel.all - goldVsReserve.travel.reserve)} more a year here, because it earns 4x on groceries where the Reserve earns 1x.`,
      ],
    },
    {
      heading: "Where the Reserve overtakes the Gold",
      body: [
        crossover === null
          ? "Within the travel range we tested, the Gold wallet stays ahead for the balanced household."
          : `Holding the balanced household's dining and groceries fixed and scaling its direct airfare and hotel spending, the Reserve wallet pulls ahead at about **${usd(crossover)} a year** of direct travel. Below that, the Gold's 4x on food outweighs the Reserve's travel earning and credits.`,
      ],
    },
    {
      heading: "Sensitivity: cash-out redemptions",
      body: ["At 1¢ per point both wallets shrink; the ranking can change. Credits are unchanged."],
      table: { ...profileTable([
        { label: "Amex Gold + Citi Double Cash", fee: "$325", pick: gold },
        { label: "Sapphire Reserve + Freedom Unlimited", fee: "$795", pick: reserve },
      ], CASH_OUT), columns: ["Wallet at 1¢ per point", "Annual fees", ...householdProfiles.map((p) => p.label)] },
    },
    {
      heading: "Assumptions and limitations",
      body: ["Two points currencies only pay if you redeem both well. [Take the quiz](/) for a recommendation on your own spending, or test either fee in the [annual fee break-even calculator](/tools/annual-fee-break-even-calculator)."],
      bullets: householdAssumptions,
    },
  ],
  cardCtas: [
    { cardId: "amex-gold", headline: "Read the Amex Gold profile", body: "The dining and grocery card." },
    { cardId: "chase-sapphire-reserve", headline: "Read the Sapphire Reserve profile", body: "When direct travel and its credits fit your year." },
  ],
  relatedArticles: [
    { slug: "is-amex-gold-worth-it-2026" },
    { slug: "is-chase-sapphire-reserve-worth-it-2026" },
    { slug: "best-second-credit-card-for-premium-card-owners-2026" },
    { slug: "best-credit-card-high-income-households-2026" },
  ],
  faqs: [
    {
      question: "Is the Amex Gold or the Sapphire Reserve better for dining?",
      answer: "For dining and groceries alone, the Gold: 4x at restaurants and U.S. supermarkets against the Reserve's 3x on dining and 1x on groceries, at less than half the fee.",
    },
    {
      question: "When is the Sapphire Reserve worth $470 more than the Gold?",
      answer: crossover === null ? "When you travel heavily and use its credits." : `In our balanced household, once direct airfare and hotel spending passes about ${usd(crossover)} a year and you use its travel credits.`,
    },
  ],
  disclosureCta: disclosure,
};

// ---------------------------------------------------------------------------
// 4. Personal premium card or business card for business spending
// ---------------------------------------------------------------------------

const ownerBiz = [
  { label: "$30k business spend ($10k in Ink 3x categories)", bonus: 10000, other: 20000 },
  { label: "$80k ($30k in 3x)", bonus: 30000, other: 50000 },
  { label: "$150k ($60k in 3x)", bonus: 60000, other: 90000 },
];
const ownerSpend = (b: (typeof ownerBiz)[number]): WalletSpend => ({ ...profileSpend("balanced"), businessBonus: b.bonus, businessOther: b.other });
const ownerWallets: { label: string; fee: string; pick: Pick }[] = [
  { label: "Personal only: Reserve + Freedom Unlimited", fee: "$795", pick: (c) => [c.sapphireReserve, c.freedomUnlimited] },
  { label: "+ Ink Business Preferred", fee: "$890", pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.inkPreferred] },
  { label: "+ Spark Cash Plus", fee: "$945*", pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.sparkCashPlus] },
];
export const ownerNet = (walletIndex: number, bizIndex: number, valuation: ValuationOverride = {}) =>
  walletValue(ownerWallets[walletIndex].pick(cardsFor("balanced")), ownerSpend(ownerBiz[bizIndex]), valuation);

function ownerTable(valuation: ValuationOverride = {}): ArticleTable {
  return {
    columns: ["Wallet (balanced household + business spend)", "Annual fees", ...ownerBiz.map((b) => b.label)],
    rows: ownerWallets.map((wallet, walletIndex) => [`**${wallet.label}**`, wallet.fee, ...ownerBiz.map((_, bizIndex) => usd(ownerNet(walletIndex, bizIndex, valuation).net))]),
  };
}

const inkGain80 = ownerNet(1, 1).net - ownerNet(0, 1).net;
const sparkGain80 = ownerNet(2, 1).net - ownerNet(0, 1).net;
const sparkGain80Cash = ownerNet(2, 1, CASH_OUT).net - ownerNet(0, 1, CASH_OUT).net;
const inkGain30 = ownerNet(1, 0).net - ownerNet(0, 0).net;

const personalVsBusinessArticle: EditorialArticle = {
  slug: "personal-vs-business-credit-card-for-business-spending-2026",
  eyebrow: "Business Owner Strategy",
  title: "Personal Premium Card or Business Card for Business Spending? The Math (2026)",
  metaDescription:
    "Should a business owner put business spending on a personal Sapphire Reserve or open a business card? Year-2 math at $30k, $80k and $150k of business spend.",
  dek: `If you already hold a Sapphire Reserve and Freedom Unlimited, adding an Ink Business Preferred for business spending is worth ${signed(inkGain80)} a year at $80,000 of business spend in our model, mostly from 3x on ads, shipping, travel and phone bills. A flat 2% business card adds ${signed(sparkGain80)} when you value Chase points at 1.6¢, but ${signed(sparkGain80Cash)} if you cash points out at 1¢.`,
  category: "Business credit cards",
  updatedAt: UPDATED_AT,
  reviewedBy: REVIEWED_BY,
  readingTime: "7 min read",
  comparisonMetrics: [
    { label: "Adding Ink Preferred at $80k business spend", value: `${signed(inkGain80)} a year` },
    { label: "Adding Spark Cash Plus (points at 1.6¢)", value: `${signed(sparkGain80)} a year` },
    { label: "Adding Spark Cash Plus (cash-out at 1¢)", value: `${signed(sparkGain80Cash)} a year` },
    { label: "MoneyFactor lens", value: "Rewards math first; bookkeeping reasons listed, not scored" },
  ],
  sections: [
    {
      heading: "Quick answer",
      body: [
        `For a household that already holds a Chase Sapphire Reserve and Freedom Unlimited, business spending earns 1.5x Ultimate Rewards on the Freedom Unlimited by default. Adding a **Chase Ink Business Preferred** moves ad, shipping, travel and phone spending to 3x, worth ${signed(inkGain30)} a year at $30,000 of business spend and ${signed(inkGain80)} at $80,000 after its $95 fee.`,
        `A **Capital One Spark Cash Plus** earns 2% cash back, which is *less* than 1.5x Ultimate Rewards valued at 1.6¢ (2.4¢). It only pays if you cash points out, or once business spend is high enough for its $150 fee to be refunded.`,
      ],
    },
    {
      heading: "Year-2 net value: personal wallet vs adding a business card",
      body: ["The household is the balanced profile from our [$200k–$400k guide](/articles/credit-card-strategy-200k-400k-household-income-2026), with business spending added. *The Spark's $150 fee is refunded only at $150,000 of spending on the card."],
      table: ownerTable(),
    },
    {
      heading: "Sensitivity: cash-out redemptions",
      body: ["At 1¢ per point, Freedom Unlimited's 1.5x is worth 1.5%, so a 2% card becomes the better home for non-bonus business spend."],
      table: { ...ownerTable(CASH_OUT), columns: ["Wallet at 1¢ per point", "Annual fees", ...ownerBiz.map((b) => b.label)] },
    },
    {
      heading: "Reasons beyond rewards (not scored)",
      body: ["These matter, but they are not dollars we can model honestly, so they are listed rather than valued:"],
      bullets: [
        "**Separation.** One card per entity makes bookkeeping and expense review simpler. This is not tax or legal advice; ask your accountant how to handle business expenses.",
        "**Employee cards.** Business cards issue employee cards with their own limits.",
        "**Credit reporting.** Business cards may report differently from personal cards; check each issuer's current policy.",
      ],
    },
    {
      heading: "Assumptions and limitations",
      body: [
        "Compare the two business cards head-to-head in [Ink Business Preferred vs Spark Cash Plus](/articles/ink-business-preferred-vs-spark-cash-plus-2026), or plug in your own numbers in the [annual fee break-even calculator](/tools/annual-fee-break-even-calculator). [Take the quiz](/) for a household recommendation.",
      ],
      bullets: [...businessAssumptions, "**Freedom Unlimited** earns 1.5x on everything and 3x on dining, valued as Ultimate Rewards because it is paired with a Sapphire card."],
    },
  ],
  cardCtas: [
    { cardId: "ink-business-preferred", headline: "Read the Ink Business Preferred profile", body: "The business card that pools with a Sapphire." },
    { cardId: "chase-freedom-unlimited", headline: "Read the Freedom Unlimited profile", body: "The 1.5x catch-all that earns Ultimate Rewards." },
  ],
  relatedArticles: [
    { slug: "ink-business-preferred-vs-spark-cash-plus-2026" },
    { slug: "best-business-credit-card-for-llc-owner-2026" },
    { slug: "credit-card-strategy-200k-400k-household-income-2026" },
  ],
  faqs: [
    {
      question: "Can I put business expenses on a personal credit card?",
      answer: "Card terms differ by issuer, and keeping business and personal spending separate usually makes bookkeeping easier. Check your card agreement and ask your accountant. This page compares rewards only.",
    },
    {
      question: "Is a business card worth it if I already have a Sapphire Reserve?",
      answer: `An Ink Business Preferred is, if a meaningful share of your business spend is in its 3x categories: it adds ${signed(inkGain80)} a year at $80,000 of business spend in our model.`,
    },
  ],
  disclosureCta: disclosure,
};

export const articleBatch1Comparisons: EditorialArticle[] = [ventureXArticle, inkSparkArticle, goldReserveArticle, personalVsBusinessArticle];
