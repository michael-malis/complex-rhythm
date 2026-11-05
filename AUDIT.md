# Initial architecture audit — 2026-11-05

Status: **PRELIMINARY / NOT COMPLETE**. Started before modifying application code.

## Current implementation
- Static GitHub Pages site in `michael-malis/complex-rhythm`; semantic `index.html`, one `styles.css`, one `app.js`, existing sample assets and Chromium test suite.
- Four independent complex-number rhythm lanes, concentric Canvas rings, `a,b,n` numeric inputs, sound selectors, project JSON schema `roots-rhythm/1`.
- 35 genre examples; original phase roots implemented in `rootPhases`; extra layers merged by `events`; Web Audio sample library, instruments and basic synthesized fallback.
- Light and dark themes; browser testing at seven window sizes documented in previous CI.

## Gaps compared with specification
| Deficiency | Source | Task IDs |
|---|---|---|
| UI typography currently uses 10–14px, below new 16px minimum | styles.css | T-UI-001 / T-UI-002 |
| No KaTeX, raw formula-like text and Canvas Unicode quarter glyphs | index.html / app.js | T-TEX-001 / T-TEX-003 / T-TEX-004 |
| Rhythm dots currently drawn with small Canvas radii; pulse below 1.4× threshold | app.js draw | T-GEO-001 / T-GEO-003 |
| No complete Cartesian/Polar numeric editor or safe expression parser | app.js renderTracks | T-NUM-001 / T-NUM-004 / T-NUM-007 |
| Degree currently clamped 1..24, not 1..64 | app.js safeInt / inputs | T-NUM-005 |
| No independent per-lane cycle length, Euclidean generator or intersection UI | app.js | T-MDL-003 / T-MDL-004 / T-MDL-005 |
| No mandatory 6 acid patches, no 15 new presets, no 50-preset regression | app.js PRESETS / audio engine | T-SND-002 / T-PST-003 |
| No full audio spectrum and peak-limit tests, no test-tone output evidence | tests/ | T-SND-005 / T-SND-007 |
| User specification references two annotated screenshots, but only a text attachment is currently available | required photo audit | T-AUD-002: source-image comparison remains unverified |

## Baseline evidence
- Existing Chromium screenshots and previous successful test run: https://github.com/michael-malis/complex-rhythm/actions/runs/41997205463
- Initial `qa/baseline` will capture measured fonts, contrast, marker diameters and geometry before functional changes.
- This document records only observed or source-supported gaps; no task is marked VERIFIED by the existence of this audit.
