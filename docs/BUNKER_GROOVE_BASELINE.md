# Bunker Techno — source baseline and root-based arrangement brief

**BUNK-01 input and verification.** This concise technical note supports the existing [TASKS.md](../TASKS.md) backlog; it is not another task list or evidence of human listening.

## Six original Bunker arrangements (before Driving/Hypnotic revision)

All six are canonical `PRESETS` in `app.js`, each with four independent instrument lanes. `P(a,b,n,sound)` defines an nth-root rhythm; `L(step,velocity)` is a degree-one complex root at a sixteenth-note phase, *not* a second sequencer. The original cycle is one bar in every row.

| ID | BPM | Four original degree/voice pairs | Original extra root(s) | Original events/bar |
|---|---:|---|---|---:|
| `berlin-bass-wall` | 146 | 4 kick, 4 berlinrumble, 8 hat, 2 rim | rim 15 @ .32 | 19 |
| `concrete` | 138 | 4 kick, 2 clap, 4 hat, 2 bass | bass 7 @ .45 | 13 |
| `shaft` | 143 | 4 kick, 2 snare, 8 hat, 2 tom | tom 13 @ .45 | 17 |
| `dust` | 134 | 4 kick, 2 rim, 4 openhat, 2 bass | bass 14 @ .55 | 13 |
| `iron` | 151 | 4 kick, 2 clap, 8 hat, 4 acid | extra kick 14 @ .58 | 19 |
| `pressure` | 140 | 4 kick, 2 snare, 4 hat, 1 bass | bass 10 @ .72 | 11 |

**Protected reference:** `Dust · Half-light` must retain its original source parameters, BPM 134, four voices and a single bass accent at step 14; no redesign or engine-wide revoicing.

## Actual engine capabilities

`app.js` already routes bunker kick to `samples/kick-hard.wav`, alternating sub-rumble to `samples/berlin-rumble*.wav`, hats to `samples/hat-crunch.wav` and rim to `samples/rim.wav`. The rumble has an existing parallel saturation/bandpass presence path. Per-lane gain, canonical audio/event source timing, audio-locked four orbit hands and the shared 27 Hz high-pass / master waveshaper are present. The first step does **not** require synth engine changes. `tests/bunker-driving-groove.mjs` verifies changed mathematical onset timing and renders those actual sample files through the real master output chain. Audio measurements cannot substitute for `AUDIO-01` human listening.

## Five existing IDs: different intended rhythmic identities

| ID | Intended character | Distinct source-level design |
|---|---|---|
| `berlin-bass-wall` | Driving / Hypnotic | One-bar R₄ kick vs two-bar R₈ rumble, R₁₆ hi-hats, R₄ rim, with low-velocity 16th-root pickups and controlled relative gains. |
| `concrete` | Raw Underground | Dry quarter kick, controlled backbeat/clap, short bass stabs and asymmetrical hats, without the two-bar rumble texture. |
| `pressure` | Acid Techno | Strict quarter kick, purposeful source-backed acid phrases using the current synth library, plus sub/bass discipline instead of one sustained note. |
| `shaft` | Industrial Techno | Quarter kick plus patterned metallic/FM or acoustic mechanical layers; avoid unrelated random noise. |
| `iron` | Hard Groove | Strict quarter kick with syncopated percussion and accent changes rather than a louder/faster copy of Bass Wall. |

Only `berlin-bass-wall` is implemented in the current step. The other four descriptions are design targets and remain TODO. Reference tracks guide *character*, not copied phrases or samples. No claims of music quality without real listening.
