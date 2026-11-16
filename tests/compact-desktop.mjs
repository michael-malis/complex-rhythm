import {chromium} from './helpers/lab-tabs.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sizes=[[1080,720],[1200,800],[1366,768],[1440,900],[1600,1000],[1024,768]];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts/compact-desktop',{recursive:true});
const reports=[];
try{
 for(const [width,height] of sizes)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/#lab',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  const result=await page.evaluate(()=>{
   const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();
    return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
   const cards=[...document.querySelectorAll('.track-list .lane')].map(e=>{
    const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,bottom:r.bottom};
   });
   const controls=['#trackN0','#laneSound0','#laneMute0','#playBtn','#categorySelect']
    .map(s=>({id:s,height:rect(s).height,font:parseFloat(getComputedStyle(document.querySelector(s)).fontSize)}));
   return {vw:innerWidth,fullWidth:document.documentElement.scrollWidth,stage:rect('.visual-stage'),
    control:rect('.control-panel'),plot:rect('.canvas-shell'),cards,controls,
    tabs:[...document.querySelectorAll('.lab-tab')].map(e=>{const r=e.getBoundingClientRect();return {y:r.y,bottom:r.bottom,height:r.height,width:r.width}}),
    dock:rect('.transport-dock'),pageHeight:document.documentElement.scrollHeight,
    disclosures:document.querySelectorAll('details,summary').length,
    heading:parseFloat(getComputedStyle(document.querySelector('.stage-heading h1')).fontSize),
    subheading:parseFloat(getComputedStyle(document.querySelector('.panel-heading h2')).fontSize),
    scaling:[...document.querySelectorAll('html,body,.app,.workspace,.visual-stage,.control-panel')]
     .some(el=>getComputedStyle(el).transform!=='none'||(getComputedStyle(el).zoom||'1')!=='1')};
  });
  assert.equal(result.cards.length,4,'retain four independently editable lanes');
  assert.ok(result.fullWidth<=width+1,'no horizontal overflow '+width);
  assert.ok(result.controls.every(x=>x.height>=44&&x.font>=16),
   'readable controls keep >=44px targets at '+width);
  assert.ok(result.plot.width>=320&&result.plot.width<=820,
   'plot keeps a usable size next to the inspector at '+width+': '+result.plot.width);
  assert.equal(result.disclosures,0,'the workbench has no collapsible disclosures');
  assert.equal(result.tabs.length,5,'five inspector tabs');
  assert.ok(result.tabs.every(t=>t.height>=44&&t.width>=44),'tabs are full-size targets');
  assert.ok(!result.scaling,'no visual zoom or transform scaling');
  assert.equal(result.heading,22);
  assert.equal(result.subheading,22);
  if(width>=1080){
   // One fixed frame: the figure and its transport on the left, the
   // inspector on the right, nothing below the fold of the page itself.
   assert.ok(result.stage.right<result.control.x,'figure and inspector side by side '+width);
   assert.ok(result.pageHeight<=height+1,'the Lab is a single screen at '+width+'x'+height+', page height '+result.pageHeight);
   assert.ok(result.plot.bottom<result.dock.y&&result.dock.bottom<=height,
    'plot and transport both fit the screen at '+width+'x'+height);
   assert.ok(result.tabs.every(t=>t.bottom<=height&&Math.abs(t.y-result.tabs[0].y)<1),'all five tabs sit in one visible row '+width);
   assert.ok(result.cards.every((card,i)=>Math.abs(card.x-result.cards[0].x)<2&&(i===0||card.y>=result.cards[i-1].bottom)),
    'four lanes form one aligned table '+width);
   const firstScreenEditors=result.cards.filter(card=>card.bottom<=height).length;
   assert.ok(firstScreenEditors>=(height>=900?4:height>=760?3:2),
    'lane rows visible without scrolling at '+width+'x'+height+': '+firstScreenEditors);
   assert.ok(result.plot.width<=height-212+2,'real Canvas box adapts to available screen height '+width);
  }else{
   assert.ok(result.stage.y<result.control.y,'narrow tablets retain graph-first reflow');
   assert.ok(result.plot.width<=540&&result.plot.width<=height-320+2,'tablet graph is height-aware');
  }
  assert.deepEqual(errors,[],'no JS errors');
  await page.screenshot({path:`artifacts/compact-desktop/${width}x${height}-${theme}.png`,fullPage:false});
  reports.push({width,height,theme,...result});
  await page.close();
 }
 fs.writeFileSync('artifacts/compact-desktop/report.json',JSON.stringify({status:'PASS',cases:reports},null,2));
 console.log('PASS compact responsive desk workbench in 12 viewport/theme cases without scaling or tiny targets');
}finally{await browser.close()}
