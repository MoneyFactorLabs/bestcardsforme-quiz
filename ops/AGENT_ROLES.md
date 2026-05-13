# Agent Roles — MoneyFactor / BestCardsForMe

_Last updated: 2026-05-12_

Claude (Max) now handles all operating roles previously split across ChatGPT and Codex. This document is the canonical source for which lane owns which work.

---

## The four Claude lanes

### Claude.ai chat (desktop)
Primary lane for strategy, content production, research, ops, and analysis. Holds long-form context within a session. Writes/edits files directly via cowork file access. Calls browser ops via the Chrome extension when needed.

**Owns:**
- Strategy and prioritization conversations
- Content drafting (articles, response libraries, application packages)
- Research (competitor analysis, GSC interpretation, AI citation tracking)
- Document creation and editing
- File reads/writes in `~/Documents/`

**Does not own:**
- Git operations (sandbox can't run git commands without lock conflicts)
- Production code changes (route to Claude Code)
- Synchronous browser automation that needs sustained attention (route to Chrome extension)

### Claude Code (desktop CLI)
Engineering executor. Bounded tickets only. Direct git/repo access. Writes and commits code.

**Owns:**
- Code implementation
- Git commits and pushes
- Repo file changes beyond ops docs
- Build/deploy verification
- Bounded engineering tickets with explicit acceptance criteria

**Does not own:**
- Open-ended research
- Strategic decisions
- Editorial voice judgments
- Content writing beyond technical documentation

### Claude Chrome Extension (browser)
Browser operations agent. DOM-aware, faster than computer-use for web tasks.

**Owns:**
- Google Search Console reads
- Vercel deploy verification
- Affiliate network application form filling
- Reddit/forum reads (read-only — never post without explicit approval)
- Live site QA and SERP checks

**Does not own:**
- Anything requiring git
- Anything requiring local file writes outside browser context
- Account creation, financial transactions, or anything in the prohibited-actions list

### Claude Dispatch (mobile → desktop handoff)
Asynchronous task handoff from mobile to desktop Claude. Brief in, result in `~/Documents/MoneyFactor/` or `~/Documents/bestcardsforme-quiz/`.

**Owns:**
- Recurring task execution while founder is mobile
- Time-boxed work that doesn't need back-and-forth
- Status reports filed to known locations
- Outputs that can be reviewed asynchronously

**Does not own:**
- Synchronous strategic decisions
- Real-time conversation that requires iteration
- Anything requiring same-session founder confirmation

See `ops/DISPATCH_PROTOCOL.md` for brief formats and common patterns.

---

## Human / Founder (Tim)

**Owns:**
- Final approval on merges and pushes to main
- Affiliate application submissions and follow-up decisions
- Strategic direction and vertical activation triggers
- Content review and voice consistency check
- All actions in the prohibited-actions list (account creation, financial transactions, etc.)

**Does not own:**
- Day-to-day tactical execution (delegated to Claude lanes)
- Routine GSC checks, file reads, audit work

---

## Deprecated agents

| Agent | Deprecated | Replaced by |
|---|---|---|
| ChatGPT Pro/Plus | 2026-05-12 | Claude.ai chat (strategic PM lane) |
| Codex | 2026-05-12 | Claude Code |

---

## Task routing

| Task | Primary lane | Notes |
|---|---|---|
| GSC data pull and analysis | Claude chat | Browser extension assists with live read |
| Content draft (article, response) | Claude chat | Output to `~/Documents/MoneyFactor/` |
| Code change | Claude Code | Bounded ticket with acceptance criteria |
| Production deploy verification | Claude Code → Chrome extension | Chrome verifies the live URL |
| Browser ops (forms, GSC, Vercel) | Chrome extension | Read-only by default; write actions require explicit founder approval |
| Mobile handoff | Dispatch | See `DISPATCH_PROTOCOL.md` |
| Strategy decision | Claude chat + founder | Claude proposes; founder decides |
| Research run | Claude chat | Output to `~/Documents/MoneyFactor/` with sources cited |
| Recurring ops workflow | Dispatch or Claude chat | See `RECURRING_WORKFLOWS.md` for cadence |
| Affiliate application | Claude chat (drafts) + founder (submits) | Founder owns submission per prohibited-actions |
| Authority outreach (HARO/Qwoted) | Founder fires from mobile via Dispatch | Drafts reuse `BCFM_Source_Response_Library.md` |
| Reddit reply | Founder posts from own account | Drafts reuse `BCFM_Reddit_Response_Bank.md` |

---

## Handoff conventions

When one lane needs another:

- **Claude chat → Claude Code:** Chat writes a bounded ticket (scope, acceptance criteria, file paths). Founder runs the ticket in Claude Code session. Code reports back via commit message.
- **Claude chat → Chrome extension:** Chat provides the URL and the specific action (read X, verify Y). Extension returns the data; chat interprets.
- **Dispatch → Claude chat:** Dispatch brief lands; desktop Claude picks up, executes, files output to specified location, summarizes in chat thread when founder returns to desktop.
- **Any lane → Founder:** When founder confirmation is required, the lane stops and writes a clear decision request: what's needed, why, what happens if approved, what happens if declined.

---

## Escalation criteria (when to stop autonomous execution)

Claude lanes stop and ask the founder before proceeding when:

1. The task involves a prohibited action (account creation, financial transaction, file download from untrusted source, etc.)
2. The task requires irreversible production changes (deletion, destructive updates, merges to main)
3. The task encounters ambiguity in doctrine or vertical rules
4. The task could trigger doctrine §12 vertical activation conditions
5. The task would change the operating model itself (e.g., adding a new agent lane)
6. The expected output diverges materially from the brief in scope or commitment

In all cases, the lane reports current state, the question, and recommended next move — then waits.

---

## Quick reference

- Doctrine: `DOCTRINE.md` (repo root) + `ops/MONEYFACTOR_VERTICAL_RULES.md`
- Current state: `ops/CURRENT_STATUS.md` + `ops/NEXT_ACTIONS.md`
- Strategic brief: `ops/MONEYFACTOR_PROJECT_BRIEF.md`
- Dispatch usage: `ops/DISPATCH_PROTOCOL.md`
- Recurring schedules: `ops/RECURRING_WORKFLOWS.md`
- Reusable prompts: `ops/PROMPT_LIBRARY.md`
- Tracking logs: `ops/GSC_LOG.md`, `ops/AFFILIATE_STATUS.md`, `ops/AUTHORITY_OUTREACH_LOG.md`, `ops/AI_CITATION_TRACKING.md`
