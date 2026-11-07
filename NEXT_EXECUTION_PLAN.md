# Rhythm Studio — active backlog (consolidated)

**Baseline:** `main@454b7c4466851e82946034ce4a47019c716ee218`, after merged [PR #1](https://github.com/michael-malis/complex-rhythm/pull/1). Technical and Pages workflows passed on that SHA. **Published ≠ finally accepted.**

**Current release checkpoint (7 November 2026):** The historical baseline above records the initial consolidation only, **not the current main HEAD**. The successful production cycles through [PR #17](https://github.com/michael-malis/complex-rhythm/pull/17) delivered a single `Category → Preset` toolbar, 50 unchanged canonical studies plus one user-supplied `Song Examples` rhythm (51 selectable), differentiated Acid synthesis and lane-local volume. The optional bottom Sound Lab was merged through [PR #18](https://github.com/michael-malis/complex-rhythm/pull/18) after its own four CI gates passed and is tracked as CR-UX-008 within M07/M08/M11; the live Pages deployment and ongoing production checks remain separately observable through GitHub Actions.

**Current operational status (7 November 2026, after PR #32 and source-specific R-SND-005 technical acceptance):** **5 VERIFIED / 6 IN_PROGRESS / 1 TODO / 2 BLOCKED = 14 operational macros**, **390/652 historical checks VERIFIED** and **66/98 parent requirements VERIFIED**. M08 is VERIFIED because R-SND-005 production output safety and R-SND-006 true Web Audio scheduling both passed exact-head full UI/audio CI; one unified beat path and the transport/preset regressions also passed. Manual M12/M13 and final M14 remain separate. Reconciled source data is in [TASKS.md](TASKS.md) and [LEDGER_EVIDENCE_SUMMARY.json](LEDGER_EVIDENCE_SUMMARY.json).

**Status reconciliation:** M08 (audio clock, coherent event triggering and master output safety) now VERIFIED based on [PR #29](https://github.com/michael-malis/complex-rhythm/pull/29), [PR #32](https://github.com/michael-malis/complex-rhythm/pull/32), and completed [full CI 42348284633](https://github.com/michael-malis/complex-rhythm/actions/runs/42348284633). The original source requirements R-SND-005 and R-SND-006 have independently accepted technical evidence. Source ledger is **390/652** and **66/98**. M05/M06/M07/M10/M11/M01 remain in progress; M12/M13 manual evidence and M14 final release acceptance remain open. Older dated checkpoints below are historical.

**Formal acceptance checkpoint (7 November 2026):** R-TEX-004 is now VERIFIED on [full UI CI 42317538760](https://github.com/michael-malis/complex-rhythm/actions/runs/42317538760): all ten source-matched mandatory formulas are KaTeX/MathML, not raw LaTeX, and render without clipping in 12 viewport/theme cases; the independent math audit validates 12 actual Chromium PNGs. This changes **one original requirement and one historic parent task**, but **not** the 14-macro status: M05 still needs R-TEX-002/005/006 and M06's R-TEX-008 historical visual comparison remains open.


## Project counters: operational versus historical

- **Active operational backlog: 14 macro tasks (M01–M14), not 358 separate daily actions; the initial baseline had 1 VERIFIED, and the dated checkpoint above records 4 VERIFIED.** Each macro is a coherent, independently testable engineering/product result.
- **Historical traceability register:** existing `TASKS.md` with 652 item IDs stays intact for audit; initial post-merge snapshot **294 VERIFIED / 60 IN_PROGRESS / 294 TODO / 4 BLOCKED / 0 FAILED**, **52/98 original requirements VERIFIED**. Its micro-rows are **not** assigned or reported as independent day-to-day tickets. They act as checklists/evidence only. Consolidation does **not** certify unfinished requirements.
- **Fourteen macro tasks** are the only new operational units for planning, progress updates, and development PRs. On CI acceptance, report `Mxx` completed, linked source requirement IDs and supporting evidence. No multiplying tasks into another set of hundreds.
- Product additions approved after this baseline go into `CHANGE_REGISTER.md` with a single macro and measurable acceptance. They do not silently change the 98 original criteria.
- Tasks can run in parallel where safe, but **M14 is the last sign-off**. External blockers are tracked explicitly rather than disguised as developer tasks.

## Fourteen outcome-focused tasks

| Task | Outcome | Source requirements | Priority | Status | Definition of done |
|---|---|---|---|---|---|
| M01 | Post-merge baseline + development discipline | R-AUD-001, R-AUD-003, R-PROC-001, R-PROC-002, R-PROC-004, R-PROC-005, R-PROC-006, R-PROC-007, R-PROC-008 | P0 | IN_PROGRESS | Current main/deployment status is accurate, CI/PR guards work, evidence and fix workflow reproducible |
| M02 | Rhythm examples: visible, safe category browsing | CR-UX-001 | P0 | VERIFIED | Open on load; browsing never loads a rhythm or restarts audio; explicit example load works in desktop/mobile |
| M03 | Circular geometry + responsive layout | R-GEO-002, R-UI-006, R-UI-007, R-QT-003 | P0 | VERIFIED | Zero unintended marker/label/hand clashes or clipped controls at six required viewports × two themes, n=1…64 with zoom |
| M04 | Readable UI copy, contrast and typography | R-UI-004, R-UI-005 | P1 | VERIFIED | Every mandatory label and tooltip audited; measured contrast passes in both themes |
| M05 | Exact mathematical typography and placement | R-TEX-002, R-TEX-004, R-TEX-005, R-TEX-006 | P1 | IN_PROGRESS | All mandatory root/angle/union formulas use KaTeX + MathML with correct scale and placement |
| M06 | Formula synchronization and math audit | R-TEX-007, R-TEX-008 | P1 | IN_PROGRESS | Angle/degree/import/theme changes update all formulas without focus loss, raw TeX or layout jumps; auditable catalog |
| M07 | Distinct instrument synthesis | R-SND-001, R-SND-003, R-SND-004 | P0 | IN_PROGRESS | All required voices and acid/industrial controls produce measurable, correctly routed distinct envelopes and spectra |
| M08 | Unified beat triggering, transport and audio safety | R-SND-005, R-SND-006 | P0 | VERIFIED | One consistent per-event playback path, preserved phase/velocity/provenance, reliable Play/Pause/Resume/preset switching, synchronized visual hits, stable clock and safe audio output pass tests |
| M09 | Genre evidence and implementation mapping | R-RES-001, R-RES-002, R-RES-003 | P1 | VERIFIED | Each mandatory genre/source maps to concrete mathematical events, preset IDs and synth decisions |
| M10 | Consistent rhythm semantics and structure across all 50 presets | R-PST-006 | P1 | IN_PROGRESS | A uniform root-to-phase-to-hit interpretation across 50 presets, distinct intra-lane/cross-lane overlaps, meaningful accents, lane roles, density and per-preset evidence |
| M11 | Independent measurement and full regression | R-QA-002, R-QA-004, R-QA-005 | P0 | IN_PROGRESS | Complete real computed/style/Canvas/touch/overlap/clip tests and full CI at final code SHA with artifacts |
| M12 | Original annotated visual acceptance | R-AUD-002, R-UI-003 | BLOCKER | BLOCKED | Both original annotated screenshots available and every requested UI correction compared and documented |
| M13 | Human sound, mobile and accessibility acceptance | R-SND-007, R-PST-004 | BLOCKER | BLOCKED | Human listens to 50 presets and all new voices; phone and screen reader checks recorded; defects re-tested |
| M14 | Final seven-gate acceptance and traceability | R-GOV-001, R-GOV-002, R-GOV-003, R-GOV-004, R-GOV-005, R-FIN-001, R-FIN-002, R-FIN-003, R-FIN-004 | LAST | TODO | 98/98 requirements & 652/652 historical checks verified, no blockers, all seven gates PASS |

**Coverage invariant:** every one of the 46 originally unverified parent `R-*` IDs occurs in exactly one macro. `CR-UX-001` is the newly requested UX behavior and does not replace an original requirement. The historic 294 verified tasks remain verified. Verify through `node scripts/verify-execution-plan.mjs`.

## GitHub work allocation and live evidence

Each macro has a dedicated GitHub issue except the already completed M02. Existing Issues #2 and #3 are the human/external acceptance blockers and must not be replaced by duplicated tickets. Issues are unassigned until a real developer or available coding agent is explicitly identified; creating an Issue does not automatically execute code.

| Task | GitHub issue | Status at last plan review |
|---|---|---|
| M01 | [#5](https://github.com/michael-malis/complex-rhythm/issues/5) | IN_PROGRESS: post-merge documentation and read-only PR-based workflows |
| M02 | [PR #4](https://github.com/michael-malis/complex-rhythm/pull/4) | VERIFIED: explicit example selection; CI 42213078501 |
| M03 | [#6](https://github.com/michael-malis/complex-rhythm/issues/6) | VERIFIED: [complete responsive and formula CI 42229288619](https://github.com/michael-malis/complex-rhythm/actions/runs/42229288619) |
| M04 | [#7](https://github.com/michael-malis/complex-rhythm/issues/7) | VERIFIED: [expanded UI + full contrast CI 42227657811](https://github.com/michael-malis/complex-rhythm/actions/runs/42227657811) |
| M05 | [#8](https://github.com/michael-malis/complex-rhythm/issues/8) | IN_PROGRESS: PR #21 merged; 10 static + 16 live MathML locations and 12 real screenshots pass, original annotated before-review not supplied |
| M06 | [#9](https://github.com/michael-malis/complex-rhythm/issues/9) | IN_PROGRESS: dynamic math/audio/caret accepted, per-formula historical audit pending |
| M07 | [#10](https://github.com/michael-malis/complex-rhythm/issues/10) | IN_PROGRESS: all R-SND-003 acid checks verified; drum timbre and sonic quality remain open |
| M08 | [#11](https://github.com/michael-malis/complex-rhythm/issues/11) | VERIFIED: shared AudioContext scheduler, four audio-locked orbit hands, true production limiter and gain smoothing; full CI 42348284633 |
| M09 | [#12](https://github.com/michael-malis/complex-rhythm/issues/12) | VERIFIED: 15 genre implementation rows and five source-to-code chains validated |
| M10 | [#13](https://github.com/michael-malis/complex-rhythm/issues/13) | IN_PROGRESS: shared canonical event projection between timeline and audio |
| M11 | [#14](https://github.com/michael-malis/complex-rhythm/issues/14) | IN_PROGRESS: PR #23 merged; 14 real CI measurement artifacts verified, final SHA and human gates remain open |
| M12 | [#2](https://github.com/michael-malis/complex-rhythm/issues/2) | BLOCKED: second annotated screenshot |
| M13 | [#3](https://github.com/michael-malis/complex-rhythm/issues/3) | BLOCKED: human audio, physical device, screen reader |
| M14 | [#15](https://github.com/michael-malis/complex-rhythm/issues/15) | TODO |

**Initial issue-creation macro counter:** **1 VERIFIED / 4 IN_PROGRESS / 7 TODO / 2 BLOCKED = 14 total**. Original source counts do not change merely because this plan advances.

## Execution sequence

**Now:** M02, then M01 and M03 (start M12/M13 evidence requests in parallel). **Next:** M04–M06 UI/math, M07–M08 sound, M09–M10 research/presets. **Then:** M11 independent regression. **Last:** M14 after M12/M13 evidence is supplied and all required checks truly pass.

**PR discipline:** develop in narrow branches from current `main`; do not merge unfinished features into the published Pages release. Every engineering PR needs its own tests, regression result and requirement mapping. Historical task statuses change **only** after evidence-backed verification, never because a macro was created or a file exists.

## Current concrete UX change: M02

`Rhythm examples` starts expanded on desktop and mobile, remains user-collapsible. Switching the Category dropdown filters visible examples **without replacing the loaded rhythm**. It does not reset the original/modified identity, BPM, root sets, audio sound category or Web Audio scheduler. If the currently loaded rhythm belongs to another category, the Example select shows an explicit choose-example placeholder and text states which rhythm remains loaded. **Only** choosing an Example or mathematical ratio loads a new rhythm. Imported JSON and explicit preset changes synchronize the browser category with the selected source. Regression: `tests/preset-category-navigation.mjs`, `tests/preset-modified.mjs`, `tests/ui-smoke.mjs` and full UI/audio CI.

## Unified rhythm-triggering model (existing functions only; no feature expansion)

This is a **mandatory refactoring/consistency audit inside M08 and M10**, not a fifteenth macro task and not a new sequencer. Reuse and validate the existing `RhythmMath.planEvents`, `events(track)`, Web Audio `scheduleAhead`, visual draw and preset selection handlers. Preserve the current four-lane, root-based mathematical purpose.

**One common meaning of a beat:** complex root phase → time within the lane cycle → planned sound event → audible attack and corresponding visual feedback. A preset is a configuration of that model, not a separate playback algorithm. The active playback model and the editor/visualization must agree on the same canonical event representation.

1. **Input / source rules (M10).** For every lane and every one of the 50 presets, use the same normalization of phases to `[0,1)`, root-degree `n`, additional direct angles, generated root families and Euclidean events; retain exact set-operation and source metadata. Distinct overlapping events **inside one lane** sound once when the mathematical union calls for a unique phase; simultaneous events on **different lanes** remain independent and audible. Do not silently make four-on-the-floor the default algorithm for all genres or change mathematically unique event positions just to homogenize audio.
2. **Scheduling rules (M08).** Use one real Web Audio clock, deterministic phase-to-time mapping, lane-specific 1–16-bar cycles, independent velocities/accents, and one actual attack per planned lane event. Playback, resume, preset change, editing root angles, `n`, layers, BPM and cycle length must all invalidate stale events in the same controlled way without extra timers or duplicate attacks. Specify and test when a change takes effect (immediately from the next available scheduling window) and how phase continuity is preserved.
3. **Interaction rules (M08, preserving verified M02).** Browsing categories only filters options; **explicit Example selection, mathematical ratio selection, or JSON import** changes the active rhythm. Transport controls must have consistent semantics: Play starts/continues, Pause freezes position, Resume continues predictably, Reset returns to cycle start. Previewing a sound is not an implicit preset change. While playing, switching an example keeps the transport usable and updates the four lanes and audio voices together.
4. **Visual/audio agreement (M08 + M10).** The same hit must appear at the same mathematical phase in the rings and timeline and be audible on the intended lane with the intended velocity/patch. Distinguish between a *highlight of the active event* and changing the root set itself. Preserve the verified reduced-motion feedback without motion.
5. **One uniform set of edge-case tests (M08 + M10).** Cover all 50 presets, four lanes, `n=1,4,7,11,13,17,32,64`, dense coincident events, multilane polyrhythms including `7:11:13:17` and `4:7:9:13`, rapid Play/Pause, preset switching during playback, live editing, JSON import/export and reduced-motion visualization. Collect event-map comparisons, duplicate-event counts, actual attack timestamps, transport/state transitions and browser console errors.

**Acceptance:** no discrepancy between canonical mathematical phases, scheduled hit list, audio attack timing and visible event count; no unwanted automatic loading when browsing; no missing or doubled cross-lane attacks; no stale scheduled notes or uncontrolled audio glitches after changes; preserved backward-compatible JSON and mathematical structure. Existing passing checks are retained and cited; add a new test **only** for genuinely untested behavior or confirmed defects. Human musical judgment remains part of M13.

**Important distinction:** unify the *rules* and the *interaction semantics*, **not** the sound or rhythmic character of all presets. A 3:4 polyrhythm, acid pattern and breakcore study must keep their distinct phase arrangements, accent structures and voices.

## Documentation and status rules

The old W01–W08 grouping and the old global 2/10 counter are superseded as **operational views** by M01–M14. Historic acceptance IDs and evidence remain fully intact. Report counts separately: (1) macro outcomes completed out of 14, (2) original 98 requirements verified, (3) blockers. A macro is not complete if its `Definition of done` or source requirements remain outstanding.

The current app is already published from main. `FINAL_REPORT.md` must eventually describe that true deployment state, while retaining `NOT COMPLETE` until the full manual and automated acceptance gates pass.

**M02 evidence:** [full UI/audio CI 42213078501](https://github.com/michael-malis/complex-rhythm/actions/runs/42213078501). All other active macros retain their previous statuses; historical requirements are not automatically certified.

**M03 phase-label evidence:** [full CI 42219132673](https://github.com/michael-malis/complex-rhythm/actions/runs/42219132673) passed `tests/phase-label-adaptation.mjs`, checking actual KaTeX/Canvas collisions for **50 presets in 10 responsive size/theme states**. Remaining geometric overlap scenarios, dense-ring magnification and human inspection are not yet accepted.

**Latest engineering evidence (42222450657):** 297/652 historical task checks VERIFIED, 60 IN_PROGRESS, 291 TODO, 4 BLOCKED, 0 FAILED. Original requirements remain 52/98 VERIFIED. M03 remains IN_PROGRESS; T-GEO-002-02/-03/-04 are verified, but T-GEO-002-01 is not. Operational macro counter remains 1 VERIFIED / 4 IN_PROGRESS / 7 TODO / 2 BLOCKED.

**Geometry requirement R-GEO-002 accepted ([CI 42224570142](https://github.com/michael-malis/complex-rhythm/actions/runs/42224570142)):** all four atomic conditions and high-density pan/zoom passed. The 46 baseline requirement IDs remain uniquely mapped to the 14 original macros, including those since verified. **Current source ledger:** 299 VERIFIED, 59 IN_PROGRESS, 290 TODO, 4 BLOCKED, 0 FAILED; **53/98 original parent requirements VERIFIED**. Macro M03 is **still IN_PROGRESS** because responsive accessibility R-UI-007 and mathematical formula geometry R-QT-003 remain open.

**M04 accepted via [CI 42227657811](https://github.com/michael-malis/complex-rhythm/actions/runs/42227657811):** exact light palette, computed light/dark text and graphic contrast, all six mandatory hidden UI areas, the full existing instrument menu (15 synthesis voices plus samples), dynamically generated root-family controls and responsive font sizes. **Operational macros: 2 VERIFIED / 4 IN_PROGRESS / 6 TODO / 2 BLOCKED. Original source ledger: 310 VERIFIED / 57 IN_PROGRESS / 281 TODO / 4 BLOCKED / 0 FAILED; 55/98 requirement parents VERIFIED.**

**M03 accepted ([CI 42229288619](https://github.com/michael-malis/complex-rhythm/actions/runs/42229288619)):** R-GEO-002, R-UI-006, R-UI-007 and R-QT-003 are now VERIFIED. The six mandatory window widths (in both themes) meet all measured reflow, clipping, critical control and formula placement requirements, including a five-family long formula. **Operational macros: 3 VERIFIED / 3 IN_PROGRESS / 6 TODO / 2 BLOCKED. Historical source: 325 VERIFIED / 54 IN_PROGRESS / 269 TODO / 4 BLOCKED / 0 FAILED; 58/98 requirement parents VERIFIED.**

**M09 source mapping checkpoint:** [genre traceability CI 42232392096](https://github.com/michael-malis/complex-rhythm/actions/runs/42232392096) PASS. [GENRE_IMPLEMENTATION_MATRIX.md](GENRE_IMPLEMENTATION_MATRIX.md) traces the 15 research genres to actual preset IDs, BPM, four root degrees and instrument voices. Status **IN_PROGRESS**; additional full source-requirement acceptance and human sound judgment remain outstanding. Latest operational view: **3 VERIFIED / 4 IN_PROGRESS (M01/M08/M09/M10) / 5 TODO (M05/M06/M07/M11/M14) / 2 BLOCKED (M12/M13) = 14**; M03 and M04 are VERIFIED. **Historical source remains 325/652 and 58/98**, unchanged by this mapping.

**M09 TECHNICAL ACCEPTANCE:** all R-RES-001/-002/-003 parent requirements and 29 original children VERIFIED based on existing research (five primary links checked in prior study) plus new executable genre/source/implementation traceability [CI 42233466514](https://github.com/michael-malis/complex-rhythm/actions/runs/42233466514), full [UI/audio 42233466373](https://github.com/michael-malis/complex-rhythm/actions/runs/42233466373). **Operational macros 4 VERIFIED / 3 IN_PROGRESS / 5 TODO / 2 BLOCKED.** Source counts **357 VERIFIED / 51 IN_PROGRESS / 240 TODO / 4 BLOCKED / 0 FAILED; 61/98 parent requirements**. Auditory genre authenticity and manual listening remain M13 (BLOCKED).

**Acid synthesis technical checkpoint (CI [42240006060](https://github.com/michael-malis/complex-rhythm/actions/runs/42240006060)):** source R-SND-003 and all 10 children VERIFIED from actual audio response and full regression; M07 is now IN_PROGRESS because R-SND-001/004 and manual sound quality remain open. Source evidence **368 VERIFIED / 50 IN_PROGRESS / 230 TODO / 4 BLOCKED / 0 FAILED; 62/98 requirements**. Operational **4 VERIFIED / 4 IN_PROGRESS / 4 TODO / 2 BLOCKED (14 total)**.

**Math synchronization checkpoint:** [CI 42241763532](https://github.com/michael-malis/complex-rhythm/actions/runs/42241763532) PASS. R-TEX-007 and its 11 children VERIFIED. M06 remains IN_PROGRESS for independent R-TEX-008's per-formula old/new documented evidence. Source now **380 VERIFIED / 49 IN_PROGRESS / 219 TODO / 4 BLOCKED / 0 FAILED**, parent **63/98**. Operational macro **4 VERIFIED / 5 IN_PROGRESS / 3 TODO / 2 BLOCKED**.
