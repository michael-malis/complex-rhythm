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
  const optionTargets=await page.locator('#rootRuleAngleList li[data-index]').evaluateAll(
   options=>options.map(option=>option.getBoundingClientRect().height));
  assert.ok(optionTargets.every(height=>height>=44-0.5),
   'root-angle tracing remains finger-sized at '+width+'px and '+theme+' theme');
  assert.ok(s.docWidth<=width+1,'info panel must not cause viewport-wide overflow at '+width+'/'+theme);
  report.push({viewport:[width,height],theme,angles:s.angles.map(x=>x.degree),
   mathml:s.mathml,panelWidth:s.rootPanel});
  await page.screenshot({path:'artifacts/root-angle-infographic/'+width+'-'+theme+'.png',fullPage:true});
  assert.deepEqual(errors,[],'browser errors in responsive root geometry');
  await page.close();
 }

 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 await phone.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await importFixture(phone,fixture);
 await phone.locator('#rootRuleInfoToggle').tap();
 await phone.locator('#rootRuleAngleList li[data-index="2"]').tap();
 const touch=await phone.evaluate(()=>({
  selected:[...document.querySelectorAll('#rootRuleAngleList li.is-inspected')].map(x=>Number(x.dataset.index)),
  markers:[...document.querySelectorAll('#rootRuleDiagram .root-info-marker.is-inspected')].map(x=>Number(x.dataset.index)),
  expanded:document.querySelector('#rootRuleInfoToggle').getAttribute('aria-expanded'),
  unchanged:window.RhythmResearch.current().tracks[0].n,
  overflow:document.documentElement.scrollWidth>innerWidth+1
 }));
 assert.deepEqual(touch.selected,[2],'real mobile touch highlights chosen root-angle row');
 assert.deepEqual(touch.markers,[2],'touch highlights the same root on the SVG circle');
 assert.equal(touch.expanded,'true');
 assert.equal(touch.unchanged,4,'touch tracing does not edit complex-root degree');
 assert.equal(touch.overflow,false,'interactive root rows do not cause mobile overflow');
 await phone.close();

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
 // Inspect the actual SVG marker and line with keyboard and pointer. This
 // is explanatory highlighting; it must not edit the complex-root source.
 const list=page.locator('#rootRuleAngleList');
 const trace=()=>page.evaluate(()=>{
  const list=document.querySelector('#rootRuleAngleList');
  const selected=[...list.querySelectorAll('li.is-inspected')];
  const marked=[...document.querySelectorAll('#rootRuleDiagram .root-info-marker.is-inspected')];
  const ray=document.querySelector('#rootRuleDiagram .root-info-focus-ray');
  const halo=document.querySelector('#rootRuleDiagram .root-info-focus-halo');
  const item=selected[0],phase=item?Number(item.dataset.phase):null;
  return {
   selected:selected.map(x=>Number(x.dataset.index)),
   markers:marked.map(x=>Number(x.dataset.index)),
   active:list.getAttribute('aria-activedescendant'),
   role:item?.getAttribute('role'),aria:item?.getAttribute('aria-selected'),
   visible:ray.getAttribute('visibility')==='visible'&&halo.getAttribute('visibility')==='visible',
   coordinateError:phase===null?null:Math.hypot(
    Number(ray.getAttribute('x2'))-(140+95*Math.sin(2*Math.PI*phase)),
    Number(ray.getAttribute('y2'))-(140-95*Math.cos(2*Math.PI*phase))),
   options:list.querySelectorAll('li[role="option"]').length
  };
 });
 await list.focus();
 assert.deepEqual((await trace()).selected,[0],'focus starts at the first mathematical root');
 await page.keyboard.press('ArrowRight');
 let focus=await trace();
 assert.deepEqual(focus.selected,[1],'arrow key moves one canonical root');
 assert.deepEqual(focus.markers,[1],'highlighted SVG marker matches selected angle');
 assert.ok(focus.visible&&focus.coordinateError<.001,'active radius reaches the exact canonical root');
 assert.equal(focus.active,'rootRuleOption1','single accessible active descendant');
 assert.equal(focus.role,'option');assert.equal(focus.aria,'true');
 await page.keyboard.press('End');
 assert.deepEqual((await trace()).selected,[3],'End reaches the last root');
 await page.keyboard.press('ArrowUp');
 assert.deepEqual((await trace()).selected,[2],'ArrowUp selects the previous root');
 await page.keyboard.press('Home');
 assert.deepEqual((await trace()).selected,[0],'Home selects first root');
 await page.keyboard.press('Escape');
 assert.deepEqual((await trace()).selected,[],'Escape clears the focused root');
 await info.focus();
 await page.locator('#rootRuleAngleList li[data-index="2"]').hover();
 assert.deepEqual((await trace()).selected,[2],'mouse hover traces the third root');
 await page.screenshot({path:'artifacts/root-angle-infographic/interactive-root-trace.png',fullPage:true});
 await page.mouse.move(0,0);
 assert.deepEqual((await trace()).selected,[],'mouse exit removes the temporary highlight');
 assert.equal(await page.evaluate(()=>window.RhythmResearch.current().tracks[0].n),4,
  'root tracing never alters mathematical degree');
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
  if(lane===3)assert.equal((await trace()).options,0,'zero has no selectable roots');
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
 await list.focus();await page.keyboard.press('End');
 assert.deepEqual((await trace()).selected,[6],'live degree edit updates traceable root options');
 await page.locator('#trackN0').fill('64');
 await list.focus();await page.keyboard.press('End');
 const denseTrace=await trace();
 assert.equal(denseTrace.options,64,'all 64 dense mathematical roots are accessible through one list');
 assert.deepEqual(denseTrace.selected,[63],'keyboard End reaches last of 64 distinct roots');
 assert.ok(denseTrace.coordinateError<.001,'dense last-root highlight uses exact phase');
 await page.locator('#trackN0').fill('7');
 await page.locator('#trackN0').focus();
 const phaseBefore=(await read(page)).angles[0].phase;
 // Cartesian fields are intentionally inside a collapsed advanced editor.
 // Expand the actual interface before the user-like input interaction.
 await page.locator('.lane[data-lane="0"] .advanced-coordinates').evaluate(el=>{el.open=true});
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
