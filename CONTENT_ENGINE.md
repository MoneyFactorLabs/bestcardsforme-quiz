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

## Content Pipeline (no autopublishing)

Every article change follows the same path. No step publishes, posts, or contacts anyone
automatically; a person approves each merge and each external post.

1. **Opportunity.** A Search Console signal (impressions without clicks, a page losing
   traction in the weekly editorial audit, or a query cluster with no page) is written up as a
   GitHub issue with the evidence and the intended URL: new page, or an existing page to improve.
   Check the audit inventory first so a new page never competes with an existing one.
2. **Draft.** Claude Code drafts in a branch. Dollar figures in decision articles come from code
   (`lib/walletModel.ts`, `lib/cardValueModel.ts`), not hand arithmetic, and tests pin the
   headline results.
3. **Issuer fact check.** Every issuer term the article states goes into
   `quality/issuer-claims.json` with the issuer URL and a dated secondary source.
   `npm run verify:claims -- --issuers` (CI, from a GitHub runner) must find each claim on the
   issuer page. A term that cannot be verified is removed or the issue is marked blocked; it is
   never published on a secondary source alone.
4. **Human review.** Tim (or a delegated reviewer) reads the draft for accuracy, voice, and
   doctrine fit before the PR leaves draft.
5. **Pull request and preview.** The PR runs Quality gates (`npm run qa`, including the control
   page fingerprint), Issuer fact verification, and the Editorial audit. Review on the Vercel
   preview at mobile and desktop widths.
6. **Founder merge.** Only Tim merges to `main`. Merging deploys production.
7. **Production verify.** The Production verify workflow runs after the Vercel deployment and
   checks the live site.
8. **Monitoring.** The weekly Editorial audit (Tuesdays) reports orphans, duplicates, broken
   links, overdue reviews, and missing claim sources. To flag pages losing Search Console
   traction, run `npm run audit:editorial -- --gsc export.csv` with a Search Console or
   Windsor.ai export (columns: `page,impressions,previous_impressions`). The issuer checks
   run weekly (Mondays). Distribution drafts (for example LinkedIn) live in `ops/distribution/`
   and are posted manually only after approval.
