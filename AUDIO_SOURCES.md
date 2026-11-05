# Audio provenance and usage

### Original electronic one-shots (15 paths, 14 distinct audio sources)

From [octalmusic/octal-samples](https://github.com/octalmusic/octal-samples), project `house-core`, licensed **CC0 1.0**; original [LICENSE](https://github.com/octalmusic/octal-samples/blob/main/LICENSE), [manifest](https://github.com/octalmusic/octal-samples/blob/main/manifest.json) and [per-file audit](https://github.com/octalmusic/octal-samples/blob/main/LICENSES.md). Preserved sample paths: `samples/kick-deep.wav`, `kick-hard.wav`, `kick-tight.wav`, `kick-sub.wav`, `kick-808.wav`, `snare-snap.wav`, `snare-body.wav`, `snare-808.wav`, `clap.wav`, `hat.wav`, `hat-crunch.wav`, `openhat.wav`, `rim.wav`, `tom.wav`, `shaker.wav`. In this application, `kick-808` and `snare-808` are only stylistic labels, not claims of original vintage hardware recordings.

### Newly added **acoustic** recordings (10 paths, all distinct sources)

From [sfzinstruments/virtuosity_drums](https://github.com/sfzinstruments/virtuosity_drums), performed by Austin McMahon at Virtuosity Musical Instruments (Versilian Studios / Karoryfer), licensed **CC0 1.0** — [LICENSE](https://github.com/sfzinstruments/virtuosity_drums/blob/master/LICENSE) and [publisher's description](https://versilian-studios.com/virtuosity-drums/).

| File in this project | Original source file under Virtuosity Drums |
|---|---|
| `samples/jazz-kick-soft.flac` | `Samples/mid/kick/mid_kick_snon_vl2_rr2.flac` |
| `samples/jazz-kick-full.flac` | `Samples/mid/kick/mid_kick_snon_vl3_rr1.flac` |
| `samples/jazz-rim.flac` | `Samples/mid/snare/mid_snare_crossstick_vl8.flac` |
| `samples/jazz-rim-bright.flac` | `Samples/mid/snare/mid_snare_crossstick_vl11.flac` |
| `samples/jazz-snare.flac` | `Samples/mid/snare/mid_snare_center_vl8.flac` |
| `samples/jazz-hat.flac` | `Samples/mid/hh/mid_hh_closed_vl2_rr1.flac` |
| `samples/jazz-shaker-a.wav` | `Samples/perc/mid/shaker/LShaker_Shake1D_rr1_Mid.wav` |
| `samples/jazz-shaker-b.wav` | `Samples/perc/mid/shaker/LShaker_Shake1D_rr2_Mid.wav` |
| `samples/jazz-claves.wav` | `Samples/perc/mid/claves/Claves1_Hit_v1_rr2_Mid.wav` |
| `samples/jazz-bongo.wav` | `Samples/perc/mid/bongoh/BongoH_Hit1_v1_rr2_Mid.wav` |

Browser decodes FLAC and WAV via `AudioContext.decodeAudioData`. A synthesized fallback is available if a format is unsupported or the audio path fails. Production-server compatibility should be verified on Safari and Android Chrome separately. The samples are unmodified, apart from independent playback gain, very small playback-rate variation, and cross-genre layering.

No commercially licensed or copyrighted song excerpts are distributed.

### Original Berlin bunker bass sample pair (new)

- `samples/berlin-rumble.wav`
- `samples/berlin-rumble-alt.wav`

Both files were generated specifically for this project from scratch using deterministic DSP: 46.25 Hz fundamental, 2nd/3rd harmonics, gentle saturation, low-pass/high-pass filtering, a short attack and controlled exponential tail. Mono 16-bit PCM, 44,100 Hz, approximately 0.56 s. **No external recording, music loop, or third-party sample was used** for these two files. The algorithm and local verification procedure are documented in the project update history.

