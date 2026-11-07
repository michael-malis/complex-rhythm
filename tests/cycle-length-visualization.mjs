import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts/cycle-length-visualization',{recursive:true});
const browser=await chromium.launch({headless:true,args:[
 '--no-sandbox','--autoplay-policy=no-user-gesture-required'
]});
const cases=[];
const near=(a,b,delta=.00001)=>Math.abs(a-b)<delta;
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport,reducedMotion:'reduce',acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  assert.equal(await page.locator('.lane-length select').count(),4,
   'each of the four instruments has an explicit loop length selector');
  assert.equal(await page.locator('.lane-length input').count(),0,
   'unexplained bare cycle-length numeric entry has been replaced');
  for(let i=0;i<4;i++){
   const input=page.locator('#laneBars'+i);
   assert.equal(await input.locator('option').count(),16);
   assert.equal(await input.inputValue(),'1');
   assert.match(await input.getAttribute('aria-label'),/loop length in bars/);
  }
  assert.equal(await page.locator('#cycleGuideLanes .cycle-guide-lane').count(),4);
  assert.match(await page.locator('#cycleGuideHint').textContent(),/one full circle takes 1 bar/);
  assert.match(await page.locator('.cycle-guide-heading').textContent(),/Colored ticks = bar starts/);

  await page.locator('#windowPanel').evaluate(el=>el.open=true);
  await page.waitForFunction(()=>document.querySelectorAll('.window-count').length===4);
  const before=await page.evaluate(()=>window.RhythmResearch.cycleGeometry());
  assert.deepEqual(before.map(t=>t.barBoundaries),[[0],[0],[0],[0]]);
  const initialCounts=await page.locator('.window-count').allTextContents();
  assert.equal(initialCounts[0],'12 hits','3 root hits per bar across 4 bars');
  const initialPng=await page.locator('#orbitCanvas').evaluate(c=>c.toDataURL());

  await page.locator('#laneBars0').selectOption('4');
  await page.waitForTimeout(100);
  const after=await page.evaluate(()=>window.RhythmResearch.cycleGeometry());
  assert.equal(after[0].cycleBars,4);
  assert.deepEqual(after[0].barBoundaries,[0,.25,.5,.75],
   'bar separator positions exactly divide the root cycle into four');
  assert.deepEqual(after[0].events,before[0].events,
   'root phases are NOT shifted, duplicated or changed by loop duration');
  assert.ok(near(after[0].fullTurnSeconds,4*after[0].barSeconds));
  assert.equal(await page.locator('.window-count').first().textContent(),'3 hits',
   'three normalized root events now span all four bars, not each bar');
  assert.ok((await page.locator('#laneCycleExplanation0').textContent()).includes('16 beats'));
  assert.ok((await page.locator('#cycleGuideLanes .cycle-guide-lane').first().textContent()).includes('4 bars'));
  assert.notEqual(await page.locator('#orbitCanvas').evaluate(c=>c.toDataURL()),initialPng,
   'canvas must visibly change when bar boundaries increase');

  await page.locator('#laneBars1').selectOption('3');
  assert.equal(await page.locator('#commonCycle').textContent(),'Common period: 12 bars');
  assert.equal(await page.locator('#windowStart').getAttribute('max'),'8',
   'actual LCM navigation covers the twelve-bar combined loop');
  const geometry=await page.evaluate(()=>window.RhythmResearch.cycleGeometry());
  assert.deepEqual(geometry[1].barBoundaries,[0,1/3,2/3]);
  assert.equal(geometry[1].events.length,before[1].events.length);
  assert.ok((await page.locator('#cycleGuideLanes').textContent()).includes('3 bars'));

  // Selecting a ring does not change its underlying loop; selection changes
  // only the explanation and the higher-contrast divider strokes.
  await page.locator('.lane[data-lane="1"] .lane-select').click();
  assert.match(await page.locator('#cycleGuideHint').textContent(),/Lane 2: one full circle takes 3 bars/);
  assert.equal(await page.locator('#laneBars1').inputValue(),'3');

  // Playback uses the same lane cycles, no second timer or duplicated root.
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  const runBefore=await page.evaluate(()=>window.RhythmResearch.transport());
  await page.locator('#laneBars0').selectOption('2');
  const running=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(running.schedulerIntervalsCreated-running.schedulerIntervalsCleared,1);
  assert.equal(running.schedulerIntervalsCreated,runBefore.schedulerIntervalsCreated,
   'editing a loop does not add transport scheduling intervals');
  assert.equal(await page.locator('#commonCycle').textContent(),'Common period: 6 bars');
  const live=await page.evaluate(()=>window.RhythmResearch.cycleGeometry());
  assert.deepEqual(live[0].barBoundaries,[0,.5]);
  assert.deepEqual(live[0].events,before[0].events);
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);

  // All 16 permitted values stay accessible; the visualization and guide
  // cannot silently truncate their cycle counts at four bars.
  await page.locator('#laneBars2').selectOption('16');
  assert.equal((await page.evaluate(()=>window.RhythmResearch.cycleGeometry()))[2].barBoundaries.length,16);
  assert.match(await page.locator('#laneCycleExplanation2').textContent(),/64 beats/);

  const overflow=await page.evaluate(()=>({
   viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,
   guideWidth:document.querySelector('#cycleGuide').getBoundingClientRect().width
  }));
  assert.ok(overflow.pageWidth<=overflow.viewport+2,
   'cycle-length guide must not introduce horizontal overflow '+JSON.stringify(overflow));
  assert.deepEqual(errors,[],'no unhandled browser exceptions in cycle timing edits');

  await page.screenshot({path:'artifacts/cycle-length-visualization/'+viewport.width+'-'+theme+'.png',fullPage:true});
  cases.push({width:viewport.width,height:viewport.height,theme,
   phasesPreserved:true,loopSelectors:4,barMarks:16,
   commonPeriodVerified:12,playingEditNoTimerLeak:true,
   noOverflow:true,errors:errors.length});
  await page.close();
 }
 fs.writeFileSync('artifacts/cycle-length-visualization/report.json',JSON.stringify({
  status:'PASS',cases,
  scope:'Full ring = full lane loop; actual canonical root phase preservation, bar divider phases, 1-16 bar controls, LCM, four-bar event timeline, Web Audio scheduler, responsive no-scrollbar geometry and screenshots'
 },null,2)+'\n');
 console.log('PASS cycle length visualization: four size/theme states, 1-16 bar geometry and real timing without root shifts');
}finally{await browser.close()}
