export type TrustPageBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "bullets";
      items: string[];
    }
  | {
      type: "subheading";
      heading: string;
    };

export type TrustPage = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  sections: {
    heading: string;
    body?: string[];
    blocks?: TrustPageBlock[];
  }[];
};

export const trustPages: TrustPage[] = [
  {
    "slug": "about",
    "title": "About BestCardsForMe",
    "eyebrow": "About BestCardsForMe",
    "summary": "BestCardsForMe is the credit card decision property of MoneyFactor — an independent consumer finance publisher building decision tools for households making expensive financial decisions. We help people figure out which credit card actually fits their...",
    "sections": [
      {
        "heading": "What this site is",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe is the credit card decision property of MoneyFactor — an independent consumer finance publisher building decision tools for households making expensive financial decisions. We help people figure out which credit card actually fits their spending, fees, and travel pattern, using realistic captured-value math instead of issuer marketing."
          },
          {
            "type": "paragraph",
            "text": "The site is built around a single principle: the best credit card for a household is the one whose realistic Year-2 value clears the annual fee, given how the household actually spends money — not how the issuer's marketing assumes they will."
          }
        ]
      },
      {
        "heading": "Who we serve",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We write for affluent U.S. households evaluating premium and mid-tier credit cards. Our typical reader earns $250,000 or more in household income, holds at least one premium-tier card today, and is making decisions in the $95 to $895 annual fee range — the cards where realistic value math matters most and where issuer marketing tends to overstate captured value most aggressively."
          },
          {
            "type": "paragraph",
            "text": "We are not a card issuer, a financial advisor, or a registered investment professional. We are an independent publication that reviews credit card products against a consistent editorial methodology and recommends cards that fit specific household profiles."
          }
        ]
      },
      {
        "heading": "Why this site exists",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Most credit card content online does one of two things: it summarizes issuer marketing without applying realistic discounts, or it uses aspirational point valuations that few households actually capture in practice. Both approaches produce recommendations that look better on paper than they perform in real life."
          },
          {
            "type": "paragraph",
            "text": "BestCardsForMe takes a different position. We discount unused credits, friction-heavy benefits, and partner-locked redemptions to a realistic captured-value floor. We use conservative point valuations that reflect what households actually redeem — not what's theoretically possible. And we publish the methodology behind every recommendation so readers can audit our math."
          },
          {
            "type": "paragraph",
            "text": "The result is a site whose recommendations sometimes run counter to industry consensus. We will recommend a $95 card over a $795 card when the household profile justifies it. We will recommend downgrading instead of upgrading. We will tell readers when the right answer is to keep what they have rather than apply for anything new. That editorial independence is the entire point of the site."
          }
        ]
      },
      {
        "heading": "Who runs this",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Tim is the founder and editor of BestCardsForMe. The site uses conservative rewards math, realistic benefit capture, and transparent tradeoffs to evaluate credit cards."
          },
          {
            "type": "paragraph",
            "text": "The site reflects more than fifteen years of personal optimization across credit card portfolios, points, miles, and travel rewards, with reviews and recommendations applied through a consistent editorial methodology, not the views of any issuer or affiliate network."
          },
          {
            "type": "paragraph",
            "text": "We have no staff editorial board. We do not accept guest contributors. Every article published on the site is written and reviewed by a single editor working from a documented methodology, which makes our voice consistent and our positions auditable."
          }
        ]
      },
      {
        "heading": "What we cover",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Today, the site covers credit card decisions exclusively. Within that vertical, we cover:"
          },
          {
            "type": "bullets",
            "items": [
              "Premium travel cards ($395–$895 annual fee tier)",
              "Mid-tier travel cards (typically $95)",
              "Cash-back and category cards",
              "Co-branded hotel and airline cards",
              "Business credit cards for LLC owners and small business operators",
              "Card stack and wallet optimization for households holding multiple cards"
            ]
          },
          {
            "type": "paragraph",
            "text": "We deliberately do not cover sub-prime or credit-rebuilding products, students cards, or cards primarily used for balance transfers. These categories don't match our reader profile and we don't have anything useful to add."
          }
        ]
      },
      {
        "heading": "What MoneyFactor is",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe is the first published vertical of MoneyFactor — a broader consumer finance decision platform. MoneyFactor's stated promise is \"the real math behind every money decision.\" Future MoneyFactor verticals will cover other expensive household financial commitments where realistic value math is missing from existing comparison content."
          },
          {
            "type": "paragraph",
            "text": "For now, BestCardsForMe is the active surface. The MoneyFactor parent brand is a working banner that signals editorial methodology continuity across whatever verticals come next."
          }
        ]
      },
      {
        "heading": "Editorial independence",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Our recommendations are not for sale. We do not accept payment to recommend a specific card, alter a ranking, or remove a critical review. We do receive compensation through affiliate relationships when readers apply for cards through our links — see our [Affiliate Disclosure](/affiliate-disclosure) for the full framework. That compensation supports the publication; it does not determine which cards we recommend."
          },
          {
            "type": "paragraph",
            "text": "We will not make a recommendation we don't believe is correct. When two cards are roughly equivalent for a profile and one carries a stronger affiliate relationship, we say so transparently. When a card we'd otherwise recommend has a structural problem (a recently devalued benefit, a partner exclusion that affects target households), we name it."
          }
        ]
      },
      {
        "heading": "How to reach us",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Editorial questions, methodology feedback, corrections, and partnership inquiries should be sent to **tim@moneyfactor.io**. We respond to substantive correspondence within five to ten business days."
          },
          {
            "type": "paragraph",
            "text": "For pitches involving sponsored content, paid placements, or compensation in exchange for editorial favor: we don't accept these. Please don't ask."
          }
        ]
      },
      {
        "heading": "Our limits",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We are not financial advisors. We do not provide personalized financial advice. The articles on this site are general informational content reflecting one editorial methodology applied consistently across credit card products. For decisions specific to your tax situation, credit profile, or financial goals, consult a qualified professional."
          },
          {
            "type": "paragraph",
            "text": "Card terms change without notice. Annual fees, credits, earning rates, and elite status benefits described in our reviews reflect publicly available information at publication. Always verify current terms directly with the issuer before applying."
          },
          {
            "type": "paragraph",
            "text": "*BestCardsForMe is the credit-card vertical of [MoneyFactor](https://moneyfactor.io). See also our [Methodology](/methodology), [Editorial Standards](/editorial-standards), [Affiliate Disclosure](/affiliate-disclosure), and [Contact](/contact) pages.*"
          }
        ]
      }
    ]
  },
  {
    "slug": "methodology",
    "title": "How We Review Credit Cards — Editorial Methodology",
    "eyebrow": "Editorial Methodology",
    "summary": "This page documents how BestCardsForMe evaluates credit card products and produces recommendations. The methodology is applied consistently across every card review, comparison piece, and quiz recommendation on the site. Readers and affiliate-network...",
    "sections": [
      {
        "heading": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This page documents how BestCardsForMe evaluates credit card products and produces recommendations. The methodology is applied consistently across every card review, comparison piece, and quiz recommendation on the site. Readers and affiliate-network reviewers should be able to audit any recommendation we publish against the framework below."
          }
        ]
      },
      {
        "heading": "The core question we answer",
        "blocks": [
          {
            "type": "paragraph",
            "text": "For every card we cover, we answer one question: **does the realistic Year-2 captured value of this card, for a specific household profile, clear the annual fee?**"
          },
          {
            "type": "paragraph",
            "text": "Year-2 economics — not Year-1 — are the durable comparison. Welcome bonuses change quarterly and reward only the first year. Year 2 is the year that repeats annually for as long as a household holds the card, and it's the math that determines whether a card is worth keeping."
          },
          {
            "type": "paragraph",
            "text": "We compute realistic captured value, not issuer-stated benefit value. The two figures are typically meaningfully different."
          }
        ]
      },
      {
        "heading": "The MoneyFactor Fit Score",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Every card review and quiz recommendation on the site produces a MoneyFactor Fit Score from 0 to 100. The score reflects how well a card matches a specific household profile across four dimensions:"
          },
          {
            "type": "paragraph",
            "text": "1. **Realistic Year-2 captured value** — what the household actually captures, in dollars, after applying the discounts described below 2. **Profile fit** — whether the card matches the household's spending pattern, fee tolerance, and travel volume 3. **Friction** — how much calendar tracking and engagement the card demands 4. **Issuer reliability** — track record of program changes, devaluations, and customer experience"
          },
          {
            "type": "paragraph",
            "text": "A score above 90 indicates a strong recommendation for the specific profile. Scores between 70 and 89 indicate a card worth considering but with caveats. Scores below 70 indicate the card is not the right fit for that profile, even if it might be the right fit for someone else."
          }
        ]
      },
      {
        "heading": "The four discounts we apply to issuer-stated value",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Every premium credit card markets a \"total annual benefit value\" calculated by summing every credit and perk at full face value. That number is the ceiling under perfect utilization. We compute the floor — what households realistically capture in practice."
          },
          {
            "type": "paragraph",
            "text": "**Discount 1: Unused-credit discount.** Statement credits that lock to specific partners (Equinox, Walmart+, Saks, Uber, etc.) only count to the extent the household would have made those purchases anyway. A $300 Equinox credit captures near zero for a non-member. We typically capture 50–75% of stated lifestyle-credit value for high-engagement cardholders, and 25–40% for moderate-engagement households."
          },
          {
            "type": "paragraph",
            "text": "**Discount 2: Friction discount.** Credits that require enrollment, monthly resets, or specific app workflows have a real cost — your time and attention. Households that won't track them lose 30–50% of the stated lifestyle-credit value to forgotten resets and missed enrollments. We treat lost value as zero, because that's what it is."
          },
          {
            "type": "paragraph",
            "text": "**Discount 3: Portal-bound discount.** Credits and earning rates that route through a specific issuer travel portal (Chase Travel, Capital One Travel, Amex Travel) are real, but they're worth less than the same dollars in cash. Portal pricing isn't always competitive with direct booking, and inventory is constrained. We typically discount portal-bound value by 10–20%."
          },
          {
            "type": "paragraph",
            "text": "**Discount 4: Conservative point valuation.** We value transferable points at realistic captured rates, not aspirational rates. The valuations we use across major programs:"
          },
          {
            "type": "paragraph",
            "text": "| Program | BCFM valuation | Notes | |---|---|---| | Chase Ultimate Rewards | 1.6¢ per point | Strong network including Hyatt, United | | American Express Membership Rewards | 1.7¢ per point | Deepest international airline transfer network | | Citi ThankYou Points | 1.5¢ per point | Smaller but useful partner network | | Capital One miles | 1.4¢ per mile | No Hyatt or United relationships | | Hilton Honors | 0.5¢ per point | Reflects program devaluations | | Marriott Bonvoy | 0.7¢ per point | Reflects program changes |"
          },
          {
            "type": "paragraph",
            "text": "These valuations reflect what an engaged-but-not-obsessive cardholder realistically captures across mixed redemption patterns. Aspirational redemptions can yield higher; statement-credit redemptions yield lower. We use the middle."
          }
        ]
      },
      {
        "heading": "The six profile taxonomy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Recommendations are calibrated to one of six household profiles. The MoneyFactor quiz routes readers to the profile that fits their answers:"
          },
          {
            "type": "paragraph",
            "text": "1. **No-Fee Optimizer** — wants strong rewards without an annual fee 2. **Premium Traveler** — values lounge access, travel credits, premium hotel benefits 3. **Affluent Cashback** — high household income, prefers simple cash back over points 4. **Points Maximizer** — actively transfers points to partners, optimizes redemptions strategically 5. **Status & Convenience** — values elite status, flexibility, and frictionless travel 6. **Spend-First Pragmatist** — wants the card whose math works given their actual spending pattern"
          },
          {
            "type": "paragraph",
            "text": "Different profiles get different recommendations from the same card data. A Premium Traveler may receive Chase Sapphire Reserve as a top match while an Affluent Cashback may receive Citi Double Cash for the same household income — because the right answer depends on how the household uses cards, not on income alone."
          }
        ]
      },
      {
        "heading": "What we factor in beyond raw value math",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Several non-numerical factors shape recommendations:"
          },
          {
            "type": "bullets",
            "items": [
              "**Calendar burden.** Cards with heavy lifestyle credit stacks demand engagement. We surface this as a feature, not bury it.",
              "**Redemption complexity.** A card whose value depends on transferring points to obscure partners scores lower than a card whose value comes from straightforward earning.",
              "**Service quality and program reliability.** Issuers with frequent unilateral devaluations or weak customer service lose ground in the score.",
              "**Compliance friction.** Cards with usage restrictions that disproportionately bind the target reader (e.g., merchant exclusions, geographic limits) lose points."
            ]
          }
        ]
      },
      {
        "heading": "What we don't claim",
        "blocks": [
          {
            "type": "bullets",
            "items": [
              "We don't claim our methodology is the only correct approach. Other publishers use different valuations and reach different conclusions. We document ours so readers can compare.",
              "We don't claim our point valuations are universally accurate. They reflect realistic captured value for engaged-but-not-obsessive households, which is our reader profile. Aspirational redeemers will capture more; casual redeemers less.",
              "We don't claim recommendations are personalized financial advice. They're informational guidance based on a consistent framework applied to product data."
            ]
          }
        ]
      },
      {
        "heading": "How recommendations differ from issuer marketing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Issuer marketing summarizes a card's strongest case. Our reviews surface the card's structural trade-offs — including the cases where the card is the wrong choice. Every review on the site includes a \"Who should skip this card\" section explicitly identifying profiles for whom the card doesn't pencil. We do this because it's editorially honest and because telling readers when a card isn't right for them builds the trust required to be useful when a card *is* right."
          },
          {
            "type": "paragraph",
            "text": "A reader who finds our \"Who should skip\" sections useful is more likely to trust our \"Who should get\" recommendations."
          }
        ]
      },
      {
        "heading": "Updates and corrections",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Card terms change frequently. When an issuer raises an annual fee, devalues a credit, or changes earning structure, we update affected articles. We aim to update materially affected reviews within thirty days of a known change. When the change is significant enough to flip a recommendation (e.g., a fee hike that pushes net captured value below the fee for a target profile), we tag the article and surface the revision."
          },
          {
            "type": "paragraph",
            "text": "We publish dated correction notes on articles where a factual error has been corrected. See our [Editorial Standards](/editorial-standards) page for the full corrections policy."
          }
        ]
      },
      {
        "heading": "Disagreement is welcome",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We expect informed readers will sometimes disagree with our methodology. The most common disagreements: our point valuations are too conservative compared to The Points Guy or aspirational sources; our friction discounts are too aggressive; our recommendation logic is too cautious about premium upgrades."
          },
          {
            "type": "paragraph",
            "text": "These critiques are fair. The methodology is one defensible framework, not the only one. If you reach different conclusions using a different framework, your math may be right for you. We document ours to make our reasoning auditable, not to claim it's the universal correct answer."
          },
          {
            "type": "paragraph",
            "text": "To send substantive methodology feedback or critique, email **tim@moneyfactor.io**. We read it."
          },
          {
            "type": "paragraph",
            "text": "*See also our [About](/about) page, [Editorial Standards](/editorial-standards), and [Affiliate Disclosure](/affiliate-disclosure).*"
          }
        ]
      }
    ]
  },
  {
    "slug": "affiliate-disclosure",
    "title": "Affiliate Disclosure",
    "eyebrow": "Affiliate Disclosure",
    "summary": "This page documents how BestCardsForMe receives compensation, how that compensation interacts with our editorial decisions, and what readers should know before clicking outbound links to issuer sites. We treat affiliate disclosure as a trust obligation,...",
    "sections": [
      {
        "heading": "What this page is",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This page documents how BestCardsForMe receives compensation, how that compensation interacts with our editorial decisions, and what readers should know before clicking outbound links to issuer sites. We treat affiliate disclosure as a trust obligation, not a compliance afterthought. The framework below is written to be plain-English and honest, not to obscure how the business model works."
          }
        ]
      },
      {
        "heading": "How we make money",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe by MoneyFactor may receive compensation from credit card issuers and affiliate networks when readers apply for cards through our links and are subsequently approved. This compensation may take several forms:"
          },
          {
            "type": "bullets",
            "items": [
              "A flat fee per approved application",
              "A percentage of activity associated with the new account",
              "A click-through bounty for outbound traffic"
            ]
          },
          {
            "type": "paragraph",
            "text": "The specific compensation amount varies by card, by issuer, and by network. We do not disclose per-card compensation amounts because (a) the amounts are governed by confidentiality terms in our network agreements, and (b) the specific dollar figure is less informative for readers than understanding the editorial firewall described below."
          },
          {
            "type": "paragraph",
            "text": "When we are not yet approved with the affiliate network associated with a particular card, we link directly to the issuer's public marketing page without compensation. Outbound links labeled `/go/[card-slug]` route readers to the appropriate destination, which may or may not include a tracking parameter depending on our current network status with that issuer."
          }
        ]
      },
      {
        "heading": "What compensation does not influence",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Our editorial recommendations are not for sale. Specifically, compensation does not influence:"
          },
          {
            "type": "bullets",
            "items": [
              "**Which cards we cover.** We choose cards to review based on relevance to our reader profile (affluent U.S. households evaluating premium and mid-tier credit cards), not based on which cards generate the highest commissions.",
              "**How we rank cards.** Rankings reflect the realistic captured-value math described in our [Methodology](/methodology), applied to the household profile in question.",
              "**What we say about a card's strengths or weaknesses.** When we identify a card's structural problems — fee hikes that no longer pencil, partner exclusions, devalued credits — we name them whether or not the card is one we earn affiliate compensation on.",
              "**Whether we recommend downgrading or canceling a card.** When the right answer for a household is to downgrade a card we'd otherwise earn affiliate revenue from, we say so. Downgrade recommendations are some of the most-published guidance on the site, despite costing us potential applications."
            ]
          },
          {
            "type": "paragraph",
            "text": "When two cards are roughly equivalent for a profile and one carries stronger affiliate compensation, we say so transparently in the relevant article."
          }
        ]
      },
      {
        "heading": "What compensation may influence",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We are an independent publication operating on affiliate revenue, and we want readers to understand what that economic relationship does and does not affect."
          },
          {
            "type": "paragraph",
            "text": "Compensation may influence:"
          },
          {
            "type": "bullets",
            "items": [
              "**Which cards we prioritize for full-length deep-dive coverage.** We have finite editorial capacity. We allocate it toward cards that are both (a) relevant to our readers and (b) part of programs we have or expect to have affiliate relationships with. We don't write detailed reviews of cards we have no commercial path to recommend.",
              "**Which specific calls to action we surface.** When we recommend applying for a card, we route the outbound click through our affiliate link if one exists, and through a direct issuer link if one doesn't. The recommendation precedes the link choice, not the other way around."
            ]
          },
          {
            "type": "paragraph",
            "text": "These are the limits of how compensation interacts with our editorial choices. They are normal for an independent affiliate-supported publication. We surface them so readers can decide what weight to give them."
          }
        ]
      },
      {
        "heading": "Networks we may work with",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe may participate in affiliate programs operated by major credit card affiliate networks and direct issuer programs. The specific networks active at any given time may shift as we add or close partnerships. We deliberately do not list specific network names on this page because the roster changes and a static list would mislead readers about our current relationships."
          },
          {
            "type": "paragraph",
            "text": "If you are an affiliate network, issuer affiliate manager, or partnership team member evaluating BCFM as a publisher partner, see the [Contact](/contact) page for inquiry details."
          }
        ]
      },
      {
        "heading": "Editorial firewall",
        "blocks": [
          {
            "type": "paragraph",
            "text": "The site's editorial decisions are made independently of affiliate negotiations. The same person who writes the reviews (the founder and editor of BestCardsForMe) is the same person who corresponds with affiliate networks and issuer partnership teams. We don't pretend the firewall is between two separate departments. It's a self-imposed editorial discipline, codified in our [Methodology](/methodology) and [Editorial Standards](/editorial-standards)."
          },
          {
            "type": "paragraph",
            "text": "What that discipline means in practice:"
          },
          {
            "type": "bullets",
            "items": [
              "Methodology decisions (point valuations, friction discounts, profile fit logic) are made before any affiliate consideration applies and are documented publicly.",
              "Recommendations are produced by applying the methodology to product data, not by selecting cards we earn from and reasoning backward.",
              "When a card we earn from has a structural problem we'd otherwise call out — we call it out.",
              "When a network or issuer asks us to remove or soften a critical review, we decline."
            ]
          },
          {
            "type": "paragraph",
            "text": "If we ever find ourselves in a position where commercial pressure has materially affected an editorial decision, we will retract or revise the affected content and publish a correction note. We expect this to be rare; we surface the policy because it should exist whether or not the situation arises."
          }
        ]
      },
      {
        "heading": "What this means for you as a reader",
        "blocks": [
          {
            "type": "paragraph",
            "text": "When you click an affiliate link on our site, no additional cost accrues to you. Issuer terms — annual fees, APRs, credits, earning rates — are identical whether you click through us, click through another publisher, or apply directly on the issuer's site. The compensation flows from issuer to network to publisher; the reader pays the issuer's published terms either way."
          },
          {
            "type": "paragraph",
            "text": "What you should always do, regardless of where you click from:"
          },
          {
            "type": "bullets",
            "items": [
              "Verify current terms on the issuer's site before applying. Card details described in our reviews reflect publicly available information at publication, but issuers can change terms without notice.",
              "Read the cardholder agreement before accepting a card. The marketing page is not the legal terms.",
              "Confirm eligibility (income requirements, credit profile, residency) before submitting an application."
            ]
          }
        ]
      },
      {
        "heading": "FTC compliance",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe complies with U.S. Federal Trade Commission guidelines for affiliate disclosures, including the FTC's Endorsement Guides and the CARD Act where applicable to credit card content. Our compensation relationships are disclosed at the top of every page that contains affiliate links via a site-wide compensation banner, and again in detail on this page."
          },
          {
            "type": "paragraph",
            "text": "If you believe a specific page on the site has inadequate disclosure, please email **tim@moneyfactor.io** and we will review and correct."
          }
        ]
      },
      {
        "heading": "Changes to this disclosure",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We update this page when our compensation framework changes materially. The most recent revision date is recorded at the bottom of the page. For substantive changes, we publish a brief explanatory note on the BCFM newsletter or homepage so readers are aware."
          }
        ]
      },
      {
        "heading": "Important consumer notice",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe is an independent publication, not a financial advisor. Information on this site is for general informational purposes only and does not constitute personalized financial, tax, or legal advice. Card terms, fees, credits, and earning rates can change without notice — always verify current information directly with the issuer before applying. Approval, credit limits, and APRs depend on the issuer's underwriting and your specific credit profile."
          },
          {
            "type": "paragraph",
            "text": "*See also our [About](/about), [Methodology](/methodology), [Editorial Standards](/editorial-standards), and [Contact](/contact) pages.*"
          },
          {
            "type": "paragraph",
            "text": "*Last updated: April 2026.*"
          }
        ]
      }
    ]
  },
  {
    "slug": "contact",
    "title": "Contact and Editorial Standards",
    "eyebrow": "Contact",
    "summary": "The fastest way to contact BestCardsForMe is email: [tim@moneyfactor.io](mailto:tim@moneyfactor.io)",
    "sections": [
      {
        "heading": "How to reach us",
        "blocks": [
          {
            "type": "paragraph",
            "text": "The fastest way to contact BestCardsForMe is email: [tim@moneyfactor.io](mailto:tim@moneyfactor.io)"
          },
          {
            "type": "paragraph",
            "text": "The founder and editor of BestCardsForMe reads every legitimate inbound message and responds personally where appropriate. We do not have a support team, a chat widget, or an automated ticket system. We are an independent publication and we operate accordingly."
          },
          {
            "type": "paragraph",
            "text": "Use the same email address for: corrections, methodology questions, reader questions about cards, partnership inquiries, and press inquiries. Subject-line tagging helps us prioritize:"
          },
          {
            "type": "bullets",
            "items": [
              "**Subject line \"Correction\":** Factual errors on any page on the site. We aim to respond within five business days. See \"Corrections policy\" below.",
              "**Subject line \"Methodology\":** Questions about how we score cards, value points, or apply discounts. We respond within seven to ten business days.",
              "**Subject line \"Partnership\" or \"Affiliate\":** Network and issuer inbound for affiliate or partnership relationships. We respond within seven business days.",
              "**Subject line \"Press\":** Media inquiries from publishers, journalists, and researchers. We respond within five business days for substantive inquiries.",
              "**No subject tag:** General reader questions. We respond when bandwidth allows, typically within ten business days."
            ]
          },
          {
            "type": "paragraph",
            "text": "If you have not heard back in twice the stated window, your message may have been lost. Resend it; these things happen."
          }
        ]
      },
      {
        "heading": "What we do not respond to",
        "blocks": [
          {
            "type": "paragraph",
            "text": "To save mutual time:"
          },
          {
            "type": "bullets",
            "items": [
              "**Pitches for sponsored content.** We do not run sponsored content under any name (sponsored post, brand collaboration, paid editorial, native advertising). See our [Affiliate Disclosure](/affiliate-disclosure) for the only commercial relationship we maintain with issuers.",
              "**Requests to remove, soften, or alter critical reviews.** We will respond once to confirm receipt and decline. We will not engage in repeat correspondence about the same request.",
              "**Pitches to swap, trade, or buy backlinks.** Same.",
              "**Cold sales pitches** for tools, services, or content production.",
              "**Generic SEO outreach.** We don't accept guest posts, link insertions, or unsolicited content collaborations."
            ]
          }
        ]
      },
      {
        "heading": "Editorial standards",
        "blocks": [
          {
            "type": "paragraph",
            "text": "The following standards apply to every article published on BestCardsForMe. They are codified here so readers, affiliate-network reviewers, and prospective partners can verify our commitments before engaging."
          },
          {
            "type": "subheading",
            "heading": "Independence"
          },
          {
            "type": "paragraph",
            "text": "We do not accept payment to recommend a specific card, alter a ranking, or remove a critical review. Recommendations reflect the application of our [Methodology](/methodology) to product data — not the commercial preferences of any issuer or affiliate network. When a card we'd otherwise recommend has a structural problem, we name the problem."
          },
          {
            "type": "subheading",
            "heading": "Sourcing"
          },
          {
            "type": "paragraph",
            "text": "Card terms, fees, credits, and earning rates cited in articles reflect publicly available information at the time of publication. Where a specific number requires citation (e.g., a fee that recently changed, a benefit that's been added or removed), we link to the issuer's official source where possible. Where claims rely on our editorial methodology (e.g., point valuations, captured-value math), we link to the [Methodology](/methodology) page."
          },
          {
            "type": "paragraph",
            "text": "We do not cite anonymous sources, leaked memos, or unverified industry rumors."
          },
          {
            "type": "subheading",
            "heading": "Accuracy"
          },
          {
            "type": "paragraph",
            "text": "We aim for accuracy on every published claim. When we make a material factual error — including incorrect annual fees, incorrect welcome offer terms, incorrect category multipliers, incorrect rate caps, or any factual claim about an issuer's product that is wrong as published — we correct the page and publish a dated correction note (see \"Corrections policy\" below)."
          },
          {
            "type": "paragraph",
            "text": "Typos, formatting adjustments, and minor copy edits are made silently. The threshold for a correction note is \"did this error change what a reader would understand or decide?\""
          },
          {
            "type": "subheading",
            "heading": "Editorial firewall"
          },
          {
            "type": "paragraph",
            "text": "The same person writes the reviews and corresponds with affiliate networks. We don't pretend otherwise. The discipline that protects editorial integrity is documented in [Methodology](/methodology) and [Affiliate Disclosure](/affiliate-disclosure) and codified in this page. We hold ourselves accountable to it; if we fail at it, we will publish a correction."
          },
          {
            "type": "subheading",
            "heading": "Conflicts of interest"
          },
          {
            "type": "paragraph",
            "text": "The founder and editor of BestCardsForMe personally holds and uses several of the credit cards covered on the site. This is normal for a credit-card publisher — useful coverage requires actual product knowledge — and is the source of most of our methodology-grounded experience. Personal cardholding does not influence editorial recommendations beyond contributing to first-hand product familiarity."
          },
          {
            "type": "paragraph",
            "text": "We do not invest in the equity of issuers we cover. We do not accept gifts, comped trips, or \"press junkets\" from issuers, hotels, airlines, or affiliate networks."
          },
          {
            "type": "subheading",
            "heading": "AI use"
          },
          {
            "type": "paragraph",
            "text": "We use AI tooling (large language models) to assist with research, drafting, fact-checking, and editorial review. Every article published on the site is reviewed by the founder and editor of BestCardsForMe, applies the documented methodology consistently, and is subject to the corrections policy below. AI is a tool that accelerates the editorial process; it does not replace editorial judgment, methodology adherence, or factual review."
          },
          {
            "type": "paragraph",
            "text": "We do not publish AI-generated content with hallucinated facts, fabricated card terms, or invented sources. When we make factual errors despite our review process, we treat them under the corrections policy like any other editorial error."
          },
          {
            "type": "subheading",
            "heading": "Welcome bonus framing"
          },
          {
            "type": "paragraph",
            "text": "We deliberately do not anchor card recommendations on welcome bonus value. Welcome bonuses change quarterly and reward the first year only. Year-2 economics are the durable comparison and the basis of our recommendations. We mention welcome bonuses in articles when relevant but do not let them drive the recommendation."
          },
          {
            "type": "subheading",
            "heading": "Conservative voice"
          },
          {
            "type": "paragraph",
            "text": "When we don't know something, we say so. When card terms have shifted recently and the published number may not be current, we tell readers to verify with the issuer. When two cards are roughly equivalent for a profile, we present the trade-offs and let readers decide rather than pretend one is decisively better."
          }
        ]
      },
      {
        "heading": "Corrections policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We treat factual accuracy as an editorial obligation, not a marketing concern. When we make a material error:"
          },
          {
            "type": "paragraph",
            "text": "1. **We correct the article in place** as soon as the error is verified. 2. **We add a dated correction note** at the bottom of the article documenting what was wrong, what was changed, and when. 3. **We send a brief correction in the next newsletter issue** if the error appeared in the email version of an article."
          },
          {
            "type": "paragraph",
            "text": "To report a correction, email **tim@moneyfactor.io** with:"
          },
          {
            "type": "bullets",
            "items": [
              "The URL of the page containing the error",
              "The specific text or claim that is wrong",
              "The correct information, if you have it",
              "A source for the correct information, where applicable"
            ]
          },
          {
            "type": "paragraph",
            "text": "We respond to correction requests within five business days. We do not require you to identify yourself or explain your relationship to the error to file one."
          }
        ]
      },
      {
        "heading": "Editorial / partnership separation",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If you are reaching out about a potential affiliate or partnership relationship, please use the same email address but include \"Partnership\" or \"Affiliate\" in the subject line."
          },
          {
            "type": "paragraph",
            "text": "We do not commingle partnership conversations with editorial decisions. The terms of any partnership we enter are governed by our [Affiliate Disclosure](/affiliate-disclosure) and the editorial firewall described above. Specifically, partnership relationships do not influence which cards we cover, how we rank them, or what we say about them. Partnership outreach that asks for editorial favors will be declined; partnership outreach that respects the editorial firewall is welcome."
          }
        ]
      },
      {
        "heading": "Mailing address",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We do not publish a physical mailing address on this page. If you require one for legal correspondence, please email **tim@moneyfactor.io** and we will provide a current address through a registered channel."
          }
        ]
      },
      {
        "heading": "Important disclaimer",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe is an independent publication. Information on this site is for general informational purposes only and does not constitute personalized financial, tax, or legal advice. We are not financial advisors, certified financial planners, accountants, or attorneys. We do not provide personalized financial advice. For decisions specific to your tax situation, credit profile, or financial goals, consult a qualified professional."
          },
          {
            "type": "paragraph",
            "text": "Card terms, fees, credits, and earning rates shown on the site are subject to change without notice. Always verify current offers and terms on the issuer's site before applying for any credit card. Approval, credit limits, APRs, and account terms depend on the issuer's underwriting and your specific credit profile."
          },
          {
            "type": "paragraph",
            "text": "*BestCardsForMe is the credit-card vertical of [MoneyFactor](https://moneyfactor.io). See also our [About](/about), [Methodology](/methodology), and [Affiliate Disclosure](/affiliate-disclosure) pages.*"
          }
        ]
      }
    ]
  },
  {
    "slug": "how-we-review-credit-cards",
    "title": "How We Review Credit Cards at BestCardsForMe",
    "eyebrow": "How We Review",
    "summary": "This page documents how BestCardsForMe evaluates credit card products and produces recommendations. The methodology is applied consistently across every card review, comparison piece, and quiz recommendation on the site. Readers and affiliate-network...",
    "sections": [
      {
        "heading": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "text": "This page documents how BestCardsForMe evaluates credit card products and produces recommendations. The methodology is applied consistently across every card review, comparison piece, and quiz recommendation on the site. Readers and affiliate-network reviewers should be able to audit any recommendation we publish against the framework below."
          }
        ]
      },
      {
        "heading": "The core question we answer",
        "blocks": [
          {
            "type": "paragraph",
            "text": "For every card we cover, we answer one question: **does the realistic Year-2 captured value of this card, for a specific household profile, clear the annual fee?**"
          },
          {
            "type": "paragraph",
            "text": "Year-2 economics — not Year-1 — are the durable comparison. Welcome bonuses change quarterly and reward only the first year. Year 2 is the year that repeats annually for as long as a household holds the card, and it's the math that determines whether a card is worth keeping."
          },
          {
            "type": "paragraph",
            "text": "We compute realistic captured value, not issuer-stated benefit value. The two figures are typically meaningfully different."
          }
        ]
      },
      {
        "heading": "The MoneyFactor Fit Score",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Every card review and quiz recommendation on the site produces a MoneyFactor Fit Score from 0 to 100. The score reflects how well a card matches a specific household profile across four dimensions:"
          },
          {
            "type": "paragraph",
            "text": "1. **Realistic Year-2 captured value** — what the household actually captures, in dollars, after applying the discounts described below 2. **Profile fit** — whether the card matches the household's spending pattern, fee tolerance, and travel volume 3. **Friction** — how much calendar tracking and engagement the card demands 4. **Issuer reliability** — track record of program changes, devaluations, and customer experience"
          },
          {
            "type": "paragraph",
            "text": "A score above 90 indicates a strong recommendation for the specific profile. Scores between 70 and 89 indicate a card worth considering but with caveats. Scores below 70 indicate the card is not the right fit for that profile, even if it might be the right fit for someone else."
          }
        ]
      },
      {
        "heading": "The four discounts we apply to issuer-stated value",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Every premium credit card markets a \"total annual benefit value\" calculated by summing every credit and perk at full face value. That number is the ceiling under perfect utilization. We compute the floor — what households realistically capture in practice."
          },
          {
            "type": "paragraph",
            "text": "**Discount 1: Unused-credit discount.** Statement credits that lock to specific partners (Equinox, Walmart+, Saks, Uber, etc.) only count to the extent the household would have made those purchases anyway. A $300 Equinox credit captures near zero for a non-member. We typically capture 50–75% of stated lifestyle-credit value for high-engagement cardholders, and 25–40% for moderate-engagement households."
          },
          {
            "type": "paragraph",
            "text": "**Discount 2: Friction discount.** Credits that require enrollment, monthly resets, or specific app workflows have a real cost — your time and attention. Households that won't track them lose 30–50% of the stated lifestyle-credit value to forgotten resets and missed enrollments. We treat lost value as zero, because that's what it is."
          },
          {
            "type": "paragraph",
            "text": "**Discount 3: Portal-bound discount.** Credits and earning rates that route through a specific issuer travel portal (Chase Travel, Capital One Travel, Amex Travel) are real, but they're worth less than the same dollars in cash. Portal pricing isn't always competitive with direct booking, and inventory is constrained. We typically discount portal-bound value by 10–20%."
          },
          {
            "type": "paragraph",
            "text": "**Discount 4: Conservative point valuation.** We value transferable points at realistic captured rates, not aspirational rates. The valuations we use across major programs:"
          },
          {
            "type": "paragraph",
            "text": "| Program | BCFM valuation | Notes | |---|---|---| | Chase Ultimate Rewards | 1.6¢ per point | Strong network including Hyatt, United | | American Express Membership Rewards | 1.7¢ per point | Deepest international airline transfer network | | Citi ThankYou Points | 1.5¢ per point | Smaller but useful partner network | | Capital One miles | 1.4¢ per mile | No Hyatt or United relationships | | Hilton Honors | 0.5¢ per point | Reflects program devaluations | | Marriott Bonvoy | 0.7¢ per point | Reflects program changes |"
          },
          {
            "type": "paragraph",
            "text": "These valuations reflect what an engaged-but-not-obsessive cardholder realistically captures across mixed redemption patterns. Aspirational redemptions can yield higher; statement-credit redemptions yield lower. We use the middle."
          }
        ]
      },
      {
        "heading": "The six profile taxonomy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Recommendations are calibrated to one of six household profiles. The MoneyFactor quiz routes readers to the profile that fits their answers:"
          },
          {
            "type": "paragraph",
            "text": "1. **No-Fee Optimizer** — wants strong rewards without an annual fee 2. **Premium Traveler** — values lounge access, travel credits, premium hotel benefits 3. **Affluent Cashback** — high household income, prefers simple cash back over points 4. **Points Maximizer** — actively transfers points to partners, optimizes redemptions strategically 5. **Status & Convenience** — values elite status, flexibility, and frictionless travel 6. **Spend-First Pragmatist** — wants the card whose math works given their actual spending pattern"
          },
          {
            "type": "paragraph",
            "text": "Different profiles get different recommendations from the same card data. A Premium Traveler may receive Chase Sapphire Reserve as a top match while an Affluent Cashback may receive Citi Double Cash for the same household income — because the right answer depends on how the household uses cards, not on income alone."
          }
        ]
      },
      {
        "heading": "What we factor in beyond raw value math",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Several non-numerical factors shape recommendations:"
          },
          {
            "type": "bullets",
            "items": [
              "**Calendar burden.** Cards with heavy lifestyle credit stacks demand engagement. We surface this as a feature, not bury it.",
              "**Redemption complexity.** A card whose value depends on transferring points to obscure partners scores lower than a card whose value comes from straightforward earning.",
              "**Service quality and program reliability.** Issuers with frequent unilateral devaluations or weak customer service lose ground in the score.",
              "**Compliance friction.** Cards with usage restrictions that disproportionately bind the target reader (e.g., merchant exclusions, geographic limits) lose points."
            ]
          }
        ]
      },
      {
        "heading": "What we don't claim",
        "blocks": [
          {
            "type": "bullets",
            "items": [
              "We don't claim our methodology is the only correct approach. Other publishers use different valuations and reach different conclusions. We document ours so readers can compare.",
              "We don't claim our point valuations are universally accurate. They reflect realistic captured value for engaged-but-not-obsessive households, which is our reader profile. Aspirational redeemers will capture more; casual redeemers less.",
              "We don't claim recommendations are personalized financial advice. They're informational guidance based on a consistent framework applied to product data."
            ]
          }
        ]
      },
      {
        "heading": "How recommendations differ from issuer marketing",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Issuer marketing summarizes a card's strongest case. Our reviews surface the card's structural trade-offs — including the cases where the card is the wrong choice. Every review on the site includes a \"Who should skip this card\" section explicitly identifying profiles for whom the card doesn't pencil. We do this because it's editorially honest and because telling readers when a card isn't right for them builds the trust required to be useful when a card *is* right."
          },
          {
            "type": "paragraph",
            "text": "A reader who finds our \"Who should skip\" sections useful is more likely to trust our \"Who should get\" recommendations."
          }
        ]
      },
      {
        "heading": "Updates and corrections",
        "blocks": [
          {
            "type": "paragraph",
            "text": "Card terms change frequently. When an issuer raises an annual fee, devalues a credit, or changes earning structure, we update affected articles. We aim to update materially affected reviews within thirty days of a known change. When the change is significant enough to flip a recommendation (e.g., a fee hike that pushes net captured value below the fee for a target profile), we tag the article and surface the revision."
          },
          {
            "type": "paragraph",
            "text": "We publish dated correction notes on articles where a factual error has been corrected. See our [Editorial Standards](/editorial-standards) page for the full corrections policy."
          }
        ]
      },
      {
        "heading": "Disagreement is welcome",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We expect informed readers will sometimes disagree with our methodology. The most common disagreements: our point valuations are too conservative compared to The Points Guy or aspirational sources; our friction discounts are too aggressive; our recommendation logic is too cautious about premium upgrades."
          },
          {
            "type": "paragraph",
            "text": "These critiques are fair. The methodology is one defensible framework, not the only one. If you reach different conclusions using a different framework, your math may be right for you. We document ours to make our reasoning auditable, not to claim it's the universal correct answer."
          },
          {
            "type": "paragraph",
            "text": "To send substantive methodology feedback or critique, email **tim@moneyfactor.io**. We read it."
          },
          {
            "type": "paragraph",
            "text": "*See also our [About](/about) page, [Editorial Standards](/editorial-standards), and [Affiliate Disclosure](/affiliate-disclosure).*"
          }
        ]
      }
    ]
  },
  {
    "slug": "editorial-standards",
    "eyebrow": "Editorial Standards",
    "title": "Editorial Standards at BestCardsForMe",
    "summary": "The standards that govern every BestCardsForMe article, recommendation, correction, and affiliate relationship.",
    "sections": [
      {
        "heading": "Editorial standards",
        "blocks": [
          {
            "type": "paragraph",
            "text": "The following standards apply to every article published on BestCardsForMe. They are codified here so readers, affiliate-network reviewers, and prospective partners can verify our commitments before engaging."
          },
          {
            "type": "subheading",
            "heading": "Independence"
          },
          {
            "type": "paragraph",
            "text": "We do not accept payment to recommend a specific card, alter a ranking, or remove a critical review. Recommendations reflect the application of our [Methodology](/methodology) to product data — not the commercial preferences of any issuer or affiliate network. When a card we'd otherwise recommend has a structural problem, we name the problem."
          },
          {
            "type": "subheading",
            "heading": "Sourcing"
          },
          {
            "type": "paragraph",
            "text": "Card terms, fees, credits, and earning rates cited in articles reflect publicly available information at the time of publication. Where a specific number requires citation (e.g., a fee that recently changed, a benefit that's been added or removed), we link to the issuer's official source where possible. Where claims rely on our editorial methodology (e.g., point valuations, captured-value math), we link to the [Methodology](/methodology) page."
          },
          {
            "type": "paragraph",
            "text": "We do not cite anonymous sources, leaked memos, or unverified industry rumors."
          },
          {
            "type": "subheading",
            "heading": "Accuracy"
          },
          {
            "type": "paragraph",
            "text": "We aim for accuracy on every published claim. When we make a material factual error — including incorrect annual fees, incorrect welcome offer terms, incorrect category multipliers, incorrect rate caps, or any factual claim about an issuer's product that is wrong as published — we correct the page and publish a dated correction note (see \"Corrections policy\" below)."
          },
          {
            "type": "paragraph",
            "text": "Typos, formatting adjustments, and minor copy edits are made silently. The threshold for a correction note is \"did this error change what a reader would understand or decide?\""
          },
          {
            "type": "subheading",
            "heading": "Editorial firewall"
          },
          {
            "type": "paragraph",
            "text": "The same person writes the reviews and corresponds with affiliate networks. We don't pretend otherwise. The discipline that protects editorial integrity is documented in [Methodology](/methodology) and [Affiliate Disclosure](/affiliate-disclosure) and codified in this page. We hold ourselves accountable to it; if we fail at it, we will publish a correction."
          },
          {
            "type": "subheading",
            "heading": "Conflicts of interest"
          },
          {
            "type": "paragraph",
            "text": "The founder and editor of BestCardsForMe personally holds and uses several of the credit cards covered on the site. This is normal for a credit-card publisher — useful coverage requires actual product knowledge — and is the source of most of our methodology-grounded experience. Personal cardholding does not influence editorial recommendations beyond contributing to first-hand product familiarity."
          },
          {
            "type": "paragraph",
            "text": "We do not invest in the equity of issuers we cover. We do not accept gifts, comped trips, or \"press junkets\" from issuers, hotels, airlines, or affiliate networks."
          },
          {
            "type": "subheading",
            "heading": "AI use"
          },
          {
            "type": "paragraph",
            "text": "We use AI tooling (large language models) to assist with research, drafting, fact-checking, and editorial review. Every article published on the site is reviewed by the founder and editor of BestCardsForMe, applies the documented methodology consistently, and is subject to the corrections policy below. AI is a tool that accelerates the editorial process; it does not replace editorial judgment, methodology adherence, or factual review."
          },
          {
            "type": "paragraph",
            "text": "We do not publish AI-generated content with hallucinated facts, fabricated card terms, or invented sources. When we make factual errors despite our review process, we treat them under the corrections policy like any other editorial error."
          },
          {
            "type": "subheading",
            "heading": "Welcome bonus framing"
          },
          {
            "type": "paragraph",
            "text": "We deliberately do not anchor card recommendations on welcome bonus value. Welcome bonuses change quarterly and reward the first year only. Year-2 economics are the durable comparison and the basis of our recommendations. We mention welcome bonuses in articles when relevant but do not let them drive the recommendation."
          },
          {
            "type": "subheading",
            "heading": "Conservative voice"
          },
          {
            "type": "paragraph",
            "text": "When we don't know something, we say so. When card terms have shifted recently and the published number may not be current, we tell readers to verify with the issuer. When two cards are roughly equivalent for a profile, we present the trade-offs and let readers decide rather than pretend one is decisively better."
          }
        ]
      },
      {
        "heading": "Corrections policy",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We treat factual accuracy as an editorial obligation, not a marketing concern. When we make a material error:"
          },
          {
            "type": "paragraph",
            "text": "1. **We correct the article in place** as soon as the error is verified. 2. **We add a dated correction note** at the bottom of the article documenting what was wrong, what was changed, and when. 3. **We send a brief correction in the next newsletter issue** if the error appeared in the email version of an article."
          },
          {
            "type": "paragraph",
            "text": "To report a correction, email **tim@moneyfactor.io** with:"
          },
          {
            "type": "bullets",
            "items": [
              "The URL of the page containing the error",
              "The specific text or claim that is wrong",
              "The correct information, if you have it",
              "A source for the correct information, where applicable"
            ]
          },
          {
            "type": "paragraph",
            "text": "We respond to correction requests within five business days. We do not require you to identify yourself or explain your relationship to the error to file one."
          }
        ]
      },
      {
        "heading": "Editorial / partnership separation",
        "blocks": [
          {
            "type": "paragraph",
            "text": "If you are reaching out about a potential affiliate or partnership relationship, please use the same email address but include \"Partnership\" or \"Affiliate\" in the subject line."
          },
          {
            "type": "paragraph",
            "text": "We do not commingle partnership conversations with editorial decisions. The terms of any partnership we enter are governed by our [Affiliate Disclosure](/affiliate-disclosure) and the editorial firewall described above. Specifically, partnership relationships do not influence which cards we cover, how we rank them, or what we say about them. Partnership outreach that asks for editorial favors will be declined; partnership outreach that respects the editorial firewall is welcome."
          }
        ]
      },
      {
        "heading": "Mailing address",
        "blocks": [
          {
            "type": "paragraph",
            "text": "We do not publish a physical mailing address on this page. If you require one for legal correspondence, please email **tim@moneyfactor.io** and we will provide a current address through a registered channel."
          }
        ]
      },
      {
        "heading": "Important disclaimer",
        "blocks": [
          {
            "type": "paragraph",
            "text": "BestCardsForMe is an independent publication. Information on this site is for general informational purposes only and does not constitute personalized financial, tax, or legal advice. We are not financial advisors, certified financial planners, accountants, or attorneys. We do not provide personalized financial advice. For decisions specific to your tax situation, credit profile, or financial goals, consult a qualified professional."
          },
          {
            "type": "paragraph",
            "text": "Card terms, fees, credits, and earning rates shown on the site are subject to change without notice. Always verify current offers and terms on the issuer's site before applying for any credit card. Approval, credit limits, APRs, and account terms depend on the issuer's underwriting and your specific credit profile."
          },
          {
            "type": "paragraph",
            "text": "*BestCardsForMe is the credit-card vertical of [MoneyFactor](https://moneyfactor.io). See also our [About](/about), [Methodology](/methodology), and [Affiliate Disclosure](/affiliate-disclosure) pages.*"
          }
        ]
      }
    ]
  }
];

export function getTrustPage(slug: string) {
  return trustPages.find((page) => page.slug === slug);
}
