import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const ledger=read('TASKS.md'),contract=read('PRODUCT_GUARANTEES.md');
const cells=line=>line.split('|').slice(1,-1).map(s=>s.trim());
const taskLines=ledger.split('\n').filter(s=>/^\| [A-Z][A-Z0-9]*-\d{2} \|/.test(s));
const rows=taskLines.map(cells);
assert.ok(rows.length>0,'Active backlog cannot be empty without explicit release closure');
for(const r of rows)assert.equal(r.length,6,'Every work item has six meaningful columns');
const map=new Map(rows.map(r=>[r[0],r]));
assert.equal(map.size,rows.length,'Unique outcome IDs');
const statuses=new Set(['TODO','IN_PROGRESS','BLOCKED','DONE']);
for(const [id,result,status,depends,done,evidence] of rows){
 assert.equal(cells('| '+[id,result,status,depends,done,evidence].join(' | ')+' |').length,6);
 assert.ok(result.length>16&&done.length>60,'Outcome and Done criterion must be observable for '+id);
 assert.ok(statuses.has(status),'Unknown status: '+id);
 assert.ok(evidence.length>20,'No evidence/next action for '+id);
 if(status==='DONE')assert.match(evidence,/https:\/\/|[a-f0-9]{40}/,'DONE without linked evidence '+id);
 if(status==='BLOCKED')assert.match(evidence,/unavailable|not yet|pending|await|blocked|не\s+доступ/i,'Blocked outcome needs a concrete, visible blocker: '+id);
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
// New independently useful outcomes can be added, and completed outcomes can
// leave the active list. The verifier must never fix the task denominator.
for(const r of rows.filter(r=>r[2]==='BLOCKED'))
 assert.ok(r[5].length>35,'Blocked work needs a precise next action: '+r[0]);
const guaranteeLines=contract.split('\n').filter(l=>/^\| GU-\d\d \|/.test(l));
assert.ok(guaranteeLines.length>=9,'Core product invariants must not disappear');
assert.equal(new Set(guaranteeLines.map(l=>cells(l)[0])).size,guaranteeLines.length,
 'Duplicate product guarantee IDs');
for(const id of Array.from({length:9},(_,i)=>'GU-0'+(i+1)))
 assert.ok(guaranteeLines.some(l=>cells(l)[0]===id),'Core guarantee removed: '+id);
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
 'scripts/verify-ledger-summary.mjs',
 '.github/workflows/spec-baseline.yml', '.github/workflows/reconcile-ledger.yml'
])assert.ok(!fs.existsSync(path),'Legacy active governance survived: '+path);
const readme=read('README.md');
for(const obsolete of ['NEXT_EXECUTION_PLAN.md','LEDGER_EVIDENCE_SUMMARY.json','TRACEABILITY.md','MASTER_IMPLEMENTATION_SPEC.md'])
 assert.ok(!readme.includes(obsolete),'README still advertises obsolete governance file: '+obsolete);
const workflow=read('.github/workflows/ui-regression.yml');
assert.ok(workflow.includes('node scripts/verify-backlog.mjs'),
 'Full regression must require valid product guarantees and live backlog');
for(const p of ['.github/workflows/current-visual-evidence.yml','.github/workflows/outcome-quality.yml']){
 const text=read(p);assert.ok(text.includes('node scripts/verify-backlog.mjs'),'CI must check the single backlog: '+p);
 assert.ok(!text.includes('verify-traceability.mjs')&&!text.includes('verify-execution-plan.mjs'),
  'Old registry validator still controlling CI: '+p);
}
console.log(JSON.stringify({status:'PASS',activeOutcomeTasks:rows.length,
 development:rows.filter(x=>x[0].startsWith('BUNK-')).length,
 externalReviews:rows.filter(x=>x[2]==='BLOCKED').length,
 releaseDecisions:1,guarantees:guaranteeLines.length,cycles:0,
 countedLegacyRows:0},null,2));
