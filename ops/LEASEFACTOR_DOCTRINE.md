# LeaseFactor Doctrine
_Last updated: 2026-05-20_

This doctrine governs all LeaseFactor strategy, scope, and product decisions. The downstream `ops/LEASEFACTOR_V0_SPEC.md` must conform to this document.

---

## LeaseFactor status

LeaseFactor is strategically defined but not approved for full public build.

BCFM was the first live validation engine. MoneyFactor is now the platform direction. BestCardsForMe remains the cards vertical. LeaseFactor is the next active growth wedge because the "money factor" lease-search landscape is more directly aligned with the MoneyFactor brand than credit-card SERPs.

LeaseFactor moves from passive Phase 0 to active Phase 0A: fast spec/prototype work, not full public production launch.

---

## Core positioning

LeaseFactor is **not** a generic lease calculator, dealer marketplace, broker marketplace, forum clone, or QuoteDefender clone.

LeaseFactor **is** a lease-decision intelligence tool by MoneyFactor.

### Primary user question

"Is this lease actually a good deal?"

### Secondary questions

- Am I overpaying?
- Is my money factor marked up?
- What APR does this money factor imply?
- What is my effective monthly cost?
- Am I taking too much risk with money due at signing?
- Should I consider one-pay or MSDs?
- Should I buy out my lease?
- Do I have hidden equity?
- What should I ask the dealer next?

### Target user

Affluent, time-constrained consumers who want confidence before signing a lease without spending hours in Leasehackr, Reddit, dealer forums, or broker threads.

---

## Strategic context

Credit-card SERPs are hostile. They are dominated by AI Overviews, Reddit, issuers, NerdWallet, The Points Guy, Bankrate, and other high-authority incumbents.

Lease SERPs are not empty, but they are more fragmented and more product-friendly. Existing sources include Leasehackr, Reddit, Edmunds, U.S. News, dealer pages, calculators, QuoteDefender, YouTube, and local dealer content.

**Correct competitive read:** LeaseFactor is not entering an empty market. Leasehackr and Reddit already have real trust and are cited in AI/Google results. The opportunity is not "nobody owns this." The opportunity is that existing winning experiences are useful but messy, forum-heavy, enthusiast-oriented, dealer-influenced, or not optimized for a clean consumer decision workflow.

LeaseFactor must win by being **simpler, clearer, more structured, and more decision-focused**.

---

## Phase 0A — active preparation and prototype

### Allowed now

- LeaseFactor V0 product spec
- Input schema
- Money factor calculator logic
- LeaseFactor Score v0 assumptions
- Confidence tiers
- Deal-quality flags
- Sample report format
- Content/tool map
- Private prototype in Lovable, Perplexity, or Claude
- Competitor research
- SERP research
- Data capture plan
- MoneyFactor `/lease` architecture planning

### Not allowed yet

- Public launch
- Mass article publishing
- Dealer integrations
- Broker marketplace
- Live lender APIs
- Quote upload/OCR as the first feature
- Concierge negotiation
- CRM
- User accounts
- Public community/forum
- Lead-selling marketplace
- Production migration without approval

---

## Build trigger

LeaseFactor can move from private prototype/spec into production build when Command Center approves one of these triggers:

- BCFM remains stable enough to leave alone
- MoneyFactor platform architecture is agreed
- LeaseFactor V0 prototype proves useful
- The initial analyzer/report feels meaningfully better than existing calculators
- There is a clear first-party data capture path
- There is a clean launch plan for `/lease`
- No production risk to existing BCFM traffic
- No overbuilt marketplace/broker scope

**Doctrine revision note:** Earlier doctrine said LeaseFactor should wait for BCFM consistent clicks, affiliate approvals, or compounding traffic. That has been revised. BCFM remains useful, but it should not be the only gate. MoneyFactor/LeaseFactor can move forward in private prototype and controlled production planning while BCFM stays stable.

---

## V0 product definition

LeaseFactor V0 should be a lightweight lease-deal analyzer and education hub.

### Core tool: Lease Deal Analyzer

**Inputs:**

- Vehicle make
- Vehicle model
- Trim
- Model year
- MSRP
- Selling price / adjusted cap cost
- Monthly payment
- Lease term in months
- Miles per year
- Due at signing
- Residual value or residual percentage
- Money factor
- Incentives / rebates
- Acquisition fee
- Dealer / doc fees
- Taxes if known
- Region / state
- Lender if known

**Outputs:**

- LeaseFactor Score from 0–100
- Implied APR from money factor
- Effective monthly cost including due at signing
- Payment as percentage of MSRP
- Key deal warnings
- Money factor markup warning
- Due-at-signing / down-payment risk warning
- Payment-to-MSRP warning
- Confidence tier: High / Medium / Low
- Plain-English verdict
- What to ask the dealer next

### Required formulas

- **APR estimate** = money factor × 2400
- **Effective monthly cost** = monthly payment + (due at signing / lease term)
- **Payment-to-MSRP ratio** = effective monthly cost / MSRP

---

## Score v0 philosophy

Do not optimize for perfect precision early.

Optimize for: trust, clarity, completion rate, structured data capture, useful warnings, explainability, and a report users can understand and share.

LeaseFactor Score should not claim to know the exact market unless benchmark data exists.

Score should combine:

- Payment relative to MSRP
- Money factor / implied APR reasonableness
- Effective monthly cost
- Due-at-signing risk
- Residual / cap-cost consistency
- Incentives and fees
- Confidence level based on missing / available inputs

---

## Confidence tiers

### High confidence

- MSRP provided
- Payment provided
- Term provided
- Due at signing provided
- Money factor provided
- Residual provided
- Cap cost / selling price provided
- Region / lender known

### Medium confidence

Most major fields provided, but one or two important fields missing.

### Low confidence

- Payment / MSRP / term only
- No money factor
- No residual
- Unclear due at signing
- Unclear taxes / fees

Low-confidence reports should still be useful, but must clearly say which missing inputs could change the answer.

---

## Deal-quality flags

V0 should include flags such as:

- Money factor may be marked up
- Effective monthly cost is higher than the visible payment
- Large due-at-signing amount increases risk
- Payment looks high relative to MSRP
- Missing residual prevents full evaluation
- Missing money factor prevents markup check
- One-pay lease may reduce finance charges but increases upfront exposure
- Lease-end buyout may deserve analysis if current market value exceeds buyout
- Dealer quote needs more detail before signing

---

## Down-payment risk doctrine

LeaseFactor should warn that large upfront cash on a lease can be risky because cash paid upfront may not be recovered if the vehicle is totaled or stolen early in the lease.

**Preferred framing:** A lower monthly payment is not automatically a better lease if it required a large amount due at signing.

---

## One-pay lease doctrine

LeaseFactor should explain one-pay leases carefully.

**Potential benefit:**

- May reduce finance / rent charge
- May receive lower money factor in some programs
- Can reduce total cost for cash-rich buyers

**Risks:**

- Large upfront exposure
- Opportunity cost
- Less flexibility
- Not always available or worthwhile

---

## Lease-end doctrine

LeaseFactor should eventually support lease-end decisions:

- Buy out
- Return
- Sell / trade
- Roll into a new lease
- Evaluate hidden equity
- Compare buyout to current market value

This is strategically important because lease-end equity / intelligence can be a differentiated lifecycle product.

---

## First content / tool map

Initial `/lease` structure should prioritize tool-led pages, not mass content.

### Recommended V0 pages

```
/lease
/lease/money-factor
/lease/money-factor-to-apr
/lease/is-this-lease-good
/lease/should-you-put-money-down
/lease/one-pay-lease
/lease/good-money-factor
/lease/lease-vs-buy
/lease/residual-value
/lease/lease-fees
/lease/lease-buyout-vs-new-lease
```

Avoid starting with generic "lease calculator" as the main SEO target. It is too crowded. Start with specific decision and money-factor queries.

---

## Vehicle-specific pages

Vehicle-specific pages are a likely growth wedge, but should come after the core tool/report structure exists.

### Examples

- 2026 Honda CR-V money factor
- 2026 BMW X5 money factor
- 2026 Jeep Grand Cherokee money factor
- 2026 Lexus RX money factor
- 2026 Tesla Model Y lease math
- 2026 Mercedes GLE money factor
- 2026 Audi Q5 money factor

**Important caveat:** Do not claim live, official, real-time captive finance rates unless we actually have a reliable source. Use careful language: money factors vary by lender, region, trim, credit tier, term, incentives, dealer markup, and program date.

---

## Data moat

The long-term moat is not articles.

The long-term moat is:

- Submitted lease quotes
- Saved reports
- Anonymized lease economics
- Benchmark density by model / region / lender
- Score history
- Confidence-weighted market scoring
- Monthly LeaseFactor reports
- Lease-end equity intelligence
- Lender behavior intelligence
- AI-readable benchmark pages
- Consistent terminology

V0 should be designed so that every completed analysis can eventually become anonymized benchmark data.

---

## Validation metrics

### Primary V0 metric

Completed lease analyses per day.

### Secondary metrics

- Repeat usage
- Email capture
- Report saves
- Data quality
- Benchmark density by model / region
- Percentage of analyses with high / medium confidence
- Number of users who share / download report
- Number of users who return with updated dealer quote

**Traffic is not the primary metric. Completed analyses are.**

---

## Monetization philosophy

Avoid broker / dealer relationship-heavy operations early.

Do not become a concierge or relationship-heavy broker / dealer business.

### Preferred future monetization

- Display / sponsorship
- Affiliate / referral where compliant
- Lease report sponsorship
- Lender / insurance / credit partner referrals where appropriate
- Premium reports
- Data / benchmark products
- API / data partnerships later

**Do not build the monetization layer before the product has usage.**

---

## Competitive positioning

### Leasehackr

- Strong calculator
- Strong enthusiast community
- Real deal examples
- Broker marketplace activity
- Real credibility
- Can be overwhelming, forum-heavy, and enthusiast-oriented

### QuoteDefender

- Quote decoding / upload lane
- Markup / fee detection lane
- Overlaps with some V0 concepts

### LeaseFactor

- Simpler decision workflow
- Score + warnings + confidence tier
- Effective monthly cost
- Money factor / APR translation
- Benchmark / report orientation
- Lease lifecycle intelligence
- Affluent / time-constrained shopper positioning

**Do not copy Leasehackr. Do not copy QuoteDefender.**

---

## AI / GEO doctrine

LeaseFactor should produce AI-citable structured outputs.

### Future report examples

- BMW X5 LeaseFactor Report — May 2026
- 2026 Honda CR-V Money Factor Guide
- What Is a Good Lease Payment on a $75,000 SUV?
- Lease Buyout vs New Lease Analysis
- Should You Put Money Down on a Lease?

### Consistent answer blocks

- Direct answer
- Formula
- Example
- Warning
- What to ask next
- Confidence caveat

---

## Language doctrine

### Preferred language

- LeaseFactor Score
- Deal-quality flags
- Real-world lease math
- Confidence tier
- Confidence-weighted benchmark
- Effective monthly cost
- MoneyFactor methodology
- Real-world value framework
- What to ask the dealer next

### Avoid

- "Honest math" as branded language
- Guaranteed savings
- Exact current lender-rate claims without source
- Financial / legal / tax advice
- Broker / dealer marketplace language
- Pretending precision when data is incomplete

---

## BusinessFactor separation

Business finance should stay separate from MoneyFactor's consumer / personal-finance platform.

BusinessFactor may later become a separate platform for:

- Business brokerage
- SBA loans
- Business acquisition financing
- Business credit cards
- Business software
- Working capital
- CRE finance
- Small-business automation

Business credit-card articles can remain inside BCFM where relevant, but broader business finance does not belong inside MoneyFactor's consumer platform right now.

---

## Final positioning

LeaseFactor helps affluent, time-constrained consumers understand whether a lease is good, whether they are overpaying, whether the money factor is marked up, whether they should buy out a lease, whether hidden equity exists, and what the smartest next move is — without spending hours in forums.

---

## Downstream

This doctrine governs `ops/LEASEFACTOR_V0_SPEC.md` (to be created). The V0 spec must conform to:

- The Phase 0A allowed / not-allowed scope
- The build trigger gating
- The V0 product definition (inputs, outputs, formulas)
- The score philosophy (trust > precision)
- The confidence-tier framework
- The deal-quality flag set
- The validation-metric priority (completed analyses, not traffic)
- The language doctrine (preferred terms, banned terms)
