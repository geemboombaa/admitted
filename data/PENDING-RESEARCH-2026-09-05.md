# Pending research + session log — 2026-09-05 (read this before continuing tomorrow)

Everything below is either (a) code changes already made and verified on disk this session, or (b) research findings collected but NOT YET merged into index.html — waiting on Prans's picks/approval. Nothing here has been committed to git yet (see git status at bottom). This file is the record so none of it is lost between sessions.

## A. Code changes ALREADY APPLIED to index.html this session (verified: JS syntax checked with node, byte-level grep-confirmed, school count still 97)

1. Reset button bug fixed — root cause was the separate "All Colleges" tab search box (`#allq`) being a disconnected, unbound input the old reset never touched, plus the budget-filter `over` flag missing from the reset payload. Both fixed; `FKEYS` now includes `'over'`.
2. Weights tab — nav button removed (tab unreachable). Section/render code left in place (dead but harmless) pending the scoring rework in item C1 below.
3. UC Reference tab — nav button removed. Its 3 unique explanatory facts (test-blind, UC weighted-GPA definition, filing window) were migrated into a new permanent note block in "The List" tab so the info isn't lost.
4. Card face: "Admit rate" and "4-yr grad" tiles removed from the main card (cnums row). Both now appear in the detail panel instead, as a new line: "School admit rate: X% ... 4-yr grad rate: Y% (feeds the Rating score, not an acceptance rate)."
5. Table view: "Admit%" and "4-yr grad" columns removed from `renderTable()`. A new **editable Notes column** added (`.tnote` input bound to `S.notes[id]`, saves on change) — matches the card's existing notes feature.
6. `data/verify-batch6-accelerated.json` — was broken JSON (missing a `}` before `"howard6"`, which caused everything to nest incorrectly inside `_meta` instead of as sibling keys). Fixed and confirmed it now parses to the correct 16 top-level keys.

Untouched this session (deliberately, per agreed sequencing): premed/research/bio/clinical/social scores and their filters, program band (PBAND) pills/filter/UI, the chance-formula (Safety/Likely/Target/Reach math), card/table full regrouping — all queued behind the scoring-methodology rebuild (item C1).

## B. Research collected, NOT yet merged into the app — needs Prans's picks tomorrow

### B1. Missing schools beyond Auburn (Auburn itself still needs adding — confirmed absent)
12 candidates found, all real active BS/MD or notable premed programs, none currently in the 97-school roster:

1. **Wayne State University** — "Wayne Med-Direct" direct-admit BS/MD. Source: https://provost.wayne.edu/wayne-med-direct/program-overview
2. **University of Missouri (Columbia)** — "Bryant Scholars Pre-Admissions Program," early assurance, distinct from UMKC (already on list). Source: https://medicine.missouri.edu/offices-programs/admissions/bryant-pre-admissions-program
3. **Texas A&M University** — "Engineering to Engineered Medicine (E2EnMed)." Source: https://myapparchitect.com/complete-bs-md-school-list/
4. **University of Toledo** — "BACC2MD" direct-admit BS/MD. Source: https://bridge2md.com/program-guide/
5. **University of Illinois Chicago** — "Guaranteed Professional Program Admissions (GPPA)," one of the oldest BS/MD-equivalent guarantee programs. Source: https://bridge2md.com/program-guide/
6. **University of Minnesota** — "BA/MD Scholars Program." Source: https://admissions.tc.umn.edu/academics/special-programs/bamd-scholars-program
7. **Brooklyn College (CUNY)** — "Coordinated BA-MD Program" with SUNY Downstate, distinct from the CCNY/CUNY School of Medicine program already on the list. Source: https://www.brooklyn.edu/honors-academy/ba-md/
8. **Syracuse University** — new combined BS/MD with SUNY Upstate Medical University (since 2022). Source: https://www.upstate.edu/com/special_opps/bs-md-program.php
9. **University of Colorado Denver (Anschutz)** — "BA/BS-MD Program," distinct from CU Boulder (already on list — Denver is the actual home campus of this pathway). Source: https://clas.ucdenver.edu/health-professions-programs/babs-md-program-information
10. **University of Louisville** — "GEMS" (Guaranteed Entrance to Medical School). Source: https://bridge2md.com/program-guide/
11. **University of South Carolina** — "Accelerated Undergraduate to MD Program." Source: https://bridge2md.com/program-guide/
12. **University of Tulsa** — "Early Careers in Medicine," early assurance with OU/OSU medical schools. Source: https://myapparchitect.com/complete-bs-md-school-list/

Checked and explicitly rejected as NOT worth adding (no BS/MD program, no distinctive premed edge beyond what's already covered): Villanova, Fordham, American University, University of Redlands, Pepperdine, University of Denver, University of Portland, Seattle Pacific, Boise State, Colorado State.

**Decision needed:** which of these 12 (plus Auburn) to actually add. Each addition needs its own mini verification batch (admit rate, SAT band, COA, merit, grad rate) before going into SCHOOLS/VERD — not yet done for any of these 12.

### B2. WUE status — University of Arizona, Oregon State, Arizona State (official sources only)

- **University of Arizona (`ua`)**: Confirmed still active via catalog.arizona.edu and financialaid.arizona.edu, BUT it's "limited participation" — competitive, capacity-limited, program-by-program, NOT a guaranteed rate for every applicant. WUE = 150% of resident tuition per policy, but no standalone 2026-27 dollar figure is officially published as a line item. FY27 bursar chart: Resident $12,168 / Non-Resident $42,600 (150%-of-resident computes to ~$18,252/yr, but that's a derived number, not an official published one). Source: https://bursar.arizona.edu/sites/default/files/tuition_chart_fy_27.pdf
- **Oregon State University (`osu`)**: Confirmed active via admissions.oregonstate.edu/wue, BUT it's a **competitive scholarship, not a guaranteed discount** — OSU's own page states "only about 30% of students from WUE-eligible states... will be offered the WUE Scholarship." 2026-27 COA: Resident $38,568 / Non-Resident $65,013. No official WUE dollar figure published (150%-of-resident computes to ~$24,102/yr base tuition, again a derived not official number).
- **Arizona State University (`asu`)**: Officially ending WUE for students admitted Fall 2026 onward (confirmed directly on admission.asu.edu/wue, not just the news article). Replacement is the "ASU Commitment Scholarship," valued at **$5,500–$7,500/yr** (a range, not the flat $7,500 the Arizona State Press reported). Official 2026-27 Tempe nonresident COA: **$63,394** total ($39,262 tuition+fees + $18,819 housing/food + $5,313 books/personal). No 2027-28 rates or scholarship terms published yet as of 2026-09-05 — his actual application cycle's terms are still unknown and must stay flagged null/TBD, not projected.

**Decision needed:** how to represent "competitive/capacity-limited, not guaranteed" in the WUE pill for UA/OSU (can't just flip `wue:true` the same way `utah`/`unr` are flagged, since those may be more guaranteed — not independently re-confirmed this session), and whether/how to update ASU's cost numbers given the new scholarship replaces WUE for his cycle.

### B3. The 15 zero-VERD schools — full verification results
(uga, uta, mich, unc, howard, gwu, usf, njit, rowan, temple, fau, mcg, cuny, gram, nyit)

Full per-school data with source URLs for all 5 fields (admit rate, SAT 25-75, out-of-state COA with tuition/housing split, automatic merit tiers, 4-yr grad rate) is in the assistant's prior message in this conversation — 8 of the 15 came back fully clean (UGA, Michigan, UNC, Howard, GW, Rowan, Temple, FAU), 7 have specific fields flagged "not published / could not verify" rather than guessed (UT Austin: admit rate + SAT band — CDS is in an unreadable Box viewer; USF: admit rate + SAT range + 4yr grad — CDS blocked by robots.txt; NJIT: admit rate + SAT range + 4yr grad; Augusta: admit rate + SAT range + merit tiers + clean 4yr grad — only an ambiguously-labeled rate series exists; CUNY/CCNY: SAT range + OOS housing/food + 4yr grad; Grambling: admit rate + SAT/ACT range + clean 4yr grad — same ambiguous-metric issue as Augusta; NYIT: admit rate + SAT range + 4yr grad — none published anywhere found).

**Decision needed:** approve merging this into VERD as-is (with the honest nulls kept as nulls), or want another pass at the specific blocked/ambiguous fields first.

### B4. Real BS/MD program admit rates (to replace the invented `PROGRATE` table)

Checked 20 programs. Only 4 have real, sourceable numbers:
- **NJIT/NJMS 7-year**: 2.6% (19 admitted / 734 applicants, current cycle). Source: https://honors.njit.edu/content/njms-accelerated-bsmd-program-faqs
- **Augusta/MCG Professional Scholars**: ~10% (25 seats / ~250 applicants for the BS/MD pathway specifically), stated as approximate ranges by the school itself, not an exact published %. Source: https://www.augusta.edu/admissions/professionalscholars-faq.php
- **CCNY/CUNY School of Medicine**: 10.4% — but this is a **2021 cohort figure** from a one-time CCNY news release, not a recurring published rate. Must be labeled as dated if used. Source: https://www.ccny.cuny.edu/news/ccnys-cuny-school-medicine-admits-most-diverse-class-its-48-year-history
- **UMKC 6-year BA/MD**: ~7-11% depending on which denominator you use (initial applications vs. completed applications) — school doesn't publish one single rate, so this needs to be disclosed as a self-computed range with the denominator stated. Source: https://med.umkc.edu/academics/degree-and-certificate-programs/ba-md/faqs.html

The other 16 programs (Howard, PSU-J, RPI, GWU, USF, Rowan, Temple, FAU, Grambling, NYIT, Rice/Baylor, Tulane, Case Western PPSP, Brown PLME, Union/Albany, California Northstate) publish **nothing** — no applicant count, no seat-based rate, nothing computable. These should go to `null`, not stay as the current invented estimates.

**Decision needed:** approve dropping `PROGRATE`/`s.prate` entirely and replacing with these 4 real (labeled/caveated) numbers + null everywhere else.

## C. Still fully pending (not started, not researched yet — from the larger consolidated list)

1. Rebuild the chance formula (Safety/Likely/Target/Reach) per-school using each college's actual Common Data Set C7 "relative importance of factors" instead of one generic formula for all 97 — the foundational piece everything else sits on.
2. Demote premed/research/bio/clinical/social scores off the main card into a grouped, clearly-labeled "unverified/subjective" cluster in the detail panel (not deleted).
3. Drop the program band (attainable/stretch/restricted/out) pill and its filter button from the UI, replace BS/MD & Accelerated tab labels with the new real chance scale + a separate "Ineligible" tag for hard-restriction cases (e.g. Grambling's race/eligibility gate).
4. Full detail-panel audit — strip anything else unsourced/irrelevant once 1-3 land.
5. Card + table regrouping into logical sections (Ratings block, Cost block, etc.) — sequenced AFTER 1-4 so it isn't done twice.
6. Realistic-cost verification against forums/real-student reports (Reddit, College Confidential) for all 97 schools — the big one, explicitly tabled for a dedicated time/token pass.
7. Emory "not showing" complaint — confirmed false alarm in the code (Emory is in the SCHOOLS array with a full VERD entry); if still not visible on your screen, check the All Colleges tab (unfiltered) or hard-refresh — the live Vercel site is still v14 anyway (v15 never pushed).

## Current git state (unchanged from before this session — nothing committed)
```
 M DEPLOY.txt
 M README.md
 M index.html
?? data/   (all handoff + verify-batch files, including the new file you're reading now, are untracked)
```
Live Vercel site is still v14 (91 schools). All v15 work (97 schools + everything in this file) exists only on this local machine, uncommitted.

---

## SESSION 2 UPDATE (same day, continued) — "finish the list" pass

All items below verified on disk (node syntax check + grep/DOM checks + a headless Playwright smoke test: page loads with zero console/page errors, all 9 tabs click through clean, reset works, table/card/pathway tab all render).

### Completed this pass
1. **WUE flags + ASU merit** (from session 1's research): `wue:true` set for WSU/UA/OSU; ASU meritName rewritten to describe the real $5,500–$7,500/yr Commitment Scholarship replacing WUE for Fall 2026+; `VERD.asu.merit=5500` added.
2. **15 zero-VERD schools merged** (uga, uta, mich, unc, howard, gwu, usf, njit, rowan, temple, fau, mcg, cuny, gram, nyit) — full admit/SAT/COA/merit/grad4 via `Object.assign(VERD,{...})`, each field sourced or left `null`+noted where genuinely unpublished. **FAU merit set to $0** (verified: automatic non-resident floor requires 3.85 GPA; his 3.67 does not clear it, despite 1440 SAT clearing every test threshold). **Grambling merit set to $7,683** (verified: he clears the top 3.5 GPA/1300 SAT automatic tier).
3. **4 new schools added** (Auburn, Wayne State, Syracuse, University of South Carolina) after full research + a defensibility pass that explicitly rejected Mizzou/UMN/Louisville/UIC (all hard residency-gated for a CA applicant) and Toledo/CU Denver/Tulsa (could not confirm the cited program still exists on any current official page). Roster is now **101 schools** (was 97).
4. **PROGRATE rebuilt**: dropped the invented per-school program-acceptance-rate table entirely. Replaced with the only 4 real, sourced numbers (NJIT/NJMS 2.6%, Augusta/MCG ~10%, CCNY 10.4%-but-2021-dated, UMKC 7–11% self-computed range) each carrying its caveat as a hover tooltip; every other program now honestly shows "not published for this program" instead of a guess.
5. **Ratings demoted, not deleted**: Premed env./Research access/Clinical/Social 1–10 tiles removed from the card face and table columns. All six judgment-call numbers (premed, research, bio, med, clinical, social) now live together in one clearly-labeled detail-panel paragraph: "Judgment-call scores (not measured/sourced data)...". `rating()` itself (the 80/20 blended score) is unchanged and still shown on the card, per your instruction to keep it. **`s.note` and `s.medNote` (the hospital-proximity/research-access prose, e.g. UAB/Heersink, Cleveland Clinic, UPMC, Texas Medical Center) were not touched** — confirmed via a live DOM read of a card's detail panel.
6. **PBAND dropped entirely**: `pbandPill()` card badge, the 4 "Program band" filter chip buttons, `pbandF` state/FKEYS/reset, and the `const PBAND` data block are all gone (grep-confirmed zero references left). The XLSX export's now-dead "Program band" column was removed too.
7. **Filters cleaned up to match**: Social/Research/Clinical minimum-score filters removed (selects + change handlers + `visible()` checks + state init). "Rating ≥" filter kept, since `rating()` stays.
8. **PATHWAYS made dynamic**: added a `bar:{gpa,sat}` (or `null` for genuinely holistic/non-cutoff programs), plus `easy`/`hardGate`/`incollege`/`hardElig` flags, to all 34 entries — reusing the exact verified bar from the Accelerated tab's `ACCEL` array wherever the same school/program appears there. New `pathBand(p)` function mirrors `accelBand()`'s live-slider logic exactly, so BS/MD-pathway bands now move with the GPA/SAT sliders on the Profile tab instead of being frozen text. Added a genuine **"Ineligible"** tag, distinct from "restricted," for the two verified hard-categorical-eligibility cases (UT Dallas PACT — Texas residents by law; Grambling/Meharry — race + economic-disadvantage eligibility gate). Softer "resident-preferred, not confirmed as an absolute bar" cases (UNR, Rutgers, Augusta/CUNY) stayed at their original "restricted"/"stretch" static read rather than being over-flagged. Verified via a Node harness that every one of the 34 entries computes the same band as the original hand-set value at his current stats (3.67/1440) — the two "Ineligible" ones are the only reclassifications, both improvements — and that raising the stat sliders correctly unlocks several (Creighton, Penn State, Baylor, Pitt, Case Western/Rochester) as expected.
9. **Full app smoke test**: headless Chromium load of the finished file — zero page/console errors, all tabs clickable, reset button returns to the full 101-school view, table view headers now match the card face exactly (no premed/research/social/clinical columns), pathway tab pills render "Ineligible" vs "restricted" correctly.

### Still not started (unchanged from session 1, flagging again since not re-confirmed this pass)
- **Item C1 — the big one**: rebuilding the Safety/Likely/Target/Reach `chance()` formula per-school using each college's real Common Data Set Section C7 factor-weighting, instead of one generic formula for all 101 schools. This is the single largest item on your original list and has not been started.
- Realistic-cost verification against forums/real-student cost reports (explicitly tabled by you earlier for a dedicated pass).
- Card/table visual regrouping into sections (Ratings block, Cost block, etc.) — lower priority now that the content itself is cleaned up; the card is functional but still a flat tile grid.
- The Temple/NJIT/GWU/USF/FAU and Augusta/CUNY combined PATHWAYS rows are intentionally left un-split (each bundles several schools with different real bars); their Accelerated-tab entries already have the precise per-school numbers.

### Current git state
Nothing committed yet — same `M index.html`, `M README.md`, `M DEPLOY.txt`, `?? data/` as before. Live Vercel site is still v14/91 schools; this is now v15+/101 schools, all local and uncommitted.

---

## SESSION 3 UPDATE (same day, continued) — the chance-formula rebuild (item C1, "the main one")

This closes out item C1 from session 2's "still not started" list: the Safety/Likely/Target/Reach `chance()` formula now uses each school's own real admissions-factor weighting instead of one generic formula for all 101 schools.

### What changed
- Researched Common Data Set Section C7 ("Relative Importance of Factors") for all 79 non-UC/non-CSU schools, via 5 parallel research passes. **58 of 79 yielded usable, sourced data.** The other 21 (ua, uo, uop, gonz, su, crei, cnu, rpi, siena, hof, uga, vandy, njit, mcg, cuny, nyit, tulane, uab, cub, wayne, syracuse) have no machine-readable CDS published (PDF checkboxes that don't extract, Box/SharePoint-gated documents, .xlsx-only CDS, or no CDS at all) — these fall back to the pre-existing admit-rate-based proxy, unchanged from session 2.
- UC (9 campuses) and CSU (13 campuses) don't publish individual CDS7 forms — they use documented **system-wide** policies instead: UC's "comprehensive review" (~13 factors, no single dominant one, but academic achievement weighted highest overall; confirmed test-blind through the Class of 2027 cycle, under Regents review for possible reinstatement as early as Class of 2029) and CSU's permanently test-blind (2022 Title 5 amendment) hybrid model — GPA/A-G formula-driven, with holistic factors applied only near cutoffs at impacted campuses (SDSU, Cal Poly SLO, Cal Poly Pomona). Sourced and encoded as shared per-system values rather than researched individually.
- Added a new `CDS7` data object (80 entries: 58 real CDS + 9 UC + 13 CSU) keyed by school id, each holding a holistic-weight ratio, a test-score-share ratio, the CDS year, and the source URL/policy citation.
- Rewrote `chance()`: the GPA-vs-SAT blend is no longer a flat 50/50 — it's weighted by each school's actual `testShare` from its own CDS (e.g., a school that says test scores matter little blends mostly on GPA).
- Rewrote `holisticMult()`: the EC/rigor/AP/hooks bonus is now scaled by each school's real holistic-weight ratio (essays+recs+EC+talent+character) instead of inferring holism purely from the admit rate.
- Rewrote `whyBand()`: the "Why [band]" explanation on each card now states whether the number came from that school's own published CDS (with year) or is a fallback estimate, and the card's tooltip shows the source URL directly.
- Updated the "How to read this" note on The List tab to explain the new methodology and flag which schools use real vs. fallback data.
- Fixed two leftover dead references to the old "Weights tab" (removed in session 2) in tooltip text.

### Validation performed
- Node-level unit test of the extracted `CDS7`/`chance`/`holisticMult`/`whyBand` functions across 9 representative schools spanning very-low-holistic (Penn State 0.118, USF 0.074) to very-high-holistic (Cornell 0.6, JHU/WashU 0.571) real CDS weights, plus UC, CSU, and fallback cases — all produced differentiated, plausible bands.
- Full headless Playwright load of the live app: zero console/page errors across all 9 tabs (Profile, The List, All Colleges, Compare, True Cost, BS/MD pathway, Accelerated, Timeline, Method), no forbidden names in the DOM.
- Slider-reactivity test in the actual rendered app (not just the isolated function test): raising GPA 3.67→4.0 and SAT 1440→1550 correctly moved Johns Hopkins 3%→13% (Reach, high holistic weight so stats move it less), Penn State 59%→96% (Likely→Safety, low holistic weight so stats dominate), San Diego State 44%→82% (Target→Safety, CSU stat-driven model) — and correctly left UCLA unchanged (5%→5%), since UC is test-blind and driven only by the separate UC-weighted-GPA slider, not the general GPA/SAT sliders.

### Result
Item C1 is done. 80 of 101 schools' Safety/Likely/Target/Reach bands are now computed from that specific school's own disclosed admissions-factor weighting (or its system-wide UC/CSU policy); the remaining 21 use the same admit-rate-based fallback as before, clearly flagged in the card's "Why [band]" tooltip.

### Current git state
Still nothing committed — `M index.html` (now includes session 3's chance-formula rebuild on top of session 2's changes), `?? data/`. Live Vercel site is still v14/91 schools; local is v15+/101 schools with the new per-school chance formula, all uncommitted.

---

## SESSION 4 UPDATE (same day, continued) — decoupling program chance from raw admit rate, real BS/MD data pass, weighted-GPA fix

Triggered by a real bug found on Drexel: the card showed "Safety 80%" for Drexel next to a "BS/MD" chip and a note calling the BS/MD track a "stretch" at 3.75 GPA — three inconsistent signals for two different applications (general admission vs. the separate BS/MD Early Assurance program), with the BS/MD numbers themselves unsourced guesses.

### Root cause
Drexel's general 80% admit rate is genuinely correct for both general admission AND declaring the Biology/premed major (confirmed: Drexel has no separate admissions gate for that major). The formal BS/MD program is a completely separate, much harder application run by the College of Medicine's own admissions committee (mandatory interview) — its real rate is ~2.7% (66 admitted of 2,406 applicants), not the 3.75 GPA "stretch" previously coded.

### Design changes agreed with the user
1. **Weighted GPA unified**: retired the UC-only weighted GPA (was defaulting to 4.10); the same slider now defaults to his real standard weighted GPA (4.27) and is used for UC/CSU AND for any other school/program that states its bar in weighted-GPA terms.
2. **One chance formula for both tracks**: general admission and formal BS/MD/EA programs now use the same percentile-based math (floor = published minimum, upper anchor = published average-admit, extrapolated beyond it) with the same EC/holistic weighting applied by default — excluded only where a specific program's own data shows it's a pure stats gate. Where a real published admit rate exists (from real applicant+admit counts), that rate drives the band directly instead of a percentile estimate. Safety is reachable for a program if the math genuinely computes that high — no hardcoded ban — with a standing footnote that interview/committee-gated programs can still reject strong-stat applicants.
3. **Never fabricate**: where no real minimum+average or real rate is published for a program, the app now shows "no data" and displays the general admission chance as the honest reference, instead of estimating a number with nothing behind it.
4. **Dual-track display**: schools offering both a regular/premed track and a formal program now show both — general admit rate and program-specific chance — side by side, in both card and table view, with the program badge no longer implying the formal program is the school's only path.

### Real research completed (Sep 2026 pass, all sourced, "NOT PUBLISHED" recorded honestly where nothing exists)
- **Drexel BA/BS+MD**: real minimum 3.5 weighted GPA / 1420 SAT; real average admitted 4.22 weighted GPA / 1523 SAT; real rate 66/2,406 ≈ 2.7%. Source: drexel.edu.
- **Brown PLME**: no official minimum published; real rate 84/3,827 ≈ 2.19% (Class of 2026 cycle, Brown Daily Herald reporting on Brown's own released figures).
- **Rice/Baylor Medical Scholars**: DISCONTINUED — Rice ended participation starting Fall 2022. Removed from active consideration.
- **Hofstra 4+4 Zucker**: real minimum 3.7 unweighted GPA / SAT 1410; ~2,000 express interest annually for a class of 10–15 (~0.6% derived).
- **Baylor²Baylor**: real minimum 3.7 unweighted GPA (or top 5% class) / SAT 1430; admits 6/yr (applicant count not published).
- **Pitt Guaranteed Admit**: real minimum SAT 1500/ACT 34; no numeric GPA published.
- **CNU BS-MD (3+4)**: confirmed real minimum 3.9 unweighted GPA / SAT 1450 (already correct, re-verified).
- **UConn SPiM**: real minimum 3.5 unweighted GPA; no SAT/ACT floor published.
- **Union College LIM**: real minimum SAT 1410; no GPA minimum published.
- **Rutgers NJMS 7-yr**: real minimum SAT 1400, top-10%-class-rank (not GPA-based); corrected an unsourced "NJ-favored" claim — official pages show a citizenship requirement, not state residency.
- **UC Merced SJV PRIME+**: 12 seats/yr confirmed; 3.6→3.7 GPA is a progression floor, not confirmed as the entry bar; explicit San Joaquin Valley residency restriction (9 counties).
- **RPI Physician-Scientist**: CORRECTED — no numeric GPA/SAT bar published anywhere official; the previous 3.8/1450 figure (in both the PATHWAYS and Accelerated-tab data) was an unsourced guess, now removed from both.
- **Rochester REMS**: no minimum published; official page states a "typical" (not minimum) 3.95 unweighted GPA — previously miscoded as if it were a cutoff.
- **UNR**: CORRECTED — the app previously conflated UNR's "Post-Baccalaureate Pathway" (for people who already hold a degree) with the real undergrad-facing "PiM + Assured Seat" track; neither publishes numeric criteria.
- **Loyola Chicago Stritch EAP, Case Western PPSP, Stony Brook Scholars for Medicine, Tulane Creative Premedical Scholars**: no numeric GPA/SAT minimums published on any official page (Tulane's 3.6 is a COLLEGE GPA applied for in sophomore year, not usable against his HS stats at all). A third-party site's claimed Stony Brook numbers (4.00/1490) were checked and rejected as self-contradictory with Stony Brook's own official page.
- Every one of the above programs confirmed to offer a normal, non-program path into the same premed-track major independent of the formal program.

### Validated
Full Playwright pass across all 9 tabs: zero console/page errors, no forbidden names, table view dual-track display confirmed working (Drexel row shows "+BS/MD ~3% (Reach) program-specific"), card view confirmed working, Rice shows "Discontinued", Brown shows real "2% (Reach)", CNU/Hofstra/Pitt correctly show "Ineligible" (his stats don't clear their real minimums), RPI/Rutgers/UConn correctly show "No data" rather than a fabricated number. One real regression caught and fixed during validation: nulling out RPI's old fabricated bar in the Accelerated-tab data crashed that tab's rendering (unguarded `.bar.gpa`/`.bar.sat` access) — added null-safe guards there. One process note: an earlier batch of 9 corrections (Union, RPI-pathways, CNU-pathways, Loyola, UNR, UC Merced, Rutgers, Stony Brook, Hofstra-pathways) silently failed to persist despite the edit script reporting success — caught by re-verifying directly against the file rather than trusting the script output, then reapplied and reconfirmed.

### Still deferred (explicitly, not dropped)
- The full JSON-per-school data architecture migration (one file per school + shared config + schema validator + build step + permanent raw-scrape archive) — approved in principle, sequenced as a Phase 2 after this data model settled, to avoid migrating twice.
- Penn State PMM was not re-researched this pass (already had reasonably solid sourced data from an earlier session); left as-is.
