"""Proposal: the Best Cards For Me B redrawn in the MoneyFactor folded-ribbon style (founder request, 2026-11-10).
Writes variant lockups + icons + a comparison page into this folder."""
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BRANDING = os.path.dirname(os.path.dirname(HERE))
spec = importlib.util.spec_from_file_location("bcfm", os.path.join(BRANDING, "bestcardsforme", "tools", "trace_original.py"))
bcfm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bcfm)

# MoneyFactor colours (measured from the supplied M)
NAVY = "#0B1B39"
MINT_STOPS = [(0, "#0C9282"), (0.35, "#10A290"), (0.75, "#19D7B9"), (1, "#17C3A9")]

# Geometry in a 254-unit-high box
T, CU, CL = 46, 48, 68             # stroke, upper counter height, lower counter height
H = 3 * T + CU + CL
S, RC = 80, 34                     # stem width, rounded "apex" corner like the M's tops
WT = T + CU                        # top of the waist = top of the mint ribbon
XU, XL = 112, 140                  # where the bowls' straight runs end
RU, RL = (WT + T) / 2, (H - WT) / 2


def upper_bowl():
    ci = CU / 2
    outer = f"M0 {H}V{RC}A{RC} {RC} 0 0 1 {RC} 0H{XU}A{RU} {RU} 0 0 1 {XU} {WT + T}H{S}V{H}Z"
    inner = f"M{S} {T}H{XU}A{ci} {ci} 0 0 1 {XU} {WT}H{S}Z"
    return outer + inner


def lower_bowl():
    ci = CL / 2
    outer = f"M{S - 2} {WT}H{XL}A{RL} {RL} 0 0 1 {XL} {H}H{S - 2}Z"
    inner = f"M{S - 2} {WT + T}H{XL}A{ci} {ci} 0 0 1 {XL} {H - T}H{S - 2}Z"
    return outer + inner


def upper_mint():
    # V3: the upper bowl is mint too, starting at the stem
    R = U / 2
    ci = (U - 2 * T + OV) / 2
    cy = T + ci
    return (f"M{S - 2} 0H{XU}A{R} {R} 0 0 1 {XU} {U}H{S - 2}Z"
            f"M{S - 2} {T}H{XU}A{ci} {ci} 0 0 1 {XU} {cy + ci}H{S - 2}Z")


def stem_only():
    return f"M0 {H}V{RC}A{RC} {RC} 0 0 1 {RC} 0H{S}V{H}Z"


W_B = XL + RL


def grad(gid, x1, y1, x2, y2, stops):
    st = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{st}</linearGradient>'


def b_mark(variant, theme, uid):
    dark = theme == "dark"
    defs = grad(f"m{uid}", S, H, W_B, WT, MINT_STOPS)
    # soft shadow where the mint ribbon folds over the navy one (as on the M)
    defs += grad(f"s{uid}", S, 0, S + 60, 0, [(0, "#000000"), (1, "#000000")]).replace(
        '<stop offset="1" stop-color="#000000"/>', '<stop offset="1" stop-color="#000000" stop-opacity="0"/>').replace(
        '<stop offset="0" stop-color="#000000"/>', '<stop offset="0" stop-color="#000000" stop-opacity="0.35"/>')
    defs += grad(f"u{uid}", S, 0, W_B, WT + T, [(0, "#10A290"), (1, "#19D7B9")])
    navy = "#FFFFFF" if dark else NAVY
    if variant == "v3":
        body = (f'<path fill="{navy}" d="{stem_only()}"/>'
                f'<path fill-rule="evenodd" fill="url(#u{uid})" d="{upper_mint()}"/>')
    else:
        body = f'<path fill-rule="evenodd" fill="{navy}" d="{upper_bowl()}"/>'
    lb = lower_bowl()
    body += f'<path fill-rule="evenodd" fill="url(#m{uid})" d="{lb}"/>'
    body += f'<path fill-rule="evenodd" fill="url(#s{uid})" d="{lb}"/>'
    skew = ' transform="skewX(-12)"' if variant == "v2" else ""
    return defs, f"<g{skew}>{body}</g>"


def lockup(variant, theme):
    light = theme == "light"
    fills = {"navy": NAVY if light else "#FFFFFF", "me": "#0057FB" if light else "#5B9BFF",
             "slate": "#547492" if light else "#AEBBD0"}
    target_h, right = 305, 562
    s = target_h / H
    skew_extra = H * 0.2126 if variant == "v2" else 0   # tan(12deg) * H
    x0 = right - (W_B) * s
    y0 = 214
    defs, mark = b_mark(variant, theme, f"{variant}{theme}")
    left = x0 - 40 - (0 if variant != "v2" else 0)
    box = (left, bcfm.box[1], bcfm.box[0] + bcfm.box[2] - left, bcfm.box[3])
    bg = "" if light else f'<rect x="{box[0]}" y="{box[1]}" width="{box[2]}" height="{box[3]}" fill="#0A1F52"/>'
    shift = skew_extra * s if variant == "v2" else 0
    body = f'<g transform="translate({x0 + shift:.1f} {y0}) scale({s:.4f})">{mark}</g>'
    div = bcfm.divider
    body += f'<rect x="{div[0]}" y="{div[1]}" width="{div[2]}" height="{div[3]}" rx="3" fill="{"#ACBBCC" if light else "#3A5378"}"/>'
    body += "".join(f'<path fill-rule="evenodd" fill="{fills[n]}" d="{bcfm.paths[n]}"/>' for n in ("navy", "me", "slate"))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box[0]:.0f} {box[1]} {box[2]:.0f} {box[3]}" '
            f'width="{box[2]:.0f}" height="{box[3]}" role="img" aria-label="Best Cards For Me, Powered by MoneyFactor">'
            f'<defs>{defs}</defs>{bg}{body}</svg>')


def icon(variant):
    pad = 24
    extra = H * 0.2126 if variant == "v2" else 0
    w = W_B + extra
    side = max(w, H) + 2 * pad
    defs, mark = b_mark(variant, "light", f"i{variant}")
    tx = (side - w) / 2 + extra
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side:.0f} {side:.0f}" width="512" height="512">'
            f'<defs>{defs}</defs><g transform="translate({tx:.1f} {(side - H) / 2:.1f})">{mark}</g></svg>')


out = os.path.join(os.path.dirname(HERE), "proposals", "ribbon-b")
os.makedirs(out, exist_ok=True)
for v in ("v1", "v2"):
    for t in ("light", "dark"):
        open(os.path.join(out, f"bcfm-ribbon-{v}-{t}.svg"), "w").write(lockup(v, t))
    open(os.path.join(out, f"bcfm-ribbon-{v}-icon.svg"), "w").write(icon(v))
print("ok", W_B)
