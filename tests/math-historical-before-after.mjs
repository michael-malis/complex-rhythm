import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// M06/R-TEX-008: authentic Git-revision before/after visual evidence.
// "Before" means the immutable source-tree commit used by Rhythm Studio's
// post-merge baseline, NOT a reconstructed or invented user-annotated image.
const baselineSha='454b7c4466851e82946034ce4a47019c716ee218';
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const dynamicIds=['cartesianHeading','argMathLabel','mathExampleUnion','rootRuleEquation',
 'rootRuleValues','rootRuleSpacing','rootRuleInput','rootRuleDelta',
 'rootRuleFormula','selectedRootFormula','rootPhaseFormula','compositionEquation',
 'laneEq0','laneEq1','laneEq2','laneEq3','sharedPhaseFormula'];
const labelIds=['phaseZero','phaseQuarter','phaseHalf','phaseThreequarters'];
const root='artifacts/math-history';fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const data=[];
const inspect=page=>page.evaluate(({dynamicIds,labelIds})=>{
 const capture=el=>{
  if(!el)return null;
  const r=el.getBoundingClientRect(),c=getComputedStyle(el);
  return {latex:el.querySelector('annotation')?.textContent||'',
   mathml:!!el.querySelector('math'),html:!!el.querySelector('.katex'),
   error:!!el.querySelector('.katex-error'),hidden:el.hidden||c.display==='none',
   bounding:{left:r.left,right:r.right,top:r.top,bottom:r.bottom,
    width:r.width,height:r.height},
   scrollable:el.scrollWidth<=el.clientWidth+3||/auto|scroll/.test(c.overflowX)};
 };
 const references=[...document.querySelectorAll('#formulaReference .formula-math')].map(capture);
 const locations=Object.fromEntries(dynamicIds.map(id=>[id,capture(document.getElementById(id))]));
 const graph=Object.fromEntries(labelIds.map(id=>[id,capture(document.getElementById(id))]));
 const marker={hasOriginalRatioSelect:!!document.getElementById('ratioSelect'),
  hasNewRootInfographic:!!document.getElementById('rootRuleInfoToggle')};
 return {references,locations,graph,marker,
  rawLatex:/\\(?:dfrac|frac|theta|sqrt|operatorname)\b/.test(document.body.innerText),
  katexErrors:document.querySelectorAll('.katex-error').length,
  pageOverflow:document.documentElement.scrollWidth>innerWidth+1,
  visibleSourceFields:[...document.querySelectorAll('#tracks input[id^="trackN"]')].map(el=>({
   id:el.id,value:el.value
  })),
  sourceMathModel:window.RhythmResearch?.current?.().tracks?.map(t=>({
   a:t.a,b:t.b,n:t.n,cycleBars:t.cycleBars
  }))||null};
},{dynamicIds,labelIds});
async function startPage(viewport,theme,url){
 const page=await browser.newPage({viewport,reducedMotion:'reduce'});
 const runtime=[];page.on('pageerror',e=>runtime.push(e.message));
 await page.goto(url,{waitUntil:'domcontentloaded'});
 if(theme==='dark')await page.locator('#themeBtn').click();
 await page.locator('#compositionPanel').evaluate(el=>el.open=true);
 await page.locator('.math-details').evaluate(el=>el.open=true);
 if(await page.locator('#rootRuleInfoToggle').count())
  await page.locator('#rootRuleInfoToggle').click();
 return {page,runtime};
}
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const viewport={width,height};
  const old=await startPage(viewport,theme,'http://127.0.0.1:8768/');
  const newer=await startPage(viewport,theme,'http://127.0.0.1:8767/');
  const [before,after]=await Promise.all([inspect(old.page),inspect(newer.page)]);
  assert.ok(before.marker.hasOriginalRatioSelect&&!before.marker.hasNewRootInfographic,
   'historical page must be the actual old Git version, not a new-site duplicate');
  assert.ok(!after.marker.hasOriginalRatioSelect&&after.marker.hasNewRootInfographic,
   'new page must be the actual current revision with added formula infographic');
  assert.equal(before.references.length,10,'original source contains ten real formula references');
  assert.equal(after.references.length,10,'latest source renders ten mandatory formula references');
  assert.ok(after.references.every(x=>x.mathml&&x.html&&!x.error&&x.latex.length>0),
   'all ten latest references use real accessible KaTeX+MathML');
  assert.ok(Object.values(after.locations).filter(Boolean).every(x=>x.mathml&&x.html&&!x.error&&x.latex.length>0),
   'all current mathematical UI locations are actual semantic formulas');
  assert.ok(Object.values(after.graph).every(x=>x?.mathml&&x.html&&!x.error),
   'all four graph time labels are true rendered math');
  assert.ok(!after.rawLatex&&!after.katexErrors&&!after.pageOverflow,
   'current formulas are not displayed as raw TeX or clipped past page width');
  const changes=[];
  for(const id of [...dynamicIds,...labelIds]){
   const b=before.locations[id]??before.graph[id],a=after.locations[id]??after.graph[id];
   if(!b&&a)changes.push({location:id,kind:'new',before:null,after:a.latex});
   else if(b&&a&&b.latex!==a.latex)
    changes.push({location:id,kind:'modified',before:b.latex,after:a.latex});
  }
  assert.ok(changes.some(x=>x.location==='rootRuleValues'&&x.kind==='modified'),
   'authentic baseline generic argument must differ from the new live numeric value');
  assert.ok(changes.some(x=>x.location==='rootRuleSpacing'&&x.kind==='new'),
   'additional root-spacing formula must be genuinely absent from original revision');
  const suffix=width+'-'+theme;
  const paths={before:root+'/'+suffix+'-original.png',after:root+'/'+suffix+'-current.png'};
  await Promise.all([old.page.screenshot({path:paths.before,fullPage:true}),
   newer.page.screenshot({path:paths.after,fullPage:true})]);
  for(const path of Object.values(paths)){
   const bytes=fs.readFileSync(path);
   assert.ok(bytes.length>10000&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
    'screenshot must be a real Chromium PNG, not a synthetic/report placeholder: '+path);
  }
  assert.deepEqual(old.runtime,[],'historical runtime has no JS exceptions in source-representative state');
  assert.deepEqual(newer.runtime,[],'current runtime has no JS exceptions');
  data.push({viewport,theme,originalRevision:baselineSha,
   oldPageMarker:before.marker,newPageMarker:after.marker,
   beforeReferenceLatex:before.references.map(x=>x.latex),
   afterReferenceLatex:after.references.map(x=>x.latex),
   sourceValuesBefore:before.sourceMathModel,sourceValuesAfter:after.sourceMathModel,
   originalLocations:before.locations,newLocations:after.locations,
   originalGraph:before.graph,newGraph:after.graph,
   changes,checks:{newReferencesMathML:true,newLocationsMathML:true,
    noRawTeX:true,noHorizontalPageOverflow:true},
   originalScreenshot:paths.before.replace('artifacts/',''),
   newScreenshot:paths.after.replace('artifacts/','')});
  await old.page.close();await newer.page.close();
 }
 assert.equal(data.length,12);
 assert.ok(data.every(x=>x.changes.length>=2));
 fs.writeFileSync(root+'/before-after.json',JSON.stringify({
  status:'PASS',baselineCommit:baselineSha,
  baselineMeaning:'Actual preserved Git source commit, not the unavailable second user-annotated original screenshot',
  testMethod:'Headless Chromium renders pinned historical checkout and current PR checkout at the same six sizes/two themes. Reads actual KaTeX annotations and MathML plus bounding boxes; saves paired original/current PNG screenshots. No artificial historical image.',
  states:12,sourceReferences:10,dynamicMathematicalLocations:17,
  graphLabels:4,genuinePngPairs:12,humanAnnotatedImageRecovered:false,
  cases:data
 },null,2)+'\n');
 console.log('PASS M06 authentic historical original/new math comparison: 12 matched viewports, 24 real screenshots, 10 required formulas, 17 location trace entries');
}finally{await browser.close()}
