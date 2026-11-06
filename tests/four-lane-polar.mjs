import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const before=await page.evaluate(()=>window.RhythmResearch.current());
 const results=[];
 for(let i=0;i<4;i++){
  const row=page.locator('.lane[data-lane="'+i+'"]');
  await row.locator('.mode-button').nth(1).click();
  assert.equal(await row.locator('.mode-button').nth(1).getAttribute('aria-pressed'),'true',
   'Polar mode active on lane '+(i+1));
  assert.equal(await page.locator('#trackR'+i).count(),1,'lane '+(i+1)+' has editable modulus');
  assert.equal(await page.locator('#trackTheta'+i).count(),1,'lane '+(i+1)+' has editable argument');
  const radius=2+i,theta=(i+1)*Math.PI/5;
  await page.locator('#trackR'+i).fill(String(radius));
  await page.locator('#trackTheta'+i).fill(String(theta));
  const current=await page.evaluate(()=>window.RhythmResearch.current().tracks);
  assert.ok(Math.abs(current[i].a-radius*Math.cos(theta))<1e-10&&
    Math.abs(current[i].b-radius*Math.sin(theta))<1e-10,
    'Polar editing changes canonical a,b correctly on lane '+(i+1));
  for(let j=0;j<4;j++)if(j!==i){
   const unchanged=(await page.evaluate(index=>window.RhythmResearch.current().tracks[index],j));
   const reference=j<i?results[j].canonical:before.tracks[j];
   assert.deepEqual([unchanged.a,unchanged.b,unchanged.n],[reference.a,reference.b,reference.n],
    'editing one lane cannot mutate other lane '+(j+1));
  }
  await row.locator('.unit-button').click();
  assert.ok((await row.locator('.unit-button').textContent()).includes('degrees'),'degrees visible on lane '+(i+1));
  const thetaDegrees=Number(await page.locator('#trackTheta'+i).inputValue());
  assert.ok(Math.abs(thetaDegrees-theta*180/Math.PI)<1e-8,'degrees are derived from canonical radians');
  await row.locator('.unit-button').click();
  const thetaRadians=Number(await page.locator('#trackTheta'+i).inputValue());
  assert.ok(Math.abs(thetaRadians-theta)<1e-10,'radians restored without changing canonical value');
  await row.locator('.mode-button').nth(0).click();
  assert.equal(await row.locator('.mode-button').nth(0).getAttribute('aria-pressed'),'true',
   'Cartesian active on lane '+(i+1));
  const a=Number(await page.locator('#trackA'+i).inputValue()),
   b=Number(await page.locator('#trackB'+i).inputValue());
  assert.ok(Math.abs(a-current[i].a)<1e-10&&Math.abs(b-current[i].b)<1e-10,
   'Cartesian a,b are synchronized after polar editing lane '+(i+1));
  assert.equal(await row.locator('.lane-alternate-math .katex').count(),1,
   'inactive coordinate form remains mathematically readable');
  results.push({lane:i+1,radius,theta,canonical:{a:current[i].a,b:current[i].b,n:current[i].n},
   degreeValue:thetaDegrees});
 }
 // Exactly zero is a defined modulus with undefined argument, not 0 radians.
 await page.locator('#trackA3').fill('0');
 await page.locator('#trackB3').fill('0');
 await page.locator('.lane[data-lane="3"] .mode-button').nth(1).click();
 assert.equal(await page.locator('#trackR3').inputValue(),'0','zero modulus displayed');
 assert.equal(await page.locator('#trackTheta3').isDisabled(),true,'argument of zero disabled');
 await page.locator('#trackR3').fill('2');
 assert.equal(await page.locator('#trackTheta3').isDisabled(),false,
  'restoring nonzero modulus re-enables the angle editor');
 const recovered=await page.evaluate(()=>window.RhythmResearch.current().tracks[3]);
 assert.ok(Math.abs(recovered.a-2)<1e-10&&Math.abs(recovered.b)<1e-10,
  'zero recovery preserves a mathematically valid complex value');
 assert.deepEqual(errors,[],'all lanes work without runtime errors');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/four-lane-polar.json',JSON.stringify({lanes:results,zeroRecovery:recovered,pass:true},null,2));
 console.log('PASS four-lane Cartesian/Polar: 4 separately edited complex numbers, both unit systems, no cross-lane mutations, zero recovery');
 await page.close();
}finally{await browser.close()}
