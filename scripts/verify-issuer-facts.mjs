// Verifies published card facts against official issuer pages and source freshness.
// Usage: npm run verify:facts                      (registry + staleness only, no network)
//        npm run verify:facts -- --issuers         (also fetch issuer pages)
//        npm run verify:facts -- --issuers --write (save quality/issuer-verification.json)
// Options: --stale-days N (default 120)
//
// Fails on: a quiz card with no source entry, a secondary source older than
// --stale-days, or an issuer page that states a different annual fee than we
// publish. An unreachable or JavaScript-only issuer page is reported as
// unverified rather than counted as a match.
import fs from "node:fs";
import path from "node:path";
import { checkFee } from "./lib/issuerFacts.mjs";

const root = process.cwd();
const args = process.argv.slice(2);
const checkIssuers = args.includes("--issuers");
const staleDays = Number(args[args.indexOf("--stale-days") + 1]) || 120;
const today = new Date();

const cardsSource = fs.readFileSync(path.join(root, "data/cards.ts"), "utf8");
const fees = Object.fromEntries(
  [...cardsSource.matchAll(/id: "([^"]+)",\s*name: "[^"]+",\s*annualFee: (\d+),/g)].map((match) => [match[1], Number(match[2])]),
);
const registry = JSON.parse(fs.readFileSync(path.join(root, "quality/issuer-sources.json"), "utf8")).cards;

const failures = [];
const results = [];

for (const cardId of Object.keys(fees)) {
  if (!registry[cardId]) failures.push(`${cardId}: no entry in quality/issuer-sources.json`);
}

for (const [cardId, entry] of Object.entries(registry)) {
  if (!(cardId in fees)) failures.push(`${cardId}: source entry for a card that is not in data/cards.ts`);
  for (const source of entry.secondary) {
    const ageDays = Math.floor((today - new Date(source.checkedAt)) / 86400000);
    if (ageDays > staleDays) failures.push(`${cardId}: ${source.publisher} check is ${ageDays} days old (max ${staleDays})`);
  }
}

if (checkIssuers) {
  for (const [cardId, entry] of Object.entries(registry)) {
    if (entry.discontinued) {
      results.push({ cardId, url: entry.issuerUrl, status: "skipped", detail: "product discontinued" });
      continue;
    }
    try {
      const response = await fetch(entry.issuerUrl, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; BestCardsForMe-FactCheck/1.0; +https://bestcardsforme.com/contact)" },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) {
        results.push({ cardId, url: entry.issuerUrl, status: "unreachable", detail: `HTTP ${response.status}` });
        continue;
      }
      results.push({ cardId, url: response.url, ...checkFee(await response.text(), fees[cardId]) });
    } catch (error) {
      results.push({ cardId, url: entry.issuerUrl, status: "unreachable", detail: error.cause?.code || error.name });
    }
  }

  results.filter((result) => result.status === "mismatch").forEach((result) => failures.push(`${result.cardId}: ${result.detail} (${result.url})`));

  const counts = results.reduce((sum, result) => ({ ...sum, [result.status]: (sum[result.status] || 0) + 1 }), {});
  console.log(`Issuer pages: ${Object.entries(counts).map(([status, count]) => `${count} ${status}`).join(", ")}`);
  results.forEach((result) => console.log(`  ${result.status.padEnd(12)} ${result.cardId.padEnd(34)} ${result.detail}`));

  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = results.map((result) => `| ${result.cardId} | ${result.status} | ${result.detail} | ${result.url} |`);
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Issuer fact verification\n\n| Card | Status | Detail | Source |\n|---|---|---|---|\n${rows.join("\n")}\n`,
    );
  }

  if (args.includes("--write")) {
    fs.writeFileSync(
      path.join(root, "quality/issuer-verification.json"),
      `${JSON.stringify({ checkedAt: today.toISOString().slice(0, 10), results }, null, 2)}\n`,
    );
  }
}

if (failures.length > 0) {
  console.error(`Fact verification failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Fact sources OK: ${Object.keys(registry).length} cards registered, no source older than ${staleDays} days.`);
