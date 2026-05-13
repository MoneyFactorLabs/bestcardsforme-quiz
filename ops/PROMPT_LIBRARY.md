# Prompt Library — MoneyFactor / BestCardsForMe

_Last updated: 2026-05-12_

Reusable prompt patterns for common Claude tasks. Use these as starting points; customize per context. For mobile/dispatch use, see `ops/DISPATCH_PROTOCOL.md` for the four-section brief format.

---

## Production verification

```
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
- pass/fail per check
- any issues observed

Do not change anything. Read-only verification.
```

---

## GSC daily check

```
Open Google Search Console for bestcardsforme.com.

Report:
- total clicks (last 24h and last 7 days)
- total impressions (24h and 7d)
- average CTR
- average position
- top pages by impressions
- top queries by impressions
- any new indexing issues
- 404 validation status if visible

Do not change anything.
Do not request indexing.
Just report the data.

Output: append to ops/GSC_LOG.md with date header.
```

---

## GSC weekly comparative read

```
Open Google Search Console. Compare last 7 days to prior 7 days.

Report:
- Total impressions change (absolute + percent)
- Total clicks change
- Average position change
- Top 5 URLs by impression growth or decline
- Any URL that crossed into top-10 position this week
- Any URL that dropped out of top-10 this week
- AI-style long-tail queries newly appearing

Recommendation: any URL warranting action (snippet rewrite, content refresh, technical fix)?

Output: append to ops/GSC_LOG.md
```

---

## Source request evaluation

```
Evaluate this journalist/source request for BestCardsForMe.

Decide:
1. Is it a fit?
2. Should we respond or skip?
3. What angle should we use?
4. Should we mention BestCardsForMe?
5. Should we include a link?

Rules:
- Respond only to credit cards, annual fees, rewards, travel rewards, balance transfers, consumer credit behavior, or closely related personal finance
- Skip investing/portfolio/tax/legal topics unless the request clearly fits Tim's CRE finance background or consumer credit-card expertise
- No exaggeration, no affiliate hype
- Attribution: "Tim, founder and editor of BestCardsForMe"

Use BCFM_Source_Response_Library.md as the source for response templates.

Output: in chat for founder review before responding.
```

---

## Claude Code engineering ticket

```
Engineering ticket for Claude Code session.

Scope:
[Specific files affected, specific change required]

Acceptance criteria:
1. [Specific outcome 1]
2. [Specific outcome 2]
3. [Specific outcome 3]

Verification:
- [Test or check that confirms the change works]
- [Run command or visual check]

Doctrine constraints:
- No production launch of new vertical
- No changes to BCFM titles/metas unless triggered by GSC data
- No deletion or destructive operations without explicit approval

Output:
- Commit message format: [type]: [short description]
- Push to origin/main only after passing verification
- Report commit hash + verification result
```

---

## Affiliate application status update

```
Update affiliate application status.

For each network (FlexOffers, CardRatings, CJ Affiliate, future direct issuer programs):
- Current status (pending, approved, declined, active)
- Application date
- Next follow-up date
- Notes since last update
- Recommendation: reapply, wait, or active follow-up

Do not submit new applications. Founder-action only.

Output: update ops/AFFILIATE_STATUS.md
```

---

## Article draft

```
Draft a new BCFM article.

Topic: [specific topic]
Target queries: [1-3 specific queries the article targets]
Comparison framing: [if applicable, which cards/options compared]

Required sections:
- Quick-answer lead (1 paragraph, specific number-led)
- Substantive H2/H3 body
- "Who should get it" and "Who should skip it"
- FAQ block (8-10 questions, GEO-formatted)
- Recommended Cards section per BCFM_Recommended_Cards_Template.md
- Trust/compliance footer

Voice:
- Honest math, Year-2 economics framing
- Conservative point valuations (UR 1.6¢, MR 1.7¢, etc.)
- No welcome bonus anchoring
- No affiliate hype

Length: 2,500-3,500 words.

Internal links: reference 3-5 existing BCFM articles per the Internal Linking Map.

Output: ~/Documents/MoneyFactor/BCFM_Article_NN_[slug].md
```

---

## Competitor / SERP analysis

```
Analyze the current top-ranking pages for [specific query].

Pull the top 5-10 URLs. For each:
- Domain authority (rough estimate)
- Title and meta description (verbatim)
- Core framing/angle
- Trust signals visible

Identify:
- Common patterns across top results
- Specific gaps where BCFM's framing could win
- Honest assessment of whether BCFM should attempt to compete or skip

Output: ~/Documents/MoneyFactor/Competitor_[Topic]_Analysis.md
```

---

## AI citation weekly tracking

```
Run the AI citation tracking pull.

Use the starter prompt list in ops/AI_CITATION_TRACKING.md.

Platforms: ChatGPT, Perplexity, Google AI Overviews, Gemini.

For each prompt + platform combination:
- Was MoneyFactor or BCFM mentioned?
- Was BCFM URL cited?
- Sentiment (positive, neutral, negative)
- Position in answer (prominent, middle, buried, absent)
- Score per the 0-5 rubric

Compute total score (sum / total possible) and compare to prior week.

Identify:
- Prompts where BCFM gained visibility
- Prompts where competitors continue to dominate
- Any new query pattern emerging

Output: append to ops/AI_CITATION_TRACKING.md with date header
```

---

## Content refresh audit

```
Audit specific BCFM article for staleness.

Article: [URL or filename]

Check:
- Annual fee currently cited vs current issuer published value
- Welcome bonus framing (we don't anchor on this — verify language is correct)
- Lifestyle credit details vs current issuer terms
- Any referenced 2025 or earlier dates that should now reflect 2026
- Internal link targets (verify they still exist and resolve)

Report:
- Specific stale claims with current correct values
- Recommendation: edit in place, partial rewrite, or full rewrite
- If edit, the specific lines to change

Output: report in chat; if rewrite recommended, dispatch article draft as follow-up
```

---

## Authority outreach response draft

```
Draft a response for [Reddit thread / journalist query / outreach opportunity].

Source: [URL or query]
Platform: [Reddit, Qwoted, Featured, etc.]

Rules per platform:
- Reddit: no links, no BCFM mention, under 200 words, conversational tone
- Journalist: attribution "Tim, founder and editor of BestCardsForMe," methodology framing
- Direct outreach: editorial collaboration framing

Use BCFM_Source_Response_Library.md and BCFM_Reddit_Response_Bank.md for tone and patterns.

Output: in chat for founder review before posting/sending
```

---

## OPS CHECK (status snapshot trigger)

When founder types "OPS CHECK" in chat, respond with:

```
1. Current status
   - BCFM: live URL count, GSC summary, recent deployment
   - Doctrine state: any active triggers (revenue threshold, etc.)

2. Highest-ROI next action
   - Specific task that would move the needle most
   - Why this rather than alternatives

3. What NOT to do
   - 1-3 specific traps to avoid this cycle
   - Doctrine constraints currently binding

4. Which tool owns the next task
   - Claude chat / Claude Code / Chrome extension / Dispatch / Founder
   - Specific suggested next step
```

---

## Doctrine reference

For prompts requiring doctrine context, anchor on:
- `DOCTRINE.md` (repo root) — canonical doctrine
- `ops/MONEYFACTOR_VERTICAL_RULES.md` — vertical and language doctrine
- `ops/AGENT_ROLES.md` — operating model
- `ops/MONEYFACTOR_PROJECT_BRIEF.md` — strategic frame

When a prompt's output might conflict with doctrine, surface the conflict before executing.
