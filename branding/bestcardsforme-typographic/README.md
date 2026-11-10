# Best Cards For Me: typography-first lockups (proposal)

These lockups follow the founder's brand direction on PR #24 (2026-11-10):
- **MoneyFactor is the hero parent brand.** Its approved navy/teal folded-M logo and wordmark are reused unchanged.
- **Best Cards For Me is the clear consumer product.** It is a bold, readable name with no custom B icon.
- **The endorsement reads exactly "Powered by MoneyFactor"** (no period). It is prominent, and "MoneyFactor" is the approved MoneyFactor logo itself, so the parent identity stands out.

**Status:** proposal for founder review only. Nothing here is used by the site. The live header, the protected control page, favicons and SEO metadata are unchanged. Wiring any of this in needs separate approval.

Previews:
- `previews/lockups.png`: every variant in light and dark, small-size checks, and the favicon.
- `previews/header-mockups.png`: desktop 1280px and mobile 390px header mockups. These are placeholder navigation, not the live header.

## Variants

| Variant | Use | Minimum height |
|---|---|---|
| **1 · Stacked** (primary) | Name over "Powered by" plus the full MoneyFactor logo (M + wordmark). Default for the desktop header, social cards and documents | 48px |
| **2 · Inline** | One row for wide desktop headers: name, thin rule, then "Powered by" over the MoneyFactor logo | 40px |
| **3 · Compact** | Mobile and small placements. It drops the M and sets the MoneyFactor wordmark larger, so "Powered by MoneyFactor" stays readable at phone sizes | 36px |
| **Favicon** | A plain type tile: white "B" on parent navy with a mint underline. It is not a custom icon, and it stays crisp at 16–32px | — |

**Recommended combination:** stacked or inline on desktop, and compact below about 640px wide.

## Files

| Path | What |
|---|---|
| `svg/bcfm-type-{stacked,inline,compact}-{light,dark}.svg` | Lockups; text is converted to outlines, so no font is needed to display them |
| `svg/bcfm-type-favicon.svg` | Favicon / app tile |
| `png/bcfm-type-*-{light,dark}.png` | 2× exports (light ones transparent) |
| `png/favicon-32.png`, `png/apple-touch-icon-180.png` (opaque square), `png/bcfm-type-favicon-512.png` | Icon exports |
| `previews/` | Review sheets (HTML + PNG) |
| `tools/build.py` | Rebuilds every SVG |

## Type and colour

**Product name:**
- **Font:** Red Hat Display ExtraBold (800), tracking −1%, SIL Open Font License.
- **Why this font:** it's the closest open-source match to the MoneyFactor wordmark's lettering, chosen by eye and by pixel-overlap scoring against the supplied artwork. It is a match, not a claim that the MoneyFactor artwork uses this font.

**"Powered by":** Red Hat Display SemiBold (600).

**"MoneyFactor":** the faithful trace in `../moneyfactor/`, not re-typed.

| Role | Light | Dark |
|---|---|---|
| "Best Cards For" | `#0B1B39` (MoneyFactor navy, ~17:1 on white) | `#FFFFFF` on `#0A1F52` |
| "Me" accent | `#0057FB` (existing BCFM blue, 5.6:1) | `#5B9BFF` |
| "Powered by" | `#547492` (4.9:1) | `#AEBBD0` |
| MoneyFactor logo | as approved (navy + teal) | approved dark variant |
| Favicon | tile `#0B1B39`, B white, underline `#17C3A8` | — |

## Rebuilding
```bash
pip install fonttools uharfbuzz numpy pillow potracer==0.0.4
PYTHONDONTWRITEBYTECODE=1 python3 branding/bestcardsforme-typographic/tools/build.py
```
The font is downloaded from google/fonts into `tools/.cache/`, which git ignores. The script imports the MoneyFactor trace, which rewrites the same MoneyFactor SVGs byte-for-byte. PNGs and previews are rendered with a headless browser (Playwright).

## Archived concepts (kept, not deleted)
- `../bestcardsforme/`: faithful trace of the original card-stack B lockup.
- `../system/proposals/ribbon-b/`: ribbon-style B, upright and leaning versions. The founder declined both.
- `../system/proposals/wordmark/`: the original lockup with only line 1 re-typed. Superseded by this folder.
- `../system/proposals/bcfm-aligned-*`: the palette-alignment proposal for the original lockup.

## Decisions needed from the founder
1. Which variant leads: stacked or inline on desktop. Compact is the mobile companion either way.
2. "Me" accent: keep the existing BCFM blue, or make the name all navy.
3. Favicon: this type tile, or the MoneyFactor M.
4. Separate approval before anything goes into the live header, favicon or metadata.
