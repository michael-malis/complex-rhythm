import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts/controls-and-lane-colors',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const cases=[];
const close=(a,b,tolerance=1e-6)=>Math.abs(a-b)<tolerance;
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  const paint=await page.evaluate(()=>{
   const css=el=>getComputedStyle(el);
   const rgb=raw=>{const x=document.createElement('span');x.style.color=raw;document.body.append(x);const result=css(x).color;x.remove();return result};
   const lanes=[...document.querySelectorAll('.lane')].map((row,i)=>({
    i,color:rgb(row.style.getPropertyValue('--lane-color')),slider:css(row.querySelector('input[type=range]')).accentColor,
    dot:css(row.querySelector('.lane-dot')).backgroundColor,
    percent:css(row.querySelector('.lane-volume output')).color,
    expectedPercent:rgb('color-mix(in srgb,'+row.style.getPropertyValue('--lane-color')+' 70%, '+css(document.documentElement).color+' 30%)')
   }));
   return {lanes,master:css(document.querySelector('#volume')).accentColor,
    global:css(document.documentElement).getPropertyValue('--accent').trim(),
    layout:css(document.querySelector('.track-list')).gridTemplateColumns};
  });
  assert.equal(paint.lanes.length,4);
  for(const lane of paint.lanes){
   assert.equal(lane.color,lane.slider,'instrument slider hue follows the root ring on lane '+lane.i);
   assert.equal(lane.color,lane.dot,'instrument root marker hue follows its lane '+lane.i);
   assert.equal(lane.expectedPercent,lane.percent,'instrument gain readout has the lane hue with readable contrast on lane '+lane.i);
   assert.notEqual(lane.color,paint.master,'master volume is independent from lane '+lane.i);
  }
  assert.equal(new Set(paint.lanes.map(l=>l.color)).size,4,'four instruments have four distinct hues');
  assert.ok(!paint.lanes.some(l=>l.color===paint.global),'global UI color is not a root-lane color');
  assert.equal(await page.locator('#volume').getAttribute('aria-label'),'Master output volume');
  assert.match(await page.locator('.volume-control').textContent(),/Master volume/);
  if(viewport.width===1440){
   const position=await page.locator('.lane').evaluateAll(rows=>rows.map(x=>({
    x:x.getBoundingClientRect().left,y:x.getBoundingClientRect().top,
    height:x.getBoundingClientRect().height
   })));
   assert.ok(close(position[0].y,position[1].y,.5),'desktop lane 1 and 2 share a row');
   assert.ok(close(position[2].y,position[3].y,.5),'desktop lane 3 and 4 share a row');
   assert.ok(position[2].y>position[0].y,'the four lane panels use a compact 2x2 layout');
   assert.ok(position.every(r=>r.height<550),'individual lane cards remain compact');
  }
  const wheel=async(id,delta=-100)=>{
   await page.locator(id).focus();
   const prevented=await page.locator(id).evaluate((node,y)=>{
    const event=new WheelEvent('wheel',{bubbles:true,cancelable:true,deltaY:y});
    node.dispatchEvent(event);
    return event.defaultPrevented;
   },delta);
   assert.ok(prevented,'focused wheel must be handled by '+id);
  };
  const unarmed=await page.locator('#laneGain0').evaluate(node=>{
   node.blur();const e=new WheelEvent('wheel',{bubbles:true,cancelable:true,deltaY:-100});
   node.dispatchEvent(e);return e.defaultPrevented;
  });
  assert.equal(unarmed,false,'ordinary page scrolling is not intercepted before focus');

  // Auditory state is preserved: the number of scheduled root hits changes
  // while a single Web Audio transport timer continues to run.
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  const before=await page.evaluate(()=>({
   eventCount:window.RhythmResearch.events(window.RhythmResearch.current().tracks[0]).length,
   n:window.RhythmResearch.current().tracks[0].n,
   status:window.RhythmResearch.transport()
  }));
  assert.ok(before.n<64);
  await wheel('#trackN0');
  await page.waitForTimeout(120);
  const after=await page.evaluate(()=>({
   eventCount:window.RhythmResearch.events(window.RhythmResearch.current().tracks[0]).length,
   n:window.RhythmResearch.current().tracks[0].n,
   status:window.RhythmResearch.transport()
  }));
  assert.equal(after.n,before.n+1,'focused wheel increases the number of mathematical nth roots');
  assert.equal(after.eventCount,before.eventCount+1,'the real audible event plan updates live');
  assert.equal(after.status.schedulerIntervalsCreated-after.status.schedulerIntervalsCleared,1,
   'editing attacks during Play does not create a second scheduler');
  assert.equal(after.status.schedulerIntervalsCreated,before.status.schedulerIntervalsCreated);
  assert.ok(after.status.playing);

  const baseAngle=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].b,window.RhythmResearch.current().tracks[0].a));
  await wheel('#trackAngleRad0');
  const radChanged=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].b,window.RhythmResearch.current().tracks[0].a));
  assert.ok(close(radChanged-baseAngle,Math.PI/180,1e-7),
   'one wheel step on radians changes the true argument by exactly pi/180');
  assert.equal(await page.locator('#trackAngleRad0').getAttribute('aria-invalid'),'false');
  await wheel('#trackAngleDeg0');
  const degreeChanged=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].b,window.RhythmResearch.current().tracks[0].a));
  assert.ok(close(degreeChanged-radChanged,Math.PI/180,1e-7),
   'one wheel step on degrees also changes the same argument by exactly one degree');
  assert.ok(close(Number(await page.locator('#trackAngleDeg0').inputValue()),degreeChanged*180/Math.PI,.00001));
  assert.equal(await page.locator('#trackN0').inputValue(),String(before.n+1));

  const gainsBefore=await page.evaluate(()=>window.RhythmResearch.current().tracks.map(t=>t.gain));
  for(let i=0;i<4;i++){
   await wheel('#laneGain'+i);
   const actual=await page.evaluate(()=>window.RhythmResearch.current().tracks.map(t=>t.gain));
   assert.ok(close(actual[i],gainsBefore[i]+.01,.000001),'per-instrument volume wheel has 1% step');
   for(let j=i+1;j<4;j++)assert.ok(close(actual[j],gainsBefore[j]),
    'volume change on lane '+i+' must not affect lane '+j);
  }
  const globalBefore=Number(await page.locator('#volume').inputValue());
  await wheel('#volume');
  assert.equal(Number(await page.locator('#volume').inputValue()),globalBefore+1);
  assert.equal(await page.locator('#volumeText').textContent(),(globalBefore+1)+'%');
  assert.deepEqual(await page.evaluate(()=>window.RhythmResearch.current().tracks.map(t=>t.gain)),
   gainsBefore.map(v=>Number((v+.01).toFixed(2))),
   'Master volume must never overwrite instrument volume');
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  await page.locator('#compositionPanel').evaluate(el=>el.open=true);
  const compColor=await page.evaluate(()=>{
   const el=document.querySelector('#compositionPanel'),slider=document.querySelector('#argumentAngle');
   return {selected:el.style.getPropertyValue('--selected-lane-color'),
    slider:getComputedStyle(slider).accentColor,
    master:getComputedStyle(document.querySelector('#volume')).accentColor};
  });
  assert.ok(compColor.selected,'composition panel receives a lane-specific hue');
  assert.equal(compColor.slider,paint.lanes[0].color,
   'Combine root points slider follows the selected lane and its roots');
  assert.notEqual(compColor.slider,compColor.master);

  const baseComposition=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].b,window.RhythmResearch.current().tracks[0].a));
  await wheel('#argumentAngle');
  const afterComposition=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].b,window.RhythmResearch.current().tracks[0].a));
  assert.ok(close(afterComposition-baseComposition,Math.PI/180,1e-7),
   'combined-roots rotation slider also changes by one degree per wheel notch');
  await page.locator('#addLayer').click();
  const layerBefore=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].layers[0].b,
   window.RhythmResearch.current().tracks[0].layers[0].a));
  await wheel('#layer0AngleRad');
  const layerAfter=await page.evaluate(()=>Math.atan2(
   window.RhythmResearch.current().tracks[0].layers[0].b,
   window.RhythmResearch.current().tracks[0].layers[0].a));
  assert.ok(close(layerAfter-layerBefore,Math.PI/180,1e-7),
   'an added point also supports the same radian one-degree wheel step');
  const layerVelocity=page.locator('.layer-velocity input[type=range]').first();
  const v0=Number(await layerVelocity.inputValue());
  await wheel('.layer-velocity input[type=range]');
  assert.equal(Number(await layerVelocity.inputValue()),v0+1,'added-point gain can be wheel-adjusted');

  await page.locator('.lane[data-lane="2"] .lane-select').click();
  assert.equal(await page.locator('#compositionPanel').evaluate(el=>el.style.getPropertyValue('--selected-lane-color')),
   theme==='dark'?'#d5b16e':'#967438','selected root group color follows lane 3');
  const selectedGainBefore=await page.evaluate(()=>window.RhythmResearch.current().tracks[2].gain);
  await wheel('#laneGain');
  const selectedGainAfter=await page.evaluate(()=>window.RhythmResearch.current().tracks[2].gain);
  assert.ok(close(selectedGainAfter-selectedGainBefore,.01,.000001));
  assert.equal(Number(await page.locator('#laneGain2').inputValue()),
   Math.round(selectedGainAfter*100),'advanced gain and on-lane volume stay synchronized');

  const width=await page.evaluate(()=>({
   body:document.documentElement.scrollWidth,viewport:innerWidth,
   minTouch:Math.min(...[...document.querySelectorAll('.lane input,.lane select')].filter(e=>e.getClientRects().length).map(e=>e.getBoundingClientRect().height))
  }));
  assert.ok(width.body<=width.viewport+2,'4-lane colors and compact grid must not create horizontal overflow');
  assert.ok(width.minTouch>=43.5,'smaller cards must retain 44px input targets');
  assert.deepEqual(errors,[],'no browser exceptions');
  await page.screenshot({path:'artifacts/controls-and-lane-colors/'+viewport.width+'-'+theme+'.png',fullPage:true});
  cases.push({viewport,theme,independentColors:true,radWheelPiOver180:true,degreeWheelOne:true,
   volumeWheelStepOnePercent:true,liveHitCountChanged:true,unchangedScheduler:true,noOverflow:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/controls-and-lane-colors/report.json',JSON.stringify({
  status:'PASS',cases,
  note:'Real browser wheel events, live Web Audio scheduling, per-lane and master color isolation, compact desktop 2x2 and mobile accessibility'
 },null,2)+'\n');
 console.log('PASS lane colors, focused wheel inputs, radians and volume, live attack count × four viewport/theme states');
}finally{await browser.close()}
