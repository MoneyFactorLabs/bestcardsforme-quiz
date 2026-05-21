# BCFM Methodology Derivation
_Last updated: 2026-05-20 (v1 — ported from ChatGPT extraction)_

This document codifies the load-bearing reasoning behind BCFM's editorial methodology — the assumptions, formulas, and decision frameworks that govern how every credit card is evaluated. It is the methodological foundation that LeaseFactor and future verticals adapt from, not just copy.

**Provenance:** Ported from ChatGPT chat history via Claude in Chrome extraction (2026-05-20). Some derivation reasoning lives in uploaded .md files that timed out during automated extraction; gaps explicitly flagged in §11.

---

## §1. Purpose

BCFM's methodology exists to answer one question better than any other source on the open web:

**"Is this card actually worth it for someone like me?"**

The "actually" is the work. Every published source — issuer pages, NerdWallet, The Points Guy, Bankrate, Reddit — answers a version of this question. BCFM's differentiator is the gap between what issuers advertise and what users actually capture, surfaced numerically rather than narratively.

This gap-surfacing is the editorial commitment. Internally, it's been called "honest math." Externally, the parent brand expresses it as:

> "The Real Math Behind Every Money Decision."

The methodology below is the operational machinery of that promise.

---

## §2. The four-discount framework

Every BCFM card evaluation passes through four discounts in sequence. Each one strips out a layer of issuer marketing fiction. What survives all four is real captured value.

### Discount 1: Unused-credit discount

Issuers advertise credits at face value. Most users don't capture full face value. A $200 airline incidental credit is worth $0 to a user who doesn't fly Delta. A $300 dining credit at Resy-only restaurants is worth less than $300 to a user whose dining is mostly local non-Resy.

Each credit on a card gets a friction-adjusted capture rate based on the user's actual likelihood of using it. Credits are evaluated independently, not summed at face value.

### Discount 2: Friction discount (per credit)

Even credits a user could capture often have friction that reduces effective value:
- Portal-bound credits (must book through issuer portal) — discounted if user prefers OTAs or direct booking
- Time-bounded credits (quarterly, monthly cycles) — discounted by realistic capture rate of cyclical credits
- Brand-specific credits (Hilton, Marriott) — discounted if user has no brand affinity
- Lifestyle credits requiring registration / activation — discounted by user follow-through

The friction discount is applied per-credit based on user-reported usage likelihood inputs. No single global discount factor — the input is contextual.

### Discount 3: Conservative point valuation

Points are valued conservatively, not aspirationally. Locked baseline values:

| Currency | BCFM valuation | Notes |
|---|---|---|
| Chase Ultimate Rewards (UR) | 1.6¢ | Median realistic redemption for occasional transfer-to-partner user |
| Amex Membership Rewards (MR) | 1.7¢ | Slight premium reflects broader/higher-ceiling partner network |
| Capital One Miles | 1.5¢ | Limited transfer ecosystem |
| Citi ThankYou Points | 1.5¢ | Limited transfer ecosystem |

**Derivation reasoning (inferred — explicit derivation not yet recovered):** Aspirational values for these currencies can hit 2.0¢+ when transferred to airline partners during deal availability. BCFM values reflect *median realistic* redemption for users who transfer occasionally but aren't hardcore optimizers. The 0.1¢ MR premium over UR reflects Amex's broader partner network (Singapore, Air France/KLM, ANA, Hilton at fair ratios). Capital One and Citi at 1.5¢ reflect more limited transfer options.

**Conservative bias is intentional.** Year-2 economics that work at conservative valuations will work at any valuation. The reverse is not true.

### Discount 4: Year-2 economics

Year-1 includes the welcome bonus. Year-1 makes almost every premium card look positive. Year-2 is the steady-state question: *"Is this card worth keeping after the welcome bonus is gone?"*

**Year-1 formula:**
```
Year-1 value = (points earned × point value)
             + welcome bonus value
             + friction-adjusted captured credits
             − annual fee
```

**Year-2 formula:**
```
Year-2 value = (points earned × point value)
             + friction-adjusted captured credits
             − annual fee
```

Year-2 is the canonical decision frame for BCFM. Articles, calculator outputs, and recommendations anchor on Year-2 value unless explicitly noting otherwise. Welcome bonus framing is the kind of issuer marketing the methodology specifically refuses to anchor on.

---

## §3. Captured value vs. advertised value

The central editorial output is the gap.

| | Advertised value (issuer) | Captured value (BCFM) |
|---|---|---|
| Source | Issuer marketing page | Methodology-driven calculation |
| Includes | All credits at face value, points at aspirational rates, welcome bonus | Friction-adjusted credits, conservative point values, Year-2 baseline |
| Purpose | Sell the card | Decide if the card is worth it |

A premium card might advertise "$1,400 in annual value" against a $695 fee — a glossy net positive. BCFM's same card might show $620 captured value against the same fee — a Year-2 net negative for a user who can't capture full lounge / portal / lifestyle credits.

The Premium Card True Value Calculator (planned product, not yet built) was the original BCFM tool concept: take user inputs, compare advertised vs captured, show the delta. The calculator is the methodology in product form.

---

## §4. Fit Score (recommendation quiz output)

Fit Score is the personalized output of the BCFM card-matching quiz. Inputs:
- Travel frequency
- Monthly spend by category (dining, groceries, gas, travel, online shopping)
- Preferred airlines / hotels (if any)
- Annual fee tolerance
- Credit score range
- Cashback vs. travel preference
- Business owner Y/N

**Formula:** Not yet recovered from ChatGPT extraction. The Fit Score is specified as a product output but the explicit scoring weights have not been ported. See §11 gaps.

**What can be inferred:** The score combines per-category earn-rate alignment with the user's spend profile, friction-adjusted credits the user is likely to capture, fee tolerance vs. card fee, and travel/cashback preference fit. It is not a single aggregate number issued without context — each recommendation surfaces the components.

---

## §5. Premium card evaluation

Premium cards (CSR, Amex Platinum, Hilton Aspire, Marriott Bonvoy Brilliant, Capital One Venture X) are evaluated primarily on:

1. **Year-2 captured value vs annual fee.** Welcome bonus excluded.
2. **Credit capture realism.** Lounge access, lifestyle credits, dining credits all friction-adjusted.
3. **Portal-bound benefits.** Travel credits requiring issuer portals get aggressive friction discounts unless user already books through portals.
4. **Hotel program elite credits.** Status-driven benefits valued at the realistic stay-night threshold, not the marketing-line value.

Decision-intent queries served by premium card content:
- "Is [card] worth it?"
- "[card] for high income"
- "[card] vs [card] 2026"
- "[card] annual fee changes"

---

## §6. Business / LLC card evaluation

Business cards have additional evaluation layers:

- **Personal guarantee.** Almost all small-business cards require personal guarantee. This is rarely surfaced in issuer marketing.
- **Approval difficulty.** New LLCs / sole props with no business credit history face uneven approval, especially with Amex / Chase business cards.
- **Personal vs. business credit reporting.** Most business cards do not report to personal credit, but some do (Capital One Spark, some Discover). Material for users monitoring personal credit utilization.
- **Card use case.** Business cards optimized for travel rewards (Amex Business Platinum, Chase Ink Preferred) vs. spend categories (Chase Ink Cash, Amex Business Gold) vs. cashback simplicity (Capital One Spark Cash Plus).

Business card content depth at BCFM has not reached the rigor of premium personal card content. GSC data shows business card head terms (e.g. "business credit cards for llc") ranking at position 65–85 — the articles exist but don't yet match search intent at depth.

---

## §7. Conservative vs. aggressive assumptions

The methodology is deliberately biased toward conservative assumptions. Where a choice exists between an aspirational number and a defensible-floor number, BCFM picks the floor.

| Conservative (BCFM) | Aggressive (competitors) |
|---|---|
| UR at 1.6¢ | UR at 2.0¢+ |
| MR at 1.7¢ | MR at 2.0¢+ |
| Welcome bonus excluded from steady-state value | Welcome bonus included in headline value |
| Per-credit friction discount applied | All credits valued at face |
| Year-2 economics anchor | Year-1 economics quoted |
| Capture rate based on user-reported usage | Capture rate assumed full |

**Why conservative:** Decisions that work at conservative valuations are robust. Decisions that only work at aspirational valuations break the first time a user can't capture the assumed value. BCFM serves users who want to commit to a card knowing the floor, not the ceiling.

---

## §8. What should be rechecked periodically

The methodology is not static. The following inputs should be rechecked on a defined cadence:

| Input | Cadence | Trigger |
|---|---|---|
| Point valuations (UR, MR, Cap One, Citi) | Annually or on major partner change | Transfer partner additions/removals, major devaluation |
| Annual fees | Per issuer cycle | Issuer fee announcements |
| Welcome bonus tiers | Quarterly | Issuer promo cycles |
| Credit programs (portal-bound, lifestyle) | Quarterly | Issuer program refresh |
| Friction assumptions per credit | Annually | User feedback that capture rates have shifted |
| Fit Score weights | Annually | Quiz completion data, user feedback |

T1 in `ops/RECURRING_WORKFLOWS.md` (Issuer fee change announced) is the relevant triggered workflow.

---

## §9. Adaptation to LeaseFactor

The four-discount framework adapts to lease evaluation as follows:

| BCFM (cards) | LeaseFactor (leases) |
|---|---|
| Unused-credit discount | Unused-incentive discount (rebates, captive promos user doesn't qualify for) |
| Friction discount per credit | Friction per fee item (acquisition fee, dealer doc fee) |
| Conservative point valuation | Conservative residual valuation (use floor when band exists) |
| Year-2 economics | Effective monthly cost (effective vs sticker monthly) |
| Captured value vs advertised value | Real cost vs visible monthly payment |

The methodological spine — "show the gap between advertised and real" — is the same. The specific discounts change because the product (lease) has different friction surfaces than the product (card).

See `ops/LEASEFACTOR_DOCTRINE.md` and `ops/LEASEFACTOR_V0_SPEC.md` for the LeaseFactor-specific instantiation.

---

## §10. What this methodology is NOT

To prevent drift back into competitor-style framing:

- **Not a points maximization framework.** Optimizers (Doctor of Credit, awardtravel) maximize. BCFM evaluates fit.
- **Not a churning guide.** Welcome bonus farming is explicitly outside the methodology's frame.
- **Not affiliate-driven recommendations.** A card with a strong affiliate payout that fails the Year-2 captured value test does not get a "yes" recommendation.
- **Not headline aggregation.** "$1,400 in value!" with no friction adjustment is exactly what BCFM exists to push back on.
- **Not credit-score advice.** BCFM does not advise users on credit score improvement except where directly relevant to card approval probability.
- **Not investment advice.** Points are not investments. Cards are not investments. Methodology does not extend to balance transfers as financial products.

---

## §11. Known gaps (v2 work)

The following are flagged for v2 — they exist in ChatGPT chat history but were not recoverable during the automated extraction pass (file viewers in chatgpt.com UI timed out on uploaded .md content):

1. **Explicit derivation reasoning for UR 1.6¢ and MR 1.7¢.** Located in `portfolio_architecture_response.md` (MoneyFactor Command Center turn 23) or `MoneyFactor_Founder_Ops_Sprint_Memo.md` (turn 91).

2. **Explicit friction discount percentages.** Likely in the same files. Currently this doc states friction is "user-input-driven, contextual" — but if there are stated default percentages (e.g. portal-bound credit at 60% capture), those should be ported.

3. **Fit Score weighting formula.** Specified in the quiz spec within the ops sprint memo. Currently this doc states the inputs but not how they combine into the score.

4. **Year-1 / Year-2 worked examples.** Real card walk-throughs that show the four discounts in operation on a specific card (CSR, Amex Plat, Hilton Aspire). Useful for both editorial reference and as the spec for the Premium Card True Value Calculator.

5. **Business card evaluation differences in depth.** Currently §6 covers the categories — the methodology-level evaluation framework (vs. personal cards) is shallow here.

**Recovery path:** Manual recovery from ChatGPT. Open MoneyFactor Command Center → scroll to turns 23 and 91 → wait ~10 seconds for file viewer to load → copy text → paste here for v2 synthesis.

---

## §12. Source provenance

This doc was ported from ChatGPT chat history on 2026-05-20 via a structured extraction pass with Claude in Chrome. Source chats:
- MoneyFactor Command Center (chatgpt.com/g/g-p-69eeb104cbd0819199d645c6827c565c/c/69ecfd5e-17a0-83ea-9b68-a630f356989d)
- MoneyFactor Project Brief (chatgpt.com/c/6a03d6e3-d52c-8326-8a28-6e878bbc5302)
- MoneyFactor Strategy Continuation
- AGI / GSC analysis threads

Founder confirmation pass required: review §2 valuations, §4 Fit Score interpretation, §6 business card framing, and §10 "not" list. Anything that doesn't match doctrine as the founder remembers it should be corrected before this doc is treated as canonical.
