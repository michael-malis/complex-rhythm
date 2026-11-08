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


// Post-baseline user-approved tasks live in the SAME TASKS.md authority,
// but are not counted as the 652 historically frozen T-* source checks.
// Reject misplaced IDs, duplicate scopes, broken dependency links or
// accidental claims of implemented Bunker sound during the planning stage.
const changeRequest='CR-BNK-001';
const additional=raw.split('\n').filter(line=>/^\| CR-BNK-001(?:-\d\d)? \|/.test(line))
 .map(line=>line.split(/(?<!\\)\|/).slice(1,-1).map(value=>value.trim()));
assert.equal(additional.length,10,'Expected one Bunker change parent and nine outcome tasks');
const changeIds=new Set(additional.map(row=>row[0]));
assert.equal(changeIds.size,10,'No duplicate Bunker change task IDs');
const expectedChangeIds=[changeRequest,...Array.from({length:9},(_,i)=>changeRequest+'-'+String(i+1).padStart(2,'0'))];
assert.deepEqual([...changeIds],expectedChangeIds,'Stable Bunker IDs and planned order');
for(const [index,row] of additional.entries()){
 assert.equal(row.length,11,'Post-baseline tasks use the existing 11-column TASKS schema');
 const [id,requirement,parent,action,deps,deliverable,acceptance,status,evidence,defects,commit]=row;
 assert.equal(requirement,changeRequest,'Change tasks cannot masquerade as original R-* requirements');
 assert.equal(parent,index===0?'-':changeRequest,'Only one approved Bunker package parent');
 assert.match(action,/^P[01]:/,'Every new task needs an explicit priority');
 assert.ok(deliverable.length>25&&acceptance.length>35,'Each task needs deliverable and testable acceptance');
 assert.ok(['TODO','IN_PROGRESS','BLOCKED','FAILED','VERIFIED'].includes(status),'Invalid CR status '+id);
 if(status==='VERIFIED')assert.ok(evidence!=='-'&&commit!=='-','CR task VERIFIED without evidence '+id);
 if(status==='BLOCKED'||status==='FAILED')assert.notEqual(defects,'-','CR blocker without reason '+id);
 if(deps!=='-')for(const dep of deps.split(',').map(x=>x.trim())){
  assert.ok(changeIds.has(dep),'Unknown CR dependency '+dep);
  assert.ok(expectedChangeIds.indexOf(dep)<index,'CR dependencies must precede their tasks: '+id);
  if(status==='VERIFIED')assert.equal(additional[expectedChangeIds.indexOf(dep)][7],'VERIFIED',
   'Completed CR task has unaccepted dependency '+dep);
 }
}
const crRegister=fs.readFileSync('CHANGE_REGISTER.md','utf8');
assert.ok(crRegister.includes('## CR-BNK-001 ·'),'Approved scope missing from shared change register');
assert.ok(plan.includes('## M10 continuation · CR-BNK-001'),'CR work not linked to original M10 plan');
assert.ok(plan.includes('M13 human acceptance'),'Missing existing listening gate for Bunker changes');
assert.ok(additional.every(row=>row[7]==='TODO'),'Planning-only PR cannot pre-certify Bunker implementation');
console.log(JSON.stringify({status:'PASS',postBaselineChange:changeRequest,additionalTasks:additional.length,
 additionalVerified:additional.filter(row=>row[7]==='VERIFIED').length,
 combinedTaskRows:rows.length+additional.length,legacyTaskRows:rows.length,macros:active.length},null,2));
