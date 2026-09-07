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
1. [ ] Every shipped number is verified-with-source or flagged EST — zero invented (RULES.md #1).
   **REOPENED (CP-0 bug):** `make-app-data.js` emits `general.*` (rough) not `verifiedFacts.*` (verified) —
   SDSU ships 39%/$34k under a "verified" badge; the verified 37.4%/$37,324 is discarded. Fix: emit the
   verified value per field + emit `vf` (which fields are verified). Also retire the whole-school `verified`
   boolean. Local-only.
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
11. [ ] **True cost, BS/MD program-length-aware** — UN-BLOCKED (CP-0): the data EXISTS locally
    (`accel.ugYrs`, `affiliatedMedCost`, `affiliatedMedName` for 15 accel schools); `make-app-data.js`
    discarded it. Build `undergrad-net + affiliatedMedCost×med-years`, framed "~7yr cost to MD", EST-badged,
    for the 15 accel schools now. The ~18 non-accel program schools still lack a length field (real gap).
11b. [ ] **True cost (general)**: 4-yr net (COA−merit), EST-labeled, per-school.
12. [ ] **Deadlines + portfolio**: shortlist deadline timeline (real `dlDate`), soonest-first, upcoming
    view; portfolio-balance readout.

## D. BS/MD wedge (the moat)
13. [ ] BS/MD focused view: the ~33 program schools as their own cluster/list with program names.
14. [ ] Accelerated-vs-traditional distinction per program — UN-BLOCKED (CP-0): `accel.ugYrs` +
    `program.type`/`req` exist in the JSON (dropped by the generator). Pass them through + show the badge.
15. [ ] BS/MD program-specific honesty: where program admit math isn't publishable, say so (no invented
    program rates) — verified against RULES.md #1.

## E. Surfaces (kept, not heroes)
16. [x] Onboarding → Map → Deck → Detail → Shortlist all reachable, no dead ends.
17. [ ] DEMOTED (CP-0, per red-team) — Map is moved OFF the front door but KEPT reachable; do NOT delete the
    code (deleting to shrink the denominator is metric-gaming). Stop iterating on bubble-tap polish.
18. [ ] DEMOTED (CP-0, per red-team) — Deck moved off the front door, KEPT reachable; do NOT delete. Save/skip
    also available on the List + detail sheet. Stop iterating on swipe polish.
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

## H. CP-0 innovation additions (6-lens pass, 2026-09-07 — see CHANGES.md)
H1. [ ] Generator emits the VERIFIED value per field + `vf`; retire whole-school boolean (fixes BUG A).
    Tested: value shown for a verified field == its `verifiedFacts` value, per-school.
H2. [ ] BS/MD schools show PROGRAM odds, not undergrad odds — two labeled gates (undergrad admit vs
    program/med-seat), program rate from `programVerified.admitRatePct`, honest "not publishable" otherwise.
H3. [ ] Program-eligibility gate: user GPA/SAT vs `program.bar` → Below / Meets / Not-published.
H4. [ ] Guarantee-type badge — **DATA-STRUCTURING FIRST**: add a structured `program.guaranteeType` enum
    (reviewed data edit); NEVER derive the verdict from `program.type` prose at runtime (RULES #1).
H5. [ ] MCAT status + residency gate — **DATA-STRUCTURING FIRST**: add structured `mcatReq`/`residReq` fields
    (reviewed); NEVER parse prose into an eligibility verdict at runtime.
H6. [ ] Chance shown as band + range, never a bare single % (linear-model honesty). Range = the band's own
    interval (e.g. Target = 30–55%), labeled a heuristic — NOT an invented ± confidence interval.
H7. [ ] Per-field verified/EST inline + data vintage (`cds7.y`) + real source-on-tap (`cds7.src`).
H8. [ ] Subjective scores (premed/research/bio/social) marked "our read"; disclose they drive the sort.
H9. [ ] Two-track portfolio balance: BS/MD (lottery) vs traditional-premed (safety); "all-reach" flag.
H10. [ ] Application-status tracker per shortlist school: Researching → Essays → Ready → Submitted.
H11. [ ] IA = List (home, dials+filters) · BS/MD cluster · My List (decision) + Compare as the primary spine;
    Map/Deck demoted off the front door but kept reachable (not deleted).
H12. [ ] First read = one named BS/MD school chanced (achievable band — marquee BS/MD are Reach, so pick the
    best-odds program for this profile), not the Map; priorities deferred; partial onboarding persisted.
H13. [ ] **Validator gate (the safeguard all lenses missed):** `validate.js` FAILS if the app ships
    `general.X` for any field where `X ∈ vf` (shown value ≠ `verifiedFacts.X`). AND `chance()` reads the
    VERIFIED admit rate, not `general.admit`. This makes the BUG-A fix STAY true + not leave a stale duplicate.

## Build order (reprioritized wedge-first — CP-0)
#0 engine-honesty → **1 + H1** (verified values, the trust floor) → #6a/H12 (first-90s) → #2/H7 (trust visible)
→ #13/H2/H3 (BS/MD cluster + program odds/gate) → #10 (compare) → H9/H10 (list + workflow) → H11 (IA cut) →
then remaining surfaces. Stop iterating on map/deck polish (cut).

**CP-0 baseline:** _(recomputed below after this edit)_ — decision-core + BS/MD wedge now dominate the target;
two verified bugs (BUG A false-verified data, BUG B wedge-data-discarded) lead the queue.
