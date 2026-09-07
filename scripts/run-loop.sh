#!/usr/bin/env bash
# Runtime-ceiling supervisor for any loop (Claude Code has no official --max-turns). Runs the loop
# and hard-kills it (plus any nested agents) if it exceeds the ceiling — the backstop against a
# runaway burning tokens unseen.
#   bash scripts/run-loop.sh <max-minutes> scripts/<some>-loop.sh [loop args...]
cd "$(dirname "$0")/.."
MAX_MIN="${1:?usage: run-loop.sh <max-minutes> <loop-script> [args]}"; shift
LOOP="${1:?loop script required}"; shift
bash "$LOOP" "$@" &
LP=$!
( sleep $(( MAX_MIN * 60 ))
  if kill -0 "$LP" 2>/dev/null; then
    echo "run-loop: CEILING ${MAX_MIN}m hit — killing loop + agents." >&2
    bash scripts/kill-agents.sh >/dev/null 2>&1
    kill "$LP" 2>/dev/null
  fi ) &
WD=$!
wait "$LP"; RC=$?
kill "$WD" 2>/dev/null
exit "$RC"
