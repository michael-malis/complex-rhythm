import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// The first Bunker redesign retains the existing audio engine and the exact
// complex-root source model. This is measured timing and decoded-sample
// evidence, not a subjective music-listening claim.
fs.mkdirSync('artifacts/bunker-driving',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const report=await page.evaluate(async()=>{
  const research=window.RhythmResearch,math=window.RhythmMath;
  const catalog=research.presets(),bunker=catalog.filter(p=>p.category==='bunker');
  const expected={
   shaft:{bpm:143,n:[4,2,8,2],sounds:['kick','snare','hat','tom'],events:[4,2,8,3]},
   dust:{bpm:134,n:[4,2,4,2],sounds:['kick','rim','openhat','bass'],events:[4,2,4,3]},
   iron:{bpm:151,n:[4,2,8,4],sounds:['kick','clap','hat','acid'],events:[5,2,8,4]},
   pressure:{bpm:140,n:[4,2,4,1],sounds:['kick','snare','hat','bass'],events:[4,2,4,2]}
  };
  // Only presets that have NOT been redesigned belong to the frozen baseline.
  // `concrete` is now verified separately by tests/bunker-raw-concrete.mjs.
  const baseline={};
  for(const [id,exp] of Object.entries(expected)){
   const p=bunker.find(p=>p.id===id);
   baseline[id]={bpm:p.bpm,bars:p.bars,degree:p.tracks.map(t=>t.n),
    sounds:p.tracks.map(t=>t.sound),events:p.tracks.map(t=>research.eventMetadata(t).length)};
  }
  const dust=bunker.find(p=>p.id==='dust'),extra=dust.tracks[3].layers;
  const dustProtected={bpm:dust.bpm,bars:dust.bars,
   cycleBars:dust.tracks.map(t=>t.cycleBars),degrees:dust.tracks.map(t=>t.n),
   sounds:dust.tracks.map(t=>t.sound),gains:dust.tracks.map(t=>t.gain),
   overlays:dust.tracks.map(t=>t.layers.length),
   bassAccent:extra[0]||null};
  const berlin=bunker.find(p=>p.id==='berlin-bass-wall');
  const lanes=berlin.tracks.map(t=>({
   cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,gain:t.gain,
   events:research.eventMetadata(t)
  }));
  const secondsPerBar=240/berlin.bpm;
  const scheduled=math.planEvents(lanes,secondsPerBar,0,secondsPerBar*2);
  const atBars=ev=>ev.time/secondsPerBar;
  const beatBars=scheduled.filter(e=>e.lane===0).map(e=>Number(atBars(e).toFixed(10)));
  const rumbleBars=scheduled.filter(e=>e.lane===1).map(atBars);
  const metadata=lanes.map(t=>t.events);
  const velocityNotes=scheduled.filter(e=>e.sources.some(s=>s.kind==='additional'))
   .map(e=>({lane:e.lane,bar:atBars(e),velocity:e.velocity,source:e.sources}));
  const independent=[
   {label:'kick',cycle:berlin.tracks[0].cycleBars,roots:metadata[0].length},
   {label:'rumble',cycle:berlin.tracks[1].cycleBars,roots:metadata[1].length},
   {label:'hats',cycle:berlin.tracks[2].cycleBars,roots:metadata[2].length},
   {label:'rim',cycle:berlin.tracks[3].cycleBars,roots:metadata[3].length}
  ];
  // Render production CC0 sample bytes with the same master output graph.
  // The rumble's parallel saturation / 260Hz path is reproduced from app.js.
  const sampleFiles={
   'kick-hard':'samples/kick-hard.wav',
   'berlin-rumble':'samples/berlin-rumble.wav',
   'berlin-rumble-alt':'samples/berlin-rumble-alt.wav',
   'hat-crunch':'samples/hat-crunch.wav','rim':'samples/rim.wav'
  };
  const sampleRate=32000,at=.09,duration=at+2*secondsPerBar+.85;
  const ctx=new OfflineAudioContext(1,Math.ceil(sampleRate*duration),sampleRate);
  const chain=window.RhythmVoices.createMasterOutputChain(ctx,ctx.destination,.52);
  const decoded={};
  for(const [key,uri] of Object.entries(sampleFiles)){
   const response=await fetch(uri);
   if(!response.ok)throw new Error('Missing production sample '+uri);
   decoded[key]=await ctx.decodeAudioData(await response.arrayBuffer());
  }
  const gainTable={kick:.51,berlinrumble:.70,hat:.18,rim:.34};
  const variation=[0,-.012,.009,-.007,.004];
  for(const ev of scheduled){
   const track=berlin.tracks[ev.lane];
   const sound=track.sound;
   const key=sound==='kick'?'kick-hard':sound==='hat'?'hat-crunch':
     sound==='rim'?'rim':(ev.sourceEvent%2===0?'berlin-rumble':'berlin-rumble-alt');
   const sample=ctx.createBufferSource();
   sample.buffer=decoded[key];
   sample.playbackRate.value=1+variation[ev.sourceEvent%5];
   const gain=ctx.createGain();
   const level=gainTable[sound]*track.gain*ev.velocity*(sound==='kick'?1.12:1);
   gain.gain.value=level;
   sample.connect(gain);gain.connect(chain.master);
   if(sound==='berlinrumble'){
    const curve=new Float32Array(1024);
    for(let i=0;i<curve.length;i++){
     const x=2*i/(curve.length-1)-1;
     curve[i]=Math.tanh(7*x)/Math.tanh(7);
    }
    const saturation=ctx.createWaveShaper();saturation.curve=curve;saturation.oversample='2x';
    const presence=ctx.createBiquadFilter();presence.type='bandpass';
    presence.frequency.value=260;presence.Q.value=.65;
    const pGain=ctx.createGain();pGain.gain.value=.24*level;
    sample.connect(saturation);saturation.connect(presence);
    presence.connect(pGain);pGain.connect(chain.master);
   }
   sample.start(at+ev.time);
  }
  const rendered=(await ctx.startRendering()).getChannelData(0);
  let peak=0,power=0,finite=true;
  for(const x of rendered){
   if(!Number.isFinite(x)){finite=false;continue}
   peak=Math.max(peak,Math.abs(x));power+=x*x;
  }
  const attackPeaks=beatBars.map(bar=>{
   const from=Math.floor((at+bar*secondsPerBar)*sampleRate);
   const to=Math.min(rendered.length,from+Math.ceil(sampleRate*.055));
   let max=0;for(let i=from;i<to;i++)max=Math.max(max,Math.abs(rendered[i]));
   return max;
  });
  return {catalogCount:catalog.length,bunkerCount:bunker.length,baseline,dustProtected,
   redesigned:{id:berlin.id,bpm:berlin.bpm,bars:berlin.bars,
    degrees:berlin.tracks.map(t=>t.n),sounds:berlin.tracks.map(t=>t.sound),
    trackGains:berlin.tracks.map(t=>t.gain),independent,
    beatBars,rumbleBars,events:scheduled.length,velocityNotes,
    exactSourceEvents:scheduled.every(ev=>Array.isArray(ev.sources)&&ev.sources.length>=1)},
   mix:{sampleRate,keys:Object.keys(sampleFiles),eventSources:scheduled.length,
    peak,rms:Math.sqrt(power/rendered.length),finite,attackPeaks,
    limitation:'Decoded production samples plus actual master chain; does not replace device listening.'}};
 });
 assert.equal(report.catalogCount,50,'all 50 canonical presets retained');
 assert.equal(report.bunkerCount,6,'exactly six original Bunker IDs');
 for(const [id,actual] of Object.entries(report.baseline)){
  const expectations={
   shaft:[143,[4,2,8,2],['kick','snare','hat','tom'],[4,2,8,3]],
   dust:[134,[4,2,4,2],['kick','rim','openhat','bass'],[4,2,4,3]],
   iron:[151,[4,2,8,4],['kick','clap','hat','acid'],[5,2,8,4]],
   pressure:[140,[4,2,4,1],['kick','snare','hat','bass'],[4,2,4,2]]
  }[id];
  assert.equal(actual.bpm,expectations[0],id+' tempo changed');
  assert.equal(actual.bars,1,id+' default bar count changed');
  assert.deepEqual(actual.degree,expectations[1],id+' root degrees changed');
  assert.deepEqual(actual.sounds,expectations[2],id+' instruments changed');
  assert.deepEqual(actual.events,expectations[3],id+' canonical attack schedule changed');
 }
 const d=report.dustProtected;
 assert.deepEqual([d.bpm,d.bars,d.degrees,d.sounds,d.overlays,d.gains],
  [134,1,[4,2,4,2],['kick','rim','openhat','bass'],[0,0,0,1],[1,1,1,1]],
  'protected Dust · Half-light must be identical to original musical sources');
 assert.deepEqual(d.cycleBars,[1,1,1,1]);
 assert.equal(d.bassAccent.n,1);
 assert.ok(Math.abs(d.bassAccent.a-Math.cos(14*Math.PI/8))<1e-9);
 assert.ok(Math.abs(d.bassAccent.b-Math.sin(14*Math.PI/8))<1e-9);
 assert.equal(d.bassAccent.velocity,.55);
 const p=report.redesigned;
 assert.equal(p.id,'berlin-bass-wall');
 assert.equal(p.bpm,146,'energy must come from groove rather than artificial BPM jump');
 assert.equal(p.bars,2,'alternating groove spans exactly two bars');
 assert.deepEqual(p.degrees,[4,8,16,4],'root degree matches intended multi-cycle rhythm');
 assert.deepEqual(p.sounds,['kick','berlinrumble','hat','rim']);
 assert.deepEqual(p.independent.map(x=>x.cycle),[1,2,2,2],
  'four separate time-matched arrows: fast kick vs two-bar supporting orbits');
 assert.deepEqual(p.independent.map(x=>x.roots),[4,10,20,8]);
 assert.equal(p.events,46,'real repeated kick plus 38 supporting source events');
 assert.deepEqual(p.beatBars,[0,.25,.5,.75,1,1.25,1.5,1.75],
  'two bars contain exactly four mathematical quarter-note kicks each');
 assert.deepEqual(p.rumbleBars.filter((x,i)=>i<8).length,8);
 assert.equal(p.velocityNotes.length,10,'real independent low-velocity root accents');
 assert.ok(p.velocityNotes.every(x=>x.velocity>=.28&&x.velocity<=.45&&
  x.source.some(s=>s.kind==='additional')),'accents come from actual additional complex roots');
 assert.ok(p.exactSourceEvents,'each audio event retains provenance');
 assert.equal(report.mix.eventSources,46,'offline audio uses each canonical scheduled event once');
 assert.ok(report.mix.keys.length===5,'all existing authentic production sample sources decoded');
 assert.ok(report.mix.finite&&report.mix.peak>.02&&report.mix.peak<=Math.pow(10,-1/20)+.002,
  'actual decoded groove is audible and stays under the production output ceiling');
 assert.ok(report.mix.rms>.002,'two-bar production mix contains measurable sustained energy');
 assert.ok(report.mix.attackPeaks.length===8&&report.mix.attackPeaks.every(x=>x>.015),
  'eight real quarter-note kick attacks remain present in the decoded mix');
 await page.locator('#categorySelect').selectOption('bunker');
 await page.locator('#presetSelect').selectOption('berlin-bass-wall');
 const selected=await page.evaluate(()=>window.RhythmResearch.current());
 assert.deepEqual(selected.tracks.map(x=>x.cycleBars),[1,2,2,2],
  'visible presets load independent 1-bar and 2-bar cycles unchanged');
 assert.deepEqual(errors,[],'no browser runtime error in selection or waveform decoding');
 fs.writeFileSync('artifacts/bunker-driving/report.json',JSON.stringify({
  status:'PASS',scope:'Six Bunker source baseline; protected Dust; two-bar canonical attack proof; decoded production sample mix with existing limiter; NOT human listening.',...report
 },null,2));
 console.log('PASS Bunker Driving: 8 quarter kicks, 10 rumble, 20 hats, 8 rim per two bars; unchanged Dust; decoded audio under limiter');
 await page.close();
}finally{await browser.close()}
