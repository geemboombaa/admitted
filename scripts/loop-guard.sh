# SOURCE this at the top of any loop:  source scripts/loop-guard.sh
# Refuses to start a second loop while another *-loop.sh is already running — the fix for the
# rogue-multi-loop disaster (six loops once ran unseen). Must be sourced (not executed) so $$ is
# the loop's own PID and it excludes itself. Also writes a heartbeat pidfile the dashboard can read.
__self=$$
__running=$(powershell -NoProfile -NonInteractive -Command "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match '-loop\.sh' -and \$_.ProcessId -ne $__self -and \$_.CommandLine -notmatch 'Get-CimInstance' } | ForEach-Object { \$_.ProcessId }" 2>/dev/null | tr -d '\r' | grep -E '^[0-9]+$' | head -1)
if [ -n "$__running" ]; then
  echo "LOOP-GUARD: another loop already running (PID $__running). Refusing to start a second." >&2
  echo "  Kill everything first: bash scripts/kill-agents.sh" >&2
  exit 1
fi
printf '%s\n' "$__self $(date -u +%Y-%m-%dT%H:%M:%SZ)" > .loop.lock 2>/dev/null
trap 'rm -f .loop.lock 2>/dev/null' EXIT
