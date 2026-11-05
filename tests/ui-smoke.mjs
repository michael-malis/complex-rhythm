import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base='http://127.0.0.1:8767/';
const sizes=[[360,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1520,982]];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const context=await browser.newContext({acceptDownloads:true,reducedMotion:'reduce'});
fs.mkdirSync('artifacts',{recursive:true});
const errors=[];
let checks=0;
function verify(ok,msg){assert.ok(ok,msg);checks++}
try {
 for(const [width,height] of sizes) {
  const page=await context.newPage();
  await page.setViewportSize({width,height});
  page.on('pageerror',e=>errors.push(width+': '+e.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(150);
  const data=await page.evaluate(()=>{
   const rect=id=>document.querySelector(id).getBoundingClientRect();
   return {
    lang:document.documentElement.lang,theme:document.documentElement.dataset.theme,
    scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
    canvas:[rect('#orbitCanvas').width,rect('#orbitCanvas').height],
    lanes:document.querySelectorAll('.lane').length,
    inputs:document.querySelectorAll('.lane input[type=number]').length,
    fieldHeight:rect('#trackN0').height,
    sceneLeft:rect('.visual-stage').left,
    controlLeft:rect('.control-panel').left,
    sceneTop:rect('.visual-stage').top,
    controlTop:rect('.control-panel').top,
    bodyText:document.body.innerText,
    computedBackground:getComputedStyle(document.body).backgroundColor,
    fileHidden:getComputedStyle(document.querySelector('#jsonFile')).display==='none'
   };
  });
  verify(data.lang==='en'&&!/[А-Яа-яЁё]/.test(data.bodyText),'English localization '+width);
  verify(data.theme==='light'&&data.computedBackground==='rgb(242, 239, 232)','warm-paper initial theme '+width);
  verify(data.scroll<=data.viewport+2,'horizontal overflow '+width+': '+JSON.stringify(data));
  verify(Math.abs(data.canvas[0]-data.canvas[1])<2&&data.canvas[0]>190,'square Canvas '+width);
  verify(data.lanes===4&&data.inputs===12,'four visible mathematical input rows '+width);
  verify(data.fieldHeight>=44,'small input target '+width);
  verify(data.fileHidden,'native JSON file picker visible '+width);
  if(width<760)verify(data.controlTop<data.sceneTop,'math-first mobile order '+width);
  else verify(data.sceneLeft<data.controlLeft,'desktop/tablet visualization left '+width);
  await page.screenshot({path:'artifacts/workbench-'+width+'x'+height+'.png',fullPage:true});
  console.log('PASS viewport',width+'x'+height,JSON.stringify({canvas:data.canvas,inputs:data.inputs,fieldHeight:data.fieldHeight}));
  await page.close();
 }

 const page=await context.newPage();
 await page.setViewportSize({width:1440,height:900});
 page.on('pageerror',e=>errors.push('interactions: '+e.message));
 await page.goto(base,{waitUntil:'domcontentloaded'});
 verify((await page.locator('#presetSelect').inputValue())==='afro','default 3:4 study');
 verify((await page.locator('#laneCount0').textContent()).includes('3 hits'),'lane0 roots initially three');
 verify((await page.locator('#laneCount1').textContent()).includes('4 hits'),'lane1 roots initially four');
 await page.locator('#trackN1').fill('5');
 verify((await page.locator('#laneCount1').textContent()).includes('5 hits'),'lane1 independent edits');
 verify((await page.locator('#laneCount0').textContent()).includes('3 hits'),'lane0 unaffected by lane1 edit');
 await page.locator('#trackN1').fill('4');
 await page.locator('#trackN0').fill('4');
 await page.locator('#compositionPanel').evaluate(el=>el.open=true);
 await page.locator('#addLayer').click();
 verify((await page.locator('#baseCount').textContent())==='4','base set count four');
 verify((await page.locator('#addedCount').textContent())==='3','added set count three');
 verify((await page.locator('#unionCount').textContent())==='6','union of fourth and third roots has six events');
 verify((await page.locator('#unionStrip .overlap').count())===1,'exact coincidence at phase zero');
 verify((await page.locator('#extraLayers input[type=number]').count())===3,'additional source editable');
 await page.locator('#argumentAngle').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}))});
 const a=Number(await page.locator('#trackA0').inputValue());
 const b=Number(await page.locator('#trackB0').inputValue());
 verify(Math.abs(a)<1e-4&&Math.abs(b-1)<1e-4,'argument slider preserves magnitude');
 verify((await page.locator('#baseCount').textContent())==='4','rotation preserves degree');
 await page.locator('#themeBtn').click();
 verify((await page.locator('html').getAttribute('data-theme'))==='dark','dark theme enabled');
 await page.screenshot({path:'artifacts/workbench-dark-theme.png',fullPage:true});
 await page.locator('#themeBtn').click();
 verify((await page.locator('html').getAttribute('data-theme'))==='light','light theme restored');
 await page.locator('#trackA0').fill('1');await page.locator('#trackB0').fill('0');

 // Keyboard turns the first lane's four roots by 5°, hence arg(z) by 20°.
 await page.locator('#orbitCanvas').focus();await page.keyboard.press('Shift+ArrowRight');
 const keyA=Number(await page.locator('#trackA0').inputValue());
 const keyB=Number(await page.locator('#trackB0').inputValue());
 verify(Math.abs(Math.atan2(keyB,keyA)*180/Math.PI-20)<2,'keyboard rotation by 5° per root');

 // Restore the default before the drag test.
 await page.locator('#presetDetails').evaluate(el=>el.open=true);
 await page.locator('#categorySelect').selectOption('poly');
 await page.locator('#presetSelect').selectOption('afro');
 const box=await page.locator('#orbitCanvas').boundingBox();
 const cx=box.x+box.width/2,cy=box.y+box.height/2,r=Math.min(box.width,box.height)*.427;
 await page.mouse.move(cx,cy-r);await page.mouse.down();
 await page.mouse.move(cx+r*Math.sin(Math.PI/9),cy-r*Math.cos(Math.PI/9),{steps:12});await page.mouse.up();
 const da=Number(await page.locator('#trackA0').inputValue());
 const db=Number(await page.locator('#trackB0').inputValue());
 verify(Math.abs(Math.atan2(db,da)*180/Math.PI-60)<4,'mouse drag rotates root set directly');

 let total=0;
 for(const category of await page.locator('#categorySelect option').evaluateAll(opts=>opts.map(o=>o.value))) {
  await page.locator('#categorySelect').selectOption(category);
  const ids=await page.locator('#presetSelect option').evaluateAll(opts=>opts.map(o=>o.value).filter(x=>x!=='__custom__'));
  for(const id of ids) {
   await page.locator('#presetSelect').selectOption(id);
   verify(await page.locator('.lane').count()===4,'preset loads all lanes '+id);
   total++;
  }
 }
 verify(total===35,'expected 35 original presets');
 await page.locator('#categorySelect').selectOption('poly');
 const poly=await page.locator('#presetSelect option').allTextContents();
 for(const ratio of ['2 : 3','3 : 4','3 : 5','4 : 7','5 : 7'])
  verify(poly.some(t=>t.includes(ratio)),'polyrhythm ratio '+ratio);
 await page.locator('#categorySelect').selectOption('brazil');
 verify((await page.locator('#presetSelect option').allTextContents()).filter(t=>t.includes('Bossa Nova')).length===1,'one Bossa Nova preset');

 await page.locator('#fileMenu summary').click();
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#saveBtn').click();
 const download=await downloadPromise;
 const raw=fs.readFileSync(await download.path(),'utf8'),saved=JSON.parse(raw);
 verify(saved.format==='roots-rhythm/1'&&saved.tracks.length===4,'JSON v1 unchanged');
 await page.locator('#jsonFile').setInputFiles({name:'roundtrip.json',mimeType:'application/json',buffer:Buffer.from(raw)});
 await page.waitForTimeout(90);
 verify((await page.locator('#toast').textContent()).includes('Imported'),'JSON round trip');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>document.querySelector('#playBtn').textContent.includes('Pause'),{timeout:8000});
 verify((await page.locator('#playBtn').textContent()).includes('Pause'),'audio transport starts');
 await page.locator('#playBtn').click();
 verify((await page.locator('#playBtn').textContent()).includes('Play'),'audio transport pauses');
 verify(errors.length===0,'browser JavaScript errors: '+errors.join('; '));
 await page.screenshot({path:'artifacts/workbench-composition.png',fullPage:true});
 console.log('ALL PASS:',checks,'assertions |',sizes.length,'viewports | 35 presets | root union, responsive, theme, audio, JSON');
 await page.close();
} finally {
 await context.close();await browser.close();
}
