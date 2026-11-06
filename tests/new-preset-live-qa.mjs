import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const studyIds=[
 'industrial-fracture','acid-reactor','rotterdam-collision',
 'schranz-machinery','broken-reactor','frenchcore-spiral',
 'acid-singularity','prime-number-riot','eleven-against-seven',
 'mechanical-paradox','terror-geometry','complex-roots-overload',
 'hardtek-mobius','breakcore-prime-shards','euclidean-fragments'
];
const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const studies=await page.evaluate(ids=>window.RhythmResearch.presets().filter(p=>ids.includes(p.id)),studyIds);
 assert.equal(studies.length,15,'all fifteen new rhythm studies are in the application');
 assert.equal(new Set(studies.map(p=>p.id)).size,15,'new study IDs are unique');
 for(const id of studyIds)assert.ok(studies.some(x=>x.id===id),'missing study '+id);
 await page.locator('#presetDetails').evaluate(el=>{el.open=true});
 const audit=[];
 let previousGeneration=0;
 for(let index=0;index<studies.length;index++){
  const source=studies[index];
  if(await page.locator('#categorySelect').inputValue()!==source.category)
   await page.locator('#categorySelect').selectOption(source.category);
  await page.locator('#presetSelect').selectOption(source.id);
  if(index===0){
   await page.locator('#playBtn').click();
   await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  }
  const initial=await page.evaluate(()=>({
   current:window.RhythmResearch.current(),transport:window.RhythmResearch.transport(),
   events:window.RhythmResearch.current().tracks.map(t=>window.RhythmResearch.events(t)),
   formula:!!document.querySelector('#compositionEquation .katex')
  }));
  assert.equal(initial.transport.activePresetId,source.id,'actual selected study identity '+source.id);
  assert.equal(initial.current.bpm,source.bpm,'tempo loaded '+source.id);
  assert.equal(initial.current.tracks.length,4,'four independent instrument lanes '+source.id);
  assert.ok(initial.transport.playing&&initial.transport.timerActive,'active transport '+source.id);
  assert.ok(initial.formula,'mathematical display renders for '+source.id);
  for(let lane=0;lane<4;lane++){
   const now=initial.current.tracks[lane],original=source.tracks[lane];
   assert.equal(now.n,original.n,'root degree '+lane+' '+source.id);
   assert.equal(now.sound,original.sound,'instrument '+lane+' '+source.id);
   assert.ok(initial.events[lane].length>0,'nonempty rhythm '+lane+' '+source.id);
   assert.ok(initial.events[lane].every(e=>Number.isFinite(e.phase)&&e.phase>=0&&e.phase<1),
    'event phase integrity '+lane+' '+source.id);
  }

  // Changing a phase in one instrument while the real Web Audio transport runs
  // must invalidate the stale schedule and leave all other lanes untouched.
  const t=initial.current.tracks[0];
  const before=Math.atan2(t.b,t.a)*180/Math.PI, target=before+27;
  const startGeneration=initial.transport.voiceBusGenerations;
  const beforeOther=JSON.stringify(initial.current.tracks.slice(1));
  await page.locator('#trackAngleDeg0').fill(String(target));
  await page.waitForFunction(gen=>window.RhythmResearch.transport().voiceBusGenerations>gen,
   startGeneration,{timeout:5000});
  const after=await page.evaluate(()=>({
   current:window.RhythmResearch.current(),transport:window.RhythmResearch.transport(),
   radians:window.RhythmMath.parseAngle(document.getElementById('trackAngleRad0').value),
   degrees:Number(document.getElementById('trackAngleDeg0').value)
  }));
  assert.equal(after.transport.activePresetId,source.id,'editing preserves source preset '+source.id);
  assert.ok(after.transport.playing&&after.transport.timerActive,'no transport interruption '+source.id);
  assert.equal(after.current.tracks[0].n,t.n,'root degree unchanged by argument edit '+source.id);
  assert.ok(Math.abs(Math.hypot(t.a,t.b)-Math.hypot(after.current.tracks[0].a,after.current.tracks[0].b))<1e-8,
   'complex modulus preserved after editing '+source.id);
  assert.equal(JSON.stringify(after.current.tracks.slice(1)),beforeOther,
   'argument edit never changes other three instrument lanes '+source.id);
  const actual=Math.atan2(after.current.tracks[0].b,after.current.tracks[0].a);
  const expected=(before+27)*Math.PI/180;
  assert.ok(Math.abs(Math.atan2(Math.sin(actual-expected),Math.cos(actual-expected)))<1e-8,
   'angle correctly changes canonical Cartesian state '+source.id);
  assert.ok(Math.abs(after.radians-actual)<1e-8,
   'radian input stays in sync while playing '+source.id);
  assert.ok(Math.abs(after.degrees-actual*180/Math.PI)<1e-7 ||
   Math.abs((after.degrees-actual*180/Math.PI)%360)<1e-7,
   'degree input stays in sync while playing '+source.id);
  assert.ok(after.transport.voiceBusGenerations>startGeneration,'old voices invalidated '+source.id);
  assert.ok(after.transport.audioTime>=initial.transport.audioTime,'audio clock advances '+source.id);
  audit.push({id:source.id,category:source.category,bpm:source.bpm,
   degrees:source.tracks.map(t=>t.n),events:initial.events.map(a=>a.length),
   busBefore:startGeneration,busAfter:after.transport.voiceBusGenerations,phaseDeltaDeg:27,
   playing:after.transport.playing});
  previousGeneration=after.transport.voiceBusGenerations;
 }
 await page.waitForTimeout(350);
 const stable=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(stable.pendingVoiceBusDisposals,0,'no abandoned voice bus after 15 studies');
 assert.equal(stable.timerActive,true,'one scheduler survives all fifteen studies');
 assert.ok(stable.voiceBusGenerations>=previousGeneration,'voice bus generation monotonic');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 // The voice bus deliberately has a 100ms click-free release tail.
 // Wait for its scheduled disconnect, rather than treating the fade as a leak.
 await page.waitForFunction(()=>window.RhythmResearch.transport().pendingVoiceBusDisposals===0,
  null,{timeout:2500});
 const stopped=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.equal(stopped.timerActive,false,'final pause clears scheduler');
 assert.equal(stopped.pendingVoiceBusDisposals,0,'final pause disposes old voice buses');
 assert.equal(stopped.liveHitBuses,0,'final pause releases Web Audio voices');
 assert.deepEqual(errors,[],'no browser exceptions across all new studies');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/new-preset-live-qa.json',JSON.stringify({
  scope:'Automated live Web Audio and mathematical state, not human music audition',
  passed:studyIds.length,cases:audit,finalTransport:stopped
 },null,2));
 console.log('PASS new preset LIVE acceptance:',studyIds.length,
  'studies; all parameters, event schedules, live phase edits and bus cleanup');
 await page.close();
}finally{await browser.close()}
