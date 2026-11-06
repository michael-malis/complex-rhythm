# Rhythm Studio — active change register

This register records user-approved product changes independently from the legacy 651-row mechanical task ledger. It is not a declaration of acceptance or a replacement for the source specification.

## CR-ANG-001 · Angle-first root editor
**Priority:** P0 · **Status:** IN_PROGRESS

- The main parameter is the complex number argument θ, not its radius or Cartesian coordinates.
- Show **radians and degrees simultaneously** for each of four tracks; editing either changes the same canonical angle, never converting through a rounded display string.
- Accept safe rational-π forms such as π/2, 2π/3, −π/4 (alongside numeric radians). Preserve the edited text while it is being entered.
- Root degree n stays visible. Complex z is represented for timing by a unit vector; preserve legacy magnitudes and original JSON data until explicitly changed.
- Cartesian / legacy polar coordinates remain available as secondary information and compatible editing, not the primary interaction.

**Acceptance:** all lanes independent; round trip in both units; invalid input does not mutate complex state; n=1…64; zero-import edge case explicitly handled.

## CR-ANG-002 · Directly specified extra angles
**Priority:** P0 · **Status:** IN_PROGRESS

- “Add angle” creates one event on the selected track with a directly specified argument φ in radians and degrees.
- “Generate roots” remains an optional way to add a symmetric set of n evenly spaced phases from a complex argument; no selecting/deleting individual points on Canvas.
- Distinct input angles colliding with existing events sound once within the same lane, but remain separate between lanes.
- Reuse the current layer representation for JSON/preset backward compatibility; a single added event is n=1.

**Acceptance:** add/edit/remove; safe π/n conversion; full symmetric family for n>1; mathematically exact source event provenance; imported older multi-root layers remain editable.

## CR-ANG-003 · Root-angle infographic
**Priority:** P1 · **Status:** IN_PROGRESS

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
