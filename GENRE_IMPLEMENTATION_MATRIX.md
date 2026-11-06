# Genre → preset → mathematical event / sound traceability

**Scope:** acceptance evidence for M09 using existing `RHYTHM_RESEARCH.md` (15 genre design hypotheses) and actual `PRESET_INVENTORY.json` (50 catalog entries). This matrix **does not claim genre authenticity, mastering or a live listening result**. It maps already researched ideas to implemented mathematical roots and synthesizer choices; a preset may be used as an educational approximation for more than one genre.

**Source of musical techniques:** [RHYTHM_RESEARCH.md](RHYTHM_RESEARCH.md), sections 1–2, with five primary URL links and supplemental scholarly/production references. **Source of actual values:** [PRESET_INVENTORY.json](PRESET_INVENTORY.json), audited by `tests/preset-diversity.mjs`. No new internet research is required for this mapping.

| Genre | Implemented preset | BPM | Four lane root degrees | Actual voice assignments | Planned sound / rhythmic distinction | Existing research reference |
|---|---|---:|---|---|---|---|
| Hard techno | `warehouse-hammer` | 146 | `4:2:4:4` | kick, clap, openhat, bass | hard 4-root anchor; supporting high-rate accents | Attack/Schranz techniques |
| Industrial techno | `industrial-fracture` | 155 | `5:7:11:9` | hardcoreKick, metallic, hat, reese | separated metal/percussion layers with degree-mismatched attacks | Attack Industrial Techno |
| Schranz | `schranz-machinery` | 158 | `7:9:11:13` | hardcoreKick, metallic, fmPerc, acidIndustrial | 7:9:11:13 independent rates, not a copied genre drum loop | Mixmag / SONAA Schranz |
| Hardcore techno | `rotterdam-collision` | 180 | `4:7:11:3` | gabberKick, metallic, noiseBurst, hoover | distorted gabber-style low-end and contrasting upper attacks | HARD CULTR synthesis reference |
| Gabber | `rotterdam-collision` | 180 | `4:7:11:3` | gabberKick, metallic, noiseBurst, hoover | pitch-swept distorted gabber kick plus metallic/noise layers | HARD CULTR synthesis reference |
| Hard acid techno | `acid-reactor` | 148 | `3:5:7:11` | technoKick, acidHard, metallic, hat | resonant acid voice and strong kick on independent root cycles | Roland TB-303 / Beyond Acid |
| Acidcore | `broken-reactor` | 172 | `5:11:7:13` | technoKick, snare, noiseBurst, acidScreaming | faster kick/noise with distorted resonant acid voice | Roland / MusicRadar |
| Frenchcore | `frenchcore-spiral` | 205 | `4:7:5:11` | frenchcoreKick, acidHard, metallic, hat | 205 BPM pitched-kick lane and offset acid notes | SONAA Frenchcore |
| Uptempo hardcore | `terror-geometry` | 220 | `4:7:9:13` | gabberKick, noiseBurst, acidScreaming, metallic | 220 BPM dense cross-lane attacks; educational approximation | HARD CULTR / SONAA |
| Terrorcore | `terror-geometry` | 220 | `4:7:9:13` | gabberKick, noiseBurst, acidScreaming, metallic | aggressive fast kicks and noise; not an authentic full track | HARD CULTR |
| Hardtek | `hardtek-mobius` | 178 | `5:7:9:4` | frenchcoreKick, raveStab, fmPerc, acidHard | 5:7:9:4 phase roles with pitched kick and synthetic stabs | SONAA / research synthesis |
| Freetekno | `hardtek-mobius` | 178 | `5:7:9:4` | frenchcoreKick, raveStab, fmPerc, acidHard | free-party rhythmic exploration; no claim of live FX-rack parity | research synthesis |
| Breakcore | `breakcore-prime-shards` | 190 | `7:5:11:3` | hardcoreKick, snare, noiseBurst, reese | 7:5:11:3 asymmetry; NOT sampled break slicing | Attack / Toussaint rhythmic geometry |
| Polyrhythmic techno | `minimal` | 124 | `5:7:8:1` | tom, rim, hat, kick | 5:7-root mathematical juxtaposition across independent lanes | Toussaint mathematical rhythm |
| IDM / algorithmic percussion | `complex-roots-overload` | 186 | `7:11:13:17` | hardcoreKick, fmPerc, hoover, metallic | multi-prime root event logic and FM/noise textures | Toussaint / Euclidean sources |

## Source → technique → implementation → preset/patch → verification

This table maps the five required technical articles to **existing** signal-processing and mathematical mechanisms. It records missing parity explicitly, rather than implying every historical recording technique is implemented.

| Source | Technique described by source | Actual implementation / limitation | Concrete preset and patch | Automated verification |
|---|---|---|---|---|
| [Roland: Mastering the TB-303 Sequencer](https://articles.roland.com/mastering-the-tb-303-sequencer-in-roland-cloud/) | Accent affecting timbre and level; slide across successive notes | `synthesis.js`: acid `accent` changes resonance-filter envelope via `depth`; event velocity controls amp. `slide` creates pitch motion **within a triggered voice**, not full legato gate continuity | `acid-reactor` using `acidHard` | `tests/audio-offline.mjs` parameter changes; `tests/audio-mix-stress.mjs` scheduler |
| [Roland: Beyond Acid](https://articles.roland.com/beyond-acid-pushing-the-tb-303-into-new-sonic-territory/) | Saw/square oscillator and resonant filter variations for percussive, bass and driven sound | `synthesis.js`: six acid voice definitions with different `osc`, `q`, `cutoff`, `depth`, `drive`, `decay` values | `acid-singularity` with `acidPsychedelic` and `acidDark` | `tests/audio-offline.mjs`, `tests/audio-voice-differentiation.mjs` (when present) |
| [Attack Magazine: Industrial Techno](https://www.attackmagazine.com/technique/beat-dissected/industrial-techno/) | 909-rooted kick, offbeat cymbals, metallic/noise transient layers and processing | `math-io.js` phase scheduler with independent root degrees; `synthesis.js` has `metallic` FM and `noiseBurst`; **not** a literal 909 sample machine/bitcrusher | `industrial-fracture` with `hardcoreKick`, `metallic` | `tests/required-polyrhythms.mjs`, `tests/audio-offline.mjs` |
| [Attack Magazine: Processing Berghain Kicks](https://www.attackmagazine.com/technique/tutorials/processing-berghain-kicks-with-multiband-distortion/) | Layered kick, filtered low rumble and selective multiband saturation | `synthesis.js` kick voices use pitch envelopes, sine sublayer and waveshaper. **No true independent multiband distortion rack or reverb-rumble chain** | `rotterdam-collision` with `gabberKick`, `berlin-bass-wall` with `berlinrumble` | `tests/audio-offline.mjs`, `tests/audio-mix-stress.mjs` |
| [MusicRadar: Producer's Guide to the TB-303](https://www.musicradar.com/news/producers-guide-to-the-roland-tb-303-and-clones) | Monophonic saw/square oscillator, resonant cutoff, pitch/slide/accents | `synthesis.js` acid voice envelope/filter/sweep, `app.js` independent 1–16-bar root cycles. **Mathematical scheduler is not the original TB-303 step sequencer** | `acid-reactor` with `acidHard`; `acid-303` sample-backed preset | `tests/audio-offline.mjs`, `tests/transport-switching.mjs`, `tests/cross-lane-coincidence.mjs` |

**Acceptance boundary:** these source descriptions and code/test links show technical lineage, not independently verified sound authenticity or full multiband/legato feature parity. Missing elements are limitations, not silently inferred features.

## Traceability/limitations

- Every linked preset is an existing catalog item with four independently parameterized complex-root lanes. Lane root degrees and instrument names are derived directly from the inventory, not invented examples.
- The degree tuple is **not** automatically the full event count: additional root families, Euclidean layers, set unions/intersections, phase offsets, accents and per-lane cycle lengths can change the actual hit map. Inspect `PRESET_INVENTORY.json` for full phase and velocity evidence.
- Research on TB-303 slide/accents does not establish exact continuous legato in the current Web Audio voices. Industrial multiband processing and break-sample slicing are also **not implemented as literal replicas**; see the caveats in `RHYTHM_RESEARCH.md`.
- Genre boundaries and BPM descriptions are exploratory, not universal definitions. Human comparison of all 50 examples remains BLOCKED under M13 and must not be silently accepted by this table.
- **Verification:** run `node scripts/verify-genre-mapping.mjs` to require 15 distinct genre rows, valid preset IDs, real root degrees, matching BPM and existing voice names. M09 is not complete until all three source research requirements are independently reconciled.
