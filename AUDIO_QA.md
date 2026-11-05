# Audio QA — v3
- Source HTML validated with Node.js JavaScript syntax parser.
- Chromium desktop/mobile emulation: 320, 375, 390, 430, 768, 1024, 1440, 1920px; no horizontal overflow or page JS exceptions.
- Controls: change genre/preset, start/pause, select track, add extra complex-root layer; passed in local synth-fallback mode.
- Mathematical checks: 30 presets, four tracks each; nth-root phases unioned/deduplicated; each advanced layer is itself a complex number and root degree.
- CC0 provenance verified in house-core upstream LICENSE, manifest and LICENSES file. 15 sample destinations, 14 distinct WAV source files.
- Audio assets are fetched from the upstream GitHub repository and stored as Git blobs in this repository; WAV playback on a **live deployed site** is not yet confirmed by these local tests. Requires browser verification after Pages deploy.
- Actual listening quality and Safari/iOS audio activation need human/device verification.
