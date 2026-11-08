import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// BUNK-07: integration is grounded in independently verified five Bunker
// renders and the real 50-preset browser event model. Human sound quality
// still requires the independent AUDIO-01 listening outcome.
const inventory=JSON.parse(fs.readFileSync('PRESET_INVENTORY.json','utf8'));
const bunkerIds=['berlin-bass-wall','concrete','pressure','shaft','iron'];
const reports=[
 'artifacts/bunker-driving/report.json',
 'artifacts/bunker-concrete/report.json',
 'artifacts/bunker-pressure/report.json',
 'artifacts/bunker-shaft/report.json',
 'artifacts/bunker-iron/report.json'
];
const inspected=reports.map(file=>{
 const d=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(d.status,'PASS','each specialized production-audio QA must pass: '+file);
 const audio=d.audio??d.sound??d.mix;
 assert.ok(audio?.finite,'real mixed audio must be finite: '+file);
 assert.ok(audio.peak>.02&&audio.peak<=Math.pow(10,-1/20)+.002,
  'measured production limiter peak remains bounded: '+file);
 const kickPeaks=audio.kickPeaks??audio.attackPeaks;
 assert.ok(kickPeaks?.length===8&&kickPeaks.every(x=>x>.012),
  'eight visible/audible beat attacks are independently rendered: '+file);
 return {id:d.id??d.redesigned?.id,peak:audio.peak,kickPeaks};
});
assert.deepEqual(new Set(inspected.map(r=>r.id)),new Set(bunkerIds));

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts/bunker-integration',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const data=await page.evaluate(()=>{
  const research=window.RhythmResearch,math=window.RhythmMath,catalog=research.presets();
  return catalog.map(p=>{
   const seconds=240/p.bpm;
   const scheduled=math.planEvents(p.tracks.map(t=>({cycleBars:t.cycleBars,
    gain:t.gain,muted:t.muted,sound:t.sound,patch:t.patch,
    events:research.eventMetadata(t)})),seconds,0,seconds*2);
   return {id:p.id,category:p.category,bpm:p.bpm,bars:p.bars||1,
    tracks:p.tracks.map(t=>({a:t.a,b:t.b,n:t.n,cycleBars:t.cycleBars||1,
     sound:t.sound,gain:t.gain??1,operation:t.operation||'union',
     patch:t.patch??null,euclidean:t.euclidean??null,layers:t.layers})),
    hasSources:scheduled.every(e=>e.sources?.length>0),
    events:scheduled.map(e=>({lane:e.lane,time:Number((e.time/seconds).toFixed(9)),
     velocity:Number(e.velocity.toFixed(5)),sound:e.instrument})),
    attackCount:scheduled.length};
  });
 });
 assert.equal(data.length,50,'canonical 50-preset catalog is unchanged');
 const current=new Map(data.map(x=>[x.id,x]));
 const signatures=new Set();
 for(const id of bunkerIds){
  const p=current.get(id);
  assert.ok(p,'missing Bunker result: '+id);
  assert.equal(p.bars,2,'each redesigned Bunker phrase is two bars: '+id);
  assert.equal(p.tracks.length,4);
  assert.ok(p.hasSources,'all four independent rings preserve event provenance: '+id);
  const kicks=p.events.filter(x=>x.lane===0);
  assert.deepEqual(kicks.map(x=>x.time),[0,.25,.5,.75,1,1.25,1.5,1.75],
   'quarter kick must be present for every beat in both bars: '+id);
  const sig=JSON.stringify(p.events.map(x=>[x.lane,x.time,x.velocity,x.sound]));
  assert.ok(!signatures.has(sig),'Bunker presets must not share the same four-lane scheduled attack map: '+id);
  signatures.add(sig);
 }
 const protectedIds=inventory.presets.filter(x=>x.category!=='bunker');
 assert.equal(protectedIds.length,44,'all 44 non-Bunker canonical presets are protected');
 for(const ref of protectedIds){
  const actual=current.get(ref.id);
  assert.ok(actual,'missing historical non-Bunker preset: '+ref.id);
  assert.equal(actual.bpm,ref.bpm,'non-Bunker tempo regression: '+ref.id);
  assert.equal(actual.tracks.length,4);
  ref.lanes.forEach((lane,i)=>{
   const t=actual.tracks[i];
   assert.deepEqual({a:t.a,b:t.b,n:t.n,cycleBars:t.cycleBars,sound:t.sound,
    gain:t.gain,operation:t.operation,patch:t.patch,euclidean:t.euclidean,layers:t.layers},
    {a:lane.complex.a,b:lane.complex.b,n:lane.rootDegree,
     cycleBars:lane.cycleBars,sound:lane.sound,gain:lane.gain,
     operation:lane.operation,patch:lane.synthPatch,euclidean:lane.euclidean,
     layers:lane.additionalRootSets},
    'all mathematics, sounds and user-data semantics protected: '+ref.id+' lane '+(i+1));
  });
 }
 const dust=current.get('dust');
 assert.deepEqual([dust.bpm,dust.bars,dust.tracks.map(t=>t.n),
  dust.tracks.map(t=>t.sound),dust.tracks.map(t=>t.gain),
  dust.tracks.map(t=>t.cycleBars),dust.tracks.map(t=>t.layers.length)],
 [134,1,[4,2,4,2],['kick','rim','openhat','bass'],
  [1,1,1,1],[1,1,1,1],[0,0,0,1]],
 'Dust · Half-light remains original');
 assert.ok(dust.hasSources);
 assert.deepEqual(errors,[],'integrated Bunker model produces no browser errors');
 const result={status:'PASS',scope:'BUNK-07 real 5-preset canonical math/audio event evidence and 44 untouched non-Bunker references; not human audition',
  designed:bunkerIds.map(id=>({id,bpm:current.get(id).bpm,
   events:current.get(id).attackCount,roots:current.get(id).tracks.map(t=>t.n)})),
  productionMixEvidence:inspected,protectedOtherPresets:44,protectedDust:true,
  distinctScheduledEventMaps:signatures.size};
 fs.writeFileSync('artifacts/bunker-integration/report.json',JSON.stringify(result,null,2));
 console.log('PASS five distinct Bunker events, all 40 quarter kicks measured, 44 untouched catalog configurations, separate audible-mix evidence');
 await page.close();
}finally{await browser.close()}
