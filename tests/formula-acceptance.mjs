import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const reports=[];fs.mkdirSync('artifacts/formula-acceptance',{recursive:true});
const mandatoryReferences=[
  ['z=a+bi',/z=a\+bi/],
  ['polar',/z=r\\left\(\\cos\\theta\+i\\sin\\theta\\right\)/],
  ['exponential',/z=re\^\{i\\theta\}/],
  ['modulus',/r=\\sqrt\{a\^2\+b\^2\}/],
  ['argument',/\\theta=\\operatorname\{atan2\}\(b,a\)/],
  ['roots',/w_k=\\sqrt\[n\]\{r\}/],
  ['root set',/R_n\(z\)=\\\{/],
  ['indices',/k=0,\\ldots,n-1/],
  ['nonzero',/z\\ne0/],
  ['coordinate identities',/\\Re\(z\).*\\Im\(z\).*\\arg\(z\)/]
];

try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#compositionPanel').evaluate(el=>el.open=true);
  await page.locator('.math-details').evaluate(el=>el.open=true);
  const value=await page.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,left:r.left,right:r.right,
      top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
   const plot=rect(document.getElementById('plotArea'));
   const labels=Object.fromEntries(['phaseZero','phaseQuarter','phaseHalf','phaseThreequarters'].map(id=>{
    const el=document.getElementById(id);
    return[id,{rect:rect(el),font:parseFloat(getComputedStyle(el).fontSize),
       verticalFraction:!!el.querySelector('.frac-line'),mathml:!!el.querySelector('math'),
       raw:el.querySelector('annotation')?.textContent||''}];
   }));
   const formulas=[...document.querySelectorAll('#formulaReference .formula-math')].map(el=>({
    math:!!el.querySelector('math'),content:el.querySelector('annotation')?.textContent||'',
    rendered:!!el.querySelector('.katex'),width:rect(el).width,
    clipping:el.scrollWidth>el.clientWidth+3&&getComputedStyle(el).overflowX==='hidden'
   }));
   const body=document.body.innerText;
   return{plot,labels,formulas,
    errors:document.querySelectorAll('.katex-error').length,
    rawLatex:/\\(?:dfrac|sqrt|frac|theta|operatorname|arg|cup|cap)\b/.test(body),
    selected:document.querySelector('#selectedRootFormula annotation')?.textContent||'',
    fractionalEquations:document.querySelector('#rootPhaseFormula .frac-line')!==null};
  });
  assert.equal(value.formulas.length,10,'ten mandatory formula references '+width+'/'+theme);
  for(let i=0;i<mandatoryReferences.length;i++){
   assert.match(value.formulas[i].content,mandatoryReferences[i][1],
    'mandatory formula '+mandatoryReferences[i][0]+' must match contractual KaTeX source at '+width+'/'+theme);
  }
  assert.ok(value.formulas.every(f=>f.rendered&&f.math&&!f.clipping),
   'KaTeX and MathML present, formulas not clipped in hidden area '+width+'/'+theme);
  assert.equal(value.errors,0,'no KaTeX errors '+width+'/'+theme);
  assert.equal(value.rawLatex,false,'no visible raw TeX '+width+'/'+theme);
  assert.ok(value.fractionalEquations,'selected-root phase uses vertical fraction');
  for(const [id,l] of Object.entries(value.labels)){
   assert.ok(l.mathml&&l.font>=20,'phase label uses >=20px KaTeX '+id);
   assert.ok(l.rect.left>=value.plot.left-3&&l.rect.right<=value.plot.right+3&&
     l.rect.top>=value.plot.top-3&&l.rect.bottom<=value.plot.bottom+3,
    'phase label stays inside graph '+id+' '+width+'/'+theme);
  }
  assert.ok(value.labels.phaseQuarter.verticalFraction&&value.labels.phaseHalf.verticalFraction&&
    value.labels.phaseThreequarters.verticalFraction,'all three fractional labels use stacked fractions');
  assert.ok(value.labels.phaseZero.rect.top<value.plot.y+value.plot.height/2&&
    value.labels.phaseHalf.rect.bottom>value.plot.y+value.plot.height/2&&
    value.labels.phaseQuarter.rect.right>value.plot.x+value.plot.width/2&&
    value.labels.phaseThreequarters.rect.left<value.plot.x+value.plot.width/2,
    'time phases follow top/right/bottom/left geometry');
  assert.deepEqual(errors,[],'no JavaScript errors');
  // Preserve DOM-derived, per-formula evidence and an actual screenshot for
  // each required viewport/theme state. These are not human visual sign-offs.
  const screenshot='artifacts/formula-acceptance/'+width+'-'+theme+'.png';
  reports.push({width,height,theme,formulaCount:value.formulas.length,
    referenceFormulas:value.formulas.map((f,index)=>({
      index:index+1,latex:f.content,hasMathML:f.math,rendered:f.rendered,clipped:f.clipping
    })),
    graphFractions:Object.fromEntries(Object.entries(value.labels).map(([k,l])=>[k,{
      latex:l.raw,font:l.font,mathml:l.mathml,stacked:l.verticalFraction
    }])),
    selectedRootLatex:value.selected,selectedRootHasStackedFraction:value.fractionalEquations,
    screenshot:screenshot.replace('artifacts/',''),clippingErrors:0});
  await page.screenshot({path:screenshot,fullPage:true});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#compositionPanel').evaluate(el=>el.open=true);
 await page.locator('.advanced-coordinates').first().evaluate(el=>{el.open=true});
 const annotation=async id=>await page.locator('#'+id+' annotation').first().textContent();
 const initial=await annotation('selectedRootFormula');
 await page.locator('#trackN0').fill('7');
 const degree=await annotation('selectedRootFormula');
 assert.notEqual(degree,initial,'live root-degree edit updates selected-root formula');
 assert.ok(degree.includes('\\sqrt[7]'),'updated degree appears in actual LaTeX');
 await page.locator('#trackA0').fill('0.5');
 const coef=await annotation('selectedRootFormula');
 assert.notEqual(coef,degree,'live Cartesian edit updates modulus in selected-root formula');
 const beforeDrag=await annotation('rootPhaseFormula');
 // Reset to an exact unit root and rotate it with the same Canvas gesture as UI smoke.
 await page.locator('#trackA0').fill('1');
 await page.locator('#trackB0').fill('0');
 const rect=await page.locator('#orbitCanvas').boundingBox();
 const radius=await page.evaluate(()=>window.RhythmResearch.radiiForSize(
   Math.min(document.querySelector('#orbitCanvas').clientWidth,document.querySelector('#orbitCanvas').clientHeight))[0]);
 const cx=rect.x+rect.width/2,cy=rect.y+rect.height/2;
 await page.mouse.move(cx,cy-radius);await page.mouse.down();
 await page.mouse.move(cx+radius*Math.sin(Math.PI/6),cy-radius*Math.cos(Math.PI/6),{steps:9});
 await page.mouse.up();
 const afterDrag=await annotation('rootPhaseFormula');
 assert.notEqual(afterDrag,beforeDrag,'drag changes displayed argument and phase formula');
 const complex=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
 assert.ok(Math.abs(Math.atan2(complex.b,complex.a))>.1,'drag changes canonical complex argument');
 assert.equal(complex.n,7,'drag preserves n exactly');
 fs.writeFileSync('artifacts/formula-acceptance/measurements.json',JSON.stringify({
  screens:reports,dynamic:{
   originalFormula:initial,degreeFormula:degree,changedCoefficientFormula:coef,
   afterDragRootPhase:afterDrag,canonicalArgument:Math.atan2(complex.b,complex.a)
  }
 },null,2));
 console.log('PASS formula acceptance:',reports.length,'viewport-theme states, 10 references, three stacked fractions, dynamic degree, coefficients, dragging');
 await page.close();
}finally{await browser.close()}
