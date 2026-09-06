# admitted

An interactive college-selection tool for premed and BS/MD applicants. Single-file, no build step, no backend — pure HTML/CSS/JS.

## Features
- 97 colleges: all 9 UCs, 13 CSUs, WUE/West publics, national premed-value privates, elite reaches, every school carrying a BS/MD or early-assurance program, every active accelerated (6/7-year) BS/MD or BS/DO host school, and the verified merit-buyer publics (UAB, Alabama, Ohio State, CU Boulder) plus Rice and Tulane
- Live admit-chance model: GPA/SAT position vs each school's admitted middle-50%, adjusted for ECs, course rigor, and hooks, scaled by how holistically each school reads (test-blind schools ignore SAT automatically)
- Chance bands (Safety >=75% / Likely 55-75% / Target 30-55% / Reach <30%) with a plain-English "why this band" explainer on every card
- Fit score (0-100) driven by 10 user-weighted priorities, plus an objective 1-10 quality Rating
- True cost on every card and table row (sortable), and a Cost-lines chart (true cost, COA, tuition & fees, housing & food, merit, net, med school $/yr — each toggleable) for the schools in scope
- True Cost ledger: gross (undergrad net + med school) minus his money minus family contribution = loans; loans + interest = true cost. One year-by-year simulation drives the donuts, the ledger cards, and the journey/net-worth chart
- BS/MD schools priced through their own program: accelerated undergrad years (2+4, 3+4) plus the affiliated med school's cost x 4; premed schools use a global med-school $/yr
- BS/MD pathway tab: 26 direct and early-assurance programs banded attainable / stretch / restricted / out-of-band, plus the free-tuition med-school endgame and a 4-year plan
- Accelerated tab: every active 6- and 7-year BS/MD and BS/DO program with live fit, entry bars, restrictions and full cost, plus look-alikes (early assurance, 3-year MD programs) and a closed-programs list
- Filters on everything (region, type, bands, pathway, program band, net cost, rating, social life, research access), full-text search, sortable table view, shortlist starring, per-college deadline table
- All data saves locally in the browser (localStorage) — nothing leaves the page

## Data verification
Core numbers (admit rate, SAT band, cost of attendance with tuition/housing split, merit, grad rate) were verified Sep 2026 against official school pages and Common Data Sets; source files with URLs live in /data. Cards show a green check (verified) or amber EST (estimate) pill, and the Method tab carries a full audit table. Unverifiable values are flagged, never invented.

## Deploy
Static site - any host works.
- **Vercel**: import this repo at vercel.com/new -> Framework: Other -> Deploy (no settings needed)
- **GitHub Pages**: repo Settings -> Pages -> Deploy from branch -> main / root
- Or open `index.html` directly in a browser

## Data disclaimer
Admit rates, costs, merit figures, and program details are 2024-26 cycle estimates compiled for decision support. Verify everything against official school links (provided on each card) before applying. Not admissions or financial advice.

## Data architecture (Phase 2 — migrated Sep 2026)
The old approach of hand-editing ~30 giant inline JS arrays inside `index1.html` via fragile string-replace scripts is retired. Source of truth is now:
- `data/schools/<id>.json` — one file per school: general admission stats + its BS/MD/early-assurance program (if any) + Common Data Set weighting + accelerated-program entry + every other per-school lookup the app used to keep in a dozen separate id-keyed objects.
- `data/shared/app-config.json` — the handful of genuinely global things (weight-slider defs, band colors, the free-tuition-MD write-up, standalone/consortium-wide pathway entries not tied to one school).
- `data/schema/school.schema.json` — documents the shape and, critically, the no-fabrication rule: a `programVerified` numeric field always requires a `src` URL.

**Workflow to change a fact going forward:**
1. Edit the relevant `data/schools/<id>.json` file directly (or `data/shared/app-config.json` for global config).
2. `node scripts/validate.js` — checks structure, duplicate ids, and that every sourced number has a source URL.
3. `node scripts/build.js --out=index1.html` — regenerates the shipped single-file app from the JSON. (Omit `--out` to build to `index1.generated.html` first and eyeball/test it before promoting it to the live file.)
4. Re-test, then commit both the changed JSON and the rebuilt `index1.html`.

`scripts/extract-to-json.js` is the one-time (repeatable, read-only-on-index1.html) extractor that produced the current `data/` tree from the previous hand-maintained version; `index1.pre-json-migration-backup.html` is the last hand-edited version, kept for reference/rollback. The app itself is still shipped as one static file — this only changes how the data behind it is edited.
