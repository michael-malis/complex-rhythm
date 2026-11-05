# Rhythm Studio V3 — Mathematical Workbench

Evidence policy: check only work verified by source review, Chromium regression or screenshots.

## Phase 1 / Architecture
- [x] Audit root-set/event model, old selected-only editor, layer controls and Canvas.
- [x] Choose architecture: one Canvas + four simultaneous editable lanes + selected composition inspector.
- [x] Replace selected-only editor with four independent a/b/n input groups and sound/mute controls.
- [x] Preserve root geometry, audio scheduling, sample library, 35 presets and JSON v1 schema.

## Phase 2 / Composition
- [x] Rename Extra roots to Compose root sets and explain mathematical union.
- [x] Visualize base, added and union on aligned phase timelines with unique/overlap counts.
- [x] Distinguish base-only, added-only and coincident events in the Canvas.
- [x] Retain degree-one accent events without claiming arbitrary irregularity follows from one root set.
- [x] Keep extra set numeric, degree, velocity controls and import/export compatibility.
- [x] Format generated floating-point coordinates for readable numeric inputs.

## Phase 3 / Visual design
- [x] Replace all stacked CSS overrides with one coherent external stylesheet.
- [x] Warm off-white notebook default; optional graphite dark appearance.
- [x] Restrict core components to toolbar, Canvas, four repeating lane rows and one composition disclosure.
- [x] Responsive 16:10-oriented desktop, tablet, scrollable mobile, min 44px inputs.
- [x] Keep static and dynamic UI labels and mathematical notes in English.
- [x] Remove visible native file-picker input from main document.

## Phase 4 / Verification
- [x] Replace selected-only assumptions with new Playwright V3 regression.
- [x] Verify independent lane edits and immediate counts.
- [x] Verify 4 ∪ 3 = 6 distinct phases and one collision at phase zero.
- [x] Verify JSON round-trip, 35 presets, audio start/stop, theme toggle and reduced-motion behavior.
- [x] Check 360×640, 390×844, 768×1024, 1024×768, 1280×800, 1440×900 and 1520×982.
- [x] Review light/dark screenshots and composition rendering; fix visible file input, long coefficients and desktop height.
- [x] Browser JS error, horizontal overflow, target-size and dark-theme checks.
- [ ] Dedicated screen-reader review and physical-device sound listening; outside automated browser coverage.

## Phase 5 / Release
- [x] Document design decisions and structure in README and docs/UI_DESIGN_SYSTEM.md.
- [ ] Verify final (post-polish) GitHub Actions run success.
- [ ] Merge working branch to main and verify Pages deployment.
