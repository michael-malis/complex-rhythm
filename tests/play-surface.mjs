import {chromium} from './helpers/lab-tabs.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// The default view of the site is the playable instrument ("Play"); the full
// workbench lives behind #lab and is covered by every other regression test.
// This test opens the bare URL, exactly as a visitor does, and proves that the
// first screen is usable without reading anything: the rings are large and
// fully visible, Play starts real audio-clock playback, a point can be dragged
// around its ring, a lane's hit count changes with one tap, rhythms can be
// browsed while playing, and switching to the Lab never alters the rhythm.
const URL='http://127.0.0.1:8767/';
const directory='artifacts/play-surface';
fs.mkdirSync(directory,{recursive:true});
const browser=await chromium.launch({
 headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']
});
const TAU=2*Math.PI;
const circular=(a,b)=>{const d=Math.abs(((a-b)%1+1)%1);return Math.min(d,1-d)};
const viewports=[
 {name:'desktop',width:1440,height:900,interact:true},
 {name:'laptop',width:1280,height:720},
 {name:'tablet',width:820,height:1180,touch:true},
 {name:'phone',width:390,height:844,touch:true,mobile:true,scale:2,interact:true},
 {name:'small-phone',width:360,height:640,touch:true,mobile:true,scale:2}
];
const report=[];
// Weight budgets, uncompressed bytes. They exist so the page cannot grow
// heavier unnoticed; raise one only together with the reason in the PR.
const CODE_BUDGET=680000,FIRST_LOAD_BUDGET=980000,SAMPLE_LIBRARY_BUDGET=3000000;
const sampleLibrary=fs.readdirSync('samples').reduce((n,file)=>n+fs.statSync('samples/'+file).size,0);
assert.ok(sampleLibrary<=SAMPLE_LIBRARY_BUDGET,
 'sample library is '+sampleLibrary+' bytes; budget '+SAMPLE_LIBRARY_BUDGET);
const state=page=>page.evaluate(()=>{
 const R=window.RhythmResearch,root=document.documentElement;
 return {view:root.dataset.view,theme:root.dataset.theme,playingFlag:root.dataset.playing,cue:root.dataset.cue,
  hash:location.hash,transport:R.transport(),current:R.current(),
  hint:document.getElementById('playHint').textContent};
});
const settle=page=>page.evaluate(()=>document.fonts.ready.then(()=>
 new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
const geometry=page=>page.evaluate(()=>{
 const c=document.getElementById('orbitCanvas'),b=c.getBoundingClientRect(),R=window.RhythmResearch;
 return {cx:b.left+b.width/2,cy:b.top+b.height/2,radii:R.radiiForSize(Math.min(b.width,b.height)),
  phases:R.current().tracks.map(t=>R.rootPhases(t))};
});
const at=(g,lane,phase)=>{
 const a=-Math.PI/2+TAU*phase,r=g.radii[lane];
 return [g.cx+Math.cos(a)*r,g.cy+Math.sin(a)*r];
};
// Drags the pointer along one ring by `turn` radians, starting at `phase`.
async function dragAlongRing(page,lane,phase,turn){
 const g=await geometry(page);
 await page.mouse.move(...at(g,lane,phase));
 await page.mouse.down();
 for(let step=1;step<=8;step++)await page.mouse.move(...at(g,lane,phase+turn*step/8/TAU));
 await page.mouse.up();
 return g;
}
try{
 for(const viewport of viewports)for(const theme of ['light','dark']){
  const label=viewport.name+'/'+theme;
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},
   deviceScaleFactor:viewport.scale||1,hasTouch:!!viewport.touch,isMobile:!!viewport.mobile});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  // ---- weight: what a visitor downloads before touching anything ---------
  await page.waitForLoadState('load');
  const weight=await page.evaluate(()=>document.fonts.ready.then(()=>{
   const size=e=>e.decodedBodySize||e.encodedBodySize||e.transferSize||0;
   const all=[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')];
   const sum=list=>list.reduce((n,e)=>n+size(e),0);
   return {total:sum(all),files:all.length,
    code:sum(all.filter(e=>!/[.](woff2?|ttf)([?]|$)/.test(e.name)&&!e.name.includes('/samples/'))),
    samples:all.filter(e=>e.name.includes('/samples/')).map(e=>e.name)};
  }));
  assert.deepEqual(weight.samples,[],label+': no audio is downloaded before the visitor touches the page');
  assert.ok(weight.code>300000&&weight.code<=CODE_BUDGET,
   label+': uncompressed page code '+weight.code+' bytes must stay within '+CODE_BUDGET);
  assert.ok(weight.total<=FIRST_LOAD_BUDGET,
   label+': uncompressed first load '+weight.total+' bytes must stay within '+FIRST_LOAD_BUDGET);
  if(theme==='dark')await page.locator('#themeBtn').click();
  // Leave the pointer off every control and let the theme transition finish
  // so the stored screenshots show the resting state.
  await page.mouse.move(2,viewport.height-2);
  await page.waitForTimeout(350);
  await settle(page);

  // ---- first screen ---------------------------------------------------
  const first=await state(page);
  assert.equal(first.view,'play',label+': the bare URL opens the playable instrument');
  assert.equal(first.theme,theme,label+': theme');
  assert.equal(first.cue,'play',label+': the first cue points at Play');
  assert.match(first.hint,/Press play/,label+': one short first-use cue');
  assert.equal(first.transport.playing,false);
  const layout=await page.evaluate(()=>{
   const box=e=>{const b=e.getBoundingClientRect();return {left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};
   const shown=e=>{
    if(!e)return false;
    const css=getComputedStyle(e),b=e.getBoundingClientRect();
    return css.display!=='none'&&css.visibility!=='hidden'&&b.width>0&&b.height>0&&!e.closest('[hidden]');
   };
   const small=[];
   for(const e of document.querySelectorAll('button,summary,select,input[type=range],[role="slider"]')){
    if(e.disabled||!shown(e))continue;
    const b=e.getBoundingClientRect();
    if(b.width<43.95||b.height<43.95)
     small.push({id:e.id||e.className,width:+b.width.toFixed(1),height:+b.height.toFixed(1)});
   }
   const back=document.getElementById('orbitBack'),main=document.getElementById('orbitCanvas');
   const pixels=back.getContext('2d').getImageData(0,0,back.width,back.height).data;
   let painted=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i])painted++;
   return {innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth,
    plot:box(document.getElementById('plotArea')),play:box(document.getElementById('playBtn')),
    main:box(main),back:box(back),painted,small,
    labOnlyVisible:['.math-details','.sound-lab','#compositionPanel','.root-rule','footer','#windowPanel','.lab-tabs']
     .filter(selector=>shown(document.querySelector(selector))),
    quick:['presetSelect','presetPrev','presetNext','presetShuffle','viewPlay','viewLab',
     ...[0,1,2,3].flatMap(i=>['laneDial'+i,'laneLess'+i,'laneMore'+i,'laneSound'+i])]
     .filter(id=>!shown(document.getElementById(id))),
    lanes:document.querySelectorAll('#tracks .lane').length};
  });
  assert.ok(layout.scrollWidth<=layout.innerWidth+1,
   label+': no horizontal overflow ('+layout.scrollWidth+' > '+layout.innerWidth+')');
  assert.ok(Math.abs(layout.plot.width-layout.plot.height)<1,label+': the plot is a circle');
  assert.ok(layout.plot.width>=.55*Math.min(layout.innerWidth,layout.innerHeight),
   label+': the four rings are the main object, got '+layout.plot.width.toFixed(0)+'px');
  assert.ok(layout.plot.top>=0&&layout.plot.bottom<=layout.innerHeight+1&&
   layout.plot.left>=-1&&layout.plot.right<=layout.innerWidth+1,
   label+': the whole plot is visible without scrolling '+JSON.stringify(layout.plot));
  assert.ok(layout.play.width>=56&&layout.play.top>=0&&layout.play.bottom<=layout.innerHeight+1&&
   layout.play.left>=0&&layout.play.right<=layout.innerWidth+1,
   label+': Play is large and on the first screen '+JSON.stringify(layout.play));
  assert.ok(Math.abs(layout.back.width-layout.main.width)<1.5&&Math.abs(layout.back.left-layout.main.left)<1.5&&
   Math.abs(layout.back.top-layout.main.top)<1.5,label+': the underlay matches the measured Canvas');
  assert.ok(layout.painted>500,label+': the underlay draws polygons and ticks');
  assert.equal(layout.lanes,4,label+': four independent lanes');
  assert.deepEqual(layout.quick,[],label+': play-surface controls are present');
  assert.deepEqual(layout.labOnlyVisible,[],label+': Lab-only panels stay out of the way');
  assert.deepEqual(layout.small,[],label+': every visible control is at least 44 by 44 CSS px');
  await page.screenshot({path:directory+'/'+viewport.name+'-'+theme+'-idle.png'});

  // ---- press Play -------------------------------------------------------
  await page.locator('#playBtn').click();
  await page.waitForFunction(()=>window.RhythmResearch.transport().playing&&
   window.RhythmResearch.orbitalHands().playing&&window.RhythmResearch.orbitalHands().elapsed>.3,null,{timeout:15000});
  const playing=await state(page);
  assert.equal(playing.playingFlag,'true',label+': the surface reflects playback');
  assert.equal(playing.transport.audioState,'running',label+': real AudioContext playback');
  assert.equal(playing.cue,'rotate',label+': the next cue invites dragging a point');
  await page.waitForTimeout(700);
  await page.screenshot({path:directory+'/'+viewport.name+'-'+theme+'-playing.png'});

  const entry={weight,viewport:viewport.name,theme,plotPx:Math.round(layout.plot.width),underlayPixels:layout.painted};
  if(viewport.interact&&theme==='light'){
   // ---- drag a point around its ring ----------------------------------
   const before=playing.current.tracks[0];
   const turn=.5;
   const g=await dragAlongRing(page,0,(await geometry(page)).phases[0][0],turn);
   let now=await state(page);
   const moved=await page.evaluate(()=>window.RhythmResearch.rootPhases(window.RhythmResearch.current().tracks[0]));
   assert.equal(now.current.tracks[0].n,before.n,label+': dragging keeps the root degree');
   assert.ok(Math.abs(Math.hypot(now.current.tracks[0].a,now.current.tracks[0].b)-Math.hypot(before.a,before.b))<1e-6,
    label+': dragging keeps |z|');
   assert.equal(moved.length,g.phases[0].length);
   for(const phase of g.phases[0])
    assert.ok(moved.some(x=>circular(x,phase+turn/TAU)<.004),
     label+': every root follows the pointer by the same angle '+JSON.stringify({from:g.phases[0],to:moved}));
   assert.equal(now.cue,'step',label+': the last cue points at the hit stepper');
   assert.equal(now.transport.playing,true,label+': rotating never stops playback');

   // ---- the whole ring is a handle ------------------------------------
   const ring=await dragAlongRing(page,1,.125,-.4);
   const ringMoved=await page.evaluate(()=>window.RhythmResearch.rootPhases(window.RhythmResearch.current().tracks[1]));
   for(const phase of ring.phases[1])
    assert.ok(ringMoved.some(x=>circular(x,phase-.4/TAU)<.004),
     label+': dragging the empty ring rotates that lane '+JSON.stringify({from:ring.phases[1],to:ringMoved}));

   // ---- one tap changes how many hits a lane plays ----------------------
   await page.locator('#laneMore0').click();
   now=await state(page);
   assert.equal(now.current.tracks[0].n,before.n+1,label+': + adds one evenly spaced hit');
   assert.equal(await page.locator('#laneN0 .lane-n-value').textContent(),String(before.n+1));
   assert.equal(await page.locator('#trackN0').evaluate(e=>e.value),String(before.n+1),
    label+': the stepper and the Lab number field are one editor');
   await page.locator('#laneLess0').click();
   assert.equal((await state(page)).current.tracks[0].n,before.n);
   now=await state(page);
   assert.equal(now.cue,'done',label+': cues retire after the three gestures');
   assert.match(now.hint,/^Lane 1 · .+ · \d+ hits? every bar$/,label+': the cue line then describes the lane');

   // ---- the lane miniature is a rotation dial ---------------------------
   await page.locator('#laneDial2').focus();
   await page.keyboard.press('ArrowRight');
   now=await state(page);
   assert.ok(Math.abs(Math.atan2(now.current.tracks[2].b,now.current.tracks[2].a)-Math.PI/12)<1e-6,
    label+': an arrow key turns the dial by 15 degrees');
   assert.equal(await page.locator('#laneDial2').getAttribute('aria-valuenow'),'15');
   await page.locator('#laneDial3').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   await settle(page);
   const dial=await page.locator('#laneDial3').boundingBox();
   const dialAt=angle=>[dial.x+dial.width/2+Math.cos(angle)*dial.width*.3,dial.y+dial.height/2+Math.sin(angle)*dial.height*.3];
   await page.mouse.move(...dialAt(0));
   await page.mouse.down();
   for(let step=1;step<=6;step++)await page.mouse.move(...dialAt(Math.PI/2*step/6));
   await page.mouse.up();
   now=await state(page);
   const lane3=now.current.tracks[3];
   assert.ok(Math.abs(Math.atan2(lane3.b,lane3.a)-lane3.n*Math.PI/2)<.02||
    circular(Math.atan2(lane3.b,lane3.a)/TAU,lane3.n/4)<.004,
    label+': dragging the dial a quarter turn rotates the lane a quarter turn');
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   await settle(page);

   // ---- browse rhythms without stopping ---------------------------------
   await page.locator('#presetNext').click();
   const next=await state(page);
   assert.ok(next.transport.activePresetId,label+': next loads a catalog rhythm');
   assert.equal(next.transport.playing,true,label+': browsing keeps the transport running');
   await page.locator('#presetShuffle').click();
   const shuffled=await state(page);
   assert.ok(shuffled.transport.activePresetId&&shuffled.transport.activePresetId!==next.transport.activePresetId,
    label+': Surprise me loads a different rhythm');
   assert.equal(shuffled.transport.playing,true);

   // ---- Play <-> Lab is a view change only ------------------------------
   await page.locator('#viewLab').click();
   await settle(page);
   const lab=await state(page);
   assert.equal(lab.view,'lab');assert.equal(lab.hash,'#lab');
   assert.deepEqual(lab.current,shuffled.current,label+': switching to the Lab keeps the rhythm');
   assert.equal(lab.transport.playing,true,label+': switching to the Lab keeps the sound');
   assert.ok(await page.locator('.root-rule').isVisible()&&await page.locator('#trackAngleRad0').isVisible(),label+': the Lab shows the mathematics');
   assert.equal(await page.locator('.lab-tab').count(),5,label+': the Lab inspector has five tabs');
   await page.locator('#tabNotes').click();
   assert.ok(await page.locator('.math-details').isVisible(),label+': the Notes tab shows the formulas');
   await page.locator('#tabLanes').click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+': Lab has no overflow');
   await page.screenshot({path:directory+'/'+viewport.name+'-'+theme+'-lab.png'});
   await page.locator('#viewPlay').click();
   await settle(page);
   const back=await state(page);
   assert.equal(back.view,'play');assert.equal(back.hash,'');
   assert.deepEqual(back.current,shuffled.current,label+': returning to Play keeps the rhythm');

   // ---- roll, mutate, undo -------------------------------------------------
   const picker=()=>page.evaluate(()=>{
    const select=document.getElementById('presetSelect');
    return {value:select.value,text:select.selectedOptions[0]?.textContent||'',
     undoDisabled:document.getElementById('undoBtn').disabled,
     events:window.RhythmResearch.current().tracks.map(t=>window.RhythmResearch.events(t).length)};
   });
   assert.equal((await picker()).undoDisabled,true,label+': nothing to undo yet');
   for(let roll=0;roll<6;roll++){
    await page.locator('#diceBtn').click();
    const rolled=await state(page),shown=await picker();
    assert.equal(rolled.transport.activePresetId,null,label+': a roll is a new rhythm, not a catalog preset');
    assert.equal(shown.value,'__custom__');
    assert.match(shown.text,/^Roll · \d+:\d+:\d+:\d+$/,label+': a roll is named by its four root degrees');
    assert.equal(rolled.current.tracks.length,4);
    assert.ok(shown.events.every(n=>n>=1)&&shown.events.reduce((a,b)=>a+b,0)<=60,
     label+': every rolled lane plays and the result stays readable '+JSON.stringify(shown.events));
    assert.ok(rolled.current.bpm>=98&&rolled.current.bpm<=176,label+': rolled tempo '+rolled.current.bpm);
    assert.equal(rolled.transport.playing,true,label+': rolling keeps the transport running');
   }
   const beforeMutation=await state(page);
   await page.locator('#mutateBtn').click();
   const mutated=await state(page);
   assert.notDeepEqual(mutated.current,beforeMutation.current,label+': a mutation changes the rhythm');
   const changedLanes=mutated.current.tracks.filter((t,i)=>JSON.stringify(t)!==JSON.stringify(beforeMutation.current.tracks[i])).length;
   assert.equal(changedLanes,1,label+': a mutation touches exactly one lane');
   assert.equal(mutated.current.bpm,beforeMutation.current.bpm);
   assert.equal(mutated.transport.playing,true,label+': mutating keeps the transport running');
   await page.locator('#undoBtn').click();
   assert.deepEqual((await state(page)).current,beforeMutation.current,label+': undo restores the rhythm before the mutation');
   for(let step=0;step<6;step++)await page.locator('#undoBtn').click();
   const restored=await state(page);
   assert.deepEqual(restored.current,back.current,label+': undoing every roll returns to the catalog rhythm');
   assert.equal(restored.transport.activePresetId,back.transport.activePresetId,label+': undo restores the preset identity');
   assert.equal((await picker()).undoDisabled,true,label+': the undo history is exhausted');

   // ---- live keys: Q W E R mute, Shift solos, T taps the tempo -------------
   const mutes=()=>page.evaluate(()=>window.RhythmResearch.current().tracks.map(t=>t.muted));
   await page.locator('#stageBtn').focus();
   await page.keyboard.press('q');
   assert.deepEqual(await mutes(),[true,false,false,false],label+': Q mutes the first lane');
   await page.keyboard.press('q');
   assert.deepEqual(await mutes(),[false,false,false,false],label+': Q again unmutes it');
   await page.keyboard.press('e');
   await page.keyboard.press('Shift+w');
   assert.deepEqual(await mutes(),[true,false,true,true],label+': Shift+W solos the second lane');
   await page.keyboard.press('Shift+w');
   assert.deepEqual(await mutes(),[false,false,true,false],label+': leaving solo restores the earlier mutes');
   await page.keyboard.press('e');
   assert.deepEqual(await mutes(),[false,false,false,false]);
   await page.locator('#laneMute3').dblclick();
   assert.deepEqual(await mutes(),[true,true,true,false],label+': a double press on a mute button solos that lane');
   await page.locator('#laneMute3').dblclick();
   assert.deepEqual(await mutes(),[false,false,false,false]);
   for(let tap=0;tap<4;tap++){
    await page.locator('#tapBtn').click();
    if(tap<3)await page.waitForTimeout(400);
   }
   const tapped=await state(page);
   assert.ok(tapped.current.bpm>=105&&tapped.current.bpm<=155,
    label+': four taps 0.4 s apart set a tempo near 150 BPM, got '+tapped.current.bpm);
   assert.equal(await page.locator('#bpmText').textContent(),String(tapped.current.bpm));
   assert.equal(tapped.transport.playing,true);

   // ---- stage: only the rings ----------------------------------------------
   await page.evaluate(()=>{Element.prototype.requestFullscreen=()=>Promise.reject(new Error('not in CI'))});
   await page.locator('#stageBtn').click();
   await settle(page);
   const stage=await page.evaluate(()=>{
    const box=e=>{const b=e.getBoundingClientRect();return {left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};
    const shown=e=>{const css=getComputedStyle(e),b=e.getBoundingClientRect();return css.display!=='none'&&b.width>0&&b.height>0};
    return {on:document.documentElement.dataset.stage,innerWidth,innerHeight,
     plot:box(document.getElementById('plotArea')),play:box(document.getElementById('playBtn')),
     hidden:['.topbar','.preset-strip','.control-panel'].filter(s=>!shown(document.querySelector(s))).length,
     scrollWidth:document.documentElement.scrollWidth};
   });
   assert.equal(stage.on,'on',label+': the stage opens');
   assert.equal(stage.hidden,3,label+': the stage hides everything except the rings and transport');
   assert.ok(stage.plot.width>=.8*Math.min(stage.innerWidth-24,stage.innerHeight-150)-2,
    label+': on stage the rings use the screen '+JSON.stringify(stage.plot));
   assert.ok(stage.plot.top>=0&&stage.plot.left>=0&&stage.plot.right<=stage.innerWidth+1&&
    stage.play.bottom<=stage.innerHeight+1&&stage.plot.bottom<=stage.play.top+40&&stage.scrollWidth<=stage.innerWidth+1,
    label+': rings and Play both fit the stage '+JSON.stringify(stage));
   assert.equal((await state(page)).transport.playing,true,label+': the stage does not interrupt playback');
   await page.screenshot({path:directory+'/'+viewport.name+'-'+theme+'-stage.png'});
   await page.keyboard.press('Escape');
   await settle(page);
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.stage||'off'),'off',label+': Escape leaves the stage');
   await page.keyboard.press('f');
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.stage||'off'),'on',label+': F opens the stage');
   await page.keyboard.press('f');
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.stage||'off'),'off');

   // ---- modes: Build and Drift act in the scheduler, on the bar line -------
   await page.locator('#categorySelect').selectOption('poly');
   await page.locator('#presetSelect').selectOption('poly-2-3');
   await page.locator('#presetSelect').selectOption('afro');
   const modes=()=>page.evaluate(()=>({...window.RhythmResearch.modes(),transport:window.RhythmResearch.transport(),
    phases:window.RhythmResearch.current().tracks.map(t=>window.RhythmResearch.events(t).map(e=>e.phase))}));
   const idleModes=await modes();
   assert.equal(idleModes.drift.on,false);assert.equal(idleModes.build.on,false);
   assert.deepEqual(idleModes.build.audible,[true,true,true,true],label+': with Build off every lane is audible');
   await page.locator('#buildBtn').click();
   const building=await modes();
   assert.equal(building.build.on,true);
   assert.deepEqual(building.build.audible,[true,false,false,false],label+': Build starts with the first lane alone');
   await page.waitForTimeout(1700);
   const afterBuild=await modes();
   assert.ok(afterBuild.emitted[0]>building.emitted[0],label+': the first lane keeps sounding during the build');
   assert.deepEqual(afterBuild.emitted.slice(1),building.emitted.slice(1),
    label+': lanes waiting for their entrance schedule nothing '+JSON.stringify([building.emitted,afterBuild.emitted]));
   assert.deepEqual(afterBuild.phases,building.phases,label+': Build never edits the rhythm');
   assert.deepEqual((await state(page)).current.tracks.map(t=>t.muted),[false,false,false,false],label+': Build never touches mutes');
   await page.locator('#buildBtn').click();
   await page.waitForTimeout(1300);
   const afterBuildOff=await modes();
   assert.ok(afterBuildOff.emitted[2]>afterBuild.emitted[2]&&afterBuildOff.emitted[1]>afterBuild.emitted[1],
    label+': switching Build off brings every lane back');

   await page.locator('#driftBtn').click();
   const drifting=await modes();
   assert.equal(drifting.drift.on,true);assert.equal(drifting.drift.steps,0);
   await page.waitForFunction(()=>window.RhythmResearch.modes().drift.steps>=1,null,{timeout:20000});
   const drifted=await modes();
   const driftLaneIndex=drifted.drift.lane,driftTurn=drifted.drift.steps/drifted.drift.grid;
   const near=(a,b)=>{const d=Math.abs(a-b)%1;return Math.min(d,1-d)<1e-6};
   assert.ok(drifting.phases[driftLaneIndex].length>0&&drifting.phases[driftLaneIndex].every(p=>drifted.phases[driftLaneIndex].some(q=>near(q,p+driftTurn))),
    label+': the drifting lane moved a whole sixteenth per step '+JSON.stringify([drifting.phases[driftLaneIndex],drifted.phases[driftLaneIndex],driftTurn]));
   for(let other=0;other<4;other++)if(other!==driftLaneIndex)
    assert.deepEqual(drifted.phases[other],drifting.phases[other],label+': Drift leaves lane '+(other+1)+' alone');
   assert.equal(drifted.transport.voiceBusGenerations,drifting.transport.voiceBusGenerations,
    label+': a drift step does not cut sounding voices');
   assert.equal(drifted.transport.playing,true);
   await page.locator('#driftBtn').click();
   assert.equal((await modes()).drift.on,false);

   // ---- pause ------------------------------------------------------------
   await page.locator('#playBtn').click();
   await page.waitForFunction(()=>!window.RhythmResearch.transport().playing,null,{timeout:10000});
   assert.equal((await state(page)).playingFlag,'false');

   // ---- a still picture is cheap ----------------------------------------
   await page.mouse.move(2,viewport.height-2);
   await page.waitForTimeout(2400);
   const still=await page.evaluate(()=>window.RhythmResearch.frames());
   await page.waitForTimeout(1000);
   const later=await page.evaluate(()=>window.RhythmResearch.frames());
   assert.ok(later.painted-still.painted<=8,
    label+': an idle page repaints a few times per second, got '+(later.painted-still.painted));
   assert.ok(later.skipped-still.skipped>=10,label+': the animation loop itself keeps running');
   await page.keyboard.press('Shift');
   await page.waitForTimeout(400);
   const awake=await page.evaluate(()=>window.RhythmResearch.frames());
   assert.ok(awake.painted-later.painted>=8,
    label+': any input restores full-rate drawing, got '+(awake.painted-later.painted));
   entry.idleFramesPerSecond=later.painted-still.painted;

   // ---- dense rings can be magnified without leaving Play ----------------
   // A known rhythm: the one loaded so far was picked at random.
   await page.locator('#categorySelect').selectOption('poly');
   await page.locator('#presetSelect').selectOption('afro');
   await page.evaluate(()=>{
    const input=document.getElementById('trackN3');
    input.value='48';input.dispatchEvent(new Event('input',{bubbles:true}));
   });
   await settle(page);
   assert.equal((await state(page)).current.tracks[3].n,48);
   assert.ok(await page.locator('#zoomBtn').isVisible(),label+': dense roots offer magnification');
   await page.locator('#zoomBtn').click();
   await settle(page);
   const zoom=await page.evaluate(()=>{
    const box=e=>{const b=e.getBoundingClientRect();return {left:b.left,top:b.top,width:b.width,height:b.height}};
    const plot=document.getElementById('plotArea');
    return {focused:plot.classList.contains('focused'),main:box(document.getElementById('orbitCanvas')),
     back:box(document.getElementById('orbitBack')),plot:box(plot),
     scrollWidth:document.documentElement.scrollWidth,innerWidth,innerHeight};
   });
   assert.ok(zoom.focused&&zoom.main.width>=900,label+': magnified Canvas '+JSON.stringify(zoom.main));
   assert.ok(Math.abs(zoom.back.width-zoom.main.width)<1.5&&Math.abs(zoom.back.left-zoom.main.left)<1.5&&
    Math.abs(zoom.back.top-zoom.main.top)<1.5,label+': the underlay follows magnification '+JSON.stringify(zoom));
   assert.ok(zoom.scrollWidth<=zoom.innerWidth+1&&zoom.plot.width<=zoom.innerWidth+1&&zoom.plot.height<=zoom.innerHeight,
    label+': the magnified plot scrolls inside its own frame '+JSON.stringify(zoom.plot));
   await page.screenshot({path:directory+'/'+viewport.name+'-'+theme+'-zoom.png'});
   await page.locator('#zoomBtn').click();
   await settle(page);
   assert.equal(await page.evaluate(()=>document.getElementById('plotArea').classList.contains('focused')),false);
   entry.interaction='drag, ring drag, stepper, dial keys, dial drag, browse, shuffle, view switch, roll, mutate, undo, mute and solo keys, tap tempo, stage, build, drift, pause, zoom';
  }
  assert.deepEqual(errors,[],label+': no runtime errors');
  report.push(entry);
  await page.close();
 }

 // The Lab deep link and the system color scheme are honored on load.
 const deep=await browser.newPage({viewport:{width:1280,height:800},colorScheme:'dark'});
 await deep.goto(URL+'#lab',{waitUntil:'domcontentloaded'});
 assert.equal(await deep.evaluate(()=>document.documentElement.dataset.view),'lab');
 assert.equal(await deep.locator('#viewLab').getAttribute('aria-pressed'),'true');
 assert.equal(await deep.evaluate(()=>document.documentElement.dataset.theme),'dark',
  'without a saved choice the page follows the system color scheme');
 await deep.close();

 fs.writeFileSync(directory+'/report.json',JSON.stringify({status:'PASS',cases:report.length,report},null,2)+'\n');
 console.log('PASS play surface: '+report.length+' viewport/theme states, real playback, root/ring/dial drags, stepper, browsing and Play/Lab switching');
}finally{await browser.close()}
