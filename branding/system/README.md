# MoneyFactor + Best Cards For Me: brand system review

Compares the two founder-supplied logos and proposes an **optional** palette alignment. Nothing here replaces the faithful files in `../bestcardsforme/` and `../moneyfactor/`, and nothing is used by the site.

Preview: `previews/system-comparison.png` (A = as supplied, B = aligned proposal, light and dark, plus the palette changes).

## What the review found

| | Best Cards For Me | MoneyFactor |
|---|---|---|
| Mark | Three-card stack forming a B, with a swoosh | Folded two-ribbon M |
| Navy | `#0A1F52` (bluer) | `#0B1B39` (darker, less saturated) |
| Teal | cyan `#00BEC1` (small card) | mint `#10A390` / ribbon up to `#19D7B9` |
| Accent | blue `#0057FB` ("Me") | none |
| "MoneyFactor" styling | all navy in "Powered by MoneyFactor" | two-tone: navy "Money", teal "Factor" |

Visual weight is already close: both wordmarks are heavy geometric sans, and both icons sit at roughly cap height plus descender.

## Proposal B (optional; founder decision)

Only the Best Cards For Me lockup changes; MoneyFactor stays exactly as supplied.

1. **One navy:** BCFM navy `#0A1F52` → parent navy `#0B1B39` (light theme only; the dark lockups keep the shared `#0A1F52` background).
2. **One teal family:** the B's teal card `#00BEC1` → parent mint `#17C3A8`.
3. **Endorsement echoes the parent:** in "Powered by MoneyFactor", "Factor" is set in teal: `#0B7F70` on light (4.9:1, AA for the small line), `#2FD3B6` on dark.

**Unchanged:** every shape, size and weight, and the exact wording **"Powered by MoneyFactor"** (no period) with MoneyFactor at its original size and weight. The "Factor" overlay is traced from the same pixels as the faithful file, so the outlines match exactly.

**Deliberately not done:** geometry was not unified. The B and the M use different motifs, and redrawing either would redesign an approved mark. If a shared motif is wanted, that's a designer brief, not a trace.

## Files

| File | What |
|---|---|
| `proposals/bcfm-aligned-horizontal-light.svg`, `-dark.svg` | Proposal B lockups |
| `previews/system-comparison.html` / `.png` | A vs B comparison sheet |
| `tools/align.py` | Builds the proposals from the faithful BCFM trace |

If B is approved, the remaining BCFM variants (stacked, icon, favicon, PNGs) get the same palette swap before any site wiring.

## Rebuilding
```bash
pip install -r branding/bestcardsforme/tools/requirements.txt
PYTHONDONTWRITEBYTECODE=1 python3 branding/system/tools/align.py
```
`align.py` imports the faithful trace script, which rewrites the same faithful SVGs byte-for-byte, so `git status` should show no change under `branding/bestcardsforme/`.

## Decisions needed from the founder
1. Keep the logos as supplied (**A**) or adopt the aligned palette (**B**).
2. If B: should "Factor" be teal in "Powered by MoneyFactor", or stay all navy?
3. Recommended before trademark filing: a designer-produced master for both marks and a trademark search.
