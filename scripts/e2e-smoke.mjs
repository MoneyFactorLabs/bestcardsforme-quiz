// Browser smoke test against the production build (`next start`) or, with
// E2E_BASE_URL, against a live deployment.
// Usage: npm run build && npm run test:e2e
//        E2E_BASE_URL=https://bestcardsforme.com npm run test:e2e
// Optional: SCREENSHOT_DIR=path saves mobile screenshots of key pages.
// In live mode analytics calls are intercepted, never sent, so production
// data stays clean; events are confirmed in the page instead of the server log.
//
// Checks every sitemap URL at phone and desktop widths (HTTP 200, no
// horizontal overflow, no uncaught page errors), walks the quiz end to end,
// confirms analytics events fire, and confirms /go/ affiliate redirects.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const port = Number(process.env.E2E_PORT || 3123);
const liveBase = process.env.E2E_BASE_URL?.replace(/\/$/, "");
const origin = liveBase || `http://localhost:${port}`;
const screenshotDir = process.env.SCREENSHOT_DIR;
const keyPages = [
  "/",
  "/cards/citi-double-cash",
  "/cards/united-explorer",
  "/cards/ink-business-preferred",
  "/articles/best-credit-card-for-dining-restaurants-2026",
];
const viewports = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 900 },
};

const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(origin)).ok) return;
    } catch {
      // Server not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`next start did not respond on ${origin}`);
}

async function sitemapPaths() {
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
}

// The API route logs every accepted event when Supabase is not configured,
// which is how the local server proves the event arrived end to end.
let serverLog = "";

// Count of an event name already in the server log, so each check only
// accepts events logged after it starts.
const loggedCount = (name) => serverLog.split(`not configured: ${name}`).length - 1;

async function waitForEvent(page, name, sinceCount, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const sentByPage = await page.evaluate((eventName) => window.__bcfmEvents?.includes(eventName), name).catch(() => false);
    if (sentByPage && (liveBase || loggedCount(name) > sinceCount)) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

// Record analytics calls in the page; Playwright does not surface sendBeacon requests.
const trackEvents = () =>
  `window.__bcfmEvents = [];
  const originalBeacon = navigator.sendBeacon?.bind(navigator);
  navigator.sendBeacon = (url, data) => {
    if (String(url).endsWith("/api/events") && data instanceof Blob) {
      data.text().then((text) => window.__bcfmEvents.push(JSON.parse(text).eventName)).catch(() => {});
    }
    if (${Boolean(liveBase)}) return true;
    return originalBeacon ? originalBeacon(url, data) : true;
  };`;

// In live mode, answer analytics requests locally so tests never write production rows.
async function blockLiveAnalytics(context) {
  if (liveBase) await context.route("**/api/events", (route) => route.fulfill({ status: 200, body: "{}" }));
}

async function checkPages(browser, paths) {
  for (const [name, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(trackEvents());
    await blockLiveAnalytics(context);
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    for (const pathname of paths) {
      pageErrors.length = 0;
      const response = await page.goto(origin + pathname, { waitUntil: "load" });
      if (response?.status() !== 200) fail(`${name} ${pathname}: HTTP ${response?.status()}`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) fail(`${name} ${pathname}: horizontal overflow of ${overflow}px`);
      if (pageErrors.length > 0) fail(`${name} ${pathname}: page error "${pageErrors[0]}"`);

      if (screenshotDir && name === "mobile" && keyPages.includes(pathname)) {
        const file = path.join(screenshotDir, `${pathname.replace(/\//g, "_") || "_home"}.png`);
        await page.screenshot({ path: file, fullPage: true });
      }
    }
    await context.close();
  }
}

async function checkQuiz(browser) {
  const context = await browser.newContext({ viewport: viewports.mobile });
  await context.addInitScript(trackEvents());
  await blockLiveAnalytics(context);
  const page = await context.newPage();
  const completedBefore = loggedCount("quiz_completed");

  await page.goto(origin, { waitUntil: "load" });
  await page.getByRole("button", { name: /start quiz/i }).first().click();

  // Each answer advances the quiz; pick the first option until results render.
  for (let step = 0; step < 20; step += 1) {
    const resultLinks = page.locator('a[href^="/cards/"]');
    if ((await resultLinks.count()) >= 3 && !(await page.locator("[aria-pressed]").count())) break;
    const option = page.locator("main button[type=button]").filter({ hasNotText: /back|restart/i }).first();
    if (!(await option.count())) break;
    await option.click();
    await page.waitForTimeout(150);
  }

  const recommended = await page.locator('a[href^="/cards/"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  if (recommended.length < 3) fail(`quiz: expected 3+ card links on results, found ${recommended.length}`);
  if (recommended.some((href) => href?.includes("bilt-mastercard"))) fail("quiz: recommended discontinued Bilt Mastercard");
  if (!(await waitForEvent(page, "quiz_completed", completedBefore))) fail("quiz: quiz_completed event not received");
  await context.close();
}

async function checkCardTracking(browser) {
  // A regular browser user agent: /go/ deliberately ignores "HeadlessChrome" as a bot.
  const context = await browser.newContext({
    viewport: viewports.mobile,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  });
  await context.addInitScript(trackEvents());
  await blockLiveAnalytics(context);
  const page = await context.newPage();
  // In live mode a 204 cancels the CTA navigation, so production records nothing.
  if (liveBase) await page.route("**/go/**", (route) => route.fulfill({ status: 204 }));
  const viewedBefore = loggedCount("card_detail_viewed");
  const outboundBefore = loggedCount("outbound_click");

  await page.goto(`${origin}/cards/citi-double-cash`, { waitUntil: "load" });
  if (!(await waitForEvent(page, "card_detail_viewed", viewedBefore))) fail("card page: card_detail_viewed event not received");

  const cta = page.locator('a[href="/go/citi-double-cash"]').first();
  if (!(await cta.count())) {
    fail("card page: /go/ CTA missing");
  } else if (liveBase) {
    await cta.click().catch(() => {});
  } else {
    // Every /go/ link is counted server-side: one click must log exactly one
    // outbound_click, even though <Link> also prefetched the route.
    await cta.click();
    const start = Date.now();
    while (loggedCount("outbound_click") === outboundBefore && Date.now() - start < 5000) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    // Leave time for any duplicate (document navigation after the RSC request) to show up.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const logged = loggedCount("outbound_click") - outboundBefore;
    if (logged !== 1) fail(`card page: expected 1 outbound_click for one CTA click, server logged ${logged}`);
  }
  await context.close();
}

async function checkAffiliateRedirects() {
  const source = fs.readFileSync(path.join(process.cwd(), "data/cards.ts"), "utf8");
  const slugs = [...source.matchAll(/affiliateSlug: "([^"]+)"/g)].map((match) => match[1]);

  for (const slug of slugs) {
    // The QA user agent is treated as a bot, so redirect checks are never counted as clicks.
    const response = await fetch(`${origin}/go/${slug}`, { redirect: "manual", headers: { "user-agent": "bcfm-qa-bot" } });
    const location = response.headers.get("location") || "";
    if (![307, 308].includes(response.status) || !location) {
      fail(`/go/${slug}: expected redirect, got ${response.status}`);
      continue;
    }
    const target = new URL(location, origin);
    if (target.origin === origin && (await fetch(target)).status !== 200) {
      fail(`/go/${slug}: redirect target ${target.pathname} is not 200`);
    }
  }
}

const server = liveBase
  ? undefined
  : spawn("npx", ["next", "start", "-p", String(port)], {
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
      // Run without Supabase so events are logged locally instead of stored.
      env: { ...process.env, SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "", NEXT_PUBLIC_SUPABASE_URL: "" },
    });
server?.stdout.on("data", (chunk) => (serverLog += chunk));
server?.stderr.on("data", (chunk) => (serverLog += chunk));
let browser;

try {
  await waitForServer();
  if (screenshotDir) fs.mkdirSync(screenshotDir, { recursive: true });
  browser = await chromium.launch();

  const paths = await sitemapPaths();
  await checkPages(browser, paths);
  await checkQuiz(browser);
  await checkCardTracking(browser);
  await checkAffiliateRedirects();

  warnings.forEach((warning) => console.warn(`WARN ${warning}`));
  if (failures.length > 0) {
    console.error(`E2E smoke failed (${failures.length}):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(
      `E2E smoke passed: ${paths.length} pages × ${Object.keys(viewports).length} viewports, quiz, analytics events, /go/ redirects.`,
    );
  }
} finally {
  await browser?.close();
  if (server) process.kill(-server.pid);
}
