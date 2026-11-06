import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = 'http://127.0.0.1:8767/';
const sizes = [[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const report = [];
let assertions = 0;
function check(condition, message) {
  assert.ok(condition, message);
  assertions++;
}
const fixture = {
  format:'roots-rhythm/1', name:'Geometry acceptance fixture', bpm:120, bars:1,
  tracks:['technoKick','metallic','fmPerc','noiseBurst'].map(sound=>({
    a:1,b:0,n:4,sound,cycleBars:1,muted:false
  }))
};
fs.mkdirSync('artifacts/geometry',{recursive:true});
try {
 for(const [width,height] of sizes)for(const theme of ['light','dark']){
  const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#jsonFile').setInputFiles({
    name:'geometry.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
  });
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Geometry acceptance fixture'));
  await page.waitForTimeout(100);
  const data=await page.evaluate(()=>{
    const canvas=document.querySelector('#orbitCanvas');
    const rect=canvas.getBoundingClientRect(),side=Math.min(rect.width,rect.height);
    const radii=window.RhythmResearch.radiiForSize(side);
    const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
    const ctx=canvas.getContext('2d');
    const lanes=[...document.querySelectorAll('.lane')];
    const samples=[];
    const at=(x,y)=>[...ctx.getImageData(Math.round(x*scaleX),Math.round(y*scaleY),1,1).data].slice(0,3);
    const pixelDelta=(x,y,rgb)=>Math.max(...at(x,y).map((v,k)=>Math.abs(v-rgb[k])));
    for(let lane=0;lane<4;lane++){
      const css=lanes[lane].style.getPropertyValue('--lane-color').trim();
      const rgb=[1,3,5].map(i=>parseInt(css.slice(i,i+2),16));
      for(const phase of [0,.25,.5,.75]){
        const a=-Math.PI/2+Math.PI*2*phase;
        const x=rect.width/2+Math.cos(a)*radii[lane];
        const y=rect.height/2+Math.sin(a)*radii[lane];
        samples.push({lane,phase,delta:pixelDelta(x,y,rgb),x,y});
      }
    }
    // Vertical cross-section of the right-quarter dot measures actual fill pixels,
    // not merely Canvas pointer hit targets or CSS declarations.
    const x=rect.width/2+radii[0],y=rect.height/2;
    const css=lanes[0].style.getPropertyValue('--lane-color').trim();
    const rgb=[1,3,5].map(i=>parseInt(css.slice(i,i+2),16));
    const matched=[];
    for(let delta=-22;delta<=22;delta++){
      if(pixelDelta(x,y+delta,rgb)<35)matched.push(delta);
    }
    const labelBoxes=[...document.querySelectorAll('.circle-label')].map(label=>{
      const box=label.getBoundingClientRect();
      return {width:box.width,height:box.height,visible:box.width>0&&box.height>0,
        text:label.textContent.trim(),katex:!!label.querySelector('.katex')};
    });
    return {canvas:{width:rect.width,height:rect.height,intrinsicWidth:canvas.width},
      radii, samples, diameterPixels:matched.length,
      markerVerticalRange:[Math.min(...matched),Math.max(...matched)],
      labelBoxes,scrollWidth:document.documentElement.scrollWidth,
      viewportWidth:document.documentElement.clientWidth,
      phaseCount:window.RhythmResearch.current().tracks.map(t=>window.RhythmMath.rootPhases(t.a,t.b,t.n).length)};
  });
  check(data.canvas.width>=250&&data.canvas.height>=250,
    'Canvas visible at '+width+'x'+height);
  check(data.scrollWidth<=data.viewportWidth+1,
    'Page horizontal overflow at '+width+'x'+height+' '+theme);
  check(data.radii.length===4&&data.radii.every((r,i)=>r>0&&(!i||data.radii[i-1]-r>=39.9)),
    'four separated concentric rings: '+JSON.stringify(data.radii));
  check(data.samples.length===16&&data.samples.every(sample=>sample.delta<=35),
    'actual painted 16 cardinal dots must agree with four track colors: '+JSON.stringify(data.samples.filter(s=>s.delta>35)));
  check(data.diameterPixels>=27,
    'actual pixel-measured base root diameter >=28 CSS px (allow 1px antialias): '+data.diameterPixels);
  check(data.phaseCount.every(count=>count===4),'four independent root sets remain four per lane');
  check(data.labelBoxes.length===4&&data.labelBoxes.every(label=>label.visible&&label.katex),
    'four quarter-cycle labels must be live KaTeX glyphs');
  check(errors.length===0,'runtime errors: '+errors.join('; '));
  report.push({viewport:[width,height],theme,...data});
  await page.screenshot({path:'artifacts/geometry/orbits-'+width+'-'+theme+'.png'});
  await page.close();
 }
 // An extreme degree may overlap at fit-to-window scale. The user must be able
 // to magnify and navigate it without shrinking the required 28px marker.
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 const dense=structuredClone(fixture);
 dense.name='Dense roots zoom fixture';
 dense.tracks[3].n=64;
 await page.locator('#jsonFile').setInputFiles({
  name:'dense.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(dense))
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Dense roots zoom fixture'));
 await page.locator('.lane[data-lane="3"] .lane-select').click();
 await page.locator('#zoomBtn').click();
 await page.waitForFunction(()=>document.querySelector('#zoomBtn').getAttribute('aria-pressed')==='true'&&
  document.querySelector('#orbitCanvas').getBoundingClientRect().width>=900);
 const zoom=await page.evaluate(()=>{
  const plot=document.querySelector('#plotArea'),canvas=document.querySelector('#orbitCanvas');
  const side=canvas.getBoundingClientRect().width;
  const r=window.RhythmResearch.radiiForSize(side)[3];
  return {side,r,chord:2*r*Math.sin(Math.PI/64),
    scrollable:plot.scrollWidth>plot.clientWidth,scrollHeight:plot.scrollHeight,
    clientWidth:plot.clientWidth,clientHeight:plot.clientHeight,
    n:window.RhythmResearch.current().tracks[3].n};
 });
 check(zoom.n===64&&zoom.chord>=34-1e-7,
  '64th roots in selected fourth ring must separate by >=34 CSS px: '+JSON.stringify(zoom));
 check(zoom.scrollable&&zoom.side>zoom.clientWidth,
  'magnified dense roots must be scrollable without shrinking markers');
 await page.screenshot({path:'artifacts/geometry/dense-roots-magnified.png'});
 await page.locator('#zoomBtn').click();
 check(await page.locator('#zoomBtn').getAttribute('aria-pressed')==='false',
  'fit mode must be restored by keyboard-accessible button');
 await page.close();
 fs.writeFileSync('artifacts/geometry/measurements.json',JSON.stringify({
  source:'Chromium getImageData, computed Canvas bounds, live math state and actual DOM',
  referenceOriginalDotDiameterPx:14,
  minimumMarkerDiameterPx:28,
  viewportCases:report.length,assertions,zoom,report
 },null,2));
 console.log('PASS geometry acceptance: '+assertions+' assertions over '+report.length+' theme/viewport cases, including 64-degree magnification');
}finally{await browser.close()}
