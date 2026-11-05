import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(()=>{
  let seed=0x1928341;
  const random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
  const integer=(lo,hi)=>Math.floor(random()*(hi-lo+1))+lo;
  const TAU=2*Math.PI,tol=1e-6;
  const circular=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b));
  const failures=[],stats={samples:0,intersection:0,union:0,withEuclidean:0,nearBoundary:0};
  const roots=(x)=>{
   if(x.a===0&&x.b===0)return [];
   const arg=Math.atan2(x.b,x.a);
   return Array.from({length:x.n},(_,k)=>{
    const v=((arg+TAU*k)/(TAU*x.n))%1;return (v+1)%1;
   });
  };
  const distinct=values=>{
   const unique=[];
   for(const v of values){
    if(!unique.some(u=>circular(u,v)<tol))unique.push(v);
   }
   return unique.sort((a,b)=>a-b);
  };
  for(let q=0;q<400;q++){
   const theta=integer(-18,18)*Math.PI/18;
   const z=q%23===0?{a:0,b:0}:{a:Math.cos(theta),b:Math.sin(theta)};
   const track={...z,n:integer(1,17),sound:'technoKick',operation:q%2?'intersection':'union',
    layers:[],euclidean:null};
   const added=integer(0,3);
   for(let k=0;k<added;k++){
    const theta2=(q+k)%7===0?theta:integer(-18,18)*Math.PI/18;
    track.layers.push({a:Math.cos(theta2),b:Math.sin(theta2),n:integer(1,13),velocity:.7});
   }
   if(q%3===0)track.euclidean={k:integer(0,10),n:integer(10,16),rotation:integer(-5,5),velocity:.5};
   const sets=[roots(track),...track.layers.map(roots)];
   if(track.euclidean)sets.push(window.RhythmMath.euclidean(track.euclidean.k,track.euclidean.n,track.euclidean.rotation));
   const union=distinct(sets.flat());
   const expected=track.operation==='intersection'?distinct(sets[0].filter(p=>sets.slice(1).every(set=>set.some(v=>circular(v,p)<tol)))):union;
   const actual=window.RhythmResearch.eventMetadata(track);
   if(actual.length!==expected.length||
      actual.some(x=>!expected.some(y=>circular(x.phase,y)<tol))){
    failures.push({q,track,expected,actual:actual.map(x=>x.phase)});
   }
   for(const event of actual){
    if(event.velocity<.1||event.velocity>1||event.sources.length===0)failures.push({q,type:'invalid event metadata',event});
    for(const source of event.sources){
     let input;
     if(source.kind==='base')input=sets[0];
     else if(source.kind==='additional')input=sets[1+source.sourceIndex];
     else if(source.kind==='euclidean')input=sets.at(-1);
     if(!input||!input.some(v=>circular(v,event.phase)<tol))
      failures.push({q,type:'incorrect event provenance',event,source});
    }
    if(track.operation==='intersection'){
     if(!event.sources.some(x=>x.kind==='base') ||
        track.layers.some((_,i)=>!event.sources.some(x=>x.kind==='additional'&&x.sourceIndex===i)) ||
        (track.euclidean&&!event.sources.some(x=>x.kind==='euclidean')))
       failures.push({q,type:'incorrect intersection source',event});
    }
   }
   stats.samples++;
   if(track.operation==='intersection')stats.intersection++;else stats.union++;
   if(track.euclidean)stats.withEuclidean++;
   if(theta===Math.PI||theta===-Math.PI)stats.nearBoundary++;
  }
  return {stats,failures:failures.slice(0,15),failureCount:failures.length,seed:0x1928341};
 });
 assert.equal(result.failureCount,0,'events and provenance agree with independent root/Euclidean model: '+JSON.stringify(result.failures.slice(0,3)));
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/mathematical-event-properties.json',JSON.stringify(result,null,2));
 console.log('PASS independent mathematical model and provenance fuzz: '+JSON.stringify(result.stats));
 await page.close();
}finally{await browser.close()}
