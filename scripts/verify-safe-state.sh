#!/usr/bin/env bash
# SessionStart hook — reports safe-state at the top of every session so nothing runs rogue unseen.
# Non-blocking (SessionStart can't block); prints to stderr for the transcript.
cd "$(dirname "$0")/.." 2>/dev/null || exit 0
{
  echo "[safe-state] $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  running=$(powershell -NoProfile -NonInteractive -Command "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match '-loop\.sh' -and \$_.CommandLine -notmatch 'Get-CimInstance' } | Measure-Object | ForEach-Object { \$_.Count }" 2>/dev/null | tr -d '\r ')
  if [ -n "$running" ] && [ "$running" != "0" ]; then
    echo "[safe-state] WARNING: $running loop process(es) running — check: bash scripts/kill-agents.sh"
  else
    echo "[safe-state] loops: clean (0 running)"
  fi
  dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  echo "[safe-state] git: $dirty uncommitted file(s); phase=$(node scripts/phase.js get 2>/dev/null); $(node scripts/rubric-score.js 2>/dev/null)"
} >&2
exit 0
