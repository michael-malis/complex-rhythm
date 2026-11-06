import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
fs.mkdirSync('artifacts',{recursive:true});
const screens=[[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[390,844]];
const report=[];
try{
 for(const [width,height] of screens)for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8767/',{waitUntil:'domcontentloaded'});
  if(theme==='dark')await page.locator('#themeBtn').click();
  await page.evaluate(()=>{
   for(const section of document.querySelectorAll('#presetDetails,#compositionPanel,.math-details,#windowPanel,#fileMenu')){
    section.open=true;
   }
  });
  const audit=await page.evaluate(()=>{
   const sections=['#presetDetails','#compositionPanel','.math-details','#windowPanel','#fileMenu'];
   const sectionAudit=sections.map(s=>{
    const el=document.querySelector(s),r=el?.getBoundingClientRect();
    return {name:s,open:!!el?.open,visible:!!r&&r.width>0&&r.height>0,
     title:el?.querySelector('summary')?.textContent.trim()||''};
   });
   const visible=el=>{
    const style=getComputedStyle(el),r=el.getBoundingClientRect();
    return style.display!=='none'&&style.visibility!=='hidden'&&r.width>0&&r.height>0;
   };
   const controls=[...document.querySelectorAll('button,input,select,textarea,details summary')]
    .filter(el=>visible(el)&&el.type!=='hidden'&&el.type!=='file');
   const labelFor=el=>{
    const direct=(el.getAttribute('aria-label')||el.getAttribute('title')||'').trim();
    if(direct)return direct;
    const label=el.closest('label')||[...document.querySelectorAll('label')].find(l=>l.htmlFor&&l.htmlFor===el.id);
    if(label)return label.textContent.trim().slice(0,100);
    if(el.matches('input,textarea'))return (el.getAttribute('placeholder')||'').trim();
    return el.textContent.trim();
   };
   const unnamed=controls.filter(el=>!labelFor(el)).map(el=>({
    tag:el.tagName,id:el.id,className:String(el.className)
   }));
   const tiny=controls.filter(el=>parseFloat(getComputedStyle(el).fontSize)<16-1e-8).map(el=>({
    id:el.id,text:labelFor(el),font:getComputedStyle(el).fontSize
   }));
   const sound=[...document.querySelectorAll('select.lane-sound')].map(el=>{
    const choices=[...el.options].map(x=>x.textContent.trim());
    return {lane:el.closest('.lane')?.dataset.lane||'',count:choices.length,
     hasBlank:choices.some(x=>!x),unique:new Set(choices).size===choices.length}
   });
   const phaseNotes=document.querySelectorAll('.math-details .katex').length;
   const composedFormula=!!document.querySelector('#compositionEquation .katex');
   const info=[
    'Rhythm examples','Additional angles','Mathematical notes',
    'Polymetric time window','Project files'
   ].every(key=>sectionAudit.some(x=>x.title.includes(key)));
   const hints=[...document.querySelectorAll('[title]')].filter(visible).map(el=>({
    tag:el.tagName,text:el.getAttribute('title')?.trim()||''
   }));
   return {sectionAudit,unnamed,tiny,controls:controls.length,sound,phaseNotes,
    composedFormula,allSectionsNamed:info,hints:hints.length,emptyHints:hints.filter(x=>!x.text)};
  });
  report.push({viewport:[width,height],theme,...audit,runtimeErrors:errors});
  assert.ok(audit.sectionAudit.every(x=>x.open&&x.visible&&x.title.length>=3),
   'all default-hidden documented panels must be visible and named: '+JSON.stringify(audit.sectionAudit));
  assert.ok(audit.allSectionsNamed,'all five mandatory documentation areas must be identified');
  assert.ok(audit.controls>=30,'all expanded controls participate in full UI audit');
  assert.equal(audit.unnamed.length,0,'unlabeled UI controls: '+JSON.stringify(audit.unnamed.slice(0,8)));
  assert.equal(audit.tiny.length,0,'small controls in expanded panels: '+JSON.stringify(audit.tiny.slice(0,8)));
  assert.equal(audit.sound.length,4,'all four instrument dropdowns exposed');
  assert.ok(audit.sound.every(s=>s.count>=15&&!s.hasBlank&&s.unique),'all instrument options are named and unique');
  assert.ok(audit.phaseNotes>=5&&audit.composedFormula,'rendered math notes and root composition available');
  assert.deepEqual(audit.emptyHints,[],'empty visible tooltip entries');
  // Instrument-specific synthesis settings are dynamic, so a static page
  // snapshot cannot establish that all fifteen instrument menus are legible.
  if(width===390&&theme==='light'){
   let checkedVoices=0,checkedSynths=0;
   const voices=await page.locator('#laneSound0 option').evaluateAll(items=>items.map(o=>o.value));
   for(const voice of voices){
    await page.locator('#laneSound0').selectOption(voice);
    const dynamic=await page.evaluate(()=>{
     const wrap=document.querySelector('#patchControls');
     const sliders=[...wrap.querySelectorAll('input')];
     const named=sliders.every(el=>!!el.getAttribute('aria-label')&&
      parseFloat(getComputedStyle(el).fontSize)>=16);
     const oscillator=wrap.querySelector('#patchOsc');
     const selected=document.querySelector('#laneSound0').value;
     const synthesized=Boolean(window.RhythmVoices?.definitions?.[selected]);
     const heading=wrap.querySelector('h4')?.textContent||'';
     const tooltips=[...document.querySelectorAll('[title]')].filter(el=>
      getComputedStyle(el).display!=='none'&&!el.getAttribute('title')?.trim()
     );
     return {heading,sliders:sliders.length,named,synthesized,oscillator:!!oscillator,emptyTooltips:tooltips.length};
    });
    assert.ok(dynamic.heading.includes('Instrument dynamics'),'sound-specific editor heading present');
    assert.ok(dynamic.sliders>=1&&dynamic.named,'all visible sound dynamics controls are named at usable font sizes for '+voice);
    if(dynamic.synthesized){
     assert.ok(dynamic.sliders>=9,'all eight synthesis parameter sliders present for '+voice);
     assert.ok(dynamic.oscillator,'synthesis oscillator dropdown exists for '+voice);
     checkedSynths++;
    }else{
     assert.equal(dynamic.sliders,1,'sampled voice exposes lane gain but must not pretend to have synth settings for '+voice);
    }
    assert.equal(dynamic.emptyTooltips,0,'no anonymous sound tooltips for '+voice);
    checkedVoices++;
   }
   assert.ok(checkedVoices>=35,'inspect the entire instrument menu');
   assert.equal(checkedSynths,15,'all 15 actual synthesized voices get full dynamics; sample voices do not');
   // Additional-angle and generated-root controls are initially hidden,
   // but they are part of the mandatory complete-settings audit.
   await page.locator('#addRootFamily').click();
   await page.locator('#addLayer').click();
   const addition=await page.evaluate(()=>{
    const inputs=[...document.querySelectorAll('#extraLayers input')];
    const btns=[...document.querySelectorAll('#extraLayers button')];
    return {inputs:inputs.length,buttons:btns.length,allNamed:[...inputs,...btns].every(el=>
     !!el.getAttribute('aria-label')||
     (!!el.closest('label')&&el.closest('label').textContent.trim().length>0)
    )};
   });
   assert.ok(addition.inputs>=5&&addition.buttons>=2&&addition.allNamed,
    'generated root families and additional-angle settings must be labeled');
   report.at(-1).dynamicVoices=checkedVoices;
   report.at(-1).synthesizedVoices=checkedSynths;
   report.at(-1).additionalRootControls=addition;
  }
  assert.deepEqual(errors,[],'browser JS errors');
  await page.close();
 }
 fs.writeFileSync('artifacts/expanded-ui-typography.json',JSON.stringify({
  status:'PASS',scope:'Full mandatory expanded UI, all four sound dropdowns and tooltips across both themes and six viewport sizes',
  report
 },null,2));
 console.log('PASS: all expanded UI sections across '+report.length+' responsive/theme cases, with all dynamic voice and root-family settings inspected');
}finally{await browser.close()}
