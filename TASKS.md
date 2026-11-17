# Roots / Rhythm — engineering backlog

This is the **only engineering task list**. It holds work that code and automated tests can finish. Checks that need a person (listening, a real phone, a screen reader, the owner's decisions) live in [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md); they are not counted below and do not block technical completion. Invariants are in [PRODUCT_GUARANTEES.md](PRODUCT_GUARANTEES.md).

**Statuses:** `TODO`, `IN_PROGRESS`, `BLOCKED` (with the reason), `DONE` (with linked evidence).

**The project is closing.** No new features are planned. New rows are added only for a concrete regression or for a defect found during manual acceptance.

## Engineering readiness

```
Tasks         [████████████████████]  21 / 21 done
Requirements  [████████████████████]   9 / 9  guarantees covered by passing automated checks
Stages        [████████████████████]   7 / 7  complete
```

Counted from the tables below: tasks are the rows of "Engineering tasks"; requirements are GU-01…GU-09; stages are the rows of "Stages". Manual acceptance is reported separately and is in none of these figures.

## Stages

| # | Stage | State |
|---|---|---|
| 1 | Mathematical core: roots, unions, intersections, Euclidean patterns, independent loops | complete |
| 2 | Audio engine: one event plan, AudioContext scheduling, voices, samples, master safety | complete |
| 3 | Preset catalog: 50 canonical presets, song study, Bunker set, groups | complete |
| 4 | Play: the instrument view, jam tools, Drift and Build modes, light first load | complete |
| 5 | Lab: tabbed inspector, lane table, one shell shared with Play | complete |
| 6 | Governance: engineering backlog separated from manual acceptance | complete |
| 7 | Closing: final technical release and pruning of legacy evidence | complete |

## Engineering tasks

| ID | Result | Status | Depends on | Done when | Evidence / next action |
|---|---|---|---|---|---|
| BUNK-01 | Record actual six-preset Bunker sound baseline and five distinct target arrangements | DONE | - | Six existing IDs, phases, sounds and attacks measured; the protected `dust` config is snapshotted; each of five other IDs has a concrete kick/bass/percussion design. | [Baseline and five designs](docs/BUNKER_GROOVE_BASELINE.md); [50-preset audit](https://github.com/michael-malis/complex-rhythm/actions/runs/42512578722). |
| BUNK-02 | Driving / Hypnotic Techno: `berlin-bass-wall` | DONE | BUNK-01 | Four quarter-note kicks per bar remain clear; bass, rumble and accents are redesigned rather than relabelled; root-source provenance is intact. | [PR #67](https://github.com/michael-malis/complex-rhythm/pull/67), [CI run](https://github.com/michael-malis/complex-rhythm/actions/runs/42512578705). |
| BUNK-03 | Raw Underground Techno: `concrete` | DONE | BUNK-01 | Clear four-on-floor foundation with distinctive dry percussion, raw bass and accents; measurably different from the other Bunker patterns. | [PR #68](https://github.com/michael-malis/complex-rhythm/pull/68); [regression run](https://github.com/michael-malis/complex-rhythm/actions/runs/42523644955). |
| BUNK-04 | Acid Techno: `pressure` | DONE | BUNK-01 | Four-on-floor kick plus an intentional acid voice and phrase with intelligible low end; different from the other four variants. | [PR #69](https://github.com/michael-malis/complex-rhythm/pull/69), [CI run](https://github.com/michael-malis/complex-rhythm/actions/runs/42528757141). |
| BUNK-05 | Industrial Techno: `shaft` | DONE | BUNK-01 | Four-on-floor kick and organized metallic, FM and noise accents, without noise or distortion obscuring the pulse. | [PR #70](https://github.com/michael-malis/complex-rhythm/pull/70); [regression run](https://github.com/michael-malis/complex-rhythm/actions/runs/42534857134). |
| BUNK-06 | Hard Groove Techno: `iron` | DONE | BUNK-01 | Four-on-floor kick, purposeful syncopation and forceful percussion; not merely a faster version of another pattern. | [PR #71](https://github.com/michael-malis/complex-rhythm/pull/71); [CI run](https://github.com/michael-malis/complex-rhythm/actions/runs/42534885295). |
| BUNK-07 | Integrate and technically validate the five Bunker results | DONE | BUNK-02, BUNK-03, BUNK-04, BUNK-05, BUNK-06 | All five produce distinct canonical event structures; kick onsets, mix peaks, synchronization and import compatibility pass; Dust and the other 44 presets are unchanged. | [PR #71](https://github.com/michael-malis/complex-rhythm/pull/71); [integration CI](https://github.com/michael-malis/complex-rhythm/actions/runs/42534885295). |
| PLAY-01 | Play view: a playable instrument on top of the workbench | DONE | - | The site opens on four rings, one play button and three gestures; both views edit one rhythm; switching never changes sound or export. | [PR #75](https://github.com/michael-malis/complex-rhythm/pull/75); covered by `tests/play-surface.mjs`. |
| PRESET-01 | Reworked preset catalog and its ten groups | DONE | - | Every preset keeps its ID and identity, has a musical and a mathematical description, and old saved names still open. | [PR #76](https://github.com/michael-malis/complex-rhythm/pull/76); covered by `tests/preset-diversity.mjs`. |
| PERF-01 | Light page: idle frame budget, sample prewarm, weight budgets | DONE | - | No audio downloads before the first touch; a still picture repaints a few times per second; byte budgets hold in a test. | [PR #77](https://github.com/michael-malis/complex-rhythm/pull/77); budgets in `tests/play-surface.mjs`. |
| JAM-01 | Jam tools: roll, mutate, undo, live keys, tap tempo, stage | DONE | PLAY-01 | Roll, mutate and undo replace the rhythm atomically while it plays; mute, solo and tap keys work on any keyboard layout. | [PR #78](https://github.com/michael-malis/complex-rhythm/pull/78); covered by `tests/play-surface.mjs`. |
| UI-01 | Lab rebuilt as a five-tab inspector with no collapsible disclosures | DONE | PLAY-01 | Lanes, Union, Time, Sound and Notes each have one fixed tab beside the figure; the page contains no `details` element; on wide screens the Lab is a single fixed frame. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); `tests/compact-desktop.mjs`, `tests/responsive-content-access.mjs`. |
| UI-02 | One shell for Play and Lab | DONE | UI-01 | Top bar, rhythm picker, plate, status line and transport pill are the same components in both views; import and export are direct buttons. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); `tests/play-surface.mjs`, `tests/spec-ui.mjs`. |
| UI-03 | Lane parameter table with three notations of z | DONE | UI-01 | All four lanes are visible as aligned rows with θ, n, bars, volume and z as `a + bi`, `r∠θ` or a typed expression; all four rows fit a 1440×900 screen. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); `tests/lane-colors-wheel-controls.mjs`, `tests/four-lane-polar.mjs`. |
| QA-01 | Regression suite follows the tabbed interface without losing coverage | DONE | UI-01 | Contrast, touch-target, typography, clipping and formula-geometry audits visit every tab; mathematical and audio assertions are unchanged; the full suite passes. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); `tests/helpers/lab-tabs.mjs`. |
| GOV-01 | Manual checks moved out of the engineering backlog | DONE | - | AUDIO-01, ACCESS-01 and every other human check live in a separate register, are absent from readiness figures and block nothing; the backlog verifier enforces the split. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md), `scripts/verify-backlog.mjs`. |
| DOC-01 | README and design document describe the current product only | DONE | UI-01 | README explains the model, the two views, the five tabs and how to run tests, without historical ledgers or retired counters; the design document matches the shipped interface. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); [README.md](README.md), [design system](docs/UI_DESIGN_SYSTEM.md). |
| MODES-01 | Drift and Build modes in the new transport pill | DONE | UI-02 | Both switches sit in the transport pill in Play and Lab as 44px targets that cover no other control; a status pill shows the drift step and Build bar; Drift moves only the selected lane on the bar line and the Lab table follows it. | [PR #79](https://github.com/michael-malis/complex-rhythm/pull/79), [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80); covered by `tests/play-surface.mjs`. |
| RELEASE-01 | Final technical release | DONE | UI-01, UI-02, UI-03, QA-01, GOV-01, DOC-01, MODES-01, CLEAN-01 | The redesign commit on `main` has a green full regression run and a successful Pages deployment; no known critical defect is open. Manual acceptance is not a condition. | PR #80 merged as f4c491c85c35c2b944881733321425a8ed732040; [full regression on main](https://github.com/michael-malis/complex-rhythm/actions/runs/44005967152) and [Pages deployment](https://github.com/michael-malis/complex-rhythm/actions/runs/44006914170) succeeded. |
| UI-04 | Preset and category names fit the picker without truncation | DONE | UI-02 | Every preset label is at most one short line (`name` keeps the full title for saved projects and exports); no preset or category label is cut on a 360px phone, a tablet, or the narrowest Play and Lab frames; in the Lab the category sits beside the description so the name gets the row. | [PR #81](https://github.com/michael-malis/complex-rhythm/pull/81); width check in `tests/preset-category-navigation.mjs`. |
| CLEAN-01 | Prune legacy evidence documents and dead scaffolding | DONE | - | Historical audit files that no test or guarantee reads are removed or archived, unused CSS and helpers are gone, and the full suite still passes. | [PR #80](https://github.com/michael-malis/complex-rhythm/pull/80): three retired audit documents and unused style rules removed; full suite green. |

**Independence.** Manual acceptance may happen at any time, before or after the last engineering task. A defect found there becomes a new row here; nothing else reopens the backlog.
