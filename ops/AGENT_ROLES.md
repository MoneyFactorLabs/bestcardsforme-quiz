# Agent Roles — MoneyFactor / BestCardsForMe
_Last updated: 2026-05-12_

Claude (Max) now handles all roles previously split across ChatGPT and Codex.

## Claude — All Roles
- Claude.ai chat: strategy, content, ops, research
- Claude Code (Desktop): code implementation, repo work
- Claude Chrome Extension: browser ops, GSC, QA
- Claude Dispatch: mobile → desktop handoff

## Human / Founder (Tim)
- Fina
cd /Users/tim/Documents/bestcardsforme-quiz && mkdir -p ops && cat > ops/AGENT_ROLES.md << 'EOF'
# Agent Roles — MoneyFactor / BestCardsForMe
_Last updated: 2026-05-12_

Claude (Max) now handles all roles previously split across ChatGPT and Codex.

## Claude — All Roles
- Claude.ai chat: strategy, content, ops, research
- Claude Code (Desktop): code implementation, repo work
- Claude Chrome Extension: browser ops, GSC, QA
- Claude Dispatch: mobile → desktop handoff

## Human / Founder (Tim)
- Final approval on merges and pushes to main
- Affiliate decisions, strategic direction, content review

## ~~ChatGPT~~ Deprecated 2026-05-12
## ~~Codex~~ Deprecated 2026-05-12

## Task Routing
| Task | Tool |
|---|---|
| GSC data | Claude chat |
| Content draft | Claude chat → Claude Code commits |
| Production bug | Claude Code → Chrome verifies |
| Browser ops | Chrome extension |
| Mobile handoff | Dispatch |
