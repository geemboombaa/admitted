# GOAL — admitted

## North star
One trustworthy college-decision product with **one brain and two faces**: a verified, no-fabrication
dataset + chance/fit/cost engine (the CORE), surfaced as **(1) a web dashboard** (`index1.html`, live on
Vercel) and **(2) a commercial iOS app** (Expo/React Native, App Store). Fix a fact once → both improve.
Trustworthy because every number is verified-with-a-source or plainly flagged estimate — never invented.

See `PRODUCT-VISION.md` for the full product spec (merged from the Claude Desktop vision + iOS handoff docs).

## The merged model
```
        ONE CORE  =  verified data/schools/*.json  +  chance/fit/cost engine  +  trust layer
                          │                                        │
                 WEB (index1.html, live)                 iOS app (Expo/RN, App Store)
```
The iOS concept's central fix (`estimateChance()` computed from the user's GPA/SAT vs each school's real
bands) is the SAME engine the web app already runs — the two projects converged. Merge = share the core.

## Staged objective (locked with user 2026-09-06)
| Stage | Objective | Serves | Data policy |
|---|---|---|---|
| **1. Dataset complete + verified** | fill roster gaps, merge researched values, drive down EST, every published number sourced | web + iOS | **LOCAL DATA ONLY** — verify-batch*, PENDING-RESEARCH, roster. No web. Missing → `GAPS.md`. |
| **2. Engine unified** | one canonical chance/fit/cost engine both surfaces call; reconcile band thresholds | web + iOS | may need approved web pulls (decide at checkpoint) |
| **3. Web UX + wow** | polish the web dashboard | web | no data change |
| **4. iOS app** | MVP (9 locked items, PRODUCT-VISION §MVP) wired to the real core | iOS | **4a** shared-core HTML prototype (loop-drivable) → **4b** native Expo port (separate track) |

**We are in Stage 1.**

## Definition of "done" for Stage 1
- Every school file passes `validate.js`.
- Every school with local verification data has it merged (`verifiedFacts` populated, per-field `src`).
- Zero fabricated numbers. Unverifiable-from-local values EST-flagged AND listed in `GAPS.md`.
- `GAPS.md` = the complete honest list of what still needs web data — the input to the Stage-2 decision.

## Open decisions parked for their stage (do NOT invent answers)
- **Band thresholds (Stage 2):** web = Safety≥75/Likely55-75/Target30-55/Reach<30; iOS = ≥80/50-79/20-49/<20. Pick ONE. Both are round counseling numbers, neither fit to outcome data.
- **iOS platform (Stage 4):** Expo/RN recommended vs native Swift — user call.
- **Compliance (Stage 4):** age-verification (Apple Declared Age Range API), content-feed legal read, FERPA — gates, not optional.

## What "wow" means
Judged by the **user at each checkpoint** by using the live surface — not a self-assigned score. My job at
each checkpoint: open the surface, show a real before→after change, prove the loop is self-correcting.
