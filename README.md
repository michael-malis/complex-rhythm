# ROOTS / RHYTHM

## Current mathematical workbench update — November 2026

The graph comes first on phones and tablets; on wide screens, all four editable lane cards are arranged 2×2 next to it. Each track has an independent 1–16-bar cycle; the least common multiple determines the full repeat period. The library contains 50 distinct event timelines, six acid timbres within fifteen new voices, a separate Euclidean generator and actual root-set union/intersection.

Technical acceptance has been reconciled against GitHub Actions: **200 of 651 tasks VERIFIED, 4 BLOCKED**, and **39 of 98 parent requirements** verified. See [LEDGER_EVIDENCE_SUMMARY.json](LEDGER_EVIDENCE_SUMMARY.json), [QA_REPORT.md](QA_REPORT.md) and [draft PR #1](https://github.com/michael-malis/complex-rhythm/pull/1). This is not a fully accepted or deployed release.


**Website:** https://michael-malis.github.io/complex-rhythm/

An interactive **mathematical visualization of rhythm**. Each of four instrument lanes uses the arguments of the `n`th roots of `z=a+bi` to place evenly spaced events on a circular timeline. Additional complex-root sets allow layered periodic patterns. Sound supports exploration of the geometry; this is not a DAW or general-purpose beat maker.

## V3 mathematical workbench — November 2026

The interface is a scientific workbench rather than a music sequencer.

- **Four editable lanes at once:** each instrument has its own `a`, `b`, `n`, sound selector, mute, and immediate event count. Selecting a lane is only needed for focused composition or preview.
- **Composition of root sets:** open *Compose root sets* to edit additional sets and compare the three aligned phase timelines **Base / Added / Union**. The result contains unique event phases; a coincident root triggers once.
- **Provenance is visible:** base roots are filled, additional-only events hollow, and shared phases doubly marked. The circular scene and the phase timeline use the same source semantics.
- **Mathematical distinctions:** a polyrhythm combines sets across instrument lanes; a composed pattern unions sets within one lane. Degree-one layers express individual accents. This does not claim that nth roots themselves produce arbitrary irregular rhythms.
- **Consistent presentation:** a single warm neutral stylesheet (`styles.css`), an optional graphite dark theme, and standalone vanilla JavaScript (`app.js`). No external UI framework or CSS overrides are required.
- **Keyboard/mouse:** numerical inputs are keyboard accessible; dragging a filled root rotates its base set; on the focused Canvas `Shift+Left/Right` turns visible roots by 5°. Other arrows select lanes.
- **Backwards compatibility:** `roots-rhythm/1` import/export, 35 original presets plus 15 new experiments (50 total), two-bar Bossa Nova, existing audio samples and Web Audio scheduling are retained.

The latest Chromium screenshots and regression run are in [GitHub Actions](https://github.com/michael-malis/complex-rhythm/actions). Listening to every sample on real physical devices and a full screen-reader audit remain separate manual validation tasks.

## Mathematical exploration controls (Nov 2026)

- Enter `z = a + bi` and choose root degree `n` for the selected instrument.
- Use the **arg(z)** slider to rotate event timing without changing `|z|` or `n`.
- Drag an original root point on its circle to rotate the corresponding evenly-spaced set; the argument of `z` changes by `n` times the dragged angular distance. Extra root layers remain untouched.
- On the focused Canvas, press `Shift + Left/Right` to rotate event points by 5°; ordinary arrows switch tracks.
- The application defaults to a **3:4 polyrhythm** to show simultaneous periodic structures. All 50 examples remain accessible, including five original polyrhythm studies.

**Automated QA:** V3 Playwright regression covers seven viewports, all 50 presets, independent lane edits, mathematical union, theme switching, JSON round-trip and Web Audio. See [current CI runs](https://github.com/michael-malis/complex-rhythm/actions). Workflow screenshots are available there. Real-device listening and manual visual review are still pending.

## Rhythm presets, acoustic audio and poly-rhythmic studies

- 50 patterns across 10 categories (35 originals and 15 new studies). **One Bossa Nova** example remains (Classic, 116 BPM). Three previous Bossa variations were replaced by **2:3, 3:5 and 4:7 polyrhythms**; alongside existing 3:4 and 5:7 examples, the **Polyrhythms** category contains five mathematically distinct ratio studies.
- Bossa loops span **two 4/4 bars**, not one. The cross-stick line is three hits in bar one (beat 1, & of 2, beat 4), then two in bar two (beat 2, & of 3). The feathered bass drum plays on 1, & of 2, 3, & of 4, against even shaker eighths.
- New **real, recorded acoustic drum/percussion samples**, from the CC0 Virtuosity Drums library: soft/full kick, cross-stick variations, shaker variations, jazz hi-hat/snare, claves, bongo.
- Faster drum-and-bass and jungle grooves also gain a quieter acoustic snare/kick body underneath the electronic transient when loaded.
- The audio engine waits briefly for the necessary samples on first play instead of immediately playing a harsh synthesized substitute. A fallback remains when sample loading fails. Per-hit playback-rate variation and gain staging reduce repetitive 'machine gun' sounds.
- 1-bar and 2-bar patterns can both be imported/exported; `bars` defaults to 1 for older JSON files.

## How to hear the **actual recorded** audio

Open GitHub Pages or serve the **entire repository**, including `samples/`. Opening `index.html` alone (file:// without samples) will use the simpler synthesized fallback.

In the web page: open **Explore examples** (already open on desktop), select **Brazilian rhythms** → **Bossa Nova · Classic** → **▶ Play**. The status line shows the number of decoded audio samples.

## Responsive English interface

All UI labels, descriptions, tooltips, validation errors and transport messages are in English (`lang="en"`). Layout, typography, spacing, controls and Canvas size scale with the viewport. On narrow screens, example selection is collapsed by default to give priority to the mathematical editor and circles. Tablet screens use a two-column workbench.

## Musical scope

The new two-bar clave is a recognizable bossa **drum accompaniment**, not a full João Gilberto recording: there is no guitar harmony or bass-note pitch line. Other presets remain original genre-inspired drum sketches, not exact transcriptions. The core remains a mathematical rhythm prototype.

## Rights

See [AUDIO_SOURCES.md](AUDIO_SOURCES.md) for the individual files, origins and licenses. The project includes audio from two CC0 sources. All source files remain attributed here even though CC0 attribution is not legally required.

## QA

See [AUDIO_QA.md](AUDIO_QA.md). Earlier desktop/mobile layout, basic transport and presets were tested in Chromium. **The November upgrade has passed Chromium, mathematical, 50-preset scheduling, Web Audio and contrast tests. Human listening, annotated-source matching and physical device review remain outstanding.** See [TASKS.md](TASKS.md) for outstanding checks.

## Berlin Bunker · Bass Wall (new)

The main **Bunker** category now starts with one definitive underground-Berlin-style heavy bass example: **BERLIN BUNKER · Bass Wall**, **146 BPM**. Rhythm: four-on-the-floor hard kick, dense offbeat 46 Hz sub-rumble, industrial closed hats, and occasional rim accents. Bass timing is generated by the **fourth roots of -1**, while the kick uses the **fourth roots of +1**; they interleave on the ring. The rumble is an original offline-rendered mono WAV pair with low harmonic saturation and a controlled fade; switching samples adds slight variation. It is not a reproduction of any specific commercial track.

The new `samples/berlin-rumble.wav` and `samples/berlin-rumble-alt.wav` are first-party, algorithmically synthesized audio; they are served locally from this repository, not hotlinked. For the intended thick bass sound, open the published site or serve the repository directory (opening only the HTML file uses a synth fallback).

