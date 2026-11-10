# MoneyFactor: logo assets

Vector production files for the **MoneyFactor** parent logo, traced faithfully from the founder-supplied original artwork (`source/original-chatgpt.png`, supplied in chat on 2026-11-10). The design is unchanged: same folded-ribbon M (navy ribbon + mint/teal ribbon), same two-tone "Money" / "Factor" wordmark. Tracing only turns the raster's soft edges into clean curves.

**Status:** asset review only. These files are **not used by either site**: the MoneyFactor homepage, the BestCardsForMe header, favicons and metadata are untouched. Wiring them in is a separate, founder-approved change.

## Files

| File | Use |
|---|---|
| `svg/moneyfactor-original-horizontal-light.svg` | Primary logo on white or light backgrounds |
| `svg/moneyfactor-original-horizontal-dark.svg` | Primary logo on navy (navy background `#0A1F52` included) |
| `svg/moneyfactor-original-stacked-light.svg`, `-dark.svg` | Responsive variant for narrow spaces: the M centered above the wordmark |
| `svg/moneyfactor-original-icon.svg` | The M on its own, with the original ribbon shading (avatars, app icons, large favicon sizes) |
| `svg/moneyfactor-original-favicon.svg` | Simplified M for 16–32px tabs: flat colors instead of gradients. The navy ribbon turns white in dark browser themes (`prefers-color-scheme`) |
| `svg/moneyfactor-original-mono-navy.svg`, `-mono-black.svg`, `-mono-white.svg` | One-colour lockups (single-ink print, embossing, partner co-branding). The teal ribbon cuts a thin gap into the navy one so the fold still reads |
| `svg/moneyfactor-original-icon-mono-navy.svg`, `-icon-mono-white.svg` | One-colour M |
| `png/*mono*.png` | Transparent PNG exports of the monochrome versions (lockups 2×, icons 512px) |
| `png/moneyfactor-original-horizontal-*.png`, `png/moneyfactor-original-stacked-*.png` | 2× raster exports (light ones transparent) |
| `png/moneyfactor-original-icon-512.png` | Icon, 512px, transparent |
| `png/favicon-32.png` | Raster favicon fallback |
| `png/apple-touch-icon-180.png` | iOS home-screen icon (icon on white) |
| `previews/comparison.html` / `.png` | The original next to every vector variant |
| `tools/trace_moneyfactor.py` | Rebuilds every SVG from the source image; output is byte-for-byte reproducible |

## Palette (measured from the original)

| Role | Hex |
|---|---|
| Wordmark "Money" navy | `#0B1B39` |
| Wordmark "Factor" teal | `#10A390` |
| Navy ribbon (fitted gradient, nearly flat) | `#0A1935` → `#0C1E3C` → `#091731` → `#0B1C38` |
| Teal ribbon (fitted gradient, dark fold → light face) | `#0C9282` → `#10A290` → `#17CCB1` → `#19D7B9` → `#17C3A9` |
| Favicon flat colors | navy `#0B1B39` (white in dark mode), mint `#17C3A8` |
| Dark variant | background `#0A1F52`, navy ribbon white → `#DCE5EF`, "Money" `#FFFFFF`, "Factor" `#2FD3B6` |

Ribbon gradients are fitted to the original's own pixels (least-squares direction of the brightness change, median color at six stops), not invented.

## Usage notes
- **Contrast:** "Money" navy is about 17:1 on white. "Factor" teal `#10A390` is about 3.2:1 on white: fine for the logotype at display size (WCAG large-text / logo exemption), **not** for small text. Where "Factor" appears small in teal (e.g. an endorsement line), use the deeper `#0B7F70` (4.9:1); see `../archive/system/README.md`.
- **Minimum size:** horizontal lockup down to about 160px wide; below that, the icon alone. Favicon SVG at 16–48px only.
- **Clear space:** at least the height of the "M" in "Money" on all sides.

## Rebuilding
```bash
cd branding/moneyfactor
pip install -r tools/requirements.txt
PYTHONDONTWRITEBYTECODE=1 python3 tools/trace_moneyfactor.py   # rewrites svg/*.svg
```
PNG exports and the comparison are rendered from the SVGs with a headless browser (Playwright screenshots of `previews/comparison.html`).

## Known limits
- **Lettering** is traced, not set in a font. Editing the words needs the original typeface or a designer.
- **AI-generated source:** copyright protection for purely AI-generated artwork is uncertain. Before registering the mark, have a designer produce a final master from these files and run a trademark search on the name and mark.
- **Relationship to the Best Cards For Me B:** the two marks share no geometry (ribbon M vs. card-stack B). This trace keeps both as supplied; see `../archive/system/README.md` for the palette alignment proposal.
