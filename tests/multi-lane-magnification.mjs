import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({
 headless:true,args:['--no-sandbox']
});
fs.mkdirSync('artifacts',{recursive:true});
const fixture=(withExtra)=>({
 format:'roots-rhythm/1',name:withExtra?'128 phases on the inner ring':'Sparse four-lane study',
 bpm:135,bars:1,
 tracks:['kick','snare','hat','bass'].map((sound,i)=>({
  a:1,b:0,n:withExtra&&i===3?64:1,sound,cycleBars:1,muted:false,
  operation:'union',gain:1,layers:withExtra&&i===3?[{a:-1,b:0,n:64,velocity:.7}]:[]
 }))
});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const importProject=async p=>{
  await page.locator('#jsonFile').setInputFiles({
   name:'magnification-test.json',mimeType:'application/json',
   buffer:Buffer.from(JSON.stringify(p))
  });
  await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),p.name);
 };
 const inspect=()=>page.evaluate(()=>{
  const box=document.querySelector('#orbitCanvas').getBoundingClientRect();
  const plot=document.querySelector('#plotArea');
  const r=window.RhythmResearch.radiiForSize(box.width);
  const data=window.RhythmResearch.current();
  const metrics=data.tracks.map((t,lane)=>{
   const e=window.RhythmResearch.eventMetadata(t).map(x=>x.phase);
   if(e.length<2)return {lane,events:e.length,chord:Infinity};
   let gap=1+e[0]-e[e.length-1];
   for(let i=1;i<e.length;i++)gap=Math.min(gap,e[i]-e[i-1]);
   return {lane,events:e.length,chord:2*r[lane]*Math.sin(Math.PI*gap)};
  });
  return {width:box.width,focused:plot.classList.contains('focused'),
   scrollWidth:plot.scrollWidth,clientWidth:plot.clientWidth,
   selectedLane:document.querySelector('.lane-select[aria-pressed="true"]')?.textContent,
   metrics};
 });
 await importProject(fixture(true));
 assert.equal((await page.locator('#trackN0').inputValue()),'1','selected outer lane remains sparse');
 await page.locator('#zoomBtn').click();
 await page.waitForFunction(()=>document.querySelector('#orbitCanvas').getBoundingClientRect().width>=4500,
  null,{timeout:10000});
 let a=await inspect();
 assert.ok(a.focused&&a.width<=5000,'focused high-density plot uses supported zoom bounds');
 assert.equal(a.metrics[3].events,128,'64 base + 64 offset roots produce 128 distinct events');
 assert.ok(a.metrics[3].chord>=34-1e-8,'innermost dense root circle uses >=34px spacing: '+JSON.stringify(a));
 assert.ok(a.scrollWidth>a.clientWidth,'zoomed graph remains pannable to inspect close roots');

 // For an isolated root family, changing a nonselected lane must
 // recalculate magnification using its new spacing, not the selected lane.
 const baseOnly=fixture(true);
 baseOnly.name='64 phases on the inner ring';
 baseOnly.tracks[3].layers=[];
 await importProject(baseOnly);
 await page.waitForFunction(()=>document.querySelector('#orbitCanvas').getBoundingClientRect().width>=2400);
 const beforeEdit=await inspect();
 await page.locator('#trackN3').fill('32');
 await page.waitForTimeout(90);
 let b=await inspect();
 assert.ok(b.width<beforeEdit.width,'reducing density on nonselected lane shrinks magnification: '+JSON.stringify([beforeEdit.width,b.width]));
 assert.ok(b.metrics[3].chord>=34-1e-8,'remaining root family remains inspectable');

 // An explicit import while zoomed resets to the geometry's actual density.
 await importProject(fixture(false));
 await page.waitForFunction(()=>Math.abs(document.querySelector('#orbitCanvas').getBoundingClientRect().width-900)<1);
 const sparse=await inspect();
 assert.equal(sparse.width,900,'sparse geometry may use the minimum zoom width');
 assert.ok(sparse.focused,'import keeps plot magnification active');

 // A new dense preset is evaluated for all lanes, not only selected.
 await importProject(fixture(true));
 await page.waitForFunction(()=>document.querySelector('#orbitCanvas').getBoundingClientRect().width>=4500);
 const restored=await inspect();
 assert.ok(restored.metrics[3].chord>=34-1e-8,'import updates high-density magnification');
 await page.locator('#zoomBtn').click();
 await page.waitForFunction(()=>document.querySelector('#zoomBtn').getAttribute('aria-pressed')==='false');
 assert.deepEqual(errors,[],'no runtime JS exceptions');
 fs.writeFileSync('artifacts/multi-lane-magnification.json',JSON.stringify({
  status:'PASS',initial:a,baseOnlyBeforeEdit:beforeEdit,afterNonselectedEdit:b,sparse,restored
 },null,2));
 console.log('PASS: 128 phases on a nonselected inner lane remain separable after zoom, live edit and import');
 await page.close();
}finally {await browser.close()}
