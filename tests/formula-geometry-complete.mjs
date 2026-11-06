import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const results=[];
fs.mkdirSync('artifacts/formula-geometry',{recursive:true});
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  for(const selector of ['#compositionPanel','.math-details'])
   await page.locator(selector).evaluate(el=>{el.open=true});
  const measure=()=>page.evaluate(()=>{
   const rect=el=>{const r=el.getBoundingClientRect();return {
    left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height
   }};
   const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*
    Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
   const rows=[...document.querySelectorAll('#formulaReference > div')];
   const rowOverlaps=[];
   for(let i=0;i<rows.length;i++){
    const name=rows[i].querySelector('.formula-name'),math=rows[i].querySelector('.formula-math');
    if(name&&math&&overlap(rect(name),rect(math))>1)
     rowOverlaps.push({kind:'label/formula',row:i,area:overlap(rect(name),rect(math))});
    if(i>0&&overlap(rect(rows[i-1]),rect(rows[i]))>1)
     rowOverlaps.push({kind:'between rows',row:i});
   }
   const critical=['rootRuleEquation','rootRuleValues','compositionEquation','selectedRootFormula','rootPhaseFormula']
    .map(id=>{
     const el=document.getElementById(id),css=getComputedStyle(el),k=el.querySelector('.katex');
     return {id,rect:rect(el),contentWidth:el.scrollWidth,clientWidth:el.clientWidth,
      rendered:!!k&&!!el.querySelector('math'),overflowX:css.overflowX,
      error:!!el.querySelector('.katex-error')};
    });
   const collisions=[];
   const names=['rootRuleEquation','rootRuleValues','selectedRootFormula','rootPhaseFormula'];
   for(let i=0;i<names.length;i+=2){
    const a=rect(document.getElementById(names[i])),b=rect(document.getElementById(names[i+1]));
    if(overlap(a,b)>1)collisions.push({a:names[i],b:names[i+1],area:overlap(a,b)});
   }
   const centerParent=document.getElementById('rootRuleEquation');
   const equation=centerParent.querySelector('.katex');
   const p=rect(centerParent),q=rect(equation);
   const centered=!equation||q.width>p.width+2||
    Math.abs((p.left+p.right-q.left-q.right)/2)<6;
   const labelCenters=[...document.querySelectorAll('.circle-label')].every(el=>{
    const label=rect(el),math=el.querySelector('.katex');
    if(!math)return false;
    const inner=rect(math);
    return Math.abs((label.left+label.right-inner.left-inner.right)/2)<5 &&
     Math.abs((label.top+label.bottom-inner.top-inner.bottom)/2)<5;
   });
   return {rows:rows.length,rowOverlaps,collisions,critical,centered,labelCenters,
    documentWidth:document.documentElement.scrollWidth,viewport:innerWidth};
  });
  const baseline=await measure();
  assert.equal(baseline.rows,10,'ten formula-reference rows');
  assert.deepEqual(baseline.rowOverlaps,[],'reference labels do not cover their formulas at '+width+'/'+theme);
  assert.deepEqual(baseline.collisions,[],'mandatory root formula blocks must remain separate');
  assert.ok(baseline.critical.every(x=>x.rendered&&!x.error),'all mathematical formulas use KaTeX + MathML');
  assert.ok(baseline.centered&&baseline.labelCenters,'root equation and cycle-phase labels must be centered');
  assert.ok(baseline.documentWidth<=width+1,'formula baseline must not overflow viewport');

  // Build the longest supported five-family root union, then verify that
  // a lengthy symbolic expression can be inspected without clipping text.
  for(let i=0;i<5;i++){
   if(await page.locator('#addRootFamily').isDisabled())break;
   await page.locator('#addRootFamily').click();
  }
  const dense=await measure();
  assert.deepEqual(dense.rowOverlaps,[],'ten mathematical reference rows must not overlap after new root families');
  assert.deepEqual(dense.collisions,[],'root and phase equations stay separate with five generated families');
  assert.ok(dense.critical.every(x=>x.rendered&&!x.error),'long generated-root equations still render');
  for(const entry of dense.critical){
   if(entry.contentWidth>entry.clientWidth+3)
    assert.ok(/auto|scroll/.test(entry.overflowX),'long formula '+entry.id+
     ' needs visible horizontal scroll rather than clipping');
  }
  assert.ok(dense.documentWidth<=width+1,'long root formulas must not cause page-wide horizontal overflow at '+width);
  assert.deepEqual(errors,[],'no runtime JavaScript error');
  results.push({viewport:[width,height],theme,baseline,dense});
  await page.screenshot({path:'artifacts/formula-geometry/'+width+'-'+theme+'.png',fullPage:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/formula-geometry/full-layout.json',JSON.stringify({
  status:'PASS',cases:results.length,
  scope:'Ten KaTeX references and five additional complex-root families without overlap, clipping or off-center math across required viewports',
  results
 },null,2));
 console.log('PASS formula centering, separation and full root-family scrolling across '+results.length+' viewport/theme states');
}finally{await browser.close()}
