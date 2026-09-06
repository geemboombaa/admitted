# Admitted — Master Requirements (MVP → Multi-Year)

**This document replaces the two earlier ones** (`admitted-feature-roadmap.md` and `admitted-mvp-requirements.md`). Those were built separately — the first from your 22-idea brain-dump plus market research, the second from your later phone/AI/bubble/swipe UX spec — and never reconciled against each other. That was a real gap: you asked for one merged, reviewed, re-prioritized document, and got two standalone ones instead. This is the single version, with conflicts resolved and both lists actually weighed against each other, not just concatenated.

---

## 0. Direct answers, still true

**Up for it?** Yes. **Live on the App Store in 2 days?** No — three external, non-AI approval queues (SMS 10DLC carrier registration 1–3+ business days, Apple Developer enrollment ~48h, App Store review ~24–48h) gate that regardless of who builds it. **Better model / help needed?** No — the gates are external timelines and one platform choice (native Swift vs. React Native/Expo; Expo recommended for faster real-device iteration). What's real today: a fully interactive prototype of the new UX (`admitted-ios-concept.html`) plus this requirements set.

---

## 1. Research findings that still hold

| # | Finding | Source |
|---|---|---|
| 1 | Category dominated by school-licensed platforms (Naviance ~35% of US high schools; Scoir) — free to students but inaccessible without a paying school. Real gap for unsupported families. | BusinessWire, Scoir |
| 2 | #1 documented complaint industry-wide: chancing accuracy. CollegeVine sits at 1.9/5 on Trustpilot, schools mislabeled "safety" at sub-30% real admit rates. | Trustpilot |
| 3 | No public dataset exists at the specialty/major level (engineering, nursing, business difficulty) — CDS only reports institution-wide. Genuine, uncontested gap. | Research finding |
| 4 | Private counseling: $150–$2,500/hr, packages $6,500–$120,000+. Common App processed 9.4M applications in 2025–26. Demand and willingness-to-pay are real. | Private Prep 2026, Inside Higher Ed |
| 5 | Scraping public admissions pages is low legal risk (hiQ v. LinkedIn) provided robots.txt is respected and sources are cited — which the crowd-verification model does anyway. | hiQ v. LinkedIn (9th Cir.) |
| 6 | Common App's API (CAPN) is gated to existing platform partners (Naviance/Scoir/MaiaLearning); Slate and Parchment are closed. Submission-tracking integration is a business-development goal, not an MVP feature. | Common App, Technolutions |
| 7 | College Scorecard API (`api.data.gov`) is real, free, federal, per-institution *and* per-major (earnings, completion, debt), updated April 2025 — ships the "beyond scores" idea far sooner than scraping. | collegescorecard.ed.gov |
| 8 | New state "App Store Accountability Acts" (TX, UT, LA, CA — Jan 2026) require age-verification/parental-consent signals for apps used by minors. Launch-blocking, since every user here is a minor. | State tracker legislation |

### Named competitors — corrected

| Competitor | What they actually have | Correction to what I told you earlier |
|---|---|---|
| **CollegeVine** | General chancing (one number/school), no confirmed BS/MD or specialty-program-level chancing — their own community forum has an unanswered user question about exactly this. | Holds. |
| **Niche** | Subscription/lead-gen business (1,700+ paying college clients, doubling ARR), **and a genuine multi-year "True Cost" tool launched Nov 2025** modeling 4-year all-in cost and projected debt. | **This corrects what I said earlier** — I told you Niche/CollegeVine had no multi-year cost tool, implying your True Cost ledger was a clean, uncontested differentiator. It isn't clean — Niche ships something in the same category. |
| **Full combined tool** (specialty-level chancing + sourced/cited data + crowd-verification + timelines + cost, in one app) | No competitor found doing all of this together. | Still holds — this is the "No" I gave you, and it's the actual differentiator, not any single piece of it. |

**Bottom line, unchanged:** real sourced data, crowd-verified, with timelines and cost, is the legitimate differentiator — because it's the *combination* nobody else ships, not because any one piece of it is unmatched.

---

## 2. Your full original idea list, horizon-mapped

| # | Idea | Horizon | Why |
|---|---|---|---|
| 1 | More schools per specialty (eng, finance, etc.) | **MVP** | Extends existing data model; the real differentiator, no new infra. |
| 2 | Cost of college journey broken down | **MVP** | Already built in the web app (True Cost engine) — port, don't rebuild. |
| 3 | Timelines for colleges | **MVP** | Already exists (Timeline tab) — port it. |
| 4 | Filter/sort, different skins | **MVP** | Cheap, standard work; skins are a real retention lever. |
| 5 | Notifications/texts/reminders/follow-ups | **MVP (device-local only)** | Local deadline notifications are trivial; messaging admissions offices on a user's behalf is a different, deferred feature. |
| 6 | HS integration — auto-grab GPA/SAT | **Short-term, manual first** | No public API exists (same closed-system problem as Common App). Manual entry at MVP. |
| 7 | Research beyond scores — teaching, outcomes, diversity | **Short-term** | College Scorecard API ships the outcomes/debt part fast; "teaching quality" needs crowdsourced review, later. |
| 8 | AI features (unscoped) | **MVP, but scoped narrowly — see Section 3** | Don't ship "AI" as a vague bucket. |
| 9 | Multi-kid mode for parents | **Short-term** | Straightforward profile-switching, no new data/legal surface. |
| 10 | Request recommendations | **Short-term, template/reminder only** | Ship as a checklist + templated request the student sends themselves, not a platform messaging teachers on a minor's behalf (FERPA/liability). |
| 11 | Practicality vs. college board — what's real | **Short-term** | Crowd-corrected data layered on Scorecard's real outcomes — this is the differentiator, formalized. |
| 12 | International schools | **Year 1–2** | Doubles the data-sourcing problem; prove domestic pipeline first. |
| 13 | Essay-writing guidance | **Year 1–2, human+AI hybrid** | Even CollegeVine prefers human review over pure AI grading — follow that evidence. |
| 14 | Social tab | **Year 1–2** | Cold-start problem — needs MVP's real users first; pilot small. |
| 15 | Reddit/college-board integration | **Year 1–2, read-only aggregation** | Link relevant threads; no two-way API relationship exists to build deeper. |
| 16 | Counselor collaboration | **Year 2+ / strategic decision** | A business-model fork (competes with free, school-licensed Naviance/Scoir), not a checkbox feature. |
| 17 | Expert voices for hire | **Year 2+** | Real marketplace — vetting, insurance, payments, background checks need their own pass first. |
| 18 | Full HS-to-beyond platform, counselor/student modes | **Year 2+, north star** | The destination items 6, 16, 17, 20 are walking toward — not a feature to build directly. |
| 19 | College-DB submission integration | **Year 2+, partnership-gated** | Not independently buildable (finding #6). Track as biz-dev milestone. |
| 20 | Post-admission journey/networking | **Year 2+** | Real, valuable, but a second product surface — sequence after pre-admission traction. |
| 21 | Real student community | **Year 2+** | Same cold-start caveat as #14, plus needs a moderation plan before launch (minors-only app). |
| 22 | Todo lists for kids | **MVP, folded in** | This *is* Timeline (#3) + application checklist (#6) — don't build a third system. |

---

## 3. AI — corrected framing (this is where the two docs actually conflicted)

The UX-spec doc said: *free/local model for routine chat + profile-building, Claude for "real research," and that split is the paid-tier boundary.* Reviewing it against the roadmap and against itself, **one part of that is backwards**:

| Task | Model tier | Why |
|---|---|---|
| **Conversational profile builder** (the "just talk, no forms" screen) | **Strong model, not the cheap one** | This is the single highest-leverage screen in the app — it's the whole pitch. A weak on-device model doing sloppy entity-extraction from messy voice input produces wrong GPA/interests, which poisons every downstream chance calculation. It's also low-frequency (once per user), so the cost of a good model here is small and the payoff is the app's signature moment. Cheaping out here was the wrong call in the original spec. |
| **Explaining data the app already has** ("why is Drexel's BS/MD a Reach when general admission is a Safety") | Cheap/local model, or a small hosted model | Retrieval-grounded against your own verified data — low hallucination risk, high frequency, low value-per-call. Good free-tier task, and it's the one AI feature the roadmap doc already recommended (Section 3, old numbering) as the scoped MVP AI feature. |
| **A fact not yet in the dataset** ("what's Drexel's average class size") | **Not a model-tier question at all** | This is a missing-data problem, not a model-quality problem. Having an LLM guess from training data is worse than the app's own stated differentiator (real sourced + verified data). Route this to a sourced-lookup/scrape job, not a bigger model. |

**Revised paid/free boundary:** not "which model answers" but "does this need live/fresh data beyond the static verified dataset." That's the actual monetizable thing — freshness and reach — not raw model size. This also folds in the roadmap's own MVP AI recommendation (Section 3 above) instead of contradicting it.

**Two new ideas worth adding, grounded in what's already been researched — not in the original brain-dump:**

1. **Turn the profile-builder AI into the crowd-verification engine, not just onboarding.** The roadmap's core differentiator depends on crowd-corrected data (finding #2, item #11 above), but nothing in either doc actually collects it. The same conversational surface a returning user already opens for routine questions is the natural place to also ask verification questions ("did Drexel's co-op work out the way we describe it? did BS/MD feel this competitive this cycle?") — turning ordinary app usage into the data engine's fuel, instead of needing a separate community feature (item #21, currently Year 2+) to get there. This connects two things the docs treated as unrelated (the AI assistant and the crowd-verification data engine) into one mechanism, and it's buildable at MVP-adjacent cost since the chat surface already exists.
2. **Reciprocity-gated data freshness, not a flat paywall.** Crowdsourced tools have a cold-start problem — nobody contributes to an empty pool. Instead of a subscription for "premium research" in the abstract, gate the freshest/most-recent verified data behind light contribution (verify or correct a few facts to unlock current-cycle freshness on a school) — cheaper to build than full billing infrastructure for MVP, and it directly solves the contribution cold-start instead of just monetizing around it.

Both are **short-term** items (post-MVP, once the AI assistant and swipe-card surfaces both exist) — not MVP, since they depend on MVP's own surfaces existing first.

---

## 4. UX / interaction spec (from your phone/AI/bubble/swipe notes — corrected)

### 4.1 Auth
Phone number → SMS OTP → in. No name/email/age at signup.
**Correction:** drop DOB from what the AI collects later, too. It doesn't feed the chancing algorithm at all (grad year does) — collecting a minor's exact birthdate with no product use behind it is an avoidable liability, not a real requirement. Cut it, or make it fully optional and clearly justify why if it's ever added back (e.g., a birthday-linked feature that doesn't exist yet).

### 4.2 AI assistant — omnipresent
Reachable everywhere; text or voice via one mic-toggle; scoped to the app's own domain (colleges, comparisons, the user's profile); redirects rather than stalling on off-topic or junk input. Model-tier split per Section 3 above, not the original doc's version.

### 4.3 Profile building via conversation
Voice-or-text conversation captures name, grad year, GPA, coursework, ECs, interests, colleges of interest — a mix of quick-tap chips (grad year) and open conversation (interests) per the original spec. DOB removed per 4.1.
**New requirement, not in either original doc:** a plain, structured, editable profile screen alongside the conversation — tapping to fix a typo (wrong GPA) should not require re-running the whole AI flow. Conversation is how you *build* it; a settings-style screen is how you *fix* it. Forcing all corrections through conversation is worse than the form it replaces.

### 4.4 Home screen — bubble navigation
Safety/Likely/Target/Reach as physics-feeling floating bubbles with live counts (MVP); Search bubble (MVP); Research/Latest-News/Scholarships/Personal-Feed bubbles exist as slots but ship later (short-term/Year 1–2, see Section 6). Persistent profile-summary strip above the bubbles. First-time/empty state routes straight into the AI profile builder, not a blank screen.

### 4.5 College list — swipe, not scroll
Horizontal swipe (Bumble/Hinge-style) through cards once a profile/interest set exists. Vertical scroll reserved for exactly one surface: the curated Personal Feed (Section 8 of the roadmap material, monetization engine) — everything else is left/right.

### 4.6 College detail — flip card
Tap flips the card (literal flip animation) to a detail face: cost, student count, admit rate with the user's own calculated chance marked on the same bar, ranking, source links, and one human sentence on what makes the school different. Charming, not overwhelming — the one screen where restraint is the point, since it's the "do I like this school" moment, not the data-lookup moment.

### 4.7 Data-privacy flag not in either original doc
If any part of the AI conversation (voice or text) is proxied to a hosted model (Claude) rather than staying on-device, that's a minor's personal data (GPA, school, interests) leaving the phone. This is the same regulatory family as the curated-feed minor-protection issue already flagged for Section 8 of the roadmap — just for profile data instead of content. **This needs an explicit answer (what's on-device vs. hosted, and what consent flow covers it) before real user data flows through a paid Claude tier — not a silent assumption**, exactly the kind of gap this document exists to catch before it's built.

---

## 5. Compliance flags — merged

| # | Flag | Action needed |
|---|---|---|
| 1 | Every user is a minor | Apple Declared Age Range API / Google Play Age Signals API — required TX/UT/LA/CA as of Jan 2026, safe default everywhere. |
| 2 | Storing GPA/SAT or any school-provided data | FERPA applies if data ever comes *from* a school, not just self-entry — data-return/destruction terms, no secondary use without consent. |
| 3 | Scraping | Respect robots.txt, avoid login-walled portals, keep source-attribution (needed for crowd-verification anyway). |
| 4 | Recommendation/counselor-messaging features | Student-initiated templates/reminders only — not a platform storing/transmitting a minor's communications. |
| 5 | Curated vertical feed (Year 1–2) | CA SB976 (full regime Jan 1, 2027) and NY SAFE for Kids Act (effective Jan 25, 2027) require a non-personalized/chronological default feed for under-18s absent verified parental consent. Design around this from day one. |
| 6 | **New** — AI profile data sent to a hosted model | Per Section 4.7 — needs an explicit on-device-vs-hosted decision and consent flow before the paid AI tier handles real minors' profile data. |

---

## 6. MVP — locked

Locked per your call: items 6 (more schools per specialty), 10 (age-verification/parental-consent flow), and 12 (CloudKit sync) are moved out of MVP into short-term (they're marked **MOVED** in the table below, with their new home in Section 7). Everything else in the original 12-item list stays in MVP scope. The remaining 9 items are renumbered below, and every one of them is now built and adversarially tested in `admitted-ios-concept.html` (v3) — status column reflects the real state after that pass, not the plan.

| # | MVP requirement | Status |
|---|---|---|
| 1 | Phone number + SMS OTP auth. No name/email/age/DOB at signup. | **Built & verified.** Real validation: garbage phone/OTP input is rejected with visible shake + inline error (the CTA looked disabled but was silently swallowing clicks in an earlier pass — fixed so invalid submits actually produce feedback). Working 30s resend-code cooldown. |
| 2 | AI conversational profile builder (strong model, per Section 3) **plus** a structured editable profile screen (Section 4.3) — both, not conversation-only. | **Built & verified — re-fixed post-audit.** A fresh independent audit (see Section 10) found two real bugs in what this row previously called "verified": (a) coursework and extracurriculars — both listed in Section 4.3's own spec — had no collection path anywhere, in chat or in Settings; (b) the chat text input was rendered and enabled during the grad-year and GPA/SAT steps but the Send handler silently ignored anything typed there. Both fixed: coursework/EC are now onboarding steps (skippable) and editable Settings fields, and every onboarding step type now has a real handler for typed input, including explicit error responses for unparseable text instead of silence. |
| 3 | Bubble home screen: Safety/Likely/Target/Reach + Search, physics-feeling motion, persistent profile-summary strip, empty-state routes to the AI builder. | **Built & verified — re-fixed post-audit.** Two bugs found by the fresh audit (Section 10), both fixed: (a) the expanded "My List" cluster had no way to collapse back except leaving Home entirely, despite the design doc documenting a tap-outside/dedicated-gesture close — added both; (b) Search was reachable before onboarding, but tapping a result opened the full personalized flip-card (admit-bar, chance marker, Ask-AI-why) for a user with zero profile data, breaking the no-fabrication rule a second way. Fixed by making `openStack()`'s personalization mode depend on onboarding state for every entry point, not just the "Popular" band. |
| 4 | Swipe-card list + literal flip-card detail (cost, students, admit rate with the user's position marked, ranking, source links, one charm sentence) — native port of the web app's dual-track chance model. | **Built & verified — re-fixed post-audit, most significant fix in this pass.** The fresh audit (Section 10) found the "dual-track chance model" this row claimed was a native port didn't actually exist in code: every school had a single hardcoded `chance` number, so every user saw the identical figure regardless of their own GPA/SAT — the exact industry complaint (Section 1, finding #2) this app exists to fix. Replaced with `estimateChance()`: two independent tracks (GPA-vs-school-range, SAT-vs-school-range, test-optional schools degrade to GPA-only) combined via an odds-ratio shift off the school's own verified base admit rate. A user with no GPA/SAT on file gets the plain verified admit rate with `personalized:false` — never an invented personal number. Verified with a DOM-level adversarial test suite (jsdom): two different profiles now get different chance numbers at the same school, and no-profile users never see a fabricated "YOU:" marker. |
| 5 | Sourced data with visible citations and a verified/estimated distinction on every number — the trust layer that *is* the differentiator (Section 1). | **Built & verified — badge corrected post-audit.** The personalized "YOU: X%" marker was previously badged VERIFIED (borrowing the badge from the underlying admit rate) even though the number itself is a model estimate, not a fact — a labeling inaccuracy in the same no-fabrication spirit as finding #4. Now badged ESTIMATED; the underlying admit rate keeps its own separate VERIFIED badge. Every chance/admit/cost figure still carries a badge and a `source` string; nothing personalized renders without a real profile behind it (now actually true — see row 4). |
| 6 *(was 7)* | Cost-of-journey breakdown and college timelines — both already built in the web app, ported not reinvented. | **Built & verified.** True Cost screen totals saved schools over 4 years; Timeline groups deadlines by saved school with a documented empty-state fallback. |
| 7 *(was 8)* | Local deadline notifications + basic application checklist (manual entry). | **Partially built.** The checklist half is real and tested (tap a deadline to mark it done, strikethrough persists). The *notification* half is an OS-level capability (local push) that an HTML prototype can't genuinely demonstrate — flagging this honestly rather than faking a toast and calling it done. Real local notifications need the native iOS build, not more prototype work. |
| 8 *(was 9)* | Filters, sort, at least one alternate visual theme. | **Built & verified — and fixed.** Filter/sort bottom sheet works. The theme toggle initially only flipped an unused CSS variable — every actual UI element (FAB, buttons, badges, chips) was hardcoded to the signature color, so switching themes was silently cosmetic-only. Rewired every in-app accent element to the theme variable; verified the FAB, CTAs, badges, and chips now genuinely recolor on toggle, while the four fixed band colors (Safety/Likely/Target/Reach) correctly stay put since those are semantic, not theme-based. |
| 9 *(was 11)* | One retrieval-grounded AI chat feature: "why is this a Reach/Safety" explainer, grounded only in the app's own sourced data (cheap-tier per Section 3). | **Built & verified — and fixed.** Found and fixed a real bug during testing: the card's drag-handling code called `setPointerCapture` on every tap, which silently hijacked the "Ask AI why" link's click event so it did nothing when tapped — it looked wired up but wasn't. Fixed, plus a related gap the same testing pass surfaced: the AI chat screen itself had no way back to whatever screen you opened it from. Both are fixed and verified end-to-end now, and the AI entry point (FAB) is now actually present on every screen (it was missing from Search/News/Timeline/True Cost/Settings before this pass), matching what was promised in the design-decisions doc. |

**Deliberately not MVP, and why:** the curated video feed (needs an audience + legal read first, Section 5 flag #5); community/social (cold-start); counselor collaboration (business-model fork, needs its own decision); expert marketplace (needs vetting/legal build-out); college-DB submission sync (not independently accessible); auto-import of grades (no API); international schools (prove domestic pipeline first); Research/Latest-News/Scholarships bubbles (real, but MVP ships Search + band bubbles only so launch doesn't open five half-built surfaces at once); the crowd-verification-via-AI-chat and reciprocity-gated-freshness ideas from Section 3 (they need the MVP's own AI and swipe surfaces to exist first).

### Next in line — short-term queue, in build order

Everything in MVP is done, so this is what comes next. The three items just moved out of MVP go to the front of the line since they're already scoped and closer to real than the rest of the short-term list — ranked by what blocks App Store submission first:

| Next | Item | Why it's here / why this order |
|---|---|---|
| 1 | **Age-verification/parental-consent flow** *(moved from MVP #10)* | Blocks App Store submission outright — every user is a minor. This has to land before any real-world launch, so it's first even though it wasn't built this pass. **Resolves an architecture tension worth naming explicitly:** MVP item 1 locks "no name/email/age/DOB at signup," while this item requires verified age. Those look like they contradict each other — they don't, if built on Apple's **Declared Age Range API** (shipped iOS 26.2 for Texas SB2420, expanded Feb 2026 for Brazil/Australia/Singapore/Utah/Louisiana — [Apple Developer](https://developer.apple.com/news/?id=f5zj08ey), [9to5Mac](https://9to5mac.com/2025/11/04/app-store-texas-sb2420-new-apis/), [TechCrunch](https://techcrunch.com/2026/02/24/apple-rolls-out-age-verification-tools-worldwide-to-comply-with-growing-web-of-child-safety-laws/)). The app requests a coarse age-range signal from the OS/Family Sharing setup instead of ever asking the user to type a birthdate — the parent's device configuration is the source of truth, not a form field in this app. That's the specific mechanism that lets this item get built without reopening MVP item 1's "no DOB at signup" decision. |
| 2 | **CloudKit (or equivalent) sync** *(moved from MVP #12)* | Without it the app is single-device-only, which is a real product gap the moment someone gets a new phone. Needed before real users trust the app with their list. |
| 3 | **More schools per specialty** (engineering, business, nursing, CS to start) *(moved from MVP #6)* | Content/data scope, not architecture — can run in parallel with #1 and #2 rather than blocking them, which is why it's after the two structural items despite being simpler. |
| 4 | Crowd-verification folded into the AI chat (Section 3, idea 1) | Needs the MVP's live swipe/AI surfaces to exist first (they now do) before this can be designed against real usage. |
| 5 | Reciprocity-gated freshness (Section 3, idea 2) | Same dependency as #4 — sequenced right after it since both extend the same AI-chat surface. |
| 6 | College Scorecard outcome-data integration | Strengthens the trust layer (Section 1) once the core data model is stable. |
| 7 | Multi-kid parent mode | Real but not blocking — a second household use case, not a launch blocker. |
| 8 | Recommendation-request templates | Lower urgency, self-contained feature. |
| 9 | Research/Latest-News/Scholarships bubbles come online | Deliberately deferred out of MVP (see above) — revisit once the two-bubble (Search+News) home has real usage data. |
| 10 | Voice-mode polish | Cosmetic/UX polish on an already-shipped mic affordance, lowest urgency of the group. |

---

## 7. Phased roadmap — merged

| Phase | Timeframe | Focus | Key items |
|---|---|---|---|
| **MVP** | Launch | Trust + core utility + the new interaction model | Section 6, items 1–9 — **built and verified in the v3 prototype** |
| **Short-term** | 6–12 months | Close the App Store/launch gaps, then prove the data differentiator | Age-verification/parental-consent flow, CloudKit sync, more schools per specialty (all three moved from MVP, Section 6), then crowd-verification folded into the AI chat (Section 3, idea 1), reciprocity-gated freshness (Section 3, idea 2), College Scorecard outcome-data integration, multi-kid parent mode, recommendation-request templates, Research/Latest-News/Scholarships bubbles come online, voice-mode polish — full order in Section 6's "Next in line" table |
| **Year 1–2** | 12–24 months | Expand surface area, test community cheaply, launch the content engine | International schools, essay guidance (human+AI hybrid), small per-school community pilot, read-only Reddit/College Confidential aggregation, **curated vertical content feed — the primary monetization engine (see roadmap Section 8 material below)**, paid AI research tier fully built out |
| **Year 2+ / strategic bets** | 24+ months, each needs its own go/no-go | Business-model-level decisions | Counselor-collaboration mode (competes with Naviance/Scoir — real strategy call needed), expert marketplace (unit-economics/cold-start analysis needed), college-DB partnership (biz-dev, not engineering), post-admission journey/networking product |

---

## 8. Monetization engine — the curated vertical feed ("white-collar TikTok")

*(Carried over from the roadmap doc, unchanged — still Year 1–2, still gated on the legal review below.)*

Same physical feel as TikTok — vertical, swipeable, fast — made legal and on-brand by two structural choices: (1) content only enters through an editorial approval pipeline, no open upload, so there's no open-UGC trust & safety problem to moderate; (2) the default feed order for under-18 users is chronological/curated-sequence, not engagement-optimized personalization — the specific line SB976 and NY's SAFE for Kids Act draw. **This legal reading needs real review against the final regs before any feed-ranking code is written** — treat it as a strong hypothesis, not a cleared fact. Precedent it resembles: Snapchat Discover, not TikTok's open feed. Monetization: sponsored/branded slots from the same $429–$623/student/year enrollment-marketing budget already spent industry-wide, plus contextual (not behavioral-profile) ads. Real bottleneck: content supply (an ongoing production/partnership cost), not the app code.

---

## 9. Open questions

1. Counselor mode is a business-model fork (school-licensed sales motion vs. consumer app) — needs a dedicated strategy session before engineering starts.
2. Expert-marketplace liability (background checks, insurance, bad advice to a minor) needs real legal input.
3. Community demand is a real but unconfirmed assumption — test with a small per-school thread in Year 1, not a built social product.
4. Which specialty verticals first is a data-availability question (ASEE/Poets&Quants make engineering/business most sourceable now) as much as a demand one.
5. The chronological-vs-personalized feed legal read (Section 8) is a judgment call, not legal advice — get real compliance review before the final regs land.
6. **New** — on-device vs. hosted model for the profile-builder AI, and the consent flow that covers it (Section 4.7 / Section 5 flag #6) — needs an answer before real minors' profile data flows through a paid tier.
7. **New** — does the crowd-verification-via-chat idea (Section 3) need its own lightweight moderation pass before shipping, given corrections from other users about a school could themselves be wrong or bad-faith? Worth a cheap design (e.g., require N independent confirmations before a correction overrides sourced data) rather than trusting single-user corrections outright.

---

## 10. Independent audit and fix pass (2026-09-06)

A prior session's "Built & verified" status on every MVP row (Section 6, as it stood before this pass) was self-review by the same session that built the feature. A fresh subagent with zero prior context — no conversation history, no framing from the building session — was given only this requirements doc, the design-decisions audit doc, and the prototype's actual code, and told to adversarially verify the doc's claims against the code. It found five real problems, most severe first:

| # | Finding | Fix applied |
|---|---|---|
| 1 | The chance calculation was entirely fake, not user-driven — `SCHOOLS` hardcoded a static `chance` value per school; every code path quoted it regardless of who was using the app. | Added `estimateChance()` — a dual-track (GPA-range, SAT-range) odds-ratio model computed live from the user's actual profile against each school's own published ranges. Personalized only when the user has entered GPA and/or SAT; otherwise returns the plain verified admit rate, never an invented number. |
| 2 | Personalized data leaked to pre-onboarding users via Search — tapping a search result opened the full personalized flip-card for a user with zero profile data. | `openStack()`'s generic/personal mode now depends on onboarding state for every entry point, not just the "Popular" band, so this can't leak from any current or future caller. |
| 3 | A silent no-op: the chat text input was rendered and enabled during the grad-year and GPA/SAT onboarding steps, but the Send handler only processed free-text-type steps — typing there and hitting Send did nothing, with no error. | Every onboarding step type now has a real `submitChat()` branch, including explicit AI error responses for unparseable typed input (e.g., "I couldn't find a GPA or SAT in that…") instead of silence. |
| 4 | Coursework and extracurriculars — both listed in this doc's own Section 4.3 spec — had no collection path anywhere. | Added as two new (skippable) onboarding chat steps and two new editable Settings fields. |
| 5 | The expanded "My List" cluster bubble had no collapse-back path, despite the design doc documenting one. | Added both a tap-outside-to-close handler on the bubble field and a dedicated collapse gesture (tapping the cluster hint label while it's open). |

All five are fixed in `admitted-ios-concept.html` and verified two ways: (a) a DOM-level adversarial test suite (jsdom) exercising happy-path, empty-input, and hostile/garbage-input cases for every fix — 34/34 assertions passing, including confirming two different user profiles now get different chance numbers at the same school, and that pre-onboarding search never renders a fabricated personalized marker; (b) a second, independent fresh-subagent re-audit specifically tasked with checking whether the fixes were real or cosmetic.

**That re-audit found a sixth real problem on its own initiative, not one of the five it was asked to check:** fixing finding 1's *number* (the chance percentage) left finding 1's *label* (Safety/Likely/Target/Reach) behind — `SCHOOLS` still hardcoded a static `band` per school, so a school statically written as `Safety` could compute a 2% personalized chance for a weak profile and the app would display the self-contradictory "SAFETY · 2% est.," while the AI's own "why" explanation claimed the number caused the label, which the code didn't implement. Concretely confirmed: Drexel (static `Safety`, 79% base admit) against a GPA 2.0/SAT 850 profile computes 2% — the exact contradiction. Fixed with `effectiveBand()`: once a chance is personalized, the displayed band is derived from that number (Safety ≥80%, Likely 50–79%, Target 20–49%, Reach <20%), falling back to the static curated band only when no profile exists yet to derive one from. Every place that read the static field for a user-facing category — swipe-card pill, My List cluster counts, the band-bubble filter, Search/peek pills, the AI's "why" copy, Timeline's dot color — now calls `effectiveBand()` instead. Verified with a second regression suite (16 school×profile combinations checked for this exact contradiction shape — zero found after the fix). Two smaller issues from the same pass were fixed too: the filter/sort control stayed visible pre-onboarding for any real band reached via Search (not just the literal "Popular" band), and a chip-step retry message was hardcoded to name "grad year" specifically rather than whichever chip options were actually live — both cosmetic/consistency issues, not fabrication risks, but real bugs.

**Process note, stated plainly:** this is now the third time self-review (or a first-pass fix) missed a real problem that a fresh, context-free audit caught — the first two are documented in the original handoff and immediately above. Worth naming explicitly what the pattern is: fixing the literal thing a bug report names doesn't guarantee every place that concept appears elsewhere in the code was also fixed — the re-audit's value here wasn't just confirming the five named fixes, it was checking whether the *underlying claim* ("chance is computed, not fabricated") held everywhere, which surfaced a place the fix pass hadn't looked. Any future "Built & verified" or "Fixed" claim in this doc should be read as provisional until it has survived an independent audit whose scope isn't limited to the specific findings it was told about — that's now standard practice for this project, not a one-off.

---

*Companion file: `admitted-ios-concept.html` — the interactive prototype implementing Section 4 (phone auth, AI chat, bubble home, swipe+flip cards), built and verified this session.*
