# BUILD-STATUS — live build log (updated every checkpoint)

Single source of truth for what's DONE / NEW / PENDING + the running GAPS list. Reads with
`VISION.md` (north star) and `MVP.md` (scope). Not a frozen tracker — updated each checkpoint.

_Last updated: CP-D complete._

## Checkpoints
| CP | Scope | Status |
|--|--|:--:|
| A | Foundation — testable `core/` modules + `node:test` harness | ✅ DONE (`978e8a9`) |
| B | Grounded tool layer — 6 tools, verified value + badge + source | ✅ DONE (`ea5eb23`) |
| C | Agent spine — intent→tool→card router + unit-aware grounding guard | ✅ DONE (`8ac3a95`) |
| D | Web PWA UI — chat surface + generative cards + persistence + share | ✅ DONE (this commit) |
| E | PWA manifest + first-90s onboarding polish + broader browser E2E | 🔜 NEXT |
| F | Outcome-data sourcing (Scorecard/BLS/AAMC) — **gated, needs approval** | ⬜ pending (web pull) |

## Done (cumulative)
- `core/engine.mjs` — decision engine extracted verbatim from app.html (frozen math).
- `core/data.mjs` — loader: verified-value overrides (incl. the sat→s25/s75 fix) + wedge fields preserved.
- `core/tools.mjs` — chance / cost / eligibility / programOdds / attrition / whatFlipsIt, each grounded (badge + source), honest empty-states, no fabrication.
- `core/agent.mjs` — deterministicRoute + renderCards + composeText (grounded-by-construction template) + **unit-aware grounding guard** (kind-tagged %/$/GPA/SAT/count + word-form % + ratios + certainty-phrase blocklist) + createAgent(model?) enforcing the guard on both paths.
- `web/render.mjs` — pure card→HTML render layer (escaped, badge + band colors). `admitted.html` — the web PWA shell: onboarding, school search, chat, quick chips, localStorage, share-link; wires `createAgent()` (key-free). `web/schools.generated.mjs` — browser data from the same loader (no drift).
- `test/` — 47 real tests over the 101-school corpus, no mocks. Independent adversarial review at every CP; CP-C found 2 real BLOCKERs (unit laundering, word-form escapes) → fixed → re-verified SHIP; CP-D reviewed SHIP + 3 MINORs folded in.

## New this run (CP-D)
- The app is real and runs in a browser: onboarding → school pick → grounded cards, verified live (Chrome, 0 console errors). Chance (band+range), cost (net + raw med cost), eligibility gate, program odds, and **attrition paired with a "what's in your control" locus (#15)** all render from real tools.
- Honesty fixes folded from review: escaped all school-name interpolation (XSS defense-in-depth); surfaced the **weighted-vs-unweighted GPA** caveat on the eligibility card (Drexel's bar is weighted 3.5; input is unweighted) — see GAP-7.

## Pending / next
- **CP-E**: PWA manifest (installable), first-90s onboarding polish, broader browser E2E (drive the full flow + multiple schools headlessly), and address folded MINORs. Then wire the real Claude model into the agent seam (post-key).

## GAPS to come back to (numbered — do NOT fake, address at the right stage)
| # | Gap | Where it bites | Stage to fix |
|--|--|--|--|
| GAP-1 | Program-rate provenance (institutional vs newspaper vs derived) lives only in prose → all badged "reported". Needs a structured `programVerified.rateSource` enum via a **reviewed data edit** (H4/H5 pattern). | programOddsTool under-claims Drexel; can't distinguish sources | data-structuring (local, reviewed) |
| GAP-2 | BS/MD **attrition/retention** data not in our dataset (G1). Tool honestly says "not published". | the differentiator (#15) has no real numbers yet | CP-F / data sourcing (needs approval) |
| GAP-3 | **Outcome data** (Scorecard net-price/ROI, BLS wages, AAMC match) not local. | path-to-practice (#19) ships as structure only | CP-F (web pull, needs approval) |
| GAP-4 | True **BS/MD 7-yr cost** needs a med-years count (not in data). costTool shows raw affiliated med cost only. | full cost-to-MD | data sourcing |
| GAP-5 | Guard **documented gaps** (model-path safety net only): spelled-out word ratios, bare-int % with no nearby chance word, novel certainty phrasing. | only matters once a live model is attached | when wiring the real model (post-MVP) |
| GAP-6 | iOS/web **band-threshold** reconciliation (web .75/.55/.30 vs iOS .80/.50/.20). | cross-surface consistency | Stage-2 decision |
| GAP-7 | **GPA scale**: profile GPA is unweighted; some program bars are weighted (e.g. Drexel 3.5 weighted). Now DISCLOSED via label + caveat, but not scale-normalized — the Meets/Below GPA check is indicative, not exact, for weighted bars. | eligibility accuracy at the wedge | data-structuring (capture weighted GPA / normalize) |
