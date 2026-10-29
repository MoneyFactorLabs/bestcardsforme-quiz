import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { cards } from "@/data/cards";
// @ts-expect-error -- plain ESM helper shared with scripts/verify-issuer-facts.mjs
import { checkFee } from "../scripts/lib/issuerFacts.mjs";

const registry = JSON.parse(fs.readFileSync("quality/issuer-sources.json", "utf8")).cards as Record<
  string,
  { issuerUrl: string; discontinued?: boolean; secondary: { url: string; checkedAt: string }[] }
>;

describe("issuer fee check", () => {
  it("matches the published fee next to 'annual fee'", () => {
    assert.equal(checkFee("<p>$0 intro annual fee for the first year, then $150.</p>", 150).status, "match");
    assert.equal(checkFee("<div>Annual fee</div><div>$95</div>", 95).status, "match");
    assert.equal(checkFee("<p>No annual fee</p>", 0).status, "match");
  });

  it("flags a different fee as a mismatch instead of passing it", () => {
    const result = checkFee("<p>Annual fee: $229</p>", 149);
    assert.equal(result.status, "mismatch");
    assert.match(result.detail, /\$229/);
    // $1,295 must not satisfy an expected $129 (no prefix matches).
    assert.equal(checkFee("<p>Annual fee $1,295</p>", 129).status, "mismatch");
  });

  it("reports JavaScript-only pages as inconclusive", () => {
    assert.equal(checkFee('<div id="root"></div><script>render("annual fee $95")</script>', 95).status, "inconclusive");
  });
});

describe("issuer source registry", () => {
  it("covers every quiz card with an https issuer URL", () => {
    cards.forEach((card) => {
      const entry = registry[card.id];
      assert.ok(entry, `${card.id} missing`);
      assert.match(entry.issuerUrl, /^https:\/\//);
      assert.equal(Boolean(entry.discontinued), card.availability === "discontinued", `${card.id} availability`);
    });
  });

  it("records a dated secondary source for every generated profile", () => {
    const generated = ["citi-double-cash", "united-explorer", "ink-business-preferred", "southwest-rapid-rewards-priority",
      "wells-fargo-active-cash", "blue-cash-preferred", "blue-cash-everyday", "chase-freedom-unlimited",
      "chase-freedom-flex", "ink-business-cash", "bilt-mastercard"];
    generated.forEach((cardId) => {
      assert.ok(registry[cardId].secondary.length > 0, cardId);
      registry[cardId].secondary.forEach((source) => {
        assert.match(source.url, /^https:\/\//);
        assert.match(source.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});
