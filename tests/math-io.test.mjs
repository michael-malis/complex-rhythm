import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),m=require('../math-io.js');
let passed=0;
function ok(cond,msg){assert.ok(cond,msg);passed++}
function eq(actual,expected,msg){assert.equal(actual,expected,msg);passed++}
const close=(a,b,tol=1e-8)=>Math.abs(a-b)<=tol;
for(const [src,a,b] of [ ['1+0i',1,0],['-1+0i',-1,0],['0+1i',0,1],['cos(0)+i sin(0)',1,0],['cos(pi/3)+i sin(pi/3)',.5,Math.sqrt(3)/2],['2(cos(pi/4)+i sin(pi/4))',Math.sqrt(2),Math.sqrt(2)],['e^(i*pi/2)',0,1]]){const z=m.parseComplex(src);ok(close(z.a,a)&&close(z.b,b),'parse '+src)}
for(const v of ['alert(1)','sin(pi/0)','cos(pi/3)+i sin(pi/4)','1/0','e^(i*pi/0)',('1'.repeat(141))]){let fail=false;try{m.parseComplex(v)}catch(e){fail=true}ok(fail,'reject '+v.slice(0,22))}
const q=m.rootPhases(1,0,4);ok([0,.25,.5,.75].every((v,i)=>close(q[i],v)),'fourth roots of unit');
const neg=m.rootPhases(-1,0,2);ok(close(neg[0],.25)&&close(neg[1],.75),'square roots of -1');
const imaginary=m.rootPhases(0,1,4);ok([1/16,5/16,9/16,13/16].every((v,i)=>close(imaginary[i],v)),'fourth roots of i');
eq(m.rootPhases(0,0,4).length,0,'zero creates no rhythm events');
for(const [a,b] of [[1,2],[-1,2],[-1,-2],[1,-2]]){const p=m.polarOf(a,b),z=m.fromPolar(p.r,p.theta);ok(close(a,z.a)&&close(b,z.b),'round-trip quadrant')}
eq(m.polarOf(0,0).theta,null,'zero argument undefined');
for(const n of [17,32,64])eq(m.rootPhases(1,0,n).length,n,'high degree '+n);
const a=m.rootPhases(1,0,4),b=m.rootPhases(1,0,3);
eq(m.unique(a.concat(b)).length,6,'union has six events');eq(m.intersection(a,b).length,1,'intersection one event');
eq(m.euclidean(5,16).length,5,'Euclidean 5/16');eq(m.euclidean(0,16).length,0,'Euclidean zero');eq(m.euclidean(16,16).length,16,'Euclidean all');
eq(m.lcm([2,3,4]),12,'LCM');
console.log('PASS mathematical utility tests:',passed);
