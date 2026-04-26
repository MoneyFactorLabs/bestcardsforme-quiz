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
    slug: "methodology",
    eyebrow: "Our Methodology",
    title: "How BestCardsForMe ranks credit cards",
    summary:
      "Our recommendations start with realistic annual value: the rewards, credits, and perks a person is likely to use after accounting for annual fees and lifestyle fit.",
    sections: [
      {
        heading: "We score fit before flash",
        body: [
          "BestCardsForMe is built around the idea that the best card is not always the card with the biggest advertised bonus or longest list of benefits. The quiz weighs goal fit, annual fee comfort, spending level, top spending category, travel frequency, lounge preference, reward simplicity, business-card openness, and credit profile.",
          "That means a no-fee cash-back card can beat a premium travel card when the premium benefits are unlikely to be used. It also means a high-fee travel card can rank well when a user's travel behavior gives the credits and perks real economic value.",
        ],
      },
      {
        heading: "We estimate net annual value",
        body: [
          "Our card pages use realistic annual value ranges instead of treating every issuer credit as cash. Credits, lounge access, and transfer-point upside are valuable only when they match actual behavior.",
          "Our assumptions are intentionally conservative. We would rather understate a benefit than imply a household should count value it is unlikely to capture.",
        ],
      },
      {
        heading: "We show why cards rank lower",
        body: [
          "A trustworthy recommendation engine should explain not only what won, but also why popular cards may not fit. The results page includes cards that are recognizable but less aligned with the user's answers.",
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
          "BestCardsForMe reviews are designed to help people make better decisions, not to make every card sound attractive. We highlight annual fees, friction, credit tracking, portal restrictions, category limits, and the risk of overvaluing benefits.",
          "Every review includes positive use cases and honest drawbacks. If a card only works for a narrow type of user, the page should say that plainly.",
        ],
      },
      {
        heading: "We separate editorial logic from issuer marketing",
        body: [
          "Issuer marketing often emphasizes headline benefits, limited-time offers, or aspirational travel value. Our reviews emphasize net consumer value: what a realistic user might actually keep after fees and practical usage limits.",
          "We do not present credit cards as status objects. A premium card should earn its place through math, not prestige.",
        ],
      },
      {
        heading: "We keep disclaimers visible",
        body: [
          "Card terms change frequently. BestCardsForMe is educational and does not provide financial advice. Users should verify current issuer terms before applying.",
        ],
      },
    ],
  },
  {
    slug: "affiliate-disclosure",
    eyebrow: "Affiliate Disclosure",
    title: "How compensation and editorial independence work",
    summary:
      "BestCardsForMe may receive compensation from partners, but rankings are designed around fit and realistic annual value, not payout.",
    sections: [
      {
        heading: "Compensation disclosure",
        body: [
          "BestCardsForMe may receive compensation when readers interact with certain partner offers or apply through eligible links. Compensation can help support the publication, but it should not determine which cards rank well for a user's profile.",
          "Offer availability, eligibility rules, fees, rewards, and credits can change. Readers should review current issuer terms before applying.",
        ],
      },
      {
        heading: "Compensation should not control rankings",
        body: [
          "The recommendation engine is structured to score cards by user answers: fee tolerance, lifestyle fit, travel behavior, spending categories, and credit profile. Commercial relationships should not override that ranking logic.",
          "If a non-affiliate card is the better fit for a user's profile, the product should be able to recommend it.",
        ],
      },
      {
        heading: "The user relationship comes first",
        body: [
          "MoneyFactor exists to build trust around money decisions. Short-term monetization is not worth undermining the credibility of the math.",
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
          "BestCardsForMe starts with the user's spending pattern and preferences, then estimates which cards are most likely to produce real net value.",
        ],
      },
      {
        heading: "What MoneyFactor stands for",
        body: [
          "MoneyFactor's parent promise is The Real Math Behind Every Money Decision. The goal is not to make finance feel complicated. The goal is to make the hidden tradeoffs visible enough that people can act with confidence.",
        ],
      },
      {
        heading: "Where this product is going",
        body: [
          "BestCardsForMe is designed to grow into a deeper consumer finance publisher while preserving the same honest-math foundation: realistic annual value, transparent tradeoffs, and recommendations that respect the reader's actual life.",
        ],
      },
    ],
  },
];

export function getTrustPage(slug: string) {
  return trustPages.find((page) => page.slug === slug);
}
