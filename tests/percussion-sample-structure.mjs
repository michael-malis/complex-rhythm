import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const findings=await page.evaluate(async()=>{
  const paths={
   snare:'samples/snare-snap.wav',snareBody:'samples/snare-body.wav',
   snare808:'samples/snare-808.wav',closedHat:'samples/hat.wav',
   openHat:'samples/openhat.wav',hatCrunch:'samples/hat-crunch.wav',
   clap:'samples/clap.wav'
  };
  const AC=window.AudioContext||window.webkitAudioContext,context=new AC();
  const result={};
  try{
   for(const [name,path] of Object.entries(paths)){
    const response=await fetch(path);
    if(!response.ok)throw Error(path+': HTTP '+response.status);
    const buffer=await context.decodeAudioData(await response.arrayBuffer());
    const x=buffer.getChannelData(0),rate=buffer.sampleRate;
    let energy=0,peak=0,sumDiff=0,previous=0;
    for(let i=0;i<x.length;i++){
     const v=x[i];energy+=v*v;peak=Math.max(peak,Math.abs(v));
     sumDiff+=Math.abs(v-previous);previous=v;
    }
    const width=Math.max(1,Math.floor(rate*.01)),windows=[];
    for(let start=0;start<x.length;start+=width){
     let v=0;const end=Math.min(x.length,start+width);
     for(let i=start;i<end;i++)v+=x[i]*x[i];
     windows.push(Math.sqrt(v/Math.max(1,end-start)));
    }
    const rms=Math.sqrt(energy/x.length),threshold=Math.max(rms*.12,.0007);
    let activeMs=0,lastActiveMs=0;
    for(let k=0;k<windows.length;k++)if(windows[k]>threshold){
     activeMs++;lastActiveMs=(k+1)*10;
    }
    let fingerprint=2166136261;
    for(let i=0;i<x.length;i+=Math.max(1,Math.floor(x.length/4096))){
     const value=Math.round(x[i]*30000);
     fingerprint=Math.imul(fingerprint^(value&0xffff),16777619)>>>0;
    }
    result[name]={path,sampleRate:rate,seconds:Number((x.length/rate).toFixed(4)),
     peak:Number(peak.toFixed(6)),rms:Number(rms.toFixed(6)),
     activeMs:activeMs*10,lastActiveMs,
     differentialEnergy:Number((sumDiff/x.length).toFixed(6)),
     fingerprint:fingerprint.toString(16)};
   }
  }finally{await context.close()}
  return result;
 });
 assert.equal(Object.keys(findings).length,7,'all core percussion samples decoded');
 for(const [name,p] of Object.entries(findings)){
  assert.ok(p.seconds>.02&&p.rms>.0002&&p.peak>.01,'audible sample not silent: '+name);
  assert.ok(Number.isFinite(p.differentialEnergy),'time domain data valid: '+name);
 }
 assert.equal(new Set(Object.values(findings).map(v=>v.fingerprint)).size,7,
  'seven samples must not be aliases of identical waveforms');
 assert.notEqual(findings.closedHat.fingerprint,findings.openHat.fingerprint,
  'closed and open hi-hats must have distinct recorded waveform assets');
 assert.notEqual(findings.snare.fingerprint,findings.snareBody.fingerprint,
  'bunker snare and default snare must have distinct data');
 assert.deepEqual(errors,[],'browser runtime errors');
 fs.writeFileSync('artifacts/percussion-sample-structure.json',JSON.stringify({
  status:'PASS',scope:'Objective decoded snare, hat and clap sample measurements, not human sound-quality approval',
  samples:findings
 },null,2));
 console.log('PASS seven independent percussion sample files: '+Object.entries(findings)
  .map(([n,x])=>n+' '+x.seconds+'s '+x.activeMs+'ms active').join('; '));
 await page.close();
}finally{await browser.close()}
