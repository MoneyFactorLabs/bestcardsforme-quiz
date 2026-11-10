"""Faithful vector copy of the founder's original MoneyFactor lockup (folded-ribbon M + two-tone wordmark).

Same method as the Best Cards For Me trace: colour layers are separated, traced with potrace to
smooth Bezier curves and filled with colours measured from the original. Each ribbon keeps its
shading as a linear gradient fitted to its own pixels (direction and stops measured, not invented).
Writes light, dark, stacked, icon and favicon variants."""
import os
import sys
import numpy as np
import potrace
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "source", "original-chatgpt.png")
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "svg")
os.makedirs(OUT, exist_ok=True)

img = np.asarray(Image.open(SRC).convert("RGB")).astype(float)
H, W, _ = img.shape
r, g, b = img[..., 0], img[..., 1], img[..., 2]
ink = np.abs(img - 254).sum(2) > 60
teal = ink & (g - r > 50)          # mint/teal pixels
navy = ink & ~teal                 # everything else that is ink is navy
ICON_X1, TEXT_X0 = 612, 618        # gap measured between icon and wordmark

def region(mask, x0, x1):
    m = np.zeros_like(mask)
    m[:, x0:x1] = mask[:, x0:x1]
    return m

layers = {
    "ribbon_navy": region(navy, 0, ICON_X1),
    "ribbon_teal": region(teal, 0, ICON_X1),
    "word_navy": region(navy, TEXT_X0, W),
    "word_teal": region(teal, TEXT_X0, W),
}


def trace(mask):
    path = potrace.Bitmap(~mask).trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                                       alphamax=1.0, opticurve=True, opttolerance=0.2)
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


def fitted_gradient(mask, gid, n=6):
    """Linear gradient along the direction in which the ribbon's brightness changes most."""
    ys, xs = np.nonzero(mask)
    cols = img[ys, xs]
    lum = cols @ np.array([0.2126, 0.7152, 0.0722])
    A = np.column_stack([xs, ys, np.ones_like(xs)])
    gx, gy, _ = np.linalg.lstsq(A, lum, rcond=None)[0]
    d = np.array([gx, gy]) / (np.hypot(gx, gy) or 1)
    proj = xs * d[0] + ys * d[1]
    p0, p1 = np.percentile(proj, 1), np.percentile(proj, 99)
    stops = []
    for t in np.linspace(0, 1, n):
        target = p0 + t * (p1 - p0)
        sel = np.abs(proj - target) < (p1 - p0) / (2 * n)
        c = np.median(cols[sel], axis=0) if sel.any() else cols.mean(0)
        stops.append((t, "#%02X%02X%02X" % tuple(np.clip(c, 0, 255).astype(int))))
    cx, cy = xs.mean(), ys.mean()
    # gradient endpoints in user space
    base = np.array([cx, cy]) - d * ((cx * d[0] + cy * d[1]) - p0)
    end = base + d * (p1 - p0)
    st = "".join(f'<stop offset="{t:.2f}" stop-color="{c}"/>' for t, c in stops)
    return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{base[0]:.1f}" y1="{base[1]:.1f}" '
            f'x2="{end[0]:.1f}" y2="{end[1]:.1f}">{st}</linearGradient>'), stops


paths = {k: trace(m) for k, m in layers.items()}
grad_navy, stops_navy = fitted_gradient(layers["ribbon_navy"], "gn")
grad_teal, stops_teal = fitted_gradient(layers["ribbon_teal"], "gt")
WORD_NAVY = "#0B1B39"
WORD_TEAL = "#10A390"

yy, xx = np.nonzero(ink)
pad = 40
box = (xx.min() - pad, yy.min() - pad, xx.max() - xx.min() + 2 * pad, yy.max() - yy.min() + 2 * pad)
iy, ix = np.nonzero(ink[:, :ICON_X1])
ty, tx = np.nonzero(ink[:, TEXT_X0:]); tx = tx + TEXT_X0


def p(name, fill):
    return f'<path fill-rule="evenodd" fill="{fill}" d="{paths[name]}"/>'


def icon_body(theme):
    if theme == "light":
        return p("ribbon_navy", "url(#gn)") + p("ribbon_teal", "url(#gt)")
    # dark: navy ribbon would vanish on navy, so it turns white; teal ribbon keeps its gradient
    return p("ribbon_navy", "url(#gw)") + p("ribbon_teal", "url(#gt)")


DEFS = {"light": grad_navy + grad_teal,
        "dark": '<linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/>'
                '<stop offset="1" stop-color="#DCE5EF"/></linearGradient>' + grad_teal}


def word_body(theme):
    return p("word_navy", WORD_NAVY if theme == "light" else "#FFFFFF") + p("word_teal", WORD_TEAL if theme == "light" else "#2FD3B6")


def svg(view, w, h, defs, body, bg=None):
    bgr = f'<rect x="{view[0]}" y="{view[1]}" width="{view[2]}" height="{view[3]}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view[0]:.0f} {view[1]:.0f} {view[2]:.0f} {view[3]:.0f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="MoneyFactor"><defs>{defs}</defs>{bgr}{body}</svg>')


def horizontal(theme):
    return svg(box, box[2], box[3], DEFS[theme], icon_body(theme) + word_body(theme), None if theme == "light" else "#0A1F52")


def stacked(theme):
    iw, ih = ix.max() - ix.min(), iy.max() - iy.min()
    tw, th = tx.max() - tx.min(), ty.max() - ty.min()
    gap = 0.25 * ih
    width = max(iw, tw)
    height = ih + gap + th
    pad_ = 40
    view = (-pad_, -pad_, width + 2 * pad_, height + 2 * pad_)
    body = (f'<g transform="translate({(width - iw) / 2 - ix.min():.1f} {-iy.min():.1f})">{icon_body(theme)}</g>'
            f'<g transform="translate({(width - tw) / 2 - tx.min():.1f} {ih + gap - ty.min():.1f})">{word_body(theme)}</g>')
    return svg(view, view[2], view[3], DEFS[theme], body, None if theme == "light" else "#0A1F52")


def icon(favicon=False):
    side = max(ix.max() - ix.min(), iy.max() - iy.min()) + 32
    view = ((ix.min() + ix.max()) / 2 - side / 2, (iy.min() + iy.max()) / 2 - side / 2, side, side)
    if favicon:
        # Flat colours read better at 16-32px; navy ribbon turns white in dark browser themes.
        body = ('<style>.n{fill:#0B1B39}@media (prefers-color-scheme: dark){.n{fill:#FFFFFF}}</style>'
                f'<path class="n" fill-rule="evenodd" d="{paths["ribbon_navy"]}"/>' + p("ribbon_teal", "#17C3A8"))
        return svg(view, 512, 512, "", body)
    return svg(view, 512, 512, DEFS["light"], icon_body("light"))


files = {
    "moneyfactor-original-horizontal-light.svg": horizontal("light"),
    "moneyfactor-original-horizontal-dark.svg": horizontal("dark"),
    "moneyfactor-original-stacked-light.svg": stacked("light"),
    "moneyfactor-original-stacked-dark.svg": stacked("dark"),
    "moneyfactor-original-icon.svg": icon(),
    "moneyfactor-original-favicon.svg": icon(favicon=True),
}
for name, s in files.items():
    open(os.path.join(OUT, name), "w").write(s)
print("navy ribbon stops:", stops_navy)
print("teal ribbon stops:", stops_teal)
print("wrote", list(files))
