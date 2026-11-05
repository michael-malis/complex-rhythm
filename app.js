'use strict';
(() => {
const TAU=2*Math.PI;
let COLORS=['#ab5847','#567a63','#967438','#80618a'];
let RGB=[[171,88,71],[86,122,99],[150,116,56],[128,97,138]];
let theme='light';
const SOUNDS={kick:'Kick',snare:'Snare',clap:'Clap',hat:'Closed hat',openhat:'Open hat',rim:'Rim click',tom:'Tom',bass:'Sub bass',shaker:'Shaker',reese:'Reese bass',acid:'Acid synth',surdo:'Surdo',agogo:'Agogô',tamborim:'Tamborim',jazzkick:'Soft acoustic kick',crossstick:'Jazz cross-stick',jazzshaker:'Natural shaker',jazzhat:'Jazz hi-hat',jazzsnare:'Acoustic snare',claves:'Wooden claves',bongo:'Natural bongo',berlinrumble:'Berlin sub-rumble'};
// Every audible time point is still the argument of a complex root.
const P=(a,b,n,sound,layers=[])=>({a,b,n,sound,muted:false,layers});
// A phase on a 16th-note grid encoded by a degree-1 complex root.
const L=(step,velocity=.58)=>({a:Math.cos(TAU*step/16),b:Math.sin(TAU*step/16),n:1,velocity});
// A two-bar cycle contains 32 equal 16th-note positions. Every accent is still a 1st complex root.
const L32=(step,velocity=.58)=>({a:Math.cos(TAU*step/32),b:Math.sin(TAU*step/32),n:1,velocity});
const PRESETS=[
// Bunker techno: stable four-on-the-floor foundations; less bass/hats clutter.
// Berlin industrial: dry four-to-the-floor kick + offbeat sub-rumble. Rumble is sampled, not four more kicks.
 {id:'berlin-bass-wall',category:'bunker',name:'BERLIN BUNKER · Bass Wall',bpm:146,tracks:[P(1,0,4,'kick'),P(-1,0,4,'berlinrumble'),P(-1,0,8,'hat'),P(-1,0,2,'rim',[L(15,.32)])]},
 {id:'concrete',category:'bunker',name:'Concrete · Drive',bpm:138,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'hat'),P(1,0,2,'bass',[L(7,.45)])]},
 {id:'shaft',category:'bunker',name:'Ventilation · Industrial',bpm:143,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(1,0,2,'tom',[L(13,.45)])]},
 {id:'dust',category:'bunker',name:'Dust · Half-light',bpm:134,tracks:[P(1,0,4,'kick'),P(-1,0,2,'rim'),P(-1,0,4,'openhat'),P(1,0,2,'bass',[L(14,.55)])]},
 {id:'iron',category:'bunker',name:'Iron · Peak',bpm:151,tracks:[P(1,0,4,'kick',[L(14,.58)]),P(-1,0,2,'clap'),P(1,0,8,'hat'),P(-1,0,4,'acid')]},
 {id:'pressure',category:'bunker',name:'Pressure · Dub',bpm:140,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(-1,0,4,'hat'),P(1,0,1,'bass',[L(10,.72)])]},
// Essential rhythmic studies.
 {id:'house',category:'other',name:'Classic House · 4/4',bpm:125,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'openhat'),P(1,0,8,'shaker')]},
 {id:'dub',category:'other',name:'Dub · Half-time',bpm:78,tracks:[P(1,0,2,'kick',[L(11,.68)]),P(-1,0,1,'snare'),P(-1,0,4,'hat'),P(1,0,2,'bass')]},
 {id:'afro',category:'poly',name:'Polyrhythm · 3 : 4',bpm:116,tracks:[P(1,0,3,'tom'),P(1,0,4,'rim'),P(1,0,8,'shaker'),P(1,0,1,'bass')]},
 {id:'minimal',category:'poly',name:'Polyrhythm · 5 : 7',bpm:124,tracks:[P(1,0,5,'tom'),P(1,0,7,'rim'),P(1,0,8,'hat'),P(1,0,1,'kick')]},
 {id:'ambient',category:'other',name:'Slow Orbit · Space',bpm:70,tracks:[P(1,0,1,'kick'),P(0,1,3,'tom'),P(-1,0,4,'openhat'),P(1,0,2,'bass')]},
// DnB: kick 1 + &3 (grid 0,10) and backbeat on 2 + 4; softer ghost notes.
 {id:'neuro-burst',category:'dnb',name:'Neuro · 2-Step',bpm:174,tracks:[P(1,0,1,'kick',[L(10,.92)]),P(-1,0,2,'snare',[L(7,.27)]),P(1,0,8,'hat',[L(3,.42),L(11,.42)]),P(1,0,2,'reese')]},
 {id:'double-drop',category:'dnb',name:'Roller · Ghosts',bpm:176,tracks:[P(1,0,1,'kick',[L(10,.96),L(14,.38)]),P(-1,0,2,'snare',[L(7,.30),L(15,.30)]),P(1,0,8,'hat'),P(-1,0,2,'bass',[L(11,.48)])]},
 {id:'subpressure',category:'dnb',name:'Sub Pressure · Half-time',bpm:172,tracks:[P(1,0,1,'kick',[L(10,.83)]),P(-1,0,1,'snare',[L(15,.25)]),P(1,0,8,'shaker'),P(1,0,2,'reese')]},
 {id:'velocity-grid',category:'dnb',name:'Break Grid · 16ths',bpm:178,tracks:[P(1,0,1,'kick',[L(6,.57),L(10,.9)]),P(-1,0,2,'snare',[L(7,.27),L(15,.31)]),P(1,0,8,'hat',[L(3,.4),L(11,.45)]),P(1,0,2,'bass')]},
// Jungle: off-beat kick pick-ups, ghost snares and a busier break-like top.
 {id:'ragga-spiral',category:'jungle',name:'Ragga · Break Step',bpm:164,tracks:[P(1,0,1,'kick',[L(6,.75),L(10,.85)]),P(-1,0,2,'snare',[L(7,.31),L(15,.38)]),P(1,0,8,'hat',[L(3,.35),L(11,.42)]),P(1,0,2,'reese')]},
 {id:'break-torrent',category:'jungle',name:'Break Torrent · Chops',bpm:169,tracks:[P(1,0,1,'kick',[L(3,.55),L(10,.9),L(14,.48)]),P(-1,0,2,'snare',[L(6,.31),L(15,.29)]),P(1,0,8,'shaker',[L(7,.38),L(15,.42)]),P(1,0,2,'bass')]},
 {id:'ghostline',category:'jungle',name:'Ghostline · Half-roll',bpm:160,tracks:[P(1,0,1,'kick',[L(10,.84)]),P(-1,0,2,'snare',[L(3,.25),L(7,.3)]),P(1,0,8,'hat'),P(1,0,1,'bass',[L(11,.63)])]},
 {id:'chopped-orbit',category:'jungle',name:'Chopped Orbit · Fast',bpm:172,tracks:[P(1,0,1,'kick',[L(6,.5),L(10,.92)]),P(-1,0,2,'snare',[L(7,.34),L(15,.28)]),P(1,0,8,'hat',[L(3,.48),L(11,.48)]),P(1,0,2,'reese')]},
// One Bossa Nova study spans two bars; three former Bossa variants are now polyrhythm studies.
 {id:'bossa-classic',category:'brazil',name:'Bossa Nova · Classic',bpm:116,bars:2,tracks:[P(1,0,4,'jazzkick',[L32(6,.46),L32(14,.42),L32(22,.46),L32(30,.42)]),P(1,0,1,'crossstick',[L32(6,.8),L32(12,.92),L32(20,.82),L32(26,.84)]),P(1,0,16,'jazzshaker'),P(0,0,1,'bongo',[L32(11,.28),L32(27,.32)])]},
 {id:'poly-2-3',category:'poly',name:'Polyrhythm · 2 : 3',bpm:108,tracks:[P(1,0,2,'tom'),P(1,0,3,'rim'),P(1,0,6,'shaker'),P(1,0,1,'bass')]},
 {id:'poly-3-5',category:'poly',name:'Polyrhythm · 3 : 5',bpm:112,tracks:[P(1,0,3,'tom'),P(1,0,5,'rim'),P(1,0,1,'jazzkick'),P(1,0,1,'shaker')]},
 {id:'poly-4-7',category:'poly',name:'Polyrhythm · 4 : 7',bpm:118,tracks:[P(1,0,4,'kick'),P(1,0,7,'rim'),P(1,0,1,'tom'),P(1,0,1,'shaker')]},
// Other Brazilian-inspired studies; not exact transcriptions.
 {id:'baile-funk',category:'brazil',name:'Baile Funk · Tamborzão',bpm:132,tracks:[P(1,0,2,'kick',[L(6,.73),L(14,.78)]),P(-1,0,2,'clap',[L(11,.6)]),P(1,0,8,'tamborim'),P(1,0,2,'bass',[L(3,.58)])]},
 {id:'samba-drive',category:'brazil',name:'Samba · Surdo Pulse',bpm:108,tracks:[P(1,0,2,'surdo',[L(12,.58)]),P(-1,0,4,'tamborim',[L(2,.5),L(10,.5)]),P(1,0,8,'shaker'),P(1,0,2,'agogo',[L(11,.6)])]},
 {id:'batucada',category:'brazil',name:'Batucada · Layers',bpm:118,tracks:[P(1,0,2,'surdo',[L(14,.51)]),P(-1,0,4,'tamborim',[L(3,.56),L(11,.62)]),P(1,0,8,'shaker'),P(1,0,2,'agogo',[L(6,.7)])]},
 {id:'maracatu',category:'brazil',name:'Maracatu · Pulse Sketch',bpm:104,tracks:[P(1,0,2,'surdo',[L(13,.53)]),P(-1,0,2,'clap',[L(7,.42)]),P(-1,0,4,'agogo'),P(1,0,2,'tom',[L(10,.66)])]},
// House keeps true four-on-floor kicks and backbeats.
 {id:'warehouse-hammer',category:'hardhouse',name:'Warehouse · Hard Drive',bpm:146,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'openhat'),P(-1,0,4,'bass',[L(14,.57)])]},
 {id:'steel-rave',category:'hardhouse',name:'Steel Rave · Stabs',bpm:152,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(11,.59)])]},
 {id:'stomp-circuit',category:'hardhouse',name:'Stomp Circuit · Push',bpm:148,tracks:[P(1,0,4,'kick',[L(14,.52)]),P(-1,0,2,'clap'),P(-1,0,4,'openhat'),P(1,0,2,'bass',[L(11,.63)])]},
 {id:'peak-pressure',category:'hardhouse',name:'Peak Pressure · Rave',bpm:156,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(3,.6),L(11,.6)])]},
// Acid: regular house foundation with syncopated, resonant bass stabs.
 {id:'acid-303',category:'acid',name:'Acid 303 · Classic',bpm:128,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'hat'),P(-1,0,4,'acid',[L(2,.65),L(10,.66)])]},
 {id:'resonance-rush',category:'acid',name:'Resonance · Twister',bpm:134,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(7,.55),L(15,.55)])]},
 {id:'liquid-corrosion',category:'acid',name:'Liquid · Acid Dub',bpm:124,tracks:[P(1,0,4,'kick'),P(-1,0,2,'rim'),P(-1,0,4,'openhat'),P(1,0,2,'acid',[L(3,.62),L(11,.57)])]},
 {id:'303-pressure',category:'acid',name:'303 Pressure · Peak',bpm:140,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(1,.56),L(9,.58)])]}
];
const $=id=>document.getElementById(id);
const canvas=$('orbitCanvas'), ctx=canvas.getContext('2d');
let tracks=[], selectedTrack=0, bpm=146, cycleBars=1, volume=.65, activePresetId='berlin-bass-wall',activeCategory='bunker';
let playing=false,pausedPhase=0,beatEpoch=0,scheduledUntil=0,timerId=null;
let audio=null,master=null,compressor=null,noiseBuffer=null,voiceBus=null,perHitBus=null,cycles=1;
const sampleBuffers=new Map();const samplePromises=new Map();
let cvWidth=0,cvHeight=0,pixelRatio=1,lastCycleText='';
let toastTimeout=null,rootDrag=null;
const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');let reducedMotion=motionQuery?.matches??false;motionQuery?.addEventListener?.('change',e=>{reducedMotion=e.matches});
function safeInt(v,lo,hi,fallback){const n=Number(v);return Number.isFinite(n)?Math.max(lo,Math.min(hi,Math.round(n))):fallback}
function safeReal(v,fallback){const n=Number(v);return Number.isFinite(n)&&Math.abs(n)<=10000?n:fallback}
function cleanLayer(layer){return {a:safeReal(layer.a,1),b:safeReal(layer.b,0),n:safeInt(layer.n,1,24,1),velocity:Math.min(1,Math.max(.1,safeReal(layer.velocity,.62)))}}
function cleanTrack(t,i){return {a:safeReal(t.a,1),b:safeReal(t.b,0),n:safeInt(t.n,1,24,4),sound:Object.hasOwn(SOUNDS,t.sound)?t.sound:['kick','clap','hat','bass'][i],muted:Boolean(t.muted),layers:Array.isArray(t.layers)?t.layers.slice(0,5).map(cleanLayer):[]}}
function rootPhases({a,b,n}){if(!Number.isFinite(a)||!Number.isFinite(b)||(a===0&&b===0))return [];const arg=Math.atan2(b,a);return Array.from({length:n},(_,k)=>((((arg+TAU*k)/n)/TAU)+1)%1)}
// Union of sets of complex roots; exact duplicates combine rather than play twice.
function events(track){const all=rootPhases(track).map(phase=>({phase,velocity:1}));for(const layer of track.layers||[]){for(const phase of rootPhases(layer))all.push({phase,velocity:layer.velocity??.62})}all.sort((a,b)=>a.phase-b.phase);const out=[];for(const item of all){const last=out[out.length-1];if(last&&Math.abs(last.phase-item.phase)<1e-6)last.velocity=Math.max(last.velocity,item.velocity);else out.push(item)}if(out.length>1&&Math.abs(1+out[0].phase-out[out.length-1].phase)<1e-6){out[0].velocity=Math.max(out[0].velocity,out.pop().velocity)}return out}
function roots(track){return events(track).map(x=>x.phase)}
function composePhases(track) {
 const base=rootPhases(track);
 const extra=[];
 for(const layer of track.layers||[])extra.push(...rootPhases(layer));
 const near=(a,b)=>Math.abs(a-b)<1e-6||Math.abs(Math.abs(a-b)-1)<1e-6;
 const unique=items=>items.filter((phase,i)=>items.findIndex(v=>near(v,phase))===i).sort((a,b)=>a-b);
 const added=unique(extra);
 const merged=events(track).map(ev=>({
  phase:ev.phase,
  base:base.some(p=>near(p,ev.phase)),
  added:added.some(p=>near(p,ev.phase))
 }));
 return {base,added,merged,overlaps:merged.filter(v=>v.base&&v.added).length};
}
function fmt(n){return Number(n.toFixed(3)).toString().replace('-', '−')}
function complexDisplay(t){return `${fmt(t.a)} ${t.b<0?'−':'+'} ${fmt(Math.abs(t.b))}i`}
function hitLabel(n){return `${n} ${n===1?'hit':'hits'}`}
function applyRotation(t,ang){const radius=Math.hypot(t.a,t.b);if(!radius)return false;const snap=x=>Math.abs(x)<radius*1e-12?0:Number(x.toPrecision(10));t.a=snap(radius*Math.cos(ang));t.b=snap(radius*Math.sin(ang));return true}
function renderPresets(){ $('presetCount').textContent=`${PRESETS.length} rhythm examples · ${new Set(PRESETS.map(p=>p.category)).size} categories`; $('categorySelect').value=activeCategory;const select=$('presetSelect');select.replaceChildren();if(!activePresetId){const x=document.createElement('option');x.value='__custom__';x.textContent='Custom rhythm';select.append(x)}for(const p of PRESETS.filter(p=>p.category===activeCategory)){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;select.append(o)}select.value=activePresetId||'__custom__'}
function renderTracks() {
 const wrap=$('tracks');wrap.replaceChildren();
 tracks.forEach((t,i)=>{
  const row=document.createElement('article');row.className='lane'+(i===selectedTrack?' selected':'')+(t.muted?' muted':'');row.dataset.lane=String(i);row.style.setProperty('--lane-color',COLORS[i]);
  const head=document.createElement('div');head.className='lane-head';
  const pick=document.createElement('button');pick.type='button';pick.className='lane-select';pick.setAttribute('aria-pressed',String(i===selectedTrack));
  const num=document.createElement('span');num.className='lane-id';num.textContent=String(i+1).padStart(2,'0');
  const dot=document.createElement('span');dot.className='lane-dot';dot.setAttribute('aria-hidden','true');
  const name=document.createElement('span');name.textContent='Lane '+(i+1);
  pick.append(num,dot,name);pick.addEventListener('click',()=>chooseTrack(i,true));
  const sound=document.createElement('select');sound.className='lane-sound';sound.id='laneSound'+i;sound.setAttribute('aria-label','Instrument for lane '+(i+1));
  for(const [key,label] of Object.entries(SOUNDS)){const opt=document.createElement('option');opt.value=key;opt.textContent=label;sound.append(opt)}
  sound.value=t.sound;sound.addEventListener('change',e=>{t.sound=e.target.value;if(audio)loadSamples(prioritySampleKeys());if(i===selectedTrack)renderReadout();markCustom()});
  const mute=document.createElement('button');mute.type='button';mute.className='lane-mute';mute.id='laneMute'+i;
  const updateMute=()=>{mute.title=t.muted?'Unmute':'Mute';mute.textContent=t.muted?'×':'♫';mute.setAttribute('aria-pressed',String(t.muted));mute.setAttribute('aria-label',(t.muted?'Unmute':'Mute')+' lane '+(i+1));row.classList.toggle('muted',t.muted)};
  updateMute();mute.addEventListener('click',()=>{t.muted=!t.muted;updateMute();markCustom()});
  head.append(pick,sound,mute);row.append(head);
  const fields=document.createElement('div');fields.className='lane-fields';
  for(const key of ['a','b','n']){
   const label=document.createElement('label');label.textContent=key==='n'?'n · degree':key==='a'?'a · real':'b · imag';
   const input=document.createElement('input');input.id='track'+key.toUpperCase()+i;input.type='number';input.inputMode=key==='n'?'numeric':'decimal';
   input.step=key==='n'?'1':'any';input.min=key==='n'?'1':'-10000';input.max=key==='n'?'24':'10000';input.value=String(t[key]);
   input.setAttribute('aria-label',`Lane ${i+1} ${key}`);
   input.addEventListener('input',()=>{
    const raw=input.value.trim(),v=Number(raw),valid=raw!==''&&Number.isFinite(v)&&(key==='n'?(Number.isInteger(v)&&v>=1&&v<=24):Math.abs(v)<=10000);
    input.setAttribute('aria-invalid',String(!valid));if(!valid)return;
    t[key]=v;updateLaneStatus(i);if(selectedTrack===i)renderReadout();markCustom()
   });
   input.addEventListener('change',()=>{if(input.getAttribute('aria-invalid')==='true'){input.value=String(t[key]);input.setAttribute('aria-invalid','false')}});
   label.append(input);fields.append(label);
  }
  row.append(fields);
  const foot=document.createElement('div');foot.className='lane-bottom';
  const eq=document.createElement('span');eq.className='lane-equation';eq.id='laneEq'+i;
  const count=document.createElement('span');count.className='lane-count';count.id='laneCount'+i;
  foot.append(eq,count);row.append(foot);wrap.append(row);updateLaneStatus(i);
 });
}
function updateLaneStatus(i) {
 const t=tracks[i];if(!t)return;
 const eq=$('laneEq'+i),count=$('laneCount'+i);
 if(eq)eq.textContent=`R${t.n}(${complexDisplay(t)})`+(t.layers.length?` ∪ ${t.layers.length} extra`:'');
 if(count)count.textContent=hitLabel(events(t).length);
}
function chooseTrack(i,fromTrackList=false) {
 selectedTrack=Math.max(0,Math.min(3,i));
 document.querySelectorAll('.lane').forEach((row,j)=>{
  row.classList.toggle('selected',j===selectedTrack);
  row.querySelector('.lane-select')?.setAttribute('aria-pressed',String(j===selectedTrack));
 });
 renderEditor();
 if(fromTrackList&&$('compositionPanel').open)$('compositionHeading').focus({preventScroll:true});
}
function renderEditor() {renderReadout();renderLayers()}
function renderReadout() {
 const t=tracks[selectedTrack];if(!t)return;
 const a=t.a===0&&t.b===0?null:Math.atan2(t.b,t.a)*180/Math.PI;
 const slider=$('argumentAngle');slider.disabled=a===null;slider.value=a===null?'0':String(Math.round(a));
 $('argumentText').textContent=a===null?'—':`${fmt(a)}°`;renderComposition();
}
function renderComposition() {
 const t=tracks[selectedTrack];if(!t)return;
 const c=composePhases(t),i=selectedTrack;
 $('compositionHeading').textContent=`Lane ${i+1} · ${SOUNDS[t.sound]}`;
 $('compositionEquation').textContent=`R${t.n}(z)`+(t.layers.length?` ∪ ${t.layers.map((l,j)=>`R${l.n}(w${j+1})`).join(' ∪ ')}`:'');
 $('compositionMetrics').textContent=`${c.merged.length} unique · ${t.layers.length} extra set${t.layers.length===1?'':'s'}`;
 $('baseCount').textContent=String(c.base.length);$('addedCount').textContent=String(c.added.length);$('unionCount').textContent=String(c.merged.length);
 $('overlapSummary').textContent=c.overlaps===0?'No coincident phases.':`${c.overlaps} shared phase${c.overlaps===1?'':'s'} — each sounds once.`;
 const plot=(target,values,mode)=>{
  target.replaceChildren();
  for(const item of values){
   const phase=typeof item==='number'?item:item.phase;
   const marker=document.createElement('span'),overlap=mode==='union'&&item.base&&item.added,added=mode==='added'||(mode==='union'&&item.added&&!item.base);
   marker.className='phase-mark '+(overlap?'overlap':added?'added':'base');
   marker.style.left=(2+phase*96)+'%';marker.style.borderColor=COLORS[i];
   if(!added&&!overlap)marker.style.backgroundColor=COLORS[i];
   if(overlap)marker.style.setProperty('--mark-color',COLORS[i]);
   marker.title=`${Math.round(phase*3600)/10}°${overlap?' (shared)':''}`;target.append(marker);
  }
 };
 plot($('baseStrip'),c.base,'base');plot($('addedStrip'),c.added,'added');plot($('unionStrip'),c.merged,'union');
}
function renderLayers(){const t=tracks[selectedTrack],wrap=$('extraLayers');wrap.replaceChildren();$('addLayer').disabled=t.layers.length>=5;
 t.layers.forEach((layer,i)=>{const group=document.createElement('div');group.className='layer-row';const heading=document.createElement('div');heading.className='layer-title';heading.textContent='Additional set '+(i+1)+' · w'+(i+1);group.append(heading);
  for(const key of ['a','b','n']){const item=document.createElement('div'),label=document.createElement('label'),input=document.createElement('input');label.textContent=key==='n'?'Root degree n':key;label.htmlFor=`layer${i}${key}`;input.id=label.htmlFor;input.type='number';input.step=key==='n'?'1':'any';input.value=key==='n'?layer[key]:Number(layer[key].toFixed(3));input.setAttribute('aria-label',`Extra root set ${i+1}: ${key}`);input.addEventListener('change',()=>{const raw=Number(input.value);if(!Number.isFinite(raw)||(key==='n'&&(!Number.isInteger(raw)||raw<1||raw>24))||(key!=='n'&&Math.abs(raw)>10000)){input.value=String(layer[key]);showToast('Invalid number or root degree');return}layer[key]=raw;renderTracks();renderReadout();markCustom()});item.append(label,input);group.append(item)}
  const remove=document.createElement('button');remove.type='button';remove.className='layer-remove';remove.textContent='×';remove.title='Remove this root set';remove.setAttribute('aria-label',`Remove extra root set ${i+1}`);remove.addEventListener('click',()=>{t.layers.splice(i,1);renderLayers();renderTracks();renderReadout();markCustom()});group.append(remove);
  const velocity=document.createElement('label');velocity.className='layer-velocity';velocity.textContent='Set volume';const volume=document.createElement('input');volume.type='range';volume.min='10';volume.max='100';volume.value=String(Math.round(layer.velocity*100));volume.setAttribute('aria-label',`Volume of extra root set ${i+1}`);volume.addEventListener('input',()=>{layer.velocity=Number(volume.value)/100;markCustom()});velocity.append(volume);group.append(velocity);wrap.append(group)
 })}

function markCustom(){if(activePresetId!==null){activePresetId=null;renderPresets()}}
function applyPreset(p){const phase=transportPhase(),oldCycle=cycleSeconds();const cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/oldCycle):0;
 tracks=p.tracks.map(cleanTrack);bpm=p.bpm;cycleBars=p.bars===2?2:1;activePresetId=p.id;activeCategory=p.category;$('bpm').value=String(bpm);$('bpmText').textContent=String(bpm);
 if(audio){loadSamples(prioritySampleKeys())}
 if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();scheduledUntil=audio.currentTime+.006}
 renderPresets();renderTracks();renderEditor()}
function showToast(msg){$('toast').textContent=msg;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),3300)}
      // Independently licensed samples, CC0. The brazil/jazz bank is acoustic, not a synth simulation.
      const SAMPLE_FILES={
        'kick':'samples/kick-deep.wav','kick-hard':'samples/kick-hard.wav','kick-tight':'samples/kick-tight.wav',
        'kick-sub':'samples/kick-sub.wav','kick-808':'samples/kick-808.wav',
        'snare':'samples/snare-snap.wav','snare-body':'samples/snare-body.wav','snare-808':'samples/snare-808.wav',
        'clap':'samples/clap.wav','hat':'samples/hat.wav','hat-crunch':'samples/hat-crunch.wav',
        'openhat':'samples/openhat.wav','rim':'samples/rim.wav','tom':'samples/tom.wav','shaker':'samples/shaker.wav',
        'jazzkick':'samples/jazz-kick-soft.flac','jazzkick-full':'samples/jazz-kick-full.flac',
        'crossstick':'samples/jazz-rim.flac','crossstick-alt':'samples/jazz-rim-bright.flac',
        'jazzshaker':'samples/jazz-shaker-a.wav','jazzshaker-alt':'samples/jazz-shaker-b.wav',
        'jazzhat':'samples/jazz-hat.flac','jazzsnare':'samples/jazz-snare.flac',
        'claves':'samples/jazz-claves.wav','bongo':'samples/jazz-bongo.wav','berlinrumble':'samples/berlin-rumble.wav','berlinrumble-alt':'samples/berlin-rumble-alt.wav'
      };
      function sampleKey(sound,index=0,velocity=1){
        if(sound==='berlinrumble')return index%2===0?'berlinrumble':'berlinrumble-alt';
        if(sound==='jazzkick')return velocity>.88?'jazzkick-full':'jazzkick';
        if(sound==='crossstick')return index%3===0?'crossstick-alt':'crossstick';
        if(sound==='jazzshaker')return index%2===0?'jazzshaker':'jazzshaker-alt';
        if(sound==='kick')return ({bunker:'kick-hard',dnb:'kick-tight',jungle:'kick-808',brazil:'kick-sub',hardhouse:'kick-hard',acid:'kick-hard'})[activeCategory]||'kick';
        if(sound==='snare')return activeCategory==='jungle'?'snare-808':activeCategory==='bunker'?'snare-body':'snare';
        if(sound==='hat')return activeCategory==='bunker'?'hat-crunch':'hat';
        return sound;
      }
      function prioritySampleKeys(){
        const keys=new Set();for(const t of tracks){if(t.muted)continue;
          keys.add(sampleKey(t.sound,0,1));
          if(t.sound==='jazzkick')keys.add('jazzkick');
          if(t.sound==='crossstick'){keys.add('crossstick');keys.add('crossstick-alt')}
          if(t.sound==='jazzshaker'){keys.add('jazzshaker');keys.add('jazzshaker-alt')}
          if(t.sound==='berlinrumble'){keys.add('berlinrumble');keys.add('berlinrumble-alt')}
        }
        if(['dnb','jungle'].includes(activeCategory)){
          if(tracks.some(t=>!t.muted&&t.sound==='kick'))keys.add('jazzkick-full');
          if(tracks.some(t=>!t.muted&&t.sound==='snare'))keys.add('jazzsnare');
        }
        return [...keys].filter(key=>SAMPLE_FILES[key]);
      }
      function loadSamples(keys=prioritySampleKeys()){
        if(!audio)return Promise.resolve(0);
        const jobs=keys.filter(k=>SAMPLE_FILES[k]).map(key=>{
          if(sampleBuffers.has(key))return Promise.resolve();
          if(!samplePromises.has(key))samplePromises.set(key,fetch(SAMPLE_FILES[key])
            .then(response=>{if(!response.ok)throw Error(`${response.status}: ${key}`);return response.arrayBuffer()})
            .then(data=>audio.decodeAudioData(data))
            .then(buffer=>sampleBuffers.set(key,buffer))
            .catch(err=>{console.warn('Sample unavailable; synthesizer fallback:',key,err.message)}));
          return samplePromises.get(key);
        });
        return Promise.allSettled(jobs).then(()=>{if(playing)updateTransportText();return sampleBuffers.size});
      }
      function triggerSample(key,at,gainValue,index=0){
        const buffer=sampleBuffers.get(key);if(!buffer)return false;
        const source=audio.createBufferSource();source.buffer=buffer;
        // Repetition variation is deliberately small; no timing jitter, roots stay exact.
        source.playbackRate.value=1+([0,-.012,.009,-.007,.004][index%5]);
        const gain=audio.createGain();gain.gain.value=Math.max(.001,gainValue);
        source.connect(gain);gain.connect(voiceBus||master);
        if(key==='berlinrumble'||key==='berlinrumble-alt'){
          // A harmonically distorted mid-bass parallel path makes 46 Hz sub audible
          // on phone speakers, without sacrificing the unprocessed fundamental.
          const curve=new Float32Array(1024);
          for(let i=0;i<curve.length;i++){
            const x=(2*i/(curve.length-1))-1;
            curve[i]=Math.tanh(7*x)/Math.tanh(7);
          }
          const saturation=audio.createWaveShaper();saturation.curve=curve;saturation.oversample='2x';
          const presenceFilter=audio.createBiquadFilter();presenceFilter.type='bandpass';
          presenceFilter.frequency.value=260;presenceFilter.Q.value=.65;
          const presenceGain=audio.createGain();presenceGain.gain.value=.24*gainValue;
          source.connect(saturation);saturation.connect(presenceFilter);
          presenceFilter.connect(presenceGain);presenceGain.connect(voiceBus||master);
        }
        source.start(Math.max(at,audio.currentTime+.002));return true;
      }
      function playSample(sound,at,velocity,index=0){
        const key=sampleKey(sound,index,velocity);
        const gainTable={kick:.51,snare:.45,clap:.36,hat:.18,openhat:.19,rim:.34,tom:.33,shaker:.21,
           jazzkick:.22,crossstick:.34,jazzshaker:.15,jazzhat:.14,jazzsnare:.28,claves:.26,bongo:.25,berlinrumble:.63};
        const style=activeCategory==='brazil'?.83:1;
        const played=triggerSample(key,at,(gainTable[sound]||.32)*velocity*style,index);
        // A restrained acoustic body layer gives fast breakbeats less plastic transients.
        if(played&&['dnb','jungle'].includes(activeCategory)){
          if(sound==='snare'&&sampleBuffers.has('jazzsnare'))triggerSample('jazzsnare',at,.095*velocity,index);
          if(sound==='kick'&&sampleBuffers.has('jazzkick-full'))triggerSample('jazzkick-full',at,.09*velocity,index);
        }
        return played;
      }
      function initAudio() {
        if (audio) return true;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { showToast('This browser does not support Web Audio.'); return false; }
        audio = new AC();
        master = audio.createGain(); master.gain.value = volume * .80;
        compressor = audio.createDynamicsCompressor();
        compressor.threshold.value = -15; compressor.knee.value = 12; compressor.ratio.value = 4;
        compressor.attack.value = .003; compressor.release.value = .18;
        master.connect(compressor); compressor.connect(audio.destination);
        const frames = Math.floor(audio.sampleRate * 1.0);
        noiseBuffer = audio.createBuffer(1, frames, audio.sampleRate);
        const samples = noiseBuffer.getChannelData(0);
        for (let i=0; i<frames; i++) samples[i] = Math.random()*2 - 1;
        return true;
      }
      function envelope(gain, time, peak, release, attack=.002) {
        const g = gain.gain;
        g.setValueAtTime(0.0001,time);
        g.exponentialRampToValueAtTime(Math.max(.0002,peak),time+attack);
        g.exponentialRampToValueAtTime(.0001,time+Math.max(release,attack+.01));
      }
      function oscillator(freq, finalFreq, type, gainValue, at, length) {
        const osc=audio.createOscillator(); osc.type=type;
        osc.frequency.setValueAtTime(freq,at);
        if (finalFreq !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(1,finalFreq),at+length);
        const gain=audio.createGain(); envelope(gain,at,gainValue,length);
        osc.connect(gain); gain.connect(perHitBus || voiceBus || master); osc.start(at); osc.stop(at+length+.025);
      }
      function noise(at, length, peak, cutoff=2000, type='highpass') {
        const source=audio.createBufferSource(); source.buffer=noiseBuffer;
        // Random offsets avoid identical noise textures.
        const filter=audio.createBiquadFilter(); filter.type=type; filter.frequency.value=cutoff;
        const gain=audio.createGain(); envelope(gain,at,peak,length);
        source.connect(filter); filter.connect(gain); gain.connect(perHitBus || voiceBus || master);
        source.start(at,Math.random()*.45); source.stop(at+length+.03);
      }
      function hit(sound, at, velocity=1, index=0) {
        // Real recorded/rended one-shots first; use local synthesis when unavailable.
        const t=Math.max(at,audio.currentTime+.002);
        if(playSample(sound,t,velocity,index))return;
        perHitBus=audio.createGain();perHitBus.gain.value=Math.max(.1,Math.min(1,velocity));perHitBus.connect(voiceBus||master);
        const soundFallback={jazzkick:'kick',crossstick:'rim',jazzshaker:'shaker',jazzhat:'hat',jazzsnare:'snare',claves:'rim',bongo:'tom'};
        switch(soundFallback[sound]||sound) {
          case 'kick':
            oscillator(150,44,'sine',1.0,t,.29);
            noise(t,.026,.10,1400,'lowpass');
            break;
          case 'snare':
            noise(t,.17,.35,1450,'highpass');
            oscillator(180,120,'triangle',.15,t,.11);
            break;
          case 'clap':
            noise(t,.05,.23,1050,'highpass'); noise(t+.025,.09,.21,1100,'highpass'); noise(t+.055,.18,.18,900,'highpass');
            break;
          case 'hat':
            noise(t,.07,.13,5900,'highpass'); break;
          case 'openhat':
            noise(t,.37,.115,4900,'highpass'); break;
          case 'rim':
            oscillator(800,570,'square',.072,t,.034); noise(t,.025,.13,2600,'highpass'); break;
          case 'tom':
            oscillator(215,94,'sine',.39,t,.27); break;
          case 'bass':
            oscillator(80,54,'triangle',.55,t,.36); oscillator(80,54,'sine',.21,t,.38); break;
          case 'shaker':
            noise(t,.11,.084,3400,'highpass'); break;
          case 'berlinrumble': {
            // Synth fallback when the custom recorded-quality rumble samples cannot be loaded.
            const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(720,t);filter.frequency.exponentialRampToValueAtTime(195,t+.38);
            const amp=audio.createGain();envelope(amp,t,.53,.39,.012);filter.connect(amp);amp.connect(perHitBus||voiceBus||master);
            for(const [freq,type,level] of [[46.25,'sine',.85],[92.5,'triangle',.12],[138.75,'sine',.10]]){
              const osc=audio.createOscillator();osc.type=type;osc.frequency.setValueAtTime(freq*1.045,t);osc.frequency.exponentialRampToValueAtTime(freq,t+.09);
              const g=audio.createGain();g.gain.value=level;osc.connect(g);g.connect(filter);osc.start(t);osc.stop(t+.43);
            }
            break;
          }
          case 'reese': {
            const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(1100,t);filter.frequency.exponentialRampToValueAtTime(280,t+.3);filter.Q.value=1.1;
            const amp=audio.createGain();envelope(amp,t,.24,.36,.008);filter.connect(amp);amp.connect(perHitBus||voiceBus||master);
            for(const detune of [-9,9]){const osc=audio.createOscillator();osc.type='sawtooth';osc.frequency.setValueAtTime(53,t);osc.detune.value=detune;osc.connect(filter);osc.start(t);osc.stop(t+.39)}
            break;
          }
          case 'acid': {
            const filter=audio.createBiquadFilter();filter.type='lowpass';filter.Q.value=11;
            filter.frequency.setValueAtTime(2800,t);filter.frequency.exponentialRampToValueAtTime(210,t+.20);
            const amp=audio.createGain();envelope(amp,t,.15,.26,.003);filter.connect(amp);amp.connect(perHitBus||voiceBus||master);
            const osc=audio.createOscillator();osc.type='sawtooth';osc.frequency.setValueAtTime([82.41,98.00,110,123.47,146.83,164.81][index%6],t);osc.connect(filter);osc.start(t);osc.stop(t+.28);break;
          }
          case 'surdo':
            oscillator(114,58,'sine',.69,t,.38);noise(t,.018,.07,600,'lowpass');break;
          case 'agogo':
            oscillator(770,700,'sine',.20,t,.17);oscillator(1155,1010,'sine',.13,t,.12);break;
          case 'tamborim':
            oscillator(315,240,'triangle',.12,t,.065);noise(t,.06,.24,2200,'highpass');break;
        }
        perHitBus=null;
      }

function barSeconds(){return 240/bpm}
function cycleSeconds(){return barSeconds()*cycleBars}
function transportPhase(){if(!playing||!audio)return pausedPhase;return ((Math.max(0,audio.currentTime-beatEpoch)/cycleSeconds())%1+1)%1}
function cancelVoices(){if(voiceBus&&audio){try{voiceBus.gain.setValueAtTime(0,audio.currentTime);voiceBus.disconnect()}catch(_){}}voiceBus=audio?audio.createGain():null;if(voiceBus)voiceBus.connect(master)}
function scheduleAhead(){if(!playing||!audio||audio.state!=='running')return;const now=audio.currentTime,from=Math.max(scheduledUntil,now+.001),to=now+.09;if(to<=from)return;
 const duration=cycleSeconds(),kStart=Math.floor((from-beatEpoch)/duration)-1,kEnd=Math.ceil((to-beatEpoch)/duration)+1;
 for(let i=0;i<4;i++){const tr=tracks[i];if(tr.muted)continue;const phases=events(tr);for(let k=kStart;k<=kEnd;k++){if(k<0)continue;for(const [j,event] of phases.entries()){const t=beatEpoch+(k+event.phase)*duration;if(t>=from&&t<to)hit(tr.sound,t,event.velocity,k*phases.length+j)}}}scheduledUntil=to}
function updateTransportText(){const button=$('playBtn');button.textContent=playing?'Ⅱ Pause':'▶ Play';button.setAttribute('aria-pressed',String(playing));const ready=prioritySampleKeys().filter(k=>sampleBuffers.has(k)).length;const all=prioritySampleKeys().length;$('audioState').textContent=playing?(`Playing · samples ${ready}/${all}`):'Ready to play'}
async function togglePlay(){if(playing){pausedPhase=transportPhase();playing=false;clearInterval(timerId);timerId=null;cancelVoices();if(audio)await audio.suspend();updateTransportText();return}
 if(!initAudio())return;try{await audio.resume()}catch(err){showToast('Audio could not start: '+err.message);return}
 const ready=prioritySampleKeys();if(ready.length){$('audioState').textContent='Loading sounds…';await Promise.race([loadSamples(ready),new Promise(resolve=>setTimeout(resolve,2800))]);}
 cancelVoices();beatEpoch=audio.currentTime+.055-pausedPhase*cycleSeconds();scheduledUntil=audio.currentTime;playing=true;updateTransportText();scheduleAhead();timerId=setInterval(scheduleAhead,25)}
function reset(){pausedPhase=0;cycles=1;if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime+.06;scheduledUntil=audio.currentTime}}
async function previewSound(){if(!initAudio())return;try{await audio.resume();const t=tracks[selectedTrack];await Promise.race([loadSamples([sampleKey(t.sound),...(t.sound==='jazzshaker'?['jazzshaker-alt']:[])]),new Promise(resolve=>setTimeout(resolve,1600))]);hit(t.sound,audio.currentTime+.014)}catch(err){showToast('Preview failed: '+err.message)}}
function resizeCanvas(){const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;cvWidth=width;cvHeight=height;pixelRatio=Math.min(2.5,devicePixelRatio||1);
 canvas.width=Math.max(1,Math.round(width*pixelRatio));canvas.height=Math.max(1,Math.round(height*pixelRatio));ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0)}
function rgba(i,alpha){const c=RGB[i];return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`}
function getRadii(side){const outer=side*.427;return [outer,outer*.78,outer*.56,outer*.34]}
function draw() {
 const w=cvWidth,h=cvHeight;if(w<2||h<2){requestAnimationFrame(draw);return}
 ctx.clearRect(0,0,w,h);
 const dark=theme==='dark',side=Math.min(w,h),cx=w/2,cy=h/2,radii=getRadii(side),outer=radii[0],phase=transportPhase(),duration=cycleSeconds();
 ctx.fillStyle=dark?'#20221d':'#faf8f3';ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(cx,cy);ctx.textAlign='center';ctx.textBaseline='middle';
 const guide=dark?'#4d5046':'#d8d5cd',baseInk=dark?'#dcded3':'#55584f';
 for(let q=0;q<16;q++){
  const a=-Math.PI/2+TAU*q/16;
  ctx.beginPath();ctx.moveTo(Math.cos(a)*(outer+6),Math.sin(a)*(outer+6));
  ctx.lineTo(Math.cos(a)*(outer+(q%4===0?15:10)),Math.sin(a)*(outer+(q%4===0?15:10)));
  ctx.strokeStyle=guide;ctx.lineWidth=q%4===0?1.35:.7;ctx.stroke();
 }
 ctx.fillStyle=baseInk;ctx.font=`${Math.max(10,Math.min(12,side*.021))}px system-ui`;
 for(const [p,label] of [[0,'0'],[.25,'¼'],[.5,'½'],[.75,'¾']]){
  const a=-Math.PI/2+TAU*p;ctx.fillText(label,Math.cos(a)*(outer+25),Math.sin(a)*(outer+25));
 }
 tracks.forEach((t,i)=>{
  const r=radii[i],chosen=i===selectedTrack;
  ctx.beginPath();ctx.arc(0,0,r,0,TAU);
  ctx.strokeStyle=chosen?COLORS[i]:(dark?'#63675e':'#c4c5bc');ctx.lineWidth=chosen?2:1.2;ctx.stroke();
 });
 const angle=-Math.PI/2+TAU*(reducedMotion?Math.floor(phase*16)/16:phase);
 ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(angle)*outer,Math.sin(angle)*outer);
 ctx.strokeStyle=playing?(dark?'#c4c9ba':'#676d62'):(dark?'#5a5e54':'#cfcec5');ctx.lineWidth=1.3;ctx.stroke();
 if(rootDrag&&rootDrag.moved){
  const i=rootDrag.track,r=radii[i],arg=rootDrag.startArg,n=rootDrag.n;
  ctx.save();ctx.setLineDash([2,4]);ctx.strokeStyle=COLORS[i];
  for(let k=0;k<n;k++){const a=-Math.PI/2+(arg+TAU*k)/n;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,TAU);ctx.stroke()}
  ctx.restore();
 }
 tracks.forEach((t,i)=>{
  const r=radii[i],c=composePhases(t),spacing=c.merged.length?TAU*r/c.merged.length:40;
  const size=Math.min(i===selectedTrack?7:6,Math.max(2.6,spacing*.26));
  for(const mark of c.merged){
   const a=-Math.PI/2+TAU*mark.phase,x=Math.cos(a)*r,y=Math.sin(a)*r;
   const proximity=((phase-mark.phase)%1+1)%1*duration;
   const pulse=playing&&!t.muted&&proximity<.16&&!reducedMotion?2.2*Math.pow(1-proximity/.16,2):0;
   const radius=size+pulse;
   ctx.beginPath();ctx.arc(x,y,mark.base&&mark.added?radius+2.1:radius,0,TAU);
   ctx.fillStyle=mark.added&&!mark.base?(dark?'#20221d':'#faf8f3'):COLORS[i];
   ctx.fill();ctx.lineWidth=mark.base&&mark.added?2.6:1.6;ctx.strokeStyle=COLORS[i];ctx.stroke();
   if(mark.base&&mark.added){ctx.beginPath();ctx.arc(x,y,Math.max(1.5,radius*.4),0,TAU);ctx.fillStyle=dark?'#20221d':'#faf8f3';ctx.fill()}
   if(t.muted){ctx.beginPath();ctx.arc(x,y,radius+1.3,0,TAU);ctx.strokeStyle=dark?'#555951':'#b5b5ab';ctx.lineWidth=2;ctx.stroke()}
  }
 });
 const count=events(tracks[selectedTrack]).length;
 ctx.font=`650 ${Math.max(14,Math.min(24,side*.044))}px system-ui`;ctx.fillStyle=baseInk;ctx.fillText(String(count),0,-3);
 ctx.font=`${Math.max(9,Math.min(11,side*.018))}px system-ui`;ctx.fillText('events',0,16);
 ctx.restore();
 if(playing&&audio){const elapsed=Math.max(0,audio.currentTime-beatEpoch);cycles=Math.floor(elapsed/duration)+1}
 const label=cycleBars===2?`Cycle ${Math.max(1,cycles)} · 2 bars`:`Bar ${Math.max(1,cycles)} · 4/4`;
 if(label!==lastCycleText){$('timeDisplay').textContent=label;lastCycleText=label}
 requestAnimationFrame(draw);
}
function saveJson(){const data={format:'roots-rhythm/1',name:activePresetId?PRESETS.find(p=>p.id===activePresetId)?.name:'My complex rhythm',bpm,bars:cycleBars,tracks};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='complex-rhythm.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function loadJson(file){try{if(file.size>100000)throw Error('File is too large');const d=JSON.parse(await file.text());if(d?.format!=='roots-rhythm/1'||!Array.isArray(d.tracks)||d.tracks.length!==4)throw Error('Expected roots-rhythm/1 with four tracks');
 if(d.tracks.some(t=>!t||typeof t!=='object'||!Number.isFinite(Number(t.a))||!Number.isFinite(Number(t.b))||Math.abs(Number(t.a))>10000||Math.abs(Number(t.b))>10000||!Number.isInteger(Number(t.n))||Number(t.n)<1||Number(t.n)>24||!Object.hasOwn(SOUNDS,t.sound)||t.layers!==undefined&&(!Array.isArray(t.layers)||t.layers.length>5||t.layers.some(l=>!l||!Number.isFinite(Number(l.a))||!Number.isFinite(Number(l.b))||Math.abs(Number(l.a))>10000||Math.abs(Number(l.b))>10000||!Number.isInteger(Number(l.n))||Number(l.n)<1||Number(l.n)>24||!Number.isFinite(Number(l.velocity))||Number(l.velocity)<.1||Number(l.velocity)>1))))throw Error('Check a, b, n and sound for every track');
 const phase=transportPhase(),oldCycle=cycleSeconds(),cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/oldCycle):0;tracks=d.tracks.map(cleanTrack);bpm=safeInt(d.bpm,50,200,138);cycleBars=d.bars===2?2:1;if(audio)loadSamples(prioritySampleKeys());$('bpm').value=String(bpm);$('bpmText').textContent=String(bpm);if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();scheduledUntil=audio.currentTime+.008}
 activePresetId=null;renderPresets();renderTracks();renderEditor();showToast('Imported rhythm: '+(typeof d.name==='string'?d.name.slice(0,45):file.name))}catch(e){showToast('Import failed: '+e.message)}}
function setupEvents() {
 $('categorySelect').addEventListener('change',e=>{activeCategory=e.target.value;const first=PRESETS.find(p=>p.category===activeCategory);if(first)applyPreset(first)});
 $('presetSelect').addEventListener('change',e=>{const p=PRESETS.find(p=>p.id===e.target.value);if(p)applyPreset(p)});
 $('playBtn').addEventListener('click',togglePlay);
 $('resetBtn').addEventListener('click',reset);
 $('previewBtn').addEventListener('click',previewSound);
 $('argumentAngle').addEventListener('input',e=>{
  const t=tracks[selectedTrack];if(!applyRotation(t,Number(e.target.value)*Math.PI/180))return;
  $('trackA'+selectedTrack).value=String(Number(t.a.toFixed(4)));$('trackB'+selectedTrack).value=String(Number(t.b.toFixed(4)));
  updateLaneStatus(selectedTrack);renderReadout();markCustom();
 });
 $('bpm').addEventListener('input',e=>{
  const phase=transportPhase(),cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/cycleSeconds()):0;
  bpm=Number(e.target.value);$('bpmText').textContent=String(bpm);
  if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();scheduledUntil=audio.currentTime+.008}
  markCustom();
 });
 $('volume').addEventListener('input',e=>{volume=Number(e.target.value)/100;$('volumeText').textContent=e.target.value+'%';if(master&&audio)master.gain.setTargetAtTime(volume*.8,audio.currentTime,.014)});
 $('addLayer').addEventListener('click',()=>{
  const t=tracks[selectedTrack];if(t.layers.length>=5)return;
  t.layers.push({a:1,b:0,n:3,velocity:.65});
  renderLayers();updateLaneStatus(selectedTrack);renderReadout();markCustom();
 });
 $('saveBtn').addEventListener('click',()=>{saveJson();$('fileMenu').open=false});
 $('loadBtn').addEventListener('click',()=>{$('fileMenu').open=false;$('jsonFile').click()});
 $('jsonFile').addEventListener('change',e=>{if(e.target.files?.[0])loadJson(e.target.files[0]);e.target.value=''});
 $('themeBtn').addEventListener('click',()=>setTheme(theme==='light'?'dark':'light',true));
 function canvasPoint(e){const b=canvas.getBoundingClientRect();return{x:e.clientX-b.left-b.width/2,y:e.clientY-b.top-b.height/2,side:Math.min(b.width,b.height)}}
 function wrapAngle(x){return Math.atan2(Math.sin(x),Math.cos(x))}
 function onRootDot(p,t,r){return t.a===0&&t.b===0?false:rootPhases(t).some(ph=>{const a=-Math.PI/2+TAU*ph;return Math.hypot(p.x-Math.cos(a)*r,p.y-Math.sin(a)*r)<=Math.max(15,p.side*.025)})}
 canvas.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  const p=canvasPoint(e),dist=Math.hypot(p.x,p.y);
  const near=getRadii(p.side).map((r,i)=>({r,i,gap:Math.abs(r-dist)})).sort((a,b)=>a.gap-b.gap)[0];
  if(near.gap>Math.max(15,p.side*.06))return;
  chooseTrack(near.i);const t=tracks[near.i];if(!onRootDot(p,t,near.r))return;
  rootDrag={id:e.pointerId,track:near.i,n:t.n,startArg:Math.atan2(t.b,t.a),startPointer:Math.atan2(p.y,p.x),moved:false};
  canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(!rootDrag||rootDrag.id!==e.pointerId)return;
  const p=canvasPoint(e),delta=wrapAngle(Math.atan2(p.y,p.x)-rootDrag.startPointer);
  if(!rootDrag.moved&&Math.abs(delta)<.004)return;
  rootDrag.moved=true;const t=tracks[rootDrag.track];
  applyRotation(t,rootDrag.startArg+t.n*delta);
  $('trackA'+rootDrag.track).value=String(Number(t.a.toFixed(4)));$('trackB'+rootDrag.track).value=String(Number(t.b.toFixed(4)));
  updateLaneStatus(rootDrag.track);renderReadout();markCustom();canvas.classList.add('is-dragging');
 });
 function finishDrag(e){if(!rootDrag||rootDrag.id!==e.pointerId)return;rootDrag=null;canvas.classList.remove('is-dragging')}
 canvas.addEventListener('pointerup',finishDrag);canvas.addEventListener('pointercancel',finishDrag);canvas.addEventListener('lostpointercapture',finishDrag);
 canvas.addEventListener('keydown',e=>{
  if(e.shiftKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){
   e.preventDefault();const t=tracks[selectedTrack];
   if(applyRotation(t,Math.atan2(t.b,t.a)+(e.key==='ArrowRight'?1:-1)*t.n*5*Math.PI/180)){
    $('trackA'+selectedTrack).value=String(Number(t.a.toFixed(4)));$('trackB'+selectedTrack).value=String(Number(t.b.toFixed(4)));updateLaneStatus(selectedTrack);renderReadout();markCustom()
   }
   return;
  }
  if(['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();chooseTrack((selectedTrack+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:3))%4)}
  else if(e.key==='Enter'){e.preventDefault();previewSound()}
 });
 document.addEventListener('keydown',e=>{const tag=e.target?.tagName;if(e.code==='Space'&&!['INPUT','SELECT','BUTTON','TEXTAREA','SUMMARY'].includes(tag)&&e.target!==canvas){e.preventDefault();togglePlay()}});
 document.addEventListener('pointerdown',e=>{const m=$('fileMenu');if(m.open&&!m.contains(e.target))m.open=false});
 if(window.ResizeObserver)new ResizeObserver(resizeCanvas).observe($('plotArea'));else window.addEventListener('resize',resizeCanvas);
}
function setTheme(next,save=false) {
 theme=next==='dark'?'dark':'light';
 document.documentElement.dataset.theme=theme;
 document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#181916':'#f2efe8';
 COLORS=theme==='dark'?['#df9883','#98b39a','#d5b16e','#bda0ca']:['#ab5847','#567a63','#967438','#80618a'];
 RGB=theme==='dark'?[[223,152,131],[152,179,154],[213,177,110],[189,160,202]]:[[171,88,71],[86,122,99],[150,116,56],[128,97,138]];
 $('themeBtn').textContent=theme==='dark'?'Light mode':'Dark mode';
 $('themeBtn').setAttribute('aria-pressed',String(theme==='dark'));
 if(save)try{localStorage.setItem('roots-rhythm-theme',theme)}catch(_){}
 if(tracks.length){renderTracks();renderEditor()}
}
let savedTheme='light';
try{savedTheme=localStorage.getItem('roots-rhythm-theme')||'light'}catch(_){}
setupEvents();applyPreset(PRESETS.find(p=>p.id==='afro')||PRESETS[0]);setTheme(savedTheme);
resizeCanvas();requestAnimationFrame(draw);
})();
