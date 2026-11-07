# BCFM Growth Engine

Turns Google Search Console exports into ranked, non-duplicate content opportunities, reviewable briefs, and a weekly report. It never publishes, posts, or calls an external API, and it adds no services or credentials. (Issue #16.)

```bash
npm run growth -- --manifest growth/inputs/<week>.json   # writes growth/<label>/report.md and briefs/
```

## Weekly loop (about 15 minutes of founder time)

1. **Export from Search Console** (Performance → Search results → Date: Compare → Last 7 days vs previous 7 days → Export → CSV). The zip contains `Queries.csv` and `Pages.csv`. A long-format export from Windsor.ai or the API (one row per `date` and `page`/`query`) works too.
2. **Add a manifest.** Copy `growth/inputs/2026-11-04.json`, set the label and date ranges, and list the files. The manifest fields are:
   - `label`: names the output folder
   - `source`: provenance, shown in the report
   - `currentRange` and `previousRange`
   - `totals`: optional site totals from the Search Console header cards
   - `current` and `previous`: export files, relative to the manifest. Use `previous` only for single-period exports.
3. **Run** `npm run growth -- --manifest growth/inputs/<week>.json`.
4. **Review** `growth/<label>/report.md`: site totals, page table, wins and regressions, ranked opportunities, and the proposed next batch.
5. **Approve a brief** (`growth/<label>/briefs/<id>.md`). An approved brief becomes a GitHub issue using the Execution template, and Claude Code drafts it through the normal content pipeline (`CONTENT_ENGINE.md`): claims registered, figures computed in code, `npm run qa`, a PR, then founder merge.

The **Growth Engine** workflow (Actions tab, manual only) runs the same command on a committed manifest and uploads the report as an artifact. It has no schedule; add one only after review.

## Data handling

- This repository is **public**. Raw query exports reveal what people search to find the site, so keep them in `growth/inputs/private/` (git-ignored) unless Tim decides to commit them.
- The committed 2026-11-04 input contains only page-level figures already posted in Issue #16.
- Figures are used as exported. Pages or queries under 20 impressions in both periods are flagged as low volume. Missing periods are reported as missing, never filled in.
- Search Console performance data shows impressions, not index status. Use URL Inspection for indexing.

## How opportunities are scored

Candidates live in `data/growth/candidates.ts`. Each is a hypothesis an editor writes down, with these fields:
- intent
- query patterns
- the BCFM calculation it relies on
- the issuer products it would cite
- internal links and CTAs

The engine (`lib/growth/opportunities.ts`) adds the scoring components below:

| Component | Points | Source |
|---|---|---|
| Evidence | 0–30 | Observed impressions on matching queries (or the target page for "improve"), log-scaled. No invented volumes. |
| Ranking headroom | 0–15 | Current average position. Positions 8–20 score highest. |
| Differentiation | 0–25 | 15 if it uses a BCFM calculation model; up to 10 for the share of cited products verified in `quality/issuer-claims.json` |
| Conversion intent | 5–15 | Informational (1), comparing (2), choosing or applying (3) |
| Segment priority | 4–10 | High-income, business, premium economics and portfolios score 10 |
| Effort | 0 to −10 | Reuse an existing model (0) through a new tool (−10) |
| Overlap | 0 or −10 | Partial similarity to an existing article |

Each candidate also gets a status:

| Status | Meaning |
|---|---|
| `brief` | Ready to brief |
| `needs-facts` | None of the cited products is in the claim registry yet; register them first |
| `hold` | An improve target rewritten within 30 days; wait for Google to recrawl |
| `protected` | The control article; never edited, only supported with inbound links |
| `duplicate` | Same intent as an existing article (similarity ≥ 0.5), or the slug already exists; improve that page instead |

## Adding candidates

- Add an entry to `data/growth/candidates.ts`.
- Include a `preview` when the wallet model can already compute it.
- `npm test` checks that the entry is well formed, links only to real pages, and that every briefable new page stays below the duplicate threshold.
