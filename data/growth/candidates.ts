import { type WalletCard, type WalletSpend, walletValue } from "@/lib/walletModel";
import { cardsFor, householdProfiles, profileSpend, walletCards } from "@/data/walletScenarios";

// Content opportunities the Growth Engine scores against Search Console data.
// Each one is a hypothesis an editor wrote down, tied to a calculation BCFM can
// actually run; the engine decides which have evidence, which collide with
// existing pages, and in what order to brief them. Adding a candidate here does
// not publish anything.

export type Segment = "high-income" | "business" | "premium-economics" | "portfolio" | "everyday";

export type PreviewTable = { caption: string; columns: string[]; rows: string[][] };

export type Candidate = {
  id: string;
  // "new": a page that does not exist; "improve": an existing article.
  kind: "new" | "improve";
  slug: string;
  title: string;
  segment: Segment;
  intent: string;
  // Regular expressions matched against Search Console queries (and, for
  // "improve", the target page) to collect evidence.
  queryPatterns: string[];
  angle: string;
  calculation: { model: "wallet" | "card-value" | "none"; description: string };
  assumptions: string[];
  // Issuer products whose terms the page would state (ids in quality/issuer-*.json).
  products: string[];
  internalLinks: string[];
  cta: { quiz: boolean; cards: string[] };
  // 1 = informational, 3 = actively choosing or applying.
  conversionIntent: 1 | 2 | 3;
  // 1 = reuse an existing model and data, 3 = new model or tool.
  effort: 1 | 2 | 3;
  preview?: () => PreviewTable;
};

const usd = (value: number) => `${value < 0 ? "−" : ""}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;

function walletPreview(caption: string, wallets: { label: string; pick: (cards: ReturnType<typeof cardsFor>) => WalletCard[] }[]) {
  return (): PreviewTable => ({
    caption,
    columns: ["Wallet", ...householdProfiles.map((profile) => `${profile.label} (Year-2 net)`)],
    rows: wallets.map((wallet) => [
      wallet.label,
      ...householdProfiles.map((profile) => usd(walletValue(wallet.pick(cardsFor(profile.id)), profileSpend(profile.id)).net)),
    ]),
  });
}

function businessPreview(caption: string, wallets: { label: string; cards: WalletCard[] }[], spends: { label: string; spend: WalletSpend }[]) {
  return (): PreviewTable => ({
    caption,
    columns: ["Wallet", ...spends.map((spend) => spend.label)],
    rows: wallets.map((wallet) => [wallet.label, ...spends.map((spend) => usd(walletValue(wallet.cards, spend.spend).net))]),
  });
}

const businessSpends = [
  { label: "$80k charged, $30k in Ink 3x categories", spend: { businessBonus: 30000, businessOther: 50000 } },
  { label: "$200k charged, $60k in 3x categories", spend: { businessBonus: 60000, businessOther: 140000 } },
  { label: "$400k charged, $150k in 3x categories", spend: { businessBonus: 150000, businessOther: 250000 } },
];

export const candidates: Candidate[] = [
  // --- Improve existing pages that already earn impressions -----------------
  {
    id: "improve-no-annual-fee",
    kind: "improve",
    slug: "best-no-annual-fee-credit-card-2026",
    title: "Best No Annual Fee Credit Card in 2026",
    segment: "everyday",
    intent: "Which $0-fee card earns the most for my spending, and when does a fee card beat it?",
    queryPatterns: ["no annual fee", "\\$0 (annual )?fee", "no fee credit card"],
    angle:
      "Add Year-2 net value for each $0 card against the 2% baseline at three household spend levels, and the spend at which a $95 card overtakes the best $0 card.",
    calculation: { model: "card-value", description: "lib/cardValueModel.ts per card, plus the wallet model for the $0-vs-$95 crossover." },
    assumptions: ["Cash back valued at 1¢; points at methodology values", "Category caps applied", "No welcome bonuses"],
    products: ["citi-double-cash", "wells-fargo-active-cash", "chase-freedom-unlimited", "blue-cash-everyday", "chase-freedom-flex"],
    internalLinks: ["/cards/citi-double-cash", "/cards/wells-fargo-active-cash", "/articles/best-2-card-credit-card-setup-2026"],
    cta: { quiz: true, cards: ["citi-double-cash", "wells-fargo-active-cash"] },
    conversionIntent: 3,
    effort: 2,
  },
  {
    id: "improve-llc-owner",
    kind: "improve",
    slug: "best-business-credit-card-for-llc-owner-2026",
    title: "Best Business Credit Card for an LLC Owner in 2026",
    segment: "business",
    intent: "Which business card fits my LLC's spending, and what does it net after the fee?",
    queryPatterns: ["llc", "business credit card", "small business card", "business owner"],
    angle:
      "Replace the unverified Amex Business Platinum credit amounts with issuer-verified ones and add a spend-mix table (ads, travel, everything else) at three revenue levels.",
    calculation: { model: "wallet", description: "Business categories in lib/walletModel.ts (Ink Preferred cap, Spark fee refund)." },
    assumptions: ["Ultimate Rewards at 1.6¢ with a 1¢ cash-out sensitivity", "Year 2, no welcome bonuses"],
    products: ["ink-business-preferred", "capital-one-spark-cash-plus", "amex-business-platinum", "amex-business-gold", "ink-business-cash"],
    internalLinks: ["/articles/best-credit-card-for-business-owners-2026", "/cards/ink-business-preferred", "/cards/ink-business-cash"],
    cta: { quiz: true, cards: ["ink-business-preferred", "ink-business-cash"] },
    conversionIntent: 3,
    effort: 1,
    preview: businessPreview(
      "Business wallets, Year-2 net (model output, editorial review required)",
      [
        { label: "Ink Business Preferred", cards: [walletCards.inkPreferred] },
        { label: "Spark Cash Plus", cards: [walletCards.sparkCashPlus] },
        { label: "Ink Preferred + Spark Cash Plus", cards: [walletCards.inkPreferred, walletCards.sparkCashPlus] },
      ],
      businessSpends,
    ),
  },
  {
    id: "improve-online-shopping",
    kind: "improve",
    slug: "best-credit-card-for-online-shopping-2026",
    title: "Best Credit Card for Online Shopping in 2026",
    segment: "everyday",
    intent: "Which card earns the most on my online and Amazon spending?",
    queryPatterns: ["online shopping", "amazon", "e-?commerce", "online purchases"],
    angle: "Add a monthly-spend break-even table (Amazon-only vs mixed online retail) using the card value model, and verify the retailer card terms it relies on.",
    calculation: { model: "card-value", description: "lib/cardValueModel.ts with retailer-specific spend lines." },
    assumptions: ["Prime membership treated as a sunk cost only for current members"],
    products: ["blue-cash-everyday", "chase-freedom-unlimited", "citi-double-cash"],
    internalLinks: ["/articles/best-no-annual-fee-credit-card-2026", "/cards/blue-cash-everyday"],
    cta: { quiz: true, cards: ["blue-cash-everyday"] },
    conversionIntent: 3,
    effort: 2,
  },
  {
    id: "improve-dining",
    kind: "improve",
    slug: "best-credit-card-for-dining-restaurants-2026",
    title: "Best Credit Card for Dining in 2026",
    segment: "everyday",
    intent: "Which card earns the most on restaurants for my monthly dining spend?",
    queryPatterns: ["dining", "restaurant", "food delivery"],
    angle: "Rewritten 2026-10-29 and not yet recrawled; hold edits until Search Console shows the new version.",
    calculation: { model: "card-value", description: "Existing decision matrix." },
    assumptions: [],
    products: ["amex-gold", "chase-sapphire-reserve"],
    internalLinks: [],
    cta: { quiz: true, cards: ["amex-gold"] },
    conversionIntent: 3,
    effort: 1,
  },
  {
    id: "support-high-income-control",
    kind: "improve",
    slug: "best-credit-card-high-income-households-2026",
    title: "Best Credit Cards for High-Income Households 2026",
    segment: "high-income",
    intent: "Which premium cards suit a high-earning household?",
    queryPatterns: ["high income", "high-income", "affluent", "wealthy", "200k", "300k"],
    angle: "Control article: never edited. Strengthen it only with inbound links from new adjacent pages.",
    calculation: { model: "none", description: "Protected." },
    assumptions: [],
    products: [],
    internalLinks: [],
    cta: { quiz: true, cards: [] },
    conversionIntent: 3,
    effort: 1,
  },

  // --- New pages ------------------------------------------------------------
  {
    id: "ink-preferred-vs-spark-cash-plus",
    kind: "new",
    slug: "ink-business-preferred-vs-spark-cash-plus-2026",
    title: "Ink Business Preferred vs Spark Cash Plus: Which Wins at Your Business Spend? (2026)",
    segment: "business",
    intent: "Should my business use Chase Ink Business Preferred or Capital One Spark Cash Plus, and is holding both better?",
    queryPatterns: ["ink (business )?preferred vs", "spark cash plus", "ink vs spark", "business card .*2%"],
    angle:
      "Break-even business spend between a 3x-category points card and a flat 2% card, including the Ink $150,000 cap, the Spark $150,000 fee refund, and the pairing that beats both.",
    calculation: { model: "wallet", description: "Business categories in lib/walletModel.ts; already pinned in tests for two spend levels." },
    assumptions: ["Ultimate Rewards at 1.6¢; 1¢ cash-out sensitivity shown", "Year 2, no welcome bonuses"],
    products: ["ink-business-preferred", "capital-one-spark-cash-plus"],
    internalLinks: ["/articles/best-business-credit-card-for-llc-owner-2026", "/articles/best-credit-card-for-business-owners-2026", "/cards/ink-business-preferred"],
    cta: { quiz: true, cards: ["ink-business-preferred"] },
    conversionIntent: 3,
    effort: 1,
    preview: businessPreview(
      "Year-2 net by business spend (model output, editorial review required)",
      [
        { label: "Ink Business Preferred", cards: [walletCards.inkPreferred] },
        { label: "Spark Cash Plus", cards: [walletCards.sparkCashPlus] },
        { label: "Both, each dollar to the better card", cards: [walletCards.inkPreferred, walletCards.sparkCashPlus] },
      ],
      businessSpends,
    ),
  },
  {
    id: "chase-trifecta-business-owner",
    kind: "new",
    slug: "sapphire-reserve-freedom-unlimited-ink-preferred-business-owner-2026",
    title: "Sapphire Reserve + Freedom Unlimited + Ink Preferred: The Three-Card Math for Business Owners (2026)",
    segment: "portfolio",
    intent: "Is the three-card Chase setup worth it for someone with both household and business spending?",
    queryPatterns: ["trifecta", "chase trifecta", "ink .*sapphire", "business and personal card"],
    angle:
      "Household plus business spend through one Ultimate Rewards pool, compared with the same household using a 2% card for business spend, with the fee stack and break-even shown.",
    calculation: { model: "wallet", description: "Wallet model with personal and business categories in one wallet." },
    assumptions: ["Balanced household profile from the $200k–$400k guide", "Points pooled across cards the same household holds"],
    products: ["chase-sapphire-reserve", "chase-freedom-unlimited", "ink-business-preferred"],
    internalLinks: ["/articles/credit-card-strategy-200k-400k-household-income-2026", "/articles/best-business-credit-card-for-llc-owner-2026", "/cards/chase-sapphire-reserve", "/articles/best-credit-card-high-income-households-2026"],
    cta: { quiz: true, cards: ["chase-sapphire-reserve", "ink-business-preferred"] },
    conversionIntent: 3,
    effort: 2,
    preview: () => {
      const c = cardsFor("balanced");
      const spend = { ...profileSpend("balanced"), businessBonus: 30000, businessOther: 50000 };
      const wallets: [string, WalletCard[]][] = [
        ["Reserve + Freedom Unlimited + Double Cash for business", [c.sapphireReserve, c.freedomUnlimited, c.doubleCash]],
        ["Reserve + Freedom Unlimited + Ink Preferred", [c.sapphireReserve, c.freedomUnlimited, c.inkPreferred]],
        ["Reserve + Freedom Unlimited + Ink Preferred + Spark Cash Plus", [c.sapphireReserve, c.freedomUnlimited, c.inkPreferred, c.sparkCashPlus]],
      ];
      return {
        caption: "Balanced household + $80k business spend, Year-2 net (model output, editorial review required)",
        columns: ["Wallet", "Fees", "Year-2 net"],
        rows: wallets.map(([label, cards]) => {
          const result = walletValue(cards, spend);
          return [label, usd(result.fees), usd(result.net)];
        }),
      };
    },
  },
  {
    id: "venture-x-vs-amex-platinum",
    kind: "new",
    slug: "capital-one-venture-x-vs-amex-platinum-2026",
    title: "Capital One Venture X vs Amex Platinum: $395 vs $895, Which Pays More? (2026)",
    segment: "premium-economics",
    intent: "Is the Amex Platinum worth $500 more a year than the Venture X for my travel?",
    queryPatterns: ["venture x vs (amex )?platinum", "platinum vs venture x", "venture x or platinum"],
    angle: "Year-2 net for both cards across three household profiles, the credit capture the Platinum needs to justify the $500 fee gap, and when holding both makes sense.",
    calculation: { model: "wallet", description: "Wallet model with the existing household profiles and capture rates." },
    assumptions: ["Capture rates from data/walletScenarios.ts", "Lounge access counted once"],
    products: ["capital-one-venture-x", "amex-platinum"],
    internalLinks: ["/articles/is-capital-one-venture-x-worth-it-2026", "/articles/is-amex-platinum-worth-it-2026", "/articles/multiple-premium-credit-cards-vs-one-2026", "/articles/best-credit-card-high-income-households-2026"],
    cta: { quiz: true, cards: ["capital-one-venture-x", "amex-platinum"] },
    conversionIntent: 3,
    effort: 1,
    preview: walletPreview("Year-2 net by household (model output, editorial review required)", [
      { label: "Venture X alone", pick: (c) => [c.ventureX] },
      { label: "Amex Platinum + Double Cash", pick: (c) => [c.amexPlatinum, c.doubleCash] },
      { label: "Venture X + Amex Gold", pick: (c) => [c.ventureX, c.amexGold] },
    ]),
  },
  {
    id: "amex-gold-vs-sapphire-reserve",
    kind: "new",
    slug: "amex-gold-vs-chase-sapphire-reserve-2026",
    title: "Amex Gold vs Chase Sapphire Reserve: $325 vs $795 for a Dining-Heavy Household (2026)",
    segment: "premium-economics",
    intent: "Do I need the Reserve, or does the Gold cover a household that mostly eats out and buys groceries?",
    queryPatterns: ["gold vs (sapphire )?reserve", "reserve vs (amex )?gold", "amex gold or sapphire"],
    angle: "Head-to-head Year-2 net by profile, the travel spend at which the Reserve overtakes the Gold, and what holding both adds.",
    calculation: { model: "wallet", description: "Wallet model; Gold caps and Reserve direct-travel rates already verified." },
    assumptions: ["Freedom Unlimited paired with the Reserve; Double Cash paired with the Gold"],
    products: ["amex-gold", "chase-sapphire-reserve"],
    internalLinks: ["/articles/is-amex-gold-worth-it-2026", "/articles/is-chase-sapphire-reserve-worth-it-2026", "/articles/best-credit-card-for-dining-restaurants-2026"],
    cta: { quiz: true, cards: ["amex-gold", "chase-sapphire-reserve"] },
    conversionIntent: 3,
    effort: 1,
    preview: walletPreview("Year-2 net by household (model output, editorial review required)", [
      { label: "Amex Gold + Double Cash", pick: (c) => [c.amexGold, c.doubleCash] },
      { label: "Sapphire Reserve + Freedom Unlimited", pick: (c) => [c.sapphireReserve, c.freedomUnlimited] },
      { label: "All three", pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexGold] },
    ]),
  },
  {
    id: "membership-rewards-vs-ultimate-rewards-household",
    kind: "new",
    slug: "amex-vs-chase-ecosystem-household-2026",
    title: "Amex or Chase Ecosystem? A Household Wallet Comparison (2026)",
    segment: "portfolio",
    intent: "Should my household build around Amex Membership Rewards or Chase Ultimate Rewards?",
    queryPatterns: ["membership rewards vs ultimate rewards", "amex vs chase", "chase or amex ecosystem"],
    angle: "Best two- and three-card wallet inside each ecosystem for three households, plus the cost of splitting points across both.",
    calculation: { model: "wallet", description: "Wallet model; ecosystem wallets built from verified cards only." },
    assumptions: ["Points at methodology values; 1¢ cash-out sensitivity"],
    products: ["amex-gold", "amex-platinum", "chase-sapphire-reserve", "chase-freedom-unlimited"],
    internalLinks: ["/articles/best-2-card-credit-card-setup-2026", "/articles/amex-platinum-vs-chase-sapphire-reserve-2026", "/articles/best-credit-card-high-income-households-2026"],
    cta: { quiz: true, cards: ["amex-gold", "chase-sapphire-reserve"] },
    conversionIntent: 2,
    effort: 2,
    preview: walletPreview("Year-2 net by household (model output, editorial review required)", [
      { label: "Amex: Gold + Platinum (+ Double Cash)", pick: (c) => [c.amexGold, c.amexPlatinum, c.doubleCash] },
      { label: "Chase: Reserve + Freedom Unlimited", pick: (c) => [c.sapphireReserve, c.freedomUnlimited] },
      { label: "Split: Reserve + Freedom Unlimited + Gold", pick: (c) => [c.sapphireReserve, c.freedomUnlimited, c.amexGold] },
    ]),
  },
  {
    id: "downgrade-sapphire-reserve",
    kind: "new",
    slug: "should-i-downgrade-chase-sapphire-reserve-2026",
    title: "Should You Downgrade the Chase Sapphire Reserve? The Year-2 Math (2026)",
    segment: "premium-economics",
    intent: "My Reserve renewal is coming up; is it worth keeping at $795 or should I downgrade?",
    queryPatterns: ["downgrade (sapphire )?reserve", "cancel sapphire reserve", "reserve renewal", "product change"],
    angle: "Renewal-time decision: Year-2 net of keeping the Reserve vs downgrading, using the household's own credit capture, with a capture-rate break-even.",
    calculation: { model: "wallet", description: "Wallet model; needs Sapphire Preferred and Freedom earn rates added to the claim registry first." },
    assumptions: ["Downgrade path availability varies by issuer policy; verify"],
    products: ["chase-sapphire-reserve", "chase-sapphire-preferred", "chase-freedom-unlimited"],
    internalLinks: ["/articles/is-chase-sapphire-reserve-worth-it-2026", "/articles/is-chase-sapphire-preferred-best-95-travel-card-2026"],
    cta: { quiz: true, cards: ["chase-sapphire-preferred"] },
    conversionIntent: 2,
    effort: 2,
  },
  {
    id: "sapphire-preferred-vs-reserve",
    kind: "new",
    slug: "chase-sapphire-preferred-vs-sapphire-reserve-2026",
    title: "Sapphire Preferred vs Sapphire Reserve: At What Spend Does the $700 Gap Pay? (2026)",
    segment: "premium-economics",
    intent: "Should I get the Sapphire Preferred or the Sapphire Reserve for my travel and dining?",
    queryPatterns: ["preferred vs reserve", "reserve vs preferred", "sapphire preferred or reserve"],
    angle: "Travel and dining spend at which the Reserve's earn and credits overtake the Preferred's $95 fee, by household profile.",
    calculation: { model: "wallet", description: "Wallet model; Sapphire Preferred earn rates must be verified and added to the registry." },
    assumptions: ["Credit capture from the household profiles"],
    products: ["chase-sapphire-preferred", "chase-sapphire-reserve"],
    internalLinks: ["/articles/is-chase-sapphire-preferred-best-95-travel-card-2026", "/articles/is-chase-sapphire-reserve-worth-it-2026", "/articles/chase-sapphire-reserve-vs-capital-one-venture-x-2026"],
    cta: { quiz: true, cards: ["chase-sapphire-preferred", "chase-sapphire-reserve"] },
    conversionIntent: 3,
    effort: 2,
  },
  {
    id: "business-platinum-vs-personal-platinum",
    kind: "new",
    slug: "amex-business-platinum-vs-personal-platinum-2026",
    title: "Amex Business Platinum vs Personal Platinum for Business Owners (2026)",
    segment: "business",
    intent: "As a business owner, should I hold the Business Platinum, the personal Platinum, or both?",
    queryPatterns: ["business platinum vs", "business platinum or personal", "amex business platinum worth"],
    angle: "Which Platinum earns more for an owner's split of business and personal travel, and what holding both duplicates.",
    calculation: { model: "wallet", description: "Needs Business Platinum earn and credit amounts in the wallet model and claim registry." },
    assumptions: ["Business Platinum credit amounts must be verified first (flagged in PR #13)"],
    products: ["amex-business-platinum", "amex-platinum"],
    internalLinks: ["/articles/best-credit-card-for-business-owners-2026", "/articles/is-amex-platinum-worth-it-2026"],
    cta: { quiz: true, cards: ["amex-platinum"] },
    conversionIntent: 3,
    effort: 3,
  },
  {
    id: "annual-fee-break-even-calculator",
    kind: "new",
    slug: "credit-card-annual-fee-break-even-calculator",
    title: "Credit Card Annual Fee Break-Even Calculator",
    segment: "premium-economics",
    intent: "How much do I need to spend or use in credits for this annual fee to pay off?",
    queryPatterns: ["break.?even", "annual fee calculator", "is the annual fee worth"],
    angle: "Interactive version of the methodology: enter spend by category and credits you would use; get Year-2 net against the 2% baseline for any card in the database.",
    calculation: { model: "card-value", description: "lib/cardValueModel.ts in the browser; a new page component (tool, not article)." },
    assumptions: ["Uses the published methodology point values"],
    products: [],
    internalLinks: ["/methodology", "/articles/multiple-premium-credit-cards-vs-one-2026"],
    cta: { quiz: true, cards: [] },
    conversionIntent: 2,
    effort: 3,
  },
  {
    id: "personal-card-for-business-spend",
    kind: "new",
    slug: "personal-vs-business-credit-card-for-business-spending-2026",
    title: "Personal Premium Card or Business Card for Business Spending? The Math (2026)",
    segment: "business",
    intent: "Should I put my small business spending on my personal Sapphire/Platinum or open a business card?",
    queryPatterns: ["personal card for business", "business expenses on personal", "need a business credit card"],
    angle: "Rewards difference of routing business spend to a business card vs a personal premium card at three spend levels, with the non-math reasons (separation, liability) listed but not scored.",
    calculation: { model: "wallet", description: "Wallet model mixing personal and business categories." },
    assumptions: ["Not tax or legal advice; bookkeeping benefits described, not valued"],
    products: ["ink-business-preferred", "capital-one-spark-cash-plus", "chase-sapphire-reserve"],
    internalLinks: ["/articles/best-business-credit-card-for-llc-owner-2026"],
    cta: { quiz: true, cards: ["ink-business-preferred"] },
    conversionIntent: 2,
    effort: 2,
  },

  // --- Kept to show the cannibalization guard working ------------------------
  {
    id: "platinum-occasional-travelers",
    kind: "new",
    slug: "is-amex-platinum-worth-it-occasional-travelers-2026",
    title: "Is the Amex Platinum Worth It for Occasional Travelers in 2026?",
    segment: "premium-economics",
    intent: "Is the Amex Platinum worth its annual fee if I only travel a few times a year?",
    queryPatterns: ["platinum worth it"],
    angle: "Platinum value for low-travel households.",
    calculation: { model: "wallet", description: "Wallet model." },
    assumptions: [],
    products: ["amex-platinum"],
    internalLinks: [],
    cta: { quiz: true, cards: ["amex-platinum"] },
    conversionIntent: 3,
    effort: 1,
  },
  {
    id: "best-card-to-pair-with-reserve",
    kind: "new",
    slug: "best-card-to-pair-with-chase-sapphire-reserve-2026",
    title: "Best Second Credit Card to Pair With the Chase Sapphire Reserve (2026)",
    segment: "portfolio",
    intent: "What is the best second card for a Sapphire Reserve owner?",
    queryPatterns: ["pair with (sapphire )?reserve"],
    angle: "Second card for Reserve owners.",
    calculation: { model: "wallet", description: "Wallet model." },
    assumptions: [],
    products: ["chase-sapphire-reserve"],
    internalLinks: [],
    cta: { quiz: true, cards: [] },
    conversionIntent: 3,
    effort: 1,
  },
];
