# Design system — one instrument, two depths

## Strategy

The earlier Lab was a separate page of forms with fifteen collapsible disclosures (rhythm examples, project files, time window, composition, operations, notes, sound lab, and two per lane). Content was hidden in different places of a long page, and Play and Lab looked like two products.

The interface now follows three rules.

1. **One shell.** Play and Lab share the plate with four rings, the transport pill, the rhythm picker and the lane cards. Lab is Play with an inspector, not another page.
2. **Tabs, not disclosures.** Everything that used to collapse has one fixed place in a five-tab inspector next to the figure. The page contains no `<details>` element.
3. **The figure stays put.** On wide screens the Lab is a single fixed frame: the plot never scrolls away while numbers are edited; only the inspector's content scrolls.

## Layout

| Width | Play | Lab |
|---|---|---|
| ≥ 1080px (and ≥ 600px tall) | fixed frame, stage left, picker and four lane cards right (from 980px) | fixed frame, stage left (0.8–0.9fr), picker + inspector right (1.1–1.2fr) |
| 600–1079px | flow; lanes in two columns; transport fixed at the bottom | flow: plot, transport pill, picker, sticky tab bar, panel |
| < 600px | flow; one column; transport fixed at the bottom | the same flow; tabs stack glyph over label; each lane becomes a small labelled form |

**Transport pill** (same component in both views): ↺ restart, ▶ play, tempo, master volume, then the two mode switches ↻ Drift and ≡ Build. Where the pill is narrow (phones in the Lab, the Lab frame below 1440px) it takes two rows: tempo on the first, volume and the mode switches on the second. On phones in Play the word "Tempo" is visually hidden (it stays in the accessible name) to leave the slider room. While a mode is on, a status pill under the bar counter reads `Drift 3/32` (step / grid, dot in the drifting lane's colour) and/or `Build 5/16`; phase labels on the plate move clear of it.

The lane layout follows the inspector's own width (container query `inspector`), not the viewport.

## Inspector tabs

`Lanes` · `Union` · `Time` · `Sound` · `Notes` (`role="tablist"`, arrow keys, Home/End). Each tab carries a mathematical glyph: *z*, ∪, *t*, ∿, §.

- **Lanes** — the parameter table. One row per lane: index tab in the lane colour (selects the lane), miniature ring (draggable), sound, mute, `θ` rad, `θ` °, `n`, bars; second line: volume and `z` with a three-way notation switch (`a + bi` / `r∠θ` / `f(z)`); third line: `z`, `|z|`, the set expression and the hit count. One header row names the columns. Under the table: the root-placement card of the selected lane (rule, values, unit-circle diagram, list of all arguments), always shown.
- **Union** — lane chips, Base / Added / Union strips first, then actions, added sets, rotation, set operation and Euclidean generator, selected-root formula, lane gain and preview.
- **Time** — four-bar timeline, common period, coincidence summary.
- **Sound** — waveform and synthesis parameters of one instrument.
- **Notes** — reference formulas, prose, how to read the figure.

In code a panel's `open` property is true while its tab is showing; assigning `true` shows that tab. Panels fire `toggle` when they change.

## Visual language

- Warm paper (`--page #f2efe8`), cards (`--card #fffdfa`) with a hairline and a soft shadow, radius 16px; fields radius 10px; buttons and chips are pills.
- Display face `KaTeX_Main` (the same serif as the formulas) for the wordmark, rhythm name, panel titles, numerals and mathematical labels such as `a + bi`; system sans for everything else.
- One text size: 16px (the floor). Hierarchy comes from the display face (19–24px), weight and colour, not from smaller text.
- Lane colours: terracotta `#ab5847`, sage `#567a63`, ochre `#967438`, plum `#80618a` (softened in the dark theme). A lane's ring, index tab, miniature, sliders and timeline marks share its colour. Transport and master volume use a separate blue.
- Dark theme: graphite page `#1b1c19`, cards `#242621`; same structure.

## Accessibility floor (enforced by tests)

- Text ≥ 16px; interactive targets ≥ 44×44px at phone and tablet widths.
- Contrast ≥ 4.5:1 for text, ≥ 7:1 for key numerals and mathematics, ≥ 3:1 for lane colours on the plot, in both themes and on every tab.
- No horizontal page overflow from 360px up; no global scaling or zoom.
- Every control has an accessible name; the tab bar, lane chips and notation switch expose their state (`aria-selected`, `aria-pressed`).
- `prefers-reduced-motion` removes transitions and animations.

## Mathematical contract (unchanged by design work)

For nonzero `z`, root phases are `(arg(z)+2πk)/(2πn) mod 1`. `z = 0` gives no base events. Additional sets combine as a union (or intersection) with 1e-6 tolerance including wraparound; coincident hits trigger once. Base-only events are filled circles, added-only hollow, shared doubly marked. Exactly four independent rings and four playheads on the audio clock.

## Files

`index.html` (structure, no inline CSS or JS), `styles.css` (tokens, shared shell, Play, Lab), `app.js` (model, audio, rendering, controls). No UI framework.
