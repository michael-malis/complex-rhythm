import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(()=>{
  const research=window.RhythmResearch,math=window.RhythmMath;
  const presets=research.presets();
  const failures=[],statistics=[];
  const close=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b))<1e-6;
  function validate(id,tracks,bpm){
   const bar=240/bpm;
   const lanes=tracks.map((t,i)=>({
    cycleBars:t.cycleBars||1,muted:t.muted,sound:t.sound,
    patch:t.patch,gain:t.gain,events:research.eventMetadata(t)
   }));
   let uniquePhases=0,multiSource=0;
   for(let lane=0;lane<4;lane++){
    const ev=lanes[lane].events;
    for(let i=0;i<ev.length;i++){
     if(!Number.isFinite(ev[i].phase)||ev[i].phase<0||ev[i].phase>=1)
      failures.push({id,lane,type:'invalid phase',phase:ev[i].phase});
     if(ev.some((other,j)=>j<i&&close(other.phase,ev[i].phase)))
      failures.push({id,lane,type:'duplicate same-lane phase',phase:ev[i].phase});
     if(ev[i].sources.length>1)multiSource++;
     if(!ev[i].sources.every(s=>['base','additional','euclidean'].includes(s.kind)))
      failures.push({id,lane,type:'lost event source'});
    }
    uniquePhases+=ev.length;
   }
   const all=math.planEvents(lanes,bar,0,4*bar);
   const halves=[
    ...math.planEvents(lanes,bar,0,2*bar),
    ...math.planEvents(lanes,bar,2*bar,4*bar)
   ];
   halves.sort((a,b)=>a.time-b.time||a.lane-b.lane||a.sourceEvent-b.sourceEvent);
   if(JSON.stringify(all)!==JSON.stringify(halves))
    failures.push({id,type:'event loss/duplication across adjacent scheduling windows'});
   const byTime=new Map();
   for(const event of all){
    if(event.lane<0||event.lane>=4||event.sources.length===0)
     failures.push({id,type:'missing lane or source',event});
    const original=lanes[event.lane].events[event.sourceEvent];
    if(!original||!close(event.phase,original.phase)||
       event.velocity!==original.velocity||
       JSON.stringify(event.sources)!==JSON.stringify(original.sources))
     failures.push({id,type:'planner changed canonical event',event});
    const key=event.time.toFixed(7);
    if(!byTime.has(key))byTime.set(key,[]);
    byTime.get(key).push(event);
   }
   let shared=0;
   for(const batch of byTime.values()){
    if(new Set(batch.map(x=>x.lane)).size>1){
     shared++;
     const keys=new Set(batch.map(x=>x.id));
     if(keys.size!==batch.length)failures.push({id,type:'cross-lane event identity collapsed'});
    }
   }
   statistics.push({id,events:all.length,perLanePhases:uniquePhases,
    multiSourcePhases:multiSource,sharedMoments:shared});
  }
  for(const p of presets)validate(p.id,p.tracks,p.bpm);
  // Four simultaneous independent lanes with coincident base/additional roots.
  // Within-lane union must merge source provenance into one hit, while each
  // other lane must retain a separate audible event at the same timestamp.
  const fixture=['kick','snare','hat','bass'].map(sound=>({
   a:1,b:0,n:4,sound,cycleBars:1,muted:false,operation:'union',
   layers:[{a:1,b:0,n:4,velocity:.63}],euclidean:null
  }));
  validate('four-lane-coincident-union',fixture,120);
  const events=fixture.map(t=>research.eventMetadata(t));
  const planned=math.planEvents(fixture.map((t,i)=>({
   cycleBars:1,sound:t.sound,muted:false,events:events[i]
  })),2,0,2);
  const atZero=planned.filter(e=>Math.abs(e.time)<1e-9);
  if(atZero.length!==4||new Set(atZero.map(e=>e.lane)).size!==4||
     atZero.some(e=>e.sources.length!==2))
   failures.push({id:'four-lane-coincident-union',type:'simultaneous independent four lanes not preserved',atZero});
  return {checkedPresetCount:presets.length,statistics,atZero:atZero.map(e=>({
   lane:e.lane,id:e.id,sources:e.sources.length
  })),failures:failures.slice(0,20)};
 });
 assert.equal(result.checkedPresetCount,50);
 assert.deepEqual(result.failures,[],'canonical sound event / source provenance violations');
 assert.deepEqual(errors,[],'runtime errors');
 fs.writeFileSync('artifacts/cross-lane-coincidence.json',JSON.stringify({
  status:'PASS',scope:'50 catalog presets plus overlapping four-lane union fixture; exact [from,to) scheduling partition and source integrity',...result
 },null,2));
 console.log('PASS 50 preset event maps and four independent simultaneous coincident lane hits; all sources retained');
 await page.close();
}finally{await browser.close()}
