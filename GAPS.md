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

- [ ] brown / drex / hof — `programVerified.admitRatePct` (2.19% / 2.7% / 0.6%) conflicts with PENDING-RESEARCH B4,
  which lists Brown PLME as publishing nothing computable and does not mention Drexel or Hofstra at all.
  Each of the three DOES carry a `src` URL locally (Brown = Brown Daily Herald student paper, not an official
  school page; Drexel = official admissions page; Hofstra = derived from two official figures, rate itself
  unpublished). Left in place — they are sourced, not invented, and live in a different field from the
  PROGRATE table that backlog item "4 real BS/MD rates" covered. Needs a user decision: is a student-newspaper
  figure acceptable as a `programVerified` source, or should brown be nulled to match B4?

- [ ] osu — `instateRef` (Oregon State resident cost of attendance, $38,568 for 2026-27). The number is taken
  verbatim from `data/PENDING-RESEARCH-2026-09-05.md` B2, which states it without a URL. No local file carries
  a source link for it (`data/verify-batch1-west.json` has only the non-resident side: $65,013 total = $42,459
  tuition/fees + $18,066 housing/food, sourced to financialaid.oregonstate.edu/cost-attendance). Written in and
  disclosed as unsourced in `wueDetail.coaSrcNote`, NOT presented as a published sourced figure. Needs the
  official OSU resident COA URL from a Stage-2 web pass to be promoted to sourced.
- [ ] osu — WUE dollar value. OSU publishes no WUE line item. The ~$24,102/yr base-tuition figure in
  `wueDetail.estTuitionPerYear` is 150%-of-resident-tuition as computed in PENDING-RESEARCH B2; the resident
  base-tuition input behind it is in no local file, so it is carried as a derived estimate
  (`estIsDerived: true`) and must not be shown as official.
