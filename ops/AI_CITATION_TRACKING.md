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

## May 9, 2026 AI Citation Baseline — Google + Perplexity

Platforms covered:
- Google Search regular web SERP
- Perplexity

Platforms not fully covered:
- Google AI Mode / AI Overviews: not accessible or no AI blocks rendered
- Gemini: login or unusable unauthenticated surface
- ChatGPT search: skipped due to thread/context contamination
- Claude: skipped due to login requirement

Scoring:
- 21 prompts
- 2 platforms
- 42 prompt-platform cells
- Max score: 210
- Actual score: 28
- Baseline AI Citation Score: 28 / 210 = 13.3%

Key wins:
- BestCardsForMe appeared as the #1 Google organic result for “best credit card for high income households 2026.”
- The Google snippet referenced the MoneyFactor strategy guide.
- MoneyFactor.io appeared as the #1 Google organic result for “what is MoneyFactor.io.”
- Google surfaced the BestCardsForMe “How We Review Credit Cards” page for trustworthiness intent.
- Perplexity cited BestCardsForMe for the “credit card for someone earning over $200k” prompt.
- Perplexity cited BestCardsForMe for the “stronger dining rewards than Amex Gold” prompt.
- Perplexity cited MoneyFactor.io as the primary/canonical source for “what is MoneyFactor.io.”
- Perplexity cited BestCardsForMe positively for “is BestCardsForMe trustworthy?”

Key misses:
- All LeaseFactor future prompts scored 0 across both platforms.
- “Honest annual fee math,” “transparent methodology,” and “sites that explain annual fee value clearly” scored 0 across both platforms.
- Premium-card prompts where BCFM has relevant content still missed: CSR $795, Amex Platinum vs CSR, dining cards, and premium annual-fee worth-it.
- MoneyFactor brand recognition is still weak outside direct brand/domain queries.
- “Honest Math” has brand-collision risk due to HonestMath.com appearing for honest-math personal finance prompts.

Top competitors cited or surfaced:
- NerdWallet
- Bankrate
- The Points Guy
- Reddit
- CNBC
- CNN / CNN Underscored
- Edmunds
- Capital One
- Forbes
- WalletHub
- RoamingCactus
- UpgradedPoints
- Credit Karma
- Erika.com
- OneMileAtATime
- Corporate Finance Institute
- Leasehackr
- HonestMath.com
- AskSebby
- Financial Mentor

Repeated gaps to monitor:
1. LeaseFactor topical vacuum.
2. Honest math / transparent methodology / annual-fee value cluster.
3. Perplexity inconsistency on BCFM-relevant credit-card prompts.

Operational interpretation:
This baseline validates that MoneyFactor / BCFM has early AI/search citation visibility, but not yet a durable moat. No production changes are approved from this single baseline.

Recommended next research actions:
- Run a read-only LeaseFactor competitor/citation gap audit.
- Run a read-only honest math / transparent methodology citation audit.
- Re-run Perplexity prompts #1–#8 in 24–72 hours to test citation stability.

## May 2026 Language and Competitor Gap Research

Source:
Claude COO AI Citation Gap Research.

Status:
Read-only strategy input. Not a production-change trigger.

### HonestMath.com brand-collision risk
- HonestMath.com creates brand-collision risk around “honest math.”
- Do not use “honest math” as branded MoneyFactor methodology language.
- Do not put “honest math” in URLs, methodology page titles, H1s, product names, or repeated marketing copy.
- Existing tagline “The real math behind every money decision” is acceptable and should remain preferred.
- Preferred methodology language:
  - MoneyFactor methodology
  - captured value math
  - Year-2 economics
  - profile-fit recommendation
  - real-world value framework
- “Honest” can appear as normal descriptive English, but “honest math” should not become a MoneyFactor brand phrase.

### LeaseFactor / Leasehackr planning input
- Leasehackr has a real calculator plus community deal-data moat.
- LeaseFactor should not assume content production alone can beat that moat.
- LeaseFactor staged preparation should decide whether to compete on:
  - methodology depth
  - explainability
  - profile-fit scoring
  - deal-quality framework
  - calculator clarity
  - future community/data collection
- This is not production launch approval.

### Doctrine confirmation
- BCFM remains the active validation engine.
- Parallel preparation, sequential deployment remains the rule.
- LeaseFactor staged prep is allowed, but production launch is not approved.
- Do not launch HomeFactor, InsuranceFactor, or any third vertical yet.
- Do not build captured-value calculators yet from this single research run.
- Do not reframe the live methodology page from this single research run.

### Read-only “honest math” repo audit
Audit command:
`rg -n -i "honest math" . --glob '!node_modules/**' --glob '!.next/**' --glob '!out/**' --glob '!dist/**'`

Results:
- `ops/AI_CITATION_TRACKING.md`: appears in prompt/research/audit language. Recommendation: leave alone where preserving historical query wording or research findings; avoid using it as future branded methodology language.
- `data/articles.ts`: appears twice in article body copy as normal descriptive English, not URL/title/H1/metadata/product naming. Recommendation: leave alone for now; change later only with Command Center approval if brand-collision evidence repeats.

No “honest math” occurrences were found in URLs, methodology page titles, H1s, product names, or production metadata during this audit.

## May 9, 2026 AI Citation v1.5 Check — Contamination Finding

Status:
Run partially aborted after account-level contamination was discovered on ChatGPT, Gemini, and Claude.

Critical finding:
Logged-in AI accounts tied to MoneyFactor / BestCardsForMe are not valid environments for AI citation testing because their responses may use account memory, project history, workspace identity, or prior chat context.

Contaminated / invalid surfaces:
- ChatGPT: account/project context included MoneyFactor.io Command Center, and responses referenced internal ops context rather than clean web/search results.
- Claude: account was aware of BCFM/MoneyFactor context and offered BCFM-specific options before a neutral search result.
- Gemini: account was tied to the moneyfactor.io Workspace account; output may not reflect a neutral consumer environment and returned stale CSR fee data.

Clean or partially clean surfaces checked:
- Google desktop SERP
- Bing Copilot logged out
- Gemini Pro result logged with caveat
- Google AI Mode not accessible
- Google AI Overview did not render
- Google mobile SERP not validly tested
- Perplexity v1 data remains useful, but v1.5 rerun was not completed after session loss

Clean-score summary:
- Clean scored cells: 6
- Max clean score: 30
- Actual clean score: 8
- Clean score: 8 / 30 = 26.7%
- All clean points came from Google desktop:
  - BestCardsForMe #1 organic for high-income household credit card query
  - MoneyFactor.io #1 organic for MoneyFactor brand query

Key wins:
- BestCardsForMe remains #1 organic on Google for “best credit card for high income households 2026.”
- Google snippet references “MoneyFactor strategy guide.”
- MoneyFactor.io remains #1 organic on Google for “what is MoneyFactor.io.”

Key misses:
- Bing Copilot does not recognize MoneyFactor.io and treated it as unclear/unknown.
- Bing Copilot pointed toward unrelated or adjacent entities rather than MoneyFactor.io.
- Bing Copilot does not recognize BestCardsForMe as an established credit-card comparison site.
- Gemini returned stale CSR fee information, suggesting weak or absent live grounding.
- Google mobile SERP was not validly tested.

Methodology conclusion:
Future AI citation tests should use brand-anonymous testing environments:
- clean browser profile
- logged-out where possible
- or separate neutral consumer test accounts where allowed
- no MoneyFactor project history
- no BCFM browsing history
- no prior prompts about MoneyFactor
- no moneyfactor.io Workspace identity

Backlog items:
1. Create clean/brand-anonymous AI citation testing workflow.
2. Add Bing Copilot brand-recognition gap as a specific research item.
3. Add valid Google mobile SERP testing using real mobile device or mobile user-agent emulation.
4. Do not use “honest math” as branded MoneyFactor language because of HonestMath.com collision risk.

Operational conclusion:
No production changes are approved from this v1.5 check. BCFM remains the active validation engine. AI citation tracking remains a KPI, but current testing methodology must be cleaned up before scores drive site changes.
