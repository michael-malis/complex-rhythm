import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
let result;
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 result=await page.evaluate(async()=>{
  const full=window.RhythmResearch.presets();
  const catalog=[];
  for(const p of full){
   const bars=240/p.bpm;
   const lanes=p.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,events:window.RhythmResearch.events(t)}));
   const all=window.RhythmMath.planEvents(lanes,bars,0,4*bars);
   const expected=[];
   for(let i=0;i<lanes.length;i++){
    const tr=lanes[i],cycles=Math.ceil(4/tr.cycleBars);
    if(tr.muted)continue;
    for(let c=0;c<cycles;c++)for(let k=0;k<tr.events.length;k++){
     const time=(c+tr.events[k].phase)*tr.cycleBars*bars;
     if(time<4*bars-1e-10)expected.push({lane:i,cycle:c,sourceEvent:k,time});
    }
   }
   expected.sort((a,b)=>a.time-b.time||a.lane-b.lane||a.sourceEvent-b.sourceEvent);
   const exact=all.length===expected.length&&all.every((ev,i)=>ev.lane===expected[i].lane&&
     ev.cycle===expected[i].cycle&&ev.sourceEvent===expected[i].sourceEvent&&
     Math.abs(ev.time-expected[i].time)<1e-8);
   const chunks=[];for(let from=0;from<4*bars;from+=.173){
    chunks.push(...window.RhythmMath.planEvents(lanes,bars,from,Math.min(4*bars,from+.173)));
   }
   chunks.sort((a,b)=>a.time-b.time||a.lane-b.lane||a.sourceEvent-b.sourceEvent);
   const noLost=chunks.length===all.length&&chunks.every((ev,i)=>ev.lane===all[i].lane&&
     ev.cycle===all[i].cycle&&ev.sourceEvent===all[i].sourceEvent&&Math.abs(ev.time-all[i].time)<1e-7);
   catalog.push({id:p.id,category:p.category,bpm:p.bpm,events:all.length,exact,noLost,
     withSound:p.tracks.every(t=>typeof t.sound==='string'&&t.sound.length>0)});
  }
  function outputChain(ctx){
   const bus=ctx.createGain();bus.gain.value=.52;
   const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=20;hp.Q.value=.707;
   const limit=ctx.createWaveShaper(),curve=new Float32Array(4096);
   for(let k=0;k<curve.length;k++){const x=2*k/(curve.length-1)-1;curve[k]=.84*Math.tanh(3.2*x)/Math.tanh(3.2)}
   limit.curve=curve;limit.oversample='2x';
   bus.connect(hp);hp.connect(limit);limit.connect(ctx.destination);
   return bus;
  }
  async function renderStress(sr,degree){
   const duration=1.62,ctx=new OfflineAudioContext(1,Math.ceil(sr*duration),sr),bus=outputChain(ctx);
   const sounds=['gabberKick','acidScreaming','noiseBurst','metallic'];
   let voiceCount=0;
   for(let i=0;i<4;i++){
    for(let k=0;k<degree;k++){
     const at=.12+k/degree;
     const success=window.RhythmVoices.play(ctx,bus,sounds[i],at,.5,i*degree+k);
     if(!success)throw Error('Unable to render '+sounds[i]);
     voiceCount++;
    }
   }
   const buffer=await ctx.startRendering(),values=buffer.getChannelData(0);
   let peak=0,total=0,finite=true;
   for(const x of values){if(!Number.isFinite(x)){finite=false;continue}peak=Math.max(peak,Math.abs(x));total+=x*x}
   return {rate:sr,voices:voiceCount,seconds:duration,peak,rms:Math.sqrt(total/values.length),finite};
  }
  const denseLow=await renderStress(22050,64);
  const denseHigh=await renderStress(96000,32);
  // Event onset: output attack may ramp for 4 ms, but it must begin within 5 ms of its scheduled time.
  const sr=48000,duration=.6,ctx=new OfflineAudioContext(1,Math.ceil(sr*duration),sr),bus=outputChain(ctx);
  const scheduledAt=.13,compensatedStart=scheduledAt-.005;
  window.RhythmVoices.play(ctx,bus,'technoKick',compensatedStart,.8,0);
  const signal=(await ctx.startRendering()).getChannelData(0);
  let first=-1;for(let i=0;i<signal.length;i++)if(Math.abs(signal[i])>0.000025){first=i/sr;break}
  return {catalog,denseLow,denseHigh,onset:{scheduledAt,compensatedStart,first,driftMs:(first-scheduledAt)*1000}};
 });
 // Exercise the REAL application hit() path, not only the standalone synth module:
 // a secondary accent with gain 0.4 must not be attenuated twice to 0.16.
 await page.evaluate(()=>{
  window.__velocityProbe=[];
  const original=window.RhythmVoices;
  window.RhythmVoices={...original,play(ctx,bus,name,time,velocity){
   window.__velocityProbe.push({name,busGain:bus.gain.value,velocity});
   return true;
  }};
  const instrument=document.getElementById('laneSound0');
  instrument.value='acidHard';instrument.dispatchEvent(new Event('change',{bubbles:true}));
  const slider=document.getElementById('laneGain');
  slider.value='0.4';slider.dispatchEvent(new Event('input',{bubbles:true}));
  document.getElementById('previewBtn').click();
 });
 await page.waitForFunction(()=>window.__velocityProbe?.length>0,undefined,{timeout:3500});
 const probe=await page.evaluate(()=>window.__velocityProbe[0]);
 assert.equal(probe.name,'acidHard','synthetic acid voice reached preview path');
 assert.equal(probe.busGain,1,'synth gain applied only in envelope, not squared by the bus');
 assert.ok(Math.abs(probe.velocity-.4)<1e-8,'intended velocity 0.4 reaches the synthesizer');
 result.liveVelocityProbe=probe;
 await page.close();
}finally{await browser.close()}
assert.equal(result.catalog.length,50,'all 50 presets in planner test');
for(const r of result.catalog){
 assert.ok(r.exact,'expected theoretical event count and timing: '+r.id);
 assert.ok(r.noLost,'no lost/duplicated events when scheduled in .173 second chunks: '+r.id);
 assert.ok(r.withSound,'valid instrument names: '+r.id);
}
const ceiling=Math.pow(10,-1/20);
for(const r of [result.denseLow,result.denseHigh]){
 assert.ok(r.finite,'no NaN/Infinity in rendered dense mix');
 assert.ok(r.peak>0.0001&&r.peak<=ceiling,'post-limiter full mix sample peak under -1 dBFS; peak '+r.peak);
 assert.ok(r.rms>.00001,'non-silent dense mix');
}
assert.ok(result.onset.first>=result.onset.scheduledAt,'attack not early');
assert.ok(result.onset.driftMs<5,'first audible samples within 5 ms of trigger: '+result.onset.driftMs);
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/audio-mix-stress.json',JSON.stringify({
 measuredAt:new Date().toISOString(),
 scope:'OfflineAudioContext synthesized 4-lane load and planner checks; not listening or mastering certification.',
 peakLimitDbFs:-1,
 ...result
},null,2));
console.log(JSON.stringify({passed:true,presetsValidated:result.catalog.length,allEvents:result.catalog.reduce((a,b)=>a+b.events,0),
 highDensityLowRate:result.denseLow,highDensityHighRate:result.denseHigh,
 onsetDriftMs:result.onset.driftMs,peakLimitDbFs:-1},null,2));
