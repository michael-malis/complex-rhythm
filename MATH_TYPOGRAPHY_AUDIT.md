# Mathematical typography and geometry audit

**Scope:** before/after the scientific-workbench typography upgrade, KaTeX integration, root geometry and both interface themes. This is an evidence-backed engineering audit; do not infer that missing human review or the second unsupplied annotated screenshot have been checked.

## Baseline measurement

Captured against the previous interface at [GitHub Actions baseline run](https://github.com/michael-malis/complex-rhythm/actions/runs/42011738339). The workflow retained 12 actual Chromium screenshots and reported the smallest CSS text size, including system labels, for each viewport/theme.

| Viewport | Before min font (light / dark) | After min font threshold | Baseline Canvas size |
|---|---:|---:|---:|
| 1600×1000 | 10 / 10 px | ≥16 px | 630×630 |
| 1440×900 | 10 / 10 px | ≥16 px | 530×530 |
| 1280×800 | 10 / 10 px | ≥16 px | 430×430 |
| 1024×768 | 10 / 10 px | ≥16 px | 398×398 |
| 768×1024 | 10 / 10 px | ≥16 px | 382×382 |
| 390×844 | 9 / 9 px | ≥16 px | 368×368 |

The after-column is the **automated acceptance threshold**, not a claim that all text is exactly 16 px. [New responsive/KaTeX regression](https://github.com/michael-malis/complex-rhythm/actions) checks all listed viewport/theme combinations and that main heading =30 px and panel heading =26 px.

## Typography contract

| Role | Target CSS size | Implementation |
|---|---:|---|
| Body | 18 px | `styles.css`, system-ui |
| Main heading | 30 px | `.stage-heading h1` |
| Section heading | 26 px | `.panel-heading h2` |
| Formula and mathematical readouts | ≥18 px | KaTeX, `.math-notation` |
| Fractions on graph | ≥20 px outer label | KaTeX `\dfrac` in HTML overlay |
| Secondary explanations | ≥16 px | `.quiet`, `.small-explain`, tooltips |
| Parameter inputs | ≥18 px font, 44 px high | All four lanes and advanced options |
| Touch controls | ≥44 px high | Main buttons and fields |

No browser-responsive override may reduce secondary text to 9–12 px. The site reflows instead of shrinking text to fit.

## Mathematical rendering

- **Renderer:** vendored [KaTeX 0.16.22](vendor/katex/), loaded before `app.js`, including locally served font files.
- **Fractions:** `0`, `\frac14`, `\frac12`, `\frac34` at positions tied to the cycle; right/left/top/bottom labels use `\dfrac`, not Unicode fraction substitutes or raster text.
- **Ten reference formulas:** Cartesian `a+bi`, polar, exponential, modulus, argument, roots, root set, index range, nonzero condition and coordinate identities.
- **Selected-root formula:** dynamically displays `w_k` and its phase using the current `a`, `b`, `n` and chosen root index.
- **Zero case:** `z=0` has no nonzero rhythm-root arguments; the UI states the undefined argument and suppresses phase dragging.
- **No raster formulas:** all mathematical text is accessible KaTeX HTML + MathML in a DOM overlay or a dedicated inspector. The four circles are drawn on Canvas and resized together with the overlay.

## Geometry and collision constraints

| Metric | Before (source-derived, selected 3-root lane) | Current (source-derived) |
|---|---:|---:|
| Base marker radius | 7 px | 14 px |
| Base marker visible diameter | 14 px | 28 px |
| Beat-active radius | Original smaller pulse, see baseline source | 20 px |
| Beat-active diameter | — | 40 px (40/28 ≈ 1.429×) |
| Mobile adjacent-ring radial separation at 338 px plot | about 32 px | 40 px |
| Active animation | Size emphasis only | Expansion + light inner flash + non-neon 2.6 px outline |
| High-density view | Standard zoom only | Selectable magnified scroll/pan |

The prior 14px and current 28px diameters follow the explicit Canvas radius code; they are not inferred from CSS button hit boxes. The new 40px active diameter is 1.429× the normal visible diameter. For dense high-degree patterns, event markers may overlap on a small default chart. A **magnified, pannable** plot remains the designed inspection mode; no automatic reduction to unreadable root dots is permitted.

The quarter-cycle labels have been offset 55px from crowded cardinal axes to reduce collisions with event markers. Pixel-level image overlap inspection remains separate from mathematical radius calculations.

## Automated evidence

- `tests/spec-ui.mjs`: 12 viewport/theme checks of computed font sizes, native KaTeX version, fraction DOM structures, root formulas, coordinate forms and magnification.
- `tests/math-io.test.mjs`: coordinate round-trips across quadrants, roots of ±1 and i, zero, degrees 17/32/64, set operations, Euclidean distribution and LCM polymetry.
- `tests/ui-smoke.mjs`: full responsive layout, direct point dragging, slider/keyboard, four independent lanes, composed union, presets and JSON.
- `tests/spec-baseline.mjs`: 12 baseline screenshots with measured original fonts (see previous GitHub Actions run).
- `tests/audio-mix-stress.mjs`: separate audio-onset, high-density and master-output check; **does not substitute for a human visual audit**.

## Unresolved evidence

1. The two highlighted screenshots are not embedded in `MASTER_IMPLEMENTATION_SPEC.md`. **One user-uploaded image (506×556) was recovered from conversation files**, covering cramped Track 1 explanatory text, Cartesian captions and small phase/readout text. The second source image is still unavailable, so complete pixel-by-pixel source acceptance cannot be asserted; see issue #2.
2. Independent visual review on actual mobile devices and screen-reader assessment are not established by headless browser screenshots.
3. A universal no-overlap guarantee for four 28–40px rings at 360px width and n=64 is geometrically impossible without zoom/pan or a different presentation; the current design supplies zoom/pan rather than shrinking the mathematical markers.

**Status:** mathematical font rendering and automated responsive checks exist; full human acceptance for every requirement remains pending.

## 2026-11-05 responsive and touch verification extension

- Desktop 1280–1520px uses a genuine **two-by-two lane editor grid**, alongside the complex-plane root diagram. At 760–1279px, the diagram appears before a two-column editor grid; below 520px, the diagram comes before one-column editors.
- All four edit cards remain separately visible, with degree, Cartesian/Polar mode, sound and independent cycle length. The code does not shrink its font scale merely to fit all cards.
- `tests/spec-ui.mjs` now checks the full 14-role typography ladder across 12 viewport/theme scenarios, for **276 runtime assertions** in the latest passing batch.
- `tests/touch-targets.mjs` evaluates 77 visible interactive surfaces each at 360, 390 and 768px widths: **231 interactive targets inspected with zero undersized controls**, after correcting four 40px-high range inputs and a squeezed argument slider.
- `tests/accessibility-contrast.mjs` inspects visible text/plot colors under both themes; **all 14 viewport/theme cases passed** in the final measured contrast run.
- A worked `R_4(1)\cup R_3(1)` lesson now states the mathematical **phase** identity `\Phi(R_4(1)\cup R_3(1))`, rather than incorrectly equating complex numbers with fractional beat positions.

Evidence: [full UI, audio, typography and touch suite](https://github.com/michael-malis/complex-rhythm/actions/runs/42117874127); [screenshot/layout first pass](https://github.com/michael-malis/complex-rhythm/actions/runs/42114210506).


## 2026-11-06 — Per-formula traceability and screenshot protocol (M05/M06)

This table compares the **required source notation in MASTER_IMPLEMENTATION_SPEC.md** with the actual KaTeX source generated by `app.js`. "Source notation" is the contractual *before* form, **not** a claim that an unavailable legacy screenshot showed the same string. The visual after-state is tested in a real browser; human visual acceptance remains separate.

| Formula / location | Source notation (contract) | Rendered KaTeX input (after) | Value source | Refresh mechanism | Automated check | Evidence screenshots |
|---|---|---|---|---|---|---|
| Cartesian / Mathematical notes, row 1 | `z=a+bi` | `z=a+bi` | Static mathematical identity | `initMath()` on page load | KaTeX + MathML, no clipping | `formula-acceptance/{width}-{theme}.png` |
| Polar / Mathematical notes, row 2 | `z=r(cos θ+i sin θ)` | `z=r\\left(\\cos\\theta+i\\sin\\theta\\right)` | Static identity | `initMath()` | KaTeX + MathML | Same |
| Exponential / Mathematical notes, row 3 | `z=re^(iθ)` | `z=re^{i\\theta}` | Static identity | `initMath()` | KaTeX + MathML | Same |
| Modulus / Mathematical notes, row 4 | `r=sqrt(a²+b²)` | `r=\\sqrt{a^2+b^2}` | Static identity; live value uses `Math.hypot(a,b)` | `initMath()`; dynamic `updateSelectedRootMath()` | Radical rendered; selected-root coefficients change live | Same |
| Argument / Mathematical notes, row 5 | `θ=atan2(b,a)` | `\\theta=\\operatorname{atan2}(b,a)` | Static identity; live argument from `principalArg(b,a)` | `initMath()`; `updateSelectedRootMath()` | MathML and live edit test | Same |
| Roots / Mathematical notes, row 6 | `w_k=√[n](r) exp(i(θ+2πk)/n)` | `w_k=\\sqrt[n]{r}\\,e^{i\\frac{\\theta+2\\pi k}{n}}` | Static identity; live `n,r,θ,k` from selected lane | `initMath()`; `updateSelectedRootMath()` | n/a/b edits, no raw TeX | Same |
| Root set / Mathematical notes, row 7 | `R_n(z)={w_0,…,w_(n-1)}` | `R_n(z)=\\{w_0,w_1,\\ldots,w_{n-1}\\}` | Static identity; live family counts from selected lane | `initMath()`; `renderComposition()` | KaTeX + MathML | Same |
| Indices / Mathematical notes, row 8 | `k=0,…,n-1` | `k=0,\\ldots,n-1` | Static identity; selected degree `track.n` | `initMath()`; `renderRootRule()` | MathML and root-infographic test | Same |
| Nonzero / Mathematical notes, row 9 | `z!=0` | `z\\ne0` | Static identity, dynamic zero detection `r===0` | `initMath()`; `updateSelectedRootMath()` | Zero argument handled; MathML | Same |
| Coordinates / Mathematical notes, row 10 | `a=Re(z); b=Im(z); r=abs(z); θ=arg(z)` | `a=\\Re(z),\\quad b=\\Im(z),\\quad r=|z|,\\quad \\theta=\\arg(z)` | Static identities; live Cartesian fields in four lanes | `initMath()`; `renderEditor()` | KaTeX + MathML, live coordinate test | Same |
| Graph phases / Canvas HTML overlay | `0; 1/4; 1/2; 3/4` | `0;\ \\dfrac{1}{4};\ \\dfrac{1}{2};\ \\dfrac{3}{4}` | Fixed normalized circle time | `initMath()`; responsive `positionPhaseLabels()` | Four labels, >=20px, inside graph, no collision tests | Same |
| Selected root / composition inspector | `w_k=√[n](r) exp(i(θ+2πk)/n)` | `w_{k}\\approx\\sqrt[n]{r}\\,e^{i\\frac{θ+2πk}{n}}` with numeric substitutions | `tracks[selectedTrack]`, `selectedRootIndex`, `Math.hypot`, `principalArg` | `updateSelectedRootMath()` on changes and drag | Exact `n`, live coefficient, no stale formula | Same |
| Selected phase / composition inspector | `phase(w_k)=(θ+2πk)/(2πn) mod 1` | `\\operatorname{phase}(w_k)=\\frac{\\theta+2\\pi k}{2\\pi n}\\bmod1\\approx p` | `rootPhases(track)[k]` | `updateSelectedRootMath()` | Live drag changes phase and root; fractional layout | Same |
| Union/intersection / composition inspector | `R_n(z) union R_m(u)` | `R_{n}(z)\\cup R_m(u)` or `\\cap` with generated families | Selected lane, added root families, `track.operation` | `renderComposition()` | Long five-family mathematical expression scrolls, no clipping | `formula-geometry/{width}-{theme}.png` |
| Root-angle rule / selected-lane card | `θ_k=(θ+2πk)/n (mod 2π)` | `\\theta_k=\\frac{\\theta+2\\pi k}{n}\\pmod{2\\pi}` | Selected `a,b,n` via `RootAngleInfo.model` | `renderRootRule()` | Responsive centering, exact 120°/n=4 case, zero case | `root-angle-infographic/{width}-{theme}.png` |

**Evidence paths** refer to files *inside the `rhythm-ui-screenshots` GitHub Actions artifact*, not to repository-tracked screenshots. The set `{width}-{theme}` expands to 1600-light/dark, 1440-light/dark, 1280-light/dark, 1024-light/dark, 768-light/dark, and 390-light/dark (twelve cases, with heights defined in the tests). `tests/formula-acceptance.mjs` now writes per-formula source annotations and actual browser screenshots for all twelve cases, and `tests/formula-geometry-complete.mjs` and `tests/root-angle-infographic.mjs` already write their own 12-image matrices. Per-formula runtime measurements are in `formula-acceptance/measurements.json`.

**Verification status:** Source-to-render locations and update mechanisms are independently cross-checked against the code. The original per-formula screenshot capture and JSON enrichment **passed in subsequent full UI regression**. This addendum adds a stricter live-location and screenshot-artifact validator, which requires a fresh CI run before new claims can be made. Do not label R-TEX-008 or M06 VERIFIED until the new workflow succeeds and all required historical children have evidence. A historical pixel-by-pixel before screenshot and a physical screen-reader audit are explicitly **not** implied by this table.


## 2026-11-07 — Complete per-location live KaTeX evidence matrix (M05/M06)

The preceding historical typography measurements and contractual source-to-output
rows are retained without alteration. This addendum enumerates **every actual
live mathematical DOM location** now asserted by the enriched
`tests/formula-acceptance.mjs`, including its dynamic source and update path.
Unlike a mock formula snapshot, the test inspects actual KaTeX `annotation`
and embedded MathML **in 12 full-browser viewport/theme scenarios**.

**Historical before comparison:** Source specification notation is known,
but a dated original per-formula "before" capture is not available.
No change in old visual accuracy is inferred. The existing first
annotated image cannot stand in for the missing second image (M12).

All entries below use screenshot locator **S**:
[successful UI-regression run and uploaded screenshots](https://github.com/michael-malis/complex-rhythm/actions/workflows/ui-regression.yml),
`rhythm-ui-screenshots` artifact, `formula-acceptance/{width}-{theme}.png`,
with `{width}` in 1600, 1440, 1280, 1024, 768, 390 and both
`light`/`dark`. Machine-readable evidence is
`formula-acceptance/measurements.json`. A new validation script checks
each of the 12 screenshot files and the full runtime matrix, not merely
presence of an audit heading.

| DOM ID (test selector) | Current formula / placement | Value source | Update trigger | Verification and screenshot |
|---|---|---|---|---|
| `ref:0`–`ref:9` | Ten required reference formulas, `#formulaReference .formula-math`, in the contract's exact order | `initMath()` static KaTeX source | Initial render; CSS responds to viewport and theme | 10 source/MathML assertions per state, S |
| `cartesianHeading` | `z=a+bi` alongside four lanes | `initMath()` | Initialization and responsive layout | KaTeX+MathML, S |
| `argMathLabel` | `\arg(z)` beside argument slider | `initMath()` | Initialization | Semantic `arg` command, S |
| `mathExampleUnion` | `R_4(1)\cup R_3(1)` in mathematical notes | `initMath()` | Initialization | KaTeX set operator, S |
| `phaseZero` | Zero phase at top | `initMath()`, cycle-phase origin | Initialization, Canvas/DOM resize | MathML and graph bounds, S |
| `phaseQuarter` | `\dfrac{1}{4}` at right | `initMath()` | Resize/reflow | Stacked fraction MathML, S |
| `phaseHalf` | `\dfrac{1}{2}` at bottom | `initMath()` | Resize/reflow | Stacked fraction MathML, S |
| `phaseThreequarters` | `\dfrac{3}{4}` at left | `initMath()` | Resize/reflow | Stacked fraction MathML, S |
| `rootRuleEquation` | Root argument formula `\theta_k=(\theta+2\pi k)/n` | Selected-lane `a,b,n` | `renderRootRule()` on edits, preset/import, selection | KaTeX/MathML, responsive centering, S |
| `rootRuleValues` | Live canonical argument, degree and range | `RootAngleInfo.model(a,b,n)` | Input, drag, selection, import | Contains selected `n`, undefined-zero branch, S |
| `rootRuleSpacing` | `\Delta=2\pi/n` (plus degrees) | `RootAngleInfo.model(a,b,n)` | Degree and lane edits | MathML and current spacing, S |
| `rootRuleInput` | Expanded `\theta=\arg(z)` with numeric angle | `RootAngleInfo.render()` | Info disclosure + canonical lane updates | SVG-adjacent MathML, S |
| `rootRuleDelta` | Expanded `\Delta=2\pi/n` | `RootAngleInfo.render()` | Info disclosure + degree updates | SVG-adjacent MathML, S |
| `rootRuleFormula` | Expanded `\theta_k` identity | `RootAngleInfo.render()` | Info disclosure + canonical lane updates | SVG-adjacent MathML, S |
| `selectedRootFormula` | Selected `w_k`, real modulus, radical and root angle | `tracks[selectedTrack]`, `selectedRootIndex`, `Math.hypot` | `updateSelectedRootMath()` | Live degree, coefficient and Canvas drag regression, S |
| `rootPhaseFormula` | Derived normalized phase for the selected root | `rootPhases(track)[k]` | `updateSelectedRootMath()` | Rendered fraction, live phase and zero case, S |
| `compositionEquation` | `R_n(z)\cup R_m(w)` / intersection / Euclidean operation | `tracks[selectedTrack].layers`, `operation`, `euclidean` | `renderComposition()` | KaTeX+MathML; 5-family overflow audit, S |
| `laneEq0` | Full root-family expression for Lane 1 | `tracks[0]` | `renderTracks()`, `updateLaneStatus(0)` | MathML, bounded responsive formula, S |
| `laneEq1` | Full root-family expression for Lane 2 | `tracks[1]` | `renderTracks()`, `updateLaneStatus(1)` | MathML, bounded responsive formula, S |
| `laneEq2` | Full root-family expression for Lane 3 | `tracks[2]` | `renderTracks()`, `updateLaneStatus(2)` | MathML, bounded responsive formula, S |
| `laneEq3` | Full root-family expression for Lane 4 | `tracks[3]` | `renderTracks()`, `updateLaneStatus(3)` | MathML, bounded responsive formula, S |

**Automated scope:** `scripts/verify-math-typography-audit.mjs`
asserts 10 static formula renderings, 16 live DOM locations, all four
graphic phase labels, lack of raw/errored TeX, screenshot dimensions
and 12 saved actual Chromium PNGs. It does not claim a human pixel
review, so **M05/M06 and R-TEX-008 remain under evidence review**;
the historic 380/652 and 63/98 ledger counts are not promoted by
document creation alone.


## 2026-11-07 — Inline mathematical explanations are semantic (M05 / R-TEX-002)

The selected-lane root-placement **caption** and the SVG-adjacent zero-complex case were previously unmeasured as mathematical typography. In the root caption, plain `δ/n`, `2π/n` and `|z|` expressions used ordinary text nodes. The source now renders `\delta`, `\frac{\delta}{n}`, `\frac{2\pi}{n}` and `|z|` as distinct inline KaTeX+MathML tokens, with true geometric spacing; zero displays `z=0` and `\arg(0)` as semantic formulas, including in the expanded root-angle explanation list. This is not an audio/geometry algorithm change.

**New separate evidence:** `tests/math-inline-caption.mjs` measures every inline token, actual embedded `math` and `annotation` nodes, computed minimum 16px font, viewport clipping and browser runtime errors in all six prescribed viewport sizes and both themes. It also checks live degree edits, caret focus and the imported zero case. Machine-readable artifact: `artifacts/math-semantic-caption/report.json`; full CI measurement manifest now has 23 real reports. This guarantees semantic HTML/MathML in these locations only, not the unavailable historical second annotated screenshot, perceptual approval or assistive technology hardware testing.


### 2026-11-07 — Technical source acceptance of R-TEX-002 (not full M05/M06 signoff)

Source-specific [full CI 42378900168](https://github.com/michael-malis/complex-rhythm/actions/runs/42378900168) passed the real browser tests `formula-acceptance.mjs`, `formula-geometry-complete.mjs`, `root-angle-infographic.mjs`, `math-inline-caption.mjs` and all 23 independent evidence reports on the exact PR #40 code. The contract's 14 R-TEX-002 atomic typography conditions, including inline semantic Greek variables, subscripts/superscripts, radicals, set union and intersection, fractions, exponential notation, zero and source-provenance math, are now technically VERIFIED in their specified UI locations. No mathematical notation is replaced by a raster formula. The original before-image gap is tracked only under R-TEX-008 and external visual M12, not presented as recovered history. Source ledger: **425/652 VERIFIED** and **70/98 parent requirements VERIFIED**; M05/M06 remain open.


### 2026-11-07 — M05/R-TEX-005: Exact complex-source provenance in the root-set formula

**Corrected mathematical display gap:** The live composition inspector had rendered the base root set as generic `R_n(z)` while printing explicit complex coordinates for each added root set. That omitted the actual selected source complex input and could make it harder to connect `a+bi` edits with the mathematical outcome. It now uses the same safe `complexLaTeX(track)` for the base as for every added set: e.g. `R_4(2+3i) \cup R_3(-1+0i) \cup E(5,16)`. The active set operator, current degree, additional layers, Euclidean set and separate `w_k` origin/phase remain canonical. This only changes the displayed formula; no event phase, sound, preset or four-ring layout logic changes.

**Evidence gate:** New independent `tests/composition-source-equation.mjs` imports real nontrivial complex inputs and tests the live KaTeX/MathML `#compositionEquation` at six required viewport sizes × two themes. It verifies that base and added root sets display their actual coordinates; that n edits, Cartesian changes, set intersection, and the zero complex base are reflected immediately; that `w_k` root and phase math retain fractional notation; that a zero base removes only the base roots while added/Euclidean sources remain independent; and that no text clipping or page-wide overflow occurs. Actual browser screenshot/JSON evidence saved under `artifacts/complex-source-equation/` and validated as required measurement #24. R-TEX-005 and M05 remain IN_PROGRESS until all graph-specific conditions and the full exact-head UI regression pass.


## 2026-11-07 — Source-backed shared-root mathematics and vector/DOM phase placement (M05, R-TEX-005/006)

| Mathematical location | Original state | Actual KaTeX/MathML after | Canonical value source | Update trigger | Automated geometric verification |
|---|---|---|---|---|---|
| Root union inspector, after `#overlapSummary` | Only a prose shared-phase count and point color | `#sharedPhaseFormula` shows the true normalized shared set, e.g. shared phases 0 and 1/4 as an actual vertical KaTeX fraction; hidden when empty | `events(selectedTrack).filter(event => event.sources.length > 1)` | Import, layer addition/change/removal, base argument and degree edits, union/intersection, lane selection | `tests/math-graph-svg-alignment.mjs`: source-aligned, union/intersection and added-family-only 1/8 phase |
| `#rootRuleDiagram` SVG and `#rootRuleAngleList` | SVG root diagram and textual/KaTeX root list had independently tested values but no full projected *physical* coordinate agreement | Existing vector SVG points are held to exact model phases projected with `getScreenCTM()`, with real mathematical list entries | `RhythmMath.rootPhases(a,b,n)`, `RootAngleInfo.model` | Selected lane, complex argument, n, import, responsive width and theme | 4 lanes × 6 viewports × 2 themes, 64-root dense and n=1/zero, true vector axis labels and mathematical notation |
| `#plotArea` Canvas and phase-label HTML layer | Separate Canvas and SVG/HTML checks | Existing Canvas root-angle time convention and four mathematical fractions are cross-checked against the same source phases and SVG markers | `RhythmMath.rootPhases`, `radiiForSize`, live Canvas and HTML geometry | Resize, lane select, import, selected angle/degree | CSS pixel rectangles checked inside plot; live 1440→390 resize; no raster math and no document overflow |

**Artifacts:** GitHub Actions `rhythm-ui-screenshots` contains `math-graph-svg/{1600,1440,1280,1024,768,390}-{light,dark}.png`, plus `math-graph-svg/report.json` and `release-evidence-manifest.json` after the exact latest CI run. These are real Chromium captures, not a historical original screenshot. R-TEX-008's historical before-image and manual M12/M13 comparison remain outside this technical proof.
