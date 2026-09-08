# VISION — admitted

*North-star spec. Supersedes the narrow "INNOVATION-RESULTS" table. Where this conflicts with older docs,
this + `MVP.md` win. Source paper-trail: `Claude outputs/admitted-master-requirements.md`,
`PRODUCT-VISION.md`, `INNOVATION-RESULTS.md`, `CHANGES.md`.*

---

## 1. The one-liner (what a VC repeats to their partner)

> **The AI premed counselor that can't lie.**
> Honest odds a $2,500/hr consultant would give — grounded in verified data it's *architecturally forbidden
> to fabricate* — for free. And it doesn't stop at "you got in":

> **From premed to practicing — honest odds at every gate, and the skills to clear them.**

Admission is **gate 1 of 4**, not the finish line. The job-to-be-done is a **career (an employed doctor)**,
not a campus. We carry the kid the whole arc:

**admit → graduate/retain → license → match → practice**

- **Wedge:** BS/MD premed, California (highest anxiety, highest willingness-to-pay, most measurable outcomes).
- **Moat:** a specialty/program-level, crowd-verified, whole-funnel (admit→wage) **data flywheel** no
  incumbent can copy — school-gated players (Naviance/Scoir) can't reach consumers; ad-driven players
  (CollegeVine, 1.9/5 Trustpilot) won't tell the truth.
- **Why now:** AI collapses 1:1 counseling to ~$0 marginal cost for the first time; minor-data/age laws
  (Jan 2026) form a **compliance moat = barrier to entry**, not just a blocker.

Keep the full platform as the "where this goes" slide. Lead with the one line.

---

## 2. AI-native — what it is, and what changes

**AI-native ≠ a chatbot in the corner.** The current bubble-home + swipe-deck + "why" chat is a traditional
app with AI bolted on. AI-native means:

| Traditional (what exists) | AI-native (the target) |
|--|--|
| User navigates menus/tabs/bubbles | User states intent; the agent assembles the answer |
| Screens pre-built (Compare tab, Cost tab) | Screens generated on demand (the agent produces the plan, comparison, chance) |
| Request → response | Live model of the student; acts proactively ("your Drexel odds moved, here's why") |
| AI answers questions | AI does multi-step work — build my list, plan junior year, find scholarships, draft rec request |
| Moat = features | Moat = proprietary grounding data + a loop that gets smarter every use |

**What concretely changes for admitted:**
1. **The conversation is the spine, not a feature.** Bubbles/swipe/tabs demote to *artifacts the agent
   renders* — this is why RUBRIC's "demote Map/Deck" was right: they were never the product.
2. **The chance engine + verified data become the agent's tools.** The agent *calls* `chance()`; it never
   types a number itself.
3. **Onboarding never ends.** Every interaction refines the user model (profile, goal, trajectory, anxiety).
4. **Every conversation is a data event** — crowd-verification asked in natural flow; the flywheel turns by
   *using* the app. The product gets smarter per use = the AI-native flywheel.
5. **Retention = the agent re-engaging** ("3 things to do this week," "deadline in 10 days," "new attrition
   data on your #1"), not push you configure.

---

## 3. The spine: "AI-native but never lies" (the technical crux + the un-fakeable demo)

The whole company in one architectural decision. LLMs hallucinate college numbers because they generate
freely. Ours won't:

- **Single agent loop with grounded tools:** `getSchool()`, `chance(profile,school)`, `cost(profile,school)`,
  `attrition(program)`, `path(career)`, `outcomes(major/specialty)`, `search(filters)`, `updateProfile()`,
  `addToList()`, `verifyFact()`.
- **Grounding contract:** the model is *forbidden* to emit any number it didn't get from a tool call. Every
  figure = a tool result with a verified/EST badge + source. Unknown → "not in our data," never a guess.
- **Generative UI:** answers render as cards (chance, plan, compare, path), not text walls.
- **Model routing:** cheap/grounded model for lookups + explaining existing data; strong model for
  planning/reasoning. Boundary = "does it need fresh data," NOT model size. (Locked in master doc.)

**Why it matters:** the demo *is* the product and can't be faked in a slide. Open the link → it calls a
marquee BS/MD program a **Reach** to the kid's face, gives the exact GPA delta to move it, shows the source —
live, 30 seconds. Honesty enforced by architecture is a moat you can *show*.

---

## 4. The requirement universe — everything, prioritized

Legend — **Horizon:** H0 (trust core / MVP) · H1 (the journey) · H2 (the humans) · H3 (platform+money) ·
H4 (expansion). **Pri:** P0 (MVP-critical) · P1 (short) · P2 (year 1–2) · P3 (strategic bet).

### 4a. Original brain-dump (your 22 ideas + UX spec — all captured, nothing lost)

| # | Idea (your words) | Horizon | Pri |
|--|--|:--:|:--:|
| 1 | More schools per specialty (eng, finance, nursing, CS) | H1 | P1 |
| 2 | Cost of college journey broken down | H0/H1 | P0 |
| 3 | Timelines for colleges | H1 | P1 |
| 4 | Filter/sort, different skins | H1 | P1 |
| 5 | Notifications/texts/reminders (device-local) | H1 | P1 |
| 6 | HS integration — auto-grab GPA/SAT (manual first, no API) | H1 | P1 |
| 7 | Research beyond scores — teaching, outcomes, diversity | H1 | P1 |
| 8 | AI features (scoped, not a vague bucket) | H0 | P0 |
| 9 | Multi-kid mode for parents | H2 | P1 |
| 10 | Request recommendations (student-initiated templates only) | H2 | P2 |
| 11 | Practicality vs College Board — what's real (crowd-corrected) | H1 | P1 |
| 12 | International schools | H4 | P3 |
| 13 | Essay guidance (human+AI hybrid) | H2 | P2 |
| 14 | Social tab | H2 | P2 |
| 15 | Reddit/College-Confidential aggregation (read-only) | H2 | P2 |
| 16 | Counselor collaboration mode (business-model fork) | H3 | P3 |
| 17 | Expert voices for hire (marketplace) | H2/H3 | P2 |
| 18 | Full HS-to-beyond platform, counselor/student modes (north star) | H3 | P3 |
| 19 | College-DB submission integration (partnership-gated, biz-dev) | H3 | P3 |
| 20 | Post-admission journey / networking | H4 | P3 |
| 21 | Real student community (moderation plan first) | H2 | P2 |
| 22 | Todo lists for kids (= Timeline + checklist, don't rebuild) | H1 | P1 |

**UX spec (captured):** phone+OTP auth (no name/email/age/DOB) · omnipresent AI assistant (text/voice) ·
conversational profile builder + editable profile screen · bubble home · swipe cards · flip-card detail ·
on-device-vs-hosted privacy decision for minor data.

### 4b. Additions I contributed (out-of-box — not in the dump)

| + | Addition | Insight | Who does it | Horizon | Pri |
|--|--|--|--|:--:|:--:|
| G1 | **BS/MD attrition truth** — the wash-out: GPA/MCAT retention cliffs, % who actually reach the MD seat | Every tool sells the front door; none shows the trapdoor. Most honest + most defensible wedge | Nobody | H0 | P0 |
| G2 | **Reverse funnel** — plan backward from the MD seat to grade 9/10/11/12 | Kid is buying a doctor career, not picking a college | Consultants by hand ($$$) | H1 | P1 |
| G3 | **Trajectory, not snapshot** — projected chance on current slope vs if he changes | Chancing is a photo; admissions is a movie | CollegeVine = 1 static number | H0 | P0 |
| G4 | **Rigor optimizer** — which AP/honors a *specific program* rewards (off its own CDS rigor weight) | The `cds7` data is already in the JSON | Nobody at program level | H1 | P1 |
| G5 | **Clinical-hours / EC gap analysis** vs admitted premed profiles | Premed is uniquely measurable (shadow/research/clinical hrs) | Nobody premed-specific | H1 | P1 |
| G6 | **Family net-price + aid modeling** (real out-of-pocket, not sticker) | Sticker is a lie everyone knows; Scorecard ships real net-price free | Niche = sticker-ish | H0/H1 | P0 |
| G7 | **Major-level ROI / debt payback** | Scorecard has per-major earnings + debt; parents fund on this | Almost nobody at major level | H1 | P1 |
| G8 | **Peer-mentor marketplace** — recently-admitted students as supply | Solves marketplace cold-start AND cost; near-peers cheaper + relatable | Nobody structured | H2 | P2 |
| G9 | **Triangulated second opinion** — our chance vs crowd vs counselor, side by side | Trust through disagreement | Nobody | H2 | P2 |
| G10 | **Data-driven readiness tracker** — per-school checklist auto-built from real reqs | Manual checklists get abandoned; auto ones retain | Naviance is manual | H1 | P1 |
| G11 | **Commitment-cost model for BS/MD** — you lock your life at 17; what flexibility you give up | A trust product must argue against itself | Nobody | H1 | P1 |
| G12 | **The data flywheel, named as the moat** — every use makes data fresher → better product → more users | Not a feature — *why you win*. Incumbents can't copy | Nobody consumer-direct | H3 | P0-thread |
| **G13** | **Employability engine** — every path ends in real comp/demand/match data, not just "you got in" | The JTBD is a career, not a campus. Outcome IS the product | Nobody — college tools stop at admit | H1 | P1 |
| **G14** | **Skills-prep curriculum** tied to the target's *real* requirements — clinical hrs, research, MCAT, Step, specialty prep, sequenced by gate | "Prep along the journey" = a living plan grounded in real reqs, not a generic checklist | Consultants by hand ($$$) | H1 | P1 |
| **G15** | **Outcome-data layer** — BLS wages, AAMC match rates, Scorecard earnings/debt by major, physician demand by geo | Same honest-verified-data moat, extended down the funnel | Almost nobody assembles it honestly | H1 | P1 |
| **G16** | **Employer/residency connection (future)** — prepared candidate meets residency program / employer | Far end of the flywheel: employers pay for prepared talent = pipeline revenue | Nobody in this lane | H3/H4 | P3 |

### 4c. The employability pillar — the path to practice (premed)

The keystone. Log in, say "premed," get the standard chancing **+ the full path + skills-per-gate + honest
outcome data + "am I on track."**

| Gate | Milestone | Skills to prep along the way | Honest outcome data (real, free sources) |
|--|--|--|--|
| 1. Admit | Undergrad + BS/MD | GPA, rigor, clinical/shadow hrs, research, ECs | verified data + **G1 attrition** |
| 2. Graduate | Survive premed, hold guarantee | science-GPA floor, MCAT, retention cliffs | **G1 attrition** — the wash-out truth |
| 3. License | MCAT → med school → Step 1/2 | test prep, specialty exploration | AAMC med-school admit/matriculation |
| 4. Match | Residency match (the real employer gate) | specialty competitiveness, research, aways | **AAMC Match** rates by specialty |
| 5. Practice | Attending — the paycheck | — | **BLS** wage/demand by specialty+geo · **Scorecard** earnings by major |

---

## 5. Market remap — what's out there, what we do better

| Pillar | Incumbent + weakness | Our "do better" |
|--|--|--|
| Chancing | CollegeVine — one fake number, **1.9/5**, mislabels sub-30% "safety" | Personalized dual-track + honest band+range + **attrition truth (G1)** |
| Data | Naviance (~35% US HS), Scoir — **school-gated**, institution-level only | Consumer-direct, **program/specialty-level**, crowd-verified, sourced, time-stamped |
| Cost | Niche True Cost (Nov 2025) — 4-yr, sticker-ish | **Family net-price (G6)** + BS/MD 7–8yr horizon + **debt payback by major (G7)** |
| Counseling | Consultants **$150–$2,500/hr**, packages to $120k | **Peer-mentor marketplace (G8)** + AI + crowd = ~100× cheaper |
| Community | College Confidential / Reddit — unverified, anxiety factory | Structured, verified, moderated, tied to your real profile |
| Outcomes | Nobody ties admission → employment | **G13–G16 employability engine** — the whole funnel to the paycheck |
| Content/growth | Nobody has a compliant under-18 feed | Snapchat-Discover-style curated feed = monetization engine |
| Submission | Common App CAPN — closed to non-partners | Track as biz-dev (finding #6), not MVP — honest about the gate |

---

## 6. Horizons — what unlocks what

| H | Theme | Ships | Gated on prior because |
|--|--|--|--|
| **H0** | Honest chance you can prove | dual-track chance · verified/EST trust layer · **G1 attrition** · what-flips-it/**G3** · BS/MD eligibility gate · cost **G6** | Foundation — nothing stands on numbers people don't believe |
| **H1** | The journey + employability | **G2 reverse funnel** · G4 rigor · G5 EC-gap · G10 auto-tracker · **G13–G15 path-to-practice + outcome data** · timelines · specialty schools · ROI G7 | Worthless until chance is trusted; then it's the daily-return spine |
| **H2** | The humans | parent portal · counselor mode · **G8 peer-mentors** · community · G9 triangulation · essay hybrid · rec templates | Multi-persona only matters once a journey's worth watching |
| **H3** | Platform + money | content feed · scholarships · university partnerships · reciprocity-freshness · **G12 flywheel** · **G16 employer/residency connect** | Needs the audience H1–H2 built |
| **H4** | Expansion | international · all pre-professional · post-admission/med-school continuity | Only scale a machine that works in one vertical |

---

## 7. Honest gaps / risks (not BS — the things that bite)

1. **Attrition data (G1) may not be public** for most BS/MD programs — best wedge, hardest data. Ship where
   sourced, "not published" otherwise. *That honesty is itself the pitch.* Never fake a wash-out rate.
2. **Minor-data + hosted model = consent flow required** even on web (master doc §4.7). Design it in.
3. **No-fabrication vs generative AI is a real fight.** The tool-grounding contract (§3) is the resolution;
   needs adversarial testing every build — the independent-reviewer loop serves this.
4. **Skills path (G14) must tie to REAL requirements**, not an invented curriculum. No-fabrication applies to
   learning plans and outcome data (G15 = sourced only, EST-badged where derived).
5. **Don't promise employer-connect (G16) at MVP.** It's the vision slide + H3/H4. Showing the *path* and
   *data* is real now; the *connection* is future — say so.

---

## 8. Locked decisions (do NOT re-litigate)

- Engine frozen: `chance()` linear `admit*(0.35+1.3*pos)` clamped [0.02,0.96]; bands Safety≥.75/Likely≥.55/
  Target≥.30/Reach; colors Safety `#00ff88` Likely `#00d4ff` Target `#f5a623` Reach `#a855f7`.
  (iOS/web band-threshold reconciliation = a Stage-2 decision, still open.)
- No fabricated data — every number verified-with-source or EST. Stage-1 = local data only.
- Privacy — names "Hrithik"/"Prans" never in shipped copy.
- AI tier boundary = "does it need fresh data," not model size.
- No DOB (grad year drives chancing); age-check via OS age-range signal.
- Ship web PWA first; native is a distribution choice deferred past the pitch (see `MVP.md`).
