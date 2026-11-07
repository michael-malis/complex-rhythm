import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts/kick-architecture',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage();
 const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const result=await page.evaluate(async()=>{
  const names=['technoKick','hardcoreKick','gabberKick','frenchcoreKick'];
  const sr=32000,seconds=.65,sampleCeiling=Math.pow(10,-1/20);
  const render=async(name,velocity)=>{
   const ctx=new OfflineAudioContext(1,Math.floor(seconds*sr),sr);
   const master=window.RhythmVoices.createMasterOutputChain(ctx,ctx.destination,.78).master;
   // Count real synthesized Web Audio graph nodes, not merely JSON patches.
   const oscillator=ctx.createOscillator.bind(ctx);
   const biquad=ctx.createBiquadFilter.bind(ctx);
   const waveshaper=ctx.createWaveShaper.bind(ctx);
   const oscillators=[],filters=[],shapers=[];
   ctx.createOscillator=()=>{const v=oscillator();oscillators.push(v);return v};
   ctx.createBiquadFilter=()=>{const v=biquad();filters.push(v);return v};
   ctx.createWaveShaper=()=>{const v=waveshaper();shapers.push(v);return v};
   const scheduled=.075;
   const started=window.RhythmVoices.play(ctx,master,name,scheduled,velocity,0);
   const out=(await ctx.startRendering()).getChannelData(0);
   let max=0,first=-1,total=0,rough=0;
   for(let i=0;i<out.length;i++){
    const v=out[i];max=Math.max(max,Math.abs(v));total+=v*v;
    if(first<0&&Math.abs(v)>.00002)first=i/sr;
    if(i>0)rough+=(v-out[i-1])**2;
   }
   const segment=(a,b)=>{
    const lo=Math.floor(a*sr),hi=Math.min(out.length,Math.floor(b*sr));
    let power=0;for(let i=lo;i<hi;i++)power+=out[i]*out[i];
    return Math.sqrt(power/Math.max(1,hi-lo));
   };
   const graph={oscillatorTypes:oscillators.map(v=>v.type),
    oscillators:oscillators.length,
    filters:filters.map(v=>({type:v.type,freq:v.frequency.value})),
    shapers:shapers.length};
   const segments={attack:segment(.075,.105),body:segment(.12,.21),
    tail:segment(.25,.38),end:segment(.59,.64)};
   return {name,velocity,started,peak:max,rms:Math.sqrt(total/out.length),
    firstSample:first,roughness:Math.sqrt(rough/Math.max(total,1e-12)),
    segments,graph,samples:Array.from(out)};
  };
  const renders=[];
  for(const name of names){
   renders.push(await render(name,.8));
   renders.push(await render(name,.45));
  }
  const main=renders.filter(x=>x.velocity===.8);
  const comparisons=[];
  for(let i=0;i<main.length;i++)for(let j=i+1;j<main.length;j++){
   const a=main[i],b=main[j];let dot=0,sa=0,sb=0;
   for(let n=0;n<a.samples.length;n++){const x=a.samples[n],y=b.samples[n];dot+=x*y;sa+=x*x;sb+=y*y}
   const cosine=dot/Math.sqrt(sa*sb);
   comparisons.push({a:a.name,b:b.name,normalizedWaveformDistance:Math.sqrt(Math.max(0,2-2*cosine))});
  }
  return {sr,ceilingDbFS:-1,sampleCeiling,expectedPatchNames:names,
   rendered:renders.map(({samples,...record})=>record),comparisons};
 });
 assert.equal(result.rendered.length,8);
 assert.equal(result.comparisons.length,6);
 const geometry={technoKick:2,hardcoreKick:3,gabberKick:3,frenchcoreKick:4};
 for(const r of result.rendered){
  assert.ok(r.started,'actual synth started '+r.name);
  assert.ok(r.peak>.035&&r.peak<=result.sampleCeiling,
   'non-silent under -1dBFS live output '+r.name+': '+r.peak);
  assert.ok(r.rms>.003,'sustained transient has measurable energy '+r.name);
  assert.equal(r.graph.oscillators,geometry[r.name],
   'kicks must have distinct explicit oscillator/attack architectures');
  assert.ok(r.graph.filters.some(f=>f.type==='highpass'&&f.freq===27),
   'kick bass body must reject accumulated subsonic energy');
  assert.ok(r.graph.filters.some(f=>f.type==='lowpass'&&f.freq>=170&&f.freq<=440),
   'kick bass body must have its own spectral shaping path');
  assert.ok(r.graph.shapers>=1,'real voice drive waveshaper must be present');
  assert.ok(r.firstSample>=.075&&r.firstSample<.092,
   'kick attack begins close to scheduled source time');
  assert.ok(r.segments.attack>.002&&r.segments.body>.002,
   'both transient and body have actual measured output');
  assert.ok(r.segments.end<.015,'no unintended DC or persistent low tail');
  assert.ok(Number.isFinite(r.roughness),'spectral proxy finite');
  if(r.name==='technoKick')assert.equal(r.graph.shapers,1,
   'clean techno kick has one voice drive and no gratuitous transient saturation');
  else assert.ok(r.graph.shapers>=2,'hardcore/gabber/frenchcore have a distinct driven transient path');
 }
 for(const p of result.comparisons)assert.ok(p.normalizedWaveformDistance>.08,
  'different kicks must remain distinguishable after NORMALIZING overall gain: '+JSON.stringify(p));
 for(const name of result.expectedPatchNames){
  const a=result.rendered.find(r=>r.name===name&&r.velocity===.8);
  const quiet=result.rendered.find(r=>r.name===name&&r.velocity===.45);
  assert.ok(quiet.rms<a.rms&&quiet.rms>.001,'velocity changes actual amplitude without silencing '+name);
  assert.equal(a.graph.oscillators,quiet.graph.oscillators,
   'velocity edits cannot alter the voice architecture/trigger timing');
 }
 assert.deepEqual(pageErrors,[],'no real-browser runtime errors');
 fs.writeFileSync('artifacts/kick-architecture/report.json',JSON.stringify({
  status:'PASS',scope:'Four actual offline production Web Audio kick families, two velocity levels, real graph instrumentation and gain-normalized waveform differences. Technical timbre distinction; no subjective listening.',...result
 },null,2)+'\n');
 console.log('PASS 4 differentiated kick architectures, 8 actual signal renders, 6 gain-normalized waveform comparisons');
 await page.close();
} finally {await browser.close()}
