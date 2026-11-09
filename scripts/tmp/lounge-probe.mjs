// TEMPORARY research probe for Issue #21 (removed before the PR): searches raw HTML (scripts included) for guest-policy text.
const urls = process.argv.slice(2);
const clean = (s) => s.replace(/\\u002F/g, "/").replace(/\\u003C[^]*?\\u003E/g, " ").replace(/<[^>]+>/g, " ").replace(/\\n|\\t/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;|\\"/g, '"').replace(/\s+/g, " ");
for (const url of urls) {
  let status, html = "";
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; BestCardsForMe-FactCheck/1.0; +https://bestcardsforme.com/contact)" }, signal: AbortSignal.timeout(20000) });
    status = `${r.status} ${r.url}`; html = r.ok ? await r.text() : "";
  } catch (e) { status = e.cause?.code || e.name; }
  const text = clean(html);
  console.log(`\n===== ${url}\n  status: ${status}; raw chars: ${html.length}`);
  const seen = new Set(); let n = 0;
  for (const m of text.matchAll(/.{0,220}\b(guests?|Authorized Users?|Additional Card ?Members?)\b.{0,260}/gi)) {
    const s = m[0].trim(); const key = s.slice(150, 260); if (seen.has(key)) continue; seen.add(key);
    if (!/lounge|club|centurion|priority|landing/i.test(s)) continue;
    console.log("  - " + s); if (++n >= 40) break;
  }
}
