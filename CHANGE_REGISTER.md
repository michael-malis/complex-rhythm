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

### 2026-11-07 — CR-UX-010: Lane-matched UI controls and intentional wheel stepping

**User issue:** A root-ring color was also used as a universal control accent. Four parameter cards at the desktop 2×2 layout occupied excessive height. The visible per-instrument gains and advanced root-union sliders did not visually identify the lane they affected. Mouse-wheel input was inconsistent: HTML number spinners could change while radian text inputs and volume sliders did not.

**Implementation:** Use all four original mathematical `COLORS[i]` and matching CSS lane tokens for per-instrument sliders, button selection borders, focus outline and composition controls (including base-rotation slider, added accent volume and selected-lane mirrored gain). The selected lane's color is propagated to `#compositionPanel` and root geometry explanation without changing musical event colors. UI chrome gets an independent slate-blue accent; Master Volume gets a different, independent deep blue, never shared with the four lane palettes. For accessible numeric readouts, blend each lane hue with ink to preserve WCAG text contrast rather than using a low-contrast raw hue; the slider remains the exact root color.

**Wheel semantics:** Only a focused (clicked or keyboard-focused) compatible control consumes wheel gestures; hover does not hijack page scrolling. Root degree uses integer `n`, per-instrument/master gain sliders use their existing 1-percentage-point step, and oscillator/voice patch sliders use their native step. Both degree and symbolic-π radian fields increment the **same mathematical angle** by exactly `1° = π/180 radians`, including individual added-root angles. The root degree and angle apply to the canonical complex number immediately during playback; the existing render-frame batching and single AudioContext scheduler are retained, with no duplicate notes or clock timers introduced.

**Layout:** Tighter desktop card padding, spacing and label rhythm (not touch input dimensions) helps all four panels occupy the 2×2 parameter area without adding overflow. Inputs maintain at least 44 CSS pixel targets and 16px text. The globally accessible slider is explicitly labeled `Master volume`.

**Acceptance:** `tests/lane-colors-wheel-controls.mjs` checks all four card / root / slider colors, independent Master Volume, keyboard/focus-gated wheel behavior, `n` changes to actual event counts while playing, one-degree radians/degrees and Combine Root rotation, per-lane/mirrored/master gain independence, mobile/desktop × light/dark, live scheduler cardinality, touch-target sizes and no horizontal overflow. The full existing source/UI, math/geometry, WCAG and spectral/audio regression remain mandatory. The independent report is added as the **16th** required CI measurement. No new parent source requirements or historical VERIFIED claims are made; the formal baselines remain 381/652 and 64/98.

**Deferred separately:** PR #26's permanent bar-boundary ticks are not merged with this change because the product direction under discussion favors optional multi-speed lane pointers instead of an always-visible sector system.

### 2026-11-07 — CR-UX-011: Replace unsynchronized radial playback line with four audio-locked orbital hands

**Confirmed user-facing defect:** The existing Canvas drew one center-outward line for the **selected** instrument using `lanePhase(tracks[selectedTrack])`, while the audio scheduler played hits from all four lanes. A sound from a nonselected lane could therefore occur without any corresponding pointer reaching the event. Worse, under `prefers-reduced-motion`, the old line rounded its angular position to 16 discrete increments. That approximation could be significantly wrong for a two-, four- or sixteen-bar cycle and was not suitable for a rhythm teaching application.

**Repair:** Remove the big radial line from `draw()`, not just hide it. Every frame obtains the same `playbackElapsed()` driven by `audio.currentTime - beatEpoch` and calculates `RhythmMath.phaseAt(elapsed, track.cycleBars, barSeconds())` separately for each of the four lanes. On each corresponding concentric root ring, draw a short clockwise, tangential colored arrow. Its **tip is geometrically located exactly at the normalized cycle phase**, overlaid on the root marker at an event (with a contrasting arrowhead outline). Colors use the existing four lane-root hues. One-bar lanes share angular phase even if their root counts differ; a two-bar lane is half-speed and a four-bar lane quarter-speed. The pointer location remains exact even when decorative beat expansion is suppressed for reduced motion. No new timers or independent visualization clock: all pointers are driven by the existing animation frame and canonical AudioContext time.

**Measured acceptance:** `tests/orbital-hands-audio-sync.mjs` instruments Canvas `arc` / `stroke` to verify four actual short colored paths on the real rings (not merely computed JSON), with no big radial needle; matches their tips and coordinates to `window.RhythmResearch.orbitalHands()` read-only latest frame. It independently reproduces actual `RhythmMath.planEvents` per-lane sound times, checking that every note is coincident with its lane's hand/root phase for 1/1/2/4-bar loops. Live BPM and root-count edits, Pause/Resume/Reset, active audio-clock state, dark/light desktop/mobile viewports and reduced-motion precision are all covered. The existing pulse, root geometry, transport, math and accessibility tests remain mandatory. The new JSON report is the **17th independently required CI measurement**.

**Scope guard:** The old `radialVisibleSegments` mathematical helper remains for historical backward-compatibility tests but is no longer called by production Canvas. The superseded PR #26 (permanent visible bar partitions) must not merge into this direction. This work is a correction inside M03, M08 and M11, not an automatically VERIFIED new source requirement; the original parent/historical counters remain **64/98** and **381/652** pending separate evidence review.


### 2026-11-07 — M08/R-SND-006: Evidence for native AudioContext absolute-time attacks

**Gap:** Mathematical event maps, transport-phase continuity and visual playheads were measured, but no independent browser test intercepted the actual native Web Audio oscillator `start(when)` calls and compared those scheduled timestamps to a real complex-root event plan. A green clock/visual animation alone cannot prove that native audio attacks are scheduled ahead of JavaScript timer callbacks.

**Measurement:** `tests/audio-context-scheduler-proof.mjs` isolates a genuine native two-oscillator bass voice on one lane, mutes the other three lanes, selects eight roots and 240 BPM, and records `OscillatorNode.prototype.start` calls with `AudioContext.currentTime`. It compares the absolute Web Audio attack timestamps against `beatEpoch + RhythmMath.planEvents(...).time`, allowing at most 12 ms for the existing measured output-chain compensation and edge-of-window clamping. It also requires at least one future-dated attack with a lead of 15 ms or more, exactly two native oscillators per audible event, one lookahead interval while playing and none after Pause. Both desktop and mobile Chromium cases write raw measured evidence to `artifacts/audio-clock-scheduling/report.json`.

**Release control:** Required UI CI now invokes the proof, and `verify-ci-measurement-manifest.mjs` demands the **18th** independent real measurement file before the workflow can pass. This adds test coverage, not an additional timer or audio implementation. Human loudspeaker latency and listening acceptance are explicitly excluded; R-SND-006 and its historical parent remain IN_PROGRESS until separately reconciled using a successful exact-HEAD CI run.


### 2026-11-07 — CR-UX-012: Slightly larger four orbital playheads

**Requested visual refinement:** Enlarge the four instrument-colored arrows without introducing a large radial line or changing the mathematical root markers, audio schedule, colors, orbital radii or pointer-tip phase.

**Implemented:** Tangential path length increases from the former 8–17 CSS-pixel adaptive range to approximately 10–21 CSS pixels (capped at 40% of the local radius); line widths become 6.5px on the selected lane and 5.5px elsewhere (previously 5.5/4.5px). Each triangular tip extends 13px back along the tangent and 6px to either side of the ring's local radius (previously 11px and 5px). The tip point itself remains exactly at the event root phase.

**Acceptance:** The mandatory actual-Canvas orbit test now checks per-lane painted arc length and stroke thickness in desktop/mobile × light/dark states, including lane selection while playing, alongside existing four independent audio-clock phase proofs, 1/2/4 bar speeds, Pause/Resume/Reset and root-hit timing. Historic requirements stay 65/98 and 382/652 pending a separate requirement-specific acceptance; this is a bounded UX refinement within M03/M08/M11.


### 2026-11-07 — M08/R-SND-005: Shared production limiter and measurable output safety

**Detected measurement gap:** The existing offline audio stress test independently recreated the high-pass and waveshaper code instead of testing the same implementation used in live production. A regression to the live limiter could thus pass the "audio safety" tests. Master volume smoothing was also copied only into the UI handler.

**Repair:** `synthesis.js` now exports `createMasterOutputChain(ctx,destination,initialGain)`, which builds exactly the same 20Hz high-pass, 2× oversampled soft-knee WaveShaper ceiling (±0.84, under −1 dBFS), and initial gain for production `app.js` and offline regression; `setMasterVolume(master,value,time)` applies the existing 14ms smoothing for safe rapid volume edits. Production synthesis and attack timing, root mathematics, all existing audio voices and sample routing are retained. Both `tests/audio-mix-stress.mjs` and `tests/audio-offline.mjs` now use the production constructor instead of copy-pasting its transfer curve.

**New measured acceptance:** `tests/master-output-safety.mjs` renders 32kHz and 48kHz OfflineAudioContexts using the actual production graph, with 48 scheduled root-event synth voices, asserting finite samples and ≤−1 dBFS sample/4× reconstructed-peak estimate, actual 20Hz/2× master nodes, 5Hz subsonic attenuation relative to 100Hz, non-abrupt fast volume decreases/increases, and kick-onset latency below 5ms. Raw JSON `artifacts/master-output-safety/report.json` is the **19th independently enforced CI measurement**. This is measured engineering evidence, not certified BS.1770 true-peak metering, human auditory judgement or a guarantee about every playback device. R-SND-005 remains IN_PROGRESS until full exact-head CI passes and its individual original acceptance is reconciled.


### 2026-11-07 — M08 technical acceptance after PR #32

The code changes in [PR #32](https://github.com/michael-malis/complex-rhythm/pull/32) passed all four required checks on head `7b9e259a797fdaad37d7a7a4e69967dec8abbed1`, including full UI/audio [CI 42348284633](https://github.com/michael-malis/complex-rhythm/actions/runs/42348284633). The source-specific `R-SND-005` master-output requirement and all seven original atomic conditions have now been reconciled against **actual** 32kHz/48kHz signal measurements and the 50-preset stress suite. `R-SND-006` (native AudioContext event scheduling) was independently accepted in PR #30. Together with the earlier transport, event-map, audio-scheduling and orbit-pointer regression, M08's technical Definition of Done is satisfied. Formal status becomes **5/14 macro VERIFIED**, **390/652 source tasks VERIFIED**, **66/98 parent requirements VERIFIED**.

This is technical/automated acceptance only. Human hearing, real phone/speaker output, all-preset subjective genre evaluation and screen-reader review stay blocked under M13, the missing original annotated screenshot stays blocked under M12, and final M14 remains TODO. No inference from one smooth measured gain transition to universal subjective satisfaction is permitted.


### 2026-11-07 — M07/R-SND-004: Distinct acoustic topology for aggressive synthesized kicks

**Identified gap:** In the 15-voice synth engine, techno, hardcore, gabber, and frenchcore kicks previously shared almost exactly the same paired-oscillator topology (only pitch, waveform, saturation and envelope parameters changed). That made some heavy kicks structurally less distinctive and left original R-SND-004 transient/spectral-shaping conditions only indirectly demonstrated.

**Implementation:** Keep the existing underlying pitch-envelope, gain-envelope and master output chain, but route the four kick bass bodies through a dedicated 27Hz high-pass and per-program 170/290/440/270Hz low-pass filter. Give hardcore, gabber and frenchcore independently synthesized short swept-frequency transient paths, each with its own high-pass, tuned drive waveshaper and fast amplitude envelope; gabber gets a sawtooth transient and stronger distortion, hardcore a triangle-driven transient, and frenchcore a sine transient plus a separate pitched overtone for the resonant tail. Techno retains a relatively clean two-oscillator architecture. All layers are scheduled on precisely the existing root event time using the same Web Audio context; **no new sequencer, timer, preset, UI control or external sound asset** is introduced.

**Measured acceptance:** A browser-driven OfflineAudioContext test creates 8 real renders (four sounds at strong and soft velocity), instruments the actual Web Audio graph nodes (2/3/3/4 carrier/transient oscillators and correct per-voice filters and drive), and verifies finite, appropriately bounded attacks, bass-body/tail envelopes, exact scheduled start region, and **all six pairwise gain-normalized waveform differences**, proving the changes are not merely volume boosts. The generated `artifacts/kick-architecture/report.json` is mandatory as the **20th** independently checked CI measurement. Existing 15-voice, Acid, 50-preset and sound-level acceptance remain mandatory.

**Scope:** R-SND-004 and M07 engineering advancement, not a claim of human-perceived genre authenticity or final audio quality; R-SND-001 and R-SND-004 source parent statuses remain IN_PROGRESS until a separate exact-CI acceptance review.


### 2026-11-07 — R-SND-004 original technical acceptance after merged PR #34

The exact PR #34 head `771361176de6411c9e852f59fdf66600a2891371` passed all required GitHub checks including the full UI/audio run [42358463110](https://github.com/michael-malis/complex-rhythm/actions/runs/42358463110) and its **20** independent measurement reports. The new source-specific test shows actual filtered kick-body and saturated pitch-swept transient graphs, eight velocity-varied Web Audio renders and six pairwise comparisons after normalizing signal amplitude. The existing 15-voice spectral and envelope audit covers industrial metallic/FM percussion, and earlier dense 50-preset/sound-pressure tests remain mandatory.

These measured source proofs cover `R-SND-004` and its seven original atomic requirements, so its parent and children are recorded VERIFIED: **398/652 historical tasks**, **67/98 parent requirements**. This does **not** certify perceptual musical quality, speaker compatibility or controlled listening: `R-SND-001` full family inventory and M07 are still IN_PROGRESS; original human listening M13 remains BLOCKED. M08 stays VERIFIED.


### 2026-11-07 — M07/R-SND-001: Whole original 14-instrument inventory measured end-to-end

**Remaining technical acceptance gap:** The original instrument family R-SND-001 still had four unverified items even after the already accepted acid R-SND-003 and aggressive percussion R-SND-004: Snare, Closed hat, Open hat, and Reese bass. Rather than silently promote those based on names, prove the complete original 14-source matrix through the actual app's Sound Lab renderer and preserve mathematical phases.

**Actual implementation evidence:** All 14 mandated voices already exist: 10 have individually synthesized Web Audio oscillator/filter/envelope paths (techno/hardcore/gabber/frenchcore kicks, metallic FM percussion, Classic 303 acid bass, Hoover bass, rave stab, noise burst, FM percussion); snare, closed hat and open hat use three different, locally decoded CC0 recordings; Reese has a real detuned sawtooth + sweeping resonant filter native synth, shared by live audio and the waveform lab. Acoustic/hats are not misrepresented as a new synth patch. The original 50 presets and category sound selection remain unchanged.

**Acceptance method:** `tests/mandatory-voice-inventory.mjs` selects each of the 14 original voices inside the real live-browser instrument menu in desktop and mobile layouts. It awaits a separately rendered actual waveform from the matching synth, recorded or native fallback source; measures peak and verifies all **14 gain-independent, normalized waveform PNG hashes are unique**, source types are 10 synth / 3 recordings / 1 native Reese, no zero/silent placeholder, no root phase mutation, no transport timer creation, no runtime errors and no horizontal overflow. All 14 voices remain available without adding UI or another sequencer. Existing full 15-voice spectra, CC0 sample signatures, six native offline sound graphs and kick-architecture QA stay mandatory; the new JSON measurement is **CI report #21**.

**Status guard:** Until exact-head full CI demonstrates the 14-source invariant and the separate original-source task ledger is reconciled, R-SND-001 and macro M07 remain IN_PROGRESS. Human auditory distinction, authenticity and real device checks are still M13 BLOCKED, not certified by normalized waveform uniqueness.


### 2026-11-07 — Original R-SND-001 acceptance and M07 macro completion

The exact PR #36 HEAD `623647d21073dccee678b7729b1c8cdd62c09a1b` passed [full CI 42359549057](https://github.com/michael-malis/complex-rhythm/actions/runs/42359549057). Its 21st mandatory real measurement includes 14 individually rendered, gain-normalized nonidentical waveforms per browser viewport, 14 selectable instrument sources, 10 original synth programs, three distinct CC0 drum/hat recordings and the real two-detuned-oscillator Reese sound (a shared live/offline engine). Neither switching sounds nor expanding the Sound Lab mutates original complex-root phases or transport scheduling; no additional timers, page-wide overflow or browser errors occur. Earlier tests separately verify 15 synthesized programs, 7 distinct drum recordings, 6 native fallback graphs, 4 aggressive kick architectures, and all six Acid programs with real parameter response.

Original `R-SND-001` parent and the four previously pending atomics (snare/closed hat/open hat/Reese bass) advance to VERIFIED; the previous ten verified source sound tasks preserve their original historical evidence. R-SND-003 and R-SND-004 were independently accepted earlier. Therefore operational **M07 technically VERIFIED** and project source ledger **403/652 historical VERIFIED**, **68/98 parents VERIFIED**. Macro totals **6 VERIFIED / 5 IN_PROGRESS / 1 TODO / 2 BLOCKED**.

**Independent mandatory limits:** No metric proves subjective genre authenticity or comfortable sound on a real speaker/headphone. M13 must still document human listening, phones and assistive technology. Missing original annotated UI comparison M12 and final signoff M14 also remain unresolved.


### 2026-11-07 — M10/R-PST-006: Explicit phase-coincident accents and source-measured groove structure

**Detected musical-structure gap:** 15 original experimental studies had separately calibrated per-lane gains but almost all base-root events retained velocity 1; their musical accents were largely implicit rather than real source-backed quiet root events. Most rotated prime-degree lines also had no intentional cross-lane root coincidence. Earlier generic schedule-equality QA did not prove original R-PST-006 per-preset contrast, articulation and musical organization.

**Implementation:** Preserve all 50 original preset IDs, 35 original catalog source configurations and 15 experimental base root families, root degrees, BPM, sound voices, phase offsets and gains. For each of the 15 experimental studies add (i) a .70 velocity, n=1 root on lane 2 exactly aligned with the existing first kick root on lane 1; (ii) a .46 velocity n=1 ghost root halfway between consecutive lane-1 base roots; and (iii) a .38 velocity n=1 ghost root halfway between consecutive lane-2 base roots. These are *real complex-root layers*, not a parallel 16-step sequencer. Two different lanes play separately at the shared phase; duplicate sources inside one lane form one event with retained provenance. Existing mathematical/audio controls and canonical AudioContext timing remain unchanged. Extend every new study's mathematical note to document the generated accent structure.

**Independent acceptance:** New `tests/preset-musical-structure.mjs` computes all 50 real four-bar rhythm schedules and verifies their exact match to 0.173s lookahead chunks (phase, source metadata, velocity, sound, gain). All 15 experiments additionally must document roles/math, expose at least two source-backed quiet accents, ≥1 meaningful cross-lane kick-response collision, differentiated lane density and stable instruments. A synthetic deliberate base/extra same-lane collision must yield one attack, while separate simultaneous lanes yield two. Machine report plus per-study musical structure document are saved in `artifacts/preset-structure/` as **required real measurement #22**; [M10_RHYTHM_STRUCTURE.md](M10_RHYTHM_STRUCTURE.md) documents invariants. R-PST-006 remains IN_PROGRESS until exact CI passes and the original source requirements are separately reconciled. M13 subjective and device listening remains BLOCKED.


### 2026-11-07 — Formal R-PST-006 and M10 source-specific acceptance

Exact [PR #38](https://github.com/michael-malis/complex-rhythm/pull/38) head `548a487958f7ccef609ff37182c336a8f9308634` passed four required checks, including [full CI 42363730593](https://github.com/michael-malis/complex-rhythm/actions/runs/42363730593) and independent [preset diversity report CI 42363730599](https://github.com/michael-malis/complex-rhythm/actions/runs/42363730599). The 22nd real CI measurement verifies the same 50-source complex-root event/velocity/instrument/provenance maps used by the 0.173s audio planner, one hit for coincident same-lane unions and separate cross-lane hits, and full documented/quantified mathematical density, instrument roles, and source-backed soft accents in every one of the 15 experimental studies. The source-generated original 50-preset diversity table, cyclic rotations, per-lane sources and distinct identities were independently checked on the updated code, not copied from old assumptions.

All six original atomic `T-PST-006-01…06` and parent `T-PST-006` are therefore technically VERIFIED. Original parent requirement R-PST-006 is accepted; **M10 operational macro now VERIFIED**. Historic project totals **410/652 VERIFIED**, **43 IN_PROGRESS**, **195 TODO**, **4 BLOCKED**, **0 FAILED** and **69/98 verified parent requirements**; operational macros **7 VERIFIED / 4 IN_PROGRESS / 1 TODO / 2 BLOCKED**.

No inference about subjective quality, physical headphones, genre authenticity, source screenshot parity or final user acceptance is made: M12/M13 remain BLOCKED and M14 remains TODO.


### 2026-11-07 — M05/R-TEX-002: Semantic inline mathematics in root-placement explanations

**Source-level mathematical defect:** The selected-lane root-placement caption previously displayed the variables and fractional laws `δ/n`, `2π/n` and `|z|` directly in plain text rather than the same accessible KaTeX and MathML used by the adjacent root equation. The expanded SVG-linked root-angle list also used unformatted `z = 0` in the zero-complex branch.

**Implementation:** Preserve the canonical complex-number/rhythm model, the mathematical event phases, the four rings and all 50 presets. Render each mathematical symbol in the root-placement explanation through the existing safe `renderTeX` helper as genuine inline semantic markup, leaving English connective prose as text nodes. The zero-complex label and undefined `\arg(0)` now use actual inline KaTeX/MathML. Add explicit inline wrapping CSS so semantic fractions remain readable without horizontal scroll or page clipping. The expanded root-angle SVG's zero state now produces the same real mathematical markup.

**Independent evidence:** Add `tests/math-inline-caption.mjs` and require its machine-readable `artifacts/math-semantic-caption/report.json` as **CI measurement #23**, covering twelve viewport/theme combinations, actual annotation+MathML+KaTeX, live n-degree edit (focus preserved), imported zero complex value and SVG-adjacent explanation, no raw symbolic fraction shortcuts or overflow. Existing source-matched formula acceptance, selected-root origin, responsive geometry, phase collision, root-event/audio scheduling and all previous 22 evidence files remain mandatory. R-TEX-002 and M05 statuses remain IN_PROGRESS until exact HEAD CI passes and the 15 original requirement rows can be reconciled separately.


### 2026-11-07 — R-TEX-002 contractual source acceptance after PR #40

[PR #40](https://github.com/michael-malis/complex-rhythm/pull/40), exact HEAD `d1dc0a161e89e1b8b74ca9d792218cd46ce031e1`, passed all required checks including [full UI/audio run 42378900168](https://github.com/michael-malis/complex-rhythm/actions/runs/42378900168). The production UI now uses semantic KaTeX+MathML for the contractual ten root/complex-number formula references, 16 dynamic root/timeline math locations, all three stacked quarter/half/three-quarter phase labels and the former plain-text `δ/n`, `2π/n`, `|z|`, `z=0`, `arg(0)` explanation gaps. Real responsive Chromium checks cover twelve viewport/theme states, dynamic degree changes with input focus and zero complex roots, all 23 independently read machine measurement files, no raw TeX/clipping and non-overlapping stacked equations.

The original R-TEX-002 parent and its 14 directly registered atomics are technically accepted: **425/652 VERIFIED**, **70/98 original parents VERIFIED**. This advances source-specific acceptance by **15 historical tasks and one parent** but does not close M05 (R-TEX-005 selected-root/chart placement, R-TEX-006 geometry) or M06 (R-TEX-008 audit). Missing second historical annotated screenshot M12, human audio/device review M13 and final signoff M14 remain open. Original source evidence is preserved.


### 2026-11-07 — M05/R-TEX-005: Exact complex-source provenance in the root-set formula

**Corrected mathematical display gap:** The live composition inspector had rendered the base root set as generic `R_n(z)` while printing explicit complex coordinates for each added root set. That omitted the actual selected source complex input and could make it harder to connect `a+bi` edits with the mathematical outcome. It now uses the same safe `complexLaTeX(track)` for the base as for every added set: e.g. `R_4(2+3i) \cup R_3(-1+0i) \cup E(5,16)`. The active set operator, current degree, additional layers, Euclidean set and separate `w_k` origin/phase remain canonical. This only changes the displayed formula; no event phase, sound, preset or four-ring layout logic changes.

**Evidence gate:** New independent `tests/composition-source-equation.mjs` imports real nontrivial complex inputs and tests the live KaTeX/MathML `#compositionEquation` at six required viewport sizes × two themes. It verifies that base and added root sets display their actual coordinates; that n edits, Cartesian changes, set intersection, and the zero complex base are reflected immediately; that `w_k` root and phase math retain fractional notation; that a zero base removes only the base roots while added/Euclidean sources remain independent; and that no text clipping or page-wide overflow occurs. Actual browser screenshot/JSON evidence saved under `artifacts/complex-source-equation/` and validated as required measurement #24. R-TEX-005 and M05 remain IN_PROGRESS until all graph-specific conditions and the full exact-head UI regression pass.


### 2026-11-07 — M05/M06: True coincident root phases as KaTeX; measured SVG and Canvas geometry

**Defect:** Source-specific complex roots and selected root phases already render with KaTeX/MathML, but the precise *coincident normalized phases* in the union inspector were shown only as a prose count and marker colors. This concealed the mathematical source of collisions and also failed to distinguish overlapping additional root families when no base root coincided.

**Implementation:** Add a compact, responsive, conditionally visible `#sharedPhaseFormula` beneath the existing root union summary. It renders the actual **canonical per-lane root-event source** phases with true KaTeX+MathML: `\\Phi_{\\mathrm{shared}}=\\{0,\\frac{1}{4}\\}` for a base fourth-root family with a third-root and a quarter-cycle singleton; it becomes `\\{\\frac18\\}` for an overlap between two additional singleton sources, and hides when no actual collisions remain. The source `events(track)` is unchanged. Fractions are reduced and only claimed where the actual phase is within a strict tolerance of that rational; otherwise a bounded decimal is shown. A dense overlap truncates the *display* after six roots with a mathematical ellipsis while preserving the exact count and all underlying original events. This is a math-display enhancement, not a new sequencer or sound engine.

**Independent SVG/Canvas contract:** `tests/math-graph-svg-alignment.mjs` uses real browser `SVG.getScreenCTM` to compare every **rendered SVG marker coordinate** to the *canonical actual root phase* and its projected Canvas angular counterpart. It checks 4 independently selectable lanes at 6 viewport sizes × 2 themes (48 lane geometry cases), SVG vector-only output, correct ray of the *original* complex argument, actual KaTeX/MathML root-angle list and graph fractions, zero-valued complex root family, degree 64 and live desktop-to-mobile resizing. It additionally verifies live union/intersection and two additional-source-only coincidences with mathematically displayed `1/8`. A real JSON report and twelve screenshots under `artifacts/math-graph-svg/` are mandatory **CI evidence report #25**, validated before artifact upload. Original R-TEX-005/R-TEX-006 and M05 stay IN_PROGRESS until exact PR-HEAD CI passes and source-wide signoff is separately reconciled. M06's historical before-comparison and M12/M13 manual blockers remain independently open.

**Additional consistency fix:** The result-strip `shared` marker now follows `events(track)` source multiplicity rather than the narrower base-plus-added condition. Two coinciding *added* root sets therefore show the same shared marker style and mathematical fraction, while preserving exactly one underlying per-lane audio hit. The mandatory browser test checks both the visible `#unionStrip .overlap` count and real source-backed KaTeX labels.


### 2026-11-07 — R-TEX-005, R-TEX-006 source acceptance; M05 technical completion

[PR #43](https://github.com/michael-malis/complex-rhythm/pull/43) exact HEAD `891e9316aeed3cce4e264110ba8c59b51dcd3d9f` passed four required checks, including [full CI 42393323480](https://github.com/michael-malis/complex-rhythm/actions/runs/42393323480) and **25 source-generated independent evidence files**. The actual SVG vector marker screen positions from `SVG.getScreenCTM()` agree with canonical complex root phases in the Canvas coordinate system for 48 tested lane/viewport/theme states. The source/math update checks include 64 roots, n=1, zero complex argument, live resize, precise selected-root origin, HTML/MathML fractions, human-readable angle lists, set union/intersection, multiple separately supplied root families and shared normalized phases 0, 1/4 and 1/8. The same event-source multiplicity now drives both a mathematically typeset shared-phase display and visually distinct shared-point markers. Existing 50-preset label-to-ring conflict checks, 10 mandatory formula references, 16 actual live math locations, and all old audio/transport safeguards passed at unchanged thresholds.

Original source requirements **R-TEX-005** (parent plus 9 atomics) and **R-TEX-006** (parent plus 6 atomics) are now technically VERIFIED, on their 17 already registered historical task IDs. All four original M05 requirements technically accepted, so **M05 VERIFIED**. The source counters are **442/652 tasks VERIFIED**, **72/98 parent requirements VERIFIED**; operational macros **8 VERIFIED / 3 IN_PROGRESS / 1 TODO / 2 BLOCKED**. No human visual source screenshot, real-device, screen-reader or release signoff is inferred: R-TEX-008/M06 is still IN_PROGRESS, M12/M13 remain BLOCKED and M14 TODO.


### 2026-11-07 — M06 historical code vs current mathematical rendering comparison

A reproducible first-party **real before** (Git commit `454b7c4466851e82946034ce4a47019c716ee218`) and **real after** (current PR HEAD) comparison is now mandatory in full UI regression. Each version is independently served by GitHub Actions, and 12 paired viewport/theme combinations produce 24 real full Chromium PNGs, source-matched 10 formula references, each version's MathML/DOM math locations, bounding rectangles, and an explicit record of added/changed math locations. The 26th mandatory measured report `artifacts/math-historical-compare/report.json` distinguishes source version history from the **still unavailable original second annotated user screenshot** (M12). The source R-TEX-008/M06 status remains IN_PROGRESS until this independent CI passes, the full historical formula audit is reviewed and a separate source-specific acceptance PR is merged.


### 2026-11-07 — Technical acceptance of original R-TEX-008 and M06

After [PR #46](https://github.com/michael-malis/complex-rhythm/pull/46) exact-head full [CI 42402890258](https://github.com/michael-malis/complex-rhythm/actions/runs/42402890258), the historical comparison now includes genuine first-party rendered-before browser screenshots from repository commit `454b7c4466851e82946034ce4a47019c716ee218` (not hypothetical contract notation), matched current-branch renderings, all 10 contractual reference formulas, actual old/current formula DOM/MathML, viewport dimensions, update pathways, 12 light/dark viewport pairs and 24 real PNG screenshots. These have been captured and independently checked in mandatory real report #26, with precise relative screenshot links and source provenance documented in this audit. The original source R-TEX-008 parent and all seven registered subtasks now technically VERIFIED. Earlier independently accepted R-TEX-007 proves synchronized live mathematical state, focus/caret, audio timing and edits. Therefore operational **M06 technically VERIFIED**. Original ledger **450/652 VERIFIED**, **39 IN_PROGRESS**, **159 TODO**, **4 BLOCKED**, parent **73/98 VERIFIED**, operational macros **9 VERIFIED / 2 IN_PROGRESS / 1 TODO / 2 BLOCKED**.

**Important scope boundary:** The reconstructed first-party Git baseline is not and is not described as the missing second *user-annotated* original design screenshot. M12 original annotation and visual approval and M13 human headphone/device/screen-reader verification remain BLOCKED. No manual acceptance has been performed or inferred; M14 release signoff remains TODO.
