# Brief: Best Credit Card for Online Shopping in 2026

_Status: **needs-facts** · score 57 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | Improve existing page |
| Canonical target | `/articles/best-credit-card-for-online-shopping-2026` |
| Segment | everyday |
| Primary intent | Which card earns the most on my online and Amazon spending? |
| Conversion intent | choosing / applying |
| Effort | extend model or data |

## Search evidence

65 impressions, 0 clicks, average position 37.6.

## Unique angle

Add a monthly-spend break-even table (Amazon-only vs mixed online retail) using the card value model, and verify the retailer card terms it relies on.

## Calculation model

card-value: lib/cardValueModel.ts with retailer-specific spend lines.

## Assumptions to state on the page

- Prime membership treated as a sunk cost only for current members

## Sources to verify before drafting

- No products verified yet
- **Add to quality/issuer-claims.json first:** Amex Blue Cash Everyday, Chase Freedom Unlimited, Citi Double Cash
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Best No Annual Fee Credit Card in 2026](/articles/best-no-annual-fee-credit-card-2026)
- [/cards/blue-cash-everyday](/cards/blue-cash-everyday)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/blue-cash-everyday](/cards/blue-cash-everyday); outbound only through `/go/blue-cash-everyday`

## Engine notes

- Register issuer terms before drafting: blue-cash-everyday, chase-freedom-unlimited, citi-double-cash (fee already checked for blue-cash-everyday, chase-freedom-unlimited, citi-double-cash).

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
