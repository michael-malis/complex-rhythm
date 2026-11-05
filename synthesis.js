/* Independently synthesized electronic voices; no external audio files required. */
(function(root){'use strict';
const voicesDefinitions={
  "technoKick": {
    "family": "kick",
    "osc": "sine",
    "base": 48,
    "start": 175,
    "decay": 0.38,
    "cutoff": 1500,
    "q": 0.8,
    "drive": 1.1,
    "accent": 0.55,
    "slide": 0.05,
    "modulation": 0,
    "noise": 0.06
  },
  "hardcoreKick": {
    "family": "kick",
    "osc": "triangle",
    "base": 51,
    "start": 230,
    "decay": 0.31,
    "cutoff": 1800,
    "q": 1.2,
    "drive": 2.2,
    "accent": 0.8,
    "slide": 0.06,
    "modulation": 0.05,
    "noise": 0.09
  },
  "gabberKick": {
    "family": "kick",
    "osc": "sawtooth",
    "base": 57,
    "start": 340,
    "decay": 0.23,
    "cutoff": 2100,
    "q": 1.7,
    "drive": 3.8,
    "accent": 0.9,
    "slide": 0.03,
    "modulation": 0.09,
    "noise": 0.1
  },
  "frenchcoreKick": {
    "family": "kick",
    "osc": "sine",
    "base": 73,
    "start": 260,
    "decay": 0.4,
    "cutoff": 1400,
    "q": 1,
    "drive": 2.3,
    "accent": 0.7,
    "slide": 0.24,
    "modulation": 0.16,
    "noise": 0.05
  },
  "metallic": {
    "family": "fm",
    "osc": "sine",
    "base": 830,
    "start": 1100,
    "decay": 0.2,
    "cutoff": 2600,
    "q": 3.5,
    "drive": 1.1,
    "accent": 0.5,
    "slide": 0.02,
    "modulation": 2.5,
    "noise": 0.11
  },
  "fmPerc": {
    "family": "fm",
    "osc": "sine",
    "base": 290,
    "start": 760,
    "decay": 0.18,
    "cutoff": 3800,
    "q": 5.1,
    "drive": 1.5,
    "accent": 0.4,
    "slide": 0.08,
    "modulation": 4.5,
    "noise": 0.03
  },
  "noiseBurst": {
    "family": "noise",
    "osc": "sine",
    "base": 250,
    "start": 1200,
    "decay": 0.17,
    "cutoff": 3200,
    "q": 0.9,
    "drive": 2.2,
    "accent": 0.75,
    "slide": 0,
    "modulation": 0,
    "noise": 1
  },
  "hoover": {
    "family": "hoover",
    "osc": "sawtooth",
    "base": 110,
    "start": 130,
    "decay": 0.48,
    "cutoff": 1600,
    "q": 1.4,
    "drive": 2.1,
    "accent": 0.65,
    "slide": 0.18,
    "modulation": 0.5,
    "noise": 0.03
  },
  "raveStab": {
    "family": "stab",
    "osc": "sawtooth",
    "base": 131,
    "start": 160,
    "decay": 0.22,
    "cutoff": 1700,
    "q": 1.1,
    "drive": 1.5,
    "accent": 0.65,
    "slide": 0.03,
    "modulation": 0.08,
    "noise": 0.06
  },
  "acidClassic": {
    "family": "acid",
    "osc": "sawtooth",
    "base": 110,
    "start": 130,
    "decay": 0.26,
    "cutoff": 330,
    "q": 14,
    "drive": 1.2,
    "accent": 0.48,
    "slide": 0.06,
    "modulation": 0.1,
    "depth": 2500
  },
  "acidHard": {
    "family": "acid",
    "osc": "square",
    "base": 98,
    "start": 120,
    "decay": 0.31,
    "cutoff": 260,
    "q": 17,
    "drive": 2.8,
    "accent": 0.88,
    "slide": 0.12,
    "modulation": 0.18,
    "depth": 4800
  },
  "acidScreaming": {
    "family": "acid",
    "osc": "sawtooth",
    "base": 165,
    "start": 210,
    "decay": 0.38,
    "cutoff": 440,
    "q": 22,
    "drive": 3.2,
    "accent": 1,
    "slide": 0.21,
    "modulation": 0.4,
    "depth": 7800
  },
  "acidDark": {
    "family": "acid",
    "osc": "square",
    "base": 73,
    "start": 92,
    "decay": 0.44,
    "cutoff": 160,
    "q": 9.5,
    "drive": 1.8,
    "accent": 0.45,
    "slide": 0.19,
    "modulation": 0.08,
    "depth": 1400
  },
  "acidIndustrial": {
    "family": "acid",
    "osc": "sawtooth",
    "base": 116,
    "start": 175,
    "decay": 0.23,
    "cutoff": 550,
    "q": 11.5,
    "drive": 3.5,
    "accent": 0.82,
    "slide": 0.09,
    "modulation": 0.75,
    "depth": 3900
  },
  "acidPsychedelic": {
    "family": "acid",
    "osc": "square",
    "base": 147,
    "start": 180,
    "decay": 0.39,
    "cutoff": 240,
    "q": 19,
    "drive": 2.1,
    "accent": 0.78,
    "slide": 0.26,
    "modulation": 1.2,
    "depth": 6300
  }
};
function voicesCurve(amount){
 const n=4096,out=new Float32Array(n),norm=Math.tanh(Math.max(.1,amount));
 for(let i=0;i<n;i++){const x=2*i/(n-1)-1;out[i]=Math.tanh(amount*x)/norm}
 return out;
}
function voicesNoise(ctx,at,duration,seed,amplitude,out,cutoff=1800) {
 const frames=Math.max(1,Math.round(ctx.sampleRate*(duration+.02)));
 const buffer=ctx.createBuffer(1,frames,ctx.sampleRate);
 const arr=buffer.getChannelData(0);let x=(seed|0)||137;
 for(let i=0;i<frames;i++){x^=x<<13;x^=x>>>17;x^=x<<5;arr[i]=((x>>>0)/2147483648-1)}
 const source=ctx.createBufferSource();source.buffer=buffer;
 const filter=ctx.createBiquadFilter();filter.type=cutoff>=1000?'highpass':'lowpass';filter.frequency.value=cutoff;
 const gain=ctx.createGain();gain.gain.setValueAtTime(.0001,at);
 gain.gain.linearRampToValueAtTime(amplitude,at+.002);
 gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
 source.connect(filter);filter.connect(gain);gain.connect(out);
 source.start(at);source.stop(at+duration+.01);
}
function voicesPlay(ctx,out,name,time,velocity=1,index=0,overrides=null){
 const conf=voicesDefinitions[name];if(!conf)return false;
 const p={...conf,...(overrides||{})},at=Math.max(time,ctx.currentTime),d=Math.max(.06,Math.min(.8,p.decay));
 const mix=ctx.createGain(),filter=ctx.createBiquadFilter(),drive=ctx.createWaveShaper(),amp=ctx.createGain();
 filter.type=p.family==='noise'?'bandpass':'lowpass';
 filter.Q.value=Math.min(25,Math.max(.3,p.q));
 const endFreq=Math.max(70,Math.min(11000,p.cutoff));
 filter.frequency.setValueAtTime(Math.max(endFreq,Math.min(18000,endFreq+(p.depth||0)*(1+p.accent*Math.min(1,velocity)))),at);
 filter.frequency.exponentialRampToValueAtTime(endFreq,at+d*.86);
 drive.curve=voicesCurve(p.drive);drive.oversample='2x';
 amp.gain.setValueAtTime(.0001,at);
 const peak=Math.max(.0002,Math.min(.26,(p.family==='kick'?.23:p.family==='acid'?.12:.11)*Math.max(.1,velocity)));
 amp.gain.exponentialRampToValueAtTime(peak,at+.004);
 amp.gain.exponentialRampToValueAtTime(.0001,at+d);
 mix.connect(filter);filter.connect(drive);drive.connect(amp);amp.connect(out);
 const osc=(type,fStart,fEnd,detune=0,level=1)=>{
  const gen=ctx.createOscillator(),g=ctx.createGain();gen.type=type;
  gen.frequency.setValueAtTime(Math.max(20,fStart),at);
  gen.frequency.exponentialRampToValueAtTime(Math.max(20,fEnd),at+Math.min(d*.8,.23));
  gen.detune.value=detune;g.gain.value=level;gen.connect(g);g.connect(mix);gen.start(at);gen.stop(at+d+.02);return gen;
 };
 if(p.family==='kick'){
  osc(p.osc,p.start,p.base,0,p.osc==='sawtooth'?.55:1);
  osc('sine',p.start*.45,p.base,.1,.45);
  if(p.family==='kick'&&p.slide>.1)osc('triangle',p.base*.9,p.base*1.3,0,.2);
 }else if(p.family==='acid'){
  const pitch=p.base*Math.pow(2,((index%7)-3)/12);
  const carrier=osc(p.osc,p.start||pitch,pitch,0,1);
  if(p.slide>0){carrier.frequency.setValueAtTime(p.start||pitch,at);carrier.frequency.exponentialRampToValueAtTime(pitch,at+Math.max(.03,p.slide));}
  if(p.modulation>.1){
   const lfo=ctx.createOscillator(),scale=ctx.createGain();lfo.type='sine';lfo.frequency.value=3+p.modulation*6;scale.gain.value=pitch*Math.min(.45,p.modulation*.15);lfo.connect(scale);scale.connect(carrier.frequency);lfo.start(at);lfo.stop(at+d+.01);
  }
 }else if(p.family==='fm'){
  const carrier=osc('sine',p.start,p.base,0,.8),mod=ctx.createOscillator(),modGain=ctx.createGain();
  mod.type='sine';mod.frequency.value=p.base*2.73;
  modGain.gain.setValueAtTime(p.modulation*p.base,at);
  modGain.gain.exponentialRampToValueAtTime(.01,at+d*.7);
  mod.connect(modGain);modGain.connect(carrier.frequency);mod.start(at);mod.stop(at+d+.01);
 }else if(p.family==='hoover'){
  for(const detune of [-17,0,13])osc('sawtooth',p.start,p.base,detune,.35);
 }else if(p.family==='stab'){
  for(const ratio of [1,1.189,1.498])osc('sawtooth',p.start*ratio,p.base*ratio,0,.32);
 }
 if(p.noise>0)voicesNoise(ctx,at,Math.min(d,.2),name.length*163+index*71,Math.min(.12,p.noise*.08)*velocity,mix,p.family==='kick'?1000:2400);
 return true;
}
const exposed=Object.freeze({definitions:voicesDefinitions,play:voicesPlay});root.RhythmVoices=exposed;
if(typeof module!=='undefined'&&module.exports)module.exports=exposed;
})(typeof window!=='undefined'?window:globalThis);
