# QA report — specification upgrade

**Date:** 2026-11-05  
**Release status:** NOT COMPLETE — changes are isolated in `upgrade/spec-2026-11-math-audio`; `main` and published GitHub Pages are intentionally unchanged pending the required acceptance gates.

## 1. Evidence and completed automated runs

| Check | Real test | Result | Reproducible evidence |
|---|---|---|---|
| Requirement registry | 98 IDs, 651 tasks, reverse references, acceptance and status consistency | Integrity check passed on initial registry; remaining statuses are pending reconciliation | [Actions 42106152581](https://github.com/michael-malis/complex-rhythm/actions/runs/42106152581) |
| Original baseline | 1600×1000, 1440×900, 1280×800, 1024×768, 768×1024, 390×844, each in light/dark | 12 screenshots and font/color/contrast/panel metrics archived | [Actions 42011738339](https://github.com/michael-malis/complex-rhythm/actions/runs/42011738339) |
| Pure mathematics | Roots of 1/−1/i, coordinate round-trips, zero, degree17/32/64, Euclidean/LCM, 2π periodicity, 640-event dense planner | 60 mathematical assertions passed | [Actions 42105929881](https://github.com/michael-malis/complex-rhythm/actions/runs/42105929881) |
| Seven-screen UI regression | Four independent editors, root dragging, composition/true intersection, 35 original +15 new presets, JSON round-trip | 144 assertions passed, no user-facing JS errors | [Actions 42106425023](https://github.com/michael-malis/complex-rhythm/actions/runs/42106425023) |
| Mathematical typography | Self-hosted KaTeX 0.16.22, `\dfrac{}` geometry, six screen sizes × two themes, Cartesian/Polar, direct zoom | 108 assertions passed | [Actions 42106425023](https://github.com/michael-malis/complex-rhythm/actions/runs/42106425023) |
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
| FIX-003 | Light-theme logo separator was below 4.5:1 | 4.38:1 at seven widths | Darken light accent from #a95846 to #9d4939 | Recheck in `tests/accessibility-contrast.mjs`; latest run pending in this report revision |
| FIX-004 | Multi-set intersection implemented base ∩ union(extras) | Incorrect result for three operands | Implement intersection of every explicitly supplied set | Browser test covers R₄(1) ∩ R₃(1) ∩ R₂(−1) = ∅ |
| FIX-005 | >256 events in one lane rejected despite valid high-density settings | 640-event combination exceeded ceiling | Increase bounded-event cap to1024 | 640-event mathematical regression added |
| FIX-006 | Cycle length input changed only on blur | 3:4 common period failed live test | Use input event and update canonical state | Browser polymeter test passed |

These are real failure records, not hypothetical problems. Earlier failed CI runs remain in GitHub Actions.

## 4. Outstanding mandatory validation

1. Two user-annotated screenshots mentioned by the specification are absent from the supplied master document. Their exact marked areas cannot be confirmed pixel by pixel.
2. No documented **human listening** across all 50 presets and six acid voices. Technical output is measured, but musical quality remains unverified as explicitly mandated in `R-SND-007`.
3. No actual-phone audio/gesture assessment, assistive-technology screen-reader walkthrough or independent subjective design review.
4. Dense high-degree markers can overlap geometrically at default 360px width; magnified scrollable view is implemented rather than shrinking all dots. Need a human review of navigation usability.
5. `TASKS.md` still requires exhaustive evidence/status reconciliation; integration cannot be marked fully accepted without Gate VII.

## 5. Test protocol

Run the repository's workflows `ui-regression.yml`, `spec-baseline.yml`, `preset-diversity.yml`; inspect **both** screenshot and audio artifact archives. Re-run full regression after the final production code change. Do not replace human listening with automatic statistics, do not hide failed CI runs, and do not merge an unfinished version solely because a subset of CI is green.
