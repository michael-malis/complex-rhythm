import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// A real-browser coordinate test: mathematics, SVG vector positions, the
// Canvas four-ring time convention and KaTeX shared-source fractions agree.
// This does not infer visual quality from a mock or replace a human review.
const TAU=2*Math.PI;
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const dir='artifacts/math-graph-svg';fs.mkdirSync(dir,{recursive:true});
const fixture={format:'roots-rhythm/1',name:'Graph SVG coordinate proof',bpm:125,bars:1,
 tracks:[
  {a:1,b:0,n:4,sound:'technoKick',cycleBars:1,muted:false,operation:'union',
   layers:[{a:1,b:0,n:3,velocity:.65},{a:0,b:1,n:1,velocity:.4}]},
  {a:1,b:0,n:1,sound:'metallic',cycleBars:1,muted:false,operation:'union',layers:[]},
  {a:0,b:-1,n:7,sound:'hat',cycleBars:1,muted:false,operation:'union',layers:[]},
  {a:0,b:0,n:4,sound:'acidClassic',cycleBars:1,muted:false,operation:'union',layers:[]}
 ]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
async function importProject(page,project){
 await page.locator('#jsonFile').setInputFiles({name:'math-svg.json',mimeType:'application/json',
  buffer:Buffer.from(JSON.stringify(project))});
 await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),project.name);
}
const measure=(page,lane)=>page.evaluate(lane=>{
 // Playwright serializes this function into the browser: no Node closure variables.
 const TAU=2*Math.PI;
 const t=window.RhythmResearch.current().tracks[lane];
 const svg=document.querySelector('#rootRuleDiagram'),canvas=document.querySelector('#orbitCanvas'),
  panel=document.querySelector('#rootRuleInfoPanel'),list=document.querySelector('#rootRuleAngleList');
 const rect=e=>{const r=e.getBoundingClientRect();
  return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,
   cx:r.left+r.width/2,cy:r.top+r.height/2};};
 const frame=rect(svg),plot=rect(canvas),shell=rect(document.querySelector('#plotArea'));
 const p=svg.createSVGPoint(),ctm=svg.getScreenCTM();
 const project=(x,y)=>{p.x=x;p.y=y;const q=p.matrixTransform(ctm);return{x:q.x,y:q.y};};
 const center=project(140,140),edge=project(235,140);
 const radius=Math.hypot(edge.x-center.x,edge.y-center.y);
 const expected=window.RhythmMath.rootPhases(t.a,t.b,t.n);
 const roots=[...svg.querySelectorAll('circle.root-info-marker')].map((node,k)=>{
  const x=Number(node.getAttribute('cx')),y=Number(node.getAttribute('cy'));
  const actual=project(x,y),phase=expected[k];
  const target={x:center.x+radius*Math.sin(TAU*phase),y:center.y-radius*Math.cos(TAU*phase)};
  const dx=actual.x-center.x,dy=actual.y-center.y;
  const measuredPhase=((Math.atan2(dx,-dy)/TAU)%1+1)%1;
  return {index:k,phase,measuredPhase,
   coordinateError:Math.hypot(actual.x-target.x,actual.y-target.y),
   circleError:Math.abs(Math.hypot(dx,dy)-radius),
   insideSvg:actual.x>=frame.left-1&&actual.x<=frame.right+1&&
    actual.y>=frame.top-1&&actual.y<=frame.bottom+1};
 });
 const entries=[...list.querySelectorAll('li[data-index]')].map(x=>({
  index:Number(x.dataset.index),phase:Number(x.dataset.phase),degrees:Number(x.dataset.degrees),
  mathml:!!x.querySelector('math'),katex:!!x.querySelector('.katex'),
  annotation:x.querySelector('annotation')?.textContent||''
 }));
 const labels=Object.fromEntries(['phaseZero','phaseQuarter','phaseHalf','phaseThreequarters'].map(id=>{
  const el=document.getElementById(id),r=rect(el);
  return[id,{rect:r,mathml:!!el.querySelector('math'),
   latex:el.querySelector('annotation')?.textContent||''}];
 }));
 const source=window.RhythmResearch.eventMetadata(t);
 const shared=source.filter(e=>e.sources.length>1).map(e=>e.phase);
 const phaseEq=document.getElementById('sharedPhaseFormula');
 const readEq=id=>{const el=document.getElementById(id);
  return {latex:el.querySelector('annotation')?.textContent||'',
   mathml:!!el.querySelector('math'),error:!!el.querySelector('.katex-error')};};
 const svgAngle=svg.querySelector('line.root-info-input-ray');
 const sourceTheta=t.a===0&&t.b===0?null:Math.atan2(t.b,t.a);
 const ray=svgAngle?{x2:Number(svgAngle.getAttribute('x2')),y2:Number(svgAngle.getAttribute('y2'))}:null;
 const panelRect=rect(panel);
 const canvasRadii=window.RhythmResearch.radiiForSize(Math.min(plot.width,plot.height));
 return {lane,n:t.n,zero:sourceTheta===null,expectedCount:expected.length,
  svgMarkers:roots,entries,svgRadius:radius,svgRect:frame,panelRect,
  svgViewBox:svg.getAttribute('viewBox'),
  vectorNodes:svg.querySelectorAll('image,foreignObject').length===0,
  screenPhasePositions:expected.map(phase=>({
    x:plot.cx+canvasRadii[lane]*Math.sin(TAU*phase),
    y:plot.cy-canvasRadii[lane]*Math.cos(TAU*phase),phase
  })),
  svgInputRay:ray,sourceTheta,labels,plot,shell,
  composition:readEq('compositionEquation'),selected:readEq('selectedRootFormula'),
  angleFormula:readEq('rootRuleFormula'),phaseFormula:readEq('rootPhaseFormula'),
  sharedFormula:{hidden:phaseEq.hidden,...readEq('sharedPhaseFormula'),shared},
  summary:document.getElementById('overlapSummary').textContent,
  pageOverflow:document.documentElement.scrollWidth>innerWidth+1,
  katexErrors:document.querySelectorAll('.katex-error').length};
},lane);
function check(result,context){
 assert.equal(result.svgViewBox,'0 0 280 280',context+' canonical vector coordinate system');
 assert.ok(result.vectorNodes,'no raster imagery may substitute vector/math notation');
 assert.ok(result.svgRadius>60&&Number.isFinite(result.svgRadius),'SVG must have real readable CSS pixel dimensions');
 assert.ok(result.svgRect.width>200&&result.svgRect.right<=result.panelRect.right+3&&
  result.svgRect.left>=result.panelRect.left-3,'SVG must remain visible inside its panel');
 assert.equal(result.svgMarkers.length,result.expectedCount,'real SVG markers match complex roots');
 assert.equal(result.entries.length,result.expectedCount,'angle list has one mathematical row per root');
 for(let i=0;i<result.svgMarkers.length;i++){
  const m=result.svgMarkers[i],entry=result.entries[i],canvas=result.screenPhasePositions[i];
  const wrap=Math.abs(m.measuredPhase-m.phase);
  assert.ok(Math.min(wrap,1-wrap)<2e-6,'SVG visible angular position derives from canonical root phase: '+context+' index '+i);
  assert.ok(m.coordinateError<1.2&&m.circleError<1.2&&m.insideSvg,
   'SVG point lies on rendered unit circle at the right phase: '+context+' index '+i);
  assert.equal(entry.index,i,'SVG and mathematical list root indices agree');
  assert.ok(Math.abs(entry.phase-m.phase)<1e-9&&
   Math.abs(entry.degrees-Number((m.phase*360).toFixed(3)))<1e-7,
   'MathML root arguments and SVG positions agree on phase and angle');
  assert.ok(entry.mathml&&entry.katex&&entry.annotation.includes('\\theta'),
   'each SVG point has an accessible true KaTeX/MathML argument');
  assert.ok(canvas.x>=result.plot.left-1&&canvas.x<=result.plot.right+1&&
   canvas.y>=result.plot.top-1&&canvas.y<=result.plot.bottom+1,
   'same canonical phase is geometrically inside real four-ring Canvas');
 }
 if(result.sourceTheta===null)assert.equal(result.svgInputRay,null,'zero has no fake input argument ray');
 else{
  assert.ok(result.svgInputRay,'complex input ray exists');
  assert.ok(Math.hypot(result.svgInputRay.x2-(140+95*Math.sin(result.sourceTheta)),
   result.svgInputRay.y2-(140-95*Math.cos(result.sourceTheta)))<1e-6,
   'SVG input ray reflects the actual original complex argument, not a root angle');
 }
 for(const label of Object.values(result.labels)){
  assert.ok(label.mathml&&label.latex.length>0,'Canvas-adjacent fractions are real semantic math');
  const a=label.rect,b=result.shell;
  assert.ok(a.left>=b.left-3&&a.right<=b.right+3&&
   a.top>=b.top-3&&a.bottom<=b.bottom+3,
   'fraction labels stay inside real Canvas coordinate container');
 }
 assert.ok(!result.pageOverflow&&!result.katexErrors,'no layout overflow or raw math errors');
 assert.ok(result.composition.mathml&&result.selected.mathml&&result.angleFormula.mathml,
  'composition, selected root and geometry display true math');
}
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await importProject(page,fixture);
  await page.locator('#compositionPanel').evaluate(el=>el.open=true);
  await page.locator('#rootRuleInfoToggle').click();
  const lanes=[];
  for(let lane=0;lane<4;lane++){
   await page.locator('.lane[data-lane="'+lane+'"] .lane-select').click();
   const measured=await measure(page,lane);
   check(measured,width+'x'+height+' '+theme+' lane '+lane);
   if(lane===0){
    assert.deepEqual(measured.sharedFormula.shared.map(x=>Number(x.toFixed(6))),[0,.25],
     'shared union has exact phases 0 and 1/4 from original event source metadata');
    assert.ok(!measured.sharedFormula.hidden&&measured.sharedFormula.mathml&&
     measured.sharedFormula.latex.includes('\\Phi')&&
     measured.sharedFormula.latex.includes('\\frac{1}{4}'),
     'coincident hits must be represented with actual KaTeX/MathML fractions');
    assert.ok(measured.summary.includes('2 shared phases'),
     'the visible collision count comes from canonical source provenance');
   }else{
    assert.ok(measured.sharedFormula.hidden&&!measured.sharedFormula.shared.length,
     'no stale coincident phase formula in other independent lane');
   }
   lanes.push({lane,roots:measured.expectedCount,svgRadius:measured.svgRadius,
    shared:measured.sharedFormula.shared.length,mathml:measured.angleFormula.mathml});
  }
  assert.deepEqual(errors,[],'no JS errors in SVG/Canvas math '+width+'/'+theme);
  report.push({viewport:[width,height],theme,lanes});
  await page.screenshot({path:dir+'/'+width+'-'+theme+'.png',fullPage:true});
  if(width===1440&&theme==='light'){
   // Validate actual reflow, not just separate page initial states.
   await page.setViewportSize({width:390,height:844});
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await page.locator('.lane[data-lane="0"] .lane-select').click();
   check(await measure(page,0),'live resize from desktop to phone');
   await page.locator('#trackN0').fill('64');
   const dense=await measure(page,0);
   check(dense,'live 64-root SVG/Canvas resize');
   assert.equal(dense.expectedCount,64,'64 mathematically distinct vector roots remain in SVG');
   await page.locator('#trackN0').fill('4');
   await page.locator('#advancedMathDetails').evaluate(el=>el.open=true);
   await page.locator('#setOperation').selectOption('intersection');
   const intersection=await measure(page,0);
   assert.ok(intersection.sharedFormula.hidden&&!intersection.sharedFormula.shared.length,
    'intersection of incompatible base and two extra families has no false shared phase');
   await page.locator('#setOperation').selectOption('union');
   const restored=await measure(page,0);
   assert.equal(restored.sharedFormula.shared.length,2,'union re-enables real shared phase labels');
   // Added-vs-added collision with no base collision must also be recognized.
   const angle=Math.PI/4,other={...fixture,name:'Additional-only common phase',
    tracks:fixture.tracks.map((t,i)=>i===0?{...t,
     layers:[{a:Math.cos(angle),b:Math.sin(angle),n:1,velocity:.4},
      {a:Math.cos(angle),b:Math.sin(angle),n:1,velocity:.7}]}:t)};
   await importProject(page,other);
   await page.locator('#compositionPanel').evaluate(el=>el.open=true);
   await page.locator('#rootRuleInfoToggle').evaluate(el=>{
    if(el.getAttribute('aria-expanded')==='false')el.click();
   });
   const extra=await measure(page,0);
   check(extra,'two added complex roots colliding off the base root set');
   assert.equal(extra.sharedFormula.shared.length,1);
   assert.ok(Math.abs(extra.sharedFormula.shared[0]-.125)<1e-8&&
    extra.sharedFormula.latex.includes('\\frac{1}{8}'),
    'source-derived 1/8 overlap is visible even when no base root is shared');
   const empty={...fixture,name:'No shared mathematical phases',
    tracks:fixture.tracks.map((t,i)=>i===0?{...t,layers:[]}:t)};
   await importProject(page,empty);
   const hidden=await measure(page,0);
   assert.ok(hidden.sharedFormula.hidden&&hidden.sharedFormula.shared.length===0,
    'shared formula disappears when canonical root collisions cease');
  }
  await page.close();
 }
 assert.equal(report.length,12);
 fs.writeFileSync(dir+'/report.json',JSON.stringify({
  status:'PASS',viewportThemeStates:12,laneGeometryStates:48,
  realSvgCanvasMathAgreement:true,zeroAnd64RootDegrees:true,dynamicResize:true,
  sourceExactSharedPhases:true,mathmlFractions:true,vectorOnly:true,
  humanVisualComparison:false,report
 },null,2)+'\n');
 console.log('PASS M05/M06: 12 responsive states, 48 real SVG/Canvas/MathML lane geometries, shared phase union/intersection, 64 roots, live resize');
}finally{await browser.close()}
