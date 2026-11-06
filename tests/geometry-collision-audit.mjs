import { chromium } from 'playwright';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const sizes=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const fixture={
 format:'roots-rhythm/1',name:'Four aligned roots collision audit',bpm:120,bars:1,
 tracks:['kick','snare','hat','bass'].map(sound=>({
  a:1,b:0,n:4,cycleBars:1,sound,muted:false,layers:[]
 }))
};
const results=[];
fs.mkdirSync('artifacts/geometry-collision-audit',{recursive:true});
try{
 for(const [width,height] of sizes)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#jsonFile').setInputFiles({
   name:'aligned.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
  });
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Four aligned roots collision audit'));
  const found=await page.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
   const canvas=rect(document.getElementById('orbitCanvas'));
   const radii=window.RhythmResearch.radiiForSize(Math.min(canvas.width,canvas.height));
   const labels=[...document.querySelectorAll('.circle-label')].map(el=>({
    id:el.id,rect:rect(el),rendered:!!el.querySelector('.katex')
   }));
   const tracks=window.RhythmResearch.current().tracks;
   const dots=tracks.flatMap((t,lane)=>window.RhythmMath.rootPhases(t.a,t.b,t.n).map((phase,index)=>{
    const angle=-Math.PI/2+2*Math.PI*phase,r=radii[lane];
    return {lane,index,phase,x:canvas.x+canvas.width/2+r*Math.cos(angle),
      y:canvas.y+canvas.height/2+r*Math.sin(angle),radius:14};
   }));
   const collideDotRect=(dot,box)=>{
    const x=Math.max(box.left,Math.min(dot.x,box.right)),y=Math.max(box.top,Math.min(dot.y,box.bottom));
    return Math.hypot(dot.x-x,dot.y-y)<dot.radius+1;
   };
   const labelConflicts=[];
   for(const dot of dots)for(const label of labels){
    if(collideDotRect(dot,label.rect))
     labelConflicts.push({lane:dot.lane,phase:dot.phase,label:label.id});
   }
   const ringConflicts=[];
   for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){
    const a=dots[i],b=dots[j];
    if(a.lane===b.lane)continue;
    const d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<a.radius+b.radius-1e-7)ringConflicts.push({laneA:a.lane,laneB:b.lane,phaseA:a.phase,phaseB:b.phase,separation:d});
   }
   return {canvas,radii,dots:dots.length,labelCount:labels.length,
    labelConflicts,ringConflicts,allKatex:labels.every(x=>x.rendered)};
  });
  results.push({viewport:[width,height],theme,...found});
  await page.screenshot({path:'artifacts/geometry-collision-audit/'+width+'-'+theme+'.png'});
  await page.close();
 }
 const summary={
  type:'diagnostic (NOT A PASS assertion for R-GEO-002)',
  cases:results.length,
  dotLabelOverlaps:results.reduce((a,x)=>a+x.labelConflicts.length,0),
  adjacentRingOverlaps:results.reduce((a,x)=>a+x.ringConflicts.length,0),
  allLabelsKatex:results.every(x=>x.allKatex),
  results
 };
 fs.writeFileSync('artifacts/geometry-collision-audit/measurements.json',JSON.stringify(summary,null,2));
 console.log('GEOMETRY COLLISION AUDIT (unresolved acceptance):',JSON.stringify({
  cases:summary.cases,dotLabelOverlaps:summary.dotLabelOverlaps,
  adjacentRingOverlaps:summary.adjacentRingOverlaps,allLabelsKatex:summary.allLabelsKatex
 }));
 if(summary.dotLabelOverlaps||summary.adjacentRingOverlaps)
  console.warn('OPEN DEFECT R-GEO-002: marker collisions were measured. Do not mark this requirement VERIFIED.');
}finally{await browser.close()}
