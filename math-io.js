/* Safe mathematical utilities: no eval, no user-code execution. */
(function(root){'use strict';
function mathPrincipalArg(b,a) {
 const th=Math.atan2(b,a);return th<=-Math.PI+1e-12?Math.PI:th;
}
function mathPolarOf(a,b) {
 const r=Math.hypot(a,b);return {r,theta:r===0?null:mathPrincipalArg(b,a)};
}
function mathFromPolar(r,theta) {
 if(!Number.isFinite(r)||r<0||!Number.isFinite(theta))throw Error('Invalid polar coordinates');
 const snap=v=>Math.abs(v)<1e-12?0:Number(v.toPrecision(12));
 return {a:snap(r*Math.cos(theta)),b:snap(r*Math.sin(theta))};
}
function mathAngle(input) {
 const s=input.toLowerCase().replace(/\s+/g,'');
 if(!s||s.length>80)throw Error('Invalid angle expression');
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return Number(s);
 const m=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)?\*?)pi(?:\/(\d+(?:\.\d+)?))?$/);
 if(!m)throw Error('Angles must be a number, pi, pi/3 or 3*pi/4');
 const coefficient=m[1]===''||m[1]==='+'?1:m[1]==='-'?-1:Number(m[1].replace(/\*$/,''));
 const divisor=m[2]===undefined?1:Number(m[2]);
 if(divisor===0)throw Error('Division by zero');
 const value=coefficient*Math.PI/divisor;
 if(!Number.isFinite(value))throw Error('Angle is not finite');
 return value;
}
function mathParseComplex(source) {
 if(typeof source!=='string'||source.length>140)throw Error('Expression is too long');
 const s=source.toLowerCase().replace(/\s+/g,'');
 if(!s)throw Error('Enter a complex expression');
 if(!/^[0-9+\-*.()/^eicosnp]+$/.test(s))throw Error('Unexpected characters');
 const d='(?:\\d+(?:\\.\\d*)?|\\.\\d+)',p='[+-]?'+d;
 let m=s.match(new RegExp('^('+p+')([+-]'+d+')i$'));
 if(m)return {a:Number(m[1]),b:Number(m[2])};
 m=s.match(new RegExp('^('+p+')$'));if(m)return{a:Number(m[1]),b:0};
 if(s==='i'||s==='+i')return{a:0,b:1};
 if(s==='-i')return{a:0,b:-1};
 m=s.match(new RegExp('^('+p+')i$'));if(m)return{a:0,b:Number(m[1])};
 m=s.match(/^e\^\(i\*(.+)\)$/);if(m)return mathFromPolar(1,mathAngle(m[1]));
 m=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)?)\(?cos\(([^()]+)\)\+isin\(([^()]+)\)\)?$/);
 if(m){
  const r=m[1]===''||m[1]==='+'?1:m[1]==='-'?-1:Number(m[1]);
  const x=mathAngle(m[2]),y=mathAngle(m[3]);
  if(Math.abs(Math.sin(x-y))>1e-10||Math.abs(Math.cos(x-y)-1)>1e-10)throw Error('Sine and cosine angles must agree');
  const out=mathFromPolar(Math.abs(r),r<0?x+Math.PI:x);
  return out;
 }
 throw Error('Use a+bi, cos(angle)+i sin(angle), r(cos(angle)+i sin(angle)) or e^(i*angle)');
}
function mathRootPhases(a,b,n) {
 if(!Number.isInteger(n)||n<1||n>64)throw Error('Degree must be 1–64');
 if(!Number.isFinite(a)||!Number.isFinite(b))throw Error('Non-finite complex component');
 if(a===0&&b===0)return[];
 const theta=mathPrincipalArg(b,a),tau=2*Math.PI;
 return Array.from({length:n},(_,k)=>(((theta+tau*k)/(tau*n))%1+1)%1);
}
function mathUnique(phases,tol=1e-6) {
 const arr=phases.map(x=>((x%1)+1)%1).sort((a,b)=>a-b);
 const out=[];for(const v of arr)if(!out.length||v-out[out.length-1]>tol)out.push(v);
 if(out.length>1&&1+out[0]-out[out.length-1]<=tol)out.pop();
 return out;
}
function mathIntersect(a,b,tol=1e-6) {
 return mathUnique(a,tol).filter(x=>b.some(y=>{let d=Math.abs(x-y)%1;return Math.min(d,1-d)<=tol}));
}
function mathEuclidean(k,n,rotation=0) {
 if(!Number.isInteger(n)||n<1||n>256||!Number.isInteger(k)||k<0||k>n||!Number.isInteger(rotation))throw Error('Euclidean rhythm needs 0≤k≤N≤256');
 if(!k)return[];
 const phases=[];for(let j=0;j<n;j++)if(Math.floor(j*k/n)!==Math.floor((j-1)*k/n))phases.push((((j+rotation)%n+n)%n)/n);
 return phases.sort((a,b)=>a-b);
}
function mathLCM(nums) {
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 if(!Array.isArray(nums)||!nums.length||nums.some(x=>!Number.isInteger(x)||x<1||x>16))throw Error('Cycle lengths must be integers 1..16');
 return nums.reduce((a,b)=>a/gcd(a,b)*b,1);
}

function mathPlanEvents(lanes,barSeconds,fromSeconds,toSeconds) {
 if(!Array.isArray(lanes)||lanes.length>32||!Number.isFinite(barSeconds)||barSeconds<=0||
  !Number.isFinite(fromSeconds)||!Number.isFinite(toSeconds)||fromSeconds<0||toSeconds<fromSeconds||
  toSeconds-fromSeconds>256*barSeconds)throw Error('Invalid bounded polymetric time window');
 const result=[];
 for(let i=0;i<lanes.length;i++){
  const lane=lanes[i],bars=lane.cycleBars||1;
  if(!Number.isInteger(bars)||bars<1||bars>16)throw Error('Lane cycle length must be 1..16 bars');
  if(lane.muted)continue;
  const period=bars*barSeconds;
  const values=lane.events||[];
  if(values.length>256)throw Error('Too many events in one lane');
  const fromCycle=Math.max(0,Math.floor(fromSeconds/period)-1);
  const toCycle=Math.ceil(toSeconds/period)+1;
  for(let k=fromCycle;k<=toCycle;k++){
   for(let j=0;j<values.length;j++){
    const event=values[j];
    if(!Number.isFinite(event.phase)||event.phase<0||event.phase>=1)throw Error('Event phase must be in [0,1)');
    const time=(k+event.phase)*period;
    if(time>=fromSeconds-1e-10 && time<toSeconds-1e-10){
     result.push({lane:i,cycle:k,sourceEvent:j,phase:event.phase,time,velocity:event.velocity??1});
    }
   }
  }
 }
 return result.sort((a,b)=>a.time-b.time||a.lane-b.lane||a.sourceEvent-b.sourceEvent);
}
function mathCommonCycle(lanes){
 if(!Array.isArray(lanes)||!lanes.length)throw Error('At least one lane is required');
 return mathLCM(lanes.map(l=>l.cycleBars||1));
}
function mathPhaseAt(elapsedSeconds,cycleBars,barSeconds){
 if(!Number.isFinite(elapsedSeconds)||!Number.isFinite(barSeconds)||barSeconds<=0||
 !Number.isInteger(cycleBars)||cycleBars<1||cycleBars>16)throw Error('Invalid phase calculation');
 const span=barSeconds*cycleBars;
 return (((elapsedSeconds/span)%1)+1)%1;
}
const exports={principalArg:mathPrincipalArg,polarOf:mathPolarOf,fromPolar:mathFromPolar,parseAngle:mathAngle,parseComplex:mathParseComplex,rootPhases:mathRootPhases,unique:mathUnique,intersection:mathIntersect,euclidean:mathEuclidean,lcm:mathLCM,planEvents:mathPlanEvents,commonCycle:mathCommonCycle,phaseAt:mathPhaseAt};
root.RhythmMath=Object.freeze(exports);
if(typeof module!=='undefined'&&module.exports)module.exports=exports;
})(typeof window!=='undefined'?window:globalThis);
