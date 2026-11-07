import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(path)=>{
 assert.ok(fs.existsSync(path),'Required real CI measurement missing: '+path);
 const obj=JSON.parse(fs.readFileSync(path,'utf8'));
 assert.ok(obj&&typeof obj==='object','Measurement must be machine-readable JSON: '+path);
 return obj;
};
const tests=[];
const check=(name,file,validate,scope)=>{
 const data=read(file);
 const evidence=validate(data);
 tests.push({name,file,scope,...evidence});
};
check('computed WCAG colors','artifacts/contrast-audit.json',d=>{
 assert.ok(d.measured?.length>=12,'light/dark computed contrast measurement matrix is incomplete');
 assert.ok(d.measured.every(x=>Array.isArray(x.failed)&&!x.failed.length&&
  Array.isArray(x.graphics)&&!x.graphics.length),'color/graphic contrast failures cannot be ignored');
 return {measuredStates:d.measured.length};
},'Real CSS computed colors and graphic contrast, not screenshot estimates');
check('interactive hit areas','artifacts/touch-target-audit.json',d=>{
 assert.ok(d.minimumCssPx>=44,'minimum touch target must be at least 44 CSS pixels');
 assert.ok(d.results?.length>=3,'small/mobile/tablet touch audit was not completed');
 assert.ok(d.results.every(x=>Array.isArray(x.failures)&&x.failures.length===0),
  'undersized touch targets must fail QA');
 return {measuredStates:d.results.length,thresholdCssPx:d.minimumCssPx};
},'Real clickable bounding boxes at mobile widths');
check('actual root Canvas geometry','artifacts/geometry/measurements.json',d=>{
 assert.equal(d.referenceOriginalDotDiameterPx,14,'historical before marker diameter evidence');
 assert.ok(d.minimumMarkerDiameterPx>=28,'visible root markers must remain doubled');
 assert.ok(d.viewportCases>=12,'all required geometry viewport/theme states');
 assert.ok(d.assertions>0,'geometry result must contain executed measurements');
 return {measuredStates:d.viewportCases,markerDiameterCssPx:d.minimumMarkerDiameterPx,assertions:d.assertions};
},'Actual Canvas pixels and marker measurements, not made-up icon dimensions');
check('responsive reachability','artifacts/responsive/content-access.json',d=>{
 assert.equal(d.status,'PASS');
 assert.ok(d.cases>=12&&d.report?.length===d.cases,'all responsive states must have actual samples');
 return {measuredStates:d.cases};
},'No clipping, unavailable controls or page-wide horizontal overflow');
check('expanded labels and controls','artifacts/expanded-ui-typography.json',d=>{
 assert.equal(d.status,'PASS');
 assert.ok(d.report?.length>=12,'expanded controls must be tested in two themes');
 return {measuredStates:d.report.length};
},'Actual element font sizes, accessible names and synth options');
check('phase-label collisions','artifacts/geometry/phase-label-adaptation.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.checkedPresets,50,'all original source presets must be inspected');
 assert.ok(d.cases>=12&&d.report?.length===d.cases,'all required phase geometry states');
 assert.ok(d.report.every(x=>x.failedPresets===0&&!x.runtimeErrors?.length),
  'an actual marker/label collision cannot be declared green');
 return {measuredStates:d.cases,presets:d.checkedPresets};
},'Per-preset computed ring geometry, independent of screenshot aesthetics');
check('KaTeX DOM and browser screenshots','artifacts/math-typography-audit/summary.json',d=>{
 assert.equal(d.status,'AUTOMATED_PASS');
 assert.equal(d.screens,12);assert.equal(d.referenceFormulas,10);
 assert.equal(d.liveLocations,16);assert.equal(d.phaseLabels,4);
 assert.equal(d.screenshotFileCount,12);
 return {measuredStates:d.screens,referenceFormulas:10,liveMathLocations:16};
},'KaTeX+MathML runtime source and 12 authentic Chromium PNGs');
check('offline sound and spectral metrics','artifacts/audio-renders/metrics.json',d=>{
 assert.equal(d.sampleRate,32000,'audio metrics require known sample rate');
 assert.equal(d.voices?.length,15,'all 15 original synthesized programs must be measured');
 return {synthPrograms:d.voices.length,sampleRate:d.sampleRate};
},'Actual rendered audio buffers; no human listening claim');
check('multi-lane audio load','artifacts/audio-mix-stress.json',d=>{
 assert.ok(d.catalog?.length>=50,'full 50-preset stress schedule required');
 assert.ok(d.onset&&Number.isFinite(d.onset.driftMs),'actual audio clock/onset measurement required');
 return {presets:d.catalog.length,onsetDriftMs:d.onset.driftMs};
},'OfflineAudioContext multi-lane output, transport and event planning');
check('audio-clock transport phase continuity','artifacts/transport-phase-continuity.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.tests,2,'desktop and mobile AudioContext phase scenarios required');
 assert.equal(d.cases?.length,2);
 for(const item of d.cases){
  assert.ok(item.created>0&&item.created===item.cleared,
   'transport must leave no live scheduling interval after Reset and Pause');
  assert.ok(item.phaseAfterRunningReset<.04||item.phaseAfterRunningReset>.96,
   'running Reset must restart at the beginning of the rhythmic cycle');
  assert.equal(item.afterPausedReset,0);
  assert.equal(item.errors,0);
 }
 return {measuredStates:d.cases.length,phaseVerified:true};
},'AudioContext-backed Pause/Resume/BPM/Reset phases, no stale schedulers');
check('per-lane colors and focused wheel controls','artifacts/controls-and-lane-colors/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.cases?.length,4,'desktop/mobile by light/dark is required');
 assert.ok(d.cases.every(x=>x.independentColors&&x.radWheelPiOver180&&
  x.degreeWheelOne&&x.volumeWheelStepOnePercent&&x.liveHitCountChanged&&
  x.unchangedScheduler&&x.noOverflow),
  'root-matched color controls and focused 1-degree wheel edits must all pass');
 return {measuredStates:d.cases.length,distinctLanes:4};
},'Independent global/lane colors, pi/180 rad/degree wheel edits, live root count and audio scheduler');
check('four audio-locked orbit hands','artifacts/orbital-hands/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.cases?.length,4,'desktop/mobile and light/dark orbit-hand measurements required');
 assert.ok(d.cases.every(x=>x.drawnArcs===4&&x.sameLengthSynchronized&&
  x.halfAndQuarterSpeed&&x.scheduledNotesChecked>=20&&
  x.preciseReducedMotion&&x.tempoAndLiveEdit&&x.pauseResumeReset&&x.errors===0),
  'all four Canvas hand tips must match actual per-lane AudioContext/scheduled root phases');
 return {measuredStates:d.cases.length,actualColoredPlayheads:4};
},'Measured Canvas arc strokes and exact planEvents sound times for four 1/1/2/4-bar hands');
check('real AudioContext native oscillator scheduling','artifacts/audio-clock-scheduling/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.cases?.length,2,'desktop and mobile real oscillator traces required');
 for(const c of d.cases){
  assert.ok(c.actualOscillatorStarts>=8&&c.actualDistinctSoundEvents>=4,
   'actual Web Audio oscillator start calls must be measured, not a synthetic event count');
  assert.equal(c.nativeOscillatorsPerHit,2);
  assert.ok(c.maxAbsoluteEventErrorMs<12,
   'oscillator timestamps must match the mathematical scheduled root hits');
  assert.ok(c.maxFutureLeadMs>=15,
   'AudioContext.start(time) future scheduling must be observed');
  assert.ok(c.scheduledFromAudioContext&&c.singleLookaheadInterval);
  assert.equal(c.leakedIntervals,0);assert.equal(c.errors,0);
 }
 return {measuredStates:d.cases.length,realOscillatorScheduling:true};
},'Observed OscillatorNode.start timestamps vs AudioContext.currentTime, beatEpoch and planned complex-root events');
check('responsive Sound Lab waveform','artifacts/sound-lab/measurements.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.results?.length,4);
 return {measuredStates:d.results.length};
},'Real sampled/synthesized waveform and instrument-local editor state');
check('native fallback waveform','artifacts/native-waveforms/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.results?.length,4);
 assert.ok(d.results.every(x=>x.voices?.length===6),
  'all six legacy voices must render real sound, not a placeholder');
 return {measuredStates:d.results.length,nativePrograms:6};
},'Real native Web Audio graphs shared with playback');
check('Acid diversity','artifacts/acid-presets/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.results?.length,4);
 return {measuredStates:d.results.length,acidPrograms:4};
},'Four different Acid programs and root-event densities; human taste is not measured');
check('song study preservation','artifacts/song-examples/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.cases,4);
 return {measuredStates:d.cases};
},'Original user-supplied JSON roots and export/import fidelity');
check('featured grooves and instrument gain','artifacts/production-grooves/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.results?.length,4);
 return {measuredStates:d.results.length};
},'Live on-lane gain, bongo routing and six featured grooves');
assert.equal(tests.length,18,'the independent release-evidence file inventory must remain exhaustive');
const output={status:'AUTOMATED_MEASUREMENTS_PASS',evidenceFiles:tests.length,
 note:'Every row was read from a test-generated local CI artifact. This is not a manual visual, auditory, phone-device or screen-reader acceptance and does not advance any historical requirement automatically.',
 tests};
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/release-evidence-manifest.json',JSON.stringify(output,null,2)+'\n');
console.log('PASS 18 real measured CI evidence files: orbital playhead timing, geometry, accessibility, formulas, transport, color/wheel input, audio and presets without human-acceptance claims');
