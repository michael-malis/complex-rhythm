import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const originals=await page.evaluate(()=>window.RhythmResearch.presets().slice(0,35).map(p=>({
  id:p.id,bpm:p.bpm,bars:p.bars,
  tracks:p.tracks.map(t=>({
   a:t.a,b:t.b,n:t.n,sound:t.sound,muted:t.muted,
   layers:t.layers,operation:t.operation
  })),
  mathematicalEvents:p.tracks.map(t=>window.RhythmResearch.events(t).map(x=>x.phase))
 })));
 assert.equal(originals.length,35,'all original preset configurations retained');
 const results=[];
 for(const original of originals){
  const payload={format:'roots-rhythm/1',name:'Legacy '+original.id,
   bpm:original.bpm,bars:original.bars,tracks:original.tracks};
  await page.locator('#jsonFile').setInputFiles({
   name:original.id+'.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))
  });
  await page.waitForFunction(expected=>document.getElementById('toast').textContent==='Imported rhythm: '+expected,
   'Legacy '+original.id);
  const current=await page.evaluate(()=>{
   const c=window.RhythmResearch.current();
   return {bpm:c.bpm,tracks:c.tracks.map(t=>({
    a:t.a,b:t.b,n:t.n,sound:t.sound,muted:t.muted,cycleBars:t.cycleBars,
    phases:window.RhythmResearch.events(t).map(x=>x.phase)
   }))};
  });
  assert.equal(current.bpm,original.bpm,'legacy BPM '+original.id);
  for(let i=0;i<4;i++){
   const before=original.tracks[i],after=current.tracks[i];
   assert.equal(after.a,before.a,'legacy real part '+original.id+' lane '+i);
   assert.equal(after.b,before.b,'legacy imaginary part '+original.id+' lane '+i);
   assert.equal(after.n,before.n,'legacy degree '+original.id+' lane '+i);
   assert.equal(after.sound,before.sound,'legacy instrument '+original.id+' lane '+i);
   assert.equal(after.cycleBars,original.bars===2?2:1,'legacy shared bars default '+original.id+' lane '+i);
   const expected=original.mathematicalEvents[i],actual=after.phases;
   assert.equal(actual.length,expected.length,'legacy event count '+original.id+' lane '+i);
   for(let k=0;k<expected.length;k++)
    assert.ok(Math.abs(actual[k]-expected[k])<1e-9,'legacy exact event phase '+original.id+' lane '+i+' event '+k);
  }
  results.push({id:original.id,tracks:current.tracks.length,bpm:current.bpm,
   eventCounts:current.tracks.map(t=>t.phases.length)});
 }
 assert.deepEqual(errors,[],'no browser JS errors');
 fs.writeFileSync('artifacts/legacy-json-compat.json',JSON.stringify({
  schema:'roots-rhythm/1',legacyPresets:results.length,results,pass:true,
  note:'35 legacy JSON payloads without cycleBars, patch or new synthesizer metadata; mathematical phase equality'
 },null,2));
 console.log('PASS backward compatibility: all',results.length,
  'original JSON payloads; all 140 lanes, root phases, instruments and tempos retained');
 await page.close();
}finally{await browser.close()}
