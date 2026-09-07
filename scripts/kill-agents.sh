#!/usr/bin/env bash
# EMERGENCY KILL-SWITCH — terminate every admitted loop process and every claude -p agent they spawned.
# Kills by COMMAND LINE (reliable) — not by task handle (TaskStop leaves the bash process alive, which is
# exactly how six loops went rogue and burned tokens). Run this whenever anything must be stopped for real.
#   bash scripts/kill-agents.sh
echo "== killing loop scripts (app-improve / innovate / self-improve) =="
cmd //c "wmic process where \"commandline like '%-loop.sh%'\" delete" 2>/dev/null | grep -i deleted || echo "  (none)"
echo "== killing nested claude -p agents (loop builders/reviewers/triage) =="
cmd //c "wmic process where \"commandline like '%--model claude-%'\" delete" 2>/dev/null | grep -i deleted || echo "  (none)"
echo "== VERIFY: survivors (should be empty) =="
cmd //c "wmic process where \"commandline like '%-loop.sh%' or commandline like '%--model claude-%'\" get processid,commandline" 2>/dev/null | grep -iE "loop|claude-" || echo "  CLEAN — no loop or agent processes running."
