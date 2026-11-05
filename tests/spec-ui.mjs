import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const viewports=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
let count=0;const ok=(v,msg)=>{assert.ok(v,msg);count++};
fs.mkdirSync('artifacts/spec-ui',{recursive:true});
try{
 for(const [width,height] of viewports)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  for(const id of ['#presetDetails','#compositionPanel','.math-details'])await page.locator(id).evaluate(el=>el.open=true);
  const data=await page.evaluate(()=>{
   const selectors=['body','.wordmark','.strapline','.eyebrow','.stage-heading h1','.panel-heading h2','.stage-meta','.quiet','.lane-select','.lane-fields label','.lane-fields input','.lane-sound','.lane-count','.figure-legend','.stage-hint','.small-explain','.math-details p','button','.formula-reference'];
   const sizes=selectors.map(sel=>{const e=document.querySelector(sel);return {selector:sel,font:e?parseFloat(getComputedStyle(e).fontSize):NaN}});
   const exactScale=['.composition-info h3','.lane-select','.lane-fields label','.lane-fields input',
     '.lane-sound','.lane-count','.lane-length label','.figure-legend','.stage-hint',
     '.small-explain','.circle-labels','.stage-meta','.panel-heading h2','.stage-heading h1'];
   const scale=exactScale.map(sel=>{
      const e=document.querySelector(sel);
      return {selector:sel,font:e?parseFloat(getComputedStyle(e).fontSize):NaN}
   });
   return {width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,sizes,scale,labels:['phaseQuarter','phaseHalf','phaseThreequarters'].map(id=>({text:document.getElementById(id).innerText,frac:!!document.querySelector('#'+id+' .frac-line')})),renderer:window.katex?.version||null,parts:document.querySelectorAll('#formulaReference .katex').length,root:!!document.querySelector('#selectedRootFormula .katex'),input:document.querySelector('#trackN0')?.max};
  });
  ok(data.scroll<=data.width+2,'no whole-page overflow '+width+'/'+theme);
  ok(data.sizes.every(x=>x.font>=16), 'font min 16px '+width+'/'+theme+': '+JSON.stringify(data.sizes.filter(x=>x.font<16)));
  ok(data.sizes.find(x=>x.selector==='.stage-heading h1').font===30,'primary heading exactly 30px');
  ok(data.sizes.find(x=>x.selector==='.panel-heading h2').font===26,'section heading 26px');
  ok(data.renderer==='0.16.22'&&data.parts>=10&&data.root,'KaTeX rendered with local package');
  const minScale={'.composition-info h3':22,'.lane-select':20,'.lane-fields label':18,'.lane-fields input':18,
   '.lane-sound':18,'.lane-count':20,'.lane-length label':18,'.figure-legend':17,'.stage-hint':17,
   '.small-explain':17,'.circle-labels':20,'.stage-meta':18,'.panel-heading h2':26,'.stage-heading h1':30};
  for(const item of data.scale)ok(item.font>=minScale[item.selector],
    'mandatory math/controls typography '+item.selector+' '+width+'/'+theme+
    ': '+item.font+' < '+minScale[item.selector]);
  ok(data.labels.every(x=>x.frac),'all quarter fractions are vertically typeset');
  ok(await page.locator('#argMathLabel .katex').count()===1,'argument slider math typeset with KaTeX');
  ok(await page.locator('#mathExampleUnion .katex').count()===1,'mathematical prose avoids plain-text root-set surrogate');
  ok(data.input==='64','degree supports 1..64');
  ok(errors.length===0,'JS errors '+errors.join('; '));
  await page.screenshot({path:'artifacts/spec-ui/'+width+'x'+height+'-'+theme+'.png',fullPage:true});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('.lane[data-lane="0"] .mode-button').nth(1).click();
 ok(await page.locator('#trackR0').count()===1&&await page.locator('#trackTheta0').count()===1,'polar edit fields');
 await page.locator('#trackTheta0').fill('1.57079632679');
 await page.locator('.lane[data-lane="0"] .unit-button').click();
 ok(Math.abs(Number(await page.locator('#trackTheta0').inputValue())-90)<.001,'switch radians to degrees');
 await page.locator('.lane[data-lane="0"] .mode-button').nth(0).click();
 ok(Math.abs(Number(await page.locator('#trackA0').inputValue()))<1e-5&&Math.abs(Number(await page.locator('#trackB0').inputValue())-1)<1e-5,'polar→Cartesian roundtrip');
 await page.locator('.lane[data-lane="0"] .expression-entry').evaluate(el=>el.open=true);
 await page.locator('#trackExpression0').fill('cos(pi/3)+i sin(pi/3)');
 await page.locator('.lane[data-lane="0"] .expression-controls button').click();
 ok(Math.abs(Number(await page.locator('#trackA0').inputValue())-.5)<1e-5,'safe expression real component');
 ok(Math.abs(Number(await page.locator('#trackB0').inputValue())-Math.sqrt(3)/2)<1e-5,'safe expression imaginary component');
 await page.locator('#trackExpression0').fill('alert(1)');
 await page.locator('.lane[data-lane="0"] .expression-controls button').click();
 ok((await page.locator('.lane[data-lane="0"] .expression-error').textContent()).length>0,'unsafe expressions rejected');
 ok(Math.abs(Number(await page.locator('#trackA0').inputValue())-.5)<1e-5,'invalid syntax retains canonical state');
 await page.locator('#trackA0').fill('1e-9');
 await page.locator('#trackB0').fill('0');
 await page.locator('.lane[data-lane="0"] .mode-button').nth(1).click();
 ok(Math.abs(Number(await page.locator('#trackR0').inputValue())-1e-9)<1e-20,
  'tiny nonzero modulus is not rounded to zero in polar editor');
 const tinyMath=await page.locator('#laneAlt0 annotation').textContent();
 ok(tinyMath.includes('10^{-9}'),'tiny nonzero coefficient is typeset in scientific KaTeX rather than displayed as zero');
 await page.locator('.lane[data-lane="0"] .mode-button').nth(0).click();
 ok(Math.abs(Number(await page.locator('#trackA0').inputValue())-1e-9)<1e-20,
  'tiny input survives cartesian-polar-cartesian round-trip without truncation');
 await page.locator('#trackA0').fill('0');
 await page.locator('#trackB0').fill('0');
 await page.locator('.lane[data-lane="0"] .mode-button').nth(1).click();
 ok(await page.locator('#trackTheta0').isDisabled(),'zero argument undefined');
 await page.locator('#trackR0').fill('1');
 ok(await page.locator('#trackTheta0').isEnabled(),'radius input leaves zero and enables angle');
 await page.locator('#trackN0').fill('64');
 ok((await page.locator('#laneCount0').textContent()).includes('64 hits'),'64 root events');
 await page.locator('#zoomBtn').click();
 ok(Number((await page.locator('#orbitCanvas').boundingBox()).width)>=900,'magnification expands plot');
 let spacing=await page.evaluate(()=>{
   const width=document.querySelector('#orbitCanvas').getBoundingClientRect().width;
   const radius=window.RhythmResearch.radiiForSize(width)[0];
   return {width,chord:2*radius*Math.sin(Math.PI/64)};
 });
 ok(spacing.chord>=34-1e-8,'magnified outer n64 points separated at least 34px: '+JSON.stringify(spacing));
 await page.locator('.lane[data-lane="3"] .lane-select').click();
 await page.waitForTimeout(80);
 const smaller=(await page.locator('#orbitCanvas').boundingBox()).width;
 ok(smaller===900,'a single root has no adjacent-root separation requirement');
 await page.locator('#trackN3').fill('64');
 await page.waitForTimeout(80);
 spacing=await page.evaluate(()=>{
   const width=document.querySelector('#orbitCanvas').getBoundingClientRect().width;
   const radius=window.RhythmResearch.radiiForSize(width)[3];
   return {width,chord:2*radius*Math.sin(Math.PI/64)};
 });
 ok(spacing.width>smaller,'editing n while magnified recomputes plot size');
 ok(spacing.chord>=34-1e-8,'innermost n64 circle has minimum root chord 34px: '+JSON.stringify(spacing));
 await page.locator('#zoomBtn').click();
 ok((await page.locator('#zoomBtn').getAttribute('aria-pressed'))==='false','zoom toggle restores standard view');
 console.log('PASS spec typography/KaTeX/Cartesian-Polar/zoom:',count,'assertions');
 await page.close();
}finally{await browser.close()}
