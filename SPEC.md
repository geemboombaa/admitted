# SPEC — admitted (CP-1 locked target)

One verified core → two faces. No fabricated data, ever.

## Core (shared engine + data)
- **Data:** `data/schools/*.json` → `app-data.js` (101 real schools). Each number is `verified` (with source) or flagged `EST`. Never invented. Names Hrithik/Prans never in shipped copy.
- **Engine:** `chance(gpa,sat,testOptional)` → probability + band. Bands: Safety ≥.75 / Likely ≥.55 / Target ≥.30 / Reach else. Colors fixed: Safety `#00ff88`, Likely `#00d4ff`, Target `#f5a623`, Reach `#a855f7`. Constants frozen (steepness `k` = flagged placeholder, not derivable from public data).

## Face 1 — Web dashboard (`index.html`, deployed)
- Public, privacy-clean, PULSE theme. Chance/fit/cost per school from the one engine.

## Face 2 — iOS-style app (`app.html`, Living Map)
- Physics bubble cluster of 101 schools that re-simulates as user changes GPA/SAT.
- Onboarding → Map → Deck (swipe) → Detail → Shortlist. Live recompute on every stat change.
- Innovation layer: "what flips it" coach, compare mode, BS/MD cluster, time-machine scrubber, true-cost view.

## Ops (the machinery)
- **One loop at a time.** Never trust TaskStop to kill bash — kill by command line (`scripts/kill-agents.sh`).
- **Dashboard + health:** `scripts/progress-server.js` @ :7654 — live agent panel (CIM-based, wmic-free), rogue check, backlog progress, stuck-detector. Auto-refresh 60s.
- **Gates:** `validate.js` + `app-check.js` must pass; Stop hook blocks turn exit until green; adversarial Opus reviewer must APPROVE before any commit; revert-on-fail.
- Commit each unit immediately (nothing uncommitted that a clean/reset can wipe). No push/deploy without explicit approval.

## Delta vs original proposal
Only one real addition: **live agents + health dashboard** (this file's Ops section) — so nothing runs rogue unseen. Rest is the same locked goal, now written down.
