import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const expected=[
 ['5:7','minimal',[5,7]],
 ['7:9','schranz-machinery',[7,9]],
 ['7:11','eleven-against-seven',[7,11]],
 ['11:13','acid-singularity',[11,13]],
 ['5:7:11','industrial-fracture',[5,7,11]],
 ['3:5:7:11','acid-reactor',[3,5,7,11]],
 ['7:11:13:17','complex-roots-overload',[7,11,13,17]],
 ['4:7:9:13','terror-geometry',[4,7,9,13]]
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const failures=[];page.on('pageerror',e=>failures.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#presetDetails').evaluate(el=>{el.open=true});
 for(const [ratio,id,degrees] of expected){
  await page.locator('#ratioSelect').selectOption(ratio);
  const state=await page.evaluate(()=>({
   id:window.RhythmResearch.transport().activePresetId,
   degrees:window.RhythmResearch.current().tracks.map(x=>x.n),
   events:window.RhythmResearch.current().tracks.map(x=>window.RhythmResearch.events(x)),
   selected:document.getElementById('ratioSelect').value,
   category:document.getElementById('categorySelect').value,
   summary:document.getElementById('presetInfo').textContent
  }));
  assert.equal(state.id,id,'actual backing preset ID for '+ratio);
  assert.equal(state.selected,ratio,'ratio selector persists '+ratio);
  let offset=-1;
  for(const n of degrees){
   const index=state.degrees.findIndex((d,i)=>i>offset&&d===n);
   assert.ok(index>=0,'ordered root degree '+n+' exists in '+ratio);
   offset=index;
  }
  for(let i=0;i<4;i++){
   const ev=state.events[i];
   assert.ok(ev.length>0,'each instrument must play '+ratio+' lane '+i);
   assert.ok(ev.every(e=>Number.isFinite(e.phase)&&e.phase>=0&&e.phase<1),
    'valid phase for '+ratio);
  }
  assert.ok(state.summary.length>35,'musical and mathematical construction explained');
  console.log('PASS REQUIRED RATIO',ratio,id,state.degrees.join(':'));
 }

 // All four phase offsets are independent; editing one lane must not rotate the others.
 const phasesBefore=await page.evaluate(()=>window.RhythmResearch.current().tracks.map(
  t=>window.RhythmResearch.events(t).map(e=>e.phase)
 ));
 // The primary angle is always visible; legacy Cartesian inputs are in a
 // collapsed advanced section and cannot be filled until that section is opened.
 await page.locator('#trackAngleDeg1').fill('30');
 assert.ok(Math.abs(await page.evaluate(()=>window.RhythmMath.parseAngle(document.getElementById('trackAngleRad1').value))-Math.PI/6)<1e-8,
  'primary radians and degrees stay synchronized for the second lane');
 const phasesAfter=await page.evaluate(()=>window.RhythmResearch.current().tracks.map(
  t=>window.RhythmResearch.events(t).map(e=>e.phase)
 ));
 assert.notDeepEqual(phasesAfter[1],phasesBefore[1],
  'independent phase shift changes selected instrument lane');
 for(const lane of [0,2,3])assert.deepEqual(phasesAfter[lane],phasesBefore[lane],
  'changing lane 2 phase must not change lane '+(lane+1));
 assert.equal(failures.length,0,'no browser script errors');
 console.log('ALL PASS: 8 mandatory polyrhythm configurations');
 await page.close();
}finally{await browser.close()}
