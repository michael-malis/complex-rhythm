import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const fixture={
 format:'roots-rhythm/1',name:'Beat visual acceptance',bpm:120,bars:1,
 tracks:['technoKick','metallic','fmPerc','noiseBurst'].map((sound,i)=>({
  a:i===0?1:0,b:0,n:1,sound,cycleBars:1,muted:i!==0
 }))
};
const evidence=[];
fs.mkdirSync('artifacts/geometry',{recursive:true});
try {
 for(const reducedMotion of ['no-preference','reduce']){
  const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.__beatVisualProbe={expanded:0,highlighted:0,expandedRadii:[],lastExpandedAt:0,reset(){
    this.expanded=0;this.highlighted=0;this.expandedRadii.length=0;this.lastExpandedAt=0;
   }};
   const originalArc=CanvasRenderingContext2D.prototype.arc;
   CanvasRenderingContext2D.prototype.arc=function(x,y,r,start,end,anticlockwise){
    const probe=window.__beatVisualProbe;
    // The 28px base marker (radius 14) expands above 1.4x (radius 19.6).
    // The other circles (orbit guides, ring strokes) have much larger radii.
    if(r>=19.6&&r<=23.1){
     probe.expanded++;
     probe.expandedRadii.push(r);
     probe.lastExpandedAt=performance.now();
    }
    // Motion-reduced beat highlights paint a small stationary bright core.
    if(r>7&&r<7.5)probe.highlighted++;
    return originalArc.apply(this,arguments);
   };
  });
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  await page.locator('#jsonFile').setInputFiles({
   name:'beat-visual.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
  });
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Beat visual acceptance'));
  await page.evaluate(()=>window.__beatVisualProbe.reset());
  await page.waitForTimeout(150);
  const stopped=await page.evaluate(()=>({expanded:window.__beatVisualProbe.expanded,highlighted:window.__beatVisualProbe.highlighted}));
  assert.equal(stopped.expanded,0,'no expanded hits while transport is stopped');
  assert.equal(stopped.highlighted,0,'no reduced-motion beat highlight while stopped');
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,{timeout:10000});
  if(reducedMotion==='reduce')await page.waitForFunction(()=>window.__beatVisualProbe.highlighted>0,{timeout:6000});
  else await page.waitForFunction(()=>window.__beatVisualProbe.expanded>=2,{timeout:6000});
  const during=await page.evaluate(()=>({
   playing:window.RhythmResearch.transport().playing,
   expanded:window.__beatVisualProbe.expanded,
   highlighted:window.__beatVisualProbe.highlighted,
   expandedRadii:window.__beatVisualProbe.expandedRadii.slice(0,12),
   lastExpandedAt:window.__beatVisualProbe.lastExpandedAt
  }));
  assert.ok(during.playing,'visual accent is observed during actual Web Audio transport');
  if(reducedMotion==='reduce'){
   assert.equal(during.expanded,0,'reduced motion prevents root enlargement');
   assert.ok(during.highlighted>0,'reduced motion retains stationary brightness feedback');
  }else{
   assert.ok(during.expanded>=2,'a visible 1.4x beat accent persists across multiple draw frames');
   assert.ok(during.expandedRadii.some(r=>r>=19.6),'root geometry exceeds 1.4x original size');
  }
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>!window.RhythmResearch.transport().playing,{timeout:8000});
  await page.evaluate(()=>window.__beatVisualProbe.reset());
  await page.waitForTimeout(200);
  const paused=await page.evaluate(()=>({expanded:window.__beatVisualProbe.expanded,highlighted:window.__beatVisualProbe.highlighted}));
  assert.equal(paused.expanded,0,'expansion ends after transport stops');
  assert.equal(paused.highlighted,0,'brightness feedback ends after transport stops');
  assert.deepEqual(errors,[],'no browser runtime errors');
  evidence.push({reducedMotion,stopped,during,paused});
  await page.close();
 }
 fs.writeFileSync('artifacts/geometry/beat-pulse.json',JSON.stringify({
  source:'Web Audio transport + actual CanvasRenderingContext2D arc geometry across frames',
  evidence,pass:true
 },null,2));
 console.log('PASS Web Audio visual pulse and reduced-motion stationary beat feedback');
}finally {await browser.close()}
