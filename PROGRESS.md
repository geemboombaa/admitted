# PROGRESS — admitted self-improving loop

Single source of truth for status. Updated at the end of every run.

**Current stage:** Stage 1 — Dataset complete + verified (LOCAL DATA ONLY).
**Autonomy level:** batch + checkpoint, no auto-deploy (ramp up as checkpoints deliver).

## Setup steps
| # | Step | Status | Notes |
|---|---|---|---|
| S1 | Commit migration baseline (clean tree, safe reverts) | DONE 2026-09-06 | commit 4974915 |
| S2 | Define GOAL / RULES / DELIVERABLES / OPERATING-MODEL | DONE 2026-09-06 | 4 docs written |
| S3 | Fix loop Bug 1 (review step: argv→stdin, exclude generated HTML) | DONE 2026-09-06 | in self-improve-loop.sh |
| S4 | Fix loop Bug 2 (log survives revert via gitignore) | DONE 2026-09-06 | SELF-IMPROVE-LOG.md gitignored |
| S5 | Enforce local-only (--disallowedTools WebSearch WebFetch + prompt) | DONE 2026-09-06 | verified block honored |
| S6 | Add self-score record per iteration | DONE 2026-09-06 | score() in loop -> log |
| S7 | Reframe backlog to local items; move web work to GAPS.md | DONE 2026-09-06 | 14 local items, 17 gaps |
| S8 | Run first checkpoint batch + open app for user | NOT STARTED | Batch A (4 items) next |

## Stage 1 backlog
| Batch | Items | Status |
|---|---|---|
| A | B4 BS/MD rates, ua/osu/asu WUE fixes (4) | NOT STARTED |
| B | merge verify-batch into 10 zero-VERD schools | NOT STARTED |
| GAPS | 5 no-local verifies + Auburn + 12 new schools | DEFERRED (needs web / user go) |

## Metrics baseline (2026-09-06)
- School files: 101 (validate PASSED)
- verifiedFacts populated: 82 / 101 · null: 19
- Local-fixable now: ~14 · needs-web (GAPS): 17

## Next step
Run **Batch A** (`./scripts/self-improve-loop.sh --batch=4`) autonomously, then checkpoint:
metrics + open the app locally for click-through + self-audit + wait for go.
