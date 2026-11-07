import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// R-SND-005: measure the *same exported graph* used by app.js, not a copied
// waveshaper curve. These are signal measurements, not listening evidence.
fs.mkdirSync('artifacts/master-output-safety',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[];
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 for(const sr of [32000,48000]){
  const m=await page.evaluate(async sampleRate=>{
   const voices=window.RhythmVoices,math=window.RhythmMath;
   const ceiling=Math.pow(10,-1/20);
   const rms=(data,from,to)=>{
    const lo=Math.floor(from*sampleRate),hi=Math.min(data.length,Math.floor(to*sampleRate));
    let total=0;
    for(let i=lo;i<hi;i++)total+=data[i]*data[i];
    return Math.sqrt(total/Math.max(1,hi-lo));
   };
   const peak=data=>data.reduce((best,v)=>Math.max(best,Math.abs(v)),0);
   // 4x fractional sinc estimate; not an ITU-certified reconstruction meter.
   const oversampledPeak=values=>{
    const kernels=Array.from({length:3},(_,k)=>{
     const fraction=(k+1)/4;
     const arr=Array.from({length:16},(_,j)=>{
      const x=fraction-(j-7);
      const sinc=Math.abs(x)<1e-12?1:Math.sin(Math.PI*x)/(Math.PI*x);
      return sinc*(.5+.5*Math.cos(Math.PI*x/8));
     });
     const normalizer=arr.reduce((a,v)=>a+v,0);
     return arr.map(v=>v/normalizer);
    });
    let highest=0;
    for(let i=0;i<values.length;i++){
     highest=Math.max(highest,Math.abs(values[i]));
     for(const kernel of kernels){
      let value=0;
      for(let j=0;j<16;j++){
       const k=i+j-7;
       if(k>=0&&k<values.length)value+=values[k]*kernel[j];
      }
      highest=Math.max(highest,Math.abs(value));
     }
    }
    return highest;
   };
   const renderDense=async()=>{
    const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*1.25),sampleRate);
    const out=voices.createMasterOutputChain(ctx,ctx.destination,.8);
    const soundNames=['gabberKick','acidScreaming','noiseBurst','metallic'];
    const lanes=soundNames.map(sound=>({
     sound,cycleBars:1,events:math.rootPhases(1,0,12).map(phase=>({phase,velocity:1}))
    }));
    const scheduled=math.planEvents(lanes,1,.01,1.01);
    for(const [index,e] of scheduled.entries()){
     if(!voices.play(ctx,out.master,e.instrument,.08+e.time,.9,index))
      throw Error('Failed to render dense program '+e.instrument);
    }
    const samples=(await ctx.startRendering()).getChannelData(0);
    const value=peak(samples),interSample=oversampledPeak(samples);
    return {events:scheduled.length,peak:value,oversampledPeak:interSample,
     ceiling,finite:samples.every(Number.isFinite),rms:rms(samples,.15,.8),
     filterType:out.subFilter.type,filterHz:out.subFilter.frequency.value,
     limiterOversampling:out.limiter.oversample,
     curveCeiling:Math.max(...out.limiter.curve)};
   };
   const renderTone=async freq=>{
    const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*.9),sampleRate);
    const out=voices.createMasterOutputChain(ctx,ctx.destination,1);
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type='sine';osc.frequency.value=freq;gain.gain.value=.24;
    osc.connect(gain);gain.connect(out.master);osc.start(0);osc.stop(.85);
    const data=(await ctx.startRendering()).getChannelData(0);
    return rms(data,.35,.75);
   };
   const renderVolumeChange=async()=>{
    const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*.75),sampleRate);
    const out=voices.createMasterOutputChain(ctx,ctx.destination,.8);
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.frequency.value=60;gain.gain.value=.4;
    osc.connect(gain);gain.connect(out.master);
    osc.start(.01);osc.stop(.73);
    const turnDown=.20375,turnUp=.45375;
    voices.setMasterVolume(out.master,.1,turnDown);
    voices.setMasterVolume(out.master,1,turnUp);
    const data=(await ctx.startRendering()).getChannelData(0);
    const boundaryJump=time=>{
     const i=Math.floor(time*sampleRate);
     return Math.abs(data[i]-data[i-1]);
    };
    return {
     before:rms(data,.13,.17),quiet:rms(data,.32,.36),
     recovered:rms(data,.54,.58),
     downJump:boundaryJump(turnDown),upJump:boundaryJump(turnUp),
     peak:peak(data),finite:data.every(Number.isFinite)
    };
   };
   const renderTransient=async()=>{
    const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*.42),sampleRate);
    const out=voices.createMasterOutputChain(ctx,ctx.destination,.52);
    const scheduled=.14,compensated=.135;
    voices.play(ctx,out.master,'technoKick',compensated,.8,0);
    const data=(await ctx.startRendering()).getChannelData(0);
    let first=-1;
    for(let i=0;i<data.length;i++)if(Math.abs(data[i])>0.000025){first=i/sampleRate;break}
    return {scheduled,first,driftMs:(first-scheduled)*1000,peak:peak(data)};
   };
   const [dense,subHz5,passHz100,volume,transient]=await Promise.all([
    renderDense(),renderTone(5),renderTone(100),renderVolumeChange(),renderTransient()
   ]);
   return {sampleRate,dense,subHz5,passHz100,volume,transient};
  },sr);
  assert.equal(m.dense.events,48,'12 mathematical root events on each of four sound lanes');
  assert.ok(m.dense.finite&&m.volume.finite,'mix and volume changes produce finite samples');
  assert.equal(m.dense.filterType,'highpass');
  assert.equal(m.dense.filterHz,20);
  assert.equal(m.dense.limiterOversampling,'2x');
  assert.ok(m.dense.curveCeiling<=.85&&m.dense.curveCeiling>.83,'master ceiling must use .84');
  assert.ok(m.dense.peak>0.02&&m.dense.peak<=m.dense.ceiling,
   'dense shared master output must stay below -1 dBFS sample peak');
  assert.ok(m.dense.oversampledPeak>=m.dense.peak*.99&&
   m.dense.oversampledPeak<=m.dense.ceiling,
   'four-times interpolated peak estimate exceeds -1 dBFS');
  assert.ok(m.dense.rms>.008,'dense groove still has audible-energy signal');
  assert.ok(m.subHz5<m.passHz100*.35,
   '20Hz output high-pass must significantly reject 5Hz energy without cutting 100Hz');
  assert.ok(m.passHz100>.04,'low-frequency music is not muted by subsonic filtering');
  assert.ok(m.volume.before>.08,'initial output retains energy');
  assert.ok(m.volume.quiet<m.volume.before*.32,'low volume reduces the audible output');
  assert.ok(m.volume.recovered>m.volume.before*.75,'volume recovers without losing sound');
  assert.ok(m.volume.downJump<.03&&m.volume.upJump<.03,
   'volume automation must not create an abrupt sample discontinuity');
  assert.ok(m.volume.peak<=m.dense.ceiling,'live volume transition stays below -1dBFS');
  assert.ok(m.transient.first>=m.transient.scheduled-1/sampleRate&&
   m.transient.driftMs<5,'kick transient must remain within 5 ms of planned root onset');
  cases.push(m);
 }
 assert.deepEqual(errors,[],'no browser errors while producing measured audio');
 fs.writeFileSync('artifacts/master-output-safety/report.json',JSON.stringify({
  status:'PASS',cases,ceilingDbFS:-1,realProductionGraph:true,
  scope:'Actual shared production master bus, 20 Hz filter and 2x-oversampled saturating output at two PCM rates: 4-lane root-onset load, 4x estimated intersample peak, volume-smoothing discontinuity, subsonic rejection, onset drift.',
  caveat:'Not certified true-peak metering, human speaker/headphone listening, or device click audibility.'
 },null,2)+'\n');
 console.log('PASS R-SND-005: real shared master chain, -1 dBFS safety, 20 Hz subsonic attenuation, smoothed volume edits and retained <5ms attack in 2 sample rates');
 await page.close();
} finally {await browser.close()}
