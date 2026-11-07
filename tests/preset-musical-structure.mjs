import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// M10/R-PST-006: measure the REAL 50-preset root -> event -> time model,
// independently checking source/accent provenance, overdub deduplication,
// cross-lane simultaneity, restrained density and documented structure.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts/preset-structure',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const runtimeErrors=[];page.on('pageerror',e=>runtimeErrors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const report=await page.evaluate(()=>{
  const math=window.RhythmMath,research=window.RhythmResearch;
  const presets=research.presets();
  const near=(a,b,tolerance=2e-6)=>{
   const delta=Math.abs(a-b);
   return Math.min(delta,Math.abs(1-delta))<tolerance;
  };
  const rows=presets.map((preset,presetIndex)=>{
   const secPerBar=240/preset.bpm;
   const lanes=preset.tracks.map(t=>({
    cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,gain:t.gain,patch:t.patch,
    events:research.eventMetadata(t)
   }));
   const scheduled=math.planEvents(lanes,secPerBar,0,4*secPerBar);
   const analysis=math.analyzeSchedule(scheduled);
   const chunks=[];
   const duration=4*secPerBar;
   for(let from=0;from<duration-1e-10;from+=.173)
    chunks.push(...math.planEvents(lanes,secPerBar,from,Math.min(duration,from+.173)));
   const exact=scheduled.length===chunks.length&&scheduled.every((ev,i)=>{
    const k=chunks[i];return k&&ev.id===k.id&&Math.abs(ev.time-k.time)<1e-8&&
     ev.lane===k.lane&&ev.cycle===k.cycle&&ev.velocity===k.velocity&&
     ev.gain===k.gain&&ev.instrument===k.instrument&&
     JSON.stringify(ev.sources)===JSON.stringify(k.sources);
   });
   const sizes=[],ghosts=[],rootsHeld=[],noDuplicates=[],voices=[];
   for(const [i,t] of preset.tracks.entries()){
    const metadata=lanes[i].events;
    const base=research.rootPhases(t);
    rootsHeld.push(base.every(phase=>metadata.some(ev=>near(ev.phase,phase))));
    noDuplicates.push(metadata.every((ev,k)=>k===0||!near(ev.phase,metadata[k-1].phase)));
    sizes.push(metadata.length);
    ghosts.push(metadata.filter(ev=>ev.velocity>=.25&&ev.velocity<.85).length);
    voices.push({lane:i,sound:t.sound,rootDegree:t.n,baseRootCount:base.length,
     actualEvents:metadata.length,ghosts:ghosts[i],gain:t.gain,
     sourceCount:metadata.reduce((v,x)=>v+x.sources.length,0),
     overlayCount:t.layers.length,euclidean:!!t.euclidean});
   }
   const experimental=presetIndex>=35;
   const firstRoot=research.rootPhases(preset.tracks[0])[0];
   const sameMoment=lanes[1].events.some(ev=>near(ev.phase,firstRoot));
   const sharedPairs=scheduled.filter(ev=>ev.lane===0).some(ev=>
     scheduled.some(other=>other.lane===1&&Math.abs(other.time-ev.time)<1e-6));
   const ghostProvenance=lanes[0].events.some(ev=>ev.velocity>.4&&ev.velocity<.5&&
     ev.sources.some(src=>src.kind==='additional'))&&
     lanes[1].events.some(ev=>ev.velocity>.3&&ev.velocity<.4&&
     ev.sources.some(src=>src.kind==='additional'));
   return {id:preset.id,name:preset.name,category:preset.category,experimental,
    bpm:preset.bpm,mathNote:preset.mathNote,character:preset.character,
    commonCycleBars:math.commonCycle(preset.tracks),
    totalScheduledHits:scheduled.length,uniqueMoments:analysis.uniqueMoments,
    sharedMoments:analysis.sharedMoments,sharedLaneEvents:analysis.sharedLaneEvents,
    maxTimeDriftMilliseconds:exact?0:null,exactChunks:exact,
    noDuplicates:noDuplicates.every(Boolean),originalRootsPreserved:rootsHeld.every(Boolean),
    densityMin:Math.min(...sizes),densityMax:Math.max(...sizes),ghostCount:ghosts.reduce((a,v)=>a+v,0),
    lanes:voices,sharedKickResponse:sameMoment&&sharedPairs,
    ghostSourceProvenance:ghostProvenance,
    explicitStructure:!!preset.character&&!!preset.mathNote&&
      preset.mathNote.includes('shared kick/response phase')};
  });
  // Intra-lane coincident mathematical union produces precisely one source
  // event, with provenance retained and velocity=max. Cross-lane hits never fuse.
  const collisionTrack={a:1,b:0,n:4,cycleBars:1,muted:false,
   sound:'technoKick',gain:.7,operation:'union',euclidean:null,
   layers:[{a:1,b:0,n:1,velocity:.42}]};
  const sameLane=research.eventMetadata(collisionTrack);
  const otherTrack={...collisionTrack,sound:'metallic',layers:[]};
  const otherLane=research.eventMetadata(otherTrack);
  const testLanes=[{cycleBars:1,sound:'technoKick',gain:.7,muted:false,events:sameLane},
                   {cycleBars:1,sound:'metallic',gain:.5,muted:false,events:otherLane}];
  const collision=math.planEvents(testLanes,1,0,1);
  const downbeat=collision.filter(ev=>Math.abs(ev.time)<1e-8);
  return {status:'PASS',originalCatalogSize:presets.length,experimentalCount:rows.filter(p=>p.experimental).length,
   rows,collision:{uniqueSameLaneEvents:sameLane.length,coincidentSources:sameLane.find(e=>near(e.phase,0))?.sources.length,
    downbeatLaneAttacks:downbeat.length,downbeatLanes:downbeat.map(e=>e.lane),
    times:collision.map(ev=>({id:ev.id,time:ev.time,velocity:ev.velocity,lane:ev.lane}))}};
 });
 assert.equal(report.originalCatalogSize,50,'all 50 original catalog presets audited');
 assert.equal(report.experimentalCount,15,'all 15 original experimental studies audited');
 assert.equal(report.collision.uniqueSameLaneEvents,4,'one attack per same-lane union phase');
 assert.equal(report.collision.coincidentSources,2,'both original sources retained at merged root');
 assert.equal(report.collision.downbeatLaneAttacks,2,'both distinct lanes sound at shared phase');
 assert.deepEqual(report.collision.downbeatLanes,[0,1]);
 for(const p of report.rows){
  assert.equal(p.lanes.length,4,'each preset has four independent instrument roles: '+p.id);
  assert.ok(p.totalScheduledHits>0&&p.uniqueMoments>0,'all presets render real time events: '+p.id);
  assert.ok(p.exactChunks,'same event/velocity/instrument/source plan in small AudioContext lookahead chunks: '+p.id);
  assert.ok(p.noDuplicates&&p.originalRootsPreserved,'math phases must be unique per lane and retain original roots: '+p.id);
  assert.ok(p.lanes.every(x=>x.sound&&x.baseRootCount>=0&&x.actualEvents>=x.baseRootCount),
   'no missing root sets or instruments: '+p.id);
  if(p.experimental){
   assert.ok(p.explicitStructure,'each of 15 experiments documents rhythm roles and planned accents: '+p.id);
   assert.ok(p.sharedKickResponse&&p.sharedMoments>=1,
    'intentional cross-lane phase coincidence remains a separate audible hit: '+p.id);
   assert.ok(p.ghostSourceProvenance&&p.ghostCount>=2,
    'quiet one-root pickups produce measurable source-backed velocity contrast: '+p.id);
   assert.ok(p.densityMax-p.densityMin>=2&&p.densityMax/p.densityMin>=1.5,
    'sparse and dense voices must be visibly different: '+p.id);
   assert.ok(p.totalScheduledHits<220,'no dense runaway voices or uncontrolled time window: '+p.id);
   assert.ok(new Set(p.lanes.map(x=>x.sound)).size>=3,
    'ensemble has meaningful different instrument roles: '+p.id);
  }
 }
 assert.deepEqual(runtimeErrors,[],'no browser exceptions in canonical preset model');
 fs.writeFileSync('artifacts/preset-structure/report.json',JSON.stringify({
  ...report,scope:'Live root/phase/provenance/velocity/time semantics for 50 original presets; all 15 experimental studies prove kick/response coincidence, two ghost root accents, density contrast, distinct roles, and per-preset characterization. No human listening claim.'
 },null,2)+'\n');
 const notes=[
 '# Real musical-structure audit: all 50 root-based presets','',
 'Generated by tests/preset-musical-structure.mjs against the production preset and event model.',
 'A musical assertion here is quantitative timing/structure evidence, never subjective listening approval.','',
 '| ID | Category | Hits / four bars | Shared times | Ghosts | Sparse/dense | Root-preserving | 0.173s scheduling |','|---|---|---:|---:|---:|---|---|---|'
 ];
 for(const row of report.rows)notes.push('| '+row.id+' | '+row.category+' | '+row.totalScheduledHits+' | '+row.sharedMoments+
  ' | '+row.ghostCount+' | '+row.densityMin+'/'+row.densityMax+' | '+(row.originalRootsPreserved?'PASS':'FAIL')+
  ' | '+(row.exactChunks?'PASS':'FAIL')+' |');
 notes.push('','## All 15 experimental root-polyrhythms','','The first kick root and a response-lane single-root overlay now collide at the identical phase. Each first and second lane also contains a soft between-base-roots ghost event. The original n-degree root sets, offset phases, instrument assignments, tempo and gain remain intact.','');
 for(const r of report.rows.filter(x=>x.experimental)){
  notes.push('### '+r.name,'','**Musical design:** '+r.character,'',
   '**Mathematical construction:** '+r.mathNote,'',
   '**Actual structure:** '+r.sharedMoments+' cross-lane simultaneous times in a four-bar window; '+
     r.ghostCount+' soft events; '+r.densityMin+'–'+r.densityMax+
     ' events per lane cycle. '+r.lanes.map(x=>'Lane '+(x.lane+1)+': '+x.sound+
      ', n='+x.rootDegree+', '+x.actualEvents+' events, '+x.ghosts+' ghosts').join('; ')+'.','');
 }
 notes.push('## Boundaries','',
 'This report does not establish that a groove sounds musically appealing, genre-authentic or comfortable at a particular device volume. Independent user listening is still required under M13.','');
 fs.writeFileSync('artifacts/preset-structure/STRUCTURE_REPORT.md',notes.join('\n'));
 console.log('PASS M10: all 50 exact event windows; 15 structured root polyrhythms with live cross-lane coincidence, two real accent pickups, and bounded density');
 await page.close();
}finally{await browser.close()}
