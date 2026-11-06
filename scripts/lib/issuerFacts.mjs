// Looks for a published annual fee within 160 characters of each "annual fee"
// mention on an issuer page. Pages that render terms with JavaScript only are
// "inconclusive", never a match.
export function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&reg;|&#174;|®|&trade;|™/g, "")
    .replace(/\s+/g, " ");
}

// Text around the first mention of a hint, so a missed claim shows what the page says instead.
export function claimSnippet(text, hint) {
  if (!hint) return "";
  const index = text.toLowerCase().indexOf(hint.toLowerCase());
  return index === -1 ? "" : text.slice(Math.max(0, index - 120), index + 160).trim();
}

export function checkFee(html, fee) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const mentions = [...text.matchAll(/annual fee/gi)].map((match) =>
    text.slice(Math.max(0, match.index - 160), match.index + 160),
  );
  if (mentions.length === 0) {
    return { status: "inconclusive", detail: "no annual-fee text in the HTML (likely rendered by JavaScript)" };
  }

  const expected = fee === 0 ? /\$0(?![\d,])|no annual fee/i : new RegExp(`\\$${fee.toLocaleString("en-US")}(?![\\d,])`);
  if (mentions.some((window) => expected.test(window))) return { status: "match", detail: `$${fee} found next to "annual fee"` };

  const seen = [...new Set(mentions.join(" ").match(/\$\d{1,3}(?:,\d{3})*/g) || [])].slice(0, 5);
  return { status: "mismatch", detail: `expected $${fee}; amounts near "annual fee": ${seen.join(", ") || "none"}` };
}
