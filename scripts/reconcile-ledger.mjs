/**
 * Reconcile traceability with *already executed* CI evidence.
 * Does not infer completion merely because an implementation file exists.
 * Run only after reviewing GitHub Actions artifact evidence and code at the
 * referenced SHAs. Missing human/visual acceptance remains BLOCKED/TODO.
 */
import fs from "node:fs";

const CI="https://github.com/michael-malis/complex-rhythm/actions/runs/";
const testRun=42107150484;
const verified=new Map();
const register=(ids,what,sha="0fab137afaa17e1bbb2ed1e46f3a6104948ce2fa")=>{
 for(const id of ids)verified.set(id,{
  evidence: "CI:"+testRun+"; "+what,
  commit:sha
 });
};
register([
 "R-QM-001","R-QM-002","R-QM-003","R-QM-004","R-QM-005",
 "R-QM-006","R-QM-007","R-QM-008","R-QM-009","R-QM-010",
 "R-QM-011","R-QM-012"
],"tests/math-io.test.mjs; tests/ui-smoke.mjs; 60 math + 144 UI assertions");
register([
 "R-MDL-003","R-MDL-004","R-MDL-005"
],"math-io.js; tests/ui-smoke.mjs; 3:4 LCM; multi-operand intersection",
"1a631b6d1a87ab8a78f83cb8e8580c8de667f8e3");
register(["R-ENG-001","R-ENG-002"],
 "tests/audio-mix-stress.mjs; 50 schedule comparisons; 0.354ms onset",
 "87787b1dab2fa46838868b482b1ac02e52a2d191");
register(["R-PST-005"],
 "tests/preset-diversity.mjs; PRESET_DIVERSITY_REPORT.md; 50 unique timelines",
 "9019a0ea803ad45002c717ffdefd96de2d91c731");
register(["R-PST-003"],
 "tests/preset-diversity.mjs; PRESET_DIVERSITY_REPORT.md; 35+15=50 studies",
 "9019a0ea803ad45002c717ffdefd96de2d91c731");
register(["R-SND-002"],
 "synthesis.js; tests/audio-offline.mjs; 6 acid voices with distinct signals",
 "87787b1dab2fa46838868b482b1ac02e52a2d191");
register(["R-PROC-003"],
 "scripts/verify-traceability.mjs; three-way registry validation",
 "f742ada1b57cf7944d05b7a8400177e8bba111dc");
register(["R-TEX-003"],
 "tests/spec-ui.mjs; KaTeX vertical 1/4 1/2 3/4 in 12 theme/viewport combinations");
register(["R-NUM-001","R-NUM-002","R-NUM-005","R-NUM-006"],
 "tests/spec-ui.mjs; tests/math-io.test.mjs; four-quadrant round-trips; zero; n64");
// Additional requirements closed only after complete successful regression evidence.
// 42121936951 includes all 35 legacy JSON imports plus explicit unknown-field tests,
// 231 responsive touch targets and the 12-state mathematical typography matrix.
const recentEvidence=[
 ['R-ENG-004','CI:42121936951; tests/legacy-json-compat.mjs; all 35 originals preserve BPM, instruments and phases; unknown fields reject safely','638400ca797e9286a6da38ff01c705fb1ff30013'],
 ['R-UI-008','CI:42121936951; tests/touch-targets.mjs 231 mobile controls >=44x44; tests/ui-smoke.mjs 44px Canvas dragging','a6a3aa7bc115ee8ca0a2539c4c7f7007f6d8877e'],
 ['R-PST-001','CI:42119466325; PRESET_INVENTORY.md 50 itemized coordinate/phase/sound/patch/fingerprint/nearest-neighbor audits','ed4c5d965c3137d59a2a61c814a5916325b8a449'],
 ['R-UI-002','CI:42121936951; tests/spec-ui.mjs all 14 typographic roles in 12 theme/viewport states','7bd76326640bc99e86275f9362aaa1e5ec168fce'],
 ['R-TEX-001','CI:42121936951; KaTeX 0.16.22 local html+MathML; ten annotated math references across 12 states','f6f8daf8351b2291c28f77dcf19d97623aae13e8']
];
for(const [req,evidence,commit] of recentEvidence)verified.set(req,{evidence,commit});
for(const [req,evidence,commit] of [
 ['R-UI-001','CI:42123915938; 90 application CSS font sizes >=16px; Chromium 14 responsive theme cases, >=16px text; math wrappers >=18px','2e7a486ecf0ac36240c5261e7cb944c064073ba1'],
 ['R-NUM-008','CI:42123915938; 146 math assertions; 42 relative-error polar cases and 100 repeated UI coordinate/unit toggles; abs 1e-8 and rel 1e-10','f5364e734c61b79514eb28b4879b360ae83aa8bb'],
 ['R-ENG-003','CI:42123915938; tests/transport-switching.mjs 24 live transitions; all lanes/math/audio updated, no bus or sample leak, no old scheduler timer','28d5fb7e60c03669ae44c99815ca3d2c8162d7d3']
])verified.set(req,{evidence,commit});
// Newly proven requirements: both acceptance tests completed in real CI.
verified.set('R-MDL-001',{
 evidence:'CI:42132119969; tests/event-properties.mjs 400 deterministic independent phase/source/patch/articulation checks; math-io.js single planEvents source; app.js draw and Web Audio share events()',
 commit:'a07982dbb001583ccf1f177d3baea6de8a8bd92e'
});
verified.set('R-PST-002',{
 evidence:'CI:42131998402; tests/preset-diversity.mjs 12 of 15 new studies have non-four-on-the-floor first lane; PRESET_DIVERSITY_REPORT.md checks repeated patterns across remaining lanes',
 commit:'e205a59c57817c8e667189cb66fa15bbdb8ab882'
});
// Verified independently by real Canvas pixels + source-preserving audio planner.
verified.set('R-GEO-004',{
 evidence:'CI:42132894856; tests/collision-lanes.mjs physical pixel samples on two concentric rings, distinct colors; 32 preserved sound attacks at 16 shared moments; 40/24 after R4∪R3',
 commit:'cb67646bf5e02f5ae237ed4737e775bd68363c1c'
});
verified.set('R-MDL-006',{
 evidence:'CI:42132894856; tests/collision-lanes.mjs user-visible base=4, added=3, unique=6, cross-lane shared=16; counts from live events() and RhythmMath.analyzeSchedule',
 commit:'e91651707fe6e6dd01ba636621636be41197f42c'
});
// Safe syntax, deliberate input validation and canonical-value preservation were
// exercised in real Chromium and Node; bad text remains editable with a visible error.
verified.set('R-NUM-004',{
 evidence:'CI:42133490570; tests/expression-safety.mjs 11 valid examples, 22 rejected strings, 200 deterministic complex inputs and 11 browser editor actions; input preserved on error',
 commit:'46d4e1a0f95d0832c437c06fbdd7053af9e16a3f'
});
verified.set('R-GEO-006',{
 evidence:'CI:42133680561; tests/collision-lanes.mjs; Canvas pixel samples at phase 0 top, 1/4 right, 1/2 bottom, 3/4 left; consistent clockwise visual time and standard complex argument',
 commit:'e3ab63d758d63e91e38d8349c2ae8fc2e0897e92'
});
verified.set('R-NUM-007',{
 evidence:'CI:42133963106; tests/four-lane-polar.mjs; all 4 lanes independent Cartesian/Polar and radian/degree edits; MathML alternative forms; zero argument disabled and restored',
 commit:'2e32063cccc3205c53863c0aec8225989883d015'
});
verified.set('R-GEO-005',{
 evidence:'CI:42134902723; tests/live-edit-reschedule.mjs real Canvas pointer drag while playing, modulus and degree invariant, root phases evenly spaced, Cartesian/polar/KaTeX synchronized, old Web Audio buses flushed',
 commit:'100fbb465d99a73aa95ea895b0caed4c504c8c9a'
});
// New exact browser/math/audio evidence: full Actions matrix succeeded.
for(const [req,what] of [
 ['R-QT-001','12 viewport/theme states, all required typeset formula families, semantic MathML, no raw TeX'],
 ['R-QT-002','degree, coefficient and Canvas drag changes recompute all live mathematical formulas'],
 ['R-QT-004','light/dark formula matrix, zero KaTeX errors and hidden clipping'],
 ['R-QA-001','12 theme/viewport cases and expanded-panel screenshots']
]) verified.set(req,{
 evidence:'CI:42151010633; tests/formula-acceptance.mjs; tests/ui-smoke.mjs; '+what,
 commit:'cd3cd36e7cc0fe52585bcde157c6f7982316da30'
});
// Two acceptance gates verified by completed browser and audio workflows.
// These are engineering proofs; no subjective listening approval is inferred.
verified.set('R-MDL-002',{
 evidence:'CI:42152395065; tests/required-polyrhythms.mjs; 8 selectable poly-ratios and independent second-lane argument with other lanes invariant',
 commit:'4f692c8da50ef8e465f6ba7cc3c72dcc43f6711c'
});
verified.set('R-QA-003',{
 evidence:'CI:42161224683; tests/new-preset-live-qa.mjs; 15 running-study loads, active phase edits, Web Audio cleanup; tests/audio-mix-stress.mjs validates 50 schedules and bounded peak',
 commit:'095cd389cd1400b6f574b07a8f57d0274657e36a'
});
// Actual Canvas fill pixels, four-ring radii and full 12-case responsive matrix
// passed, including 64th-degree dense-root magnification. Minimum diameter
// required by R-GEO-001 is enforced without fabricating a maximum size.
verified.set('R-GEO-001',{
 evidence:'CI:42162929618; tests/geometry-acceptance.mjs 12 viewport/theme cases with 16 actual cardinal pixels each, measured base marker >=28px, four rings and 64th-root scrollable magnification',
 commit:'e0c9dc70defac2bd78cd44e68a159cdda674e623'
});
// All eight geometry-acceptance actions now have observed passing evidence:
// real pixel radii/diameters and cardinal phases, rendered MathML labels,
// separate coincident events, actual drag, magnification and responsive cases.
// Twelve comparison screenshots plus measured geometry JSON are CI artifacts.
verified.set('R-GEO-007',{
 evidence:'CI:42209284567; tests/geometry-acceptance.mjs actual 28px+ Canvas diameters, 4 radii and 16 painted cardinal markers across 12 viewport/theme states; tests/formula-acceptance.mjs label placements; tests/collision-lanes.mjs simultaneous events; tests/ui-smoke.mjs dragging/resize; tests/spec-ui.mjs magnification; comparative screenshots',
 commit:'e0c9dc70defac2bd78cd44e68a159cdda674e623'
});
verified.set('R-UI-006',{
 evidence:"CI:42229288619; tests/responsive-content-access.mjs: 6 mandatory viewports × both themes; four-lane grid reflow, no text clipping or page-wide x overflow, critical controls remain reachable, 16px minimum, vertical scrolling, existing magnified plot; no global scale",
 commit:'bad7c7589519b1cc49667f7c956187f69676a63b'
});
verified.set('R-UI-007',{
 evidence:"CI:42229288619; tests/responsive-content-access.mjs, formula-acceptance.mjs, touch-targets.mjs, geometry-acceptance.mjs: 6 mandatory viewports × both themes; all critical controls, readouts and four rings accessible, no panel/lane overlap or clipping, proper font scales and zoom",
 commit:'bad7c7589519b1cc49667f7c956187f69676a63b'
});
verified.set('R-QT-003',{
 evidence:"CI:42229288619; tests/formula-geometry-complete.mjs: 10 mathematical KaTeX+MathML references and five additional root families across 6 viewport sizes × both themes; no formula/label overlap, clipping or off-center root displays, long formulas scroll; tests/accessibility-contrast.mjs thresholds pass",
 commit:'bad7c7589519b1cc49667f7c956187f69676a63b'
});
verified.set('R-UI-004',{
 evidence:"CI:42227657811; tests/expanded-ui-typography.mjs: all mandatory expanded panels, 37 selectable voice labels, 15 synth-specific control groups, generated root families, tooltips and 12 responsive theme/viewport states; all PASS",
 commit:'1f9e9eb8444ca345c7285343344bfad7d4da5419'
});
verified.set('R-UI-005',{
 evidence:"CI:42227657811; tests/accessibility-contrast.mjs: 14 actual light/dark viewport cases, 198 text samples per case (normal >=4.5:1, key mathematical/numeric >=7:1), track palette >=3:1, all 108 authored CSS font-size rules >=16px; light palette --ink #202420, --sub #414b47, --muted #46534e",
 commit:'1f9e9eb8444ca345c7285343344bfad7d4da5419'
});
// Responsive Canvas marker/ring/fraction/pointer geometry and event-aware
// pan/zoom are accepted only after the complete run including the mobile
// simultaneous-attack test passes.
verified.set('R-GEO-002',{
 evidence:"CI:42224570142; tests/geometry-acceptance.mjs, phase-label-adaptation.mjs (600 states), playback-hand-clearance.mjs (12,916 cases), animated-adjacent-ring-clearance.mjs (50 presets + live mobile audio), multi-lane-magnification.mjs; all R-GEO-002 conditions PASS",
 commit:'bddc6a4497d4f0c9b2ac234a2cecef6a000631ee'
});
verified.set('R-RES-001',{
 evidence:"CI:42233466514 genre-mapping source-to-technique validator PASS; RHYTHM_RESEARCH.md (five original URLs reverified 2026-11-05 and independent secondary sources); GENRE_IMPLEMENTATION_MATRIX.md 15 genre/real preset/BPM/root/voice rows and five source-technique-code-patch-test mappings; CI:42233466373 full UI/audio PASS; genre authenticity and human listening excluded",
 commit:'62511a44119f489739721f408117f70024351b55'
});
verified.set('R-RES-002',{
 evidence:"CI:42233466514 genre-mapping source-to-technique validator PASS; RHYTHM_RESEARCH.md (five original URLs reverified 2026-11-05 and independent secondary sources); GENRE_IMPLEMENTATION_MATRIX.md 15 genre/real preset/BPM/root/voice rows and five source-technique-code-patch-test mappings; CI:42233466373 full UI/audio PASS; genre authenticity and human listening excluded",
 commit:'62511a44119f489739721f408117f70024351b55'
});
verified.set('R-RES-003',{
 evidence:"CI:42233466514 genre-mapping source-to-technique validator PASS; RHYTHM_RESEARCH.md (five original URLs reverified 2026-11-05 and independent secondary sources); GENRE_IMPLEMENTATION_MATRIX.md 15 genre/real preset/BPM/root/voice rows and five source-technique-code-patch-test mappings; CI:42233466373 full UI/audio PASS; genre authenticity and human listening excluded",
 commit:'62511a44119f489739721f408117f70024351b55'
});
verified.set('R-PST-006',{evidence:"CI:42363730593 full UI/audio PASS on latest PR #38 head 548a487958f7ccef609ff37182c336a8f9308634; independent 50-preset diversity report CI:42363730599 PASS; tests/preset-musical-structure.mjs all 50 original root/phase/source/velocity/gain/instrument maps identical to 0.173s lookahead scheduler, no same-lane double trigger and preserved different-lane simultaneous hits, all 15 experimental studies documented with contrasting sparse/dense roles, at least two real first-degree soft ghost root overlays, an intentional kick/response shared phase, bounded density, distinct voices, exact base nth-root families preserved; 22nd independent measured report artifacts/preset-structure/report.json and readable STRUCTURE_REPORT.md; scripts/verify-preset-structure.mjs matches all 50 source-measured PRESET_STRUCTURE_AUDIT.md rows, preset-diversity.mjs unique rotations, all-presets-same-semantics.mjs source-preserving JSON round trips, audio-mix-stress.mjs 50 schedules. Human listening/genre judgement remains M13.",commit:"96f5c0d71d8bfed1c1c50471164d00b4e31bdf71"});
verified.set('R-SND-001',{evidence:"CI:42359549057 full UI/audio PASS; tests/mandatory-voice-inventory.mjs 14/14 original mandatory voice families selectable in real app, two desktop/mobile states, 14 distinct gain-normalized waveform PNGs per state (10 real Web Audio synth patches, 3 distinct decoded CC0 snare/closed/open-hat recordings, 1 dual-detuned-sawtooth Reese native synth fallback), non-silent finite source peaks, no changed complex-root phases, preset, scheduler or overflow; tests/percussion-sample-structure.mjs 7 decoded distinct local recordings; tests/native-waveform-coverage.mjs six real fallback audio graphs; tests/kick-architecture-differentiation.mjs 8 aggressive kick graph/audio renders and 6 normalized differences; tests/audio-offline.mjs all 15 original synth voices with spectra, envelope and onset; source-approved R-SND-003 Acid and R-SND-004 aggressive percussion. Human audition/device authenticity remains M13.",commit:"32d822bea31b4421cd77a295c4968de7d6eb1f31"});
verified.set('R-SND-003',{evidence:"CI:42240006060 full UI/audio PASS; tests/acid-parameter-response.mjs six acid voices, 15 pairwise waveform comparisons, 18 oscillator/filter/slide/drive/decay/accent/modulation renders; tests/audio-offline.mjs output spectral/attack and peak metrics; synthesis.js real oscillator, resonant biquad, filter envelope, waveshaper and pitch automation; synth controls preserved under Advanced sound settings. Human genre listening remains M13.",commit:'3b3ce2132c5fa8cad2c119323c794b993ba7b433'});
verified.set('R-TEX-004',{evidence:"CI:42317538760 full UI regression PASS; tests/formula-acceptance.mjs exactly 10 R-TEX-004 source expressions with KaTeX HTML plus MathML, no raw LaTeX/errors/clipping in 12 viewport/theme states; scripts/verify-math-typography-audit.mjs 12 genuine Chromium PNGs and annotated formula evidence; MATH_TYPOGRAPHY_AUDIT.md. Historic before/after R-TEX-008 remains open",commit:'4c23e0f77a8d9002c22e61439c351a6527f3d476'});
verified.set('R-SND-004',{evidence:"CI:42358463110 full UI/audio PASS on PR #34; synthesis.js independent four kick body/high-pass and per-voice low-pass graphs, actual pitch and gain envelopes, driven transient oscillators/waveshapers, gabber-specific saturation, frenchcore pitched overtone; tests/kick-architecture-differentiation.mjs 8 genuine Web Audio renders (4 kick types x 2 velocities), 6 pairwise gain-normalized waveform distances >.08, real filter/oscillator/drive graph node checks, bounded transient/body/tail and master -1 dBFS; tests/audio-offline.mjs 15 independently rendered voices incl metallic and fmPerc, RMS/spectral centroid/attack; tests/master-output-safety.mjs 32/48kHz dense mix/20Hz subsonic attenuation; tests/audio-mix-stress.mjs 50 presets and 256-voice stress. Human listening and genre authenticity remain M13.",commit:"ea4fb561c42fecddb96a7d1cfd6d3d9dfd7ac33e"});
verified.set('R-SND-005',{evidence:"CI:42348284633 full UI/audio PASS; PR #32 production shared limiter; tests/master-output-safety.mjs actual 20Hz highpass/2x oversampled 0.84 limiter across 32/48kHz, 48 root-timed concurrent synth hits, finite output and sample/4x-estimated intersample peak under -1 dBFS, measured 5Hz attenuation, 14ms smoothed master-gain changes without >.03 sample discontinuities and kick onset <5ms; tests/audio-mix-stress.mjs 50 patterns, 256 dense voices @22.05kHz and 128 @96kHz, bounded 4x estimated peak; audio-context-scheduler-proof.mjs, live-edit-reschedule.mjs and transport-phase-continuity.mjs. Human/device listening remains M13.",commit:"747c202ad35652f3c2d78e7b1dab5b9847254160"});
verified.set('R-SND-006',{evidence:"CI:42331875353 full UI/audio PASS; tests/audio-context-scheduler-proof.mjs observed native OscillatorNode.start(when) against AudioContext.currentTime and beatEpoch + RhythmMath.planEvents across desktop/mobile, max 12 ms event error, >=15 ms future-dated starts, two native oscillators per bass event, one lookahead interval and zero leaked timers; tests/transport-phase-continuity.mjs; tests/audio-mix-stress.mjs. Physical audio/listening acceptance remains M13.",commit:"851b3742a905b9556a2e5b23d24a80a2c3d896d3"});
verified.set('R-TEX-007',{evidence:"CI:42241763532 full UI/audio PASS; tests/math-live-input-stability.mjs 4 live 120-degree lane editors and additional point preserve focus/caret, exact phases, KaTeX/MathML and one scheduler; tests/live-edit-reschedule.mjs 41 rapid argument edits coalesced; tests/formula-acceptance.mjs and formula-geometry-complete.mjs no raw TeX, clipping, collisions or offscreen math in 12 layout states; tests/root-angle-infographic.mjs 4 lanes, zero/negative angles and audio phases.",commit:'a6d5c6718878e1946d54ac3a884e6f8dcb89cd69'});
// The real transport/Canvas regression proves >1.4x scale across multiple
// frames, audible-event timing, stationary reduced-motion brightness and no
// residual pulse after transport stops. Full UI/audio pipeline passed.
verified.set('R-GEO-003',{
 evidence:'CI:42209284567; tests/beat-visual-acceptance.mjs actual Canvas arc geometry with Web Audio transport; >=1.4x pulse across frames, reduced-motion stationary highlight and no paused-state effect',
 commit:'8c3356947218cb7dc7b19daf4c38ee363d970cc0'
});
// Twelve browser-driven canonical coordinate states, zero argument and
// degree/radian view switches passed in the complete regression.
verified.set('R-NUM-003',{
 evidence:'CI:42161727338; tests/canonical-argument.mjs; 12 a+bi states, principal argument in (-pi,pi], undefined arg(0), and 24 unit/view changes without canonical mutation',
 commit:'a299872995ea581b3e66e4f0d2a50f826c911bef'
});
const blocked=new Map([
 ["R-AUD-002",{
   evidence:"User image.png annotated control text recovered; second source reference remains unavailable; issues/2",
   defect:"FIX-VIS-001: Cannot certify second annotated source image"
 }],
 ["R-UI-003",{
   evidence:"User image.png annotated control text recovered; issue/2; tests/spec-ui.mjs",
   defect:"FIX-VIS-001: Full side-by-side source-annotation signoff pending"
 }],
 ["R-SND-007",{
   evidence:"CI:42107150484; 15 generated WAVs and technical metrics; issues/3",
   defect:"FIX-AUDIO-001: Required human listening not evidenced"
 }],
 ["R-PST-004",{
   evidence:"PRESET_DIVERSITY_REPORT.md; all 15 mathematically distinct; issues/3",
   defect:"FIX-AUDIO-001: Human musical evaluation of new studies pending"
 }]
]);
const active=new Set([
 "R-AUD-001","R-AUD-003","R-UI-001","R-UI-002","R-UI-004","R-UI-005",
 "R-UI-006","R-UI-007","R-UI-008","R-TEX-001","R-TEX-002","R-TEX-004",
 "R-TEX-005","R-TEX-006","R-TEX-007","R-TEX-008","R-GEO-001",
 "R-GEO-002","R-GEO-003","R-GEO-004","R-GEO-005","R-GEO-006",
 "R-GEO-007","R-NUM-003","R-NUM-004","R-NUM-007","R-NUM-008",
 "R-MDL-001","R-MDL-002","R-MDL-006","R-RES-001","R-RES-002",
 "R-RES-003","R-SND-001","R-SND-003","R-SND-004","R-SND-005",
 "R-SND-006","R-PST-001","R-PST-002","R-PST-006","R-ENG-003",
 "R-ENG-004","R-QT-001","R-QT-002","R-QT-003","R-QT-004",
 "R-QA-001","R-QA-002","R-QA-003","R-QA-004","R-QA-005",
 "R-FIN-001","R-FIN-002","R-FIN-003","R-FIN-004",
 "R-PROC-001","R-PROC-002","R-PROC-004","R-PROC-005",
 "R-PROC-006","R-PROC-007"
]);

const pathTask="TASKS.md";
let original=fs.readFileSync(pathTask,"utf8");
const parse=line=>line.split(/(?<!\\)\|/);
const byReq=new Map(),statusCount={VERIFIED:0,BLOCKED:0,IN_PROGRESS:0,TODO:0,FAILED:0};
const lines=original.split("\n").map(line=>{
 if(!/^\| T-[A-Z]+-\d+/.test(line))return line;
 const p=parse(line);
 if(p.length!==13)throw Error("Malformed 11-column task line: "+line.slice(0,100));
 const id=p[1].trim(),req=p[2].trim(),parent=p[3].trim();
 // Existing per-task verified evidence must never be erased by a partial
 // mapping: the ledger is monotonically reconciled, not regenerated from scratch.
 let status=p[8].trim(),evidence=p[9].trim(),defects=p[10].trim(),commit=p[11].trim();
 if(!['TODO','IN_PROGRESS','BLOCKED','FAILED','VERIFIED'].includes(status))
  throw Error('Unknown existing task status '+id+': '+status);
 if(verified.has(req)){
  const v=verified.get(req);
  status="VERIFIED";evidence=v.evidence;commit=v.commit;
 } else if(blocked.has(req)&&parent==="-"){
  const v=blocked.get(req);
  status="BLOCKED";evidence=v.evidence;defects=v.defect;
 } else if(req==="R-SND-007"&&parent!=="-"){
  const number=id.split("-").at(-1);
  if(["01","02","03","04","06","07"].includes(number)){
   status="VERIFIED";
   evidence="CI:42107150484; 15 WAV files, attack/RMS/8 envelope segments/spectral centroid";
   commit="87787b1dab2fa46838868b482b1ac02e52a2d191";
  }else if(number==="05"){
   status="IN_PROGRESS";evidence="tests/audio-offline.mjs; fundamental pitch estimation not yet documented";
  }
 }else if(req==="R-UI-003"&&parent!=="-"){
  status="IN_PROGRESS";evidence="tests/spec-ui.mjs and single recovered image.png; second annotation pending";
 }else if(active.has(req)&&parent==="-"&&status==="TODO"){
  status="IN_PROGRESS";evidence="Implementation available; requirement-wide acceptance pending";
 }
 p[8]=" "+status+" ";
 p[9]=" "+evidence+" ";
 p[10]=" "+defects+" ";
 p[11]=" "+commit+" ";
 statusCount[status]++;
 if(parent==="-")byReq.set(req,{status,evidence});
 return p.join("|");
});
if(Object.values(statusCount).reduce((a,b)=>a+b,0)!==652)throw Error("Expected 652 task rows");
if(byReq.size!==98)throw Error("Expected 98 requirement parents, got "+byReq.size);
fs.writeFileSync(pathTask,lines.join("\n"));

function changeRow(path,mode){
 const input=fs.readFileSync(path,"utf8");
 const rows=input.split("\n").map(line=>{
  if(!/^\| R-[A-Z]+-\d+ \|/.test(line))return line;
  const p=parse(line),req=p[1].trim(),state=byReq.get(req);
  if(!state)throw Error(path+" missing status of "+req);
  if(mode==="trace"){
    if(p.length!==8)throw Error("Bad traceability row "+req);
    p[5]=" "+state.evidence+" ";
    p[6]=" "+state.status+" ";
  }else{
    if(p.length!==7)throw Error("Bad acceptance row "+req);
    p[4]=" "+state.status+" ";
    p[5]=" "+state.evidence+" ";
  }
  return p.join("|");
 });
 fs.writeFileSync(path,rows.join("\n"));
}
changeRow("TRACEABILITY.md","trace");
changeRow("ACCEPTANCE_CRITERIA.md","acceptance");
const requirements=[...byReq];
const summary={
 generatedFrom:"Full UI/audio CI "+CI+"42209284567; baseline proof "+CI+testRun,
 tasks:statusCount,
 verifiedRequirementIds:requirements.filter(([id,v])=>v.status==="VERIFIED").map(([id])=>id),
 blockedRequirementIds:requirements.filter(([id,v])=>v.status==="BLOCKED").map(([id])=>id),
 note:"An engineering proof does not replace the missing human audio and original screenshot acceptance."
};
fs.writeFileSync("LEDGER_EVIDENCE_SUMMARY.json",JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify({requirements:byReq.size,tasks:statusCount,verifiedRequirements:summary.verifiedRequirementIds.length,
blockedRequirements:summary.blockedRequirementIds},null,2));
