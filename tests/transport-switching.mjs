import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const cases=await page.evaluate(()=>window.RhythmResearch.presets()
  .filter((p,i)=>i%2===0).slice(0,24).map(p=>({id:p.id,category:p.category,bpm:p.bpm,
    counts:p.tracks.map(t=>window.RhythmResearch.events(t).length)})));
 assert.equal(cases.length,24,'24 reproducible preset-switching cases');
 await page.locator('#presetDetails').evaluate(el=>el.open=true);
 await page.locator('#playBtn').click();
 const playing=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(playing.playing,true,'Web Audio transport running before switching');
 assert.equal(playing.timerActive,true,'exactly one scheduling interval is active');
 const history=[];
 for(let i=0;i<cases.length;i++){
  const item=cases[i];
  if((await page.locator('#categorySelect').inputValue())!==item.category){
   await page.locator('#categorySelect').selectOption(item.category);
  }
  await page.locator('#presetSelect').selectOption(item.id);
  const current=await page.evaluate(()=>{
   const t=window.RhythmResearch.transport(),c=window.RhythmResearch.current();
   return {presetId:t.activePresetId,playing:t.playing,timerActive:t.timerActive,
    audioState:t.audioState,bpm:c.bpm,counts:c.tracks.map(x=>window.RhythmResearch.events(x).length),
    trackNames:c.tracks.map(x=>x.sound),
    mathOK:!!document.querySelector('#compositionEquation .katex'),
    presetName:document.getElementById('presetSelect').selectedOptions[0]?.textContent,
    pending:t.pendingVoiceBusDisposals,activeGeneration:t.voiceBusGenerations,
    soundSelects:[...document.querySelectorAll('.lane-sound')].map(x=>x.value)};
  });
  assert.equal(current.presetId,item.id,'selected ID after switching case '+i);
  assert.equal(current.bpm,item.bpm,'correct tempo after switching case '+i);
  assert.deepEqual(current.counts,item.counts,'four lane event counts match chosen preset '+item.id);
  assert.deepEqual(current.soundSelects,current.trackNames,'instrument selectors match all four tracks');
  assert.equal(current.playing,true,'transport remains playing '+item.id);
  assert.equal(current.timerActive,true,'scheduler interval not lost '+item.id);
  assert.equal(current.mathOK,true,'selected lane formula remains valid '+item.id);
  history.push({case:i,id:item.id,voiceBusGeneration:current.activeGeneration,
    pendingToDispose:current.pending});
 }
 await page.waitForTimeout(300);
 const settled=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(settled.pendingVoiceBusDisposals,0,'all prior voice buses disconnected within 300 ms');
 assert.equal(settled.hasLiveVoiceBus,true,'one current voice bus remains');
 assert.equal(settled.playing,true,'transport still playing after rapid switches');
 assert.equal(settled.timerActive,true,'one timer persists after 24 switches');
 assert.ok(settled.voiceBusGenerations>=24,'fresh voice bus used at each preset reconfiguration');
 assert.ok(settled.completedVoiceBusDisposals>=23,'discarded voices detached from master');
 await page.locator('#playBtn').click();
 await page.waitForTimeout(200);
 const paused=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(paused.playing,false,'pause stops transport');
 assert.equal(paused.timerActive,false,'pause clears scheduler interval');
 assert.equal(paused.pendingVoiceBusDisposals,0,'pause also disconnects previous bus');
 assert.equal(paused.audioState,'suspended','audio context suspends after pause');
 assert.deepEqual(errors,[],'no browser JavaScript errors');
 fs.writeFileSync('artifacts/preset-switching.json',JSON.stringify({
  tested:cases.length,status:'pass',notes:'Browser Web Audio real-time switching, bus cleanup and DOM mathematical synchronization; not a human listening test',
  before:playing,after:paused,history
 },null,2));
 console.log('PASS rapid preset switching:',cases.length,
  'live transitions; bus generations',settled.voiceBusGenerations,
  '; prior buses disposed',settled.completedVoiceBusDisposals,
  '; pending',settled.pendingVoiceBusDisposals,
  '; after-pause scheduler',paused.timerActive);
 await page.close();
}finally{await browser.close()}
