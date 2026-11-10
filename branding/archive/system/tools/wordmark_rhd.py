"""Proposal: reset "Best Cards For Me" in the lettering style of the MoneyFactor wordmark.

The MoneyFactor wordmark's closest open-source match (compared by eye and by pixel overlap
against the supplied artwork) is Red Hat Display ExtraBold (800, SIL Open Font License).
This is the closest match, not a claim that the MoneyFactor artwork uses that font.

Only line 1 ("Best Cards For Me") changes. It is set as outlines at the original cap height,
baseline and left edge. "Powered by MoneyFactor" (line 2), the icon and the divider are the
faithful traces, unchanged in wording, size and weight.

Needs: fontTools, uharfbuzz, and the font file (downloaded from google/fonts on first run)."""
import importlib.util
import io
import os
import sys
import urllib.request

import numpy as np
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
BRANDING = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(BRANDING, "system", "proposals", "wordmark")
os.makedirs(OUT, exist_ok=True)
FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/redhatdisplay/RedHatDisplay%5Bwght%5D.ttf"
FONT_CACHE = os.path.join(HERE, ".cache", "RedHatDisplay[wght].ttf")
WEIGHT = 800
TRACKING = -0.01           # em; matches the MoneyFactor wordmark's slightly tight spacing

spec = importlib.util.spec_from_file_location("bcfm", os.path.join(BRANDING, "bestcardsforme", "tools", "trace_original.py"))
bcfm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bcfm)

# Measured on the original: line 1 cap height (the "B"), baseline and left edge; line 2 starts below row SPLIT.
SPLIT = 392
LEFT, BASELINE, CAP = 681, 372, 116

if not os.path.exists(FONT_CACHE):
    os.makedirs(os.path.dirname(FONT_CACHE), exist_ok=True)
    urllib.request.urlretrieve(FONT_URL, FONT_CACHE)
data = open(FONT_CACHE, "rb").read()
font = instantiateVariableFont(TTFont(io.BytesIO(data)), {"wght": WEIGHT})
glyphs = font.getGlyphSet()
upem = font["head"].unitsPerEm
cap_units = font["OS/2"].sCapHeight
scale = CAP / cap_units

hb_face = hb.Face(data)
hb_font = hb.Font(hb_face)
hb_font.set_variations({"wght": WEIGHT})


def outline(text, x0):
    """Shape text with kerning and return (svg path, advance end x)."""
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": False})
    order = font.getGlyphOrder()
    x = 0
    parts = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(glyphs)
        gx = x0 + (x + pos.x_offset) * scale
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, gx, BASELINE)))
        parts.append(pen.getCommands())
        x += pos.x_advance + TRACKING * upem
    return "".join(parts), x0 + x * scale


best, end1 = outline("Best Cards For ", LEFT)
me, end2 = outline("Me", end1)

# Line 2 and the icon stay as traced. Re-trace line 2 alone (same masks, same settings).
line2 = {}
for n in ("navy", "slate"):
    m = bcfm.text[n].copy()
    m[:SPLIT] = False
    line2[n] = bcfm.trace(m)


def lockup(theme):
    light = theme == "light"
    navy = "#0A1F52" if light else "#FFFFFF"
    me_c = "#0057FB" if light else "#5B9BFF"
    slate = "#547492" if light else "#AEBBD0"
    right = max(end2, bcfm.box[0] + bcfm.box[2] - 40) + 40
    box = (bcfm.box[0], bcfm.box[1], right - bcfm.box[0], bcfm.box[3])
    svg = bcfm.lockup(theme)
    head, _, _ = svg.partition("</defs>")
    head = head.replace(f'viewBox="{bcfm.box[0]} {bcfm.box[1]} {bcfm.box[2]} {bcfm.box[3]}" width="{bcfm.box[2]}"',
                        f'viewBox="{box[0]} {box[1]} {box[2]:.0f} {box[3]}" width="{box[2]:.0f}"')
    bg = "" if light else f'<rect x="{box[0]}" y="{box[1]}" width="{box[2]:.0f}" height="{box[3]}" fill="#0A1F52"/>'
    icon = "".join(f'<path fill-rule="evenodd" fill="{c}" d="{bcfm.paths[n]}"/>'
                   for n, c in (("teal", "#00BEC1"), ("card", "#006CF5"), ("wedge", "#0053ED")))
    icon += f'<path fill-rule="evenodd" fill="url(#bgrad-{theme})" d="{bcfm.paths["B"]}"/>'
    d = bcfm.divider
    div = f'<rect x="{d[0]}" y="{d[1]}" width="{d[2]}" height="{d[3]}" rx="3" fill="{"#ACBBCC" if light else "#3A5378"}"/>'
    words = (f'<path fill="{navy}" d="{best}"/><path fill="{me_c}" d="{me}"/>'
             f'<path fill-rule="evenodd" fill="{navy}" d="{line2["navy"]}"/>'
             f'<path fill-rule="evenodd" fill="{slate}" d="{line2["slate"]}"/>')
    return head + "</defs>" + bg + icon + div + words + "</svg>"


for theme in ("light", "dark"):
    with open(os.path.join(OUT, f"bcfm-wordmark-rhd-horizontal-{theme}.svg"), "w") as fh:
        fh.write(lockup(theme))
print(f"line 1 ends at x={end2:.0f} (original ended at 2049); wrote proposals to {OUT}")
