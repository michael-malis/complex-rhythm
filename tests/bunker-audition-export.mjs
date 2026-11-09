import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

// AUDIO-01 technical evidence only: render production audio for all six
// Bunker sources to downloadable, unnormalized 16-bit PCM WAVs. Passing this
// test NEVER asserts human listening or underground-techno authenticity.
const outDir='artifacts/bunker-audition';
fs.mkdirSync(outDir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const rendered=await page.evaluate(async()=>{
  const research=window.RhythmResearch,math=window.RhythmMath,voices=window.RhythmVoices;
  const ids=['berlin-bass-wall','concrete','pressure','shaft','iron','dust'];
  const catalog=research.presets();
  const sampleUrls={kick:'samples/kick-hard.wav',clap:'samples/clap.wav',
   snare:'samples/snare-body.wav',hat:'samples/hat-crunch.wav',
   openhat:'samples/openhat.wav',rim:'samples/rim.wav',
   tom:'samples/tom.wav',berlinrumble:'samples/berlin-rumble.wav',
   'berlinrumble-alt':'samples/berlin-rumble-alt.wav'};
  const sampleGains={kick:.51,clap:.36,snare:.45,hat:.18,
   openhat:.19,rim:.34,tom:.33,berlinrumble:.70};
  const variations=[0,-.012,.009,-.007,.004];
  const sampleRate=32000;
  const wavBytes=(samples)=>{
   const output=new ArrayBuffer(44+samples.length*2),view=new DataView(output);
   const setTag=(offset,tag)=>{for(let i=0;i<tag.length;i++)view.setUint8(offset+i,tag.charCodeAt(i))};
   setTag(0,'RIFF');view.setUint32(4,output.byteLength-8,true);setTag(8,'WAVE');
   setTag(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);
   view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);
   view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);
   setTag(36,'data');view.setUint32(40,samples.length*2,true);
   for(let i=0;i<samples.length;i++)
    view.setInt16(44+2*i,Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),true);
   return new Uint8Array(output);
  };
  const toBase64=bytes=>{
   let text='';
   for(let i=0;i<bytes.length;i+=16384)
    text+=String.fromCharCode(...bytes.subarray(i,i+16384));
   return btoa(text);
  };
  const gainEnvelope=(ctx,out,at,peak,duration,attack=.002)=>{
   const g=ctx.createGain();
   g.gain.setValueAtTime(.0001,at);
   g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),at+attack);
   g.gain.exponentialRampToValueAtTime(.0001,at+duration);
   g.connect(out);return g;
  };
  const fallback=(ctx,out,sound,at,velocity,index)=>{
   const synthOut=ctx.createGain();synthOut.gain.value=Math.max(.05,Math.min(1,velocity));
   synthOut.connect(out);
   if(sound==='reese'){
    const filter=ctx.createBiquadFilter();filter.type='lowpass';
    filter.frequency.setValueAtTime(1100,at);
    filter.frequency.exponentialRampToValueAtTime(280,at+.3);
    filter.Q.value=1.1;
    const amp=gainEnvelope(ctx,synthOut,at,.24,.36,.008);
    filter.connect(amp);
    for(const detune of [-9,9]){
     const osc=ctx.createOscillator();osc.type='sawtooth';
     osc.frequency.setValueAtTime(53,at);osc.detune.value=detune;
     osc.connect(filter);osc.start(at);osc.stop(at+.39);
    }
    return true;
   }
   if(sound==='bass'){
    for(const [type,peak,duration] of [['triangle',.55,.36],['sine',.21,.38]]){
     const osc=ctx.createOscillator();osc.type=type;
     osc.frequency.setValueAtTime(80,at);
     osc.frequency.exponentialRampToValueAtTime(54,at+duration);
     osc.connect(gainEnvelope(ctx,synthOut,at,peak,duration));
     osc.start(at);osc.stop(at+duration+.025);
    }
    return true;
   }
   return false;
  };
  const results=[];
  for(const id of ids){
   const preset=catalog.find(p=>p.id===id);
   if(!preset)throw Error('Missing Bunker preset '+id);
   const barSeconds=240/preset.bpm,bars=4,offset=.12;
   const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*(offset+bars*barSeconds+.85)),sampleRate);
   const master=voices.createMasterOutputChain(ctx,ctx.destination,.52).master;
   const lanes=preset.tracks.map(t=>({cycleBars:t.cycleBars||1,sound:t.sound,
    gain:t.gain??1,muted:t.muted,patch:t.patch??null,events:research.eventMetadata(t)}));
   const events=math.planEvents(lanes,barSeconds,0,bars*barSeconds);
   if(events.some(e=>!e.sources?.length))throw Error('Root provenance missing in '+id);
   const decoded={};
   for(const track of preset.tracks){
    const keys=track.sound==='berlinrumble'?['berlinrumble','berlinrumble-alt']:
     sampleUrls[track.sound]?[track.sound]:[];
    for(const key of keys){
     if(decoded[key])continue;
     const response=await fetch(sampleUrls[key]);
     if(!response.ok)throw Error('Sample unavailable: '+sampleUrls[key]);
     decoded[key]=await ctx.decodeAudioData(await response.arrayBuffer());
    }
   }
   const soundCounts={};
   for(const e of events){
    const track=preset.tracks[e.lane],sound=track.sound,at=offset+e.time;
    const index=e.cycle*lanes[e.lane].events.length+e.sourceEvent;
    const vel=e.velocity*e.gain;
    soundCounts[sound]=(soundCounts[sound]||0)+1;
    if(voices.definitions[sound]){
     if(!voices.play(ctx,master,sound,at,vel,index,e.patch??null))
      throw Error('Native synth unavailable for '+sound);
     continue;
    }
    const key=sound==='berlinrumble'&&index%2?'berlinrumble-alt':sound;
    if(decoded[key]){
     const source=ctx.createBufferSource();
     source.buffer=decoded[key];source.playbackRate.value=1+variations[index%5];
     const gain=ctx.createGain();
     const wallBoost=id==='berlin-bass-wall'&&sound==='kick'?1.12:1;
     gain.gain.value=sampleGains[sound]*vel*wallBoost;
     source.connect(gain);gain.connect(master);
     if(sound==='berlinrumble'){
      // The real live app runs a parallel saturating ~260 Hz presence path.
      const curve=new Float32Array(1024);
      for(let i=0;i<curve.length;i++)curve[i]=Math.tanh(7*(2*i/(curve.length-1)-1))/Math.tanh(7);
      const saturation=ctx.createWaveShaper();saturation.curve=curve;saturation.oversample='2x';
      const presence=ctx.createBiquadFilter();
      presence.type='bandpass';presence.frequency.value=260;presence.Q.value=.65;
      const layer=ctx.createGain();layer.gain.value=.24*gain.gain.value;
      source.connect(saturation);saturation.connect(presence);presence.connect(layer);layer.connect(master);
     }
     source.start(at);
     continue;
    }
    if(!fallback(ctx,master,sound,at,vel,index))
     throw Error('Unmapped production instrument '+sound+' in '+id);
   }
   const audio=(await ctx.startRendering()).getChannelData(0);
   let finite=true,peak=0,energy=0,lowEnergy=0,nonZero=0,slow=0;
   const smooth=Math.exp(-2*Math.PI*160/sampleRate);
   for(const sample of audio){
    if(!Number.isFinite(sample)){finite=false;continue}
    peak=Math.max(peak,Math.abs(sample));energy+=sample*sample;
    slow=smooth*slow+(1-smooth)*sample;lowEnergy+=slow*slow;
    if(Math.abs(sample)>.0001)nonZero++;
   }
   const kickEvents=events.filter(e=>e.lane===0);
   const kickPeaks=kickEvents.map(e=>{
    const begin=Math.floor((offset+e.time)*sampleRate);
    let p=0;
    for(let i=begin;i<Math.min(begin+Math.ceil(.06*sampleRate),audio.length);i++)
     p=Math.max(p,Math.abs(audio[i]));
    return p;
   });
   const wav=wavBytes(audio);
   results.push({id,name:preset.name,bpm:preset.bpm,sampleRate,bars,
    events:events.length,soundCounts,rootsPreserved:true,
    durationSeconds:audio.length/sampleRate,
    audio:{finite,peak,rms:Math.sqrt(energy/audio.length),
     low160HzRms:Math.sqrt(lowEnergy/audio.length),
     nonSilentFraction:nonZero/audio.length,
     kickPeaks},
    wavBase64:toBase64(wav)});
  }
  return results;
 });
 assert.deepEqual(errors,[],'No production page JavaScript error');
 assert.equal(rendered.length,6);
 const records=[];
 for(const item of rendered){
  assert.ok(item.rootsPreserved&&item.audio.finite,'Root and finite output: '+item.id);
  assert.ok(item.audio.peak>.02&&item.audio.peak<=.843,'Output master bound: '+item.id);
  assert.ok(item.audio.rms>.002&&item.audio.nonSilentFraction>.05,'Non-silent sample: '+item.id);
  assert.ok(item.audio.kickPeaks.length===16&&item.audio.kickPeaks.every(v=>v>.012),
   '16 independent quarter-kick attack windows: '+item.id);
  const wav=Buffer.from(item.wavBase64,'base64');
  assert.equal(wav.toString('ascii',0,4),'RIFF');
  assert.equal(wav.toString('ascii',8,12),'WAVE');
  assert.equal(wav.readUInt32LE(24),32000);
  assert.equal(wav.readUInt16LE(34),16);
  const file=item.id+'.wav';
  fs.writeFileSync(outDir+'/'+file,wav);
  records.push({id:item.id,name:item.name,bpm:item.bpm,
   bars:item.bars,durationSeconds:item.durationSeconds,
   events:item.events,soundCounts:item.soundCounts,rootSourcesPreserved:item.rootsPreserved,
   audio:item.audio,wav:file,bytes:wav.length,sha256:createHash('sha256').update(wav).digest('hex')});
 }
 assert.equal(new Set(records.map(x=>x.id)).size,6);
 const report={status:'PASS',kind:'Technical audio export, not human listening',sampleRate:32000,
  channels:1,bitDepth:16,normalization:'none',masterGain:.52,bars:4,
  caveat:'Production sample/voice paths replicated in OfflineAudioContext. Human audition, mobile loudspeakers, audio unlock and musical quality remain unverified.',
  records};
 fs.writeFileSync(outDir+'/report.json',JSON.stringify(report,null,2)+'\n');
 console.log('PASS six unnormalized real-engine Bunker WAV previews: '+records.map(r=>r.id).join(', '));
}finally{await browser.close()}
