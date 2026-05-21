# LeaseFactor V0 Spec
_Last updated: 2026-05-20_

Implementation spec for the LeaseFactor V0 prototype. Governed by `ops/LEASEFACTOR_DOCTRINE.md` and `ops/MONEYFACTOR_VERTICAL_RULES.md`. This spec is the contract for what gets built in the Lovable / Perplexity / Claude prototype phase. Production migration is **not** in scope for this document.

---

## 0. New-path principles (read first)

These principles exist to prevent V0 from sliding into BCFM-era patterns. Every implementation decision below must conform.

1. **Tool first. Content second.** The product is the analyzer, not the article cluster. SEO-driven content pages come after the analyzer is real and useful.

2. **Completed analyses, not traffic.** Primary metric is completed lease analyses per day. Impressions, pageviews, and click-through rates are not goals.

3. **Data capture is the moat.** Every analysis is a structured record. If an analysis cannot become anonymized benchmark data, the design is wrong.

4. **No monetization in V0.** No affiliate links. No premium tiers. No lead capture for sales. No broker referrals. No dealer relationships. The product must work and prove value before any monetization layer exists.

5. **AI/GEO-citable output by default.** The LeaseFactor Report is structured for AI engine citation (Direct answer / Formula / Example / Warning / What to ask / Confidence caveat). Not a wall of prose. Not a marketing page.

6. **Explainable score, not opaque score.** The LeaseFactor Score must show its components. No black-box "trust us." Every flag and every number must be defensible to a skeptical user.

7. **Prototype is disposable.** V0 is Lovable / Perplexity / Claude. Not Next.js. Not production. The first thing built will be rebuilt before going to `moneyfactor.io/lease`. Plan accordingly.

8. **Language doctrine is binding.** No "honest math." No guaranteed savings. No specific lender rate claims without source. No precision pretense.

9. **No SEO-cluster build, no affiliate gating, no CTR optimization in V0.** Those are old-path concerns and do not apply at this stage.

10. **Stop conditions are real.** If V0 prototype does not feel meaningfully better than Leasehackr's calculator or a basic spreadsheet, do not advance to production. Iterate or kill.

---

## 1. V0 objective

Build a single-purpose web tool that answers one question for a specific user:

**"Is this lease actually a good deal?"**

The tool takes a lease quote (dealer numbers or owner-known numbers), returns a LeaseFactor Report containing a 0–100 score, a plain-English verdict, the key economic translations (implied APR, effective monthly cost, payment-to-MSRP ratio), deal-quality flags, a confidence tier, and a concrete "what to ask the dealer next" recommendation.

V0 is one tool. V0 is not a content site. V0 is not a marketplace. V0 is not a calculator collection.

---

## 2. User problem

**Target user:** Affluent, time-constrained consumer (household income $200K+, ages 35–60) about to sign or considering a lease, who wants confidence the deal is fair without spending three hours on Leasehackr or Reddit.

**The actual user moment:** They have a quote sheet, a screenshot, a verbal offer, or scratch numbers from a dealer visit. They want a second opinion in under two minutes.

**What they don't want:** A forum. A calculator that demands they understand money factor before they can use it. A page selling them broker services. A page asking them to upload a PDF before any value is delivered.

**What the V0 tool gives them:** Type in what they know. Get a clear, explainable report. Read the verdict. Understand the warnings. Walk back into the dealership with three smart questions.

---

## 3. Anti-patterns to actively avoid

These are the failure modes V0 must structurally prevent. Each one is something a competitor does that LeaseFactor is choosing not to do.

| Anti-pattern | Why we avoid it |
|---|---|
| Quote OCR upload as the first feature | Friction before value. Classic QuoteDefender trap. |
| Forum / community / comments in V0 | Leasehackr already owns enthusiast community. |
| Broker marketplace / dealer leads | Conflict of interest with "is this a good deal" framing. |
| Affiliate links in the analyzer or report | Compromises trust. V0 has no monetization. |
| "Save thousands" / "guaranteed savings" copy | Precision pretense. Doctrine forbids. |
| Specific live captive-finance rate claims | Cannot be sourced reliably. Doctrine forbids. |
| SEO-cluster content build before the tool works | BCFM antipattern. Tool first. |
| "Honest math" branding | Brand collision with HonestMath.com. Doctrine forbids. |
| Required email / account before using the tool | Friction kills completion rate. |
| Black-box score | Doctrine requires explainability. |
| Lead capture for dealer / broker sales | Misaligned incentives. Doctrine forbids. |
| Required PDF upload | Most users won't have one ready. |
| Generic "lease calculator" SEO target | Crowded, low-intent. Doctrine warns against. |
| Mass vehicle-page publishing in V0 | Comes after the tool, not before. |

---

## 4. Prototype tech choice

**Recommendation: Lovable (with Supabase backend) for Phase 0A-2.**

The data-capture moat (every analysis = a record) requires persistence. Lovable supports Supabase out of the box and is the lowest-friction path to a working full-stack prototype.

### Two-stage prototype path

**Phase 0A-1: Validate the UX.**
Build the analyzer as a Claude artifact or Lovable single-page (no persistence). Get 5–10 friend tests. Iterate the form, the report, the score weighting. Goal: does the tool feel meaningfully better than Leasehackr's calculator or a spreadsheet?

**Phase 0A-2: Start the data moat.**
Migrate to Lovable + Supabase (or Lovable with a backend table). Every completed analysis writes a structured record. Add optional email capture. Goal: 50+ completed analyses in benchmark database, structured for future aggregation.

If Phase 0A-1 does not produce "this is better" feedback, do not advance to 0A-2. Iterate or kill.

### Why not Perplexity

Perplexity is a search interface, not an interactive tool host. Wrong tool for this job.

### Why not Claude artifact for Phase 0A-2

Claude artifacts don't persist data across users. Phase 0A-2 needs Supabase or equivalent. Claude artifact is fine for Phase 0A-1 only.

---

## 5. Input schema

The analyzer accepts a single form. Inputs are typed, validated, and tiered by importance.

### Required for any analysis

| Field | Type | Constraint |
|---|---|---|
| msrp | number (USD) | > 0, < 500000 |
| sale_price | number (USD) | > 0, ≤ msrp + 20000 (sale price above MSRP allowed for some configurations but flagged) |
| monthly_payment | number (USD) | > 0, < 10000 |
| lease_term_months | integer | 12 ≤ x ≤ 60, multiples of 3 typically |
| due_at_signing | number (USD) | ≥ 0 |

### Strongly recommended

| Field | Type | Constraint |
|---|---|---|
| residual_percent | number (0–100) | 0 < x < 100 |
| money_factor | number | 0 ≤ x ≤ 0.025 (sanity ceiling) |
| miles_per_year | integer | 5000 ≤ x ≤ 25000 |
| acquisition_fee | number (USD) | 0 ≤ x ≤ 2000 |
| region_state | string (state code) | 2-letter US state |

### Helpful but optional

| Field | Type | Notes |
|---|---|---|
| make | string | Vehicle make |
| model | string | Vehicle model |
| trim | string | |
| model_year | integer | 2020 ≤ x ≤ 2027 (V0 scope) |
| incentives | number (USD) | ≥ 0 |
| doc_dealer_fees | number (USD) | ≥ 0 |
| taxes | number (USD) | ≥ 0 |
| lender | string | Free text |

### Input UX rules

- Required fields only show errors after blur or submit. No aggressive validation.
- "Strongly recommended" fields show a soft warning if blank: "Without this, we can't check for money factor markup."
- "Helpful but optional" fields are hidden behind an "Add vehicle details" expander.
- No multi-step wizard. One form, one screen. Mobile-first.
- A "Don't know this" button next to money factor and residual that tells the user what to ask the dealer.

---

## 6. Output / report spec

The LeaseFactor Report is a single scrollable result with the following blocks, in this order. The structure is intentional — it matches the AI/GEO answer-block doctrine.

### Block 1: Headline (Direct answer)

- **LeaseFactor Score:** 0–100, large display.
- **Confidence tier:** High / Medium / Low badge.
- **Plain-English verdict:** 1–2 sentences. Examples: "This looks like a fair deal with one risk to watch." / "This deal has a marked-up money factor and high due-at-signing. Worth pushing back." / "Not enough info to fully evaluate — get the money factor and residual from the dealer first."

### Block 2: The key numbers (Formula + Example)

A four-row block showing:

| Metric | Value | What it means |
|---|---|---|
| Implied APR | x.xx% | Money factor × 2400 |
| Effective monthly cost | $xxx | Monthly payment + (due at signing / lease term) |
| Payment-to-MSRP ratio | x.x% | Effective monthly cost / MSRP |
| Money factor | 0.00xxx | Compared to estimated buy rate range |

Each row has a hover/tap that shows the formula and a one-sentence explanation. This is the GEO "Formula + Example" block.

### Block 3: Flags (Warning)

A list of deal-quality flags that fired for this analysis. Each flag has:

- A short title ("Money factor may be marked up")
- A 1–2 sentence explanation
- Severity (info / caution / warning)

See §8 for the full flag set.

### Block 4: Score breakdown (Explainability)

The 0–100 score is composed of weighted sub-scores. The report shows each sub-score and its weight.

Example breakdown:

| Component | Weight | Score | Contribution |
|---|---|---|---|
| Money factor reasonableness | 25 | 80 | 20 |
| Effective monthly cost vs MSRP | 25 | 70 | 17.5 |
| Due-at-signing risk | 20 | 60 | 12 |
| Residual / cap cost sanity | 15 | 85 | 12.75 |
| Fees and incentives | 10 | 75 | 7.5 |
| Confidence adjustment | 5 | 100 | 5 |
| **Total** | **100** | — | **74.75** |

The score breakdown is collapsible but **always available**. No black-box.

### Block 5: What to ask the dealer next (Actionable next step)

3–5 concrete questions, prioritized by what's missing or what flagged. Examples:

- "Ask for the residual percentage on the contract."
- "Ask if the money factor includes a markup over the buy rate."
- "Ask what fees are included in the $xxx due at signing."

### Block 6: Confidence caveat

A short block explaining what could change the analysis if more inputs were provided. Required for any Medium or Low confidence report.

### Block 7: Save / share / get the brief (no email required)

- Copy report link (anonymized URL)
- Download PDF (Phase 0A-2)
- Optional email capture for MoneyFactor Brief (not required)

---

## 7. LeaseFactor Score v0 weighting

Score = weighted sum of six components, all on 0–100 scale.

### Component weights

| Component | Weight | Rationale |
|---|---|---|
| Money factor reasonableness | 25% | The single most-marked-up lease lever. |
| Effective monthly cost vs MSRP | 25% | Captures "is the actual all-in cost reasonable for this car." |
| Due-at-signing risk | 20% | Doctrine-priority warning area. |
| Residual / cap cost sanity | 15% | Detects unusual residuals or marked-up cap cost. |
| Fees and incentives | 10% | Catches acquisition fee gouge, missing rebates. |
| Confidence adjustment | 5% | Floors the score when inputs are missing. |

### Component sub-score rules (v0)

**Money factor reasonableness (25)**
- Need: money_factor input
- Compare implied APR to a reference band by vehicle class:
  - Mainstream non-luxury: reference band 3–7% APR
  - Luxury / premium: reference band 4–8% APR
  - EV / high-residual: reference band 2–6% APR
- Sub-score: 100 if APR ≤ low end of band; linear decline to 0 at 2x the high end of band.
- If money_factor not provided, sub-score = 50, confidence drops to Medium or Low.

**Effective monthly cost vs MSRP (25)**
- Compute effective_monthly = monthly_payment + (due_at_signing / lease_term_months)
- Compute ratio = effective_monthly / MSRP
- Reference: ratio of 1.0% (e.g. $700/mo on a $70K car) is roughly fair for many segments
- Sub-score: 100 at ratio ≤ 0.8%, 75 at 1.0%, 50 at 1.2%, 25 at 1.5%, 0 at ≥ 2.0%
- Note: this is a rough heuristic for v0; will be replaced with benchmark-data-driven thresholds once we have data

**Due-at-signing risk (20)**
- Compute upfront_ratio = due_at_signing / (monthly_payment × lease_term_months)
- Sub-score: 100 if upfront_ratio ≤ 0.05 (first month + fees only)
- Linear decline to 0 at upfront_ratio ≥ 0.40 (40% of total lease cost upfront)
- Severe flag fires above 0.20

**Residual / cap cost sanity (15)**
- Need: residual_percent
- Compute typical residual band by term + miles:
  - 36mo / 10K miles / mainstream: 50–62%
  - 36mo / 10K miles / luxury: 48–58%
  - 36mo / 10K miles / EV: 45–55%
  - 24mo: +6–8% absolute
  - 12K miles: -2%, 15K miles: -5%
- Sub-score: 100 if within band, declining outside band
- Compute discount_off_msrp = (msrp - sale_price) / msrp
- Mainstream good: 5–15% off MSRP; flag if 0% or negative

**Fees and incentives (10)**
- Acquisition fee: typical $595–$995 luxury, $395–$695 mainstream
- Doc/dealer fees: should be < $500 in most states
- Sub-score: 100 if all visible fees are within typical band, declining for outliers
- If fees not provided, sub-score = 75 (neutral)

**Confidence adjustment (5)**
- High confidence: full 5 points
- Medium confidence: 3 points
- Low confidence: 1 point

### Weighting governance

The weights above are v0 starting values. They will be adjusted after Phase 0A-1 user testing and again after Phase 0A-2 has 50+ data points. Weight adjustments are doctrine-level changes and require founder approval.

---

## 8. Confidence tier rules

### High confidence

All of these provided:
- msrp, sale_price, monthly_payment, lease_term_months, due_at_signing
- residual_percent
- money_factor
- region_state or lender

### Medium confidence

Required fields all provided, plus most strongly-recommended fields, but one or two important fields missing (e.g. money factor missing but residual present, or vice versa).

### Low confidence

Required fields only, with most strongly-recommended fields missing. Money factor missing AND residual missing automatically = Low confidence.

Low-confidence reports must show the confidence caveat block prominently and tell the user exactly which inputs would shift the analysis.

---

## 9. Deal-quality flag set (V0)

Each flag has: title, severity, condition, body text. Body text follows the language doctrine (no "honest math," no guaranteed savings, no specific lender claims).

| Flag | Severity | Condition |
|---|---|---|
| Money factor may be marked up | Warning | implied APR > vehicle class reference high end + 1.5pt |
| High due-at-signing risk | Warning | upfront_ratio > 0.20 |
| Effective monthly cost higher than visible payment | Caution | (effective_monthly - monthly_payment) / monthly_payment > 0.10 |
| Payment-to-MSRP ratio looks high | Caution | effective_monthly / msrp > 1.2% |
| Sale price near or above MSRP | Caution | sale_price ≥ msrp × 0.98 |
| Missing money factor prevents markup check | Info | money_factor not provided |
| Missing residual prevents full evaluation | Info | residual_percent not provided |
| Acquisition fee above typical band | Caution | acquisition_fee > class-typical high end + $200 |
| Lease term unusual | Info | lease_term_months not in {24, 33, 36, 39, 42, 48} |
| Miles per year low | Info | miles_per_year < 10000 (limits resale optionality) |
| Sale price discount worth confirming | Caution | (msrp - sale_price) / msrp < 0.03 for non-EV |

Flags are surfaced in the report regardless of score. They are the report's most valuable feature — the score is a summary; the flags are the actionable detail.

---

## 10. Data capture / moat plan

Every completed analysis is a structured record. The schema must be designed for future benchmark aggregation.

### Record schema (per analysis)

```
analysis_id (uuid)
created_at (timestamp)
inputs (json blob with all user-entered fields)
computed (json blob with all derived values)
score (number)
score_components (json)
flags_fired (array of flag IDs)
confidence_tier (enum)
region_state (string)
vehicle_class (enum: mainstream / luxury / EV / other)
make (string, nullable)
model (string, nullable)
model_year (integer, nullable)
session_id (anonymized, for repeat-usage tracking)
email (nullable, only if user opted in)
```

### Privacy posture

- No PII in the analysis record unless explicit opt-in (email).
- Session ID is anonymized (random UUID per browser session, no cross-session linking without account).
- All aggregated benchmark output is k-anonymous (no segment with fewer than N records shown publicly).

### Aggregation outputs (Phase 0B+, not V0)

- Median money factor by make/model/region/term
- Median LeaseFactor Score by vehicle class
- Common flags by make/model
- "Is this MF reasonable for a 2026 BMW X5?" reference data

Phase 0A-2 builds the storage. Phase 0B builds the aggregation pages.

---

## 11. Sample report (illustrative)

**Inputs:** 2026 BMW X5 xDrive40i, MSRP $72,400, sale price $69,500, monthly payment $895, 36 months, $4,500 due at signing, residual 58%, money factor 0.00245, region NY, acquisition fee $925.

**Output:**

```
LeaseFactor Score: 68 / 100
Confidence: High
Verdict: This looks like a reasonable luxury SUV lease with one
notable risk. The money factor is slightly above the typical band
for a credit-qualified buyer on this class, and the due-at-signing
amount adds meaningful upfront exposure. Worth asking the dealer
two questions before signing.

Key numbers:
  Implied APR:               5.88%   (money factor × 2400)
  Effective monthly cost:    $1,020  (monthly + due at signing / term)
  Payment-to-MSRP ratio:     1.41%   (effective monthly / MSRP)
  Money factor:              0.00245

Flags:
  ⚠ Money factor may be marked up
    Implied APR of 5.88% is above the typical credit-qualified
    band for this vehicle class. Ask the dealer if the money
    factor includes a markup over the buy rate.

  ⚠ High due-at-signing risk
    $4,500 upfront is 14% of total lease cost. If the vehicle is
    totaled early, that cash may not be recovered.

  ℹ Payment-to-MSRP ratio looks high
    1.41% is above the typical fair range for luxury SUVs at this
    MSRP. Could indicate cap cost or money factor markup.

Score breakdown:
  Money factor reasonableness   25 × 0.60 = 15.0
  Effective monthly vs MSRP     25 × 0.65 = 16.25
  Due-at-signing risk           20 × 0.55 = 11.0
  Residual / cap cost sanity    15 × 0.85 = 12.75
  Fees and incentives           10 × 0.75 = 7.5
  Confidence adjustment          5 × 1.00 = 5.0
                                Total:    67.5 → 68

What to ask the dealer next:
  1. "What's the buy-rate money factor before any markup?"
  2. "Can the due-at-signing be reduced to just first month + fees,
      with the rest rolled into the monthly?"
  3. "Are there any rebates or program incentives not reflected here?"

Confidence caveat:
  This analysis assumed standard credit-tier 1 pricing for the
  NY region. Actual program money factors vary by month, credit
  tier, and dealer program. Confirm with the dealer's program
  sheet before signing.
```

This sample is the contract for what every report looks like.

---

## 12. Non-goals (V0)

Explicit list of what V0 will not include. Each item is here because the doctrine forbids it at this phase, or because it would distract from the V0 objective.

- No dealer integration
- No broker marketplace or referrals
- No lender API integration
- No quote PDF/photo upload (OCR)
- No user accounts / authentication
- No public community / forum / comments
- No social sharing buttons beyond report-link copy
- No affiliate links anywhere in the tool or report
- No premium tier
- No newsletter signup wall
- No "we'll save you $X" copy
- No specific captive-finance rate claims by lender
- No mass vehicle-specific pages
- No general SEO content cluster
- No `/lease/[slug]` content in V0 prototype (production phase)
- No migration to Next.js / production repo until trigger criteria met

---

## 13. V0 validation metrics

### Phase 0A-1 (UX validation, ~5–10 testers)

- Did testers complete the form without prompting?
- Did testers understand the score and the verdict?
- Did testers find at least one flag actionable?
- Would testers recommend this to a friend about to sign a lease?

Pass criteria: 4 of 5 qualitative yes from testers.

### Phase 0A-2 (open prototype, target 50+ analyses)

**Primary:** completed lease analyses per day (target: 5+/day sustained).

**Secondary:**
- Repeat usage (same session ID returning with new quote)
- Average confidence tier distribution (>40% High target)
- Email capture rate among completers (no target — informational)
- Report-link share rate
- Returning users with updated dealer quote (qualitative)

**Stop conditions:**
- If completion rate < 50% (started but didn't finish) for 14 days, redesign the form.
- If reports feel slow / confusing / not differentiated vs. Leasehackr calculator, iterate or kill before Phase 0B.

---

## 14. Distribution plan (V0 phase only)

Per doctrine — faceless video, Beehiiv MoneyFactor Brief, Reddit research/commenting. No LinkedIn.

### Faceless video topics aligned to V0

- "Your lease payment is not the whole deal" (effective monthly cost)
- "Money factor to APR in 30 seconds"
- "Why putting money down on a lease is risky"
- "What to ask the dealer before you sign"
- "What is a good money factor in 2026?"

Each video drives to the LeaseFactor analyzer URL.

### Beehiiv MoneyFactor Brief

Restart cadence. Weekly. Include one lease primitive per issue with a CTA to the V0 analyzer. No affiliate, no sponsorship in V0 issues.

### Reddit

Research and substantive comment in r/askcarsales, r/Cartalk, r/Leases, r/personalfinance threads where lease questions appear. Per AUTHORITY_OUTREACH_LOG.md rules: no links, no LeaseFactor mention, under 200 words, conversational. Drafts must be human-written or voice-dictated, not AI-polished (Qwoted lesson applies).

### Not in V0 distribution

- No press / PR push
- No paid acquisition
- No sponsorship deals
- No influencer outreach
- No LinkedIn

---

## 15. Launch gate criteria (V0 → Phase 0B / production)

LeaseFactor moves from V0 prototype to production migration (`moneyfactor.io/lease`) only when all of these are true:

1. Phase 0A-2 has produced 50+ completed analyses with structured data captured
2. Median tester / user feedback says the tool is meaningfully better than Leasehackr calculator
3. The score weighting has been adjusted at least once based on real data
4. The benchmark aggregation plan has a concrete schema (Phase 0B spec exists)
5. MoneyFactor `/lease` architecture is agreed (URL structure, header, footer, methodology page placement)
6. No active BCFM production risk (no major BCFM issue being worked)
7. Command Center approves the migration explicitly

Until all 7 are true, LeaseFactor stays in private prototype. Doctrine §Build trigger governs.

---

## 16. Downstream artifacts (not in V0 scope, listed for clarity)

These exist on the LeaseFactor roadmap but are explicitly **not** part of V0:

- `ops/LEASEFACTOR_CONTENT_MAP.md` — full /lease content cluster planning
- `ops/LEASEFACTOR_BENCHMARK_SCHEMA.md` — Phase 0B aggregation spec
- `ops/LEASEFACTOR_PRODUCTION_TICKET.md` — Claude Code engineering ticket for /lease scaffold
- `ops/LEASEFACTOR_LAUNCH_PLAN.md` — V1 public launch sequence
- `ops/LEASEFACTOR_AFFILIATE_TARGETS.md` — research only, no implementation

V0 does not block on any of these. V0 ships the analyzer prototype and starts data capture.

---

## 17. Conformance check

Before V0 prototype is considered "shipped," verify against this doctrine + spec:

- [ ] Tool first, no content cluster shipped
- [ ] No affiliate, no monetization
- [ ] Score is explainable, breakdown visible
- [ ] All required flags implemented
- [ ] Data capture writes structured record per completed analysis
- [ ] Report follows AI/GEO answer-block structure
- [ ] Language doctrine respected (no "honest math," no guaranteed savings, no specific lender rate claims)
- [ ] Mobile-first form, no multi-step wizard
- [ ] Confidence tier visible on every report
- [ ] "What to ask the dealer next" present on every report
- [ ] No PDF upload, no OCR
- [ ] No accounts required
- [ ] Stop conditions reviewed before Phase 0B advance
