# Current Status
_Last updated: 2026-05-20_

## Strategic posture

MoneyFactor is the platform brand. BestCardsForMe is the cards vertical inside the broader MoneyFactor platform. LeaseFactor is the next active growth wedge (prototype phase). BusinessFactor stays separate (consumer-finance brand only for MoneyFactor).

Core thesis: MoneyFactor is a trusted financial decision platform, not an affiliate site. Affiliate revenue is one monetization layer, not the entire business. Build audience, trust, tools, first-party data, benchmarks, reports, distribution, brand memory.

## BestCardsForMe — Live (stable maintenance)
- Repo: MoneyFactorLabs/bestcardsforme-quiz (transfer from tim-finiki completed; git remote confirmed)
- Deployed: Vercel from main
- Production: https://bestcardsforme.com
- Role: stable cards vertical, data-gathering asset
- Posture: no new content, no further title/meta tinkering, no rebuilds

## MoneyFactor.io — Live (parent platform)
- Indexed and technically clean
- Sitemap submitted, robots correct, homepage indexed
- /about "Our limits" copy reflects parent-brand language
- Future architecture: moneyfactor.io/cards, /lease, /loans, /credit, /home, /insurance

## LeaseFactor — Phase 0A (prototype-first)
- Doctrine codified at `ops/LEASEFACTOR_DOCTRINE.md` (ported 2026-05-20)
- V0 plan exists at `ops/LEASEFACTOR_V0_PLAN.md` but needs rescope: production-repo build path must be replaced with Lovable/Perplexity prototype-first per doctrine
- V0 product primitives: LeaseFactor Score, implied APR from money factor, effective monthly cost, payment-to-MSRP ratio, money factor markup warning, down-payment risk warning, one-pay lease note, confidence tier, plain-English verdict, "what to ask the dealer next"
- Core user question: "Is this lease actually a good deal?"

## Recent Commits
- cd0e894 (2026-05-13): ops rebuild — AGENT_ROLES, DISPATCH_PROTOCOL, RECURRING_WORKFLOWS, PROMPT_LIBRARY
- fd056a0: canonical tags + meta on utility pages
- 72a2d4c: mobile horizontal overflow fix
- af896e4: MoneyFactor limits copy
- c2a1a43: SERP title/meta cleanup (third snippet optimization round)
- 1755143, b687477: prior snippet optimization rounds from GSC CTR signal

## GSC snapshot (2026-05-12 to 2026-05-18)
- 7-day: 692 impressions, 1 click, position 27.4
- 28-day (Apr 24–May 18): 1,670 impressions, 2 clicks, position 18.6
- 24-hour (May 19–20): 41 impressions, 0 clicks, position 50.7
- 28 indexed pages
- Diagnosis (per doctrine): ranking depth on meaningful queries, not primarily CTR. Multiple pages at position ≤15 with zero clicks exist (hilton-aspire-vs-bonvoy pos 7.7, amex-platinum-vs-csr pos 13.8) but the bulk-impression cluster (business cards for LLC) ranks at position 80+.
- Action: keep BCFM stable; do not tinker

## Affiliate state
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
- ChatGPT: historical reference / additional thinking partner (deprecated as primary working agent per AGENT_ROLES.md 2026-05-12)
- Lovable / Perplexity: prototype tools for LeaseFactor V0 (per doctrine, prototype-first before production repo)
