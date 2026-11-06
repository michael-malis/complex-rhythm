import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const target=page.locator('.lane[data-lane="0"]');
 await target.locator('.advanced-coordinates').evaluate(el=>{el.open=true});
 await target.locator('.mode-button').nth(0).click();
 const pairs=[[1,0],[-1,0],[0,1],[0,-1],[2,3],[-2,3],
  [-2,-3],[2,-3],[-3,0.000001],[-3,-0.000001],[4,0],[0,0]];
 const observations=[];
 for(const [a,b] of pairs){
  const others=await page.evaluate(()=>window.RhythmResearch.current().tracks.slice(1));
  await page.locator('#trackA0').fill(String(a));
  await page.locator('#trackB0').fill(String(b));
  const current=await page.evaluate(()=>({
   track:window.RhythmResearch.current().tracks[0],
   otherTracks:window.RhythmResearch.current().tracks.slice(1),
   polar:window.RhythmMath.polarOf(
    window.RhythmResearch.current().tracks[0].a,
    window.RhythmResearch.current().tracks[0].b),
   primaryRad:document.querySelector('#trackAngleRad0').value,
   primaryDeg:document.querySelector('#trackAngleDeg0').value
  }));
  assert.equal(current.track.a,a,'canonical real part remains source of truth');
  assert.equal(current.track.b,b,'canonical imaginary part remains source of truth');
  assert.deepEqual(current.otherTracks,others,'editing one canonical complex value leaves other lanes unchanged');
  assert.ok(Math.abs(current.polar.r-Math.hypot(a,b))<1e-10,'derived modulus');
  if(a===0&&b===0){
   assert.equal(current.polar.theta,null,'arg(0) must be undefined');
   assert.equal(current.primaryRad,'','visible radians must not claim arg(0)=0');
   assert.equal(current.primaryDeg,'','visible degrees must not claim arg(0)=0');
  }else{
   const expected=Math.atan2(b,a);
   const principal=expected<=-Math.PI+1e-12?Math.PI:expected;
   assert.ok(current.polar.theta>-Math.PI&&current.polar.theta<=Math.PI,
    'principal argument belongs to (-pi,pi]');
   assert.ok(Math.abs(current.polar.theta-principal)<1e-10,'derived principal argument');
   const rad=await page.evaluate(()=>window.RhythmMath.parseAngle(
    document.querySelector('#trackAngleRad0').value));
   assert.ok(Math.abs(Math.atan2(Math.sin(rad-principal),Math.cos(rad-principal)))<1e-9,
    'visible radian input is the principal argument');
   assert.ok(Math.abs(Number(current.primaryDeg)-principal*180/Math.PI)<1e-7,
    'degree input is derived, not independent state');
  }
  // Cartesian to polar and unit switches must not alter the source value.
  await target.locator('.mode-button').nth(1).click();
  await target.locator('.unit-button').click();
  await target.locator('.unit-button').click();
  await target.locator('.mode-button').nth(0).click();
  const restored=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
  assert.equal(restored.a,a,'switching view/units cannot change canonical a');
  assert.equal(restored.b,b,'switching view/units cannot change canonical b');
  observations.push({a,b,theta:current.polar.theta,r:current.polar.r,unitsPreserved:true});
 }
 assert.deepEqual(errors,[],'no browser errors while normalizing arguments and changing views');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/canonical-argument.json',JSON.stringify({
  cases:observations,unitModeSwitches:observations.length*2,pass:true
 },null,2));
 console.log('PASS canonical complex argument:',observations.length,
  'Cartesian/Polar cases, principal (-pi,pi], undefined zero argument, unit switches invariant');
 await page.close();
}finally{await browser.close()}
