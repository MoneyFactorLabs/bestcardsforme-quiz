# BCFM Growth Engine weekly report: 2026-11-04

- Current period: 2026-10-29..2026-11-04; previous: 2026-10-22..2026-10-28
- Source: Google Search Console performance, bestcardsforme.com, as reported by the founder in Issue #16 (page-level only; clicks were stated for two pages; per-page previous-period values and query rows were not provided)
- Generated 2026-11-07 by `npm run growth`. Search Console figures are as exported; nothing here is forecast.
- Data note: page export has one period only; previous-period values are missing.
- **No query-level export was provided.** Opportunity evidence is page-level only; add Queries.csv next week.

## Site totals

| Metric | Previous | Current | Change |
|---|---|---|---|
| Impressions | 316 | 756 | +139% |
| Clicks | 0 | 3 | — |
| CTR | 0.00% | 0.40% | — |
| Average position | 41.2 | 44.3 | — |

Small sample: week-over-week changes this size do not establish cause.

## Pages

| Page | Impressions | Prev. | Clicks | Position | Flags |
|---|---|---|---|---|---|
| `/articles/best-no-annual-fee-credit-card-2026` | 245 | — | 0 | 62.6 | no previous data |
| `/articles/best-credit-card-high-income-households-2026` | 200 | — | 1 | 9.2 | no previous data, control |
| `/articles/best-credit-card-for-online-shopping-2026` | 65 | — | 0 | 37.6 | no previous data |
| `/articles/best-business-credit-card-for-llc-owner-2026` | 55 | — | 1 | 79.0 | no previous data |
| `/articles/best-credit-card-for-dining-restaurants-2026` | 32 | — | 0 | 45.0 | no previous data |

## Wins and regressions

- No page-level wins measurable (needs both periods and ≥ 20 impressions).
- No page-level regressions measurable.

## Ranked opportunities

| # | Opportunity | Type | Status | Score | Evidence | Nearest existing page |
|---|---|---|---|---|---|---|
| 1 | Best No Annual Fee Credit Card in 2026 | improve | needs-facts | 59 | 245 impr., pos 62.6 | — |
| 2 | Best Credit Card for Online Shopping in 2026 | improve | needs-facts | 57 | 65 impr., pos 37.6 | — |
| 3 | Ink Business Preferred vs Spark Cash Plus: Which Wins at Your Business Spend? (2026) | new | brief | 50 | none yet | best-business-credit-card-for-llc-owner-2026 (0.35) |
| 4 | Sapphire Reserve + Freedom Unlimited + Ink Preferred: The Three-Card Math for Business Owners (2026) | new | brief | 42 | none yet | multiple-premium-credit-cards-vs-one-2026 (0.29) |
| 5 | Capital One Venture X vs Amex Platinum: $395 vs $895, Which Pays More? (2026) | new | brief | 40 | none yet | is-amex-platinum-worth-it-2026 (0.39) |
| 6 | Amex Gold vs Chase Sapphire Reserve: $325 vs $795 for a Dining-Heavy Household (2026) | new | brief | 40 | none yet | amex-platinum-vs-chase-sapphire-reserve-2026 (0.36) |
| 7 | Personal Premium Card or Business Card for Business Spending? The Math (2026) | new | brief | 40 | none yet | best-business-credit-card-for-llc-owner-2026 (0.31) |
| 8 | Sapphire Preferred vs Sapphire Reserve: At What Spend Does the $700 Gap Pay? (2026) | new | brief | 30 | none yet | amex-platinum-vs-chase-sapphire-reserve-2026 (0.43) |
| 9 | Amex Business Platinum vs Personal Platinum for Business Owners (2026) | new | brief | 30 | none yet | best-business-credit-card-for-llc-owner-2026 (0.39) |
| 10 | Amex or Chase Ecosystem? A Household Wallet Comparison (2026) | new | brief | 28 | none yet | amex-platinum-vs-chase-sapphire-reserve-2026 (0.36) |
| 11 | Credit Card Annual Fee Break-Even Calculator | new | brief | 25 | none yet | best-credit-card-for-dining-restaurants-2026 (0.49) |
| 12 | Best Business Credit Card for an LLC Owner in 2026 | improve | hold | 71 | 55 impr., pos 79.0 | — |
| 13 | Best Credit Card for Dining in 2026 | improve | hold | 69 | 32 impr., pos 45.0 | — |
| 14 | Best Credit Cards for High-Income Households 2026 | improve | protected | 73 | 200 impr., pos 9.2 | — |
| 15 | Is the Amex Platinum Worth It for Occasional Travelers in 2026? | new | duplicate | 50 | none yet | is-amex-platinum-worth-it-2026 (0.54) |
| 16 | Best Second Credit Card to Pair With the Chase Sapphire Reserve (2026) | new | duplicate | 50 | none yet | best-second-credit-card-for-premium-card-owners-2026 (0.59) |
| 17 | Should You Downgrade the Chase Sapphire Reserve? The Year-2 Math (2026) | new | duplicate | 33 | none yet | is-chase-sapphire-reserve-worth-it-2026 (0.52) |

Score = evidence (log impressions, max 30) + ranking headroom (max 15) + differentiation (calculation model 15 + verified-facts coverage 10) + conversion intent (max 15) + segment priority (max 10) − effort − overlap. Statuses: **brief** ready; **needs-facts** register issuer terms first; **hold** recently rewritten; **protected** control page; **duplicate** would cannibalize an existing page.

## Proposed next batch

1. Ink Business Preferred vs Spark Cash Plus: Which Wins at Your Business Spend? (2026) (new page) — [brief](briefs/ink-preferred-vs-spark-cash-plus.md)
2. Sapphire Reserve + Freedom Unlimited + Ink Preferred: The Three-Card Math for Business Owners (2026) (new page) — [brief](briefs/chase-trifecta-business-owner.md)
3. Capital One Venture X vs Amex Platinum: $395 vs $895, Which Pays More? (2026) (new page) — [brief](briefs/venture-x-vs-amex-platinum.md)
4. Amex Gold vs Chase Sapphire Reserve: $325 vs $795 for a Dining-Heavy Household (2026) (new page) — [brief](briefs/amex-gold-vs-sapphire-reserve.md)
5. Personal Premium Card or Business Card for Business Spending? The Math (2026) (new page) — [brief](briefs/personal-card-for-business-spend.md)

Founder approval is required before any brief becomes a draft PR.
