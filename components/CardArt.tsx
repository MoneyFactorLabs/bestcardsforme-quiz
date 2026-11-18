import { cardArtStyle, type CardMaterial, type CardPattern } from "@/lib/cardArt";
import type { CardType } from "@/types/card";

// Original BestCardsForMe card illustration: drawn in code, no image files, no third-party
// requests, no issuer artwork, logos or payment-network marks, and no text inside the art.
// The card's name must be shown as normal text next to it. See quality/asset-rights.json.

const MATERIALS: Record<CardMaterial, { from: string; to: string; accent: string; line: string; sheen: number }> = {
  obsidian: { from: "#0A1222", to: "#22344F", accent: "#2FD3B6", line: "#FFFFFF", sheen: 0.22 },
  navy: { from: "#0F2747", to: "#24496F", accent: "#17C3A8", line: "#FFFFFF", sheen: 0.12 },
  slate: { from: "#33557D", to: "#5C7FA6", accent: "#9BEBDD", line: "#FFFFFF", sheen: 0.18 },
};

const SIZES = {
  xs: "w-14",
  sm: "w-20",
  md: "w-28",
  lg: "w-44 sm:w-56",
  xl: "w-56 sm:w-72",
} as const;

type CardArtProps = {
  id: string;
  annualFee: number;
  type?: CardType;
  size?: keyof typeof SIZES;
  // Distinguishes several instances of the same card on one page (SVG ids must be unique).
  context: string;
  className?: string;
};

// Card art is decorative: the adjacent text carries the card's identity.
export function CardArt({ id, annualFee, type, size = "md", context, className = "" }: CardArtProps) {
  const { material, pattern, seed } = cardArtStyle(id, annualFee, type);
  const m = MATERIALS[material];
  const uid = `ca-${context}-${id}`.replace(/[^a-zA-Z0-9-]/g, "");
  const tilt = ((seed % 21) - 10) * 1.5; // -15..15 degrees
  const shift = (seed >> 5) % 120;

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 align-middle ${SIZES[size]} ${className}`}
      data-card-art={`${material}/${pattern}`}
    >
      <svg viewBox="0 0 856 540" className="block h-auto w-full drop-shadow-[0_6px_14px_rgba(10,18,34,0.28)]" focusable="false">
        <defs>
          <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={m.from} />
            <stop offset="1" stopColor={m.to} />
          </linearGradient>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="0.9" y2="0.6">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={m.sheen} />
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-chip`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E3EAF2" />
            <stop offset="1" stopColor="#9AAEC4" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <rect width="856" height="540" rx="38" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${uid}-clip)`}>
          <rect width="856" height="540" fill={`url(#${uid}-base)`} />
          <g transform={`rotate(${tilt} 428 270) translate(${shift - 60} 0)`} stroke={m.line} fill="none">
            <Pattern pattern={pattern} accent={m.accent} />
          </g>
          <rect width="856" height="540" fill={`url(#${uid}-sheen)`} />
          {/* Abstract contact plate and accent rule: generic shapes, no network or issuer marks. */}
          <rect x="70" y="196" width="104" height="80" rx="14" fill={`url(#${uid}-chip)`} />
          <path d="M70 236h104M122 196v80" stroke="#7C8EA5" strokeWidth="3" opacity="0.6" />
          <rect x="70" y="430" width="230" height="10" rx="5" fill={m.accent} opacity="0.9" />
          <rect x="70" y="456" width="140" height="8" rx="4" fill="#FFFFFF" opacity="0.28" />
        </g>
        <rect x="1.5" y="1.5" width="853" height="537" rx="37" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="3" />
      </svg>
    </span>
  );
}

function Pattern({ pattern, accent }: { pattern: CardPattern; accent: string }) {
  switch (pattern) {
    case "orbits":
      return (
        <g strokeWidth="3" opacity="0.3">
          {[160, 230, 300, 370, 440, 510].map((r) => (
            <circle key={r} cx="760" cy="80" r={r} />
          ))}
          <circle cx="760" cy="80" r="400" stroke={accent} strokeWidth="5" opacity="0.9" />
        </g>
      );
    case "arches":
      return (
        <g strokeWidth="3.5" opacity="0.3">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${420 + i * 90} 560V330a45 45 0 0 1 90 0V560`} />
          ))}
          <path d="M380 560V250a140 140 0 0 1 280 0V560" stroke={accent} strokeWidth="5" opacity="0.9" />
        </g>
      );
    case "flightpath":
      return (
        <g strokeWidth="3.5" opacity="0.3">
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M260 ${520 - i * 40}Q600 ${-80 + i * 60} 900 ${180 + i * 40}`} />
          ))}
          <path d="M240 560Q590 -40 920 160" stroke={accent} strokeWidth="5" strokeDasharray="22 16" opacity="0.95" />
        </g>
      );
    case "grid":
      return (
        <g strokeWidth="2.5" opacity="0.24">
          {Array.from({ length: 11 }, (_, i) => (
            <path key={`v${i}`} d={`M${340 + i * 56} -60V620`} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <path key={`h${i}`} d={`M300 ${-40 + i * 56}H960`} />
          ))}
          <path d="M340 400H900" stroke={accent} strokeWidth="5" opacity="1" />
        </g>
      );
    case "stripes":
    default:
      return (
        <g strokeWidth="18" opacity="0.16">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${380 + i * 70} 600L${640 + i * 70} -60`} />
          ))}
          <path d="M330 600L590 -60" stroke={accent} strokeWidth="10" opacity="1" />
        </g>
      );
  }
}
