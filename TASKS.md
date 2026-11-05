# Rhythm Studio V3 — Mathematical Workbench

Source of truth: this checklist, verified by tests. Do not mark any task complete before evidence.

## Phase 1 / Architecture
- [x] Audit root-set/event model, old selected-only editor, layer controls and existing Canvas.
- [x] Choose unified architecture: one Canvas + four simultaneous editable lanes + selected composition inspector.
- [ ] Replace selected-only editor with four independent a/b/n input groups and live sound/mute controls.
- [ ] Preserve root geometry, audio scheduling, sample library, presets and JSON v1 schema.

## Phase 2 / Composition
- [ ] Rename Extra roots to Compose root sets and explain mathematical union clearly.
- [ ] Visualize base, additional and result on separate aligned phase timelines, with merged/overlap counts.
- [ ] Distinguish base, additional and overlap in main Canvas; avoid double-scheduling coincident phases.
- [ ] Keep degree-one layers as legitimate accent events, without claiming they create an arbitrary-root theorem.
- [ ] Keep layers editable and import/export-compatible.

## Phase 3 / Visual design
- [ ] Replace conflicting stacked CSS rules with a single coherent stylesheet.
- [ ] Default warm off-white scientific notebook, optional graphite dark appearance.
- [ ] Restrict components to toolbar, canvas, four lane rows, and one composition disclosure.
- [ ] Responsive 16:10 desktop, compact tablet, scrollable usable mobile, min 44px targets.
- [ ] Keep all user-facing UI and help text in natural English.

## Phase 4 / Verification
- [ ] Replace outdated selected-only assumptions in Playwright regression.
- [ ] Test all four lane edits independently and verify immediate circle/summary updates.
- [ ] Test root union: 4 ∪ 3 = 6 distinct phases with one collision (at phase zero).
- [ ] Test JSON round-trip, 35 presets, audio start/stop, theme toggle, reduced motion.
- [ ] Check 360×640, 390×844, 768×1024, 1024×768, 1280×800, 1440×900, 1520×982.
- [ ] Review screenshots, UI contrast, focus behavior, horizontal overflow.

## Phase 5 / Release
- [ ] Update README and design documentation.
- [ ] Pass GitHub Actions and inspect logs.
- [ ] Merge to main and verify Pages deployment.
