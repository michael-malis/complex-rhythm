import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const dest='artifacts/math-semantic-caption';
fs.mkdirSync(dest,{recursive:true});
const cases=[];
const expected=['\\delta','\\frac{\\delta}{n}','\\frac{2\\pi}{n}','|z|'];
const read=page=>page.evaluate(()=>{
 const caption=document.getElementById('rootRuleCaption');
 const symbols=[...caption.querySelectorAll('.math-notation')].map(el=>{
  const rect=el.getBoundingClientRect(),css=getComputedStyle(el);
  return {latex:el.querySelector('annotation')?.textContent||'',
   mathml:!!el.querySelector('math'),rendered:!!el.querySelector('.katex'),
   error:!!el.querySelector('.katex-error'),font:parseFloat(css.fontSize),
   width:rect.width,clipped:rect.left<-1||rect.right>innerWidth+1};
 });
 const box=caption.getBoundingClientRect();
 return {text:caption.innerText,symbols,
  captionClipped:box.left<-1||box.right>innerWidth+1,
  documentOverflow:document.documentElement.scrollWidth>innerWidth+1,
  katexErrors:document.querySelectorAll('.katex-error').length,
  zeroPanel:[...document.querySelectorAll('#rootRuleAngleList li')].map(li=>({
   latex:li.querySelector('annotation')?.textContent||'',
   mathml:!!li.querySelector('math'),text:li.textContent.trim()
  })),
  spacing:document.querySelector('#rootRuleSpacing annotation')?.textContent||'',
  selected:document.querySelector('#selectedRootFormula annotation')?.textContent||''
 };
});
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#rootRuleInfoToggle').click();
  const initial=await read(page);
  assert.deepEqual(initial.symbols.map(s=>s.latex),expected,
   'inline caption must use exact semantic TeX rather than text surrogates at '+width+'/'+theme);
  assert.ok(initial.symbols.every(s=>s.mathml&&s.rendered&&!s.error&&s.font>=16&&s.width>2&&!s.clipped),
   'four readable MathML identities must be truly rendered and visible');
  assert.ok(!initial.captionClipped&&!initial.documentOverflow&&!initial.katexErrors);
  assert.ok(!initial.text.includes('δ/n')&&!initial.text.includes('2π/n'),
   'no textual mathematical shortcuts may remain in displayed explanation');
  if(width===1440&&theme==='light'){
   await page.locator('#trackN0').fill('7');
   const edited=await read(page);
   assert.notEqual(edited.spacing,initial.spacing,'degree edit must update actual root-spacing formula');
   assert.deepEqual(edited.symbols.map(s=>s.latex),expected,'dynamic math description remains semantic');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'trackN0','math refresh does not steal input focus');
   const old=await page.evaluate(()=>window.RhythmResearch.current());
   const json={format:'roots-rhythm/1',name:'Mathematical zero caption',bpm:old.bpm,bars:1,
    tracks:old.tracks.map((track,i)=>i===0?{...track,a:0,b:0}:track)};
   await page.locator('#jsonFile').setInputFiles({name:'zero-caption.json',
    mimeType:'application/json',buffer:Buffer.from(JSON.stringify(json))});
   await page.waitForFunction(()=>document.getElementById('rootRuleCaption').textContent.includes('undefined'));
   await page.locator('#rootRuleInfoToggle').evaluate(el=>{
    if(el.getAttribute('aria-expanded')==='false')el.click();
   });
   const zero=await read(page);
   assert.deepEqual(zero.symbols.map(s=>s.latex),['z=0','\\arg(0)'],
    'zero complex value uses actual semantic z and undefined argument');
   assert.ok(zero.symbols.every(s=>s.mathml&&s.rendered&&!s.error));
   assert.ok(zero.zeroPanel.some(s=>s.latex==='z=0'&&s.mathml),
    'zero state in the SVG-adjacent root explanation uses KaTeX MathML, not plaintext');
   assert.ok(!zero.documentOverflow&&!zero.katexErrors,'zero state does not clip');
   cases.push({viewport:[width,height],theme,regular:initial.symbols,editedSpacing:edited.spacing,
    zeroCaption:zero.symbols,zeroDiagramMath:zero.zeroPanel});
  }else{
   cases.push({viewport:[width,height],theme,regular:initial.symbols});
  }
  assert.deepEqual(errors,[],'no browser errors at '+width+'/'+theme);
  await page.close();
 }
 assert.equal(cases.length,12,'all 12 required viewport/theme states');
 fs.writeFileSync(dest+'/report.json',JSON.stringify({
  status:'PASS',viewports:12,captionTerms:4,dynamicDegreeAndZero:true,
  cases,scope:'Production root geometry prose uses real inline KaTeX and MathML; no text-only symbolic fractions. Zero complex state and live degree edit tested in actual UI; no audio/phase change or human screenshot approval implied.'
 },null,2)+'\n');
 console.log('PASS 12 semantic caption geometries, inline MathML, live n edit and zero root infographic');
}finally{await browser.close()}
