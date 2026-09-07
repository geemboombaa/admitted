# App improvement backlog — Living Map (app.html)

Format: `- [ ] <task>` pending, `- [x] <task>` done. One item = one loop iteration = one commit (or revert).
Loop: `./scripts/app-improve-loop.sh --batch=N` — Opus builder implements + browser-tests each item; an
independent Opus reviewer opens app.html in Chrome and must reply VERDICT: APPROVE or it reverts.

Rules: app.html stays a single self-contained file except `<script src="app-data.js">` (101 real schools).
Vanilla JS only. Never fabricate data (verified/EST honesty). Keep the chance()/band() engine + PULSE theme.
Every change must run with zero console errors and recompute live from the user's stats.

## Basics + bug fixes (do these first)
- [x] Fix bubble tap precision: in dense/low-GPA states small bubbles overlap and are hard to hit. Add a larger tap hit-radius and a tap-to-zoom-into-a-band interaction so every school is reliably selectable; show the focused bubble's name label clearly.
- [ ] Verify and harden real finger-swipe on the Deck (touchstart/move/end), with a subtle spring + visual feedback on like/pass; ensure it also works with mouse and never leaves a stuck card.
- [ ] Make the stat dials (GPA/SAT/test-optional) reachable and editable directly on the Map screen (not only a separate screen), so the "watch it reshape" loop is one gesture; persist changes instantly.
- [ ] Add map filters: by type (public/private), region/West, a cost ceiling, and BS/MD-program-only; filtered-out bubbles fade/hide and band counts update.
- [ ] Add deadlines + a simple per-shortlisted-school application checklist (from each school's real dl/dlDate), with a clear upcoming-deadline view.

## Innovation + wow
- [ ] "Time machine" scrubber: a control that animates GPA (or SAT) across a range and shows bubbles flowing between bands with motion — a visceral view of how much each point matters.
- [ ] Tap a reach/target bubble -> inline "what flips it" coach: the exact GPA and/or SAT delta that moves it to the next band (real math off chance()), with a mini before/after, and an honest "even a perfect profile can't beat this admit rate" case.
- [ ] Compare mode: select 2-3 bubbles -> side-by-side sheet (chance, true cost, grad rate, premed/research, verified status) with a plain-English verdict.
- [ ] BS/MD pathway view: the ~33 program schools as their own focused cluster/list showing program names and the accelerated-vs-traditional distinction.
- [ ] Delight pass: tune the bubble spring physics to feel organic, add a staggered entrance animation, optional haptic/sound micro-feedback toggle, and polish every empty/error state and the onboarding charm.
- [ ] "My list" shareable summary screen: safety/target/reach breakdown + total estimated 4-yr cost, laid out to be screenshot/share-friendly.
- [ ] Cost clarity: a realistic-cost toggle and a clearer 4-yr cost view with per-school breakdown that respects BS/MD program length (accelerated years) rather than a flat ×4 for those.

<!-- Add new items above this line, one per line, using the exact "- [ ] " prefix. -->
