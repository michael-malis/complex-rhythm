import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const views=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const report=[];
fs.mkdirSync('artifacts/responsive',{recursive:true});
try{
 for(const [width,height] of views)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.evaluate(()=>{
   for(const sel of ['#presetDetails','#compositionPanel','.math-details','#windowPanel']){
    document.querySelector(sel).open=true;
   }
  });
  const layout=await page.evaluate(()=>{
   const rect=el=>{const r=el.getBoundingClientRect();return {
    left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height
   }};
   const visible=el=>{const css=getComputedStyle(el),r=rect(el);
    return css.display!=='none'&&css.visibility!=='hidden'&&r.width>0&&r.height>0
   };
   const intersect=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*
    Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
   const stage=rect(document.querySelector('.visual-stage'));
   const control=rect(document.querySelector('.control-panel'));
   const lanes=[...document.querySelectorAll('.track-list .lane')].map(rect);
   const panels=['.topbar','#presetDetails','.visual-stage','.control-panel','.composition-panel','.math-details','.window-panel']
    .map(s=>document.querySelector(s)).filter(Boolean);
   const clipped=panels.filter(visible).filter(el=>{
    const css=getComputedStyle(el);
    const x=/hidden|clip/.test(css.overflowX),y=/hidden|clip/.test(css.overflowY);
    return (x&&el.scrollWidth>el.clientWidth+3)||(y&&el.scrollHeight>el.clientHeight+3);
   }).map(el=>({id:el.id,className:el.className,
    deltaX:el.scrollWidth-el.clientWidth,deltaY:el.scrollHeight-el.clientHeight}));
   const controls=['#themeBtn','#categorySelect','#presetSelect','#playBtn','#bpm','#trackN0','#trackN1','#trackN2','#trackN3','#laneSound0','#laneSound1','#laneSound2','#laneSound3','#windowStart','#addLayer','#addRootFamily'];
   const missing=controls.filter(s=>!document.querySelector(s)||!visible(document.querySelector(s)));
   const tooSmall=controls.filter(s=>document.querySelector(s)&&visible(document.querySelector(s))&&
    parseFloat(getComputedStyle(document.querySelector(s)).fontSize)<16-1e-8);
   const laneOverlap=[];
   for(let i=0;i<lanes.length;i++)for(let j=i+1;j<lanes.length;j++){
    if(intersect(lanes[i],lanes[j])>1)laneOverlap.push([i,j]);
   }
   return {
    innerWidth:innerWidth,documentWidth:document.documentElement.scrollWidth,
    bodyWidth:document.body.scrollWidth,documentHeight:document.documentElement.scrollHeight,
    stage,control,stageControlIntersection:intersect(stage,control),
    columns:getComputedStyle(document.querySelector('.track-list')).gridTemplateColumns.trim().split(/\s+/).length,
    lanes:lanes.length,laneOverlap,clipped,missing,tooSmall,
    plot:rect(document.querySelector('#orbitCanvas')),
    globallyScaled:[...document.querySelectorAll('html,body,.app,.workspace,.visual-stage,.control-panel')]
     .some(el=>getComputedStyle(el).transform!=='none')
   };
  });
  assert.ok(layout.documentWidth<=width+1&&layout.bodyWidth<=width+1,
   'global horizontal overflow at '+width+': '+JSON.stringify(layout));
  assert.equal(layout.stageControlIntersection,0,'control panel overlaps mathematical stage at '+width);
  assert.equal(layout.lanes,4,'four independently editable lanes at '+width);
  assert.deepEqual(layout.laneOverlap,[],'track cards overlap at '+width);
  assert.deepEqual(layout.clipped,[],'main content clipped at '+width+': '+JSON.stringify(layout.clipped));
  assert.deepEqual(layout.missing,[],'inaccessible controls at '+width+': '+JSON.stringify(layout.missing));
  assert.deepEqual(layout.tooSmall,[],'text shrunk below 16px at '+width);
  assert.equal(layout.columns,width<760?1:2,'responsive grid must reflow rather than shrink controls at '+width);
  assert.ok(layout.plot.width>=190,'mathematical graph remains usable at '+width);
  assert.ok(!layout.globallyScaled,'no global transform scaling');
  if(width===390)assert.ok(layout.documentHeight>height,'compact UI scrolls vertically instead of compressing sections');
  assert.deepEqual(errors,[],'page errors');
  report.push({viewport:[width,height],theme,...layout});
  await page.screenshot({path:'artifacts/responsive/'+width+'-'+theme+'.png',fullPage:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/responsive/content-access.json',JSON.stringify({
  status:'PASS',cases:report.length,condition:'No global scaling, clipping or horizontal overflow; all critical controls and four lanes reachable',report
 },null,2));
 console.log('PASS responsive content & control access across '+report.length+' mandatory viewport/theme states');
}finally{await browser.close()}
