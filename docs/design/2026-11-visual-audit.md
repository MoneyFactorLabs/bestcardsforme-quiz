# Visual and UX audit: homepage, quiz, results (November 2026)

Scope set by Tim: a design-system and UX refinement, not a rebrand. Start with the homepage, quiz and recommendation results; do not touch scoring, SEO metadata, affiliate routing or analytics. Screenshots: `docs/qa/visual-2026-11/` (before/after, desktop 1280px and iPhone 13).

## Findings (before), in priority order

| # | Area | Finding | Impact |
|---|---|---|---|
| 1 | Results | No recommendation visible above the fold on desktop: a dark header, a three-cell "scoring basis" strip and a full profile panel come first. | The answer the user came for is a scroll away. |
| 2 | Results | The dollar figure shown is the card's generic range ("$400-$750"), placed next to the fee, so the reader has to do the subtraction. The personalized net value the engine computes only appeared inside one bullet ("clears the annual fee by about $X"), and was cut when a card had more than four bullets. | The product's most persuasive output is hidden. |
| 3 | Results (mobile) | After the last answer the page keeps the quiz's scroll position, so a phone lands partway down the results (the header area or below), not on the #1 card. | Users start reading from the middle. |
| 4 | Homepage | The right-hand panel shows abstract figures ("$625/yr", "Pass", "High") not tied to any card; the left repeats the same trust claims three times (inline line, four chips, two-column panel). | Looks like a mock-up; the product's real output is never shown. |
| 5 | Homepage | No route to the calculator, lounge guide or comparisons from the landing view. | Tools are hard to discover. |
| 6 | Typography | Arial everywhere; heavy wide-tracked uppercase eyebrows on most blocks; mid-word hyphenation in headlines ("ac-tual"); numbers not tabular. | Reads dated and busy; figures don't align. |
| 7 | Color/accessibility | Gold (#D4AF37) used for text on white, about 2:1 contrast (WCAG AA needs 4.5:1). | Eyebrows and labels are hard to read. |
| 8 | Quiz | Selected answer only gets a pale gold tint; progress shown as a percentage. An extra "How the quiz thinks" box sits above every question. | Weak feedback; extra scroll on phones. |
| 9 | Header (all pages) | On phones the disclosure bar plus three stacked full-width buttons take about 330px before any content. | Pushes every page's content below the fold. **Not changed:** see "Deferred". |

## What this PR changes

- **Design tokens** (`tailwind.config.ts`, `app/globals.css`): system UI font stack (no web-font download), `gold-ink` for gold text at AA contrast, `surface`/`line`/`positive`/`negative` tokens, a quieter background, tabular numerals for figures, no mid-word hyphenation in headings.
- **Results:** compact header; "Your shortlist at a glance" strip comparing the three cards by estimated net value, fee and fit; each card leads with an **estimated net value panel** (net after fee, value captured, fee, typical range) and keeps reasons, the caution and the review link; "How this estimate works" is an expandable explanation; the profile read-out moves below the cards as an expandable section; each screen now opens at its top.
- **Homepage:** single clear CTA with three trust points; the right panel is a **real engine result** for a stated sample profile (`lib/exampleRecommendation.ts`), labeled as an example; a "More ways to check the math" row links the calculator, lounge guide and comparisons.
- **Quiz:** segmented progress ("Question 3 of 9 · 6 to go", with `role="progressbar"`), answers as full-width tiles with a clear selected state and check mark, quieter back control.

## Unchanged by design

Recommendation scoring and ranking; quiz questions and answers; `quiz_completed` analytics; `/go/` affiliate routes; page titles, meta descriptions and canonicals; Header and Footer markup (the control article's fingerprint covers them); articles and card pages.

## Product finding for Tim (not changed here)

The shortlist is ranked by overall fit, of which value is one input. With net value now visible, the order can look inconsistent: for the homepage sample profile, #3 Chase Sapphire Preferred estimates **+$337/yr** against **+$203/yr** for #1 Venture X. The page now says so ("Ranked by overall fit … estimated net value is one input"). Whether ranking should weight net value more heavily is a scoring decision for a separate issue.

## Deferred (needs a decision)

1. **Mobile header:** collapse the three buttons into one row (logo + "Start quiz", text links below). This changes the Header markup on every page, including the control article, so it needs founder sign-off and a control-fingerprint update.
2. **Card comparison tables, calculators, lounge pages and article layouts** (priorities 4-6) pick up the new font and tokens automatically. Restyling them is the next PR.
3. **Card imagery:** no issuer card art is used; adding it needs licensed assets from issuers or affiliate networks.
