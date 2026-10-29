// Post-build crawl of the prerendered site in .next/server/app.
// Usage: npm run build && npm run validate:site [-- --update-control]
// Fails on broken internal links, URL-like strings in the inline RSC payload
// that do not resolve (Google crawls these), placeholder copy, missing
// canonicals, duplicate titles or meta descriptions, and any change to a
// control page listed in quality/control-pages.json.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), ".next/server/app");
const placeholderPattern = /details pending|lorem ipsum|\bTBD\b|\bTODO\b/i;
const staticFiles = new Set(["/sitemap.xml", "/robots.txt", "/icon.svg", "/apple-icon.png"]);

if (!fs.existsSync(root)) {
  console.error("No build output found. Run `npm run build` first.");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file, out);
    else if (file.endsWith(".html")) out.push(file);
  }

  return out;
}

const pages = new Map();
for (const file of walk(root)) {
  let route = `/${path.relative(root, file).replace(/\.html$/, "")}`;
  if (route === "/index") route = "/";
  if (route === "/_not-found") continue;
  pages.set(route, fs.readFileSync(file, "utf8"));
}

// Route prefixes come from the build itself, so any Next.js vertical can reuse this check.
const routePrefixes = [
  ...new Set([...pages.keys()].map((route) => route.split("/")[1]).filter(Boolean)),
  "go",
].map((prefix) => prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

// Verticals with /go/ affiliate redirects declare their slugs in data/cards.ts.
const cardsFile = path.join(process.cwd(), "data/cards.ts");
const cardsSource = fs.existsSync(cardsFile) ? fs.readFileSync(cardsFile, "utf8") : "";
const affiliateSlugs = new Set([...cardsSource.matchAll(/affiliateSlug: "([^"]+)"/g)].map((match) => match[1]));
const resolves = (href) =>
  pages.has(href) || staticFiles.has(href) || (href.startsWith("/go/") && affiliateSlugs.has(href.slice(4)));

const errors = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const payloadPattern = new RegExp(`\\\\?"(/(?:${routePrefixes.join("|")})[^"\\\\]*)\\\\?"`, "g");

for (const [route, html] of pages) {
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1].replace(/\/$/, "") || "/";
    if (href.startsWith("/_next/")) continue;
    if (!resolves(href)) errors.push(`${route}: broken link ${href}`);
  }

  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).join("\n");
  for (const match of scripts.matchAll(payloadPattern)) {
    if (!resolves(match[1])) errors.push(`${route}: unresolvable URL-like string in page data "${match[1].slice(0, 80)}"`);
  }

  const visibleText = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
  const placeholder = visibleText.match(placeholderPattern);
  if (placeholder) errors.push(`${route}: placeholder text "${placeholder[0]}"`);

  if (route === "/moneyfactor") continue;

  if (!/<link rel="canonical"/.test(html)) errors.push(`${route}: missing canonical`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  for (const [value, seen, label] of [
    [title, seenTitles, "title"],
    [description, seenDescriptions, "meta description"],
  ]) {
    if (!value) {
      errors.push(`${route}: missing ${label}`);
      continue;
    }
    if (seen.has(value)) errors.push(`${route}: duplicate ${label} (also on ${seen.get(value)})`);
    else seen.set(value, route);
  }
}

// Control pages are fingerprinted on visible HTML plus title, meta, canonical,
// and JSON-LD; build-specific asset hashes and IDs are ignored.
const controlFile = path.join(process.cwd(), "quality/control-pages.json");
if (fs.existsSync(controlFile)) {
  const control = JSON.parse(fs.readFileSync(controlFile, "utf8"));
  const fingerprint = (html) => {
    const head = html.match(/<title>[^<]*<\/title>|<meta name="description"[^>]*>|<link rel="canonical"[^>]*>|<script type="application\/ld\+json">[\s\S]*?<\/script>/g) ?? [];
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/\/_next\/static\/[^"]*/g, "")
      .replace(/<!--[A-Za-z0-9_-]{21}-->/g, "");
    return crypto.createHash("sha256").update(head.join("\n") + visible).digest("hex");
  };

  for (const route of Object.keys(control.pages)) {
    const html = pages.get(route);
    if (!html) {
      errors.push(`${route}: control page missing from build`);
      continue;
    }
    const actual = fingerprint(html);
    if (process.argv.includes("--update-control")) control.pages[route] = actual;
    else if (control.pages[route] !== actual) {
      errors.push(`${route}: control page changed (run with --update-control only after founder sign-off)`);
    }
  }

  if (process.argv.includes("--update-control")) {
    fs.writeFileSync(controlFile, `${JSON.stringify(control, null, 2)}\n`);
    console.log(`Updated control fingerprints for ${Object.keys(control.pages).length} page(s).`);
  }
}

if (errors.length > 0) {
  console.error(`Site validation failed (${errors.length} issues across ${pages.size} pages):`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  if (errors.length > 50) console.error(`- …and ${errors.length - 50} more`);
  process.exit(1);
}

console.log(`Site validation passed: ${pages.size} pages, 0 broken links, 0 unresolvable payload URLs.`);
