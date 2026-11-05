# BestCardsForMe / MoneyFactor: instructions for Claude Code

This repo is the live BestCardsForMe credit card recommendation site (https://bestcardsforme.com) and also serves the MoneyFactor parent homepage (https://moneyfactor.io) through host-based rewrites in `middleware.ts`. It deploys to Vercel from `main`.

This file is the entry point. The canonical operating docs already exist; read the ones relevant to your task rather than re-deriving them:

- Product doctrine: `DOCTRINE.md` and `ops/MONEYFACTOR_VERTICAL_RULES.md`
- Who does what, handoffs, escalation: `ops/AGENT_ROLES.md`
- Current state and next actions: `ops/CURRENT_STATUS.md`, `ops/NEXT_ACTIONS.md`
- Editorial publishing: `CONTENT_ENGINE.md`
- Recurring work and dispatch briefs: `ops/RECURRING_WORKFLOWS.md`, `ops/DISPATCH_PROTOCOL.md`, `ops/PROMPT_LIBRARY.md`

## Hard rules

1. **Production rule** (from `ops/CURRENT_STATUS.md`): no production changes unless GSC data shows a clear issue or opportunity, an affiliate requirement needs a site change, there is a production bug, trust or compliance copy is inaccurate, or Tim explicitly approves the build. BestCardsForMe is in stable maintenance: no rebuilds, no title/meta tinkering without GSC data.
2. **Never publish invented facts**: no invented offers, fees, credits, review dates, staff credentials, testimonials or unverified issuer claims. Issuer facts are tracked in `quality/issuer-sources.json` and checked by `npm run verify:facts`.
3. **Protect affiliate attribution and analytics.** Outbound links route through `/go/[slug]` (`lib/affiliateLinks.ts`, `lib/outboundClicks.ts`). Events are first-party, stored in Supabase `analytics_events` (`lib/analyticsServer.ts`). Don't add a second analytics system or change event names without an issue approving it.
4. **Secrets.** `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never commit, print or log secrets, and never give a server key a `NEXT_PUBLIC_` prefix.
5. **Isolation.** Don't share this repo's database, credentials or env vars with FullSize, LotLizard or other projects.
6. **Stop and ask** (per `ops/AGENT_ROLES.md` escalation criteria) before production data changes, merges to `main`, paid services, affiliate or licensing commitments, doctrine changes, or anything on the prohibited-actions list.

## How work arrives and is reported

- Engineering tickets arrive as **GitHub issues** in this repo (the bounded-ticket format in `ops/AGENT_ROLES.md`: scope, acceptance criteria, file paths). A spec drafted in a chat is pasted into an issue; the issue is the source of truth.
- Work on a branch and open a **pull request** that says `Closes #N`, with what changed, how it was verified, and what was deliberately not changed.
- Post a short result comment on the issue: PR link, check results, anything blocked or needing Tim.
- Tim merges to `main`. Don't merge yourself unless the issue explicitly says so.

## Commands

```bash
npm ci
npm run qa              # everything CI runs: typecheck, tests, fact check, build, site validation, browser smoke
npm run typecheck
npm test                # tsx --test tests/*.test.ts
npm run verify:facts    # issuer fact sources registered and fresh
npm run validate:site   # links, payload URLs, placeholders, canonicals, duplicates (after build)
npm run test:e2e        # Playwright smoke, mobile + desktop
npm run report:outbound # outbound click report from Supabase
```

## CI and checks (already in place)

- `quality-gates.yml`: every push and PR runs the full `qa` sequence.
- `production-verify.yml`: runs after Vercel reports a successful production deployment, or on demand; validates the live site and runs the browser smoke test.
- `issuer-facts.yml`: weekly (Mondays) and on PRs, checks issuer fact sources.

## Map

| Area | Where |
| --- | --- |
| Quiz questions and recommendation engine | `data/questions.ts`, `lib/recommendationEngine.ts` |
| Card data and value math | `data/cards.ts`, `data/creditCardProfiles.ts`, `lib/cardValueModel.ts`, `lib/cardProfileBuilder.ts` |
| Articles | `data/articles*.ts`, `app/articles/[slug]` (see `CONTENT_ENGINE.md`) |
| Card review pages | `app/cards/[slug]` |
| Trust pages | `app/about`, `app/methodology`, `app/editorial-standards`, `app/affiliate-disclosure`, `app/how-we-review-credit-cards` |
| MoneyFactor homepage, sitemap, robots | `app/moneyfactor`, `app/moneyfactor-*`, `middleware.ts` |
| Events and leads APIs | `app/api/events`, `app/api/leads` |
| Schema | `supabase/migrations/` |
| Quality fixtures | `quality/` (control pages, issuer sources, page assertions) |
