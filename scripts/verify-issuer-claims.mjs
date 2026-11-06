// Checks the issuer terms our articles state (quality/issuer-claims.json) against
// official issuer pages.
// Usage: npm run verify:claims                      (registry checks only, no network)
//        npm run verify:claims -- --issuers         (also fetch issuer pages; GitHub runners reach them)
//        npm run verify:claims -- --issuers --write (save quality/issuer-claims-report.json)
// Options: --stale-days N (default 120)
//
// Fails on: an invalid pattern, a usedIn slug that is not a published article,
// a secondary source older than --stale-days, or (with --issuers) a claim that
// is not found on a page that rendered. Pages that cannot be read are reported
// as unverified, never as verified.
import fs from "node:fs";
import path from "node:path";
import { claimSnippet, pageText } from "./lib/issuerFacts.mjs";

const root = process.cwd();
const args = process.argv.slice(2);
const checkIssuers = args.includes("--issuers");
const staleDays = Number(args[args.indexOf("--stale-days") + 1]) || 120;
const today = new Date();

const registry = JSON.parse(fs.readFileSync(path.join(root, "quality/issuer-claims.json"), "utf8")).products;
const articleSlugs = new Set(
  fs
    .readdirSync(path.join(root, "data"))
    .filter((file) => file.startsWith("articles"))
    .flatMap((file) => [...fs.readFileSync(path.join(root, "data", file), "utf8").matchAll(/^\s{2,4}"?slug"?: "([^"]+)"/gm)])
    .map((match) => match[1]),
);

const failures = [];
const results = [];

for (const [productId, product] of Object.entries(registry)) {
  for (const slug of product.usedIn) {
    if (!articleSlugs.has(slug)) failures.push(`${productId}: usedIn "${slug}" is not a published article`);
  }
  for (const source of product.secondary) {
    const ageDays = Math.floor((today - new Date(source.checkedAt)) / 86400000);
    if (ageDays > staleDays) failures.push(`${productId}: ${source.publisher} check is ${ageDays} days old (max ${staleDays})`);
  }
  for (const claim of product.claims) {
    try {
      new RegExp(claim.pattern, "i");
    } catch (error) {
      failures.push(`${productId}/${claim.id}: invalid pattern (${error.message})`);
    }
  }
}

if (checkIssuers && failures.length === 0) {
  for (const [productId, product] of Object.entries(registry)) {
    let text = "";
    let pageStatus = "";
    try {
      const response = await fetch(product.issuerUrl, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; BestCardsForMe-FactCheck/1.0; +https://bestcardsforme.com/contact)" },
        signal: AbortSignal.timeout(20000),
      });
      if (response.ok) text = pageText(await response.text());
      else pageStatus = `HTTP ${response.status}`;
    } catch (error) {
      pageStatus = error.cause?.code || error.name;
    }

    for (const claim of product.claims) {
      if (!text) {
        results.push({ productId, claim: claim.id, status: "unverified", detail: `page not readable (${pageStatus})` });
      } else if (new RegExp(claim.pattern, "i").test(text)) {
        results.push({ productId, claim: claim.id, status: "verified", detail: claim.text });
      } else {
        const context = claimSnippet(text, claim.hint);
        results.push({ productId, claim: claim.id, status: "not-found", detail: `${claim.text}${context ? ` | page near "${claim.hint}": ${context}` : ""}` });
        failures.push(`${productId}/${claim.id}: "${claim.text}" not found on ${product.issuerUrl}`);
      }
    }
  }

  const counts = results.reduce((sum, result) => ({ ...sum, [result.status]: (sum[result.status] || 0) + 1 }), {});
  console.log(`Issuer claims: ${Object.entries(counts).map(([status, count]) => `${count} ${status}`).join(", ")}`);
  results.forEach((result) => console.log(`  ${result.status.padEnd(10)} ${`${result.productId}/${result.claim}`.padEnd(48)} ${result.detail}`));

  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = results.map((result) => `| ${result.productId} | ${result.claim} | ${result.status} | ${result.detail.replace(/\|/g, "/")} |`);
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Article claims vs issuer pages\n\n| Product | Claim | Status | Detail |\n|---|---|---|---|\n${rows.join("\n")}\n`,
    );
  }
  if (args.includes("--write")) {
    fs.writeFileSync(
      path.join(root, "quality/issuer-claims-report.json"),
      `${JSON.stringify({ checkedAt: today.toISOString().slice(0, 10), results }, null, 2)}\n`,
    );
  }
}

if (failures.length > 0) {
  console.error(`Claim verification failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const claimCount = Object.values(registry).reduce((sum, product) => sum + product.claims.length, 0);
console.log(`Claim registry OK: ${claimCount} claims across ${Object.keys(registry).length} products.`);
