# PRODUCT VISION — admitted (web + iOS)

Merged from the Claude Desktop docs in `Claude outputs/` (admitted-master-requirements.md,
admitted-mvp-requirements.md, admitted-feature-roadmap.md, admitted-ios-concept-HANDOFF.md,
admitted-design-decisions-audit.md) + the existing web app. This is the durable spec; those source docs
stay for the paper trail. Where they conflict, this file + GOAL.md win.

## Product
A college-decision tool for applicants (built first for one real premed/BS-MD student, CA, 12th grade).
Two surfaces over one verified core. The differentiator is the **combination nobody else ships**: a real
personalized chance estimate + honest verified/estimated trust layer + a new interaction model.

## The CORE (shared by both surfaces)
- **Data:** `data/schools/*.json` — one file per school, every published number sourced or EST-flagged. No fabrication, ever.
- **Chance engine (`estimateChance`):** two independent tracks — GPA vs school middle-50%, SAT vs school range (position 0 = low edge, 1 = high edge, extends past ends). Test-optional/blind schools drop the SAT track. Position shifts the school's **verified base admit rate** via an odds-ratio (log-odds/logistic) transform. Clamped 2–97%. No GPA/SAT on file → `personalized:false`, plain verified admit rate, never an invented "YOU:" marker.
- **Bands (`effectiveBand`):** derived from the personalized chance, not a static per-school label. **THRESHOLDS UNRECONCILED** — web=Safety≥75/Likely55-75/Target30-55/Reach<30, iOS=≥80/50-79/20-49/<20. Stage-2 decision. Round counseling numbers, not fit to outcome data.
- **Cost engine (True Cost):** year net cost × program years (+ med-school cost for BS/MD) − money − family contribution = loans; +interest = true cost. Flat-×4 simplification badged ESTIMATED (UI caveat copy still TODO).
- **Trust layer:** every chance/admit/cost number carries VERIFIED vs ESTIMATED + a source string. Nothing personalized renders without a real profile.

## WEB surface (index1.html — live, geemboombaa/admitted → admitted-six.vercel.app)
Full dashboard: 101 schools, all tabs (List, All Colleges, Weights, Compare, True Cost, BS/MD pathway,
Accelerated, UC Reference, Timeline, Method). Data-driven, no backend, localStorage. Deploy = push to main.

## iOS surface (Expo/RN recommended — commercial App Store product)
### Locked MVP (9 items — must wire to the real core, not a demo dataset)
1. Phone + SMS OTP auth. No name/email/age/DOB at signup.
2. AI conversational profile builder (strong model) + editable profile screen. Captures grad year, GPA, coursework, ECs, interests, colleges of interest.
3. Bubble home: Safety/Likely/Target/Reach + Search, physics motion, profile-summary strip, empty-state routes to AI builder.
4. Swipe-card list + flip-card detail (cost, students, admit rate w/ user's position marked, ranking, source links, one charm sentence). Native port of the chance engine.
5. Sourced data + visible citations + verified/estimated on every number.
6. Cost-of-journey breakdown + college timelines (ported from web).
7. Local deadline notifications + manual application checklist (notifications need native build).
8. Filters, sort, ≥1 alternate theme (band colors stay fixed = semantic).
9. Retrieval-grounded "why is this a Reach/Safety" explainer, grounded only in app's own sourced data (cheap tier).

### Short-term queue (post-MVP, ordered)
age-verification/parental-consent (Apple Declared Age Range API) → CloudKit sync → more schools per
specialty → crowd-verification in chat (N independent confirmations before overriding sourced data) →
reciprocity-gated freshness → College Scorecard outcomes → multi-kid parent mode → rec-request templates →
Research/News/Scholarships bubbles → voice polish.

### Year 1–2
international schools · essay guidance (human+AI) · small per-school community pilot · read-only
Reddit/CollegeConfidential aggregation · **curated vertical content feed (primary monetization)** · paid AI research tier.

## Locked product decisions (do NOT re-litigate)
- **AI tier boundary = "does it need fresh data beyond the static verified dataset," NOT model size.** Profile builder → strong model. Explain-existing-data → cheap retrieval-grounded. Fact-not-in-dataset → sourced lookup, never LLM guess.
- **No DOB** (grad year drives chancing; a minor's birthdate = avoidable liability). Age-check via OS age-range signal, not a birthdate field.
- **Monetization:** curated content feed + reciprocity-gated freshness; sponsored contextual (not behavioral) slots from the $429–$623/student/yr enrollment-marketing budget.
- **Trust layer + personalized chance = the spine.** Every "built/verified" claim is provisional until an independent context-free audit passes (the self-improving loop's reviewer serves this).

## Design system
Web = PULSE (global theme). iOS = iOS-native precedents (folder-style bubbles, Spotlight search, Apple News
Today, Wallet card-peek, Reminders checklist), 44×44pt min tap targets, physics bubble motion (open/close
"pop"), one charm screen (flip-card detail). Signature accent green; band colors semantic/fixed.

## Personal content feed (Year 1–2, monetization engine — legal-gated)
Vertical swipe (the ONE vertical surface). Editorial-approval pipeline, NO open upload. Under-18 default =
chronological/curated, NOT engagement-optimized (SB976 / NY SAFE for Kids). Precedent: Snapchat Discover.
**Needs real legal review before any feed-ranking code** (CA Jan 1 2027, NY Jan 25 2027 regs).

## Open questions (need user/legal input at their stage)
counselor mode = business-model fork · expert-marketplace liability · community demand unproven · which
specialty verticals first (data availability) · feed chronological-vs-personalized legal read · on-device
vs hosted model for minor profile data + consent flow · crowd-verification moderation design.

## Compliance gates (Stage 4, non-negotiable)
Every user is a minor. Age-verification required (Apple Declared Age Range / Google Play Age Signals, live
TX/UT/LA/CA Jan 2026). FERPA if any data comes from a school. Scraping OK only if robots.txt respected +
sources cited. Rec/counselor features = student-initiated templates only.
