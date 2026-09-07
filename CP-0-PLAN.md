# CP-0 WORK — definition (to approve before running)

CP-0 is the requirements/design stage run as **genuine autonomous innovation**, not transcription and not
feature-QA. It is the real test of the loop: if the machinery works, this produces *many* concrete,
defensible changes to the vision — reviewed, gated, and stopped cleanly. If it's still "shitting around,"
the output will be thin and you'll see it at the checkpoint.

## Goal
Produce the locked design target — a revised **SPEC.md** (the product, reframed + every accepted change)
and **RUBRIC.md** (binary convergence criteria) — plus a visible **CHANGES** list proving what was
challenged/added/cut/reordered vs your original brain-dump.

## Inputs (what it reads)
GOAL.md, PRODUCT-VISION.md, RULES.md, the live `app.html` + `app-data.js` (the current product, to
critique), and public knowledge of the competition (Naviance, BigFuture, Cialfo, SCOIR).

## Method (how it runs — diverse lenses, not one opinion)
1. **Fan out 6 independent product-critic agents**, each a distinct lens, each returning *concrete proposed
   changes* (new requirements, reprioritizations, cuts, UX/workflow rethinks) with rationale — NOT validation:
   - First-90-seconds / onboarding & retention
   - Job-to-be-done / workflow (the anxious applicant's real path)
   - BS/MD domain expert (what a premed advisor knows that the app misses)
   - Competitor / differentiation (what the incumbents do; where we beat them)
   - Information architecture (what to cut, merge, reprioritize)
   - Trust / data-honesty (where the app over- or under-claims)
2. **Dedupe + synthesize** all proposals into a revised SPEC (reframe + accepted changes, each tagged with
   which lens proposed it) and a RUBRIC (binary, weighted to decision-core + wedge).
3. **Adversarial critic** red-teams the synthesized SPEC+RUBRIC (the same kind of pass that already caught
   the fabricated-engine bug). Fold, commit each artifact immediately.
4. Record rubric baseline to METRICS; update CHECKPOINTS.

## Output (what you get at the checkpoint)
- Revised **SPEC.md** + **RUBRIC.md**.
- A **CHANGES** list: every add / cut / reprioritization / new requirement, sourced to the lens that raised
  it — the innovation, made visible (the thing that was missing before).
- The plain "why this beats Naviance/BigFuture" argument.

## Gates (checks & balances, enforced by the setup)
- Stop-gate green (phase + no-regression + no-stubs). Every artifact committed immediately. Zero rogue after
  (kill-agents verified). The adversarial critic must APPROVE the final SPEC+RUBRIC.

## Two-way guardrail for CP-0 itself
- **Must improve:** CP-0 fails its own bar if it yields fewer than a handful of *distinct, accepted* changes
  surviving the critic (that would be the thin-3 failure again). Measure = count of accepted proposals.
- **Must not waste:** dedupe kills redundant proposals; the critic kills weak ones; a round that adds nothing
  new = converged = stop.

## Exit
Present at the CP-0 checkpoint → you approve or adjust → phase advances `requirements → design → build`.
Nothing builds until you approve.

## Cost / control
6 critic agents + 1 synthesizer + 1 adversarial critic ≈ 8 agent calls, one attended run, all tracked on the
dashboard, hard-killable, runtime-ceiling supervised. No unattended multi-hour loop.
