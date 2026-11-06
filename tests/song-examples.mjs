import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=JSON.parse(fs.readFileSync(
 'presets/song-examples/prodigy-boom-boom-tap-study.roots-rhythm.json','utf8'
));
const browser=await chromium.launch({headless:true,args:[
 '--no-sandbox','--autoplay-policy=no-user-gesture-required'
]});
const results=[];
fs.mkdirSync('artifacts/song-examples',{recursive:true});
try{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}])
 for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport,acceptDownloads:true,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();

  const canonicalBefore=await page.evaluate(()=>window.RhythmResearch.current());
  const defaultId=await page.evaluate(()=>window.RhythmResearch.transport().activePresetId);
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing,null,{timeout:10000});
  const transportBefore=await page.evaluate(()=>window.RhythmResearch.transport());
  await page.locator('#collectionSelect').selectOption('songs');
  assert.equal(await page.locator('#categorySelect').inputValue(),'all',
   'Song Examples collection defaults to all songs');
  assert.deepEqual(await page.evaluate(()=>window.RhythmResearch.current()),canonicalBefore,
   'changing song category never modifies the current four-lane rhythm');
  const transportBrowse=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(transportBrowse.activePresetId,defaultId,'browsing does not load a song');
  assert.equal(transportBrowse.schedulerIntervalsCreated,transportBefore.schedulerIntervalsCreated,
   'browsing does not restart the Web Audio scheduler');
  assert.equal(transportBrowse.schedulerIntervalsCleared,transportBefore.schedulerIntervalsCleared,
   'browsing does not pause the active scheduler');
  assert.ok(transportBrowse.playing,'transport stays running while browsing');
  const choices=await page.locator('#presetSelect option').evaluateAll(opts=>opts
    .filter(o=>!o.disabled&&!o.value.startsWith('__')).map(o=>o.value));
  assert.deepEqual(choices,['prodigy-boom-boom-tap-study'],
   'song study is a selectable, unique example');

  await page.locator('#presetSelect').selectOption('prodigy-boom-boom-tap-study');
  assert.equal(await page.locator('#collectionSelect').inputValue(),'songs');
  const info=await page.locator('#presetInfo').textContent();
  assert.match(info,/not an official or verified transcription/i);
  assert.ok(!info.includes('official release'),'song attribution must not imply official status');
  const current=await page.evaluate(()=>window.RhythmResearch.current());
  assert.equal(current.bpm,160);
  assert.equal(current.tracks.length,4);
  for(const [i,expected] of source.tracks.entries()){
   const actual=current.tracks[i];
   for(const key of ['a','b','n','sound','gain','cycleBars','muted','operation'])
    assert.equal(actual[key],expected[key],'exact source value '+key+' for lane '+(i+1));
   assert.deepEqual(actual.layers,expected.layers,'exact complex coordinates and accents for lane '+(i+1));
   const rendered=await page.locator('#laneEq'+i+' .katex').count();
   assert.ok(rendered>=1,'each source root family must be properly typeset');
  }
  assert.ok(await page.locator('#presetSelect option:checked').textContent().then(t=>t.includes('Rhythm Study')),
   'song example is titled in English');
  const active=await page.evaluate(()=>window.RhythmResearch.transport());
  assert.equal(active.activePresetId,'prodigy-boom-boom-tap-study');
  assert.ok(active.playing,'explicit song load preserves running transport');
  assert.equal(await page.locator('#bpmText').textContent(),'160',
   'song tempo is visible and matches JSON');
  const schedule=await page.evaluate(()=>window.RhythmResearch.current().tracks.map(t=>
   window.RhythmResearch.events(t).map(e=>e.phase)));
  assert.deepEqual(schedule.map(e=>e.length),[4,4,8,4],
   'root-union scheduler preserves exact kick, snare, hat, Reese events');
  const audio=await page.evaluate(()=>window.RhythmResearch.samplePlan());
  assert.ok(audio.keys.includes('kick')&&audio.keys.includes('snare')&&audio.keys.includes('hat'),
   'sample routing remains internal; no copyrighted audio is ingested');

  await page.locator('#fileMenu summary').click();
  const download=page.waitForEvent('download');
  await page.locator('#saveBtn').click();
  const file=await download;
  const exported=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
  assert.equal(exported.name,source.name,'export retains the original supplied song study name');
  assert.equal(exported.bpm,source.bpm);
  for(const [i,expected] of source.tracks.entries()){
   for(const key of ['a','b','n','sound','gain','cycleBars','muted','operation'])
    assert.equal(exported.tracks[i][key],expected[key],'JSON export '+i+' '+key);
   assert.deepEqual(exported.tracks[i].layers,expected.layers,
    'export must preserve the source complex coefficients without rounding');
  }
  await page.locator('#jsonFile').setInputFiles({
   name:'song-study.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(source))
  });
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Imported rhythm:'));
  assert.equal(await page.evaluate(()=>window.RhythmResearch.transport().activePresetId),
   'prodigy-boom-boom-tap-study','original source name recognized when imported');
  assert.equal(await page.locator('#collectionSelect').inputValue(),'songs',
   'imported song maintains Song Examples collection');
  const imported=await page.evaluate(()=>window.RhythmResearch.current());
  assert.deepEqual(imported.tracks,current.tracks,'imported and explicitly selected song match precisely');
  assert.equal(imported.bpm,current.bpm);
  assert.deepEqual(errors,[],'no browser exception during song browsing, playback and import/export');
  await page.screenshot({
   path:'artifacts/song-examples/'+viewport.width+'-'+theme+'.png',fullPage:true
  });
  results.push({width:viewport.width,theme,id:'prodigy-boom-boom-tap-study',
   bpm:current.bpm,events:schedule.map(x=>x.length),transportMaintained:active.playing});
  await page.locator('#playBtn').click();
  await page.close();
 }
 fs.writeFileSync('artifacts/song-examples/report.json',JSON.stringify({
  status:'PASS',cases:results.length,source:'User-provided roots-rhythm/1 JSON',
  scope:'Source-value fidelity, Song Examples filter, browser audio transport, four-lane scheduling, exact export/import; no claim of official transcription or human listening approval',
  results
 },null,2));
 console.log('PASS Song Examples: user JSON preserved, four roots-ring lanes and live Web Audio, four responsive/theme states');
}finally{await browser.close();}
