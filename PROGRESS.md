# PROGRESS — admitted self-improving loop

Single source of truth for status. Updated at the end of every run.

**Scope (expanded 2026-09-06):** one verified CORE (data + engine) → two surfaces: WEB (index1.html, live) + iOS app (Expo/RN). See GOAL.md + PRODUCT-VISION.md. 4 stages: 1 data → 2 engine → 3 web UX → 4 iOS.
**Current stage:** Stage 1 — Dataset complete + verified (LOCAL DATA ONLY). Serves both surfaces.
**Autonomy level:** batch + checkpoint, no auto-deploy. Ramped to option 4 (A4 + full Batch B, one checkpoint).

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
| S8 | Run checkpoint batches + open app for user | DONE 2026-09-06 | Checkpoints 1 & 2 delivered |
| S9 | Merge iOS product vision (1 core, 2 surfaces, 4 stages) | DONE 2026-09-06 | GOAL.md + PRODUCT-VISION.md |
| S10 | Dynamic model routing (Haiku triage→builder, reject-escalate, Opus reviewer) | DONE 2026-09-06 | verified: merge→Sonnet, conflict/engine→Opus |
| S11 | Live progress bar in loop | DONE 2026-09-06 | bar_str in self-improve-loop.sh |

## Stage 1 backlog — COMPLETE (local-only)
| Batch | Items | Status |
|---|---|---|
| A | B4 BS/MD rates, ua/osu/asu WUE fixes (4) | DONE 2026-09-06 |
| B | merge verify-batch into 10 zero-VERD schools | DONE 2026-09-06 (howard,gwu,usf,njit,rowan,temple,fau,mcg,gram,nyit) |
| GAPS | 5 no-local verifies + Auburn + 12 new schools | DEFERRED (needs web / user go) — see GAPS.md |

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

## Checkpoint 2 result (2026-09-06) — STAGE 1 LOCAL WORK COMPLETE
- Batch A (checkpoint 1): 4 commits, 1 reject-then-fixed (osu COA contradiction caught by reviewer).
- Option-4 batch: **11/11 committed, all APPROVED first try, zero rejects.** A4 + all of Batch B.
- **verifiedFacts 82 → 92 / 101.** Backlog empty (0 items left).
- Remaining 9 null = the web-needed GAPS: auburn, cuny, mich, syracuse, uga, unc, usc_sc, uta, wayne.
- brown/drex/hof: user decided KEEP AS-IS (GAPS G4, informational).

## Metrics after Stage 1 (2026-09-06)
- verifiedFacts populated: 92 / 101 · null: 9 (all in GAPS, need web)
- validate PASSED · 101 files · nothing deployed

## Deploy (2026-09-06)
**LIVE:** https://admitted-six.vercel.app — pushed (efb0a72/81c4f67). index.html is now the canonical
served/built file (was index1.html; Vercel serves index.html). Privacy verified: 0 real names. First real
deploy this project — site was stuck on v14, now ships the verified dataset.

## Stage 2 decisions (locked 2026-09-06)
- **Canonical engine = web** (`index.html`): only one with 101 schools, real `fit()`, real year-by-year `trueCost()`. iOS is a 4-school concept (no fit, flat×4 cost).
- **Band thresholds:** keep web **75/55/30** now, flagged "counseling-standard, not outcome-fitted"; revisit if outcome data appears.
- **Chance formula constants (steepness k, position shape):** user chose "derive from data first." Research verdict: **NOT feasible from public data** — Scorecard/IPEDS record only *enrolled* students; no public source has admit/deny by score band. Only user Naviance or biased Reddit self-reports do. → **k stays a flagged placeholder; no engine chance-math change.** Engine unification (porting log-odds form) parked until real outcome data exists.
- **Actionable Stage-2 work = the sourcing pass** (web ON, official sources): close the 9 zero-VERD schools + add missing src URLs. Raises the computed data-quality score. Loop `--web` mode built.

## Stage 2 progress (2026-09-06)
- **Loop `--web` mode proven working.** Michigan + UNC sourced from official CDS/cost pages, verifiedFacts + per-field src; the Opus reviewer FETCHED the official PDFs and verified each number (even REJECTED a first UNC attempt over a discrepancy, forced a corrected retry). Real adversarial web-verification.
- **Data-quality 7.6 → 7.8** (fully-clean 77→79, verifiedFacts 92→94).
- **Live dashboard:** `node scripts/progress-server.js` → http://localhost:7654 (auto-refresh visual bar).
- Stage-2 bugs found+fixed (all failed safe, no bad data committed): reviewer stuck on Stage-1 rule; builder scratch files; verdict parsed from wrong line. Loop now stable.
- 6 loop commits of churn from my repeated `git reset --hard` wiping edits — resolved via rebase; lesson: commit before reset.

## Stage / Next step
**Stage 2 (sourcing), in progress: 2/9 Batch-C schools done (mich, unc).** Remaining Batch C: uga, auburn, syracuse, usc_sc, wayne, uta(blocked?), cuny(blocked?). Then Batch D (10 src-fills). Loop is stable; safe to run larger batches, watched live on the dashboard. Loop capabilities: dynamic model routing + progress bar + `--web` scoped sourcing + web-verifying reviewer + scratch cleanup + pre-flight.
