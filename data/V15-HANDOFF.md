# v15 build handoff — resume point (2026-09-04)

App: /home/user/medtrack/medtrack.html (v14, 91 schools, tests in test.mjs/test.cjs, deploy/ + zip flow proven).
All verified research is in /home/user/medtrack/data/verify-batch1..6.json (source URL per value; null = unverified, never invent).

## Approved v15 scope (user's directions, all approved)
1. Merge verified numbers into SCHOOLS for all ~91 schools (admit, SAT band, COA, tuition/fees, housing/food, merit, grad4). Field-level source map; any unverified field gets an ESTIMATE badge (amber "EST" pill on card + per-field list in card detail + audit table in Method tab). Never invent data.
2. Defaults → GPA 3.67 / SAT 1440 (migration pv4). Everything stays dynamic (chance/fit/bands/accel fit already recompute from sliders); remove hardcoded "3.55/1330" strings; merit tooltips reference current sliders.
3. No need-based aid implied anywhere (family over the cutoffs): cost = sticker − merit. Named exceptions only as notes.
4. Realistic-cost toggle: shared room / insurance waived (use verified per-school SHIP amounts from batch2 where known, flat estimate flagged elsewhere) / realistic books-travel. All flagged estimate.
5. Add 6 schools from batch5: rice, tulane, uab, bama, ohst, cub. UAB $22,500/yr and Alabama $28,000/yr are VERIFIED AUTO tiers he qualifies for (3.5+/1420+). Tulane EAP (Creative Premedical Scholars, no MCAT, sophomore year) noted.
6. Accelerated re-bands from batch6: CNU 3+4 → out (3.9UW/1450/5 APs); Temple 3+4 → not-a-HS-program (college sophomore linkage 3.6/509 MCAT); GWU → 8-yr now; NJMS min 1490 single-sitting → out; UMKC avg 3.9/1420, 10-15 OOS seats → stretch; Rowan 3+4 min 3.5/1350 superscored → he qualifies; NYIT merit tier $28k/yr verified; Grambling program restricted (Black/African American + disadvantaged) → restricted band; MCG min 3.7/1450 + GA pref → out/restricted; Howard unchanged (qualifies, invitation-only). Creighton (main list) → out-of-band (3.8 gate).
7. UC: fall-2026 admit rates + weighted-capped GPA bands from batch2 (add weighted-GPA input; user will supply son's weighted UC GPA — not yet provided); UCLA Life Sciences ~11%; UCSD bio NOT capped (remove/never add cap note); exact COA with waivable SHIP amounts.
8. "How they decide" one-liner per school + yield-protection flag (CWRU, NEU, Tulane, BU, Miami) + submit/withhold vs school's SAT 25th (dynamic vs S.sat).
9. Naviance per-school override field (empty; user sends scattergrams later).
10. Dropped: loan-split modeling, ELC, residency lever (one-line Utah note only).
11. After build: update test.mjs/test.cjs (badges, new counts: 97 schools, re-bands, dynamic checks), run suite (expect only CDN failure), republish sanitized zip admitted-v15.zip (strip "Hrithik"/"Prans"), give PowerShell push steps (one command per line).

## Workflow rules (standing)
Propose → wait for approval → build → validate with Playwright suite → sanitized zip → upload instructions. Plain English, no unexplained acronyms, tabulated numbered outputs, never fabricate data.
