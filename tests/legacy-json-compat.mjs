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
 const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/main-35-ids.json',import.meta.url),'utf8'));
 assert.deepEqual(originals.map(p=>p.id),fixture.ids,
  'historical main-branch 35 preset IDs and order must stay intact');
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

 // Unknown legacy data may affect past behavior; reject it explicitly rather than stripping it.
 const last=originals.at(-1);
 const base={format:'roots-rhythm/1',name:'Unknown field fixture',bpm:last.bpm,
   bars:last.bars,tracks:last.tracks.map(t=>({...t,layers:t.layers.map(l=>({...l}))}))};
 const beforeReject=await page.evaluate(()=>JSON.stringify(window.RhythmResearch.current()));
 const negatives=[
  {name:'project',mutate:x=>{x.unrecognizedSongMode='odd';},field:'unrecognizedSongMode'},
  {name:'track',mutate:x=>{x.tracks[0].unrecognizedSwing=.6;},field:'unrecognizedSwing'},
  {name:'layer',mutate:x=>{
   if(!x.tracks[0].layers.length)x.tracks[0].layers.push({a:1,b:0,n:1,velocity:.8});
   x.tracks[0].layers[0].unrecognizedAccent='x';
  },field:'unrecognizedAccent'}
 ];
 for(const c of negatives){
  const payload=JSON.parse(JSON.stringify(base));c.mutate(payload);
  await page.locator('#jsonFile').setInputFiles({
   name:'unsupported-'+c.name+'.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(payload))
  });
  await page.waitForFunction(field=>{
   const msg=document.getElementById('toast').textContent;
   return msg.startsWith('Import failed: Unsupported')&&msg.includes(field);
  },c.field);
  assert.equal(await page.evaluate(()=>JSON.stringify(window.RhythmResearch.current())),
   beforeReject,'unknown '+c.name+' field must not silently mutate the project');
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
