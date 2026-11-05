import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const spec=read('MASTER_IMPLEMENTATION_SPEC.md');
const tasksText=read('TASKS.md'),trace=read('TRACEABILITY.md');
const req=[...new Set([...spec.matchAll(/^## (R-[A-Z]+-\d+)\./gm)].map(x=>x[1]))];
const knownReq=new Set(req),errors=[],items=[],keys=new Set;
for(const line of tasksText.split('\n')){
 if(!/^\| T-[A-Z]+-\d+/.test(line))continue;
 const parts=line.split(/(?<!\\)\|/).slice(1,-1).map(x=>x.trim().replace(/\\\|/g,'|'));
 if(parts.length!==11){errors.push('malformed table: '+line.slice(0,90));continue}
 const [id,requirement,parent,action,dependencies,deliverable,acceptance,status,evidence,defects,commit]=parts;
 if(keys.has(id))errors.push('duplicate task '+id);keys.add(id);
 if(!knownReq.has(requirement))errors.push('task has unknown requirement '+id);
 if(!/^T-[A-Z]+-\d+(?:-\d+)?$/.test(id))errors.push('invalid task ID '+id);
 if(!['TODO','IN_PROGRESS','BLOCKED','FAILED','VERIFIED'].includes(status))errors.push('bad status '+id);
 if(!acceptance||acceptance==='-')errors.push('missing acceptance '+id);
 if(!action||action==='-')errors.push('missing action '+id);
 if(status==='VERIFIED'&&(evidence==='-'||commit==='-'))errors.push('VERIFIED missing evidence or commit '+id);
 items.push({id,requirement,parent,dependencies,status});
}
for(const reqId of req){
 if(!items.some(t=>t.requirement===reqId))errors.push('requirement without task: '+reqId);
 if(!trace.includes('| '+reqId+' |'))errors.push('requirement missing traceability: '+reqId);
}
for(const item of items){
 if(!trace.includes(item.id))errors.push('task missing traceability: '+item.id);
 if(item.parent!=='-'&&!keys.has(item.parent))errors.push('missing parent '+item.id);
 if(item.dependencies!=='-')for(const d of item.dependencies.split(',').map(x=>x.trim()))if(!keys.has(d))errors.push('missing dependency '+item.id+': '+d);
}
for(const parent of items.filter(x=>x.parent==='-'&&x.status==='VERIFIED')){
 const children=items.filter(x=>x.parent===parent.id);
 if(children.some(x=>x.status!=='VERIFIED'))errors.push('verified parent has unfinished child '+parent.id);
}
console.log(JSON.stringify({requirements:req.length,tasks:items.length,verified:items.filter(t=>t.status==='VERIFIED').length,errors:errors.length,examples:errors.slice(0,30)},null,2));
if(errors.length)process.exitCode=1;
