# Brief: Ink Business Preferred vs Spark Cash Plus: Which Wins at Your Business Spend? (2026)

_Status: **brief** · score 50 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/ink-business-preferred-vs-spark-cash-plus-2026` |
| Segment | business |
| Primary intent | Should my business use Chase Ink Business Preferred or Capital One Spark Cash Plus, and is holding both better? |
| Conversion intent | choosing / applying |
| Effort | reuse existing model |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Break-even business spend between a 3x-category points card and a flat 2% card, including the Ink $150,000 cap, the Spark $150,000 fee refund, and the pairing that beats both.

Nearest existing page: [Best Business Credit Card for an LLC Owner in 2026](/articles/best-business-credit-card-for-llc-owner-2026) (similarity 0.35). Distinct intent.

## Calculation model

wallet: Business categories in lib/walletModel.ts; already pinned in tests for two spend levels.

**Year-2 net by business spend (model output, editorial review required)**

| Wallet | $80k charged, $30k in Ink 3x categories | $200k charged, $60k in 3x categories | $400k charged, $150k in 3x categories |
|---|---|---|---|
| Ink Business Preferred | $2,145 | $5,025 | $11,105 |
| Spark Cash Plus | $1,450 | $4,000 | $8,000 |
| Both, each dollar to the better card | $2,195 | $5,435 | $12,105 |

## Assumptions to state on the page

- Ultimate Rewards at 1.6¢; 1¢ cash-out sensitivity shown
- Year 2, no welcome bonuses

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): Chase Ink Business Preferred, Capital One Spark Cash Plus
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Best Business Credit Card for an LLC Owner in 2026](/articles/best-business-credit-card-for-llc-owner-2026)
- [Best Credit Card for Business Owners (Beyond LLC Basics) in 2026](/articles/best-credit-card-for-business-owners-2026)
- [/cards/ink-business-preferred](/cards/ink-business-preferred)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/ink-business-preferred](/cards/ink-business-preferred); outbound only through `/go/ink-business-preferred`

## Engine notes

- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
