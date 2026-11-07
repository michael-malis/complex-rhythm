import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

// R-SND-001: every mandatory ORIGINAL instrument must produce a real source,
// not merely a selectable name or copied generic impulse.
const mandatory=[
 {name:'Techno kick',sound:'technoKick',kind:'Synthesized'},
 {name:'Distorted hardcore kick',sound:'hardcoreKick',kind:'Synthesized'},
 {name:'Gabber kick',sound:'gabberKick',kind:'Synthesized'},
 {name:'Frenchcore pitched kick',sound:'frenchcoreKick',kind:'Synthesized'},
 {name:'Industrial metallic percussion',sound:'metallic',kind:'Synthesized'},
 {name:'Snare',sound:'snare',kind:'Recorded sample'},
 {name:'Closed hat',sound:'hat',kind:'Recorded sample'},
 {name:'Open hat',sound:'openhat',kind:'Recorded sample'},
 {name:'Acid bass',sound:'acidClassic',kind:'Synthesized'},
 {name:'Hoover bass',sound:'hoover',kind:'Synthesized'},
 {name:'Reese bass',sound:'reese',kind:'Synthesized fallback'},
 {name:'Rave stab',sound:'raveStab',kind:'Synthesized'},
 {name:'Noise burst',sound:'noiseBurst',kind:'Synthesized'},
 {name:'FM percussion',sound:'fmPerc',kind:'Synthesized'}
];
assert.equal(new Set(mandatory.map(x=>x.sound)).size,14);
fs.mkdirSync('artifacts/mandatory-voice-inventory',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[];
try {
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  const runtimeErrors=[];page.on('pageerror',e=>runtimeErrors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  const initial=await page.evaluate(()=>({
   phases:window.RhythmResearch.events(window.RhythmResearch.current().tracks[0]).map(x=>x.phase),
   preset:window.RhythmResearch.transport().activePresetId,
   schedulers:window.RhythmResearch.transport().schedulerIntervalsCreated
  }));
  await page.locator('#advancedSoundDetails summary').click();
  const rows=[];
  for(const voice of mandatory){
   const option=page.locator('#laneSound0 option').filter({hasText:voice.name});
   assert.ok(await page.locator('#laneSound0 option[value="'+voice.sound+'"]').count(),
    'Source inventory must have an actual user-selectable option '+voice.sound);
   await page.locator('#laneSound0').selectOption(voice.sound);
   await page.waitForFunction(kind=>{
    const status=document.querySelector('#soundWaveStatus')?.textContent||'';
    return status.startsWith(kind+' ·')&&status.includes('peak ');
   },voice.kind,{timeout:15000});
   const info=await page.evaluate(()=>({
    status:document.querySelector('#soundWaveStatus').textContent,
    url:document.querySelector('#soundWaveCanvas').toDataURL('image/png'),
    selected:window.RhythmResearch.current().tracks[0].sound,
    waveVisible:document.querySelector('#soundWaveCanvas').getBoundingClientRect().width>0
   }));
   assert.equal(info.selected,voice.sound);
   assert.ok(info.waveVisible&&info.url.length>1200,'visible waveform is rendered '+voice.name);
   const match=info.status.match(/peak (\d+(?:\.\d+)?)/);
   const peak=Number(match?.[1]);
   assert.ok(Number.isFinite(peak)&&peak>.005&&peak<3,
    'genuine audible-energy source has a finite level: '+voice.name+' '+info.status);
   rows.push({name:voice.name,sound:voice.sound,kind:voice.kind,peak,
    waveformSha256:crypto.createHash('sha256').update(info.url).digest('hex'),
    waveformBytes:info.url.length});
  }
  assert.equal(rows.length,14,'all fourteen source requirements');
  assert.equal(new Set(rows.map(x=>x.waveformSha256)).size,14,
   'No two mandatory instruments may render the same NORMALIZED on-screen waveform, even across sample/synth sources');
  assert.equal(rows.filter(x=>x.kind==='Synthesized').length,10);
  assert.equal(rows.filter(x=>x.kind==='Recorded sample').length,3);
  assert.equal(rows.filter(x=>x.kind==='Synthesized fallback').length,1);
  const final=await page.evaluate(()=>({
   phases:window.RhythmResearch.events(window.RhythmResearch.current().tracks[0]).map(x=>x.phase),
   preset:window.RhythmResearch.transport().activePresetId,
   transport:window.RhythmResearch.transport(),
   viewport:window.innerWidth,scrollWidth:document.documentElement.scrollWidth
  }));
  assert.deepEqual(final.phases,initial.phases,
   'Switching sounds must never modify the original mathematical complex-root phases');
  assert.equal(final.preset,initial.preset,'instrument exploration must not silently load a preset');
  assert.equal(final.transport.timerActive,false,'no recurring scheduler is added while browsing sounds');
  assert.equal(final.transport.schedulerIntervalsCreated,initial.schedulers);
  assert.ok(final.scrollWidth<=final.viewport+2,'Sound Lab must remain responsive without page-wide horizontal scrollbar');
  assert.deepEqual(runtimeErrors,[],'no JS errors across fourteen mandatory instruments');
  cases.push({width:viewport.width,verifiedVoices:rows.length,recordedSources:3,
   standaloneSynthesis:10,nativeFallback:1,uniqueWaveforms:14,
   mathRootsPreserved:true,noTransportTimers:true,noOverflow:true,runtimeErrors:0,rows});
  await page.close();
 }
 fs.writeFileSync('artifacts/mandatory-voice-inventory/report.json',JSON.stringify({
  status:'PASS',requiredCount:14,cases,
  scope:'14 originally mandated instruments, each manually selectable in the real four-lane app; actual shared Synthesized / Recorded sample / Synthesized fallback waveform rendering and gain-independent pixel distinction in desktop and mobile Chromium.',
  caveat:'Normalized waveform uniqueness is engineering evidence. It does not replace blind listening, perceptual authenticity or real-device tests (M13).'
 },null,2)+'\n');
 console.log('PASS 14/14 required distinct Web Audio/recorded sound families at desktop+mobile, no root or transport mutations');
} finally {await browser.close()}
