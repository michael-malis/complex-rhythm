import fs from 'node:fs';
import assert from 'node:assert/strict';

const parse=line=>line.split(/(?<!\\)\|/).slice(1,-1).map(s=>s.trim());
const rows=fs.readFileSync('TASKS.md','utf8').split('\n')
 .filter(line=>/^\| T-[A-Z]+-\d+/.test(line)).map(parse);
const summary=JSON.parse(fs.readFileSync('LEDGER_EVIDENCE_SUMMARY.json','utf8'));
const valid=['VERIFIED','IN_PROGRESS','TODO','BLOCKED','FAILED'];
assert.equal(rows.length,652,'Historic task ledger must preserve all 652 tasks');
for(const row of rows){
 assert.equal(row.length,11,'Malformed task record');
 assert.ok(valid.includes(row[7]),'Invalid status for '+row[0]);
}
const counted=Object.fromEntries(valid.map(status=>[
 status,rows.filter(row=>row[7]===status).length
]));
for(const status of valid)assert.equal(summary.tasks[status],counted[status],
 'Summary count disagrees with TASKS.md for '+status);
assert.equal(Object.values(counted).reduce((a,b)=>a+b,0),652);
const parent=rows.filter(row=>row[2]==='-');
assert.equal(parent.length,98,'Parent count changed');
const verified=parent.filter(row=>row[7]==='VERIFIED').map(row=>row[1]).sort();
const blocked=parent.filter(row=>row[7]==='BLOCKED').map(row=>row[1]).sort();
assert.deepEqual([...summary.verifiedRequirementIds].sort(),verified,
 'Verified parent requirements differ from actual ledger');
assert.deepEqual([...summary.blockedRequirementIds].sort(),blocked,
 'Blocked parent requirements differ from actual ledger');
console.log(JSON.stringify({
 status:'PASS',historicalTasks:rows.length,parentRequirements:parent.length,
 verifiedParents:verified.length,blockedParents:blocked.length,tasks:counted
},null,2));
