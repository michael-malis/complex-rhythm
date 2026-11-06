import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const report=[];
fs.mkdirSync('artifacts',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const presets=await page.evaluate(()=>window.RhythmResearch.presets());
 const bunker=presets.find(p=>p.category==='bunker'&&p.tracks.some(t=>t.sound==='kick'));
 const jungle=presets.find(p=>p.category==='jungle'&&p.tracks.some(t=>t.sound==='kick'));
 assert.ok(bunker&&jungle,'fixture must use real presets from two categories with different kick sample families');

 const select=async p=>{
  await page.locator('#categorySelect').selectOption(p.category);
  await page.locator('#presetSelect').selectOption(p.id);
 };
 await select(bunker);
 let plan=await page.evaluate(()=>window.RhythmResearch.samplePlan());
 assert.equal(plan.category,'bunker','loaded preset determines sound category');
 assert.ok(plan.keys.includes('kick-hard'),'Bunker kick uses hard drum sample');
 report.push({step:'bunker',plan});

 // User browsing is never a request to switch loaded audio family.
 await page.locator('#categorySelect').selectOption('jungle');
 const whileBrowsing=await page.evaluate(()=>window.RhythmResearch.samplePlan());
 assert.deepEqual(whileBrowsing,plan,'filtering other examples preserves the loaded sample family');

 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
 const before=await page.evaluate(()=>window.RhythmResearch.transport());
 const json={
  format:'roots-rhythm/1',name:jungle.name,bpm:jungle.bpm,
  bars:jungle.bars,tracks:jungle.tracks
 };
 await page.locator('#jsonFile').setInputFiles({
  name:'jungle-import.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(json))
 });
 await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),jungle.name);
 plan=await page.evaluate(()=>window.RhythmResearch.samplePlan());
 assert.equal(plan.category,'jungle','JSON import updates the loaded sound category before sample planning');
 assert.ok(plan.keys.includes('kick-808'),'Jungle kick uses intended 808 sample, not the previous Bunker family');
 assert.equal(await page.locator('#categorySelect').inputValue(),'jungle','example browser follows imported named preset');
 const after=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(after.activePresetId,jungle.id,'recognize named imported project');
 assert.equal(after.playing,true,'JSON import keeps transport playing');
 assert.equal(after.timerActive,true,'JSON import keeps exactly one scheduler');
 assert.ok(after.voiceBusGenerations>before.voiceBusGenerations,'replace prior voices on import');
 assert.equal(after.schedulerIntervalsCreated-before.schedulerIntervalsCreated,0,
  'import does not create another scheduling interval');
 report.push({step:'named-jungle-import',plan,preset:after.activePresetId,generations:after.voiceBusGenerations});

 // Anonymous JSON must not accidentally inherit Jungle kick/samples.
 const custom={...json,name:'Independent mathematical experiment'};
 await page.locator('#jsonFile').setInputFiles({
  name:'independent.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(custom))
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Independent mathematical experiment'));
 plan=await page.evaluate(()=>window.RhythmResearch.samplePlan());
 assert.equal(plan.category,'other','anonymous import selects neutral sound family');
 assert.ok(plan.keys.includes('kick'),'custom rhythm uses the neutral kick sound family');
 assert.ok(!plan.keys.includes('kick-808'),'no previous Jungle kick inherited');
 assert.equal(await page.locator('#categorySelect').inputValue(),'other','browser reflects neutral custom category');
 assert.equal(await page.locator('#presetSelect').inputValue(),'__custom__','custom project not mislabeled as catalog preset');
 const customState=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(customState.activePresetId,null,'custom imported project is not a prepared preset');
 assert.ok(customState.playing&&customState.timerActive,'transport stable for custom import');
 report.push({step:'anonymous-import',plan});

 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 assert.deepEqual(errors,[],'no runtime JavaScript errors');
 await page.close();
 fs.writeFileSync('artifacts/unified-rhythm-import.json',JSON.stringify({status:'PASS',report},null,2));
 console.log('PASS import and explicit rhythm selection share correct sample families and live transport semantics');
}finally {await browser.close()}
