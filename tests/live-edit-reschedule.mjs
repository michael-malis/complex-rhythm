import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
 const before=await page.evaluate(()=>window.RhythmResearch.transport());
 const samples=[];
 for(let n=3;n<=11;n++){
  await page.locator('#trackN0').fill(String(n));
  await page.waitForFunction(previous=>window.RhythmResearch.transport().voiceBusGenerations>previous,
    samples.length?samples.at(-1).generation:before.voiceBusGenerations,{timeout:5000});
  const current=await page.evaluate(()=>{
   const t=window.RhythmResearch.transport(),track=window.RhythmResearch.current().tracks[0];
   return {generation:t.voiceBusGenerations,pending:t.pendingVoiceBusDisposals,
    playing:t.playing,timerActive:t.timerActive,n:track.n,events:window.RhythmResearch.events(track).length};
  });
  assert.equal(current.n,n,'input degree matches canonical complex roots');
  assert.equal(current.events,n,'live rhythm event count follows new n');
  assert.equal(current.playing,true,'continuous playback during edit');
  assert.equal(current.timerActive,true,'scheduler intact during edit');
  samples.push(current);
 }
 const beforeBurst=await page.evaluate(()=>window.RhythmResearch.transport());
 await page.evaluate(()=>{
  const slider=document.querySelector('#argumentAngle');
  for(let deg=-80;deg<=80;deg+=4){
   slider.value=String(deg);
   slider.dispatchEvent(new Event('input',{bubbles:true}));
  }
 });
 await page.waitForFunction(previous=>window.RhythmResearch.transport().voiceBusGenerations>previous,
  beforeBurst.voiceBusGenerations,{timeout:5000});
 const afterBurst=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.ok(afterBurst.voiceBusGenerations-beforeBurst.voiceBusGenerations<=4,
  '41 synchronous argument updates should coalesce to a few voice-bus rotations');
 assert.equal(afterBurst.playing,true,'phase dragging never stops playback');
 await page.waitForTimeout(200);
 const settled=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(settled.pendingVoiceBusDisposals,0,'old buses disconnected after live edits');
 assert.equal(settled.pendingEditReschedule,false,'no lingering animation-frame edit');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 const paused=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(paused.timerActive,false,'scheduler cleared when paused');
 assert.equal(paused.liveHitBuses,0,'no unreleased per-hit buses after pause');
 assert.deepEqual(errors,[],'no runtime exceptions from continuous editing');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/live-edit-reschedule.json',JSON.stringify({cases:samples,initial:before,
  phaseBurst:afterBurst,final:paused,pass:true},null,2));
 console.log('PASS live mathematical editing:',samples.length,'degrees, 41 phase updates coalesced, active Web Audio schedule refreshed');
 await page.close();
}finally{await browser.close()}
