# Audio sources and license

ROOTS / RHYTHM includes 15 WAV sample entries (14 distinct audio files), sourced from the [octalmusic/octal-samples house-core kit](https://github.com/octalmusic/octal-samples). The upstream kit is dedicated to the public domain under **CC0 1.0 Universal**; see its [LICENSE](https://github.com/octalmusic/octal-samples/blob/main/LICENSE), [manifest.json](https://github.com/octalmusic/octal-samples/blob/main/manifest.json), and [per-file license audit](https://github.com/octalmusic/octal-samples/blob/main/LICENSES.md).

Original file paths and included destinations:

| Destination | Upstream house-core path |
| --- | --- |
| samples/kick-deep.wav | samples/kicks/deep-01.wav |
| samples/kick-hard.wav | samples/kicks/punch-04.wav |
| samples/kick-tight.wav | samples/kicks/tight-01.wav |
| samples/kick-sub.wav | samples/kicks/sub-01.wav |
| samples/kick-808.wav | samples/kicks/tight-03.wav |
| samples/snare-snap.wav | samples/snares/snap-01.wav |
| samples/snare-body.wav | samples/snares/body-01.wav |
| samples/snare-808.wav | samples/snares/snap-01.wav (shared audio) |
| samples/clap.wav | samples/claps/classic-01.wav |
| samples/hat.wav | samples/hats/closed-02.wav |
| samples/hat-crunch.wav | samples/hats/closed-07.wav |
| samples/openhat.wav | samples/hats/open-01.wav |
| samples/rim.wav | samples/percs/tick-02.wav |
| samples/tom.wav | samples/percs/tom-01.wav |
| samples/shaker.wav | samples/percs/shaker-02.wav |

The source file naming in this project is a convenience label, **not** a claim that a source WAV is an authentic historic TR-808 recording. In particular, the "kick-808" and "snare-808" labels are only stylistic mappings. All the downloaded kit WAVs are CC0; the locally generated synth voices (acid, reese, bass, Brazilian-inspired percussion) are not sourced from a recording.

Browser audio: WAV playback is decoded through Web Audio AudioBufferSourceNode. On `file://` or when sample loading fails, a synthesized fallback remains audible.
