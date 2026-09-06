# OPERATING MODEL — how the self-improving loop runs

## Roles
- **Builder** — nested `claude -p`, fresh context, implements ONE backlog item. Web tools blocked (`--disallowedTools WebSearch WebFetch`).
- **Validator** — `scripts/validate.js`, objective structural/referential gate.
- **Reviewer** — a SECOND, independent nested `claude -p`, no memory of the build, judges the source diff cold (APPROVE/REJECT). Brief: `.claude/agents/adversarial-reviewer.md`.
- **Orchestrator (me)** — runs batches, does the checkpoint, presents results, decides next stage with the user.

## One iteration (autonomous, in `scripts/self-improve-loop.sh`)
```
pick next "- [ ]" backlog item
  -> Builder implements it (JSON only, no web)
  -> validate.js            (fail -> revert + log + next)
  -> build.js               (fail/empty -> revert + log + next)
  -> Reviewer on SOURCE diff (index1.html excluded)  (REJECT -> revert + log + next)
  -> SELF-SCORE recorded (validate/review/result)
  -> commit + mark item done   (never push unless --push)
```
Every gate failure => `git reset --hard` to the pre-iteration commit. Clean tree required to start.

## Self-score rubric (objective, pass/fail — no invented numbers)
Recorded per iteration in `SELF-IMPROVE-LOG.md`:
- validate.js PASS
- reviewer APPROVE
- no `index1.html` hand-edit (build.js is the only writer)
- change scoped to the one item
- local-data-only (no un-sourced web values)
Subjective "wow" is **not** scored here — the user judges it at the checkpoint.

## Batch + checkpoint
- `./scripts/self-improve-loop.sh --batch=N` runs N iterations then stops.
- Orchestrator then runs the **checkpoint**: metrics (before→after), self-audit vs GOAL/RULES/DELIVERABLES, open the app locally, present changelog + `GAPS.md` delta, and wait for user go/no-go.
- **Deploy only on explicit approval** at a checkpoint.

## Autonomy ramp
Start: small batch, checkpoint, no auto-deploy. As checkpoints keep passing clean, increase `--batch` and eventually allow deploy-on-approval in one step. User controls the ramp.

## Known-good facts (verified 2026-09-06 on this machine)
- `node scripts/validate.js` / `scripts/build.js` run and pass (101 school files).
- `claude -p` works here via stdin, and `--disallowedTools WebSearch WebFetch` is honored.
- Baseline commit: full JSON migration is committed (tree clean), so `git reset --hard` + `git clean -fd` on revert is safe.
