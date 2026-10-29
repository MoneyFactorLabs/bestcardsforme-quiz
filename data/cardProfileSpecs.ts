import type { CardProfileSpec } from "@/lib/cardProfileBuilder";

const CHECKED_AT = "2026-10-29";
const CHECK_METHOD =
  "Checked against current public card listings and recent 2026 card reviews. Issuer terms were not independently confirmed, so confirm final terms on the issuer's site before applying.";

// Card profiles generated from structured facts. Every figure the value model
// uses is stated in `valueModel`; anything we could not confirm is listed in
// `factCheck.flags` and left out of the math rather than guessed.
export const cardProfileSpecs: CardProfileSpec[] = [
  {
    slug: "citi-double-cash",
    cardName: "Citi Double Cash",
    issuer: "Citi",
    annualFee: 0,
    scoringCategory: "cashback",
    headline: "2% flat cash back on everything",
    bestFor: "Households that want one no-fee card that earns 2% on everything without tracking categories",
    rewardsSummary:
      "Earns 2% on every purchase, split as 1% when you buy and 1% when you pay it off. Rewards post as Citi ThankYou points worth 1¢ each as cash back, so the card works as a simple 2% card with no categories, caps, or activation.",
    earnRates: [
      "2% on all purchases: 1% at purchase plus 1% when you pay the bill",
      "No category caps, rotating categories, or activation",
      "Rewards post as ThankYou points redeemable at 1¢ each for cash back",
    ],
    creditsSummary:
      "No statement credits. The value is the earn rate itself, which is why we use a 2% flat card as the baseline every other card has to beat.",
    travelPerks:
      "Not a travel card: a 3% foreign transaction fee makes it a poor choice for purchases abroad.",
    transferPartners:
      "Points can be combined with a premium Citi ThankYou card to unlock airline transfers, but this profile values them as cash back only.",
    recommendedUserTypes: [
      "Anyone who wants a single no-fee card with a reliable 2% return",
      "Households whose spending is spread across many categories with no dominant bonus category",
      "People pairing a category card with a strong catch-all card for everything else",
    ],
    skipIf: [
      "You spend heavily abroad: the 3% foreign transaction fee wipes out the rewards",
      "Most of your spending is concentrated in groceries, dining, or gas, where category cards earn 3%–6%",
      "You want travel protections or transferable points without pairing cards",
    ],
    marketingOverstates: [
      "\"Double cash\" only reaches 2% once you pay the balance: carrying a balance at the card's APR costs far more than the rewards earn.",
      "A flat 2% is a strong floor, not a ceiling: category cards beat it wherever your spending is concentrated.",
    ],
    alternatives: [
      { slug: "wells-fargo-active-cash", reason: "Same 2% rate on everything, plus cell phone protection when you pay your phone bill with the card." },
      { slug: "blue-cash-everyday", reason: "Earns 3% at U.S. supermarkets, gas stations, and online retail (each capped at $6,000 a year) if those categories dominate your spending." },
      { slug: "chase-freedom-unlimited", reason: "Earns less on general spending standalone, but more if you pool points with a Sapphire card." },
    ],
    relatedArticleSlugs: [
      "best-no-annual-fee-credit-card-2026",
      "best-credit-card-for-gas-2026",
      "best-credit-card-for-online-shopping-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$0 annual fee; 2% earn structure (1% buy + 1% pay); 3% foreign transaction fee." },
        { status: "unverified", note: "Current welcome offer and APR vary by source and are not used in this profile." },
        { status: "unverified", note: "Bonus earning on travel booked through Citi Travel was a time-limited promotion in past years; not counted here." },
      ],
    },
    scores: { rewardsValue: 6, feeJustification: 10, travelUtility: 2, everydayUse: 9, beginnerFriendliness: 9 },
    valueModel: {
      currency: "cash",
      spend: [{ category: "All purchases", annualSpend: 24000, earnRate: 2 }],
      credits: [],
    },
  },
  {
    slug: "united-explorer",
    cardName: "United Explorer Card",
    issuer: "Chase",
    annualFee: 150,
    annualFeeNote: "$150 ($0 intro first year)",
    scoringCategory: "travel",
    headline: "free first checked bag, 2x on United, dining, and hotels",
    bestFor: "Households that fly United a few times a year and check bags",
    rewardsSummary:
      "Earns 2 MileagePlus miles per dollar on United purchases, dining, and hotels booked directly, and 1 mile everywhere else. The earn rate alone is weaker than a 2% cash card; the case for the card is its United travel benefits, starting with the free first checked bag.",
    earnRates: [
      "2x miles on United purchases (Chase advertises higher combined totals on United flights when MileagePlus member earning is included)",
      "2x miles on dining and on hotel stays booked directly with the hotel",
      "1x mile on everything else",
    ],
    creditsSummary:
      "Annual credits include up to $100 on prepaid United Hotels stays, up to $60 in rideshare (enrollment required), up to $50 on Avis or Budget rentals booked through United, and a $100 United travel credit after $10,000 of spending in a calendar year. Each requires a specific booking path, so we count them at partial value.",
    travelPerks:
      "Free first checked bag for the cardholder and one companion on the same reservation, priority boarding, two United Club one-time passes a year, a Global Entry/TSA PreCheck/NEXUS credit every four years, 25% back on inflight purchases, and no foreign transaction fee.",
    transferPartners:
      "Miles stay inside United MileagePlus and Star Alliance awards. There are no transfer partners; Chase Ultimate Rewards cards can transfer into United instead.",
    recommendedUserTypes: [
      "Households that fly United two or more round trips a year and check at least one bag",
      "Travelers based at a United hub who value priority boarding and occasional lounge visits",
      "People who will actually book hotels and rentals through United's portals to use the credits",
    ],
    skipIf: [
      "You fly United less than once a year or travel carry-on only",
      "You want rewards that work across airlines: transferable points are more flexible",
      "You will not route hotel, rideshare, and rental bookings through the specific channels the credits require",
    ],
    marketingOverstates: [
      "The annual credits are marketed at face value, but each one requires a specific booking path; most households capture only part of them.",
      "\"Up to\" mile totals on United flights include miles every MileagePlus member earns anyway, not just the card's own 2x.",
      "Checked-bag savings assume you check bags on every trip; carry-on travelers get none of that value.",
    ],
    alternatives: [
      { slug: "southwest-rapid-rewards-priority", reason: "The better airline card if you mostly fly Southwest from a Southwest-heavy airport." },
      { slug: "chase-sapphire-preferred", reason: "Transferable points that move 1:1 to United and other airlines, for travelers who are not loyal to one carrier." },
      { slug: "citi-double-cash", reason: "Flat 2% cash back with no fee if you fly United rarely." },
    ],
    relatedArticleSlugs: [
      "best-airline-credit-card-domestic-travel-2026",
      "best-credit-card-international-travel-no-foreign-transaction-fees-2026",
      "best-credit-card-for-travel-points-beginners-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "changed", note: "The annual fee is now $150 after a $0 first year. Our earlier profile listed $95." },
        { status: "verified", note: "Free first checked bag (cardholder + 1 companion), 2 United Club passes, priority boarding, and the hotel, rideshare, Avis/Budget, and $10,000-spend travel credits." },
        { status: "unverified", note: "An Instacart credit appears on some listings but not others; it is excluded from the value math." },
        { status: "unverified", note: "The welcome offer varies by listing (50,000–80,000 miles) and is not used in this profile." },
        { status: "changed", note: "United raised its first checked-bag fee to $45 prepaid online ($50 at the airport) for tickets bought from April 3, 2026; the bag value uses $45." },
        { status: "unverified", note: "The 1.2¢ United mile valuation is a provisional MoneyFactor value, not yet part of the published methodology table." },
      ],
    },
    scores: { rewardsValue: 5, feeJustification: 7, travelUtility: 7, everydayUse: 4, beginnerFriendliness: 6 },
    valueModel: {
      currency: "unitedMiles",
      spend: [
        { category: "United purchases", annualSpend: 2000, earnRate: 2 },
        { category: "Dining", annualSpend: 3000, earnRate: 2 },
        { category: "Hotels booked directly", annualSpend: 500, earnRate: 2 },
        { category: "Everything else", annualSpend: 14500, earnRate: 1 },
      ],
      credits: [
        { name: "Free first checked bag", faceValue: 360, captureRate: 1, note: "Assumes 2 round trips for 2 travelers at United's $45 prepaid first-bag fee each way." },
        { name: "2 United Club one-time passes", faceValue: 118, captureRate: 0.5 },
        { name: "United Hotels credit", faceValue: 100, captureRate: 0.4, note: "Prepaid United Hotels stays only." },
        { name: "Rideshare credit", faceValue: 60, captureRate: 0.6 },
        { name: "Avis/Budget credit", faceValue: 50, captureRate: 0.25 },
        { name: "United travel credit after $10,000 spend", faceValue: 100, captureRate: 0.75, note: "The assumed $20,000 of spending qualifies." },
      ],
    },
  },
  {
    slug: "ink-business-preferred",
    cardName: "Chase Ink Business Preferred",
    issuer: "Chase",
    annualFee: 95,
    scoringCategory: "business",
    headline: "3x points on travel, shipping, telecom, and ads",
    bestFor: "Businesses with real spending on travel, shipping, internet/phone, or online advertising that will transfer points",
    rewardsSummary:
      "Earns 3 Chase Ultimate Rewards points per dollar on the first $150,000 a year of combined travel, shipping, internet/cable/phone, and social media or search advertising spend, then 1x. The value depends on transferring points to airline and hotel partners: cashed out at 1¢, the same spending loses to a 2% card.",
    earnRates: [
      "3x points on the first $150,000 a year in combined travel, shipping, internet/cable/phone, and social media and search engine advertising",
      "1x point on all other purchases",
      "Points transfer to Chase's airline and hotel partners, or pool with other Ultimate Rewards cards",
    ],
    creditsSummary:
      "No annual statement credits. The fee is justified by 3x earning plus transferable points, not by perks.",
    travelPerks:
      "No foreign transaction fee, trip cancellation/interruption coverage, and cell phone protection when the phone bill is paid with the card. No lounge access or travel credits.",
    transferPartners:
      "Full Chase Ultimate Rewards transfer access on its own, including United, Southwest, and Hyatt, which is the main reason to choose it over a no-fee business card.",
    recommendedUserTypes: [
      "LLCs and sole proprietors with $6,000+ a year in shipping, advertising, telecom, or travel",
      "Business owners already using Chase Sapphire who want to pool points",
      "Businesses that redeem through transfer partners rather than cashing points out",
    ],
    skipIf: [
      "Most of your business spending falls outside the four 3x categories",
      "You only ever redeem for cash: at 1¢ per point a 2% card beats it",
      "You want a no-fee business card: Ink Business Cash covers office supply and telecom spend for $0",
    ],
    marketingOverstates: [
      "Headline point values assume transfers to airline and hotel partners; at 1¢ cash value the card trails a flat 2% card at our spending mix.",
      "The $150,000 cap is generous, but the 3x categories are narrow: office supplies and inventory earn 1x.",
      "Welcome-bonus math dominates most reviews; Year 2 is where the $95 fee has to be earned.",
    ],
    alternatives: [
      { slug: "ink-business-cash", reason: "$0 fee with 5% on office supply and internet/phone spend (first $25,000 a year)." },
      { slug: "chase-sapphire-preferred", reason: "The personal Ultimate Rewards card to pool with, if most of your spending is personal travel and dining." },
      { slug: "citi-double-cash", reason: "A flat 2% catch-all if your business spending does not fit the 3x categories." },
    ],
    relatedArticleSlugs: [
      "best-business-credit-card-for-llc-owner-2026",
      "best-credit-card-for-business-owners-2026",
      "best-2-card-credit-card-setup-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$95 annual fee; 3x on the first $150,000 of combined spend in the four categories; 1x elsewhere." },
        { status: "unverified", note: "A change to the Hyatt transfer ratio effective October 1, 2026 has been reported; the 1.6¢ point valuation has not been adjusted for it." },
        { status: "unverified", note: "The welcome offer varies by listing and is not used in this profile." },
      ],
    },
    scores: { rewardsValue: 8, feeJustification: 8, travelUtility: 6, everydayUse: 5, beginnerFriendliness: 6 },
    valueModel: {
      currency: "chaseUltimateRewards",
      spend: [
        { category: "Travel", annualSpend: 6000, earnRate: 3 },
        { category: "Shipping", annualSpend: 3000, earnRate: 3 },
        { category: "Internet, cable, and phone", annualSpend: 2400, earnRate: 3 },
        { category: "Social media and search ads", annualSpend: 6000, earnRate: 3 },
        { category: "Everything else", annualSpend: 20000, earnRate: 1 },
      ],
      credits: [],
      alternateValuation: { currency: "cash", scenario: "cash points out at 1¢ instead of transferring them" },
    },
  },
  {
    slug: "southwest-rapid-rewards-priority",
    cardName: "Southwest Rapid Rewards Priority",
    issuer: "Chase",
    annualFee: 229,
    scoringCategory: "travel",
    headline: "free checked bag and 7,500 anniversary points",
    bestFor: "Frequent Southwest flyers who check bags and want seat and upgrade perks",
    rewardsSummary:
      "Earns 4 points per dollar on Southwest purchases, 2x at gas stations and restaurants, and 1x elsewhere, plus 7,500 points on each card anniversary. Southwest's 2025–2026 changes (checked-bag fees and assigned seating) made the card's bag and seat benefits matter more than its earn rate.",
    earnRates: [
      "4x points on Southwest purchases",
      "2x points at gas stations and restaurants",
      "1x point on everything else",
      "7,500 bonus points every card anniversary",
    ],
    creditsSummary:
      "The anniversary points are the only recurring \"credit\". Older versions of this card included an annual Southwest travel credit; current 2026 listings do not confirm one, so it is not counted.",
    travelPerks:
      "First checked bag free for the cardholder and up to 8 others on the same reservation, a Preferred seat at booking when available, Extra Legroom upgrades within 48 hours of departure when available, 2,500 Tier Qualifying Points toward A-List for every $5,000 spent, and no foreign transaction fee. No lounge access or Global Entry/TSA PreCheck credit.",
    transferPartners:
      "Points stay in Southwest Rapid Rewards. There are no transfer partners; Chase Ultimate Rewards points can transfer into Southwest 1:1.",
    recommendedUserTypes: [
      "Households flying Southwest several round trips a year with checked bags",
      "Travelers who value a Preferred seat at booking and Extra Legroom upgrades",
      "Southwest loyalists working toward A-List or the Companion Pass who want points on everyday spending",
    ],
    skipIf: [
      "You fly Southwest less than twice a year: the $229 fee is hard to recover",
      "You travel carry-on only, so the checked-bag benefit is worth nothing to you",
      "You want points that work across airlines",
    ],
    marketingOverstates: [
      "Seat and upgrade perks depend on availability; they are not guaranteed on every flight.",
      "The 7,500 anniversary points are worth roughly $100 at our valuation, less than half the annual fee on their own.",
      "Bag-fee savings scale with how often you fly and check bags; occasional flyers capture little.",
    ],
    alternatives: [
      { slug: "united-explorer", reason: "The better airline card if you mostly fly United, at a lower $150 fee." },
      { slug: "chase-sapphire-preferred", reason: "Ultimate Rewards points transfer to Southwest 1:1 and also work with other airlines." },
      { slug: "citi-double-cash", reason: "A simple 2% card if you fly Southwest only occasionally." },
    ],
    relatedArticleSlugs: [
      "best-airline-credit-card-domestic-travel-2026",
      "best-2-card-credit-card-setup-2026",
      "best-credit-card-for-travel-points-beginners-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "changed", note: "The annual fee is now $229. Our earlier profile listed $149." },
        { status: "changed", note: "Southwest introduced checked-bag fees and assigned seating, so the card's free-bag and seat benefits replaced older boarding perks." },
        { status: "verified", note: "4x Southwest / 2x gas and restaurants / 1x; 7,500 anniversary points; first checked bag free; Preferred seat at booking and Extra Legroom upgrades when available." },
        { status: "unverified", note: "No annual Southwest travel credit is confirmed in current listings; it is not counted." },
        { status: "changed", note: "Southwest raised its first checked-bag fee to $45 for reservations made from April 9, 2026; the bag value uses $45." },
        { status: "unverified", note: "The 1.3¢ Southwest point valuation is a provisional MoneyFactor value." },
      ],
    },
    scores: { rewardsValue: 5, feeJustification: 5, travelUtility: 6, everydayUse: 4, beginnerFriendliness: 6 },
    valueModel: {
      currency: "southwestPoints",
      spend: [
        { category: "Southwest purchases", annualSpend: 2500, earnRate: 4 },
        { category: "Gas stations", annualSpend: 2000, earnRate: 2 },
        { category: "Restaurants", annualSpend: 3000, earnRate: 2 },
        { category: "Everything else", annualSpend: 12500, earnRate: 1 },
      ],
      credits: [
        { name: "7,500 anniversary points", faceValue: 97.5, captureRate: 1, note: "Valued at 1.3¢ per point." },
        { name: "Free first checked bag", faceValue: 360, captureRate: 1, note: "Assumes 2 round trips for 2 travelers at Southwest's $45 first-bag fee each way." },
      ],
    },
  },
  {
    slug: "wells-fargo-active-cash",
    cardName: "Wells Fargo Active Cash",
    issuer: "Wells Fargo",
    annualFee: 0,
    scoringCategory: "cashback",
    headline: "unlimited 2% cash rewards plus cell phone protection",
    bestFor: "People who want flat 2% cash back with cell phone protection built in",
    rewardsSummary:
      "Earns unlimited 2% cash rewards on purchases with no categories or caps. On rewards alone it ties the Citi Double Cash; the practical difference is cell phone protection when you pay your monthly phone bill with the card.",
    earnRates: [
      "2% cash rewards on purchases, unlimited",
      "No rotating categories, caps, or activation",
    ],
    creditsSummary:
      "No statement credits. Cell phone protection (up to $600 per claim, $25 deductible, secondary to other coverage) applies when the monthly phone bill is paid with the card.",
    travelPerks:
      "Auto rental collision damage coverage and roadside dispatch. A 3% foreign transaction fee makes it a poor card to use abroad.",
    transferPartners:
      "Cash rewards only in this profile; no airline or hotel transfers.",
    recommendedUserTypes: [
      "Anyone who wants a single no-fee 2% card",
      "Households that would otherwise buy phone insurance",
      "People who prefer cash rewards over points",
    ],
    skipIf: [
      "You already hold a 2% card: a second one adds nothing",
      "You spend often abroad (3% foreign transaction fee)",
      "Your spending is concentrated in groceries, dining, or gas, where category cards earn more",
    ],
    marketingOverstates: [
      "Cell phone protection is secondary to other insurance and carries a deductible; it is a backstop, not free insurance.",
      "Flat 2% is a strong floor, not a ceiling for households with concentrated category spending.",
    ],
    alternatives: [
      { slug: "citi-double-cash", reason: "The same 2% on everything; choose by issuer relationship and redemption preference." },
      { slug: "blue-cash-everyday", reason: "3% at U.S. supermarkets, gas, and online retail if those categories dominate." },
      { slug: "chase-freedom-unlimited", reason: "Better when you can pool points with a Sapphire card." },
    ],
    relatedArticleSlugs: [
      "best-no-annual-fee-credit-card-2026",
      "best-credit-card-for-online-shopping-2026",
      "best-credit-card-for-travel-points-beginners-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$0 annual fee; unlimited 2% cash rewards; cell phone protection up to $600 with a $25 deductible; 3% foreign transaction fee." },
        { status: "unverified", note: "The welcome offer and intro APR vary by source and are not used in this profile." },
      ],
    },
    scores: { rewardsValue: 6, feeJustification: 10, travelUtility: 2, everydayUse: 9, beginnerFriendliness: 10 },
    valueModel: {
      currency: "cash",
      spend: [{ category: "All purchases", annualSpend: 24000, earnRate: 2 }],
      credits: [],
    },
  },
  {
    slug: "blue-cash-preferred",
    cardName: "Amex Blue Cash Preferred",
    issuer: "American Express",
    annualFee: 95,
    annualFeeNote: "$95 ($0 intro first year)",
    scoringCategory: "cashback",
    headline: "6% at U.S. supermarkets and on select streaming",
    bestFor: "Families with heavy U.S. supermarket spending who want cash back rather than points",
    rewardsSummary:
      "Earns 6% cash back at U.S. supermarkets on up to $6,000 a year (then 1%), 6% on select U.S. streaming subscriptions, 3% at U.S. gas stations and on transit, and 1% elsewhere. The supermarket rate alone covers the $95 fee at about $3,170 a year of supermarket spending compared with the no-fee Blue Cash Everyday.",
    earnRates: [
      "6% at U.S. supermarkets on up to $6,000 a year, then 1%",
      "6% on select U.S. streaming subscriptions",
      "3% at U.S. gas stations and on transit (rideshare, parking, tolls, trains, buses)",
      "1% on other purchases",
    ],
    creditsSummary:
      "Up to $10 a month ($120 a year) in statement credits on Disney+, Hulu, or ESPN streaming purchases, with enrollment. Credits do not roll over, so we count half of the face value for a household that already subscribes.",
    travelPerks:
      "Not a travel card: the 3% transit category helps commuters, but a 2.7% foreign transaction fee applies abroad.",
    transferPartners:
      "Rewards are cash back (Reward Dollars) only; no Membership Rewards transfers.",
    recommendedUserTypes: [
      "Households spending $3,200 or more a year at U.S. supermarkets",
      "Families with several streaming subscriptions and a regular commute",
      "Cash-back households that do not want to manage points",
    ],
    skipIf: [
      "Your supermarket spending is under about $3,000 a year: Blue Cash Everyday earns similar value for $0",
      "Most of your groceries come from warehouse clubs or superstores, which do not count as supermarkets",
      "You want travel rewards or plan to use the card abroad",
    ],
    marketingOverstates: [
      "\"6% back\" stops at $6,000 of supermarket spend a year; beyond that it earns 1%.",
      "Warehouse clubs and superstores are excluded from the supermarket category.",
      "The first-year $0 fee flatters Year-1 math; Year 2 has to clear $95.",
    ],
    alternatives: [
      { slug: "blue-cash-everyday", reason: "The $0-fee version: 3% at U.S. supermarkets, gas, and online retail." },
      { slug: "amex-gold", reason: "4x Membership Rewards at restaurants and U.S. supermarkets if you also dine out heavily and want points." },
      { slug: "citi-double-cash", reason: "A flat 2% catch-all to pair with it for non-grocery spending." },
    ],
    relatedArticleSlugs: [
      "best-grocery-credit-card-high-spend-households-2026",
      "is-amex-gold-worth-it-2026",
      "best-credit-card-for-gas-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$95 annual fee ($0 first year); 6% U.S. supermarkets up to $6,000, 6% select U.S. streaming, 3% U.S. gas and transit, 1% other." },
        { status: "changed", note: "The Disney streaming credit rose from $7 to $10 a month in August 2025; it is counted at 50% of face value." },
        { status: "unverified", note: "The welcome offer varies by listing and is not used in this profile." },
      ],
    },
    scores: { rewardsValue: 8, feeJustification: 7, travelUtility: 2, everydayUse: 8, beginnerFriendliness: 7 },
    valueModel: {
      currency: "cash",
      spend: [
        { category: "U.S. supermarkets", annualSpend: 6000, earnRate: 6 },
        { category: "Select U.S. streaming", annualSpend: 600, earnRate: 6 },
        { category: "U.S. gas stations", annualSpend: 2000, earnRate: 3 },
        { category: "Transit", annualSpend: 1000, earnRate: 3 },
        { category: "Everything else", annualSpend: 14400, earnRate: 1 },
      ],
      credits: [
        { name: "Disney streaming credit", faceValue: 120, captureRate: 0.5, note: "Assumes an existing Disney+, Hulu, or ESPN subscription on monthly billing." },
      ],
    },
  },
  {
    slug: "blue-cash-everyday",
    cardName: "Amex Blue Cash Everyday",
    issuer: "American Express",
    annualFee: 0,
    scoringCategory: "cashback",
    headline: "3% at U.S. supermarkets, gas stations, and online retail",
    bestFor: "No-fee households whose spending centers on U.S. groceries, gas, and online shopping",
    rewardsSummary:
      "Earns 3% cash back at U.S. supermarkets, U.S. gas stations, and on U.S. online retail purchases, each on up to $6,000 a year, then 1%, and 1% on everything else. At a typical spending mix it lands about even with a flat 2% card; it wins when those three categories carry most of your spending.",
    earnRates: [
      "3% at U.S. supermarkets on up to $6,000 a year, then 1%",
      "3% at U.S. gas stations on up to $6,000 a year, then 1%",
      "3% on U.S. online retail purchases on up to $6,000 a year, then 1%",
      "1% on other purchases",
    ],
    creditsSummary:
      "A Disney streaming credit of up to $7 a month is reported but not confirmed for 2026, so no credit is counted.",
    travelPerks:
      "Not a travel card, and a 2.7% foreign transaction fee applies abroad.",
    transferPartners:
      "Rewards are cash back (Reward Dollars) only; no Membership Rewards transfers.",
    recommendedUserTypes: [
      "No-fee households with steady grocery, gas, and online shopping",
      "People who want category cash back without an annual fee",
      "Households pairing it with a 2% card for everything else",
    ],
    skipIf: [
      "You spend more than about $3,200 a year at U.S. supermarkets: Blue Cash Preferred earns more after its fee",
      "Your spending is spread evenly across many categories: a flat 2% card is simpler and earns about the same",
      "You shop mostly at warehouse clubs or superstores",
    ],
    marketingOverstates: [
      "\"3% back\" is capped at $6,000 per category per year, and only 1% applies on everything else.",
      "Superstores and warehouse clubs are excluded from the supermarket category.",
    ],
    alternatives: [
      { slug: "blue-cash-preferred", reason: "Earns twice the supermarket rate for $95 a year; it wins above roughly $3,170 of supermarket spend." },
      { slug: "citi-double-cash", reason: "A flat 2% on everything if your spending is not concentrated in these three categories." },
      { slug: "wells-fargo-active-cash", reason: "Flat 2% with cell phone protection." },
    ],
    relatedArticleSlugs: [
      "best-grocery-credit-card-high-spend-households-2026",
      "best-no-annual-fee-credit-card-2026",
      "best-credit-card-for-online-shopping-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$0 annual fee; 3% U.S. supermarkets, U.S. gas, and U.S. online retail, each capped at $6,000 a year; 1% other." },
        { status: "unverified", note: "A Disney streaming credit of up to $7 a month is reported by a single April 2026 source; it is excluded from the math until confirmed." },
        { status: "unverified", note: "The welcome offer varies by listing and is not used in this profile." },
      ],
    },
    scores: { rewardsValue: 6, feeJustification: 10, travelUtility: 1, everydayUse: 7, beginnerFriendliness: 8 },
    valueModel: {
      currency: "cash",
      spend: [
        { category: "U.S. supermarkets", annualSpend: 6000, earnRate: 3 },
        { category: "U.S. gas stations", annualSpend: 2000, earnRate: 3 },
        { category: "U.S. online retail", annualSpend: 4000, earnRate: 3 },
        { category: "Everything else", annualSpend: 12000, earnRate: 1 },
      ],
      credits: [],
    },
  },
  {
    slug: "chase-freedom-unlimited",
    cardName: "Chase Freedom Unlimited",
    issuer: "Chase",
    annualFee: 0,
    scoringCategory: "cashback",
    headline: "1.5% base, 3% dining and drugstores, 5% on Chase Travel",
    bestFor: "Chase Sapphire or Ink cardholders who want a no-fee card to pool Ultimate Rewards points",
    rewardsSummary:
      "Earns 5% on travel booked through Chase Travel, 3% on dining and drugstores, and 1.5% on everything else. Standalone at 1¢ per point it trails a flat 2% card on typical spending; paired with a Sapphire or Ink Business Preferred card, its points become transferable and the math flips.",
    earnRates: [
      "5% on travel purchased through Chase Travel",
      "3% on dining, including takeout and eligible delivery, and at drugstores",
      "1.5% on all other purchases",
    ],
    creditsSummary:
      "No annual statement credits. Value comes from earning categories and from pooling points with a premium Chase card.",
    travelPerks:
      "Basic travel and purchase protections only, and a 3% foreign transaction fee abroad.",
    transferPartners:
      "On its own, points redeem as cash back at 1¢. Combined with Chase Sapphire Preferred, Sapphire Reserve, or Ink Business Preferred, they transfer to Chase's airline and hotel partners.",
    recommendedUserTypes: [
      "Sapphire or Ink Business Preferred cardholders pooling points",
      "Households with heavy dining and drugstore spending",
      "People building a two-card Chase setup",
    ],
    skipIf: [
      "You will never hold a Sapphire or Ink Preferred card: a 2% card earns more standalone",
      "You spend often abroad (3% foreign transaction fee); Freedom Flex no longer charges one",
      "Most of your spending is outside dining and drugstores",
    ],
    marketingOverstates: [
      "\"Unlimited\" 1.5% is below the 2% flat-rate cards on general spending.",
      "Transferable-point value requires holding a second, annual-fee Chase card.",
      "The 5% rate only applies to travel booked through Chase's own portal.",
    ],
    alternatives: [
      { slug: "citi-double-cash", reason: "Flat 2% beats it standalone if you will not pool points." },
      { slug: "chase-sapphire-preferred", reason: "The $95 card that turns Freedom Unlimited points into transferable points." },
      { slug: "chase-freedom-flex", reason: "Adds 5% rotating categories (first $1,500 a quarter) in exchange for more tracking." },
    ],
    relatedArticleSlugs: [
      "best-2-card-credit-card-setup-2026",
      "best-no-annual-fee-credit-card-2026",
      "best-credit-card-for-travel-points-beginners-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$0 annual fee; 5% Chase Travel, 3% dining and drugstores, 1.5% other; 3% foreign transaction fee." },
        { status: "unverified", note: "The welcome offer varies by listing ($200–$300) and is not used in this profile." },
      ],
    },
    scores: { rewardsValue: 6, feeJustification: 10, travelUtility: 3, everydayUse: 8, beginnerFriendliness: 9 },
    valueModel: {
      currency: "cash",
      spend: [
        { category: "Dining", annualSpend: 4000, earnRate: 3 },
        { category: "Drugstores", annualSpend: 600, earnRate: 3 },
        { category: "Everything else", annualSpend: 19400, earnRate: 1.5 },
      ],
      credits: [],
      alternateValuation: {
        currency: "chaseUltimateRewards",
        scenario: "pool points with a Sapphire or Ink Business Preferred card and transfer them",
      },
    },
  },
  {
    slug: "chase-freedom-flex",
    cardName: "Chase Freedom Flex",
    issuer: "Chase",
    annualFee: 0,
    scoringCategory: "cashback",
    headline: "5% rotating categories, 3% dining and drugstores",
    bestFor: "Organized households that will activate rotating 5% categories every quarter",
    rewardsSummary:
      "Earns 5% on up to $1,500 a quarter in rotating categories you activate, 5% on Chase Travel, 3% on dining and drugstores, and 1% elsewhere. The rotating categories carry the card: miss activation or spend outside them and it trails a flat 2% card.",
    earnRates: [
      "5% on up to $1,500 a quarter in rotating categories (activation required), then 1%",
      "5% on travel purchased through Chase Travel",
      "3% on dining and at drugstores",
      "1% on all other purchases",
    ],
    creditsSummary:
      "No annual statement credits. Cell phone protection was discontinued in September 2026, removing the card's main non-reward benefit.",
    travelPerks:
      "Basic travel and purchase protections, and no foreign transaction fee since September 2026, which makes it the rare $0 Chase card that works abroad.",
    transferPartners:
      "On its own, points redeem as cash back at 1¢. Combined with a Sapphire or Ink Business Preferred card, they become transferable.",
    recommendedUserTypes: [
      "People who reliably activate and track quarterly categories",
      "Chase households pooling points with a Sapphire or Ink Preferred card",
      "Households whose spending often matches the quarter's 5% category",
    ],
    skipIf: [
      "You will forget to activate the rotating categories",
      "You want a set-and-forget card: a flat 2% card earns about the same with no tracking",
      "You relied on its cell phone protection, which has ended",
    ],
    marketingOverstates: [
      "\"5% back\" applies only to $1,500 a quarter, only in that quarter's categories, and only after activation.",
      "Most spending earns 1%, half of what a flat 2% card pays.",
    ],
    alternatives: [
      { slug: "chase-freedom-unlimited", reason: "No activation: 1.5% base and 3% dining and drugstores." },
      { slug: "citi-double-cash", reason: "Flat 2% with zero tracking." },
      { slug: "blue-cash-everyday", reason: "Fixed 3% categories (supermarkets, gas, online retail) instead of rotating ones." },
    ],
    relatedArticleSlugs: [
      "best-credit-card-for-gas-2026",
      "best-credit-card-for-online-shopping-2026",
      "best-no-annual-fee-credit-card-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "changed", note: "Cell phone protection ended September 20, 2026 (losses through September 19, 2026 remain covered), per card-news reports." },
        { status: "changed", note: "The 3% foreign transaction fee was removed in September 2026, per multiple card-news reports." },
        { status: "unverified", note: "Q4 2026 rotating categories are not confirmed; the value math assumes you capture 60% of the $6,000 annual 5% cap." },
      ],
    },
    scores: { rewardsValue: 7, feeJustification: 10, travelUtility: 4, everydayUse: 6, beginnerFriendliness: 6 },
    valueModel: {
      currency: "cash",
      spend: [
        { category: "Rotating 5% categories", annualSpend: 3600, earnRate: 5 },
        { category: "Dining", annualSpend: 4000, earnRate: 3 },
        { category: "Drugstores", annualSpend: 600, earnRate: 3 },
        { category: "Everything else", annualSpend: 15800, earnRate: 1 },
      ],
      credits: [],
      alternateValuation: {
        currency: "chaseUltimateRewards",
        scenario: "pool points with a Sapphire or Ink Business Preferred card and transfer them",
      },
    },
  },
  {
    slug: "ink-business-cash",
    cardName: "Chase Ink Business Cash",
    issuer: "Chase",
    annualFee: 0,
    scoringCategory: "business",
    headline: "5% on office supply and internet/phone",
    bestFor: "Small businesses with steady office supply, internet, and phone bills that want $0 fees",
    rewardsSummary:
      "Earns 5% on the first $25,000 a year of combined office supply store and internet/cable/phone purchases, 2% on the first $25,000 at gas stations and restaurants, and 1% elsewhere. At our spending mix it ties a 2% card in cash; paired with Ink Business Preferred or a Sapphire card, its points become transferable.",
    earnRates: [
      "5% on the first $25,000 a year in combined office supply store and internet, cable, and phone purchases",
      "2% on the first $25,000 a year in combined gas station and restaurant purchases",
      "1% on all other purchases",
    ],
    creditsSummary:
      "No annual statement credits. A 0% intro APR on purchases is offered; terms vary.",
    travelPerks:
      "Not a travel card: a 3% foreign transaction fee applies abroad.",
    transferPartners:
      "Rewards are Ultimate Rewards points redeemable at 1¢; pooling with Ink Business Preferred or a Sapphire card unlocks transfers.",
    recommendedUserTypes: [
      "LLCs with recurring internet, phone, and office supply spending",
      "Business owners who want a $0-fee card alongside Ink Business Preferred",
      "Businesses buying gift cards or supplies at office supply stores",
    ],
    skipIf: [
      "Your business spending is mostly outside office supply, telecom, gas, and restaurants",
      "You spend abroad (3% foreign transaction fee)",
      "You want one card for everything: a 2% card is simpler",
    ],
    marketingOverstates: [
      "Both bonus tiers are capped at $25,000 a year; above that, spending earns 1%.",
      "Transferable-point value requires holding an annual-fee Chase card as well.",
    ],
    alternatives: [
      { slug: "ink-business-preferred", reason: "3x transferable points on travel, shipping, ads, and telecom for $95." },
      { slug: "citi-double-cash", reason: "Flat 2% when business spending does not fit the bonus categories." },
      { slug: "chase-freedom-unlimited", reason: "The personal no-fee Chase card for pooling points." },
    ],
    relatedArticleSlugs: [
      "best-business-credit-card-for-llc-owner-2026",
      "best-credit-card-for-business-owners-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "verified", note: "$0 annual fee; 5% and 2% tiers, each capped at $25,000 a year; 1% other." },
        { status: "unverified", note: "The welcome offer varies by listing ($750–$1,000) and is not used in this profile." },
      ],
    },
    scores: { rewardsValue: 8, feeJustification: 10, travelUtility: 1, everydayUse: 6, beginnerFriendliness: 7 },
    valueModel: {
      currency: "cash",
      spend: [
        { category: "Office supply, internet, and phone", annualSpend: 6000, earnRate: 5 },
        { category: "Gas and restaurants", annualSpend: 6000, earnRate: 2 },
        { category: "Everything else", annualSpend: 18000, earnRate: 1 },
      ],
      credits: [],
      alternateValuation: {
        currency: "chaseUltimateRewards",
        scenario: "pool points with Ink Business Preferred or a Sapphire card and transfer them",
      },
    },
  },
  {
    slug: "bilt-mastercard",
    cardName: "Bilt Mastercard",
    issuer: "Bilt (new cards issued by Column N.A.)",
    annualFee: 0,
    annualFeeNote: "Original card $0; 2026 lineup $0–$495",
    scoringCategory: "travel",
    headline: "rent rewards card in transition to the 2026 Bilt lineup",
    bestFor: "Renters who want rewards on rent payments without a transaction fee",
    rewardsSummary:
      "The original Bilt Mastercard issued by Wells Fargo stopped accepting applications in October 2025. Bilt relaunched in February 2026 with three cards (Bilt Blue at $0, Bilt Obsidian at $95, and Bilt Palladium at $495), all paying rent and mortgage with no transaction fee. Their everyday earn rates are reported consistently, but the rules for earning points on rent are described differently across sources, so this profile is not scored yet.",
    earnRates: [
      "Bilt Blue ($0): 1x points on everyday spending",
      "Bilt Obsidian ($95): 3x on dining or groceries (your choice; groceries capped at $25,000 a year), 2x on travel, 1x elsewhere",
      "Bilt Palladium ($495): 2x on all non-housing spending",
      "All three: 4% back in Bilt Cash on everyday spending, and rent or mortgage payments through Bilt with no transaction fee",
      "Rent and mortgage points (up to 1.25x) now depend on how much you also spend on the card; sources describe the mechanics differently, so we have not modeled them",
    ],
    creditsSummary:
      "Benefits differ by tier in the 2026 lineup and are being verified; none are counted here.",
    travelPerks:
      "Travel benefits of the 2026 tiers are not yet verified.",
    transferPartners:
      "Bilt Rewards points have historically transferred to airline and hotel partners; confirm current partners and ratios on Bilt's site.",
    recommendedUserTypes: [
      "Renters who want to earn rewards on rent without a payment fee",
      "Existing Bilt members deciding which 2026 card to move to",
    ],
    skipIf: [
      "You do not pay rent or a mortgage through Bilt",
      "You need a fully verified profile before choosing: check back after our re-review",
    ],
    marketingOverstates: [
      "Rent rewards are only fee-free when payments run through Bilt's own system.",
      "Tier comparisons depend on benefits we have not yet verified; do not rely on older reviews of the Wells Fargo card.",
    ],
    alternatives: [
      { slug: "citi-double-cash", reason: "A verified no-fee 2% card for everyday spending while the Bilt lineup is re-reviewed." },
      { slug: "chase-sapphire-preferred", reason: "Verified transferable points for travel-focused households." },
    ],
    relatedArticleSlugs: [
      "best-no-annual-fee-credit-card-2026",
      "best-credit-card-for-travel-points-beginners-2026",
    ],
    reviewedAt: CHECKED_AT,
    factCheck: {
      checkedAt: CHECKED_AT,
      method: CHECK_METHOD,
      flags: [
        { status: "discontinued", note: "The Wells Fargo-issued Bilt Mastercard stopped accepting applications in October 2025." },
        { status: "changed", note: "Bilt Card 2.0 launched February 7, 2026: Bilt Blue ($0), Bilt Obsidian ($95), and Bilt Palladium ($495), issued by Column N.A." },
        { status: "verified", note: "2026 everyday earn rates: Blue 1x; Obsidian 3x dining or groceries and 2x travel; Palladium 2x on everything; 4% Bilt Cash on all three (multiple 2026 reviews)." },
        { status: "unverified", note: "How rent and mortgage payments earn points (spend thresholds vs. unlocking with Bilt Cash) is described inconsistently; the score is withheld until confirmed." },
      ],
    },
    scores: "withheld",
  },
];
