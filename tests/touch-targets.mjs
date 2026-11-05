import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const cases=[[360,640],[390,844],[768,1024]];
const report=[];
try{
 for(const [width,height] of cases){
  const page=await browser.newPage({viewport:{width,height},hasTouch:true,isMobile:width<700});
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  for(const selector of ['#presetDetails','#compositionPanel','.math-details','#windowPanel'])
   await page.locator(selector).evaluate(el=>{el.open=true});
  await page.locator('#loadRootExample').click();
  const audited=await page.evaluate(()=>{
   const failures=[],seen=[];
   const all=document.querySelectorAll('button,summary,select,input:not([type=hidden]),canvas[tabindex]');
   for(const el of all){
    if(el.disabled)continue;
    const css=getComputedStyle(el),rect=el.getBoundingClientRect();
    if(css.visibility==='hidden'||css.display==='none'||rect.width<1||rect.height<1)continue;
    if(el.closest('[hidden],[inert]'))continue;
    // File upload is invoked by the explicit 'Import JSON' menu button.
    if(el.matches('input[type=file]'))continue;
    let target=el;
    if(el.matches('input[type=checkbox],input[type=radio]')){
      target=el.closest('label')||document.querySelector('label[for="'+el.id+'"]')||el;
    }
    const touch=target.getBoundingClientRect();
    const name=el.getAttribute('aria-label')||el.labels?.[0]?.textContent?.trim()||el.innerText?.trim()||el.id||el.getAttribute('title')||el.outerHTML.slice(0,70);
    const entry={node:el.tagName.toLowerCase(),name:name.slice(0,75),id:el.id,
      width:Math.round(touch.width*10)/10,height:Math.round(touch.height*10)/10};
    seen.push(entry);
    if(touch.width<43.95||touch.height<43.95)failures.push(entry);
   }
   return {total:seen.length,failures,inspected:seen};
  });
  report.push({width,height,...audited});
  console.log('TOUCH TARGETS '+width+'x'+height, 'checked',audited.total,
    'failures',audited.failures.length,'examples',JSON.stringify(audited.failures.slice(0,12)));
  await page.close();
 }
 fs.mkdirSync('artifacts',{recursive:true});
 fs.writeFileSync('artifacts/touch-target-audit.json',JSON.stringify({minimumCssPx:44,results:report},null,2));
 assert.equal(report.reduce((n,row)=>n+row.failures.length,0),
   'undersized mobile controls: '+JSON.stringify(report.flatMap(r=>r.failures.map(f=>({...f,viewport:r.width}))).slice(0,20)));
 console.log('PASS touch target audit:',report.length,'mobile/tablet screens');
}finally{await browser.close()}
