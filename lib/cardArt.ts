import { cards } from "@/data/cards";
import type { CardType } from "@/types/card";

// Original, issuer-neutral card illustrations (issue #28). Nothing here reproduces an
// issuer's card face, logo, network mark or trade dress: every card gets the same
// BestCardsForMe-designed shape, and only three things vary, all derived from our own
// data so the variation is honest rather than decorative:
//   - material: from the annual fee tier (a premium fee reads as a darker "metal" finish)
//   - pattern:  from the card's type in data/cards.ts (travel, hotel, airline, cash back, business)
//   - seed:     a stable hash of the card id, so cards of the same type still look distinct
// The card's real name is always shown as editorial text next to the illustration.

export type CardMaterial = "obsidian" | "navy" | "slate";
export type CardPattern = "orbits" | "arches" | "flightpath" | "stripes" | "grid";

export type CardArtStyle = {
  material: CardMaterial;
  pattern: CardPattern;
  seed: number;
};

export function materialForFee(annualFee: number): CardMaterial {
  if (annualFee >= 550) return "obsidian";
  if (annualFee >= 95) return "navy";
  return "slate";
}

export function patternForType(type: CardType | undefined): CardPattern {
  switch (type) {
    case "travel/hotel":
      return "arches";
    case "travel/airline":
      return "flightpath";
    case "travel":
    case "travel/lounge":
    case "travel/dining":
      return "orbits";
    case "business":
    case "business cash back":
      return "grid";
    case "cash back":
    case "groceries/cash back":
    case "cash back / starter":
      return "stripes";
    default:
      return "stripes";
  }
}

// FNV-1a, so the same id always gives the same illustration on server and client.
export function seedForId(id: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

export function cardArtStyle(id: string, annualFee: number, type?: CardType): CardArtStyle {
  const known = cards.find((card) => card.id === id);
  return {
    material: materialForFee(annualFee),
    pattern: patternForType(type ?? known?.type),
    seed: seedForId(id),
  };
}
