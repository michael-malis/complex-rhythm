import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Historical "before" is a REPRODUCIBLE GIT RELEASE, not a missing
// user-annotated design image. Both actual code revisions are served from
// separate HTTP roots by the same GitHub Actions workflow.
const BEFORE='454b7c4466851e82946034ce4a47019c716ee218';
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const directory='artifacts/math-historical-compare';
fs.mkdirSync(directory,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[];
const dynamicIds=['cartesianHeading','argMathLabel','mathExampleUnion',
 'rootRuleEquation','rootRuleValues','rootRuleSpacing','rootRuleInput',
 'rootRuleDelta','rootRuleFormula','selectedRootFormula','rootPhaseFormula',
 'compositionEquation','laneEq0','laneEq1','laneEq2','laneEq3',
 'sharedPhaseFormula'];
const graphIds=['phaseZero','phaseQuarter','phaseHalf','phaseThreequarters'];
const audit=page=>page.evaluate(({dynamicIds,graphIds})=>{
 const inspect=e=>{
  if(!e)return null;
  const rect=e.getBoundingClientRect();
  const math=e.querySelector('math'),ann=e.querySelector('annotation');
  return {latex:ann?.textContent||'',mathml:!!math,katex:!!e.querySelector('.katex'),
   katexError:!!e.querySelector('.katex-error'),text:e.textContent.trim().slice(0,250),
   rect:{left:+rect.left.toFixed(2),top:+rect.top.toFixed(2),
    width:+rect.width.toFixed(2),height:+rect.height.toFixed(2)},
   clipped:rect.left<-3||rect.right>innerWidth+3};
 };
 const references=[...document.querySelectorAll('#formulaReference .formula-math')].map(inspect);
 const locations=Object.fromEntries(dynamicIds.map(id=>[id,inspect(document.getElementById(id))]));
 const phases=Object.fromEntries(graphIds.map(id=>[id,inspect(document.getElementById(id))]));
 return {references,locations,phases,
  docWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,
  totalMathml:document.querySelectorAll('math').length,
  totalKatexErrors:document.querySelectorAll('.katex-error').length,
  sourceVersion:document.querySelector('meta[name="description"]')?.content||'',
  hasCanvas:!!document.getElementById('orbitCanvas'),
  hasSvg:!!document.getElementById('rootRuleDiagram'),
  openFormulaPanel:!!document.querySelector('.math-details')?.open};
},{dynamicIds,graphIds});
async function capture(baseURL,sha,width,height,theme){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(baseURL,{waitUntil:'domcontentloaded'});
 if(theme==='dark')await page.locator('#themeBtn').click();
 // Both versions expose the formula reference and the math inspector. The
 // historical baseline lacks later SVG infographic controls: that is an
 // observed feature difference, not an erroneous old version.
 for(const selector of ['.math-details','#compositionPanel']){
  await page.locator(selector).evaluate(el=>el.open=true);
 }
 if(await page.locator('#rootRuleInfoToggle').count()){
  const open=await page.locator('#rootRuleInfoToggle').getAttribute('aria-expanded');
  if(open==='false')await page.locator('#rootRuleInfoToggle').click();
 }
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const result=await audit(page);
 const basename=(sha===BEFORE?'before-':'after-')+width+'-'+theme+'.png';
 const filename=path.join(directory,basename);
 await page.screenshot({path:filename,fullPage:true});
 assert.deepEqual(errors,[],'browser errors for '+sha+' '+width+'/'+theme);
 assert.equal(result.references.length,10,'ten canonical original source formulas '+sha);
 assert.ok(result.references.every(x=>x.katex&&x.mathml&&!x.katexError),
  'ten actual original and current KaTeX/MathML formula renderings '+sha);
 assert.ok(result.hasCanvas&&result.totalKatexErrors===0,'valid root graph and math '+sha);
 assert.equal(Object.keys(result.phases).length,4);
 assert.ok(graphIds.every(id=>result.phases[id]?.mathml),'four semantic time labels '+sha);
 assert.ok(result.docWidth<=width+2,'no page-wide horizontal overflow '+sha+' '+width);
 const bytes=fs.readFileSync(filename);
 assert.ok(bytes.length>2048&&bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a',
  'real Chromium screenshot persisted '+filename);
 await page.close();
 return {...result,screenshot:basename};
}
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const before=await capture('http://127.0.0.1:8768/',BEFORE,width,height,theme);
  const after=await capture('http://127.0.0.1:8767/','current',width,height,theme);
  assert.ok(after.totalMathml>=before.totalMathml,
   'the current mathematical interface cannot lose semantic formulas');
  assert.ok(after.hasSvg,'present release has actual root SVG geometry');
  for(const id of dynamicIds.filter(id=>id!=='rootRuleInput'&&id!=='rootRuleDelta'&&
   id!=='rootRuleFormula'&&id!=='sharedPhaseFormula')){
   const item=after.locations[id];
   assert.ok(item&&item.katex&&item.mathml&&!item.katexError&&!item.clipped,
    'new math location missing, clipped or unrendered: '+id);
  }
  assert.ok(after.locations.sharedPhaseFormula!==null,'source-shared mathematical label exists');
  cases.push({width,height,theme,before,after,
   changedSourceLocations:dynamicIds.filter(id=>before.locations[id]?.latex!==after.locations[id]?.latex),
   addedMathLocations:dynamicIds.filter(id=>!before.locations[id]&&after.locations[id])});
 }
 assert.equal(cases.length,12,'six sizes by both themes, before and after');
 fs.writeFileSync(directory+'/report.json',JSON.stringify({
  status:'PASS',historicalSourceSha:BEFORE,
  afterSource:'current CI pull-request HEAD',referenceFormulas:10,
  beforeAfterStates:12,screenshots:24,
  reproducibleHistoricalCode:true,annotatedOriginalUserScreenshot:false,
  cases,scope:'Actual old Git commit vs actual current app; 10 contractual mathematical identities, real before/after DOM formula sources, geometry, 24 chromium screenshots, 12 viewport/themes. Unavailable original human annotated screenshot and real screen reader remain separately blocked.'
 },null,2)+'\n');
 console.log('PASS M06 reproducible historical code comparison: 12 before/after screen cases, 10 source formulas, 24 real screenshots');
}finally{await browser.close()}
