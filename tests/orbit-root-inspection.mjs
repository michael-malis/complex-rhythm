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
 console.log('PASS: exact clicked Canvas root -> compact math/loop beat inspector, four responsive states, edits, audio, import and clear');
}finally{await browser.close();}
