# Structure and diversity of 50 rhythm examples

**Scope:** objective event-density, overlap, accent and similarity evidence for M10, derived from [PRESET_INVENTORY.json](PRESET_INVENTORY.json). This is not human listening or proof that any genre sounds authentic.

## Observations

- **50 presets / 200 lanes** remain represented by mathematical root and optional extra/Euclidean events.
- **21** examples have no reduced-velocity accents; many are intentionally pure polyrhythm demonstrations, so this is a review flag, not a defect.
- **21** use base root sets without added sets, a valid mathematical configuration.
- **4** have no simultaneous cross-lane moment in the bounded four-bar schedule.
- **5** unique pairs meet the existing ≥0.85 phase-similarity measure and should be listened to for distinguishability. Mathematical similarity does not imply identical timbre.

The counts and similarity rows below were rechecked against the generated 50-preset inventory after the four Acid presets were redesigned. The five remaining high-similarity pairs are timing-only candidates for a future listening review, not duplicates of waveform or style.

## Quantitative per-preset evidence

| Preset ID | Genre category | BPM | Lane events | Shared times | Accents | Added sets | Density ratio | Similarity ≥0.85 |
|---|---|---:|---|---:|---:|---:|---:|---|
| `berlin-bass-wall` | bunker | 146 | 4:4:8:3 | 3 | 1 | 1 | 2.67 | none |
| `concrete` | bunker | 138 | 4:2:4:3 | 4 | 1 | 1 | 2.00 | `dust:0.86` |
| `shaft` | bunker | 143 | 4:2:8:3 | 4 | 1 | 1 | 4.00 | none |
| `dust` | bunker | 134 | 4:2:4:3 | 5 | 1 | 1 | 2.00 | `concrete:0.86` |
| `iron` | bunker | 151 | 5:2:8:4 | 8 | 1 | 1 | 4.00 | `steel-rave:0.90`, `peak-pressure:0.86` |
| `pressure` | bunker | 140 | 4:2:4:2 | 4 | 1 | 1 | 2.00 | none |
| `house` | other | 125 | 4:2:4:8 | 8 | 0 | 0 | 4.00 | none |
| `dub` | other | 78 | 3:1:4:2 | 2 | 1 | 1 | 4.00 | none |
| `afro` | poly | 116 | 3:4:8:1 | 4 | 0 | 0 | 8.00 | none |
| `minimal` | poly | 124 | 5:7:8:1 | 1 | 0 | 0 | 8.00 | none |
| `ambient` | other | 70 | 1:3:4:2 | 1 | 0 | 0 | 4.00 | none |
| `neuro-burst` | dnb | 174 | 2:3:10:2 | 5 | 4 | 4 | 5.00 | `velocity-grid:0.89` |
| `double-drop` | dnb | 176 | 3:4:8:3 | 5 | 5 | 5 | 2.67 | none |
| `subpressure` | dnb | 172 | 2:2:8:2 | 3 | 2 | 2 | 4.00 | none |
| `velocity-grid` | dnb | 178 | 3:4:10:2 | 6 | 6 | 6 | 5.00 | `neuro-burst:0.89` |
| `ragga-spiral` | jungle | 164 | 3:4:10:2 | 6 | 6 | 6 | 5.00 | none |
| `break-torrent` | jungle | 169 | 4:4:10:2 | 8 | 7 | 7 | 5.00 | none |
| `ghostline` | jungle | 160 | 2:4:8:2 | 4 | 4 | 4 | 4.00 | none |
| `chopped-orbit` | jungle | 172 | 3:4:10:2 | 7 | 6 | 6 | 5.00 | none |
| `bossa-classic` | brazil | 116 | 8:5:16:2 | 11 | 10 | 10 | 8.00 | none |
| `poly-2-3` | poly | 108 | 2:3:6:1 | 4 | 0 | 0 | 6.00 | none |
| `poly-3-5` | poly | 112 | 3:5:1:1 | 1 | 0 | 0 | 5.00 | none |
| `poly-4-7` | poly | 118 | 4:7:1:1 | 1 | 0 | 0 | 7.00 | none |
| `baile-funk` | brazil | 132 | 4:3:8:3 | 6 | 4 | 4 | 2.67 | none |
| `samba-drive` | brazil | 108 | 3:4:8:3 | 7 | 2 | 4 | 2.67 | none |
| `batucada` | brazil | 118 | 3:6:8:3 | 6 | 4 | 4 | 2.67 | none |
| `maracatu` | brazil | 104 | 3:3:4:3 | 3 | 3 | 3 | 1.33 | none |
| `warehouse-hammer` | hardhouse | 146 | 4:2:4:5 | 6 | 1 | 1 | 2.50 | none |
| `steel-rave` | hardhouse | 152 | 4:2:8:5 | 8 | 1 | 1 | 4.00 | `peak-pressure:0.95`, `iron:0.90` |
| `stomp-circuit` | hardhouse | 148 | 5:2:4:3 | 5 | 2 | 2 | 2.50 | none |
| `peak-pressure` | hardhouse | 156 | 4:2:8:6 | 8 | 2 | 2 | 4.00 | `steel-rave:0.95`, `iron:0.86` |
| `acid-303` | acid | 128 | 4:2:4:6 | 6 | 2 | 2 | 3.00 | none |
| `resonance-rush` | acid | 134 | 5:2:9:7 | 5 | 4 | 4 | 4.50 | none |
| `liquid-corrosion` | acid | 124 | 3:2:4:4 | 3 | 3 | 3 | 2.00 | none |
| `303-pressure` | acid | 140 | 5:2:9:9 | 5 | 4 | 4 | 4.50 | none |
| `industrial-fracture` | experimental | 155 | 5:7:11:9 | 1 | 0 | 0 | 2.20 | none |
| `acid-reactor` | experimental | 148 | 3:5:7:11 | 1 | 0 | 0 | 3.67 | none |
| `rotterdam-collision` | hardcore | 180 | 4:7:11:3 | 2 | 0 | 0 | 3.67 | none |
| `schranz-machinery` | hardcore | 158 | 7:9:11:13 | 2 | 0 | 0 | 1.86 | none |
| `broken-reactor` | experimental | 172 | 5:11:7:13 | 0 | 0 | 0 | 2.60 | none |
| `frenchcore-spiral` | hardcore | 205 | 4:7:5:11 | 2 | 0 | 0 | 2.75 | none |
| `acid-singularity` | experimental | 162 | 7:11:13:5 | 1 | 0 | 0 | 2.60 | none |
| `prime-number-riot` | experimental | 175 | 3:5:7:11 | 1 | 0 | 0 | 3.67 | none |
| `eleven-against-seven` | experimental | 146 | 7:11:5:13 | 2 | 0 | 0 | 2.60 | none |
| `mechanical-paradox` | experimental | 168 | 9:13:7:11 | 0 | 0 | 0 | 1.86 | none |
| `terror-geometry` | hardcore | 220 | 4:7:9:13 | 1 | 0 | 0 | 3.25 | none |
| `complex-roots-overload` | experimental | 186 | 7:11:13:17 | 0 | 0 | 0 | 2.43 | none |
| `hardtek-mobius` | hardcore | 178 | 5:7:9:4 | 1 | 0 | 0 | 2.25 | none |
| `breakcore-prime-shards` | experimental | 190 | 7:5:11:3 | 0 | 0 | 0 | 3.67 | none |
| `euclidean-fragments` | experimental | 170 | 7:11:13:10 | 1 | 5 | 1 | 1.86 | none |

## Acceptance boundary

- The event count is not merely the polynomial degree: extra root families, operations, phase rotation, cycle duration and Euclidean pulses all influence each actual lane's phase set.
- Contrast compares max/min event counts across four lanes, not decibels or perceived tempo.
- Some highly similar rhythmic grids use different sound families or BPM. Do not change a mathematically meaningful example simply to improve a similarity score.
- Source tests: [preset diversity](tests/preset-diversity.mjs), [cross-lane coincidence](tests/cross-lane-coincidence.mjs), [sound headroom](tests/audio-mix-stress.mjs).
- Human listening of all 50 presets, especially high-similarity pairs and flat-velocity genre examples, remains blocked under M13. M10 is not complete based on this table alone.
