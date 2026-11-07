import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// M05/R-TEX-005: the selected root-set composition must name the *actual*
// complex inputs of every root family, not an unbound "z" placeholder.
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const dir='artifacts/complex-source-equation';
fs.mkdirSync(dir,{recursive:true});
const fixture={
 format:'roots-rhythm/1',name:'Measured complex source provenance',bpm:132,bars:1,
 tracks:[
  {a:2,b:3,n:4,sound:'technoKick',cycleBars:1,operation:'union',muted:false,
   layers:[{a:-1,b:0,n:3,velocity:.55}],euclidean:{k:5,n:16,rotation:2,velocity:.39}},
  {a:1,b:0,n:7,sound:'metallic',cycleBars:1,muted:false,layers:[]},
  {a:0,b:1,n:9,sound:'hat',cycleBars:1,muted:false,layers:[]},
  {a:1,b:0,n:13,sound:'acidClassic',cycleBars:1,muted:false,layers:[]}
 ]
};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[];
async function load(page,project){
 await page.locator('#jsonFile').setInputFiles({
  name:project.name+'.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))
 });
 await page.waitForFunction(name=>document.getElementById('toast').textContent.includes('Imported rhythm: '+name),project.name);
}
const snapshot=page=>page.evaluate(()=>{
 const e=document.getElementById('compositionEquation'),css=getComputedStyle(e),box=e.getBoundingClientRect();
 return {latex:e.querySelector('annotation')?.textContent||'',
  mathml:!!e.querySelector('math'),rendered:!!e.querySelector('.katex'),error:!!e.querySelector('.katex-error'),
  clipped:box.left<-1||box.right>innerWidth+1,
  scrollable:!((e.scrollWidth>e.clientWidth+3)&&!/(auto|scroll)/.test(css.overflowX)),
  noPageOverflow:document.documentElement.scrollWidth<=innerWidth+1,
  selectedRoot:document.querySelector('#selectedRootFormula annotation')?.textContent||'',
  rootPhase:document.querySelector('#rootPhaseFormula annotation')?.textContent||'',
  state:window.RhythmResearch.current().tracks[0],
  phases:window.RhythmResearch.eventMetadata(window.RhythmResearch.current().tracks[0]),
  basePhases:window.RhythmResearch.rootPhases(window.RhythmResearch.current().tracks[0]),
  errors:document.querySelectorAll('.katex-error').length
 };
});
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const runtime=[];page.on('pageerror',x=>runtime.push(x.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#compositionPanel').evaluate(el=>el.open=true);
  await load(page,fixture);
  const initial=await snapshot(page);
  assert.ok(initial.mathml&&initial.rendered&&!initial.error,
   'actual root-set formula must use semantic MathML at '+width+'/'+theme);
  assert.ok(initial.latex.includes('R_{4}')&&initial.latex.includes('2 + 3i')&&
   initial.latex.includes('R_{3}')&&initial.latex.includes('-1 + 0i')&&
   initial.latex.includes('\\cup')&&initial.latex.includes('E(5,16)'),
   'expression must carry true base complex value, each additional root and Euclidean source: '+initial.latex);
  assert.ok(!initial.latex.includes('R_{4}(z)'),'a generic unbound z is not a sufficient source-specific label');
  assert.ok(initial.noPageOverflow&&initial.scrollable&&!initial.clipped&&!initial.errors,
   'long composition stays visible/inspectable without page-wide overflow');
  assert.ok(initial.selectedRoot.includes('\\sqrt[4]')&&initial.rootPhase.includes('\\frac'),
   'selected root retains exact degree and a mathematical phase fraction');
  assert.equal(initial.state.a,2);assert.equal(initial.state.b,3);
  assert.equal(initial.state.layers.length,1);
  assert.ok(initial.phases.length>=4,'actual mathematical source produces sound roots');
  if(width===1440&&theme==='light'){
   await page.locator('#trackN0').fill('7');
   const degree=await snapshot(page);
   assert.ok(degree.latex.includes('R_{7}')&&degree.latex.includes('2 + 3i'),
    'editing degree recomputes root set without erasing its complex argument');
   await page.locator('.lane[data-lane="0"] .advanced-coordinates').evaluate(el=>el.open=true);
   await page.locator('#trackB0').fill('4');
   const edited=await snapshot(page);
   assert.ok(edited.latex.includes('2 + 4i')&&!edited.latex.includes('2 + 3i'),
    'Cartesian changes immediately update real complex input in the plot inspector');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'trackB0',
    'live rerender may not steal keyboard input focus');
   assert.notDeepEqual(edited.phases,degree.phases,'altering the complex angle changes canonical root events');
   await page.locator('#advancedMathDetails').evaluate(el=>el.open=true);
   await page.locator('#setOperation').selectOption('intersection');
   const intersect=await snapshot(page);
   assert.ok(intersect.latex.includes('\\cap')&&!intersect.latex.includes('\\cup'),
    'visible operation is the true selected set operator');
   const zero={...fixture,name:'Zero-source mathematical provenance',
    tracks:fixture.tracks.map((t,i)=>i===0?{...t,a:0,b:0,n:4}:t)};
   await load(page,zero);
   const zeroState=await snapshot(page);
   assert.ok(zeroState.latex.includes('R_{4}')&&zeroState.latex.includes('0 + 0i'),
    'zero root family is shown as a zero input, never an unexplained variable');
   assert.equal(zeroState.basePhases.length,0,'zero complex base contributes no roots');
   assert.ok(zeroState.phases.length>0,'valid extra root family and Euclidean accents remain independently audible');
   assert.ok(zeroState.rootPhase.includes('\\arg(0)'),'undefined zero phase shown semantically');
   cases.push({width,height,theme,base:initial.latex,degree:degree.latex,
    changedCoefficient:edited.latex,intersection:intersect.latex,zero:zeroState.latex});
  }else cases.push({width,height,theme,base:initial.latex,mathml:true,noOverflow:true});
  assert.deepEqual(runtime,[],'no JS errors at '+width+'/'+theme);
  await page.screenshot({path:dir+'/'+width+'-'+theme+'.png',fullPage:true});
  await page.close();
 }
 assert.equal(cases.length,12);
 fs.writeFileSync(dir+'/report.json',JSON.stringify({
  status:'PASS',viewports:12,sourceSpecificRootFamilies:true,
  dynamicDegreeCartesianIntersectionAndZero:true,
  cases,scope:'Real responsive live complex-root provenance, selected mathematical phase, set operation, zero-source and accessible KaTeX/MathML. No audio/device or subjective acceptance inferred.'
 },null,2)+'\n');
 console.log('PASS source-specific four-ring complex-root expression, 12 responsive states, degree, Cartesian, intersection and zero');
}finally{await browser.close()}
