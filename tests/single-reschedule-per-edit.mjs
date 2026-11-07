import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});

 const count=()=>page.evaluate(()=>window.RhythmResearch.transport());
 const check=async(name,edit)=>{
  const before=await count();
  assert.equal(before.pendingEditReschedule,false,'no already-pending redraw before '+name);
  await edit();
  await page.waitForFunction(n=>window.RhythmResearch.transport().voiceBusGenerations>n,
   before.voiceBusGenerations,{timeout:5000});
  await page.waitForTimeout(110); // includes at least one animation frame and scheduler tick
  const after=await count();
  assert.equal(after.voiceBusGenerations-before.voiceBusGenerations,1,
   name+' must cancel and replace its old voice bus exactly once');
  assert.equal(after.schedulerIntervalsCreated,before.schedulerIntervalsCreated,
   name+' must not create a new scheduler');
  assert.equal(after.schedulerIntervalsCleared,before.schedulerIntervalsCleared,
   name+' must not clear an existing scheduler');
  assert.ok(after.playing&&after.timerActive,'transport remains active after '+name);
  assert.equal(after.pendingEditReschedule,false,'no leaked update frame after '+name);
  return {name,before:before.voiceBusGenerations,after:after.voiceBusGenerations};
 };
 const measurements=[];
 measurements.push(await check('BPM edit',()=>page.locator('#bpm').evaluate(el=>{
  el.value=String(Math.min(Number(el.max),Number(el.value)+9));
  el.dispatchEvent(new Event('input',{bubbles:true}));
 })));
 measurements.push(await check('lane cycle length edit',()=>page.locator('#laneBars0').selectOption('3')));
 measurements.push(await check('root phase edit',()=>page.locator('#trackAngleDeg0').fill('37')));

 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 assert.deepEqual(errors,[],'no runtime browser exceptions');
 fs.writeFileSync('artifacts/single-reschedule-per-edit.json',JSON.stringify({
  status:'PASS',scope:'Real Web Audio transport. Every atomic parameter edit triggers one voice-bus transition.',
  measurements
 },null,2));
 console.log('PASS: one voice-bus transition per BPM/cycle/phase edit, no extra timers');
 await page.close();
}finally {await browser.close()}
