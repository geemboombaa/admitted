# CP-0 CHANGES — what the innovation pass turned up (2026-09-07)

Synthesized from 6 independent critic lenses (first-90s · JTBD · BS/MD-expert · competitor · IA-cut ·
trust). Each change tagged by type and the lens(es) that raised it. **Convergent** = found independently by
2+ lenses (higher confidence). Two items are **VERIFIED BUGS** (confirmed in code, not opinion).

## 🔴 Critical — verified in code, fix first
1. **[BUG] App shows UNVERIFIED numbers under a "✓ VERIFIED" badge.** `make-app-data.js:25,29` emits
   `general.admit/coa` (rough) not `verifiedFacts.*` (verified). SDSU ships 39% / $34,000; the *verified*
   values 37.4% / $37,324 are discarded. Also `verified` is a single per-school boolean, so one verified
   fact badges the whole school. **This makes RUBRIC A.1 false.** Fix = generator emits the verified value
   per field + emits `vf` (which fields). Local-only, no web. *(trust; convergent w/ competitor, IA)*
2. **[BUG] The BS/MD moat is NOT blocked on data — the generator throws it away.** `make-app-data.js:30`
   reduces `program` to `{name}`, dropping `program.req/bar/type/hardGate`, `programVerified.admitRatePct`
   (Brown PLME 2.19%, Drexel 2.7% — real, sourced), `accel.mcat/resid/ugYrs`, `affiliatedMedCost`. **RUBRIC
   #11/#14 "[~] BLOCKED ON DATA" is wrong.** Fix = pass the fields through. Un-blocks the wedge with zero web
   pulls. *(BS/MD-expert; convergent w/ JTBD, competitor, IA)*

## 🟠 The reframe, sharpened (convergent across lenses)
3. **Show PROGRAM odds, not undergrad odds, on BS/MD schools.** `chance()` returns the ~5% undergrad rate for
   Brown; the real PLME program rate is 2.19% (in the data). Two labeled gates: "Undergrad admit" vs "Med-seat
   linkage / program rate", program rate shown where `programVerified.admitRatePct` exists, honest "not
   publishable" state otherwise. *convergent: BS/MD, competitor, trust* — **new-requirement**
4. **Cut the physics-bubble Map and the swipe Deck.** ~25% of the code, ~0% decision value; the Map is the
   literal front door yet SPEC says bubbles are a surface. IA → **3 tabs: List (home, dials+filters) · BS/MD
   (the moat) · My List (the decision)** + Compare as a cross-cutting action. *IA; convergent w/ competitor* —
   **cut** (deletes RUBRIC #17, #18; rewrites #19, #20 onto the List)
5. **Chance as a band + range, not a false-precise single %.** A linear, non-outcome-fitted model can't
   honestly carry "63%". Lead with the band label + a range ("Target · ~30–45%"), keep the position marker.
   *trust* — **ux-rethink**
6. **Reprioritize the rubric wedge-first.** Order: #0 (engine-honesty) → A.1 fix (verified values) → #6a
   (first-90s) → #2 (trust visible) → #13 (BS/MD cluster) → program-gate/odds → #10 (compare) → then surfaces.
   Stop iterating on bubble/deck polish. *convergent: IA, competitor, JTBD* — **reprioritize**

## 🟡 BS/MD decision layer (the moat, now buildable)
7. **Program-eligibility gate, separate from chance:** compare user GPA/SAT vs `program.bar` → Below / Meets /
   Not-published. Undergrad-in ≠ program-in (3.8/1300 is "Target" undergrad but below Baylor's 1430 gate). *BS/MD*
8. **BS/MD focused cluster** (RUBRIC #13): the 33 program schools as their own view — program name + guarantee
   type + MCAT status + accelerated-years + residency, sortable by program odds. *BS/MD, competitor, IA*
9. **Guarantee-type badge:** Guaranteed-seat vs Interview-only (Creighton) vs Binding (UConn) vs Conditional.
   A huge distinction currently flattened into prose. *BS/MD* — **add**
10. **MCAT status** (waived / threshold / match-mean) and **residency gate** (CA applicant long-shot at
    MO/GA/NY-reserved seats) surfaced as chips. Structured for 15 `accel` schools now. *BS/MD* — **add**
11. **True cost over the BS/MD horizon:** `affiliatedMedCost × med-years` on top of undergrad net, framed as
    "~7-year cost to MD", EST-badged; accelerated (7yr) vs traditional (8yr). Buildable for 15 accel schools
    now. Un-blocks #11 for that subset. *BS/MD, JTBD, competitor* — **new-requirement**
12. **Two-track portfolio balance:** BS/MD-programs (lottery) vs traditional-premed (safety net), and flag
    "5 BS/MD reaches, 0 traditional safety" — the classic all-reach trap. *JTBD, BS/MD* — **new-requirement**

## 🟢 Trust made felt (mostly generator un-discards)
13. **Per-field verified/EST inline** (retire the whole-school badge), **data vintage** (`cds7.y`), and
    **real source-on-tap** (`cds7.src`, not a homepage link) — all exist in JSON, all discarded today. *trust*
14. **Mark subjective scores** (premed/research/bio/social, unsourced) as "our read", and disclose they drive
    the sort. *trust* — **new-requirement**
15. **"Why this number" expander** naming base rate + position + "this is a heuristic, not a prediction". *trust*

## 🔵 Workflow completion + retention
16. **First read = ONE named BS/MD school chanced** (Target band), not the Map. Cut priorities from cold-start
    (defer to a tune-up). Persist partial onboarding (don't make an anxious teen restart). *first-90s* — makes
    RUBRIC #6a actually happen (code currently lands on the Map)
17. **Application-status tracker** (Researching → Essays → Ready → Submitted) — the workflow's missing end; the
    weekly-return hook after novelty fades. *JTBD* — **add**
18. **Parent cost-conversation:** a shareable, cost-ranked "full-journey" summary (parent holds the checkbook).
    *JTBD* — **add**
19. **Compare mode** (RUBRIC #10), default axis BS/MD-vs-traditional. *competitor, IA* — **reprioritize (build now)**

## New local data-structuring tasks (Stage-1 legal — parse existing prose into fields)
- MCAT / residency / guarantee-type / science-GPA retention for the ~18 program-only (non-accel) schools live
  in `program.req`/`program.type` prose → extract to fields. No web pull.
- Genuinely still missing (future web): program length for the ~18 non-accel program schools; historical
  program attrition rates. These stay real gaps.

## Count: 19 distinct accepted changes + 2 verified bugs. (This is the anti-thin-3 test — passed.)

---

## RED-TEAM VERDICT (independent adversarial critic, verified in code) — corrected plan
Both bugs CONFIRMED. But the critic caught real problems; the plan is corrected:

**Scope corrections (verified):**
- BUG B overstated: only **3 schools** have a numeric program rate (Brown 2.19% newspaper-sourced, Drexel
  2.7% institutional, Hofstra 0.6% *derived, not published*). Not 33. And `progChance()` does not exist — #3
  is a BUILD, not "un-discard a field". The wedge's real local value = **eligibility gate on 16 `program.bar`
  schools + the cluster view**, NOT fleet-wide program rates.
- Cost-to-MD (#11): `accel.ugYrs` is non-null on **15** schools but **NULL on Brown/Drexel** — don't multiply
  by a missing year count on the flagship schools.

**🚫 DANGEROUS — would ship fabricated data (do NOT build as runtime features):**
- #9 guarantee-type badge, #10 MCAT/residency chips: `program.type`/`req` are FREE PROSE. Deriving a
  categorical verdict at runtime = RULES #1 violation. Allowed ONLY as reviewed data-structuring (add a real
  structured field first), never a runtime string-match.
- #3 program odds: distinguish source quality (Drexel institutional vs Brown newspaper vs Hofstra derived) —
  don't render all three as equal "verified" rates. Build the honest "not published" state FIRST.

**✂️ CUT before build (scope creep, not CP-0 trust-core):** #17 status tracker, #18 parent share → defer.
**↩️ DON'T delete Map/Deck** — demote + stop iterating, keep reachable. Deleting code to shrink the
denominator inflates MET/total without building anything (metric-gaming). (Corrects RUBRIC #17/#18, H11.)

**➕ MISSING — the most important change all 6 lenses missed:** a **validator assertion** — `validate.js`
must FAIL when the app ships `general.X` for any field where `X ∈ vf` (i.e. shown value ≠ `verifiedFacts.X`).
That's what makes the trust fix STAY true. Plus: `chance()` (`app.html:393`) itself reads the *unverified*
`general.admit` — fixing the badge but not the computation leaves a stale duplicate. (New criterion H13.)

**H6 range:** label it a heuristic; endpoints = the band's own interval, not an invented ±.
**H12 flag:** "BS/MD + Target band" may be unsatisfiable (marquee BS/MD are Reach) — pick an achievable school.

### Corrected top-3 to build FIRST (ranked by the critic):
1. **BUG A fix + validator vf-equality gate + feed verified admit into `chance()`** (H1+H13). Restores AND
   locks the trust premise; mechanically verifiable; fixes a live wrong-number-under-verified-badge.
2. **Per-field verified/EST + vintage + real source-on-tap** (H7) — touches every school, all data exists.
3. **Program-eligibility gate off `program.bar`** (H3, 16 schools) — ABOVE program-odds (#3, only 3 schools).
