import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(()=>{
  const math=window.RhythmMath,research=window.RhythmResearch;
  const presets=research.presets();
  const sizes=[230,390,680,900,1440,2300];
  const tol=1e-5;
  let checks=0,segmentsChecked=0,markersChecked=0;
  const failures=[],allLengths=[];
  const test=(label,length,angle,markers)=>{
   const segments=math.radialVisibleSegments(length,angle,markers,4);
   const ux=Math.cos(angle),uy=Math.sin(angle);
   let prev=0;
   for(const seg of segments){
    segmentsChecked++;
    if(seg.from<prev-1e-7||seg.to<seg.from||seg.to>length+1e-7){
     failures.push({label,type:'out of order or out of bounds',seg,length});
     continue;
    }
    prev=seg.to;
    for(const m of markers){
     markersChecked++;
     const t=Math.max(seg.from,Math.min(seg.to,m.x*ux+m.y*uy));
     const closestX=t*ux,closestY=t*uy;
     if(Math.hypot(m.x-closestX,m.y-closestY)<m.radius+4-tol)
      failures.push({label,type:'line crosses marker disk',seg,mark:m,angle});
    }
   }
   checks++;
   if(label==='no markers'&&
    (segments.length!==1||segments[0].from!==0||segments[0].to!==length))
    failures.push({label,type:'empty list must render whole hand',segments});
   return segments.length;
  };
  test('no markers',100,-Math.PI/2,[]);
  test('at far endpoint',100,0,[{x:100,y:0,radius:22}]);
  test('inside ray',100,0,[{x:30,y:0,radius:22},{x:60,y:0,radius:22}]);
  test('tangential near ray',100,0,[{x:50,y:25,radius:22}]);
  for(const size of sizes){
   const radii=research.radiiForSize(size);
   for(const p of presets){
    const markers=p.tracks.flatMap((t,lane)=>
     research.eventMetadata(t).map(e=>{
      const a=-Math.PI/2+2*Math.PI*e.phase;
      return {x:radii[lane]*Math.cos(a),y:radii[lane]*Math.sin(a),radius:22};
     }));
    for(let lane=0;lane<4;lane++){
     const picked=[0,.125,.25,.375,.5,.625,.75,.875,...research.eventMetadata(p.tracks[lane]).slice(0,3).map(x=>x.phase)];
     for(let k=0;k<picked.length;k++){
      const phase=picked[k],angle=-Math.PI/2+2*Math.PI*phase;
      const num=test(p.id+' '+size+' '+lane+' '+k,radii[lane],angle,markers);
      if(k===0)allLengths.push({preset:p.id,size,lane,segments:num});
      if(failures.length>15)break;
     }
     if(failures.length>15)break;
    }
    if(failures.length>15)break;
   }
  }
  let invalidRejected=0;
  for(const [length,angle,marks] of [[-1,0,[]],[100,NaN,[]],[100,0,[{x:NaN,y:0,radius:14}]]]){
   try{math.radialVisibleSegments(length,angle,marks)}catch{invalidRejected++}
  }
  if(invalidRejected!==3)failures.push({type:'invalid hand geometry not rejected',invalidRejected});
  return {presets:presets.length,sizes,checks,segmentsChecked,markersChecked,
   rejectedInvalidCases:invalidRejected,failures:failures.slice(0,16),allLengths:allLengths.slice(0,16)};
 });
 assert.equal(result.presets,50,'all prepared rhythm examples tested');
 assert.equal(result.rejectedInvalidCases,3,'invalid geometry rejected');
 assert.equal(result.failures.length,0,'playback hand overlaps a rendered marker: '+JSON.stringify(result.failures.slice(0,3)));
 assert.deepEqual(errors,[],'no browser runtime exceptions');
 fs.writeFileSync('artifacts/playback-hand-clearance.json',JSON.stringify({status:'PASS',...result},null,2));
 console.log('PASS: playback pointer does not cross markers across '+result.checks+
  ' root/viewport/phase cases and '+result.markersChecked+' marker-distance comparisons');
 await page.close();
}finally{await browser.close()}
