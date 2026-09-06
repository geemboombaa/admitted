# Admitted — MVP & Product Requirements (Phone-Auth, AI-First, Swipe UX)

## 0. Direct answers to your direct questions

**Am I up for it?** Yes — the design and requirements work below, and the interactive prototype I'm building today, both happen now, in this session.

**Can this be a live App Store app in 2 days?** No. Not a capability gap on my end — three external, non-AI bottlenecks that exist no matter who or what builds this:

| Blocker | Real timeline | Why it can't be compressed |
|---|---|---|
| SMS phone-verification (Twilio/Firebase/etc.) | Account setup is fast, but US "10DLC" carrier registration for a *new* business sending real OTP texts typically runs 1–3+ business days, sometimes longer — carriers approve the sender, not you. | This is a third-party approval queue, not engineering work. |
| Apple Developer Program enrollment (if not already enrolled) | Up to 48 hours for identity/business verification. | Apple's process, not mine. |
| App Store review | Usually 24–48 hours after submission, not instant, even expedited. | Apple's process, not mine. |
| The polish bar you're asking for ("addictive," "innovative," "popping/plopping" bubbles, charming card-flip detail) | This kind of feel is normally reached by building, watching someone use it, and refining — 1–2 iteration passes minimum, not a single unreviewed shot. | True of any product team, not specific to this one. |

**Do you need a better model or help?** Not a better model. What actually gates a real launch is: (a) those three external account/approval timelines above, which no AI changes, and (b) a choice you need to make, not me: native Swift/SwiftUI (best feel, matches your bar, slower to a working build) vs. React Native/Expo (faster to something real on a phone in days, near-native feel achievable, easier for me to iterate on across sessions). I'd lean Expo/React Native specifically *because* you want to see something running fast — flag if you want native instead and I'll plan around that trade-off explicitly.

**What's realistically true today:** I can hand you a fully interactive, tap-and-swipe-through prototype of every screen below before this session ends — phone-entry screen, AI-chat profile builder, the bubble home screen, swipe card stack, flip-card detail. That's the honest version of "2 days" — a validated design you (and anyone you show it to) can react to immediately, which is also the fastest path to a real build, because it means no engineering time gets spent on a screen that turns out wrong.

---

## 1. Architecture decisions this locks in — flag if you disagree

1. **Auth**: phone number → SMS OTP → in. No name/email/age/anything else at signup. Everything else deferred to profile, filled in "at user will."
2. **AI, hybrid by design**: a free/local model handles routine interaction and profile-building conversation (cheap, always-on, no API cost); Claude is called specifically for real research (comparing schools, digging into something not already in the local dataset) — and that split **is** the paid-tier boundary, not a separate feature to design later.
3. **Voice + text, same assistant**: one mic-icon toggle switches input mode; the AI responds in whichever mode you're in. Same brain, two input methods.
4. **Platform**: recommend React Native/Expo over native Swift for the reason above — flag if you want native instead.

---

## 2. MVP requirements, screen by screen

### 2.1 Onboarding
- Screen 1, first launch only: phone number field, "Text me a code," code entry, done. Nothing else.
- No form. No name/email/age here — profile is built conversationally later, whenever the user chooses.

### 2.2 Home screen — bubble navigation
- Returning user with a profile: home screen shows **nested bubbles** — Safety / Likely / Target / Reach as distinct bubbles, each just showing a count, sized/positioned with real motion (not a static icon grid) — genuinely worth a physics-based bubble-cluster treatment (see Section 5).
- Separate bubbles alongside the band bubbles: **Search**, **Personal Feed** (the curated video feed from the roadmap doc's Section 8). Research, Latest News, and Scholarships are real features but sequenced later (Section 3) — MVP ships the band bubbles + Search only, so the home screen isn't half-empty placeholders on day one.
- A persistent profile-summary strip above the bubbles once a profile exists: name, key stats, grad year, school.
- First-time user (no profile yet): the band bubbles render empty, and tapping one — or the whole screen's clear call-to-action — routes straight into the AI conversational profile builder (2.4), not a blank state with nothing to do.
- Tapping a band bubble (e.g. Safety) opens the college list pre-filtered to that band.

### 2.3 AI assistant — omnipresent, not a separate "chat tab"
- Reachable from anywhere in the app: ask about the app itself, any college, a comparison, or general research — scoped to stay inside what the app can actually answer.
- Text or voice, same assistant, toggled by the mic button.
- Designed to redirect, not just answer — if a user goes off-topic or feeds it junk, it steers back rather than breaking character or stalling.

### 2.4 Profile building via conversation
- Captures: name, DOB, current school, grad year, colleges of interest, GPA, coursework, extracurriculars, interests — through natural conversation (voice or text), not a form.
- A mix of quick-tap buttons (for things like grad year) and open conversation (for things like "tell me about your extracurriculars") — buttons where a button is genuinely faster, conversation where it isn't.
- This *is* the onboarding screen for a first-time user — not a separate step bolted on after.

### 2.5 College list — swipe, not scroll
- Horizontal swipe (Bumble/Hinge-style) through college cards, once a profile/interest set exists.
- Vertical up/down scroll is reserved for exactly one surface: the curated Personal Feed (Section 8 of the roadmap doc) — everything else, including this list, is left/right.
- Each card: name, band, chance %, one-line hook — enough to swipe fast, not a data dump.

### 2.6 College detail — flip card
- Tapping a card flips it (real flip animation, not a page push) to reveal the detail face.
- Detail face, redesigned beyond the current web app's plain paragraphs: a real panel layout for cost, class size/students, admit rate with *his* position marked on it, ranking, source links, plus real campus/EC/student-life photography and a short "what makes this one different" — the surrounding-city vibe, not just numbers.
- Explicit bar: charming, not overwhelming — this is the one screen where restraint matters most, since it's the emotional "do I like this school" moment, not the data-lookup moment.

### 2.7 Deliberately NOT MVP (with reasons)
- Research bubble, Latest News bubble, Scholarships bubble — real features, but MVP ships Search + the band bubbles only, so launch doesn't ship five half-built surfaces at once.
- The curated Personal Feed itself (the content pipeline) — per the roadmap doc's Section 8, this needs an audience and a legal compliance read before it exists at all; the *slot* for it on the home screen can exist in MVP, empty/"coming soon," without the content engine behind it.
- Real Claude-powered research calls at MVP — ship the local-model conversational layer first; wire in the paid Claude research tier once the free layer is proven, per Section 1, item 2.

---

## 3. Short-term (post-MVP, first 1–2 months)

1. **Scholarships** — you flagged this yourself as a real miss. Needs its own data-sourcing pass (this is a genuinely under-served category — most scholarship search tools are as unreliable as the admissions-chancing tools already audited in the roadmap doc) before it's more than a bubble that opens to "coming soon."
2. **Research bubble** — the paid-tier Claude research entry point goes here specifically, once the free local-model layer has real usage to compare it against.
3. **Latest News bubble** — admissions-cycle news relevant to the user's shortlisted schools.
4. Full voice-mode polish (interruption handling, natural back-and-forth, not just dictation-then-submit).

## 4. Year 1–2

1. **Personal curated feed** goes live as its own tab — this is Section 8 of the roadmap doc (chronological/curated, not algorithmic, closed submission pipeline) — cross-reference that document, don't re-derive it here.
2. Paid AI research tier fully built out as the monetization mechanic named in Section 1.
3. Everything else already sequenced in the roadmap doc's Year 1–2 row (international schools, essay guidance, community pilot).

---

## 5. Design language notes

- Bubbles need real motion — think a physics-based cluster (bubbles jostle, resize slightly, respond to touch) rather than a static icon grid. This is a meaningful animation-engineering item, not a CSS afterthought — budget real time for it, it's one of the two or three things that will make the app feel "alive" versus a spreadsheet with rounded corners.
- Overall tone reference you gave: "LinkedIn but better" — clean, information-forward, credible — not TikTok-chaotic. The one place that changes is the Personal Feed, which is intentionally a different register (Section 8 of the roadmap doc already scopes exactly how).
- Card-flip detail screen: the one place to spend "charming" budget — real photography, a human sentence about what makes the school different, not just another stats table.
