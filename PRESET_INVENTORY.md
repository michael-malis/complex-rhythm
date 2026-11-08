# All 50 preset configurations: source parameters and actual phases

Generated from the live event model. Phase fractions are relative to each lane cycle.
Similarity is pairwise four-lane Jaccard over the LCM; not a subjective musical score.

## BERLIN BUNKER · Bass Wall (berlin-bass-wall)

**Group:** original catalog · **Category:** bunker · **BPM:** 146 · **Common period:** 2 bars · **Shared phase groups:** 14.
**Musical role:** Driving / Hypnotic · an unwavering four-on-the-floor hard kick against rolling offbeat sub-rumble, a 16th-grid hat motor and alternating low-level rim pickups.
**Mathematical design:** The kick repeats R₄(1) every bar. The other three circles span two bars: R₈(−1) rumble, R₁₆(−1) hats, and R₄(−1) rim. Individual first-degree roots introduce controlled syncopations; no second step sequencer is used.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 8 | 2 | berlinrumble | 0.0625, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 0.9375 | 0.0625@1, 0.1875@1, 0.3125@1, 0.34375@0.28, 0.4375@1, 0.5625@1, 0.6875@1, 0.8125@1, 0.84375@0.34, 0.9375@1 |
| 3 | -1 + 0i | 180 | 16 | 2 | hat | 0.03125, 0.09375, 0.15625, 0.21875, 0.28125, 0.34375, 0.40625, 0.46875, 0.53125, 0.59375, 0.65625, 0.71875, 0.78125, 0.84375, 0.90625, 0.96875 | 0.03125@1, 0.0625@0.42, 0.09375@1, 0.15625@1, 0.21875@1, 0.28125@1, 0.3125@0.4, 0.34375@1, 0.40625@1, 0.46875@1, 0.53125@1, 0.5625@0.38, 0.59375@1, 0.65625@1, 0.71875@1, 0.78125@1, 0.8125@0.45, 0.84375@1, 0.90625@1, 0.96875@1 |
| 4 | -1 + 0i | 180 | 4 | 2 | rim | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.21875@0.29, 0.375@1, 0.4375@0.36, 0.625@1, 0.71875@0.33, 0.875@1, 0.9375@0.4 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.72 · L3: union, 4 additional sets, no Euclidean overlay, patch default, gain 0.68 · L4: union, 4 additional sets, no Euclidean overlay, patch default, gain 0.65

**Nearest timing neighbors (Jaccard):** house (0.2813), samba-drive (0.2813), batucada (0.2647)

**Fingerprint:** 0:0;2:31250;1:62500;2:62500;2:93750;0:125000;3:125000;2:156250;1:187500;2:218750;3:218750;0:250000;2:281250;1:312500;2:312500;1:343750;2:343750;0:375000;3:375000;2:406250;1:437500;3:437500;2:468750;0:500000;2:531250;1:562500;2:562500;2:593750;0:625000;3:625000;2:656250;1:687500;2:718750;3:718750;0:750000;2:781250;1:812500;2:812500;1:843750;2:843750;0:875000;3:875000;2:906250;1:937500;3:937500;2:968750

## Concrete · Raw Underground (concrete)

**Group:** original catalog · **Category:** bunker · **BPM:** 138 · **Common period:** 2 bars · **Shared phase groups:** 7.
**Musical role:** Raw Underground · dry hard quarter-note kick, clipped backbeat claps, coarse offbeat hats and short growling Reese bass stabs. Two-bar ghost variations maintain drive without a Berlin-style rumble wall.
**Mathematical design:** R₄(1) is a separate one-bar quarter-kick circle; over two bars R₄(−1) claps land on beats 2 and 4, R₈(−1) hats articulate eighth-note offbeats, and R₃(i) bass sets up a shifting 3:4 polymetric counter-rhythm. Nine degree-one roots add intentionally soft ghost pickups.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 4 | 2 | clap | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.4375@0.3, 0.625@1, 0.875@1, 0.9375@0.37 |
| 3 | -1 + 0i | 180 | 8 | 2 | hat | 0.0625, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 0.9375 | 0.0625@1, 0.125@0.36, 0.1875@1, 0.3125@1, 0.375@0.43, 0.4375@1, 0.5625@1, 0.625@0.39, 0.6875@1, 0.8125@1, 0.875@0.45, 0.9375@1 |
| 4 | 0 + 1i | 90 | 3 | 2 | reese | 0.083333, 0.416667, 0.75 | 0.083333@1, 0.21875@0.48, 0.416667@1, 0.59375@0.56, 0.75@1, 0.90625@0.43 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1.06 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.85 · L3: union, 4 additional sets, no Euclidean overlay, patch default, gain 0.72 · L4: union, 3 additional sets, no Euclidean overlay, patch default, gain 0.7

**Nearest timing neighbors (Jaccard):** shaft (0.65), dust (0.5676), stomp-circuit (0.5385)

**Fingerprint:** 0:0;2:62500;3:83333;0:125000;1:125000;2:125000;2:187500;3:218750;0:250000;2:312500;0:375000;1:375000;2:375000;3:416667;1:437500;2:437500;0:500000;2:562500;3:593750;0:625000;1:625000;2:625000;2:687500;0:750000;3:750000;2:812500;0:875000;1:875000;2:875000;3:906250;1:937500;2:937500

## Ventilation · Industrial (shaft)

**Group:** original catalog · **Category:** bunker · **BPM:** 143 · **Common period:** 1 bars · **Shared phase groups:** 4.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | tom | 0, 0.5 | 0@1, 0.5@1, 0.8125@0.45 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** baile-funk (0.6667), dust (0.6667), concrete (0.65)

**Fingerprint:** 0:0;2:0;3:0;2:125000;0:250000;1:250000;2:250000;2:375000;0:500000;2:500000;3:500000;2:625000;0:750000;1:750000;2:750000;3:812500;2:875000

## Dust · Half-light (dust)

**Group:** original catalog · **Category:** bunker · **BPM:** 134 · **Common period:** 1 bars · **Shared phase groups:** 5.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | rim | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | openhat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.5@1, 0.875@0.55 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** stomp-circuit (0.8), liquid-corrosion (0.7333), house (0.7222)

**Fingerprint:** 0:0;3:0;2:125000;0:250000;1:250000;2:375000;0:500000;3:500000;2:625000;0:750000;1:750000;2:875000;3:875000

## Iron · Peak (iron)

**Group:** original catalog · **Category:** bunker · **BPM:** 151 · **Common period:** 1 bars · **Shared phase groups:** 8.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1, 0.875@0.58 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 4 | 1 | acid | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** steel-rave (0.9), peak-pressure (0.8571), warehouse-hammer (0.7)

**Fingerprint:** 0:0;2:0;2:125000;3:125000;0:250000;1:250000;2:250000;2:375000;3:375000;0:500000;2:500000;2:625000;3:625000;0:750000;1:750000;2:750000;0:875000;2:875000;3:875000

## Pressure · Acid Underground (pressure)

**Group:** original catalog · **Category:** bunker · **BPM:** 140 · **Common period:** 2 bars · **Shared phase groups:** 6.
**Musical role:** Dark underground acid techno · unwavering four-quarter hard kick, dry backbeat snare, restless offbeat hats and a screaming resonant acid line with intentional call-and-response ghosts.
**Mathematical design:** One-bar R₄(1) defines each kick quarter; independent two-bar R₄(−1) snare, R₁₂(−1) hats and R₅(i) acidScreaming phrase are extended by ten quiet first-degree phase roots. Distinct root families make the acid notes slide against the metrical kick without a separate beat sequencer.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 4 | 2 | snare | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.4375@0.33, 0.625@1, 0.875@1, 0.9375@0.38 |
| 3 | -1 + 0i | 180 | 12 | 2 | hat | 0.041667, 0.125, 0.208333, 0.291667, 0.375, 0.458333, 0.541667, 0.625, 0.708333, 0.791667, 0.875, 0.958333 | 0.041667@1, 0.125@1, 0.208333@1, 0.291667@1, 0.3125@0.4, 0.375@1, 0.458333@1, 0.541667@1, 0.625@1, 0.708333@1, 0.791667@1, 0.875@1, 0.958333@1 |
| 4 | 0 + 1i | 90 | 5 | 2 | acidScreaming | 0.05, 0.25, 0.45, 0.65, 0.85 | 0.05@1, 0.15625@0.44, 0.25@1, 0.34375@0.62, 0.45@1, 0.5625@0.48, 0.65@1, 0.75@0.66, 0.85@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1.05 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.84 · L3: union, 4 additional sets, no Euclidean overlay, patch default, gain 0.67 · L4: union, 4 additional sets, no Euclidean overlay, patch default, gain 0.62

**Nearest timing neighbors (Jaccard):** concrete (0.4167), shaft (0.3725), steel-rave (0.3455)

**Fingerprint:** 0:0;2:41667;3:50000;0:125000;1:125000;2:125000;3:156250;2:208333;0:250000;3:250000;2:291667;2:312500;3:343750;0:375000;1:375000;2:375000;1:437500;3:450000;2:458333;0:500000;2:541667;3:562500;0:625000;1:625000;2:625000;3:650000;2:708333;0:750000;3:750000;2:791667;3:850000;0:875000;1:875000;2:875000;1:937500;2:958333

## Classic House · 4/4 (house)

**Group:** original catalog · **Category:** other · **BPM:** 125 · **Common period:** 1 bars · **Shared phase groups:** 8.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | openhat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 8 | 1 | shaker | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** warehouse-hammer (0.7368), dust (0.7222), acid-303 (0.7)

**Fingerprint:** 0:0;3:0;2:125000;3:125000;0:250000;1:250000;3:250000;2:375000;3:375000;0:500000;3:500000;2:625000;3:625000;0:750000;1:750000;3:750000;2:875000;3:875000

## Dub · Half-time (dub)

**Group:** original catalog · **Category:** other · **BPM:** 78 · **Common period:** 1 bars · **Shared phase groups:** 2.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | kick | 0, 0.5 | 0@1, 0.5@1, 0.6875@0.68 |
| 2 | -1 + 0i | 180 | 1 | 1 | snare | 0.5 | 0.5@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | hat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** ambient (0.5385), dust (0.5333), liquid-corrosion (0.5333)

**Fingerprint:** 0:0;3:0;2:125000;2:375000;0:500000;1:500000;3:500000;2:625000;0:687500;2:875000

## Polyrhythm · 3 : 4 (afro)

**Group:** original catalog · **Category:** poly · **BPM:** 116 · **Common period:** 1 bars · **Shared phase groups:** 4.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 3 | 1 | tom | 0, 0.333333, 0.666667 | 0@1, 0.333333@1, 0.666667@1 |
| 2 | 1 + 0i | 0 | 4 | 1 | rim | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | shaker | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 1 | 1 | bass | 0 | 0@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** ghostline (0.6), subpressure (0.5789), neuro-burst (0.5714)

**Fingerprint:** 0:0;1:0;2:0;3:0;2:125000;1:250000;2:250000;0:333333;2:375000;1:500000;2:500000;2:625000;0:666667;1:750000;2:750000;2:875000

## Polyrhythm · 5 : 7 (minimal)

**Group:** original catalog · **Category:** poly · **BPM:** 124 · **Common period:** 1 bars · **Shared phase groups:** 1.
**Musical role:** Five equally spaced tom hits oppose seven rim hits; hats give an eight-pulse reference and the kick marks the cycle start.
**Mathematical design:** The first two tracks construct a 5:7 polyrhythm from R₅(1) and R₇(1). Only their cycle-start events coincide.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 5 | 1 | tom | 0, 0.2, 0.4, 0.6, 0.8 | 0@1, 0.2@1, 0.4@1, 0.6@1, 0.8@1 |
| 2 | 1 + 0i | 0 | 7 | 1 | rim | 0, 0.142857, 0.285714, 0.428571, 0.571429, 0.714286, 0.857143 | 0@1, 0.142857@1, 0.285714@1, 0.428571@1, 0.571429@1, 0.714286@1, 0.857143@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** afro (0.4231), poly-4-7 (0.4167), subpressure (0.4)

**Fingerprint:** 0:0;1:0;2:0;3:0;2:125000;1:142857;0:200000;2:250000;1:285714;2:375000;0:400000;1:428571;2:500000;1:571429;0:600000;2:625000;1:714286;2:750000;0:800000;1:857143;2:875000

## Slow Orbit · Space (ambient)

**Group:** original catalog · **Category:** other · **BPM:** 70 · **Common period:** 1 bars · **Shared phase groups:** 1.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1 |
| 2 | 0 + 1i | 90 | 3 | 1 | tom | 0.083333, 0.416667, 0.75 | 0.083333@1, 0.416667@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | openhat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** dub (0.5385), dust (0.5333), liquid-corrosion (0.5333)

**Fingerprint:** 0:0;3:0;1:83333;2:125000;2:375000;1:416667;3:500000;2:625000;1:750000;2:875000

## Neuro · 2-Step (neuro-burst)

**Group:** original catalog · **Category:** dnb · **BPM:** 174 · **Common period:** 1 bars · **Shared phase groups:** 5.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.625@0.92 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.4375@0.27, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.1875@0.42, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.6875@0.42, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | reese | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** velocity-grid (0.8947), ghostline (0.7368), ragga-spiral (0.7143)

**Fingerprint:** 0:0;2:0;3:0;2:125000;2:187500;1:250000;2:250000;2:375000;1:437500;2:500000;3:500000;0:625000;2:625000;2:687500;1:750000;2:750000;2:875000

## Roller · Ghosts (double-drop)

**Group:** original catalog · **Category:** dnb · **BPM:** 176 · **Common period:** 1 bars · **Shared phase groups:** 5.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.625@0.96, 0.875@0.38 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.4375@0.3, 0.75@1, 0.9375@0.3 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 2 | 1 | bass | 0.25, 0.75 | 0.25@1, 0.6875@0.48, 0.75@1 |

**Operations, patches and accents:** L1: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** ghostline (0.7), velocity-grid (0.6087), neuro-burst (0.5909)

**Fingerprint:** 0:0;2:0;2:125000;1:250000;2:250000;3:250000;2:375000;1:437500;2:500000;0:625000;2:625000;3:687500;1:750000;2:750000;3:750000;0:875000;2:875000;1:937500

## Sub Pressure · Half-time (subpressure)

**Group:** original catalog · **Category:** dnb · **BPM:** 172 · **Common period:** 1 bars · **Shared phase groups:** 3.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.625@0.83 |
| 2 | -1 + 0i | 180 | 1 | 1 | snare | 0.5 | 0.5@1, 0.9375@0.25 |
| 3 | 1 + 0i | 0 | 8 | 1 | shaker | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | reese | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** chopped-orbit (0.65), ragga-spiral (0.65), velocity-grid (0.65)

**Fingerprint:** 0:0;2:0;3:0;2:125000;2:250000;2:375000;1:500000;2:500000;3:500000;0:625000;2:625000;2:750000;2:875000;1:937500

## Break Grid · 16ths (velocity-grid)

**Group:** original catalog · **Category:** dnb · **BPM:** 178 · **Common period:** 1 bars · **Shared phase groups:** 6.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.375@0.57, 0.625@0.9 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.4375@0.27, 0.75@1, 0.9375@0.31 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.1875@0.4, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.6875@0.45, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** neuro-burst (0.8947), ragga-spiral (0.7273), ghostline (0.6667)

**Fingerprint:** 0:0;2:0;3:0;2:125000;2:187500;1:250000;2:250000;0:375000;2:375000;1:437500;2:500000;3:500000;0:625000;2:625000;2:687500;1:750000;2:750000;2:875000;1:937500

## Ragga · Break Step (ragga-spiral)

**Group:** original catalog · **Category:** jungle · **BPM:** 164 · **Common period:** 1 bars · **Shared phase groups:** 6.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.3125@0.75, 0.625@0.85 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.5625@0.31, 0.75@1, 0.9375@0.38 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.3125@0.35, 0.375@1, 0.5@1, 0.625@1, 0.6875@0.42, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | reese | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** velocity-grid (0.7273), neuro-burst (0.7143), chopped-orbit (0.6522)

**Fingerprint:** 0:0;2:0;3:0;2:125000;1:250000;2:250000;0:312500;2:312500;2:375000;2:500000;3:500000;1:562500;0:625000;2:625000;2:687500;1:750000;2:750000;2:875000;1:937500

## Break Torrent · Chops (break-torrent)

**Group:** original catalog · **Category:** jungle · **BPM:** 169 · **Common period:** 1 bars · **Shared phase groups:** 8.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.1875@0.55, 0.625@0.9, 0.875@0.48 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.375@0.31, 0.75@1, 0.9375@0.29 |
| 3 | 1 + 0i | 0 | 8 | 1 | shaker | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.4375@0.38, 0.5@1, 0.625@1, 0.75@1, 0.875@1, 0.9375@0.42 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 3 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** chopped-orbit (0.6957), ragga-spiral (0.625), velocity-grid (0.625)

**Fingerprint:** 0:0;2:0;3:0;2:125000;0:187500;1:250000;2:250000;1:375000;2:375000;2:437500;2:500000;3:500000;0:625000;2:625000;1:750000;2:750000;0:875000;2:875000;1:937500;2:937500

## Ghostline · Half-roll (ghostline)

**Group:** original catalog · **Category:** jungle · **BPM:** 160 · **Common period:** 1 bars · **Shared phase groups:** 4.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.625@0.84 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.1875@0.25, 0.25@1, 0.4375@0.3, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 1 | 1 | bass | 0 | 0@1, 0.6875@0.63 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** neuro-burst (0.7368), double-drop (0.7), velocity-grid (0.6667)

**Fingerprint:** 0:0;2:0;3:0;2:125000;1:187500;1:250000;2:250000;2:375000;1:437500;2:500000;0:625000;2:625000;3:687500;1:750000;2:750000;2:875000

## Chopped Orbit · Fast (chopped-orbit)

**Group:** original catalog · **Category:** jungle · **BPM:** 172 · **Common period:** 1 bars · **Shared phase groups:** 7.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 1 | 1 | kick | 0 | 0@1, 0.125@0.5, 0.625@0.92 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.375@0.34, 0.75@1, 0.9375@0.28 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.0625@0.48, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.5625@0.48, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | reese | 0, 0.5 | 0@1, 0.5@1 |

**Operations, patches and accents:** L1: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** break-torrent (0.6957), ragga-spiral (0.6522), velocity-grid (0.6522)

**Fingerprint:** 0:0;2:0;3:0;2:62500;0:125000;2:125000;1:250000;2:250000;1:375000;2:375000;2:500000;3:500000;2:562500;0:625000;2:625000;1:750000;2:750000;2:875000;1:937500

## Bossa Nova · Classic (bossa-classic)

**Group:** original catalog · **Category:** brazil · **BPM:** 116 · **Common period:** 2 bars · **Shared phase groups:** 11.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 2 | jazzkick | 0, 0.25, 0.5, 0.75 | 0@1, 0.1875@0.46, 0.25@1, 0.4375@0.42, 0.5@1, 0.6875@0.46, 0.75@1, 0.9375@0.42 |
| 2 | 1 + 0i | 0 | 1 | 2 | crossstick | 0 | 0@1, 0.1875@0.8, 0.375@0.92, 0.625@0.82, 0.8125@0.84 |
| 3 | 1 + 0i | 0 | 16 | 2 | jazzshaker | 0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375 | 0@1, 0.0625@1, 0.125@1, 0.1875@1, 0.25@1, 0.3125@1, 0.375@1, 0.4375@1, 0.5@1, 0.5625@1, 0.625@1, 0.6875@1, 0.75@1, 0.8125@1, 0.875@1, 0.9375@1 |
| 4 | 0 + 0i | undefined | 1 | 2 | bongo | none (z=0) | 0.34375@0.28, 0.84375@0.32 |

**Operations, patches and accents:** L1: union, 4 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 4 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 2 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** baile-funk (0.6341), double-drop (0.5581), samba-drive (0.5581)

**Fingerprint:** 0:0;1:0;2:0;2:62500;2:125000;0:187500;1:187500;2:187500;0:250000;2:250000;2:312500;3:343750;1:375000;2:375000;0:437500;2:437500;0:500000;2:500000;2:562500;1:625000;2:625000;0:687500;2:687500;0:750000;2:750000;1:812500;2:812500;3:843750;2:875000;0:937500;2:937500

## Polyrhythm · 2 : 3 (poly-2-3)

**Group:** original catalog · **Category:** poly · **BPM:** 108 · **Common period:** 1 bars · **Shared phase groups:** 4.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | tom | 0, 0.5 | 0@1, 0.5@1 |
| 2 | 1 + 0i | 0 | 3 | 1 | rim | 0, 0.333333, 0.666667 | 0@1, 0.333333@1, 0.666667@1 |
| 3 | 1 + 0i | 0 | 6 | 1 | shaker | 0, 0.166667, 0.333333, 0.5, 0.666667, 0.833333 | 0@1, 0.166667@1, 0.333333@1, 0.5@1, 0.666667@1, 0.833333@1 |
| 4 | 1 + 0i | 0 | 1 | 1 | bass | 0 | 0@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** poly-4-7 (0.25), poly-3-5 (0.2222), afro (0.2174)

**Fingerprint:** 0:0;1:0;2:0;3:0;2:166667;1:333333;2:333333;0:500000;2:500000;1:666667;2:666667;2:833333

## Polyrhythm · 3 : 5 (poly-3-5)

**Group:** original catalog · **Category:** poly · **BPM:** 112 · **Common period:** 1 bars · **Shared phase groups:** 1.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 3 | 1 | tom | 0, 0.333333, 0.666667 | 0@1, 0.333333@1, 0.666667@1 |
| 2 | 1 + 0i | 0 | 5 | 1 | rim | 0, 0.2, 0.4, 0.6, 0.8 | 0@1, 0.2@1, 0.4@1, 0.6@1, 0.8@1 |
| 3 | 1 + 0i | 0 | 1 | 1 | jazzkick | 0 | 0@1 |
| 4 | 1 + 0i | 0 | 1 | 1 | shaker | 0 | 0@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** afro (0.3), poly-2-3 (0.2222), poly-4-7 (0.2105)

**Fingerprint:** 0:0;1:0;2:0;3:0;1:200000;0:333333;1:400000;1:600000;0:666667;1:800000

## Polyrhythm · 4 : 7 (poly-4-7)

**Group:** original catalog · **Category:** poly · **BPM:** 118 · **Common period:** 1 bars · **Shared phase groups:** 1.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | 1 + 0i | 0 | 7 | 1 | rim | 0, 0.142857, 0.285714, 0.428571, 0.571429, 0.714286, 0.857143 | 0@1, 0.142857@1, 0.285714@1, 0.428571@1, 0.571429@1, 0.714286@1, 0.857143@1 |
| 3 | 1 + 0i | 0 | 1 | 1 | tom | 0 | 0@1 |
| 4 | 1 + 0i | 0 | 1 | 1 | shaker | 0 | 0@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** minimal (0.4167), poly-2-3 (0.25), shaft (0.25)

**Fingerprint:** 0:0;1:0;2:0;3:0;1:142857;0:250000;1:285714;1:428571;0:500000;1:571429;1:714286;0:750000;1:857143

## Baile Funk · Tamborzão (baile-funk)

**Group:** original catalog · **Category:** brazil · **BPM:** 132 · **Common period:** 1 bars · **Shared phase groups:** 6.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | kick | 0, 0.5 | 0@1, 0.375@0.73, 0.5@1, 0.875@0.78 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.6875@0.6, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | tamborim | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.1875@0.58, 0.5@1 |

**Operations, patches and accents:** L1: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** shaft (0.6667), bossa-classic (0.6341), velocity-grid (0.6087)

**Fingerprint:** 0:0;2:0;3:0;2:125000;3:187500;1:250000;2:250000;0:375000;2:375000;0:500000;2:500000;3:500000;2:625000;1:687500;1:750000;2:750000;0:875000;2:875000

## Samba · Surdo Pulse (samba-drive)

**Group:** original catalog · **Category:** brazil · **BPM:** 108 · **Common period:** 1 bars · **Shared phase groups:** 7.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | surdo | 0, 0.5 | 0@1, 0.5@1, 0.75@0.58 |
| 2 | -1 + 0i | 180 | 4 | 1 | tamborim | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | shaker | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | agogo | 0, 0.5 | 0@1, 0.5@1, 0.6875@0.6 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** batucada (0.7273), shaft (0.5909), bossa-classic (0.5581)

**Fingerprint:** 0:0;2:0;3:0;1:125000;2:125000;2:250000;1:375000;2:375000;0:500000;2:500000;3:500000;1:625000;2:625000;3:687500;0:750000;2:750000;1:875000;2:875000

## Batucada · Layers (batucada)

**Group:** original catalog · **Category:** brazil · **BPM:** 118 · **Common period:** 1 bars · **Shared phase groups:** 6.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | surdo | 0, 0.5 | 0@1, 0.5@1, 0.875@0.51 |
| 2 | -1 + 0i | 180 | 4 | 1 | tamborim | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.1875@0.56, 0.375@1, 0.625@1, 0.6875@0.62, 0.875@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | shaker | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | agogo | 0, 0.5 | 0@1, 0.375@0.7, 0.5@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** samba-drive (0.7273), baile-funk (0.5833), bossa-classic (0.5106)

**Fingerprint:** 0:0;2:0;3:0;1:125000;2:125000;1:187500;2:250000;1:375000;2:375000;3:375000;0:500000;2:500000;3:500000;1:625000;2:625000;1:687500;2:750000;0:875000;1:875000;2:875000

## Maracatu · Pulse Sketch (maracatu)

**Group:** original catalog · **Category:** brazil · **BPM:** 104 · **Common period:** 1 bars · **Shared phase groups:** 3.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | surdo | 0, 0.5 | 0@1, 0.5@1, 0.8125@0.53 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.4375@0.42, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | agogo | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | tom | 0, 0.5 | 0@1, 0.5@1, 0.625@0.66 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** dust (0.625), liquid-corrosion (0.625), stomp-circuit (0.5882)

**Fingerprint:** 0:0;3:0;2:125000;1:250000;2:375000;1:437500;0:500000;3:500000;2:625000;3:625000;1:750000;0:812500;2:875000

## Warehouse · Hard Drive (warehouse-hammer)

**Group:** original catalog · **Category:** hardhouse · **BPM:** 146 · **Common period:** 1 bars · **Shared phase groups:** 6.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | openhat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 4 | 1 | bass | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.8125@0.57, 0.875@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** acid-303 (0.8235), house (0.7368), iron (0.7)

**Fingerprint:** 0:0;2:125000;3:125000;0:250000;1:250000;2:375000;3:375000;0:500000;2:625000;3:625000;0:750000;1:750000;3:812500;2:875000;3:875000

## Steel Rave · Stabs (steel-rave)

**Group:** original catalog · **Category:** hardhouse · **BPM:** 152 · **Common period:** 1 bars · **Shared phase groups:** 8.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 4 | 1 | acid | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.6875@0.59, 0.875@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** peak-pressure (0.95), iron (0.9), acid-303 (0.75)

**Fingerprint:** 0:0;2:0;2:125000;3:125000;0:250000;1:250000;2:250000;2:375000;3:375000;0:500000;2:500000;2:625000;3:625000;3:687500;0:750000;1:750000;2:750000;2:875000;3:875000

## Stomp Circuit · Push (stomp-circuit)

**Group:** original catalog · **Category:** hardhouse · **BPM:** 148 · **Common period:** 1 bars · **Shared phase groups:** 5.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1, 0.875@0.52 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | openhat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | bass | 0, 0.5 | 0@1, 0.5@1, 0.6875@0.63 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 1 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** dust (0.8), liquid-corrosion (0.8), shaft (0.6316)

**Fingerprint:** 0:0;3:0;2:125000;0:250000;1:250000;2:375000;0:500000;3:500000;2:625000;3:687500;0:750000;1:750000;0:875000;2:875000

## Peak Pressure · Rave (peak-pressure)

**Group:** original catalog · **Category:** hardhouse · **BPM:** 156 · **Common period:** 1 bars · **Shared phase groups:** 8.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 4 | 1 | acid | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.1875@0.6, 0.375@1, 0.625@1, 0.6875@0.6, 0.875@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 2 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** steel-rave (0.95), iron (0.8571), acid-303 (0.8)

**Fingerprint:** 0:0;2:0;2:125000;3:125000;3:187500;0:250000;1:250000;2:250000;2:375000;3:375000;0:500000;2:500000;2:625000;3:625000;3:687500;0:750000;1:750000;2:750000;2:875000;3:875000

## Acid 303 · Classic (acid-303)

**Group:** original catalog · **Category:** acid · **BPM:** 128 · **Common period:** 1 bars · **Shared phase groups:** 6.
**Musical role:** Sparse classic sawtooth 303 steps against a four-to-the-floor kick and restrained offbeat hats.
**Mathematical design:** Six lead phases from the union of R4(-1) and two single-root accents.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | hat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 4 | 1 | acidClassic | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.1875@0.65, 0.375@1, 0.625@1, 0.6875@0.66, 0.875@1 |

**Operations, patches and accents:** L1: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 2 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** warehouse-hammer (0.8235), peak-pressure (0.8), steel-rave (0.75)

**Fingerprint:** 0:0;2:125000;3:125000;3:187500;0:250000;1:250000;2:375000;3:375000;0:500000;2:625000;3:625000;3:687500;0:750000;1:750000;2:875000;3:875000

## Resonance · Twister (resonance-rush)

**Group:** original catalog · **Category:** acid · **BPM:** 134 · **Common period:** 1 bars · **Shared phase groups:** 5.
**Musical role:** Fast, animated psychedelic squelch over an eighth-note hi-hat roll and extra kick pickup.
**Mathematical design:** Five rotated lead roots from R5(i), with two independently phased single-root syncopations.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1, 0.875@0.45 |
| 2 | -1 + 0i | 180 | 2 | 1 | clap | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.1875@0.4, 0.25@1, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | 0 + 1i | 90 | 5 | 1 | acidPsychedelic | 0.05, 0.25, 0.45, 0.65, 0.85 | 0.05@1, 0.25@1, 0.4375@0.55, 0.45@1, 0.65@1, 0.8125@0.42, 0.85@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 2 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** shaft (0.6), iron (0.5556), concrete (0.5)

**Fingerprint:** 0:0;2:0;3:50000;2:125000;2:187500;0:250000;1:250000;2:250000;3:250000;2:375000;3:437500;3:450000;0:500000;2:500000;2:625000;3:650000;0:750000;1:750000;2:750000;3:812500;3:850000;0:875000;2:875000

## Liquid · Acid Dub (liquid-corrosion)

**Group:** original catalog · **Category:** acid · **BPM:** 124 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Space between low, dark square-wave acid phrases, broken half-time kick and long open hats.
**Mathematical design:** A deliberately sparse two-root bass family with two soft displaced accents.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 2 | 1 | kick | 0, 0.5 | 0@1, 0.5@1, 0.75@0.54 |
| 2 | -1 + 0i | 180 | 2 | 1 | rim | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | -1 + 0i | 180 | 4 | 1 | openhat | 0.125, 0.375, 0.625, 0.875 | 0.125@1, 0.375@1, 0.625@1, 0.875@1 |
| 4 | 1 + 0i | 0 | 2 | 1 | acidDark | 0, 0.5 | 0@1, 0.1875@0.42, 0.5@1, 0.6875@0.52 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 2 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** stomp-circuit (0.8), dust (0.7333), maracatu (0.625)

**Fingerprint:** 0:0;3:0;2:125000;3:187500;1:250000;2:375000;0:500000;3:500000;2:625000;3:687500;0:750000;1:750000;2:875000

## 303 Pressure · Peak (303-pressure)

**Group:** original catalog · **Category:** acid · **BPM:** 140 · **Common period:** 1 bars · **Shared phase groups:** 5.
**Musical role:** Dense distorted hard-acid stabs fight two snare backbeats and a rapid hi-hat line.
**Mathematical design:** Seven equally spaced off-axis lead roots, plus two sixteenth-grid high-pressure accents.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | kick | 0, 0.25, 0.5, 0.75 | 0@1, 0.25@1, 0.5@1, 0.75@1, 0.875@0.54 |
| 2 | -1 + 0i | 180 | 2 | 1 | snare | 0.25, 0.75 | 0.25@1, 0.75@1 |
| 3 | 1 + 0i | 0 | 8 | 1 | hat | 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875 | 0@1, 0.125@1, 0.25@1, 0.3125@0.33, 0.375@1, 0.5@1, 0.625@1, 0.75@1, 0.875@1 |
| 4 | -1 + 0i | 180 | 7 | 1 | acidHard | 0.071429, 0.214286, 0.357143, 0.5, 0.642857, 0.785714, 0.928571 | 0.0625@0.56, 0.071429@1, 0.214286@1, 0.357143@1, 0.5@1, 0.5625@0.7, 0.642857@1, 0.785714@1, 0.928571@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L2: union, 0 additional sets, no Euclidean overlay, patch default, gain 1 · L3: union, 1 additional sets, no Euclidean overlay, patch default, gain 1 · L4: union, 2 additional sets, no Euclidean overlay, patch default, gain 1

**Nearest timing neighbors (Jaccard):** shaft (0.5556), iron (0.5172), baile-funk (0.4828)

**Fingerprint:** 0:0;2:0;3:62500;3:71429;2:125000;3:214286;0:250000;1:250000;2:250000;2:312500;3:357143;2:375000;0:500000;2:500000;3:500000;3:562500;2:625000;3:642857;0:750000;1:750000;2:750000;3:785714;0:875000;2:875000;3:928571

## Industrial Fracture (industrial-fracture)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 155 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Dry broken-pressure impacts against metal clicks and a slow detuned bass contour.
**Mathematical design:** 5:7:11 polyrhythm in the first three lanes, supported by a shifted nine-root bass contour. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 5 | 1 | hardcoreKick | 0, 0.2, 0.4, 0.6, 0.8 | 0@1, 0.1@0.46, 0.2@1, 0.4@1, 0.6@1, 0.8@1 |
| 2 | 0.309017 + 0.951057i | 72 | 7 | 1 | metallic | 0.028571, 0.171429, 0.314286, 0.457143, 0.6, 0.742857, 0.885714 | 0@0.7, 0.028571@1, 0.1@0.38, 0.171429@1, 0.314286@1, 0.457143@1, 0.6@1, 0.742857@1, 0.885714@1 |
| 3 | -0.222521 + 0.974928i | 102.857143 | 11 | 1 | hat | 0.025974, 0.116883, 0.207792, 0.298701, 0.38961, 0.480519, 0.571429, 0.662338, 0.753247, 0.844156, 0.935065 | 0.025974@1, 0.116883@1, 0.207792@1, 0.298701@1, 0.38961@1, 0.480519@1, 0.571429@1, 0.662338@1, 0.753247@1, 0.844156@1, 0.935065@1 |
| 4 | -0.939693 + 0.34202i | 160 | 9 | 1 | reese | 0.049383, 0.160494, 0.271605, 0.382716, 0.493827, 0.604938, 0.716049, 0.82716, 0.938272 | 0.049383@1, 0.160494@1, 0.271605@1, 0.382716@1, 0.493827@1, 0.604938@1, 0.716049@1, 0.82716@1, 0.938272@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.75 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.5 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.24 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.28

**Nearest timing neighbors (Jaccard):** hardtek-mobius (0.3125), minimal (0.12), poly-3-5 (0.0714)

**Fingerprint:** 0:0;1:0;2:25974;1:28571;3:49383;0:100000;1:100000;2:116883;3:160494;1:171429;0:200000;2:207792;3:271605;2:298701;1:314286;3:382716;2:389610;0:400000;1:457143;2:480519;3:493827;2:571429;0:600000;1:600000;3:604938;2:662338;3:716049;1:742857;2:753247;0:800000;3:827160;2:844156;1:885714;2:935065;3:938272

## Acid Reactor (acid-reactor)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 148 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Three anchor kicks, agitated hard-acid response and scattered metallic shrapnel.
**Mathematical design:** Relatively prime 3:5:7:11 periodicities with displaced phases. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 3 | 1 | technoKick | 0, 0.333333, 0.666667 | 0@1, 0.166667@0.46, 0.333333@1, 0.666667@1 |
| 2 | -0.5 + 0.866025i | 120 | 5 | 1 | acidHard | 0.066667, 0.266667, 0.466667, 0.666667, 0.866667 | 0@0.7, 0.066667@1, 0.166667@0.38, 0.266667@1, 0.466667@1, 0.666667@1, 0.866667@1 |
| 3 | -0.809017 − 0.587785i | -144 | 7 | 1 | metallic | 0.085714, 0.228571, 0.371429, 0.514286, 0.657143, 0.8, 0.942857 | 0.085714@1, 0.228571@1, 0.371429@1, 0.514286@1, 0.657143@1, 0.8@1, 0.942857@1 |
| 4 | -0.900969 − 0.433884i | -154.285714 | 11 | 1 | hat | 0.051948, 0.142857, 0.233766, 0.324675, 0.415584, 0.506494, 0.597403, 0.688312, 0.779221, 0.87013, 0.961039 | 0.051948@1, 0.142857@1, 0.233766@1, 0.324675@1, 0.415584@1, 0.506494@1, 0.597403@1, 0.688312@1, 0.779221@1, 0.87013@1, 0.961039@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.82 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.45 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.29 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.2

**Nearest timing neighbors (Jaccard):** prime-number-riot (0.234), poly-3-5 (0.1143), afro (0.0976)

**Fingerprint:** 0:0;1:0;3:51948;1:66667;2:85714;3:142857;0:166667;1:166667;2:228571;3:233766;1:266667;3:324675;0:333333;2:371429;3:415584;1:466667;3:506494;2:514286;3:597403;2:657143;0:666667;1:666667;3:688312;3:779221;2:800000;1:866667;3:870130;2:942857;3:961039

## Rotterdam Collision (rotterdam-collision)

**Group:** new mathematical study · **Category:** hardcore · **BPM:** 180 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Four relentless gabber pulses clash with seven metallic spikes and eleven noisy accents.
**Mathematical design:** 4:7:11:3 exact-root collision study, with offset root families. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | gabberKick | 0, 0.25, 0.5, 0.75 | 0@1, 0.125@0.46, 0.25@1, 0.5@1, 0.75@1 |
| 2 | 0 + 1i | 90 | 7 | 1 | metallic | 0.035714, 0.178571, 0.321429, 0.464286, 0.607143, 0.75, 0.892857 | 0@0.7, 0.035714@1, 0.107143@0.38, 0.178571@1, 0.321429@1, 0.464286@1, 0.607143@1, 0.75@1, 0.892857@1 |
| 3 | -1 + 0i | 180 | 11 | 1 | noiseBurst | 0.045455, 0.136364, 0.227273, 0.318182, 0.409091, 0.5, 0.590909, 0.681818, 0.772727, 0.863636, 0.954545 | 0.045455@1, 0.136364@1, 0.227273@1, 0.318182@1, 0.409091@1, 0.5@1, 0.590909@1, 0.681818@1, 0.772727@1, 0.863636@1, 0.954545@1 |
| 4 | -0.5 + 0.866025i | 120 | 3 | 1 | hoover | 0.111111, 0.444444, 0.777778 | 0.111111@1, 0.444444@1, 0.777778@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.62 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.26 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.19 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.2

**Nearest timing neighbors (Jaccard):** frenchcore-spiral (0.3182), terror-geometry (0.28), shaft (0.1538)

**Fingerprint:** 0:0;1:0;1:35714;2:45455;1:107143;3:111111;0:125000;2:136364;1:178571;2:227273;0:250000;2:318182;1:321429;2:409091;3:444444;1:464286;0:500000;2:500000;2:590909;1:607143;2:681818;0:750000;1:750000;2:772727;3:777778;2:863636;1:892857;2:954545

## Schranz Machinery (schranz-machinery)

**Group:** new mathematical study · **Category:** hardcore · **BPM:** 158 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Mechanistic distorted kick punctuated by inharmonic percussive metallic events.
**Mathematical design:** Odd-meter 7:9:11:13 layers, with substantial drift between collisions. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 7 | 1 | hardcoreKick | 0, 0.142857, 0.285714, 0.428571, 0.571429, 0.714286, 0.857143 | 0@1, 0.071429@0.46, 0.142857@1, 0.285714@1, 0.428571@1, 0.571429@1, 0.714286@1, 0.857143@1 |
| 2 | -0.222521 + 0.974928i | 102.857143 | 9 | 1 | metallic | 0.031746, 0.142857, 0.253968, 0.365079, 0.47619, 0.587302, 0.698413, 0.809524, 0.920635 | 0@0.7, 0.031746@1, 0.087302@0.38, 0.142857@1, 0.253968@1, 0.365079@1, 0.47619@1, 0.587302@1, 0.698413@1, 0.809524@1, 0.920635@1 |
| 3 | 0.309017 + 0.951057i | 72 | 11 | 1 | fmPerc | 0.018182, 0.109091, 0.2, 0.290909, 0.381818, 0.472727, 0.563636, 0.654545, 0.745455, 0.836364, 0.927273 | 0.018182@1, 0.109091@1, 0.2@1, 0.290909@1, 0.381818@1, 0.472727@1, 0.563636@1, 0.654545@1, 0.745455@1, 0.836364@1, 0.927273@1 |
| 4 | -0.900969 + 0.433884i | 154.285714 | 13 | 1 | acidIndustrial | 0.032967, 0.10989, 0.186813, 0.263736, 0.340659, 0.417582, 0.494505, 0.571429, 0.648352, 0.725275, 0.802198, 0.879121, 0.956044 | 0.032967@1, 0.10989@1, 0.186813@1, 0.263736@1, 0.340659@1, 0.417582@1, 0.494505@1, 0.571429@1, 0.648352@1, 0.725275@1, 0.802198@1, 0.879121@1, 0.956044@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.42 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.22 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.2 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.16

**Nearest timing neighbors (Jaccard):** eleven-against-seven (0.1233), euclidean-fragments (0.1154), poly-4-7 (0.0566)

**Fingerprint:** 0:0;1:0;2:18182;1:31746;3:32967;0:71429;1:87302;2:109091;3:109890;0:142857;1:142857;3:186813;2:200000;1:253968;3:263736;0:285714;2:290909;3:340659;1:365079;2:381818;3:417582;0:428571;2:472727;1:476190;3:494505;2:563636;0:571429;3:571429;1:587302;3:648352;2:654545;1:698413;0:714286;3:725275;2:745455;3:802198;1:809524;2:836364;0:857143;3:879121;1:920635;2:927273;3:956044

## Broken Reactor (broken-reactor)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 172 · **Common period:** 1 bars · **Shared phase groups:** 1.
**Musical role:** Five-beat broken low-end structure under thin snare splinters and screaming acid.
**Mathematical design:** Five against eleven against seven against thirteen, with asymmetrical offsets. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 0.309017 + 0.951057i | 72 | 5 | 1 | technoKick | 0.04, 0.24, 0.44, 0.64, 0.84 | 0.04@1, 0.14@0.46, 0.24@1, 0.44@1, 0.64@1, 0.84@1 |
| 2 | -0.809017 + 0.587785i | 144 | 11 | 1 | snare | 0.036364, 0.127273, 0.218182, 0.309091, 0.4, 0.490909, 0.581818, 0.672727, 0.763636, 0.854545, 0.945455 | 0.036364@1, 0.04@0.7, 0.081818@0.38, 0.127273@1, 0.218182@1, 0.309091@1, 0.4@1, 0.490909@1, 0.581818@1, 0.672727@1, 0.763636@1, 0.854545@1, 0.945455@1 |
| 3 | -0.5 + 0.866025i | 120 | 7 | 1 | noiseBurst | 0.047619, 0.190476, 0.333333, 0.47619, 0.619048, 0.761905, 0.904762 | 0.047619@1, 0.190476@1, 0.333333@1, 0.47619@1, 0.619048@1, 0.761905@1, 0.904762@1 |
| 4 | -0.222521 + 0.974928i | 102.857143 | 13 | 1 | acidScreaming | 0.021978, 0.098901, 0.175824, 0.252747, 0.32967, 0.406593, 0.483516, 0.56044, 0.637363, 0.714286, 0.791209, 0.868132, 0.945055 | 0.021978@1, 0.098901@1, 0.175824@1, 0.252747@1, 0.32967@1, 0.406593@1, 0.483516@1, 0.56044@1, 0.637363@1, 0.714286@1, 0.791209@1, 0.868132@1, 0.945055@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.65 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.31 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.18 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.15

**Nearest timing neighbors (Jaccard):** terror-geometry (0.2097), mechanical-paradox (0.0933), poly-3-5 (0.0208)

**Fingerprint:** 3:21978;1:36364;0:40000;1:40000;2:47619;1:81818;3:98901;1:127273;0:140000;3:175824;2:190476;1:218182;0:240000;3:252747;1:309091;3:329670;2:333333;1:400000;3:406593;0:440000;2:476190;3:483516;1:490909;3:560440;1:581818;2:619048;3:637363;0:640000;1:672727;3:714286;2:761905;1:763636;3:791209;0:840000;1:854545;3:868132;2:904762;3:945055;1:945455

## Frenchcore Spiral (frenchcore-spiral)

**Group:** new mathematical study · **Category:** hardcore · **BPM:** 205 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Pitched frenchcore kick with seven hard-acid notes and metallic syncopation.
**Mathematical design:** 4:7:5:11 with pitched root families and near-aligned source cycles. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | frenchcoreKick | 0, 0.25, 0.5, 0.75 | 0@1, 0.125@0.46, 0.25@1, 0.5@1, 0.75@1 |
| 2 | 0 + 1i | 90 | 7 | 1 | acidHard | 0.035714, 0.178571, 0.321429, 0.464286, 0.607143, 0.75, 0.892857 | 0@0.7, 0.035714@1, 0.107143@0.38, 0.178571@1, 0.321429@1, 0.464286@1, 0.607143@1, 0.75@1, 0.892857@1 |
| 3 | 0 + 1i | 90 | 5 | 1 | metallic | 0.05, 0.25, 0.45, 0.65, 0.85 | 0.05@1, 0.25@1, 0.45@1, 0.65@1, 0.85@1 |
| 4 | -0.809017 + 0.587785i | 144 | 11 | 1 | hat | 0.036364, 0.127273, 0.218182, 0.309091, 0.4, 0.490909, 0.581818, 0.672727, 0.763636, 0.854545, 0.945455 | 0.036364@1, 0.127273@1, 0.218182@1, 0.309091@1, 0.4@1, 0.490909@1, 0.581818@1, 0.672727@1, 0.763636@1, 0.854545@1, 0.945455@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.58 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.27 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.3 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.15

**Nearest timing neighbors (Jaccard):** rotterdam-collision (0.3182), terror-geometry (0.2692), concrete (0.15)

**Fingerprint:** 0:0;1:0;1:35714;3:36364;2:50000;1:107143;0:125000;3:127273;1:178571;3:218182;0:250000;2:250000;3:309091;1:321429;3:400000;2:450000;1:464286;3:490909;0:500000;3:581818;1:607143;2:650000;3:672727;0:750000;1:750000;3:763636;2:850000;3:854545;1:892857;3:945455

## Acid Singularity (acid-singularity)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 162 · **Common period:** 1 bars · **Shared phase groups:** 2.
**Musical role:** Narrow techno foundation against two contrasting resonant acid patches.
**Mathematical design:** Prime periods 7:11:13:5 with separately shifted arguments. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 0.309017 + 0.951057i | 72 | 7 | 1 | technoKick | 0.028571, 0.171429, 0.314286, 0.457143, 0.6, 0.742857, 0.885714 | 0.028571@1, 0.1@0.46, 0.171429@1, 0.314286@1, 0.457143@1, 0.6@1, 0.742857@1, 0.885714@1 |
| 2 | -0.222521 + 0.974928i | 102.857143 | 11 | 1 | acidPsychedelic | 0.025974, 0.116883, 0.207792, 0.298701, 0.38961, 0.480519, 0.571429, 0.662338, 0.753247, 0.844156, 0.935065 | 0.025974@1, 0.028571@0.7, 0.071429@0.38, 0.116883@1, 0.207792@1, 0.298701@1, 0.38961@1, 0.480519@1, 0.571429@1, 0.662338@1, 0.753247@1, 0.844156@1, 0.935065@1 |
| 3 | -0.900969 + 0.433884i | 154.285714 | 13 | 1 | fmPerc | 0.032967, 0.10989, 0.186813, 0.263736, 0.340659, 0.417582, 0.494505, 0.571429, 0.648352, 0.725275, 0.802198, 0.879121, 0.956044 | 0.032967@1, 0.10989@1, 0.186813@1, 0.263736@1, 0.340659@1, 0.417582@1, 0.494505@1, 0.571429@1, 0.648352@1, 0.725275@1, 0.802198@1, 0.879121@1, 0.956044@1 |
| 4 | 0.309017 + 0.951057i | 72 | 5 | 1 | acidDark | 0.04, 0.24, 0.44, 0.64, 0.84 | 0.04@1, 0.24@1, 0.44@1, 0.64@1, 0.84@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.44 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.22 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.17 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.23

**Nearest timing neighbors (Jaccard):** euclidean-fragments (0.0641), industrial-fracture (0.0571), hardtek-mobius (0.0469)

**Fingerprint:** 1:25974;0:28571;1:28571;2:32967;3:40000;1:71429;0:100000;2:109890;1:116883;0:171429;2:186813;1:207792;3:240000;2:263736;1:298701;0:314286;2:340659;1:389610;2:417582;3:440000;0:457143;1:480519;2:494505;1:571429;2:571429;0:600000;3:640000;2:648352;1:662338;2:725275;0:742857;1:753247;2:802198;3:840000;1:844156;2:879121;0:885714;1:935065;2:956044

## Prime Number Riot (prime-number-riot)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 175 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Three robust gabber accents chase five metal beats and a terse melodic rave stab.
**Mathematical design:** 3:5:7:11 — all prime root degrees, unlike the related Acid Reactor arrangement. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 3 | 1 | gabberKick | 0, 0.333333, 0.666667 | 0@1, 0.166667@0.46, 0.333333@1, 0.666667@1 |
| 2 | -0.5 + 0.866025i | 120 | 5 | 1 | metallic | 0.066667, 0.266667, 0.466667, 0.666667, 0.866667 | 0@0.7, 0.066667@1, 0.166667@0.38, 0.266667@1, 0.466667@1, 0.666667@1, 0.866667@1 |
| 3 | -0.809017 + 0.587785i | 144 | 7 | 1 | raveStab | 0.057143, 0.2, 0.342857, 0.485714, 0.628571, 0.771429, 0.914286 | 0.057143@1, 0.2@1, 0.342857@1, 0.485714@1, 0.628571@1, 0.771429@1, 0.914286@1 |
| 4 | 0.62349 + 0.781831i | 51.428571 | 11 | 1 | acidClassic | 0.012987, 0.103896, 0.194805, 0.285714, 0.376623, 0.467532, 0.558442, 0.649351, 0.74026, 0.831169, 0.922078 | 0.012987@1, 0.103896@1, 0.194805@1, 0.285714@1, 0.376623@1, 0.467532@1, 0.558442@1, 0.649351@1, 0.74026@1, 0.831169@1, 0.922078@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.7 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.35 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.26 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.19

**Nearest timing neighbors (Jaccard):** acid-reactor (0.234), poly-3-5 (0.1143), afro (0.0976)

**Fingerprint:** 0:0;1:0;3:12987;2:57143;1:66667;3:103896;0:166667;1:166667;3:194805;2:200000;1:266667;3:285714;0:333333;2:342857;3:376623;1:466667;3:467532;2:485714;3:558442;2:628571;3:649351;0:666667;1:666667;3:740260;2:771429;3:831169;1:866667;2:914286;3:922078

## Eleven Against Seven (eleven-against-seven)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 146 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Sparse heavy low-frequency events and rapidly shifting light FM patterns.
**Mathematical design:** Seven against eleven is the foreground relation; five and thirteen form a subdued counter-layer. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 7 | 1 | hardcoreKick | 0, 0.142857, 0.285714, 0.428571, 0.571429, 0.714286, 0.857143 | 0@1, 0.071429@0.46, 0.142857@1, 0.285714@1, 0.428571@1, 0.571429@1, 0.714286@1, 0.857143@1 |
| 2 | -0.900969 + 0.433884i | 154.285714 | 11 | 1 | fmPerc | 0.038961, 0.12987, 0.220779, 0.311688, 0.402597, 0.493506, 0.584416, 0.675325, 0.766234, 0.857143, 0.948052 | 0@0.7, 0.038961@1, 0.084416@0.38, 0.12987@1, 0.220779@1, 0.311688@1, 0.402597@1, 0.493506@1, 0.584416@1, 0.675325@1, 0.766234@1, 0.857143@1, 0.948052@1 |
| 3 | 0.309017 + 0.951057i | 72 | 5 | 1 | hat | 0.04, 0.24, 0.44, 0.64, 0.84 | 0.04@1, 0.24@1, 0.44@1, 0.64@1, 0.84@1 |
| 4 | -0.900969 − 0.433884i | -154.285714 | 13 | 1 | acidIndustrial | 0.043956, 0.120879, 0.197802, 0.274725, 0.351648, 0.428571, 0.505495, 0.582418, 0.659341, 0.736264, 0.813187, 0.89011, 0.967033 | 0.043956@1, 0.120879@1, 0.197802@1, 0.274725@1, 0.351648@1, 0.428571@1, 0.505495@1, 0.582418@1, 0.659341@1, 0.736264@1, 0.813187@1, 0.89011@1, 0.967033@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.42 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.25 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.2 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.16

**Nearest timing neighbors (Jaccard):** schranz-machinery (0.1233), euclidean-fragments (0.1216), poly-4-7 (0.0612)

**Fingerprint:** 0:0;1:0;1:38961;2:40000;3:43956;0:71429;1:84416;3:120879;1:129870;0:142857;3:197802;1:220779;2:240000;3:274725;0:285714;1:311688;3:351648;1:402597;0:428571;3:428571;2:440000;1:493506;3:505495;0:571429;3:582418;1:584416;2:640000;3:659341;1:675325;0:714286;3:736264;1:766234;3:813187;2:840000;0:857143;1:857143;3:890110;1:948052;3:967033

## Mechanical Paradox (mechanical-paradox)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 168 · **Common period:** 1 bars · **Shared phase groups:** 1.
**Musical role:** Rotating machinery pulses and destabilized metallic accents.
**Mathematical design:** 9:13:7:11, with nonzero phases to avoid universal downbeat collisions. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | -0.5 + 0.866025i | 120 | 9 | 1 | technoKick | 0.037037, 0.148148, 0.259259, 0.37037, 0.481481, 0.592593, 0.703704, 0.814815, 0.925926 | 0.037037@1, 0.092593@0.46, 0.148148@1, 0.259259@1, 0.37037@1, 0.481481@1, 0.592593@1, 0.703704@1, 0.814815@1, 0.925926@1 |
| 2 | -0.222521 + 0.974928i | 102.857143 | 13 | 1 | metallic | 0.021978, 0.098901, 0.175824, 0.252747, 0.32967, 0.406593, 0.483516, 0.56044, 0.637363, 0.714286, 0.791209, 0.868132, 0.945055 | 0.021978@1, 0.037037@0.7, 0.06044@0.38, 0.098901@1, 0.175824@1, 0.252747@1, 0.32967@1, 0.406593@1, 0.483516@1, 0.56044@1, 0.637363@1, 0.714286@1, 0.791209@1, 0.868132@1, 0.945055@1 |
| 3 | -0.5 + 0.866025i | 120 | 7 | 1 | raveStab | 0.047619, 0.190476, 0.333333, 0.47619, 0.619048, 0.761905, 0.904762 | 0.047619@1, 0.190476@1, 0.333333@1, 0.47619@1, 0.619048@1, 0.761905@1, 0.904762@1 |
| 4 | -0.959493 + 0.281733i | 163.636364 | 11 | 1 | noiseBurst | 0.041322, 0.132231, 0.22314, 0.31405, 0.404959, 0.495868, 0.586777, 0.677686, 0.768595, 0.859504, 0.950413 | 0.041322@1, 0.132231@1, 0.22314@1, 0.31405@1, 0.404959@1, 0.495868@1, 0.586777@1, 0.677686@1, 0.768595@1, 0.859504@1, 0.950413@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.48 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.23 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.18 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.14

**Nearest timing neighbors (Jaccard):** broken-reactor (0.0933), poly-2-3 (0.0185), poly-4-7 (0.0182)

**Fingerprint:** 1:21978;0:37037;1:37037;3:41322;2:47619;1:60440;0:92593;1:98901;3:132231;0:148148;1:175824;2:190476;3:223140;1:252747;0:259259;3:314050;1:329670;2:333333;0:370370;3:404959;1:406593;2:476190;0:481481;1:483516;3:495868;1:560440;3:586777;0:592593;2:619048;1:637363;3:677686;0:703704;1:714286;2:761905;3:768595;1:791209;0:814815;3:859504;1:868132;2:904762;0:925926;1:945055;3:950413

## Terror Geometry (terror-geometry)

**Group:** new mathematical study · **Category:** hardcore · **BPM:** 220 · **Common period:** 1 bars · **Shared phase groups:** 2.
**Musical role:** Fast low-end impacts and densely shifting high-frequency shards, peak-controlled.
**Mathematical design:** 4:7:9:13 four-lane polyrhythm: a fixed four-root kick against independently offset seven, nine and thirteen-root layers. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 4 | 1 | gabberKick | 0, 0.25, 0.5, 0.75 | 0@1, 0.125@0.46, 0.25@1, 0.5@1, 0.75@1 |
| 2 | 0 + 1i | 90 | 7 | 1 | noiseBurst | 0.035714, 0.178571, 0.321429, 0.464286, 0.607143, 0.75, 0.892857 | 0@0.7, 0.035714@1, 0.107143@0.38, 0.178571@1, 0.321429@1, 0.464286@1, 0.607143@1, 0.75@1, 0.892857@1 |
| 3 | -0.809017 + 0.587785i | 144 | 9 | 1 | acidScreaming | 0.044444, 0.155556, 0.266667, 0.377778, 0.488889, 0.6, 0.711111, 0.822222, 0.933333 | 0.044444@1, 0.155556@1, 0.266667@1, 0.377778@1, 0.488889@1, 0.6@1, 0.711111@1, 0.822222@1, 0.933333@1 |
| 4 | -0.222521 + 0.974928i | 102.857143 | 13 | 1 | metallic | 0.021978, 0.098901, 0.175824, 0.252747, 0.32967, 0.406593, 0.483516, 0.56044, 0.637363, 0.714286, 0.791209, 0.868132, 0.945055 | 0.021978@1, 0.098901@1, 0.175824@1, 0.252747@1, 0.32967@1, 0.406593@1, 0.483516@1, 0.56044@1, 0.637363@1, 0.714286@1, 0.791209@1, 0.868132@1, 0.945055@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.55 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.23 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.13 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.11

**Nearest timing neighbors (Jaccard):** rotterdam-collision (0.28), frenchcore-spiral (0.2692), broken-reactor (0.2097)

**Fingerprint:** 0:0;1:0;3:21978;1:35714;2:44444;3:98901;1:107143;0:125000;2:155556;3:175824;1:178571;0:250000;3:252747;2:266667;1:321429;3:329670;2:377778;3:406593;1:464286;3:483516;2:488889;0:500000;3:560440;2:600000;1:607143;3:637363;2:711111;3:714286;0:750000;1:750000;3:791209;2:822222;3:868132;1:892857;2:933333;3:945055

## Complex Roots Overload (complex-roots-overload)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 186 · **Common period:** 1 bars · **Shared phase groups:** 1.
**Musical role:** Intentionally dense prime-degree texture, with reduced per-lane gain for clarity.
**Mathematical design:** 7:11:13:17 – four individually uniform but collectively intricate time sets. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 0.62349 + 0.781831i | 51.428571 | 7 | 1 | hardcoreKick | 0.020408, 0.163265, 0.306122, 0.44898, 0.591837, 0.734694, 0.877551 | 0.020408@1, 0.091837@0.46, 0.163265@1, 0.306122@1, 0.44898@1, 0.591837@1, 0.734694@1, 0.877551@1 |
| 2 | 0.415415 + 0.909632i | 65.454545 | 11 | 1 | fmPerc | 0.016529, 0.107438, 0.198347, 0.289256, 0.380165, 0.471074, 0.561983, 0.652893, 0.743802, 0.834711, 0.92562 | 0.016529@1, 0.020408@0.7, 0.061983@0.38, 0.107438@1, 0.198347@1, 0.289256@1, 0.380165@1, 0.471074@1, 0.561983@1, 0.652893@1, 0.743802@1, 0.834711@1, 0.92562@1 |
| 3 | 0.120537 + 0.992709i | 83.076923 | 13 | 1 | hoover | 0.017751, 0.094675, 0.171598, 0.248521, 0.325444, 0.402367, 0.47929, 0.556213, 0.633136, 0.710059, 0.786982, 0.863905, 0.940828 | 0.017751@1, 0.094675@1, 0.171598@1, 0.248521@1, 0.325444@1, 0.402367@1, 0.47929@1, 0.556213@1, 0.633136@1, 0.710059@1, 0.786982@1, 0.863905@1, 0.940828@1 |
| 4 | -0.273663 + 0.961826i | 105.882353 | 17 | 1 | metallic | 0.017301, 0.076125, 0.134948, 0.193772, 0.252595, 0.311419, 0.370242, 0.429066, 0.487889, 0.546713, 0.605536, 0.66436, 0.723183, 0.782007, 0.84083, 0.899654, 0.958478 | 0.017301@1, 0.076125@1, 0.134948@1, 0.193772@1, 0.252595@1, 0.311419@1, 0.370242@1, 0.429066@1, 0.487889@1, 0.546713@1, 0.605536@1, 0.66436@1, 0.723183@1, 0.782007@1, 0.84083@1, 0.899654@1, 0.958478@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.34 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.18 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.14 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.13

**Nearest timing neighbors (Jaccard):** breakcore-prime-shards (0.1268), 303-pressure (0), acid-303 (0)

**Fingerprint:** 1:16529;3:17301;2:17751;0:20408;1:20408;1:61983;3:76125;0:91837;2:94675;1:107438;3:134948;0:163265;2:171598;3:193772;1:198347;2:248521;3:252595;1:289256;0:306122;3:311419;2:325444;3:370242;1:380165;2:402367;3:429066;0:448980;1:471074;2:479290;3:487889;3:546713;2:556213;1:561983;0:591837;3:605536;2:633136;1:652893;3:664360;2:710059;3:723183;0:734694;1:743802;3:782007;2:786982;1:834711;3:840830;2:863905;0:877551;3:899654;1:925620;2:940828;3:958478

## Hardtek Möbius (hardtek-mobius)

**Group:** new mathematical study · **Category:** hardcore · **BPM:** 178 · **Common period:** 1 bars · **Shared phase groups:** 3.
**Musical role:** Hardtek bounce, pitched kick contour and short saturated acid responses.
**Mathematical design:** 5:7:9:4, with a four-root accompaniment countering the odd cycles. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 5 | 1 | frenchcoreKick | 0, 0.2, 0.4, 0.6, 0.8 | 0@1, 0.1@0.46, 0.2@1, 0.4@1, 0.6@1, 0.8@1 |
| 2 | 0.309017 + 0.951057i | 72 | 7 | 1 | raveStab | 0.028571, 0.171429, 0.314286, 0.457143, 0.6, 0.742857, 0.885714 | 0@0.7, 0.028571@1, 0.1@0.38, 0.171429@1, 0.314286@1, 0.457143@1, 0.6@1, 0.742857@1, 0.885714@1 |
| 3 | -0.5 + 0.866025i | 120 | 9 | 1 | fmPerc | 0.037037, 0.148148, 0.259259, 0.37037, 0.481481, 0.592593, 0.703704, 0.814815, 0.925926 | 0.037037@1, 0.148148@1, 0.259259@1, 0.37037@1, 0.481481@1, 0.592593@1, 0.703704@1, 0.814815@1, 0.925926@1 |
| 4 | 0 + 1i | 90 | 4 | 1 | acidHard | 0.0625, 0.3125, 0.5625, 0.8125 | 0.0625@1, 0.3125@1, 0.5625@1, 0.8125@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.5 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.33 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.19 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.22

**Nearest timing neighbors (Jaccard):** industrial-fracture (0.3125), minimal (0.1395), poly-3-5 (0.0857)

**Fingerprint:** 0:0;1:0;1:28571;2:37037;3:62500;0:100000;1:100000;2:148148;1:171429;0:200000;2:259259;3:312500;1:314286;2:370370;0:400000;1:457143;2:481481;3:562500;2:592593;0:600000;1:600000;2:703704;1:742857;0:800000;3:812500;2:814815;1:885714;2:925926

## Breakcore Prime Shards (breakcore-prime-shards)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 190 · **Common period:** 1 bars · **Shared phase groups:** 1.
**Musical role:** Dislocated kick and snare accents interleave with high-rate percussive noise.
**Mathematical design:** 7:5:11:3 and independent cyclic offsets, not a conventional 16-step break. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 0.62349 + 0.781831i | 51.428571 | 7 | 1 | hardcoreKick | 0.020408, 0.163265, 0.306122, 0.44898, 0.591837, 0.734694, 0.877551 | 0.020408@1, 0.091837@0.46, 0.163265@1, 0.306122@1, 0.44898@1, 0.591837@1, 0.734694@1, 0.877551@1 |
| 2 | 0.309017 + 0.951057i | 72 | 5 | 1 | snare | 0.04, 0.24, 0.44, 0.64, 0.84 | 0.020408@0.7, 0.04@1, 0.14@0.38, 0.24@1, 0.44@1, 0.64@1, 0.84@1 |
| 3 | 0.841254 + 0.540641i | 32.727273 | 11 | 1 | noiseBurst | 0.008264, 0.099174, 0.190083, 0.280992, 0.371901, 0.46281, 0.553719, 0.644628, 0.735537, 0.826446, 0.917355 | 0.008264@1, 0.099174@1, 0.190083@1, 0.280992@1, 0.371901@1, 0.46281@1, 0.553719@1, 0.644628@1, 0.735537@1, 0.826446@1, 0.917355@1 |
| 4 | -0.5 + 0.866025i | 120 | 3 | 1 | reese | 0.111111, 0.444444, 0.777778 | 0.111111@1, 0.444444@1, 0.777778@1 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.44 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.42 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.15 · L4: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.24

**Nearest timing neighbors (Jaccard):** complex-roots-overload (0.1268), rotterdam-collision (0.0556), broken-reactor (0.0149)

**Fingerprint:** 2:8264;0:20408;1:20408;1:40000;0:91837;2:99174;3:111111;1:140000;0:163265;2:190083;1:240000;2:280992;0:306122;2:371901;1:440000;3:444444;0:448980;2:462810;2:553719;0:591837;1:640000;2:644628;0:734694;2:735537;3:777778;2:826446;1:840000;0:877551;2:917355

## Euclidean Fragments (euclidean-fragments)

**Group:** new mathematical study · **Category:** experimental · **BPM:** 170 · **Common period:** 1 bars · **Shared phase groups:** 2.
**Musical role:** Prime pulse layers with a distinct five-out-of-sixteen Euclidean accent line.
**Mathematical design:** 7:11:13:5 nth-root base sets plus explicit E(5,16) on the last instrument. A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.

| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |
|---|---|---:|---:|---:|---|---|---|
| 1 | 1 + 0i | 0 | 7 | 1 | technoKick | 0, 0.142857, 0.285714, 0.428571, 0.571429, 0.714286, 0.857143 | 0@1, 0.071429@0.46, 0.142857@1, 0.285714@1, 0.428571@1, 0.571429@1, 0.714286@1, 0.857143@1 |
| 2 | 0.62349 + 0.781831i | 51.428571 | 11 | 1 | metallic | 0.012987, 0.103896, 0.194805, 0.285714, 0.376623, 0.467532, 0.558442, 0.649351, 0.74026, 0.831169, 0.922078 | 0@0.7, 0.012987@1, 0.058442@0.38, 0.103896@1, 0.194805@1, 0.285714@1, 0.376623@1, 0.467532@1, 0.558442@1, 0.649351@1, 0.74026@1, 0.831169@1, 0.922078@1 |
| 3 | 0.568065 + 0.822984i | 55.384615 | 13 | 1 | acidDark | 0.011834, 0.088757, 0.16568, 0.242604, 0.319527, 0.39645, 0.473373, 0.550296, 0.627219, 0.704142, 0.781065, 0.857988, 0.934911 | 0.011834@1, 0.088757@1, 0.16568@1, 0.242604@1, 0.319527@1, 0.39645@1, 0.473373@1, 0.550296@1, 0.627219@1, 0.704142@1, 0.781065@1, 0.857988@1, 0.934911@1 |
| 4 | 0.309017 + 0.951057i | 72 | 5 | 1 | shaker | 0.04, 0.24, 0.44, 0.64, 0.84 | 0.04@1, 0.125@0.38, 0.24@1, 0.375@0.38, 0.44@1, 0.5625@0.38, 0.64@1, 0.75@0.38, 0.84@1, 0.9375@0.38 |

**Operations, patches and accents:** L1: union, 1 additional sets, no Euclidean overlay, patch default, gain 0.52 · L2: union, 2 additional sets, no Euclidean overlay, patch default, gain 0.25 · L3: union, 0 additional sets, no Euclidean overlay, patch default, gain 0.17 · L4: union, 0 additional sets, E(5,16), patch default, gain 0.17

**Nearest timing neighbors (Jaccard):** eleven-against-seven (0.1216), schranz-machinery (0.1154), house (0.069)

**Fingerprint:** 0:0;1:0;2:11834;1:12987;3:40000;1:58442;0:71429;2:88757;1:103896;3:125000;0:142857;2:165680;1:194805;3:240000;2:242604;0:285714;1:285714;2:319527;3:375000;1:376623;2:396450;0:428571;3:440000;1:467532;2:473373;2:550296;1:558442;3:562500;0:571429;2:627219;3:640000;1:649351;2:704142;0:714286;1:740260;3:750000;2:781065;1:831169;3:840000;0:857143;2:857988;1:922078;2:934911;3:937500