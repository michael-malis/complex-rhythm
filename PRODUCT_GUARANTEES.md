# Rhythm Studio — product guarantees and acceptance

The product is a **mathematical exploration of rhythms through complex roots**; audio makes the mathematics audible. The following invariants apply to every change. This file defines product quality, not a secondary task backlog. [TASKS.md](TASKS.md) is the sole list of outstanding results.

## Non-negotiable behavior

| Guarantee | Required user-visible outcome | Automated checks maintained | Human evidence |
|---|---|---|---|
| GU-01 | Correct roots of nonzero complex numbers, Cartesian/polar editing, degree n=1…64, zero-value safety, principal argument, unions/intersections, Euclidean patterns, polyrhythms and independent 1–16-bar loops. | `tests/math-io.test.mjs`, `tests/canonical-argument.mjs`, `tests/required-polyrhythms.mjs` | Only if a mathematical defect cannot be covered deterministically. |
| GU-02 | Exactly four independent color-coded root circles and four independent short AudioContext-synchronized hands. No single shared radial needle; coincident phases do not erase other lanes. | `tests/four-ring-identity.mjs`, `tests/orbital-hands-audio-sync.mjs`, `tests/root-window-link.mjs` | Check comprehensibility when testing mobile/accessibility. |
| GU-03 | One canonical source for root-event provenance, velocity, phase, scheduled audible attacks and visual highlights; safe Play/Pause/Resume/tempo/edit/loop changes. | `tests/event-properties.mjs`, `tests/audio-context-scheduler-proof.mjs`, `tests/transport-phase-continuity.mjs` | Audible perception is separately assessed in AUDIO-01. |
| GU-04 | Current voice library, acid patches, drum and sample playback, per-lane/master volumes, proper low-end management and bounded output must remain usable; no unbounded clipping or unsafe sudden jumps. | `tests/mandatory-voice-inventory.mjs`, `tests/kick-architecture-differentiation.mjs`, `tests/master-output-safety.mjs` | Review changed or high-risk sounds by ear; measurements are not a hearing test. |
| GU-05 | Accurate readable KaTeX + MathML complex-root identities, rational fractions and angle annotations linked to real SVG/Canvas geometry; live edits preserve focus. | `tests/formula-acceptance.mjs`, `tests/math-graph-svg-alignment.mjs`, `tests/math-live-input-stability.mjs` | Do not claim to have validated markings from the unavailable second historical screenshot. |
| GU-06 | Readable, keyboard-operable responsive light/dark UI at 1600×1000, 1440×900, 1280×800, 1024×768, 768 and 390 widths; no unintended clipping/overflow, suitable touch targets, meaningful labels and contrast. | `tests/responsive-content-access.mjs`, `tests/accessibility-contrast.mjs`, `tests/touch-targets.mjs` | Physical phone and screen-reader checks remain ACCESS-01 until observed. |
| GU-07 | Preserve the existing 50 canonical presets and genre coverage, the separately supplied Song Example, saved `roots-rhythm/1` projects and legacy import/export. No ongoing obligation to invent more genres or presets. | `tests/preset-diversity.mjs`, `tests/legacy-json-compat.mjs`, `tests/song-examples.mjs` | Review representative catalog entries and known high-risk patterns. |
| GU-08 | Each new Bunker result has a steady audible quarter-note kick and genuinely distinct rhythmic identity. Keep **Dust · Half-light** unchanged as reference. Avoid tempo-only relabeling, masking distortion and commercial EDM drift. | `tests/preset-musical-structure.mjs`, `tests/audio-mix-stress.mjs` | AUDIO-01 must hear all five revised variants, Dust and affected voices; authenticity cannot be derived from BPM tests alone. |
| GU-09 | No regressions hidden by doc/status updates: full real browser/math/audio/JSON tests run on every PR and main push; evidence is produced by tests and Pages deploys only a passing, still-current main SHA. | `scripts/verify-main-regression-trigger.mjs`, `scripts/verify-pages-regression-gate.mjs`, `scripts/verify-ci-measurement-manifest.mjs` | Release approval is a distinct decision; passing CI is necessary, not sufficient for subjective guarantees. |

## Definition of acceptance

1. A deliverable is **DONE** only after its specified observable result exists and its linked tests/evidence pass. A row cannot inherit completion from unrelated work or from an accepted parent.
2. Full CI and deployment status are tied to the **actual final HEAD**, not an earlier historical snapshot. Keep artifact links and commit hashes in PRs; avoid redundant permanent counters and narrative logs.
3. A bug receives an Issue or PR that explains reproduction, expected behavior, evidence and fix. A known regression is not concealed or accepted by deleting its detecting test.
4. An unavailable original historical annotated screenshot is **not** a product blocker. Use real viewport/DOM/Canvas/contrast/geometry measures plus available first-party screenshots; unknown historical annotations stay *not checked*.
5. Sound requires **actual human audition** of the changed Bunker set, Dust, affected voices and a risk-based sample; automated audio analysis is complementary.
6. Physical mobile/screen-reader acceptance is **not verified** until observed. It does not prevent independent sound/math development and cannot silently be marked PASS.
7. A deployed site is not necessarily finally accepted. Final product acceptance requires current CI, no unaddressed critical defects and documented disposition of human checks (passed or explicitly accepted as an exception by the owner). Never infer subjective acceptance from test-green status.

Existing historical source research and code-level measurement documents are useful evidence, **not alternate regulatory task systems**. Git history retains the former itemized specification and all old ID mappings.
