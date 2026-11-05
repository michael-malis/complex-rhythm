# Rhythm and synthesis research — Roots / Rhythm

**Date:** 5 November 2026  
**Purpose:** provide source-grounded production references for mathematical rhythm examples and specific audio-engine choices. This is **not** a claim that a four-lane complex-root visualizer reproduces full commercial tracks, arrangement, groove, mastering, or historically authentic genres. Report status: **research documented; human listening acceptance pending**.

## Independent source re-verification (2026-11-05)

All five mandatory article URLs were fetched and their text checked in a fresh external review on 5 November 2026. Findings were compared with the existing implementation, rather than treating all genre BPM values as settled facts:

- **Roland, Mastering the TB-303 Sequencer (3 Mar 2025):** explicitly states accents raise both volume and filter cutoff; slides and accents are sequenced separately. Our `accent` and `slide` parameters are real audible controls, but the synthesizer uses triggered voices and does not claim exact legato gate behavior.
- **Roland, Beyond Acid (3 Mar 2025):** identifies saw/square configurations, resonant sweeps and different roles from lead synth to percussion/sub-bass. This supports *different signal architectures*, not merely six volume presets.
- **Attack Magazine, Industrial Techno:** its 126–130 BPM / 50–60% swing is a **single programmed example**. It documents analog 909 hits, processed hats, distorted toms and volume ducking on collisions. These are genre *reference techniques*, not mandatory BPM limits.
- **Attack Magazine, Processing Berghain Kicks:** explains multiband separation/distortion, layered kick + rumble/reverb. Our single-band waveshaping does not represent an implementation of its multiband rack; that limitation remains explicit.
- **MusicRadar, Producer's Guide to the Roland TB-303 (3 Mar 2024):** describes the single-oscillator engine, resonant filter and separate note/slide sequencing; this supports the original 303 design reference without representing our mathematical root scheduler as a cloned TB-303.

**Evidence:** source title, date and method are inspectable at the five URLs in the source table below. Where a technical feature differs (true legato and multiband distortion), the gap is recorded rather than silently claiming parity.

## 1. Required source audit

| Required URL | Availability checked | Technical finding and application |
|---|---|---|
| [Roland — Mastering the TB-303 Sequencer](https://articles.roland.com/mastering-the-tb-303-sequencer-in-roland-cloud/) | Publicly accessible | Accent modifies loudness and filter cutoff together; slide ties successive notes, not merely unrelated pitch glide. Used to separate acid `accent`, `cutoff/depth` and `slide` parameters. Our short synthesized voices approximate characteristics rather than modelling the original full legato sequencer. |
| [Roland — Beyond Acid](https://articles.roland.com/beyond-acid-pushing-the-tb-303-into-new-sonic-territory/) | Publicly accessible | Saw/square choices, resonance, percussion-length envelopes, resonant sweeps and sub-bass applications justify six audibly differentiated acid patches. |
| [Attack Magazine — Industrial Techno](https://www.attackmagazine.com/technique/beat-dissected/industrial-techno/) | Publicly accessible | The specific tutorial describes 126–130 BPM, 50–60% swing, 909 kick, offbeat hats, distorted toms, crushed samples and noise snare. **Important:** this is a single example, not evidence that all industrial techno must use this BPM. |
| [Attack Magazine — Processing Berghain Kicks with Multiband Distortion](https://www.attackmagazine.com/technique/tutorials/processing-berghain-kicks-with-multiband-distortion/) | Publicly accessible | Layered sub/top kicks, selective multiband distortion, filtered rumble and short transient-versus-tail decisions. Our lightweight synthesis uses filter, waveshaper and distinct kick voices, but does **not** claim to implement true three-band distortion. |
| [MusicRadar — Producer's Guide to the TB-303](https://www.musicradar.com/news/producers-guide-to-the-roland-tb-303-and-clones) | Publicly accessible | Single saw/square oscillator, resonant filter and distinct pitch/time/slide/accents. Describes a 12-step pattern against 4/4 as an acid technique; this motivates independent lane cycles, but a TB-303 sequencer remains different from complex roots. |

**Supplemental, independently authored references**: [Mixmag on Schranz (4 Mar 2026)](https://mixmag.net/feature/10-essential-schranz-tracks-selected-by-nikolina), [SONAA Schranz production study](https://sonaa.ca/en/styles/techno/schranz/), [SONAA Frenchcore](https://sonaa.ca/en/styles/hardcore/frenchcore/), [HARD CULTR 2026 hardcore/uptempo/frenchcore overview](https://www.hardcultr.com/guides/hardcore-vs-uptempo-vs-frenchcore-2026-genre-guide/), [Godfried Toussaint, *The Geometry of Musical Rhythm* research (AAWM, 2013)](https://journal.iftawm.org/wp-content/uploads/2022/02/Toussaint_AAWM_Vol_2_2.pdf), and [Attack Magazine's Beat Dissected archive](https://www.attackmagazine.com/technique/beat-dissected/).

**Source-quality warning:** Secondary genre websites disagree about the typical BPM interval for Frenchcore and Uptempo, and individual tracks span multiple styles. All BPM ranges in the following table are *practical exploration windows*, not statistically estimated genre limits. Where source material does not provide a rigorous range, the design interval is an implementation hypothesis.

## 2. Genre-by-genre production and mathematical implications

| Genre | Suggested BPM exploration | Rhythm / accent organization | Drum and bass roles | Synthesis + processing reference | Mathematical model and concrete project mapping |
|---|---:|---|---|---|---|
| Hard techno | 140–165 | Four-beat kick anchor, displaced offbeat percussion; occasional rolling subdivisions | Dense low kick, quieter bass-rumble or stab | Hard sine/triangle kick, short pitch-envelope fall, saturation, HP-filter on sub bus | Root degree 4 for kick; layers of 7 or 11 for moving accents. `technoKick`, `hardcoreKick`; `schranz-machinery` for an experimental harder edge. |
| Industrial techno | 126–155 | Firm kick and offbeat closed hats; metallic syncopation, reduced accent velocity on collisions | 909-like kick, crushed metallic tom, hollow noise snare, rumble in background | Source: Attack industrial beat uses 126–130; bitcrush, overdrive and filter layers. We use `metallic`, `noiseBurst` with gain control, not a literal bitcrusher | Union of degree 4 and shifted degree 7/9 roots; `industrial-fracture` and `broken-reactor`. |
| Schranz | 140–170 | Relentless loop with shifted percussive layers; dynamics from filter rather than random note placement | Low rolling kick and harsh percussive top; little independent bass | Mixmag notes 140–150 in historic selection; SONAA suggests 150–170. Short decays, saturation, tight noise/metal effects | `schranz-machinery` uses 7:9:11:13; **explicitly an abstract study**, not a conventional Schranz drum transcript. |
| Hardcore techno | 150–190 | Stressed downbeats, fast rolls and occasional half-time contrast | Heavy distorted kick; supporting hoover/rave stab | Multi-stage pitch drop and distortion; dynamic master protection | `hardcoreKick`, `raveStab`; `rotterdam-collision`. Degree 4 foundation, other roots offset. |
| Gabber | 160–200 | Strong kick-on-beat, very short upper pulses, sporadic rave accents | Distorted pitch-swept kick as bass, hoover/stab behind | `gabberKick` uses brighter saw, pitch fall and stronger drive, rather than recycled acoustic sample | `rotterdam-collision` and `prime-number-riot`; cap gain when high-rate percussion joins. |
| Hard acid techno | 135–170 | Repeated resonant notes, occasional offbeat accents and sweeps | Relentless kick plus resonant acid bass sequence | Roland/MusicRadar: waveform, high-resonance moving filter, accent coupled with filter, slide tied to adjacent notes | `acidHard`, `acidIndustrial` and `acid-reactor`. Root timing defines attacks; 303-like slide is approximated and not a claim of exact legato recreation. |
| Acidcore | 150–190 | Acid phrases in faster pounding meter; clustered high-frequency accents | Thick kick and driven resonant saw/square bass | Stronger waveshaping, moving lowpass resonance, short envelopes; beware high Q and ear fatigue | `acidScreaming`, `acidHard`, `broken-reactor`; degree 5/7/11 relationships, offset phases. |
| Frenchcore | 190–220 | Bouncy pitched-kick pulse with sparse melodic/acid answering voice | Kicks carry pitch contour; percussive top less congested | `frenchcoreKick` pitch movement, slightly longer decay and controlled low end; SONAA offers a 190–210 reference | `frenchcore-spiral`, 4:7:5:11; kick regular, auxiliary patterns offset. |
| Uptempo hardcore | 180–240 | Rapid regular kick, reduced tail to avoid consecutive transient masking; extra high accents | Tighter short kick and nasal metallic top | HARD CULTR suggests roughly 180–220, SONAA broader 190–230. Model fast attacks and capped velocity | `terror-geometry` can be auditioned at 220; composite density/peak checks mandatory. |
| Terrorcore | 215–260+ | Very dense attacks; reduce simultaneous full-band notes and preserve transients | Aggressive clipped kick, narrow noise/stab upper parts | Strong distortion and waveshaping **inside voice**, but final limiter and HP filtering are required | `terror-geometry`; high degree alone does not make authentic terrorcore; test extra load and avoid falsely asserting full genre replication. |
| Hardtek | 165–190 | Bouncy kick/bass call-and-response, syncopated synthetic motifs | Pitched kick and short stab/acid bass | `frenchcoreKick`, `raveStab`, `acidHard`, short pitch bends | `hardtek-mobius` builds 5:7:9:4 periodic roles with phase offsets. |
| Freetekno | 145–200 | Long repeated machine groove, displaced free-party percussion and elastic sub | Heavy four-beat kick with small percussive variations | Distorted low kick, resonant synth and rhythmic echoes; our engine has no comprehensive live effects rack | Exploratory independent lane lengths 3 vs 4 bars, plus degree 4/7 root textures; use cycle controls. |
| Breakcore | 160–230 | Asymmetric chopped breaks, rapidly changing percussive placement and dropouts | Kick/snare contrasts, clipped break material, reese sub support | Fast envelope/noise shaping; **our root-pattern tool cannot replace detailed break slicing** | `breakcore-prime-shards`: 7:5:11:3 is an abstract rhythmic study, not a sampled breakcore performance. |
| Polyrhythmic techno | 120–175 | Multiple stable rates on independent lanes; deliberate phase collision/difference | One periodic kick, separate moving clicks and less dense bass | Keep sources clearly timbrally separated; low gain on high-degree roles | `poly-3-4` / `poly-5-7` and custom 3:4, 5:7 root degrees. Independent 3- and 4-bar cycles have 12-bar common repetition. |
| IDM / algorithmic percussion | Wide; e.g. 100–190 | Rule-based irregular composites, sparse attacks and texture/microtiming | FM percussion, glitch noise, nonstandard low-end placement | `fmPerc`, `noiseBurst`, short oscillator bursts; avoid confusing stochastic timing with mathematical geometry | `complex-roots-overload`, `eleven-against-seven` and explicit Euclidean `E(k,N)` plus set intersection/union. |

### Why these implementation choices follow from the sources

1. A fundamental `n`th-root set is **uniform by construction**. Additional root sets, independent track periods, and separately labeled Euclidean grids create meaningful *compositions* rather than pretending a root set alone can specify arbitrary steps.
2. Instruments must be distinguishable by actual synthesis: `technoKick`, `gabberKick`, `frenchcoreKick`, `hoover`, `raveStab`, metallic FM, noise and six nonidentical acid patches use differing oscillators, envelopes, filters and drives. Sound inspection uses offline Web Audio files plus spectral/RMS/attack measurements; listening still requires a person.
3. Acid controls implement cutoff, Q, amplitude/filter accent, decay, pitch-slide parameter and drive. They are **short triggered voices**, not an exact analogue recreation of continuous TB-303 legato slide states; do not imply otherwise.
4. High-density prime-root degrees need lower per-instrument gain. Presets explicitly carry lane `gain` and optional mathematical `euclidean` data.
5. The global visual/audio phase must be derived from the Web Audio clock, and each lane has independent cycle length. The common period is `LCM(lengths)`, not an arbitrary step grid.
6. Sound processing documented above is educational synthesis engineering, not proof of genre authenticity.

## 3. Research-to-implementation traceability

| Evidence / decision | Implementation location | Verification |
|---|---|---|
| Saw/square, filter, slide and accented cutoff | `synthesis.js`: six `acid*` definitions and live controls | `tests/audio-offline.mjs`; manual listening **pending** |
| Harder, differently pitched kick categories | `synthesis.js`: `technoKick`, `hardcoreKick`, `gabberKick`, `frenchcoreKick` | Offline attack/peak and waveform comparisons |
| Density-preserving voice mixture | `app.js`: per-lane `gain`, common voice bus, limiter and HP filter | Audio stress test and measured true peak **to be expanded** |
| Complex-root composition vs Euclidean accents | `math-io.js` and `app.js` explicit `euclidean` source metadata | `tests/math-io.test.mjs`, union/intersection checks |
| Independent repeating lengths | `math-io.js`: common LCM + bounded scheduler | Mathematical plus browser polymeter tests |
| Source-specific study metadata | `app.js`: `EXPERIMENTAL_STUDIES` 15 named examples with roles/notes | `tests/preset-diversity.mjs` and report (pending audit generation) |

## 4. Unverified work

- Independent critical listening of all 50 presets, comparison across speaker/headphone models and real mobile browsers.
- Full frequency-band and **true-peak** measurements of the complete four-track mix. The existing offline single-voice measurements alone are not proof that all simultaneous outputs respect the master ceiling.
- Genre authenticity is subjective and cannot be established from waveform difference metrics alone.

Sources are linked above; author-added BPM study windows, timbral design decisions and mathematical constructions are **original implementation choices**, not quotations or facts from those pages.
