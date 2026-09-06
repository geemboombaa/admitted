# Self-improve backlog

Format the loop script depends on exactly: `- [ ] <one-line task>` = pending, `- [x] <same text>` = done.
One item = one loop iteration = one commit (or one rejection). Keep each item scoped to something that
survives `node scripts/validate.js` and one independent review pass on its own -- "add these 12 schools"
is not one item, it's twelve.

Seeded from data/PENDING-RESEARCH-2026-09-05.md (Section B, not yet merged) -- real candidates already
researched with sources, not placeholders. Verify each source is still live before the loop trusts it.

- [ ] Add Auburn University as a school entry in data/schools/ -- confirmed absent from the current 101-school roster per data/PENDING-RESEARCH-2026-09-05.md Section B1; verify admit rate, SAT band, COA, merit, grad rate against official Auburn sources and Common Data Set before adding, with a src URL on every numeric field per data/schema/school.schema.json.
- [ ] Add Wayne State University's "Wayne Med-Direct" direct-admit BS/MD program -- source: https://provost.wayne.edu/wayne-med-direct/program-overview (data/PENDING-RESEARCH-2026-09-05.md Section B1, item 1).
- [ ] Add University of Missouri (Columbia) "Bryant Scholars Pre-Admissions Program" (early assurance, distinct from UMKC already on the list) -- source: https://medicine.missouri.edu/offices-programs/admissions/bryant-pre-admissions-program (Section B1, item 2).
- [ ] Add Texas A&M University "Engineering to Engineered Medicine (E2EnMed)" -- source: https://myapparchitect.com/complete-bs-md-school-list/ (Section B1, item 3).
- [ ] Add University of Toledo "BACC2MD" direct-admit BS/MD -- source: https://bridge2md.com/program-guide/ (Section B1, item 4).
- [ ] Add University of Illinois Chicago "Guaranteed Professional Program Admissions (GPPA)" -- source: https://bridge2md.com/program-guide/ (Section B1, item 5).
- [ ] Add University of Minnesota "BA/MD Scholars Program" -- source: https://admissions.tc.umn.edu/academics/special-programs/bamd-scholars-program (Section B1, item 6).
- [ ] Add Brooklyn College (CUNY) "Coordinated BA-MD Program" with SUNY Downstate (distinct from the CCNY/CUNY School of Medicine program already listed) -- source: https://www.brooklyn.edu/honors-academy/ba-md/ (Section B1, item 7).
- [ ] Add Syracuse University's combined BS/MD with SUNY Upstate Medical University (since 2022) -- source: https://www.upstate.edu/com/special_opps/bs-md-program.php (Section B1, item 8).
- [ ] Add University of Colorado Denver (Anschutz) "BA/BS-MD Program" (distinct from CU Boulder, already listed -- Denver is the actual home campus of this pathway) -- source: https://clas.ucdenver.edu/health-professions-programs/babs-md-program-information (Section B1, item 9).
- [ ] Add University of Louisville "GEMS" (Guaranteed Entrance to Medical School) -- source: https://bridge2md.com/program-guide/ (Section B1, item 10).
- [ ] Add University of South Carolina "Accelerated Undergraduate to MD Program" -- source: https://bridge2md.com/program-guide/ (Section B1, item 11).
- [ ] Add University of Tulsa "Early Careers in Medicine" (early assurance with OU/OSU medical schools) -- source: https://myapparchitect.com/complete-bs-md-school-list/ (Section B1, item 12).
- [ ] Verify and, if needed, correct the University of Arizona WUE entry -- data/PENDING-RESEARCH-2026-09-05.md Section B2 found it's "limited participation" (competitive, capacity-limited, not a guaranteed rate) with no official published 2026-27 WUE dollar figure; the ~$18,252/yr figure on file is a derived 150%-of-resident calculation, not an official line item -- confirm the entry's src/estimate labeling reflects that distinction honestly.

<!-- Add new items above this line, one per line, using the exact "- [ ] " prefix. -->
