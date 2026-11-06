import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:[
 '--no-sandbox','--autoplay-policy=no-user-gesture-required'
]});
fs.mkdirSync('artifacts/sound-lab',{recursive:true});
const results=[];
try{
 for(const [width,height] of [[1440,900],[390,844]])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  const panel=page.locator('#advancedSoundDetails');
  assert.equal(await panel.evaluate(el=>el.open),false,'Sound Lab must start collapsed');
  assert.ok(await page.locator('#soundWaveCanvas').isHidden(),'no prominent waveform in the mathematical workspace');
  assert.equal(await page.locator('.sound-lab-section').count(),1,'exactly one optional bottom Sound Lab');
  assert.ok(await page.locator('.sound-lab-section').evaluate(el=>{
   const main=document.querySelector('main'),footer=document.querySelector('footer');
   return main.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING
     &&el.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING;
  }),'the inspector comes after main and before footer');

  await page.locator('#laneSound0').selectOption('acidClassic');
  await panel.locator('summary').click();
  await page.locator('#patchOsc').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#soundWaveStatus').textContent.startsWith('Synthesized'));
  const info=await page.locator('#soundWaveStatus').textContent();
  assert.match(info,/0.65 s/);
  const baseline=await page.locator('#soundWaveCanvas').evaluate(canvas=>canvas.toDataURL());
  assert.ok(baseline.length>800,'real offline waveform populates pixels');
  assert.equal(await page.locator('#soundLabLane').inputValue(),'0');
  assert.equal(await page.locator('#soundLabLane option').count(),4);
  assert.ok((await page.locator('#soundLabLane option').allTextContents())[0].includes('Classic 303 Acid'),
   'instrument picker displays actual current lane voice');

  // The lab instrument is independent of the selected mathematical ring.
  await page.locator('.lane[data-lane="2"] .lane-select').click();
  assert.equal(await page.locator('.lane.selected').getAttribute('data-lane'),'2');
  assert.equal(await page.locator('#soundLabLane').inputValue(),'0');

  await page.locator('#patchOsc').selectOption('square');
  await page.waitForFunction(()=>document.querySelector('#soundWaveStatus').textContent.startsWith('Synthesized'));
  await page.waitForTimeout(180);
  const changed=await page.locator('#soundWaveCanvas').evaluate(canvas=>canvas.toDataURL());
  assert.notEqual(changed,baseline,'oscillator waveform control changes actual rendered waveform pixels');
  assert.equal(await page.evaluate(()=>window.RhythmResearch.current().tracks[0].patch.osc),'square');
  assert.equal(await page.locator('#soundLabReset').isEnabled(),true);

  await page.locator('#laneSound1').selectOption('hat');
  const selectedBefore=await page.locator('.lane.selected').getAttribute('data-lane');
  await page.locator('#soundLabLane').selectOption('1');
  await page.waitForFunction(()=>document.querySelector('#soundWaveStatus').textContent.startsWith('Recorded sample'),null,{timeout:15000});
  assert.equal(await page.locator('#soundLabLane').inputValue(),'1');
  assert.ok(await page.locator('#patchOsc').isHidden(),
   'sample instrument shows the recording, not meaningless oscillator editing');
  assert.ok(await page.locator('#soundLabPreview').isVisible());
  assert.equal(await page.locator('.lane.selected').getAttribute('data-lane'),selectedBefore,
   'choosing a lab instrument does not select or alter the mathematical lane');
  assert.ok((await page.locator('#soundWaveCanvas').evaluate(canvas=>canvas.toDataURL())).length>800);

  const beforePreview=await page.evaluate(()=>window.RhythmResearch.current());
  const beforeTransport=await page.evaluate(()=>window.RhythmResearch.transport());
  await page.locator('#soundLabPreview').click();
  assert.deepEqual(await page.evaluate(()=>window.RhythmResearch.current()),beforePreview,
   'preview must never modify any mathematical coordinate, volume or root event');
  const afterTransport=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(afterTransport.activePresetId,beforeTransport.activePresetId);
  assert.equal(afterTransport.schedulerIntervalsCreated,beforeTransport.schedulerIntervalsCreated,
   'one-shot preview does not create a recurring transport scheduler');

  await page.locator('#soundLabLane').selectOption('0');
  await page.locator('#patchOsc').waitFor({state:'visible'});
  await page.locator('#soundLabReset').click();
  assert.equal(await page.evaluate(()=>window.RhythmResearch.current().tracks[0].patch),null,
   'Reset clears only the selected lane patch');
  assert.equal(await page.locator('#patchOsc').inputValue(),'sawtooth',
   'reset restores the original synthetic waveform');

  const widthAudit=await page.evaluate(()=>({
   scroll:document.documentElement.scrollWidth,viewport:window.innerWidth,
   canvas:document.querySelector('#soundWaveCanvas').getBoundingClientRect().width
  }));
  assert.ok(widthAudit.scroll<=widthAudit.viewport+2,
   'expanded Sound Lab must not add page-wide horizontal scrollbar: '+JSON.stringify(widthAudit));
  await panel.locator('summary').click();
  assert.equal(await panel.evaluate(el=>el.open),false);
  assert.ok(await page.locator('#soundWaveCanvas').isHidden(),
   'a single summary interaction closes all waveform and editing controls');
  assert.deepEqual(errors,[],'no uncaught browser exceptions');
  results.push({width,height,theme,synth:true,sample:true,patchReset:true,
   independentLane:true,previewWithoutScheduler:true});
  await page.screenshot({path:'artifacts/sound-lab/'+width+'-'+theme+'.png',fullPage:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/sound-lab/measurements.json',JSON.stringify({
  status:'PASS',scope:'Bottom collapsed waveform lab, real OfflineAudioContext synth visualization, local sample waveform, patch changes, reset, instrument choice, responsive appearance; human listening not measured',results
 },null,2));
 console.log('PASS: bottom Sound Lab, 4 viewport/theme cases, independent instrument selection, actual synth and sample waveforms, no extra schedulers');
}finally{await browser.close()}
