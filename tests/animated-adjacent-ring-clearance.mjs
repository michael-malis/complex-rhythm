import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
fs.mkdirSync('artifacts/geometry',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  const p=window.__adjacentBeatProbe={marks:[],multiFrames:0,collisions:[],maxFrameMarkers:0,frames:0};
  const origClear=CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect=function(...args){
   const marks=p.marks;
   if(marks.length>=2){
    p.multiFrames++;
    for(let i=0;i<marks.length;i++)for(let j=i+1;j<marks.length;j++){
     const a=marks[i],b=marks[j],dist=Math.hypot(a.x-b.x,a.y-b.y);
     if(dist<a.r+b.r+.5-1e-5)p.collisions.push({a,b,dist});
    }
   }
   p.maxFrameMarkers=Math.max(p.maxFrameMarkers,marks.length);
   p.frames++;
   p.marks=[];
   return origClear.apply(this,args);
  };
  const origArc=CanvasRenderingContext2D.prototype.arc;
  CanvasRenderingContext2D.prototype.arc=function(x,y,r,...rest){
   // Only animated root circles on the compact mobile graph. Guide circles
   // have substantially greater radii and the faint halo is suppressed.
   if(r>=19.6-1e-6&&r<=22.01)p.marks.push({x,y,r});
   return origArc.call(this,x,y,r,...rest);
  };
 });
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const theory=await page.evaluate(()=>{
  const research=window.RhythmResearch,math=window.RhythmMath;
  const presets=research.presets(),sizes=[390,430,480,520,700,900];
  let comparisons=0,minimumMargin=Infinity;
  const failures=[];
  for(const size of sizes){
   const radii=research.radiiForSize(size);
   for(const p of presets){
    const groups=p.tracks.map((t,lane)=>research.eventMetadata(t).map(e=>{
     const a=2*Math.PI*e.phase-Math.PI/2,combined=e.sources.some(s=>s.kind==='base')&&e.sources.some(s=>s.kind!=='base');
     const v=research.markerVisualForSize(size,8,combined);
     if(v.radius<19.6-1e-7)failures.push({type:'insufficient 1.4x expansion',size,preset:p.id,lane,radius:v.radius});
     return {x:radii[lane]*Math.cos(a),y:radii[lane]*Math.sin(a),
      r:v.radius+v.strokeWidth/2,phase:e.phase};
    }));
    for(let lane=0;lane<3;lane++){
     for(const a of groups[lane])for(const b of groups[lane+1]){
      const margin=Math.hypot(a.x-b.x,a.y-b.y)-a.r-b.r;
      comparisons++;minimumMargin=Math.min(minimumMargin,margin);
      if(margin<-1e-6)failures.push({type:'adjacent pulse overlap',size,preset:p.id,lane,phaseA:a.phase,phaseB:b.phase,margin});
     }
    }
   }
  }
  return {presets:presets.length,sizes,comparisons,minimumMargin,failures:failures.slice(0,10)};
 });
 assert.equal(theory.presets,50);
 assert.deepEqual(theory.failures,[],'full simultaneous pulse pair geometry must not collide');
 const fixture={format:'roots-rhythm/1',name:'All four simultaneous beats',bpm:120,bars:1,
  tracks:['technoKick','metallic','fmPerc','noiseBurst'].map(sound=>({
   a:1,b:0,n:1,sound,cycleBars:1,muted:false,layers:[]
  }))};
 await page.locator('#jsonFile').setInputFiles({
  name:'four-beats.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: All four simultaneous beats'));
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,{timeout:10000});
 await page.waitForFunction(()=>window.__adjacentBeatProbe.multiFrames>=3,{timeout:8000});
 const frame=await page.evaluate(()=>({
  frames:window.__adjacentBeatProbe.frames,multiFrames:window.__adjacentBeatProbe.multiFrames,
  maxFrameMarkers:window.__adjacentBeatProbe.maxFrameMarkers,
  collisions:window.__adjacentBeatProbe.collisions.slice(0,6)
 }));
 assert.ok(frame.maxFrameMarkers>=2,'real Web Audio beat enlarged several ring markers');
 assert.deepEqual(frame.collisions,[],'no painted neighboring pulses collide on actual mobile Canvas');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 assert.deepEqual(errors,[],'runtime browser exceptions');
 fs.writeFileSync('artifacts/geometry/animated-adjacent-ring-clearance.json',JSON.stringify({
  status:'PASS',scope:'50 prepared presets across 6 canvas widths and real 390px Web Audio simultaneous beats',
  theory,frame
 },null,2));
 console.log('PASS '+theory.comparisons+' animated adjacent ring comparisons; mobile Web Audio frames: '+frame.multiFrames);
 await page.close();
}finally{await browser.close()}
