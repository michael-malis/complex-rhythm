import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts/production-grooves',{recursive:true});
const results=[];
try{
 for(const [width,height] of [[1440,900],[390,844]]){
  for(const theme of ['light','dark']){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
   if(theme==='dark')await page.locator('#themeBtn').click();
   for(let lane=0;lane<4;lane++){
    const slider=page.locator('#laneGain'+lane);
    assert.ok(await slider.isVisible(),'volume is visible without advanced panels in lane '+lane);
    assert.ok((await slider.boundingBox()).height>=44,'instrument gain has usable touch target');
    assert.match(await slider.getAttribute('aria-label'),/Instrument volume/);
   }
   assert.equal(await page.locator('.preset-controls select').count(),2,
     'one Category and one Preset selector, no other preset-level menus');
   assert.equal(await page.locator('#collectionSelect').count(),0);
   assert.equal(await page.locator('#ratioSelect').count(),0);
   const identity=await page.evaluate(()=>window.RhythmResearch.transport().activePresetId);
   const initial=await page.evaluate(()=>window.RhythmResearch.current());
   const allIds=new Set();
   const categories=await page.locator('#categorySelect option').evaluateAll(items=>items.map(i=>i.value));
   assert.equal(categories.length,12,'eleven direct source categories plus curated Featured Grooves');
   for(const category of categories.filter(c=>c!=='grooves')){
    await page.locator('#categorySelect').selectOption(category);
    const ids=await page.locator('#presetSelect option').evaluateAll(items=>
     items.filter(i=>!i.disabled&&!i.value.startsWith('__')).map(i=>i.value));
    assert.ok(ids.length,'all categories contain real rhythm presets: '+category);
    for(const id of ids){
     assert.ok(!allIds.has(id),'source categories must not duplicate a preset: '+id);
     allIds.add(id);
    }
    assert.equal(await page.evaluate(()=>window.RhythmResearch.transport().activePresetId),identity,
      'changing category must not load a preset: '+category);
    assert.deepEqual(await page.evaluate(()=>window.RhythmResearch.current()),initial,
      'changing category must not modify roots or audio: '+category);
   }
   assert.equal(allIds.size,51,'the full 51-preset catalog remains visible via a single Category selector');
   await page.locator('#categorySelect').selectOption('acid');
   assert.ok(await page.locator('#presetSelect option[value="acid-303"]').count(),
     'Acid is a direct Category, not hidden in another dropdown');
   await page.locator('#categorySelect').selectOption('grooves');
   const options=await page.locator('#presetSelect option').evaluateAll(items=>
    items.filter(i=>i.value!=='__browse__').map(i=>({value:i.value,text:i.textContent})));
   assert.equal(options.length,6,'Featured Grooves has six curated choices');
   assert.ok(options.every(v=>/^0[1-6] · /.test(v.text)));
   assert.equal(await page.evaluate(()=>window.RhythmResearch.transport().activePresetId),identity,
    'filtering Featured Grooves never loads music');
   await page.locator('#presetSelect').selectOption('berlin-bass-wall');
   assert.equal(await page.locator('#categorySelect').inputValue(),'grooves',
    'an explicit Featured preset keeps the current category');
   const loaded=await page.evaluate(()=>window.RhythmResearch.current());
   assert.equal(loaded.tracks[0].n,4,'Bass Wall must retain every-quarter kick');
   assert.equal(loaded.tracks[1].sound,'berlinrumble','Bass Wall requires a separate rumble voice');
   const otherGain=loaded.tracks[1].gain;
   await page.locator('#laneGain0').evaluate(el=>{el.value='73';el.dispatchEvent(new Event('input',{bubbles:true}))});
   const after=await page.evaluate(()=>window.RhythmResearch.current());
   assert.ok(Math.abs(after.tracks[0].gain-.73)<1e-8,'primary slider changes actual voice gain');
   assert.equal(after.tracks[1].gain,otherGain,'volume of another lane is unchanged');
   await page.locator('#compositionPanel').evaluate(el=>{el.open=true});
   assert.equal(Number(await page.locator('#laneGain').inputValue()),.73,
     'secondary selected-lane gain mirrors primary slider');
   await page.locator('#laneGain').evaluate(el=>{el.value='.64';el.dispatchEvent(new Event('input',{bubbles:true}))});
   assert.equal(Number(await page.locator('#laneGain0').inputValue()),64,
     'secondary and primary gain controls stay synchronized');
   await page.locator('#laneSound0').selectOption('bongoLow');
   assert.equal((await page.evaluate(()=>window.RhythmResearch.samplePlan())).keys.includes('bongo'),true,
     'low acoustic bongo resolves to actual bongo sample');
   await page.locator('#laneSound0').selectOption('bongoHigh');
   assert.equal((await page.evaluate(()=>window.RhythmResearch.samplePlan())).keys.includes('bongo'),true,
     'high acoustic bongo resolves to actual bongo sample');
   const fixture={format:'roots-rhythm/1',name:'Numeric root union UI',
    bpm:120,bars:1,tracks:[
     {a:1,b:0,n:4,sound:'bongoLow',cycleBars:1,layers:[{a:.5,b:Math.sqrt(3)/2,n:1,velocity:.7}]},
     {a:1,b:0,n:3,sound:'bongoHigh',cycleBars:1,layers:[]},
     {a:1,b:0,n:8,sound:'hat',cycleBars:1,layers:[]},
     {a:1,b:0,n:2,sound:'kick',cycleBars:1,layers:[]}
    ]};
   await page.locator('#jsonFile').setInputFiles({
    name:'numeric-union.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
   });
   await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Numeric root union UI'));
   const view=await page.evaluate(()=>{
    const lane=document.querySelector('#laneEq0');
    return {
     latex:[...lane.querySelectorAll('annotation')].map(x=>x.textContent),
     mathML:lane.querySelectorAll('math').length,
     terms:lane.querySelectorAll('.lane-math-term').length,
     equationOverflow:getComputedStyle(lane).overflowX,
     ruleOverflow:['rootRuleEquation','rootRuleValues','rootRuleSpacing']
      .map(id=>getComputedStyle(document.getElementById(id)).overflowX),
     rootOverflow:document.querySelector('#rootRuleEquation .katex-html')?.scrollWidth-
      document.querySelector('#rootRuleEquation').clientWidth,
     pageOverrun:document.documentElement.scrollWidth-innerWidth,
     katexErrors:document.querySelectorAll('.katex-error').length
    };
   });
   assert.equal(view.terms,2,'base and added nth-root families are separate wrap-safe terms');
   assert.equal(view.mathML,2,'both coordinate roots remain accessible MathML');
   assert.ok(view.latex[1].includes('0.5')&&view.latex[1].includes('0.866'),
     'added point is printed as its numeric a+bi value, not opaque u1: '+JSON.stringify(view.latex));
   assert.ok(view.latex.every(x=>!/u_\{|\\varphi/.test(x)),
     'no opaque symbolic name for added numeric root');
   assert.equal(view.equationOverflow,'visible','no scrollable formula within lane card');
   assert.ok(view.ruleOverflow.every(x=>x==='visible'),'root-placement card has no scrollbars');
   assert.ok(view.rootOverflow<=3,'root placement formula fits its width');
   assert.ok(view.pageOverrun<=2,'no page-wide horizontal scrolling');
   assert.equal(view.katexErrors,0,'valid KaTeX across all actual root expressions');
   assert.deepEqual(errors,[],'no browser errors');
   if(width===1440&&theme==='light'){
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const resized=await page.evaluate(()=>({
     docOverrun:document.documentElement.scrollWidth-innerWidth,
     equationOverflow:getComputedStyle(document.querySelector('#laneEq0')).overflowX,
     katexErrors:document.querySelectorAll('.katex-error').length
    }));
    assert.ok(resized.docOverrun<=2,'live resize must not introduce page-wide overflow');
    assert.equal(resized.equationOverflow,'visible','math must refit without scrollbars after resize');
    assert.equal(resized.katexErrors,0,'math must remain valid after live resize');
    await page.setViewportSize({width,height});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   }
   await page.screenshot({path:'artifacts/production-grooves/'+width+'-'+theme+'.png',fullPage:true});
   results.push({width,height,theme,grooves:options.length,formula:view});
   await page.close();
  }
 }
 fs.writeFileSync('artifacts/production-grooves/report.json',JSON.stringify({
  status:'PASS',description:'Four viewport/theme production checks for six browsing grooves, acoustic bongo sample aliases, visible independent gain, numeric roots and no math scrollbar; not human listening acceptance',
  results
 },null,2));
 console.log('PASS production UI and six groove collection in '+results.length+' responsive/theme states');
}finally{await browser.close()}
