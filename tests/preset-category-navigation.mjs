import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
fs.mkdirSync('artifacts',{recursive:true});
const results=[];
try {
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#presetDetails').evaluate(el=>el.open),true,
   'rhythm examples must be expanded by default on every viewport');
  assert.equal(await page.locator('#presetSelect').inputValue(),'afro','initial study remains selected');
  const before=await page.evaluate(()=>({
   current:window.RhythmResearch.current(),
   id:window.RhythmResearch.transport().activePresetId
  }));
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  const active=await page.evaluate(()=>window.RhythmResearch.transport());
  for(const category of ['bunker','acid','hardcore','poly','brazil']){
   await page.locator('#categorySelect').selectOption(category);
   const after=await page.evaluate(()=>({
    current:window.RhythmResearch.current(),
    transport:window.RhythmResearch.transport()
   }));
   assert.deepEqual(after.current,before.current,'category browsing must not mutate mathematical/audio state: '+category);
   assert.equal(after.transport.activePresetId,before.id,'category browsing must not load an example: '+category);
   assert.equal(after.transport.schedulerIntervalsCreated,active.schedulerIntervalsCreated,
    'category browsing must not restart sequencer: '+category);
   assert.equal(after.transport.schedulerIntervalsCleared,active.schedulerIntervalsCleared,
    'category browsing must not cancel sequencer: '+category);
   assert.ok(after.transport.playing,'audio remains active across browsing: '+category);
   if(category==='poly'){
    assert.equal(await page.locator('#presetSelect').inputValue(),'afro',
     'returning to original category restores actual selection');
   }else{
    assert.equal(await page.locator('#presetSelect').inputValue(),'__browse__',
     'other category shows explicit selection placeholder');
    assert.ok((await page.locator('#presetInfo').textContent()).includes('Currently loaded:'),
     'browser shows which rhythm is still loaded');
   }
  }
  await page.locator('#categorySelect').selectOption('acid');
  const acid=await page.locator('#presetSelect option:not([disabled])').first().getAttribute('value');
  assert.ok(acid&&!acid.startsWith('__'),'selected example belongs to the browsed category');
  await page.locator('#presetSelect').selectOption(acid);
  const chosen=await page.evaluate(()=>({
   current:window.RhythmResearch.current(),
   state:window.RhythmResearch.transport()
  }));
  assert.equal(chosen.state.activePresetId,acid,'explicit selection loads the chosen example');
  assert.ok(chosen.state.playing,'explicit selection keeps audio transport running');
  assert.notDeepEqual(chosen.current,before.current,'chosen example replaces previous rhythm parameters');
  assert.equal(await page.locator('#presetSelect').inputValue(),acid,
   'loaded category and select stay synchronized');
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
  assert.deepEqual(errors,[],'no browser errors');
  results.push({viewport,initial:before.id,loaded:acid,categoriesBrowsed:5,passed:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/preset-category-navigation.json',JSON.stringify({results},null,2));
 console.log('PASS category browser: expanded by default, no silent switching, explicit selection in desktop/mobile live audio');
}finally {await browser.close()}
