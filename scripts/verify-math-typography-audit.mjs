import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const doc=fs.readFileSync('MATH_TYPOGRAPHY_AUDIT.md','utf8');
const evidencePath='artifacts/formula-acceptance/measurements.json';
assert.ok(fs.existsSync(evidencePath),'Missing Playwright formula evidence; run the browser test first');
const evidence=JSON.parse(fs.readFileSync(evidencePath,'utf8'));
const screens=evidence.screens||[];
const sizes=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const ids=['cartesianHeading','argMathLabel','mathExampleUnion',
 'rootRuleEquation','rootRuleValues','rootRuleSpacing',
 'rootRuleInput','rootRuleDelta','rootRuleFormula',
 'selectedRootFormula','rootPhaseFormula','compositionEquation',
 'laneEq0','laneEq1','laneEq2','laneEq3'];
const labels=['phaseZero','phaseQuarter','phaseHalf','phaseThreequarters'];
const names=['Cartesian','Polar','Exponential','Modulus','Argument',
 'Roots','Root set','Indices','Nonzero','Coordinates'];
const tick=String.fromCharCode(96);
assert.equal(screens.length,12,'M05/M06 requires 6 viewports in two themes');
for(const id of [...ids,...labels])
 assert.ok(doc.includes(tick+id+tick),'audit is missing formula location '+id);
for(const name of names)
 assert.ok(doc.includes(name),'audit is missing mandatory standard formula '+name);
assert.match(doc,/missing second|second.*missing|second.*unavailable/i,
 'the missing annotated source image must remain explicit');
assert.ok(doc.includes('formula-acceptance/{width}-{theme}.png'),
 'audited screenshot bundle path must be specified');
const signatures=new Set();
for(const [width,height] of sizes)for(const theme of ['light','dark']){
 const key=width+'-'+height+'-'+theme;
 const row=screens.find(r=>r.width===width&&r.height===height&&r.theme===theme);
 assert.ok(row,'missing browser evidence '+key);
 signatures.add(key);
 assert.equal(row.formulaCount,10,'required formula count '+key);
 assert.equal(row.referenceFormulas.length,10,'required formula source annotations '+key);
 for(const [i,f] of row.referenceFormulas.entries()){
  assert.equal(f.index,i+1,'formula order '+key);
  assert.ok(f.hasMathML&&f.rendered&&!f.clipped&&f.latex,
   'missing KaTeX/MathML, formula '+i+' '+key);
 }
 const live=row.renderedLocations;
 assert.equal(live?.length,16,'16 dynamic math locations required '+key);
 const found=new Set();
 for(const item of live){
  assert.ok(ids.includes(item.id),'unexpected formula location '+item.id);
  assert.ok(!found.has(item.id),'duplicate formula '+item.id);
  found.add(item.id);
  assert.ok(item.katex&&item.mathml&&item.annotation&&
   !item.katexError&&!item.pageClipped,
   'unrendered/errored/clipped live math '+item.id+' '+key);
 }
 assert.equal(found.size,ids.length,'missing live mathematical location '+key);
 for(const [id,v] of Object.entries(row.graphFractions||{})){
  assert.ok(labels.includes(id),'unknown graph phase '+id);
  assert.ok(v.mathml&&v.font>=20,'graph phase font/MathML failure '+id+' '+key);
  if(id!=='phaseZero')assert.ok(v.stacked,'fraction must remain vertical '+id+' '+key);
 }
 assert.equal(Object.keys(row.graphFractions||{}).length,4,'four graph phases '+key);
 assert.ok(row.selectedRootLatex&&row.selectedRootHasStackedFraction,
  'selected root equation or stacked phase fraction absent '+key);
 assert.equal(row.clippingErrors,0,'unexpected clipping '+key);
 const relative='formula-acceptance/'+width+'-'+theme+'.png';
 assert.equal(row.screenshot,relative,'wrong screenshot reference '+key);
 const filename=path.join('artifacts',relative);
 assert.ok(fs.existsSync(filename),'missing real browser screenshot '+filename);
 const buffer=fs.readFileSync(filename);
 assert.ok(buffer.length>2048,'screenshot too small '+filename);
 assert.equal(buffer.subarray(0,8).toString('hex'),'89504e470d0a1a0a',
  'not a PNG browser screenshot '+filename);
}
assert.equal(signatures.size,12,'missing screenshots');
assert.ok(evidence.dynamic?.originalFormula&&evidence.dynamic?.degreeFormula&&
 evidence.dynamic?.changedCoefficientFormula&&evidence.dynamic?.afterDragRootPhase,
 'missing real dynamic rerender evidence');
assert.notEqual(evidence.dynamic.originalFormula,evidence.dynamic.degreeFormula,
 'degree must alter rendered formula');
assert.notEqual(evidence.dynamic.degreeFormula,evidence.dynamic.changedCoefficientFormula,
 'coefficient must alter rendered formula');
fs.mkdirSync('artifacts/math-typography-audit',{recursive:true});
fs.writeFileSync('artifacts/math-typography-audit/summary.json',JSON.stringify({
 status:'AUTOMATED_PASS',screens:12,referenceFormulas:10,liveLocations:16,phaseLabels:4,
 screenshotFileCount:12,liveUpdates:true,
 caveat:'Automated browser proof only; missing historical annotated reference and human screen review remain unresolved'
},null,2)+'\n');
console.log('PASS mathematical audit: 10 references, 16 live locations, 4 phase labels, 12 PNG screenshots, live updates');
