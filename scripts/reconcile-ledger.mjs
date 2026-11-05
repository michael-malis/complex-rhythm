/**
 * Reconcile traceability with *already executed* CI evidence.
 * Does not infer completion merely because an implementation file exists.
 * Run only after reviewing GitHub Actions artifact evidence and code at the
 * referenced SHAs. Missing human/visual acceptance remains BLOCKED/TODO.
 */
import fs from "node:fs";

const CI="https://github.com/michael-malis/complex-rhythm/actions/runs/";
const testRun=42107150484;
const verified=new Map();
const register=(ids,what,sha="0fab137afaa17e1bbb2ed1e46f3a6104948ce2fa")=>{
 for(const id of ids)verified.set(id,{
  evidence: "CI:"+testRun+"; "+what,
  commit:sha
 });
};
register([
 "R-QM-001","R-QM-002","R-QM-003","R-QM-004","R-QM-005",
 "R-QM-006","R-QM-007","R-QM-008","R-QM-009","R-QM-010",
 "R-QM-011","R-QM-012"
],"tests/math-io.test.mjs; tests/ui-smoke.mjs; 60 math + 144 UI assertions");
register([
 "R-MDL-003","R-MDL-004","R-MDL-005"
],"math-io.js; tests/ui-smoke.mjs; 3:4 LCM; multi-operand intersection",
"1a631b6d1a87ab8a78f83cb8e8580c8de667f8e3");
register(["R-ENG-001","R-ENG-002"],
 "tests/audio-mix-stress.mjs; 50 schedule comparisons; 0.354ms onset",
 "87787b1dab2fa46838868b482b1ac02e52a2d191");
register(["R-PST-005"],
 "tests/preset-diversity.mjs; PRESET_DIVERSITY_REPORT.md; 50 unique timelines",
 "9019a0ea803ad45002c717ffdefd96de2d91c731");
register(["R-PST-003"],
 "tests/preset-diversity.mjs; PRESET_DIVERSITY_REPORT.md; 35+15=50 studies",
 "9019a0ea803ad45002c717ffdefd96de2d91c731");
register(["R-SND-002"],
 "synthesis.js; tests/audio-offline.mjs; 6 acid voices with distinct signals",
 "87787b1dab2fa46838868b482b1ac02e52a2d191");
register(["R-PROC-003"],
 "scripts/verify-traceability.mjs; three-way registry validation",
 "f742ada1b57cf7944d05b7a8400177e8bba111dc");
register(["R-TEX-003"],
 "tests/spec-ui.mjs; KaTeX vertical 1/4 1/2 3/4 in 12 theme/viewport combinations");
register(["R-NUM-001","R-NUM-002","R-NUM-005","R-NUM-006"],
 "tests/spec-ui.mjs; tests/math-io.test.mjs; four-quadrant round-trips; zero; n64");
const blocked=new Map([
 ["R-AUD-002",{
   evidence:"User image.png annotated control text recovered; second source reference remains unavailable; issues/2",
   defect:"FIX-VIS-001: Cannot certify second annotated source image"
 }],
 ["R-UI-003",{
   evidence:"User image.png annotated control text recovered; issue/2; tests/spec-ui.mjs",
   defect:"FIX-VIS-001: Full side-by-side source-annotation signoff pending"
 }],
 ["R-SND-007",{
   evidence:"CI:42107150484; 15 generated WAVs and technical metrics; issues/3",
   defect:"FIX-AUDIO-001: Required human listening not evidenced"
 }],
 ["R-PST-004",{
   evidence:"PRESET_DIVERSITY_REPORT.md; all 15 mathematically distinct; issues/3",
   defect:"FIX-AUDIO-001: Human musical evaluation of new studies pending"
 }]
]);
const active=new Set([
 "R-AUD-001","R-AUD-003","R-UI-001","R-UI-002","R-UI-004","R-UI-005",
 "R-UI-006","R-UI-007","R-UI-008","R-TEX-001","R-TEX-002","R-TEX-004",
 "R-TEX-005","R-TEX-006","R-TEX-007","R-TEX-008","R-GEO-001",
 "R-GEO-002","R-GEO-003","R-GEO-004","R-GEO-005","R-GEO-006",
 "R-GEO-007","R-NUM-003","R-NUM-004","R-NUM-007","R-NUM-008",
 "R-MDL-001","R-MDL-002","R-MDL-006","R-RES-001","R-RES-002",
 "R-RES-003","R-SND-001","R-SND-003","R-SND-004","R-SND-005",
 "R-SND-006","R-PST-001","R-PST-002","R-PST-006","R-ENG-003",
 "R-ENG-004","R-QT-001","R-QT-002","R-QT-003","R-QT-004",
 "R-QA-001","R-QA-002","R-QA-003","R-QA-004","R-QA-005",
 "R-FIN-001","R-FIN-002","R-FIN-003","R-FIN-004",
 "R-PROC-001","R-PROC-002","R-PROC-004","R-PROC-005",
 "R-PROC-006","R-PROC-007"
]);

const pathTask="TASKS.md";
let original=fs.readFileSync(pathTask,"utf8");
const parse=line=>line.split(/(?<!\\)\|/);
const byReq=new Map(),statusCount={VERIFIED:0,BLOCKED:0,IN_PROGRESS:0,TODO:0,FAILED:0};
const lines=original.split("\n").map(line=>{
 if(!/^\| T-[A-Z]+-\d+/.test(line))return line;
 const p=parse(line);
 if(p.length!==13)throw Error("Malformed 11-column task line: "+line.slice(0,100));
 const id=p[1].trim(),req=p[2].trim(),parent=p[3].trim();
 let status="TODO",evidence="-",defects="-",commit="-";
 if(verified.has(req)){
  const v=verified.get(req);
  status="VERIFIED";evidence=v.evidence;commit=v.commit;
 } else if(blocked.has(req)&&parent==="-"){
  const v=blocked.get(req);
  status="BLOCKED";evidence=v.evidence;defects=v.defect;
 } else if(req==="R-SND-007"&&parent!=="-"){
  const number=id.split("-").at(-1);
  if(["01","02","03","04","06","07"].includes(number)){
   status="VERIFIED";
   evidence="CI:42107150484; 15 WAV files, attack/RMS/8 envelope segments/spectral centroid";
   commit="87787b1dab2fa46838868b482b1ac02e52a2d191";
  }else if(number==="05"){
   status="IN_PROGRESS";evidence="tests/audio-offline.mjs; fundamental pitch estimation not yet documented";
  }
 }else if(req==="R-UI-003"&&parent!=="-"){
  status="IN_PROGRESS";evidence="tests/spec-ui.mjs and single recovered image.png; second annotation pending";
 }else if(active.has(req)&&parent==="-"){
  status="IN_PROGRESS";evidence="Implementation available; requirement-wide acceptance pending";
 }
 p[8]=" "+status+" ";
 p[9]=" "+evidence+" ";
 p[10]=" "+defects+" ";
 p[11]=" "+commit+" ";
 statusCount[status]++;
 if(parent==="-")byReq.set(req,{status,evidence});
 return p.join("|");
});
if(Object.values(statusCount).reduce((a,b)=>a+b,0)!==651)throw Error("Expected 651 task rows");
if(byReq.size!==98)throw Error("Expected 98 requirement parents, got "+byReq.size);
fs.writeFileSync(pathTask,lines.join("\n"));

function changeRow(path,mode){
 const input=fs.readFileSync(path,"utf8");
 const rows=input.split("\n").map(line=>{
  if(!/^\| R-[A-Z]+-\d+ \|/.test(line))return line;
  const p=parse(line),req=p[1].trim(),state=byReq.get(req);
  if(!state)throw Error(path+" missing status of "+req);
  if(mode==="trace"){
    if(p.length!==8)throw Error("Bad traceability row "+req);
    p[5]=" "+state.evidence+" ";
    p[6]=" "+state.status+" ";
  }else{
    if(p.length!==7)throw Error("Bad acceptance row "+req);
    p[4]=" "+state.status+" ";
    p[5]=" "+state.evidence+" ";
  }
  return p.join("|");
 });
 fs.writeFileSync(path,rows.join("\n"));
}
changeRow("TRACEABILITY.md","trace");
changeRow("ACCEPTANCE_CRITERIA.md","acceptance");
const requirements=[...byReq];
const summary={
 generatedFrom:"Evidence at CI run "+CI+testRun,
 tasks:statusCount,
 verifiedRequirementIds:requirements.filter(([id,v])=>v.status==="VERIFIED").map(([id])=>id),
 blockedRequirementIds:requirements.filter(([id,v])=>v.status==="BLOCKED").map(([id])=>id),
 note:"An engineering proof does not replace the missing human audio and original screenshot acceptance."
};
fs.writeFileSync("LEDGER_EVIDENCE_SUMMARY.json",JSON.stringify(summary,null,2)+"\n");
console.log(JSON.stringify({requirements:byReq.size,tasks:statusCount,verifiedRequirements:summary.verifiedRequirementIds.length,
blockedRequirements:summary.blockedRequirementIds},null,2));
