# M10 — Musical structure of complex-root rhythm studies

## Scope and invariant

Rhythm Studio is a mathematical exploration tool. Each lane still derives its core events from the n-th roots of its specified nonzero complex number. Music and animation both consume the **same canonical event model**; sound is an audible interpretation of that mathematics, not a hidden step sequencer.

This change addresses the **15 experimental studies** that formerly used uniform strong-velocity root events and per-lane gain settings without meaningful in-lane soft accents. The first 35 original catalog configurations, all 50 IDs, BPMs, root-degree quartets, instrument choices and base complex numbers are preserved. Existing Euclidean additions remain intact.

## How every experimental groove is structured

1. **Independent density:** Each of four lanes retains its original n-root base; the contrasting values of n create sparse low-end and faster supporting activity. Per-lane gain remains separate and independent.
2. **Intentional collision:** The first bass/kick root in lane 1 has the same phase as a *single-root* soft response newly added to lane 2. These are two **different** instruments and remain two simultaneous hits; a root repeated within the **same** lane is merged with retained provenance.
3. **Real low-velocity pickups:** Lane 1 gains one .46-velocity root halfway between its consecutive n-th-root times; lane 2 gains one .38-velocity root halfway between its own consecutive root times. The shared response is velocity .70. All are exact first-degree complex roots, not arbitrary time-grid data.
4. **A musical statement:** The source `character` and `mathNote` of each experimental study now explain the shared anchor and ghost notes. The unchanged originals retain their own mathematical organization. The user sees these descriptions via the existing preset information.
5. **Bounded and independent:** Two extra soft pickups and one shared response per experimental study; no new timer, sample layer, new instrument category or extra DAW control. The sound's master ceiling and real AudioContext scheduler remain unchanged.

The visual circles, four colored orbit hands, timeline and sound planner resolve the augmented event sets from the same `events(track)`. In particular a base and an extra root coinciding in the same lane never double-trigger; two distinct lanes are never collapsed into one sound.

## Reproducible audit

`tests/preset-musical-structure.mjs` executes against the real application and records `artifacts/preset-structure/report.json` and `artifacts/preset-structure/STRUCTURE_REPORT.md`. It audits **all 50 original catalog presets**, four independent lanes, no duplicate lane phases, original base roots, event source and velocity provenance, lookahead scheduling equivalence in 0.173-second slices, and original sound identities. It separately requires **all 15 experimental studies** to show two source-backed quiet accents, one deliberate cross-lane coincidence, distinct lane density, at least three instrument roles and actual musical/math explanations.

The report is the **22nd independently validated CI measurement**. Quantitative evidence does not prove musical appeal, perceived sound quality, or authenticity to a genre. Those remain a separate human/device acceptance scope under M13.
