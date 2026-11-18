import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { cards } from "@/data/cards";
import { cardArtStyle, materialForFee, patternForType, seedForId } from "@/lib/cardArt";

// Guards for issue #28: every served image is registered with its rights basis, no
// external image URLs, no payment-network or issuer marks in served artwork.

const root = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(root, "quality/asset-rights.json"), "utf8")) as {
  assets: { path: string; creator: string; rightsBasis: string; license: string; restrictions: string; lastVerified: string }[];
};
const registered = new Set(registry.assets.map((asset) => asset.path));

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const rel = (file: string) => path.relative(root, file).split(path.sep).join("/");
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|ico)$/i;
const sourceFiles = ["app", "components", "lib", "data"].flatMap((dir) => walk(path.join(root, dir))).filter((f) => /\.(tsx?|css)$/.test(f));

test("every registry entry has a complete rights record and exists", () => {
  for (const asset of registry.assets) {
    for (const field of ["creator", "rightsBasis", "license", "restrictions", "lastVerified"] as const) {
      assert.ok(asset[field]?.trim(), `${asset.path}: missing ${field}`);
    }
    assert.match(asset.lastVerified, /^\d{4}-\d{2}-\d{2}$/, `${asset.path}: lastVerified must be YYYY-MM-DD`);
    assert.ok(fs.existsSync(path.join(root, asset.path)), `${asset.path}: registered but missing`);
  }
});

test("every served image file is registered", () => {
  const served = [
    ...walk(path.join(root, "public")),
    ...walk(path.join(root, "app")).filter((f) => /\/(icon|apple-icon|opengraph-image|twitter-image)\.[a-z]+$/.test(rel(f))),
  ].filter((f) => IMAGE_EXT.test(f));
  for (const file of served) {
    assert.ok(registered.has(rel(file)), `${rel(file)} is served but not in quality/asset-rights.json`);
  }
});

test("source code loads no external images and references only registered local images", () => {
  const external = /(?:src|srcSet|href|poster)\s*=\s*\{?\s*["'`]https?:\/\/[^"'`]+\.(?:png|jpe?g|gif|webp|avif|svg)|url\(\s*["']?https?:\/\//i;
  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8");
    assert.ok(!external.test(text), `${rel(file)}: external image URL`);
    for (const match of text.matchAll(/["'`](\/[A-Za-z0-9_\-/.]+\.(?:png|jpe?g|gif|webp|avif|svg))["'`]/g)) {
      const local = match[1] === "/icon.svg" || match[1] === "/apple-icon.png" ? `app${match[1]}` : `public${match[1]}`;
      assert.ok(registered.has(local), `${rel(file)}: ${match[1]} is not registered`);
    }
  }
  const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  assert.ok(!/remotePatterns|domains\s*:/.test(nextConfig), "next.config must not enable remote images");
});

test("served artwork contains no payment-network or issuer marks", () => {
  const marks = /\b(visa|mastercard|master card|american express|amex|discover|chase|capital one|citi|wells fargo|bank of america)\b/i;
  const artwork = [path.join(root, "components/CardArt.tsx"), ...walk(path.join(root, "public")).filter((f) => /\.svg$/i.test(f))];
  for (const file of artwork) {
    const text = fs.readFileSync(file, "utf8").replace(/\/\/.*$|\/\*[\s\S]*?\*\/|\{\/\*[\s\S]*?\*\/\}/gm, "");
    assert.ok(!marks.test(text), `${rel(file)}: contains an issuer or network name`);
  }
});

test("card art style is deterministic and derived from fee tier and card type", () => {
  assert.equal(materialForFee(795), "obsidian");
  assert.equal(materialForFee(325), "navy");
  assert.equal(materialForFee(0), "slate");
  assert.equal(patternForType("travel/hotel"), "arches");
  assert.equal(patternForType("travel/airline"), "flightpath");
  assert.equal(patternForType("business"), "grid");
  assert.equal(patternForType("cash back"), "stripes");
  assert.equal(seedForId("amex-gold"), seedForId("amex-gold"));
  for (const card of cards) {
    const style = cardArtStyle(card.id, card.annualFee);
    assert.equal(style.material, materialForFee(card.annualFee), card.id);
    assert.equal(style.pattern, patternForType(card.type), card.id);
  }
});
