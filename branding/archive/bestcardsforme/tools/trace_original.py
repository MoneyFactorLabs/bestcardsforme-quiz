"""Faithful vector copy of the founder's original Best Cards For Me lockup.

Each colour layer of original.png is separated, traced with potrace (smooth Bezier
curves, so the raster's soft edges and jaggies go away while the shapes stay as drawn),
and filled with the colour measured from the original. The B keeps its top-to-bottom
gradient, sampled row by row. Also writes dark and favicon variants."""
import os
import numpy as np
import potrace
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "svg")
os.makedirs(OUT, exist_ok=True)

img = np.asarray(Image.open(os.path.join(ROOT, "source", "original-chatgpt.png")).convert("RGB")).astype(float)
H, W, _ = img.shape
ink = np.linalg.norm(img - 254, axis=2) > 70  # anything clearly not background

hexrgb = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)
ICON_X, DIV_X0, DIV_X1, TEXT_X = (120, 570), 605, 618, 650

# Icon classes, measured from the original.
icon_ref = {"teal": "#00BEC1", "card": "#006CF5", "wedge": "#0053ED", "btop": "#0C436D", "bbot": "#0C2659"}
# Text classes.
text_ref = {"navy": "#0A1F52", "me": "#0057FB", "slate": "#547492"}


def classify(region, refs):
    x0, x1 = region
    sub = img[:, x0:x1]
    names = list(refs)
    cols = np.stack([hexrgb(refs[n]) for n in names])
    d = ((sub[:, :, None, :] - cols[None, None]) ** 2).sum(-1)
    lab = d.argmin(-1)
    masks = {}
    for i, n in enumerate(names):
        m = np.zeros((H, W), bool)
        m[:, x0:x1] = (lab == i) & ink[:, x0:x1]
        masks[n] = m
    return masks


icon = classify(ICON_X, icon_ref)
icon["B"] = icon.pop("btop") | icon.pop("bbot")
text = classify((TEXT_X, W), text_ref)


def trace(mask):
    # potracer traces the False pixels, so pass the inverted mask.
    bmp = potrace.Bitmap(~mask)
    path = bmp.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    parts = []
    for curve in path:
        parts.append(f"M{curve.start_point.x:.2f} {curve.start_point.y:.2f}")
        for seg in curve.segments:
            if seg.is_corner:
                parts.append(f"L{seg.c.x:.2f} {seg.c.y:.2f}L{seg.end_point.x:.2f} {seg.end_point.y:.2f}")
            else:
                parts.append(f"C{seg.c1.x:.2f} {seg.c1.y:.2f} {seg.c2.x:.2f} {seg.c2.y:.2f} {seg.end_point.x:.2f} {seg.end_point.y:.2f}")
        parts.append("Z")
    return "".join(parts)


# Gradient for the B: mean colour of B pixels per band of rows, top to bottom.
ys = np.nonzero(icon["B"].any(1))[0]
b_top, b_bot = ys.min(), ys.max()
stops = []
for t in np.linspace(0, 1, 6):
    y = int(b_top + t * (b_bot - b_top))
    band = icon["B"][max(b_top, y - 6):y + 7]
    px = img[max(b_top, y - 6):y + 7][band]
    c = px.mean(0) if len(px) else hexrgb(icon_ref["bbot"])
    stops.append((t, "#%02X%02X%02X" % tuple(np.clip(c, 0, 255).astype(int))))

paths = {n: trace(m) for n, m in {**icon, **text}.items()}
div_rows = np.nonzero(ink[:, DIV_X0:DIV_X1].any(1))[0]
divider = (DIV_X0 + 4, div_rows.min(), 6, div_rows.max() - div_rows.min())

# Crop box around all ink, with padding.
yy, xx = np.nonzero(ink)
pad = 40
box = (xx.min() - pad, yy.min() - pad, xx.max() - xx.min() + 2 * pad, yy.max() - yy.min() + 2 * pad)


def lockup(theme):
    light = theme == "light"
    fills = {
        "teal": "#00BEC1", "card": "#006CF5", "wedge": "#0053ED",
        "navy": "#0A1F52" if light else "#FFFFFF", "me": "#0057FB" if light else "#5B9BFF",
        "slate": "#547492" if light else "#AEBBD0",
    }
    grad = "".join(f'<stop offset="{t:.2f}" stop-color="{c}"/>' for t, c in stops) if light else \
        '<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3EAF3"/>'
    bg = "" if light else f'<rect x="{box[0]}" y="{box[1]}" width="{box[2]}" height="{box[3]}" fill="#0A1F52"/>'
    div_fill = "#ACBBCC" if light else "#3A5378"
    body = "".join(f'<path fill-rule="evenodd" fill="{fills[n]}" d="{paths[n]}"/>' for n in ("teal", "card", "wedge"))
    body += f'<path fill-rule="evenodd" fill="url(#bgrad-{theme})" d="{paths["B"]}"/>'
    body += f'<rect x="{divider[0]}" y="{divider[1]}" width="{divider[2]}" height="{divider[3]}" rx="3" fill="{div_fill}"/>'
    body += "".join(f'<path fill-rule="evenodd" fill="{fills[n]}" d="{paths[n]}"/>' for n in ("navy", "me", "slate"))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box[0]} {box[1]} {box[2]} {box[3]}" width="{box[2]}" height="{box[3]}" '
            f'role="img" aria-label="Best Cards For Me, Powered by MoneyFactor"><defs><linearGradient id="bgrad-{theme}" '
            f'x1="0" y1="{b_top}" x2="0" y2="{b_bot}" gradientUnits="userSpaceOnUse">{grad}</linearGradient></defs>{bg}{body}</svg>')


# Icon-only: same traced shapes, cropped to the icon.
iy, ix = np.nonzero(ink[:, ICON_X[0]:ICON_X[1]])
ix = ix + ICON_X[0]
ipad = 16
ibox = (ix.min() - ipad, iy.min() - ipad, ix.max() - ix.min() + 2 * ipad, iy.max() - iy.min() + 2 * ipad)
side = max(ibox[2], ibox[3])
sq = (ibox[0] - (side - ibox[2]) / 2, ibox[1] - (side - ibox[3]) / 2, side, side)


def icon_svg(favicon=False):
    grad = "".join(f'<stop offset="{t:.2f}" stop-color="{c}"/>' for t, c in stops)
    if favicon:
        # Favicon: the B plus one merged blue card shape (card + lower wedge, swoosh gap closed);
        # the small teal card is dropped because it disappears below 32px.
        merged = icon["card"] | icon["wedge"]
        from PIL import ImageFilter
        m = Image.fromarray((merged * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(15))
        blue = trace(np.asarray(m) > 127)
        # The B turns white on dark browser themes so the tab icon stays visible.
        body = ('<style>.b{fill:#0C2659}@media (prefers-color-scheme: dark){.b{fill:#FFFFFF}}</style>'
                f'<path class="b" fill-rule="evenodd" d="{paths["B"]}"/><path fill-rule="evenodd" fill="#006CF5" d="{blue}"/>')
    else:
        body = "".join(f'<path fill-rule="evenodd" fill="{c}" d="{paths[n]}"/>' for n, c in (("teal", "#00BEC1"), ("card", "#006CF5"), ("wedge", "#0053ED")))
        body += f'<path fill-rule="evenodd" fill="url(#bg)" d="{paths["B"]}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{sq[0]:.1f} {sq[1]:.1f} {sq[2]} {sq[3]}" width="512" height="512">'
            f'<defs><linearGradient id="bg" x1="0" y1="{b_top}" x2="0" y2="{b_bot}" gradientUnits="userSpaceOnUse">{grad}</linearGradient></defs>{body}</svg>')



def stacked(theme):
    """Responsive variant for narrow spaces: the icon centred above the unchanged two-line wordmark
    ("Powered by MoneyFactor" keeps its original size and weight relative to the brand name)."""
    light = theme == "light"
    fills = {
        "teal": "#00BEC1", "card": "#006CF5", "wedge": "#0053ED",
        "navy": "#0A1F52" if light else "#FFFFFF", "me": "#0057FB" if light else "#5B9BFF",
        "slate": "#547492" if light else "#AEBBD0",
    }
    grad = "".join(f'<stop offset="{t:.2f}" stop-color="{c}"/>' for t, c in stops) if light else \
        '<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3EAF3"/>'
    ty, tx = np.nonzero(ink[:, TEXT_X:])
    tx = tx + TEXT_X
    tbox = (tx.min(), ty.min(), tx.max() - tx.min(), ty.max() - ty.min())
    ix0, iy0, iw, ih = ix.min(), iy.min(), ix.max() - ix.min(), iy.max() - iy.min()
    gap = 0.22 * ih
    width = max(tbox[2], iw)
    icon_dx = (width - iw) / 2 - ix0
    icon_dy = -iy0
    text_dx = (width - tbox[2]) / 2 - tbox[0]
    text_dy = ih + gap - tbox[1]
    height = ih + gap + tbox[3]
    pad = 40
    bg = "" if light else f'<rect x="{-pad}" y="{-pad}" width="{width + 2 * pad}" height="{height + 2 * pad}" fill="#0A1F52"/>'
    icon_body = "".join(f'<path fill-rule="evenodd" fill="{fills[n]}" d="{paths[n]}"/>' for n in ("teal", "card", "wedge"))
    icon_body += f'<path fill-rule="evenodd" fill="url(#sgrad-{theme})" d="{paths["B"]}"/>'
    text_body = "".join(f'<path fill-rule="evenodd" fill="{fills[n]}" d="{paths[n]}"/>' for n in ("navy", "me", "slate"))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {width + 2 * pad:.0f} {height + 2 * pad:.0f}" '
            f'width="{width + 2 * pad:.0f}" height="{height + 2 * pad:.0f}" role="img" aria-label="Best Cards For Me, Powered by MoneyFactor">'
            f'<defs><linearGradient id="sgrad-{theme}" x1="0" y1="{b_top}" x2="0" y2="{b_bot}" gradientUnits="userSpaceOnUse">{grad}</linearGradient></defs>'
            f'{bg}<g transform="translate({icon_dx:.1f} {icon_dy:.1f})">{icon_body}</g><g transform="translate({text_dx:.1f} {text_dy:.1f})">{text_body}</g></svg>')


files = {
    "bcfm-original-horizontal-light.svg": lockup("light"),
    "bcfm-original-horizontal-dark.svg": lockup("dark"),
    "bcfm-original-icon.svg": icon_svg(),
    "bcfm-original-favicon.svg": icon_svg(favicon=True),
    "bcfm-original-stacked-light.svg": stacked("light"),
    "bcfm-original-stacked-dark.svg": stacked("dark"),
}
for name, svg in files.items():
    open(os.path.join(OUT, name), "w").write(svg)
print("gradient stops:", stops)
print("wrote", list(files))
