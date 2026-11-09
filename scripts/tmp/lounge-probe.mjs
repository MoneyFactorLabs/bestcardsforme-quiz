// TEMPORARY research probe for Issue #21 (removed before the PR): prints issuer page text around lounge terms.
import { pageText } from "../lib/issuerFacts.mjs";
const urls = process.argv.slice(2);
const terms = /guest|lounge|priority pass|authorized user|additional card|sky club|centurion|escape|plaza premium|\$75,000|visits?/gi;
for (const url of urls) {
  let status, text = "";
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; BestCardsForMe-FactCheck/1.0; +https://bestcardsforme.com/contact)" }, signal: AbortSignal.timeout(20000), redirect: "follow" });
    status = `${r.status} ${r.url}`; text = r.ok ? pageText(await r.text()) : "";
  } catch (e) { status = e.cause?.code || e.name; }
  console.log(`\n===== ${url}\n  status: ${status}; text chars: ${text.length}`);
  const seen = new Set(); let n = 0;
  for (const m of text.matchAll(/[^.]*\b(guest|guests|Priority Pass|Authorized User|Additional Card|Card Member|Sky Club|Centurion Lounge|Capital One Lounge|Capital One Landing|Sapphire Lounge|\$75,000|per visit|per person)\b[^.]*\./gi)) {
    const s = m[0].trim().slice(0, 600); if (seen.has(s)) continue; seen.add(s); console.log("  - " + s); if (++n >= 90) break;
  }
}
