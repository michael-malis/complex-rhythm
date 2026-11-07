import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const voices=['bass','reese','acid','surdo','agogo','tamborim'];
const browser=await chromium.launch({headless:true,args:[
 '--no-sandbox','--autoplay-policy=no-user-gesture-required'
]});
fs.mkdirSync('artifacts/native-waveforms',{recursive:true});
const results=[];
try{
 for(const [width,height] of [[1440,900],[390,844]])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#advancedSoundDetails summary').click();
  const base=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
  const phasesBefore=await page.evaluate(()=>window.RhythmResearch.events(window.RhythmResearch.current().tracks[0]).map(e=>e.phase));
  const rendered=new Map();
  for(const voice of voices){
   await page.locator('#laneSound0').selectOption(voice);
   await page.waitForFunction(()=>document.querySelector('#soundWaveStatus').textContent.startsWith('Synthesized fallback'));
   assert.ok(await page.locator('#soundWaveCanvas').isVisible(),'waveform visible for '+voice);
   assert.ok(await page.locator('#patchOsc').isHidden(),
    'unrecorded native fallback is inspected read-only (no unsupported patch parameters): '+voice);
   const status=await page.locator('#soundWaveStatus').textContent();
   const peak=Number(status.match(/peak (\d+(?:\.\d+)?)/)?.[1]);
   assert.ok(Number.isFinite(peak)&&peak>.005&&peak<3,
    'a real audible and bounded Web Audio waveform exists: '+voice+' status '+status);
   const png=await page.locator('#soundWaveCanvas').evaluate(el=>el.toDataURL());
   assert.ok(png.length>800,'drawn waveform contains nonempty canvas image: '+voice);
   assert.ok(![...rendered.values()].some(w=>w===png),'waveforms must be distinct: '+voice);
   rendered.set(voice,png);
   const phasesAfter=await page.evaluate(()=>window.RhythmResearch.events(window.RhythmResearch.current().tracks[0]).map(e=>e.phase));
   assert.deepEqual(phasesAfter,phasesBefore,'changing sound should never alter complex-root event phases: '+voice);
  }
  const expected=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(expected.timerActive,false,'inspector never schedules repeating audio');
  await page.locator('#soundLabPreview').click();
  const after=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(after.schedulerIntervalsCreated,expected.schedulerIntervalsCreated,
   'one-shot native percussion preview never starts a separate scheduler');
  assert.equal(after.activePresetId,expected.activePresetId);
  assert.deepEqual(errors,[],'no browser exceptions across six native synthesis waveforms');
  results.push({width,height,theme,voices:[...rendered.keys()],originalRootDegree:base.n,
   previewsBounded:true,noScheduler:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/native-waveforms/report.json',JSON.stringify({
  status:'PASS',scope:'All six legacy synthesized instrument waveforms from shared live/OfflineAudioContext graphs; 4 viewport/theme cases; no invented recordings or root mutations',results
 },null,2)+'\n');
 console.log('PASS native synthesis waveforms: 6 voices × 4 responsive/theme states with actual shared audio graphs');
}finally{await browser.close()}
