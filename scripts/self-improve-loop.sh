#!/usr/bin/env bash
# Self-correcting build loop for admitted.
#
# NOT verified end-to-end by the Claude session that wrote this file — the sandboxed bridge it was
# authored from has `claude` present but disabled ("claude is not enabled in this environment"), so
# this script could be written and syntax-checked there but never actually run. Smoke-test it yourself
# on one throwaway backlog item before trusting it on real ones.
#
# One iteration = pick next backlog item -> claude -p implements it -> validate.js gates it (objective,
# not claude's own opinion) -> build.js regenerates the app -> a SECOND, independent claude -p call with
# no memory of the build step reviews the diff -> commit only if both gates pass; otherwise hard-reset
# to the pre-iteration commit and log why, then move to the next item.
#
# Usage:
#   ./scripts/self-improve-loop.sh                  # one iteration
#   ./scripts/self-improve-loop.sh --iterations=5    # up to 5 back-to-back
#   ./scripts/self-improve-loop.sh --push            # also `git push` after a successful commit
#
# Nothing pushes to origin unless --push is passed. A push here is a production deploy (Vercel
# auto-deploys on push to main per DEPLOY.txt) -- that stays a separate, deliberate decision every run.

set -uo pipefail
cd "$(dirname "$0")/.."

if ! command -v claude >/dev/null 2>&1; then
  echo "claude CLI not found on PATH in this shell. This loop needs a working, enabled 'claude' command" >&2
  echo "in the terminal you run it from -- run 'claude -p \"say hi\"' by hand first to confirm it works." >&2
  exit 1
fi

BACKLOG="SELF-IMPROVE-BACKLOG.md"
LOG="SELF-IMPROVE-LOG.md"
ITERATIONS=1
PUSH=0
for arg in "$@"; do
  case "$arg" in
    --iterations=*) ITERATIONS="${arg#*=}" ;;
    --push) PUSH=1 ;;
  esac
done

log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" | tee -a "$LOG"; }

if [ -n "$(git status --porcelain)" ]; then
  log "ABORT: working tree is not clean. Commit or stash your own changes before running the loop."
  exit 1
fi

for ((i=1; i<=ITERATIONS; i++)); do
  log "=== iteration $i/$ITERATIONS ==="

  ITEM=$(node scripts/self-improve-backlog.js next) || { log "backlog empty -- stopping."; break; }
  log "picked: $ITEM"

  BASELINE=$(git rev-parse HEAD)

  BUILD_PROMPT="Implement exactly this one item from SELF-IMPROVE-BACKLOG.md, and nothing else in the same pass:
${ITEM}

Rules: follow the data-driven workflow in README.md -- edit data/schools/*.json or data/shared/app-config.json, never hand-edit index1.html directly. Every sourced number needs a src URL per data/schema/school.schema.json (no-fabrication rule). Run 'node scripts/validate.js' yourself and fix anything it flags before finishing. Keep the change scoped to this one backlog item only."

  if ! claude -p "$BUILD_PROMPT"; then
    log "REJECTED: claude -p (build step) failed. Reverting to $BASELINE."
    git reset --hard "$BASELINE" >/dev/null; git clean -fd >/dev/null
    continue
  fi

  if ! node scripts/validate.js; then
    log "REJECTED: node scripts/validate.js failed after the build step. Reverting to $BASELINE."
    git reset --hard "$BASELINE" >/dev/null; git clean -fd >/dev/null
    continue
  fi

  if ! node scripts/build.js --out=index1.generated.html || [ ! -s index1.generated.html ]; then
    log "REJECTED: scripts/build.js failed or produced an empty file. Reverting to $BASELINE."
    git reset --hard "$BASELINE" >/dev/null; git clean -fd >/dev/null
    continue
  fi

  DIFF=$(git diff)
  REVIEW_PROMPT="You are the adversarial-reviewer subagent (.claude/agents/adversarial-reviewer.md). You did NOT write this diff -- review it cold. It claims to implement: ${ITEM}

Diff:
${DIFF}

Reply with a single line starting with APPROVE or REJECT, then your reasoning."

  REVIEW=$(claude -p "$REVIEW_PROMPT")
  VERDICT=$(printf '%s' "$REVIEW" | head -1)
  log "review verdict: $VERDICT"

  if ! printf '%s' "$VERDICT" | grep -qi '^APPROVE'; then
    log "REJECTED by independent review: $REVIEW"
    git reset --hard "$BASELINE" >/dev/null; git clean -fd >/dev/null
    continue
  fi

  node scripts/self-improve-backlog.js done "$ITEM"
  git add -A
  git commit -q -m "self-improve: ${ITEM}

Reviewed by: adversarial-reviewer (independent claude -p call, no memory of the build step)
Co-Authored-By: Claude self-improve loop <noreply@anthropic.com>"
  log "COMMITTED: ${ITEM}"

  if [ "$PUSH" -eq 1 ]; then
    if git push; then log "PUSHED to origin -- Vercel will redeploy."; else log "push failed -- commit is local only, inspect and push by hand."; fi
  else
    log "not pushed (pass --push to deploy). Inspect with: git log -1 -p"
  fi
done
