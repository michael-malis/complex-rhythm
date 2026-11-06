import fs from 'node:fs';
import assert from 'node:assert/strict';

const plan=fs.readFileSync('NEXT_EXECUTION_PLAN.md','utf8');
const raw=fs.readFileSync('TASKS.md','utf8');
const rows=raw.split('\n').filter(line=>/^\| T-[A-Z]+-\d+/.test(line))
 .map(line=>line.split(/(?<!\\)\|/).slice(1,-1).map(value=>value.trim()));
assert.equal(rows.length,652,'Legacy task ledger must retain all 652 original rows');
assert.equal(new Set(rows.map(row=>row[0])).size,652,'No duplicate historical IDs');
const parents=rows.filter(row=>row[2]==='-');
assert.equal(parents.length,98,'All 98 original requirement parents remain present');
const known=new Set(parents.map(row=>row[1]));
assert.equal(known.size,98,'Requirement IDs must be unique');
const open=new Set(parents.filter(row=>row[7]!=='VERIFIED').map(row=>row[1]));
// The later issue-directory table intentionally repeats IDs as navigational links;
// only the canonical macro-task table defines operational tasks.
const active=plan.split('## GitHub work allocation')[0]
 .split('\n').filter(line=>/^\| M\d\d \|/.test(line));
assert.equal(active.length,14,'Exactly 14 operational tasks are planned');
const ids=new Set(),coverage=new Map(),crs=new Set(),packages=[];
for(const line of active){
 const fields=line.split('|').slice(1,-1).map(s=>s.trim());
 assert.equal(fields.length,6,'Bad macro-task table: '+line.slice(0,80));
 const [id,title,requirements,priority,status,done]=fields;
 assert.match(id,/^M(0[1-9]|1[0-4])$/,'Macro ID must belong to M01–M14');
 assert.ok(!ids.has(id),'Duplicate macro '+id);ids.add(id);
 assert.ok(title&&priority&&done,'Missing measurable macro description '+id);
 assert.ok(['TODO','IN_PROGRESS','BLOCKED','VERIFIED'].includes(status),'Invalid macro status '+id);
 const reqs=requirements.split(',').map(s=>s.trim());
 for(const req of reqs){
  if(req.startsWith('CR-')){
   assert.equal(req,'CR-UX-001','Unregistered new feature '+req);
   assert.ok(!crs.has(req),'Feature assigned twice '+req);crs.add(req);
  }else{
   assert.ok(known.has(req),'Unknown historical requirement '+req);
   // A macro stays in the 46-item original planning matrix even when one
   // of its underlying historical requirements has since been verified.
   assert.ok(!coverage.has(req),'Duplicate requirement '+req+' in '+id);
   coverage.set(req,id);
  }
 }
 const outstanding=rows.filter(row=>reqs.includes(row[1])&&row[7]!=='VERIFIED').length;
 packages.push({id,status,requirements:reqs,openLegacyChecks:outstanding});
}
assert.equal(coverage.size,46,'Cover all 46 open historical requirements');
assert.deepEqual([...open].filter(req=>!coverage.has(req)),[],
 'Some original outstanding requirements are unassigned');
assert.ok(open.size<=46,'The original 46 unresolved requirements must not increase');
const newlyAccepted=[...coverage.keys()].filter(req=>!open.has(req));
assert.deepEqual([...crs],['CR-UX-001'],'User requested preset-browser change must be tracked once');
const totalOpen=packages.reduce((n,p)=>n+p.openLegacyChecks,0);
assert.ok(totalOpen<=358,'The historical baseline has 358 open tasks');
console.log(JSON.stringify({
 status:'PASS',macros:active.length,verifiedMacros:packages.filter(p=>p.status==='VERIFIED').length,
 historicallyVerified:rows.filter(row=>row[7]==='VERIFIED').length,
 sourceRequirements:known.size,sourceOpenParents:open.size,coverage:coverage.size,
 newlyAcceptedOriginalRequirements:newlyAccepted,
 openHistoricalChecks:totalOpen,packages
},null,2));
