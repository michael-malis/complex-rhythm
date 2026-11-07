# QA report — specification upgrade

**Date:** 2026-11-05  
**Release status (post-merge 2026-11-06):** NOT COMPLETE. PR #1 was merged into `main` and GitHub Pages published successfully. This deployment is not the complete requirements/human acceptance signoff; follow-up fixes remain in Draft PR #4.

## 1. Evidence and completed automated runs

| Check | Real test | Result | Reproducible evidence |
|---|---|---|---|
| Requirement registry | 98 IDs, 652 tasks, reverse references, acceptance and status consistency | Integrity check passed on initial registry; remaining statuses are pending reconciliation | [Actions 42106152581](https://github.com/michael-malis/complex-rhythm/actions/runs/42106152581) |
| Original baseline | 1600×1000, 1440×900, 1280×800, 1024×768, 768×1024, 390×844, each in light/dark | 12 screenshots and font/color/contrast/panel metrics archived | [Actions 42011738339](https://github.com/michael-malis/complex-rhythm/actions/runs/42011738339) |
| Pure mathematics | Roots of 1/−1/i, coordinate round-trips, zero, degree17/32/64, Euclidean/LCM, 2π periodicity, 640-event dense planner | 60 mathematical assertions passed | [Actions 42105929881](https://github.com/michael-malis/complex-rhythm/actions/runs/42105929881) |
| Seven-screen UI regression | Four independent editors, root dragging, composition/true intersection, 35 original +15 new presets, JSON round-trip | 166 assertions passed, no user-facing JS errors | [Actions 42106425023](https://github.com/michael-malis/complex-rhythm/actions/runs/42106425023) |
| Accessibility and contrast | Seven responsive sizes × light/dark themes, 162 visible text elements per configuration, key values 7:1 and track palette 3:1 | **14/14 configurations passed, 0 text and 0 track palette failures** after accent color correction | [Actions 42107150484](https://github.com/michael-malis/complex-rhythm/actions/runs/42107150484) |
| Mathematical typography | Self-hosted KaTeX 0.16.22, `\dfrac{}` geometry, six screen sizes × two themes, Cartesian/Polar, direct zoom | 276 assertions passed | [Actions 42106425023](https://github.com/michael-malis/complex-rhythm/actions/runs/42106425023) |
| Synthesizer voices | 15 distinct offline Web Audio voices, WAV files, peak, RMS, onset segment, spectrum proxy | 15/15 rendered; sample peaks ≤0.85 in isolated voice tests | [Actions 42105120394](https://github.com/michael-malis/complex-rhythm/actions/runs/42105120394) |
| Full mix stress + schedule | 50 preset mathematical schedules, 256 voices @22,050Hz, 128 voices @96,000Hz, onset @48kHz | Pass: mix sample peaks 0.5391 and 0.3586; onset offset 0.354ms; −1dBFS sample ceiling respected | [Actions 42105120394](https://github.com/michael-malis/complex-rhythm/actions/runs/42105120394) |
| Preset uniqueness | Real 50×4 event calculation; exact structure, absolute schedules, schedules up to one common phase rotation | 50 unique IDs, 50 distinct absolute and cyclic-equivalence schedules; 37 distinct instrument quartets | [PRESET_DIVERSITY_REPORT.md](PRESET_DIVERSITY_REPORT.md) |

**Important distinction:** sample-peak measurements from an OfflineAudioContext are not a certificate of reconstruction-filter **true peak** or headphone comfort. Synthesized waveform differences are not evidence of subjective musical authenticity.

## 2. Baseline comparison

| Item | Baseline | Current code/test condition |
|---|---|---|
| Smallest observed UI font | 9px on 390px mobile, 10px on sampled desktop | CSS sets 16px minimum; runtime 12-state test enforces ≥16px on named components |
| Main heading / section heading | Smaller or inconsistently scaled | 30px / 26px target; runtime verified |
| Root point diameter | 14px source-level | 28px source-level, active diameter up to 40px (1.429×) |
| Adjacent ring spacing (338px plot) | About 32px | 40px |
| Displayed math | Plain Unicode and formula fragments | KaTeX HTML+MathML; three vertically typeset fractions |
| Editing | Cartesian numeric | Cartesian/Polar, rad/deg, strict secure complex expression |
| Rhythm engine | A single global cycle | Independent 1–16-bar lanes, true LCM, bounded 4-bar window |
| Presets | 35 | 50; no remaining duplicate full event schedules |
| Extra roots | Union, selected source | True set union and intersection, source metadata and explicit separate Euclidean generator |
| Synth voices | Original samples and fallback | 15 distinguishable synthesizers, six acid patches, actual per-voice controls |

## 3. Defects discovered and corrected

| ID | Finding | Observed | Change | Verification |
|---|---|---|---|---|
| FIX-001 | DynamicsCompressor look-ahead delayed generated attack | 11.354ms vs target ≤5ms | Remove intrinsic look-ahead node, soft limited HP output; compensate measured group delay | Later 0.354ms sample onset test passed |
| FIX-002 | Some original preset aliases had identical exact events | 47/50 unique | Change actual accent positions, not names | 50/50 raw and cyclic unique |
| FIX-003 | Light-theme logo separator was below 4.5:1 | 4.38:1 at seven widths | Darken light accent from #a95846 to #9d4939 | Passed: 0 failures across 14 configurations in Actions 42107150484 |
| FIX-004 | Multi-set intersection implemented base ∩ union(extras) | Incorrect result for three operands | Implement intersection of every explicitly supplied set | Browser test covers R₄(1) ∩ R₃(1) ∩ R₂(−1) = ∅ |
| FIX-005 | >256 events in one lane rejected despite valid high-density settings | 640-event combination exceeded ceiling | Increase bounded-event cap to1024 | 640-event mathematical regression added |
| FIX-006 | Cycle length input changed only on blur | 3:4 common period failed live test | Use input event and update canonical state | Browser polymeter test passed |

These are real failure records, not hypothetical problems. Earlier failed CI runs remain in GitHub Actions.

## 4. Outstanding mandatory validation

1. One user-uploaded annotated `image.png` (506×556px) was recovered from conversation files and compared with the redesigned Track 1 controls. The second screenshot cited by the master specification remains missing; see issue #2.
2. No documented **human listening** across all 50 presets and six acid voices. Technical output is measured, but musical quality remains unverified as explicitly mandated in `R-SND-007`.
3. No actual-phone audio/gesture assessment, assistive-technology screen-reader walkthrough or independent subjective design review.
4. Dense high-degree markers can overlap geometrically at default 360px width; magnified scrollable view is implemented rather than shrinking all dots. Need a human review of navigation usability.
5. [Full UI/audio CI 42402890258](https://github.com/michael-malis/complex-rhythm/actions/runs/42402890258) accepted original R-TEX-008 historical first-party mathematical formula audit: 12 actual before/after Chromium cases, 24 real historical and current release PNGs, 10 source-matched formula refs, current 16 dynamic MathML locations and 26 verified real JSON reports. Source totals: **450 VERIFIED**, **39 IN_PROGRESS**, **159 TODO**, **4 BLOCKED**, **73/98 parents VERIFIED**. M06 technically complete; M12 still lacks the second user-annotated original and human M13 phone/audio/screenreader and M14 release signoff remain unresolved.

## 5. Test protocol

Run the repository's workflows `ui-regression.yml`, `spec-baseline.yml`, `preset-diversity.yml`; inspect **both** screenshot and audio artifact archives. Re-run full regression after the final production code change. Do not replace human listening with automatic statistics, do not hide failed CI runs, and do not merge an unfinished version solely because a subset of CI is green.

## 6. Later defect tests and documented fixes

| ID | Observed failure | Fix | Automated evidence |
|---|---|---|---|
| FIX-007 | Four range sliders had only 40px vertical target area on 360, 390 and 768px; argument slider was only 39px wide on 360px | Raise all range inputs to ≥44px and reflow argument slider as separate row on narrow devices | 231 controls measured at 3 touch viewports: zero remaining undersized targets, Actions 42117874127 |
| FIX-008 | Extra-root terminology required considerable inference for first-time math users | Add interactive worked example: fourth plus third roots with six actual phases and one collision, correctly labelled using `\Phi` | Browser tests confirm base=4, added=3, result=6, KaTeX phase-set formula |
| FIX-009 | New industrial `noiseBurst` voice had RMS ≈0.0008 versus other voices typically ≈0.013–0.069 in identical offline renders | Boost only the noise-source synthesis/amplitude envelope, retain master limiter; add minimum RMS and transient assertions for all 15 voices | Updated audio-offline test and high-density mix stress passed, Actions 42117874127 |

These remain **technical acceptance records**. Hearing quality and exact genre authenticity still require human assessment.

## Follow-up engineering verification — 2026-11-06

Historical note: this text was written while PR #1 was Draft. PR #1 has since been merged and deployed; independent human/visual acceptance remains incomplete.

| Case | Actual evidence | Measured result |
|---|---|---|
| Asynchronous Play / Cancel | [CI 42132119969](https://github.com/michael-malis/complex-rhythm/actions/runs/42132119969), `tests/transport-race.mjs` | Double/triple click, 10 pause/resume cycles and final rapid cancellation; timer creation/clear counts balanced |
| Rapid preset switching | Same CI, `tests/transport-switching.mjs` | 24 running-state transitions, selected math/instruments refreshed, old voice buses reclaimed |
| Four-lane mathematical provenance | Same CI, `tests/event-properties.mjs` | 400 deterministic combinations; 200 unions, 200 intersections, 134 with Euclidean sources, 13 boundary orientations; phase outputs and planner source/instrument/patch/articulation metadata agree |
| Mandatory nonstandard first lane | [CI 42131998402](https://github.com/michael-malis/complex-rhythm/actions/runs/42131998402) | 12 of 15 new studies are not four equally spaced onsets in the first lane, meeting the exact ≥12 threshold |
| General browser regression | [CI 42132119969](https://github.com/michael-malis/complex-rhythm/actions/runs/42132119969) | 173 responsive/interaction assertions plus 310 math typography/coordinates/zoom assertions, both successful |

### Corrective records

- **FIX-007**: rapid Play requests previously could overlap asynchronous sample preparation and create a duplicate transport. Corrected through synchronous intent/ticket invalidation and one live scheduler invariant. The older regression incorrectly assumed Play always became active synchronously, and was updated to await the explicit playing state.
- **FIX-008**: an initial transport-race test contained an incorrect four-click expectation from the already-playing state. Corrected to a three-click final cancellation. An earlier failed CI run remains visible; the final scenarios passed.
- **FIX-009**: mathematical provenance was not independently tested against its own input root sets. Exposed a read-only event source snapshot and exercised 400 random configurations; no provenance mismatches in the tested domain.

**Remaining limitations:** computational matching is not human musical listening. Real-phone audio, screen-reader signoff, second annotated source image and independent visual inspection remain open. Previously verified requirements must return to FAILED if a future test proves their behavior incorrect.

## Full regression addendum — 2026-11-06

**Verified technical CI:** [42151010633](https://github.com/michael-malis/complex-rhythm/actions/runs/42151010633), commit `cd3cd36e7cc0fe52585bcde157c6f7982316da30`, passed every job step after fixes to live root dragging, pre-mounted radian/degree input fields, symbolic π test parsing, and revised Cartesian/angle-first regression selectors. All failed intermediate CI attempts are retained for historical traceability. The dense offline audio test includes an estimated oversampled between-sample peak in addition to ordinary sample-peak measurement. It is not a certified true-peak or human listening test.

Historical snapshot from CI 42151010633 (not the current ledger): **233 VERIFIED; 66 IN_PROGRESS; 349 TODO; 4 BLOCKED; 46/98 parent requirements VERIFIED**. Mathematical typography and responsive matrix evidence is registered separately. Missing second annotated image, human audition of voices/presets, and physical-device/screen-reader review continue to block final acceptance.

## Beat animation regression — 2026-11-06

- **PASS:** [full CI 42209284567](https://github.com/michael-malis/complex-rhythm/actions/runs/42209284567), with new `tests/beat-visual-acceptance.mjs` included in the existing end-to-end pipeline.
- Canvas arc observation during actual Web Audio playback confirms a pulse of at least 1.4× the base 28px marker across multiple rendered frames, with transient fill/halo feedback and a return to the base geometry after the pulse.
- `prefers-reduced-motion: reduce` suppresses expansion while retaining stationary brightness feedback; pause clears any transient beat feedback. Initial transport preroll is gated on the actual `beatEpoch`.
- **R-GEO-003 now has executable acceptance evidence**. This does not close `R-GEO-002` or `R-GEO-007`; marker/label overlap audits, physical mobile evaluation, human musical listening, screen-reader acceptance, and the missing second original annotated screenshot remain open.

## Geometry matrix acceptance — 2026-11-06

All eight atomic R-GEO-007 checks now have independent reproducible automated evidence: ring radii, marker diameter, cardinal positions, label bounds, coincident events, drag, magnification, and responsive window changes. The complete [CI 42209284567](https://github.com/michael-malis/complex-rhythm/actions/runs/42209284567) succeeded. The exact task audit was committed by [CI 42209716913](https://github.com/michael-malis/complex-rhythm/actions/runs/42209716913).

**Not included in this pass:** the stricter no-overlap condition R-GEO-002, human mobile/assistive review, listening assessment, and the missing second annotated screenshot. These retain their respective open/blocked statuses.

## Post-merge execution evidence — 2026-11-06

**Scope:** current Draft PR #4 (not yet merged); this is an incremental engineering test record, not the complete seven-gate/human acceptance.

| Evidence | Actual result | Remaining boundary |
|---|---|---|
| [UI/audio CI 42218090614](https://github.com/michael-malis/complex-rhythm/actions/runs/42218090614) | PASS: unified JSON/preset sound-family import and 50-preset event/source/phase parity with existing mathematical and audio tests | M08/M10 source requirements still require full acceptance |
| [Single voice-bus CI 42216970184](https://github.com/michael-malis/complex-rhythm/actions/runs/42216970184) | PASS: one voice-bus replacement for each isolated BPM, lane-cycle and root-angle edit with transport timer intact | No independent human sound judgment |
| [Label geometry CI 42219132673](https://github.com/michael-malis/complex-rhythm/actions/runs/42219132673) | PASS: real dynamic KaTeX label bounding boxes avoid all root markers for 50 presets in 5 viewport sizes and both themes (500 actual preset-layout cases) | Other M03 geometric clashes and dense within-ring roots remain open |
| [Ledger CI 42217527814](https://github.com/michael-malis/complex-rhythm/actions/runs/42217527814) | PASS: read-only checks of all 652 legacy task IDs, 98 requirements, all 46 open macro mappings and summary totals | Does not promote TODO/BLOCKED to VERIFIED |

**Diagnostic baseline before the label correction:** the initial 50-preset Canvas/DOM audit produced 120 root/phase-label intersections in 12 viewport/theme cases, zero resting between-ring intersections, and 388 same-ring intersections on dense default views. The latter are not silently deemed acceptable: the existing magnified/pannable root inspection must be tested and human visual acceptance remains required.

**Current statuses:** source ledger remains 294 VERIFIED / 60 IN_PROGRESS / 294 TODO / 4 BLOCKED; 52/98 requirement parents verified. Operational tasks: M02 VERIFIED, M01/M03/M08/M10 IN_PROGRESS, M12/M13 BLOCKED and seven other macros TODO. The merge/deployment of prior PR #1 does not qualify the still-open changes in Draft PR #4 as published.

## Geometric atom evidence — CI 42222450657

**PASS** rendered phase labels avoid marker geometry and ring arcs across all 50 presets on six mandatory viewport sizes and both themes. The playback hand is drawn as segments avoiding root markers and their transient halo; `tests/playback-hand-clearance.mjs` checks 12,916 root/phase configurations. The 128-event inner-ring magnification test and a viewport-preserving pan edit passed. **R-GEO-002 remains IN_PROGRESS** until T-GEO-002-01 and other relevant full requirements have reproducible evidence. Ledger: **297 VERIFIED / 60 IN_PROGRESS / 291 TODO / 4 BLOCKED**, parent 52/98.

## Full circular geometry acceptance — 2026-11-06

**PASS [CI 42224570142](https://github.com/michael-malis/complex-rhythm/actions/runs/42224570142)**: for R-GEO-002, playback pointer never crosses root markers, phase-fraction KaTeX labels avoid plotted roots and four ring arcs, neighboring rings remain separated under worst-case 1.4x simultaneous beat pulses, and high-density n=64 plus 64 offset events remain zoomable/pannable while preserving the viewed region after parameter edits. Source ledger updated with a full parent proof. R-GEO-002 is VERIFIED; responsive screen controls R-UI-007 and typography layout R-QT-003 remain independently open. Ledger: **299/652 VERIFIED, 53/98 requirements**.

## Complete text and contrast audit — 2026-11-06

**PASS [CI 42227657811](https://github.com/michael-malis/complex-rhythm/actions/runs/42227657811)**. All default-hidden sections opened and measured in six responsive sizes in both themes. All 37 cataloged instrument choices and controls (15 distinct synthesized voices plus existing samples) are meaningfully labeled; generated angle/root controls and tooltips checked. Actual Chromium-computed contrast across 14 theme/size combinations achieved required thresholds (4.5:1 ordinary text; 7:1 key mathematical/numeric labels; 3:1 track indicators), 0 failures. Registered R-UI-004 and R-UI-005 VERIFIED; M04 VERIFIED. Human sound and device reviews remain separate.

## Complete responsive adaptation and formula placement — 2026-11-06

[Full UI/audio CI 42229288619](https://github.com/michael-malis/complex-rhythm/actions/runs/42229288619) **PASS**. Six mandatory window dimensions in two themes, all critical transport/editor controls reachable, no major panel or lane overlaps, no clipped text or global scaling, 28px marker sizing and magnification retained; ten KaTeX+MathML references remain separate and centered, and five-generated-root formula chains scroll instead of forcing page overflow. R-UI-006, R-UI-007 and R-QT-003 are VERIFIED (15 additional historical task rows). M03 VERIFIED, historic totals **325/652** and **58/98 parent requirements**. Manual physical-device acceptance remains in M13; this is browser emulation evidence, not a human physical-phone check.

## Cross-lane rhythm and 15-genre mapping checkpoint — 2026-11-06

- [UI/audio 42231878412](https://github.com/michael-malis/complex-rhythm/actions/runs/42231878412) PASS: independent attacks at exactly shared moments on four lanes; duplicate root families within one lane merge sources rather than multiplying attacks; all 50 preset event/time schedules preserve source metadata across window partitions.
- [Genre source mapping 42232392096](https://github.com/michael-malis/complex-rhythm/actions/runs/42232392096) PASS: 15 existing research lines map to real preset IDs/BPM/four root degrees/voice names. This is **not** human listening or authentic genre reproduction. M09 remains IN_PROGRESS.

## Complete genre research/mapping acceptance — 2026-11-06

**Source research criteria PASS:** [CI 42233466514](https://github.com/michael-malis/complex-rhythm/actions/runs/42233466514) validated 15/15 mandatory genre implementation rows, exact catalog BPM/root degrees/sound names, and 5/5 original source-article technique→code→preset→test mappings. Five primary links were independently fetched on 2026-11-05 and recorded in RHYTHM_RESEARCH.md; additional sources and limitations included. [Full regression 42233466373](https://github.com/michael-malis/complex-rhythm/actions/runs/42233466373) PASS. R-RES-001/-002/-003 and 29 children accepted, M09 VERIFIED. No human listening, sound authenticity, physical-phone or screen-reader signoff. Historical 357/652 VERIFIED, parent 61/98.

## Acid synthesis technical acceptance — 2026-11-06

[CI 42240006060](https://github.com/michael-malis/complex-rhythm/actions/runs/42240006060) PASS: six acid program waveforms, 15 pairwise differences, and 18 offline parameter changes to oscillator, cutoff, resonance, decay, accent, glide, modulation, filter envelope and drive. Real synthesis state persists after progressive-disclosure UI redesign. R-SND-003 and ten associated children VERIFIED. Listening/genre fidelity M13 and remaining M07 instrument/processing requirements are **not** certified. Ledger 368/652, parent 62/98.

## Dynamic mathematics/audio acceptance — 2026-11-06

**PASS** [42241763532](https://github.com/michael-malis/complex-rhythm/actions/runs/42241763532): four complex-angle editors and an additional union point keep insertion caret/focus, mathematical root phases, formula rendering and live audio schedule synchronized. No duplicate scheduler; existing responsive and render stability checks passed. R-TEX-007 VERIFIED; R-TEX-008 remains open. 380/652 tasks and 63/98 parent requirements verified.
