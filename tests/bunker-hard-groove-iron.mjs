import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

// BUNK-06: actual hard-groove complex-root attacks mixed with production
// hard kick, clap, hat and tom WAVs through the same Web Audio master.
// Mathematical/audio checks do not replace AUDIO-01 human audition.
fs.mkdirSync('artifacts/bunker-iron',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 const report=await page.evaluate(async()=>{
  const research=window.RhythmResearch,math=window.RhythmMath,voices=window.RhythmVoices;
  const catalog=research.presets(),iron=catalog.find(p=>p.id==='iron');
  const dust=catalog.find(p=>p.id==='dust');
  const sec=240/iron.bpm;
  const lanes=iron.tracks.map(t=>({cycleBars:t.cycleBars,sound:t.sound,
   gain:t.gain,patch:t.patch,muted:t.muted,events:research.eventMetadata(t)}));
  const events=math.planEvents(lanes,sec,0,sec*2);
  const times=lane=>events.filter(e=>e.lane===lane).map(e=>Number((e.time/sec).toFixed(10)));
  const counts=lanes.map((_,i)=>events.filter(e=>e.lane===i).length);
  const roots=events.filter(e=>e.sources.some(s=>s.kind==='additional'));
  const oldDust={bpm:dust.bpm,bars:dust.bars,degrees:dust.tracks.map(t=>t.n),
   sounds:dust.tracks.map(t=>t.sound),gains:dust.tracks.map(t=>t.gain),
   cycles:dust.tracks.map(t=>t.cycleBars),
   accents:dust.tracks.map(t=>t.layers.map(x=>({n:x.n,velocity:x.velocity})))};
  const signature=p=>JSON.stringify(p.tracks.map(t=>({n:t.n,a:t.a,b:t.b,
   cycle:t.cycleBars,sound:t.sound,extra:t.layers.map(x=>({a:x.a,b:x.b,n:x.n,velocity:x.velocity}))})));
  const distinctPeers=catalog.filter(p=>p.category==='bunker'&&p.id!=='iron')
   .map(p=>({id:p.id,distinct:signature(p)!==signature(iron)}));
  const sampleMap={kick:'samples/kick-hard.wav',clap:'samples/clap.wav',
   hat:'samples/hat-crunch.wav',tom:'samples/tom.wav'};
  const rate=32000,offset=.12;
  const ctx=new OfflineAudioContext(1,Math.ceil(rate*(offset+sec*2+.8)),rate);
  const master=voices.createMasterOutputChain(ctx,ctx.destination,.52).master;
  const samples={};
  for(const [key,path] of Object.entries(sampleMap)){
   const response=await fetch(path);
   if(!response.ok)throw Error('Real Hard Groove sample unavailable: '+path);
   samples[key]=await ctx.decodeAudioData(await response.arrayBuffer());
  }
  for(const event of events){
   const track=iron.tracks[event.lane],at=offset+event.time;
   const oneShot=ctx.createBufferSource();oneShot.buffer=samples[track.sound];
   oneShot.playbackRate.value=1+[0,-.012,.009,-.007,.004][event.sourceEvent%5];
   const gain=ctx.createGain();
   gain.gain.value=({kick:.51,clap:.36,hat:.18,tom:.33})[track.sound]*track.gain*event.velocity;
   oneShot.connect(gain);gain.connect(master);oneShot.start(at);
  }
  const data=(await ctx.startRendering()).getChannelData(0);
  let peak=0,sum=0,finite=true;
  for(const value of data){
   if(!Number.isFinite(value)){finite=false;continue}
   peak=Math.max(peak,Math.abs(value));sum+=value*value;
  }
  const kickPeaks=times(0).map(bar=>{
   const first=Math.floor(rate*(offset+bar*sec));
   let max=0;
   for(let i=first;i<Math.min(data.length,first+Math.ceil(.06*rate));i++)
    max=Math.max(max,Math.abs(data[i]));
   return max;
  });
  return {catalog:catalog.length,bunker:catalog.filter(p=>p.category==='bunker').length,
   id:iron.id,name:iron.name,bpm:iron.bpm,bars:iron.bars,
   degrees:iron.tracks.map(t=>t.n),cycles:iron.tracks.map(t=>t.cycleBars),
   sounds:iron.tracks.map(t=>t.sound),gains:iron.tracks.map(t=>t.gain),
   counts,kicks:times(0),claps:times(1),hats:times(2),toms:times(3),
   ghosts:roots.length,sourcesComplete:events.every(e=>e.sources.length>0),
   distinctPeers,oldDust,
   audio:{finite,peak,rms:Math.sqrt(sum/data.length),kickPeaks,
    disclosure:'Real production hard kick, clap, hat and tom, shared limiter; not a listening test.'}};
 });
 assert.equal(report.catalog,50);
 assert.equal(report.bunker,6);
 assert.equal(report.id,'iron');
 assert.equal(report.bpm,151,'not an arbitrary tempo increase');
 assert.equal(report.bars,2);
 assert.deepEqual(report.degrees,[4,4,12,5]);
 assert.deepEqual(report.cycles,[1,2,2,2]);
 assert.deepEqual(report.sounds,['kick','clap','hat','tom']);
 assert.deepEqual(report.counts,[8,8,16,9]);
 assert.deepEqual(report.kicks,[0,.25,.5,.75,1,1.25,1.5,1.75],
  'hard groove keeps precisely eight clear quarter kicks with no extra ghost kicks');
 assert.deepEqual(report.claps.filter(x=>[.25,.75,1.25,1.75].includes(x)),
  [.25,.75,1.25,1.75],'clap backbeats remain clear');
 assert.equal(report.ghosts,12,'twelve individual root-sourced syncopations');
 assert.ok(report.toms.some(x=>Math.abs(x-.1)<1e-8),'R5(i) tom is truly independent of the quarter grid');
 assert.equal(new Set(report.toms).size,9,'toms do not collapse into same-lane duplicate events');
 assert.equal(new Set(report.hats).size,16,'16 distinct hat positions over two bars');
 assert.ok(report.sourcesComplete,'sound, phases and visual roots share provenance');
 assert.ok(report.distinctPeers.every(p=>p.distinct),
  'distinct root and percussion fingerprints across all six Bunker variants');
 assert.deepEqual(report.oldDust,{
  bpm:134,bars:1,degrees:[4,2,4,2],sounds:['kick','rim','openhat','bass'],
  gains:[1,1,1,1],cycles:[1,1,1,1],
  accents:[[],[],[],[{n:1,velocity:.55}]]
 },'reference Dust remains precisely intact');
 assert.ok(report.audio.finite&&report.audio.peak>.02&&
  report.audio.peak<=Math.pow(10,-1/20)+.002,'real mix safe under production limiter');
 assert.ok(report.audio.rms>.002,'real decoded drum energy exists');
 assert.ok(report.audio.kickPeaks.length===8&&report.audio.kickPeaks.every(v=>v>.012),
  'all eight kicks are measurable in the mixed render');
 await page.locator('#categorySelect').selectOption('bunker');
 await page.locator('#presetSelect').selectOption('iron');
 const loaded=await page.evaluate(()=>window.RhythmResearch.current());
 assert.deepEqual(loaded.tracks.map(t=>t.sound),report.sounds);
 assert.deepEqual(loaded.tracks.map(t=>t.cycleBars),report.cycles);
 assert.deepEqual(errors,[],'no browser runtime exceptions');
 fs.writeFileSync('artifacts/bunker-iron/report.json',JSON.stringify({
  status:'PASS',scope:'BUNK-06 real root timing, synced events, decoded hard-groove samples and limiter; not human audition',...report
 },null,2));
 console.log('PASS Iron Hard Groove: 8 kick / 8 clap / 16 hat / 9 tom, 12 source accents, unchanged Dust and safe real output');
 await page.close();
}finally{await browser.close()}
