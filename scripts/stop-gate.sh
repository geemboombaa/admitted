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

# 2c. Engine unit tests (chance/band pure functions vs real data — clamp, monotonic, bands).
if [ -f app.html ] && [ -f scripts/test-engine.js ]; then
  node scripts/test-engine.js >/dev/null 2>&1 || fail="${fail}
- test-engine.js FAILED — the decision engine broke an invariant. Run: node scripts/test-engine.js"
fi

# 2d. Privacy hard gate — the public copy must never contain a real name.
if [ -f index.html ] && [ -f scripts/privacy-check.js ]; then
  node scripts/privacy-check.js index.html >/dev/null 2>&1 || fail="${fail}
- privacy-check FAILED — a real name is in index.html (the deployed copy). Remove it."
fi

# 2a. PHASE GATE — every phase (requirements->design->build->prototype->ship), not just data/app.
if [ -f scripts/phase.js ]; then
  pg=$(node scripts/phase.js gate 2>&1) || fail="${fail}
- ${pg}"
fi

# 2b. IMPROVEMENT METRIC — the rubric score must never REGRESS (a committed criterion undone).
if [ -f scripts/rubric-score.js ] && [ -f METRICS.md ]; then
  cur=$(node scripts/rubric-score.js 2>/dev/null | grep -oE '[0-9]+/[0-9]+' | head -1 | cut -d/ -f1)
  last=$(grep -oE 'rubric=[0-9]+/' METRICS.md | tail -1 | grep -oE '[0-9]+' | head -1)
  if [ -n "$cur" ] && [ -n "$last" ] && [ "$cur" -lt "$last" ]; then
    fail="${fail}
- Rubric REGRESSED (${last} -> ${cur} MET) — a committed criterion was undone. Restore it before finishing."
  fi
fi

# 3b. A completed loop run that delivered ZERO improvements is a wasted cycle — do not let it slide.
if [ -f SELF-IMPROVE-LOG.md ]; then
  last_batch=$(grep -E 'batch complete: [0-9]+ (committed|done)' SELF-IMPROVE-LOG.md 2>/dev/null | tail -1)
  if printf '%s' "$last_batch" | grep -qE 'batch complete: 0 '; then
    fail="${fail}
- Last loop run committed ZERO useful improvements (wasted cycle). Investigate why (all rejected? blocked?) and report it, don't finish silently."
  fi
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
