# Rhythm Studio — UI Design System

## Purpose
An **Interactive Mathematics Lab**: visualize arguments of complex roots as periodic events. Audio is an optional perceptual layer, not the visual organizing principle.

## Applied ui-ux-pro-max research
- Generator: `interactive mathematical visualization complex numbers geometry educational exploration --design-system --variance 3 --motion 4 --density 8`.
- Domain reviews: keyboard focus, mobile responsive controls, mathematical/minimal style, scientific visualization color, typography, charts, and motion; stack: static HTML/CSS/JavaScript.
- The generator suggested a hero/feature showcase and playful Baloo/Comic Neue typography. **Rejected**: inappropriate for a compact mathematical workbench.
- The minimal Swiss-style grid recommendation was adopted selectively, while the existing dark theme and track identity colors were retained for product continuity.
- A chart-library substitution was rejected: the existing Canvas correctly represents custom circular geometry.

## Layout / hierarchy
1. Compact brand and file tools.
2. Example selection without a marketing hero.
3. On desktops (>=950px) the circular visualization is the large **left** pane and a compact complex-root editor is the **upper right** pane.
4. On smaller screens the DOM follows the learning sequence **complex number → visualization → instruments** so mathematical inputs are encountered before playback and music presets.
5. Four-track selection/mute, sound preview, additional root sets, and explanatory help remain accessible in the lower instrument section. Selecting a track in the list on narrow screens returns to the mathematical editor.
6. The default example is **Polyrhythm 3:4** rather than a production-oriented genre; genre presets remain unchanged and available. Preset/category counts are derived from source data.

## Tokens
- Background: `#0a0e12`; stage `#0e151c`; math editor `#15232e`; control background `#0d1a24`.
- Primary text: `#f2f6fa`; secondary text `#aabac8`; focus ring `#d1f8fb`.
- Track colors remain cyan `#72e5ec`, coral `#ff9b8c`, amber `#ffc77b`, violet `#beadff`.
- One primary font stack: system-ui, Segoe UI, Roboto, Arial; mathematical expressions use restrained UI typography (monospace only for literal code/expression readouts where existing).
- Control min height 44px, main math parameters 46px, compact 6–14px gaps, minimal border radii and no decorative blur.
- Buttons, selects, and summaries use subtle 150ms state feedback; motion disabled for reduced-motion preference.

## Mathematical semantic distinction
For `z != 0`, the arguments of the `n` roots are evenly spaced. Argument changes rotate event phases by `arg(z)/n`; changing modulus alone does not move those phases. The editor displays `|z|` explicitly, together with this distinction. The app's four different circle radii are **track lanes**, not the true mathematical moduli of the roots. Extra root sets represent unions of event phases, not arbitrary direct step sequencing.

## Accessibility and responsive
- Skip link to the primary mathematical editor.
- Visible labeled numeric inputs `a`, `b`, `n`, field validation and keyboard-focus outlines.
- Retain native select controls, track buttons, canvas keyboard selection, audio play shortcut, ARIA names, live status.
- Targets: 375px, 520px, 768px, 1024×768, 1280×800, 1440×900, and 1520px.
- Avoid hiding fundamental controls at compact widths. Allow vertical scroll rather than tiny hit areas.
- Reduced-motion CSS and Canvas behavior preserved.

## Constraints
No preset payloads, serialized schema (`roots-rhythm/1`), sample files, event generators or Web Audio timing logic altered. A browser runtime / perceptual check remains necessary on actual devices.

## Source-grounded redesign references (5 November 2026)
- [GeoGebra: linked algebraic and graphic views](https://geogebra.github.io/docs/manual/en/Views/) — primary inspiration: expression changes should immediately update geometry.
- [Desmos: sliders and movable points](https://help.desmos.com/hc/en-us/articles/202529069-Sliders-and-Movable-Points-in-a-Graph) — informative direct-manipulation precedent; not a mandate to add new mathematical controls in this UI-only pass.
- [NN/g: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) — sound-layer complexity stays secondary to mathematical inputs.
- [W3C WCAG 2.2 target size](https://www.w3.org/TR/wcag/#target-size-minimum) — web Level AA minimum is 24 CSS px subject to exceptions, distinct from the 44px enhanced criterion.
- [Chrome: responsive design](https://developer.chrome.com/docs/modern-web-guidance/guides/css/responsive-design) — responsive layouts should adapt with available container / viewport dimensions.

## Validation limit
Source-level checks passed for tag structure, unique IDs, 35 preset IDs, and CSS brace counts. These do **not** prove real-device or Chromium rendering, playback correctness, or keyboard focus order. Those checks remain open in TASKS.md.
