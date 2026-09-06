# Admitted — Commercial Product Roadmap

*Research-grounded feature roadmap, MVP definition, and phased plan. Sources cited throughout — nothing below is guessed.*

## 1. Why this can work — the research, in brief

| # | Finding | Source |
|---|---|---|
| 1 | The category is dominated by **school-licensed platforms** (Naviance ~35% of US high schools, 8M+ students; Scoir) that are free to students but **inaccessible if your school doesn't pay for one** — a real, documented gap for motivated families/students without one. | BusinessWire, Scoir |
| 2 | The #1 documented user complaint across the category is **chancing accuracy** — CollegeVine sits at 1.9/5 on Trustpilot with repeated reports of schools mislabeled "safety" despite sub-30% real admit rates. | Trustpilot |
| 3 | Naviance carries a **documented data-privacy/surveillance reputation problem** (UC Irvine research; students found gaming mandated-use quotas) and is called "antiquated" even by switching schools. | UCI Informatics, Scoir |
| 4 | **No public dataset exists at the specialty/major level** (engineering, nursing, business admission difficulty) — Common Data Sets only report institution-wide numbers. This is a genuine, uncontested data gap, not something 3 competitors already do well. | Research finding, no counter-source found |
| 5 | Private counseling costs **$150–$2,500/hr**, comprehensive packages **$6,500–$120,000+**. Common App alone processed 9.4M applications in 2025-26. The underlying demand and willingness-to-pay is real and large. | Private Prep 2026 report, Inside Higher Ed |
| 6 | **Scraping public admissions pages/CDS PDFs is low legal risk** (hiQ v. LinkedIn: CFAA doesn't cover public data; real exposure is contract/ToS, manageable by respecting robots.txt and citing sources — which a crowdsourced/attributed model does anyway). No lawsuit found against any existing CDS-aggregator (Niche, College Transitions, etc.). | hiQ v. LinkedIn (9th Cir.), White & Case |
| 7 | **"Integrate with college DBs for submission/tracking" is not buildable by an independent developer today.** Common App's API (CAPN) requires a formal partnership already held by Naviance/Scoir/MaiaLearning; Slate and Parchment are closed, institution-only. This is a multi-year business-development goal, not an MVP feature — flagged throughout below. | Common App, Technolutions, Parchment docs |
| 8 | A **real, free, official federal API already exists** for the "beyond scores — job outcomes, debt, real completion rates" idea: the College Scorecard API (`api.data.gov`), per-institution *and* per-major, actively maintained (last updated April 2025). This can ship far sooner than scraped "reality check" data. | collegescorecard.ed.gov |
| 9 | r/ApplyingToCollege has ~1.3M members and is growing; College Confidential (the old dedicated community) shows real decline signals (users posting "is this forum dead"). **Room exists for a better community**, but no evidence people want it *inside* an admissions app specifically vs. staying on Reddit — flagged as an unvalidated assumption to test cheaply, not build big. | gummysearch.com, College Confidential forums |
| 10 | New **state "App Store Accountability Acts"** (TX, UT, LA, CA — Jan 2026) require age-verification/parental consent for apps used by minors via Apple's Declared Age Range API / Google's Play Age Signals API. This is a **launch-blocking compliance item**, not a v2 nice-to-have, since every user of this app is a minor. | App Store Accountability Acts tracker |

**Bottom line on your instinct:** real scraped-and-sourced data, crowd-verified, with timelines and cost attached, *is* a legitimate, under-served differentiator — finding #2 and #4 back it directly. No major competitor is doing specialty-level, source-cited, crowd-corrected data well. That should stay the spine of v1.

---

## 2. Your full idea list, tabulated and horizon-mapped

Every item from your notes, mapped to when it realistically belongs and why.

| # | Idea (as you wrote it) | Horizon | Why |
|---|---|---|---|
| 1 | More schools per specialty (eng, finance, etc.) | **MVP** | Directly extends the existing web app's data model; the real differentiator (finding #4) — no new infra needed, just more sourced data. |
| 2 | Cost of college journey broken down | **MVP** | Already built and working in the web app (True Cost engine) — port it, don't rebuild it. |
| 3 | Timelines for colleges | **MVP** | Already exists in the web app (Timeline tab) — port it. Pair with local push notifications (device-side, no external integration needed). |
| 4 | Filter/sort, different skins | **MVP** | Cheap, standard iOS work; skins = a real retention lever (let a student re-skin something they use daily) and trivially compliant/safe. |
| 5 | Ability for notification, texts, reminders, follow-ups with colleges | **MVP (device-local only)** | Local notifications for deadlines = trivial. "Follow-ups *with colleges*" (i.e., actually messaging admissions offices) is a different, much bigger feature — deferred, see #14 below. |
| 6 | High school integration — directly grabbing GPA/SAT, tracking | **Short-term, manual first** | No public API exists for this (finding #7's sibling problem — school SIS systems are as closed as Slate). Ship manual entry at MVP; "auto-import" becomes a per-SIS-vendor partnership project later, same category as Common App integration. |
| 7 | Detailed college research beyond scores — teaching, admissions reality, job outcomes, diversity | **Short-term** | The College Scorecard API (finding #8) makes the job-outcomes/debt/completion part shippable fast and free. "Reality of teaching" (quality, not just scores) has no clean public dataset — that part should be crowdsourced reviews, later, not scraped. |
| 8 | AI features (unscoped) | **Short-term, one narrow feature first** | See Section 3 — don't ship "AI" as a vague bucket; ship one scoped thing (an explain-my-chance-number chat grounded ONLY in the school's own real data) and expand from evidence, not hype. |
| 9 | Multi-kid mode for parents | **Short-term** | Straightforward account/profile-switching UI work, no new data or legal surface. |
| 10 | Ability to request recommendations | **Short-term, template/reminder only** | Ship as a checklist + templated request email/text the *student* sends themselves — not a platform that talks to teachers on your behalf (that's a FERPA/liability surface, see Section 4). |
| 11 | Practicality vs. what's on the college board — what's real | **Short-term** | This is finding #4 + #8 combined: crowd-corrected data (your instinct) layered on top of College Scorecard's real outcome data. This *is* the differentiator, formalized. |
| 12 | International schools | **Year 1–2** | Real expansion, but doubles the data-sourcing problem (different formats, no CDS-equivalent abroad) — do it once the domestic sourcing pipeline is proven, not before. |
| 13 | Guiding essay writings | **Year 1–2, human+AI hybrid** | Even CollegeVine — the market leader here — is on record preferring human review over pure AI grading for essays. Follow that evidence, don't lead with a pure-AI essay grader. |
| 14 | Social tab — people talk about colleges, AI interprets/answers | **Year 1–2** | Community features have a cold-start problem (need users before the tab has any value) — sequence this *after* MVP has real users, and pilot small (e.g., per-school threads) before a full social product. Demand is plausible (finding #9) but unvalidated for "in-app" specifically. |
| 15 | Integrating with other college boards, Reddit, etc. | **Year 1–2, read-only aggregation** | Realistic version: surface/link relevant Reddit/College Confidential threads for a school, not a deep two-way integration (no such API relationship exists to build on). |
| 16 | Counselor collaboration — text, assignments, email, back-and-forth | **Year 2+ / strategic decision** | This is a business-model pivot, not a feature — it puts you in direct competition with Naviance/Scoir's entrenched, free-to-student, school-licensed model (finding #1). Needs its own go/no-go decision (Section 5), not a checkbox. |
| 17 | Expert voices for hire — guiding, counseling | **Year 2+** | A real marketplace: vetting, liability insurance, payments, background checks. Needs its own cold-start/unit-economics pass before committing — flagged, not scoped here. |
| 18 | Robot mode / counselor mode / student mode — full HS-to-college-and-beyond platform | **Year 2+, north star** | The long-term vision is coherent, but it's the sum of items 6, 16, 17, 19, 20 below — not a feature to build directly. Treat it as the destination the roadmap is walking toward. |
| 19 | Integrating with college DBs for submission tracking | **Year 2+, partnership-gated** | Confirmed not independently buildable (finding #7). Only becomes real if/when a CAPN-style partnership is negotiated — track it as a business-development milestone, not an engineering ticket. |
| 20 | Post-admission: track journey, help kid grow/network/find jobs | **Year 2+** | Real and valuable, but it's a second product surface (post-enrollment) — sequence after the pre-admission product has traction. |
| 21 | Real student community of review and help | **Year 2+** | Same cold-start caveat as #14; a credible "reviews" feature also needs a moderation/anti-abuse plan before launch, which is nontrivial for a minors-only app. |
| 22 | Todo lists for kids | **MVP, folded into existing scope** | Not a separate feature — this is what the Timeline/deadline tracking (#3) plus application checklist (#6) already are. Don't build a third, disconnected to-do system. |

---

## 3. On "adding some AI" — a scoped recommendation, not a guess

You said you don't know what AI features to add. Based on what's actually shipping (not hypothetical) elsewhere in this category:

1. **CollegeVine's "Sage"** does GPA/test-weighted matching — you already have a more transparent, source-cited version of this in the web app's chance engine. Don't copy their opacity; your "why this band" explainer is already the differentiated version of this.
2. **Orbit's "Solvi"** is a full AI-counselor chat product — the most direct competitor to a broad "AI features" push. Going head-to-head there on day one is high-risk with no data moat yet.
3. **The one AI feature grounded in your own real advantage**: a chat that answers questions using *only* the school's own sourced data already in the app (e.g., "why is Drexel's BS/MD a Reach when general admission is a Safety?") — this is retrieval-grounded, not a general chancing black box, sidesteps the #1 industry complaint (finding #2), and is a natural extension of the "why this band" text already built. Ship this narrow version first; expand only once you can see whether people actually use it.
4. Do **not** lead with AI essay grading — the category's own market leader avoids it in favor of human review (finding #3 in Section 3's numbering / the CollegeVine FAQ finding above).

---

## 4. Compliance flags to resolve *before* launch, not after

| # | Flag | Action needed |
|---|---|---|
| 1 | Every user is a minor | Implement Apple's Declared Age Range API and Google's Play Age Signals API — required in TX/UT/LA/CA as of Jan 2026, and the safest default regardless of where a user is. |
| 2 | Storing GPA/SAT + any future school-provided data | If you ever ingest data *from* a school (not just student self-entry), FERPA applies — data-return/destruction terms, no secondary use (this rules out using school-provided data to train an AI model without explicit consent). |
| 3 | Scraping | Respect robots.txt, avoid login-walled admissions portals, keep the source-link/attribution model (which you already want for the crowdsourcing feature) — this is what keeps the low-risk profile low. |
| 4 | Recommendation-letter / counselor-messaging features | Ship as student-initiated templates/reminders (item 10 above), not a platform that stores or transmits communications on a minor's behalf — that's a much heavier privacy and liability surface. |
| 5 | Any future vertical content feed (Section 8) | CA SB976 (upheld by 9th Cir., full regime Jan 1, 2027) and NY's SAFE for Kids Act (final rules, effective Jan 25, 2027) both require a non-personalized/chronological default feed for under-18 users absent verified parental consent. Design the feed ranking around this from day one — it's cheaper to build chronological-first than to retrofit compliance later. |

---

## 5. MVP definition — what actually ships for App Store launch

**Everything else in this document is explicitly *not* MVP.** The MVP is:

1. College search/filter/list with the existing web app's real chance model (general admission), ported natively.
2. Dual-track admission display (general vs. BS/MD/specialty program) — the fix already validated in the web app.
3. Sourced data with visible citations and a verified/estimated distinction on every number — the trust layer that *is* the differentiator.
4. More schools per specialty (engineering, business, nursing, CS to start) using real sources (ASEE, Poets&Quants, individual program pages) — extending, not replacing, the existing data model.
5. Cost-of-journey breakdown and college timelines — both already built in the web app, ported not reinvented.
6. Shortlist + local deadline notifications + basic application checklist (manual entry) — the realistic version of "todo lists" and "reminders," with zero dependency on any unavailable college-DB API.
7. Manual GPA/SAT/profile entry (no auto-import — not available per finding #7).
8. Filters, sort, and at least one alternate visual theme.
9. Age-verification/parental-consent flow (Section 4, item 1) — required, not optional, for App Store approval given every user is a minor.
10. CloudKit sync for a single user's own data across their devices.

**Deliberately excluded from MVP** (and why): AI chat (needs the data model live first), community/social (cold-start), counselor collaboration (business-model decision, Section 6), expert marketplace (needs its own vetting/legal build-out), college-DB submission sync (not accessible to an indie developer), auto-import of grades/scores (no API), international schools (data pipeline not proven yet domestically), **the curated content feed / monetization engine (Section 8) — needs an audience to serve content to and a legal compliance read before any code is written, neither of which exist at MVP.**

---

## 6. Phased roadmap

| Phase | Timeframe | Focus | Key items |
|---|---|---|---|
| **MVP** | Launch | Trust + core utility | Section 5, items 1–10 |
| **Short-term** | 6–12 months post-launch | Prove the data differentiator, add narrow AI | Crowdsourced correction/verification flow, College Scorecard outcome data integration, one scoped AI chat feature (Section 3, item 3), multi-kid parent mode, recommendation-request templates |
| **Year 1–2** | 12–24 months | Expand surface area, test community cheaply, launch the content engine | International schools, essay-guidance (human+AI hybrid), small-scale per-school community pilot (not a full social product yet), read-only Reddit/College Confidential link aggregation, **curated vertical content feed (Section 8) — the primary monetization engine** |
| **Year 2+ / strategic bets** | 24+ months, each needs its own go/no-go | Business-model-level decisions | Counselor-collaboration mode (competes with Naviance/Scoir — needs a real strategy call), expert marketplace (needs its own unit-economics/cold-start analysis), college-DB partnership (business development, not engineering), post-admission journey/networking product |

---

## 8. Monetization engine — the curated vertical feed ("white-collar TikTok")

Your framing: same physical *feel* as TikTok — vertical, swipeable, fast, built to be watched in a scroll session, not a YouTube-style library you browse and click into. But two structural choices make that feel legal and on-brand instead of a liability:

1. **Content only enters through an editorial approval pipeline — there is no open upload.** Admissions-officer AMAs, entrepreneurship interviews, "day in the life" clips, tips/tricks, sponsored college content — all vetted before anything is queued. This is what removes the TikTok-scale trust & safety problem from Section 4: there's no open UGC firehose to moderate, because nothing goes live without a human/automated pre-screen first. If a student-submission tier is added later, it goes through the same queue — submitted, never live-first.
2. **The default feed order for under-18 users is chronological/curated-sequence, not an engagement-optimized personalization algorithm.** That is specifically the line SB976 and NY's SAFE for Kids Act draw — both require a *non-personalized* default feed for minors, not a ban on vertical/swipe UI itself. Keep the swipe mechanic, drop the behavioral-ranking engine, and the "doom scroll vibe" survives without tripping the mechanic regulators are targeting. **This reading needs a real legal review against the final regs (CA's land Jan 1, 2027; NY's Jan 25, 2027) before you build on it — treat it as a strong hypothesis, not a cleared fact.**

**Content policy — written down, not "we'll know it when we see it":** hard bans on nudity/sexual content, profanity, violence, dangerous stunts, drugs/alcohol, enforced by an automated pre-screen plus human review before anything is scheduled. This is a real rubric to draft with legal input, not a vibe.

**Precedent that this shape already works:** Snapchat's Discover tab — curated, publisher-vetted, vertically swipeable — has run at real scale for years without being an open-algorithmic-UGC feed. That's the closer comparison than TikTok itself.

**Monetization — reuses the lever from Section 1, not a new one:** sponsored/branded content slots colleges pay for out of the same $429–$623/student/year enrollment-marketing budget already spent industry-wide, plus contextual (not behavioral-profile) ads matched to the content playing rather than to a data profile built on a minor — sidestepping the minor-targeted-behavioral-advertising scrutiny that's a separate, live regulatory thread from the feed-algorithm laws.

**The real bottleneck — plan for it, don't gloss over it:** a curated pipeline needs a constant supply of new, vetted content. That's an ongoing production/licensing/creator-partnership cost, not a one-time engineering build — the actual constraint on this engine is content supply, not the app code.

**Sequencing:** Year 1–2, after the MVP has proven the admissions-data trust layer and built a real audience — a content engine before there's anyone to watch it is supply with no demand.

---

## 9. Open questions this document deliberately leaves open

1. **Counselor mode is a business-model fork, not a feature.** Building it means either (a) selling into schools like Naviance/Scoir do — a completely different sales motion than a consumer App Store app, or (b) building an independent counselor-facing tool that competes with free incumbents. Worth a dedicated strategy session before any engineering starts on it.
2. **Expert-marketplace liability** (background checks, insurance, payment disputes, what happens if a paid "expert" gives bad advice to a minor) needs real legal input, not just a product decision.
3. **Community demand is a real assumption, not a confirmed one** — cheapest way to test it is a small per-school discussion thread in Year 1, not a built-out social product.
4. **Which specialty verticals first** (engineering/business/nursing/CS) is a data-availability question as much as a demand one — ASEE and Poets&Quants make engineering and business the most immediately sourceable; nursing and CS need their own source audit before committing.
5. **The chronological-vs-personalized legal distinction in Section 8 is this document's judgment call, not legal advice** — get a real compliance read on the final SB976/NY SAFE Act regs before writing a line of feed-ranking code.
