import {chromium} from './helpers/lab-tabs.mjs';
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
  await page.goto('http://127.0.0.1:8767/#lab',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#presetSelect').isVisible(),true,
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
 // Every preset and category label fits its closed picker: nothing is cut with
 // "…" on a 360px phone, a tablet, or the narrowest Lab and Play frames.
 const fit=[];
 for(const [width,height,view] of [[360,640,'play'],[390,844,'lab'],[768,1024,'play'],[1080,720,'lab'],[1080,720,'play'],[1280,720,'lab'],[1440,900,'lab']]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8767/'+(view==='lab'?'#lab':''),{waitUntil:'load'});
  const cut=await page.evaluate(async()=>{
   await document.fonts.ready;
   const room=select=>{const css=getComputedStyle(select),ctx=document.createElement('canvas').getContext('2d');
    ctx.font=css.fontWeight+' '+css.fontSize+' '+css.fontFamily;
    // native select: padding on both sides plus the drop-down arrow
    return {ctx,avail:select.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight)-(css.appearance==='none'?0:16)}};
   const category=document.getElementById('categorySelect'),preset=document.getElementById('presetSelect'),out=[];
   const c=room(category);
   for(const option of category.options)if(c.ctx.measureText(option.textContent).width>c.avail)out.push('category '+option.textContent);
   for(const value of [...category.options].map(o=>o.value)){
    category.value=value;category.dispatchEvent(new Event('change',{bubbles:true}));
    await new Promise(resolve=>requestAnimationFrame(resolve));
    const p=room(preset);
    for(const option of preset.options)if(p.ctx.measureText(option.textContent).width>p.avail)
     out.push(value+': '+option.textContent+' ('+Math.round(p.ctx.measureText(option.textContent).width)+' > '+Math.round(p.avail)+')');
   }
   return out;
  });
  assert.deepEqual(cut,[],'picker labels fit without truncation at '+width+'x'+height+' '+view);
  fit.push({width,height,view,truncated:cut.length});
  await page.close();
 }
 results.push({labelFit:fit});
 fs.writeFileSync('artifacts/preset-category-navigation.json',JSON.stringify({results},null,2));
 console.log('PASS category browser: expanded by default, no silent switching, explicit selection in desktop/mobile live audio');
}finally {await browser.close()}
