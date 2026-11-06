import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
 await page.locator('#presetDetails').evaluate(el=>{el.open=true});
 await page.locator('#categorySelect').selectOption('poly');
 await page.locator('#presetSelect').selectOption('afro');
 const source=await page.locator('#presetSelect option:checked').textContent();
 assert.ok(source&&!source.includes('Modified')&&!source.includes('Custom'),'clean source title');
 await page.locator('#bpm').evaluate(el=>{
  el.value=String(Math.min(Number(el.max),Number(el.value)+8));
  el.dispatchEvent(new Event('input',{bubbles:true}));
 });
 assert.equal(await page.locator('#presetSelect').inputValue(),'afro','editing BPM retains preset ID');
 assert.equal(await page.locator('#presetSelect option:checked').textContent(),
  source+' · Modified','name displays Modified, not Custom');
 await page.locator('#trackN0').fill('5');
 assert.equal(await page.locator('#presetSelect').inputValue(),'afro','editing mathematical degree retains preset ID');
 assert.equal(await page.locator('#presetSelect option:checked').textContent(),
  source+' · Modified','repeated changes do not duplicate Modified marker');
 const edited=await page.evaluate(()=>window.RhythmResearch.current());
 await page.locator('#fileMenu summary').click();
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#saveBtn').click();
 const saved=JSON.parse(fs.readFileSync(await(await downloadPromise).path(),'utf8'));
 assert.equal(saved.name,source,'JSON export retains original preset name, without decoration');
 assert.equal(saved.bpm,edited.bpm,'JSON export retains edited tempo');
 assert.equal(saved.tracks[0].n,5,'JSON export retains edited roots');
 await page.locator('#categorySelect').selectOption('brazil');
 assert.equal(await page.locator('#presetSelect').inputValue(),'__browse__',
  'browsing another category shows an explicit choose-example placeholder');
 assert.ok((await page.locator('#presetInfo').textContent()).includes('Currently loaded: '+source),
  'currently loaded example remains visible');
 assert.equal(await page.evaluate(()=>window.RhythmResearch.transport().activePresetId),'afro',
  'category browsing does not silently replace or reset the current preset');
 assert.deepEqual(await page.evaluate(()=>window.RhythmResearch.current()),edited,
  'category browsing never changes BPM or mathematical root sets');
 await page.locator('#categorySelect').selectOption('poly');
 assert.equal(await page.locator('#presetSelect option:checked').textContent(),source+' · Modified',
  'returning to the original category preserves modified preset status');
 await page.locator('#presetSelect').selectOption('afro');
 assert.equal(await page.locator('#presetSelect option:checked').textContent(),source,
  'explicit preset selection clears Modified');
 await page.locator('#jsonFile').setInputFiles({
  name:'modified.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))
 });
 await page.waitForFunction(()=>document.querySelector('#toast').textContent.startsWith('Imported rhythm:'));
 assert.equal(await page.locator('#presetSelect').inputValue(),'afro','import recognizes original preset name');
 assert.equal(await page.locator('#presetSelect option:checked').textContent(),
  source+' · Modified','imported edited copy retains preset name and Modified');
 assert.equal((await page.evaluate(()=>window.RhythmResearch.current())).tracks[0].n,5,
  'import preserves changes rather than loading original');
 const custom={...saved,name:'My Personal Mathematical Rhythm'};
 await page.locator('#jsonFile').setInputFiles({
  name:'personal.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(custom))
 });
 await page.waitForFunction(()=>document.querySelector('#presetSelect').value==='__custom__');
 assert.equal(await page.locator('#presetSelect option:checked').textContent(),custom.name,
  'user-created imported project retains its own name');
 assert.deepEqual(errors,[],'no runtime exceptions');
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/preset-modified.json',JSON.stringify({
  original:source,modifiedLabel:source+' · Modified',exportName:saved.name,pass:true
 },null,2));
 console.log('PASS preset identity: BPM, root, reset, export/import, named custom project');
 await page.close();
}finally{await browser.close()}
