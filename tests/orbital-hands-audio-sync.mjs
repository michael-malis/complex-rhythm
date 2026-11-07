import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts/orbital-hands',{recursive:true});
const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
const tau=2*Math.PI,dist=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b));
const near=(a,b,tol=1e-8)=>Math.abs(a-b)<=tol;
const cases=[];
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport,reducedMotion:theme==='dark'?'reduce':'no-preference'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   // Instrument actual Canvas arc / stroke calls. This records the four
   // short colored paths that users see, not a fabricated geometry snapshot.
   const p=window.__orbitCanvas={frames:0,arcs:[],captured:0};
   const clear=CanvasRenderingContext2D.prototype.clearRect;
   CanvasRenderingContext2D.prototype.clearRect=function(...args){
    p.frames++;p.arcs=[];return clear.apply(this,args);
   };
   const arc=CanvasRenderingContext2D.prototype.arc;
   CanvasRenderingContext2D.prototype.arc=function(x,y,r,start,end,...rest){
    if(x===0&&y===0&&r>18&&end>start&&end-start<.45){
     this.__orbitCandidate={radius:r,start,end};
    }
    return arc.call(this,x,y,r,start,end,...rest);
   };
   const stroke=CanvasRenderingContext2D.prototype.stroke;
   CanvasRenderingContext2D.prototype.stroke=function(...args){
    if(this.__orbitCandidate){
     p.arcs.push({...this.__orbitCandidate,color:this.strokeStyle,width:this.lineWidth});
     p.captured++;this.__orbitCandidate=null;
    }
    return stroke.apply(this,args);
   };
  });
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  assert.match(await page.locator('#orbitHeading').textContent(),/Four rings/);
  assert.match(await page.locator('#orbitCanvas').getAttribute('aria-label'),/one small colored playhead on each ring/i);
  const configure=async(i,bars)=>{
   await page.locator('#laneBars'+i).fill(String(bars));
   assert.equal((await page.evaluate(()=>window.RhythmResearch.current().tracks))[i].cycleBars,bars);
  };
  await configure(1,1);
  await configure(2,2);
  await configure(3,4);
  await page.waitForFunction(()=>window.RhythmResearch.orbitalHands().hands.length===4);
  const capture=()=>page.evaluate(()=>({
   frame:window.RhythmResearch.orbitalHands(),
   canvas:window.__orbitCanvas.arcs.slice(),
   transport:window.RhythmResearch.transport(),
   source:window.RhythmResearch.current(),
   radii:window.RhythmResearch.radiiForSize(document.querySelector('#orbitCanvas').clientWidth)
  }));
  const checkFrame=(d,label)=>{
   assert.equal(d.frame.hands.length,4,label+' must draw four distinct playheads');
   assert.equal(d.canvas.length,4,label+' actual Canvas has four short arcs, no single radial hand');
   assert.deepEqual(d.frame.hands.map(h=>h.cycleBars),[1,1,2,4]);
   assert.equal(d.transport.schedulerIntervalsCreated-d.transport.schedulerIntervalsCleared,d.transport.playing?1:0);
   for(let i=0;i<4;i++){
    const hand=d.frame.hands[i];
    const expected=((d.frame.elapsed/(hand.cycleBars*d.frame.barSeconds))%1+1)%1;
    assert.ok(dist(hand.phase,expected)<1e-9,label+' hand must use the actual shared audio elapsed time, lane '+i);
    assert.ok(near(hand.radius,d.radii[i]),label+' arrow runs ON its own ring');
    assert.ok(near(Math.hypot(hand.x,hand.y),hand.radius),label+' arrow tip stays on the root circumference');
    const arrow=d.canvas[i];
    assert.ok(near(arrow.radius,hand.radius,1e-5),label+' actual drawn pointer radius follows its lane');
    assert.ok(near(arrow.end,hand.angle,1e-8),label+' actual drawn pointer tip reaches the exact phase');
    assert.ok(near(arrow.start,hand.startAngle,1e-8),label+' pointer arc follows a short tangential path');
    assert.ok(arrow.end-arrow.start>0&&arrow.end-arrow.start<.45,
      label+' pointer never becomes a long radial line');
    assert.equal(arrow.color.toLowerCase(),hand.color.toLowerCase(),
      label+' pointer color matches the mathematical root ring');
    const scheduled=window === undefined?[]:[]; // no extra timing logic
   }
   assert.ok(dist(d.frame.hands[0].phase,d.frame.hands[1].phase)<1e-9,
    label+' same 1-bar loops ALWAYS share angular phase, independent of root degree');
   return d;
  };
  const stopped=checkFrame(await capture(),'stopped');
  assert.ok(stopped.frame.hands.every(h=>h.phase===0),'all hands start at top of their own circle');

  // Directly compare every source event to the SAME planEvents math the
  // Web Audio scheduler uses, including different cycle lengths and roots.
  const mathSchedule=await page.evaluate(()=>{
   const m=window.RhythmMath,t=window.RhythmResearch.current().tracks,b=240/window.RhythmResearch.current().bpm;
   const lanes=t.map(x=>({cycleBars:x.cycleBars,muted:x.muted,sound:x.sound,
    events:window.RhythmResearch.events(x)}));
   const notes=m.planEvents(lanes,b,0,8*b);
   return {barSeconds:b,cycles:t.map(x=>x.cycleBars),
    notes:notes.map(x=>({lane:x.lane,time:x.time,phase:x.phase,atPointerPhase:m.phaseAt(x.time,t[x.lane].cycleBars,b)}))};
  });
  assert.ok(mathSchedule.notes.length>=20,'the root scheduler actually produced a multi-bar musical sequence');
  assert.ok(mathSchedule.notes.every(n=>dist(n.phase,n.atPointerPhase)<1e-8),
   'EVERY scheduled sound time matches the orbit hand pointing exactly to its root');

  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  await page.waitForTimeout(240);
  const first=checkFrame(await capture(),'playing');
  assert.equal(first.transport.audioState,'running');
  assert.ok(first.frame.hands[0].phase>.02,'1-bar orbit hand actually rotates during Play');
  assert.ok(near(first.frame.hands[2].phase,first.frame.hands[0].phase/2,.004),
   '2-bar hand rotates at half the 1-bar speed');
  assert.ok(near(first.frame.hands[3].phase,first.frame.hands[0].phase/4,.004),
   '4-bar hand rotates at quarter the 1-bar speed');
  if(theme==='dark'){
   assert.ok(!near(first.frame.hands[0].phase*16,Math.round(first.frame.hands[0].phase*16),.005),
    'reduced-motion preference must not quantize the pointer away from audible root phase');
  }
  await page.waitForTimeout(175);
  const second=checkFrame(await capture(),'later play');
  assert.ok(dist(second.frame.hands[0].phase,first.frame.hands[0].phase)>.02,
   'the colored pointer traverses its ring while playback runs');
  // Selecting other instruments no longer changes ANY pointer phase.
  await page.locator('.lane[data-lane="2"] .lane-select').click();
  const picked=checkFrame(await capture(),'after selecting another ring');
  assert.ok(dist(picked.frame.hands[0].phase,second.frame.hands[0].phase)<.14,
   'selecting a ring cannot jump/restart the other playheads');

  // Tempo and live root-count edits must never break audio/visual phase.
  const beforeTempo=await capture();
  await page.locator('#bpm').evaluate(el=>{
   el.value='170';el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await page.waitForTimeout(60);
  const tempo=checkFrame(await capture(),'live BPM update');
  assert.equal(tempo.frame.bpm,170);
  assert.equal(tempo.transport.schedulerIntervalsCreated-beforeTempo.transport.schedulerIntervalsCreated,0);
  const eventsBefore=tempo.source.tracks[2].n;
  await page.locator('#trackN2').evaluate(el=>{
   el.value=String(Number(el.value)+1);
   el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await page.waitForTimeout(70);
  const updated=checkFrame(await capture(),'live root-count change');
  assert.equal(updated.source.tracks[2].n,eventsBefore+1);
  assert.equal(updated.transport.schedulerIntervalsCreated-tempo.transport.schedulerIntervalsCreated,0);
  const phases=updated.source.tracks.map(x=>x.cycleBars);
  assert.deepEqual(phases,[1,1,2,4],'changing n cannot alter the four independent rotation speeds');

  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  await page.waitForFunction(()=>window.RhythmResearch.transport().audioState==='suspended');
  await page.waitForTimeout(60);
  const paused=checkFrame(await capture(),'paused');
  await page.waitForTimeout(125);
  const frozen=checkFrame(await capture(),'paused clock');
  for(let i=0;i<4;i++)assert.ok(dist(frozen.frame.hands[i].phase,paused.frame.hands[i].phase)<1e-9,
   'all four playheads must freeze at their exact AudioContext phase');
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  await page.waitForTimeout(70);
  const resumed=checkFrame(await capture(),'resumed');
  for(let i=0;i<4;i++)assert.ok(dist(resumed.frame.hands[i].phase,frozen.frame.hands[i].phase)<.1,
   'Resume does not skip any lane loop');
  await page.locator('#resetBtn').click();
  await page.waitForTimeout(10);
  const reset=checkFrame(await capture(),'reset');
  assert.ok(reset.frame.hands.every(h=>h.phase<.025),
   'reset sends every orbital playhead back to the start phase');
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  assert.deepEqual(errors,[],'no page JavaScript exceptions');

  await page.screenshot({path:'artifacts/orbital-hands/'+viewport.width+'-'+theme+'.png',fullPage:true});
  cases.push({width:viewport.width,theme,drawnArcs:first.canvas.length,
   sameLengthSynchronized:true,halfAndQuarterSpeed:true,scheduledNotesChecked:mathSchedule.notes.length,
   preciseReducedMotion:true,tempoAndLiveEdit:true,pauseResumeReset:true,
   errors:errors.length});
  await page.close();
 }
 fs.writeFileSync('artifacts/orbital-hands/report.json',JSON.stringify({
  status:'PASS',cases,source:'Actual Canvas short arcs and AudioContext beatEpoch plus planEvents sound times',
  claim:'Each of the four root-colored orbital hand tips aligns with its own mathematical/audio onset, never with the selected lane alone'
 },null,2)+'\n');
 console.log('PASS four AudioContext-synchronized orbit hands, 1/1/2/4-bar clocks, real Canvas pointers and planned audio onsets × 4 responsive/theme states');
}finally{await browser.close()}
