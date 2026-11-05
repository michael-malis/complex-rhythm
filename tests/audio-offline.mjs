import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
fs.mkdirSync('artifacts/audio-renders',{recursive:true});
const METRICS=[];
function wav(data,sampleRate){
 const bytes=Buffer.alloc(44+data.length*2);
 bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);
 bytes.writeUInt32LE(sampleRate,24);bytes.writeUInt32LE(sampleRate*2,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);
 bytes.write('data',36);bytes.writeUInt32LE(data.length*2,40);
 for(let i=0;i<data.length;i++)bytes.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(data[i]*32767))),44+2*i);
 return bytes;
}
try{
 const page=await browser.newPage();
 const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const voices=await page.evaluate(async()=>{
  const names=Object.keys(window.RhythmVoices?.definitions||{});
  const results=[];
  for(const [i,name] of names.entries()){
   const sr=32000,seconds=.65;
   const context=new OfflineAudioContext(1,Math.round(sr*seconds),sr);
   const bus=context.createGain(),sub=context.createBiquadFilter(),ceiling=context.createWaveShaper();
   sub.type='highpass';sub.frequency.value=20;
   // Identical ceiling transfer curve to the live engine; exercise final output safety.
   const curve=new Float32Array(4096);
   for(let k=0;k<curve.length;k++){const x=2*k/(curve.length-1)-1;curve[k]=.84*Math.tanh(3.2*x)/Math.tanh(3.2)}
   ceiling.curve=curve;ceiling.oversample='2x';bus.connect(sub);sub.connect(ceiling);ceiling.connect(context.destination);
   const started=window.RhythmVoices.play(context,bus,name,.02,.7,i);
   const audio=await context.startRendering(),data=audio.getChannelData(0);
   const peak=data.reduce((a,v)=>Math.max(a,Math.abs(v)),0);
   const rms=Math.sqrt(data.reduce((a,v)=>a+v*v,0)/data.length);
   let first=-1;for(let k=0;k<data.length;k++)if(Math.abs(data[k])>.0005){first=k;break}
   const segments=Array.from({length:8},(_,j)=>{
     const a=Math.floor(j*data.length/8),b=Math.floor((j+1)*data.length/8);
     let power=0;for(let k=a;k<b;k++)power+=data[k]*data[k];
     return Math.round(Math.sqrt(power/(b-a))*100000)/100000;
   });
   // Sample frequencies via short direct DFT, enough to distinguish all 15 programs.
   const frame=data.slice(600,600+512);
   const powers=[];for(let k=0;k<128;k++){let re=0,im=0;
     for(let p=0;p<frame.length;p++){const phase=2*Math.PI*k*p/frame.length;re+=frame[p]*Math.cos(phase);im-=frame[p]*Math.sin(phase)}
     powers.push(re*re+im*im)
   }
   const sum=powers.reduce((a,b)=>a+b,0);
   const centroid=sum?powers.reduce((a,v,k)=>a+v*k*sr/512,0)/sum:0;
   const fingerprint=Array.from({length:96},(_,j)=>Math.round(data[500+j*12]*1e6)).join(',');
   results.push({name,started,peak,rms,firstSample:first,segments,centroid:Math.round(centroid),fingerprint,data:Array.from(data)});
  }
  return results;
 });
 assert.equal(voices.length,15,'15 synthesized instrument types');
 for(const row of voices){
  assert.equal(row.started,true,'voice activation '+row.name);
  assert.ok(Number.isFinite(row.peak)&&row.peak>.0004&&row.peak<=.85,'bounded nonzero output '+row.name+' '+row.peak);
  assert.ok(row.rms>.0002,'audible energy '+row.name+' '+row.rms);
  assert.ok(row.firstSample>=0,'attack onset '+row.name);
  assert.ok(row.centroid>0,'spectral profile '+row.name);
  fs.writeFileSync('artifacts/audio-renders/'+row.name+'.wav',wav(row.data,32000));
  METRICS.push(Object.fromEntries(Object.entries(row).filter(([k])=>k!=='data'&&k!=='fingerprint')));
 }
 const fingerprints=new Set(voices.map(v=>v.fingerprint));
 assert.equal(fingerprints.size,voices.length,'all 15 voices produce distinct non-identical waveforms');
 for(const [name,definition] of Object.entries(await page.evaluate(()=>window.RhythmVoices.definitions))){
  const metrics=METRICS.find(m=>m.name===name);assert.ok(metrics,'patch metrics for '+name);
  assert.ok(['sine','triangle','sawtooth','square'].includes(definition.osc),'oscillator '+name);
 }
 assert.deepEqual(pageErrors,[],'no browser JS errors');
 fs.writeFileSync('artifacts/audio-renders/metrics.json',JSON.stringify({sampleRate:32000,seconds:.65,note:'OfflineAudioContext technical measurement, not human listening. Transfer-curve ceiling tested; real device listening pending.',voices:METRICS},null,2));
 console.log('PASS OFFLINE AUDIO:',voices.length,'distinct waveforms, output peaks <= .85, WAV and spectral/RMS/attack metrics saved');
 await page.close();
}finally{await browser.close()}
