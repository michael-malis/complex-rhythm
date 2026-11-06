import { chromium } from 'playwright';
import fs from 'node:fs';
const cases=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const base='http://127.0.0.1:8767/';
fs.mkdirSync('qa/baseline/evidence',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const reports=[];
try{
 for(const [width,height] of cases)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.locator('#presetDetails').evaluate(el=>el.open=true);
  await page.locator('#compositionPanel').evaluate(el=>el.open=true);
  await page.locator('.math-details').evaluate(el=>el.open=true);
  const metrics=await page.evaluate(()=>{
   const selectors=['.wordmark','.strapline','.eyebrow','.stage-heading h1','.panel-heading h2','.stage-meta','.quiet','.lane-select','.lane-fields label','.lane-fields input','.lane-sound','.lane-count','.lane-equation','.figure-legend','.stage-hint','.range-field label','.composition-info p','.small-explain','.phase-label','.math-details p','button'];
   const parseRgb=v=>(v.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
   const lumi=v=>{const x=v/255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)};
   const luminance=rgb=>.2126*lumi(rgb[0])+.7152*lumi(rgb[1])+.0722*lumi(rgb[2]);
   const bg=(el)=>{let current=el;while(current){const c=getComputedStyle(current).backgroundColor;if(c && !['rgba(0, 0, 0, 0)','transparent'].includes(c))return c;current=current.parentElement}return getComputedStyle(document.body).backgroundColor};
   const rows=selectors.map(selector=>{
    const el=document.querySelector(selector);if(!el)return null;
    const s=getComputedStyle(el),f=parseRgb(s.color),b=parseRgb(bg(el));
    const l1=luminance(f),l2=luminance(b);
    return {selector,fontPx:parseFloat(s.fontSize),color:s.color,background:bg(el),contrast:Math.round(((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05))*100)/100,box:[el.getBoundingClientRect().width,el.getBoundingClientRect().height]}
   }).filter(Boolean);
   return {rows,viewport:[document.documentElement.clientWidth,document.documentElement.clientHeight],scrollWidth:document.documentElement.scrollWidth,plotRect:[document.querySelector('#orbitCanvas').getBoundingClientRect().width,document.querySelector('#orbitCanvas').getBoundingClientRect().height],laneCount:document.querySelectorAll('.lane').length,presets:document.querySelector('#presetCount').textContent,bodyFont:getComputedStyle(document.body).fontSize,theme:document.documentElement.dataset.theme};
  });
  reports.push({width,height,theme,...metrics});
  await page.screenshot({path:'qa/baseline/evidence/baseline-'+width+'x'+height+'-'+theme+'.png',fullPage:true});
  console.log('BASELINE',width,height,theme,'smallestFont',Math.min(...metrics.rows.map(x=>x.fontPx)),'canvas',metrics.plotRect,'overflow',metrics.scrollWidth>metrics.viewport[0]);
  await page.close();
 }
 fs.writeFileSync('qa/baseline/evidence/metrics.json',JSON.stringify({capturedAt:new Date().toISOString(),cases:reports},null,2));
 console.log('BASELINE CAPTURED:',reports.length,'viewports/themes. NO acceptance claims.');
}finally{await browser.close()}
