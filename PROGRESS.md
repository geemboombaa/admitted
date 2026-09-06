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
| A | B4 BS/MD rates, ua/osu/asu WUE fixes (4) | IN PROGRESS - A1 DONE 2026-09-06, A2-A4 NOT STARTED |
| B | merge verify-batch into 10 zero-VERD schools | NOT STARTED |
| GAPS | 5 no-local verifies + Auburn + 12 new schools | DEFERRED (needs web / user go) |

## Metrics baseline (2026-09-06)
- School files: 101 (validate PASSED)
- verifiedFacts populated: 82 / 101 · null: 19
- Local-fixable now: ~14 · needs-web (GAPS): 17

## Batch A detail
| # | Item | Status | Notes |
|---|---|---|---|
| A1 | PROGRATE: 4 real sourced BS/MD rates, rest null, each keeps src URL | DONE 2026-09-06 | Rates+notes were already correct from a prior session but carried NO src URL, while the card text promised "hover for source". Added `src` (from PENDING-RESEARCH B4) to njit 2.6% / mcg ~10% / cuny 10.4% (2021-dated) / umkc 7-11% (self-computed, denominator stated), and appended the URL into `note` so the existing tooltip actually shows it. Other 98 schools confirmed `progRateLegacy: null`. 16 unpublished programs left null - none invented. validate.js PASSED. |
| A2 | ua WUE: competitive/limited-participation, ~$18,252 as derived estimate | NOT STARTED | PENDING-RESEARCH B2 |
| A3 | osu WUE: competitive scholarship (~30% offered), COA 38,568/65,013 | NOT STARTED | PENDING-RESEARCH B2 |
| A4 | asu: WUE ends Fall-2026+, Commitment Scholarship $5,500-7,500, COA $63,394 | NOT STARTED | PENDING-RESEARCH B2 |

## Open decision raised this run (logged to GAPS.md G4)
brown/drex/hof carry `programVerified.admitRatePct` (2.19/2.7/0.6%) that conflicts with PENDING-RESEARCH B4,
which says Brown PLME publishes nothing computable. All three DO have a src URL, so they were left in place
rather than nulled - different field from PROGRATE, and deleting sourced data is outside this backlog item.
The Brown source is a student newspaper, not an official page. Needs a user call.

## Next step
Run **A2** (University of Arizona WUE fix, PENDING-RESEARCH B2) - still Stage 1, local-data-only, Batch A.
