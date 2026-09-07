# RUBRIC — admitted app acceptance criteria (CP-0)

The convergence target. Each criterion is **binary + testable**. The build loop targets one UNMET
criterion per iteration; the reviewer flips it to MET only if genuinely satisfied; MET criteria are never
re-worked; a criterion that fails twice is `[~]` blocked + skipped; the loop STOPS when all MET or no
unmet criterion is closeable. **Progress = MET / total.**

Legend: `[ ]` unmet · `[x]` met · `[~]` blocked (2 fails, reason noted). States are provisional until the
CP-0 milestone re-verifies them live; the loop must confirm, not assume.

## A. Data integrity + trust layer (the premise)
1. [x] Every shipped number is verified-with-source or flagged EST — zero invented (RULES.md #1).
2. [ ] Trust is **visible**: each chance/cost/rate on screen shows verified-vs-EST inline, source on tap.
3. [x] Names "Hrithik"/"Prans" never in shipped copy.

## B. Engine (decision brain)
4. [x] `chance(gpa,sat,testOptional)` → probability + band, frozen constants, k flagged placeholder.
5. [x] Bands + colors exact: Safety `#00ff88` / Likely `#00d4ff` / Target `#f5a623` / Reach `#a855f7`.
6. [x] Recomputes live on every GPA/SAT/test-optional change, zero console errors.

## C. Decision core (the actual product — mostly UNMET, this is the work)
7. [ ] **Apply-list builder**: user assembles a shortlist; app shows the list's balance
   (Safety/Likely/Target/Reach counts) + flags an unbalanced list (all-reach, no-safety).
8. [ ] **Chance clarity**: for any school, plain-English why (your stats vs its bands), not just a number.
9. [ ] **"What flips it" coach**: exact GPA and/or SAT delta to move a school to the next band (real math
   off `chance()`), with before/after, and an honest "even perfect can't beat this admit rate" case.
10. [ ] **Compare mode**: 2–3 schools side-by-side (chance, true cost, grad rate, program, verified) + a
    plain-English verdict.
11. [ ] **True cost**: 4-yr net (COA−merit), EST-labeled, per-school — and program-length-aware for BS/MD
    (accelerated years, not flat ×4).
12. [ ] **Deadlines + portfolio**: shortlist deadline timeline (real `dlDate`), soonest-first, upcoming
    view; portfolio-balance readout.

## D. BS/MD wedge (the moat)
13. [ ] BS/MD focused view: the ~33 program schools as their own cluster/list with program names.
14. [ ] Accelerated-vs-traditional distinction shown per program; program-length drives the cost view.
15. [ ] BS/MD program-specific honesty: where program admit math isn't publishable, say so (no invented
    program rates) — verified against RULES.md #1.

## E. Surfaces (kept, not heroes)
16. [x] Onboarding → Map → Deck → Detail → Shortlist all reachable, no dead ends.
17. [ ] Every bubble reliably tappable in dense states (hit-radius + tap-to-zoom-into-band).
18. [ ] Deck swipe works finger AND mouse, spring feedback, never a stuck card.
19. [ ] Stat dials (GPA/SAT/test-optional) editable on the Map screen itself; persists instantly.
20. [ ] Map filters: type / region / cost ceiling / BS-MD-only; band counts update live.

## F. Efficiency + UX quality
21. [ ] Single self-contained `app.html` + `app-data.js`, vanilla JS, no framework/CDN.
22. [ ] Every empty/error/loading state designed (no raw blanks, no console errors anywhere).
23. [ ] Passes a "would a daily iPhone user call this top-tier?" bar at the CP milestone (user-judged).

## G. Ops / guardrails (the machinery, must stay green)
24. [x] Stop hook blocks turn exit until validate.js + app-check.js pass (restored + verified).
25. [x] Dashboard :7654 shows live agents (CIM) + "0 agents — clean" when idle; rogue-visible.
26. [x] `kill-agents.sh` kills loops/agents by command line; one loop at a time; commit each unit at once.
27. [ ] Build loop runs the 3-phase model (design→cheap static iterate→live prototype once), NOT
    browser-per-cycle QA. (Loop rewrite is itself a build item.)

**CP-0 baseline:** 11/27 MET. The 16 UNMET = the real roadmap, weighted to the **decision core (C)** and
**BS/MD wedge (D)** — the product, not the polish. This weighting IS the challenge to the original vision.
