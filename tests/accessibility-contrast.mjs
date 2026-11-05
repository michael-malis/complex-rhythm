import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const configs=[[360,640],[390,844],[768,1024],[1024,768],[1280,800],[1440,900],[1600,1000]];
const results=[];
const authoredCSS=fs.readFileSync('styles.css','utf8');
const explicitFontSizes=[...authoredCSS.matchAll(/font-size\\s*:\\s*([\\d.]+)px/g)].map(x=>Number(x[1]));
assert.ok(explicitFontSizes.length>=70,'Audit should cover the full CSS font-size scale');
assert.ok(explicitFontSizes.every(x=>Number.isFinite(x)&&x>=16),
 'No application-authored CSS font-size declaration may fall below 16px');

fs.mkdirSync('artifacts',{recursive:true});
try{
 for(const [width,height] of configs)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  for(const selector of ['#presetDetails','#compositionPanel','.math-details','#windowPanel'])
    await page.locator(selector).evaluate(el=>{el.open=true});
  const measured=await page.evaluate(()=>{
   const toRgb=value=>{
    const hex=value.trim().match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
    if(hex){
      const h=hex[1].length===3?[...hex[1]].map(x=>x+x).join(''):hex[1];
      return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16));
    }
    const n=(value.match(/[\d.]+/g)||[]).map(Number);
    return n.length>=3?[n[0],n[1],n[2]]:null;
   };
   const L=rgb=>{
    const p=rgb.map(v=>{const x=v/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});
    return .2126*p[0]+.7152*p[1]+.0722*p[2];
   };
   const contrast=(fg,bg)=>{
    const a=L(fg),b=L(bg);
    return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
   };
   const root=getComputedStyle(document.documentElement);
   const background=el=>{
    for(let e=el;e;e=e.parentElement){
      const color=getComputedStyle(e).backgroundColor;
      if(color&&!/rgba?\(0,\s*0,\s*0,\s*0(?:\.0+)?\)/.test(color)&&color!=='transparent')return toRgb(color);
    }
    return toRgb(getComputedStyle(document.body).backgroundColor);
   };
   const rows=[];
   for(const el of document.body.querySelectorAll('*')){
    const css=getComputedStyle(el),rect=el.getBoundingClientRect();
    if(css.display==='none'||css.visibility==='hidden'||rect.width<1||rect.height<1)continue;
    if(el.closest('.katex') && !el.classList.contains('katex'))continue;
    if(el.matches('canvas,script,style,svg,option,input[type=range],input[type=checkbox],.phase-strip,.phase-mark,.window-lane-events,.window-mark'))continue;
    const direct=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ');
    const fieldValue=el.matches('input[type=number],input[type=text],select,textarea')?el.value||el.placeholder:'';
    if(!direct.trim()&&!fieldValue.trim())continue;
    if(el.closest('[aria-hidden=true]'))continue;
    const font=parseFloat(css.fontSize),fg=toRgb(css.color),bg=background(el);
    if(!fg||!bg)continue;
    const ratio=contrast(fg,bg);
    const key=el.matches('.lane-count,.range-field output,.phase-label output,.math-notation,.lane-alternate-math,.math-topline strong') ||
      el.closest('.formula-reference')!==null;
    const threshold=key?7:4.5;
    rows.push({tag:el.tagName.toLowerCase(),id:el.id,className:String(el.className).slice(0,90),
      text:(direct||fieldValue).slice(0,85),font,ratio:Number(ratio.toFixed(2)),threshold,
      failure:font<16-1e-8||ratio<threshold-1e-4});
   }
   const plot=toRgb(getComputedStyle(document.querySelector('#plotArea')).backgroundColor);
   const panel=background(document.querySelector('#plotArea'));
   const palette=[1,2,3,4].map(i=>{
    const varname='--track-'+i,rgb=toRgb(root.getPropertyValue(varname).trim());
    return {name:varname,contrast:Number(contrast(rgb,plot||panel).toFixed(2))};
   });
   return {text:rows,plotPalette:palette};
  });
  const failed=measured.text.filter(x=>x.failure);
  const failsGraphics=measured.plotPalette.filter(x=>x.contrast<3);
  results.push({width,height,theme,count:measured.text.length,failed,graphics:failsGraphics,
    minFont:Math.min(...measured.text.map(x=>x.font)),
    minTextContrast:Math.min(...measured.text.map(x=>x.ratio))});
  console.log('CONTRAST',width+'x'+height,theme,'text',measured.text.length,
    'failures',failed.length,'graphicFailures',failsGraphics.length,
    'sampleFailures',JSON.stringify(failed.slice(0,6)));
  await page.close();
 }
 fs.writeFileSync('artifacts/contrast-audit.json',JSON.stringify({
   note:'Actual Chromium computed colors and sizes, WCAG 4.5 body / 7 selected numeric, 3 track palette.',
   measured:results
 },null,2));
 const failures=results.flatMap(x=>x.failed.map(f=>({...f,viewport:[x.width,x.height],theme:x.theme})));
 const graphicFailures=results.flatMap(x=>x.graphics.map(f=>({...f,viewport:[x.width,x.height],theme:x.theme})));
 assert.equal(failures.length,0,'readable text; first failure '+JSON.stringify(failures.slice(0,10)));
 assert.equal(graphicFailures.length,0,'3:1 track palette; '+JSON.stringify(graphicFailures.slice(0,10)));
 console.log('ALL PASS: ',results.length,'light/dark configurations; '+explicitFontSizes.length+' CSS font-size rules (all >=16px); readable text and root-color palette');
}finally{await browser.close()}
