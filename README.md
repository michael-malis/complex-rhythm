# ROOTS / RHYTHM

An interactive rhythm experiment built around the **nth roots of complex numbers**.

For each of four instruments, set `z = a + bi` and a root degree `n`. The arguments of the resulting complex roots become rhythmic hit positions on four concentric circles. Tap **Слушать** to hear the rhythm and watch the rotating beat hand.

**Live site (once Pages is enabled):** https://michael-malis.github.io/complex-rhythm/

## Presets

30 built-in patterns in 7 categories:

- Bunker techno — 5
- Other / mathematical polyrhythms — 5
- Drum & Bass — 4
- Jungle — 4
- Brazilian-inspired — 4
- Hard House — 4
- Acid / 303-inspired — 4

These are mathematically constrained **genre-inspired sketches**. Each instrument produces equally spaced hits per bar, so the model does not yet support arbitrary breakbeat patterns, accents, swing, or melodic sequences.

14 synthesised sounds include kick, snare, clap, hats, rim click, tom, sub bass, shaker, Reese bass, acid synth, surdo, agogô, and tamborim.

## Start

Open `index.html` directly in a modern browser or visit the GitHub Pages site once enabled. No libraries, installation, external assets or network required. A tap/click is required to unlock browser audio.

- Select a category and preset.
- Tap/click a circle or an instrument row to select one of four tracks.
- Choose a sound and edit `a`, `b`, `n` (1–24).
- Tap **▶ Звук** to preview a sound.
- Use **Файлы** to import/export `roots-rhythm/1` JSON.

## Mathematical model

For `z != 0`, root arguments are `(arg(z) + 2πk) / n` for `k = 0, ..., n-1`. Only the argument changes hit timing, not the magnitude. The four displayed ring radii are purely visual.

## Publishing

An automated GitHub Pages workflow lives at `.github/workflows/pages.yml`. If the URL is not yet active, a repository administrator must open **Settings → Pages → Build and deployment → Source: GitHub Actions** and rerun the Pages workflow under **Actions**. A workflow file alone does not guarantee that Pages is enabled for a newly created repository.
