# Rhythm Studio — UI/UX redesign task register

Evidence policy: mark only verified work as complete. **Source review is not a substitute for browser/runtime verification.**

## Phase 1 — Audit
- [x] Inventory HTML application, Canvas display, edit parameters, preset groups, and transport controls. Evidence: reviewed `index.html`, `README.md`.
- [x] Identify design hierarchy problems: controls below tracks; stage competed with music-panel framing.
- [x] Inspect responsive breakpoints, keyboard shortcuts, import/export and extra root-layer editor.
- [ ] Capture true pre-change screenshots at required viewport sizes. Not available during this run.

## Phase 2 — Skill / design system
- [x] Read `ui-ux-pro-max/SKILL.md`, quick reference and rules.
- [x] Run specified `--design-system --variance 3 --motion 4 --density 8` generator.
- [x] Research UX, typography, style, color, charts, GSAP and actual HTML stack.
- [x] Filter irrelevant recommendations (marketing hero, playful two-font treatment, extra motion).
- [x] Persist application-specific decisions in `docs/UI_DESIGN_SYSTEM.md`.

## Phase 3 — Plan / task tracking
- [x] Convert UI requirements into phases and verification checklist in `TASKS.md`.
- [x] Record work and outstanding verification without falsely checking untested items.

## Phase 4 — Implement
- [x] Keep Canvas the primary scene and enlarge its desktop footprint.
- [x] Make mathematical inputs the first panel in mobile DOM order, followed by Canvas, then instruments.
- [x] Use the 3:4 polyrhythm as the default mathematical demonstration.
- [x] Add accessible live argument slider preserving |z|.
- [x] Enable direct canvas dragging of base-root points; rotate z by n times the root-phase displacement.
- [x] Enable Shift+←/→ to rotate visible base roots 5 degrees per keypress.
- [x] Keep the geometry (n and |z|) invariant during rotation; leave additional root layers untouched.
- [x] Show |z| and explicitly distinguish magnitude changes from changes to attack times.
- [x] Return to math controls after track selection on narrow screens; preserve track button focus on desktop and mute focus on all widths.
- [x] Count presets/categories from source data instead of hardcoding an outdated number.
- [x] Promote selected complex number and root degree ahead of instrument list.
- [x] Retain four track controls, instrument selection, preview, extra roots, transport and presets.
- [x] Clarify ring radii as instrument lanes (not literal complex root moduli).
- [x] Add a keyboard skip link and contextual circle-selection hint.
- [x] Adjust responsive sizing, compact spacing and hierarchy without new libraries.
- [x] Keep schema, root/event functions, Web Audio section, preset definitions unchanged.

## Phase 5 — Verification
- [x] Static assertion: unique IDs for 15 essential input / transport / import controls.
- [x] Static assertion: parameter editor precedes four-track list in the DOM.
- [x] Static comparison: math roots/event functions and Web Audio engine block unchanged.
- [x] Confirm source structure retains 35 unique preset IDs and sample definitions.
- [x] Check HTML tag nesting, no duplicate IDs, and balanced CSS brace counts in current source.
- [ ] Check desktop keyboard focus progression against the desktop two-column visual placement.
- [x] Automated Chromium checks and screenshots for 360×640, 375×812, 390×844, 768×1024, 1024×768, 1280×800, 1440×900.
- [ ] Human visual review of those screenshots for density, crop, and hierarchy.
- [x] Automated Playwright regression: all 35 preset selections, degree edits, slider/drag/keyboard rotation, z=0 behavior, JSON import/export round-trip, Web Audio play/pause.
- [x] All 87 assertions pass: https://github.com/michael-malis/complex-rhythm/actions/runs/41971526360
- [ ] Listen to every one of 35 presets and validate real-device sample loading, particularly mobile browsers.
- [ ] Keyboard-only traversal, focus, screen-reader smoke test, zoom and reduced-motion check.
- [x] Verify absence of horizontal overflow at all 7 Chromium viewport sizes.
- [ ] Manually verify text contrast, focused navigation, and visual details with screenshots.

## Phase 6 — Finish
- [x] Commit revisions to `main`, including the follow-up audit and math-first mobile layout.
- [x] Publish this checklist and the design rationale in GitHub.
- [ ] Complete browser/manual verification and fix any uncovered issues.

## Acceptance
Completed at source level: mathematical prominence, editor-first mobile layout, preserved root/audio core, real skill searches, design system, task tracking, GitHub updates. **Verified in Chromium:** 87 assertions in 7 viewports covering rendering dimensions, no horizontal overflow, core interactions, 35 presets, JSON round-trip and audio play/pause. **Remaining:** human screenshot review, detailed accessibility audit and real-device listening to every sample.
