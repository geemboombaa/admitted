# BUILD-STATUS — live build log (updated every checkpoint)

Single source of truth for what's DONE / NEW / PENDING + the running GAPS list. Reads with
`VISION.md` (north star) and `MVP.md` (scope). Not a frozen tracker — updated each checkpoint.

_Last updated: CP-C complete._

## Checkpoints
| CP | Scope | Status |
|--|--|:--:|
| A | Foundation — testable `core/` modules + `node:test` harness | ✅ DONE (`978e8a9`) |
| B | Grounded tool layer — 6 tools, verified value + badge + source | ✅ DONE (`ea5eb23`) |
| C | Agent spine — intent→tool→card router + unit-aware grounding guard | ✅ DONE (this commit) |
| D | Web PWA UI — chat surface + generative cards + user-model persistence | 🔜 NEXT |
| E | Integration + adversarial review + polish + PWA manifest | ⬜ pending |
| F | Outcome-data sourcing (Scorecard/BLS/AAMC) — **gated, needs approval** | ⬜ pending (web pull) |

## Done (cumulative)
- `core/engine.mjs` — decision engine extracted verbatim from app.html (frozen math).
- `core/data.mjs` — loader: verified-value overrides (incl. the sat→s25/s75 fix) + wedge fields preserved.
- `core/tools.mjs` — chance / cost / eligibility / programOdds / attrition / whatFlipsIt, each grounded (badge + source), honest empty-states, no fabrication.
- `core/agent.mjs` — deterministicRoute + renderCards + composeText (grounded-by-construction template) + **unit-aware grounding guard** (kind-tagged %/$/GPA/SAT/count + word-form % + ratios + certainty-phrase blocklist) + createAgent(model?) enforcing the guard on both paths.
- `test/` — 38 real tests over the 101-school corpus, no mocks. Independent adversarial review at every CP; CP-C found 2 real BLOCKERs (unit laundering, word-form escapes) → fixed → re-verified SHIP.

## New this run (CP-C)
- The "can't lie" enforcement is now real code + tested: a fabricated %/$ or certainty phrase from a model is caught and replaced by the grounded template; verified end-to-end (3535 corpus runs, 0 leaks).
- Fixed a real regex bug (`88%` was silently missed — `\b` after `%`).

## Pending / next
- **CP-D**: build the web PWA — conversational surface, generative cards from `renderCards`, user-model persistence (localStorage first), onboarding, **#15 attrition + locus-of-control paired**, shareable link. Wire `createAgent()` (deterministic, key-free) as the live brain; real Claude model drops into the seam later.

## GAPS to come back to (numbered — do NOT fake, address at the right stage)
| # | Gap | Where it bites | Stage to fix |
|--|--|--|--|
| GAP-1 | Program-rate provenance (institutional vs newspaper vs derived) lives only in prose → all badged "reported". Needs a structured `programVerified.rateSource` enum via a **reviewed data edit** (H4/H5 pattern). | programOddsTool under-claims Drexel; can't distinguish sources | data-structuring (local, reviewed) |
| GAP-2 | BS/MD **attrition/retention** data not in our dataset (G1). Tool honestly says "not published". | the differentiator (#15) has no real numbers yet | CP-F / data sourcing (needs approval) |
| GAP-3 | **Outcome data** (Scorecard net-price/ROI, BLS wages, AAMC match) not local. | path-to-practice (#19) ships as structure only | CP-F (web pull, needs approval) |
| GAP-4 | True **BS/MD 7-yr cost** needs a med-years count (not in data). costTool shows raw affiliated med cost only. | full cost-to-MD | data sourcing |
| GAP-5 | Guard **documented gaps** (model-path safety net only): spelled-out word ratios, bare-int % with no nearby chance word, novel certainty phrasing. | only matters once a live model is attached | when wiring the real model (post-MVP) |
| GAP-6 | iOS/web **band-threshold** reconciliation (web .75/.55/.30 vs iOS .80/.50/.20). | cross-surface consistency | Stage-2 decision |
