export type TrustPage = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  sections: {
    heading: string;
    body: string[];
  }[];
};

export const trustPages: TrustPage[] = [
  {
    slug: "how-we-review-credit-cards",
    eyebrow: "How We Review",
    title: "How We Review Credit Cards at BestCardsForMe",
    summary:
      "BestCardsForMe by MoneyFactor reviews credit cards through realistic annual value, annual-fee math, practical reward usage, travel-perk utility, and editorial independence.",
    sections: [
      {
        heading: "Our scoring methodology",
        body: [
          "We review credit cards by asking a simple question first: what value can a real household reasonably capture after annual fees, category limits, credit friction, and redemption behavior are considered?",
          "The MoneyFactor scorecard is designed to make that judgment visible. Rewards Value looks at earning rates and realistic point or cash value. Fee Justification asks whether the annual fee can be defended by benefits a reader is likely to use. Travel Utility evaluates lounge access, credits, protections, and travel-specific flexibility. Everyday Use evaluates whether the card is useful outside a narrow travel or merchant scenario. Beginner Friendliness evaluates complexity, tracking burden, and how easy it is to avoid mistakes.",
          "No single score is meant to replace judgment. A card can be excellent for frequent travelers and poor for simple cash-back users. Our scoring exists to explain fit, not to create a universal trophy list.",
        ],
      },
      {
        heading: "How we evaluate annual fees",
        body: [
          "Annual fees are treated as real household costs. We do not excuse a high fee because a card sounds premium or because issuer marketing lists a large theoretical benefit total.",
          "A fee is justified only when the likely captured value exceeds the fee by enough to compensate for friction, complexity, and opportunity cost. A $95 fee can be a bargain when the card earns well on real spending. A $795 or $895 fee can be rational when the household travels often, uses credits naturally, and redeems points intentionally. The same high fee can be a mistake for a household that travels rarely or dislikes tracking credits.",
        ],
      },
      {
        heading: "How we analyze rewards",
        body: [
          "Rewards analysis starts with actual spending categories, not headline multipliers. A 4x grocery card matters only if the household has meaningful grocery spend and the stores qualify. A premium travel card matters only if the household books enough travel for the multiplier and protections to show up in real life.",
          "When points are involved, we use conservative household-realistic valuations instead of aspirational edge-case redemptions. Transferable points can be valuable, but not every reader will redeem them at peak travel-blog values. Cash back is simpler and easier to value, but it may not always maximize net value for engaged travelers.",
        ],
      },
      {
        heading: "How we value travel perks",
        body: [
          "Travel perks are valued only when they match behavior. Lounge access has meaningful value for a frequent traveler who arrives early, flies through airports with accessible lounges, and would otherwise buy food or a quiet workspace. It has little value for someone who flies once a year.",
          "Statement credits are discounted when they require enrollment, portal booking, monthly or quarterly tracking, or spending with a partner the household would not normally use. A credit is not worth face value unless it replaces money the reader would have spent anyway.",
        ],
      },
      {
        heading: "Editorial independence",
        body: [
          "BestCardsForMe may receive compensation from partners, but compensation should not control the recommendation logic or editorial conclusion. A card should rank well because it fits the reader's answers and captures realistic net value, not because it is commercially convenient.",
          "We disclose affiliate potential clearly and keep issuer-term caveats visible. If a non-affiliate card is the better answer for a profile, the review system should be able to say so.",
        ],
      },
      {
        heading: "Offers and terms can change",
        body: [
          "Credit card offers, annual fees, earning categories, statement credits, eligibility rules, and welcome bonuses can change frequently. BestCardsForMe reviews are educational analysis, not financial advice or an approval prediction.",
          "Readers should verify current issuer terms before applying. When our pages discuss public offers, fee levels, or perk structures, the issuer's current terms remain the source of truth.",
        ],
      },
    ],
  },
  {
    slug: "methodology",
    eyebrow: "Our Methodology",
    title: "How BestCardsForMe by MoneyFactor ranks credit cards",
    summary:
      "Our recommendations start with realistic annual value: the rewards, credits, and perks a person is likely to use after accounting for annual fees and lifestyle fit.",
    sections: [
      {
        heading: "We score fit before flash",
        body: [
          "BestCardsForMe by MoneyFactor is built around the idea that the best card is not always the card with the biggest advertised bonus or longest list of benefits. The quiz weighs goal fit, annual fee comfort, spending level, top spending category, travel frequency, lounge preference, reward simplicity, business-card openness, and credit profile.",
          "That means a no-fee cash-back card can beat a premium travel card when the premium benefits are unlikely to be used. It also means a high-fee travel card can rank well when a user's travel behavior gives the credits and perks real economic value.",
          "This is why the system is intentionally opinionated. A travel card should not win only because it has a large benefit list, and a cash-back card should not win only because it has no annual fee. The recommendation has to make sense for the household profile in front of us.",
        ],
      },
      {
        heading: "We estimate net annual value",
        body: [
          "Our card pages use realistic annual value ranges instead of treating every issuer credit as cash. Credits, lounge access, and transfer-point upside are valuable only when they match actual behavior.",
          "Our assumptions are intentionally conservative. We would rather understate a benefit than imply a household should count value it is unlikely to capture.",
          "When a benefit requires tracking, portal booking, brand loyalty, or a specific redemption style, the review language should make that friction visible. A benefit that looks generous in issuer marketing can be worth much less if the user would not naturally use it.",
        ],
      },
      {
        heading: "We show why cards rank lower",
        body: [
          "A trustworthy recommendation engine should explain not only what won, but also why popular cards may not fit. The results page includes cards that are recognizable but less aligned with the user's answers.",
          "That lower-fit explanation is part of the methodology, not a throwaway comparison. It helps users understand why an excellent card for one household may be a poor fit for another.",
        ],
      },
      {
        heading: "What is not included in the score",
        body: [
          "BestCardsForMe does not evaluate every possible issuer rule, eligibility nuance, approval factor, or temporary promotion. It is an educational decision tool, not a credit approval prediction service.",
          "Users should always verify current issuer terms before applying. If a term, credit, or public offer has changed, the issuer's current terms control.",
        ],
      },
    ],
  },
  {
    slug: "editorial-standards",
    eyebrow: "Editorial Standards",
    title: "Consumer-first credit card reviews",
    summary:
      "Our editorial standard is simple: explain the real consumer value, the tradeoffs, and the situations where a card should be avoided.",
    sections: [
      {
        heading: "We write for decision quality",
        body: [
          "BestCardsForMe reviews are part of MoneyFactor's broader consumer decision work: help people make better decisions, not make every card sound attractive. We highlight annual fees, friction, credit tracking, portal restrictions, category limits, and the risk of overvaluing benefits.",
          "Every review includes positive use cases and honest drawbacks. If a card only works for a narrow type of user, the page should say that plainly.",
          "The editorial goal is not to make a reader feel excited about every card. The goal is to help the reader understand whether a card's economics are likely to hold up after the annual fee, behavior requirements, and redemption friction are considered.",
        ],
      },
      {
        heading: "We separate editorial logic from issuer marketing",
        body: [
          "Issuer marketing often emphasizes headline benefits, limited-time offers, or aspirational travel value. Our reviews emphasize net consumer value: what a realistic user might actually keep after fees and practical usage limits.",
          "We do not present credit cards as status objects. A premium card should earn its place through math, not prestige.",
          "When a card's value depends on lifestyle credits, hotel certificates, airport lounge access, or transfer partners, our copy should describe the conditions under which those benefits are useful. Benefits should not be treated as cash unless they behave like cash for the user's real life.",
        ],
      },
      {
        heading: "We keep disclaimers visible",
        body: [
          "Card terms change frequently. BestCardsForMe by MoneyFactor is educational and does not provide financial advice. Users should verify current issuer terms before applying.",
          "We avoid guarantees about approvals, bonus eligibility, or offer availability. Reviews can help organize the decision, but they cannot replace issuer terms or a user's own financial judgment.",
        ],
      },
      {
        heading: "Corrections and updates",
        body: [
          "If a reader notices outdated terms, unclear language, or a factual issue, MoneyFactor wants to know. Credit card economics change often, and maintaining trust requires a practical corrections path.",
          "Corrections and editorial questions can be sent through the contact page. We prioritize issues that affect consumer value, fee math, eligibility understanding, or disclosure clarity.",
        ],
      },
    ],
  },
  {
    slug: "affiliate-disclosure",
    eyebrow: "Affiliate Disclosure",
    title: "How compensation and editorial independence work",
    summary:
      "BestCardsForMe by MoneyFactor may receive compensation from partners, but rankings are designed around fit and realistic annual value, not payout.",
    sections: [
      {
        heading: "Compensation disclosure",
        body: [
          "BestCardsForMe by MoneyFactor may receive compensation when readers interact with certain partner offers or apply through eligible links. Compensation can help support the publication, but it should not determine which cards rank well for a user's profile.",
          "Offer availability, eligibility rules, fees, rewards, and credits can change. Readers should review current issuer terms before applying.",
          "Compensation relationships can affect which offers are available to link from the site, but they should not change the editorial obligation to explain fit, tradeoffs, and realistic consumer value.",
        ],
      },
      {
        heading: "Compensation should not control rankings",
        body: [
          "The recommendation engine is structured to score cards by user answers: fee tolerance, lifestyle fit, travel behavior, spending categories, and credit profile. Commercial relationships should not override that ranking logic.",
          "If a non-affiliate card is the better fit for a user's profile, the product should be able to recommend it.",
          "The rankings are intended to be useful even when the best answer is not the most commercially convenient answer. That independence is central to the MoneyFactor brand promise.",
        ],
      },
      {
        heading: "The user relationship comes first",
        body: [
          "MoneyFactor exists to build trust around money decisions. Short-term monetization is not worth undermining the credibility of the math.",
          "Readers should expect clear disclosure, plain-language caveats, and no pressure to apply before they understand the fee, reward structure, and practical limitations of a card.",
        ],
      },
      {
        heading: "Issuer terms remain the source of truth",
        body: [
          "BestCardsForMe may summarize value ranges, perks, drawbacks, and offer considerations, but issuer terms can change and may include restrictions not captured in a short review.",
          "Before applying, readers should verify the current offer, annual fee, reward categories, credits, eligibility rules, and any limitations directly with the issuer.",
        ],
      },
    ],
  },
  {
    slug: "about",
    eyebrow: "About MoneyFactor",
    title: "The real math behind every money decision",
    summary:
      "MoneyFactor builds decision tools that replace marketing noise with practical math, plain English, and consumer-first tradeoff analysis.",
    sections: [
      {
        heading: "Why BestCardsForMe exists",
        body: [
          "Credit cards are often marketed through bonuses, status signals, and long benefit lists. That can make a card look better than it is for a person's actual life.",
          "BestCardsForMe is MoneyFactor's credit card decision property. It starts with the user's spending pattern and preferences, then estimates which cards are most likely to produce real net value.",
          "The product is built for people who want a serious answer to a practical question: which card is most likely to be worth it for me after the annual fee, credits, habits, and tradeoffs are accounted for?",
        ],
      },
      {
        heading: "What MoneyFactor stands for",
        body: [
          "MoneyFactor's parent promise is The Real Math Behind Every Money Decision. The goal is not to make finance feel complicated. The goal is to make the hidden tradeoffs visible enough that people can act with confidence.",
          "That promise applies especially well to credit cards because issuer marketing can blur the difference between theoretical value and usable value. MoneyFactor's role is to make that difference visible.",
        ],
      },
      {
        heading: "Where this product is going",
        body: [
          "BestCardsForMe is one expression of the broader MoneyFactor platform: decision tools that use realistic annual value, transparent tradeoffs, and recommendations that respect the reader's actual life.",
          "The current product focuses on credit card fit, but the editorial posture is broader: consumer finance decisions should be evaluated through clear assumptions, honest math, and a willingness to say when a popular product is not the right fit.",
        ],
      },
      {
        heading: "How to read our recommendations",
        body: [
          "A recommendation is not a command to apply. It is a structured estimate based on the user's answers and the card data available in the review system.",
          "The strongest recommendation is the one where strategic fit and realistic value align. If either side is weak, the review should explain the weakness directly.",
        ],
      },
    ],
  },
];

export function getTrustPage(slug: string) {
  return trustPages.find((page) => page.slug === slug);
}
