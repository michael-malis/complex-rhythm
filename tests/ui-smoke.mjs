import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base='http://127.0.0.1:8767/';
const sizes=[[360,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1520,982]];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const context=await browser.newContext({acceptDownloads:true,reducedMotion:'reduce'});
fs.mkdirSync('artifacts',{recursive:true});
const errors=[];
let checks=0;
function verify(ok,msg){assert.ok(ok,msg);checks++}
try {
 for(const [width,height] of sizes) {
  const page=await context.newPage();
  await page.setViewportSize({width,height});
  page.on('pageerror',e=>errors.push(width+': '+e.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(150);
  const data=await page.evaluate(()=>{
   const rect=id=>document.querySelector(id).getBoundingClientRect();
   return {
    lang:document.documentElement.lang,theme:document.documentElement.dataset.theme,
    scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
    canvas:[rect('#orbitCanvas').width,rect('#orbitCanvas').height],
    lanes:document.querySelectorAll('.lane').length,
    inputs:document.querySelectorAll('.lane input[type=number]').length,
    visibleAngles:[...document.querySelectorAll('.angle-fields input[type=text]')].map(el=>({id:el.id,value:el.value})),
    fieldHeight:rect('#trackN0').height,
    sceneLeft:rect('.visual-stage').left,
    controlLeft:rect('.control-panel').left,
    sceneTop:rect('.visual-stage').top,
    controlTop:rect('.control-panel').top,
    cards:[...document.querySelectorAll('.lane')].map(x=>{const r=x.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width}}),
    bodyText:document.body.innerText,
    computedBackground:getComputedStyle(document.body).backgroundColor,
    fileHidden:getComputedStyle(document.querySelector('#jsonFile')).display==='none'
   };
  });
  verify(data.lang==='en'&&!/[А-Яа-яЁё]/.test(data.bodyText),'English localization '+width);
  verify(data.theme==='light'&&data.computedBackground==='rgb(242, 239, 232)','warm-paper initial theme '+width);
  verify(data.scroll<=data.viewport+2,'horizontal overflow '+width+': '+JSON.stringify(data));
  verify(Math.abs(data.canvas[0]-data.canvas[1])<2&&data.canvas[0]>190,'square Canvas '+width);
  verify(data.lanes===4&&data.inputs===16,'four visible mathematical input rows and independent cycle fields '+width);
  verify(data.visibleAngles.length===8&&data.visibleAngles.every(x=>x.value==='0'),
   'default four lanes initialize both radians and degrees: '+width+' '+JSON.stringify(data.visibleAngles));
  verify(data.fieldHeight>=44,'small input target '+width);
  verify(data.fileHidden,'native JSON file picker visible '+width);
  if(width<1280)verify(data.sceneTop<data.controlTop,'visualization must appear before settings on tablets and phones '+width);
  else verify(data.sceneLeft<data.controlLeft,'desktop visualization alongside settings '+width);
  if(width>=760){
    verify(Math.abs(data.cards[0].top-data.cards[1].top)<2&&data.cards[1].left>data.cards[0].left,
      'simultaneous editors: two columns '+width);
    verify(Math.abs(data.cards[2].top-data.cards[3].top)<2&&data.cards[2].top>data.cards[0].top,
      'simultaneous editors: second row '+width);
    verify(data.cards[0].width>=260,'uncompressed editable panel '+width);
  }
  if(width<520)verify(data.cards[0].top<data.cards[1].top,'compact mobile uses legible one-column editors '+width);
  await page.screenshot({path:'artifacts/workbench-'+width+'x'+height+'.png',fullPage:true});
  console.log('PASS viewport',width+'x'+height,JSON.stringify({canvas:data.canvas,inputs:data.inputs,fieldHeight:data.fieldHeight}));
  await page.close();
 }

 // A 28px visible root must have at least a 44px effective interaction zone.
 // Click 21px tangent to the center of a known root (outside old 20px radius),
 // then drag and verify the canonical complex argument really changes.
 const mobileHit=await context.newPage();
 await mobileHit.setViewportSize({width:390,height:844});
 await mobileHit.goto(base,{waitUntil:'domcontentloaded'});
 const hitInfo=await mobileHit.evaluate(()=>{
   const rect=document.querySelector('#orbitCanvas').getBoundingClientRect();
   return {x:rect.left+rect.width/2,y:rect.top+rect.height/2-rect.width*.427};
 });
 const zBefore=await mobileHit.locator('#trackA0').inputValue();
 await mobileHit.mouse.move(hitInfo.x+21,hitInfo.y);
 await mobileHit.mouse.down();
 await mobileHit.mouse.move(hitInfo.x+47,hitInfo.y+14,{steps:8});
 await mobileHit.mouse.up();
 const zAfter=await mobileHit.locator('#trackA0').inputValue();
 verify(zBefore!==zAfter,'44px canvas root touch radius permits tangent drag at 21px offset');
 await mobileHit.close();

 const page=await context.newPage();
 await page.setViewportSize({width:1440,height:900});
 page.on('pageerror',e=>errors.push('interactions: '+e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 verify(await page.locator('#presetDetails').evaluate(el=>el.open),'rhythm examples open on initial load');
  verify((await page.locator('#presetSelect').inputValue())==='afro','default 3:4 study');
 verify((await page.locator('#laneCount0').textContent()).includes('3 hits'),'lane0 roots initially three');
 verify((await page.locator('#laneCount1').textContent()).includes('4 hits'),'lane1 roots initially four');
 await page.locator('.advanced-coordinates').evaluateAll(items=>items.forEach(el=>{el.open=true}));
 await page.locator('#trackN1').fill('5');
 verify((await page.locator('#laneCount1').textContent()).includes('5 hits'),'lane1 independent edits');
 verify((await page.locator('#laneCount0').textContent()).includes('3 hits'),'lane0 unaffected by lane1 edit');
 await page.locator('#trackN1').fill('4');
 await page.locator('#laneBars0').fill('3');
 await page.locator('#laneBars1').fill('4');
 verify((await page.locator('#commonCycle').textContent()).includes('12 bars'),'3:4 polymetry common cycle');
 await page.locator('#windowPanel').evaluate(el=>el.open=true);
 await page.waitForTimeout(60);
 verify((await page.locator('.window-lane').count())===4,'four independent time-window lanes');
 verify((await page.locator('#windowStart').getAttribute('max'))==='8','bounded viewport ranges over LCM');
 verify((await page.locator('#windowCounts').textContent()).includes('scheduled lane events'),'window shows real scheduled events');
 await page.locator('#windowStart').evaluate(el=>{el.value='7';el.dispatchEvent(new Event('input',{bubbles:true}))});
 verify((await page.locator('#windowStartText').textContent())==='8','explore later bars without generating entire super-cycle');
 await page.locator('#laneBars0').fill('1');
 await page.locator('#laneBars1').fill('1');
 await page.locator('#trackN0').fill('4');
 await page.locator('#compositionPanel').evaluate(el=>el.open=true);
 await page.locator('#addRootFamily').click();
 verify((await page.locator('#baseCount').textContent())==='4','base set count four');
 verify((await page.locator('#addedCount').textContent())==='3','added set count three');
 verify((await page.locator('#unionCount').textContent())==='6','union of fourth and third roots has six events');
 verify((await page.locator('#unionStrip .overlap').count())===1,'exact coincidence at phase zero');
 await page.locator('#advancedMathDetails').evaluate(el=>el.open=true);
 await page.locator('#setOperation').selectOption('intersection');
 verify((await page.locator('#unionCount').textContent())==='1','R4(1) intersect R3(1) is one phase');
 await page.locator('#addRootFamily').click();
 await page.locator('#layer1AngleDeg').fill('180');
 await page.locator('#layer1n').fill('2');
 await page.locator('#layer1n').dispatchEvent('change');
 verify((await page.locator('#unionCount').textContent())==='0',
  'intersection across ALL three sets, not union of extras');
 await page.locator('#setOperation').selectOption('union');
 await page.locator('#extraLayers .layer-remove').last().click();
 verify((await page.locator('#unionCount').textContent())==='6','restored 4∪3 after removing extra set');

 verify((await page.locator('#extraLayers input[type=text]').count())===2&&
   (await page.locator('#extraLayers input[type=number]').count())===1,'additional family has radians, degrees and degree fields');
 const firstStats=await page.evaluate(()=>{
 const t=window.RhythmResearch.current();
 const phase=window.RhythmMath.planEvents(t.tracks.map((track,i)=>({
  cycleBars:track.cycleBars,muted:track.muted,events:window.RhythmResearch.events(track)
 })),240/t.bpm,0,4*240/t.bpm);
 return window.RhythmMath.analyzeSchedule(phase);
 });
 verify((await page.locator('#eventSummary').textContent()).includes(firstStats.totalEvents+' audible hits'),
  'global audible hits exactly match actual four-bar planner');
 verify((await page.locator('#eventSummary').textContent()).includes(firstStats.uniqueMoments+' distinct times'),
  'global unique event timestamps use canonical planner');
 verify((await page.locator('#eventSummary').textContent()).includes(firstStats.sharedMoments+' shared across lanes'),
  'cross-lane collisions are not removed by within-lane union');
 await page.locator('#loadRootExample').click();
 verify((await page.locator('#baseCount').textContent())==='4','worked example base four roots');
 verify((await page.locator('#addedCount').textContent())==='3','worked example added three roots');
 verify((await page.locator('#unionCount').textContent())==='6','worked example six unique phases');
 verify(await page.locator('#exampleProof .katex').count()===1,'worked example displays correctly typeset phase-set identity');
 verify((await page.locator('#exampleProof').textContent()).includes('Φ'),'mathematical proof explicitly denotes phases, not raw roots');
 await page.locator('#windowPanel').evaluate(el=>el.open=true);
 await page.waitForTimeout(50);
 const timeline=page.locator('.window-lane-events').first();
 await timeline.click({position:{x:4,y:24}});
 verify((await page.locator('#eventInspection').textContent()).includes('base root 1'),
  'timeline inspection displays base mathematical source');
 verify((await page.locator('#eventInspection').textContent()).includes('additional root set 1'),
  'timeline inspection identifies the overlapping additional root');
 await timeline.focus();await page.keyboard.press('ArrowRight');
 verify((await page.locator('#eventInspection').textContent()).includes('velocity'),
  'timeline events are keyboard-inspectable with velocity and source');
 await page.locator('#argumentAngle').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}))});
 const a=Number(await page.locator('#trackA0').inputValue());
 const b=Number(await page.locator('#trackB0').inputValue());
 verify(Math.abs(a)<1e-4&&Math.abs(b-1)<1e-4,'argument slider preserves magnitude');
 verify((await page.locator('#trackA0').inputValue())==='0','exact quarter-turn should not display floating-point dust');
 verify((await page.locator('#baseCount').textContent())==='4','rotation preserves degree');
 await page.locator('#themeBtn').click();
 verify((await page.locator('html').getAttribute('data-theme'))==='dark','dark theme enabled');
 await page.screenshot({path:'artifacts/workbench-dark-theme.png',fullPage:true});
 await page.locator('#themeBtn').click();
 verify((await page.locator('html').getAttribute('data-theme'))==='light','light theme restored');
 await page.locator('.advanced-coordinates').evaluateAll(items=>items.forEach(el=>{el.open=true}));
 await page.locator('#trackA0').fill('1');await page.locator('#trackB0').fill('0');

 // Keyboard turns the first lane's four roots by 5°, hence arg(z) by 20°.
 await page.locator('#orbitCanvas').focus();await page.keyboard.press('Shift+ArrowRight');
 const keyA=Number(await page.locator('#trackA0').inputValue());
 const keyB=Number(await page.locator('#trackB0').inputValue());
 verify(Math.abs(Math.atan2(keyB,keyA)*180/Math.PI-20)<2,'keyboard rotation by 5° per root');

 // Restore the default before the drag test.
 await page.locator('#presetDetails').evaluate(el=>el.open=true);
 await page.locator('#categorySelect').selectOption('poly');
 await page.locator('#presetSelect').selectOption('afro');
 await page.locator('#orbitCanvas').scrollIntoViewIfNeeded();
 // Drag an actual base root, independent of the preset's starting phase.
 const beforeDrag=await page.evaluate(()=>{
  const t=window.RhythmResearch.current().tracks[0];
  return {a:t.a,b:t.b,n:t.n,phase:window.RhythmMath.rootPhases(t.a,t.b,t.n)[0]};
 });
 const box=await page.locator('#orbitCanvas').boundingBox();
 const cx=box.x+box.width/2,cy=box.y+box.height/2,r=Math.min(box.width,box.height)*.427;
 const start=-Math.PI/2+2*Math.PI*beforeDrag.phase,finish=start+Math.PI/9;
 await page.mouse.move(cx+r*Math.cos(start),cy+r*Math.sin(start));await page.mouse.down();
 await page.mouse.move(cx+r*Math.cos(finish),cy+r*Math.sin(finish),{steps:12});await page.mouse.up();
 const afterDrag=await page.evaluate(()=>{
  const t=window.RhythmResearch.current().tracks[0];
  return {a:t.a,b:t.b,n:t.n};
 });
 const expected=Math.atan2(beforeDrag.b,beforeDrag.a)+beforeDrag.n*Math.PI/9;
 const actual=Math.atan2(afterDrag.b,afterDrag.a);
 const err=Math.atan2(Math.sin(actual-expected),Math.cos(actual-expected));
 verify(Math.abs(err)<4*Math.PI/180,
  'mouse drag rotates root set directly: '+JSON.stringify({beforeDrag,afterDrag,errorDeg:err*180/Math.PI}));
 verify(afterDrag.n===beforeDrag.n,'mouse drag preserves root degree');
 const da=Number(await page.locator('#trackA0').inputValue()),db=Number(await page.locator('#trackB0').inputValue());
 verify(Math.abs(da-afterDrag.a)<1e-8&&Math.abs(db-afterDrag.b)<1e-8,
  'mouse drag synchronizes Cartesian readouts');

 let total=0;
 for(const category of await page.locator('#categorySelect option').evaluateAll(opts=>opts.map(o=>o.value).filter(value=>value!=='grooves'&&value!=='all'))) {
  await page.locator('#categorySelect').selectOption(category);
  const ids=await page.locator('#presetSelect option').evaluateAll(opts=>opts.map(o=>o.value).filter(x=>!x.startsWith('__')));
  for(const id of ids) {
   await page.locator('#presetSelect').selectOption(id);
   verify(await page.locator('.lane').count()===4,'preset loads all lanes '+id);
   total++;
  }
 }
 verify(total===51,'expected 35 original, 15 experimental, and one Song Examples study');
 await page.locator('#categorySelect').selectOption('poly');
 const poly=await page.locator('#presetSelect option').allTextContents();
 for(const ratio of ['2 : 3','3 : 4','3 : 5','4 : 7','5 : 7'])
  verify(poly.some(t=>t.includes(ratio)),'polyrhythm ratio '+ratio);
 await page.locator('#categorySelect').selectOption('brazil');
 verify((await page.locator('#presetSelect option').allTextContents()).filter(t=>t.includes('Bossa Nova')).length===1,'one Bossa Nova preset');

 const beforeJsonEvents=await page.evaluate(()=>JSON.stringify(window.RhythmResearch.current().tracks.map(t=>window.RhythmResearch.events(t))));
await page.locator('#fileMenu summary').click();
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#saveBtn').click();
 const download=await downloadPromise;
 const raw=fs.readFileSync(await download.path(),'utf8'),saved=JSON.parse(raw);
 verify(saved.format==='roots-rhythm/1'&&saved.tracks.length===4,'JSON v1 unchanged');
 await page.locator('#jsonFile').setInputFiles({name:'roundtrip.json',mimeType:'application/json',buffer:Buffer.from(raw)});
 await page.waitForTimeout(90);
 verify((await page.locator('#toast').textContent()).includes('Imported'),'JSON round trip');
 const afterJsonEvents=await page.evaluate(()=>JSON.stringify(window.RhythmResearch.current().tracks.map(t=>window.RhythmResearch.events(t))));
 verify(beforeJsonEvents===afterJsonEvents,'JSON mathematically restores identical event sets');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>document.querySelector('#playBtn').textContent.includes('Pause'),{timeout:8000});
 verify((await page.locator('#playBtn').textContent()).includes('Pause'),'audio transport starts');
 await page.locator('#playBtn').click();
 verify((await page.locator('#playBtn').textContent()).includes('Play'),'audio transport pauses');
 verify(errors.length===0,'browser JavaScript errors: '+errors.join('; '));
 await page.screenshot({path:'artifacts/workbench-composition.png',fullPage:true});
 console.log('ALL PASS:',checks,'assertions |',sizes.length,'viewports | 51 browsable examples | root union, responsive, theme, audio, JSON');
 await page.close();
} finally {
 await context.close();await browser.close();
}
