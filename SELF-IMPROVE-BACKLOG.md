# Self-improve backlog — STAGE 1 (local data only)

Format the loop depends on exactly: `- [ ] <one-line task>` = pending, `- [x] <same text>` = done.
One item = one loop iteration = one commit (or one revert).

**Stage 1 rule (see RULES.md): LOCAL DATA ONLY.** Sources allowed: `data/verify-batch1-6.json`,
`data/PENDING-RESEARCH-2026-09-05.md`, existing `data/schools/*.json`. No web. If a required value is
not in a local file, the builder appends it to `GAPS.md` and leaves the field EST-flagged — never fetched,
never invented. Every merged number keeps its `src` URL.

Web-dependent work (new schools, the 5 no-local-data verifications) lives in `GAPS.md`, NOT here.

## Batch A — inline-sourced fixes (numbers live directly in PENDING-RESEARCH)
- [x] Replace the invented PROGRATE/program-admit-rate values with the 4 real sourced BS/MD rates from PENDING-RESEARCH B4 (NJIT/NJMS 2.6%, Augusta/MCG ~10%, CCNY/CUNY 10.4% labeled 2021-dated, UMKC 6yr ~7-11% self-computed range with denominator stated) and set every other program's rate to null; keep each number's src URL; do not invent the 16 unpublished ones.
- [x] Fix the University of Arizona (ua) WUE representation per PENDING-RESEARCH B2: mark it competitive/limited-participation (not a guaranteed rate), keep the ~$18,252/yr as an explicitly-derived estimate (150% of resident), src the FY27 bursar chart; do not present it as an official published figure.
- [x] Fix the Oregon State (osu) WUE representation per PENDING-RESEARCH B2: competitive scholarship (~30% of eligible students offered), not a guaranteed discount; COA resident $38,568 / non-resident $65,013; any WUE dollar figure flagged derived-estimate, not official.
- [ ] Update Arizona State (asu) per PENDING-RESEARCH B2: WUE ends for Fall-2026+ entrants, replaced by ASU Commitment Scholarship $5,500-$7,500/yr (range); 2026-27 Tempe nonresident COA $63,394 ($39,262 tuition+fees + $18,819 housing/food + $5,313 books/personal); leave 2027-28/his-cycle terms null/TBD, not projected.

## Batch B — merge existing local verify-batch data into zero-VERD schools
(each: merge whatever data/verify-batch*.json holds for the school into its data/schools/<id>.json
verifiedFacts with per-field src; any of the 5 core fields not present locally -> GAPS.md, leave EST)
- [ ] Merge local verify-batch data into howard (data/schools/howard.json verifiedFacts is null).
- [ ] Merge local verify-batch data into gwu (verifiedFacts null).
- [ ] Merge local verify-batch data into usf (verifiedFacts null).
- [ ] Merge local verify-batch data into njit (verifiedFacts null).
- [ ] Merge local verify-batch data into rowan (verifiedFacts null).
- [ ] Merge local verify-batch data into temple (verifiedFacts null).
- [ ] Merge local verify-batch data into fau (verifiedFacts null).
- [ ] Merge local verify-batch data into mcg (verifiedFacts null).
- [ ] Merge local verify-batch data into gram (verifiedFacts null).
- [ ] Merge local verify-batch data into nyit (verifiedFacts null).

<!-- Add new items above this line, one per line, using the exact "- [ ] " prefix. -->
