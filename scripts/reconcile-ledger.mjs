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
// Additional requirements closed only after complete successful regression evidence.
// 42121936951 includes all 35 legacy JSON imports plus explicit unknown-field tests,
// 231 responsive touch targets and the 12-state mathematical typography matrix.
const recentEvidence=[
 ['R-ENG-004','CI:42121936951; tests/legacy-json-compat.mjs; all 35 originals preserve BPM, instruments and phases; unknown fields reject safely','638400ca797e9286a6da38ff01c705fb1ff30013'],
 ['R-UI-008','CI:42121936951; tests/touch-targets.mjs 231 mobile controls >=44x44; tests/ui-smoke.mjs 44px Canvas dragging','a6a3aa7bc115ee8ca0a2539c4c7f7007f6d8877e'],
 ['R-PST-001','CI:42119466325; PRESET_INVENTORY.md 50 itemized coordinate/phase/sound/patch/fingerprint/nearest-neighbor audits','ed4c5d965c3137d59a2a61c814a5916325b8a449'],
 ['R-UI-002','CI:42121936951; tests/spec-ui.mjs all 14 typographic roles in 12 theme/viewport states','7bd76326640bc99e86275f9362aaa1e5ec168fce'],
 ['R-TEX-001','CI:42121936951; KaTeX 0.16.22 local html+MathML; ten annotated math references across 12 states','f6f8daf8351b2291c28f77dcf19d97623aae13e8']
];
for(const [req,evidence,commit] of recentEvidence)verified.set(req,{evidence,commit});
for(const [req,evidence,commit] of [
 ['R-UI-001','CI:42123915938; 90 application CSS font sizes >=16px; Chromium 14 responsive theme cases, >=16px text; math wrappers >=18px','2e7a486ecf0ac36240c5261e7cb944c064073ba1'],
 ['R-NUM-008','CI:42123915938; 146 math assertions; 42 relative-error polar cases and 100 repeated UI coordinate/unit toggles; abs 1e-8 and rel 1e-10','f5364e734c61b79514eb28b4879b360ae83aa8bb'],
 ['R-ENG-003','CI:42123915938; tests/transport-switching.mjs 24 live transitions; all lanes/math/audio updated, no bus or sample leak, no old scheduler timer','28d5fb7e60c03669ae44c99815ca3d2c8162d7d3']
])verified.set(req,{evidence,commit});
// Newly proven requirements: both acceptance tests completed in real CI.
verified.set('R-MDL-001',{
 evidence:'CI:42132119969; tests/event-properties.mjs 400 deterministic independent phase/source/patch/articulation checks; math-io.js single planEvents source; app.js draw and Web Audio share events()',
 commit:'a07982dbb001583ccf1f177d3baea6de8a8bd92e'
});
verified.set('R-PST-002',{
 evidence:'CI:42131998402; tests/preset-diversity.mjs 12 of 15 new studies have non-four-on-the-floor first lane; PRESET_DIVERSITY_REPORT.md checks repeated patterns across remaining lanes',
 commit:'e205a59c57817c8e667189cb66fa15bbdb8ab882'
});
// Verified independently by real Canvas pixels + source-preserving audio planner.
verified.set('R-GEO-004',{
 evidence:'CI:42132894856; tests/collision-lanes.mjs physical pixel samples on two concentric rings, distinct colors; 32 preserved sound attacks at 16 shared moments; 40/24 after R4∪R3',
 commit:'cb67646bf5e02f5ae237ed4737e775bd68363c1c'
});
verified.set('R-MDL-006',{
 evidence:'CI:42132894856; tests/collision-lanes.mjs user-visible base=4, added=3, unique=6, cross-lane shared=16; counts from live events() and RhythmMath.analyzeSchedule',
 commit:'e91651707fe6e6dd01ba636621636be41197f42c'
});
// Safe syntax, deliberate input validation and canonical-value preservation were
// exercised in real Chromium and Node; bad text remains editable with a visible error.
verified.set('R-NUM-004',{
 evidence:'CI:42133490570; tests/expression-safety.mjs 11 valid examples, 22 rejected strings, 200 deterministic complex inputs and 11 browser editor actions; input preserved on error',
 commit:'46d4e1a0f95d0832c437c06fbdd7053af9e16a3f'
});
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
