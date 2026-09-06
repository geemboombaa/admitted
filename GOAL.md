# GOAL — admitted

## North star
Deliver the single best decision tool for **one premed / BS-MD applicant (California, 12th grade)** to choose where to apply: accurate chances, honest costs, real BS/MD pathways, top-tier feel. The tool is trustworthy because **every number is either verified-with-a-source or plainly flagged as an estimate — never invented.**

## Staged objective (locked with user 2026-09-06)
Run the self-improving loop in three stages, checkpoint between each:

| Stage | Objective | Data policy |
|---|---|---|
| **1. Dataset complete + verified** | Fill roster gaps, merge already-researched values into `data/schools/*.json`, drive down unflagged/EST fields, every published number carries a `src`. | **LOCAL DATA ONLY** — `data/verify-batch1-6.json`, `data/PENDING-RESEARCH-2026-09-05.md`, existing roster. **No web.** Missing-from-local → log to `GAPS.md`, do not fetch. |
| **2. Decision engine** | Make admit-chance / fit / cost model more accurate + defensible. | TBD at Stage-2 checkpoint; may require approved web pulls. |
| **3. UX + wow** | Top-tier visuals, interactions, views. | No data change. |

We are in **Stage 1**.

## Definition of "done" for Stage 1
- Every school file passes `validate.js`.
- Every school that has verification data in `verify-batch*` has it merged (`verifiedFacts` populated, per-field `src`).
- Zero fabricated numbers. Unverifiable-from-local values are EST-flagged AND listed in `GAPS.md`.
- Roster gaps from `PENDING-RESEARCH` Section B that can be satisfied from local data are added.
- Gaps that genuinely need web data are enumerated in `GAPS.md` for user greenlight.

## What "wow" means here
Judged by the **user at each checkpoint** by clicking the live app — not by any self-assigned score. My job at each checkpoint: open the app, show a real before→after change, and prove the loop is self-correcting and result-driven.
