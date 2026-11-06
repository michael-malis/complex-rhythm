import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts/audio-parameter-response',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const evidence=await page.evaluate(async()=>{
  const definitions=window.RhythmVoices.definitions;
  const acidNames=Object.keys(definitions).filter(n=>definitions[n].family==='acid');
  const sampleRate=24000,seconds=.6,at=.02;
  const render=async(name,patch={})=>{
   const ctx=new OfflineAudioContext(1,Math.round(sampleRate*seconds),sampleRate);
   const bus=ctx.createGain();bus.connect(ctx.destination);
   const started=window.RhythmVoices.play(ctx,bus,name,at,.8,3,patch);
   const buffer=await ctx.startRendering();
   const raw=buffer.getChannelData(0),data=Array.from(raw);
   let sum=0,peak=0;
   for(const x of data){sum+=x*x;peak=Math.max(peak,Math.abs(x))}
   return {started,peak,rms:Math.sqrt(sum/data.length),data};
  };
  const distance=(a,b)=>{
   let d=0,energy=0;
   for(let i=0;i<a.length;i++){
    const delta=a[i]-b[i];d+=delta*delta;energy+=a[i]*a[i];
   }
   return Math.sqrt(d/Math.max(1e-9,energy));
  };
  const defaults={};
  for(const name of acidNames)defaults[name]=await render(name);
  const configurations={
   cutoff:{cutoff:8000},
   q:{q:1},
   decay:{decay:.12},
   accent:{accent:0},
   slide:{slide:.35},
   drive:{drive:4.8},
   modulation:{modulation:3.2},
   depth:{depth:9000},
   osc:{osc:'triangle'}
  };
  const responses=[];
  for(const name of ['acidClassic','acidHard']){
   for(const [control,patch] of Object.entries(configurations)){
    const altered=await render(name,patch);
    const response=distance(defaults[name].data,altered.data);
    responses.push({name,control,response:Number(response.toFixed(6)),started:altered.started,
     peak:Number(altered.peak.toFixed(5)),rms:Number(altered.rms.toFixed(5))});
   }
  }
  const pairwise=[];
  for(let i=0;i<acidNames.length;i++)for(let j=i+1;j<acidNames.length;j++){
   const a=acidNames[i],b=acidNames[j];
   pairwise.push({a,b,difference:Number(distance(defaults[a].data,defaults[b].data).toFixed(5))});
  }
  return {acidNames,voices:acidNames.map(name=>({
   name,started:defaults[name].started,peak:defaults[name].peak,rms:defaults[name].rms,
   osc:definitions[name].osc,q:definitions[name].q,
   cutoff:definitions[name].cutoff,drive:definitions[name].drive
  })),responses,pairwise};
 });
 assert.equal(evidence.acidNames.length,6,'all six mandatory acid programs measured');
 for(const v of evidence.voices){
  assert.ok(v.started&&v.rms>.003&&v.peak>.02&&v.peak<.98,
   'audible bounded acid program '+v.name);
 }
 for(const p of evidence.pairwise){
  assert.ok(p.difference>.015,'acid programs must be distinct waveforms: '+JSON.stringify(p));
 }
 for(const r of evidence.responses){
  assert.ok(r.started&&r.rms>.002&&r.peak<.98,'overridden patch must stay audible/safe: '+JSON.stringify(r));
  assert.ok(r.response>.003,'control must modify actual rendered sound: '+JSON.stringify(r));
 }
 assert.deepEqual(errors,[],'no runtime JS exceptions');
 fs.writeFileSync('artifacts/audio-parameter-response/measurements.json',JSON.stringify({
  status:'PASS',
  scope:'Six synthesized acid programs and nine real parameter-response controls in two acid voices',
  limitation:'Offline signal measurement, not human auditory validation',
  ...evidence
 },null,2));
 console.log('PASS '+evidence.voices.length+' acid programs, '+evidence.pairwise.length+
  ' pairwise waveform distinctions, '+evidence.responses.length+' real parameter-response renders');
 await page.close();
}finally{await browser.close()}
