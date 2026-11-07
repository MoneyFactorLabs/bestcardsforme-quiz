# Brief: Amex Business Platinum vs Personal Platinum for Business Owners (2026)

_Status: **brief** · score 30 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/amex-business-platinum-vs-personal-platinum-2026` |
| Segment | business |
| Primary intent | As a business owner, should I hold the Business Platinum, the personal Platinum, or both? |
| Conversion intent | choosing / applying |
| Effort | new model or tool |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Which Platinum earns more for an owner's split of business and personal travel, and what holding both duplicates.

Nearest existing page: [Best Business Credit Card for an LLC Owner in 2026](/articles/best-business-credit-card-for-llc-owner-2026) (similarity 0.39). The draft must say in its first section how it differs and link to that page.

## Calculation model

wallet: Needs Business Platinum earn and credit amounts in the wallet model and claim registry.

## Assumptions to state on the page

- Business Platinum credit amounts must be verified first (flagged in PR #13)

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): Amex Business Platinum, American Express Platinum
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Best Credit Card for Business Owners (Beyond LLC Basics) in 2026](/articles/best-credit-card-for-business-owners-2026)
- [Is Amex Platinum Still Worth the $895 Annual Fee in 2026?](/articles/is-amex-platinum-worth-it-2026)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/amex-platinum](/cards/amex-platinum); outbound only through `/go/amex-platinum`

## Engine notes

- Partial overlap with /articles/best-business-credit-card-for-llc-owner-2026 (similarity 0.39); the brief must state how the angle differs.
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
