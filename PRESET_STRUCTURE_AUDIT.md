# Structure and diversity of 50 rhythm examples

**Scope:** objective event-density, overlap, accent and similarity evidence, derived from [PRESET_INVENTORY.json](PRESET_INVENTORY.json). This is not human listening or proof that any genre sounds authentic.

## Observations

- **50 presets / 200 lanes** are represented by mathematical root and optional extra/Euclidean events.
- **5** examples keep only unit-velocity root attacks; these are deliberately pure polyrhythm demonstrations, not defects.
- **5** have no additional root sets, a valid mathematical configuration.
- **0** lack simultaneous cross-lane events in the common-cycle analysis. The 15 experimental pieces include an intentionally shared kick-response anchor.
- **0** presets have a timing neighbor at or above 0.85 Jaccard similarity.
- The 15 experimental studies each contain three genuine first-degree root accents, including two lower-velocity in-between-root pickups. The Euclidean study keeps its five separately sourced accents as well.
- High phase similarity (≥0.85) is a timing-only candidate for subjective listening review, not proof that two patches or genres sound the same.

All per-preset event counts, shared moments, accent velocities, source additions and lane-density ratios below are rechecked against the current 50-preset model. The category column is the browser group from `PRESET_GROUPS` in `app.js`; a preset's sample family (`kit`) is separate. The groove, polyrhythm and acid presets were reworked together (lane balance, ghost and accent roots, descriptions); the five redesigned Bunker arrangements, **Dust · Half-light** and the root sets of the 15 experimental studies are musically unchanged.

## Quantitative per-preset evidence

| Preset ID | Genre category | BPM | Lane events | Shared times | Accents | Added sets | Density ratio | Similarity ≥0.85 |
|---|---|---:|---|---:|---:|---:|---:|---|
| `berlin-bass-wall` | bunker | 146 | 4:10:20:8 | 14 | 10 | 10 | 5.00 | none |
| `concrete` | bunker | 138 | 4:6:12:6 | 7 | 9 | 9 | 3.00 | none |
| `shaft` | bunker | 143 | 4:6:11:6 | 6 | 9 | 9 | 2.75 | none |
| `dust` | bunker | 134 | 4:2:4:3 | 5 | 1 | 1 | 2.00 | none |
| `iron` | bunker | 151 | 4:8:16:9 | 5 | 12 | 12 | 4.00 | none |
| `pressure` | bunker | 140 | 4:6:16:9 | 7 | 10 | 10 | 4.00 | none |
| `house` | other | 125 | 4:5:4:4 | 8 | 3 | 3 | 1.25 | none |
| `dub` | other | 78 | 3:2:6:4 | 4 | 6 | 6 | 3.00 | none |
| `afro` | poly | 116 | 3:4:8:1 | 4 | 0 | 0 | 8.00 | none |
| `minimal` | poly | 124 | 5:7:8:1 | 1 | 0 | 0 | 8.00 | none |
| `ambient` | other | 70 | 1:4:4:3 | 2 | 2 | 2 | 4.00 | none |
| `neuro-burst` | dnb | 174 | 2:4:10:3 | 5 | 7 | 7 | 5.00 | none |
| `double-drop` | dnb | 176 | 3:5:16:4 | 10 | 16 | 9 | 5.33 | none |
| `subpressure` | dnb | 172 | 3:2:10:3 | 4 | 6 | 6 | 5.00 | none |
| `velocity-grid` | dnb | 178 | 4:5:8:3 | 7 | 7 | 7 | 2.67 | none |
| `ragga-spiral` | dnb | 164 | 3:4:10:4 | 7 | 9 | 9 | 3.33 | none |
| `break-torrent` | dnb | 169 | 3:5:10:3 | 8 | 9 | 9 | 3.33 | none |
| `ghostline` | dnb | 160 | 2:6:8:3 | 6 | 7 | 7 | 4.00 | none |
| `chopped-orbit` | dnb | 172 | 3:4:4:4 | 3 | 6 | 6 | 1.33 | none |
| `bossa-classic` | brazil | 116 | 8:5:16:2 | 11 | 10 | 10 | 8.00 | none |
| `poly-2-3` | poly | 108 | 2:3:6:1 | 4 | 0 | 0 | 6.00 | none |
| `poly-3-5` | poly | 112 | 3:5:15:1 | 7 | 0 | 0 | 15.00 | none |
| `poly-4-7` | poly | 118 | 4:7:8:1 | 4 | 0 | 0 | 8.00 | none |
| `baile-funk` | brazil | 132 | 4:3:10:4 | 8 | 7 | 7 | 3.33 | none |
| `samba-drive` | brazil | 108 | 5:8:16:5 | 12 | 23 | 13 | 3.20 | none |
| `batucada` | brazil | 118 | 5:7:16:5 | 11 | 17 | 10 | 3.20 | none |
| `maracatu` | brazil | 104 | 6:5:6:8 | 10 | 13 | 10 | 1.60 | none |
| `warehouse-hammer` | other | 146 | 4:3:4:5 | 6 | 2 | 2 | 1.67 | none |
| `steel-rave` | other | 152 | 4:2:16:4 | 8 | 14 | 3 | 8.00 | none |
| `stomp-circuit` | other | 148 | 5:2:4:12 | 7 | 9 | 3 | 6.00 | none |
| `peak-pressure` | other | 156 | 4:7:8:7 | 17 | 6 | 6 | 2.00 | none |
| `acid-303` | acid | 128 | 4:2:4:8 | 6 | 4 | 4 | 4.00 | none |
| `resonance-rush` | acid | 134 | 5:2:10:7 | 5 | 5 | 5 | 5.00 | none |
| `liquid-corrosion` | acid | 124 | 3:3:4:4 | 3 | 4 | 4 | 1.33 | none |
| `303-pressure` | acid | 140 | 5:3:10:9 | 5 | 6 | 6 | 3.33 | none |
| `industrial-fracture` | experimental | 155 | 6:9:11:9 | 3 | 3 | 3 | 1.83 | none |
| `acid-reactor` | experimental | 148 | 4:7:7:11 | 3 | 3 | 3 | 2.75 | none |
| `rotterdam-collision` | hardcore | 180 | 5:9:11:3 | 3 | 3 | 3 | 3.67 | none |
| `schranz-machinery` | hardcore | 158 | 8:11:11:13 | 3 | 3 | 3 | 1.63 | none |
| `broken-reactor` | experimental | 172 | 6:13:7:13 | 1 | 3 | 3 | 2.17 | none |
| `frenchcore-spiral` | hardcore | 205 | 5:9:5:11 | 3 | 3 | 3 | 2.20 | none |
| `acid-singularity` | experimental | 162 | 8:13:13:5 | 2 | 3 | 3 | 2.60 | none |
| `prime-number-riot` | experimental | 175 | 4:7:7:11 | 3 | 3 | 3 | 2.75 | none |
| `eleven-against-seven` | experimental | 146 | 8:13:5:13 | 3 | 3 | 3 | 2.60 | none |
| `mechanical-paradox` | experimental | 168 | 10:15:7:11 | 1 | 3 | 3 | 2.14 | none |
| `terror-geometry` | hardcore | 220 | 5:9:9:13 | 2 | 3 | 3 | 2.60 | none |
| `complex-roots-overload` | experimental | 186 | 8:13:13:17 | 1 | 3 | 3 | 2.13 | none |
| `hardtek-mobius` | hardcore | 178 | 6:9:9:4 | 3 | 3 | 3 | 2.25 | none |
| `breakcore-prime-shards` | experimental | 190 | 8:7:11:3 | 1 | 3 | 3 | 3.67 | none |
| `euclidean-fragments` | experimental | 170 | 8:13:13:10 | 2 | 8 | 4 | 1.63 | none |

## Acceptance boundary

- The event count is not merely the polynomial degree: extra root families, operations, phase rotation, cycle duration and Euclidean pulses all influence each actual lane's phase set.
- Contrast compares max/min event counts across four lanes, not decibels or perceived tempo.
- Some highly similar rhythmic grids use different sound families or BPM. Do not change a mathematically meaningful example simply to improve a similarity score.
- Source tests: [preset diversity](tests/preset-diversity.mjs), [cross-lane coincidence](tests/cross-lane-coincidence.mjs), [sound headroom](tests/audio-mix-stress.mjs).
- Human musical review is separate from structural metrics. AUDIO-01 requires all five revised Bunker variants, protected Dust, affected voices and a risk-based sample; no unaudited musical authenticity is claimed here.
