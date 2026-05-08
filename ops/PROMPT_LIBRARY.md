# Prompt Library

## Production verification prompt
Run a production verification pass for the latest push.

Check:
1. Changed route/page renders correctly.
2. bestcardsforme.com homepage still renders normally.
3. moneyfactor.io renders the MoneyFactor landing page.
4. No obvious console/runtime errors.
5. If applicable, confirm schema/meta/link changes are present in production HTML.

Return:
- commit hash tested
- URLs checked
- pass/fail results
- any issues

## GSC daily check prompt
Open Google Search Console for bestcardsforme.com.

Report:
- total clicks
- total impressions
- average CTR
- average position
- top pages by impressions
- top queries by impressions
- any new indexing issues
- status of 404 validation if visible

Do not change anything.
Do not request indexing.
Just report the data.

## Source request evaluation prompt
Evaluate this journalist/source request for BestCardsForMe.

Decide:
1. Is it a fit?
2. Should we respond or skip?
3. What angle should we use?
4. Should we mention BestCardsForMe?
5. Should we include a link?

Rules:
- respond only to credit cards, annual fees, rewards, travel rewards, balance transfers, consumer credit behavior, or closely related personal finance
- skip investing/portfolio/tax/legal topics unless the request clearly fits Tim’s CRE finance background or consumer credit-card expertise
- no exaggeration
- no affiliate hype

## Codex deploy prompt
Commit, push, and deploy the approved changes.

Tasks:
1. commit current approved changes
2. push to origin/main
3. confirm production deployment
4. verify the affected production URLs
5. confirm no unrelated changes

Return:
- commit hash
- deployment status
- production verification
- issues

## Affiliate application status update prompt
Update affiliate status.

Track:
- network
- application date
- current status
- next follow-up date
- notes
- whether reapply is appropriate

Do not submit new applications without approval.
