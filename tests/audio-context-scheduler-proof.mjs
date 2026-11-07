import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// R-SND-006: instrument the REAL oscillator start API, not just mathPlanEvents
// or a mocked scheduler. The voice below is the native two-oscillator bass.
fs.mkdirSync('artifacts/audio-clock-scheduling',{recursive:true});
const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
const cases=[];
try {
 for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   const records=window.__actualAudioOscillatorStarts=[];
   const original=OscillatorNode.prototype.start;
   OscillatorNode.prototype.start=function(when=0,...args){
    records.push({
     when,calledAt:this.context.currentTime,
     state:this.context.state,baseFrequency:this.frequency.value
    });
    return original.call(this,when,...args);
   };
  });
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  // Use an entirely native voice: no sample decoding or waveform mock.
  // Keep only the first lane audible, with an evenly spaced 8th-root family.
  const sound=page.locator('#laneSound0');
  await sound.selectOption('bass');
  await page.locator('#trackN0').fill('8');
  await page.locator('#laneBars0').fill('1');
  const state=await page.evaluate(()=>window.RhythmResearch.current());
  for(let i=1;i<4;i++){
   if(!state.tracks[i].muted)await page.locator('#laneMute'+i).click();
  }
  await page.locator('#bpm').evaluate(el=>{
   el.value='240';el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const configured=await page.evaluate(()=>window.RhythmResearch.current());
  assert.equal(configured.tracks[0].sound,'bass');
  assert.equal(configured.tracks[0].n,8);
  assert.ok(configured.tracks.slice(1).every(t=>t.muted),
   'Only the native bass lane may produce scheduled oscillator starts');
  assert.equal(configured.bpm,240);

  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  await page.waitForTimeout(1100);
  const measurement=await page.evaluate(()=>{
   const transport=window.RhythmResearch.transport();
   const rhythm=window.RhythmResearch.current();
   const barSeconds=240/rhythm.bpm;
   const lanes=rhythm.tracks.map(t=>({
    cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
    events:window.RhythmResearch.events(t)
   }));
   const planned=window.RhythmMath.planEvents(lanes,barSeconds,0,2*barSeconds)
    .filter(e=>e.lane===0).map(e=>({
     time:e.time,phase:e.phase,absolute:transport.beatEpoch+e.time-.005
    }));
   return {transport,rhythm,planned,starts:window.__actualAudioOscillatorStarts.slice()};
  });
  assert.equal(measurement.transport.audioState,'running');
  assert.ok(measurement.transport.timerActive);
  assert.equal(
   measurement.transport.schedulerIntervalsCreated-measurement.transport.schedulerIntervalsCleared,1,
   'There must be exactly one lookahead scheduling timer');
  assert.ok(measurement.planned.length>=8,'eight real nth-root events per bar');
  const starts=measurement.starts.filter(x=>x.state==='running');
  assert.ok(starts.length>=8,
   'The running AudioContext must have scheduled actual oscillator nodes');

  // A bass event generates two oscillators with the same absolute audio start.
  // Group those calls, then compare each real scheduled timestamp to the
  // canonical complex-root planner using the AudioContext epoch.
  const clusters=[];
  for(const s of starts.sort((a,b)=>a.when-b.when)){
   const group=clusters.find(g=>Math.abs(g.when-s.when)<.003);
   if(group)group.members.push(s);
   else clusters.push({when:s.when,members:[s]});
  }
  assert.ok(clusters.length>=4,'multiple independent bass hits must be scheduled');
  assert.ok(clusters.every(g=>g.members.length===2),
   'Every actual bass onset must schedule two native oscillators once');
  const errorsMs=clusters.map(g=>1000*Math.min(
   ...measurement.planned.map(e=>Math.abs(g.when-e.absolute))
  ));
  assert.ok(Math.max(...errorsMs)<12,
   'Actual oscillator timestamps must land on complex-root planEvents phases (12 ms threshold)');
  const leadsMs=clusters.map(g=>1000*(g.when-g.members[0].calledAt));
  assert.ok(leadsMs.some(x=>x>=15),
   'At least one actual oscillator must be scheduled >=15 ms into the AudioContext future, not fired by setInterval alone');
  assert.ok(starts.every(x=>Number.isFinite(x.calledAt)&&x.when>=x.calledAt-.005),
   'All start times must be valid AudioContext seconds');

  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  await page.waitForFunction(()=>window.RhythmResearch.transport().audioState==='suspended');
  const paused=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(paused.schedulerIntervalsCreated,paused.schedulerIntervalsCleared,
   'Pausing releases the only lookahead interval');
  assert.equal(paused.timerActive,false);
  assert.deepEqual(errors,[],'No browser runtime errors');

  cases.push({
   width:viewport.width,theme:'light',actualOscillatorStarts:starts.length,
   actualDistinctSoundEvents:clusters.length,nativeOscillatorsPerHit:2,
   maxAbsoluteEventErrorMs:Math.max(...errorsMs),
   maxFutureLeadMs:Math.max(...leadsMs),
   scheduledFromAudioContext:true,singleLookaheadInterval:true,
   leakedIntervals:paused.schedulerIntervalsCreated-paused.schedulerIntervalsCleared,
   errors:errors.length
  });
  await page.close();
 }
 fs.writeFileSync('artifacts/audio-clock-scheduling/report.json',
  JSON.stringify({status:'PASS',cases,
   scope:'Native Web Audio OscillatorNode.start(absoluteTime) observed against real AudioContext.currentTime, beatEpoch and complex-root planEvents; desktop and mobile browser.',
   excludes:'No subjective listening or physical loudspeaker timing claim.'},null,2)+'\n');
 console.log('PASS R-SND-006: real AudioContext oscillator starts match planned root phases in 2 viewport cases');
} finally {await browser.close()}
