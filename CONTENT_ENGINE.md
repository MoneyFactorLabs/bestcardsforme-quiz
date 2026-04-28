# BestCardsForMe Content Engine

BestCardsForMe now has infrastructure for long-form finance-editorial articles without publishing
placeholder content.

## Current Audit

- There was no blog, article, or scalable editorial publishing route.
- Existing public editorial surfaces were trust pages and individual card review pages.
- Card data already supports internal recommendation CTAs through `/cards/[id]`.
- The new article route is ready, but `data/articles.ts` intentionally publishes no articles yet.

## How To Publish A Real Article

Add an `EditorialArticle` object to `data/articles.ts`.

Before drafting the first Batch 1 articles, read:

- `content-research/Content_Research_Harvest_Batch1.md`

Required fields:

- `slug`
- `eyebrow`
- `title`
- `dek`
- `category`
- `updatedAt`
- `reviewedBy`
- `readingTime`
- `sections`

Optional modules:

- `comparisonMetrics` for long-form comparison snapshots
- `cardCtas` for internal links to card reviews
- `faqs` for FAQ sections
- `disclosureCta` for methodology, affiliate, or quiz CTAs

## Editorial Standards

Articles should be written as consumer finance editorial, not generic blog posts. Every comparison
should make the tradeoff visible:

- realistic annual value after annual fees
- who captures the value and who does not
- issuer marketing claims that require caution
- offer and term uncertainty
- internal card review links where useful
- clear disclosure language when monetization may exist

Do not publish invented offers, fake review dates, fake staff credentials, fake testimonials, or
unverified issuer claims.
