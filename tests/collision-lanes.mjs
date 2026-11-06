import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#windowPanel').evaluate(el=>el.open=true);
 await page.locator('#compositionPanel').evaluate(el=>el.open=true);
 const input={format:'roots-rhythm/1',name:'Two aligned instruments',bpm:120,bars:1,
 tracks:[
  {a:1,b:0,n:4,sound:'technoKick',cycleBars:1,muted:false},
  {a:1,b:0,n:4,sound:'metallic',cycleBars:1,muted:false},
  {a:0,b:0,n:1,sound:'fmPerc',cycleBars:1,muted:true},
  {a:0,b:0,n:1,sound:'noiseBurst',cycleBars:1,muted:true}
 ]};
 await page.locator('#jsonFile').setInputFiles({name:'collision.json',mimeType:'application/json',
  buffer:Buffer.from(JSON.stringify(input))});
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Two aligned instruments'));
 let state=await page.evaluate(()=>{
  const c=window.RhythmResearch.current(),sec=240/c.bpm,
   lanes=c.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
    gain:t.gain,patch:t.patch,events:window.RhythmResearch.eventMetadata(t)})),
   planned=window.RhythmMath.planEvents(lanes,sec,0,4*sec),
   analysis=window.RhythmMath.analyzeSchedule(planned),
   radii=window.RhythmResearch.radiiForSize(document.querySelector('#orbitCanvas').getBoundingClientRect().width);
  return {c,planned,analysis,radii,
   strips:[...document.querySelectorAll('.window-lane-events')].map(el=>el.querySelectorAll('.window-mark').length),
   summary:document.querySelector('#eventSummary').textContent};
 });
 assert.deepEqual(state.analysis,{totalEvents:32,uniqueMoments:16,sharedMoments:16,sharedLaneEvents:32},
  'two simultaneous four-beat instruments remain 32 individual sound events over four bars');
 assert.deepEqual(state.strips,[16,16,0,0],
  'two sets of markers remain on their own ring/timeline lanes, with silent lanes empty');
 assert.ok(state.radii[0]>state.radii[1]&&state.radii[1]>state.radii[2]&&state.radii[2]>state.radii[3],
  'four roots visualized on distinct concentric rings');
 assert.ok(state.radii[0]-state.radii[1]>=39.9,'neighboring rings have independent visible marker space');
 await page.waitForTimeout(80);
 const pixels=await page.evaluate(()=>{
  const canvas=document.querySelector('#orbitCanvas'),rect=canvas.getBoundingClientRect(),
   ctx=canvas.getContext('2d'),size=Math.min(rect.width,rect.height),
   radii=window.RhythmResearch.radiiForSize(size),scale=canvas.width/rect.width;
  return [0,1].map(lane=>{
   const x=Math.round((rect.width/2+radii[lane])*scale),y=Math.round(rect.height/2*scale),
    rgb=[...ctx.getImageData(x,y,1,1).data].slice(0,3),
    css=document.querySelector('.lane[data-lane="'+lane+'"]').style.getPropertyValue('--lane-color').trim();
   const expected=[1,3,5].map(i=>parseInt(css.slice(i,i+2),16));
   return {lane,rgb,expected,delta:Math.max(...rgb.map((v,i)=>Math.abs(v-expected[i])))};
  });
 });
 assert.ok(pixels.every(p=>p.delta<=35),
  'both coincident right-quarter root dots render in their own lane colors: '+JSON.stringify(pixels));

 const cardinal=await page.evaluate(()=>{
  const canvas=document.querySelector('#orbitCanvas'),box=canvas.getBoundingClientRect(),
   ctx=canvas.getContext('2d'),side=Math.min(box.width,box.height),
   r=window.RhythmResearch.radiiForSize(side)[0],scale=canvas.width/box.width,
   css=document.querySelector('.lane[data-lane="0"]').style.getPropertyValue('--lane-color').trim(),
   expected=[1,3,5].map(i=>parseInt(css.slice(i,i+2),16));
  return [
   {phase:0,dx:0,dy:-1,position:'top'},
   {phase:.25,dx:1,dy:0,position:'right'},
   {phase:.5,dx:0,dy:1,position:'bottom'},
   {phase:.75,dx:-1,dy:0,position:'left'}
  ].map(p=>{
   const x=Math.round((box.width/2+p.dx*r)*scale),y=Math.round((box.height/2+p.dy*r)*scale),
    rgb=[...ctx.getImageData(x,y,1,1).data].slice(0,3);
   return {phase:p.phase,position:p.position,rgb,expected,
    difference:Math.max(...rgb.map((v,i)=>Math.abs(v-expected[i])))};
  });
 });
 assert.ok(cardinal.every(p=>p.difference<=35),
  'phase 0 top, 1/4 right, 1/2 bottom and 3/4 left actual root pixels: '+JSON.stringify(cardinal));


 assert.ok(state.planned.every(e=>['technoKick','metallic'].includes(e.instrument)),
  'unmuted audio sources remain distinct instruments');
 assert.ok(state.summary.includes('32 audible hits')&&state.summary.includes('16 distinct times')&&
   state.summary.includes('16 shared across lanes'),
   'user-visible counters derive from unique time coordinates, not just root counts');
 const perBeat=new Map();
 for(const e of state.planned){
  const key=e.time.toFixed(9);
  const group=perBeat.get(key)||new Set();
  group.add(e.lane);perBeat.set(key,group);
 }
 assert.equal(perBeat.size,16,'16 distinct coinciding attack times');
 assert.ok([...perBeat.values()].every(group=>group.size===2),'every coinciding attack retains both sound lanes');
 await page.locator('#loadRootExample').click();
 const after=await page.evaluate(()=>{
  const c=window.RhythmResearch.current(),sec=240/c.bpm,
   lanes=c.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
    gain:t.gain,patch:t.patch,events:window.RhythmResearch.eventMetadata(t)}));
  return {analysis:window.RhythmMath.analyzeSchedule(window.RhythmMath.planEvents(lanes,sec,0,4*sec)),
   base:document.querySelector('#baseCount').textContent,
   added:document.querySelector('#addedCount').textContent,
   unique:document.querySelector('#unionCount').textContent,
   intersectionSummary:document.querySelector('#overlapSummary').textContent,
   timeText:document.querySelector('#eventSummary').textContent};
 });
 assert.deepEqual(after.analysis,{totalEvents:40,uniqueMoments:24,sharedMoments:16,sharedLaneEvents:32},
  'adding R3 to R4 changes only lane1 to 6 unique phases without removing aligned lane2 attacks');
 assert.equal(after.base,'4','base root counter is independent of composed rhythm');
 assert.equal(after.added,'3','extra root counter derives from second mathematical set');
 assert.equal(after.unique,'6','union displays unique phase count');
 assert.ok(after.intersectionSummary.includes('1 shared phase'),
  'same-lane set overlap appears explicitly and is not counted as extra sound');
 assert.ok(after.timeText.includes('40 audible hits')&&after.timeText.includes('24 distinct times'),
  'total audio and shared cross-track counts correctly update after composition');
 assert.deepEqual(errors,[],'no JavaScript runtime failures');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/collision-lanes.json',JSON.stringify({
  before:{analysis:state.analysis,radii:state.radii,visibleTimelineMarkers:state.strips,summary:state.summary},
  canvasPixelEvidence:pixels,
  cardinalGeometryEvidence:cardinal,
  after,source:'real Playwright DOM, imported four-track fixture, same RhythmMath events as sound engine',
  pass:true
 },null,2));
 console.log('PASS cross-lane simultaneity: 32 separate sound events at 16 times; composition 40 hits / 24 unique times, 16 shared');
 await page.close();
}finally{await browser.close()}
