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
 await page.locator('#orbitCanvas').scrollIntoViewIfNeeded();
 const preDrag=await page.evaluate(()=>{
  const t=window.RhythmResearch.current().tracks[0],r=document.querySelector('#orbitCanvas').getBoundingClientRect();
  return {a:t.a,b:t.b,n:t.n,modulus:Math.hypot(t.a,t.b),
   radius:window.RhythmResearch.radiiForSize(Math.min(r.width,r.height))[0],
   box:{left:r.left,top:r.top,width:r.width,height:r.height},
   generation:window.RhythmResearch.transport().voiceBusGenerations};
 });
 const origin={x:preDrag.box.left+preDrag.box.width/2,
  y:preDrag.box.top+preDrag.box.height/2-preDrag.radius};
 const delta=.13;
 await page.mouse.move(origin.x,origin.y);
 await page.mouse.down();
 await page.mouse.move(preDrag.box.left+preDrag.box.width/2+Math.sin(delta)*preDrag.radius,
  preDrag.box.top+preDrag.box.height/2-Math.cos(delta)*preDrag.radius,{steps:3});
 await page.mouse.up();
 const latestAfterPointer=await page.evaluate(()=>({
  transport:window.RhythmResearch.transport(),
  current:window.RhythmResearch.current().tracks[0],
  canvas:document.querySelector('#orbitCanvas').getBoundingClientRect().toJSON()
 }));
 assert.ok(Math.abs(latestAfterPointer.current.b-preDrag.b)>.01,
  'pointer drag must change the selected complex argument: '+JSON.stringify(latestAfterPointer));
 await page.waitForFunction(previous=>window.RhythmResearch.transport().voiceBusGenerations>previous,
  preDrag.generation,{timeout:5000});
 const postDrag=await page.evaluate(()=>{
  const t=window.RhythmResearch.current().tracks[0],status=window.RhythmResearch.transport();
  return {a:t.a,b:t.b,n:t.n,modulus:Math.hypot(t.a,t.b),playing:status.playing,
   generation:status.voiceBusGenerations,roots:window.RhythmResearch.rootPhases(t)};
 });
 assert.equal(postDrag.n,preDrag.n,'live root dragging preserves polynomial degree');
 assert.ok(Math.abs(postDrag.modulus-preDrag.modulus)<1e-8,
  'live drag preserves modulus of complex number');
 assert.ok(Math.abs(Math.atan2(postDrag.b,postDrag.a)-Math.atan2(preDrag.b,preDrag.a))>.01,
  'live root drag changes the argument of all roots');
 assert.equal(postDrag.roots.length,postDrag.n,'drag retains all root phases');
 assert.equal(postDrag.playing,true,'root drag retains playing transport');
 const dragReadout=await page.evaluate(()=>({
  a:Number(document.getElementById('trackA0').value),
  b:Number(document.getElementById('trackB0').value),
  n:Number(document.getElementById('trackN0').value),
  formula:document.getElementById('selectedRootFormula').querySelector('.katex')?.textContent,
  phase:document.getElementById('rootPhaseFormula').querySelector('.katex')?.textContent,
  polar:document.getElementById('laneAlt0').querySelector('.katex')?.textContent
 }));
 assert.ok(Math.abs(dragReadout.a-postDrag.a)<1e-9&&Math.abs(dragReadout.b-postDrag.b)<1e-9,
  'live drag synchronizes both Cartesian input fields');
 assert.equal(dragReadout.n,postDrag.n,'root degree field unchanged by drag');
 assert.ok(dragReadout.formula?.includes('w')&&dragReadout.phase?.includes('phase')&&dragReadout.polar?.includes('θ'),
  'live drag recomputes selected-root phase and alternate-polar KaTeX formulas');
 const sorted=postDrag.roots.slice().sort((a,b)=>a-b);
 assert.ok(sorted.every((p,i)=>Math.abs((sorted[(i+1)%sorted.length]+(i===sorted.length-1?1:0)-p)-1/sorted.length)<1e-9),
  'dragged roots remain evenly spaced');

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
  drag:{before:preDrag,after:postDrag},phaseBurst:afterBurst,final:paused,pass:true},null,2));
 console.log('PASS live mathematical editing:',samples.length,'degrees, 41 phase updates coalesced, active Web Audio schedule refreshed');
 await page.close();
}finally{await browser.close()}
