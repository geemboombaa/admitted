# Self-improve backlog — STAGE 2 (sourcing, web ON, official sources only)

Format: `- [ ] <task>` pending, `- [x] <task>` done. One item = one iteration = one commit (or revert).
(Stage 1 backlog complete — its items are in git history: Batch A + Batch B, all committed.)

**Stage 2 rule (RULES.md + loop --web): OFFICIAL SOURCES ONLY.** WebSearch/WebFetch allowed, but hard numbers
(admit rate, SAT 25/75, OOS COA + tuition/housing split, auto merit, 4-yr grad) may come ONLY from the school's
own site / Common Data Set / official bursar / IPEDS / College Scorecard. No forums, blogs, ranking aggregators,
student papers. Every published number keeps a src URL to the official page. Can't find an official source →
leave null/EST, log to GAPS.md. Never fabricate. Goal: raise the computed data-quality score (checkpoint-report.js).

Run with: `./scripts/self-improve-loop.sh --web --batch=N`

## Batch C — the 9 zero-VERD schools (verify 5 core fields from official sources, add verifiedFacts w/ per-field src)
Ordered easy→hard; the last two are flagged where prior research found the official CDS blocked.
- [x] Source University of Michigan (mich) 5 core fields from official Michigan CDS + cost-of-attendance pages; add verifiedFacts with a src URL per field.
- [x] Source UNC Chapel Hill (unc) 5 core fields from official UNC CDS + cost pages; add verifiedFacts with per-field src.
- [ ] Source University of Georgia (uga) 5 core fields from official UGA CDS + cost pages; add verifiedFacts with per-field src.
- [ ] Populate Auburn (auburn) verifiedFacts from official Auburn CDS (ir.auburn.edu) + 2026-27 cost PDF; correct COA to the official figure; per-field src.
- [ ] Source Syracuse (syracuse) 5 core fields from official Syracuse CDS + cost pages; add verifiedFacts with per-field src.
- [ ] Source University of South Carolina (usc_sc) 5 core fields from official USC CDS + cost pages; add verifiedFacts with per-field src.
- [ ] Source Wayne State (wayne) 5 core fields from official Wayne State CDS + cost pages; add verifiedFacts with per-field src.
- [ ] Source UT Austin (uta) 5 core fields from official sources; prior research flagged the CDS behind a Box viewer — if truly unreachable officially, source what IPEDS/College Scorecard publishes and leave the rest null + GAPS.
- [ ] Source CCNY/CUNY (cuny) 5 core fields from official sources; prior research flagged SAT range + OOS housing + 4-yr grad as unpublished — source what's official, null the rest + GAPS.

## Batch D — add missing src URLs to already-merged verifiedFacts (Stage 1 merged values without sources)
(each: add an official src URL to every merged field lacking one; correct any that official sources contradict)
- [ ] Add official src URLs to howard verifiedFacts fields.
- [ ] Add official src URLs to gwu verifiedFacts fields.
- [ ] Add official src URLs to usf verifiedFacts fields (prior research flagged CDS robots-blocked — use IPEDS/Scorecard where the official site is blocked).
- [ ] Add official src URLs to njit verifiedFacts fields.
- [ ] Add official src URLs to rowan verifiedFacts fields.
- [ ] Add official src URLs to temple verifiedFacts fields.
- [ ] Add official src URLs to fau verifiedFacts fields.
- [ ] Add official src URLs to mcg verifiedFacts fields.
- [ ] Add official src URLs to gram verifiedFacts fields.
- [ ] Add official src URLs to nyit verifiedFacts fields.

<!-- Add new items above this line, one per line, using the exact "- [ ] " prefix. -->
