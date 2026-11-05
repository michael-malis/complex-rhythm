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
3. Large interactive Canvas at left/top.
4. Selected track's complex-number editor **before** the four-track list in visual and DOM order.
5. Sound preview, additional root layers, and explanatory help remain available.
6. At desktop >=950px, two-column workbench; below it, stacked layout. Large scene scale responds to viewport height and width.

## Tokens
- Background: `#0a0e12`; stage `#0e151c`; math editor `#15232e`; control background `#0d1a24`.
- Primary text: `#f2f6fa`; secondary text `#aabac8`; focus ring `#d1f8fb`.
- Track colors remain cyan `#72e5ec`, coral `#ff9b8c`, amber `#ffc77b`, violet `#beadff`.
- One primary font stack: system-ui, Segoe UI, Roboto, Arial; mathematical expressions use restrained UI typography (monospace only for literal code/expression readouts where existing).
- Control min height 44px, main math parameters 46px, compact 6–14px gaps, minimal border radii and no decorative blur.
- Buttons, selects, and summaries use subtle 150ms state feedback; motion disabled for reduced-motion preference.

## Mathematical semantic distinction
For `z != 0`, the arguments of the `n` roots are evenly spaced. Argument changes rotate event phases by `arg(z)/n`; changing modulus alone does not move those phases. The app's four different circle radii are **track lanes**, not the true mathematical moduli of the roots. Extra root sets represent unions of event phases, not arbitrary direct step sequencing.

## Accessibility and responsive
- Skip link to the primary mathematical editor.
- Visible labeled numeric inputs `a`, `b`, `n`, field validation and keyboard-focus outlines.
- Retain native select controls, track buttons, canvas keyboard selection, audio play shortcut, ARIA names, live status.
- Targets: 375px, 520px, 768px, 1024×768, 1280×800, 1440×900, and 1520px.
- Avoid hiding fundamental controls at compact widths. Allow vertical scroll rather than tiny hit areas.
- Reduced-motion CSS and Canvas behavior preserved.

## Constraints
No preset payloads, serialized schema (`roots-rhythm/1`), sample files, event generators or Web Audio timing logic altered. A browser runtime / perceptual check remains necessary on actual devices.
