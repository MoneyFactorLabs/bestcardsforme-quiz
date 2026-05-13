# Recurring Workflows — MoneyFactor / BestCardsForMe

_Last updated: 2026-05-12_

This document defines what runs on what cadence, who owns each workflow, and the trigger conditions that move workflows from routine to escalation. Use with `ops/DISPATCH_PROTOCOL.md` for mobile-fired execution and `ops/PROMPT_LIBRARY.md` for ready-to-use prompts.

---

## Daily workflows

### D1. GSC daily quick read
- **Cadence:** Every weekday morning (skip weekends unless following a deploy)
- **Owner:** Dispatch → Claude chat
- **Prompt:** "GSC daily check" from PROMPT_LIBRARY.md
- **Time:** ~5-10 minutes
- **Output:** Append to `ops/GSC_LOG.md`
- **Escalation:** If any URL drops more than 5 positions overnight, surface for founder review
- **Skip rule:** Skip if no significant change expected (e.g., immediate post-weekend with no Friday deploys)

### D2. HARO / Source of Sources / Qwoted digest scan
- **Cadence:** Every weekday
- **Owner:** Founder fires via Dispatch; Claude chat evaluates fit
- **Prompt:** "Source request evaluation" + "Authority outreach response draft" from PROMPT_LIBRARY.md
- **Time:** ~10-15 minutes
- **Output:** Drafts in chat for founder review before sending
- **Escalation:** Skip rules in `ops/MONEYFACTOR_VERTICAL_RULES.md` apply — never respond outside the credit card / annual fee / rewards / travel rewards / consumer credit scope

### D3. Reddit substantive reply
- **Cadence:** Every 1-2 days at maximum (per AUTHORITY_OUTREACH_LOG.md rule)
- **Owner:** Founder posts from own account; Claude chat drafts
- **Reference:** `BCFM_Reddit_Response_Bank.md` for tone and patterns
- **Rules:** No links, no BCFM mention, under 200 words, conversational
- **Skip rule:** Skip r/awardtravel; skip threads with 50+ comments

---

## Weekly workflows

### W1. GSC weekly comparative read
- **Cadence:** Every Monday
- **Owner:** Dispatch → Claude chat
- **Prompt:** "GSC weekly comparative read" from PROMPT_LIBRARY.md
- **Time:** ~15-20 minutes
- **Output:** Append to `ops/GSC_LOG.md` with date header
- **Escalation:** If impressions stall (no week-over-week growth for 2 consecutive weeks), surface for strategic review

### W2. AI citation tracking pull
- **Cadence:** Every Friday
- **Owner:** Dispatch → Claude chat (uses Chrome extension for live AI engine queries)
- **Prompt:** "AI citation weekly tracking" from PROMPT_LIBRARY.md
- **Time:** ~30-45 minutes
- **Output:** Append to `ops/AI_CITATION_TRACKING.md`
- **Escalation:** If citation score drops 20%+ week-over-week, investigate cause (algorithm shift, content drift, competitor surge)

### W3. Affiliate application status review
- **Cadence:** Every Wednesday
- **Owner:** Founder + Claude chat
- **Prompt:** "Affiliate application status update" from PROMPT_LIBRARY.md
- **Time:** ~10-15 minutes
- **Output:** Update `ops/AFFILIATE_STATUS.md`
- **Escalation:** When CJ approval lands or when 14 days have passed since FlexOffers decline (reapply window opens)

### W4. Authority outreach activity log
- **Cadence:** Every Friday
- **Owner:** Founder + Claude chat
- **Output:** Update `ops/AUTHORITY_OUTREACH_LOG.md` with week's activity
- **Escalation:** Track to ensure consistent activity; if <2 outreach actions in a given week, flag for next-week plan

---

## Monthly workflows

### M1. Indexing audit
- **Cadence:** First Monday of each month
- **Owner:** Dispatch → Claude chat
- **Prompt:** "Indexing audit" from DISPATCH_PROTOCOL.md
- **Output:** Append to `ops/GSC_LOG.md`
- **Escalation:** If any URL listed in sitemap is "Crawled - currently not indexed" for 60+ days, escalate as content quality / canonical issue

### M2. Content refresh check
- **Cadence:** Last week of each month
- **Owner:** Claude chat (could be Dispatch for read-only audit; founder approves any rewrite)
- **Prompt:** "Content refresh audit" from PROMPT_LIBRARY.md
- **Scope:** Rotate through 6-8 articles per month so every article gets checked quarterly
- **Output:** In chat with refresh recommendations; if rewrite warranted, queue as separate dispatch
- **Escalation:** When issuer announces fee change or program refresh, immediate triggered audit (see Triggered workflows)

### M3. Doctrine review
- **Cadence:** First Sunday of each month
- **Owner:** Founder + Claude chat (strategic session)
- **Prompt:** "Doctrine review" from DISPATCH_PROTOCOL.md
- **Scope:** Review `DOCTRINE.md`, `ops/MONEYFACTOR_VERTICAL_RULES.md`, `ops/AGENT_ROLES.md` for drift vs operating reality
- **Output:** `~/Documents/MoneyFactor/Doctrine_Review_[date].md`
- **Escalation:** Doctrine changes require founder approval; no autonomous doctrine edits

### M4. Authority outreach inventory
- **Cadence:** Last week of each month
- **Owner:** Founder + Claude chat
- **Output:** Update `ops/AUTHORITY_OUTREACH_LOG.md` with month's outcomes (responses received, mentions earned, backlinks acquired)
- **Escalation:** If zero backlinks earned in a 30-day window, escalate as backlink-strategy review

---

## Triggered workflows (event-driven)

These don't run on cadence; they run when specific events occur.

### T1. Issuer fee change announced
- **Trigger:** Major issuer (Chase, Amex, Capital One, Citi) announces fee change, program refresh, or material credit modification
- **Owner:** Claude chat (immediate audit) → Claude Code (any code/content updates)
- **Actions:**
  1. Identify all BCFM articles referencing the affected card
  2. Audit for staleness
  3. Queue updates to ensure published content reflects new terms within 72 hours
  4. If change is material (>10% fee shift, major benefit change), draft a "what changed" article
- **Escalation:** If 5+ articles need updates, surface as a sprint rather than individual edits

### T2. CJ Affiliate approval lands
- **Trigger:** Any CJ application moves from "pending" to "approved"
- **Owner:** Founder + Claude Code
- **Actions:**
  1. Update `ops/AFFILIATE_STATUS.md`
  2. Generate tracking link for the approved advertiser
  3. Deploy /go/[slug] redirect via Claude Code
  4. Verify the redirect resolves to the affiliate URL with tracking parameters
  5. Begin monitoring for first conversion event
- **Escalation:** None — proceed to deployment

### T3. First affiliate revenue event
- **Trigger:** First confirmed affiliate revenue (any network, any card)
- **Owner:** Founder + Claude chat
- **Actions:**
  1. Document the event in `ops/AFFILIATE_STATUS.md` with date, network, card, amount
  2. Verify conversion attribution is working correctly
  3. Surface as a major milestone (this is the first proof point of the validation engine)
- **Escalation:** First revenue triggers a strategic review of LeaseFactor activation timing per doctrine §12 (revenue trigger gating)

### T4. GSC impression milestone crossed
- **Trigger:** Sustained 2,000+ weekly impressions for 3 consecutive weeks
- **Owner:** Claude chat strategic review
- **Actions:**
  1. CTR snippet review — confirm all top-10 URLs have optimized titles and meta descriptions
  2. Review which queries are driving impression growth
  3. Identify whether additional content is justified (only if cluster gaps exist)
- **Escalation:** This is one of the conditions for LeaseFactor activation per doctrine §12

### T5. AI citation score crosses 50%
- **Trigger:** Weekly AI citation tracking score crosses 50% sustained
- **Owner:** Claude chat strategic review
- **Actions:**
  1. Document the milestone in `ops/AI_CITATION_TRACKING.md`
  2. Surface as a major brand-recognition milestone
  3. Consider methodology page expansion (calculator deployment, framework page) per the research findings
- **Escalation:** Strategic decision point on whether to accelerate LeaseFactor preparation given AI engine recognition

### T6. Vercel deploy fails or production issue detected
- **Trigger:** Any failed deploy or production error
- **Owner:** Claude Code (immediate) + Chrome extension (verification)
- **Actions:**
  1. Identify failure mode (build error, runtime error, deploy timeout)
  2. Rollback if production was affected
  3. Diagnose and fix
  4. Re-deploy and verify
- **Escalation:** If production was down >15 minutes, document in `ops/CURRENT_STATUS.md` and review for systemic causes

### T7. Doctrine §12 vertical activation trigger met
- **Trigger:** BCFM sustains $1,500/month in revenue OR 8,000 monthly organic visits for 30 consecutive days
- **Owner:** Founder + Claude chat (strategic decision required)
- **Actions:**
  1. Verify trigger is genuinely met (not transient spike)
  2. Review LeaseFactor preparation status (per LEASEFACTOR_PLAYBOOK.md if exists)
  3. Founder decides: activate LeaseFactor, hold for more BCFM validation, or pivot
- **Escalation:** This is the most consequential triggered workflow. Do not autonomous-execute. Surface for founder decision with all relevant context.

---

## Workflow output ownership

Where outputs go:

| Workflow type | Output destination |
|---|---|
| GSC reads | `ops/GSC_LOG.md` |
| AI citation tracking | `ops/AI_CITATION_TRACKING.md` |
| Affiliate status updates | `ops/AFFILIATE_STATUS.md` |
| Outreach activity | `ops/AUTHORITY_OUTREACH_LOG.md` |
| Strategic reviews | `~/Documents/MoneyFactor/[Topic]_Review_[date].md` |
| Indexing audits | `ops/GSC_LOG.md` (dated section) |
| Doctrine reviews | `~/Documents/MoneyFactor/Doctrine_Review_[date].md` |
| Triggered workflow actions | `ops/CURRENT_STATUS.md` (state update) + specific topic file |

Anything that should be in the repo (ops docs, code, content) goes to the repo via Claude Code. Anything that's working analysis or research goes to `~/Documents/MoneyFactor/` for founder review.

---

## What this document is NOT

- **Not a project management system.** It's a cadence reference. Status of any specific task lives in `ops/CURRENT_STATUS.md` or `ops/NEXT_ACTIONS.md`.
- **Not a complete automation framework.** Each workflow still requires founder fire (Dispatch brief) or live Claude session. The cadence defines what should happen; the founder's mobile or desktop session initiates it.
- **Not a substitute for doctrine.** Doctrine constraints (no vertical activation without trigger, etc.) always supersede workflow cadence. If a triggered workflow would violate doctrine, the workflow stops.

---

## Updating this document

Workflows will evolve as patterns emerge from actual use:

- Daily workflows that produce no useful signal for 4 weeks → demote to weekly or remove
- Weekly workflows that consistently surface action items → consider promoting elements to daily
- Triggered workflows that fire frequently → review whether they should become routine
- New patterns observed → add as new workflow definitions

Review this document monthly as part of M3 (doctrine review). Adjust cadence based on what actually compounds value vs what consumes time without yield.
