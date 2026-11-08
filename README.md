# ROOTS / RHYTHM

**Current source acceptance (8 November 2026):** [PR #51](https://github.com/michael-malis/complex-rhythm/pull/51) and [full browser/audio CI 42419790982](https://github.com/michael-malis/complex-rhythm/actions/runs/42419790982) independently measure SVG marker CSS-pixel diameters across 48 lane/viewport/theme states alongside real CSS font/color/contrast, bounding-box, touch, overlap and clipping reports. Original R-QA-002 is now technically accepted in the task ledger: **459/652 tasks VERIFIED**, **74/98 parent requirements VERIFIED**. Operational status stays **9/14 VERIFIED**, M01/M11 IN_PROGRESS, M12/M13 BLOCKED, M14 TODO. GitHub Pages publishing now follows successful main regression; manual audio/device/annotation approval is not implied.


## Current mathematical workbench update — November 2026

The graph comes first on phones and tablets; on wide screens, all four editable lane cards are arranged 2×2 next to it. Each track has an independent 1–16-bar cycle; the least common multiple determines the full repeat period. The public preset browser contains 51 examples: 50 original/experimental mathematical rhythms plus one user-supplied Song Examples study. These remain mathematical root-event models with a separate Euclidean generator, real root-set union/intersection and distinct instrument voices.

**Earlier M06 checkpoint:** [PR #46](https://github.com/michael-malis/complex-rhythm/pull/46) merged reproducible side-by-side *real historical Git release* mathematical screenshot evidence against the current app. [Full CI 42402890258](https://github.com/michael-malis/complex-rhythm/actions/runs/42402890258) passed 12 responsive light/dark before/after cases and 24 real Chromium PNG screenshots, validating all 10 contractual formulas and 26 mandatory independent reports. Original R-TEX-008 technically accepted: **450/652 historical tasks VERIFIED** and **73/98 requirements VERIFIED**; **M06 mathematically audited and technically complete**. The missing second original user-annotated screenshot is still a separate M12 BLOCKER. Deployed main and final status tracked in [Actions](https://github.com/michael-malis/complex-rhythm/actions).

Technical acceptance against reproducible browser/math/audio evidence: **459/652 historical tasks VERIFIED**, **38 IN_PROGRESS**, **151 TODO**, **4 BLOCKED**, **0 FAILED**, **74/98 original parent requirements**. Nine of 14 operational macros technically complete, including M05 and M06. Remaining engineering macros M01/M11 and manual M12/M13 plus final release M14 have not been signed off. The historical code baseline is not the unavailable second annotated original or screen-reader/real-device approval. See [NEXT_EXECUTION_PLAN.md](NEXT_EXECUTION_PLAN.md) and [LEDGER_EVIDENCE_SUMMARY.json](LEDGER_EVIDENCE_SUMMARY.json).


**Website:** https://michael-malis.github.io/complex-rhythm/

An interactive **mathematical visualization of rhythm**. Each of four instrument lanes uses the arguments of the `n`th roots of `z=a+bi` to place evenly spaced events on a circular timeline. Additional complex-root sets allow layered periodic patterns. Sound supports exploration of the geometry; this is not a DAW or general-purpose beat maker.

**Four-ring readability:** Every orbit keeps its own instrument color even when another lane is selected. The active ring has a stronger outline and color-matched event count. Keyboard and screen-reader users receive the selected lane, instrument, event count, loop length and mute state directly from the Canvas label, updated on edits. This does not add a beat-maker panel or alter event timing.

**Linked mathematical inspection:** Open **Combine root points** and click or tap anywhere on the 48px result phase strip to inspect the nearest actual resulting event (Union or Intersection). The same phase is outlined in Base, Added, and Result wherever it exists, and highlighted on the matching colored orbit; excluded roots never become selectable result hits. Focus the result strip for Left/Right, Home/End, Enter/Space, and Escape navigation. On the focused Canvas, number keys **1–4** jump directly to the corresponding orbit without altering its root set, voice, or playback. This is inspection only; no steps or notes are added.

**Cross-lane time:** Select a mathematical root to see its first occurrence in seconds at the current BPM. Roots on other lanes are simultaneously highlighted **only when they hit at that same absolute bar time**, respecting their independent 1–16-bar cycle lengths. Muted lanes are still mathematical matches but are clearly labelled muted. Tempo, lane degree, cycle length and mute updates refresh the explanation live. The halos are static selection aids, not an audio playback pointer. Four separately synchronized playheads and canonical event scheduling remain unchanged.

**Linked circular and linear time:** Selecting a root on a circle (or in the root-set strips) highlights every corresponding scheduled occurrence on that lane in the expanded four-bar timeline. Selecting a timestamp on the timeline opens the matching mathematical root angle and source on its circle. Matching uses canonical lane and root phase, so polyrhythms with 1–16-bar independent cycles are never confused merely because positions overlap on screen. Muted lanes show mathematical roots without inventing audible timeline attacks.

## Mathematical workbench and current interaction model

The interface is a scientific workbench rather than a music sequencer.

- **Four editable lanes at once:** each instrument has its own `a`, `b`, `n`, sound selector, mute, and immediate event count. Selecting a lane is only needed for focused composition or preview.
- **Composition of root sets:** open *Compose root sets* to edit additional sets and compare the three aligned phase timelines **Base / Added / Union**. The result contains unique event phases; a coincident root triggers once.
- **Provenance is visible:** base roots are filled, additional-only events hollow, and shared phases doubly marked. The circular scene and the phase timeline use the same source semantics.
- **Mathematical distinctions:** a polyrhythm combines sets across instrument lanes; a composed pattern unions sets within one lane. Degree-one layers express individual accents. This does not claim that nth roots themselves produce arbitrary irregular rhythms.
- **Consistent presentation:** a single warm neutral stylesheet (`styles.css`), an optional graphite dark theme, and standalone vanilla JavaScript (`app.js`). No external UI framework or CSS overrides are required.
- **Keyboard/mouse:** numerical inputs are keyboard accessible; dragging a filled root rotates its base set; on the focused Canvas `Shift+Left/Right` turns visible roots by 5°. Other arrows select lanes.
- **Backwards compatibility:** `roots-rhythm/1` import/export, all 50 historical core examples (35 originals and 15 experimental studies), the additional `Prodigy · Boom Boom Tap (Rhythm Study)` in **Song Examples**, two-bar Bossa Nova, existing audio samples and Web Audio scheduling are retained.

The latest Chromium screenshots and regression run are in [GitHub Actions](https://github.com/michael-malis/complex-rhythm/actions). Listening to every sample on real physical devices and a full screen-reader audit remain separate manual validation tasks.

## Mathematical exploration controls (Nov 2026)

- Enter `z = a + bi` and choose root degree `n` for the selected instrument.
- Use the **arg(z)** slider to rotate event timing without changing `|z|` or `n`.
- Drag an original root point on its circle to rotate the corresponding evenly-spaced set; the argument of `z` changes by `n` times the dragged angular distance. Extra root layers remain untouched.
- On the focused Canvas, press `Shift + Left/Right` to rotate event points by 5°; ordinary arrows switch tracks.
- The application defaults to a **3:4 polyrhythm** to show simultaneous periodic structures. All 51 browsable examples remain accessible, including five original polyrhythm studies.

**Automated QA:** Playwright regression covers seven viewports, the 50 core presets and the separately supplied Song Examples study, independent lane edits, mathematical union, theme switching, JSON round-trip and Web Audio. See [current CI runs](https://github.com/michael-malis/complex-rhythm/actions). Workflow screenshots are available there. Real-device listening and manual visual review are still pending.

## Rhythm presets, acoustic audio and poly-rhythmic studies

- 50 canonical core patterns across 10 source-genre categories (35 originals and 15 new studies), plus one separate Song Examples study. The browser has one **Category** selector (12 user-facing choices, including Featured Grooves and Song Examples) and one **Preset** selector. **One Bossa Nova** example remains (Classic, 116 BPM). Three previous Bossa variations were replaced by **2:3, 3:5 and 4:7 polyrhythms**; alongside existing 3:4 and 5:7 examples, the **Polyrhythms** category contains five mathematically distinct ratio studies.
- Bossa loops span **two 4/4 bars**, not one. The cross-stick line is three hits in bar one (beat 1, & of 2, beat 4), then two in bar two (beat 2, & of 3). The feathered bass drum plays on 1, & of 2, 3, & of 4, against even shaker eighths.
- New **real, recorded acoustic drum/percussion samples**, from the CC0 Virtuosity Drums library: soft/full kick, cross-stick variations, shaker variations, jazz hi-hat/snare, claves, bongo.
- Faster drum-and-bass and jungle grooves also gain a quieter acoustic snare/kick body underneath the electronic transient when loaded.
- The audio engine waits briefly for the necessary samples on first play instead of immediately playing a harsh synthesized substitute. A fallback remains when sample loading fails. Per-hit playback-rate variation and gain staging reduce repetitive 'machine gun' sounds.
- 1-bar and 2-bar patterns can both be imported/exported; `bars` defaults to 1 for older JSON files.

## How to hear the **actual recorded** audio

Open GitHub Pages or serve the **entire repository**, including `samples/`. Opening `index.html` alone (file:// without samples) will use the simpler synthesized fallback.

In the web page: open **Rhythm examples**, select **Category: Brazilian & Acoustic** → **Preset: Bossa Nova · Classic** → **▶ Play**. The status line shows the number of decoded audio samples.

## Responsive English interface

All UI labels, descriptions, tooltips, validation errors and transport messages are in English (`lang="en"`). Layout, typography, spacing, controls and Canvas size scale with the viewport. The **Rhythm examples** disclosure starts expanded on desktop and mobile and can be collapsed at any time; changing Category does not silently load another preset or restart audio. Tablet screens use a two-column workbench.

## Optional Sound Lab (advanced audio)

The bottom **Sound Lab · waveform and instrument shaping** disclosure remains **closed by default**, keeping complex-root visualization primary. Open it once, choose any of the four instrument lanes independently of the mathematically selected root ring, and inspect a static waveform. Synthesizers render from the same offline Web Audio engine as real sound and expose oscillator, filter, saturation, resonance, decay and related controls, with a per-lane Reset action. Locally recorded sample-backed voices show a read-only decoded waveform instead. Reese and Sub bass reuse their actual live synthesis graph for offline inspection. When the engine has no available source waveform, the UI says so instead of inventing one. The waveform is a normalized single hit before master output, not a beat timeline or full DAW.

## Four synchronized orbital playheads (AudioContext-timed)

**Each instrument gets its own small colored arrow moving clockwise along its complex-root circle.** There is no longer a single radial line from the center or a pointer restricted to the selected lane. A hand completes one full revolution over that lane's loop length: a one-bar lane rotates once per bar, a two-bar lane at half that rate and a four-bar lane at a quarter of that rate. Equal loop lengths stay aligned at all times, regardless of different root degrees.

**An audible root event occurs precisely when that lane's arrow tip reaches the fixed root marker**. Both drawing and Web Audio event planning use the same `beatEpoch`, 4/4 `barSeconds` and per-instrument `cycleBars`. The former reduced-motion rounding to a 16th-turn is removed: it used to cause visibly incorrect pointer angles, particularly with long loops. Reduced-motion still removes oversized animated beat pulses, but the positional clock remains exact. Each arrow is short and tangent to its corresponding ring rather than running from the center through unrelated roots.

The existing 1–16 bar editor, JSON schema and `RhythmMath.planEvents` scheduling remain unchanged. New browser tests instrument actual Canvas strokes and compare root hit times, 1/1/2/4-bar speeds, real play/pause/BPM/reset transitions and live root edits. These are automated synchronization measurements, not subjective listening acceptance.

## Instrument colors and focused wheel editing

Every one of the four lanes keeps a distinct mathematical root color, and that same color identifies its **Instrument volume** slider and corresponding **Combine root points** controls. The **Master volume** slider has a separate blue accent and never overwrites per-lane gains. On desktop, all four cards use a tighter two-column layout without reducing interactive controls below 44 CSS pixels.

Click or keyboard-focus a numeric/spinner/angle or volume control before scrolling: the mouse wheel adjusts **that control only**, leaving ordinary page scrolling untouched elsewhere. Degree and symbolic-radian fields use the same 1-degree angular step (`π/180 radians`), while gains use one-percentage-point steps. Changing root degree while music is playing updates the actual upcoming sound schedule without starting a second audio scheduler.

## Preset navigation and instrument quality

- **Exactly two preset selectors:** `Category` and `Preset`. Featured Grooves is a curated shortcut rather than another source collection. The additional root-degree ratio studies are named inside their respective presets, not placed behind a third dropdown.
- **Four distinct original Acid presets:** Acid 303 Classic, Resonance Twister, Liquid Acid Dub and 303 Pressure Peak use different synthesis programs, lead root degrees and accents. The separate acid voices are mechanically validated, while subjective listening remains a manual requirement.
- **Per-instrument volume:** each of the four visible lane cards carries its own volume slider. Master output remains global and separate.

## Musical scope

The new two-bar clave is a recognizable bossa **drum accompaniment**, not a full João Gilberto recording: there is no guitar harmony or bass-note pitch line. Other presets remain original genre-inspired drum sketches, not exact transcriptions. The core remains a mathematical rhythm prototype.

## Rights

See [AUDIO_SOURCES.md](AUDIO_SOURCES.md) for the individual files, origins and licenses. The project includes audio from two CC0 sources. All source files remain attributed here even though CC0 attribution is not legally required.

## QA

See [AUDIO_QA.md](AUDIO_QA.md). Earlier desktop/mobile layout, basic transport and presets were tested in Chromium. **The November upgrade has passed Chromium, mathematical, 50-preset scheduling, Web Audio and contrast tests. Human listening, annotated-source matching and physical device review remain outstanding.** See [TASKS.md](TASKS.md) for outstanding checks.

## Berlin Bunker · Bass Wall (new)

The main **Bunker** category now starts with one definitive underground-Berlin-style heavy bass example: **BERLIN BUNKER · Bass Wall**, **146 BPM**. Rhythm: four-on-the-floor hard kick, dense offbeat 46 Hz sub-rumble, industrial closed hats, and occasional rim accents. Bass timing is generated by the **fourth roots of -1**, while the kick uses the **fourth roots of +1**; they interleave on the ring. The rumble is an original offline-rendered mono WAV pair with low harmonic saturation and a controlled fade; switching samples adds slight variation. It is not a reproduction of any specific commercial track.

The new `samples/berlin-rumble.wav` and `samples/berlin-rumble-alt.wav` are first-party, algorithmically synthesized audio; they are served locally from this repository, not hotlinked. For the intended thick bass sound, open the published site or serve the repository directory (opening only the HTML file uses a synth fallback).

