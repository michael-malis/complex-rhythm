# Rhythm Studio — active change register

This register records user-approved product changes independently from the legacy 651-row mechanical task ledger. It is not a declaration of acceptance or a replacement for the source specification.

## CR-ANG-001 · Angle-first root editor
**Priority:** P0 · **Status:** VERIFIED (automated engineering acceptance)

- The main parameter is the complex number argument θ, not its radius or Cartesian coordinates.
- Show **radians and degrees simultaneously** for each of four tracks; editing either changes the same canonical angle, never converting through a rounded display string.
- Accept safe rational-π forms such as π/2, 2π/3, −π/4 (alongside numeric radians). Preserve the edited text while it is being entered.
- Root degree n stays visible. Complex z is represented for timing by a unit vector; preserve legacy magnitudes and original JSON data until explicitly changed.
- Cartesian / legacy polar coordinates remain available as secondary information and compatible editing, not the primary interaction.

**Acceptance:** all lanes independent; round trip in both units; invalid input does not mutate complex state; n=1…64; zero-import edge case explicitly handled.

## CR-ANG-002 · Directly specified extra angles
**Priority:** P0 · **Status:** VERIFIED (automated engineering acceptance)

- “Add angle” creates one event on the selected track with a directly specified argument φ in radians and degrees.
- “Generate roots” remains an optional way to add a symmetric set of n evenly spaced phases from a complex argument; no selecting/deleting individual points on Canvas.
- Distinct input angles colliding with existing events sound once within the same lane, but remain separate between lanes.
- Reuse the current layer representation for JSON/preset backward compatibility; a single added event is n=1.

**Acceptance:** add/edit/remove; safe π/n conversion; full symmetric family for n>1; mathematically exact source event provenance; imported older multi-root layers remain editable.

## CR-ANG-003 · Root-angle infographic
**Priority:** P1 · **Status:** VERIFIED (automated engineering acceptance)

Display a compact, readable, always-available KaTeX explanation near the selected track:

\[\theta_k=\frac{\theta+2\pi k}{n}\pmod{2\pi},\qquad k=0,\ldots,n-1.\]

- θ is the argument of the underlying complex number; θ/n is the angle of its first principal root.
- The complex plane remains mathematically truthful. A displayed ring represents time, not the modulus |z|.
- Changing θ rotates the rhythm; changing n changes the number of equally spaced events.
- Show Cartesian z=a+bi only as secondary information.

**Acceptance:** KaTeX + MathML, labels, readable across mobile and desktop, consistent with the actual root scheduler.

## CR-ANG-004 · Compatibility and release gate
**Priority:** P0 · **Status:** IN_PROGRESS

- Keep all 35 historical presets, 15 new studies, audio scheduling, the existing JSON schema and root-set operations intact.
- Add dedicated tests for angle-first editing, extra angles, generated families, phase coincidences and import/export.
- Only change statuses to VERIFIED after passing tests. Human sonic assessment, physical-device review and the missing annotated screenshot remain separate blockers.

## CR-PRESET-005 · Preserve example identity after user edits
**Priority:** P1 · **Status:** VERIFIED (automated engineering acceptance)

- Editing a prepared rhythm (BPM, instrument, root angle/degree, root additions, sound patch or volume) **must not replace its title with “Custom rhythm.”**
- Keep the original preset ID, title, category, and description; append **“· Modified”** to the selected option.
- Selecting any prepared example afresh resets the modified flag.
- A genuinely new or anonymous project can still be “Custom rhythm.” An imported JSON with a matching preset name inherits the title, marked Modified; unknown imported names remain visible.
- JSON export must retain the original title, so future import can recover the source identity without extending the existing schema.

**Acceptance:** edit BPM and root; confirm original name remains selected; verify new selection resets status; verify JSON roundtrip maintains source name; avoid false “Custom rhythm” label. No user-facing popup necessary.

### Acceptance evidence for verified engineering changes

Angle-first editing, dual-unit synchronization, direct single-angle additions, symmetric generated families, phase-source provenance, JSON roundtrip and preservation of named modified presets passed in [full regression 42151010633](https://github.com/michael-malis/complex-rhythm/actions/runs/42151010633), including `tests/angle-first.mjs` and `tests/preset-modified.mjs`. Human sound evaluation, physical-device/screen-reader signoff and the second annotated source screenshot remain explicit separate release blockers under CR-ANG-004. The term VERIFIED above covers executable engineering criteria, not final production approval.

## CR-UX-001 · Persistent rhythm example browser

**Priority:** P1 · **Status:** VERIFIED (full automated UI/audio regression passed)

The Rhythm examples section is expanded on initial page load on desktop and mobile. The user can still collapse it intentionally.

Browsing a new category **must filter the example dropdown only**; it must not automatically replace the current loaded preset, reset Modified state, change BPM or root sets, restart the transport, or affect the audio/sample category. The currently loaded preset remains identifiable while browsing another category. Only explicitly choosing an example changes the loaded rhythm. Selecting a preset by mathematical ratio is still an explicit load action. New JSON import and explicit preset selection keep the displayed category synchronized with the loaded preset.

**Acceptance:** desktop/mobile Chromium tests with an active Web Audio transport, zero unintended state changes while browsing five categories, and explicit selection of a new example while playback remains active. Tests: `tests/preset-category-navigation.mjs`, `tests/preset-modified.mjs`, `tests/ui-smoke.mjs`.

## CR-PLAN-002 · Consolidated operational task list

**Priority:** P0 · **Status:** VERIFIED (14-item plan and exact historical coverage tested)

The 652-row `TASKS.md` is retained as an immutable historical acceptance/evidence ledger. Daily execution and project updates use **14 outcome-focused macro tasks** in `NEXT_EXECUTION_PLAN.md`, each with dependencies, measurable exit tests and exact original `R-*` mappings. This reduces the **active work list** without discarding verified or blocked evidence or silently waiving any of the 98 original acceptance requirements.

**Acceptance:** every originally unverified requirement is mapped to exactly one macro task; no duplicates/missing IDs; statuses of historic tasks unchanged by planning; unapproved feature candidates excluded from mandatory counters.

**CI proof:** [42213078501](https://github.com/michael-malis/complex-rhythm/actions/runs/42213078501) passed the full UI/audio regression, including category navigation on 1440px and 390px, preset identity, all 50 presets and the consolidated 14-task coverage validator.

## CR-RHYTHM-003 · Unified beat triggering and rhythm interaction semantics

**Priority:** P0 · **Status:** TODO (planning completed; implementation and dedicated acceptance pending)

**Scope:** tighten and unify existing rules only. This change neither adds a product feature nor introduces a new independent macro task; execute under **M08** (Web Audio / transport / event triggering) and **M10** (mathematical consistency and musical structure across the 50 presets).

- Every audible strike starts from the same canonical phase event produced by the complex-root/added-angle/Euclidean model. Sound and Canvas/time-window visualization use the same event data. Preserve lane-specific cycle lengths, source provenance and per-event accent/velocity.
- Intra-lane coincident roots merge where set-union semantics require it; coincident strikes from different lanes remain distinct. Do not homogenize the instruments, patterns, genre identities or rhythm formulas.
- Define a consistent behavior for Play, Pause, Resume, Reset, explicit preset selection, ratio selection, JSON import and live changes of root arguments, degrees, BPM, additional layers, cycle length and audio patch. Browser category filtering never triggers a new rhythm.
- Use the already implemented Web Audio clock, scheduler, and safe voice cancellation. Prevent duplicate timers, stale notes, lost attacks and unwanted phase jumps after live edits or preset switching.
- Ensure visual hit pulses follow real audio scheduling, without changing the mathematical root positions. Keep accessible reduced-motion feedback.

**Acceptance:** compare canonical events, actual audio event schedules and rendered event counts in all four lanes across all 50 presets; verify simultaneous hits and overlap semantics, four-lane high-density tests, Play/Pause/Resume/Reset, live edits, preset changes, JSON and required polynomial ratios including `7:11:13:17` and `4:7:9:13`. Retain prior passing evidence, repair actual defects and run complete regression at the implementation SHA. Musical/auditory human acceptance remains separately blocked under M13.

**Specification:** see `NEXT_EXECUTION_PLAN.md` section “Unified rhythm-triggering model”. **No new features and no increase from 14 macro tasks.**

## CR-UX-005 · Union-first mathematical composition and progressive audio disclosure

**Priority:** P1 · **Status:** VERIFIED ([full UI/audio CI 42240006060](https://github.com/michael-malis/complex-rhythm/actions/runs/42240006060) PASS). **No new product features.**

- The user explicitly requested **union of points**, not nested set expressions. Make `R_n(z) ∪ ...` a visible, primary mathematical exploration workflow with explicit “Add point” and “Add root set” controls, multiple added sets, distinct resulting phases and collapsed shared phases. Keep intersection and Euclidean operations available in advanced mathematical settings; preserve saved/imported semantics and the original five-layer limit.
- Hide the generic “Magnify plot” button from uncomplicated fit views. Offer a clearly named contextual magnification control only when actual combined root phases have less than the 34px inspection separation, and keep exit available while magnified. Preserve dense-root magnification and pan tests.
- Keep lane volume and preview visible, but collapse oscillator/filter/synthesis sliders under “Advanced sound settings” and hide the whole synth panel for sample-backed voices. Preserve sound parameters, transport and JSON. No audio engine removal or wave-view feature.
- Acceptance: on real desktop/mobile layouts, union-of-point controls are immediately discoverable, overlapping roots trigger only one lane event, multiple added sets work, importing existing intersection settings remains possible, sparse plots have no distracting zoom button, dense plots can still magnify, and sound settings are accessible on demand. Full UI/audio CI must pass with additional focused tests before status promotion.


## CR-UX-006 · Root formula fit, per-lane volume, curated grooves and acoustic bongo variants

**Priority:** P1 · **Status:** IN_PROGRESS (production PR #16; automated and manual acceptance not yet complete).

**Origin:** Direct user review of screenshot clipping/scrollbar artifacts in the four-lane editor and mathematics card, plus requested instrument-volume, low-end, bongo and preset organization changes on 2026-11-06. This change is part of the normal M03/M05/M07/M08/M10/M11 engineering loop; it does not create a fifteenth macro task or modify the 98 original requirements.

1. **Math: no pointless scrollbars.** Each lane displays the actual numeric complex coordinates of every base and added nth-root family (including n=1) rather than opaque \`u_1\`. The on-lane equation can wrap between distinct set terms; individual KaTeX terms scale down modestly when needed. The root placement rule remains KaTeX/MathML and shrinks mathematically, with no inner vertical/horizontal scrollbars. The underlying double-precision complex state, root phases, project JSON, circle geometry and scheduler are not rounded or changed. A hint makes the display-only coordinate rounding explicit.
2. **Primary lane volume.** Always expose four independently adjustable volume sliders adjacent to the four visible instrument controls, not only in the composition inspector. Preserve independent per-lane \`gain\` in canonical state, JSON and scheduled audio, including muted/unmuted behavior. Keep the previous selected-lane inspector as a synchronized secondary control so existing workflows remain intact. Master volume remains globally separate.
3. **Bongo timbres.** Expose an acoustic low-bongo and high-bongo instrument option backed by the existing locally licensed bongo sample, with clearly distinct playback rates and appropriate headroom. No external copyrighted YouTube audio is copied. Use the same attack/phase/event scheduler as all other voices; fallback must remain audible without an asset.
4. **Browsable groove groups.** Organize original source categories in readable musical families. Add a curated six-groove collection referencing five distinct techno presets plus a Brazilian acoustic bongo/bossa study, including Bass Wall's constant four-on-the-floor kick and complementary rumble. Preserve the full original 50 preset IDs, 35+15 inventory, category-specific audio assignments and structural traceability. Browsing any group is a filter-only action; explicit selection alone changes the active preset.
5. **Bass Wall body.** Raise low-frequency presence modestly in existing kick/rumble signal processing, without introducing extra planned attacks, changing root phases or claiming human audio acceptance.

**Acceptance:** new real-browser \`tests/production-grooves-ui.mjs\` passes at 1440×900 and 390×844 in both themes, no formula scrollbars/page-overflow/raw TeX, numeric coordinates and responsive wrapping present, four visible 44px-touch volume inputs independently update the underlying state and synchronize inspector gain, acoustic bongo samples resolve and remain instrument-selectable, curated browse shows six distinct preset IDs and never auto-loads. Existing 50-preset source/diversity, full audio math/UI/JSON/transport and light/dark accessibility CI must PASS at the same final code SHA. Human taste/listening and physical mobile/screen-reader assessment remain explicitly blocked under M13. **Do not mark VERIFIED until full CI and evidence review.**

**Implementation PR:** https://github.com/michael-malis/complex-rhythm/pull/16


### 2026-11-06 — Collection and genre navigation refinement (same production PR #16)

The user requested clearer preset organization as an **additional part of this production cycle**, not a separate experimental project. The browser now has a two-level hierarchy: **Collection → Style filter → Example**. Four disjoint musical families cover the existing 50 presets without moving their IDs or changing their canonical source category: **Techno & club** (including house/dub), **Breakbeats**, **Acoustic & world**, and **Polyrhythms & complex roots**. A fifth, explicitly curated **Featured grooves** view reuses six of the same presets and is intentionally non-disjoint.

The optional style filter preserves all original technical category values, their source-specific sample routing and backward-compatible tests. Switching a collection or style only changes visible options and never changes the current project, BPM, four root sets, transport, sample settings or JSON identity. Selecting an example still performs the explicit load. Styles auto-synchronize to the relevant high-level collection. The added real-browser coverage in `tests/production-grooves-ui.mjs` verifies a union of **exactly 50 unique IDs across the four source families** on light/dark desktop/mobile, six curated featured examples and filter-only transport behavior.

**Acceptance state:** changed code and automated tests are submitted in PR #16; do not promote counters without a fresh PASS on the final SHA.


### 2026-11-07 — User-supplied Song Examples collection (same production PR #16)

A new fully English collection and style, **Song Examples**, contains the user-provided `Prodigy Boom Boom Tap (study)` JSON as a genuinely selectable, playable rhythmic study. The UI display title is `Prodigy · Boom Boom Tap (Rhythm Study)`, while the canonical source `name` stays byte-for-byte the original user value for legacy import/export recognition. The unmodified underlying JSON is retained at `presets/song-examples/prodigy-boom-boom-tap-study.roots-rhythm.json`.

The study uses 160 BPM, a one-bar cycle and four lanes: kick (4 unique hits), snare (4), hi-hat (8), and Reese bass (4). Its 8 added single-root components, exact complex coefficients, velocities, per-lane gains, and operations are preserved; existing local samples/synths supply the sound. There are **no external audio recordings** or imported copyrighted sound assets. The study is an educational reconstruction and is not represented as an official or exact transcription.

**Catalog integrity:** the initial 50 genre and mathematical examples remain the original research-inventory dataset, with their historical evidence, IDs and source categories unchanged; Song Examples adds a separately curated 51st user-visible item. Its sixth top-level collection is filtered without loading or restarting music. `tests/ui-smoke.mjs` covers all 51 user-selectable examples; `tests/song-examples.mjs` verifies exact input coordinates and layers, 160 BPM, 4/4/8/4 event counts, live transport, English title, source JSON export/import round trip, and both themes at 1440px and 390px. The existing 50-preset quantitative diversity baseline remains separate.

**Release:** same PR #16; full same-head regression and registry checks must PASS before any merge to main. No additional historical requirement or manual listening sign-off is asserted.


### 2026-11-07 — CR-UX-007: Single Category / Preset browser + Acid differentiation

**Requested behavior:** Eliminate four adjacent preset navigation controls. The primary preset toolbar contains exactly **two** visible selectors: **Category** and **Preset**. No Collection, Style filter, or dedicated Mathematical ratio dropdown remains. The English Category menu directly exposes the recognizable source genres (including Acid / 303) and the two curated choices Featured Grooves and Song Examples. Each of the 51 playable presets remains addressable with just those two selectors; six Featured items intentionally duplicate entries from their original categories. Root-ratio studies remain discoverable through an explicit ratio prefix on eight existing preset labels, without deleting or altering any mathematical model or JSON. Changing Category does not change active audio or the four-lane project, even while playing; only explicit Preset choice does.

**Parallel M07/M10 finding:** The four original `category:'acid'` examples were substantially alike: all four used the same generic `acid` sound and near-identical four-to-the-floor kick / backbeat / hat scaffolding. The earlier six synthesizer-voice parameter test is real technical evidence, **but does not establish that four actual presets sound distinct**. Fix the preset-level cause by assigning four genuinely different synthesized acid leads (`acidClassic`, `acidPsychedelic`, `acidDark`, `acidHard`), changing lead degrees to 4/5/2/7 and adding differentiated root families, kick patterns, ghost accents and detailed sound-role explanations. The four lead parts produce 6/7/4/9 events in one cycle, respectively. Each event still comes from the argument of a complex root. This is a qualitative design change to existing preset arrangements, not a historical claim that the old configuration was verified. Historical 50 catalog IDs, genre grouping, song study and same JSON format are preserved.

**Automated acceptance (new):** `tests/production-grooves-ui.mjs` tests exactly two selectors, all 51 presets, unchanged canonical state during browsing, six Featured options, light/dark desktop/mobile and visible instrument volume / math. `tests/required-polyrhythms.mjs` exercises eight original root-degree relations via normal presets rather than a redundant third dropdown. `tests/acid-preset-diversity.mjs` asserts unique Acid lead synth voices, distinct lead-event counts, differentiated kick patterns, real offline audible and bounded Acid waveforms, no JS errors and four viewport/theme combinations. Existing 50-preset inventory and broader UI / DSP / import / accessibility regressions must PASS on the same commit SHA. Measured signal distinctions do **not** substitute for a human listening review (M13). No historical VERIFIED counter is promoted without appropriate evidence.

**Current status:** implemented in a development branch; full CI / production merge pending.


### 2026-11-07 — CR-UX-008: Optional bottom Sound Lab with actual instrument waveforms

**Product decision:** Keep the mathematical workspace focused on root geometry and musical phases. Restore useful oscillator/filter/envelope editing as **one closed-by-default Sound Lab disclosure after the main workspace**, above the footer; no prominent wave editor or second sequencer. On opening its single summary, select any of the four instrument lanes independently of the mathematically selected root ring. The selected lane's actual synthesized voice can be previewed, and its existing `patch` values are edited with the same supported oscillator, filter, resonance, decay, modulation and saturation parameters. The editor offers an explicit per-lane reset that does not touch other tracks. All controls are keyboard and touch accessible. Main instrument gain remains on each lane.

**Waveform is evidence rather than decoration:** Plot on demand from `OfflineAudioContext` using the same `RhythmVoices.play()` synthesizer and its current patch parameters. For sample-backed voices, decode local authorized recordings and display a read-only waveform, honoring low/high bongo playback rate. Only use sample files that already ship in `samples/`. For the two unrecorded low-end voices, **Reese bass and Sub bass**, factor their original legacy Web Audio oscillators, filters and envelopes into a single shared helper used by both actual playback and Sound Lab, so their plots are not fabricated. When other recorded sources are unavailable and no supported sound engine can render them, show an explicit limitation rather than drawing a fabricated waveform. Waveforms show a normalized single hit before master processing, not the four-lane beat timeline; they never change root phases, rhythm scheduling or audio state. Rendering is cancellable on lane changes and disclosure close; no perpetual animation or audio playback is started by opening the panel.

**M07/M08/M11 acceptance:** New `tests/sound-lab.mjs` checks collapsed default, single bottom disclosure, desktop/mobile × two themes, independent lane selection, actual offline synthesized and local-sample waveforms, oscillator-induced plot changes, patch persistence, reset, one-shot preview without an extra transport scheduler, mathematical state immutability, and no horizontal overflow or JavaScript errors. Existing `tests/union-first-ui.mjs` and `tests/expanded-ui-typography.mjs` are updated to inspect source/sample-specific controls in the new location without weakening the original checks. The existing full audio, math, JSON, transport, responsiveness and source ledger workflows remain mandatory. This is a production-cycle improvement inside M07/M08/M11, not a new macro-task or a change to the historical 98 requirements. Human ear, physical device and screen reader sign-offs (M13) remain separate.


### 2026-11-07 — CR-UX-008 follow-up: complete native instrument waveform coverage

**Why this remains in M07/M08/M11:** The first Sound Lab release shared exact low-end synthesis for Reese and Sub bass. Four other legitimate instrument choices (`acid`, `surdo`, `agogo`, `tamborim`) still used live legacy Web Audio graphs but had no corresponding offline waveform. The user asked that Sound Lab work when choosing the waveform of **any instrument**, not only separately defined synth voices and recorded samples. Keep one bottom optional panel; do not add a secondary sequencer or more prominent controls.

**Implementation:** Refactor those six legacy unrecorded instruments into a single shared native Web Audio renderer. Both live note attacks and the offline Sound Lab call the same oscillator, filter, envelope and (for surdo/tamborim) noise algorithms. The live noise source retains its existing random recorded-buffer offset; the offline view renders one deterministic, valid noise realization. This is source waveform inspection, not an audio sample or claim to display all stochastic realizations identically. No new presets, voices, editor categories, rhythm events or math have been added. Local sample-backed and explicitly defined RhythmVoices synth instruments retain their existing paths. Unsupported audio assets still report failures transparently.

**Acceptance:** `tests/native-waveform-coverage.mjs` renders all six instruments via `OfflineAudioContext` in four light/dark desktop/mobile cases, measures bounded nonzero waveforms and uniqueness, checks root phases and active transport remain unchanged by lab selection, and confirms one-shot preview does not create an additional repeating scheduler. The existing full audio stress and UI regression must pass on the same SHA. Human hearing acceptance and hardware tests remain M13.


### 2026-11-07 — M05/M06: enforce the existing mathematical typography audit with executable evidence

The project already contained `MATH_TYPOGRAPHY_AUDIT.md`, but the final historical note still said that the per-formula evidence had not passed CI and did not independently inventory the current root-rule SVG-linked formula locations and all four lane equations. Retain previous source-derived comparisons and the original historical baseline. Extend the document with a complete 10 static + 16 dynamic + 4 phase-label location/evidence matrix, explicit canonical data sources, update methods and pointers to all twelve browser screenshots. The true original before-view for each individual formula remains unavailable; no fabricated historical before/after imagery.

`tests/formula-acceptance.mjs` now records KaTeX HTML, MathML, source `annotation` and viewport bounds at all sixteen live mathematical DOM locations (including selected root, union, graphic root-rule, expanded SVG-adjacent notes, and the four formula cards), plus the previously checked ten reference formulas and quarter-circle stacked fractions. Actual degree/coefficient/drag updates are still required. `scripts/verify-math-typography-audit.mjs` independently inspects the saved JSON report, all 12 real nonempty Chromium PNG signatures, source coverage in the audit, and dynamic proof. Both run as mandatory GitHub UI-regression steps, so missing or mismatched screenshot evidence fails CI rather than silently passing. No historical ledger rows or M05/M06 macro states are promoted without explicit parent/child evidence review. M12/M13 external sign-offs remain separate.


### 2026-11-07 — M11: independent measured-output evidence manifest for real regression

The workflow already ran independent Playwright and OfflineAudioContext tests, but lacked a final gate tying those tests to their generated measurements. `scripts/verify-ci-measurement-manifest.mjs` now requires **14 actual JSON evidence outputs** and validates the count, source, PASS status or measured failure thresholds for light/dark computed WCAG contrast, touch-target dimensions, root/phase geometry, reachable responsive content, expanded settings, full KaTeX screenshot and source coverage, offline synthesis, output-onset stress, Sound Lab, native fallback instruments, Acid diversity, user-provided Song Examples, and curated instrument controls. It writes `artifacts/release-evidence-manifest.json` only if every source actually exists and passes its measurable invariants.

This is a release-evidence aggregation and consistency guard, not a fabricated universal certification. The source test scripts still perform their own measured assertions. No required viewport, report or unpopular test has been removed. Physical-device listening, screen reader, original annotated screenshots and final seven-gate acceptance remain M12/M13/M14 blockers, and historical 380/652 and 63/98 counters are not modified.


### 2026-11-07 — M08 / R-SND-006: live phase continuity across transport transitions

Current transport tests covered rapid double/triple Play clicks, 24 preset switches and voice-bus cleanup but did not explicitly assert preservation of normalized complex-root **cycle phase** across Pause → BPM edit → Resume, live BPM changes, running Reset and stopped Reset. Add a read-only diagnostic snapshot of cycle phase/paused phase/cycle duration, without exposing writable state or changing the mathematical scheduler. Fix a real state-bookkeeping defect: the asynchronous Play initializer left `transportWanted=true` even after playback had already started. The pending-start flag now clears atomically on successful Play. No instrument, preset, event engine or musical phase formula is replaced.

`tests/transport-phase-continuity.mjs` checks actual AudioContext-backed phase advancement and suspension on desktop and mobile, exact phase freeze when paused, BPM-change phase continuity, Resume phase tolerance for the deliberate short audio preroll, both running and paused Reset, no duplicated scheduling intervals and no browser exceptions. The new test writes `artifacts/transport-phase-continuity.json`, which becomes the **15th mandatory measurement** in `scripts/verify-ci-measurement-manifest.mjs`; no arbitrary numbers or listening judgments are recorded. R-SND-005/-006 and M08 remain IN_PROGRESS pending requirement-specific acceptance; legacy historical VERIFIED rows are not silently promoted.

### 2026-11-07 — R-TEX-004 formally accepted from exact ten-formula evidence

The independent [full UI regression 42317538760](https://github.com/michael-malis/complex-rhythm/actions/runs/42317538760) executed `tests/formula-acceptance.mjs` and `scripts/verify-math-typography-audit.mjs` against the post-PR #21 implementation. Every one of R-TEX-004's ten source formulas was asserted against its exact KaTeX annotation and validated as real KaTeX HTML plus MathML, with zero raw formula errors or clipping across six required viewports and two themes, and twelve real Chromium screenshot artifacts. Since R-TEX-004 has a single original parent task and no child tasks, this is sufficient technical evidence to mark it VERIFIED. `TASKS.md`, `TRACEABILITY.md`, `ACCEPTANCE_CRITERIA.md`, `LEDGER_EVIDENCE_SUMMARY.json` and `scripts/reconcile-ledger.mjs` are synchronized. The original total increases to **381/652 historical VERIFIED** and **64/98 parent requirements VERIFIED** (48 historical IN_PROGRESS, 219 TODO, 4 BLOCKED).

No other math requirement is promoted: R-TEX-002/005/006 contain separate source conditions, and R-TEX-008's historical visual before/after remains independent and unfinished. M05/M06 macros remain IN_PROGRESS, and final signoff is still not complete. This change was made from explicit reproduced evidence, not from an assumption that any implemented file implies acceptance.

### 2026-11-07 — CR-UX-009: Visualize and explain per-lane loop length

**User finding:** The original `Cycle length · bars` number field was not self-explanatory. Rotating points kept their normalized argument even when one 4/4 bar became four, so the circular view seemed unaffected; the real timing effect was hidden in a separately collapsed four-bar timeline. This is a communication defect, not evidence of incorrect complex-root phases.

**Mathematical and interaction rule:** For a track with `cycleBars = L`, one ring revolution covers `L` complete 4/4 bars. If a root yields normalized phase `φ`, its bar-time offset is `Lφ`. Changing `L` preserves root coordinates, degrees, velocity and event count while increasing or decreasing time between attacks. Root phases must never be duplicated to simulate multi-bar sequences. Four independent loops repeat together after their least common multiple.

**New UX:** Replace the unexplained numeric field with an accessible per-lane `Loop length` dropdown covering **every integer 1 through 16** (no loss of old JSON values). Each lane includes an explicit `1 full turn = L bars (4L beats)` readout. The actual Canvas rings draw bar-start ticks at phases `j/L`, `j=0,…,L−1`, in each lane's color. Immediately below the graph, a compact responsive guide names all four loop durations, shows which bar each is on, and explains why the dots remain in place. The existing four-bar timeline is relabeled **Compare hits across bars** with clarification that it displays actual scheduled events. No new sequencer, instrument controls or third category selector.

**Acceptance:** `tests/cycle-length-visualization.mjs` in the full CI suite verifies 1–16 native options, visible Canvas pixel changes and normalized tick geometry, exact unchanged root phases, real event timing over the four-bar window, combined 3×4 / 2×3 LCM, independent lane selection, no new Web Audio scheduler, mobile/desktop light/dark layout and absence of page horizontal overflow. Two legacy tests are updated from filling the number field to selecting the same bar values. The release evidence manifest requires a sixteenth real JSON report. Historical 381/652 and 64/98 VERIFIED counters remain unchanged without separate acceptance.
