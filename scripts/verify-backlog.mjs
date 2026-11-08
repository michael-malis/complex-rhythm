import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const ledger=read('TASKS.md'),contract=read('PRODUCT_GUARANTEES.md');
const cells=line=>line.split('|').slice(1,-1).map(s=>s.trim());
const taskLines=ledger.split('\n').filter(s=>/^\| (?:BUNK-\d{2}|AUDIO-01|ACCESS-01|RELEASE-01) \|/.test(s));
const rows=taskLines.map(cells);
const expected=['BUNK-01','BUNK-02','BUNK-03','BUNK-04','BUNK-05','BUNK-06','BUNK-07','AUDIO-01','ACCESS-01','RELEASE-01'];
assert.deepEqual(rows.map(r=>r[0]),expected,'Exactly one stable record per active outcome');
const map=new Map(rows.map(r=>[r[0],r]));
assert.equal(map.size,rows.length,'Unique outcome IDs');
const statuses=new Set(['TODO','IN_PROGRESS','BLOCKED','DONE']);
for(const [id,result,status,depends,done,evidence] of rows){
 assert.equal(cells('| '+[id,result,status,depends,done,evidence].join(' | ')+' |').length,6);
 assert.ok(result.length>16&&done.length>60,'Outcome and Done criterion must be observable for '+id);
 assert.ok(statuses.has(status),'Unknown status: '+id);
 assert.ok(evidence.length>20,'No evidence/next action for '+id);
 if(status==='DONE')assert.match(evidence,/https:\/\/|[a-f0-9]{40}/,'DONE without linked evidence '+id);
 if(status==='BLOCKED')assert.ok(id==='AUDIO-01'||id==='ACCESS-01','Only real external reviews are blocked: '+id);
 for(const dep of depends==='-'?[]:depends.split(',').map(x=>x.trim())){
  assert.ok(map.has(dep),'Unknown dependency '+dep);
  assert.notEqual(dep,id,'Self-dependency '+id);
  if(status==='DONE')assert.equal(map.get(dep)[2],'DONE','DONE before dependency '+dep);
 }
}
const visiting=new Set(),visited=new Set();
function walk(id){
 if(visited.has(id))return;
 assert.ok(!visiting.has(id),'Cyclic dependency at '+id);
 visiting.add(id);
 const dep=map.get(id)[3];
 for(const x of dep==='-'?[]:dep.split(',').map(s=>s.trim()))walk(x);
 visiting.delete(id);visited.add(id);
}
for(const id of map.keys())walk(id);
assert.deepEqual(rows.filter(r=>r[2]==='BLOCKED').map(r=>r[0]),['AUDIO-01','ACCESS-01'],
 'Actual external reviews must not be called complete without observations');
const guaranteeLines=contract.split('\n').filter(l=>/^\| GU-\d\d \|/.test(l));
assert.equal(guaranteeLines.length,9,'Nine independent product domains, not nine task hierarchies');
assert.deepEqual(guaranteeLines.map(l=>cells(l)[0]),
 Array.from({length:9},(_,i)=>'GU-0'+(i+1)),'Product domains have stable, unique names');
for(const line of guaranteeLines){
 const [id,behavior,checks,manual]=cells(line);
 assert.ok(behavior.length>70&&manual.length>15,'Missing meaningful guarantee criteria '+id);
 const paths=[...checks.matchAll(/`((?:tests|scripts)\/[\w.-]+\.mjs)`/g)].map(m=>m[1]);
 assert.ok(paths.length>=2,'No executable regression evidence '+id);
 for(const path of paths)assert.ok(fs.existsSync(path),'Broken evidence path '+id+': '+path);
}
for(const path of [
 'MASTER_IMPLEMENTATION_SPEC.md','TRACEABILITY.md','ACCEPTANCE_CRITERIA.md',
 'NEXT_EXECUTION_PLAN.md','LEDGER_EVIDENCE_SUMMARY.json','PROGRESS_LOG.md',
 'FINAL_REPORT.md','CHANGE_REGISTER.md','QA_REPORT.md','AUDIT.md',
 'scripts/reconcile-ledger.mjs','scripts/sync-report-progress.mjs',
 'scripts/verify-traceability.mjs','scripts/verify-execution-plan.mjs',
 'scripts/verify-ledger-summary.mjs'
])assert.ok(!fs.existsSync(path),'Legacy active governance survived: '+path);
const readme=read('README.md');
for(const obsolete of ['NEXT_EXECUTION_PLAN.md','LEDGER_EVIDENCE_SUMMARY.json','TRACEABILITY.md','MASTER_IMPLEMENTATION_SPEC.md'])
 assert.ok(!readme.includes(obsolete),'README still advertises obsolete governance file: '+obsolete);
const workflow=read('.github/workflows/ui-regression.yml');
assert.ok(workflow.includes('node scripts/verify-backlog.mjs'),
 'Full regression must require valid product guarantees and live backlog');
for(const p of ['.github/workflows/spec-baseline.yml','.github/workflows/reconcile-ledger.yml']){
 const text=read(p);assert.ok(text.includes('node scripts/verify-backlog.mjs'),'CI must check the single backlog: '+p);
 assert.ok(!text.includes('verify-traceability.mjs')&&!text.includes('verify-execution-plan.mjs'),
  'Old registry validator still controlling CI: '+p);
}
console.log(JSON.stringify({status:'PASS',activeOutcomeTasks:rows.length,
 development:rows.filter(x=>x[0].startsWith('BUNK-')).length,
 externalReviews:rows.filter(x=>x[2]==='BLOCKED').length,
 releaseDecisions:1,guarantees:guaranteeLines.length,cycles:0,
 countedLegacyRows:0},null,2));
