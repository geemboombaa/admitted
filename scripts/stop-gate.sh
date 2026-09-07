#!/usr/bin/env bash
# Stop hook — makes "self-correcting" real: blocks turn exit until objective excellence
# checks pass. Wired via .claude/settings.json (Stop). Exit 2 = block (message -> agent);
# exit 0 = allow finishing. Enforces OPERATING-MODEL.md / RULES.md / GOAL.md.
cd "$(dirname "$0")/.." 2>/dev/null || exit 0

fail=""

# 1. Data integrity (no-fabrication / schema / dup ids)
if [ -f scripts/validate.js ]; then
  node scripts/validate.js >/dev/null 2>&1 || fail="${fail}
- validate.js FAILED — data integrity broken. Run: node scripts/validate.js"
fi

# 2. App integrity (app.html JS parses + still wired to real data)
if [ -f app.html ] && [ -f scripts/app-check.js ]; then
  node scripts/app-check.js >/dev/null 2>&1 || fail="${fail}
- app-check.js FAILED — app.html JS syntax or data link broken. Run: node scripts/app-check.js"
fi

# 3. No new stubs / TODO / fake-data markers introduced in the working diff
if git rev-parse --git-dir >/dev/null 2>&1; then
  if git diff -- '*.js' '*.html' 2>/dev/null | grep -qE '^\+.*(TODO|FIXME|NotImplementedError|throw new Error\(.?not implemented|return \[\];?\s*//\s*stub|FAKE|PLACEHOLDER)'; then
    fail="${fail}
- New TODO/FIXME/stub/placeholder marker in the diff — resolve or remove before finishing."
  fi
fi

if [ -n "$fail" ]; then
  {
    echo "STOP-GATE BLOCKED — self-correction checks failed:${fail}"
    echo ""
    echo "Fix the above, then finish. Also required before claiming done (OPERATING-MODEL.md / RULES.md / GOAL.md):"
    echo "  • No fabricated data — every published number verified-with-src or flagged EST."
    echo "  • Self-rate & report to the user: data-quality (node scripts/checkpoint-report.js) + self-improvement + goal-progress + autonomous-execution, with what improved this run."
    echo "  • Excellence/innovation: is this genuinely better + wow, not just 'done'? Nothing half-built or parked."
  } >&2
  exit 2
fi
exit 0
