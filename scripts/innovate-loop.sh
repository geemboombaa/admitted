#!/usr/bin/env bash
# Innovation engine for app.html (THE LIVING MAP). Unlike the feature-QA loop, the roadmap is
# SELF-GENERATED: each cycle a Scout uses the live app as a world-class product designer and proposes
# the single highest-leverage NEW idea (UX / workflow / novel interaction / missing capability / new
# requirement / delight). It self-terminates when the Scout finds nothing worth building (converged),
# after --max cycles, or after 2 consecutive dry (rejected/failed) cycles — so it never burns tokens
# in an endless loop. Every shipped change is independently reviewed for real usefulness + coolness.
# Usage: ./scripts/innovate-loop.sh --max=6
# Logs to SELF-IMPROVE-LOG.md (live dashboard shows it).

set -uo pipefail
cd "$(dirname "$0")/.."
command -v claude >/dev/null 2>&1 || { echo "claude not on PATH" >&2; exit 1; }

LOG="SELF-IMPROVE-LOG.md"; MAX=6; M_OPUS="claude-opus-4-8"
for a in "$@"; do case "$a" in --max=*|--batch=*|--iterations=*) MAX="${a#*=}";; esac; done
APP="$(pwd)/app.html"

log(){ printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" | tee -a "$LOG"; }
score(){ printf '[%s] SCORE | validate=%-4s review=%-7s result=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" >> "$LOG"; }
revert(){ git reset --hard "$1" >/dev/null 2>&1; git clean -fdq -e data >/dev/null 2>&1; }

[ -z "$(git status --porcelain)" ] || { log "ABORT: working tree not clean."; exit 1; }
log "mode: INNOVATE — self-generating design/UX engine on app.html | max=$MAX"

DONE=0; DRY=0
for ((i=1; i<=MAX; i++)); do
  log "=== iteration $i/$MAX | committed $DONE ==="

  SCOUT_PROMPT="You are a world-class product designer AND a premed/BS-MD admissions domain expert. Open the file
${APP} in Chrome and ACTUALLY USE it as a critical, ambitious user. It is a mobile college-decision app (concept:
THE LIVING MAP — a physics bubble cluster of 101 real colleges that re-simulates as the user changes GPA/SAT), on
real verified data.

Propose the SINGLE highest-leverage improvement to build RIGHT NOW to make it more useful, cooler, more innovative,
or better-designed — a NEW idea grounded in what you actually observe: a UX rethink, a smarter workflow, a novel or
delightful interaction, a missing capability, a new requirement you infer from the applicant's real needs, or an
efficiency/clarity win. Be ambitious and original — what would a top product team ship next, not a generic checklist.
Do NOT repeat something already well done. Judge honestly whether the app is already strong enough that no idea
clearly justifies the build cost.

Reply EXACTLY in this format and nothing else:
CONVERGED: yes|no
IDEA: <one concise line: the single next thing to build>
WHY: <one line: why this is the highest-value move right now>
DESIGN: <2-5 lines: the UX/workflow/interaction design and how it should behave>"

  OUT=$(printf '%s' "$SCOUT_PROMPT" | claude -p --permission-mode bypassPermissions --model "$M_OPUS")
  CONV=$(printf '%s' "$OUT" | grep -oiE '^CONVERGED:[[:space:]]*(yes|no)' | head -1 | grep -oiE '(yes|no)' | tail -1)
  IDEA=$(printf '%s' "$OUT" | grep -iE '^IDEA:' | head -1 | sed 's/^[Ii][Dd][Ee][Aa]:[[:space:]]*//')
  DESIGN=$(printf '%s' "$OUT" | awk 'BEGIN{f=0} /^DESIGN:/{f=1} f{print}')
  log "scout idea: ${IDEA:-<none>}"

  if printf '%s' "$CONV" | grep -qi yes || [ -z "$IDEA" ]; then
    log "CONVERGED — scout finds no high-value idea left. Stopping (avoids endless-loop token waste)."
    break
  fi

  BASE=$(git rev-parse HEAD)
  BUILD_PROMPT="Improve the single-file mobile app app.html (THE LIVING MAP; real 101-school data via
<script src=\"app-data.js\">). Implement this self-generated design idea fully and delightfully:
IDEA: ${IDEA}
${DESIGN}

Rules: vanilla JS, single self-contained file except app-data.js; NEVER fabricate data (keep verified/EST honesty);
keep the chance()/band() engine and PULSE theme; do NOT regress onboarding/map/deck/detail/shortlist. Open app.html
in Chrome and adversarially test (mouse+touch, empty states, recompute on stat change, zero console errors); fix
everything before finishing. Edit ONLY app.html; put any scratch under .scratch/."

  if ! printf '%s' "$BUILD_PROMPT" | claude -p --permission-mode bypassPermissions --model "$M_OPUS"; then
    log "REJECTED: builder failed."; score na na build-fail; revert "$BASE"; DRY=$((DRY+1))
    [ $DRY -ge 2 ] && { log "2 consecutive dry cycles — stopping."; break; }; continue
  fi
  git clean -fdq -e data >/dev/null 2>&1

  if ! node scripts/app-check.js; then
    log "REJECTED: app-check failed."; score FAIL na reverted; revert "$BASE"; DRY=$((DRY+1))
    [ $DRY -ge 2 ] && { log "2 consecutive dry cycles — stopping."; break; }; continue
  fi

  REVIEW_PROMPT="You are an adversarial product reviewer. Open ${APP} in Chrome and test it HARD. The change claims
to implement:
IDEA: ${IDEA}

REJECT unless ALL hold: it genuinely works (mouse AND touch); zero console errors; no regression to
onboarding/map/deck/detail/shortlist; no fabricated data (verified vs EST honest); AND it delivers a real,
user-noticeable improvement in usefulness / design / coolness — not trivial or cosmetic-only.
Give brief reasoning and an IMPACT: <one line, before->after user value> line, then end EXACTLY with:
VERDICT: APPROVE
or
VERDICT: REJECT"

  REVIEW=$(printf '%s' "$REVIEW_PROMPT" | claude -p --permission-mode bypassPermissions --model "$M_OPUS")
  V=$(printf '%s' "$REVIEW" | grep -oiE 'VERDICT:[[:space:]]*(APPROVE|REJECT)' | tail -1)
  IMPACT=$(printf '%s' "$REVIEW" | grep -iE '^IMPACT:' | head -1)
  log "review verdict: ${V:-<none>} | ${IMPACT:-}"

  if ! printf '%s' "$V" | grep -qiE 'VERDICT:[[:space:]]*APPROVE'; then
    log "REJECTED by review: $REVIEW"; score PASS REJECT reverted; revert "$BASE"; DRY=$((DRY+1))
    [ $DRY -ge 2 ] && { log "2 consecutive rejects — stopping (diminishing returns)."; break; }; continue
  fi

  git add -A
  git commit -q -m "innovate: ${IDEA}

${IMPACT:-Impact: (not stated)}
Idea + design self-generated by the Scout; independently reviewed in Chrome for usefulness + coolness.
Co-Authored-By: Claude innovate loop <noreply@anthropic.com>"
  log "COMMITTED: ${IDEA}"; score PASS APPROVE committed; DONE=$((DONE+1)); DRY=0
done
log "=== innovate run complete: $DONE shipped this run. ==="
