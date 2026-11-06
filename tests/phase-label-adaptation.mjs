import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const screenSizes=[[1600,1000],[1440,900],[1024,768],[768,1024],[390,844]];
const report=[];
fs.mkdirSync('artifacts/geometry',{recursive:true});
try{
 for(const [width,height] of screenSizes)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  const presets=await page.evaluate(()=>window.RhythmResearch.presets().map(p=>({id:p.id,category:p.category})));
  assert.equal(presets.length,50,'all 50 presets tested');
  let category=await page.locator('#categorySelect').inputValue();
  const failures=[];
  for(const preset of presets){
   if(category!==preset.category){
    await page.locator('#categorySelect').selectOption(preset.category);
    category=preset.category;
   }
   await page.locator('#presetSelect').selectOption(preset.id);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const measured=await page.evaluate(()=>{
    const rect=e=>e.getBoundingClientRect();
    const canvas=rect(document.getElementById('orbitCanvas'));
    const labels=[...document.querySelectorAll('.circle-label')].map(el=>({
     id:el.id,rect:rect(el),visible:!!el.querySelector('.katex')&&rect(el).width>0&&rect(el).height>0
    }));
    const current=window.RhythmResearch.current();
    const radii=window.RhythmResearch.radiiForSize(Math.min(canvas.width,canvas.height));
    const dots=current.tracks.flatMap((t,lane)=>window.RhythmResearch.eventMetadata(t).map(ev=>{
     const a=-Math.PI/2+2*Math.PI*ev.phase;
     return {x:canvas.left+canvas.width/2+radii[lane]*Math.cos(a),
      y:canvas.top+canvas.height/2+radii[lane]*Math.sin(a),
      phase:ev.phase,lane};
    }));
    const overlaps=[];
    for(const dot of dots)for(const label of labels){
     const r=label.rect,px=Math.max(r.left,Math.min(dot.x,r.right)),py=Math.max(r.top,Math.min(dot.y,r.bottom));
     if((dot.x-px)**2+(dot.y-py)**2<17**2)overlaps.push({lane:dot.lane,phase:dot.phase,label:label.id});
    }
    return {overlaps,validLabels:labels.every(x=>x.visible),
     labels:labels.map(x=>({id:x.id,left:x.rect.left,top:x.rect.top}))};
   });
   if(!measured.validLabels||measured.overlaps.length)failures.push({
    id:preset.id,missingLabels:!measured.validLabels,overlaps:measured.overlaps.slice(0,8),
    placement:measured.labels
   });
  }
  report.push({viewport:[width,height],theme,presets:presets.length,
   failedPresets:failures.length,examples:failures.slice(0,12),runtimeErrors:errors});
  await page.screenshot({path:'artifacts/geometry/phase-labels-'+width+'-'+theme+'.png'});
  await page.close();
 }
 fs.writeFileSync('artifacts/geometry/phase-label-adaptation.json',JSON.stringify({
  checkedPresets:50,viewports:screenSizes.length,themes:2,cases:report.length,
  status:report.every(x=>!x.failedPresets&&!x.runtimeErrors.length)?'PASS':'FAILED',
  report
 },null,2));
 for(const item of report){
  assert.equal(item.failedPresets,0,'phase-label/root collisions in '+item.viewport+' '+item.theme+': '+JSON.stringify(item.examples.slice(0,3)));
  assert.deepEqual(item.runtimeErrors,[],'runtime failures');
 }
 console.log('PASS dynamically positioned phase labels avoid every root in 50 presets across '+report.length+' viewport/theme states');
}finally{await browser.close()}
