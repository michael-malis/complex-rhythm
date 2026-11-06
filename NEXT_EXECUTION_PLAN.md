# Rhythm Studio — active backlog (consolidated)

**Baseline:** `main@454b7c4466851e82946034ce4a47019c716ee218`, after merged [PR #1](https://github.com/michael-malis/complex-rhythm/pull/1). Technical and Pages workflows passed on that SHA. **Published ≠ finally accepted.**

## Project counters: operational versus historical

- **Active operational backlog: 14 macro tasks (M01–M14), not 358 separate daily actions.** Each macro is a coherent, independently testable engineering/product result.
- **Historical traceability register:** existing `TASKS.md` with 652 item IDs stays intact for audit; snapshot **294 VERIFIED / 60 IN_PROGRESS / 294 TODO / 4 BLOCKED / 0 FAILED**, **52/98 original requirements VERIFIED**. Its micro-rows are **not** assigned or reported as independent day-to-day tickets. They act as checklists/evidence only. Consolidation does **not** certify unfinished requirements.
- **Fourteen macro tasks** are the only new operational units for planning, progress updates, and development PRs. On CI acceptance, report `Mxx` completed, linked source requirement IDs and supporting evidence. No multiplying tasks into another set of hundreds.
- Product additions approved after this baseline go into `CHANGE_REGISTER.md` with a single macro and measurable acceptance. They do not silently change the 98 original criteria.
- Tasks can run in parallel where safe, but **M14 is the last sign-off**. External blockers are tracked explicitly rather than disguised as developer tasks.

## Fourteen outcome-focused tasks

| Task | Outcome | Source requirements | Priority | Status | Definition of done |
|---|---|---|---|---|---|
| M01 | Post-merge baseline + development discipline | R-AUD-001, R-AUD-003, R-PROC-001, R-PROC-002, R-PROC-004, R-PROC-005, R-PROC-006, R-PROC-007, R-PROC-008 | P0 | TODO | Current main/deployment status is accurate, CI/PR guards work, evidence and fix workflow reproducible |
| M02 | Rhythm examples: visible, safe category browsing | CR-UX-001 | P0 | IN_PROGRESS | Open on load; browsing never loads a rhythm or restarts audio; explicit example load works in desktop/mobile |
| M03 | Circular geometry + responsive layout | R-GEO-002, R-UI-006, R-UI-007, R-QT-003 | P0 | TODO | Zero unintended marker/label/hand clashes or clipped controls at six required viewports × two themes, n=1…64 with zoom |
| M04 | Readable UI copy, contrast and typography | R-UI-004, R-UI-005 | P1 | TODO | Every mandatory label and tooltip audited; measured contrast passes in both themes |
| M05 | Exact mathematical typography and placement | R-TEX-002, R-TEX-004, R-TEX-005, R-TEX-006 | P1 | TODO | All mandatory root/angle/union formulas use KaTeX + MathML with correct scale and placement |
| M06 | Formula synchronization and math audit | R-TEX-007, R-TEX-008 | P1 | TODO | Angle/degree/import/theme changes update all formulas without focus loss, raw TeX or layout jumps; auditable catalog |
| M07 | Distinct instrument synthesis | R-SND-001, R-SND-003, R-SND-004 | P0 | TODO | All required voices and acid/industrial controls produce measurable, correctly routed distinct envelopes and spectra |
| M08 | Audio safety and scheduling stability | R-SND-005, R-SND-006 | P0 | TODO | Limiter, dense mix, no click-pops, no scheduler duplication, clock accuracy and offline operation pass tests |
| M09 | Genre evidence and implementation mapping | R-RES-001, R-RES-002, R-RES-003 | P1 | TODO | Each mandatory genre/source maps to concrete mathematical events, preset IDs and synth decisions |
| M10 | Musical structure across the 50 presets | R-PST-006 | P1 | TODO | Contrast, accents, lane roles, density and structured variations checked with per-preset evidence |
| M11 | Independent measurement and full regression | R-QA-002, R-QA-004, R-QA-005 | P0 | TODO | Complete real computed/style/Canvas/touch/overlap/clip tests and full CI at final code SHA with artifacts |
| M12 | Original annotated visual acceptance | R-AUD-002, R-UI-003 | BLOCKER | BLOCKED | Both original annotated screenshots available and every requested UI correction compared and documented |
| M13 | Human sound, mobile and accessibility acceptance | R-SND-007, R-PST-004 | BLOCKER | BLOCKED | Human listens to 50 presets and all new voices; phone and screen reader checks recorded; defects re-tested |
| M14 | Final seven-gate acceptance and traceability | R-GOV-001, R-GOV-002, R-GOV-003, R-GOV-004, R-GOV-005, R-FIN-001, R-FIN-002, R-FIN-003, R-FIN-004 | LAST | TODO | 98/98 requirements & 652/652 historical checks verified, no blockers, all seven gates PASS |

**Coverage invariant:** every one of the 46 originally unverified parent `R-*` IDs occurs in exactly one macro. `CR-UX-001` is the newly requested UX behavior and does not replace an original requirement. The historic 294 verified tasks remain verified. Verify through `node scripts/verify-execution-plan.mjs`.

## Execution sequence

**Now:** M02, then M01 and M03 (start M12/M13 evidence requests in parallel). **Next:** M04–M06 UI/math, M07–M08 sound, M09–M10 research/presets. **Then:** M11 independent regression. **Last:** M14 after M12/M13 evidence is supplied and all required checks truly pass.

**PR discipline:** develop in narrow branches from current `main`; do not merge unfinished features into the published Pages release. Every engineering PR needs its own tests, regression result and requirement mapping. Historical task statuses change **only** after evidence-backed verification, never because a macro was created or a file exists.

## Current concrete UX change: M02

`Rhythm examples` starts expanded on desktop and mobile, remains user-collapsible. Switching the Category dropdown filters visible examples **without replacing the loaded rhythm**. It does not reset the original/modified identity, BPM, root sets, audio sound category or Web Audio scheduler. If the currently loaded rhythm belongs to another category, the Example select shows an explicit choose-example placeholder and text states which rhythm remains loaded. **Only** choosing an Example or mathematical ratio loads a new rhythm. Imported JSON and explicit preset changes synchronize the browser category with the selected source. Regression: `tests/preset-category-navigation.mjs`, `tests/preset-modified.mjs`, `tests/ui-smoke.mjs` and full UI/audio CI.

## Product ideas awaiting user selection (not mandatory tasks)

These are possible additions consistent with **mathematical visualization first, audio second**. They are **not** counted in the fourteen tasks, and no new acceptance criterion is introduced until selected.

- **P-IDEA-01 — Compare rhythms A/B.** Side-by-side root geometry with a common phase axis and an audible switch to reveal mathematical differences.
- **P-IDEA-02 — Favorites / quick snapshots.** Save a chosen root configuration and restore/compare it, preserving the existing JSON schema.
- **P-IDEA-03 — Guided math explorer.** Short contextual visual explanations of why changing argument rotates the rhythm, why changing degree alters event count, and how unions differ from polyrhythms.
- **P-IDEA-04 — Isolate one lane.** Temporary solo/compare control to hear and see the mathematical contribution of each root set.

No DAW-like piano roll or new musical complexity is assumed as an implicit requirement.

## Documentation and status rules

The old W01–W08 grouping and the old global 2/10 counter are superseded as **operational views** by M01–M14. Historic acceptance IDs and evidence remain fully intact. Report counts separately: (1) macro outcomes completed out of 14, (2) original 98 requirements verified, (3) blockers. A macro is not complete if its `Definition of done` or source requirements remain outstanding.

The current app is already published from main. `FINAL_REPORT.md` must eventually describe that true deployment state, while retaining `NOT COMPLETE` until the full manual and automated acceptance gates pass.
