import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
fs.mkdirSync('artifacts',{recursive:true});
const wrapDistance=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b));
const cases=[];
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(viewport.width<500)await page.locator('#themeBtn').click();
  const transport=()=>page.evaluate(()=>window.RhythmResearch.transport());
  const button=page.locator('#playBtn');
  const start=await transport();
  assert.equal(start.playing,false);
  assert.equal(start.transportWanted,false);
  assert.equal(start.timerActive,false);
  assert.equal(start.phase,0);
  await button.click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  const running=await transport();
  assert.equal(running.playing,true,'transport started');
  assert.equal(running.transportWanted,false,'pending-start flag must clear when actual playback begins');
  assert.equal(running.audioState,'running');
  assert.equal(running.schedulerIntervalsCreated-running.schedulerIntervalsCleared,1);
  assert.ok(Number.isFinite(running.phase)&&running.phase>=0&&running.phase<1);
  await page.waitForTimeout(190);
  const advanced=await transport();
  assert.ok(wrapDistance(advanced.phase,running.phase)>.02,
   'phase must advance under AudioContext clock, not a frozen DOM interval');
  await button.click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  await page.waitForFunction(()=>window.RhythmResearch.transport().audioState==='suspended');
  const paused=await transport();
  assert.equal(paused.timerActive,false);
  assert.equal(paused.transportWanted,false);
  assert.ok(wrapDistance(paused.pausedPhase,advanced.phase)<.15,
   'Pause stores the most recent phase, rather than starting another bar');
  const frozen=paused.pausedPhase;
  await page.waitForTimeout(120);
  const later=await transport();
  assert.equal(later.phase,frozen,'phase remains mathematically frozen while paused');
  assert.equal(later.schedulerIntervalsCreated,later.schedulerIntervalsCleared,
   'every stopped transport interval was cleared');
  const bpmBefore=later.bpm;
  const bpmAfter=bpmBefore===147?173:147;
  await page.locator('#bpm').evaluate((el,v)=>{
   el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));
  },bpmAfter);
  const changedPaused=await transport();
  assert.equal(changedPaused.bpm,bpmAfter);
  assert.equal(changedPaused.phase,frozen,'BPM changes cannot move the playhead during pause');
  assert.equal(changedPaused.pausedPhase,frozen);
  assert.equal(changedPaused.timerActive,false);

  await button.click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  const resumed=await transport();
  assert.ok(wrapDistance(resumed.phase,frozen)<.13,
   'Resume must retain the previous cycle phase with a short scheduler preroll');
  assert.equal(resumed.transportWanted,false);
  assert.equal(resumed.schedulerIntervalsCreated-resumed.schedulerIntervalsCleared,1);
  const beforeLiveTempo=await transport();
  const nextTempo=bpmAfter===162?183:162;
  await page.locator('#bpm').evaluate((el,v)=>{
   el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));
  },nextTempo);
  const afterLiveTempo=await transport();
  assert.equal(afterLiveTempo.bpm,nextTempo);
  assert.ok(wrapDistance(afterLiveTempo.phase,beforeLiveTempo.phase)<.09,
   'live tempo change must preserve normalized root cycle position');
  assert.equal(afterLiveTempo.schedulerIntervalsCreated-beforeLiveTempo.schedulerIntervalsCreated,0,
   'BPM change must not construct a second transport timer');
  assert.equal(afterLiveTempo.schedulerIntervalsCreated-afterLiveTempo.schedulerIntervalsCleared,1);
  assert.equal(afterLiveTempo.timerActive,true);
  await page.waitForTimeout(175);
  const advancingAfterTempo=await transport();
  assert.ok(wrapDistance(advancingAfterTempo.phase,afterLiveTempo.phase)>.02,
   'audio playhead progresses after tempo change');

  await page.locator('#resetBtn').click();
  const restarted=await transport();
  assert.equal(restarted.playing,true,'Reset must not stop a running audio context');
  assert.ok(restarted.phase<.04||restarted.phase>.96,
   'Reset anchors the playback cycle at phase 0');
  assert.equal(restarted.schedulerIntervalsCreated-restarted.schedulerIntervalsCleared,1,
   'Reset must reuse the current scheduler');

  await button.click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  await page.waitForFunction(()=>window.RhythmResearch.transport().audioState==='suspended');
  const afterPause=await transport();
  await page.locator('#resetBtn').click();
  const stoppedReset=await transport();
  assert.equal(stoppedReset.phase,0,'Reset while paused returns to exact zero');
  assert.equal(stoppedReset.pausedPhase,0,'paused cycle explicitly rewound');
  assert.equal(stoppedReset.timerActive,false);
  assert.equal(stoppedReset.schedulerIntervalsCreated,stoppedReset.schedulerIntervalsCleared);
  assert.equal(stoppedReset.transportWanted,false);
  assert.deepEqual(errors,[],'no runtime errors during phase transitions');

  cases.push({viewport,theme:viewport.width<500?'dark':'light',
   initialBpm:bpmBefore,pausedPhase:frozen,phaseAtResume:resumed.phase,
   phaseAfterTempo:afterLiveTempo.phase,phaseAfterRunningReset:restarted.phase,
   afterPausedReset:stoppedReset.phase,created:stoppedReset.schedulerIntervalsCreated,
   cleared:stoppedReset.schedulerIntervalsCleared,errors:errors.length,
   audioOnExit:stoppedReset.audioState});
  await page.close();
 }
 fs.writeFileSync('artifacts/transport-phase-continuity.json',JSON.stringify({
  status:'PASS',tests:cases.length,
  scope:'Actual AudioContext-based phase continuity for start, pause, resume, paused/live tempo edits, running/paused reset; checks no duplicate scheduler. Technical browser measurement, not listening evidence.',
  cases
 },null,2)+'\n');
 console.log('PASS M08 transport phase continuity: '+cases.length+' desktop/mobile cases with real suspended AudioContext');
}finally{await browser.close()}
