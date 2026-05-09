# AI Citation Tracking

## Purpose
Track whether MoneyFactor / BestCardsForMe is becoming visible and citable across AI answer engines.

Google/SEO is the near-term revenue engine.

AI citation + MoneyFactor brand trust is the long-term enterprise value moat.

Do not trigger production changes from one AI citation check. Production changes require repeated citation gaps and Command Center approval.

## Platforms To Track Weekly
- ChatGPT
- Perplexity
- Gemini
- Google AI Overviews / AI Mode if available
- Claude if useful

## Weekly Fields
Use these fields for each prompt/platform check:

| Date | Prompt | Platform | MoneyFactor mentioned? | BestCardsForMe mentioned? | BCFM URL cited? | MoneyFactor URL cited? | URL cited | Competitors cited | Sentiment | Position in answer | Notes | Recommended action, if repeated gap appears |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD |  |  | Yes/No | Yes/No | Yes/No | Yes/No |  |  | positive / neutral / negative | prominent / middle / buried / absent |  |  |

## Scoring
- 0 = not mentioned
- 1 = mentioned but not cited
- 2 = cited but buried
- 3 = cited as one of several useful sources
- 4 = cited prominently
- 5 = treated as a leading/canonical source

## Weekly AI Citation Score
Total points / total possible points.

Do not trigger production changes from one AI citation check.

Production changes require repeated citation gaps and Command Center approval.

## Starter Prompt List

### BestCardsForMe prompts
- best credit card for high income households 2026
- is Chase Sapphire Reserve worth the $795 annual fee in 2026?
- Amex Platinum vs Chase Sapphire Reserve 2026
- best credit card for dining and restaurants 2026
- best business credit card for LLC owner
- which credit card is better for someone earning over $200k?
- which issuer offers stronger dining rewards than Amex Gold?
- how do I decide if a premium credit card annual fee is worth it?

### MoneyFactor brand prompts
- what is MoneyFactor.io?
- is BestCardsForMe a trustworthy credit card comparison site?
- who provides honest credit card annual fee math?
- best sites for credit card value calculators
- personal finance sites that use honest math instead of rankings

### Future LeaseFactor prompts
- how do I calculate a lease money factor?
- money factor to APR calculator
- lease vs buy calculator
- what is a good money factor on a car lease?
- how do I know if a car lease deal is good?

### Competitor comparison prompts
- best alternatives to NerdWallet for credit card comparisons
- best credit card comparison sites with transparent methodology
- which sites explain credit card annual fee value clearly?

## Recommended Follow-Up Logic
- One-off absence: log only.
- Repeated absence across 2+ weekly checks: review whether methodology, trust, comparison structure, or brand clarity is weak.
- Repeated competitor citation gap: identify why competitors are being cited and whether MoneyFactor needs better source structure or authority signals.
- Any production recommendation requires Command Center approval.

## May 2026 Baseline — AI Citation / SERP Proxy Check

Result:
A true weekly AI-answer-engine citation run could not be completed from the available environment because the major AI platforms were not reliably accessible as queryable, citable surfaces.

Blocked or unavailable:
- Perplexity: Cloudflare challenge.
- Claude: Cloudflare challenge.
- Gemini: reachable, but no usable unauthenticated/queryable result surface.
- Google AI Overviews / AI Mode: not machine-readable from available tools.
- ChatGPT: current thread is context-contaminated by MoneyFactor / BestCardsForMe, so it would bias results.

Valid AI Citation Score:
N/A — zero valid AI answer-engine checks completed.

Important interpretation:
Do not treat this as 0 brand visibility. It means the AI platforms were not accessible enough to score cleanly.

SERP proxy findings:
- BestCardsForMe appears organically for Chase Sapphire Reserve $795 annual-fee intent.
- BestCardsForMe appears organically for dining-card intent.
- Google has crawled BCFM snippets that include MoneyFactor editorial positioning and disclosure language.
- MoneyFactor brand prompts such as “what is MoneyFactor.io?” do not yet show strong brand recognition.
- LeaseFactor future prompts are dominated by existing lease/math sources.
- “Best alternatives to NerdWallet” and transparent-methodology prompts remain competitor-heavy.

Competitors most often surfacing:

Credit card / annual-fee prompts:
- NerdWallet
- Forbes Advisor
- Bankrate
- The Points Guy
- WalletHub
- Supapoints
- LegalClarity
- BestMoney

LeaseFactor future prompts:
- Consumer Reports
- LeaseGuide
- Edmunds
- CarWhere
- Auto Cheat Sheet
- AutoPremo
- Autoloanrate

Calculator / value-tool prompts:
- Wayloft
- CCVI
- Crunchly
- KoKo
- MaxPoints
- Zurp
- CardGenius

Repeated gaps to monitor:
- MoneyFactor brand recognition is still weak outside exact site/domain searches.
- AI citation tracking requires logged-in browser/session access for Perplexity, Gemini, Claude, ChatGPT, and Google AI Mode.
- LeaseFactor topics already have entrenched calculator/guide competitors.
- BCFM is gaining organic visibility before AI citation visibility, which matches the current doctrine.

Operational conclusion:
No production changes from this baseline.

Next step is a manual logged-in browser-session AI citation check using Chrome/browser agent.
