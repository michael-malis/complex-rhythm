import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let presets;
try {
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 presets=await page.evaluate(()=>{
  if(!window.RhythmResearch)throw Error('Read-only preset research interface unavailable');
  return window.RhythmResearch.presets().map(p=>({
   ...p,tracks:p.tracks.map(t=>({...t,events:window.RhythmResearch.events(t),basePhases:window.RhythmResearch.rootPhases(t)}))
  }));
 });
 await page.close();
}finally{await browser.close()}
assert.equal(presets.length,50,'35 original plus 15 new studies');
assert.equal(new Set(presets.map(x=>x.id)).size,50,'unique preset IDs');
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a/gcd(a,b)*b;
const Q=1000000;
const tick=x=>Math.round((((x%1)+1)%1)*Q)%Q;
const newStudies=presets.slice(35);
const standardFour=track=>{
 const points=track.events.map(e=>e.phase).slice().sort((a,b)=>a-b);
 if(points.length!==4)return false;
 return points.every((p,i)=>{
  const next=points[(i+1)%4]+(i===3?1:0);
  return Math.abs(next-p-.25)<1e-6;
 });
};
const nontrivialLead=newStudies.filter(p=>!standardFour(p.tracks[0]));
assert.ok(nontrivialLead.length>=12,
 'R-PST-002 requires >=12/15 new studies to avoid an unchanged four-on-the-floor first lane; found '+nontrivialLead.length);
const rows=[];
for(const p of presets){
 assert.equal(p.tracks.length,4,'four lanes: '+p.id);
 const common=p.tracks.map(t=>t.cycleBars||1).reduce(lcm,1);
 assert.ok(common<=32,'exhaustive rotation audit needs common period <=32: '+p.id);
 const full=[],degrees=[],offsets=[],sounds=[],counts=[];
 p.tracks.forEach((track,i)=>{
  assert.ok(Number.isInteger(track.n)&&track.n>=1&&track.n<=64,'degree '+p.id);
  assert.ok(Number.isFinite(track.a)&&Number.isFinite(track.b),'finite coefficients '+p.id);
  const phases=track.events.map(e=>e.phase).sort((a,b)=>a-b);
  for(let k=0;k<phases.length;k++){
   assert.ok(phases[k]>=0&&phases[k]<1,'phase bounds '+p.id);
   if(k)assert.ok(phases[k]-phases[k-1]>1e-6-1e-10,'deduplicated lane '+p.id);
  }
  degrees.push(track.n);sounds.push(track.sound);counts.push(phases.length);
  if(Math.abs(Math.atan2(track.b,track.a))>1e-6)offsets.push(i+1);
  for(let c=0;c<common/track.cycleBars;c++)
   for(const phase of phases)full.push([i,tick((c+phase)*track.cycleBars/common)]);
 });
 full.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 const raw=full.map(x=>x[0]+':'+x[1]).join(';');
 const roots=full.filter(x=>x[0]===0).map(x=>x[1]);
 const shifts=roots.length?roots:[0];
 const shifted=shifts.map(shift=>full.map(x=>[x[0],(x[1]-shift+Q)%Q])
   .sort((a,b)=>a[1]-b[1]||a[0]-b[0]).map(x=>x[0]+':'+x[1]).join(';')).sort()[0];
 let shared=0;
 for(let k=0;k<full.length;){
  let end=k+1;const lanes=new Set([full[k][0]]);
  while(end<full.length&&full[end][1]===full[k][1]){lanes.add(full[end][0]);end++}
  if(lanes.size>1)shared++;k=end;
 }
 rows.push({id:p.id,category:p.category,bpm:p.bpm,bars:common,degrees,offsets,sounds,counts,shared,
  character:p.character,mathNote:p.mathNote,raw,shifted,
  param:JSON.stringify({bpm:p.bpm,bars:p.bars,tracks:p.tracks.map(t=>({...t,events:undefined}))}),
  geom:JSON.stringify(p.tracks.map(t=>({a:t.a,b:t.b,n:t.n,cycleBars:t.cycleBars,layers:t.layers,euclidean:t.euclidean,operation:t.operation}))),
  instr:sounds.join('/')});
}

const rowById=new Map(rows.map(r=>[r.id,r]));
function expandedSet(row,fullBars){
 const set=new Set();
 const n=fullBars/row.bars;
 for(let rep=0;rep<n;rep++){
  for(const item of row.raw.split(';')){
   if(!item)continue;
   const [lane,phase]=item.split(':').map(Number);
   const pos=Math.round((rep*Q+phase)*row.bars/fullBars)%Q;
   set.add(lane+':'+pos);
  }
 }
 return set;
}
function jaccard(a,b){
 const common=lcm(a.bars,b.bars),left=expandedSet(a,common),right=expandedSet(b,common);
 let shared=0;for(const entry of left)if(right.has(entry))shared++;
 return shared/(left.size+right.size-shared||1);
}
const inventory=presets.map((p,index)=>{
 const row=rowById.get(p.id);
 const nearest=rows.filter(r=>r.id!==p.id).map(r=>({id:r.id,
  similarity:Number(jaccard(row,r).toFixed(4)),bpm:r.bpm}))
  .sort((a,b)=>b.similarity-a.similarity||a.id.localeCompare(b.id)).slice(0,3);
 return {
  id:p.id,name:p.name,category:p.category,origin:index<35?'original catalog':'new mathematical study',
  bpm:p.bpm,commonCycleBars:row.bars,
  character:p.character||null,mathNote:p.mathNote||null,
  eventFingerprint:row.raw,rotationCanonicalFingerprint:row.shifted,
  sharedPhaseGroups:row.shared,totalScheduledEvents:row.counts.reduce((a,b)=>a+b,0),
  nearestMathematicalNeighbors:nearest,
  lanes:p.tracks.map((t,i)=>({
   lane:i+1,sound:t.sound,complex:{a:t.a,b:t.b},
   modulus:Math.hypot(t.a,t.b),argumentRadians:t.a===0&&t.b===0?null:Math.atan2(t.b,t.a),
   argumentDegrees:t.a===0&&t.b===0?null:Math.atan2(t.b,t.a)*180/Math.PI,
   rootDegree:t.n,cycleBars:t.cycleBars,operation:t.operation,gain:t.gain,
   synthPatch:t.patch||null,euclidean:t.euclidean||null,
   additionalRootSets:t.layers||[],
   baseRootPhases:t.basePhases.map(x=>Number(x.toFixed(10))).sort((a,b)=>a-b),
   actualEventPhases:t.events.map(e=>({phase:Number(e.phase.toFixed(10)),
     velocity:Number(e.velocity.toFixed(5))})),
   rhythmicEventCount:t.events.length
  }))
 };
});
fs.writeFileSync('PRESET_INVENTORY.json',JSON.stringify({
 schema:'roots-rhythm-preset-inventory/1',
 generatedBy:'tests/preset-diversity.mjs',
 units:{phase:'fraction of its own lane cycle',argument:'radians or degrees as labelled'},
 similarityMethod:'Four-lane Jaccard of exact event positions over pairwise LCM; timing only; not a listening score',
 total:inventory.length,originals:35,newStudies:15,
 presets:inventory
},null,2)+'\n');
const inventoryLines=[
 '# All 50 preset configurations: source parameters and actual phases','',
 'Generated from the live event model. Phase fractions are relative to each lane cycle.',
 'Similarity is pairwise four-lane Jaccard over the LCM; not a subjective musical score.',''
];
for(const p of inventory){
 inventoryLines.push('## '+p.name+' ('+p.id+')','',
  '**Group:** '+p.origin+' · **Category:** '+p.category+' · **BPM:** '+p.bpm+
  ' · **Common period:** '+p.commonCycleBars+' bars · **Shared phase groups:** '+p.sharedPhaseGroups+'.');
 if(p.character)inventoryLines.push('**Musical role:** '+p.character);
 if(p.mathNote)inventoryLines.push('**Mathematical design:** '+p.mathNote);
 inventoryLines.push('','| Lane | z = a + bi | arg(z), deg | n | Bars | Sound | Base root phases | Final phases and velocities |','|---|---|---:|---:|---:|---|---|---|');
 for(const lane of p.lanes){
  const numeric=x=>Number(x.toFixed(6)).toString();
  const z=numeric(lane.complex.a)+(lane.complex.b<0?' − ':' + ')+numeric(Math.abs(lane.complex.b))+'i';
  const phases=lane.baseRootPhases.map(numeric).join(', ')||'none (z=0)';
  const events=lane.actualEventPhases.map(x=>numeric(x.phase)+'@'+numeric(x.velocity)).join(', ')||'none';
  inventoryLines.push('| '+lane.lane+' | '+z+' | '+(lane.argumentDegrees===null?'undefined':numeric(lane.argumentDegrees))+
  ' | '+lane.rootDegree+' | '+lane.cycleBars+' | '+lane.sound+' | '+phases+' | '+events+' |');
 }
 inventoryLines.push('', '**Operations, patches and accents:** '+
  p.lanes.map(l=>'L'+l.lane+': '+l.operation+', '+l.additionalRootSets.length+
  ' additional sets, '+(l.euclidean?'E('+l.euclidean.k+','+l.euclidean.n+')':'no Euclidean overlay')+
  ', patch '+(l.synthPatch?JSON.stringify(l.synthPatch):'default')+
  ', gain '+l.gain).join(' · '),
  '','**Nearest timing neighbors (Jaccard):** '+
  p.nearestMathematicalNeighbors.map(n=>n.id+' ('+n.similarity+')').join(', '),
  '','**Fingerprint:** '+p.eventFingerprint,'');
}
fs.writeFileSync('PRESET_INVENTORY.md',inventoryLines.join('\n'));

function repeated(key,subset=rows){
 const map=new Map();
 subset.forEach(p=>map.set(p[key],(map.get(p[key])||[]).concat([p.id])));
 return [...map.values()].filter(v=>v.length>1).sort((a,b)=>b.length-a.length);
}
const categoryCounts=new Map(),degreeCounts=new Map(),soundCounts=new Map();
rows.forEach(p=>{
 categoryCounts.set(p.category,(categoryCounts.get(p.category)||0)+1);
 p.degrees.forEach(d=>degreeCounts.set(d,(degreeCounts.get(d)||0)+1));
 p.sounds.forEach(d=>soundCounts.set(d,(soundCounts.get(d)||0)+1));
});
const lines=[
 '# Automatic preset diversity audit',
 '',
 'Generated by tests/preset-diversity.mjs from the live application event calculator. This is quantitative geometry, not human listening.',
 '',
 '## Inventory',
 '',
 '- Presets: **'+rows.length+'**; unique IDs: **'+new Set(rows.map(p=>p.id)).size+'**.',
 '- Distinct raw four-lane event maps: **'+new Set(rows.map(p=>p.raw)).size+'**.',
 '- Distinct event maps modulo one COMMON cyclic rotation: **'+new Set(rows.map(p=>p.shifted)).size+'**.',
 '- Distinct mathematical structural parameter sets: **'+new Set(rows.map(p=>p.geom)).size+'**.',
 '- Distinct ordered instrument quartets: **'+new Set(rows.map(p=>p.instr)).size+'**.',
 '- Studies with nonzero phase offsets: **'+rows.filter(p=>p.offsets.length).length+'**.',
 '- Presets containing simultaneous different-lane events: **'+rows.filter(p=>p.shared>0).length+'**.',
 '- Studies documenting both musical and mathematical roles: **'+rows.filter(p=>p.character&&p.mathNote).length+'**.',
 '',
 'The rotation algorithm expands all events over the common LCM period (current catalog <=32 bars) and rotates the entire four-lane point cloud by the SAME offset. It does not rotate tracks independently or inflate uniqueness by renaming.',
 '',
 '## Category frequencies',
 '',
 '| Category | Presets |','|---|---:|'
];
for(const [k,v] of [...categoryCounts.entries()].sort((a,b)=>b[1]-a[1]))lines.push('| '+k+' | '+v+' |');
lines.push('','## Mandatory first-lane novelty','','- New studies with a nonstandard first lane: **'+nontrivialLead.length+' / 15** (minimum 12).',
 '- Standard four-on-the-floor means exactly four equally spaced final onset phases, regardless of common rotation.',
 '- Exempt traditional studies are not silently excluded; all 15 new studies are counted.',
 '- Nonstandard studies: '+nontrivialLead.map(p=>p.id).join(', '));
lines.push('','## BPM frequency','','| Range | Count |','|---|---:|');
for(const [lo,hi] of [[0,119],[120,139],[140,159],[160,179],[180,199],[200,219],[220,260]])
 lines.push('| '+lo+'–'+hi+' | '+rows.filter(p=>p.bpm>=lo&&p.bpm<=hi).length+' |');
lines.push('','## Degree frequency','','| Root degree n | Uses |','|---|---:|');
for(const [k,v] of [...degreeCounts.entries()].sort((a,b)=>a[0]-b[0]))lines.push('| '+k+' | '+v+' |');
lines.push('','## Instrument frequency','','| Sound | Uses |','|---|---:|');
for(const [k,v] of [...soundCounts.entries()].sort((a,b)=>b[1]-a[1]))lines.push('| '+k+' | '+v+' |');
for(const [label,key] of [['Exact parameter duplicates','param'],['Same root structure (different sound or BPM possible)','geom'],['Identical four-lane event maps','raw'],['Cyclically rotated equivalent event maps','shifted'],['Repeated ordered sound quartets','instr']]){
 const groups=repeated(key);
 lines.push('','## '+label+' ('+groups.length+' groups)','');
 lines.push(groups.length?groups.map(g=>'- '+g.join(', ')).join('\n'):'None found.');
}
lines.push('','## Repeated first-lane patterns','');
const byFirst=new Map();
for(const p of rows){
 const first=p.raw.split(';').filter(x=>x.startsWith('0:')).join(';');
 byFirst.set(first,(byFirst.get(first)||[]).concat([p.id]));
}
const firstRepeat=[...byFirst.values()].filter(x=>x.length>1);
lines.push(firstRepeat.length?firstRepeat.map(x=>'- '+x.join(', ')).join('\n'):'None found.');
lines.push('','## Within-category cyclic rotation repetition','');
const intra=[];
for(const cat of categoryCounts.keys())for(const ids of repeated('shifted',rows.filter(p=>p.category===cat)))intra.push('- '+cat+': '+ids.join(', '));
lines.push(intra.length?intra.join('\n'):'None found.');
lines.push('','## Every preset: exact calculated model','','| ID | Category | BPM | Root degrees | Events per lane | Shifted lanes | Shared phase groups | Instrument quartet |','|---|---|---:|---|---|---|---:|---|');
for(const p of rows)lines.push('| '+p.id+' | '+p.category+' | '+p.bpm+' | '+p.degrees.join(':')+' | '+p.counts.join('/')+' | '+(p.offsets.join(',')||'none')+' | '+p.shared+' | '+p.instr+' |');
lines.push('','## Interpretation',
 '','- A new name, instrument sample or global phase offset does NOT prove musical originality.',
 '- The first-lane repetitions and common-rotation groups identify rhythmically related candidates for deliberate redesign.',
 '- This report does NOT validate perceived musical quality, genre authenticity, sound balance or mobile headphone performance.',
 '- All calculations are derived from the same event function as the visual and audio scheduler.',
 '- Real device listening and expert musical review remain outstanding.',
 '');
lines.push('','**Full coordinates, source phases, instruments, patch and neighbor audit:** [PRESET_INVENTORY.md](PRESET_INVENTORY.md) and [PRESET_INVENTORY.json](PRESET_INVENTORY.json).');
const report=lines.join('\n');
fs.writeFileSync('PRESET_DIVERSITY_REPORT.md',report);
console.log(JSON.stringify({presets:rows.length,categories:categoryCounts.size,
 exactParameterDuplicateGroups:repeated('param').length,
 exactEventDuplicateGroups:repeated('raw').length,
 cyclicRotationGroups:repeated('shifted').length,
 distinctSoundQuartets:new Set(rows.map(p=>p.instr)).size,shiftedStudies:rows.filter(p=>p.offsets.length).length,
 reportBytes:report.length},null,2));
