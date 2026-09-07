# RUBRIC — binary acceptance criteria

Each = testable state. Loop flips UNMET→MET one at a time; verified by adversarial review. MET never re-worked.

## Data integrity (hard rules)
1. [MET] Every shipped number is `verified` (with source) or flagged `EST` — zero invented.
2. [MET] Names "Hrithik" / "Prans" appear 0 times in `index.html` (deployed copy).
3. [MET] `app-data.js` regenerates from `data/schools/*.json` (101 schools).

## Engine
4. [MET] `chance()` returns probability + band using frozen constants.
5. [MET] Band colors match spec exactly (Safety/Likely/Target/Reach).
6. [MET] Chance recomputes live when GPA/SAT/test-optional change.

## App (Living Map) — core UX
7. [MET] Onboarding → Map → Deck → Detail → Shortlist all reachable, no dead ends.
8. [UNMET] Every bubble reliably tappable in dense states (hit-radius + tap-to-zoom).
9. [UNMET] Deck swipe works finger AND mouse, no stuck card.
10. [UNMET] GPA/SAT dials editable on Map screen itself; persists instantly.
11. [UNMET] Map filters: type / region / cost ceiling / BS-MD-only; band counts update.
12. [MET] Zero console errors on load + on stat change.

## App — innovation layer
13. [UNMET] "What flips it" coach: real GPA/SAT delta to next band, honest cap case.
14. [UNMET] Compare mode: 2–3 schools side-by-side + plain-English verdict.
15. [UNMET] BS/MD focused cluster with program names.
16. [UNMET] Time-machine scrubber animates bubbles between bands.
17. [UNMET] True-cost view respects BS/MD program length (not flat ×4).

## Ops / anti-rogue (this checkpoint's real add)
18. [MET] Dashboard :7654 shows live agents via CIM (wmic-free), never "unavailable" when a check is possible.
19. [MET] Dashboard shows "0 agents — clean" when nothing running; lists PID+kind when something is.
20. [MET] `kill-agents.sh` kills loops/agents by command line (not TaskStop).
21. [MET] Stop hook blocks turn exit until validate.js + app-check.js pass.
22. [MET] Adversarial Opus reviewer must APPROVE before any commit; revert-on-fail.
23. [MET] One loop at a time; each unit committed immediately.

## Web face
24. [MET] `index.html` is the canonical served/built file, privacy-clean, deployed.
25. [MET] Web + app read the same engine + data (no divergence).

**CP-1 status:** 15/25 MET. Remaining 10 (items 8–11, 13–17) = the app build backlog → next stage, one per loop iteration.
