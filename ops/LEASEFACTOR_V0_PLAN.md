# LeaseFactor V0 Plan — Execution Sequence
_Last updated: 2026-05-20 (rescoped — see §Revision history)_

This is the **execution plan** for LeaseFactor V0. It governs sequence, owners, and decision gates. It does not duplicate doctrine or spec.

**Canonical references:**
- `ops/LEASEFACTOR_DOCTRINE.md` — strategic frame, scope, build triggers, language doctrine
- `ops/LEASEFACTOR_V0_SPEC.md` — product spec, formulas, schema, report structure, anti-patterns

If this plan conflicts with doctrine or spec, doctrine and spec win. This plan is sequencing only.

---

## §1. Current state

- LeaseFactor is in Phase 0A (active preparation and prototype).
- Doctrine and V0 spec are codified.
- No prototype built yet.
- BCFM is in stable maintenance — no further changes unless production rule is triggered.

## §2. What V0 is (and is not)

**Is:** A private prototype of the LeaseFactor analyzer tool. Single-page, mobile-first, form-to-report flow. Built in Lovable / Perplexity / Claude. Goal is to validate the UX and start the data-capture moat.

**Is not:** A production launch. A content site. A calculator collection. An affiliate property. A migration to `moneyfactor.io/lease`. Any of those come after V0 succeeds.

The production migration question is governed by Doctrine §Build trigger and V0 Spec §15 (Launch gate criteria). Until all seven gate criteria are met, the prototype stays private.

---

## §3. Two-stage prototype path

### Phase 0A-1 — UX validation (target: 3–5 working days)

**Goal:** Build the analyzer as a single-page tool with no persistence. Get 5–10 friend tests. Decide whether to advance.

**Tech:** Claude artifact OR Lovable single-page (no backend). Pick one — recommend Claude artifact for fastest iteration.

**Day-by-day** *(working days, not calendar days)*:

| Day | Work | Owner | Output |
|---|---|---|---|
| 1 | Build form per V0 Spec §5 (input schema) | Claude (in artifact) or Lovable | Working form, mobile-tested |
| 2 | Build report per V0 Spec §6 (output blocks) with sample data | Same | Working report layout |
| 3 | Wire form → score calculation per V0 Spec §7 (weighting) and flags per §9 | Same | End-to-end working tool |
| 4 | Friend test round 1 (3–5 testers) | Tim | Qualitative feedback |
| 5 | Iterate based on feedback. Decide: advance to 0A-2 or kill. | Tim + Cowork | Decision logged |

**Pass criteria to advance (V0 Spec §13):** 4 of 5 testers qualitatively say "yes" to: completed the form without prompting, understood the score and verdict, found at least one flag actionable, would recommend to a friend.

**Stop conditions:** If testers struggle with the form, can't read the score, or feel it's no better than Leasehackr — iterate or kill. Do not advance to 0A-2.

### Phase 0A-2 — Data capture (target: 2 weeks build + open testing)

**Goal:** Migrate prototype to Lovable + Supabase. Capture every analysis as a structured record per V0 Spec §10. Reach 50+ completed analyses.

**Tech:** Lovable + Supabase. URL still private (not under `moneyfactor.io/lease`).

**Week 1 (build):**
- Migrate the working analyzer from 0A-1 into Lovable + Supabase
- Implement record-write per V0 Spec §10 schema
- Add anonymized session ID
- Add optional email capture (not required)
- Add report-link copy / download
- Internal QA — Tim runs 10 self-test analyses and confirms records are clean

**Week 2 (open testing):**
- Share URL with broader circle (founder network, social, soft-share)
- Watch for 5+ analyses/day sustained
- Review record quality daily
- Adjust score weighting once based on real data (per V0 Spec §7)
- If issues surface, fix in place

**Pass criteria to advance to production planning (V0 Spec §15):**
1. 50+ completed analyses with structured data
2. Tester / user feedback says it's meaningfully better than Leasehackr
3. Score weighting adjusted at least once based on real data
4. Phase 0B benchmark schema drafted (separate ticket)
5. MoneyFactor `/lease` architecture agreed
6. No active BCFM production risk
7. Command Center approval

Until all 7 land, do not migrate to `moneyfactor.io/lease`.

---

## §4. BCFM posture during V0 build

BCFM is in **stable maintenance**. No further changes during V0 build unless:

1. GSC shows a clear emergency
2. An affiliate approval lands and requires a site change
3. A production bug is detected
4. Trust / compliance copy is found inaccurate
5. Founder explicitly approves

### Withdrawn recommendation

An earlier proposal in this document (prior version) suggested a BCFM title/meta surgery sprint on 6 pages over 2 days. That recommendation is withdrawn for three reasons:

1. **Doctrinal:** Per ChatGPT-confirmed doctrine, BCFM's primary issue is ranking depth on meaningful queries, not CTR.
2. **Empirical:** Three rounds of BCFM snippet optimization have already been committed in May (commits c2a1a43, 1755143, b687477). Additional title/meta work is unlikely to yield differentially.
3. **Operational:** Doctrine is "keep BCFM stable; do not keep tinkering." The CTR sprint was old-path thinking.

BCFM stays exactly as-is for the V0 build window. Re-evaluation happens after Phase 0A-2 completes, not before.

---

## §5. Distribution rollout aligned with V0

Per doctrine — faceless video, Beehiiv MoneyFactor Brief, Reddit. No LinkedIn. No paid acquisition. No press push.

### Phase 0A-1 (UX validation phase)

- No public distribution.
- Friend-test sharing only.
- No social posts. No video.

### Phase 0A-2 (data capture phase)

- **Week 1 (build):** still private.
- **Week 2 (open testing):**
  - Faceless video 1: "Your lease payment is not the whole deal" → CTA to analyzer
  - Faceless video 2: "Money factor to APR in 30 seconds" → CTA to analyzer
  - Beehiiv MoneyFactor Brief issue 1 — relaunch issue covering one lease primitive + CTA to analyzer
  - Reddit research / commenting in r/askcarsales, r/Cartalk, r/Leases per AUTHORITY_OUTREACH_LOG.md rules (no links, no LeaseFactor mention, under 200 words, conversational, human-written or voice-dictated — not AI-polished)

### Distribution not in V0

- No press / PR push
- No paid acquisition
- No sponsorship deals
- No influencer outreach
- No LinkedIn

---

## §6. Owners and lanes

Per `ops/AGENT_ROLES.md`:

| Work | Owner lane | Notes |
|---|---|---|
| Build the Phase 0A-1 analyzer in Claude artifact / Lovable | Cowork (Claude chat) | Tim drives, Cowork executes |
| Friend-test coordination | Tim | Outside the agent lanes |
| Iteration based on feedback | Cowork | Tim provides feedback, Cowork updates artifact |
| Phase 0A-2 Lovable + Supabase build | Cowork + Tim | Cowork drafts schema/code; Tim deploys Supabase + connects Lovable |
| Phase 0A-2 record quality review | Cowork | Daily during week 2 of 0A-2 |
| Faceless video scripts | Cowork | Tim records / publishes |
| Beehiiv Brief copy | Cowork | Tim publishes |
| Reddit drafts | Tim | Per AUTHORITY_OUTREACH_LOG.md rules — must be human-written or voice-dictated |
| Production migration to `moneyfactor.io/lease` | Claude Code | After all 7 launch gates met, separate ticket |

---

## §7. Decision gates and what's NOT a decision

### Open operational questions

1. **Tech choice for Phase 0A-1.** Claude artifact (fastest iteration, no persistence) vs. Lovable single-page (slower, but smoother migration to 0A-2). Recommend Claude artifact.

2. **Beehiiv Brief positioning.** Is it a relaunch of the prior BCFM-era newsletter, or a clean MoneyFactor Brief launch? This affects subscriber import and naming.

3. **Faceless video host/style.** Format and cadence — separate operational question, not blocking V0 prototype build.

### What's NOT a decision anymore (resolved by doctrine + spec)

| Prior open question | Resolution |
|---|---|
| URL architecture | `moneyfactor.io/lease` confirmed (Doctrine + Spec) — but production migration is gated, not in V0 |
| Methodology naming | Language doctrine in `LEASEFACTOR_DOCTRINE.md` §Language doctrine governs. No "honest math." Approved terms include "LeaseFactor Score," "real-world lease math," "deal-quality flags," "confidence tier." |
| Calculator vs. content priority | Tool first. Content after. Resolved by doctrine. |
| V0 affiliate strategy | No affiliate in V0. Resolved by doctrine and spec §0 + §3 + §12. |
| Founder review cadence | Per existing recurring workflows. No separate cadence for LeaseFactor V0. |
| Doctrine §12 revision | Not needed in the form previously drafted — doctrine now governs LeaseFactor independently. The "two simultaneously-active verticals" constraint is informational; BCFM is in stable maintenance, so this is moot for V0. |
| 14-day production-repo build path | Killed. Replaced by Phase 0A-1 / 0A-2 prototype path. |
| 15-article content cluster | Killed for V0. Content map is Phase 0B+ work. |
| BCFM title/meta surgery sprint | Withdrawn (see §4). |

---

## §8. Success criteria (V0 as a whole)

V0 is successful when **all** of the following are true:

1. Phase 0A-1 prototype shipped and tested with 5+ friends.
2. Phase 0A-2 prototype shipped, 50+ completed analyses captured with clean structured data.
3. At least one score-weighting adjustment made based on real data.
4. At least one tester has returned with an updated dealer quote (qualitative validation).
5. No regression in BCFM during the V0 build window.

If 4 of 5 land, V0 is a pass. If fewer than 4 land, the question becomes whether to iterate the analyzer or step back to the spec.

---

## §9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Prototype doesn't feel meaningfully better than Leasehackr | Stop conditions in Phase 0A-1. Kill or iterate before 0A-2. |
| Friends don't have a lease quote to test with | Provide sample inputs (see V0 Spec §11). |
| BCFM regresses further during V0 build | Stable maintenance is the doctrine; do not divert focus to BCFM rescue unless production rule fires. |
| Score weighting feels arbitrary | Spec §7 explicitly flags weights as v0 starting values. Adjustment after real data is built into the plan. |
| Data capture schema is wrong | Phase 0A-2 week 1 is for schema iteration; record quality review is part of the plan. |
| Distribution creates pressure to skip validation | Phase 0A-1 has zero public distribution. Phase 0A-2 distribution is soft. No PR / paid in V0. |
| Affiliate temptation creeps in | Spec §0 and §12 forbid affiliate in V0. Doctrine forbids monetization before product has usage. |

---

## §10. Revision history

**2026-05-20 (rescope):** Replaced the prior 13-section, ~600-line plan that proposed a 14-day production-repo build at `moneyfactor.io/lease` with a 15-article content cluster, a calculator, and a §12 doctrine revision. That path was old-path thinking: production-first, content-heavy, SEO-cluster-oriented, affiliate-implicit. Replaced with the Phase 0A-1 / 0A-2 prototype path per `ops/LEASEFACTOR_DOCTRINE.md` and `ops/LEASEFACTOR_V0_SPEC.md`. Withdrew the embedded BCFM title/meta surgery proposal. Killed the §10 "6 open founder decisions" list — most are resolved by doctrine; remaining ones moved to §7 operational questions.

**2026-05-20 (initial):** Original V0 plan drafted. See git history for the prior version.
