import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
fs.mkdirSync('artifacts',{recursive:true});
const report=[];
try {
 for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  const composition=page.locator('#compositionPanel');
  await composition.evaluate(el=>el.open=true);
  assert.match(await composition.locator(':scope > summary').textContent(),/Combine root points/);
  assert.equal(await page.locator('#advancedMathDetails').evaluate(el=>el.open),false,
   'intersection and Euclidean options are secondary, not required for union');
  assert.ok(await page.locator('#addLayer').isVisible(),'primary add-point action is immediately available');
  assert.ok(await page.locator('#addRootFamily').isVisible(),'primary add-root-set action is immediately available');

  const fixture={
   format:'roots-rhythm/1',name:'Union-first sparse study',bpm:120,bars:1,
   tracks:['kick','snare','hat','bass'].map(sound=>({
    a:1,b:0,n:1,sound,cycleBars:1,muted:false,layers:[],operation:'union'
   }))
  };
  const load=async project=>{
   await page.locator('#jsonFile').setInputFiles({
    name:'union-study.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify(project))
   });
   await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),
    project.name);
  };
  await load(fixture);
  assert.ok(await page.locator('#figureTools').isHidden(),
   'sparse mathematical root sets should not show a purposeless zoom control');
  await page.locator('#trackN0').fill('4');
  await page.locator('#addRootFamily').click();
  assert.equal(await page.locator('#baseCount').textContent(),'4','four base root locations');
  assert.equal(await page.locator('#addedCount').textContent(),'3','three additional root locations');
  assert.equal(await page.locator('#unionCount').textContent(),'6','4 ∪ 3 yields six distinct points');
  assert.equal(await page.locator('#unionStrip .overlap').count(),1,'one coincident root at phase 0');
  await page.locator('#addLayer').click();
  assert.equal(await page.locator('#unionCount').textContent(),'7',
   'adding another single point extends the union');
  await page.locator('#layer1AngleDeg').fill('90');
  assert.equal(await page.locator('#unionCount').textContent(),'6',
   'a newly added point at 90° coincides with an existing base root and sounds once');
  const model=await page.evaluate(()=>{
   const r=window.RhythmResearch,t=r.current().tracks[0],e=r.eventMetadata(t);
   return {operation:t.operation,layers:t.layers.length,events:e.length,
    shared:e.filter(x=>x.sources.length>1).map(x=>x.phase)};
  });
  assert.equal(model.operation,'union');
  assert.equal(model.layers,2,'multiple independently editable added sets remain supported');
  assert.equal(model.events,6,'union event count and actual lane scheduler agree');
  assert.ok(model.shared.some(x=>Math.abs(x-.25)<1e-7),
   'merged source provenance is preserved at the coincident added point');

  await page.locator('#advancedMathDetails').evaluate(el=>el.open=true);
  await page.locator('#extraLayers .layer-remove').last().click();
  await page.locator('#setOperation').selectOption('intersection');
  assert.equal(await page.locator('#unionCount').textContent(),'1',
   'previous intersection workflow remains accessible for mathematical exploration');
  await page.locator('#setOperation').selectOption('union');
  assert.equal(await page.locator('#unionCount').textContent(),'6','union result is restored');

  await page.locator('#laneSound0').selectOption('acidClassic');
  assert.ok(await page.locator('#laneGain').isVisible(),
   'lane volume is always available without editing oscillator/filter settings');
  assert.ok(await page.locator('#previewBtn').isVisible(),
   'instrument preview remains available outside advanced settings');
  assert.ok(await page.locator('#advancedSoundDetails').isVisible(),
   'a synthesized voice offers advanced sound settings');
  assert.equal(await page.locator('#advancedSoundDetails').evaluate(el=>el.open),false,
   'technical synth controls are collapsed by default');
  assert.ok(await page.locator('#patchOsc').isHidden(),'oscillator is hidden until requested');
  await page.locator('#advancedSoundDetails').evaluate(el=>el.open=true);
  await page.locator('#patchOsc').waitFor({state:'visible'});
  assert.ok(await page.locator('#soundWaveCanvas').isVisible(),
   'a bottom Sound Lab waveform is available after one expansion');
  await page.locator('#patchcutoff').evaluate(el=>{
   el.value='5400';
   el.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await page.evaluate(()=>window.RhythmResearch.current().tracks[0].patch.cutoff),5400,
   'advanced sound parameter still edits real voice settings');

  const sample=await page.evaluate(()=>{
   const defs=window.RhythmVoices.definitions;
   return [...document.querySelector('#laneSound0').options].map(o=>o.value)
    .find(name=>!Object.prototype.hasOwnProperty.call(defs,name));
  });
  assert.ok(sample,'a sample-backed instrument should be available');
  await page.locator('#laneSound0').selectOption(sample);
  assert.ok(await page.locator('#advancedSoundDetails').isVisible(),
   'Sound Lab stays accessible for recorded samples');
  assert.ok(await page.locator('#patchOsc').isHidden(),
   'sample-backed voices hide synthesized waveform controls');
  assert.ok(await page.locator('#laneGain').isVisible(),'sampled voices retain lane volume');

  const dense=structuredClone(fixture);dense.name='Dense fourth ring';
  dense.tracks[3].n=64;
  await load(dense);
  assert.ok(await page.locator('#figureTools').isVisible(),
   'dense roots make the contextual zoom control available');
  assert.match(await page.locator('#zoomBtn').textContent(),/Magnify dense roots/);
  await page.locator('#zoomBtn').click();
  await page.waitForFunction(()=>document.querySelector('#plotArea').classList.contains('focused'));
  assert.ok(await page.locator('#zoomBtn').isVisible(),
   'fit button remains accessible while enlarged');
  await page.locator('#zoomBtn').click();
  assert.equal(await page.locator('#zoomBtn').getAttribute('aria-pressed'),'false');
  await load(fixture);
  await page.waitForTimeout(30);
  assert.ok(await page.locator('#figureTools').isHidden(),
   'unrelated sparse study removes the now-unused magnification toolbar');
  assert.deepEqual(errors,[],'no runtime errors');
  report.push({viewport,union:model,sampleVoice:sample,
   advancedSoundAccessible:true,conditionalZoom:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/union-first-ui.json',JSON.stringify({
  status:'PASS',scope:'Desktop and mobile union-of-points workflows, hidden technical sound panel and contextual dense-root zoom',
  report
 },null,2));
 console.log('PASS: desktop/mobile union construction, coincident points, advanced sound disclosure and contextual zoom');
} finally {await browser.close()}
