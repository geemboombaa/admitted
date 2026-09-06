# DELIVERABLES

## Per checkpoint (every batch)
1. **Working app** — `index.html` rebuilt from JSON, opens and renders, validate passes.
2. **Changelog** — what changed this batch, item by item (committed / reverted + why).
3. **Metrics** — before→after: schools verified, EST flags remaining, roster count, gaps logged.
4. **Live view** — I open the app locally so the user clicks through the changed area.
5. **Self-audit** — pass/fail of each iteration against RULES (validate, sourced, reviewed, scoped).
6. **Gaps** — anything that needs web data or a user decision, listed in `GAPS.md`.
7. **Self-improvement rating** — composite /10, reported every checkpoint, four axes:
   - **Data quality** — COMPUTED by `node scripts/checkpoint-report.js` (fully-clean share = verified AND no open gap). Objective, not opinion.
   - **Self-improvement of the loop** · **Goal progress** · **Autonomous execution** — my honest judgment with evidence.
   Overall = average of the four. Track the trend; each run should improve.

## Stage 1 final deliverable
- All local verification data merged; roster gaps satisfiable from local data closed.
- `GAPS.md` = the complete, honest list of what still needs web data or a user call — the input to the Stage-2 decision.
- Clean git history, one commit per accepted item, `SELF-IMPROVE-LOG.md` audit trail intact.

## Overall final product
Deployed `admitted` app on Vercel: accurate, fully-sourced, top-tier, with a documented self-improving build pipeline behind it.
