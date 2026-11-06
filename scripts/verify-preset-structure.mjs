import fs from 'node:fs';
import assert from 'node:assert/strict';
const inventory=JSON.parse(fs.readFileSync('PRESET_INVENTORY.json','utf8'));
const report=fs.readFileSync('PRESET_STRUCTURE_AUDIT.md','utf8');
assert.equal(inventory.total,50);
const rows=report.split('\n').filter(line=>/^\| \`[a-z0-9-]+\` \|/.test(line));
assert.equal(rows.length,50,'One audited row per catalog preset');
for(const line of rows){
 const [idRaw,category,bpm,counts,shared,accents,additions,ratio,similarity]=line.split('|').slice(1,-1).map(x=>x.trim());
 const id=idRaw.replaceAll('`',''),p=inventory.presets.find(p=>p.id===id);
 assert.ok(p,'Unknown preset '+id);
 const sizes=p.lanes.map(l=>l.rhythmicEventCount);
 const expected=[
  p.category,String(p.bpm),sizes.join(':'),String(p.sharedPhaseGroups),
  String(p.lanes.flatMap(l=>l.actualEventPhases).filter(e=>e.velocity<.995).length),
  String(p.lanes.reduce((n,l)=>n+l.additionalRootSets.length+(l.euclidean?1:0),0)),
  (Math.max(...sizes)/Math.max(1,Math.min(...sizes))).toFixed(2),
  p.nearestMathematicalNeighbors.filter(x=>x.similarity>=.85)
   .map(x=>'\`'+x.id+':'+x.similarity.toFixed(2)+'\`').join(', ')||'none'
 ];
 assert.deepEqual([category,bpm,counts,shared,accents,additions,ratio,similarity],expected,'Structural evidence drift for '+id);
}
assert.equal(new Set(rows.map(r=>r.split('|')[1].trim())).size,50,'Duplicate source rows');
console.log('PASS: 50 structural records match actual 200 lanes, accent, overlap, density and similarity evidence');
