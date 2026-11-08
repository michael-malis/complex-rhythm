import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// BUNK-05: production complex roots -> AudioContext schedule -> decoded hard
// drums plus the EXISTING native metallic/FM synthesis and master limiter.
// This tests engineering, not AUDIO-01 human sound-quality acceptance.
fs.mkdirSync('artifacts/bunker-shaft',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
try {
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const report=await page.evaluate(async()=>{
  const research=window.RhythmResearch,math=window.RhythmMath,voices=window.RhythmVoices;
  const catalog=research.presets();
  const shaft=catalog.find(p=>p.id==='shaft');
  const dust=catalog.find(p=>p.id==='dust');
  const secPerBar=240/shaft.bpm;
  const lanes=shaft.tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
   gain:t.gain,patch:t.patch,events:research.eventMetadata(t)}));
  const scheduled=math.planEvents(lanes,secPerBar,0,secPerBar*2);
  const phaseTimes=lane=>scheduled.filter(e=>e.lane===lane)
   .map(e=>Number((e.time/secPerBar).toFixed(10)));
  const counts=lanes.map((_,i)=>scheduled.filter(e=>e.lane===i).length);
  const ghostHits=scheduled.filter(e=>e.sources.some(s=>s.kind==='additional'));
  const dustSnapshot={bpm:dust.bpm,bars:dust.bars,
   degrees:dust.tracks.map(t=>t.n),sounds:dust.tracks.map(t=>t.sound),
   gains:dust.tracks.map(t=>t.gain),cycles:dust.tracks.map(t=>t.cycleBars),
   accents:dust.tracks.map(t=>t.layers.map(x=>({n:x.n,velocity:x.velocity})))};
  const peers=catalog.filter(p=>p.category==='bunker'&&p.id!=='shaft');
  const signature=p=>JSON.stringify(p.tracks.map(t=>({
   n:t.n,a:t.a,b:t.b,cycle:t.cycleBars,sound:t.sound,
   extra:t.layers.map(x=>({a:x.a,b:x.b,n:x.n,velocity:x.velocity}))
  })));
  const otherFingerprints=peers.map(p=>({id:p.id,distinct:signature(p)!==signature(shaft)}));
  const samplePaths={kick:'samples/kick-hard.wav',snare:'samples/snare-body.wav'};
  const rate=32000,start=.12,length=start+secPerBar*2+.85;
  const ctx=new OfflineAudioContext(1,Math.ceil(rate*length),rate);
  const master=voices.createMasterOutputChain(ctx,ctx.destination,.52).master;
  const decoded={};
  for(const [voice,path] of Object.entries(samplePaths)){
   const response=await fetch(path);
   if(!response.ok)throw Error('Missing real Bunker sample: '+path);
   decoded[voice]=await ctx.decodeAudioData(await response.arrayBuffer());
  }
  const synthCounts={metallic:0,fmPerc:0};
  for(const event of scheduled){
   const track=shaft.tracks[event.lane];
   const at=start+event.time,velocity=event.velocity*track.gain;
   if(track.sound==='metallic'||track.sound==='fmPerc'){
    if(!voices.play(ctx,master,track.sound,at,velocity,event.sourceEvent,track.patch??null))
     throw Error('Industrial synth voice failed: '+track.sound);
    synthCounts[track.sound]++;
   }else{
    const oneShot=ctx.createBufferSource();
    oneShot.buffer=decoded[track.sound];
    oneShot.playbackRate.value=1+[0,-.012,.009,-.007,.004][event.sourceEvent%5];
    const gain=ctx.createGain();
    gain.gain.value=({kick:.51,snare:.45})[track.sound]*velocity;
    oneShot.connect(gain);gain.connect(master);oneShot.start(at);
   }
  }
  const audio=(await ctx.startRendering()).getChannelData(0);
  let peak=0,energy=0,finite=true;
  for(const value of audio){
   if(!Number.isFinite(value)){finite=false;continue}
   peak=Math.max(peak,Math.abs(value));energy+=value*value;
  }
  const kicks=phaseTimes(0);
  const kickPeaks=kicks.map(bar=>{
   const first=Math.floor((start+bar*secPerBar)*rate);
   let max=0;
   for(let i=first;i<Math.min(first+Math.ceil(rate*.055),audio.length);i++)
    max=Math.max(max,Math.abs(audio[i]));
   return max;
  });
  return {catalog:catalog.length,bunker:catalog.filter(p=>p.category==='bunker').length,
   id:shaft.id,name:shaft.name,bpm:shaft.bpm,bars:shaft.bars,
   degrees:shaft.tracks.map(t=>t.n),cycles:shaft.tracks.map(t=>t.cycleBars),
   sounds:shaft.tracks.map(t=>t.sound),gains:shaft.tracks.map(t=>t.gain),
   voiceFamilies:[voices.definitions.metallic.family,voices.definitions.fmPerc.family],
   counts,kicks,snares:phaseTimes(1),metal:phaseTimes(2),machine:phaseTimes(3),
   ghosts:ghostHits.length,
   sourceComplete:scheduled.every(e=>e.sources.length>0),
   otherFingerprints,dustSnapshot,synthCounts,
   audio:{finite,peak,rms:Math.sqrt(energy/audio.length),kickPeaks,
    disclosure:'Production WAV hard kick/snare, existing metallic/FM synths and real limiter; NOT a human listening test.'}};
 });
 assert.equal(report.catalog,50,'preserve original 50-preset mathematical catalog');
 assert.equal(report.bunker,6,'preserve six Bunker IDs');
 assert.equal(report.id,'shaft');
 assert.equal(report.bpm,143,'energy comes from rewritten groove, not tempo relabeling');
 assert.equal(report.bars,2);
 assert.deepEqual(report.degrees,[4,4,7,3],'independent industrial root families');
 assert.deepEqual(report.cycles,[1,2,2,2]);
 assert.deepEqual(report.sounds,['kick','snare','metallic','fmPerc']);
 assert.deepEqual(report.voiceFamilies,['fm','fm'],'industrial metallic and FM are real synthesizers');
 assert.deepEqual(report.counts,[8,6,11,6]);
 assert.deepEqual(report.kicks,[0,.25,.5,.75,1,1.25,1.5,1.75],
  'quarter kick must not get skipped or hidden by an extra kick');
 assert.deepEqual(report.snares.filter(x=>[.25,.75,1.25,1.75].includes(x)),
  [.25,.75,1.25,1.75],'snare hits resolve the two-bar backbeat');
 assert.equal(report.ghosts,9,'nine independent first-degree complex roots');
 assert.equal(new Set(report.metal).size,11,'every metallic event has unique phase');
 assert.equal(new Set(report.machine).size,6,'each low-FM event has unique phase');
 assert.ok(report.metal.some(x=>Math.abs(x-1/7)<1e-8),
  'seven-fold clangs really run against quarter beats');
 assert.ok(report.machine.some(x=>Math.abs(x-1/6)<1e-8),
  'three-fold FM orbit has independent complex argument');
 assert.ok(report.sourceComplete,'all attacks retain canonical complex-root provenance');
 assert.ok(report.otherFingerprints.every(x=>x.distinct),
  'the new industrial groove must differ from every Bunker peer in mathematical event structure');
 assert.deepEqual(report.dustSnapshot,{
  bpm:134,bars:1,degrees:[4,2,4,2],sounds:['kick','rim','openhat','bass'],
  gains:[1,1,1,1],cycles:[1,1,1,1],
  accents:[[],[],[],[{n:1,velocity:.55}]]
 },'Dust · Half-light remains an unchanged control');
 assert.deepEqual(report.synthCounts,{metallic:11,fmPerc:6},
  'all native metallic/FM attacks have been rendered');
 assert.ok(report.audio.finite&&report.audio.peak>.02&&
  report.audio.peak<=Math.pow(10,-1/20)+.002,'rendered mix remains finite and within master safety ceiling');
 assert.ok(report.audio.rms>.002,'rendered machine groove contains real energy');
 assert.ok(report.audio.kickPeaks.length===8&&report.audio.kickPeaks.every(p=>p>.012),
  'every quarter kick creates a measurable onset in the mixed audio');
 await page.locator('#categorySelect').selectOption('bunker');
 await page.locator('#presetSelect').selectOption('shaft');
 const loaded=await page.evaluate(()=>window.RhythmResearch.current());
 assert.deepEqual(loaded.tracks.map(t=>t.sound),report.sounds,
  'user selects the same four mathematical/audio orbits');
 assert.deepEqual(loaded.tracks.map(t=>t.cycleBars),report.cycles);
 assert.deepEqual(errors,[],'no runtime browser errors');
 fs.writeFileSync('artifacts/bunker-shaft/report.json',JSON.stringify({
  status:'PASS',scope:'BUNK-05 complex-root schedules, production hard samples, native metallic/FM synthesis and limiter; not audition',...report
 },null,2));
 console.log('PASS Shaft Industrial: eight four-on-floor kicks / 6 snare / 11 metallic / 6 FM attacks, 9 root accents, protected Dust');
 await page.close();
}finally{await browser.close()}
