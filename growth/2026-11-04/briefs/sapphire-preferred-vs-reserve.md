# Brief: Sapphire Preferred vs Sapphire Reserve: At What Spend Does the $700 Gap Pay? (2026)

_Status: **brief** · score 30 · generated 2026-11-07 from 2026-11-04. Draft only; not published._

| Field | Value |
|---|---|
| Type | New page |
| Canonical target | `/articles/chase-sapphire-preferred-vs-sapphire-reserve-2026` |
| Segment | premium-economics |
| Primary intent | Should I get the Sapphire Preferred or the Sapphire Reserve for my travel and dining? |
| Conversion intent | choosing / applying |
| Effort | extend model or data |

## Search evidence

No Search Console impressions matched yet. This is a hypothesis to test, not measured demand.

## Unique angle

Travel and dining spend at which the Reserve's earn and credits overtake the Preferred's $95 fee, by household profile.

Nearest existing page: [Amex Platinum vs Chase Sapphire Reserve 2026: Which Premium Card Wins?](/articles/amex-platinum-vs-chase-sapphire-reserve-2026) (similarity 0.43). The draft must say in its first section how it differs and link to that page.

## Calculation model

wallet: Wallet model; Sapphire Preferred earn rates must be verified and added to the registry.

## Assumptions to state on the page

- Credit capture from the household profiles

## Sources to verify before drafting

- Verified against issuer pages (quality/issuer-claims.json): Chase Sapphire Reserve
- **Add to quality/issuer-claims.json first:** Chase Sapphire Preferred
- Every rate, credit, fee and cap stated on the page needs a claim entry; `npm run verify:claims -- --issuers` must pass in CI.

## Internal links

- [Is Chase Sapphire Preferred Still the Best $95 Travel Card in 2026?](/articles/is-chase-sapphire-preferred-best-95-travel-card-2026)
- [Chase Sapphire Reserve Annual Fee 2026: Is It Still Worth It?](/articles/is-chase-sapphire-reserve-worth-it-2026)
- [Chase Sapphire Reserve vs Capital One Venture X: Which Premium Travel Card Wins in 2026?](/articles/chase-sapphire-reserve-vs-capital-one-venture-x-2026)

## Calls to action

- Quiz: link `/` from the bottom line.
- Card review: [/cards/chase-sapphire-preferred](/cards/chase-sapphire-preferred); outbound only through `/go/chase-sapphire-preferred`
- Card review: [/cards/chase-sapphire-reserve](/cards/chase-sapphire-reserve); outbound only through `/go/chase-sapphire-reserve`

## Engine notes

- Partial overlap with /articles/amex-platinum-vs-chase-sapphire-reserve-2026 (similarity 0.43); the brief must state how the angle differs.
- Register issuer terms before drafting: chase-sapphire-preferred (fee already checked for chase-sapphire-preferred).
- No Search Console evidence yet: a hypothesis to test, not a measured demand.

## Definition of done

- Figures computed in code (wallet or card value model) and pinned in a test
- Issuer claims registered and verified in CI; no invented offers, credits or review dates
- Unique title, meta description and canonical; in the sitemap; linked from at least two existing pages
- `npm run qa` passes; the control article is unchanged
- Founder approves the PR
