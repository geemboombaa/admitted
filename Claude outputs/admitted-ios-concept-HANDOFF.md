# "Admitted" iOS Concept — Handoff Document
*Prepared for continuation in a different session/model. Self-contained — assumes zero prior context.*

---

## 1. The concept, in one paragraph

There are **two separate "admitted" things**. (A) A real, already-deployed web app — GitHub `geemboombaa/admitted`, live at `admitted-six.vercel.app` — built and used for real, for the user's son's actual college search: real ground-truthed schools (Case Western, Baylor, Creighton, Utah, Rice, UC campuses, etc.), real stats (3.67 unweighted GPA, 1440 SAT), real counselor pushback being worked through, built via a propose→approve→build→validate workflow. (B) **This iOS concept** — a from-scratch reimagining of the same idea as a commercial iOS App Store product, explored this session as an interactive HTML prototype with phone auth, an AI conversational profile builder, a swipe/flip card UI, and a bubble-based home screen. (B) uses a small, explicitly-illustrative 4-school dataset and has **no connection to (A)'s real data** — this is the single most important fact for whoever continues this: the concept exploration was never wired to the real app or its data, and doesn't even link to it. That gap is confirmed below, not assumed.

---

## 2. The original prompt (verbatim — the definitive scope statement)

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

**Important scope override on top of this prompt:** after this prompt was written, the user explicitly locked MVP scope and moved three items *out* of MVP into short-term: age-verification/parental-consent flow, CloudKit sync, and "more schools per specialty." That lock is recorded in the requirements doc (Section 6) and supersedes the "age-verification flow" line in the prompt above — don't re-add it to MVP without the user re-opening that decision.

---

## 3. Files built this session (all attached to this handoff)

| File | What it is |
|---|---|
| `admitted-master-requirements.md` | Merged requirements doc. Section 6 = locked MVP (9 items, renumbered, with a status column and a ranked "next in line" short-term queue). Section 7 = phased roadmap. Section 9 = open questions, including a sourced resolution for the age-verification/DOB tension via Apple's Declared Age Range API. |
| `admitted-design-decisions-audit.md` | Per-screen design rationale, sections A–K, each applying the 5-point method from the prompt above (what it's for / precedent + mechanical reason / happy-empty-hostile input / ambiguity surfaced / self-audit). |
| `admitted-ios-concept.html` | The interactive prototype. Published at the Artifact URL given in this conversation's history (search this conversation for "admitted-ios-concept" if the link isn't visible in your current context — it was republished multiple times as bugs were fixed). |

---

## 4. Independent audit — run fresh, by a subagent with zero prior context on this project, immediately before this handoff was written

This is the actual content of a self-correcting check, not a description of one: a separate agent was given only the three files above (no conversation history, no framing from the building session) and told to adversarially verify the requirements doc against the actual prototype code. Its findings, verbatim, most severe first:

### Confirmed real issues — not yet fixed

1. **The core "chancing" calculation is entirely fake, not user-driven.** `SCHOOLS` hardcodes a static `chance` value per school. No function computes chance from the user's actual GPA/SAT/interests — every code path (`askWhy()`, `runCompare()`, the admit-bar "YOU: X%" marker) just quotes the school's hardcoded number regardless of who's using the app. **This is the single biggest problem found.** It directly contradicts the requirements doc's own "dual-track chance model" claim and the MVP status table's claim that "nothing personalized renders without a real profile behind it." Every user currently sees identical numbers no matter what they enter.
2. **Personalized data leaks to pre-profile (not-onboarded) users via Search.** The Search bubble exists even before onboarding, and tapping a search result opens the full "personalized" flip-card (admit-bar, chance marker, Ask-AI-why) for a user who has entered zero profile data — breaking the no-fabrication rule a second, independent way.
3. **A new silent no-op — same bug class as the pointer-capture bug found and fixed earlier this session.** During onboarding's grad-year and GPA/SAT steps, the free-text chat input is fully rendered and enabled, but the send handler only processes free-text-type steps. Typing anything and hitting Send at those two steps does nothing at all — no error, no bubble, no redirect. Looks interactive, isn't.
4. **Two required profile fields are never collected anywhere.** The requirements doc's own UX spec (4.3) lists coursework and extracurriculars as onboarding inputs. Neither the conversational flow nor the Settings edit-fields screen has any path to enter either one.
5. **The nested "My List" cluster bubble has no collapse-back path**, despite the design-decisions doc explicitly documenting one ("tap outside, or a dedicated collapse gesture, folds it back"). In code, the open state is one-directional — nothing ever closes it except fully leaving and re-entering Home.
6. **Confirmed (expected): no link anywhere to the real app.** Full read of the file found no mention of `admitted-six.vercel.app`, the GitHub repo, or any acknowledgment a real, larger, ground-truthed dataset exists elsewhere. This matches the user's own complaint verbatim.

### False alarms — checked and confirmed genuinely fixed (so the "confirmed" items above can be trusted as real, not reflexive suspicion)
- The theme toggle correctly recolors accent elements while leaving band colors fixed — matches the claimed fix.
- The "Ask AI why" pointer-capture bug and the missing chat-back button are both confirmed fixed in the current file.
- Rapid back-to-back swiping does not corrupt state or double-save — traced the actual index-increment logic, it's synchronous and safe.

**Bottom line: this prototype is further from done than it was presented as being.** Finding #1 in particular means the app's central differentiator — a chance estimate calculated from *your* profile against a school's real numbers — does not functionally exist yet. That was not known before this specific audit; self-review by the same session that built the feature did not catch it.

---

## 5. Locked decisions — don't re-litigate these, build on them

- **MVP (Section 6, requirements doc):** 9 items, all previously "built" per the session's own testing — but see the audit above; "built" needs re-verification against finding #1 in particular before it's trusted again.
- **Short-term queue, in order:** age-verification/parental-consent flow → CloudKit sync → more schools per specialty → (then the rest of the original short-term backlog).
- **Age-verification mechanism:** Apple's **Declared Age Range API** (shipped iOS 26.2 for Texas SB2420, expanded Feb 2026 for Brazil/Australia/Singapore/Utah/Louisiana) — the app requests a coarse age-range signal from the OS/Family Sharing setup rather than collecting a birthdate directly, which is what makes this compatible with the MVP's own "no DOB at signup" rule. Don't rebuild this as a self-entered birthdate field.
- **AI model-tier split:** cheap/retrieval-grounded model for the in-app "why is this a Reach/Safety" explainer (must only ever quote the app's own sourced data, never free-generate a number) — strong model for the conversational profile-builder (low-frequency, high-leverage, worth the cost).
- **No-fabrication rule:** every chance/cost/admit number needs a Verified/Estimated badge and a source string. **Finding #1 above means this rule is currently violated** — the badges exist, but the underlying chance number they're attached to isn't actually computed from the user's data. Fixing the badge display isn't enough; the calculation itself needs to exist.

---

## 6. Immediate next steps, in order

1. **Decide first, before any more building:** does this iOS concept adopt the real web app's data/backend (`geemboombaa/admitted`), or stay a standalone concept exploration with its own dataset? Everything else depends on this answer — it's the root cause of the "doesn't even link to the dashboard" complaint.
2. Fix finding #1 — implement a real chance calculation from the user's actual GPA/SAT against each school's real admit data. Without this the app's core claim is fake.
3. Fix findings #2, #3, #5 (personalization leak, dead chat input on two onboarding steps, no cluster-collapse path).
4. Add the missing coursework/EC profile fields (finding #4).
5. Re-run an independent audit (see process below) before presenting anything as complete again — self-review by the same session that built a feature has already been shown, twice now, to miss real bugs a fresh check catches immediately.

---

## 7. How to hand this off across models/sessions

There's no automatic full-context transfer between a fresh session and this one, regardless of which model serves it — a new session starts blind. Two things carry over automatically without any action needed: (a) the account-level persistent memory files (already contain the real app's GitHub/Vercel URLs and the son's real stats — a new session reading `/areas/college-selection-son.md` gets that context for free), and (b) this handoff document plus the three attached files, which is what replaces re-deriving everything from a long conversation transcript. Practically: start the next session, point it at this handoff file and the three attachments, and it has everything needed without reading this whole conversation.

## 8. Self-correcting multi-agent workflow — what's actually available, concretely

This environment has a real mechanism for exactly what was asked for, used above rather than just described: an **Agent tool** that spawns an independent subagent with its own clean context — no inherited assumptions, no framing from whoever built the thing being checked. Section 4 above is the direct output of one such call: a fresh agent, given only the three files, found four real bugs that two full rounds of self-review missed.

For a heavier, multi-stage version of this — build, then independently review, then independently verify each review finding before trusting it — this environment also has a **Workflow tool** that runs a script orchestrating several agent calls in a pipeline (a "review" phase followed by a "verify" phase, where verification agents adversarially re-check the review agents' findings before anything is reported as confirmed). That tool exists and works, but it's gated behind explicit user opt-in — it can spawn many agents and burn real token budget, so it only runs when the user says something like "use a workflow" or "run this with multi-agent orchestration," not automatically. If a recurring, scheduled version of this check is wanted (e.g., "re-audit this file every morning"), that's a scheduled task (a cron-style trigger) rather than the Workflow tool — each firing starts a fresh session, so it's suited to periodic spot-checks, not continuous state.

## 9. Why this wasn't set up proactively, honestly

Two separate reasons, not one excuse. First, a real constraint: the Workflow tool is deliberately gated behind explicit opt-in because of its cost profile — not something to trigger unilaterally. Second, a fair miss that isn't a tooling limitation: the lighter-weight Agent tool was available the entire session and wasn't reached for until directly challenged on self-validation. Self-review has a structural blind spot — checking your own work with your own assumptions tends to reconfirm those assumptions — and an independent subagent with no inherited context is a genuinely better validator for exactly that reason, demonstrated concretely in Section 4 above, not just asserted here.
