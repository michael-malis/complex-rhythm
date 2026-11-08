# Rhythm Studio — active backlog

This is the **only active task ledger**. Work is organized by independently verifiable outcomes, not by specification sentences. Technical guarantees and automated evidence live in [PRODUCT_GUARANTEES.md](PRODUCT_GUARANTEES.md). Historical records remain available solely in Git history and are not counted or required for closure.

**Statuses:** `TODO` (not started), `IN_PROGRESS` (work is underway), `BLOCKED` (external input is unavailable, with reason below), `DONE` (result accepted with linked evidence). No numeric completion percentage is inferred from this list. The app can be deployed by passing CI while human review remains unverified; **published ≠ accepted**.

## Engineering results

| ID | Result | Status | Depends on | Done when | Evidence / next action |
|---|---|---|---|---|---|
| BUNK-01 | Record actual six-preset Bunker sound baseline and five distinct target arrangements | DONE | - | Six existing IDs, phases, sounds and attacks measured; the protected `dust` config is snapshotted; each of five other IDs has a concrete kick/bass/percussion design. Audio-engine gaps are demonstrated before any engine change. | [Six-preset source baseline and five designs](docs/BUNKER_GROOVE_BASELINE.md); [50-preset audit](https://github.com/michael-malis/complex-rhythm/actions/runs/42512578722) and [WAV/phase regression](https://github.com/michael-malis/complex-rhythm/actions/runs/42512578705). |
| BUNK-02 | Driving / Hypnotic Techno: `berlin-bass-wall` | DONE | BUNK-01 | Four quarter-note kicks per bar remain clear; supporting bass/rumble and hypnotic accents are genuinely redesigned rather than tempo/label edits; root-source provenance is intact. | [PR #67](https://github.com/michael-malis/complex-rhythm/pull/67), [CI: eight kick attacks, 46 scheduled events and real samples under limiter](https://github.com/michael-malis/complex-rhythm/actions/runs/42512578705); human listening remains AUDIO-01. |
| BUNK-03 | Raw Underground Techno: `concrete` | DONE | BUNK-01 | Clear four-on-floor foundation with distinctive dry percussion, raw bass and accents; demonstrably different from other Bunker patterns. | [PR #68](https://github.com/michael-malis/complex-rhythm/pull/68); [full math/audio/browser regression of the Raw preset](https://github.com/michael-malis/complex-rhythm/actions/runs/42523644955); [source-generated 50-preset diversity check](https://github.com/michael-malis/complex-rhythm/actions/runs/42524119801). Human listening remains AUDIO-01 and is not certified here. |
| BUNK-04 | Acid Techno: `pressure` | DONE | BUNK-01 | Four-on-floor kick plus an intentional acid voice/phrase and intelligible low end; independently different from the other four variants. | [PR #69](https://github.com/michael-malis/complex-rhythm/pull/69), [decoded Bunker drums + dedicated acid synth, source timing and limiter test](https://github.com/michael-malis/complex-rhythm/actions/runs/42528757141), [50-preset structural diversity verification](https://github.com/michael-malis/complex-rhythm/actions/runs/42528757122). Subjective listening remains AUDIO-01, not an implied PASS. |
| BUNK-05 | Industrial Techno: `shaft` | TODO | BUNK-01 | Four-on-floor kick and musically organized metallic/FM/noise accents, without noise or distortion obscuring the pulse. | Commit preset changes with scheduled-event and offline audio evidence. |
| BUNK-06 | Hard Groove Techno: `iron` | TODO | BUNK-01 | Four-on-floor kick, purposeful syncopation and forceful percussion; not merely a faster version of another pattern. | Commit preset changes with scheduled-event and offline audio evidence. |
| BUNK-07 | Integrate and technically validate the five Bunker results | TODO | BUNK-02, BUNK-03, BUNK-04, BUNK-05, BUNK-06 | All five produce distinct canonical event structures; real quarter-kick onsets, mix peaks, root/visual/audio synchronization and import compatibility pass. `Dust · Half-light` and the other 44 non-Bunker core presets and existing user-data semantics stay unchanged. Full CI passes on proposed HEAD. | Add focused regression and before/after analysis; change `synthesis.js` only if measured need is demonstrated. |

## Independent external acceptance (not engineering blockers)

| ID | Result | Status | Depends on | Done when | Evidence / next action |
|---|---|---|---|---|---|
| AUDIO-01 | Real, risk-based human audition | BLOCKED | BUNK-07 | Dated listening notes on all five changed Bunker presets, unchanged Dust, affected sound programs and a representative sample of other presets; verify kick clarity, bass balance, musical distinctness and absence of clipping/distortion. Fix audible regressions and re-listen. | External listener/playback equipment and changed Bunker builds are not yet available. Do not label automated waveform metrics as listening. |
| ACCESS-01 | Physical mobile and assistive-technology review | BLOCKED | - | Test touch, keyboard, root dragging, focus, screen-reader names and real device layout; record device/browser/AT, defects and retests. Automated accessibility stays active independently. | Physical-device and screen-reader observations not yet documented. Does not block unrelated development. |

## Product acceptance (one decision, not another test suite)

| ID | Result | Status | Depends on | Done when | Evidence / next action |
|---|---|---|---|---|---|
| RELEASE-01 | Confirm the final quality and release evidence | TODO | BUNK-07, AUDIO-01 | Exact final commit has green mandatory browser/math/audio/compatibility CI and successful Pages release; no unresolved critical defects; mandatory music listening is completed and accessibility evidence is recorded or an explicitly approved accessibility exception is disclosed as **not verified**. Never silently promote a partial/manual check to PASS. | Review [PRODUCT_GUARANTEES.md](PRODUCT_GUARANTEES.md), [Actions](https://github.com/michael-malis/complex-rhythm/actions) and current defects only after prerequisites. |

**Independence:** `BUNK-02…06` may run in parallel once `BUNK-01` is complete. The two external reviews are separate from day-to-day engineering. The final acceptance decision does not retroactively redefine the status of a completed preset change. New work is added here only for a distinct unimplemented user outcome or a concrete regression.
