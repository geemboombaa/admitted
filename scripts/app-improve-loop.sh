#!/usr/bin/env bash
# Autonomous app-improvement loop for app.html (the Living Map mobile app).
# One iteration = pick next APP-BACKLOG item -> Opus Builder implements it in app.html and browser-tests it
# -> app-check.js gates JS syntax + data link -> an independent Opus Reviewer opens app.html in Chrome and
# must reply VERDICT: APPROVE -> commit; else hard-reset to the pre-iteration commit and log why, next item.
# Usage: ./scripts/app-improve-loop.sh --batch=N
# Logs to SELF-IMPROVE-LOG.md (so the existing progress dashboard shows it live).

set -uo pipefail
cd "$(dirname "$0")/.."
command -v claude >/dev/null 2>&1 || { echo "claude not on PATH" >&2; exit 1; }
source scripts/loop-guard.sh   # refuse to start if another loop is already running

LOG="SELF-IMPROVE-LOG.md"
ITER=1
for a in "$@"; do case "$a" in --batch=*|--iterations=*) ITER="${a#*=}";; esac; done
M_OPUS="claude-opus-4-8"

log(){ printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" | tee -a "$LOG"; }
score(){ printf '[%s] SCORE | validate=%-4s review=%-7s result=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" >> "$LOG"; }
bar(){ local d=$1 t=$2 n=20 f k b=""; [ "$t" -gt 0 ]||t=1; f=$((d*n/t)); for((k=0;k<n;k++)); do [ $k -lt $f ]&&b+="#"||b+="-"; done; printf '[%s] %d/%d committed' "$b" "$d" "$t"; }
revert(){ git reset --hard "$1" >/dev/null 2>&1; git clean -fdq .scratch >/dev/null 2>&1; }

[ -z "$(git status --porcelain)" ] || { log "ABORT: working tree not clean."; exit 1; }
log "mode: APP IMPROVE — Living Map (app.html), Opus builder + Chrome adversarial reviewer | batch=$ITER"

DONE=0; LAST_REJECTED=""
for ((i=1; i<=ITER; i++)); do
  log "=== iteration $i/$ITER | $(bar "$DONE" "$ITER") ==="
  ITEM=$(node scripts/app-backlog.js next) || { log "backlog empty -- stopping."; break; }
  log "picked: $ITEM"
  BASE=$(git rev-parse HEAD)

  BUILD_PROMPT="You are improving a single-file mobile web app: app.html (concept: THE LIVING MAP — a physics
bubble cluster of 101 real colleges that re-simulates as the user changes their GPA/SAT). Implement EXACTLY this
one backlog item, fully and delightfully, and leave zero bugs:
${ITEM}

Rules: app.html is self-contained except <script src=\"app-data.js\"> (window.SCHOOLS = 101 real schools). Vanilla
JS only, no framework/CDN. NEVER fabricate data — keep verified/EST honesty. Keep the chance()/band() engine and the
PULSE theme intact; do not regress existing features (onboarding, map, deck, detail, shortlist). Open app.html in
Chrome and adversarially TEST your change (mouse AND touch, empty states, recompute-on-stat-change, zero console
errors); fix everything before you finish. Edit ONLY app.html — do not touch APP-BACKLOG.md, SELF-IMPROVE-LOG.md, or
other files. If you download scratch, put it under .scratch/ only."

  if ! printf '%s' "$BUILD_PROMPT" | bash scripts/cq.sh "$M_OPUS"; then
    log "REJECTED: Builder failed."; score na na build-fail; LAST_REJECTED="$ITEM"; revert "$BASE"; continue
  fi
  git clean -fdq .scratch >/dev/null 2>&1

  if ! node scripts/app-check.js; then
    log "REJECTED: app-check failed."; score FAIL na reverted; LAST_REJECTED="$ITEM"; revert "$BASE"; continue
  fi

  REVIEW_PROMPT="You are an adversarial UI/UX reviewer. Open the file C:/Users/v_per/Claude/Projects/College/admitted/app.html
in Chrome and test it HARD. The latest change claims to implement: ${ITEM}

Verify, and REJECT on any failure: the item is genuinely implemented and works; NO console errors; no regression to
onboarding / map / deck / detail / shortlist; works with mouse AND touch; recomputes when the user changes GPA/SAT;
no dead or no-op controls; no fabricated data (verified vs EST shown honestly). Be strict — this is a wow-bar product.

Give brief reasoning, then end with a final line EXACTLY:
VERDICT: APPROVE
or
VERDICT: REJECT"

  REVIEW=$(printf '%s' "$REVIEW_PROMPT" | bash scripts/cq.sh "$M_OPUS")
  VERDICT=$(printf '%s' "$REVIEW" | grep -oiE 'VERDICT:[[:space:]]*(APPROVE|REJECT)' | tail -1)
  log "review verdict: ${VERDICT:-<none emitted>}"
  if ! printf '%s' "$VERDICT" | grep -qiE 'VERDICT:[[:space:]]*APPROVE'; then
    log "REJECTED by review: $REVIEW"; score PASS REJECT reverted; LAST_REJECTED="$ITEM"; revert "$BASE"; continue
  fi

  node scripts/app-backlog.js done "$ITEM"
  git add -A
  git commit -q -m "app: ${ITEM}

Reviewed by: independent Opus reviewer (opened app.html in Chrome, adversarial test)
Co-Authored-By: Claude app-improve loop <noreply@anthropic.com>"
  log "COMMITTED: ${ITEM}"; score PASS APPROVE committed; LAST_REJECTED=""; DONE=$((DONE+1))
done
log "=== app batch complete: $DONE committed this run. ==="
