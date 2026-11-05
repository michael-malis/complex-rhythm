# QA report — specification upgrade

**Date:** 2026-11-05  
**Release status:** NOT COMPLETE — changes are isolated in `upgrade/spec-2026-11-math-audio`; `main` and published GitHub Pages are intentionally unchanged pending the required acceptance gates.

## 1. Evidence and completed automated runs

| Check | Real test | Result | Reproducible evidence |
|---|---|---|---|
| Requirement registry | 98 IDs, 651 tasks, reverse references, acceptance and status consistency | Integrity check passed on initial registry; remaining statuses are pending reconciliation | [Actions 42106152581](https://github.com/michael-malis/complex-rhythm/actions/runs/42106152581) |
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
5. `TASKS.md`, `TRACEABILITY.md` and `ACCEPTANCE_CRITERIA.md` were reconciled through CI: 185 task records VERIFIED, 4 BLOCKED, 74 IN_PROGRESS and 388 TODO. Seven-gate acceptance remains unfinished.

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

The working-branch changes remain in draft PR #1; they are not claimed to be deployed or independently accepted.

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
