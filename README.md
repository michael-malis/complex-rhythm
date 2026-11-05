# ROOTS / RHYTHM — complex-root rhythm laboratory

**Live URL (if GitHub Pages is enabled):** https://michael-malis.github.io/complex-rhythm/

A mathematical music experiment with four concentric rings. For each sound, the arguments of the `n`th roots of `z = a + bi` specify evenly spaced beat locations.

## Audio upgrade v3

- 30 reworked presets across bunker techno, classic polyrhythm, drum & bass, jungle, Brazilian-inspired, hard house, and acid / 303 categories.
- Drum presets now use recognisable backbeats and genre-conscious BPMs.
- Fifteen locally hosted, independently decoded CC0 WAV sample entries (14 distinct sounds) for kicks, snare, clap, hats, rim/tick, tom, and shaker. Attribution and exact provenance in [AUDIO_SOURCES.md](AUDIO_SOURCES.md).
- Synthesised Reese, bass, acid and Brazil-inspired percussion voices are retained.
- Multiple complex-root sets per instrument can be **unioned** to express syncopated fills and quieter ghost notes. The advanced sets are in a collapsible editor, keeping the main `a,b,n` model intact.
- Sample loading is asynchronous and non-blocking: fallback Web Audio synth works offline or when sample files are missing.

## Musical limitation

A short loop of equal-spaced complex roots, even as a union of sets, is still **not an exact reconstruction** of classic Amen breaks, a complete Brazilian percussion ensemble, or a fully articulated TB-303 melody. These are plausible groove sketches, not recordings or artist-specific recreations. Full realism will eventually need velocity envelopes, pitch/gate sequencer and possibly sample slicing.

## Run

For full sampled sound, use the GitHub Pages version or download the **whole repository ZIP** and serve its directory with a static web server, e.g. `python -m http.server 8000`. Launch `http://localhost:8000`. The standalone `index.html` alone works without network, with synth fallback.

To enable Pages: Settings → Pages → Build and deployment → Source: GitHub Actions (the `.github/workflows/pages.yml` deploys `index.html` and `samples/`).

## Data

`roots-rhythm/1` JSON remains backward compatible: old files with 4 tracks and only `a,b,n,sound,muted` continue to import. New track entries may include up to five `layers` with `a,b,n,velocity`, whose root arguments are combined with the main set. Duplicate points are deduplicated.
