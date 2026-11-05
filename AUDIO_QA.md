# ROOTS / RHYTHM v4 verification

- [x] JavaScript syntax checked with Node.js `node --check`.
- [x] 34 presets, 7 categories, including 4 two-bar Bossa Nova presets with 104–128 BPM.
- [x] Bossa cross-stick 3+2 rhythm and soft drum pattern encoded as the union of first complex roots; two bars per revolution.
- [x] Chromium automated smoke: viewport widths 320, 375, 390, 430, 768, 1024, 1440, 1920 px; no horizontal page overflow or JavaScript page errors.
- [x] Automated tests: switch categories and presets, show correct BPM, show '2 такта', PLAY/PAUSE state, switch back to 1-bar DnB.
- [x] License verified: upstream Virtuosity Drums and house-core declare CC0.
- [x] New audio paths verified against upstream GitHub raw binary read and pushed as Git blobs.
- [!] Production listening (actual new WAV/FLAC payloads) not verified in an externally networked browser in this session; browser navigation to localhost and file:/// was administrator-blocked. Chromium DOM smoke used set_content and its local fallback for playback. No subjective claim of mastering quality.
- [ ] Test actual deployed GitHub Pages WAV/FLAC requests and audio unlock behavior on iOS Safari / Android Chrome.
- [ ] Human listening review for tonal balance of low bass, snare and shakers across devices.

## Bunker Bass Wall extension

- [x] Added one (not several) Berlin Bunker flagship preset, 146 BPM, selected first when loading the app and when selecting Bunker.
- [x] Time-phase math: kick is `z=1,n=4`, rumble is `z=-1,n=4` (offbeat); all points remain complex roots.
- [x] Two original generated bass WAV files stored in `samples/`; GitHub API read confirms both WAV headers start with `RIFF/WAVE`.
- [x] Node.js `--check` of inline app JavaScript succeeded.
- [x] Headless Chromium DOM smoke at 320, 375, 390, 430, 768, 1024, 1440, and 1920px: 0 JavaScript exceptions, 0 horizontal page overflows; selected preset and BPM verified.
- [x] Chromium Play/Pause clicks exercised at 390px with no reported exception, using synth fallback in browser test environment.
- [!] Real-world subjective audio monitoring (studio headphones/speakers and phone) and actual live GitHub Pages sample decoding have not been demonstrated in this automated check.
