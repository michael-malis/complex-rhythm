import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ids=['acid-303','resonance-rush','liquid-corrosion','303-pressure'];
const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
fs.mkdirSync('artifacts/acid-presets',{recursive:true});
const results=[];
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  assert.equal(await page.locator('.preset-controls select').count(),2,
   'exactly two rhythm-selection controls');
  await page.locator('#categorySelect').selectOption('acid');
  const available=await page.locator('#presetSelect option').evaluateAll(opts=>
   opts.filter(o=>!o.disabled&&!o.value.startsWith('__')).map(o=>o.value));
  assert.deepEqual(available,ids,'the Acid category shows exactly its four main studies');
  const fingerprints=[],timbres=[],leadCounts=[],drumCounts=[];
  for(const id of ids){
   await page.locator('#presetSelect').selectOption(id);
   const data=await page.evaluate(()=>({
    current:window.RhythmResearch.current(),
    id:window.RhythmResearch.transport().activePresetId,
    phases:window.RhythmResearch.current().tracks.map(t=>window.RhythmResearch.events(t)),
    definitions:window.RhythmVoices.definitions
   }));
   assert.equal(data.id,id,'correct active preset '+id);
   assert.equal(data.current.tracks.length,4);
   assert.equal(data.current.tracks[0].sound,'kick','kick anchor '+id);
   const lead=data.current.tracks[3];
   assert.equal(data.definitions[lead.sound]?.family,'acid',
    'the real lead must use a dedicated acid synthesizer, not a generic fallback: '+id);
   assert.ok(data.phases.every(events=>events.length>0),'all four lanes audible for '+id);
   const fingerprint=data.current.tracks.map((t,i)=>t.sound+':'+data.phases[i].map(e=>
    e.phase.toFixed(6)+'/'+e.velocity.toFixed(3)).join(',')).join('|');
   assert.ok(!fingerprints.includes(fingerprint),'no duplicate rhythm or instrument arrangements');
   fingerprints.push(fingerprint);
   timbres.push(lead.sound);
   leadCounts.push(data.phases[3].length);
   drumCounts.push(data.phases[0].length);
   const audible=await page.evaluate(async name=>{
    const rate=24000,ctx=new OfflineAudioContext(1,Math.round(rate*.6),rate);
    const bus=ctx.createGain();bus.connect(ctx.destination);
    if(!window.RhythmVoices.play(ctx,bus,name,.01,.8,2))throw Error('acid voice unavailable');
    const out=(await ctx.startRendering()).getChannelData(0);
    let power=0,peak=0;
    for(const v of out){power+=v*v;peak=Math.max(peak,Math.abs(v))}
    return {rms:Math.sqrt(power/out.length),peak};
   },lead.sound);
   assert.ok(audible.rms>.003&&audible.peak>.02&&audible.peak<.98,
    'dedicated acid lead is audible with bounded offline signal for '+id);
  }
  assert.equal(new Set(timbres).size,4,'four Acid presets must use four different acid voices');
  assert.equal(new Set(leadCounts).size,4,
   'Acid lead root-event counts distinguish sparse dub, classic, twister and peak');
  assert.ok(new Set(drumCounts).size>=3,'acid kick arrangements must not be identical');
  assert.deepEqual(errors,[],'no browser exceptions');
  await page.screenshot({path:'artifacts/acid-presets/'+viewport.width+'-'+theme+'.png',fullPage:true});
  results.push({viewport,theme,timbres,leadCounts,drumCounts});
  await page.close();
 }
 fs.writeFileSync('artifacts/acid-presets/report.json',JSON.stringify({
  status:'PASS',scope:'Four playable Acid presets: distinct synth families, geometric lead and kick event patterns, offline audio safety; manual listening not included',
  results
 },null,2)+'\n');
 console.log('PASS acid preset diversity: '+ids.join(', ')+' in four viewport/theme cases');
}finally{await browser.close()}
