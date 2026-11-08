import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// BUNK-04: actual complex roots -> scheduled Web Audio attack events. The
// offline mix uses recorded bunker drum samples + the EXISTING screaming
// acid voice/limiter. Audible musical acceptance stays external (AUDIO-01).
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
fs.mkdirSync('artifacts/bunker-pressure',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const report=await page.evaluate(async()=>{
  const research=window.RhythmResearch,math=window.RhythmMath,voices=window.RhythmVoices;
  const catalog=research.presets();
  const preset=catalog.find(p=>p.id==='pressure');
  const dust=catalog.find(p=>p.id==='dust');
  const secondsPerBar=240/preset.bpm;
  const lanes=preset.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,gain:t.gain,patch:t.patch,events:research.eventMetadata(t)}));
  const scheduled=math.planEvents(lanes,secondsPerBar,0,secondsPerBar*2);
  const q=x=>Number(x.toFixed(10));
  const barTimes=lane=>scheduled.filter(e=>e.lane===lane).map(e=>q(e.time/secondsPerBar));
  const level=scheduled.filter(ev=>ev.sources.some(s=>s.kind==='additional'));
  const counts=lanes.map((t,i)=>scheduled.filter(e=>e.lane===i).length);
  const sampleMap={kick:'samples/kick-hard.wav',snare:'samples/snare-body.wav',hat:'samples/hat-crunch.wav'};
  const rate=32000,offset=.11,length=offset+2*secondsPerBar+.8;
  const context=new OfflineAudioContext(1,Math.ceil(rate*length),rate);
  const master=voices.createMasterOutputChain(context,context.destination,.52).master;
  const decoded={};
  for(const [name,path] of Object.entries(sampleMap)){
   const resp=await fetch(path);
   if(!resp.ok)throw Error('Real Bunker one-shot is unavailable: '+path);
   decoded[name]=await context.decodeAudioData(await resp.arrayBuffer());
  }
  let acidCount=0;
  for(const ev of scheduled){
   const track=preset.tracks[ev.lane];
   const attack=offset+ev.time,vol=track.gain*ev.velocity;
   if(track.sound==='acidScreaming'){
    if(!voices.play(context,master,track.sound,attack,vol,ev.sourceEvent,track.patch??null))
     throw Error('Existing acid voice did not synthesize');
    acidCount++;
   } else {
    const hit=context.createBufferSource();hit.buffer=decoded[track.sound];
    hit.playbackRate.value=1+[0,-.012,.009,-.007,.004][ev.sourceEvent%5];
    const gain=context.createGain();
    gain.gain.value=({kick:.51,snare:.4,hat:.18})[track.sound]*vol;
    hit.connect(gain);gain.connect(master);hit.start(attack);
   }
  }
  const audio=(await context.startRendering()).getChannelData(0);
  let peak=0,power=0,finite=true;
  for(const v of audio){
   if(!Number.isFinite(v)){finite=false;continue;}
   peak=Math.max(peak,Math.abs(v));power+=v*v;
  }
  const attackPeaks=barTimes(0).map(bar=>{
   const start=Math.floor((offset+bar*secondsPerBar)*rate),end=Math.min(audio.length,start+Math.ceil(rate*.05));
   let max=0;for(let i=start;i<end;i++)max=Math.max(max,Math.abs(audio[i]));
   return max;
  });
  // In a real math visualization the schedule's provenance is shared with all
  // four independent animated hands; do not infer manual music quality from it.
  const dustRef={bpm:dust.bpm,bars:dust.bars,
   degrees:dust.tracks.map(t=>t.n),sounds:dust.tracks.map(t=>t.sound),
   gains:dust.tracks.map(t=>t.gain),cycles:dust.tracks.map(t=>t.cycleBars),
   extras:dust.tracks.map(t=>t.layers.map(x=>({n:x.n,velocity:x.velocity})))};
  return {
   catalog:catalog.length,bunker:catalog.filter(x=>x.category==='bunker').length,
   id:preset.id,name:preset.name,bpm:preset.bpm,bars:preset.bars,
   cycles:preset.tracks.map(t=>t.cycleBars),degrees:preset.tracks.map(t=>t.n),
   sounds:preset.tracks.map(t=>t.sound),gains:preset.tracks.map(t=>t.gain),
   counts,beats:barTimes(0),snares:barTimes(1),hats:barTimes(2),acid:barTimes(3),
   voice:voices.definitions[preset.tracks[3].sound],extraSourceEvents:level.length,
   acidExtraNotes:level.filter(x=>x.lane===3).length,
   sourcesComplete:scheduled.every(e=>e.sources.length>0),
   scheduleDuration:secondsPerBar*2,acidCount,dustRef,
   audio:{peak,rms:Math.sqrt(power/audio.length),finite,attackPeaks,
    disclosure:'Decoded production kick/snare/hat plus actual acid synthesis and master output. NOT a human listening test.'}
  };
 });
 assert.equal(report.catalog,50);
 assert.equal(report.bunker,6);
 assert.equal(report.id,'pressure');
 assert.equal(report.bpm,140,'energy is from real notes, not forced tempo');
 assert.equal(report.bars,2);
 assert.deepEqual(report.cycles,[1,2,2,2]);
 assert.deepEqual(report.degrees,[4,4,12,5]);
 assert.deepEqual(report.sounds,['kick','snare','hat','acidScreaming']);
 assert.deepEqual(report.counts,[8,6,16,9]);
 assert.deepEqual(report.beats,[0,.25,.5,.75,1,1.25,1.5,1.75],
  'uninterrupted quarter kick every beat in both bars');
 assert.deepEqual(report.snares.filter(x=>[.25,.75,1.25,1.75].includes(x)),[.25,.75,1.25,1.75],
  'backbeats are rhythmically grounded');
 assert.equal(report.voice.family,'acid','must be dedicated expressive acid patch');
 assert.equal(report.voice.osc,'sawtooth');
 assert.ok(report.voice.q>=20,'existing resonant acid filter');
 assert.equal(report.acid.length,9,'five independent root notes and four ghost phrase changes');
 assert.equal(report.acidExtraNotes,4);
 assert.equal(report.extraSourceEvents,10);
 assert.ok(new Set(report.acid).size===9,'phrases cannot collapse into overlapping attack phases');
 assert.ok(report.sourcesComplete,'all rhythm attacks retain complex-root provenance');
 assert.equal(report.acidCount,9,'native synth generated every scheduled acid event');
 assert.deepEqual(report.dustRef,{
  bpm:134,bars:1,degrees:[4,2,4,2],sounds:['kick','rim','openhat','bass'],
  gains:[1,1,1,1],cycles:[1,1,1,1],
  extras:[[],[],[],[{n:1,velocity:.55}]]
 },'protected Dust · Half-light untouched');
 assert.ok(report.audio.finite&&report.audio.peak>.02&&report.audio.peak<=Math.pow(10,-1/20)+.002,
  'mixed real audio stays finite and below hard ceiling');
 assert.ok(report.audio.rms>.002,'has actual audible energy');
 assert.ok(report.audio.attackPeaks.length===8&&report.audio.attackPeaks.every(v=>v>.012),
  'all eight kick attack windows have measurable signal');
 await page.locator('#categorySelect').selectOption('bunker');
 await page.locator('#presetSelect').selectOption('pressure');
 const selected=await page.evaluate(()=>window.RhythmResearch.current());
 assert.deepEqual(selected.tracks.map(t=>t.cycleBars),[1,2,2,2]);
 assert.deepEqual(selected.tracks.map(t=>t.sound),['kick','snare','hat','acidScreaming']);
 assert.deepEqual(errors,[],'no console exceptions');
 fs.writeFileSync('artifacts/bunker-pressure/report.json',JSON.stringify({
  status:'PASS',scope:'BUNK-04 canonical complex-root scheduling, true two-bar 303 voice and decoded drum safety; NOT human listening',...report
 },null,2));
 console.log('PASS Pressure Acid: 8 quarter kicks / 6 snares / 16 hats / 9 acid lead notes, 10 accents, old Dust untouched, voice/limiter rendered');
 await page.close();
} finally {await browser.close()}
