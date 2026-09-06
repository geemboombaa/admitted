# GAPS — work that needs web data or a user decision (NOT loop-runnable in Stage 1)

The Stage-1 loop is local-data-only. Anything whose data does not exist in a local file lands here,
flagged, never fetched or invented. This is the honest input to the Stage-2 "do we go get data" decision.

The loop's builder also appends to this file automatically whenever it hits a field it cannot satisfy locally.

## G1. Zero-VERD schools with NO local data (need web verification)
These 5 have `verifiedFacts: null` AND no entry in verify-batch1-6. Their 5 core fields
(admit rate, SAT 25-75, OOS COA + tuition/housing split, auto merit, 4-yr grad) are not local.
- [ ] uga — University of Georgia
- [ ] uta — UT Austin (prior research: CDS behind an unreadable Box viewer)
- [ ] mich — University of Michigan
- [ ] unc — UNC Chapel Hill
- [ ] cuny — CCNY / CUNY School of Medicine (SAT range, OOS housing/food, 4-yr grad were unverifiable)

## G2. Auburn verifiedFacts
Auburn's core numbers exist in auburn.json.general, but the sourced field-map (`verifiedFacts` with src)
was web-derived in a prior run and reverted. Not in any local file.
- [ ] auburn — populate verifiedFacts from official Auburn CDS + 26-27 cost PDF (COA correction $59,020 -> $63,540, grad4 61.7 were found but need re-fetch)

## G3. New schools to add (all sources are web URLs — PENDING-RESEARCH B1)
Each needs a full verification batch (admit, SAT, COA, merit, grad) before it can be added.
Some are new schools; three (wayne, syracuse, usc_sc) already exist and only need the PROGRAM added.
- [ ] Wayne State "Wayne Med-Direct" BS/MD program (wayne.json exists) — https://provost.wayne.edu/wayne-med-direct/program-overview
- [ ] University of Missouri (Columbia) "Bryant Scholars" — https://medicine.missouri.edu/offices-programs/admissions/bryant-pre-admissions-program
- [ ] Texas A&M "E2EnMed" — https://myapparchitect.com/complete-bs-md-school-list/
- [ ] University of Toledo "BACC2MD" — https://bridge2md.com/program-guide/
- [ ] University of Illinois Chicago "GPPA" — https://bridge2md.com/program-guide/
- [ ] University of Minnesota "BA/MD Scholars" — https://admissions.tc.umn.edu/academics/special-programs/bamd-scholars-program
- [ ] Brooklyn College (CUNY) "Coordinated BA-MD" w/ SUNY Downstate — https://www.brooklyn.edu/honors-academy/ba-md/
- [ ] Syracuse × SUNY Upstate BS/MD (syracuse.json exists) — https://www.upstate.edu/com/special_opps/bs-md-program.php
- [ ] University of Colorado Denver (Anschutz) "BA/BS-MD" — https://clas.ucdenver.edu/health-professions-programs/babs-md-program-information
- [ ] University of Louisville "GEMS" — https://bridge2md.com/program-guide/
- [ ] University of South Carolina "Accelerated UG to MD" (usc_sc.json exists) — https://bridge2md.com/program-guide/
- [ ] University of Tulsa "Early Careers in Medicine" — https://myapparchitect.com/complete-bs-md-school-list/

## G4. Auto-logged gaps (builder appends below during loop runs)
