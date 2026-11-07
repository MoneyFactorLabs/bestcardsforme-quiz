# Brief: Personal Premium Card or Business Card for Business Spending? The Math (2026)

_Status: **brief** · score 40 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/personal-vs-business-credit-card-for-business-spending-2026` |
| Segment | business |
| Primary intent | Should I put my small business spending on my personal Sapphire/Platinum or open a business card? |
| Conversion intent | comparing |
| Effort | extend model or data |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Rewards difference of routing business spend to a business card vs a personal premium card at three spend levels, with the non-math reasons (separation, liability) listed but not scored.

Nearest existing page: [Best Business Credit Card for an LLC Owner in 2026](/articles/best-business-credit-card-for-llc-owner-2026) (similarity 0.31). Distinct intent.

## Calculation model

wallet: Wallet model mixing personal and business categories.

## Assumptions to state on the page

- Not tax or legal advice; bookkeeping benefits described, not valued

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): Chase Ink Business Preferred, Capital One Spark Cash Plus, Chase Sapphire Reserve
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Best Business Credit Card for an LLC Owner in 2026](/articles/best-business-credit-card-for-llc-owner-2026)

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
