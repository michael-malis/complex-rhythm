# Bunker — honest audio audition reference

This document helps **AUDIO-01** without claiming the human listening task is complete.

## Downloadable production-mix references

After a green [UI regression workflow](https://github.com/michael-malis/complex-rhythm/actions/workflows/ui-regression.yml), download its **`bunker-audition-wavs`** artifact. It contains six 4-bar, unnormalized, 32 kHz / 16-bit mono WAVs and `report.json` with source-event counts, RMS, 160 Hz low-band RMS, output peak, presence of quarter-note attacks and source checksums.

| File | Preset | Character | BPM |
|---|---|---|---:|
| `berlin-bass-wall.wav` | Bass Wall | Driving / Hypnotic | 146 |
| `concrete.wav` | Concrete | Raw Underground | 138 |
| `pressure.wav` | Pressure | Acid Techno | 140 |
| `shaft.wav` | Shaft | Industrial | 143 |
| `iron.wav` | Iron | Hard Groove | 151 |
| `dust.wav` | Dust · Half-light | Protected control | 134 |

All exports originate from current preset complex-root timing, decoded production WAV samples, native synth voices, the existing bass/reese fallback and the shared master limiter. Recorded samples are **not** newly sourced or redistributable beyond existing licenses. The audition mix includes the active Berlin rumble presence path and the current master gain; there is **no loudness normalization** between presets. Four bars let listeners compare two-bar variations.

## Human acceptance remains independent

A human reviewer should play the six audio files on headphones and at modest level on speakers, then listen to representative non-Bunker patterns on the *live site*, checking:

- Is every quarter kick clear, without being obscured by sub-rumble, FM or acid?
- Does each of the five revised styles sound distinct and musically intentional, without generic EDM drift?
- Does any pattern click, distort, mask its low end, lose a ghost hit or sound unnaturally thin?
- Is Dust unchanged in sound, not merely unchanged in source parameters?
- Are there differences between WAV references and actual live playback, including mobile audio unlock and sample loading?

Record listening date, browser/device, output equipment, preset, specific audible issue, linked issue/PR and successful retest. **Do not mark AUDIO-01 DONE** until the actual human audition has taken place. Numeric sound metrics or model-generated descriptions do not replace it.

## Release boundary

Physical touch, mobile-browser and screen-reader behavior are still **ACCESS-01**, and independent release approval is **RELEASE-01**. Generated WAVs, browser CI, published Pages and code-level claims cannot silently close either task.
