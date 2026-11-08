import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Structural and real Web Audio rendering evidence for BUNK-03.
// Sound quality/genre authenticity still require AUDIO-01 human listening.
fs.mkdirSync('artifacts/bunker-concrete',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const info=await page.evaluate(async()=>{
  const research=window.RhythmResearch,math=window.RhythmMath;
  const presets=research.presets(),concrete=presets.find(p=>p.id==='concrete');
  const berlin=presets.find(p=>p.id==='berlin-bass-wall');
  const protectedDust=presets.find(p=>p.id==='dust');
  const secPerBar=240/concrete.bpm;
  const lanes=concrete.tracks.map(t=>({cycleBars:t.cycleBars,sound:t.sound,
   gain:t.gain,muted:t.muted,patch:t.patch,events:research.eventMetadata(t)}));
  const hits=math.planEvents(lanes,secPerBar,0,2*secPerBar);
  const bars=lane=>hits.filter(ev=>ev.lane===lane).map(ev=>Number((ev.time/secPerBar).toFixed(10)));
  const extras=hits.filter(ev=>ev.sources.some(s=>s.kind==='additional'));
  const count=lanes.map((_,i)=>hits.filter(ev=>ev.lane===i).length);
  const dust={bpm:protectedDust.bpm,bars:protectedDust.bars,
   n:protectedDust.tracks.map(t=>t.n),sounds:protectedDust.tracks.map(t=>t.sound),
   gains:protectedDust.tracks.map(t=>t.gain),cycles:protectedDust.tracks.map(t=>t.cycleBars),
   layers:protectedDust.tracks.map(t=>t.layers)};
  const sampleKeys=['kick-hard','clap','hat-crunch'];
  const sourceMap={'kick':'kick-hard','clap':'clap','hat':'hat-crunch'};
  const sampleRate=32000,delay=.09,duration=delay+2*secPerBar+.9;
  const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*duration),sampleRate);
  const master=window.RhythmVoices.createMasterOutputChain(ctx,ctx.destination,.52).master;
  const decoded={};
  for(const key of sampleKeys){
   const resp=await fetch('samples/'+key+'.wav');
   if(!resp.ok)throw Error('Real production sample unavailable: '+key);
   decoded[key]=await ctx.decodeAudioData(await resp.arrayBuffer());
  }
  for(const ev of hits){
   const source=concrete.tracks[ev.lane];
   const t=delay+ev.time,velocity=ev.velocity*source.gain;
   if(source.sound==='reese'){
    // Same native fallback as app.js::playNativeLegacy('reese'):
    // two low detuned saw oscillators -> decaying lowpass -> per-hit gain.
    const filter=ctx.createBiquadFilter();filter.type='lowpass';
    filter.frequency.setValueAtTime(1100,t);
    filter.frequency.exponentialRampToValueAtTime(280,t+.3);
    filter.Q.value=1.1;
    const envelope=ctx.createGain();
    envelope.gain.setValueAtTime(.0001,t);
    envelope.gain.exponentialRampToValueAtTime(.24,t+.008);
    envelope.gain.exponentialRampToValueAtTime(.0001,t+.36);
    const bus=ctx.createGain();bus.gain.value=Math.max(.05,Math.min(1,velocity));
    filter.connect(envelope);envelope.connect(bus);bus.connect(master);
    for(const detune of [-9,9]){
     const osc=ctx.createOscillator();osc.type='sawtooth';
     osc.frequency.setValueAtTime(53,t);osc.detune.value=detune;
     osc.connect(filter);osc.start(t);osc.stop(t+.39);
    }
   } else {
    const sample=ctx.createBufferSource();
    sample.buffer=decoded[sourceMap[source.sound]];
    const index=ev.sourceEvent;
    sample.playbackRate.value=1+[0,-.012,.009,-.007,.004][index%5];
    const bus=ctx.createGain();
    bus.gain.value=({kick:.51,clap:.36,hat:.18})[source.sound]*velocity;
    sample.connect(bus);bus.connect(master);sample.start(t);
   }
  }
  const audio=(await ctx.startRendering()).getChannelData(0);
  let peak=0,sum=0,finite=true;
  for(const a of audio){if(!Number.isFinite(a)){finite=false;continue}
   peak=Math.max(peak,Math.abs(a));sum+=a*a;
  }
  const attackPeaks=bars(0).map(bar=>{
   let max=0,lo=Math.floor((delay+bar*secPerBar)*sampleRate);
   for(let j=lo;j<Math.min(audio.length,lo+Math.ceil(.06*sampleRate));j++)
    max=Math.max(max,Math.abs(audio[j]));
   return max;
  });
  return {catalog:presets.length,bunker:presets.filter(p=>p.category==='bunker').length,
   id:concrete.id,bpm:concrete.bpm,bars:concrete.bars,
   degrees:concrete.tracks.map(t=>t.n),cycles:concrete.tracks.map(t=>t.cycleBars),
   sounds:concrete.tracks.map(t=>t.sound),gains:concrete.tracks.map(t=>t.gain),
   counts:count,beatBars:bars(0),clapBars:bars(1),hatBars:bars(2),bassBars:bars(3),
   accents:extras.length,provenance:hits.every(ev=>ev.sources.length>0),
   sharedTime:math.analyzeSchedule(hits).sharedMoments,
   berlinFingerprint:berlin.tracks.map(t=>[t.sound,t.n,t.cycleBars]),
   dust,
   sound:{sampleKeys,peak,rms:Math.sqrt(sum/audio.length),finite,attackPeaks,
    note:'Production sampled drums + native Reese fallback and master limiter; NOT human listening.'}};
 });
 assert.equal(info.catalog,50,'keep all 50 canonical presets');
 assert.equal(info.bunker,6,'retain six Bunker IDs');
 assert.equal(info.id,'concrete');
 assert.equal(info.bpm,138,'raw punch comes from changed groove, not BPM');
 assert.equal(info.bars,2,'two-bar alternating backbeat');
 assert.deepEqual(info.degrees,[4,4,8,3],'distinct complex-root families');
 assert.deepEqual(info.cycles,[1,2,2,2],'independent one-bar and two-bar rings');
 assert.deepEqual(info.sounds,['kick','clap','hat','reese']);
 assert.deepEqual(info.counts,[8,6,12,6],'actual scheduled events, not renamed labels');
 assert.deepEqual(info.beatBars,[0,.25,.5,.75,1,1.25,1.5,1.75],
  'eight genuine quarter-note kicks and no extra kick ghosts');
 assert.deepEqual(info.clapBars.filter(x=>[.25,.75,1.25,1.75].includes(x)),
  [.25,.75,1.25,1.75],'backbeats on 2 and 4 of both bars');
 assert.equal(info.accents,9,'nine independently sourced ghost complex roots');
 assert.ok(info.bassBars.some(v=>Math.abs(v-.1666666667)<1e-8),
  'three-against-four Reese orbit is a real phase, not a separate sequencer');
 assert.ok(info.provenance,'each audible hit has canonical mathematical source');
 assert.notDeepEqual(info.berlinFingerprint,[
  ['kick',4,1],['clap',4,2],['hat',8,2],['reese',3,2]
 ],'Raw is not simply the Bass Wall beat with other names');
 const dust=info.dust;
 assert.deepEqual([dust.bpm,dust.bars,dust.n,dust.sounds,dust.gains,dust.cycles,
  dust.layers.map(l=>l.length)],
 [134,1,[4,2,4,2],['kick','rim','openhat','bass'],[1,1,1,1],[1,1,1,1],[0,0,0,1]],
 'Dust remains protected and mathematically identical');
 assert.equal(dust.layers[3][0].velocity,.55);
 assert.ok(info.sound.finite&&info.sound.peak>.02&&info.sound.peak<=Math.pow(10,-1/20)+.002,
  'native Reese and real WAV drums are finite, audible and limited');
 assert.ok(info.sound.rms>.002,'two-bar bass and percussion output has measurable energy');
 assert.ok(info.sound.attackPeaks.every(x=>x>.012),'all eight quarter attacks audible in offline output');
 await page.locator('#categorySelect').selectOption('bunker');
 await page.locator('#presetSelect').selectOption('concrete');
 const actual=await page.evaluate(()=>window.RhythmResearch.current());
 assert.deepEqual(actual.tracks.map(t=>t.cycleBars),[1,2,2,2]);
 assert.deepEqual(actual.tracks.map(t=>t.sound),['kick','clap','hat','reese']);
 assert.deepEqual(errors,[],'no browser exceptions');
 fs.writeFileSync('artifacts/bunker-concrete/report.json',JSON.stringify({status:'PASS',...info},null,2));
 console.log('PASS Raw Concrete: 8 kick / 6 clap / 12 hats / 6 Reese, 9 source accents, untouched Dust, real decoded drums under limiter');
 await page.close();
}finally{await browser.close()}
