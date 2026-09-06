# PRODUCT VISION & HANDOFF — admitted

*Self-contained. Assumes zero prior context. Supersedes the goals/innovation framing scattered across chat history — read this first, then GOAL.md / RULES.md / OPERATING-MODEL.md / DELIVERABLES.md for the operational loop mechanics.*

---

## 1. There are two tracks. Do not confuse them.

**Track A — the real, deployed app.** GitHub `geemboombaa/admitted`, live at `admitted-six.vercel.app`. Built for real, for the user's son's actual college search (12th grade, biology/pre-med track). Real schools, real stats, real counselor pushback. Data lives in `data/schools/*.json` + `data/shared/app-config.json`; `scripts/build.js` compiles it into the single shipped file `index1.html`. This is the thing the self-improving loop (below) operates on. **This doc's "end deliverable" is Track A.**

**Track B — the iOS-concept prototype.** A from-scratch reimagining of the same idea as a standalone commercial-iOS-style exploration: `Claude outputs/admitted-ios-concept.html`, plus its own requirements/audit docs in the same folder. Built with its own small illustrative 4-school dataset. **Not wired into Track A's build pipeline, not deployed, not currently touched by the loop.** Exists purely as a UX/interaction reference — see Section 5 for its actual current status, which is more finished than its own handoff doc currently says.

Anything that sounds like "the app" without qualifying which track is ambiguous by default from here on — always say Track A or Track B.

---

## 2. The original scope prompt for Track B (verbatim — the definitive ask that produced the prototype)

> Design and build the entire "admitted" iOS app concept end to end — not a subset, not a showcase of a few screens. Scope is every screen and flow needed for the full MVP list already defined in the master requirements doc: phone auth, AI conversational profile builder + editable profile screen, home screen (bubbles or whatever structure survives design review), search, the AI assistant, news, swipe college list, flip-card detail, shortlist, timeline, true-cost breakdown, deadline notifications/checklist, filters/sort/theme, age-verification flow, and settings. If a screen is on the MVP list, it gets designed and built. None of it stays unaddressed until I happen to point at it.
>
> For every single screen and every element on it, apply the same rigor already demonstrated on the few examples I gave — not just to those examples: (1) state what it's for and confirm it survives being cut if it doesn't serve a real purpose; (2) ground any creative/interaction choice in a named real-world precedent plus the specific mechanical reason it's the right choice here, not a vibe; (3) work through happy path, empty/garbage input, and hostile/fast input for every interactive element; (4) surface any real ambiguity in the spec explicitly and propose a default with reasoning, rather than silently picking the easy interpretation; (5) audit your own proposal afterward for what's missed, what you changed, and whether it holds together end to end.
>
> Do this proactively across the whole app, including the parts I haven't specifically called out. Finding and designing the parts I didn't mention is the job, not a bonus.
>
> Standards that apply everywhere, no exceptions: PULSE design system throughout; zero fabricated data or stats anywhere, including placeholder/demo content — label anything illustrative as such; real input validation and error states on every screen, not just the ones caught by testing; minimum 44×44pt tap targets; every design decision traceable to a reason, not just "it looks cool"; consistent with every standing decision already locked (the dual-track chance model, the sourced/verified-data trust layer, the AI model-tier split, the compliance flags, the monetization sequencing).
>
> Final deliverable is two things, both complete, not partial: (1) one master document covering every screen's design decisions, reasoning, edge cases, and self-audit — the full paper trail; (2) one fully interactive prototype implementing every MVP screen from that document, tested by actually using it adversarially (garbage input, fast tapping, empty states) before it's presented as done, with whatever bugs found during that testing fixed before delivery, not after I find them.
>
> Do not present this as finished until you have personally verified every screen against the standards above. If something is incomplete, say so explicitly and name what's missing — do not imply full completion if it isn't.

**Scope override on top of this prompt:** age-verification/parental-consent, CloudKit sync, and "more schools per specialty" were later locked *out* of MVP into a short-term queue. Don't re-add them without reopening that decision.

---

## 3. The separate, later ask — self-correcting, self-improving, innovative product implementation

> "I asked to set a self correcting, self improving, innovative product implementation set up."

This is a **Track A** ask, distinct from the Track B prompt above. It produced the actual operating infrastructure now running against `index1.html`:

- `.claude/agents/adversarial-reviewer.md` — fresh-context reviewer brief, never the same context that wrote the change it reviews.
- `scripts/self-improve-loop.sh` + `scripts/self-improve-backlog.js` — the loop driver: pick backlog item → builder (`claude -p`, JSON-only, web tools disallowed) → `validate.js` gate → `build.js` rebuild → independent second `claude -p` review (APPROVE/REJECT, cold, on the source diff only) → commit on pass, `git reset --hard` + log on any failure.
- `GOAL.md` / `RULES.md` / `OPERATING-MODEL.md` / `DELIVERABLES.md` — the staged plan (Stage 1 dataset verification → Stage 2 decision-engine accuracy → Stage 3 UX/visuals) and the hard constraints (no fabrication, JSON is truth, one item = one commit, revert on any gate failure, no deploy without explicit approval).
- This is genuinely running: as of 2026-09-06 it has real commits (`832bea3` → `903e99f` and later) fixing an actual crash bug and replacing fabricated admit-rate numbers with sourced ones, autonomously, gated, logged.

**"Innovative" here means:** the loop is the product-differentiator, not a side process — a dataset that stays honest (verified-or-flagged, never invented) *because* a mechanical gate and an independent adversarial review enforce it on every change, not because someone remembers to check.

---

## 4. What "self-correcting" concretely means in this repo (don't re-derive this)

Self-review has a demonstrated blind spot: the same context that builds a change tends to reconfirm its own assumptions when asked to check itself. Two rounds of self-review on Track B's prototype missed real bugs that a single fresh-context subagent audit caught immediately (see Section 5). That is why the loop's reviewer step is a **second, independent** `claude -p` call with no memory of the build — not a second self-check by the same session. Any future work on either track should preserve this: build and review are different contexts, always.

---

## 5. Track B current status — corrected (the old handoff doc in `Claude outputs/` is stale on this point)

`Claude outputs/admitted-ios-concept-HANDOFF.md` lists 6 findings from an independent audit and marks findings 1–5 "not yet fixed." **That is out of date.** As of this session, all of the following were fixed and verified with real jsdom-based adversarial tests (not self-report):

1. Chance calculation — was a static per-school number; now computed per-user from actual GPA/SAT against each school's real dual-track (GPA + SAT) data, with an `estimateChance()`/`effectiveBand()` pair so the displayed band always follows the computed number, never a stale static label.
2. Personalization leak via Search pre-onboarding — fixed; generic mode enforced until onboarding completes.
3. Dead chat input at the grad-year and stats onboarding steps — fixed; free-text entry now advances those steps instead of silently no-op'ing.
4. Coursework/extracurriculars fields — added to both the chat onboarding flow and the Settings edit screen.
5. "My List" cluster bubble collapse — fixed; tap-outside and a dedicated collapse-hint gesture both close it.
6. No link to the real Track A app/dataset — **still true, unresolved.** This remains the one open item from that audit. It's also the root of the two-track confusion this doc exists to resolve — Track B was never wired to Track A's data and still isn't.

---

## 6. End deliverable (per DELIVERABLES.md, Track A only)

> Deployed `admitted` app on Vercel: accurate, fully-sourced, top-tier, with a documented self-improving build pipeline behind it.

A web app at a browser URL. Not a native iPhone/App-Store app. Track B's "iOS" naming refers to visual style only (iOS-like interaction patterns inside a browser), not a shipped native product. If a real installable iPhone app is ever wanted, that is a new, separate decision — not implied by anything currently locked.

---

## 7. Open decision — what happens to Track B's verified fixes

Track A's Stage 3 ("UX + wow," no data changes) is the natural place to bring Track B's UX ideas in, but nothing has decided this yet. Options on the table:

1. **Port ideas, not files.** Turn Track B's fixed logic (dual-track chance model, `effectiveBand`, chat-flow fixes) into Stage-3 backlog items the loop implements natively in `index1.html`/JSON, through the normal build→validate→review gates. One codebase, forever. *(Leaning recommendation — Track A already has a proven, running, gated loop; a second track fragments review effort.)*
2. **Build a real separate iPhone app.** Its own project/repo, own UI code, sharing only `data/schools/*.json` as a data source. Only worth it if App Store distribution is an actual goal, not just an iOS look-and-feel.
3. **Leave as-is.** Track B stays inert reference material; Track A's loop keeps running alone.

Not decided as of this doc. Whoever picks this up next should get an explicit answer before doing any Stage-3 work.
