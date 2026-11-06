import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const math=require('../math-io.js');
const eps=1e-10;
const valid=[
 ['1+0i',{a:1,b:0}],['-1+0i',{a:-1,b:0}],
 ['0+1i',{a:0,b:1}],['cos(0)+i sin(0)',{a:1,b:0}],
 ['cos(pi/3)+i sin(pi/3)',{a:.5,b:Math.sqrt(3)/2}],
 ['2(cos(pi/4)+i sin(pi/4))',{a:Math.sqrt(2),b:Math.sqrt(2)}],
 ['e^(i*pi/2)',{a:0,b:1}],['-i',{a:0,b:-1}],
 ['-2.5+3.125i',{a:-2.5,b:3.125}],['2i',{a:0,b:2}],
 ['3*pi/4',null]
];
for(const [expr,expected] of valid){
 if(expected===null){assert.ok(Math.abs(math.parseAngle(expr)-3*Math.PI/4)<eps);continue}
 const z=math.parseComplex(expr);
 assert.ok(Math.abs(z.a-expected.a)<eps&&Math.abs(z.b-expected.b)<eps,
  'correct literal/polar/exponential parse '+expr+': '+JSON.stringify(z));
}
const forbidden=[
 '', '1+','1+', 'cos(pi/3)+isin(pi/4)', 'e^(i*pi/0)',
 'cos(pi/0)+isin(pi/0)', 'tan(1)+isin(1)', 'Math.random()',
 'eval(1)', 'constructor.constructor(1)', '__proto__',
 '1;process.exit(1)', '<img src=x onerror=alert(1)>',
 '1+Infinityi', '1e309+0i', '2/0+1i',
 '9'.repeat(141), 'cos(pi/3)+isin(0)', 'foo',
 '0/0', 'e^(i*undefined)', 'sin(0)+cos(0)'
];
for(const expr of forbidden)
 assert.throws(()=>math.parseComplex(expr),Error,'unsafe or incomplete expression must be rejected: '+expr.slice(0,24));
let seed=0x973205;const rand=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
for(let i=0;i<200;i++){
 const a=(rand()*20-10).toFixed(6),b=(rand()*20-10).toFixed(6);
 const expr=a+(Number(b)<0?'':'+' )+b+'i';
 const z=math.parseComplex(expr);
 assert.ok(Math.abs(z.a-Number(a))<eps&&Math.abs(z.b-Number(b))<eps,'finite complex parse '+expr);
}
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let inspected=0;
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('.lane[data-lane="0"] .advanced-coordinates').evaluate(el=>{el.open=true});
 const entry=page.locator('.lane[data-lane="0"] details.expression-entry');
 await entry.evaluate(el=>{el.open=true});
 const input=page.locator('#trackExpression0');
 const apply=entry.locator('button').first();
 const initial=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
 for(const invalid of ['cos(pi/0)+isin(pi/0)','1+','eval(3)','a'.repeat(140)]){
  await input.fill(invalid);
  await apply.click();
  const displayed=await input.inputValue();
  const current=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
  assert.equal(displayed,invalid,'editing text remains unchanged when rejected');
  assert.deepEqual({a:current.a,b:current.b},{a:initial.a,b:initial.b},
   'invalid input does not mutate canonical complex number');
  assert.ok((await entry.locator('.expression-error').textContent()).length>0,
   'an accessible validation message is rendered');
  inspected++;
 }
 for(const [expr,expected] of valid.slice(0,7)){
  await input.fill(expr);await apply.click();
  const current=await page.evaluate(()=>window.RhythmResearch.current().tracks[0]);
  assert.ok(Math.abs(current.a-expected.a)<eps&&Math.abs(current.b-expected.b)<eps,
   'valid expression updates canonical complex state '+expr);
  assert.equal(await entry.locator('.expression-error').textContent(),'',
   'validation error clears after correct expression');
  inspected++;
 }
 assert.deepEqual(errors,[],'no runtime script errors or code execution during malicious expressions');
 await page.close();
}finally{await browser.close()}
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/expression-safety.json',JSON.stringify({
 safeExamples:valid.length,forbidden:forbidden.length,randomFiniteComplex:200,
 browserActions:inspected,secureGrammar:true,pass:true
},null,2));
console.log('PASS safe complex grammar: '+valid.length+' valid forms; '+forbidden.length+
 ' rejected; 200 deterministic numerical inputs; '+inspected+' real-browser validation cases');
