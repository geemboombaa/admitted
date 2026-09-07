# admitted — hard rules (auto-loaded by every agent, including nested `claude -p`)

You are working on **admitted**: a trustworthy college-decision app. One verified core (data +
chance/cost engine) → two faces (web `index.html`, app `app.html`). Full intent in SPEC.md / RUBRIC.md /
GOAL.md / RULES.md. These rules are non-negotiable:

## Never fabricate data
- Every published number is **verified-with-a-source** or explicitly flagged **EST**. Nothing invented.
- Do not add program admit rates, costs, or deadlines that aren't in `data/schools/*.json` / `app-data.js`.
- Stage 1 is **local data only** — no WebSearch/WebFetch for values. Missing → note in `GAPS.md`, leave EST.

## Privacy
- The names **Hrithik** and **Prans** must NEVER appear in any shipped/public file. `index.html` = 0 matches.

## The engine is frozen
- `chance()` in `app.html` is **linear**: `admit*(0.35+1.3*pos)`, clamped [0.02,0.96]. Do NOT change the
  math or constants (steepness not derivable from public data). Bands: Safety ≥.75 / Likely ≥.55 /
  Target ≥.30 / Reach. Colors: Safety `#00ff88`, Likely `#00d4ff`, Target `#f5a623`, Reach `#a855f7`.

## Files & git
- Edit **only** what your task names. Do NOT touch trackers (PROGRESS.md, RUBRIC.md, METRICS.md,
  CHECKPOINTS.md, SETUP.md) unless that IS the task.
- Scratch/temp files go in **`.scratch/`** only (gitignored). Never leave untracked files in the root.
- **Banned:** `git reset --hard`, `git clean` (unscoped), `rm -rf`, force-push. A PreToolUse hook blocks
  these. If you think you need them, you don't — commit first, or ask.

## Product spine (so you build the right thing)
- The product is a **decision engine** (trustworthy apply-list + "how to move your odds"), with **BS/MD
  premed** as the wedge. Physics bubbles are a *surface*, not the point. Decision value first, delight second.
