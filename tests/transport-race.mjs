import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 // A start and cancellation in one JS task: the first async start is still pending.
 await page.evaluate(()=>{
  const button=document.querySelector('#playBtn');
  button.click();button.click();
 });
 await page.waitForTimeout(100);
 let state=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(state.playing,false,'second click cancels pending playback');
 assert.equal(state.transportWanted,false,'pending start intent clears');
 assert.equal(state.timerActive,false,'no zombie audio scheduling interval');
 assert.equal(state.schedulerIntervalsCreated,0,'cancelled start never creates a timer');
 assert.equal(state.audioState,'suspended','cancelling pending start must not leave the audio context running');
 const cancelledState={...state};
 // Triple click should result in exactly one active transport, not zero or two.
 await page.evaluate(()=>{
  const button=document.querySelector('#playBtn');
  button.click();button.click();button.click();
 });
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,{timeout:8000});
 state=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(state.playing,true,'latest Play command wins after rapid cancellation');
 assert.equal(state.timerActive,true,'one active interval after triple click');
 assert.equal(state.schedulerIntervalsCreated-state.schedulerIntervalsCleared,1,
  'exactly one scheduler survives triple click');
 // Repeated single transport toggles must leave interval counts balanced.
 for(let i=0;i<10;i++){
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,{timeout:8000});
  const snapshot=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(snapshot.schedulerIntervalsCreated-snapshot.schedulerIntervalsCleared,1,
   'no timer duplication after pause/play cycle '+i);
 }
 // Ensure we also handle immediate cancel during sample loading.
 await page.evaluate(()=>{
  const button=document.querySelector('#playBtn');
  // Starting from PLAYING: Pause, Start, Cancel -> stopped.
  button.click();button.click();button.click();
 });
 await page.waitForTimeout(180);
 const ended=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(ended.playing,false,'last click cancels pending restart');
 assert.equal(ended.transportWanted,false,'no stale pending intent');
 assert.equal(ended.timerActive,false,'stopped scheduler');
 assert.equal(ended.schedulerIntervalsCreated,ended.schedulerIntervalsCleared,
  'all created scheduling intervals have matching clear calls');
 assert.deepEqual(errors,[],'no JavaScript errors on transport race');
 fs.writeFileSync('artifacts/transport-race.json',JSON.stringify({firstCancelled:cancelledState,after:ended,
  cycles:10,errors,accepted:true},null,2));
 console.log('PASS transport cancellation: double-click + triple-click + 10 pause/resume + rapid cancel; timers balanced');
 await page.close();
}finally{await browser.close()}
