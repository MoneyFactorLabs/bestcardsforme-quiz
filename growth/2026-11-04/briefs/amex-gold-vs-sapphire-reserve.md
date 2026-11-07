# Brief: Amex Gold vs Chase Sapphire Reserve: $325 vs $795 for a Dining-Heavy Household (2026)

_Status: **brief** · score 40 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/amex-gold-vs-chase-sapphire-reserve-2026` |
| Segment | premium-economics |
| Primary intent | Do I need the Reserve, or does the Gold cover a household that mostly eats out and buys groceries? |
| Conversion intent | choosing / applying |
| Effort | reuse existing model |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Head-to-head Year-2 net by profile, the travel spend at which the Reserve overtakes the Gold, and what holding both adds.

Nearest existing page: [Amex Platinum vs Chase Sapphire Reserve 2026: Which Premium Card Wins?](/articles/amex-platinum-vs-chase-sapphire-reserve-2026) (similarity 0.36). The draft must say in its first section how it differs and link to that page.

## Calculation model

wallet: Wallet model; Gold caps and Reserve direct-travel rates already verified.

**Year-2 net by household (model output, editorial review required)**

| Wallet | Home-centered (Year-2 net) | Balanced (Year-2 net) | Travel-heavy (Year-2 net) |
|---|---|---|---|
| Amex Gold + Double Cash | $2,634 | $3,364 | $4,229 |
| Sapphire Reserve + Freedom Unlimited | $1,751 | $3,280 | $5,252 |
| All three | $2,568 | $4,085 | $5,985 |

## Assumptions to state on the page

- Freedom Unlimited paired with the Reserve; Double Cash paired with the Gold

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): American Express Gold, Chase Sapphire Reserve
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Is American Express Gold Still Worth the $325 Annual Fee in 2026?](/articles/is-amex-gold-worth-it-2026)
- [Chase Sapphire Reserve Annual Fee 2026: Is It Still Worth It?](/articles/is-chase-sapphire-reserve-worth-it-2026)
- [Best Credit Card for Dining in 2026: Cash Back vs Points by Spend and Fee](/articles/best-credit-card-for-dining-restaurants-2026)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/amex-gold](/cards/amex-gold); outbound only through `/go/amex-gold`
- Card review: [/cards/chase-sapphire-reserve](/cards/chase-sapphire-reserve); outbound only through `/go/chase-sapphire-reserve`

## Engine notes

- Partial overlap with /articles/amex-platinum-vs-chase-sapphire-reserve-2026 (similarity 0.36); the brief must state how the angle differs.
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
