# ROOTS / RHYTHM

A playable mathematical instrument. Each of four lanes plays the `n`-th roots of a complex number `z = a + bi`: the roots' arguments are evenly spaced phases on a circle, and the circle is one loop of time. Four rings, four playheads, four sounds. Sound makes the mathematics audible; this is not a DAW or a general beat maker.

**Live site:** https://michael-malis.github.io/complex-rhythm/

| | |
|---|---|
| Engineering backlog and readiness | [TASKS.md](TASKS.md) |
| Checks only a person can do | [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md) |
| Invariants every change must keep | [PRODUCT_GUARANTEES.md](PRODUCT_GUARANTEES.md) |
| Interface design | [docs/UI_DESIGN_SYSTEM.md](docs/UI_DESIGN_SYSTEM.md) |
| CI runs and deployments | [GitHub Actions](https://github.com/michael-malis/complex-rhythm/actions) |

## One instrument, two depths

The page has one shell in both views: the circular plate with four rings on the left, a transport pill under it, the rhythm picker and the four lanes on the right. Nothing on the page collapses or expands.

**Play** (default) is the instrument. Press the round button, drag a point or a whole ring to rotate a lane, tap − / + to change how many evenly spaced hits it plays, step through the examples with ‹ ›.

**Lab** (top bar, or `#lab`) keeps the same figure and adds an inspector with five tabs:

| Tab | What it holds |
|---|---|
| **Lanes** | One table row per lane: sound, mute, volume, `θ` in radians and degrees, root degree `n`, loop length in bars, and `z` in three notations (`a + bi`, `r∠θ`, typed expression). Below the table: the root-placement rule `θ_k = (θ + 2πk)/n` for the selected lane with its unit-circle diagram and the list of all root arguments. |
| **Union** | The selected lane's root sets: Base / Added / Union phase strips, added points and added root sets, rotation of the base set, union or intersection, the Euclidean generator, and the formula of the selected root. Four chips switch the lane without leaving the tab. |
| **Time** | A four-bar window of the real schedule of all four lanes, with cross-lane coincidences and the common period (least common multiple of the loop lengths). |
| **Sound** | The waveform of one instrument and, for synthesized voices, its oscillator, filter and envelope. Never changes timing. |
| **Notes** | The reference formulas and how to read the figure, including the keyboard controls of the plot. |

Both views edit the same rhythm. Switching views or tabs never changes what is playing or what is exported.

## The model

- For nonzero `z`, the root phases are `(arg z + 2πk) / (2πn) mod 1`, `k = 0 … n−1`. Changing `arg z` rotates them; `|z|` does not affect timing; `z = 0` gives no base events.
- A lane can add further root sets. The result is their union (or intersection); coincident phases merge into one hit, and the louder velocity wins.
- Each lane loops over 1–16 bars independently. The whole pattern repeats after the least common multiple.
- The four ring radii separate instruments; they are not root moduli.
- One event plan (`RhythmMath.planEvents`) drives the Web Audio scheduler, the playheads, the timeline and the inspectors.

## Rhythms and sound

- 51 browsable examples in ten groups: 50 canonical presets plus one song study. The groups and their order live in `PRESET_GROUPS` in `app.js`. See [PRESET_INVENTORY.md](PRESET_INVENTORY.md).
- ✦ loads a random catalog rhythm, ⚄ rolls a new one, ± makes one small change, ↶ undoes the last ten rolls and mutations.
- Live keys use physical positions: `Space` play/pause, `Q W E R` mute lanes 1–4 (with `Shift`: solo), `T` or the BPM readout taps the tempo, `←` `→` step through rhythms, `F` opens the stage (Play only).
- Recorded samples are CC0 or first-party; see [AUDIO_SOURCES.md](AUDIO_SOURCES.md). No audio is downloaded until the visitor touches the page.
- Projects import and export as `roots-rhythm/1` JSON (top bar). Older files stay readable.

## Run and test locally

Serve the whole repository (samples included), then open the page:

```
python -m http.server 8767 --bind 127.0.0.1
```

Tests are plain Node scripts that drive Chromium through Playwright against that server:

```
npm install --no-save playwright@1.56.1 && npx playwright install chromium
node tests/math-io.test.mjs
node tests/play-surface.mjs
```

`.github/workflows/ui-regression.yml` lists every test in the order CI runs them. The full suite runs on each pull request and each push to `main`; GitHub Pages publishes only a `main` commit whose full run passed.

The inspector shows one tab at a time, so `tests/helpers/lab-tabs.mjs` opens the tab a control lives on before a test acts on it, and gives audits a way to visit every tab.

## What is not verified here

Automated tests measure geometry, timing, contrast, target sizes and rendered audio. They do not listen and do not hold a phone. Those checks are listed in [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md) and are kept out of the engineering readiness numbers.
