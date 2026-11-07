# Brief: Amex or Chase Ecosystem? A Household Wallet Comparison (2026)

_Status: **brief** · score 28 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/amex-vs-chase-ecosystem-household-2026` |
| Segment | portfolio |
| Primary intent | Should my household build around Amex Membership Rewards or Chase Ultimate Rewards? |
| Conversion intent | comparing |
| Effort | extend model or data |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Best two- and three-card wallet inside each ecosystem for three households, plus the cost of splitting points across both.

Nearest existing page: [Amex Platinum vs Chase Sapphire Reserve 2026: Which Premium Card Wins?](/articles/amex-platinum-vs-chase-sapphire-reserve-2026) (similarity 0.36). The draft must say in its first section how it differs and link to that page.

## Calculation model

wallet: Wallet model; ecosystem wallets built from verified cards only.

**Year-2 net by household (model output, editorial review required)**

| Wallet | Home-centered (Year-2 net) | Balanced (Year-2 net) | Travel-heavy (Year-2 net) |
|---|---|---|---|
| Amex: Gold + Platinum (+ Double Cash) | $2,366 | $4,129 | $6,094 |
| Chase: Reserve + Freedom Unlimited | $1,751 | $3,280 | $5,252 |
| Split: Reserve + Freedom Unlimited + Gold | $2,568 | $4,085 | $5,985 |

## Assumptions to state on the page

- Points at methodology values; 1¢ cash-out sensitivity

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): American Express Gold, American Express Platinum, Chase Sapphire Reserve
- **Add to quality/issuer-claims.json first:** Chase Freedom Unlimited
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [What Is the Best 2-Card Credit Card Setup in 2026?](/articles/best-2-card-credit-card-setup-2026)
- [Amex Platinum vs Chase Sapphire Reserve 2026: Which Premium Card Wins?](/articles/amex-platinum-vs-chase-sapphire-reserve-2026)
- [Best Credit Cards for High-Income Households 2026: Premium Rewards Compared](/articles/best-credit-card-high-income-households-2026)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/amex-gold](/cards/amex-gold); outbound only through `/go/amex-gold`
- Card review: [/cards/chase-sapphire-reserve](/cards/chase-sapphire-reserve); outbound only through `/go/chase-sapphire-reserve`

## Engine notes

- Partial overlap with /articles/amex-platinum-vs-chase-sapphire-reserve-2026 (similarity 0.36); the brief must state how the angle differs.
- Register issuer terms before drafting: chase-freedom-unlimited (fee already checked for chase-freedom-unlimited).
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
