# SETUP — autonomous + innovation run readiness

The single source of truth for "is the machine set up." Run phases: **requirements → design → build →
prototype → ship**, with a user checkpoint between each. Every item below is built + verified, or a named gap.

| # | Pillar | What it is | Status | Verified how |
|---|--------|-----------|--------|--------------|
| 1 | **Non-parking autonomy** | nested agents run without approval prompts | ✅ DONE | `.claude/settings.json` acceptEdits; nested `claude -p --permission-mode bypassPermissions` |
| 2 | **Phase gate for EVERY phase** | each phase has an invariant; can't advance until its checkpoint is approved | ✅ DONE | `scripts/phase.js` (get/set/approve/next/gate) + `.phase.json`; Stop hook calls `phase.js gate` — tested: missing artifact → exit 2 |
| 3 | **Rogue monitoring** | see + kill any stray loop/agent; can't start two | ✅ DONE | dashboard CIM panel (`progress-server.js`); `kill-agents.sh` (kill by cmdline); `loop-guard.sh` sourced by loops — tested: 2nd loop refused (exit 1) |
| 4 | **Improvement metric every run** | rubric score met/total, delta logged, regression blocked | ✅ DONE | `rubric-score.js` (9/28) + `record-metrics.js` → `METRICS.md`; Stop hook blocks a score regression — tested: 20→9 → exit 2 |
| 5 | **Checkpoints logged** | each checkpoint + user decision recorded | ✅ DONE | `CHECKPOINTS.md`; phase can't advance without `phase.js approve` |
| 6 | **Data + app integrity gates** | no-fabrication schema; app JS parses + wired | ✅ DONE | Stop hook runs `validate.js` + `app-check.js` — tested exit 2 on break |
| 7 | **Independent adversarial review** | a fresh-context critic judges before commit | ✅ DONE | `adversarial-reviewer` agent; ran on CP-0 (caught the fabricated-engine bug) |
| 8 | **Autonomous model routing** | loop picks Haiku/Sonnet/Opus by complexity | ✅ DONE | `OPERATING-MODEL.md` + `triage_model` in `self-improve-loop.sh` |
| 9 | **Live monitoring** | phase + rubric + agents on one screen | ✅ DONE | dashboard :7654 shows phase, rubric met/total, live agents, activity |
| 10 | **Rubric-driven build loop** | pick UNMET criterion → build → static review vs it → gate → reviewer flips MET → commit; NO browser per cycle | ⬜ NEXT | to build right after CP-0 approval (the 3-phase engine in SPEC.md) |

**The Stop hook (per-turn gate) now enforces, in order:** data integrity · app integrity · **phase gate** ·
**no rubric regression** · no wasted-cycle loop run · no new stubs — then reminds to self-rate + prove wow.
Nothing finishes a turn red.

**One gap left (#10):** the actual rubric-driven build loop. It's the first build after you approve CP-0 —
not setup, it's the engine that runs the build phase. Everything that *supervises* it is now in place.
