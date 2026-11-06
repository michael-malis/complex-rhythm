import fs from 'node:fs';
import assert from 'node:assert/strict';

const matrix=fs.readFileSync('GENRE_IMPLEMENTATION_MATRIX.md','utf8');
const research=fs.readFileSync('RHYTHM_RESEARCH.md','utf8');
const inventory=JSON.parse(fs.readFileSync('PRESET_INVENTORY.json','utf8'));
assert.equal(inventory.total,50,'All 50 original/new presets must remain in inventory');
const catalog=new Map(inventory.presets.map(p=>[p.id,p]));
const expected=[
 'Hard techno','Industrial techno','Schranz','Hardcore techno','Gabber',
 'Hard acid techno','Acidcore','Frenchcore','Uptempo hardcore',
 'Terrorcore','Hardtek','Freetekno','Breakcore',
 'Polyrhythmic techno','IDM / algorithmic percussion'
];
const rows=matrix.split('\n').filter(s=>/^\| (?:Hard techno|Industrial techno|Schranz|Hardcore techno|Gabber|Hard acid techno|Acidcore|Frenchcore|Uptempo hardcore|Terrorcore|Hardtek|Freetekno|Breakcore|Polyrhythmic techno|IDM \/ algorithmic percussion) \|/.test(s));
assert.equal(rows.length,15,'Each of 15 mandated genre research lines must have a mapped implementation');
const found=new Set();
for(const line of rows){
 const fields=line.split('|').slice(1,-1).map(s=>s.trim());
 assert.equal(fields.length,7,'Malformed genre traceability row');
 const [genre,preset,bpm,degrees,voices,distinction,source]=fields;
 assert.ok(expected.includes(genre),'Unexpected genre '+genre);
 assert.ok(!found.has(genre),'Duplicate genre '+genre);
 found.add(genre);
 const id=preset.replaceAll('`','');
 const p=catalog.get(id);
 assert.ok(p,'Unknown preset ID '+id+' for '+genre);
 assert.equal(Number(bpm),p.bpm,'Incorrect actual BPM for '+id);
 assert.equal(degrees.replaceAll('`',''),p.lanes.map(t=>t.rootDegree).join(':'),
  'Wrong mathematical degree mapping for '+id);
 assert.equal(voices,p.lanes.map(t=>t.sound).join(', '),
  'Wrong actual instrument mapping for '+id);
 assert.ok(distinction.length>=30&&source.length>=7,'Missing genre/source-specific implementation explanation');
 assert.ok(research.includes('| '+genre+' |'),'Genre '+genre+' missing in original research table');
}
assert.deepEqual([...found].sort(),expected.sort(),'Missing researched genres');
assert.ok(research.includes('https://articles.roland.com/mastering-the-tb-303-sequencer-in-roland-cloud/'));
assert.ok(research.includes('https://www.attackmagazine.com/technique/beat-dissected/industrial-techno/'));
console.log(JSON.stringify({status:'PASS',genres:found.size,catalog:catalog.size,
 method:'15 mapped real IDs with exact BPM, lane root degrees and voice names',
 caveat:'Human listening and genre authenticity are not certified'},null,2));
