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
- [ ] Browser visual comparison at 375px, 768px, 1024×768, 1280×800, 1440×900.
- [ ] Manual playback, sample-loading, all 35 preset selections and import/export regression.
- [ ] Keyboard-only traversal, focus, screen-reader smoke test, zoom and reduced-motion check.
- [ ] Verify text contrast and absence of overflow at actual browser render sizes.

## Phase 6 — Finish
- [x] Commit revisions to `main`, including the follow-up audit and math-first mobile layout.
- [x] Publish this checklist and the design rationale in GitHub.
- [ ] Complete browser/manual verification and fix any uncovered issues.

## Acceptance
Completed at source level: mathematical prominence, editor-first mobile layout, preserved root/audio core, real skill searches, design system, task tracking, GitHub updates. **Pending**: actual browser rendering/interaction checks, accessibility focus order, full sample playback.
