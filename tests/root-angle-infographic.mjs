import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const TAU=2*Math.PI;
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const fixture={
 format:'roots-rhythm/1',name:'Root geometry 120 degree test',bpm:120,bars:1,
 tracks:[
  {a:-.5,b:Math.sqrt(3)/2,n:4,sound:'technoKick',cycleBars:1,muted:false,layers:[]},
  {a:1,b:0,n:1,sound:'metallic',cycleBars:1,muted:false,layers:[]},
  {a:0,b:-1,n:7,sound:'fmPerc',cycleBars:1,muted:false,layers:[]},
  {a:0,b:0,n:4,sound:'noiseBurst',cycleBars:1,muted:false,layers:[]}
 ]
};
fs.mkdirSync('artifacts/root-angle-infographic',{recursive:true});
const report=[];
const read=page=>page.evaluate(()=>{
 const list=[...document.querySelectorAll('#rootRuleAngleList li[data-index]')];
 return {
  button:document.querySelector('#rootRuleInfoToggle').getAttribute('aria-expanded'),
  hidden:document.querySelector('#rootRuleInfoPanel').hidden,
  compact:document.querySelector('#rootRuleValues annotation')?.textContent||'',
  spacing:document.querySelector('#rootRuleSpacing annotation')?.textContent||'',
  input:document.querySelector('#rootRuleInput annotation')?.textContent||'',
  formula:document.querySelector('#rootRuleFormula annotation')?.textContent||'',
  angles:list.map(li=>({k:Number(li.dataset.index),phase:Number(li.dataset.phase),
   degree:Number(li.dataset.degrees),text:li.textContent.trim(),
   latex:li.querySelector('annotation')?.textContent||''})),
  markers:document.querySelectorAll('#rootRuleDiagram circle.root-info-marker').length,
  mathml:document.querySelectorAll('#rootRuleInfoPanel math').length,
  docWidth:document.documentElement.scrollWidth,
  width:window.innerWidth,
  rootPanel:document.querySelector('#rootRuleInfoPanel').getBoundingClientRect().width,
  katexErrors:document.querySelectorAll('.katex-error').length
 };
});
async function importFixture(page,project){
 await page.locator('#jsonFile').setInputFiles({
  name:'root-math.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))
 });
 await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),project.name);
}
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await importFixture(page,fixture);
  assert.equal(await page.locator('#rootRuleInfoToggle').getAttribute('aria-expanded'),'false');
  assert.ok(await page.locator('#rootRuleInfoPanel').isHidden());
  await page.locator('#rootRuleInfoToggle').click();
  const s=await read(page);
  assert.equal(s.button,'true','geometry info control opens accessibly');
  assert.ok(!s.hidden&&s.rootPanel>200,'full root explanation fits in root-rule editor');
  assert.ok(s.compact.includes('\\frac{2\\pi}{3}'),'input angle 2π/3 shown as actual math');
  assert.ok(s.spacing.includes('\\frac{\\pi}{2}'),'π/2 spacing shown in compact rule');
  assert.ok(s.input.includes('\\frac{2\\pi}{3}'),'expanded argument remains 2π/3');
  assert.ok(s.formula.includes('\\theta_k'),'expanded geometric formula matches root model');
  assert.deepEqual(s.angles.map(x=>x.degree),[30,120,210,300],
   'four exact root angles for θ=120°, n=4');
  assert.ok(s.angles.every(x=>x.latex&&Number.isFinite(x.phase)),'each generated root shows radians in KaTeX and degrees in text');
  assert.equal(s.markers,4,'unit-circle diagram shows all roots');
  assert.ok(s.mathml>=7,'compact plus expanded math rendered with accessible MathML');
  assert.equal(s.katexErrors,0,'no formula rendering errors');
  assert.ok(s.docWidth<=width+1,'info panel must not cause viewport-wide overflow at '+width+'/'+theme);
  report.push({viewport:[width,height],theme,angles:s.angles.map(x=>x.degree),
   mathml:s.mathml,panelWidth:s.rootPanel});
  await page.screenshot({path:'artifacts/root-angle-infographic/'+width+'-'+theme+'.png',fullPage:true});
  assert.deepEqual(errors,[],'browser errors in responsive root geometry');
  await page.close();
 }

 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await importFixture(page,fixture);
 const info=page.locator('#rootRuleInfoToggle');
 await info.focus();await page.keyboard.press('Enter');
 assert.equal((await read(page)).button,'true','Enter opens root geometry');
 await info.focus();await page.keyboard.press('Space');
 assert.equal((await read(page)).button,'false','Space closes geometry');
 await info.focus();await page.keyboard.press('Enter');
 for(let lane=0;lane<4;lane++){
  await page.locator('.lane[data-lane="'+lane+'"] .lane-select').click();
  const state=await read(page);
  const canonical=await page.evaluate(i=>{
   const t=window.RhythmResearch.current().tracks[i];
   return window.RhythmMath.rootPhases(t.a,t.b,t.n);
  },lane);
  assert.equal(state.markers,canonical.length,'lane '+lane+' root count correct');
  assert.deepEqual(state.angles.map(x=>x.phase),canonical,'lane '+lane+' canonical root phases');
  if(lane===3)assert.ok(state.input.includes('\\arg(0)')&&state.angles.length===0,
   'zero value has no argument and no rhythm events');
  if(lane===1)assert.deepEqual(state.angles.map(x=>x.degree),[0],'n=1 yields only one root');
  if(lane===2)assert.equal(state.angles.length,7,'negative argument produces seven valid roots');
 }
 await page.locator('.lane[data-lane="0"] .lane-select').click();
 const original=await read(page);
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,{timeout:10000});
 const transportStart=await page.evaluate(()=>window.RhythmResearch.transport());
 await page.locator('#trackN0').fill('7');
 assert.equal((await read(page)).angles.length,7,'degree change updates infographic live');
 const phaseBefore=(await read(page)).angles[0].phase;
 await page.locator('#trackB0').fill('0.7');
 const edited=await read(page);
 assert.notEqual(edited.angles[0].phase,phaseBefore,'complex argument edit updates displayed phases');
 assert.equal(await page.evaluate(()=>document.activeElement?.id),'trackB0','editing preserves input focus');
 const transportEnd=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.ok(transportEnd.playing&&transportEnd.timerActive,'audio transport continues during live edits');
 assert.equal(transportEnd.schedulerIntervalsCreated,transportStart.schedulerIntervalsCreated,
  'mathematical explanation does not add audio schedulers');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);

 const turn={...fixture,name:'Full-turn equivalent roots',
  tracks:fixture.tracks.map(t=>({...t}))};
 turn.tracks[0].a=Math.cos(2*Math.PI/3+TAU);
 turn.tracks[0].b=Math.sin(2*Math.PI/3+TAU);
 await importFixture(page,turn);
 assert.deepEqual((await read(page)).angles.map(x=>x.degree),[30,120,210,300],
  'equivalent full-turn argument leaves all root phases unchanged');
 assert.ok(original.angles.length===4);
 assert.deepEqual(errors,[],'runtime exceptions');
 await page.close();

 fs.writeFileSync('artifacts/root-angle-infographic/results.json',JSON.stringify({
  status:'PASS',screens:report,canonicalCases:'4 lanes incl n=1, negative and zero, full-turn equivalence',
  interactive:'keyboard disclosure, live degree/complex input during Web Audio, no second timer'
 },null,2));
 console.log('PASS root geometry infotoggle, exact 120°/4 angles, 12 viewports/themes, four lanes, zero, negative, full-turn and live Web Audio');
}finally{await browser.close()}
