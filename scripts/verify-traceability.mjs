import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const spec=read('MASTER_IMPLEMENTATION_SPEC.md'),tasksDoc=read('TASKS.md'),
      traceDoc=read('TRACEABILITY.md'),acceptanceDoc=read('ACCEPTANCE_CRITERIA.md');
const requirements=[...new Set([...spec.matchAll(/^## (R-[A-Z]+-\d+)\./gm)].map(m=>m[1]))],
      reqSet=new Set(requirements),valid=new Set(['TODO','IN_PROGRESS','BLOCKED','FAILED','VERIFIED']),
      errors=[],items=[],ids=new Set();
const cellParser=line=>line.split(/(?<!\\)\|/).slice(1,-1).map(x=>x.trim().replace(/\\\|/g,'|'));
for(const line of tasksDoc.split('\n')){
 if(!/^\| T-[A-Z]+-\d+/.test(line))continue;
 const p=cellParser(line);
 if(p.length!==11){errors.push('invalid task columns: '+line.slice(0,65));continue}
 const [id,requirement,parent,action,dependencies,deliverable,acceptance,status,evidence,defects,commit]=p;
 if(ids.has(id))errors.push('duplicate task ID '+id);
 ids.add(id);
 if(!/^T-[A-Z]+-\d+(?:-\d+)?$/.test(id))errors.push('invalid task ID '+id);
 if(!reqSet.has(requirement))errors.push('unknown requirement of '+id);
 if(!valid.has(status))errors.push('invalid status '+id);
 if(!action||action==='-')errors.push('task has no action '+id);
 if(!acceptance||acceptance==='-')errors.push('task has no acceptance '+id);
 if(!deliverable||deliverable==='-')errors.push('task has no deliverable '+id);
 if(status==='VERIFIED'&&(evidence==='-'||commit==='-'))errors.push('VERIFIED without evidence+commit '+id);
 if(status==='BLOCKED'&&(defects==='-'||evidence==='-'))errors.push('BLOCKED without reason and evidence '+id);
 if(status==='FAILED'&&defects==='-')errors.push('FAILED without defect '+id);
 items.push({id,requirement,parent,dependencies,status,evidence,commit,acceptance});
}
const parents=items.filter(t=>t.parent==='-'),byId=new Map(items.map(t=>[t.id,t]));
for(const task of items){
 if(task.parent!=='-'&&!byId.has(task.parent))errors.push('missing parent '+task.id);
 if(task.parent!=='-'&&byId.get(task.parent)?.requirement!==task.requirement)
  errors.push('child has different requirement '+task.id);
 if(task.dependencies!=='-'){
  for(const dep of task.dependencies.split(',').map(x=>x.trim())){
   if(!byId.has(dep))errors.push('missing dependency '+task.id+': '+dep);
   if(task.status==='VERIFIED'&&byId.get(dep)?.status!=='VERIFIED')errors.push('unverified dependency '+task.id+': '+dep);
  }
 }
 if(!traceDoc.includes(task.id))errors.push('task missing traceability '+task.id);
}
for(const parent of parents.filter(t=>t.status==='VERIFIED')){
 const child=items.filter(t=>t.parent===parent.id);
 if(child.some(t=>t.status!=='VERIFIED'))errors.push('verified parent has unverified children '+parent.id);
}
const traceRows=new Map(),acceptRows=new Map();
for(const line of traceDoc.split('\n')){
 if(!/^\| R-[A-Z]+-\d+ \|/.test(line))continue;
 const p=cellParser(line);if(p.length!==6){errors.push('invalid trace row '+line.slice(0,50));continue}
 if(traceRows.has(p[0]))errors.push('duplicate trace requirement '+p[0]);
 traceRows.set(p[0],p);
}
for(const line of acceptanceDoc.split('\n')){
 if(!/^\| R-[A-Z]+-\d+ \|/.test(line))continue;
 const p=cellParser(line);if(p.length!==5){errors.push('invalid acceptance row '+line.slice(0,50));continue}
 if(acceptRows.has(p[0]))errors.push('duplicate acceptance requirement '+p[0]);
 acceptRows.set(p[0],p);
}
for(const req of requirements){
 const tasks=items.filter(t=>t.requirement===req);
 const parent=tasks.find(t=>t.parent==='-');
 if(!tasks.length)errors.push('requirement without task '+req);
 if(!parent)errors.push('requirement without parent '+req);
 const trace=traceRows.get(req),accept=acceptRows.get(req);
 if(!trace)errors.push('requirement missing traceability '+req);
 else {
  for(const task of tasks)if(!trace[1].includes(task.id))errors.push('task missing in requirement trace row '+task.id);
  if(parent&&trace[5]!==parent.status)errors.push('stale trace status '+req);
  if(parent&&trace[4]!==parent.evidence)errors.push('stale trace evidence '+req);
  if(!trace[2]||trace[2]==='-')errors.push('no implementation target '+req);
  if(!trace[3]||trace[3]==='-')errors.push('no test target '+req);
 }
 if(!accept)errors.push('requirement missing acceptance '+req);
 else {
  if(!accept[2]||accept[2]==='-')errors.push('missing acceptance criterion '+req);
  if(parent&&accept[3]!==parent.status)errors.push('stale acceptance status '+req);
  if(parent&&accept[4]!==parent.evidence)errors.push('stale acceptance evidence '+req);
 }
}
for(const key of traceRows.keys())if(!reqSet.has(key))errors.push('unknown traced requirement '+key);
for(const key of acceptRows.keys())if(!reqSet.has(key))errors.push('unknown accepted requirement '+key);
console.log(JSON.stringify({
 requirements:requirements.length,tasks:items.length,
 statuses:Object.fromEntries([...valid].map(s=>[s,items.filter(t=>t.status===s).length])),
 verifiedRequirements:parents.filter(t=>t.status==='VERIFIED').length,
 blockedRequirements:parents.filter(t=>t.status==='BLOCKED').length,
 errors:errors.length,examples:errors.slice(0,40)
},null,2));
if(errors.length)process.exitCode=1;
