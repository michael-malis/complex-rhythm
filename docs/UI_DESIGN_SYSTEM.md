# V3 Design System — Mathematical Workbench

## Intent

The product is an interactive mathematical visualization, not a DAW. Complex root angles map to repeating phase events. All four parameter sets should be visible at once. Sound is a perceptual aid.

## Architecture

- One persistent circular visualization with four concentric instrument lanes.
- Four simultaneous editor rows: sound, mute, a, b, n, unique event count, compact formula.
- One secondary, selected-lane inspector: `Compose root sets`. Shows Base / Added / Union as aligned phase timelines.
- One optional examples selector and one project-files menu.
- One explanatory mathematics disclosure. No hero, dashboard cards, decorative shadows, animation-only content, or step sequencer.

## Mathematical contract

For nonzero `z`, root phases are `(arg(z)+2πk)/(2πn)` mod 1. `z=0` gives no base events. Additional sets are combined as a union of phases with 1e-6 tolerance, including wraparound at 0/1. Coincident hits trigger once; velocity follows the existing max-velocity rule. Each additional set remains an actual complex-root set; `n=1` can express an individual accent. The four Canvas radii separate instruments, not root magnitudes.

Base-only events: filled circles. Additional-only events: hollow circles. Coincident events: doubly marked circles. The phase source timeline is Base → Added → Union, with count and overlap status.

## Design tokens (light mode default)

- Page `#f2efe8`, panel `#fffdfa`, plot `#faf8f3`
- Text `#292b27`, secondary `#666960`, border `#d8d6ce`
- Track 1 terracotta `#ab5847`; track 2 sage `#567a63`; track 3 ochre `#967438`; track 4 plum `#80618a`
- Native system-ui typography. One text scale, minimal decorative style.

## Dark graphite alternative

- Page `#1b1c19`, panel `#242621`, plot `#20221d`, text `#edece3`
- Same four track identities, softened for dark contrast.
- The UI structure, mathematical semantics and hit markers do not change with theme.

## Layout and accessibility

- At widths >=760px: two-column scientific workbench, Canvas left and four input rows right.
- At 520–759px: compact two-column lane list above the visual stage; <=519px: four stacked lane rows above the stage.
- Circular chart is square and constrained by viewport height; it does not independently stretch geometric root radii.
- Numeric controls and buttons have at least 44px height; labels and accessible names refer to the lane index.
- Focus outlines, reduced-motion preference, keyboard lane selection and semantic disclosure controls.
- English only. Theme persisted locally when storage is available.

## Implementation

The original monolithic `index.html` has been split into:
- `index.html`: accessible semantic layout, no inline CSS or JS.
- `styles.css`: one coherent palette, component system and responsive layout.
- `app.js`: original mathematical and audio engine plus rewritten visual and control rendering.

The architecture deliberately avoids additional dependencies.

## Verification

Playwright checks seven viewport dimensions, all four input rows, root union `R4(1) ∪ R3(1)` (4 base, 3 added, 6 unique, 1 coincident), changes to individual lanes, slider, keyboard, dragging, 35 presets, JSON import/export, dark/light modes and audio play/pause. Human visual review uses the test-run screenshot artifact. Real-device sample quality and exhaustive screen-reader testing remain follow-up checks.
