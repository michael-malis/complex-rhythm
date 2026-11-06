import fs from 'node:fs';
const summary=JSON.parse(fs.readFileSync('LEDGER_EVIDENCE_SUMMARY.json','utf8'));
const s=summary.tasks,verified=s.VERIFIED,blocked=s.BLOCKED,progress=s.IN_PROGRESS,todo=s.TODO,failed=s.FAILED;
const verifiedRequirements=summary.verifiedRequirementIds.length;
if(verified+blocked+progress+todo+failed!==652||verifiedRequirements>98)
 throw Error('Cannot publish inconsistent status totals');
const code=String.fromCharCode(96);
function update(path,action){
 const before=fs.readFileSync(path,'utf8'),after=action(before);
 if(before===after)console.log('No progress change needed in '+path);
 else {fs.writeFileSync(path,after);console.log('Updated progress statement in '+path)}
}
update('FINAL_REPORT.md',text=>{
 const a=text.indexOf('## 1–6. Requirement accounting');
 const b=text.indexOf('## 7. Implemented changes');
 if(a<0||b<=a)throw Error('Cannot locate final report progress section');
 const section=[
  '## 1–6. Requirement accounting',
  '',
  '| Measure | Exact recorded value |',
  '|---|---:|',
  '| Requirements in supplied specification | 98 |',
  '| Registered tasks in TASKS.md | 652 |',
  '| Atomic subtasks | 554 |',
  '| Tasks formally marked VERIFIED | **'+verified+'** |',
  '| Tasks formally marked IN_PROGRESS | '+progress+' |',
  '| Tasks formally marked TODO | '+todo+' |',
  '| Tasks formally marked BLOCKED | '+blocked+' |',
  '| Tasks formally marked FAILED | '+failed+' |',
  '| Parent requirements VERIFIED | **'+verifiedRequirements+' of 98** |',
  '',
  'The CI-generated [LEDGER_EVIDENCE_SUMMARY.json](LEDGER_EVIDENCE_SUMMARY.json), '+
    '[TASKS.md](TASKS.md) and [TRACEABILITY.md](TRACEABILITY.md) hold the current evidence. '+
    'Verified reflects requirement-by-requirement recorded technical acceptance, '+
    'not human music or device signoff. **Final acceptance remains NOT COMPLETE.**',
  '',
 ].join('\n');
 text=text.slice(0,a)+section+'\n'+text.slice(b);
 text=text.replace(/(\d+) task records VERIFIED; 4 blockers/,verified+' task records VERIFIED; '+blocked+' blockers');
 text=text.replace(/Gate VII still cannot pass while \d+ tasks remain TODO, \d+ IN_PROGRESS and \d+ BLOCKED\./,
   'Gate VII still cannot pass while '+todo+' tasks remain TODO, '+progress+' IN_PROGRESS and '+blocked+' BLOCKED.');
 text=text.replace(/^\| VII — final verification \| NOT PASSED \|.*\|$/m,
  '| VII — final verification | NOT PASSED | '+verified+' VERIFIED, '+todo+' TODO, '+progress+' IN_PROGRESS, '+
  blocked+' BLOCKED; all 98 requirement gates not yet signed off |');
 text=text.replace(/^\| I — audit and traceability \| IN_PROGRESS \|.*\|$/m,
  '| I — audit and traceability | IN_PROGRESS | '+verifiedRequirements+'/98 requirements VERIFIED; '+
  'one annotated source image located, second missing |');
 return text;
});
update('README.md',text=>{
 const lines=text.split('\n');
 const found=lines.findIndex(line=>line.startsWith('Technical acceptance has been reconciled against GitHub Actions:'));
 if(found<0)throw Error('README technical acceptance line not found');
 lines[found]='Technical acceptance has been reconciled against GitHub Actions: **'+verified+
  ' of 652 tasks VERIFIED, '+blocked+' BLOCKED**, and **'+verifiedRequirements+
  ' of 98 parent requirements** verified. See [LEDGER_EVIDENCE_SUMMARY.json](LEDGER_EVIDENCE_SUMMARY.json), '+
  '[QA_REPORT.md](QA_REPORT.md) and [draft PR #1](https://github.com/michael-malis/complex-rhythm/pull/1). '+
  'This is not a fully accepted or deployed release.';
 return lines.join('\n');
});
update('QA_REPORT.md',text=>{
 const lines=text.split('\n');
 const found=lines.findIndex(line=>line.startsWith('5. '+code+'TASKS.md'+code));
 if(found<0)throw Error('QA report registry status line not found');
 lines[found]='5. '+code+'TASKS.md'+code+', '+code+'TRACEABILITY.md'+code+' and '+
  code+'ACCEPTANCE_CRITERIA.md'+code+' were reconciled through CI: '+
  verified+' task records VERIFIED, '+blocked+' BLOCKED, '+progress+' IN_PROGRESS and '+todo+
  ' TODO. Seven-gate acceptance remains unfinished.';
 return lines.join('\n');
});
console.log(JSON.stringify({tasks:summary.tasks,verifiedRequirements,release:'NOT COMPLETE'},null,2));
