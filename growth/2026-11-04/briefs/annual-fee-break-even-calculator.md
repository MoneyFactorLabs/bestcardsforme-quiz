# Brief: Credit Card Annual Fee Break-Even Calculator

_Status: **brief** · score 25 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/credit-card-annual-fee-break-even-calculator` |
| Segment | premium-economics |
| Primary intent | How much do I need to spend or use in credits for this annual fee to pay off? |
| Conversion intent | comparing |
| Effort | new model or tool |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Interactive version of the methodology: enter spend by category and credits you would use; get Year-2 net against the 2% baseline for any card in the database.

Nearest existing page: [Best Credit Card for Dining in 2026: Cash Back vs Points by Spend and Fee](/articles/best-credit-card-for-dining-restaurants-2026) (similarity 0.49). The draft must say in its first section how it differs and link to that page.

## Calculation model

card-value: lib/cardValueModel.ts in the browser; a new page component (tool, not article).

## Assumptions to state on the page

- Uses the published methodology point values

## Sources to verify before drafting

- No products verified yet
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [/methodology](/methodology)
- [Two or Three Premium Credit Cards vs One: The Annual-Fee Stacking Math (2026)](/articles/multiple-premium-credit-cards-vs-one-2026)

## Calls to action

- Quiz: link `/` from the bottom line.

## Engine notes

- Partial overlap with /articles/best-credit-card-for-dining-restaurants-2026 (similarity 0.49); the brief must state how the angle differs.
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
