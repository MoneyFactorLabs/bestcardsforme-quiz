# MoneyFactor Voice and Positioning
_Last updated: 2026-05-20 (v1 — ported from ChatGPT extraction)_

This document codifies the brand stack, editorial voice, language doctrine, and channel-specific voice rules across MoneyFactor and its verticals. It is binding for all published content — articles, newsletter, social, video, Reddit, source responses, and AI-citable structured outputs.

**Provenance:** Ported from ChatGPT chat history via Claude in Chrome extraction (2026-05-20). Some channel-specific voice rules and the full banned-language list live in chatgpt.com `.md` files that timed out during automated extraction; gaps flagged in §10.

---

## §1. Brand stack

```
MoneyFactor (parent platform)
├── BestCardsForMe — cards vertical (live)
├── LeaseFactor — lease decision intelligence (Phase 0A)
├── LoanFactor — research
├── CreditFactor — research
├── HomeFactor — watchlist
├── InsuranceFactor — watchlist
└── (BusinessFactor — separate platform, not under MoneyFactor consumer)
```

**MoneyFactor is the platform.** Not an affiliate site. Not a content farm. A trusted financial decision platform built around real-world value, decision tools, scoring systems, calculators, first-party data, benchmarks, transparent methodology, and high-trust consumer guidance.

Affiliate revenue is one monetization layer. It is not the whole business. Content, tools, and data are upstream of monetization.

---

## §2. Brand tagline and editorial commitment

### Public tagline (parent brand)

> **The Real Math Behind Every Money Decision.**

This is the headline phrase MoneyFactor uses externally. It is a positive assertion: "we show you the real math." It is not contrastive ("competitors are dishonest") — it is constructive.

### Internal editorial commitment

The internal name for the commitment is "honest math." It refers to the practice of surfacing the gap between advertised value and captured value — what a credit card or lease *says* you'll get vs. what you'll *actually* capture. This is the methodology's core differentiator.

**"Honest math" is the commitment. "The Real Math Behind Every Money Decision" is how we say it publicly.**

### Why "honest math" is not used as branded/public language

Three reasons:
1. **Brand collision risk.** HonestMath.com exists as a third-party domain. Using "honest math" as MoneyFactor's headline phrase creates a search-and-trademark adjacency that doesn't serve us.
2. **Defensive framing.** "Honest math" implies competitors are dishonest. Positive assertions ("real math") outperform contrastive ones in trust-building copy.
3. **Doctrinal.** `ops/LEASEFACTOR_DOCTRINE.md` §Language doctrine explicitly bans "honest math" as branded language. This doc inherits that.

Use "Real Math" publicly. Use "honest math" only internally in ops docs and strategy conversations.

---

## §3. Editorial voice principles

Every piece of published content — across every vertical and channel — must conform to these principles:

1. **Practical.** Written for a user trying to make a decision, not a reader looking for entertainment.
2. **Math-backed.** Claims are supported by numbers. Numbers are sourced or methodology-derived.
3. **Decision-oriented.** Articles, calculators, and recommendations end with an actionable next step.
4. **Honest about tradeoffs.** No card / lease / loan / product is universally good. Every recommendation surfaces who it's for and who it's not for.
5. **Clear about assumptions.** When the methodology applies a discount, the discount is explained. When a calculation uses an assumption, the assumption is stated.
6. **Transparent about affiliate incentives.** Where affiliate links exist (cards), the relationship is disclosed. Recommendations are not biased by payout.
7. **Updated when facts change.** Annual fees, credit programs, point valuations, and issuer terms are rechecked on a defined cadence (see methodology recheck cadence).
8. **Focused on user decision intent.** Content serves query intent, not search volume. Decision-intent queries are prioritized over commercial-broad queries.

---

## §4. Editorial anti-patterns

These are the patterns BCFM, LeaseFactor, and any future vertical content must structurally avoid. If a draft slips into one of these, it gets rewritten.

1. **Generic.** Content that could appear on any site (NerdWallet, Bankrate, TPG) is not BCFM/MoneyFactor content. If our methodology adds nothing, we don't publish.
2. **Affiliate-stuffed.** Articles overloaded with affiliate links for cards that don't fit the article's user. Recommend what fits; don't link what doesn't.
3. **Overly broad.** "Best credit cards of 2026" with no segmentation is not useful. Segment by user intent (high-income, business owner, hotel preference, no annual fee).
4. **Unverified.** Claims about issuer terms, lender rates, or program details that can't be sourced are not published.
5. **Thin.** Sub-1,500-word articles that don't engage with methodology depth. The methodology is the differentiator.
6. **Duplicative.** Multiple articles covering the same decision with different titles. One canonical article per decision.
7. **Volume-chasing.** Publishing for SEO volume without methodology rigor is the BCFM antipattern that produced the impression-without-clicks problem.
8. **Disconnected from a decision.** Listicles that don't end with "here's what to do" don't qualify as BCFM content.
9. **Not supported by methodology.** Recommendations that bypass the four-discount framework or aren't grounded in Year-2 economics are inconsistent with the brand promise.

---

## §5. Channel-specific voice

### §5.1 Long-form articles (BCFM site)

- 2,500–3,500 words
- All four discount layers applied to any card review
- Year-2 economics as the steady-state anchor
- Per-credit friction analysis where applicable
- "Who should get this" and "Who should skip this" required sections
- 8–10 question FAQ block, GEO-formatted (direct answer → example → caveat)
- Internal links to 3–5 related BCFM articles
- Trust/compliance footer per BCFM template

### §5.2 LeaseFactor reports (V0 analyzer output)

- Per `ops/LEASEFACTOR_V0_SPEC.md` §6 — six structured blocks: Headline / Key numbers / Flags / Score breakdown / What to ask next / Confidence caveat
- AI/GEO-citable structure required
- Plain-English verdict in 1–2 sentences
- No "save thousands" or "guaranteed savings" claims
- No specific captive-finance rate claims by lender
- Explainable score with breakdown always visible

### §5.3 Newsletter (Beehiiv — The MoneyFactor Brief)

- Format: one decision per issue, explained
- Cadence: weekly (relaunch pending — see open question in `LEASEFACTOR_V0_PLAN.md`)
- Length: scannable, mobile-optimized
- Methodology-anchored: each issue surfaces one piece of methodology applied to a real decision
- CTA: relevant calculator / analyzer / article, not a generic "subscribe" or affiliate push
- No paid sponsorship in V0 phase

### §5.4 Reddit

- **No links to BCFM, MoneyFactor, or LeaseFactor.** Not in the comment, not in the user profile bio while engaging.
- **No brand mention.** Engage as a knowledgeable participant, not a brand representative.
- **Under 200 words.** Reddit comment culture rewards conciseness.
- **Conversational tone.** First person ("I lease cars too" / "I've held the CSR for three years") not journalistic.
- **Math-backed but not pedantic.** Show the calculation if it helps; don't lecture.
- **No promotional framing.** No "you should check out [tool]" or "I built a calculator that does this."
- **Human-written or voice-dictated.** Not AI-polished. (Authority log lesson: AI-polished Qwoted responses were flagged. Same risk applies on Reddit.)
- **Subreddit-specific rules respected.** r/awardtravel, r/personalfinance, r/Cartalk each have their own etiquette.
- **No engagement in threads with 50+ comments unless particularly substantive contribution available.** Late comments don't get traction.
- **Cadence:** every 1–2 days maximum per `ops/RECURRING_WORKFLOWS.md` D3.

### §5.5 Qwoted / Featured / Source of Sources

- **Attribution format:** "Tim, founder and editor of BestCardsForMe" (or "founder of MoneyFactor" for parent-brand context).
- **Methodology framing.** Quotes anchored in the methodology — Year-2 economics, four-discount framework, captured-vs-advertised gap.
- **No affiliate hype.** No "the best card right now is X" framing without methodology context.
- **No exaggeration.** Conservative language. No "guaranteed savings." No "the only card you need."
- **Human-written or voice-dictated.** Authority log lesson applies — AI-polished submissions were flagged. Drafts may be Cowork-assisted, but final submission language must be the founder's voice.
- **Fit per `ops/MONEYFACTOR_VERTICAL_RULES.md`.** Skip investing, portfolio, tax, and legal queries unless they directly connect to credit cards, lease economics, or consumer credit behavior.

### §5.6 Faceless video (planned distribution channel for LeaseFactor V0 and beyond)

- **No founder face on camera.** Voice-over or text-on-screen format.
- **One primitive per video.** "Money factor to APR in 30 seconds." "Effective monthly cost in 45 seconds." "Why putting money down on a lease is risky."
- **30–90 second length target.**
- **CTA to the relevant tool** (LeaseFactor analyzer URL) at the end. Not a generic subscribe / follow.
- **Math-backed.** Show the formula or calculation on screen. The math is the visual.
- **No "save thousands" copy.** Same language doctrine as long-form.
- **Captions required.** Watched without sound by default.

### §5.7 Social (X / LinkedIn / threads)

- **X (Twitter):** thread format for methodology walkthroughs, single-tweet for primitives. Math-backed. Avoid promotional framing.
- **LinkedIn:** **not used in V0 phase.** Day-job visibility concern. Revisit post-V0.
- **Other social:** evaluate per-channel before activating. Don't multi-post into channels we don't intend to maintain.

---

## §6. Language doctrine — preferred terms

These terms are the canonical MoneyFactor / BCFM / LeaseFactor vocabulary. Use them consistently across all content.

### Universal

- The Real Math (parent brand phrasing)
- Methodology (capitalized when referring to the canonical framework)
- Captured value
- Year-2 economics
- Four-discount framework
- Decision-intent

### BCFM-specific

- Conservative valuation
- Friction discount
- Unused-credit discount
- Year-2 captured value
- Fit Score
- Premium Card True Value (when referring to the planned calculator)

### LeaseFactor-specific (per `LEASEFACTOR_DOCTRINE.md`)

- LeaseFactor Score
- Deal-quality flags
- Confidence tier
- Real-world lease math
- Effective monthly cost
- Implied APR
- Payment-to-MSRP ratio
- "What to ask the dealer next"

---

## §7. Language doctrine — banned terms and framings

### Hard bans (never use publicly)

- "Honest math" as a public-facing phrase (use "Real Math" instead; "honest math" is internal-only)
- "Guaranteed savings" / "Save thousands" / "Save $X"
- "The only card you need"
- "Best card ever"
- "Game-changing"
- "Game-changer"
- "Honestly" / "Frankly" / "To be transparent" (used as filler — these are AI tells)
- "Let's dive in" / "In this article we'll explore"
- "It's worth noting that" (AI filler)
- "When it comes to" (AI filler)

### Conditional bans (avoid unless specifically justified)

- "Best" without segmentation. "Best card for high-income households" is allowed; "best credit card of 2026" is not.
- Specific live captive-finance rate claims by lender. Use language like "money factors vary by lender, region, credit tier, and program date."
- Welcome-bonus-anchored value statements without Year-2 follow-up.
- Affiliate-link-heavy paragraphs without methodology context.

---

## §8. Voice examples — good vs bad

### Bad voice (BCFM antipattern)

> "The Chase Sapphire Reserve is one of the best premium travel credit cards on the market in 2026. With incredible perks like a $300 annual travel credit, Priority Pass lounge access, and 3x points on dining and travel, this card is a no-brainer for frequent travelers. Let's dive into why."

Why bad: generic ("one of the best"), unsupported ("incredible perks"), volume-chasing ("no-brainer"), AI tells ("let's dive into"), no methodology, no segmentation.

### Good voice (BCFM)

> "The Chase Sapphire Reserve advertises $1,400+ in annual value against a $795 fee. After applying BCFM's four-discount framework — friction-adjusted credits, conservative UR valuation at 1.6¢, Year-2 baseline (no welcome bonus) — captured value lands closer to $720 for the median high-income traveler who books 60% of trips through the Chase portal. That's a $75 Year-2 deficit before factoring in lifestyle credits the user actually captures. Worth it for users who clear the lifestyle credits ($300 dining at Sapphire Reserve restaurants, $300 DoorDash, $120 Lyft) at >65% capture. Not worth it otherwise."

Why good: math-backed, methodology-anchored, segmented (who it's for, who it isn't), Year-2 anchored, transparent about assumptions.

### Bad voice (LeaseFactor antipattern)

> "Did you know most people overpay $3,000–$5,000 on their lease without knowing it? Our LeaseFactor calculator will save you thousands. Just enter your numbers and we'll tell you if your dealer is ripping you off!"

Why bad: precision pretense ("$3,000–$5,000"), guaranteed savings claim, framing competitors/dealers as villains, breathless tone.

### Good voice (LeaseFactor)

> "Most lease quotes hide their cost in two places: the money factor (which the dealer can mark up over the buy rate) and the due-at-signing amount (which makes the monthly payment look lower than it really is). The LeaseFactor analyzer surfaces both, translates the money factor into an APR, and shows the effective monthly cost. If the deal is fair, you'll know. If it's not, you'll know what to ask before signing."

Why good: concrete (specific mechanisms named), no precision pretense, math-anchored, action-oriented ("what to ask"), no villainization.

---

## §9. Source-response and journalist-quote voice

When the founder responds to a journalist query (Qwoted, Featured, Source of Sources) or is quoted in third-party media:

- **Attribution:** "Tim Finiki, founder and editor of BestCardsForMe" (or "founder of MoneyFactor" depending on the angle).
- **One methodology hook per response.** Year-2 economics, captured value, or four-discount framework — pick one, anchor on it.
- **Specific examples beat general claims.** "On the Chase Sapphire Reserve, our methodology values UR at 1.6¢ — below the issuer's implied 2.0¢+ — which brings the realistic Year-2 value to $720 against a $795 fee" beats "premium cards are often overvalued."
- **No exaggeration. No "always" or "never." No "the smartest move."**
- **No specific lender-rate or captive-finance claims** without a stated source.
- **Drafts may be Cowork-assisted; final language must be human-edited or voice-dictated** before submission. Per the Qwoted lesson.

---

## §10. Known gaps (v2 work)

The following live in ChatGPT chat history but weren't recoverable during the automated extraction pass:

1. **Full banned-language word list.** ChatGPT extraction confirmed a comprehensive list exists in a "Pasted markdown.md" file in the MoneyFactor Strategy Continuation chat. The list above (§7) is partial — built from inference and ChatGPT's structured output, not from the source file.

2. **Full Reddit Response Bank.** Confirmed saved as a document in MoneyFactor Strategy Continuation. The §5.4 rules above are correct but don't reproduce the actual response patterns from the bank.

3. **Beehiiv issue voice examples.** Specific structural templates for The MoneyFactor Brief issues (intro hook, body, CTA structure) are likely in the same source.

4. **Channel-specific Qwoted response patterns.** Examples of strong vs weak responses by journalist query type.

5. **Faceless video script templates.** Format-specific structural templates beyond the bullet rules in §5.6.

**Recovery path:** Manual recovery from chatgpt.com. Open MoneyFactor Strategy Continuation → find the "Pasted markdown.md" attachments → wait for file viewers to load → copy text → paste here for v2 synthesis. Automated extraction timed out on these files.

---

## §11. Source provenance

This doc was ported from ChatGPT chat history on 2026-05-20 via Claude in Chrome extraction. Source chats:
- MoneyFactor Command Center
- MoneyFactor Project Brief (chatgpt.com/c/6a03d6e3-d52c-8326-8a28-6e878bbc5302)
- MoneyFactor Strategy Continuation
- BCFM strategy and content threads

Some content (anti-patterns list, voice principles list, channel assignments) was extracted directly. Some content (specific phrasing examples in §8, language ban list in §7) was reconstructed from context and methodology — these reconstructed portions need founder confirmation.

**Founder confirmation pass required.** Review §2 tagline confirmation, §4 anti-pattern interpretation, §5.4 Reddit rules, §6 preferred terms, §7 banned terms list, §8 voice examples. Anything that doesn't match the founder's mental model should be corrected before this doc is treated as canonical doctrine.
