# Brief: Capital One Venture X vs Amex Platinum: $395 vs $895, Which Pays More? (2026)

_Status: **brief** · score 40 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/capital-one-venture-x-vs-amex-platinum-2026` |
| Segment | premium-economics |
| Primary intent | Is the Amex Platinum worth $500 more a year than the Venture X for my travel? |
| Conversion intent | choosing / applying |
| Effort | reuse existing model |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Year-2 net for both cards across three household profiles, the credit capture the Platinum needs to justify the $500 fee gap, and when holding both makes sense.

Nearest existing page: [Is Amex Platinum Still Worth the $895 Annual Fee in 2026?](/articles/is-amex-platinum-worth-it-2026) (similarity 0.39). The draft must say in its first section how it differs and link to that page.

## Calculation model

wallet: Wallet model with the existing household profiles and capture rates.

**Year-2 net by household (model output, editorial review required)**

| Wallet | Home-centered (Year-2 net) | Balanced (Year-2 net) | Travel-heavy (Year-2 net) |
|---|---|---|---|
| Venture X alone | $1,855 | $2,645 | $3,475 |
| Amex Platinum + Double Cash | $1,225 | $2,844 | $4,809 |
| Venture X + Amex Gold | $2,849 | $3,897 | $5,072 |

## Assumptions to state on the page

- Capture rates from data/walletScenarios.ts
- Lounge access counted once

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): Capital One Venture X, American Express Platinum
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Is Capital One Venture X Still Worth the $395 Annual Fee in 2026?](/articles/is-capital-one-venture-x-worth-it-2026)
- [Is Amex Platinum Still Worth the $895 Annual Fee in 2026?](/articles/is-amex-platinum-worth-it-2026)
- [Two or Three Premium Credit Cards vs One: The Annual-Fee Stacking Math (2026)](/articles/multiple-premium-credit-cards-vs-one-2026)
- [Best Credit Cards for High-Income Households 2026: Premium Rewards Compared](/articles/best-credit-card-high-income-households-2026)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/capital-one-venture-x](/cards/capital-one-venture-x); outbound only through `/go/capital-one-venture-x`
- Card review: [/cards/amex-platinum](/cards/amex-platinum); outbound only through `/go/amex-platinum`

## Engine notes

- Partial overlap with /articles/is-amex-platinum-worth-it-2026 (similarity 0.39); the brief must state how the angle differs.
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
