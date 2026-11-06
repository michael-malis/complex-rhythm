# Rhythm Studio — active change register

This register records user-approved product changes independently from the legacy 651-row mechanical task ledger. It is not a declaration of acceptance or a replacement for the source specification.

## CR-ANG-001 · Angle-first root editor
**Priority:** P0 · **Status:** VERIFIED (automated engineering acceptance)

- The main parameter is the complex number argument θ, not its radius or Cartesian coordinates.
- Show **radians and degrees simultaneously** for each of four tracks; editing either changes the same canonical angle, never converting through a rounded display string.
- Accept safe rational-π forms such as π/2, 2π/3, −π/4 (alongside numeric radians). Preserve the edited text while it is being entered.
- Root degree n stays visible. Complex z is represented for timing by a unit vector; preserve legacy magnitudes and original JSON data until explicitly changed.
- Cartesian / legacy polar coordinates remain available as secondary information and compatible editing, not the primary interaction.

**Acceptance:** all lanes independent; round trip in both units; invalid input does not mutate complex state; n=1…64; zero-import edge case explicitly handled.

## CR-ANG-002 · Directly specified extra angles
**Priority:** P0 · **Status:** VERIFIED (automated engineering acceptance)

- “Add angle” creates one event on the selected track with a directly specified argument φ in radians and degrees.
- “Generate roots” remains an optional way to add a symmetric set of n evenly spaced phases from a complex argument; no selecting/deleting individual points on Canvas.
- Distinct input angles colliding with existing events sound once within the same lane, but remain separate between lanes.
- Reuse the current layer representation for JSON/preset backward compatibility; a single added event is n=1.

**Acceptance:** add/edit/remove; safe π/n conversion; full symmetric family for n>1; mathematically exact source event provenance; imported older multi-root layers remain editable.

## CR-ANG-003 · Root-angle infographic
**Priority:** P1 · **Status:** VERIFIED (automated engineering acceptance)

Display a compact, readable, always-available KaTeX explanation near the selected track:

\[\theta_k=\frac{\theta+2\pi k}{n}\pmod{2\pi},\qquad k=0,\ldots,n-1.\]

- θ is the argument of the underlying complex number; θ/n is the angle of its first principal root.
- The complex plane remains mathematically truthful. A displayed ring represents time, not the modulus |z|.
- Changing θ rotates the rhythm; changing n changes the number of equally spaced events.
- Show Cartesian z=a+bi only as secondary information.

**Acceptance:** KaTeX + MathML, labels, readable across mobile and desktop, consistent with the actual root scheduler.

## CR-ANG-004 · Compatibility and release gate
**Priority:** P0 · **Status:** IN_PROGRESS

- Keep all 35 historical presets, 15 new studies, audio scheduling, the existing JSON schema and root-set operations intact.
- Add dedicated tests for angle-first editing, extra angles, generated families, phase coincidences and import/export.
- Only change statuses to VERIFIED after passing tests. Human sonic assessment, physical-device review and the missing annotated screenshot remain separate blockers.

## CR-PRESET-005 · Preserve example identity after user edits
**Priority:** P1 · **Status:** VERIFIED (automated engineering acceptance)

- Editing a prepared rhythm (BPM, instrument, root angle/degree, root additions, sound patch or volume) **must not replace its title with “Custom rhythm.”**
- Keep the original preset ID, title, category, and description; append **“· Modified”** to the selected option.
- Selecting any prepared example afresh resets the modified flag.
- A genuinely new or anonymous project can still be “Custom rhythm.” An imported JSON with a matching preset name inherits the title, marked Modified; unknown imported names remain visible.
- JSON export must retain the original title, so future import can recover the source identity without extending the existing schema.

**Acceptance:** edit BPM and root; confirm original name remains selected; verify new selection resets status; verify JSON roundtrip maintains source name; avoid false “Custom rhythm” label. No user-facing popup necessary.

### Acceptance evidence for verified engineering changes

Angle-first editing, dual-unit synchronization, direct single-angle additions, symmetric generated families, phase-source provenance, JSON roundtrip and preservation of named modified presets passed in [full regression 42151010633](https://github.com/michael-malis/complex-rhythm/actions/runs/42151010633), including `tests/angle-first.mjs` and `tests/preset-modified.mjs`. Human sound evaluation, physical-device/screen-reader signoff and the second annotated source screenshot remain explicit separate release blockers under CR-ANG-004. The term VERIFIED above covers executable engineering criteria, not final production approval.

## CR-UX-001 · Persistent rhythm example browser

**Priority:** P1 · **Status:** VERIFIED (full automated UI/audio regression passed)

The Rhythm examples section is expanded on initial page load on desktop and mobile. The user can still collapse it intentionally.

Browsing a new category **must filter the example dropdown only**; it must not automatically replace the current loaded preset, reset Modified state, change BPM or root sets, restart the transport, or affect the audio/sample category. The currently loaded preset remains identifiable while browsing another category. Only explicitly choosing an example changes the loaded rhythm. Selecting a preset by mathematical ratio is still an explicit load action. New JSON import and explicit preset selection keep the displayed category synchronized with the loaded preset.

**Acceptance:** desktop/mobile Chromium tests with an active Web Audio transport, zero unintended state changes while browsing five categories, and explicit selection of a new example while playback remains active. Tests: `tests/preset-category-navigation.mjs`, `tests/preset-modified.mjs`, `tests/ui-smoke.mjs`.

## CR-PLAN-002 · Consolidated operational task list

**Priority:** P0 · **Status:** VERIFIED (14-item plan and exact historical coverage tested)

The 652-row `TASKS.md` is retained as an immutable historical acceptance/evidence ledger. Daily execution and project updates use **14 outcome-focused macro tasks** in `NEXT_EXECUTION_PLAN.md`, each with dependencies, measurable exit tests and exact original `R-*` mappings. This reduces the **active work list** without discarding verified or blocked evidence or silently waiving any of the 98 original acceptance requirements.

**Acceptance:** every originally unverified requirement is mapped to exactly one macro task; no duplicates/missing IDs; statuses of historic tasks unchanged by planning; unapproved feature candidates excluded from mandatory counters.

**CI proof:** [42213078501](https://github.com/michael-malis/complex-rhythm/actions/runs/42213078501) passed the full UI/audio regression, including category navigation on 1440px and 390px, preset identity, all 50 presets and the consolidated 14-task coverage validator.

## CR-RHYTHM-003 · Unified beat triggering and rhythm interaction semantics

**Priority:** P0 · **Status:** TODO (planning completed; implementation and dedicated acceptance pending)

**Scope:** tighten and unify existing rules only. This change neither adds a product feature nor introduces a new independent macro task; execute under **M08** (Web Audio / transport / event triggering) and **M10** (mathematical consistency and musical structure across the 50 presets).

- Every audible strike starts from the same canonical phase event produced by the complex-root/added-angle/Euclidean model. Sound and Canvas/time-window visualization use the same event data. Preserve lane-specific cycle lengths, source provenance and per-event accent/velocity.
- Intra-lane coincident roots merge where set-union semantics require it; coincident strikes from different lanes remain distinct. Do not homogenize the instruments, patterns, genre identities or rhythm formulas.
- Define a consistent behavior for Play, Pause, Resume, Reset, explicit preset selection, ratio selection, JSON import and live changes of root arguments, degrees, BPM, additional layers, cycle length and audio patch. Browser category filtering never triggers a new rhythm.
- Use the already implemented Web Audio clock, scheduler, and safe voice cancellation. Prevent duplicate timers, stale notes, lost attacks and unwanted phase jumps after live edits or preset switching.
- Ensure visual hit pulses follow real audio scheduling, without changing the mathematical root positions. Keep accessible reduced-motion feedback.

**Acceptance:** compare canonical events, actual audio event schedules and rendered event counts in all four lanes across all 50 presets; verify simultaneous hits and overlap semantics, four-lane high-density tests, Play/Pause/Resume/Reset, live edits, preset changes, JSON and required polynomial ratios including `7:11:13:17` and `4:7:9:13`. Retain prior passing evidence, repair actual defects and run complete regression at the implementation SHA. Musical/auditory human acceptance remains separately blocked under M13.

**Specification:** see `NEXT_EXECUTION_PLAN.md` section “Unified rhythm-triggering model”. **No new features and no increase from 14 macro tasks.**
