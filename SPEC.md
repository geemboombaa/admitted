# SPEC — admitted (CP-0: autonomous product review)

My review/challenge/innovation on the goal + PRODUCT-VISION — not a transcription. This is the design
target the build loop converges to (criteria in RUBRIC.md). Data rules from RULES.md are inviolable.

## The reframe (main challenge to the vision)
PRODUCT-VISION makes the **Living Map (physics bubbles)** the hero. That's backwards. The map is a
*delightful view*, not the product. For an anxious premed / BS-MD applicant the real job-to-be-done is:

> **Turn 100+ schools into a confident, affordable, deadline-aware apply-list I can trust — and show me
> exactly how to move my own odds.**

So the product's spine is a **decision engine**; map / swipe / etc. are surfaces onto it. Leading with
"cool bubbles" is how I shipped a gimmick with no decision value. Decision value first, delight second.

## The wedge (my proposed differentiator)
**BS/MD + premed** is the sharp edge, not general college search. ~33 of the 101 schools are accelerated
medical programs — the highest-stakes, most-confusing, worst-served niche (accelerated vs traditional,
program-specific admit math, true cost over 6–8 yrs not 4). Own this and the product has a reason to exist
against Naviance/BigFuture. General search is table stakes; the BS/MD decision layer is the moat.

## What I'd change (challenge / reorder / add / cut)
- **Elevate to the core (was buried):** trustworthy chance + true-cost + "what flips it" coach (real math
  off `chance()`), deadline/portfolio balance, compare. These ARE the product.
- **Add:** a visible **trust layer** (every number shows verified-with-source vs EST inline) — trust is
  the entire premise; it can't be implicit. And a **BS/MD focused view** (program names, accelerated-vs-
  traditional, program-length-aware cost).
- **Keep as surfaces (not heroes):** the map view and the swipe deck — good for exploration and triage.
- **Cut / demote:** physics-bubble spectacle as the front door; sound/haptic gimmicks until the decision
  core clears the bar.
- **Reorder the stages:** engine trust + decision UX **before** delight polish. Delight on top of a
  decision that doesn't compute is the mistake I already made.

## The efficient loop (how it should run — no live browser per cycle)
```
A. DESIGN   (once)   this SPEC + RUBRIC = the convergence target        <-- CP-0
B. ITERATE  (cheap)  build one UNMET criterion -> static code+design review AGAINST the rubric
                     (NO browser) -> gate (validate + app-check) -> independent reviewer flips it
                     MET only if genuinely satisfied -> commit; revert on fail. Repeat.
C. PROTOTYPE (once)  at convergence, open in Chrome, adversarial live-test, fix blockers, show user
```
Expensive live verification happens **once at convergence** and at checkpoints — not every iteration.
Iteration reviews are fast static critiques. Cheaper, faster, still rigorous.

## Two-way guardrail (built into the rubric)
- **Always improving:** every iteration must flip exactly one UNMET criterion → MET, verified by the
  reviewer. Progress = MET / total, monotonic.
- **Never wasting:** a MET criterion is never re-touched; a criterion that fails to close in 2 tries is
  marked `[~]` blocked and skipped; the loop STOPS when all MET or no unmet criterion is closeable.

## Checkpoints
- **CP-0** — this spec + rubric, red-teamed by an independent critic → **user approves/adjusts once.**
- **Per-iteration** — automated, no user (build → rubric-review → gate → commit/revert).
- **Milestones** — at rubric thresholds (decision-core MET; then wedge MET; then delight MET) I stop,
  prototype live, user judges, rubric adjusted.
- **Final** — rubric full → prototype → user accepts.

## Scope for THIS product cycle
The **app** (`app.html`) as the decision engine + BS/MD wedge, wired to the existing verified core
(`app-data.js`, 101 schools). Web face + iOS native port are separate downstream tracks. Engine
chance-math constants stay frozen (steepness `k` = flagged placeholder; not derivable from public data).
