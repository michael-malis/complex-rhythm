import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const fixture={format:'roots-rhythm/1',name:'Live degree input stability',bpm:120,bars:1,
  tracks:['kick','snare','hat','bass'].map(sound=>({
   a:1,b:0,n:3,sound,cycleBars:1,muted:false,operation:'union',layers:[]
  }))
 };
 await page.locator('#jsonFile').setInputFiles({
  name:'degree-caret.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
 });
 await page.waitForFunction(name=>document.querySelector('#toast').textContent.includes('Imported rhythm: '+name),fixture.name);
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>window.RhythmResearch.transport().playing);
 const initial=await page.evaluate(()=>window.RhythmResearch.transport());
 const records=[];
 for(let i=0;i<4;i++){
  await page.locator('.lane[data-lane="'+i+'"] .lane-select').click();
  await page.locator('#trackN'+i).fill(String(i+3));
  const input=page.locator('#trackAngleDeg'+i);
  await input.fill('10');
  await input.evaluate(el=>{el.focus();el.setSelectionRange(1,1)});
  await page.keyboard.type('2');
  const v=await page.evaluate(index=>{
   const el=document.getElementById('trackAngleDeg'+index),t=window.RhythmResearch.current().tracks[index];
   const phases=window.RhythmResearch.rootPhases(t);
   return {value:el.value,selectionStart:el.selectionStart,selectionEnd:el.selectionEnd,
    focused:document.activeElement===el,invalid:el.getAttribute('aria-invalid'),
    n:t.n,phases,expected:1/(3*t.n),
    math:!!document.querySelector('#laneEq'+index+' .katex')&&
     !!document.querySelector('#laneEq'+index+' math'),
    summary:document.querySelector('#laneCount'+index).textContent,
    transport:window.RhythmResearch.transport()};
  },i);
  assert.equal(v.value,'120','no dropped/reordered character in lane '+i);
  assert.equal(v.selectionStart,2,'caret position is not reset by formula re-render in lane '+i);
  assert.equal(v.selectionEnd,2,'selection is preserved in lane '+i);
  assert.equal(v.focused,true,'typing keeps angular input focused in lane '+i);
  assert.equal(v.invalid,'false');
  assert.equal(v.phases.length,v.n,'root positions update with degree');
  assert.ok(Math.abs(v.phases[0]-v.expected)<1e-8,
   'canonical mathematical phase and entered 120 degrees agree in lane '+i);
  assert.ok(v.math&&v.summary.includes(String(v.n)),'KaTeX, MathML and event count update');
  assert.ok(v.transport.playing&&v.transport.timerActive,'audio stays active');
  assert.equal(v.transport.schedulerIntervalsCreated,initial.schedulerIntervalsCreated,
   'no duplicate audio transport scheduler for live math edits');
  records.push({lane:i,deg:v.value,n:v.n,firstPhase:v.phases[0],caret:v.selectionStart,
   busGeneration:v.transport.voiceBusGenerations});
 }
 await page.locator('.lane[data-lane="0"] .lane-select').click();
 await page.locator('#compositionPanel').evaluate(el=>el.open=true);
 await page.locator('#addLayer').click();
 const add=page.locator('#layer0AngleDeg');
 await add.fill('10');
 await add.evaluate(el=>{el.focus();el.setSelectionRange(1,1)});
 await page.keyboard.type('2');
 const layer=await page.evaluate(()=>{
  const el=document.getElementById('layer0AngleDeg'),t=window.RhythmResearch.current().tracks[0];
  return {value:el.value,caret:el.selectionStart,focused:document.activeElement===el,
   layer:t.layers[0],events:window.RhythmResearch.events(t).length,
   counter:Number(document.querySelector('#unionCount').textContent),
   playing:window.RhythmResearch.transport().playing};
 });
 assert.equal(layer.value,'120','additional point degree input accepts full text');
 assert.equal(layer.caret,2,'added angle cursor remains in place');
 assert.ok(layer.focused&&layer.playing,'focus and audio preserved during added point edit');
 assert.equal(layer.counter,layer.events,'union strip and mathematical event list remain synchronized');
 assert.ok(Math.abs(Math.atan2(layer.layer.b,layer.layer.a)-2*Math.PI/3)<1e-7,
  'added point is placed at the entered argument');
 await page.waitForTimeout(80);
 const final=await page.evaluate(()=>window.RhythmResearch.transport());
 assert.ok(final.playing&&final.timerActive,'transport survives all five edits');
 assert.equal(final.schedulerIntervalsCreated,initial.schedulerIntervalsCreated,'one transport scheduler');
 await page.locator('#playBtn').click();
 await page.waitForFunction(()=>!window.RhythmResearch.transport().playing);
 assert.deepEqual(errors,[],'no browser JavaScript exceptions');
 fs.writeFileSync('artifacts/math-live-input-stability.json',JSON.stringify({
  status:'PASS',scope:'Four root-degree/angle inputs plus a union-point input with live audio/KaTeX/MathML/caret agreement',
  records,layer:{...layer,layer:{...layer.layer}},transport:final
 },null,2));
 console.log('PASS four lane angle editors and additional point keep caret, focus, formulas, phase map and single audio scheduler');
 await page.close();
}finally{await browser.close()}
