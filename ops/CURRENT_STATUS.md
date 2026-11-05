# Current Status
_Last updated: 2026-11-05_

## Strategic posture

MoneyFactor is the platform brand. BestCardsForMe is the cards vertical inside the broader MoneyFactor platform. LeaseFactor is the next active growth wedge (prototype phase). BusinessFactor stays separate (consumer-finance brand only for MoneyFactor).

Core thesis: MoneyFactor is a trusted financial decision platform, not an affiliate site. Affiliate revenue is one monetization layer, not the entire business. Build audience, trust, tools, first-party data, benchmarks, reports, distribution, brand memory.

## BestCardsForMe — Live (active development, issue-driven)
- Repo: MoneyFactorLabs/bestcardsforme-quiz (transfer from tim-finiki completed; git remote confirmed)
- Deployed: Vercel from main
- Production: https://bestcardsforme.com
- Role: the live credit-card decision engine and the active MoneyFactor product
- Posture (changed 2026-11-05 from "stable maintenance"): keep improving BCFM through approved GitHub issues. Current priorities:
  1. The credit-card decision engine (quiz, recommendation logic, card value model, card data accuracy)
  2. Affiliate monetization (attribution through `/go/`, approved programs only)
  3. Search visibility
  4. AI citation potential (structured, citable, accurate content)
- Still off-limits without an approved issue: rebuilds, redesigns, and title/meta changes without GSC data. The production rule below still applies.

## MoneyFactor.io — Live (parent platform)
- Indexed and technically clean
- Sitemap submitted, robots correct, homepage indexed
- /about "Our limits" copy reflects parent-brand language
- Future architecture: moneyfactor.io/cards, /lease, /loans, /credit, /home, /insurance

## LeaseFactor — idea / research (no repository, no active development)
- Doctrine codified at `ops/LEASEFACTOR_DOCTRINE.md` (ported 2026-05-20)
- V0 plan exists at `ops/LEASEFACTOR_V0_PLAN.md` but needs rescope: production-repo build path must be replaced with Lovable/Perplexity prototype-first per doctrine
- V0 product primitives: LeaseFactor Score, implied APR from money factor, effective monthly cost, payment-to-MSRP ratio, money factor markup warning, down-payment risk warning, one-pay lease note, confidence tier, plain-English verdict, "what to ask the dealer next"
- Core user question: "Is this lease actually a good deal?"
- Status 2026-11-05: tracked as an idea in the private portfolio-ops repository. No development starts without Tim's approval.

## Recent merged work
GitHub pull requests are now the record of shipped work; this list is a summary.
- 2026-11-05: #9 `CLAUDE.md` entry point; #10 ChatGPT reinstated as strategy lane, GitHub issues as the handoff
- 2026-10-29: #8 GitHub Actions on Node 24; #7 QA-tagged outbound clicks excluded from reporting (migration 004); #6 all npm audit findings patched (Next.js 15.5.28); #5 issuer fact verification (sources registry, weekly check, page assertions); #4 every `/go/` redirect recorded server-side as `outbound_click`; #3 dining guide rewritten as a cash back vs points decision matrix; #2 11 placeholder card profiles replaced; #1 phantom crawl URLs removed from RSC payload, missing canonicals added
- 2026-05-13 and earlier: ops rebuild (cd0e894), canonical tags and meta on utility pages, mobile overflow fix, MoneyFactor limits copy, snippet optimization rounds

## GSC snapshot (2026-05-12 to 2026-05-18; stale, refresh before using)
- 7-day: 692 impressions, 1 click, position 27.4
- 28-day (Apr 24–May 18): 1,670 impressions, 2 clicks, position 18.6
- 24-hour (May 19–20): 41 impressions, 0 clicks, position 50.7
- 28 indexed pages
- Diagnosis (per doctrine): ranking depth on meaningful queries, not primarily CTR. Multiple pages at position ≤15 with zero clicks exist (hilton-aspire-vs-bonvoy pos 7.7, amex-platinum-vs-csr pos 13.8) but the bulk-impression cluster (business cards for LLC) ranks at position 80+.
- Action at the time: keep BCFM stable; do not tinker. Superseded by the 2026-11-05 posture above; a fresh GSC pull should drive the next search-visibility issues.

## Affiliate state (as of 2026-05-20; not re-verified since)
- CJ: publisher active; 6 advertiser applications pending (Luxury Card, Experian, LifeLock, SmartCredit, Venmo, PayPal Cashback)
- CardRatings: submitted, awaiting response
- FlexOffers: declined; do not reapply until stronger signal
- Direct issuer programs: not applied; gated on CJ/CardRatings outcomes

## Production rule
No production changes unless one of these is true:
1. GSC data shows a clear issue or opportunity
2. Affiliate requirements require a site change
3. Production bug / technical issue exists
4. Trust/compliance copy is inaccurate
5. Founder explicitly approves a build

A GitHub issue that Tim created, or that Tim asks Claude Code to implement, counts as founder approval for the scope it describes and only that scope, unless it is labeled `needs-approval` or `blocked`. Merges to `main` remain Tim's.

## Knowledge state — known gaps
- `ops/LEASEFACTOR_DOCTRINE.md` ✓ ported 2026-05-20
- `ops/LEASEFACTOR_V0_SPEC.md` ✓ created 2026-05-20 (17 sections, doctrine-conformant)
- `ops/BCFM_METHODOLOGY_DERIVATION.md` ✓ v1 ported 2026-05-20 (gaps flagged for v2 — see §11)
- `ops/MONEYFACTOR_VOICE_AND_POSITIONING.md` ✓ v1 ported 2026-05-20 (gaps flagged for v2 — see §10)
- Distribution-channel plan now codified within MONEYFACTOR_VOICE_AND_POSITIONING.md §5
- AGENT_ROLES.md uses Cowork-era lane names; ChatGPT mental model uses Command Center / Core Platform names — repo doc is canonical

## Tooling
- Claude.ai (Cowork mode): active — strategy, ops, content, file access
- Claude Code: active — repo engineering, bounded tickets
- Claude Chrome extension: active — live SERP / GSC / dashboard reads
- Claude Dispatch: active — mobile-to-desktop async handoff
- ChatGPT: active (reinstated 2026-11-05) for portfolio strategy, research and prioritization; creates GitHub issues as the handoff to Claude Code (see AGENT_ROLES.md)
- Lovable / Perplexity: prototype tools for LeaseFactor V0 (per doctrine, prototype-first before production repo)
