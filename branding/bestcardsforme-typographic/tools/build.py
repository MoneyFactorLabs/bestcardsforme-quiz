"""Best Cards For Me: typography-first lockups endorsed by the MoneyFactor logo (founder direction, PR #24, 2026-11-10).

The product name is set in Red Hat Display ExtraBold (SIL OFL). It is the closest open-source match to the
MoneyFactor wordmark's lettering. The endorsement reads exactly "Powered by MoneyFactor": "Powered by" is set
in type, and "MoneyFactor" is the approved MoneyFactor logo itself (the faithful trace in
branding/moneyfactor), reused unchanged.

Writes svg/ (lockups in light and dark, plus a favicon) for three variants:
  stacked  the primary lockup: name over the endorsement
  inline   one row for wide desktop headers: name | Powered by + MoneyFactor logo
  compact  mobile and small sizes: name over "Powered by" + the MoneyFactor wordmark (no M, so it stays legible)
"""
import importlib.util
import io
import os
import sys
import urllib.request

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BRANDING = os.path.dirname(ROOT)
OUT = os.path.join(ROOT, "svg")
os.makedirs(OUT, exist_ok=True)

FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/redhatdisplay/RedHatDisplay%5Bwght%5D.ttf"
FONT_CACHE = os.path.join(HERE, ".cache", "RedHatDisplay[wght].ttf")
if not os.path.exists(FONT_CACHE):
    os.makedirs(os.path.dirname(FONT_CACHE), exist_ok=True)
    urllib.request.urlretrieve(FONT_URL, FONT_CACHE)
FONT_DATA = open(FONT_CACHE, "rb").read()

# The approved MoneyFactor logo (faithful trace). Importing the script rewrites the same SVGs byte-for-byte.
_argv, sys.argv = sys.argv, sys.argv[:1]
spec = importlib.util.spec_from_file_location("mf", os.path.join(BRANDING, "moneyfactor", "tools", "trace_moneyfactor.py"))
mf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mf)
sys.argv = _argv
# Measured on the MoneyFactor source: wordmark cap top / baseline, icon and wordmark x-extents.
MF_CAP_TOP, MF_BASE = 269, 437
MF_CAP = MF_BASE - MF_CAP_TOP
MF_ICON_X0, MF_WORD_X0, MF_X1 = 95, 626, 2084
MF_ICON_Y0, MF_ICON_Y1 = 231, 486
MF_DESC = 497

THEMES = {
    "light": {"name": "#0B1B39", "me": "#0057FB", "slate": "#547492", "rule": "#C9D3DF", "bg": None},
    "dark": {"name": "#FFFFFF", "me": "#5B9BFF", "slate": "#AEBBD0", "rule": "#3A5378", "bg": "#0A1F52"},
}

_fonts = {}


def _font(weight):
    if weight not in _fonts:
        tt = instantiateVariableFont(TTFont(io.BytesIO(FONT_DATA)), {"wght": weight})
        hf = hb.Font(hb.Face(FONT_DATA))
        hf.set_variations({"wght": weight})
        _fonts[weight] = (tt, tt.getGlyphSet(), hf)
    return _fonts[weight]


def text(s, x0, baseline, cap, weight, tracking=0.0):
    """Outline `s` with kerning so that its cap height is `cap`. Returns (svg path data, end x)."""
    tt, glyphs, hf = _font(weight)
    upem = tt["head"].unitsPerEm
    scale = cap / tt["OS/2"].sCapHeight
    buf = hb.Buffer()
    buf.add_str(s)
    buf.guess_segment_properties()
    hb.shape(hf, buf, {"kern": True, "liga": False})
    order = tt.getGlyphOrder()
    x, parts = 0, []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        pen = SVGPathPen(glyphs)
        glyphs[order[info.codepoint]].draw(TransformPen(pen, (scale, 0, 0, -scale, x0 + (x + pos.x_offset) * scale, baseline)))
        parts.append(pen.getCommands())
        x += pos.x_advance + tracking * upem
    return "".join(parts), x0 + x * scale


def mf_logo(x, baseline, cap, theme, uid, with_icon=True):
    """The approved MoneyFactor logo, scaled so its wordmark cap height is `cap` and its baseline sits on `baseline`.
    Returns (defs, group, right edge x, top y, bottom y)."""
    s = cap / MF_CAP
    left = MF_ICON_X0 if with_icon else MF_WORD_X0
    tx, ty = x - left * s, baseline - MF_BASE * s
    defs = mf.DEFS[theme]
    body = (mf.icon_body(theme) if with_icon else "") + mf.word_body(theme)
    for gid in ("gn", "gt", "gw"):
        defs = defs.replace(f'id="{gid}"', f'id="{gid}{uid}"')
        body = body.replace(f"url(#{gid})", f"url(#{gid}{uid})")
    top = (MF_ICON_Y0 if with_icon else MF_CAP_TOP) * s + ty
    bottom = max(MF_ICON_Y1 if with_icon else 0, MF_DESC) * s + ty
    return defs, f'<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.5f})">{body}</g>', MF_X1 * s + tx, top, bottom


def name(x, baseline, cap, t):
    best, end = text("Best Cards For ", x, baseline, cap, 800, -0.01)
    me, end = text("Me", end, baseline, cap, 800, -0.01)
    return f'<path fill="{t["name"]}" d="{best}"/><path fill="{t["me"]}" d="{me}"/>', end


def wrap(defs, body, x0, y0, x1, y1, t, label, pad):
    vb = (x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad)
    bg = f'<rect x="{vb[0]:.1f}" y="{vb[1]:.1f}" width="{vb[2]:.1f}" height="{vb[3]:.1f}" fill="{t["bg"]}"/>' if t["bg"] else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.1f} {vb[1]:.1f} {vb[2]:.1f} {vb[3]:.1f}" '
            f'width="{vb[2] * 2:.0f}" height="{vb[3] * 2:.0f}" role="img" aria-label="{label}"><defs>{defs}</defs>{bg}{body}</svg>')


LABEL = "Best Cards For Me, Powered by MoneyFactor"
CAP = 100  # product-name cap height; everything else is proportional to it


def stacked(theme):
    t = THEMES[theme]
    n, w1 = name(0, CAP, CAP, t)
    mf_cap = 0.50 * CAP           # MoneyFactor wordmark at half the name's cap height: clearly readable, not a footnote
    base2 = CAP + 0.34 * CAP + mf_cap + (MF_CAP_TOP - MF_ICON_Y0) * mf_cap / MF_CAP
    pw, pend = text("Powered by", 0, base2, 0.36 * CAP, 600, 0.01)
    defs, logo, x1, top, bottom = mf_logo(pend + 0.16 * CAP, base2, mf_cap, theme, "s" + theme)
    body = n + f'<path fill="{t["slate"]}" d="{pw}"/>' + logo
    return wrap(defs, body, 0, 0, max(w1, x1), bottom, t, LABEL, 0.3 * CAP)


def inline(theme):
    t = THEMES[theme]
    n, w1 = name(0, CAP, CAP, t)
    gap = 0.42 * CAP
    rule_x = w1 + gap
    mf_cap = 0.46 * CAP
    x2 = rule_x + 4 + gap
    defs, logo, x1, top, bottom = mf_logo(x2, CAP, mf_cap, theme, "i" + theme)
    pw, _ = text("Powered by", x2, top - 0.12 * CAP, 0.34 * CAP, 600, 0.02)
    y0 = top - 0.12 * CAP - 0.34 * CAP
    rule = f'<rect x="{rule_x:.1f}" y="{y0:.1f}" width="4" height="{bottom - y0:.1f}" rx="2" fill="{t["rule"]}"/>'
    body = n + rule + f'<path fill="{t["slate"]}" d="{pw}"/>' + logo
    return wrap(defs, body, 0, min(0, y0), x1, max(bottom, CAP * 1.22), t, LABEL, 0.3 * CAP)


def compact(theme):
    t = THEMES[theme]
    n, w1 = name(0, CAP, CAP, t)
    mf_cap = 0.62 * CAP           # larger than in "stacked": no M icon, so the wordmark carries the parent brand
    base2 = CAP + 0.36 * CAP + mf_cap
    pw, pend = text("Powered by", 0, base2, 0.48 * CAP, 600, 0.01)
    defs, logo, x1, top, bottom = mf_logo(pend + 0.16 * CAP, base2, mf_cap, theme, "c" + theme, with_icon=False)
    body = n + f'<path fill="{t["slate"]}" d="{pw}"/>' + logo
    return wrap(defs, body, 0, 0, max(w1, x1), bottom, t, LABEL, 0.3 * CAP)


def favicon():
    """A plain type tile: white B on the shared navy, nothing elaborate. Stays crisp at 16-32px."""
    b, end = text("B", 0, 0, 100, 800)
    _, glyphs, _ = _font(800)
    side = 180
    # centre the B optically in the tile
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" width="512" height="512">'
            f'<rect width="{side}" height="{side}" rx="40" fill="#0B1B39"/>'
            f'<g transform="translate({(side - end) / 2:.1f} {side / 2 + 50:.1f})"><path fill="#FFFFFF" d="{b}"/></g>'
            f'<rect x="{(side - end) / 2:.1f}" y="{side / 2 + 62:.1f}" width="{end:.1f}" height="12" rx="6" fill="#17C3A8"/></svg>')


files = {f"bcfm-type-{v}-{t}.svg": fn(t) for v, fn in (("stacked", stacked), ("inline", inline), ("compact", compact))
         for t in ("light", "dark")}
files["bcfm-type-favicon.svg"] = favicon()
for fname, svg in files.items():
    with open(os.path.join(OUT, fname), "w") as fh:
        fh.write(svg)
print("wrote", sorted(files))

# Production copies for the site header and favicon: coordinates rounded to 0.1 unit (well below a pixel at
# any header size), the 2x width/height dropped so CSS sizes the image.
import re

REPO = os.path.dirname(BRANDING)


def minify(svg):
    svg = re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), svg)
    return re.sub(r' width="\d+" height="\d+" role=', " role=", svg, count=1)


site = {
    os.path.join(REPO, "public", "brand", "bcfm-logo-stacked.svg"): minify(files["bcfm-type-stacked-light.svg"]),
    os.path.join(REPO, "public", "brand", "bcfm-logo-compact.svg"): minify(files["bcfm-type-compact-light.svg"]),
    os.path.join(REPO, "app", "icon.svg"): minify(files["bcfm-type-favicon.svg"]),
}
for path, svg in site.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as fh:
        fh.write(svg)
print("site copies:", {os.path.relpath(p, REPO): len(s) for p, s in site.items()})
