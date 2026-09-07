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
WEB=0
for arg in "$@"; do
  case "$arg" in
    --iterations=*|--batch=*) ITERATIONS="${arg#*=}" ;;
    --push) PUSH=1 ;;
    --web) WEB=1 ;;   # Stage 2+: allow the Builder to use the web (official sources only)
  esac
done

log()   { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" | tee -a "$LOG"; }
score() { printf '[%s] SCORE | validate=%-4s review=%-7s result=%s\n' \
          "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" >> "$LOG"; }
revert() { git reset --hard "$1" >/dev/null 2>&1; git clean -fd >/dev/null 2>&1; }

# Model IDs
M_OPUS="claude-opus-4-8"; M_SONNET="claude-sonnet-4-6"; M_HAIKU="claude-haiku-4-5-20251001"

# Dynamic model routing: a cheap Haiku triage rates the item's complexity; its native
# label picks the Builder model. No numeric gate -- the classifier's word IS the decision.
triage_model() {
  local label
  label=$(printf '%s' "Classify this data task's complexity in ONE word from {merge, judgment, conflict, engine}. \
merge = a straight copy of already-sourced local fields into a JSON file. \
judgment = needs a judgment call or honest null decision. conflict = reconcile conflicting sources. \
engine = logic/scoring/engine change. Reply ONLY the one word.

Task: $1" | claude -p --permission-mode bypassPermissions --model "$M_HAIKU" --disallowedTools WebSearch WebFetch 2>/dev/null \
        | tr '[:upper:]' '[:lower:]' | grep -oE 'merge|judgment|conflict|engine' | head -1)
  case "$label" in
    merge) echo "$M_SONNET|merge->sonnet" ;;
    judgment|conflict|engine) echo "$M_OPUS|$label->opus" ;;
    *) echo "$M_OPUS|unclassified->opus(safe default)" ;;
  esac
}

# Progress bar string: bar_str <done> <total>
bar_str() {
  local done=$1 total=$2 n=20 filled k b=""
  [ "$total" -gt 0 ] || total=1
  filled=$(( done * n / total ))
  for ((k=0; k<n; k++)); do [ $k -lt $filled ] && b+="#" || b+="-"; done
  printf '[%s] %d/%d committed' "$b" "$done" "$total"
}

if [ -n "$(git status --porcelain)" ]; then
  log "ABORT: working tree is not clean. Commit or stash your own changes before running the loop."
  exit 1
fi

# Builder data contract + tool-level enforcement depend on mode.
if [ "$WEB" -eq 1 ]; then
  DISALLOW=()   # web allowed (Stage 2+ sourcing)
  BUILD_CONTRACT="STAGE 2 SOURCING — WEB ALLOWED, OFFICIAL SOURCES ONLY. You MAY use WebSearch/WebFetch, but ONLY
to pull numbers from authoritative sources: the school's own site, its Common Data Set, official bursar/financial-aid
pages, IPEDS/College Scorecard. Do NOT take hard numbers (admit rate, SAT band, COA, merit, grad rate) from forums,
blogs, ranking aggregators, or student papers. Every published number you write MUST carry a src URL to the official
page it came from (schema: data/schema/school.schema.json). If you cannot find an OFFICIAL source for a value, do NOT
invent or approximate it — leave it null/EST-flagged and append a line to GAPS.md saying which field is still unsourced.
Never fabricate a number."
  REVIEW_RULE="STAGE 2 (web sourcing): web-sourced numbers ARE allowed and expected. You MAY fetch the cited src URLs
to verify. REJECT on: a published number with NO src URL; a src that is NOT an official/authoritative source (school
site, Common Data Set, official bursar/financial-aid, IPEDS, College Scorecard) — forums/blogs/ranking-aggregators/
student-papers are NOT acceptable; a cited number that does NOT match what the source actually says (spot-check by
fetching at least the least-plausible figures); internally inconsistent figures (e.g. tuition+housing != stated COA);
or scope beyond this one item. Do NOT reject a value merely for being web-sourced rather than in a local file — that
is the whole point of this stage."
else
  DISALLOW=(--disallowedTools WebSearch WebFetch)   # Stage 1: local-only, blocked at tool level
  BUILD_CONTRACT="STAGE 1 IS LOCAL-DATA-ONLY. You may only read/write local files in this repo. Do NOT use the web.
Verification data already lives locally in data/verify-batch1-6.json and data/PENDING-RESEARCH-2026-09-05.md.
If a value you need is not in any local file: DO NOT fetch or invent it. Instead append a specific line to
GAPS.md (which school, which field, what's missing), leave that field flagged as an estimate, and continue.
Never fabricate a number. Every published number you write must keep its src URL (schema: data/schema/school.schema.json)."
  REVIEW_RULE="STAGE 1 (local-only): REJECT on fabricated/invented numbers; a published number without a src URL;
scope beyond this one item; or any value that looks web-sourced but is NOT present in data/verify-batch*.json or
data/PENDING-RESEARCH-2026-09-05.md (Stage 1 forbids web-sourced values)."
fi

log "mode: $([ "$WEB" -eq 1 ] && echo 'WEB — Stage 2 sourcing (official sources only, every number needs a src)' || echo 'LOCAL-ONLY — Stage 1 (web blocked at tool level)') | batch=$ITERATIONS push=$PUSH"

DONE=0
LAST_REJECTED=""
for ((i=1; i<=ITERATIONS; i++)); do
  log "=== iteration $i/$ITERATIONS | $(bar_str "$DONE" "$ITERATIONS") ==="

  ITEM=$(node scripts/self-improve-backlog.js next) || { log "backlog empty -- stopping."; break; }
  log "picked: $ITEM"
  BASELINE=$(git rev-parse HEAD)

  # Pick Builder model: escalate to Opus if this is a retry of a just-rejected item,
  # else route by Haiku triage.
  if [ "$ITEM" = "$LAST_REJECTED" ]; then
    BUILD_MODEL="$M_OPUS"; ROUTE="escalated (retry of rejected item)"
  else
    IFS='|' read -r BUILD_MODEL ROUTE <<<"$(triage_model "$ITEM")"
  fi
  log "model: $BUILD_MODEL ($ROUTE)"

  BUILD_PROMPT="Implement exactly this one backlog item from SELF-IMPROVE-BACKLOG.md, and nothing else:
${ITEM}

${BUILD_CONTRACT}

Workflow (README.md): edit data/schools/*.json or data/shared/app-config.json only. Do NOT touch index.html at
all -- the loop regenerates it from your JSON after you finish. Do NOT edit the tracker files either
(SELF-IMPROVE-BACKLOG.md, PROGRESS.md, SELF-IMPROVE-LOG.md) -- the loop manages those; the ONLY tracker you may
append to is GAPS.md, and only to record a value you genuinely could not satisfy. If you download any file while
researching (PDF, HTML, text), save it ONLY under a .scratch/ directory or delete it before you finish -- never
leave scratch files anywhere else in the repo. Run 'node scripts/validate.js' yourself and fix anything it flags
before finishing. Keep it scoped to this one item."

  # Builder — prompt via stdin; model dynamically routed; web per mode (DISALLOW empty when --web).
  if ! printf '%s' "$BUILD_PROMPT" | claude -p --permission-mode bypassPermissions --model "$BUILD_MODEL" "${DISALLOW[@]}"; then
    log "REJECTED: Builder (claude -p) failed. Reverting to $BASELINE."
    score "na" "na" "build-fail"; LAST_REJECTED="$ITEM"; revert "$BASELINE"; continue
  fi

  # Remove any scratch the Builder left behind (downloaded PDFs/HTML/text from web research),
  # keeping everything under data/. Prevents scratch from dirtying the tree or landing in a commit.
  git clean -fdq -e data >/dev/null 2>&1

  if ! node scripts/validate.js; then
    log "REJECTED: validate.js failed. Reverting to $BASELINE."
    score "FAIL" "na" "reverted"; LAST_REJECTED="$ITEM"; revert "$BASELINE"; continue
  fi

  # Loop owns regeneration of the shipped file (Builder edits JSON only, never index.html).
  if ! node scripts/build.js --out=index.html || [ ! -s index.html ]; then
    log "REJECTED: build.js failed or produced an empty file. Reverting to $BASELINE."
    score "PASS" "na" "buildjs-fail"; LAST_REJECTED="$ITEM"; revert "$BASELINE"; continue
  fi

  # Bug 1 fix: review the SOURCE diff only (generated HTML excluded), fed via stdin (no argv size limit).
  DIFF=$(git diff -- . ':(exclude)index.html' ':(exclude)index.generated.html')
  REVIEW_PROMPT="You are the adversarial-reviewer subagent (.claude/agents/adversarial-reviewer.md). You did NOT
write this diff -- review it cold. It claims to implement: ${ITEM}

Judge ONLY the source-of-truth changes below (data/*.json, config). The generated index.html is excluded on purpose.

${REVIEW_RULE}

Diff:
${DIFF}

Give your reasoning, then end your reply with a final line in EXACTLY this format and nothing after it:
VERDICT: APPROVE
or
VERDICT: REJECT"

  # Reviewer is always Opus (high-leverage gate). In --web mode it may fetch to verify cited sources.
  REVIEW=$(printf '%s' "$REVIEW_PROMPT" | claude -p --permission-mode bypassPermissions --model "$M_OPUS" "${DISALLOW[@]}")
  # Parse the machine-readable final verdict anywhere in the reply (models put reasoning first,
  # verdict last). Missing/ambiguous verdict -> treat as REJECT (fail safe).
  VERDICT=$(printf '%s' "$REVIEW" | grep -oiE 'VERDICT:[[:space:]]*(APPROVE|REJECT)' | tail -1)
  log "review verdict: ${VERDICT:-<none emitted>}"

  if ! printf '%s' "$VERDICT" | grep -qiE 'VERDICT:[[:space:]]*APPROVE'; then
    log "REJECTED by independent review: $REVIEW"
    score "PASS" "REJECT" "reverted"; LAST_REJECTED="$ITEM"; revert "$BASELINE"; continue
  fi

  node scripts/self-improve-backlog.js done "$ITEM"
  git add -A
  git commit -q -m "self-improve: ${ITEM}

Reviewed by: adversarial-reviewer (independent claude -p call, no memory of the build step)
Co-Authored-By: Claude self-improve loop <noreply@anthropic.com>"
  log "COMMITTED: ${ITEM}"
  score "PASS" "APPROVE" "committed"
  LAST_REJECTED=""
  DONE=$((DONE+1))

  if [ "$PUSH" -eq 1 ]; then
    if git push; then log "PUSHED to origin -- Vercel will redeploy."; else log "push failed -- commit is local only."; fi
  else
    log "not pushed (pass --push to deploy). Inspect with: git log -1 -p"
  fi
done

log "=== batch complete: $DONE committed this run. Checkpoint due (metrics + open app + self-audit). ==="
