# RUBRIC — admitted app acceptance criteria (CP-0)

The convergence target. Each criterion is **binary + testable**. The build loop targets one UNMET
criterion per iteration; the reviewer flips it to MET only if genuinely satisfied; MET criteria are never
re-worked; a criterion that fails twice is `[~]` blocked + skipped; the loop STOPS when all MET or no
unmet criterion is closeable. **Progress = MET / total.**

Legend: `[ ]` unmet · `[x]` met · `[~]` blocked (2 fails, reason noted). States are provisional until the
CP-0 milestone re-verifies them live; the loop must confirm, not assume.

## A. Data integrity + trust layer (the premise)
0. [ ] **Shipped `chance()` math matches its documented description** (SPEC/PRODUCT-VISION). Currently a
   MISMATCH: code is linear `admit*(0.35+1.3*pos)`; docs claim logistic/`k`. Fix docs→code. This is #0
   because a trust-first product cannot mis-describe its trust-critical number.
1. [x] Every shipped number is verified-with-source or flagged EST — zero invented (RULES.md #1).
2. [ ] Trust is **visible**: each chance/cost/rate on screen shows verified-vs-EST inline, source on tap.
3. [x] Names "Hrithik"/"Prans" never in shipped copy.

## B. Engine (decision brain)
4. [x] `chance(gpa,sat,testOptional)` → probability + band, frozen constants, k flagged placeholder.
5. [x] Bands + colors exact: Safety `#00ff88` / Likely `#00d4ff` / Target `#f5a623` / Reach `#a855f7`.
6. [x] Recomputes live on every GPA/SAT/test-optional change, zero console errors.

## C. Decision core (the actual product — mostly UNMET, this is the work)
6a. [ ] **First 90 seconds**: from cold start, profile captured → one real school chanced with verified/EST
    visible, in ≤90s; empty/no-profile state routes there — never a blank or an invented "YOU:" marker.
    (Weighted above any single feature — if this fails nothing downstream is seen.)
7. [ ] **Apply-list builder**: user assembles a shortlist; app shows the list's balance
   (Safety/Likely/Target/Reach counts) + flags an unbalanced list (all-reach, no-safety).
8. [ ] **Chance clarity**: for any school, shows the user's GPA/SAT position vs its published 25–75 band +
   the resulting band, all fields populated, zero placeholder text (testable = fields present, not "prose").
9. [ ] **"What flips it" coach**: exact GPA and/or SAT delta to next band (real math off `chance()`), with
   before/after. Testable ceiling: the coach's "even perfect can't beat this" claim EQUALS the engine's
   actual max output for that school (`admit*1.71` clamped 0.96) — no false unbeatable/beatable claims.
10. [ ] **Compare mode**: 2–3 schools side-by-side (chance, true cost, grad rate, program, verified) + a
    plain-English verdict.
11. [~] **True cost, BS/MD program-length-aware** — BLOCKED ON DATA: the 33 `program` objects hold only
    `{name}`; no program-length field exists and Stage 1 forbids web pulls. Ship the general 4-yr net
    (COA−merit, EST-labeled) now (that part is codeable → tracked as 11b); accelerated-years cost waits.
11b. [ ] **True cost (general)**: 4-yr net (COA−merit), EST-labeled, per-school.
12. [ ] **Deadlines + portfolio**: shortlist deadline timeline (real `dlDate`), soonest-first, upcoming
    view; portfolio-balance readout.

## D. BS/MD wedge (the moat)
13. [ ] BS/MD focused view: the ~33 program schools as their own cluster/list with program names.
14. [~] Accelerated-vs-traditional distinction per program — BLOCKED ON DATA: no accel flag / program-
    length field in app-data.js; Stage 1 forbids fetching. Re-open when data lands.
15. [ ] BS/MD program-specific honesty: where program admit math isn't publishable, say so (no invented
    program rates) — verified against RULES.md #1.

## E. Surfaces (kept, not heroes)
16. [x] Onboarding → Map → Deck → Detail → Shortlist all reachable, no dead ends.
17. [ ] Bubble tappability at N=101: every bubble's hit target ≥44×44pt (HIG min); tap-to-zoom-into-band
    resolves overlap. (Interaction criterion → live/headless check when closed.)
18. [ ] Deck swipe works finger AND mouse, spring feedback, never a stuck card.
19. [ ] Stat dials (GPA/SAT/test-optional) editable on the Map screen itself; persists instantly.
20. [ ] Map filters: type / region / cost ceiling / BS-MD-only; band counts update live.

## F. Efficiency + UX quality
21. [ ] Single self-contained `app.html` + `app-data.js`, vanilla JS, no framework/CDN.
22. [ ] Every empty/error/loading state designed (no raw blanks, no console errors anywhere).
22a. [ ] **Basic-usability floor** (gates the decision-core milestone): legible, every control tappable
    ≥44×44pt, visible response to every input. Not "top-tier" — just not abandonable.

**NOT a counted criterion — a user-judged checkpoint:** "would a daily iPhone user call this top-tier?"
This is judged by the user at a milestone, not flipped by the loop. (Was #23; removed from the count.)

## G. Ops / guardrails (the machinery, must stay green)
24. [x] Stop hook blocks turn exit until validate.js + app-check.js pass (restored + verified).
25. [x] Dashboard :7654 shows live agents (CIM) + "0 agents — clean" when idle; rogue-visible.
26. [x] `kill-agents.sh` kills loops/agents by command line; one loop at a time; commit each unit at once.
27. [ ] Build loop runs the 3-phase model (design→cheap static iterate→live prototype once), NOT
    browser-per-cycle QA. (Loop rewrite is itself a build item.)

**CP-0 baseline (post red-team):** 9/28 MET · 2 `[~]` blocked-on-data (#11, #14, need fields not in
app-data.js / Stage 1 forbids web) · 1 removed to a user checkpoint (old #23). The 19 UNMET = the real
roadmap, weighted to the **decision core (C)** and **BS/MD wedge (D)**, with **#0 (engine-honesty)** and
**#6a (first-90-seconds)** as the first two the loop must close — trust + retention before features.
