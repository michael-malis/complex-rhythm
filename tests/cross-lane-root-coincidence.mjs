import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dir='artifacts/cross-lane-coincidences';
fs.mkdirSync(dir,{recursive:true});
const fixture={format:'roots-rhythm/1',name:'Cross-lane exact-time geometry',bpm:120,bars:1,tracks:[
 {a:1,b:0,n:4,sound:'technoKick',cycleBars:2,muted:false,layers:[]},
 {a:1,b:0,n:2,sound:'hat',cycleBars:1,muted:true,layers:[]},
 {a:1,b:0,n:8,sound:'rim',cycleBars:4,muted:false,layers:[]},
 {a:1,b:0,n:3,sound:'acidClassic',cycleBars:1,muted:false,layers:[]}
]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const reports=[];
async function view(page){
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 return page.evaluate(()=>{
  const canvas=document.getElementById('orbitCanvas'),box=canvas.getBoundingClientRect();
  const current=window.RhythmResearch.current();
  return {hidden:document.getElementById('rootInspection').hidden,
   time:document.getElementById('rootInspectionTime').textContent,
   coincident:document.getElementById('rootInspectionCoincidences').textContent,
   announcement:document.getElementById('rootInspectionAnnouncement').textContent,
   halos:window.__crossHalos||[],current,
   radii:window.RhythmResearch.radiiForSize(Math.min(box.width,box.height)),
   overflow:document.documentElement.scrollWidth>innerWidth+1,
   transport:window.RhythmResearch.transport()};
 });
}
async function inspect(page,root){
 await page.locator('#orbitCanvas').focus();
 if(root===0)await page.keyboard.press('Home');
 else {
  await page.keyboard.press('Home');
  for(let i=0;i<root;i++)await page.keyboard.press(']');
 }
 return view(page);
}
function validateHalos(v,expectedLanes,expectedPhases){
 assert.deepEqual(v.halos.map(h=>h.lane),expectedLanes,'only mathematically coincident other rings receive a static halo');
 for(let i=0;i<expectedLanes.length;i++){
  const halo=v.halos[i],lane=expectedLanes[i],phase=expectedPhases[i],r=v.radii[lane];
  assert.ok(Math.abs(halo.x-Math.cos(-Math.PI/2+2*Math.PI*phase)*r)<.05,
   'halo x projects the exact root phase of lane '+(lane+1));
  assert.ok(Math.abs(halo.y-Math.sin(-Math.PI/2+2*Math.PI*phase)*r)<.05,
   'halo y projects the exact root phase of lane '+(lane+1));
  assert.equal(halo.color,halo.expectedColors[lane],'halo uses matching instrument color');
  assert.ok(halo.radius>=16&&halo.radius<=20,'halo is compact and never a radial playback hand');
 }
}
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce',hasTouch:viewport.width===390});
  await page.addInitScript(()=>{
   const C=CanvasRenderingContext2D.prototype;
   const arc=C.arc,stroke=C.stroke,clear=C.clearRect;
   C.arc=function(x,y,r,a,b,...rest){
    this.__mostRecentArc={x,y,r};
    return arc.call(this,x,y,r,a,b,...rest);
   };
   C.clearRect=function(...args){
    if(this.canvas?.id==='orbitCanvas')window.__crossHalos=[];
    return clear.apply(this,args);
   };
   C.stroke=function(...args){
    const a=this.__mostRecentArc,dashes=this.getLineDash();
    if(this.canvas?.id==='orbitCanvas'&&a&&dashes.length===2&&dashes[0]===3&&dashes[1]===5){
     const list=window.__crossHalos||(window.__crossHalos=[]);
     list.push({x:a.x,y:a.y,radius:a.r,color:String(this.strokeStyle).toLowerCase(),
      alpha:this.globalAlpha});
    }
    return stroke.apply(this,args);
   };
  });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(viewport.width===390)await page.locator('#themeBtn').click();
  await page.locator('#jsonFile').setInputFiles({name:'cross-lane.json',
   mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
  await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('Imported rhythm: Cross-lane exact-time geometry'));
  const original=await view(page);
  // Lane 1 second root: phase .25 of 2 bars = .5 absolute bar, = 1.000s.
  let v=await inspect(page,1);
  assert.equal(v.hidden,false);
  assert.match(v.time,/Phase 25% · loop bar 1\/2 · beat 3\/4 · first occurrence 1\.000 s after start/);
  assert.equal(v.coincident,'Same-time mathematical events: Lane 2 (muted) · Lane 3');
  assert.match(v.announcement,/Lane 2 \(muted\) · Lane 3/);
  assert.deepEqual(v.current.tracks,original.current.tracks,'inspecting does not modify mathematical sources');
  assert.equal(v.transport.schedulerIntervalsCreated,original.transport.schedulerIntervalsCreated,
   'static mathematical halos do not start any audio scheduler');
  assert.deepEqual(v.halos.map(h=>h.color),
   viewport.width===390?['#98b39a','#d5b16e']:['#567a63','#967438']);
  const targetR= v.radii;
  assert.equal(v.halos.length,2);
  for(const [index,phase] of [[0,.5],[1,.125]]){
   const h=v.halos[index],lane=index+1,a=-Math.PI/2+Math.PI*2*phase;
   assert.ok(Math.abs(h.x-Math.cos(a)*targetR[lane])<.05);
   assert.ok(Math.abs(h.y-Math.sin(a)*targetR[lane])<.05);
   assert.ok(h.radius>=16&&h.radius<=20);
  }
  assert.equal(v.halos[0].alpha,.72,'muted mathematical coincidence is visible but distinguished');

  // Beat-to-seconds mapping follows BPM, while root phase and counterpart rings do not.
  await page.locator('#bpm').evaluate(el=>{el.value='60';el.dispatchEvent(new Event('input',{bubbles:true}))});
  v=await view(page);
  assert.match(v.time,/first occurrence 2\.000 s after start/);
  assert.equal(v.coincident,'Same-time mathematical events: Lane 2 (muted) · Lane 3');

  // Muted instruments still have roots; the explanation updates on mute changes.
  await page.locator('#laneMute1').click();
  v=await view(page);
  assert.equal(v.coincident,'Same-time mathematical events: Lane 2 · Lane 3');
  assert.equal(v.halos[0].alpha,1);

  // A different degree in an UNSELECTED lane removes its old .5-bar coincidence.
  await page.locator('#trackN1').fill('3');
  v=await view(page);
  assert.equal(v.coincident,'Same-time mathematical events: Lane 3');
  assert.deepEqual(v.halos.map(h=>h.color),[viewport.width===390?'#d5b16e':'#967438']);

  // Different loop length changes absolute timing even if normalized root angles persist.
  await page.locator('#laneBars2').fill('3');
  v=await view(page);
  assert.equal(v.coincident,'No other lane has a hit at this first occurrence.');
  assert.deepEqual(v.halos,[],'do not paint a false match at the same normalized phase');

  // First hit is common to all other nonzero root sets at absolute t=0.
  await inspect(page,0);
  v=await view(page);
  assert.match(v.time,/first occurrence 0\.000 s after start/);
  assert.equal(v.coincident,'Same-time mathematical events: Lane 2 · Lane 3 · Lane 4');
  assert.equal(v.halos.length,3);

  // Clicking clear removes all auxiliary visual highlights.
  await page.locator('#clearRootInspection').click();
  v=await view(page);
  assert.equal(v.hidden,true);
  assert.equal(v.halos.length,0);
  assert.equal(v.overflow,false,'mobile and desktop remain horizontally contained');
  assert.deepEqual(errors,[],'no runtime errors');
  reports.push({viewport,theme:viewport.width===390?'dark':'light',initialMatches:[2,3],
   tempoProof:true,muteProof:true,otherDegreeProof:true,otherCycleProof:true,
   firstEventMatches:3,clearsHalo:true});
  await page.screenshot({path:dir+'/'+viewport.width+'-final.png',fullPage:true});
  await page.close();
 }
 fs.writeFileSync(dir+'/report.json',JSON.stringify({status:'PASS',realChromium:true,
  absoluteTimeMathematics:true,sourceAndSchedulerUnchanged:true,reports},null,2));
 console.log('PASS exact cross-lane first-occurrence timing, BPM updates, muted distinction, responsive root halo geometry, and dynamic 1/2/4-bar counterparts');
}finally{await browser.close();}
