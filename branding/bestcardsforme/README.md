# Best Cards For Me: logo assets

> **Archived (2026-11-10).** The founder moved Best Cards For Me to a typography-first identity endorsed by the MoneyFactor logo: see `../bestcardsforme-typographic/`. These files are kept for the record and are not the current direction.

Vector production files for the **Best Cards For Me** logo, traced faithfully from the founder-approved original ChatGPT artwork (`source/original-chatgpt.png`). The design is unchanged: same three-card B, gradient, swoosh, colors and type. Tracing only turns the raster's soft edges into clean curves.

**Status:** asset review only. These files are **not used by the site**: no header, favicon, metadata or page imports them. Wiring them in is a separate, founder-approved change, because the shared Header is part of the control article's fingerprint.

## Approved wording and hierarchy
- The endorsement line is exactly **"Powered by MoneyFactor"**, with no trailing punctuation. Do not change it to "by MoneyFactor" or "A MoneyFactor product".
- **MoneyFactor stays prominent**, at its original size and weight relative to "Best Cards For Me" (MoneyFactor is the parent platform for future verticals). Do not shrink it into a footnote.
- "Me" is set in the accent blue.

## Files

| File | Use |
|---|---|
| `svg/bcfm-original-horizontal-light.svg` | Primary logo on white or light backgrounds |
| `svg/bcfm-original-horizontal-dark.svg` | Primary logo on navy or dark backgrounds (navy background included) |
| `svg/bcfm-original-stacked-light.svg`, `-dark.svg` | Responsive variant for narrow spaces: the icon centered above the same two-line wordmark |
| `svg/bcfm-original-icon.svg` | The B icon on its own (social avatars, app icons, large favicon sizes) |
| `svg/bcfm-original-favicon.svg` | Simplified icon for 16–32px browser tabs: the B plus one merged blue card; the small teal card is dropped because it blurs at that size. The B turns white automatically in dark browser themes (`prefers-color-scheme`). |
| `png/bcfm-original-horizontal-*.png`, `png/bcfm-original-stacked-*.png` | 2× raster exports (the light ones have transparent backgrounds) |
| `png/bcfm-original-icon-512.png` | Icon, 512px, transparent |
| `png/favicon-32.png` | Raster favicon fallback |
| `png/apple-touch-icon-180.png` | iOS home-screen icon (icon on white) |
| `previews/comparison.html` / `.png` | The original next to every vector variant |
| `tools/trace_original.py` | Rebuilds every SVG from the source image; the output is byte-for-byte reproducible |

## Palette (measured from the original)

| Role | Hex |
|---|---|
| Wordmark navy ("Best Cards For", "MoneyFactor") | `#0A1F52` |
| "Me" accent blue | `#0057FB` |
| "Powered by" slate | `#547492` |
| Teal card | `#00BEC1` |
| Blue card | `#006CF5` |
| Lower blue card | `#0053ED` |
| B gradient, top → bottom | `#0F436E` → `#0C4771` → `#0F3161` → `#11295B` |
| Divider | `#ACBBCC` |
| Dark variant | background `#0A1F52`, wordmark `#FFFFFF`, "Me" `#5B9BFF`, "Powered by" `#AEBBD0`, B white → `#E3EAF3` |

## Usage notes
- **Contrast:** the navy wordmark and "Me" blue pass WCAG AA on white. The slate "Powered by" is about 4.9:1 on white, which passes at the sizes used. The teal card is decorative.
- **Minimum size:** use the horizontal lockup down to about 240px wide. Below that, use the stacked lockup so "Powered by MoneyFactor" stays legible, at least 12px tall. Use the favicon SVG only at 16–48px, and the icon above that.
- **Clear space:** keep at least the height of the "B" in "Best" clear on all sides.

## Rebuilding
```bash
cd branding/bestcardsforme
pip install -r tools/requirements.txt
python3 tools/trace_original.py   # rewrites svg/*.svg
```
PNG exports and the comparison are rendered from the SVGs with a headless browser, for example Playwright screenshots of `previews/comparison.html`.

## Known limits
- **Lettering:** it's traced from the image, not set in a font. It's faithful, but editing the text or adding new words needs the original typeface or a designer.
- **AI-generated source:** copyright protection for purely AI-generated artwork is uncertain. Before registering the mark, have a designer produce a final master from these files, and run a trademark search on the name and the mark.

## Related
- The MoneyFactor M logo was supplied on 2026-11-10 and traced the same way: `../moneyfactor/`.
- The review of how the two marks fit together, and an optional palette alignment for this logo, is in `../system/README.md`. The files in this folder stay as supplied until the founder decides.
