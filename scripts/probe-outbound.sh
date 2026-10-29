#!/usr/bin/env bash
# Live /go/ tracking probe. Sends ONE real, tagged click (utm_source=bcfm-qa)
# and verifies dedupe, prefetch and bot handling from the response headers.
set -uo pipefail
SITE="${SITE_URL:-https://bestcardsforme.com}"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"
URL="$SITE/go/citi-double-cash?utm_source=bcfm-qa&utm_campaign=release-verify-$(date -u +%Y%m%d)"
fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1: $2"; else echo "FAIL $1: expected '$3', got '$2'"; fail=1; fi; }
hdr() { grep -i "^$1:" "$2" | head -1 | cut -d' ' -f2- | tr -d '\r'; }

curl -sS -o /dev/null -D h1 -A "$UA" -e "$SITE/cards/citi-double-cash" "$URL"
check "real click status" "$(head -1 h1 | awk '{print $2}')" "307"
check "real click location" "$(hdr location h1)" "$SITE/cards/citi-double-cash#issuer-terms"
check "real click recorded (dedupe cookie set)" "$(hdr set-cookie h1 | cut -d';' -f1)" "bcfm_go_citi-double-cash=1"
check "real click not cached" "$(hdr cache-control h1)" "no-store"

curl -sS -o /dev/null -D h2 -A "$UA" -b "bcfm_go_citi-double-cash=1" "$URL"
check "repeat click status" "$(head -1 h2 | awk '{print $2}')" "307"
check "repeat click not recorded" "$(hdr set-cookie h2)" ""

curl -sS -o /dev/null -D h3 -A "$UA" -H "Next-Router-Prefetch: 1" "$URL"
check "prefetch not recorded" "$(hdr set-cookie h3)" ""

curl -sS -o /dev/null -D h4 -A "Googlebot/2.1 (+http://www.google.com/bot.html)" "$URL"
check "bot redirected" "$(head -1 h4 | awk '{print $2}')" "307"
check "bot not recorded" "$(hdr set-cookie h4)" ""

curl -sS -o /dev/null -D h5 -A "$UA" "$SITE/go/not-a-card"
check "unknown slug goes home" "$(hdr location h5)" "$SITE/"
check "unknown slug not recorded" "$(hdr set-cookie h5)" ""
exit $fail
