import fs from 'node:fs';
import assert from 'node:assert/strict';

const doc=fs.readFileSync('NEXT_EXECUTION_PLAN.md','utf8');
const taskDoc=fs.readFileSync('TASKS.md','utf8');
const taskRows=taskDoc.split('\n').filter(line=>/^\| T-[A-Z]+-\d+/.test(line))
 .map(line=>line.split(/(?<!\\)\|/).slice(1,-1).map(x=>x.trim()));
assert.equal(taskRows.length,652,'Original 652 stable task IDs must remain present');
const taskIds=new Set(taskRows.map(row=>row[0]));
assert.equal(taskIds.size,652,'No duplicate task IDs may be introduced');
const parents=taskRows.filter(row=>row[2]==='-');
assert.equal(parents.length,98,'All 98 original requirement parents remain present');
const knownReq=new Set(parents.map(row=>row[1]));
assert.equal(knownReq.size,98,'Requirement IDs must remain unique');
const openParents=new Set(parents.filter(row=>row[7]!=='VERIFIED').map(row=>row[1]));

const tableRows=doc.split('\n').filter(line=>/^\| W\d\d \|/.test(line));
assert.equal(tableRows.length,8,'Eight execution workstreams are required');
const packageNames=new Set(),mapped=new Set();
let baselineOpenTotal=0;
const packageData=[];
for(const line of tableRows){
 const fields=line.split('|').slice(1,-1).map(s=>s.trim());
 assert.equal(fields.length,6,'Malformed workstream table row');
 const [id,title,priority,reqList,openCount,depends]=fields;
 assert.match(id,/^W0[1-8]$/,'Workstream ID must be W01…W08');
 assert.ok(!packageNames.has(id),'Duplicate workstream '+id);
 packageNames.add(id);
 assert.ok(title&&priority&&depends,'Package requires name, priority and dependencies');
 const reqs=reqList.split(',').map(s=>s.trim());
 assert.ok(reqs.length,'Package has no requirements: '+id);
 for(const req of reqs){
  assert.match(req,/^R-[A-Z]+-\d+$/,'Invalid requirement '+req);
  assert.ok(knownReq.has(req),'Unregistered requirement '+req);
  assert.ok(!mapped.has(req),'Requirement assigned to multiple packages '+req);
  mapped.add(req);
 }
 assert.match(openCount,/^\d+$/,'Missing baseline task count '+id);
 baselineOpenTotal+=Number(openCount);
 packageData.push({id,requirements:reqs.length,baselineOpenTasks:Number(openCount)});
}
assert.equal(mapped.size,46,'The post-merge snapshot must have exactly 46 assigned requirement IDs');
assert.equal(baselineOpenTotal,358,'Original snapshot contains 358 not-yet-verified tasks');
const missing=[...openParents].filter(req=>!mapped.has(req));
assert.deepEqual(missing,[],'New or still-open requirements omitted from execution plan');
const initialKnownOpen=taskRows.filter(row=>mapped.has(row[1])&&row[7]!=='VERIFIED').length;
assert.ok(initialKnownOpen<=baselineOpenTotal,
 'All initially unfinished workstreams must only decrease in open tasks unless plan is revised');
console.log(JSON.stringify({
 validity:'PASS',requirements:knownReq.size,stableTasks:taskRows.length,
 assignedParents:mapped.size,openParents:openParents.size,
 originalOpenTasks:baselineOpenTotal,currentOpenTasks:initialKnownOpen,
 openUnassigned:missing,workstreams:packageData
},null,2));
