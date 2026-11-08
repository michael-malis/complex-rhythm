import {chromium} from 'playwright';
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
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
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
    heading:parseFloat(getComputedStyle(document.querySelector('.stage-heading h1')).fontSize),
    subheading:parseFloat(getComputedStyle(document.querySelector('.panel-heading h2')).fontSize),
    scaling:[...document.querySelectorAll('html,body,.app,.workspace,.visual-stage,.control-panel')]
     .some(el=>getComputedStyle(el).transform!=='none'||(getComputedStyle(el).zoom||'1')!=='1')};
  });
  assert.equal(result.cards.length,4,'retain four independently editable lanes');
  assert.ok(result.fullWidth<=width+1,'no horizontal overflow '+width);
  assert.ok(result.controls.every(x=>x.height>=44&&x.font>=16),
   'readable controls keep >=44px targets at '+width);
  assert.ok(result.plot.width>=320&&result.plot.width<=600,
   'plot is compact but remains independently navigable at '+width);
  assert.ok(!result.scaling,'no visual zoom or transform scaling');
  assert.equal(result.heading,28);
  assert.equal(result.subheading,24);
  if(width>=1080){
   assert.ok(result.stage.right<result.control.x&&
    Math.abs(result.stage.y-result.control.y)<3,'both workbench panels visible side by side '+width);
   assert.ok(Math.abs(result.cards[0].y-result.cards[1].y)<2&&
    result.cards[1].x>result.cards[0].x&&
    Math.abs(result.cards[2].y-result.cards[3].y)<2,
    'four cards retain a two-by-two grid '+width);
   assert.ok(result.cards[2].y<height,'second row appears in the opening laptop viewport '+width);
   assert.ok(result.plot.width<=Math.min(600,Math.max(390,height-375))+2,
    'real Canvas box adapts to available screen height '+width);
  }else{
   assert.ok(result.stage.y<result.control.y,'narrow tablets retain graph-first reflow');
   assert.ok(result.plot.width<=530,'tablet graph is height-aware');
  }
  assert.deepEqual(errors,[],'no JS errors');
  await page.screenshot({path:`artifacts/compact-desktop/${width}x${height}-${theme}.png`,fullPage:false});
  reports.push({width,height,theme,...result});
  await page.close();
 }
 fs.writeFileSync('artifacts/compact-desktop/report.json',JSON.stringify({status:'PASS',cases:reports},null,2));
 console.log('PASS compact responsive desk workbench in 12 viewport/theme cases without scaling or tiny targets');
}finally{await browser.close()}
