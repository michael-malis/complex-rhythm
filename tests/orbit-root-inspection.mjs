import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts/orbit-root-inspection',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const screens=[{width:1440,height:900},{width:390,height:844}];
const fixture={
 format:'roots-rhythm/1',name:'Selected root inspector QA',bpm:120,bars:1,
 tracks:[
  {a:1,b:0,n:4,sound:'technoKick',cycleBars:2,muted:false,layers:[]},
  {a:1,b:0,n:3,sound:'hat',cycleBars:1,muted:false,layers:[]},
  {a:0,b:0,n:4,sound:'fmPerc',cycleBars:1,muted:false,layers:[]},
  {a:1,b:0,n:4,sound:'acidClassic',cycleBars:1,muted:false,layers:[]}
 ]
};
const report=[];
async function load(page,project){
 await page.locator('#jsonFile').setInputFiles({
  name:'root-inspect.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))
 });
 await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),project.name);
}
async function tapRoot(page,lane,index){
 await page.locator('#orbitCanvas').scrollIntoViewIfNeeded();
 const point=await page.evaluate(({lane,index})=>{
  const canvas=document.querySelector('#orbitCanvas'),rect=canvas.getBoundingClientRect();
  const t=window.RhythmResearch.current().tracks[lane],ph=window.RhythmMath.rootPhases(t.a,t.b,t.n)[index];
  const r=window.RhythmResearch.radiiForSize(Math.min(rect.width,rect.height))[lane];
  const a=-Math.PI/2+Math.PI*2*ph;
  return {x:rect.left+rect.width/2+Math.cos(a)*r,
   y:rect.top+rect.height/2+Math.sin(a)*r,phase:ph};
 },{lane,index});
 assert.ok(Number.isFinite(point.phase),'root must exist in canonical source');
 if(page.viewportSize()?.width===390)await page.touchscreen.tap(point.x,point.y);
 else await page.mouse.click(point.x,point.y);
 return point;
}
async function read(page){
 return page.evaluate(()=>{
  const node=document.getElementById('rootInspection'),math=document.getElementById('rootInspectionAngle');
  return {
   hidden:node.hidden,label:document.getElementById('rootInspectionLane').textContent,
   time:document.getElementById('rootInspectionTime').textContent,
   latex:math.querySelector('annotation')?.textContent||'',
   mathml:!!math.querySelector('math'),
   color:node.style.getPropertyValue('--root-inspection-color'),
   overflow:document.documentElement.scrollWidth>innerWidth+1,
   source:window.RhythmResearch.current(),
   transport:window.RhythmResearch.transport()
  };
 });
}
try{
 for(const viewport of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport,hasTouch:viewport.width===390,reducedMotion:theme==='dark'?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await load(page,fixture);
  assert.equal((await read(page)).hidden,true,'inspector starts hidden and adds no default UI noise');
  const before=await read(page);
  await tapRoot(page,0,1);
  let selected=await read(page);
  assert.equal(selected.hidden,false,'clicking an actual Canvas root opens the compact inspector');
  assert.match(selected.label,/Lane 1 · root 2\/4/);
  assert.match(selected.time,/Phase 25% · loop bar 1\/2 · beat 3\/4/,
   'one-quarter root in a two-bar loop occurs at bar 1, beat 3');
  assert.ok(selected.mathml&&selected.latex.includes('\\frac{\\pi}{2}'),
   'visible selected root is an actual accessible KaTeX angle, not textual fake math');
  assert.equal(selected.source.tracks[0].a,before.source.tracks[0].a);
  assert.equal(selected.source.tracks[0].b,before.source.tracks[0].b);
  assert.equal(selected.source.tracks[0].n,before.source.tracks[0].n);
  assert.ok(!selected.overflow,'compact root inspector does not overflow the viewport');
  await page.screenshot({path:'artifacts/orbit-root-inspection/'+viewport.width+'-'+theme+'.png',fullPage:true});

  await page.locator('#laneBars0').fill('4');
  selected=await read(page);
  assert.match(selected.time,/loop bar 2\/4 · beat 1\/4/,
   'inspector updates the loop timing when length changes without changing the root phase');
  await page.locator('#trackN0').fill('2');
  selected=await read(page);
  assert.ok(selected.latex.includes('\\pi')&&!selected.latex.includes('\\frac{\\pi}{2}'),
   'editing root degree updates the selected source angle');
  assert.match(selected.time,/Phase 50% · loop bar 3\/4 · beat 1\/4/);
  await page.locator('#trackN0').fill('1');
  assert.equal((await read(page)).hidden,true,
   'inspector clears an invalid former root rather than silently selecting a different hit');

  // Clicking a silent zero-complex lane cannot fabricate a root event.
  await page.locator('.lane[data-lane="2"] .lane-select').click();
  assert.equal((await read(page)).hidden,true);
  await page.locator('.lane[data-lane="0"] .lane-select').click();
  await page.locator('#trackN0').fill('4');
  await tapRoot(page,0,3);
  assert.match((await read(page)).label,/root 4\/4/);
  await page.locator('#clearRootInspection').click();
  assert.equal((await read(page)).hidden,true,'clear button removes visible inspection');
  await tapRoot(page,0,0);
  await page.locator('.lane[data-lane="1"] .lane-select').click();
  assert.equal((await read(page)).hidden,true,'switching lane does not attribute the previous root to a new source');

  await tapRoot(page,1,0);
  assert.match((await read(page)).label,/Lane 2/);
  await load(page,{...fixture,name:'Reset selected root with fresh import'});
  assert.equal((await read(page)).hidden,true,'JSON import clears stale visual selection');
  assert.deepEqual(errors,[],'no JavaScript errors in actual responsive root-inspection workflow');
  report.push({viewport,theme,clickedRoot:1,phase:.25,changes:'cycle length, degree, clear, lane selection, JSON import'});
  await page.close();
 }

 // Added and Euclidean roots are first-class mathematical events, not silent
 // decorations. Clicking a shared root reports its two source families.
 for(const viewport of screens){
  const page=await browser.newPage({viewport,hasTouch:viewport.width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  const enriched={...fixture,name:'Additional orbit root sources',
   tracks:fixture.tracks.map((t,i)=>i===0?{...t,
    layers:[{a:1,b:0,n:3,velocity:.65}],
    euclidean:{k:1,n:8,rotation:1,velocity:.58}}:t)};
  await load(page,enriched);
  const tapPhase=async phase=>{
   await page.locator('#orbitCanvas').scrollIntoViewIfNeeded();
   const target=await page.evaluate(phase=>{
    const c=document.querySelector('#orbitCanvas'),rect=c.getBoundingClientRect();
    const r=window.RhythmResearch.radiiForSize(Math.min(rect.width,rect.height))[0];
    const a=-Math.PI/2+Math.PI*2*phase;
    return {x:rect.left+rect.width/2+Math.cos(a)*r,
     y:rect.top+rect.height/2+Math.sin(a)*r};
   },phase);
   if(viewport.width===390)await page.touchscreen.tap(target.x,target.y);
   else await page.mouse.click(target.x,target.y);
  };
  await tapPhase(1/3);
  let inspected=await read(page);
  assert.equal(inspected.hidden,false,'additional root is directly clickable');
  assert.match(inspected.label,/added root 2\/3 · family 1/);
  assert.match(inspected.time,/Phase 33\.333%/);
  assert.ok(inspected.mathml&&inspected.latex.includes('\\frac{2\\pi}{3}'),
   'added root is explained by its real angle and accessible mathematics');
  const phases=await page.evaluate(()=>{
   const e=window.RhythmResearch.current().tracks[0].euclidean;
   return window.RhythmMath.euclidean(e.k,e.n,e.rotation);
  });
  assert.equal(phases.length,1);
  await tapPhase(phases[0]);
  inspected=await read(page);
  assert.match(inspected.label,/Euclidean hit 1\/1/);
  assert.ok(inspected.mathml,'Euclidean root phase renders actual MathML');
  await tapPhase(0);
  inspected=await read(page);
  assert.match(inspected.label,/root 1\/4/);
  assert.match(inspected.label,/shared: base \+ family 1/);
  assert.deepEqual(errors,[]);
  await page.close();
 }
 
 // Every keyboard navigation step traverses visible canonical set events.
 // No fake roots, silent extra notes, duplicate overlaps, or audio rescheduling.
 for(const viewport of screens){
  const page=await browser.newPage({viewport,hasTouch:viewport.width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  const augmented={...fixture,name:'Keyboard mathematical inspection QA',
   tracks:fixture.tracks.map((t,i)=>i===0?{...t,
    layers:[{a:1,b:0,n:3,velocity:.65}],
    euclidean:{k:1,n:8,rotation:1,velocity:.58}}:t)};
  await load(page,augmented);
  const original=await read(page);
  await page.locator('#orbitCanvas').focus();
  await page.keyboard.press(']');
  let v=await read(page);
  assert.match(v.label,/Lane 1 · root 1\/4 · shared: base \+ family 1/);
  assert.match(v.time,/Phase 0%/);
  assert.ok(v.mathml,'keyboard-selected event uses real MathML');
  assert.match(await page.locator('#rootInspectionAnnouncement').textContent(),/Angle 0 degrees/);
  await page.keyboard.press(']');
  v=await read(page);
  assert.match(v.label,/Euclidean hit 1\/1/);
  assert.match(v.time,/Phase 12\.5%/);
  await page.keyboard.press(']');
  assert.match((await read(page)).label,/root 2\/4/);
  await page.keyboard.press(']');
  assert.match((await read(page)).label,/added root 2\/3 · family 1/);
  await page.keyboard.press('[');
  assert.match((await read(page)).label,/root 2\/4/);
  await page.keyboard.press('Home');
  assert.match((await read(page)).label,/root 1\/4/);
  await page.keyboard.press('End');
  assert.match((await read(page)).label,/root 4\/4/);
  await page.keyboard.press(']');
  assert.match((await read(page)).label,/root 1\/4/);
  await page.keyboard.press('Escape');
  assert.equal((await read(page)).hidden,true,'Escape clears inspection without editing');
  assert.match(await page.locator('#rootInspectionAnnouncement').textContent(),/cleared/);
  await page.keyboard.press('ArrowDown');
  assert.match((await read(page)).source.tracks[1].n.toString(),/^3$/);
  await page.keyboard.press(']');
  assert.match((await read(page)).label,/Lane 2 · root 1\/3/);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press(']');
  assert.equal((await read(page)).hidden,true,'a zero-complex lane has no invented keyboard hits');
  const after=await read(page);
  assert.deepEqual(after.source.tracks,original.source.tracks,
   'keyboard browsing never changes the underlying four complex rhythm generators');
  assert.equal(after.transport.schedulerIntervalsCreated,original.transport.schedulerIntervalsCreated,
   'keyboard inspection does not touch audio scheduler');

  // In intersection mode, a mathematical base root not in the output
  // intersection is invisible and must not be clickable or keyboard-selectable.
  const intersect={...fixture,name:'Intersection hides unmatched base roots',
   tracks:fixture.tracks.map((t,i)=>i===0?{...t,operation:'intersection',
    layers:[{a:1,b:0,n:3,velocity:.65}]}:t)};
  await load(page,intersect);
  // Import intentionally retains the chosen lane, so select lane 1 explicitly.
  await page.locator('.lane[data-lane="0"] .lane-select').click();
  await page.locator('#orbitCanvas').focus();
  await page.keyboard.press('Home');
  assert.match((await read(page)).label,/root 1\/4 · shared: base \+ family 1/);
  await page.keyboard.press(']');
  assert.match((await read(page)).label,/root 1\/4/);
  await page.keyboard.press('Escape');
  await tapRoot(page,0,1);
  assert.equal((await read(page)).hidden,true,
   'pointer selection must reject a base root removed by intersection');
  assert.deepEqual(errors,[]);
  await page.close();
 }
 
 // The result set is a full-width touch target. Selecting it highlights the
 // same canonical phase in the base/added/result strips and on the orbit.
 for(const viewport of screens){
  const page=await browser.newPage({viewport,hasTouch:viewport.width===390,
   reducedMotion:viewport.width===390?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  const linked={...fixture,name:'Linked strip provenance',
   tracks:fixture.tracks.map((t,i)=>i===0?{...t,
    layers:[{a:1,b:0,n:3,velocity:.65}]}:t)};
  await load(page,linked);
  await page.locator('#compositionPanel').evaluate(el=>el.open=true);
  await page.locator('.lane[data-lane="0"] .lane-select').click();
  const result=page.locator('#unionStrip');
  const tapResult=async phase=>{
   await result.scrollIntoViewIfNeeded();
   const box=await result.boundingBox();
   assert.ok(box&&box.height>=44,'entire result strip is a touch-sized interaction target');
   const x=box.x+box.width*(.02+.96*phase),y=box.y+box.height/2;
   if(viewport.width===390)await page.touchscreen.tap(x,y);
   else await page.mouse.click(x,y);
  };
  const matched=()=>page.evaluate(()=>{
   const phases=id=>[...document.querySelectorAll('#'+id+' .phase-mark.is-inspected')]
    .map(mark=>Number(mark.dataset.phase));
   return {base:phases('baseStrip'),added:phases('addedStrip'),
    result:phases('unionStrip'),aria:document.getElementById('unionStrip').getAttribute('aria-label'),
    pageOverflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  const original=await read(page);
  await tapResult(1/3);
  let selected=await read(page),highlight=await matched();
  assert.match(selected.label,/Lane 1 · added root 2\/3 · family 1/);
  assert.match(selected.time,/Phase 33\.333%/);
  assert.ok(selected.mathml,'result strip reports the same accessible math as Canvas');
  assert.equal(highlight.base.length,0,'additional-only phase does not fabricate a base root');
  assert.equal(highlight.added.length,1);
  assert.equal(highlight.result.length,1);
  assert.ok(Math.abs(highlight.result[0]-1/3)<1e-8);
  assert.deepEqual(selected.source.tracks,original.source.tracks,
   'inspecting a phase does not change any complex-number generator');

  // Keyboard progression is in actual event phase order, not step-sequencer grid order.
  await result.focus();
  await page.keyboard.press('ArrowLeft');
  selected=await read(page);
  assert.match(selected.label,/Lane 1 · root 2\/4/);
  assert.match(selected.time,/Phase 25%/);
  await page.keyboard.press('Home');
  assert.match((await read(page)).label,/root 1\/4 · shared: base \+ family 1/);
  highlight=await matched();
  assert.deepEqual(highlight.base,[0]);
  assert.deepEqual(highlight.added,[0]);
  assert.deepEqual(highlight.result,[0]);
  await page.keyboard.press('End');
  assert.match((await read(page)).time,/Phase 75%/);
  await page.keyboard.press('ArrowRight');
  assert.match((await read(page)).time,/Phase 0%/);
  await page.keyboard.press('Escape');
  assert.equal((await read(page)).hidden,true,'Escape hides inspector from either keyboard surface');
  highlight=await matched();
  assert.deepEqual(highlight.result,[],'clearing inspection removes linked source highlights');
  await page.keyboard.press('Enter');
  assert.match((await read(page)).time,/Phase 0%/,'Enter activates the focusable result strip');
  await page.keyboard.press(' ');
  assert.match((await read(page)).time,/Phase 0%/,'Space also activates the result strip');
  await page.keyboard.press('Escape');

  // True intersection leaves only the common phase. Tapping elsewhere must
  // inspect that result, never silently select an excluded base/additional root.
  await page.locator('#advancedMathDetails').evaluate(el=>el.open=true);
  await page.locator('#setOperation').selectOption('intersection');
  assert.equal(await page.locator('#unionCount').textContent(),'1');
  await tapResult(.7);
  selected=await read(page);highlight=await matched();
  assert.match(selected.label,/shared: base \+ family 1/);
  assert.match(highlight.aria,/Intersection of lane 1: 1 distinct phases/);
  assert.deepEqual(highlight.result,[0]);
  assert.equal(highlight.pageOverflow,false);

  // Zero complex source contains no result points. An empty strip never
  // manufactures an event or alters the playing clock.
  await page.locator('.lane[data-lane="2"] .lane-select').click();
  await tapResult(.5);
  assert.equal((await read(page)).hidden,true);
  assert.match((await matched()).aria,/0 distinct phases/);

  // Digit shortcuts act only when Canvas is focused; no setting or
  // sound clock changes as the user switches between the four colored rings.
  await page.locator('#orbitCanvas').focus();
  const beforeDigits=await read(page);
  await page.keyboard.press('4');
  assert.match(await page.locator('#orbitCanvas').getAttribute('aria-label'),/Selected lane 4 of 4/);
  await page.keyboard.press('1');
  assert.match(await page.locator('#orbitCanvas').getAttribute('aria-label'),/Selected lane 1 of 4/);
  const afterDigits=await read(page);
  assert.deepEqual(afterDigits.source.tracks,beforeDigits.source.tracks);
  assert.equal(afterDigits.transport.schedulerIntervalsCreated,beforeDigits.transport.schedulerIntervalsCreated);
  assert.deepEqual(errors,[]);
  await page.close();
 }

 // When audio is playing, an inspection must not alter the root scheduler.
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await load(page,fixture);
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,{timeout:15000});
 const before=await read(page);
 await tapRoot(page,0,1);
 const during=await read(page);
 assert.equal(during.transport.playing,true);
 assert.equal(during.transport.schedulerIntervalsCreated,before.transport.schedulerIntervalsCreated,
  'inspecting roots never starts another audio event scheduler');
 assert.deepEqual(during.source.tracks,before.source.tracks,
  'inspection leaves every mathematical and sound source unchanged during playback');
 assert.match(during.time,/loop bar 1\/2 · beat 3\/4/);
 await page.locator('#clearRootInspection').click();
 assert.equal((await read(page)).transport.playing,true,'clearing inspection leaves playback active');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 await page.close();
 fs.writeFileSync('artifacts/orbit-root-inspection/report.json',
  JSON.stringify({status:'PASS',states:report.length,report,realBrowser:true,audioSchedulerUnchanged:true}));
 console.log('PASS: inspect base, added, shared and Euclidean orbit events by Canvas, linked result strips and keyboard; MathML, true intersection and unchanged audio');
}finally{await browser.close();}
