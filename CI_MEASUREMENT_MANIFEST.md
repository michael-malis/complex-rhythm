# Independent CI measurement manifest — M11

**Scope:** R-QA-002, R-QA-004 and R-QA-005. Green CI alone is
not sufficient evidence of a real measurement. The production workflow must
actually run the measurement scripts, preserve the machine-readable results,
and verify that reports contain the requested instrument/viewport coverage.

The last step before uploading the final screenshot artifact runs
`node scripts/verify-ci-measurement-manifest.mjs`. It reads **21 report
files produced by the preceding independent browser/audio tests** and
writes `artifacts/release-evidence-manifest.json`. The validator fails
when a report is missing, malformed, empty or claims PASS despite a
known measured failure. Paths refer to real outputs in the uploaded
`rhythm-ui-screenshots` artifact of the
[UI regression workflow](https://github.com/michael-malis/complex-rhythm/actions/workflows/ui-regression.yml).

| Measurement domain | Source file inside CI artifact | Mandatory assertion |
|---|---|---|
| Computed contrast, light/dark | `contrast-audit.json` | ≥12 tested states, zero recorded text and graphic WCAG failures |
| Touch target dimensions | `touch-target-audit.json` | ≥3 actual mobile/tablet cases, minimum 44 CSS pixels |
| Canvas root geometry | `geometry/measurements.json` | Original source diameter 14px, current ≥28px, 12 responsive states |
| Responsive clipping and reachability | `responsive/content-access.json` | All ≥12 viewport/theme states, actual PASS |
| Expanded UI typography and names | `expanded-ui-typography.json` | ≥12 tested states, actual PASS |
| Phase-label/root intersections | `geometry/phase-label-adaptation.json` | All 50 canonical studies and ≥12 viewport/theme states, zero collisions |
| KaTeX/MathML sources and screenshots | `math-typography-audit/summary.json` | Ten reference, sixteen live, four phase labels and twelve authentic screenshots |
| All 14 original instrument families | `mandatory-voice-inventory/report.json` | Fourteen distinct real source waveforms in two viewport cases: 10 Web Audio synths, 3 decoded sample sources, one Reese fallback; all selectable, non-silent, preserve root phases/transport and avoid overflow |
| Aggressive kick architecture and timbre differentiation | `kick-architecture/report.json` | Four actual Web Audio kick graphs, 8 offline renders at two velocity levels, six gain-normalized distinct waveform pairs, measured kick body/sub filtering and per-patch transient layers |
| Rendered synthesis and spectra | `audio-renders/metrics.json` | 15 synthesized programs at actual 32 kHz sample rate |
| Actual shared master-output safety | `master-output-safety/report.json` | Same code as production at 32/48kHz; 48 live-voice root events, ≤−1dBFS sample/4× interpolated peak, 20Hz filtering of 5Hz energy, smooth volume changes, and kick attack <5ms |
| Multi-lane audio stress and onsets | `audio-mix-stress.json` | ≥50 actual schedules with a finite measured audio-onset drift |
| Transport phase through Pause/Resume, BPM and Reset | `transport-phase-continuity.json` | Real AudioContext phase, two desktop/mobile cases, zero leaked intervals and restart phase 0 |
| Per-instrument colors and wheel stepping | `controls-and-lane-colors/report.json` | Four viewport/theme states, root-matched sliders, independent Master Volume, 1° = π/180 rad wheel, live attack count and no duplicate scheduler |
| Independent four-ring orbit hands synchronized to audible root onsets | `orbital-hands/report.json` | Four desktop/mobile × theme cases; real Canvas arcs, 1/1/2/4 bar speeds, same-length synchronization, correct scheduled sound/root phases, Pause/Resume/Reset/BPM and reduced-motion precision |
| Real Web Audio future scheduling | `audio-clock-scheduling/report.json` | Two browser sizes, real native OscillatorNode.start timestamps against beatEpoch + root plan, less than 12 ms error, at least 15 ms future scheduling, one interval and no leaks |
| Sound Lab synth/local sample view | `sound-lab/measurements.json` | Four desktop/mobile × theme cases PASS |
| Native fallback audio graphs | `native-waveforms/report.json` | Six native programs across four cases PASS |
| Original Acid diversity | `acid-presets/report.json` | Four cases PASS |
| User-supplied song JSON | `song-examples/report.json` | Four import/export, source-precision and transport cases PASS |
| Featured grooves, live instrument gain | `production-grooves/report.json` | Four cases PASS |

**Source/measurement separation:** The historical 14px original dot
measurement is supported by the baseline source audit; current 28px
is derived from actual Canvas measurements. Computed contrast comes
from browser CSS styles, not image appearance. Offline audio metrics
are calculated from audio buffers, not guessed from an oscillator name.
The generated manifest contains the measured case count and reference to
each source report, not invented numbers.

**Non-goals and blockers:** No screenshot alone substitutes for the
underlying computed metrics. Automated output does not establish human
sound quality, physically measured device audio, screen-reader quality,
the missing original annotated screenshot, or a subjective production
acceptance rating. M12/M13 and M14 remain blocked/open as recorded.
Do **not** promote any historical status merely because this script passed. The
source-specific R-SND-006 acceptance is separately documented from completed
[CI 42331875353](https://github.com/michael-malis/complex-rhythm/actions/runs/42331875353).
The source ledger now stands at 398/652 and 67/98 after separately accepted
R-SND-004 per-patch aggressive audio proof from full CI 42358463110. M08 stays
technically VERIFIED. M07 remains IN_PROGRESS for the complete instrument
inventory R-SND-001; M13 human listening, M12 source screenshots and M14 final
release signoff are explicitly not accepted. No perceived sound quality is
inferred from the six normalized waveform comparisons.

**Failure handling:** An absent or failed measurement is a failing
CI gate, not silently skipped and not a green placeholder. The
ordinary GitHub Actions logs identify the source file and assertion;
the failed job retains its actual artifacts where available.
