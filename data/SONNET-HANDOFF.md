# HANDOFF PROMPT — paste this to start a new session (written 2026-09-04, after v15 shipped)

You are continuing work on **"admitted"** — a college-selection web app I built with Claude for my son (12th grade, premed/BS-MD track, California). Read this whole file, then confirm understanding and wait for my instructions. Do not rebuild or re-research anything that is already done.

## The app
- One self-contained HTML file, PULSE dark design (#0a0e1a background; neon green #00ff88 / cyan #00d4ff / amber #f5a623 / purple #a855f7; Inter font; interactive, no static screens). No build step, no backend; state in localStorage key `medtrack1`.
- Live copy: my GitHub repo geemboombaa/admitted → Vercel at admitted-six.vercel.app. I deploy by unzipping the zip Claude makes over my repo folder, then `git add .` / `git commit` / `git push` (PowerShell, one command per line).
- Working file in the session workspace: `/home/user/medtrack/medtrack.html` (v15). Deploy copy: `deploy/index.html` (same content wrapped with doctype/head/body and SANITIZED — my son's name "Hrithik" and my name "Prans" must NEVER appear in the public copy; the sanitize step replaces two known strings and asserts zero matches).
- Test suite: `test.mjs` (converted to `test.cjs` with require path `/home/claude/.npm-global/lib/node_modules/playwright` and executablePath `/opt/pw-browsers/chromium`). ~197 checks; the ONLY expected failure is "zero console errors" from the SheetJS CDN being blocked in the sandbox (works on Vercel). Any other failure = fix before delivering.

## Current state (v15)
- 97 schools (all 9 UCs, 13 CSUs, WUE/West publics, privates, elites, all accelerated-program hosts, Rice, Tulane, UAB, Alabama, Ohio State, CU Boulder).
- Son's real stats are the defaults: **3.67 unweighted GPA, 1440 SAT**, plus a "UC weighted GPA" slider (placeholder 4.10 — I will supply the real UC weighted-capped GPA; UCs are chanced on it against verified fall-2026 weighted admit bands).
- EVERYTHING is dynamic: chance bands, fit, ratings ranking, accelerated-program fit, submit/withhold SAT advice all recompute from the sliders. Never pre-bake a static rating from given stats.
- **Verified-data layer**: `/home/user/medtrack/data/verify-batch1..6.json` hold Sep-2026 verification of admit rates, SAT bands, COA with tuition/housing splits, merit, grad rates and accelerated-program terms — every value with a source URL; null = could not verify. A `VERD` block in the app applies them; each school has `s.vf` (verified field list). Cards show a green ✓ pill (verified) or amber **EST** pill (cost/merit unverified), a "Data:" line naming which is which, and the Method tab has a 97-row audit table. **NEVER invent a number — flag it as estimate instead. This is the user's hardest rule.**
- True Cost engine: one ledger — Gross (undergrad net × program years + med school × 4) − his money − family contribution ($/yr × years) = loans; loans + interest (simulated through school + residency + 10-yr repayment) = True Cost. BS/MD schools price through their program (UGYRS map: accelerated undergrad years; MEDCOST map: affiliated med school $/yr). One year-by-year simulation drives donuts, ledger cards, journey/net-worth chart, cost-lines chart, and the True cost column in the list — all from `trueCost(s)`.
- Tabs: Profile · The List · All Colleges · Weights · Compare · True Cost · BS/MD pathway · Accelerated · UC Reference · Timeline · Method.
- Other v15 facts: no need-based aid is assumed anywhere (family income above the aid cutoffs); "Realistic cost (est.)" toggle removes waivable insurance (verified $ per school where published) + $2k books/personal; per-card "How they decide" line + yield-protection flags (CWRU, Northeastern, Tulane, BU, Miami) + dynamic SAT submit/withhold advice; per-card Naviance input (user will paste scattergram results from his high school); Creighton re-banded OUT (verified 3.8 HS gate, interview-only); CNU 3+4 OUT (verified 3.9/1450 + five AP 4s); Rowan 3+4 and Howard 6-yr are the two accelerated doors verified OPEN at his stats; UAB $22,500/yr and Alabama $28,000/yr are verified AUTOMATIC merit he qualifies for; Temple's "3+4" is an in-college sophomore linkage, not a high-school program; GWU BA/MD is now 8-year; BU SMED / Northwestern HPME / Miami HPME are closed.

## How to work with me (non-negotiable)
1. **Propose first, wait for my explicit approval, then build.** Never change the app unprompted.
2. Answers: direct, dense, plain English, explain any acronym once, numbered tables for analysis/recommendations. No stories, no hedging, no filler.
3. Never fabricate data. Verified or flagged-estimate — nothing else. If I ask a factual question, research before answering (official pages first, then forums/parent reports for the reality check).
4. After every approved build: run the Playwright suite, fix failures, then deliver the sanitized zip (`admitted-vNN.zip` with index.html, README.md, DEPLOY.txt, and the data/ folder) and tell me the exact PowerShell push steps.
5. State assumptions explicitly, steelman the opposite view on recommendations, and tell me plainly when I (or my counselor) am wrong — with the source.
6. Optimize token use: batch edits via Python scripts on the HTML (anchors + assert-unique replace), test headlessly, screenshot only when layout changed.

## Open items I may ask for next
- Enter son's real UC weighted-capped GPA; fill Naviance fields from counselor scattergrams.
- Forum-level cost reality checks (Reddit/College Confidential) for the shortlist.
- SCU, CNU, Pacific, USD, Seattle U, Michigan, UNC, Georgia, UT Austin still have unverified fields (EST-flagged) — batch-verify if asked.
- Final shortlist workshop + essay/deadline plan against the Timeline tab.
