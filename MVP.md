# MVP — admitted (path to a fundable product)

*The build spec. Reads with `VISION.md` (north star). This file = what to build, in what order, to reach a
demoable, retainable, VC-pitchable product fastest.*

---

## 0. The reframe (the out-of-box move)

**The MVP is NOT "a complete app." It's the smallest thing that manufactures the 3 proofs a pre-seed VC
funds:** (1) retention, (2) the data flywheel turning, (3) willingness to pay. Every MVP feature must emit
one of those signals or it's cut.

Current state: a live web app (101 schools, verified data, linear `chance()` engine) + two HTML prototypes.
Real bones — but **no AI-native spine, no users, no flywheel.** That's the gap to close.

---

## 1. Faster-TTM accelerators (each kills weeks)

| Move | Why |
|--|--|
| **Ship web PWA first, NOT native iOS** | Native = SMS 10DLC carrier reg (1–3+ days) + Apple enrollment (~48h) + App Store review + age-verification compliance — external queues before **one** user sees it. Web sidesteps every gate, iterates instantly, shareable by link = **built-in virality.** Moat = data+flywheel+AI grounding — none needs native. Defer native past the pitch. |
| **Buy/reuse the whole stack** | Claude API (Haiku grounded / Sonnet planning) · 101 schools = **no vector DB, load into context** · College Scorecard API (free federal) for net-price + major ROI · BLS + AAMC data for outcomes · phone-OTP via Clerk/Twilio, or magic-link to cut friction. Don't build infra the problem doesn't need. |
| **The demo IS the product** | AI-native web = the VC demo is opening the link and talking to it. No slideware to engineer. |
| **Near-peer mentors + AI bootstrap the marketplace** | AI covers the empty side (volume, routine Qs); recently-admitted students handle the 10% needing a human. Cold-start solved; mentor-booking = the willingness-to-pay meter. |

---

## 2. The AI-native spine (build this first — everything hangs off it)

A single agent loop with **grounded tools**. The LLM never emits a number; it calls a tool and renders the
verified result.

- **Tools:** `getSchool(id)` · `chance(profile,school)` · `cost(profile,school)` · `attrition(program)` ·
  `path(career)` · `outcomes(major|specialty)` · `search(filters)` · `updateProfile(fields)` ·
  `addToList()` · `verifyFact()`.
- **Grounding contract (system prompt):** forbidden to state any number not returned by a tool; every figure
  carries a verified/EST badge + source; unknown → "not in our data," never a guess.
- **Generative UI:** tool results render as cards (chance, plan, compare, path) — not text walls.
- **User model:** persistent profile + goal + trajectory + anxiety state, updated every turn.
- **Model routing:** Haiku for grounded lookups + explaining existing data; Sonnet/Opus for planning.
- **Adversarial test every build:** a generative model *wants* to fill gaps — the independent reviewer checks
  no fabricated number shipped (this is what the self-improve loop's reviewer is for).

---

## 3. MVP scope — the AI-native honest premed counselor (web PWA)

Each row emits a proof. **P0 = must-have to be the product.**

| # | Feature | Emits | Pri |
|--|--|--|:--:|
| 1 | Conversational onboarding → live user model (grad yr, GPA, SAT/TO, coursework, ECs, goal=MD) | engagement | P0 |
| 2 | **Grounded chance** — dual-track, band+range, tool-called, never fabricated, verified/EST + source | "it's honest" moment | P0 |
| 3 | **BS/MD attrition truth (G1)** where sourced; honest "not published" otherwise | the differentiator | P0 |
| 4 | **What-flips-it** coach — exact GPA/SAT delta + honest ceiling (`admit*1.71` clamped .96) | actionable value | P0 |
| 5 | Agentic apply-list builder ("build me a balanced list") + all-reach flag | delight/retention | P0 |
| 6 | BS/MD eligibility gate + program cluster (off `program.bar`, 16 schools) | wedge | P0 |
| 7 | **Family net-price + major ROI (G6/G7)** via Scorecard, EST-badged | parent buy-in | P0 |
| 8 | **Path-to-practice (read-only)** — 5-gate map + skills-per-gate + BLS/AAMC/Scorecard outcome data (G13–G15) | jaw-drop demo | P0 |
| 9 | Proactive re-engagement ("your next 3 things" + one email/SMS nudge) | **retention proof** | P0 |
| 10 | Crowd-verify woven into chat | **flywheel proof** | P0 |
| 11 | Reciprocity-gated freshness **or** mentor-interest capture | **willingness-to-pay proof** | P0 |
| 12 | Minor-data consent flow (hosted-model disclosure, master doc §4.7) | compliance | P0 |

**Underneath (data/engine work the above needs):**
- BUG-A fix already shipped (verified value per field). Still needed: **H13 validator gate** (fail build if
  a verified field ships the rough value; feed verified admit into `chance()`).
- Pass through discarded JSON fields the wedge needs: `program.req/bar/type`, `programVerified.admitRatePct`
  (3 real: Brown 2.19% / Drexel 2.7% / Hofstra 0.6%), `accel.ugYrs/mcat/resid`, `affiliatedMedCost`.
- Wire the outcome-data adapters: College Scorecard (net-price, earnings, debt by major), BLS (physician
  wage/demand), AAMC (match rates) — sourced, cached, EST-badged where derived.

---

## 4. Deferred past the pitch (explicitly NOT MVP)

Native app + App Store/age-gate (web sidesteps) · content feed · full mentor marketplace · **employer/
residency connect (G16)** · counselor mode · international · essay AI · submission integration ·
Research/News/Scholarships bubbles. All real, all later — see `VISION.md` horizons.

---

## 5. VC-pitch readiness — what a pre-seed check funds, and how the MVP feeds it

| VC needs | Evidence the MVP produces |
|--|--|
| Wedge with pull | Retention curve on real premed kids (start: the one real student → his school/cohort) |
| A moat | Flywheel turning: N facts crowd-verified; **specialty/program-level + whole-funnel data nobody else has** |
| Willingness to pay | Waitlist for mentor booking / freshness unlocks / parent conversions |
| Why now | AI collapses counseling to ~$0 marginal; minor-data/age laws (Jan 2026) = compliance moat |
| Market | $150–$2,500/hr counseling + $429–$623/student enrollment-marketing budget; 9.4M Common App subs; Naviance ~35% but school-gated (the opening); **TAM expands admissions → workforce/outcomes via G13–G16** |
| Narrative | "The AI counselor that can't lie" → "from premed to practicing" |

---

## 6. Build order (dependency, not calendar — no invented timelines)

1. **AI-native spine** (§2) + **H13 validator gate** + pass-through the discarded wedge fields.
2. **Feature #2 grounded chance agent** — the honesty moment + the demo. Wires the existing engine to the spine.
3. **#3 attrition + #4 what-flips-it + #6 eligibility gate** — the BS/MD wedge, honest.
4. **#1 onboarding + user model + #12 consent** — real users can start.
5. **#7 cost/ROI + #8 path-to-practice** — the employability jaw-drop (free public data).
6. **#5 list builder + #9 proactive + #10 crowd-verify + #11 willingness signal** — the 3 pitch proofs.
7. Get it in front of the one real student → his cohort. Measure retention. Iterate.

Each step: adversarial-review before commit; no fabricated number ships; commit one unit at a time.
