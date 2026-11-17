// The Lab inspector shows one tab at a time. A visitor who wants a control
// first opens the tab it lives on; these tests do the same. Every pointer or
// keyboard action on a locator first shows the inspector tab that contains
// the target (panel.open = true is the page's own tab API). Queries such as
// isVisible() or textContent() are left alone, so a test can still assert
// that a tab is not showing.
import {chromium as real} from 'playwright';

const ACTIONS=['click','dblclick','tap','hover','focus','fill','type','press','pressSequentially',
 'selectOption','check','uncheck','setInputFiles','dragTo','boundingBox','scrollIntoViewIfNeeded'];
let patched=false;
function follow(page){
 if(patched)return page;
 const proto=Object.getPrototypeOf(page.locator('html'));
 for(const name of ACTIONS){
  const original=proto[name];
  if(typeof original!=='function')continue;
  proto[name]=async function(...args){
   try{
    if(await this.count()>0)await this.first().evaluate(el=>{
     const panel=el.closest('.lab-panel');
     if(panel&&panel.hidden&&document.documentElement.dataset.view==='lab')panel.open=true;
    });
   }catch(_){/* the action itself reports a missing or detached target */}
   return original.apply(this,args);
  };
 }
 patched=true;
 return page;
}
function wrapContext(context){
 const newPage=context.newPage.bind(context);
 context.newPage=async(...args)=>follow(await newPage(...args));
 return context;
}
export const chromium={
 ...real,
 async launch(options){
  const browser=await real.launch(options);
  const newPage=browser.newPage.bind(browser),newContext=browser.newContext.bind(browser);
  browser.newPage=async(...args)=>follow(await newPage(...args));
  browser.newContext=async(...args)=>wrapContext(await newContext(...args));
  return browser;
 }
};
// Shows each inspector tab in turn and collects what `measure` returns there,
// so an audit covers the whole Lab rather than the one tab that is showing.
export const LAB_TABS=['lanes','union','time','sound','notes'];
export async function eachLabTab(page,measure){
 const results=[];
 for(const tab of LAB_TABS){
  await page.locator('.lab-tab[data-tab="'+tab+'"]').click();
  results.push({tab,result:await measure(tab)});
 }
 await page.locator('.lab-tab[data-tab="lanes"]').click();
 return results;
}
