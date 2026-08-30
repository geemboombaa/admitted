# admitted

An interactive college-selection tool for premed and BS/MD applicants. Single-file, no build step, no backend — pure HTML/CSS/JS.

## Features
- 80 colleges: all 9 UCs, 13 CSUs, WUE/West publics, national premed-value privates, elite reaches, and every school carrying a BS/MD or early-assurance program
- Live admit-chance model: GPA/SAT position vs each school's admitted middle-50%, adjusted for ECs, course rigor, and hooks, scaled by how holistically each school reads (test-blind schools ignore SAT automatically)
- Chance bands (Safety >=75% / Likely 55-75% / Target 30-55% / Reach <30%) with a plain-English "why this band" explainer on every card
- Fit score (0-100) driven by 10 user-weighted priorities, plus an objective 1-10 quality Rating
- Cost modeling: sticker COA, estimated merit for your stat band, net cost, and an 8-year view stacking med-school debt
- Direct pathways: 27 BS/MD and early-assurance programs banded attainable / stretch / restricted / out-of-band, with program-level acceptance estimates kept separate from school admit rates
- Filters on everything (region, type, bands, pathway, program band, net cost, rating, social life, research access), full-text search, sortable table view, shortlist starring, per-college deadline table
- All data saves locally in the browser (localStorage) — nothing leaves the page

## Deploy
Static site - any host works.
- **Vercel**: import this repo at vercel.com/new -> Framework: Other -> Deploy (no settings needed)
- **GitHub Pages**: repo Settings -> Pages -> Deploy from branch -> main / root
- Or open `index.html` directly in a browser

## Data disclaimer
Admit rates, costs, merit figures, and program details are 2024-26 cycle estimates compiled for decision support. Verify everything against official school links (provided on each card) before applying. Not admissions or financial advice.
