import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts/four-ring-identity',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const colors={light:['#ab5847','#567a63','#967438','#80618a'],
 dark:['#df9883','#98b39a','#d5b16e','#bda0ca']};
const fixture={format:'roots-rhythm/1',name:'Four ring identities',
 bpm:116,bars:1,tracks:[
  {a:1,b:0,n:1,cycleBars:1,sound:'kick',muted:false,layers:[]},
  {a:1,b:0,n:1,cycleBars:1,sound:'hat',muted:false,layers:[]},
  {a:1,b:0,n:1,cycleBars:2,sound:'rim',muted:true,layers:[]},
  {a:1,b:0,n:1,cycleBars:4,sound:'acidClassic',muted:false,layers:[]}
 ]};
const report=[];
async function frame(page){
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function readRings(page){
 await frame(page);
 return page.evaluate(()=>{
  const canvas=document.getElementById('orbitCanvas'),box=canvas.getBoundingClientRect(),
   ctx=canvas.getContext('2d'),side=Math.min(box.width,box.height),
   radii=window.RhythmResearch.radiiForSize(side),scale=canvas.width/box.width,
   calls=(window.__ringCalls||[]).slice(-4),
   bg=getComputedStyle(document.documentElement).getPropertyValue('--plot').trim();
  return {
   calls,aria:canvas.getAttribute('aria-label'),tracks:window.RhythmResearch.current().tracks,
   transport:window.RhythmResearch.transport(),
   horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,
   pixels:radii.map((r,i)=>{
    const x=Math.round((box.width/2+r)*scale),y=Math.round(box.height/2*scale);
    const samples=[];
    for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)
     samples.push([...ctx.getImageData(x+dx,y+dy,1,1).data].slice(0,3));
    return {lane:i,samples};
   })
  };
 });
}
function checkRings(state,theme,selected){
 assert.equal(state.calls.length,4,'four real full-circle Canvas strokes within one animation frame: '+JSON.stringify(state.calls));
 for(let i=0;i<4;i++){
  const c=state.calls[i],expected=colors[theme][i];
  assert.equal(c.color.toLowerCase(),expected,'lane '+(i+1)+' keeps its own circle color: '+JSON.stringify(state.calls));
  assert.ok(Math.abs(c.width-(i===selected?2.5:1.6))<1e-6,
   'selected lane has a visually heavier ring, never a different hue');
  const alpha=i===selected?1:state.tracks[i].muted?.85:.88;
  assert.ok(Math.abs(c.alpha-alpha)<1e-6,'muted and selected ring visibility is explicit');
  const palette=expected.match(/[a-f\d]{2}/gi).slice(0,3).map(h=>parseInt(h,16));
  const bg=theme==='dark'?[32,34,29]:[250,248,243];
  const mixed=palette.map((v,j)=>Math.round(alpha*v+(1-alpha)*bg[j]));
  const luminance=rgb=>{
   const v=rgb.map(k=>{const x=k/255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)});
   return .2126*v[0]+.7152*v[1]+.0722*v[2];
  };
  const foreground=luminance(mixed),background=luminance(bg);
  const contrast=(Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05);
  assert.ok(contrast>=3,'visible ring has at least 3:1 contrast on plot background: '+contrast);
  const dist=state.pixels[i].samples.reduce((best,p)=>Math.min(best,
   Math.max(...p.map((v,j)=>Math.abs(v-mixed[j])))),Infinity);
  assert.ok(dist<45,'actual ring pixels reflect lane '+(i+1)+' colored strokes: distance '+dist);
 }
 assert.ok(!state.horizontalOverflow,'color treatment never causes page overflow');
}
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  await page.addInitScript(()=>{
   const arc=CanvasRenderingContext2D.prototype.arc,stroke=CanvasRenderingContext2D.prototype.stroke;
   const clear=CanvasRenderingContext2D.prototype.clearRect;
   CanvasRenderingContext2D.prototype.clearRect=function(...args){
    if(this.canvas?.id==='orbitCanvas')window.__ringCalls=[];
    this.__lastTestArc=null;
    return clear.apply(this,args);
   };
   CanvasRenderingContext2D.prototype.arc=function(x,y,r,start,end,...args){
    this.__lastTestArc={x,y,r,start,end};
    return arc.call(this,x,y,r,start,end,...args);
   };
   CanvasRenderingContext2D.prototype.stroke=function(...args){
    const a=this.__lastTestArc;
    if(this.canvas?.id==='orbitCanvas'&&a&&a.x===0&&a.y===0&&a.r>25&&
       a.start===0&&Math.abs(a.end-2*Math.PI)<1e-8&&
       (this.lineWidth===1.6||this.lineWidth===2.5)){
     const list=window.__ringCalls||(window.__ringCalls=[]);
     list.push({color:String(this.strokeStyle),alpha:this.globalAlpha,width:this.lineWidth,r:a.r});
     if(list.length>32)list.splice(0,list.length-32);
     this.__lastTestArc=null; // a later stroke must not count this same ring twice
    }
    return stroke.apply(this,args);
   };
  });
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  await page.locator('#jsonFile').setInputFiles({
   name:'ring-identity.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(fixture))
  });
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm: Four ring identities'));
  let state=await readRings(page);
  checkRings(state,'light',0);
  assert.match(state.aria,/Selected lane 1 of 4, Kick, 1 visible event in 1 bar/);
  const initial=state.tracks,intervals=state.transport.schedulerIntervalsCreated;

  await page.locator('.lane[data-lane="2"] .lane-select').click();
  state=await readRings(page);
  checkRings(state,'light',2);
  assert.match(state.aria,/Selected lane 3 of 4, Rim click, 1 visible event in 2 bars, muted/);
  assert.deepEqual(state.tracks,initial,'choosing a ring does not mutate mathematical roots or voices');
  assert.equal(state.transport.schedulerIntervalsCreated,intervals);

  // Live degree edits update the Canvas's accessible event count without a
  // tooltip, new panel, changed preset or duplicate scheduler.
  await page.locator('#trackN2').fill('6');
  state=await readRings(page);
  assert.match(state.aria,/Selected lane 3 of 4, Rim click, 6 visible events in 2 bars, muted/);
  assert.equal(state.tracks[2].n,6);

  await page.locator('#themeBtn').click();
  state=await readRings(page);
  checkRings(state,'dark',2);
  assert.equal(state.tracks[2].n,6,'theme switch leaves mathematical degree unchanged');
  await page.screenshot({path:'artifacts/four-ring-identity/'+viewport.width+'-dark.png',fullPage:true});
  await page.locator('#themeBtn').click();
  state=await readRings(page);
  checkRings(state,'light',2);
  await page.screenshot({path:'artifacts/four-ring-identity/'+viewport.width+'-light.png',fullPage:true});
  assert.deepEqual(errors,[],'no browser errors in ring identity workflow');
  report.push({viewport,colors:colors.light,themeSwitch:'light-dark-light',
   selectedLane:3,degreeEdited:6,mutedLaneLegible:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/four-ring-identity/report.json',
  JSON.stringify({status:'PASS',realCanvasPixels:true,realCanvasStrokeCalls:true,
   responsiveStates:report.length*2,report},null,2));
 console.log('PASS four persistent lane-colored rings, selected emphasis, muted identity, Canvas pixel samples and accessible count across two viewports and themes');
}finally{await browser.close();}
