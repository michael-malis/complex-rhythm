# Manual acceptance register

Checks in this file need a person: ears, a real phone, a screen reader, or the owner's decision. The owner performs them.

They are **not** part of the engineering backlog ([TASKS.md](TASKS.md)), are **not** counted in any engineering readiness figure, and do **not** block technical completion or publication. Nothing here is ever marked as passed by an automated test. A finding that needs code becomes a new engineering task in TASKS.md.

**Statuses:** `NOT VERIFIED` (nobody has done it yet), `PASSED` (done, with date and notes), `FOUND ISSUES` (done, defects listed), `WAIVED` (the owner decided not to check).

| ID | What to check | How | Status | Notes |
|---|---|---|---|---|
| AUDIO-01 | Listening to the five revised Bunker presets, unchanged Dust, and a sample of other presets | Play each on real speakers or headphones: kick clarity, bass balance, distinct character, no clipping or distortion. Reference WAVs: [audition guide](docs/BUNKER_AUDITION_GUIDE.md). Tracking issue [#3](https://github.com/michael-malis/complex-rhythm/issues/3). | NOT VERIFIED | Automated audio analysis exists but is not a hearing test. |
| ACCESS-01 | Physical phone and assistive technology | On a real phone: touch, root dragging, tabs, focus. With a screen reader: names of the tabs, lane rows, plot and transport. Record device, browser and reader. Tracking issue [#65](https://github.com/michael-malis/complex-rhythm/issues/65). | NOT VERIFIED | Automated target-size, contrast and naming checks pass; they do not replace a device. |
| VISUAL-01 | The redesigned interface on real screens | Open Play and all five Lab tabs on a laptop, a large monitor and a phone, in both themes. Judge legibility, balance and whether anything feels cramped or lost. | NOT VERIFIED | New after the inspector redesign. Screenshots are attached to CI runs, but taste is the owner's call. |
| OWNER-01 | Decide the fate of the open Drift / Build modes pull request | Read [PR #79](https://github.com/michael-malis/complex-rhythm/pull/79): merge it (it then needs a rebase onto the redesigned page) or close it. Its sound was never listened to. | NOT VERIFIED | Left untouched on purpose: no new features are being added. |
