import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const presets=await page.evaluate(()=>window.RhythmResearch.presets());
 assert.equal(presets.length,50,'test covers the full catalog');
 const results=[];
 for(const p of presets){
  await page.locator('#categorySelect').selectOption(p.category);
  await page.locator('#presetSelect').selectOption(p.id);
  const initial=await page.evaluate(()=>{
   const research=window.RhythmResearch,mat=window.RhythmMath,c=research.current();
   return {current:c,id:research.transport().activePresetId,plan:research.samplePlan(),
    metadata:c.tracks.map(t=>research.eventMetadata(t)),
    timeMap:mat.planEvents(c.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
     gain:t.gain,patch:t.patch,events:research.eventMetadata(t)})),240/c.bpm,0,240/c.bpm)};
  });
  assert.equal(initial.id,p.id,'explicit selection loads '+p.id);
  const document={format:'roots-rhythm/1',name:p.name,bpm:initial.current.bpm,
    bars:p.bars||1,tracks:initial.current.tracks};
  await page.locator('#jsonFile').setInputFiles({name:p.id+'.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(document))});
  await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),p.name);
  const after=await page.evaluate(()=>{
   const research=window.RhythmResearch,mat=window.RhythmMath,c=research.current();
   return {current:c,id:research.transport().activePresetId,plan:research.samplePlan(),
    metadata:c.tracks.map(t=>research.eventMetadata(t)),
    timeMap:mat.planEvents(c.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
     gain:t.gain,patch:t.patch,events:research.eventMetadata(t)})),240/c.bpm,0,240/c.bpm)};
  });
  assert.equal(after.id,p.id,'imported catalog name must retain its source ID '+p.id);
  assert.deepEqual(after.current,initial.current,'all four tracks and BPM survive import '+p.id);
  assert.deepEqual(after.plan,initial.plan,'sample-family selection survives import '+p.id);
  assert.deepEqual(after.metadata,initial.metadata,'root phase and source provenance survive import '+p.id);
  assert.deepEqual(after.timeMap,initial.timeMap,'canonical scheduled audio event list survives import '+p.id);
  results.push({id:p.id,category:p.category,events:initial.timeMap.length,lanes:4});
 }
 assert.deepEqual(errors,[],'browser runtime errors');
 fs.writeFileSync('artifacts/all-presets-same-semantics.json',JSON.stringify({
  status:'PASS',scope:'50 explicit preset loads versus their JSON imports: identical track, source, event and sample plans',
  results
 },null,2));
 console.log('PASS all 50 preset loaders share canonical root/audio semantics and preserve exact JSON event maps');
 await page.close();
}finally{await browser.close()}
