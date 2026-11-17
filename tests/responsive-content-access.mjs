import {chromium,eachLabTab} from './helpers/lab-tabs.mjs';
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
  await page.goto('http://127.0.0.1:8767/#lab',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  // Each inspector tab is checked while it is the one on screen.
  const perTab=await eachLabTab(page,tab=>page.evaluate(tab=>{
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
   const panels=['.topbar','#presetDetails','.visual-stage','.control-panel','.lab-tabs','.lab-panel:not([hidden])']
    .map(s=>document.querySelector(s)).filter(Boolean);
   const clipped=panels.filter(visible).filter(el=>{
    const css=getComputedStyle(el);
    const x=/hidden|clip/.test(css.overflowX),y=/hidden|clip/.test(css.overflowY);
    return (x&&el.scrollWidth>el.clientWidth+3)||(y&&el.scrollHeight>el.clientHeight+3);
   }).map(el=>({id:el.id,className:el.className,
    deltaX:el.scrollWidth-el.clientWidth,deltaY:el.scrollHeight-el.clientHeight}));
   const everywhere=['#themeBtn','#loadBtn','#saveBtn','#categorySelect','#presetSelect','#playBtn','#bpm','#volume',
    '#tabLanes','#tabUnion','#tabTime','#tabSound','#tabNotes'];
   const controls=[...everywhere,...({
    lanes:['#trackN0','#trackN1','#trackN2','#trackN3','#laneSound0','#laneSound1','#laneSound2','#laneSound3',
     '#trackAngleRad0','#trackAngleDeg3','#laneBars0','#laneGain0','#rootRuleAngleList'],
    union:['#addLayer','#addRootFamily','#loadRootExample','#argumentAngle','#setOperation','#laneChip0','#laneChip3','#previewBtn'],
    time:['#windowStart'],sound:['#soundLabLane','#soundLabPreview'],notes:[]})[tab]];
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
    columns:tab==='lanes'?getComputedStyle(document.querySelector('.track-list')).gridTemplateColumns.trim().split(/\s+/).length:1,
    disclosures:document.querySelectorAll('details,summary').length,
    lanes:lanes.length,laneOverlap,clipped,missing,tooSmall,
    plot:rect(document.querySelector('#orbitCanvas')),
    globallyScaled:[...document.querySelectorAll('html,body,.app,.workspace,.visual-stage,.control-panel')]
     .some(el=>getComputedStyle(el).transform!=='none')
   };
  },tab));
  assert.equal(perTab.length,5,'all five inspector tabs checked');
  for(const {tab,result:layout} of perTab){
  const at=width+' on the '+tab+' tab';
  assert.ok(layout.documentWidth<=width+1&&layout.bodyWidth<=width+1,
   'global horizontal overflow at '+width+': '+JSON.stringify(layout));
  assert.equal(layout.stageControlIntersection,0,'control panel overlaps mathematical stage at '+at);
  assert.equal(layout.lanes,4,'four independently editable lanes at '+at);
  assert.deepEqual(layout.laneOverlap,[],'track cards overlap at '+at);
  assert.deepEqual(layout.clipped,[],'main content clipped at '+at+': '+JSON.stringify(layout.clipped));
  assert.deepEqual(layout.missing,[],'inaccessible controls at '+at+': '+JSON.stringify(layout.missing));
  assert.deepEqual(layout.tooSmall,[],'text shrunk below 16px at '+at);
  assert.equal(layout.columns,1,'the four lanes are one table column at '+at);
  assert.equal(layout.disclosures,0,'no collapsible disclosure at '+at);
  assert.ok(layout.plot.width>=190,'mathematical graph remains usable at '+width);
  assert.ok(!layout.globallyScaled,'no global transform scaling');
  if(width===390)assert.ok(layout.documentHeight>height,'compact UI scrolls vertically instead of compressing sections');
  report.push({viewport:[width,height],theme,tab,...layout});
  }
  assert.deepEqual(errors,[],'page errors');
  await page.screenshot({path:'artifacts/responsive/'+width+'-'+theme+'.png',fullPage:true});
  await page.close();
 }
 fs.writeFileSync('artifacts/responsive/content-access.json',JSON.stringify({
  status:'PASS',cases:report.length,condition:'No global scaling, clipping or horizontal overflow; all critical controls and four lanes reachable',report
 },null,2));
 console.log('PASS responsive content & control access across '+report.length+' mandatory viewport/theme states');
}finally{await browser.close()}
