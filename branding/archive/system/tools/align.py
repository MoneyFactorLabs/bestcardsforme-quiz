"""Alignment PROPOSAL for the Best Cards For Me + MoneyFactor system (for founder review).

Builds aligned variants on top of the faithful traces, without touching them:
  1. One shared navy, the parent's: #0B1B39.
  2. One teal family, the parent's: the B's cyan teal card takes MoneyFactor's mint.
  3. In "Powered by MoneyFactor", "Factor" is set in teal to echo the parent wordmark. A deeper
     shade of the parent teal (#0B7F70, 4.9:1 on white) keeps the small line legible; the
     parent's display teal #10A390 is only 3.2:1.
Shapes, sizes, weights and wording are unchanged: "Powered by MoneyFactor" stays at its
original size and weight.

The "Factor" glyphs are traced from the same mask and with the same potrace settings as the
faithful BCFM trace, so the overlay matches the original outline exactly."""
import importlib.util
import os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
BRANDING = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(BRANDING, "system", "proposals")
os.makedirs(OUT, exist_ok=True)

spec = importlib.util.spec_from_file_location("bcfm", os.path.join(BRANDING, "bestcardsforme", "tools", "trace_original.py"))
bcfm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bcfm)  # deterministic: rewrites the same faithful SVGs byte-for-byte

SHARED_NAVY = "#0B1B39"
PARENT_MINT = "#17C3A8"     # MoneyFactor ribbon mid-tone
ENDORSE_TEAL = "#0B7F70"    # parent teal family, AA on white for the small line
ENDORSE_TEAL_DARK = "#2FD3B6"

# "Factor" in the endorsement line: x from the start of "F", line-2 rows (measured on the source).
FACTOR_BOX = (1525, 405, 1840, 495)
mask = np.zeros_like(bcfm.text["navy"])
x0, y0, x1, y1 = FACTOR_BOX
mask[y0:y1, x0:x1] = bcfm.text["navy"][y0:y1, x0:x1]
factor_path = bcfm.trace(mask)


def aligned(theme):
    svg = bcfm.lockup(theme)
    svg = svg.replace('fill="#00BEC1"', f'fill="{PARENT_MINT}"')
    if theme == "light":
        svg = svg.replace('fill="#0A1F52"', f'fill="{SHARED_NAVY}"')
        teal = ENDORSE_TEAL
    else:
        # In the dark lockup navy is only the background, which stays the same as the
        # MoneyFactor dark lockup's background so the pair sits on one colour.
        teal = ENDORSE_TEAL_DARK
    overlay = f'<path fill-rule="evenodd" fill="{teal}" d="{factor_path}"/>'
    return svg.replace("</svg>", overlay + "</svg>")


for theme in ("light", "dark"):
    with open(os.path.join(OUT, f"bcfm-aligned-horizontal-{theme}.svg"), "w") as fh:
        fh.write(aligned(theme))
print("wrote aligned proposals to", OUT)
