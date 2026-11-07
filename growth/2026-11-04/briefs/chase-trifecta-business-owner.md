# Brief: Sapphire Reserve + Freedom Unlimited + Ink Preferred: The Three-Card Math for Business Owners (2026)

_Status: **brief** · score 42 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/sapphire-reserve-freedom-unlimited-ink-preferred-business-owner-2026` |
| Segment | portfolio |
| Primary intent | Is the three-card Chase setup worth it for someone with both household and business spending? |
| Conversion intent | choosing / applying |
| Effort | extend model or data |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Household plus business spend through one Ultimate Rewards pool, compared with the same household using a 2% card for business spend, with the fee stack and break-even shown.

Nearest existing page: [Two or Three Premium Credit Cards vs One: The Annual-Fee Stacking Math (2026)](/articles/multiple-premium-credit-cards-vs-one-2026) (similarity 0.29). Distinct intent.

## Calculation model

wallet: Wallet model with personal and business categories in one wallet.

**Balanced household + $80k business spend, Year-2 net (model output, editorial review required)**

| Wallet | Fees | Year-2 net |
|---|---|---|
| Reserve + Freedom Unlimited + Double Cash for business | $795 | $5,200 |
| Reserve + Freedom Unlimited + Ink Preferred | $890 | $5,825 |
| Reserve + Freedom Unlimited + Ink Preferred + Spark Cash Plus | $1,040 | $5,675 |

## Assumptions to state on the page

- Balanced household profile from the $200k–$400k guide
- Points pooled across cards the same household holds

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): Chase Sapphire Reserve, Chase Ink Business Preferred
- **Add to quality/issuer-claims.json first:** Chase Freedom Unlimited
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Credit Card Strategy for $200k–$400k Households: Spend Mix Beats Income (2026)](/articles/credit-card-strategy-200k-400k-household-income-2026)
- [Best Business Credit Card for an LLC Owner in 2026](/articles/best-business-credit-card-for-llc-owner-2026)
- [/cards/chase-sapphire-reserve](/cards/chase-sapphire-reserve)
- [Best Credit Cards for High-Income Households 2026: Premium Rewards Compared](/articles/best-credit-card-high-income-households-2026)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/chase-sapphire-reserve](/cards/chase-sapphire-reserve); outbound only through `/go/chase-sapphire-reserve`
- Card review: [/cards/ink-business-preferred](/cards/ink-business-preferred); outbound only through `/go/ink-business-preferred`

## Engine notes

- Register issuer terms before drafting: chase-freedom-unlimited (fee already checked for chase-freedom-unlimited).
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
