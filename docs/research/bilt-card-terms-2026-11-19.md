# Bilt Card 2.0 terms verified November 19, 2026

The Wells Fargo Bilt Mastercard was usable through February 6, 2026. BiltProtect rent payments ended February 3. Bilt Card 2.0 went live February 7. Column N.A. issues the current cards and Cardless services them. Bilt's card page links to an application for each current product.

| Product | Annual fee | Standard purchase points | Benefits before refresh | Benefits after refresh |
| --- | ---: | --- | --- | --- |
| Blue | $0 | 1x on everyday purchases | No annual credit modeled | No annual credit modeled |
| Obsidian | $95 | 3x on dining or grocery by choice (grocery bonus applies to the first $25,000 per year), 2x on travel, 1x otherwise | Up to $100 in qualifying Bilt Travel hotel statement credits, split into two $50 periods | $100 annual Bilt Cash credit |
| Palladium | $495 | 2x on everyday purchases | Up to $400 in qualifying Bilt Travel hotel statement credits, split into two $200 periods, plus $200 in annual Bilt Cash | $600 annual Bilt Cash credit, with eligible Bilt Travel hotel redemptions of up to $200 twice per year |

The table excludes partner, portal and promotional multipliers. Bilt Cash has eligible uses and redemption limits. Treating it as unrestricted cash or adding the hotel redemption allowance on top of the $600 would overstate value. Priority Pass is a Palladium benefit. Its value depends on usage and overlap with existing memberships.

## Eligible housing payments

Eligible rent and mortgage payments go through Bilt and draw from a linked bank account. Bilt charges no transaction fee for these payments with the Bilt Card. They do not use the card's credit line.

The housing-spend option compares qualifying non-housing spend to the housing payment in the same billing cycle.

| Spend as a share of housing payment | Housing points |
| --- | ---: |
| Under 25% | 250 points |
| At least 25% | 0.5 points per dollar |
| At least 50% | 0.75 points per dollar |
| At least 75% | 1 point per dollar |
| At least 100% | 1.25 points per dollar |

Before the refresh, Flexible Bilt Cash is an alternative to the spend-based housing tiers. It earns 4% Bilt Cash on eligible everyday purchases on top of the card's separate purchase points. $30 Bilt Cash unlocks 1,000 housing points, up to 1 point per eligible housing dollar. Using Bilt Cash this way carries the opportunity cost of other eligible uses.

New accounts opened on or after January 1, 2027 enter the refreshed spend-based program. Earlier accounts generally switch on the first account anniversary in 2027. Bilt describes an advance opt-out for cardholders who want to keep Flexible Bilt Cash and existing credits. The October 27 update also changes Bilt Cash expiration to month-end 12 months after earnings and moves annual Bilt Cash credits to account anniversaries.

## Implementation notes

- Keep the Wells Fargo slug and disconnected application status. Add three distinct current slugs.
- Keep the 2026 and 2027 credit rules separate. Model the housing option only where eligible housing and qualifying spend are known. The general quiz does not collect those inputs.
- Treat point values as assumptions. For the comparison hub, show total household card spend, the cost of moving spend from an existing card, and credit utilization explicitly. Lead with the three-card comparison and a separate Palladium decision for high-income households if it adds distinct examples.

## Primary sources

- [Bilt Card Offer Terms, updated October 27, 2026](https://www.bilt.com/terms/bilt-card-offer-terms)
- [Bilt Card 2.0 Program Overview](https://support.biltrewards.com/hc/en-us/articles/42897766682381-Bilt-Card-2-0-Program-Overview)
- [Bilt Card 2.0 Transition](https://support.biltrewards.com/hc/en-us/articles/40834037331085-Bilt-Card-2-0-Transition)
- [Bilt card lineup and application availability](https://www.bilt.com/card)
