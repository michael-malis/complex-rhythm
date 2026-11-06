/* Root-angle geometry uses RhythmMath, not a second event engine. */
(function(root){'use strict';
const TAU=2*Math.PI,NS='http://www.w3.org/2000/svg';
const number=x=>String(Number(x.toFixed(3)));
function piTeX(rad){
 if(Math.abs(rad)<1e-9)return '0';
 for(let q=1;q<=36;q++){
  const p=Math.round(rad/Math.PI*q);
  if(Math.abs(rad/Math.PI-p/q)>1e-7)continue;
  const top=(p<0?'-':'')+(Math.abs(p)===1?'':Math.abs(p))+'\\pi';
  return q===1?top:'\\frac{'+top+'}{'+q+'}';
 }
 return number(rad)+'\\,\\mathrm{rad}';
}
function model(a,b,n){
 if(!Number.isFinite(a)||!Number.isFinite(b)||!Number.isInteger(n)||n<1||n>64)
  throw Error('Invalid root infographic state');
 const zero=a===0&&b===0,theta=zero?null:root.RhythmMath.principalArg(b,a);
 const phases=zero?[]:root.RhythmMath.rootPhases(a,b,n);
 return {zero,theta,thetaDeg:theta===null?null:Number((theta*180/Math.PI).toFixed(3)),
  n,spacing:TAU/n,spacingDeg:360/n,
  roots:phases.map((phase,k)=>({k,phase,rad:phase*TAU,
   deg:Number((phase*360).toFixed(3)),tex:piTeX(phase*TAU)}))};
}
function node(tag,props={},value){
 const el=document.createElementNS(NS,tag);
 for(const [key,v] of Object.entries(props))el.setAttribute(key,String(v));
 if(value!==undefined)el.textContent=value;
 return el;
}
function draw(svg,data){
 svg.replaceChildren();
 svg.setAttribute('viewBox','0 0 280 280');
 svg.setAttribute('role','img');
 svg.setAttribute('aria-label',data.zero?'Unit timing circle without roots':
  'Unit timing circle with '+data.n+' complex-root phases, zero at the top, clockwise');
 const cx=140,cy=140,r=95;
 svg.append(node('title',{},'Complex roots mapped to the rhythm wheel'));
 for(const a of [0,Math.PI/2])
  svg.append(node('line',{x1:cx-110*Math.cos(a),y1:cy-110*Math.sin(a),
   x2:cx+110*Math.cos(a),y2:cy+110*Math.sin(a),class:'root-info-axis'}));
 svg.append(node('circle',{cx,cy,r,class:'root-info-circle'}));
 for(const [label,x,y] of [['0°',140,20],['90°',261,145],['180°',140,272],['270°',21,145]])
  svg.append(node('text',{x,y,'text-anchor':'middle',class:'root-info-axis-text'},label));
 if(data.theta!==null)
  svg.append(node('line',{x1:cx,y1:cy,x2:cx+r*Math.sin(data.theta),
   y2:cy-r*Math.cos(data.theta),class:'root-info-input-ray'}));
 for(const hit of data.roots){
  const x=cx+r*Math.sin(hit.rad),y=cy-r*Math.cos(hit.rad);
  if(data.n<=16)svg.append(node('line',{x1:cx,y1:cy,x2:x,y2:y,class:'root-info-spoke'}));
  const marker=node('circle',{cx:x,cy:y,r:hit.k===0?5.5:3.8,
   class:'root-info-marker'+(hit.k===0?' first':'')});
  marker.append(node('title',{},'Root '+hit.k+': '+number(hit.deg)+' degrees'));
  svg.append(marker);
 }
 svg.append(node('circle',{cx,cy,r:2.3,class:'root-info-center'}));
}
function render(data,refs,renderMath){
 if(refs.panel.hidden)return;
 refs.panel.style.setProperty('--root-info-color','var(--track-'+(refs.lane+1)+')');
 draw(refs.diagram,data);
 renderMath(refs.input,data.zero?'\\arg(0)\\text{ is undefined}':
  '\\theta=\\arg(z)='+piTeX(data.theta)+'\\,('+number(data.thetaDeg)+'^\\circ)');
 renderMath(refs.delta,'\\Delta=\\frac{2\\pi}{n}='+piTeX(data.spacing)+
  '\\,('+number(data.spacingDeg)+'^\\circ)');
 renderMath(refs.formula,'\\theta_k=\\frac{\\theta+2\\pi k}{n}\\pmod{2\\pi}');
 refs.list.replaceChildren();
 if(data.zero){
  const li=document.createElement('li');li.textContent='z = 0: no argument or rhythm events.';
  refs.list.append(li);return;
 }
 for(const hit of data.roots){
  const li=document.createElement('li'),math=document.createElement('span'),deg=document.createElement('span');
  li.dataset.index=String(hit.k);li.dataset.phase=String(hit.phase);li.dataset.degrees=String(hit.deg);
  math.className='math-notation';deg.className='root-info-degree';
  renderMath(math,'\\theta_{'+hit.k+'}='+hit.tex);
  deg.textContent=number(hit.deg)+'°';
  li.append(math,deg);refs.list.append(li);
 }
}
root.RootAngleInfo=Object.freeze({model,piTeX,render});
})(window);
