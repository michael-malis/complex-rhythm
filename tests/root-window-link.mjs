import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts/root-window-link',{recursive:true});
const z=Math.SQRT1_2;
const fixture={format:'roots-rhythm/1',name:'Linked root windows',bpm:120,bars:1,tracks:[
 {a:1,b:0,n:4,cycleBars:1,sound:'kick',muted:false,layers:[]},
 {a:1,b:0,n:2,cycleBars:2,sound:'rim',muted:false,layers:[]},
 {a:1,b:0,n:3,cycleBars:3,sound:'tom',muted:false,layers:[]},
 {a:1,b:0,n:1,cycleBars:4,sound:'hat',muted:false,
  layers:[{a:-z,b:z,n:1,velocity:.65}],
  euclidean:{k:1,n:8,rotation:1,velocity:.58}}
]};
const cases=[];
const near=(a,b)=>Math.abs(a-b)<1e-6;
async function status(page){
 return page.evaluate(()=>({
  source:window.RhythmResearch.current(),
  transport:window.RhythmResearch.transport(),
  label:document.querySelector('#rootInspectionLane').textContent,
  timing:document.querySelector('#rootInspectionTime').textContent,
  coincidence:document.querySelector('#rootInspectionCoincidences').textContent,
  focused:[...document.querySelectorAll('.window-occurrence-focused')].map(dot=>({
   lane:Number(dot.dataset.lane),absoluteBars:Number(dot.dataset.absoluteBars)
  })),
  panelHidden:document.querySelector('#rootInspection').hidden,
  marks:[...document.querySelectorAll('.window-lane-events')].map(row=>({
   selected:[...row.querySelectorAll('.window-inspected')].map(dot=>Number(dot.dataset.phase)),
   all:[...row.querySelectorAll('.window-mark')].map(dot=>Number(dot.dataset.phase))
  }))
 }));
}
async function clickAt(page,lane,fraction){
 const target=page.locator('.window-lane-events').nth(lane);
 await target.scrollIntoViewIfNeeded();
 const box=await target.boundingBox();
 assert.ok(box&&box.width>20,'timeline has an interactive full-width row');
 await target.click({position:{x:Math.min(box.width-2,Math.max(2,box.width*fraction)),
  y:box.height/2}});
}
// Compare EVERY rendered coincidence against the actual absolute timeline
// position across four lanes, including non-coincidences and mute changes.
async function assertCrossLaneOutlines(page){
 const audit=await page.evaluate(()=>{
  const marks=[...document.querySelectorAll('.window-lane-events')].flatMap((row,lane)=>
   [...row.querySelectorAll('.window-mark')].map(dot=>({
    lane,at:parseFloat(dot.style.left),
    outlined:dot.classList.contains('window-cross-lane'),title:dot.title
   })));
  return marks.map(mark=>{
   const others=[...new Set(marks.filter(other=>other.lane!==mark.lane&&
    Math.abs(other.at-mark.at)<1e-6).map(other=>other.lane))];
   return {outlined:mark.outlined,shouldOutline:others.length>0,
    tooltipCorrect:others.every(lane=>mark.title.includes('Lane '+(lane+1)))};
  });
 });
 assert.ok(audit.length>0,'visible schedule contains events');
 assert.ok(audit.some(item=>item.outlined),'fixture includes a real cross-lane coincidence');
 assert.ok(audit.some(item=>!item.outlined),'single-lane moments stay unoutlined');
 assert.ok(audit.every(item=>item.outlined===item.shouldOutline&&item.tooltipCorrect),
  'every outline corresponds to equal absolute time on distinct lanes');
}
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,hasTouch:viewport.width===390});
  // Capture existing, static cross-lane Canvas halos (never moving hands).
  await page.addInitScript(()=>{
   const C=CanvasRenderingContext2D.prototype,arc=C.arc,stroke=C.stroke,clear=C.clearRect;
   C.arc=function(x,y,r,a,b,...rest){this.__inspectedArc={x,y,r};return arc.call(this,x,y,r,a,b,...rest)};
   C.clearRect=function(...args){
    if(this.canvas?.id==='orbitCanvas')window.__crossHalos=[];
    return clear.apply(this,args);
   };
   C.stroke=function(...args){
    if(this.canvas?.id==='orbitCanvas'&&this.__inspectedArc&&
     this.getLineDash().join(',')==='3,5'){
     (window.__crossHalos||(window.__crossHalos=[])).push({
      x:this.__inspectedArc.x,y:this.__inspectedArc.y,r:this.__inspectedArc.r,
      color:String(this.strokeStyle)
     });
    }
    return stroke.apply(this,args);
   };
  });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  await page.locator('#jsonFile').setInputFiles({name:'linked.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(fixture))});
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Linked root windows'));
  await page.locator('#windowPanel').evaluate(el=>el.open=true);
  await page.waitForFunction(()=>document.querySelectorAll('.window-mark').length>=10);
  const original=await status(page);
  await assertCrossLaneOutlines(page);
  assert.match(await page.locator('#windowCounts').textContent(),/Dashed outlines mark cross-lane coincidences/);
  const firstCoincidence=await page.locator('.window-lane-events').first().locator('.window-cross-lane').first().getAttribute('title');
  assert.match(firstCoincidence,/simultaneous with Lane 2, Lane 3, Lane 4/);
  await clickAt(page,0,0);
  assert.match(await page.locator('#eventInspection').textContent(),/simultaneous with Lane 2, Lane 3, Lane 4/);
  let moment=await status(page);
  assert.match(moment.timing,/selected occurrence · absolute bar 1\.000 · 0\.000 s after start/);
  assert.deepEqual(moment.focused,[{lane:0,absoluteBars:0}]);
  // Identical root one bar later has DIFFERENT cross-lane coincidences.
  // The circle must reflect that selected recurrence, not its phase-zero twin.
  await clickAt(page,0,.25);
  moment=await status(page);
  assert.match(moment.timing,/selected occurrence · absolute bar 2\.000 · 2\.000 s after start/);
  assert.equal(moment.coincidence,'Same-time mathematical events: Lane 2 · Lane 3');
  assert.deepEqual(moment.focused,[{lane:0,absoluteBars:1}]);
  assert.match(await page.locator('#eventInspection').textContent(),/simultaneous with Lane 2, Lane 3/);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal((await page.evaluate(()=>window.__crossHalos||[])).length,2,
   'Canvas counterparts correspond to the selected bar, not first occurrence');
  // Tempo changes seconds, but must not change the selected mathematical bar.
  await page.locator('#bpm').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}))});
  moment=await status(page);
  assert.match(moment.timing,/selected occurrence · absolute bar 2\.000 · 4\.000 s after start/);
  assert.deepEqual(moment.focused,[{lane:0,absoluteBars:1}]);
  await page.locator('#bpm').evaluate(el=>{el.value='120';el.dispatchEvent(new Event('input',{bubbles:true}))});
  assert.equal(original.source.tracks.length,4);
  assert.deepEqual(await page.locator('.window-axis span').allTextContents(),
   ['0','1','2','3','4 bars'],'the initial axis measures elapsed bars');
  assert.equal(original.transport.playing,false);
  const intervals=original.transport.schedulerIntervalsCreated;

  // Selecting the phase-zero complex root on a 1-bar ring highlights all
  // FOUR actual occurrences in the optional 4-bar time window.
  await page.locator('.lane[data-lane="0"] .lane-select').click();
  await page.locator('#orbitCanvas').focus();
  await page.keyboard.press('Home');
  let data=await status(page);
  assert.equal(data.panelHidden,false);
  assert.match(data.label,/Lane 1 · root 1\/4/);
  assert.deepEqual(data.marks.map(r=>r.selected.length),[4,0,0,0]);
  assert.ok(data.marks[0].selected.every(p=>near(p,0)));
  assert.deepEqual(data.focused,[],'ring inspection defaults to first occurrence, not a selected timestamp');
  assert.match(data.timing,/first occurrence/);
  await page.keyboard.press(']');
  data=await status(page);
  assert.match(data.timing,/Phase 25%/);
  assert.deepEqual(data.marks.map(r=>r.selected.length),[4,0,0,0]);
  assert.ok(data.marks[0].selected.every(p=>near(p,.25)));

  // Changing the 4-bar viewport keeps the source phase selected; no
  // absolute-clock jump or selected-root drift is allowed.
  await page.locator('#windowStart').evaluate(el=>{
   el.value='4';el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  data=await status(page);
  assert.equal(await page.locator('#windowStartText').textContent(),'5');
  assert.deepEqual(await page.locator('.window-axis span').allTextContents(),
   ['4','5','6','7','8 bars'],'grid labels show actual elapsed bars after scrolling');
  assert.deepEqual(data.marks.map(r=>r.selected.length),[4,0,0,0]);
  assert.match(data.timing,/Phase 25%/);
  await assertCrossLaneOutlines(page);

  // Timeline -> complex-root inspector: a 2-bar lane with phase 1/2
  // appears exactly twice in bars 5–8, despite four 1-bar hits above it.
  await clickAt(page,1,.25);
  data=await status(page);
  assert.match(data.label,/Lane 2 · root 2\/2/);
  assert.match(data.timing,/Phase 50%/);
  assert.deepEqual(data.marks.map(r=>r.selected.length),[0,2,0,0]);
  assert.ok(data.marks[1].selected.every(p=>near(p,.5)));
  assert.equal(await page.locator('.lane[data-lane="1"] .lane-select').getAttribute('aria-pressed'),'true');
  assert.match(await page.locator('#eventInspection').textContent(),/Lane 2 · bar 6\.000/);
  assert.match(data.timing,/selected occurrence · absolute bar 6\.000 · 10\.000 s after start/);
  assert.deepEqual(data.focused,[{lane:1,absoluteBars:5}]);
  assert.equal(data.coincidence,'Same-time mathematical events: Lane 1 · Lane 3');
  // An editor edit invalidates the previous absolute event: show the
  // canonical source's first occurrence instead of retaining a stale time.
  await page.locator('#laneBars1').fill('3');
  data=await status(page);
  assert.match(data.timing,/first occurrence/);
  assert.deepEqual(data.focused,[]);
  await page.locator('#laneBars1').fill('2');

  // A true root-family event in the 4-bar lane links by its source,
  // without mislabelling it as an ordinary base root.
  await page.locator('#windowStart').evaluate(el=>{
   el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await clickAt(page,3,.375);
  data=await status(page);
  assert.match(data.label,/Lane 4 · added root 1\/1 · family 1/);
  assert.match(data.timing,/Phase 37\.5%/);
  assert.deepEqual(data.marks.map(r=>r.selected.length),[0,0,0,1]);
  assert.ok(near(data.marks[3].selected[0],.375));

  await clickAt(page,3,.125);
  data=await status(page);
  assert.match(data.label,/Euclidean hit 1\/1/);
  assert.match(data.timing,/Phase 12\.5%/);
  assert.deepEqual(data.marks.map(r=>r.selected.length),[0,0,0,1]);

  // Muting removes actual audio scheduling marks, but not the geometric root
  // nor its inspector. Clearing selection removes only the visual outlines.
  await page.locator('#laneMute3').click();
  data=await status(page);
  assert.match(data.label,/Lane 4 · Euclidean hit 1\/1/);
  assert.equal(data.marks[3].all.length,0);
  assert.equal(data.marks[3].selected.length,0);
  await assertCrossLaneOutlines(page);
  await page.locator('#laneMute3').click();
  data=await status(page);
  assert.equal(data.marks[3].selected.length,1);
  await assertCrossLaneOutlines(page);
  await page.locator('#clearRootInspection').click();
  data=await status(page);
  assert.equal(data.panelHidden,true);
  assert.equal(data.marks.flatMap(r=>r.selected).length,0);
  assert.deepEqual(data.focused,[]);

  assert.equal(data.transport.schedulerIntervalsCreated,intervals,
   'source selection never starts the audio clock or duplicate schedulers');
  assert.deepEqual(data.source.tracks,original.source.tracks,
   'root and timeline navigation never edits the four complex generators');
  assert.deepEqual(errors,[],'no browser errors');
  await page.screenshot({path:'artifacts/root-window-link/'+viewport.width+'.png',fullPage:true});
  cases.push({viewport,crossLaneOutlines:true,selectedAbsoluteOccurrence:true,
   canvasCoincidenceSource:true,tempoRecalculation:true,staleSelectionFallback:true,
   linkedRecurrences:true,linkedAddedAndEuclidean:true,mutedSafe:true,
   unchangedScheduler:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/root-window-link/report.json',
  JSON.stringify({status:'PASS',cases,source:'real Chromium Canvas inspector and DOM event marks'},null,2));
 console.log('PASS linked four-bar time and exact cross-lane coincidence outlines, source provenance, mute and scheduler isolation on desktop and phone');
}finally{await browser.close();}
