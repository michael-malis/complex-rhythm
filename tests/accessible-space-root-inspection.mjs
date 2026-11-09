import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// ACCESS-01 engineering safeguard, NOT a physical screen-reader acceptance.
// A role=button root control owns Space; the global playback shortcut must not
// hijack it. Check real focus, real key events and AudioContext transport state.
fs.mkdirSync('artifacts/accessible-space',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const report=[];
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:900},
   hasTouch:width===390,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  const transport=()=>page.locator('#playBtn').getAttribute('aria-pressed');
  assert.equal(await transport(),'false');
  const canvas=page.locator('#orbitCanvas');
  assert.equal(await canvas.getAttribute('role'),'group',
   'keyboard-operable plot must be exposed as a group, not passive image');
  assert.ok((await canvas.getAttribute('aria-label')).includes('number keys 1 through 4'));
  await canvas.focus();
  await page.keyboard.press('Space');
  assert.equal(await transport(),'false',
   'Space on focused Canvas must not toggle the transport');
  await page.locator('#compositionPanel > summary').click();
  const union=page.locator('#unionStrip');
  await union.focus();
  assert.equal(await union.getAttribute('role'),'button');
  await page.keyboard.press('Space');
  const inspected=await page.locator('#rootInspection').isVisible();
  assert.equal(inspected,true,'Space activates keyboard-selected canonical root');
  assert.match(await page.locator('#rootInspectionAnnouncement').textContent(),/Angle .* degrees/,
   'selected real root is announced in the accessible live region');
  assert.equal(await transport(),'false',
   'Space selecting a union root must not start audio');
  await page.locator('#windowPanel summary').click();
  const lane=page.locator('#windowTimeline .window-lane-events').first();
  assert.equal(await lane.getAttribute('role'),'button');
  await lane.focus();
  await page.keyboard.press('Space');
  assert.match(await page.locator('#eventInspection').textContent(),/Lane 1 · bar/,
   'Space activates a real timeline root');
  assert.match(await lane.getAttribute('aria-label'),/Inspect lane 1, event 1 of/,
   'timeline event position is exposed to screen readers');
  assert.equal(await transport(),'false',
   'Space selecting a timeline event must not start or pause playback');
  await page.keyboard.press('ArrowRight');
  assert.match(await lane.getAttribute('aria-label'),/Inspect lane 1, event 2 of/,
   'keyboard timeline browsing remains functional');
  assert.equal(await transport(),'false');
  // The global Space-to-Play shortcut still works from noninteractive page text.
  await page.evaluate(()=>document.activeElement?.blur());
  await page.keyboard.press('Space');
  assert.equal(await transport(),'true',
   'global transport shortcut is preserved outside interactive controls');
  await page.keyboard.press('Space');
  await page.waitForFunction(()=>document.querySelector('#playBtn')?.getAttribute('aria-pressed')==='false');
  assert.deepEqual(errors,[],'no runtime exceptions during keyboard interaction');
  report.push({width,canvasRole:'group',unionSpace:'root selected',
   timelineSpace:'root selected',unexpectedTransportChanges:0,globalSpace:'works'});
  await page.close();
 }
 fs.writeFileSync('artifacts/accessible-space/report.json',JSON.stringify({
  status:'PASS',scope:'real browser keyboard propagation and semantic roles, not real device or screen-reader verification',report
 },null,2));
 console.log('PASS keyboard Space performs root inspection at 390px and 1440px without hijacking audio; global shortcut preserved');
}finally{await browser.close()}
