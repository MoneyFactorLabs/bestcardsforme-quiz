// Post-build crawl of the prerendered site in .next/server/app.
// Usage: npm run build && npm run validate:site
// Fails on broken internal links, URL-like strings in the inline RSC payload
// that do not resolve (Google crawls these), placeholder copy, missing
// canonicals, and duplicate titles or meta descriptions.
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), ".next/server/app");
const routePrefixes = [
  "cards",
  "articles",
  "go",
  "methodology",
  "about",
  "contact",
  "editorial-standards",
  "affiliate-disclosure",
  "how-we-review-credit-cards",
];
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

const cardsSource = fs.readFileSync(path.join(process.cwd(), "data/cards.ts"), "utf8");
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

if (errors.length > 0) {
  console.error(`Site validation failed (${errors.length} issues across ${pages.size} pages):`);
  for (const error of errors.slice(0, 50)) console.error(`- ${error}`);
  if (errors.length > 50) console.error(`- …and ${errors.length - 50} more`);
  process.exit(1);
}

console.log(`Site validation passed: ${pages.size} pages, 0 broken links, 0 unresolvable payload URLs.`);
