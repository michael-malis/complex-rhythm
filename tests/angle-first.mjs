import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const close=(a,b,tol=1e-8)=>Math.abs(a-b)<tol;
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#compositionPanel').evaluate(el=>{el.open=true});
 const fixture={format:'roots-rhythm/1',name:'Angle test fixture',bpm:120,bars:1,tracks:[
  {a:2.5,b:0,n:4,sound:'technoKick',cycleBars:1,muted:false,layers:[]},
  {a:0,b:0,n:1,sound:'fmPerc',cycleBars:1,muted:true,layers:[]},
  {a:0,b:0,n:1,sound:'metallic',cycleBars:1,muted:true,layers:[]},
  {a:0,b:0,n:1,sound:'noiseBurst',cycleBars:1,muted:true,layers:[]}
 ]};
 await page.locator('#jsonFile').setInputFiles({
  name:'angular.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.startsWith('Imported rhythm:'));
 assert.equal(await page.locator('#trackAngleRad0').count(),1,'radians always visible');
 assert.equal(await page.locator('#trackAngleDeg0').count(),1,'degrees always visible');
 assert.equal(await page.locator('#trackN0').count(),1,'degree always visible');
 assert.equal(await page.locator('#rootRuleEquation .katex').count(),1,'root-rule infographic rendered');
 assert.equal(await page.locator('#rootRuleEquation math').count(),1,'root-rule semantic MathML');
 await page.locator('#trackAngleRad0').fill('2π/3');
 assert.ok(close(Number(await page.locator('#trackAngleDeg0').inputValue()),120),
  'pi expression synchronizes degrees without hidden toggle');
 let c=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
 assert.ok(close(Math.atan2(c.b,c.a),2*Math.PI/3),'canonical angle is two pi thirds');
 assert.equal(c.n,4,'angle edit preserves root count');
 assert.ok(close(Math.hypot(c.a,c.b),2.5),'angle-only edit retains imported non-unit magnitude');
 const previous=JSON.stringify(c);
 await page.locator('#trackAngleRad0').fill('pi/0');
 assert.equal(await page.locator('#trackAngleRad0').getAttribute('aria-invalid'),'true',
  'invalid rational pi expression is rejected');
 assert.equal(JSON.stringify(await page.evaluate(()=>window.RhythmResearch.current().tracks[0])),previous,
  'invalid angle does not mutate canonical complex state');
 await page.locator('#trackAngleDeg0').fill('0');
 assert.ok(close(Math.atan2((await page.evaluate(()=>window.RhythmResearch.current().tracks[0])).b,
  (await page.evaluate(()=>window.RhythmResearch.current().tracks[0])).a),0),'degrees synchronized with canonical complex');
 assert.ok(close(Math.hypot(
  (await page.evaluate(()=>window.RhythmResearch.current().tracks[0])).a,
  (await page.evaluate(()=>window.RhythmResearch.current().tracks[0])).b),2.5),
  'degree editing also preserves the original complex modulus');
 assert.equal(await page.locator('#baseCount').textContent(),'4','four base root events');
 await page.locator('#addLayer').click();
 assert.equal(await page.locator('#layer0AngleRad').count(),1,'additional angle is direct radian input');
 assert.equal(await page.locator('#layer0AngleDeg').count(),1,'additional angle is direct degree input');
 assert.equal(await page.locator('#layer0n').count(),0,'individual angle has no unnecessary root degree field');
 assert.equal(await page.locator('#unionCount').textContent(),'5','45-degree accent adds one event to quarter roots');
 await page.locator('#addRootFamily').click();
 assert.equal(await page.locator('#layer1n').inputValue(),'3','generated root family defaults to degree three');
 assert.equal(await page.locator('#unionCount').textContent(),'7','R4 union R3 and 45-degree accent: seven phases');
 await page.locator('#layer0AngleDeg').fill('120');
 assert.ok(close(await page.evaluate(()=>window.RhythmMath.parseAngle(document.getElementById('layer0AngleRad').value)),2*Math.PI/3),
  'additional angle decimal degrees -> corresponding radian');
 assert.equal(await page.locator('#unionCount').textContent(),'6','two identical event phases merge within one lane');
 const metadata=await page.evaluate(()=>{
  const t=window.RhythmResearch.current().tracks[0];
  return window.RhythmResearch.eventMetadata(t);
 });
 assert.ok(metadata.some(ev=>ev.sources.some(s=>s.kind==='additional'&&s.sourceIndex===0)),
  'added single-angle source is kept in events');
 const before=JSON.stringify(metadata);
 await page.locator('#fileMenu summary').click();
 const dl=page.waitForEvent('download');
 await page.locator('#saveBtn').click();
 const saved=fs.readFileSync(await(await dl).path(),'utf8');
 await page.locator('#jsonFile').setInputFiles({
  name:'angular-return.json',mimeType:'application/json',buffer:Buffer.from(saved)
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.startsWith('Imported rhythm:'));
 const after=await page.evaluate(()=>{
  const t=window.RhythmResearch.current().tracks[0];
  return {events:JSON.stringify(window.RhythmResearch.eventMetadata(t)),layers:t.layers};
 });
 assert.equal(after.events,before,'JSON roundtrip preserves all actual event phases and sources');
 assert.deepEqual(after.layers.map(l=>l.n),[1,3],'JSON retains single added angle and generated root family');
 // Imported single-angle layers may carry non-unit complex magnitudes.
 const importedLayerFixture={...fixture,tracks:fixture.tracks.map((t,i)=>i===0?{
  ...t,layers:[{a:2,b:0,n:1,velocity:.7}]
 }:t)};
 await page.locator('#jsonFile').setInputFiles({
  name:'magnitude.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(importedLayerFixture))
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.startsWith('Imported rhythm:'));
 await page.locator('#layer0AngleDeg').fill('45');
 const layer=await page.evaluate(()=>window.RhythmResearch.current().tracks[0].layers[0]);
 assert.ok(close(Math.hypot(layer.a,layer.b),2),'editing a legacy additional angle preserves its modulus');
 assert.ok(close(await page.evaluate(()=>window.RhythmMath.parseAngle(document.getElementById('layer0AngleRad').value)),Math.PI/4),
  'edited additional degrees synchronize radians');
 assert.deepEqual(errors,[],'no runtime script errors');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/angle-first.json',JSON.stringify({
  tested:'angle input, π fractions, explicit degrees, one event, generated family, deduplication and JSON',
  events:metadata.length,pass:true
 },null,2));
 console.log('PASS angle-first editor, single angle, root generator, duplicate merging and JSON');
 await page.close();
}finally{await browser.close()}
