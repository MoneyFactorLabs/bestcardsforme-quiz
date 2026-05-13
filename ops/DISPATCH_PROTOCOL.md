# Dispatch Protocol — MoneyFactor / BestCardsForMe

_Last updated: 2026-05-12_

This document defines how to use Claude Dispatch effectively for mobile → desktop task handoff. Dispatch is the lane that lets the founder fire briefs from mobile and have desktop Claude execute asynchronously while the founder is away.

---

## What Dispatch is for

**Use Dispatch when:**
- The task is well-bounded (specific scope, specific output)
- The founder won't be at desktop for hours but wants work to proceed
- The task doesn't require back-and-forth conversation
- The output can be reviewed asynchronously when the founder returns
- The action is reversible or read-only (drafts, audits, research, file writes — not commits)

**Do NOT use Dispatch when:**
- The task requires real-time iteration or clarification
- The task involves irreversible action (commits to main, application submissions, financial actions)
- The founder needs to see partial results to course-correct
- The brief is too vague to execute without back-and-forth ("figure out what to do about X")
- The action falls under prohibited actions (account creation, transactions, etc.)

---

## Brief format

Every dispatch brief follows this structure. Mobile-typed, four sections, no preamble.

```
TITLE: [short task name]

SCOPE:
[1-3 sentences describing what to do]

ACCEPTANCE:
[1-3 bullet points describing what "done" looks like]

OUTPUT:
[where the result goes — file path, summary location, or "report in chat"]
```

**Example — research dispatch:**

```
TITLE: Competitor backlink scan for premium card content

SCOPE:
Pull current top-10 ranking pages for "amex platinum vs chase sapphire reserve 2026" and identify which sites have the most authoritative backlinks. Skip Bankrate and NerdWallet.

ACCEPTANCE:
- 5-10 specific URLs with backlink quality assessment
- One paragraph on which patterns are working
- Save to ~/Documents/MoneyFactor/

OUTPUT:
~/Documents/MoneyFactor/Backlink_Scan_AmexPlat_vs_CSR.md
```

**Example — audit dispatch:**

```
TITLE: GSC weekly read

SCOPE:
Pull last 7 days from GSC for bestcardsforme.com. Compare to prior 7 days. Identify any URL with significant change.

ACCEPTANCE:
- 7-day metrics block (clicks, impressions, CTR, position)
- 3-5 URLs that moved meaningfully
- Recommendation: any action needed?

OUTPUT:
Append to ops/GSC_LOG.md with date header
```

---

## Default output conventions

When a dispatch brief doesn't specify output location, defaults apply:

| Output type | Default location |
|---|---|
| Article draft | `~/Documents/MoneyFactor/BCFM_Article_NN_[slug].md` |
| Research note | `~/Documents/MoneyFactor/[Topic]_Research.md` |
| Audit result | `~/Documents/MoneyFactor/[Subject]_Audit_[date].md` |
| Status update | Append to relevant `ops/*_LOG.md` |
| Strategic analysis | `~/Documents/MoneyFactor/[Topic]_Analysis.md` |
| Response library entry | Append to existing library (Reddit, Source, etc.) |
| Engineering ticket | `~/Documents/MoneyFactor/Engineering_Ticket_[date].md` for founder review |

If the dispatch is ambiguous about output location, Claude writes the file using these defaults and notes the location in the chat summary.

---

## Status protocol

Dispatch is asynchronous. The founder may fire a brief at 11pm and not see results until 7am. Status visibility matters.

**Claude's responsibility:**

1. **Acknowledge on pickup.** First message in the dispatched thread: "Received: [TITLE]. Starting now. Expected duration: [estimate]."
2. **Mid-task signals.** If a dispatch takes more than ~10 minutes of work, post intermediate status: "Step 1 of 3 complete. Continuing."
3. **Completion signal.** Final message: "Done. Output: [location]. Summary: [one paragraph]. Issues: [any flagged]."
4. **Blocked signal.** If Claude can't complete the brief (ambiguity, missing access, doctrine conflict), post: "Blocked. Reason: [specific]. Recommended path forward: [option]. Awaiting founder direction."

**Founder's responsibility:**

1. Brief must be self-contained (Claude won't have your immediate context).
2. If dispatching multiple briefs in quick succession, label them with sequence numbers.
3. When reviewing dispatch output, file appropriately or trigger follow-up dispatch.

---

## Common dispatch patterns (10 templates)

These are pre-validated brief patterns for the most frequent recurring work. Use as starting points; customize on mobile.

### 1. Daily GSC quick read

```
TITLE: GSC daily

SCOPE:
Pull 24h and 7-day metrics. Note any URL with significant movement.

ACCEPTANCE:
- 24h block, 7-day block
- Any new top-10 query
- Action recommendation

OUTPUT:
Append to ops/GSC_LOG.md
```

### 2. AI citation tracking pull

```
TITLE: AI citation weekly check

SCOPE:
Run the starter prompt list in ops/AI_CITATION_TRACKING.md across ChatGPT, Perplexity, Google AI Overviews. Score per the rubric.

ACCEPTANCE:
- Weekly score (total / total possible)
- Specific prompts where MoneyFactor / BCFM was cited
- Specific prompts where competitors dominated

OUTPUT:
Append to ops/AI_CITATION_TRACKING.md with date header
```

### 3. Source platform digest scan

```
TITLE: Source platform digest scan

SCOPE:
Review most recent Qwoted, Source of Sources, Featured digest emails. Identify fit per ops/MONEYFACTOR_VERTICAL_RULES.md.

ACCEPTANCE:
- 1-5 queries marked "respond"
- For each, suggested draft using BCFM_Source_Response_Library.md
- Skips listed with one-line reason

OUTPUT:
Report in chat for founder review before responding
```

### 4. Article draft

```
TITLE: Article draft — [topic]

SCOPE:
Draft a new BCFM article on [topic]. Use existing methodology, Year-2 economics framing, conservative point valuations.

ACCEPTANCE:
- 2,500-3,500 words
- Established BCFM voice
- All standard sections (intro, body, FAQ, recommended cards, trust footer)
- Internal links to relevant existing articles

OUTPUT:
~/Documents/MoneyFactor/BCFM_Article_NN_[slug].md
```

### 5. Competitor analysis

```
TITLE: Competitor read — [topic]

SCOPE:
Analyze top 5 ranking pages for [query]. Identify patterns, gaps, and where BCFM could differentiate.

ACCEPTANCE:
- Top 5 URLs with one-line characterization each
- 2-3 differentiation angles available
- Production-recommendation status (single signal vs repeated signal)

OUTPUT:
~/Documents/MoneyFactor/Competitor_[Topic]_Analysis.md
```

### 6. Engineering ticket prep

```
TITLE: Engineering ticket — [scope]

SCOPE:
Draft a bounded ticket for Claude Code on [feature/fix/refactor].

ACCEPTANCE:
- Specific files affected
- Acceptance criteria
- Test/verification plan
- Acceptable for Claude Code execution

OUTPUT:
~/Documents/MoneyFactor/Engineering_Ticket_[date].md
```

### 7. Affiliate application status check

```
TITLE: Affiliate status update

SCOPE:
Check Qwoted, CardRatings, CJ Affiliate, FlexOffers dashboards for current status. Note any change since last check.

ACCEPTANCE:
- Current status per network
- Any new applications submitted (founder side)
- Any approvals or rejections
- Next-action recommendation per network

OUTPUT:
Update ops/AFFILIATE_STATUS.md
```

### 8. Indexing audit

```
TITLE: Indexing audit

SCOPE:
Verify all 28+ BCFM URLs are indexed in Google. Identify any URL with "Crawled - currently not indexed" status.

ACCEPTANCE:
- Indexed count
- Non-indexed URLs with reason if visible in GSC
- Recommendation: request reindex for any URL?

OUTPUT:
Append to ops/GSC_LOG.md
```

### 9. Content refresh check

```
TITLE: Content refresh check — [card/topic]

SCOPE:
Verify article on [card/topic] still reflects current issuer terms. Flag any stale data (fee changes, credit changes, program updates).

ACCEPTANCE:
- Specific stale claims with current correct values
- Recommendation: edit in place or rewrite
- Effort estimate

OUTPUT:
Report in chat; if rewrite warranted, dispatch Article draft as follow-up
```

### 10. Doctrine review

```
TITLE: Doctrine review — [section]

SCOPE:
Read [doctrine file/section]. Identify any drift between codified rules and current operating reality.

ACCEPTANCE:
- Specific drift points
- Recommended doctrine update or operational correction
- Priority assessment

OUTPUT:
~/Documents/MoneyFactor/Doctrine_Review_[date].md
```

---

## Failure modes to avoid

**1. Dispatch as a vague to-do.** "Look at the site and tell me what's wrong" is not a dispatch brief. It's a conversation. Either scope it down ("audit /articles for broken internal links") or save it for a desktop session.

**2. Dispatch as an irreversible action.** Don't dispatch "submit the CardRatings application" or "merge the PR to main." Those are founder-action items. Dispatch can prepare them; founder executes.

**3. Dispatch as a scope-creep vehicle.** Don't add "and while you're at it, also look at..." to a dispatch brief. One scope per brief. Multiple dispatches if multiple scopes.

**4. Dispatch as a context-rebuilding exercise.** If the brief requires Claude to read 10 files to understand context, it's not a dispatch — it's a desktop session. Dispatch briefs assume Claude can pick up the doctrine and run with the brief alone.

**5. Dispatch without acceptance criteria.** "Draft an article" is too vague. "Draft a 2,500-3,500 word article on X with Y framing and Z internal links" is dispatchable.

---

## Dispatch session log

Each dispatch produces output. The output location is tracked. Over time, the dispatch history becomes a useful audit trail. For now, the convention is:

- All dispatch outputs to `~/Documents/MoneyFactor/` get a header line: `*Dispatch output, [date]*`
- All dispatch updates to `ops/*_LOG.md` files use a dated section header
- Founder reviews accumulated output during next desktop session

If dispatch usage becomes high-volume, a separate `ops/DISPATCH_LOG.md` should track every brief fired and its outcome. Not built yet — defer until volume justifies.

---

## Updating this protocol

Dispatch usage will reveal what works and what doesn't. After 2-4 weeks of active use, revisit this protocol. Common updates:

- New dispatch patterns that recur frequently → add as templates
- Failure modes encountered → add to "failure modes to avoid"
- Output conventions that don't match actual usage → revise defaults
- Status protocol changes based on what mobile UX actually needs

Treat this document as a living protocol, not a frozen spec.
