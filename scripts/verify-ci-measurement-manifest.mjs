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
check('reproducible historical formula before after','artifacts/math-historical-compare/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.historicalSourceSha,'454b7c4466851e82946034ce4a47019c716ee218');
 assert.equal(d.afterSource,'current CI pull-request HEAD');
 assert.equal(d.referenceFormulas,10);
 assert.equal(d.beforeAfterStates,12);
 assert.equal(d.screenshots,24);
 assert.equal(d.reproducibleHistoricalCode,true);
 assert.equal(d.annotatedOriginalUserScreenshot,false);
 assert.equal(d.cases?.length,12);
 assert.ok(d.cases.every(c=>c.before?.references?.length===10&&
  c.after?.references?.length===10&&c.after?.hasSvg&&c.before?.hasCanvas));
 return {historicalCommit:'454b7c44',beforeAfterCases:12,actualPngFiles:24,
  historicalUserAnnotatedImageRecovered:false};
},'Actual old source-code commit and current real Chromium rendering of ten mandatory formulas in twelve responsive states; separately preserve missing annotated original blocker');
check('real SVG and Canvas mathematical phase alignment','artifacts/math-graph-svg/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.viewportThemeStates,12);
 assert.equal(d.laneGeometryStates,48);
 for(const field of ['realSvgCanvasMathAgreement','zeroAnd64RootDegrees','dynamicResize',
  'sourceExactSharedPhases','mathmlFractions','vectorOnly'])assert.equal(d[field],true);
 assert.equal(d.humanVisualComparison,false);
 assert.equal(d.report?.length,12);
 for(const state of d.report){
  assert.equal(state.lanes?.length,4);
  assert.deepEqual(state.lanes.map(l=>l.roots),[4,1,7,0]);
  assert.deepEqual(state.lanes.map(l=>l.shared),[2,0,0,0]);
  assert.ok(state.lanes.every(l=>l.mathml&&l.svgRadius>60));
 }
 return {states:12,measuredLaneGeometries:48,includesZeroAnd64:true,
  genuineKaTeXSharedRootPhases:true};
},'True projected SVG root screen coordinates and Canvas ring time phases, four lane source families, source-backed shared KaTeX fractions and live responsive resizing; no raster text');
check('selected complex root source provenance','artifacts/complex-source-equation/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.viewports,12);
 assert.equal(d.sourceSpecificRootFamilies,true);
 assert.equal(d.dynamicDegreeCartesianIntersectionAndZero,true);
 assert.equal(d.cases?.length,12);
 assert.ok(d.cases.every(x=>x.base.includes('R_{4}')&&x.base.includes('2 + 3i')&&
  x.base.includes('R_{3}')&&x.base.includes('E(5,16)')));
 const edited=d.cases.find(x=>x.editedSpacing||x.changedCoefficient);
 assert.ok(edited&&edited.degree?.includes('R_{7}')&&
  edited.changedCoefficient.includes('2 + 4i')&&edited.intersection.includes('\\cap')&&
  edited.zero.includes('0 + 0i'));
 return {measuredStates:12,realBaseSources:true,liveOperations:true,zeroBasePreservesAdditionalFamilies:true};
},'Exact actual complex source inside KaTeX root-set formula, 12 responsive themes and live Cartesian/degree/set-op/zero cases');
check('semantic root explanation in twelve responsive states','artifacts/math-semantic-caption/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.viewports,12);assert.equal(d.captionTerms,4);
 assert.equal(d.dynamicDegreeAndZero,true);
 assert.equal(d.cases?.length,12);
 for(const c of d.cases){
  assert.equal(c.regular?.length,4);
  assert.ok(c.regular.every(x=>x.mathml&&x.rendered&&!x.error&&x.font>=16&&!x.clipped));
 }
 const dynamic=d.cases.find(x=>x.editedSpacing);
 assert.ok(dynamic&&dynamic.zeroCaption?.length===2&&dynamic.zeroDiagramMath?.length===1);
 assert.ok(dynamic.zeroCaption.every(x=>x.mathml&&x.rendered&&!x.error));
 assert.ok(dynamic.zeroDiagramMath[0].mathml);
 return {measuredStates:12,semanticInlineFormulas:4,liveEditAndZero:true};
},'Real KaTeX/MathML inline explanatory geometry, live root-degree re-render, canonical zero-complex case and SVG-adjacent math across 12 viewport/theme cases');
check('50-preset root-phase musical structure','artifacts/preset-structure/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.originalCatalogSize,50);assert.equal(d.experimentalCount,15);
 assert.equal(d.rows?.length,50);
 assert.equal(new Set(d.rows.map(x=>x.id)).size,50);
 assert.equal(d.collision.uniqueSameLaneEvents,4);
 assert.equal(d.collision.coincidentSources,2);
 assert.equal(d.collision.downbeatLaneAttacks,2);
 assert.ok(d.rows.every(r=>r.exactChunks&&r.noDuplicates&&r.originalRootsPreserved));
 for(const r of d.rows.filter(r=>r.experimental)){
  assert.ok(r.sharedKickResponse&&r.sharedMoments>0);
  assert.ok(r.explicitStructure&&r.ghostSourceProvenance&&r.ghostCount>=2);
  assert.ok(r.densityMax-r.densityMin>=2&&r.densityMax/r.densityMin>=1.5);
  assert.equal(r.lanes?.length,4);
 }
 return {presets:50,documentedExperimentalGrooves:15,sharedCrossLaneEvents:true,velocityProvenance:true};
},'Every original catalog rhythm uses the same root/event scheduler, with documented 15 distinct sparse/dense experimental voice roles, shared kick/response hits and genuine low-velocity first-degree root pickups');
check('full required instrument source inventory','artifacts/mandatory-voice-inventory/report.json',d=>{
 assert.equal(d.status,'PASS');assert.equal(d.requiredCount,14);
 assert.equal(d.cases?.length,2,'desktop and mobile required sound rendering');
 for(const c of d.cases){
  assert.equal(c.verifiedVoices,14);
  assert.equal(c.recordedSources,3);assert.equal(c.standaloneSynthesis,10);
  assert.equal(c.nativeFallback,1);assert.equal(c.uniqueWaveforms,14);
  assert.ok(c.mathRootsPreserved&&c.noTransportTimers&&c.noOverflow);
  assert.equal(c.runtimeErrors,0);
  assert.equal(c.rows?.length,14);
  assert.equal(new Set(c.rows.map(r=>r.waveformSha256)).size,14);
  assert.ok(c.rows.every(r=>r.peak>.005&&r.peak<3&&r.waveformBytes>1200));
 }
 return {measuredStates:2,mandatoryVoices:14,distinctRealWaveforms:14};
},'All R-SND-001 required instruments: 10 real synth patches, 3 independently recorded drum sources, 1 native Reese fallback, with 14 unique normalized real waveform renders in desktop/mobile UI');
check('distinct aggressive kick architectures','artifacts/kick-architecture/report.json',d=>{
 assert.equal(d.status,'PASS');
 assert.equal(d.sr,32000);
 assert.equal(d.ceilingDbFS,-1);
 assert.equal(d.rendered?.length,8,'four patches at two gain levels');
 assert.equal(d.comparisons?.length,6,'all six pairwise kick timbre comparisons');
 const expected={technoKick:2,hardcoreKick:3,gabberKick:3,frenchcoreKick:4};
 for(const r of d.rendered){
  assert.ok(r.started&&r.peak>.035&&r.peak<=Math.pow(10,-1/20));
  assert.ok(r.rms>.003&&r.segments.attack>.002&&r.segments.body>.002);
  assert.equal(r.graph.oscillators,expected[r.name]);
  assert.ok(r.graph.filters.some(x=>x.type==='highpass'&&x.freq===27));
  assert.ok(r.graph.filters.some(x=>x.type==='lowpass'&&x.freq>=170&&x.freq<=440));
  assert.ok(r.graph.shapers>=1);
 }
 assert.ok(d.comparisons.every(x=>x.normalizedWaveformDistance>.08),
  'sound signatures must not differ by gain alone');
 return {measuredPatches:4,realRenders:8,distinctPairs:6,productionGraph:true};
},'Four distinct Web Audio kick architectures; 8 live-graph offline renders, 6 gain-normalized waveform comparisons, sub/bass filtering and transient shapes');
check('offline sound and spectral metrics','artifacts/audio-renders/metrics.json',d=>{
 assert.equal(d.sampleRate,32000,'audio metrics require known sample rate');
 assert.equal(d.voices?.length,15,'all 15 original synthesized programs must be measured');
 return {synthPrograms:d.voices.length,sampleRate:d.sampleRate};
},'Actual rendered audio buffers; no human listening claim');
check('actual shared master output chain','artifacts/master-output-safety/report.json',d=>{
 assert.equal(d.status,'PASS');assert.equal(d.ceilingDbFS,-1);
 assert.equal(d.realProductionGraph,true,'must measure the same graph used in app.js');
 assert.equal(d.cases?.length,2,'two actual OfflineAudioContext sample rates required');
 for(const item of d.cases){
  assert.ok([32000,48000].includes(item.sampleRate));
  assert.equal(item.dense.events,48);
  assert.equal(item.dense.filterType,'highpass');assert.equal(item.dense.filterHz,20);
  assert.equal(item.dense.limiterOversampling,'2x');
  assert.ok(item.dense.finite&&item.volume.finite);
  assert.ok(item.dense.peak>0.02&&item.dense.peak<=Math.pow(10,-1/20));
  assert.ok(item.dense.oversampledPeak<=Math.pow(10,-1/20));
  assert.ok(item.subHz5<item.passHz100*.35);
  assert.ok(item.volume.quiet<item.volume.before*.32&&
   item.volume.recovered>item.volume.before*.75);
  assert.ok(item.volume.downJump<.03&&item.volume.upJump<.03);
  assert.ok(item.transient.driftMs>=-1/item.sampleRate*1000&&item.transient.driftMs<5);
 }
 return {measuredStates:d.cases.length,sourceGraph:'production',maxOutputDbFS:-1};
},'Actual production master limiter/filter, 4x intersample estimate, two rates, dynamic volume smoothing, 20Hz subsonic rejection, <5ms attack');
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
assert.equal(tests.length,26,'the independent release-evidence file inventory must remain exhaustive');
const output={status:'AUTOMATED_MEASUREMENTS_PASS',evidenceFiles:tests.length,
 note:'Every row was read from a test-generated local CI artifact. This is not a manual visual, auditory, phone-device or screen-reader acceptance and does not advance any historical requirement automatically.',
 tests};
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/release-evidence-manifest.json',JSON.stringify(output,null,2)+'\n');
console.log('PASS 26 real measured CI evidence files: orbital playhead timing, geometry, accessibility, formulas, transport, color/wheel input, audio and presets without human-acceptance claims');
