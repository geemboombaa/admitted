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
- [ ] asu — ASU Commitment Scholarship $5,500–$7,500/yr has no dedicated local source URL. The range is stated
  in `data/PENDING-RESEARCH-2026-09-05.md` B2, which attributes the WUE-ending confirmation to
  admission.asu.edu/wue; that page is what `wueDetail.src` carries. No local file has a standalone ASU
  Commitment Scholarship award-terms page. Needs the official scholarship page URL from a Stage-2 web pass.
- [ ] asu — 2027-28 cost of attendance and 2027-28 scholarship terms (his actual application cycle) are not
  published anywhere as of 2026-09-05. Left as `wueDetail.coa2728: null` /
  `wueDetail.replacement.termsForHisCycle: null` — deliberately NOT projected from the 2026-27 figures.
- [ ] howard — no source URL for any of the 5 merged `verifiedFacts` fields (admit 0.41, SAT 1090-1320,
  COA $63,084 = $39,036 tuition/fees + $21,048 housing/food + $3,000 books/personal, 4-yr grad 60%). The
  numbers themselves ARE local — they sit in the `Object.assign(VERD,{...})` patch block in `index1.html`
  that the Sep-5 verification pass wrote and that `scripts/extract-to-json.js` never picked up (it only reads
  the `const VERD={...}` literal), which is why `howard.json.verifiedFacts` was still `null`. But
  `data/PENDING-RESEARCH-2026-09-05.md` line 49 states outright that the per-field source URLs for these 15
  schools live only "in the assistant's prior message in this conversation" — they are in NO local file.
  Values merged as-is (app behaviour unchanged); the src URLs need a Stage-2 web pass.
- [ ] howard — two local sources disagree and there is no local basis to pick between them.
  `data/verify-batch6-accelerated.json` (`_meta.key_undergrad.howard`, dated 2026-09-04) says admit 0.35 and
  COA total $66,182; the later Sep-5 pass in `index1.html` says admit 0.41 and COA $63,084. The
  tuition/housing split ($39,036 / $21,048) is IDENTICAL in both, so only the top-line COA and the admit rate
  conflict. Took the Sep-5 values (newer, and the ones the shipped app already renders). Needs the official
  Howard CDS / bursar URL to settle which is right.
- [ ] howard — `merit` ($10,000/yr, "Capstone/Founders merit (auto for ~3.5+/1300+)") is still an unverified
  estimate. It is not in the merged `vf` list, so the app correctly shows it amber/EST. No local file carries
  Howard's automatic merit tiers or a source for them.
- [ ] gwu — no source URL for any of the 7 merged `verifiedFacts` fields (admit 47.1%, SAT 1360-1470,
  COA $93,580 = $72,420 tuition/fees + $18,160 housing/food + $3,000 books/personal, 4-yr grad 79%). Same
  situation as howard: the numbers ARE local — they sit in the `Object.assign(VERD,{...})` patch block in
  `index1.html` that the Sep-5 verification pass wrote and that `scripts/extract-to-json.js` never picked up
  (it only reads the `const VERD={...}` literal), which is why `gwu.json.verifiedFacts` was still `null`. But
  `data/PENDING-RESEARCH-2026-09-05.md` line 49 says the per-field source URLs for these 15 schools live only
  "in the assistant's prior message in this conversation" — they are in NO local file. GW is listed there as
  one of the 8 that "came back fully clean," so the values are trustworthy but unsourced-locally. Merged
  as-is (app behaviour unchanged); the src URLs need a Stage-2 web pass.
- [ ] gwu — two local sources disagree and there is no local basis to pick between them.
  `data/verify-batch6-accelerated.json` (`_meta.key_undergrad.gwu`, dated 2026-09-04) says admit 0.50,
  SAT 1300-1450, COA total $95,155, tuition/fees $72,770; the later Sep-5 pass in `index1.html` says
  admit 0.471, SAT 1360-1470, COA $93,580, tuition/fees $72,420. Housing/food ($18,160) is IDENTICAL in both.
  Took the Sep-5 values (newer, and the ones the shipped app already renders). Needs the official GW CDS /
  student-accounts URL to settle which is right.
- [ ] gwu — `merit` ($10,000/yr, "Presidential merit (auto-considered)") is still an unverified estimate.
  `data/verify-batch6-accelerated.json` says only "Presidential auto-considered, amounts vary" — no dollar
  figure, no tier table, no source. It is correctly NOT in the merged `vf` list, so the app shows it
  amber/EST. No local file carries GW's merit award amounts.
- [ ] gwu — `general.tuition` (68000) and `general.coa` (90000) are the older unverified estimates and now
  disagree with the verified `tuitV` 72420 / `coa` 93580. Left untouched (out of scope for this merge; the
  app reads the verified values via the VERD overlay). Flagging so a later pass can reconcile the estimate
  fields with the verified ones.
- [ ] usf — no source URL for any of the 7 merged `verifiedFacts` fields (admit 43.2%, SAT 1130-1320,
  COA $32,913 = $15,473 tuition/fees + $14,440 housing/food + $3,000 books/personal, 4-yr grad 61%). Same
  situation as howard and gwu: the numbers ARE local — they sit in the `Object.assign(VERD,{...})` patch block
  in `index1.html` that the Sep-5 verification pass wrote and that `scripts/extract-to-json.js` never picked up
  (it only reads the `const VERD={...}` literal), which is why `usf.json.verifiedFacts` was still `null`. But
  `data/PENDING-RESEARCH-2026-09-05.md` line 49 says the per-field source URLs for these 15 schools live only
  "in the assistant's prior message in this conversation" — they are in NO local file. Merged as-is (app
  behaviour unchanged); the src URLs need a Stage-2 web pass.
- [ ] usf — **the three fields the project's own notes say could NOT be verified are nevertheless flagged
  verified.** `data/PENDING-RESEARCH-2026-09-05.md` line 49 names USF as one of the 7 schools where "admit rate
  + SAT range + 4yr grad — CDS blocked by robots.txt", i.e. explicitly unverifiable. Yet the Sep-5
  `Object.assign(VERD,{...})` block in `index1.html` lists `admit`, `s25`, `s75` and `grad4` inside USF's `vf`
  array, so the shipped app already renders a green VERIFIED badge on all four. Merged verbatim so the JSON
  matches what the app already does (and because Stage 1 may not touch `index1.html`), but this is a live
  false-verified claim, not just a missing source. Needs a user decision: either source these four from the
  USF CDS in a Stage-2 web pass, or drop them from `vf` so they show amber/EST.
- [ ] usf — two local sources disagree and there is no local basis to pick between them.
  `data/verify-batch6-accelerated.json` (`_meta.key_undergrad.usf`, dated 2026-09-04) says SAT 1290-1420 and
  OOS COA $38,688; the later Sep-5 pass in `index1.html` says SAT 1130-1320 and COA $32,913. No field overlaps
  cleanly — the two SAT bands barely intersect and the COA gap is $5,775. Took the Sep-5 values (newer, and the
  ones the shipped app already renders), consistent with how the howard and gwu conflicts were resolved. Needs
  the official USF CDS / bursar URL to settle which is right.
- [ ] usf — the merged `coa` $32,913 / `tuitV` $15,473 may be the IN-STATE rather than the out-of-state rate.
  `usf.json` carries `instateRef` 26000 and `general.tuition` 18000, and USF's published non-resident
  tuition+fees is well above $15,473, so a $15,473 "tuition/fees" line reads low for the OOS figure this app
  needs. Cannot be checked against any local file. Flagged rather than changed — needs the official USF
  cost-of-attendance page in a Stage-2 web pass to confirm which residency tier this number is.
- [ ] usf — `general.coa` (45000) and `general.tuition` (18000) are the older unverified estimates and now
  disagree with the verified `coa` 32913 / `tuitV` 15473. Left untouched (out of scope for this merge; the app
  reads the verified values via the VERD overlay). Same reconciliation gap as logged for gwu.
- [ ] usf — `merit` ($6,000/yr, "OOS merit (competitive, limited)") is still an unverified estimate.
  `data/verify-batch6-accelerated.json` says only "OOS waivers $5-11k/yr" — a range, no tier table, no source.
  It is correctly NOT in the merged `vf` list, so the app shows it amber/EST. No local file carries USF's
  automatic merit tiers or a source for them.
- [ ] njit — no source URL for any of the 7 merged `verifiedFacts` fields (admit 65.1%, SAT 1240-1470,
  COA $60,492 = $39,912 tuition/fees + $17,580 housing/food + $3,000 books/personal, 4-yr grad 48%). Same
  situation as howard, gwu and usf: the numbers ARE local — they sit in the `Object.assign(VERD,{...})` patch
  block at `index1.html` line 400 that the Sep-5 verification pass wrote and that `scripts/extract-to-json.js`
  never picked up (it only reads the `const VERD={...}` literal on line 391), which is why
  `njit.json.verifiedFacts` was still `null`. But `data/PENDING-RESEARCH-2026-09-05.md` line 49 says the
  per-field source URLs for these 15 schools live only "in the assistant's prior message in this conversation"
  — they are in NO local file. Merged as-is (app behaviour unchanged); the src URLs need a Stage-2 web pass.
- [ ] njit — **the three fields the project's own notes say could NOT be verified are nevertheless flagged
  verified.** `data/PENDING-RESEARCH-2026-09-05.md` line 49 names NJIT as one of the 7 schools where "admit
  rate + SAT range + 4yr grad" could not be verified. Yet the Sep-5 `Object.assign(VERD,{...})` block in
  `index1.html` lists `admit`, `s25`, `s75` and `grad4` inside NJIT's `vf` array, so the shipped app already
  renders a green VERIFIED badge on all four. Merged verbatim so the JSON matches what the app already does
  (and because Stage 1 may not touch `index1.html`), but this is a live false-verified claim, not just a
  missing source. Needs a user decision: either source these four from the NJIT CDS in a Stage-2 web pass, or
  drop them from `vf` so they show amber/EST. Identical to the usf case logged above.
- [ ] njit — two local sources disagree on cost and SAT, with no local basis to pick between them.
  `data/verify-batch6-accelerated.json` (`_meta.key_undergrad.njit`, dated 2026-09-04) says OOS tuition/fees
  $42,300 + room/board $18,900 (= $61,200) and gives a single SAT *average* of 1317 (plus a Dorman Honors
  average of 1502) rather than a 25-75 band; the later Sep-5 pass in `index1.html` says tuition/fees $39,912 +
  housing/food $17,580, COA $60,492, SAT band 1240-1470. Tuition gap $2,388, housing gap $1,320. Took the
  Sep-5 values (newer, and the ones the shipped app already renders), consistent with how the howard, gwu and
  usf conflicts were resolved. Needs the official NJIT CDS / bursar URL to settle which is right.
- [ ] njit — `general.coa` (55000) and `tuition` (36000) are the older unverified estimates and now disagree
  with the verified `coa` 60492 / `tuitV` 39912 (a $5,492 COA gap). `accel.coa` (55000) carries the same stale
  estimate. Left untouched (out of scope for this merge; the app reads the verified values via the VERD
  overlay). Same reconciliation gap as logged for gwu and usf.
- [ ] njit — `merit` ($15,000/yr, "Dorman Honors / OOS merit (auto)") is an unverified estimate that the one
  local source **directly contradicts**: `data/verify-batch6-accelerated.json` says NJIT merit is "Dorman
  small awards $1.5-2.5k" — an order of magnitude lower, and a range with no tier table and no source URL.
  `merit` is correctly NOT in the merged `vf` list, so the app shows it amber/EST, but $15,000 is also
  duplicated in `accel.merit` and is quoted in `general.note` ("Real OOS merit") and `general.medNote` ("the
  merit makes the base school affordable"), so an unverified number is driving user-facing prose. Not changed
  here — no local file carries NJIT's real automatic merit tiers or a source for them. Needs a Stage-2 web
  pass against the NJIT/Dorman scholarship page.
- [ ] rowan — no source URL for any of the 7 merged `verifiedFacts` fields (admit 77.7%, SAT 1110-1310,
  COA $41,522 = $23,168 tuition/fees + $15,354 housing/food + $3,000 books/personal, 4-yr grad 37%). Same
  situation as howard, gwu, usf and njit: the numbers ARE local — they sit in the `Object.assign(VERD,{...})`
  patch block at `index1.html` line 392 that the Sep-5 verification pass wrote and that
  `scripts/extract-to-json.js` never picked up (it only reads the `const VERD={...}` literal), which is why
  `rowan.json.verifiedFacts` was still `null`. But `data/PENDING-RESEARCH-2026-09-05.md` line 49 says the
  per-field source URLs for these 15 schools live only "in the assistant's prior message in this conversation"
  — they are in NO local file. Unlike njit/usf, Rowan is named on that same line as one of the 8 schools that
  "came back fully clean", so all 7 fields being in `vf` is consistent with the project's own notes; only the
  URLs are missing. Merged as-is (app behaviour unchanged); the src URLs need a Stage-2 web pass.
- [ ] rowan — two local sources disagree on out-of-state cost, with no local basis to pick between them.
  `data/verify-batch6-accelerated.json` (`_meta.key_undergrad.rowan`, dated 2026-09-04) says OOS COA $53,192 =
  $28,252 tuition/fees + $17,024 housing/food; the later Sep-5 pass in `index1.html` says $41,522 = $23,168 +
  $15,354. Tuition gap $5,084, housing gap $1,670, total COA gap $11,670 — the largest of any school merged in
  this series, and large enough to change his affordability ranking. Took the Sep-5 values (newer, and the
  ones the shipped app already renders), consistent with how the howard, gwu, usf and njit conflicts were
  resolved. Needs the official Rowan cost-of-attendance / bursar URL to settle which is right — and to confirm
  the Sep-5 figure is the non-resident rate, not the in-state one.
- [ ] rowan — `general.coa` (50000) and `tuition` (30000) are the older unverified estimates and now disagree
  with the verified `coa` 41522 / `tuitV` 23168 (an $8,478 COA gap). `accel.coa` (50000) and `instateRef`
  (35000) carry the same stale estimates. Left untouched (out of scope for this merge; the app reads the
  verified values via the VERD overlay). Same reconciliation gap as logged for gwu, usf and njit.
- [ ] rowan — `general.grad4` (55) is an unverified estimate that the verified value contradicts by 18 points
  (verified 4-yr grad 37%). `grad4` IS in the merged `vf` list so the app renders the verified 37, but the
  stale 55 is still the value sitting in the JSON's `general` block, and 37% materially weakens the "3+4
  finish-in-three" premise that `general.note` and `general.medNote` sell. Left untouched (same scope call as
  the COA reconciliation above); needs the Rowan CDS URL in a Stage-2 pass, then a single reconciliation edit.
- [ ] rowan — `merit` ($10,000/yr, "OOS merit (auto)") is an unverified estimate the one local source
  contradicts: `data/verify-batch6-accelerated.json` says Rowan merit is "Brown&Gold OOS, amounts unpublished,
  Jan 31" — i.e. no published amount at all. `merit` is correctly NOT in the merged `vf` list, so the app
  shows it amber/EST, but $10,000 is also duplicated in `accel.merit` and is quoted in `general.note`
  ("decent OOS merit"), so an unverified number is driving user-facing prose. Not changed here — no local file
  carries Rowan's Brown & Gold award amounts or a source for them. Needs a Stage-2 web pass.
- [ ] temple — no source URL for any of the 7 merged `verifiedFacts` fields (admit 80.4%, SAT 1120-1360,
  COA $52,976 = $35,232 tuition/fees + $14,744 housing/food + $3,000 books/personal, 4-yr grad 62%). Same
  situation as howard, gwu, usf, njit and rowan: the numbers ARE local — they sit in the
  `Object.assign(VERD,{...})` patch block at `index1.html` line 392 that the Sep-5 verification pass wrote and
  that `scripts/extract-to-json.js` never picked up (it only reads the `const VERD={...}` literal), which is
  why `temple.json.verifiedFacts` was still `null`. But `data/PENDING-RESEARCH-2026-09-05.md` line 49 says the
  per-field source URLs for these 15 schools live only "in the assistant's prior message in this conversation"
  — they are in NO local file. Like rowan (and unlike njit/usf), Temple is named on that same line as one of
  the 8 schools that "came back fully clean", so all 7 fields being in `vf` is consistent with the project's
  own notes; only the URLs are missing. Merged as-is (app behaviour unchanged); the src URLs need a Stage-2
  web pass. Note the one already-sourced Temple number, `cds7.src`
  (`https://ira.temple.edu/sites/ira/files/media/document/CDS%202025-26_Temple%20University_0.pdf`), is the
  2025-26 Common Data Set and is the likely home of admit rate, the SAT band and the 4-yr grad rate — check it
  first in Stage 2 before searching anywhere else.
- [ ] temple — two local sources disagree on out-of-state cost, with no local basis to pick between them.
  `data/verify-batch6-accelerated.json` (`_meta.key_undergrad.temple`, dated 2026-09-04) says OOS COA $64,384 =
  $37,698 tuition/fees + $19,636 housing/food; the later Sep-5 pass in `index1.html` says $52,976 = $35,232 +
  $14,744 + $3,000 books/personal. Tuition gap $2,466, housing gap $4,892, total COA gap $11,408 — second only
  to rowan's in this series, and large enough to change his affordability ranking. Took the Sep-5 values
  (newer, and the ones the shipped app already renders), consistent with how the howard, gwu, usf, njit and
  rowan conflicts were resolved. Needs the official Temple cost-of-attendance / bursar URL to settle which is
  right — and to confirm the Sep-5 figure is the non-resident rate, not the in-state one (Temple's PA-resident
  tuition is roughly half the OOS rate, so an in-state/OOS mix-up is the most likely explanation for a gap
  this size). The two sources agree closely on admit rate (0.81 vs 0.804), which is mild evidence they are
  describing the same cycle rather than different years.
- [ ] temple — the two local sources also report SAT on incompatible metrics: `verify-batch6` gives a single
  SAT *average* of 1213 with no 25-75 band; the Sep-5 pass gives a band of 1120-1360 (midpoint 1240). 1213
  sits inside 1120-1360, so they are not contradictory, but there is no local way to confirm the band's
  endpoints. Merged the band (the app renders s25/s75). Same metric-mismatch pattern logged for njit.
- [ ] temple — `general.coa` (55000) and `tuition` (36000) are the older unverified estimates and now disagree
  with the verified `coa` 52976 / `tuitV` 35232 (a $2,024 COA gap — the smallest in this series).
  `accel.coa` (55000) and `instateRef` (40000) carry the same stale estimates. `general.grad4` (58) also
  disagrees with the verified 62, and `general.admit` (0.8) / `g`-band SAT (1150-1350) are near but not equal
  to the verified 0.804 / 1120-1360. All left untouched (out of scope for this merge; the app reads the
  verified values via the VERD overlay). Same reconciliation gap as logged for gwu, usf, njit and rowan.
- [ ] temple — `merit` ($12,000/yr, "OOS merit (auto tiers)") is an unverified estimate that the one local
  source partly contradicts: `data/verify-batch6-accelerated.json` says Temple merit is "auto-considered,
  tiers unpublished" — it confirms awards are automatic but says the tier amounts are NOT published, so
  $12,000 has no local basis. `merit` is correctly NOT in the merged `vf` list, so the app shows it amber/EST,
  but $12,000 is also duplicated in `accel.merit` and the claim is quoted in `general.note` ("Auto merit tiers
  keep OOS cost reasonable"), so an unverified number is driving user-facing prose. Not changed here — no
  local file carries Temple's automatic merit tier table or a source for it. Needs a Stage-2 web pass.
- [ ] temple — the accelerated-program record has no verified stats and the two local sources describe two
  different things. `verify-batch6-accelerated.json` (`temple34`) is unambiguous that Temple's route is NOT a
  high-school BS/MD but a Pre-Med Health Scholar linkage applied for in the fall of sophomore year of college
  (3.6 college GPA, MCAT 509 min, no section below 126), and `accel` in the JSON already reflects that
  correction with a source URL. But `general.dl` still advertises "3+4 Katz app with admission" and
  `general.note` still describes "a 3+4 accelerated track", both of which imply the HS-entry program that the
  verification says does not exist — the same stale framing the `accel.note` explicitly calls "Corrected".
  Separately, `programVerified` is `null` and `PENDING-RESEARCH-2026-09-05.md` line 61 lists Temple among the
  16 programs that publish no applicant count, no seat-based rate and nothing computable, so `null` is correct
  and should NOT be filled with an estimate. Prose reconciliation left untouched (out of scope for a
  verifiedFacts merge); needs a copy edit, not a web pass.
