#!/usr/bin/env bash
# Self-correcting build loop for admitted (Stage 1: local data only).
#
# One iteration = pick next backlog item -> Builder (nested claude -p, web tools BLOCKED) implements it
# from LOCAL data only -> validate.js gates it -> build.js regenerates the app -> a SECOND, independent
# Reviewer (nested claude -p, no memory of the build) judges the SOURCE diff cold -> commit only if all
# gates pass, else hard-reset to the pre-iteration commit and log why, then next item.
#
# Usage:
#   ./scripts/self-improve-loop.sh --batch=4     # run up to 4 iterations, then stop for a checkpoint
#   ./scripts/self-improve-loop.sh               # one iteration
#   ./scripts/self-improve-loop.sh --push        # also push (=deploy) after a successful commit
#
# Nothing pushes to origin unless --push is passed (a push auto-deploys via Vercel — a deliberate,
# per-run decision made at a checkpoint, never by default).
#
# See GOAL.md / RULES.md / OPERATING-MODEL.md for the contract this enforces.

set -uo pipefail
cd "$(dirname "$0")/.."

if ! command -v claude >/dev/null 2>&1; then
  echo "claude CLI not found on PATH. Run 'claude -p \"say hi\"' by hand first to confirm it works." >&2
  exit 1
fi

BACKLOG="SELF-IMPROVE-BACKLOG.md"
LOG="SELF-IMPROVE-LOG.md"        # gitignored on purpose -> survives the revert (Bug 2 fix)
ITERATIONS=1
PUSH=0
for arg in "$@"; do
  case "$arg" in
    --iterations=*|--batch=*) ITERATIONS="${arg#*=}" ;;
    --push) PUSH=1 ;;
  esac
done

log()   { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" | tee -a "$LOG"; }
score() { printf '[%s] SCORE | validate=%-4s review=%-7s result=%s\n' \
          "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" >> "$LOG"; }
revert() { git reset --hard "$1" >/dev/null 2>&1; git clean -fd >/dev/null 2>&1; }

if [ -n "$(git status --porcelain)" ]; then
  log "ABORT: working tree is not clean. Commit or stash your own changes before running the loop."
  exit 1
fi

# Local-only contract handed to the Builder, enforced ALSO at the tool level below.
NO_WEB="STAGE 1 IS LOCAL-DATA-ONLY. You may only read/write local files in this repo. Do NOT use the web.
Verification data already lives locally in data/verify-batch1-6.json and data/PENDING-RESEARCH-2026-09-05.md.
If a value you need is not in any local file: DO NOT fetch or invent it. Instead append a specific line to
GAPS.md (which school, which field, what's missing), leave that field flagged as an estimate, and continue.
Never fabricate a number. Every published number you write must keep its src URL (schema: data/schema/school.schema.json)."

DONE=0
for ((i=1; i<=ITERATIONS; i++)); do
  log "=== iteration $i/$ITERATIONS ==="

  ITEM=$(node scripts/self-improve-backlog.js next) || { log "backlog empty -- stopping."; break; }
  log "picked: $ITEM"
  BASELINE=$(git rev-parse HEAD)

  BUILD_PROMPT="Implement exactly this one backlog item from SELF-IMPROVE-BACKLOG.md, and nothing else:
${ITEM}

${NO_WEB}

Workflow (README.md): edit data/schools/*.json or data/shared/app-config.json only. Do NOT touch index1.html at
all -- the loop regenerates it from your JSON after you finish. Do NOT edit the tracker files either
(SELF-IMPROVE-BACKLOG.md, PROGRESS.md, SELF-IMPROVE-LOG.md) -- the loop manages those; the ONLY tracker you may
append to is GAPS.md, and only to record a value you genuinely could not satisfy from local data. Run
'node scripts/validate.js' yourself and fix anything it flags before finishing. Keep it scoped to this one item."

  # Builder — prompt via stdin; web tools blocked at the tool level.
  if ! printf '%s' "$BUILD_PROMPT" | claude -p --disallowedTools WebSearch WebFetch; then
    log "REJECTED: Builder (claude -p) failed. Reverting to $BASELINE."
    score "na" "na" "build-fail"; revert "$BASELINE"; continue
  fi

  if ! node scripts/validate.js; then
    log "REJECTED: validate.js failed. Reverting to $BASELINE."
    score "FAIL" "na" "reverted"; revert "$BASELINE"; continue
  fi

  # Loop owns regeneration of the shipped file (Builder edits JSON only, never index1.html).
  if ! node scripts/build.js --out=index1.html || [ ! -s index1.html ]; then
    log "REJECTED: build.js failed or produced an empty file. Reverting to $BASELINE."
    score "PASS" "na" "buildjs-fail"; revert "$BASELINE"; continue
  fi

  # Bug 1 fix: review the SOURCE diff only (generated HTML excluded), fed via stdin (no argv size limit).
  DIFF=$(git diff -- . ':(exclude)index1.html' ':(exclude)index1.generated.html')
  REVIEW_PROMPT="You are the adversarial-reviewer subagent (.claude/agents/adversarial-reviewer.md). You did NOT
write this diff -- review it cold. It claims to implement: ${ITEM}

Judge ONLY the source-of-truth changes below (data/*.json, config). The generated index1.html is excluded on
purpose. Enforce, and REJECT on any violation: fabricated/invented numbers; a published number without a src URL;
scope beyond this one item; any value that looks web-sourced but is not present in data/verify-batch*.json or
data/PENDING-RESEARCH-2026-09-05.md (Stage 1 is local-only).

Diff:
${DIFF}

Reply with ONE line starting APPROVE or REJECT, then your reasoning."

  REVIEW=$(printf '%s' "$REVIEW_PROMPT" | claude -p --disallowedTools WebSearch WebFetch)
  VERDICT=$(printf '%s' "$REVIEW" | head -1)
  log "review verdict: $VERDICT"

  if ! printf '%s' "$VERDICT" | grep -qi '^APPROVE'; then
    log "REJECTED by independent review: $REVIEW"
    score "PASS" "REJECT" "reverted"; revert "$BASELINE"; continue
  fi

  node scripts/self-improve-backlog.js done "$ITEM"
  git add -A
  git commit -q -m "self-improve: ${ITEM}

Reviewed by: adversarial-reviewer (independent claude -p call, no memory of the build step)
Co-Authored-By: Claude self-improve loop <noreply@anthropic.com>"
  log "COMMITTED: ${ITEM}"
  score "PASS" "APPROVE" "committed"
  DONE=$((DONE+1))

  if [ "$PUSH" -eq 1 ]; then
    if git push; then log "PUSHED to origin -- Vercel will redeploy."; else log "push failed -- commit is local only."; fi
  else
    log "not pushed (pass --push to deploy). Inspect with: git log -1 -p"
  fi
done

log "=== batch complete: $DONE committed this run. Checkpoint due (metrics + open app + self-audit). ==="
