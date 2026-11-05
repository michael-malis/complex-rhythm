'use strict';
(() => {
const TAU=2*Math.PI;
let COLORS=['#ab5847','#567a63','#967438','#80618a'];
let RGB=[[171,88,71],[86,122,99],[150,116,56],[128,97,138]];
let theme='light';
const SOUNDS={kick:'Kick',snare:'Snare',clap:'Clap',hat:'Closed hat',openhat:'Open hat',rim:'Rim click',tom:'Tom',bass:'Sub bass',shaker:'Shaker',reese:'Reese bass',acid:'Acid synth',surdo:'Surdo',agogo:'Agogô',tamborim:'Tamborim',jazzkick:'Soft acoustic kick',crossstick:'Jazz cross-stick',jazzshaker:'Natural shaker',jazzhat:'Jazz hi-hat',jazzsnare:'Acoustic snare',claves:'Wooden claves',bongo:'Natural bongo',berlinrumble:'Berlin sub-rumble',technoKick:'Techno kick',hardcoreKick:'Distorted hardcore kick',gabberKick:'Gabber kick',frenchcoreKick:'Frenchcore pitched kick',metallic:'Industrial metallic percussion',fmPerc:'FM percussion',noiseBurst:'Noise burst',hoover:'Hoover bass',raveStab:'Rave stab',acidClassic:'Classic 303 Acid',acidHard:'Hard Acid',acidScreaming:'Screaming Acid',acidDark:'Dark Acid',acidIndustrial:'Industrial Acid',acidPsychedelic:'Psychedelic Acid'};
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
 {id:'ragga-spiral',category:'jungle',name:'Ragga · Break Step',bpm:164,tracks:[P(1,0,1,'kick',[L(5,.75),L(10,.85)]),P(-1,0,2,'snare',[L(9,.31),L(15,.38)]),P(1,0,8,'hat',[L(5,.35),L(11,.42)]),P(1,0,2,'reese')]},
 {id:'break-torrent',category:'jungle',name:'Break Torrent · Chops',bpm:169,tracks:[P(1,0,1,'kick',[L(3,.55),L(10,.9),L(14,.48)]),P(-1,0,2,'snare',[L(6,.31),L(15,.29)]),P(1,0,8,'shaker',[L(7,.38),L(15,.42)]),P(1,0,2,'bass')]},
 {id:'ghostline',category:'jungle',name:'Ghostline · Half-roll',bpm:160,tracks:[P(1,0,1,'kick',[L(10,.84)]),P(-1,0,2,'snare',[L(3,.25),L(7,.3)]),P(1,0,8,'hat'),P(1,0,1,'bass',[L(11,.63)])]},
 {id:'chopped-orbit',category:'jungle',name:'Chopped Orbit · Fast',bpm:172,tracks:[P(1,0,1,'kick',[L(2,.5),L(10,.92)]),P(-1,0,2,'snare',[L(6,.34),L(15,.28)]),P(1,0,8,'hat',[L(1,.48),L(9,.48)]),P(1,0,2,'reese')]},
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
 {id:'warehouse-hammer',category:'hardhouse',name:'Warehouse · Hard Drive',bpm:146,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'openhat'),P(-1,0,4,'bass',[L(13,.57)])]},
 {id:'steel-rave',category:'hardhouse',name:'Steel Rave · Stabs',bpm:152,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(11,.59)])]},
 {id:'stomp-circuit',category:'hardhouse',name:'Stomp Circuit · Push',bpm:148,tracks:[P(1,0,4,'kick',[L(14,.52)]),P(-1,0,2,'clap'),P(-1,0,4,'openhat'),P(1,0,2,'bass',[L(11,.63)])]},
 {id:'peak-pressure',category:'hardhouse',name:'Peak Pressure · Rave',bpm:156,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(3,.6),L(11,.6)])]},
// Acid: regular house foundation with syncopated, resonant bass stabs.
 {id:'acid-303',category:'acid',name:'Acid 303 · Classic',bpm:128,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'hat'),P(-1,0,4,'acid',[L(3,.65),L(11,.66)])]},
 {id:'resonance-rush',category:'acid',name:'Resonance · Twister',bpm:134,tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(7,.55),L(15,.55)])]},
 {id:'liquid-corrosion',category:'acid',name:'Liquid · Acid Dub',bpm:124,tracks:[P(1,0,4,'kick'),P(-1,0,2,'rim'),P(-1,0,4,'openhat'),P(1,0,2,'acid',[L(3,.62),L(11,.57)])]},
 {id:'303-pressure',category:'acid',name:'303 Pressure · Peak',bpm:140,tracks:[P(1,0,4,'kick'),P(-1,0,2,'snare'),P(1,0,8,'hat'),P(-1,0,4,'acid',[L(1,.56),L(9,.58)])]}
];
// Research-informed experimental studies. Original 35 records remain unmodified.
// Each n-th-root set is still exactly uniform; the combined ensemble is not a single arbitrary root set.
const EXPERIMENTAL_STUDIES=[{"id":"industrial-fracture","name":"Industrial Fracture","bpm":155,"degrees":[5,7,9,11],"sounds":["hardcoreKick","metallic","hat","reese"],"offs":[0,0.02857142857142857,0.044444444444444446,0.05194805194805195],"category":"experimental","character":"Dry broken-pressure impacts against metal clicks and a slow detuned bass contour.","mathNote":"Independent 5:7:9:11 grids; phase shifts separate the downbeats.","acc":[0.75,0.5,0.24,0.28]},{"id":"acid-reactor","name":"Acid Reactor","bpm":148,"degrees":[3,5,7,11],"sounds":["technoKick","acidHard","metallic","hat"],"offs":[0,0.06666666666666667,0.08571428571428572,0.05194805194805195],"category":"experimental","character":"Three anchor kicks, agitated hard-acid response and scattered metallic shrapnel.","mathNote":"Relatively prime 3:5:7:11 periodicities with displaced phases.","acc":[0.82,0.45,0.29,0.2]},{"id":"rotterdam-collision","name":"Rotterdam Collision","bpm":180,"degrees":[4,7,11,3],"sounds":["gabberKick","metallic","noiseBurst","hoover"],"offs":[0,0.03571428571428571,0.045454545454545456,0.1111111111111111],"category":"hardcore","character":"Four relentless gabber pulses clash with seven metallic spikes and eleven noisy accents.","mathNote":"4:7:11:3 exact-root collision study, with offset root families.","acc":[0.62,0.26,0.19,0.2]},{"id":"schranz-machinery","name":"Schranz Machinery","bpm":158,"degrees":[7,9,11,13],"sounds":["hardcoreKick","metallic","fmPerc","acidIndustrial"],"offs":[0,0.031746031746031744,0.01818181818181818,0.03296703296703297],"category":"hardcore","character":"Mechanistic distorted kick punctuated by inharmonic percussive metallic events.","mathNote":"Odd-meter 7:9:11:13 layers, with substantial drift between collisions.","acc":[0.42,0.22,0.2,0.16]},{"id":"broken-reactor","name":"Broken Reactor","bpm":172,"degrees":[5,11,7,13],"sounds":["technoKick","snare","noiseBurst","acidScreaming"],"offs":[0.04,0.03636363636363636,0.047619047619047616,0.02197802197802198],"category":"experimental","character":"Five-beat broken low-end structure under thin snare splinters and screaming acid.","mathNote":"Five against eleven against seven against thirteen, with asymmetrical offsets.","acc":[0.65,0.31,0.18,0.15]},{"id":"frenchcore-spiral","name":"Frenchcore Spiral","bpm":205,"degrees":[4,7,5,11],"sounds":["frenchcoreKick","acidHard","metallic","hat"],"offs":[0,0.03571428571428571,0.05,0.03636363636363636],"category":"hardcore","character":"Pitched frenchcore kick with seven hard-acid notes and metallic syncopation.","mathNote":"4:7:5:11 with pitched root families and near-aligned source cycles.","acc":[0.58,0.27,0.3,0.15]},{"id":"acid-singularity","name":"Acid Singularity","bpm":162,"degrees":[7,11,13,5],"sounds":["technoKick","acidPsychedelic","fmPerc","acidDark"],"offs":[0.02857142857142857,0.025974025974025976,0.03296703296703297,0.04],"category":"experimental","character":"Narrow techno foundation against two contrasting resonant acid patches.","mathNote":"Prime periods 7:11:13:5 with separately shifted arguments.","acc":[0.44,0.22,0.17,0.23]},{"id":"prime-number-riot","name":"Prime Number Riot","bpm":175,"degrees":[3,5,7,11],"sounds":["gabberKick","metallic","raveStab","acidClassic"],"offs":[0,0.06666666666666667,0.05714285714285714,0.012987012987012988],"category":"experimental","character":"Three robust gabber accents chase five metal beats and a terse melodic rave stab.","mathNote":"3:5:7:11 — all prime root degrees, unlike the related Acid Reactor arrangement.","acc":[0.7,0.35,0.26,0.19]},{"id":"eleven-against-seven","name":"Eleven Against Seven","bpm":146,"degrees":[7,11,5,13],"sounds":["hardcoreKick","fmPerc","hat","acidIndustrial"],"offs":[0,0.03896103896103896,0.04,0.04395604395604396],"category":"experimental","character":"Sparse heavy low-frequency events and rapidly shifting light FM patterns.","mathNote":"Seven against eleven is the foreground relation; five and thirteen form a subdued counter-layer.","acc":[0.42,0.25,0.2,0.16]},{"id":"mechanical-paradox","name":"Mechanical Paradox","bpm":168,"degrees":[9,13,7,11],"sounds":["technoKick","metallic","raveStab","noiseBurst"],"offs":[0.037037037037037035,0.02197802197802198,0.047619047619047616,0.04132231404958678],"category":"experimental","character":"Rotating machinery pulses and destabilized metallic accents.","mathNote":"9:13:7:11, with nonzero phases to avoid universal downbeat collisions.","acc":[0.48,0.23,0.18,0.14]},{"id":"terror-geometry","name":"Terror Geometry","bpm":220,"degrees":[5,7,9,13],"sounds":["gabberKick","noiseBurst","acidScreaming","metallic"],"offs":[0,0.02857142857142857,0.044444444444444446,0.02197802197802198],"category":"hardcore","character":"Fast low-end impacts and densely shifting high-frequency shards, peak-controlled.","mathNote":"5:7:9:13 against a shared cyclic reference.","acc":[0.55,0.23,0.13,0.11]},{"id":"complex-roots-overload","name":"Complex Roots Overload","bpm":186,"degrees":[7,11,13,17],"sounds":["hardcoreKick","fmPerc","hoover","metallic"],"offs":[0.02040816326530612,0.01652892561983471,0.01775147928994083,0.01730103806228374],"category":"experimental","character":"Intentionally dense prime-degree texture, with reduced per-lane gain for clarity.","mathNote":"7:11:13:17 – four individually uniform but collectively intricate time sets.","acc":[0.34,0.18,0.14,0.13]},{"id":"hardtek-mobius","name":"Hardtek Möbius","bpm":178,"degrees":[5,7,9,4],"sounds":["frenchcoreKick","raveStab","fmPerc","acidHard"],"offs":[0,0.02857142857142857,0.037037037037037035,0.0625],"category":"hardcore","character":"Hardtek bounce, pitched kick contour and short saturated acid responses.","mathNote":"5:7:9:4, with a four-root accompaniment countering the odd cycles.","acc":[0.5,0.33,0.19,0.22]},{"id":"breakcore-prime-shards","name":"Breakcore Prime Shards","bpm":190,"degrees":[7,5,11,3],"sounds":["hardcoreKick","snare","noiseBurst","reese"],"offs":[0.02040816326530612,0.04,0.008264462809917356,0.1111111111111111],"category":"experimental","character":"Dislocated kick and snare accents interleave with high-rate percussive noise.","mathNote":"7:5:11:3 and independent cyclic offsets, not a conventional 16-step break.","acc":[0.44,0.42,0.15,0.24]},{"id":"euclidean-fragments","name":"Euclidean Fragments","bpm":170,"degrees":[7,11,13,5],"sounds":["technoKick","metallic","acidDark","shaker"],"offs":[0,0.012987012987012988,0.011834319526627219,0.04],"category":"experimental","character":"Prime pulse layers with a distinct five-out-of-sixteen Euclidean accent line.","mathNote":"7:11:13:5 nth-root base sets plus explicit E(5,16) on the last instrument.","acc":[0.52,0.25,0.17,0.17],"euclidean":{"k":5,"n":16,"rotation":2,"velocity":0.38}}];
for(const study of EXPERIMENTAL_STUDIES){
 const tracksForStudy=study.degrees.map((degree,i)=>{
  const arg=2*Math.PI*degree*study.offs[i],a=Number(Math.cos(arg).toPrecision(12)),b=Number(Math.sin(arg).toPrecision(12));
  const t=P(Math.abs(a)<1e-11?0:a,Math.abs(b)<1e-11?0:b,degree,study.sounds[i]);
  t.gain=study.acc[i];if(study.euclidean&&i===3)t.euclidean={...study.euclidean};
  return t;
 });
 PRESETS.push({id:study.id,category:study.category,name:study.name,bpm:study.bpm,tracks:tracksForStudy,
   character:study.character,mathNote:study.mathNote});
}

const $=id=>document.getElementById(id);
const canvas=$('orbitCanvas'), ctx=canvas.getContext('2d');
let tracks=[], selectedTrack=0, bpm=146, cycleBars=1, volume=.65, activePresetId='berlin-bass-wall',activeCategory='bunker';
let playing=false,pausedPhase=0,beatEpoch=0,scheduledUntil=0,timerId=null,windowStartBar=0;
let audio=null,master=null,compressor=null,limiter=null,subFilter=null,noiseBuffer=null,voiceBus=null,perHitBus=null,cycles=1;
const sampleBuffers=new Map();const samplePromises=new Map();
let cvWidth=0,cvHeight=0,pixelRatio=1,lastCycleText='';
let toastTimeout=null,rootDrag=null;
const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');let reducedMotion=motionQuery?.matches??false;motionQuery?.addEventListener?.('change',e=>{reducedMotion=e.matches});
function safeInt(v,lo,hi,fallback){const n=Number(v);return Number.isFinite(n)?Math.max(lo,Math.min(hi,Math.round(n))):fallback}
function safeReal(v,fallback){const n=Number(v);return Number.isFinite(n)&&Math.abs(n)<=10000?n:fallback}
function sanitizeVoicePatch(raw) {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 const limits={cutoff:[70,10000],q:[.2,25],decay:[.06,.8],accent:[0,1],slide:[0,.5],drive:[.2,5],modulation:[0,5],depth:[0,9000],base:[20,1500],start:[20,3000],noise:[0,1]};
 const out={};for(const [key,[low,high]] of Object.entries(limits)){
  const v=Number(raw[key]);if(raw[key]!==undefined&&Number.isFinite(v))out[key]=Math.max(low,Math.min(high,v));
 }
 if(['sine','triangle','sawtooth','square'].includes(raw.osc))out.osc=raw.osc;
 return Object.keys(out).length?out:null;
}
function cleanLayer(layer){return {a:safeReal(layer.a,1),b:safeReal(layer.b,0),n:safeInt(layer.n,1,64,1),velocity:Math.min(1,Math.max(.1,safeReal(layer.velocity,.62)))}}
function cleanTrack(t,i){return {cycleBars:safeInt(t.cycleBars,1,16,1),a:safeReal(t.a,1),b:safeReal(t.b,0),n:safeInt(t.n,1,64,4),sound:Object.hasOwn(SOUNDS,t.sound)?t.sound:['kick','clap','hat','bass'][i],muted:Boolean(t.muted),laneIndex:i,operation:t.operation==='intersection'?'intersection':'union',gain:Number.isFinite(Number(t.gain))?Math.max(.05,Math.min(1.5,Number(t.gain))):1,patch:sanitizeVoicePatch(t.patch),euclidean:t.euclidean&&Number.isInteger(t.euclidean.k)&&Number.isInteger(t.euclidean.n)&&t.euclidean.n>=1&&t.euclidean.n<=256&&t.euclidean.k>=0&&t.euclidean.k<=t.euclidean.n?{k:t.euclidean.k,n:t.euclidean.n,rotation:Math.trunc(t.euclidean.rotation||0),velocity:Number.isFinite(Number(t.euclidean.velocity))?Math.max(.1,Math.min(1,Number(t.euclidean.velocity))):.58}:null,layers:Array.isArray(t.layers)?t.layers.slice(0,5).map(cleanLayer):[]}}
function rootPhases({a,b,n}){if(!Number.isFinite(a)||!Number.isFinite(b)||(a===0&&b===0))return [];const arg=Math.atan2(b,a);return Array.from({length:n},(_,k)=>((((arg+TAU*k)/n)/TAU)+1)%1)}
// Union of sets of complex roots; exact duplicates combine rather than play twice.
function events(track) {
 const tol=1e-6,all=[];
 const add=(phase,velocity,kind,index,sourceIndex=0)=>all.push({phase,velocity,sources:[{lane:track.laneIndex??-1,kind,index,sourceIndex}]});
 rootPhases(track).forEach((phase,k)=>add(phase,1,'base',k));
 for(const [i,layer] of (track.layers||[]).entries())rootPhases(layer).forEach((phase,k)=>add(phase,layer.velocity??.62,'additional',k,i));
 if(track.euclidean)RhythmMath.euclidean(track.euclidean.k,track.euclidean.n,track.euclidean.rotation).forEach((phase,k)=>add(phase,track.euclidean.velocity??.58,'euclidean',k));
 all.sort((a,b)=>a.phase-b.phase);
 const merged=[];
 for(const item of all){
  const last=merged[merged.length-1];
  if(last&&item.phase-last.phase<tol){last.velocity=Math.max(last.velocity,item.velocity);last.sources.push(...item.sources)}
  else merged.push({...item,sources:[...item.sources]});
 }
 if(merged.length>1&&1+merged[0].phase-merged[merged.length-1].phase<tol){
  const last=merged.pop();merged[0].velocity=Math.max(merged[0].velocity,last.velocity);merged[0].sources.push(...last.sources);
 }
 if(track.operation==='intersection')return merged.filter(item=>item.sources.some(s=>s.kind==='base')&&item.sources.some(s=>s.kind!=='base'));
 return merged;
}
function roots(track){return events(track).map(x=>x.phase)}
function composePhases(track) {
 const base=rootPhases(track),extra=[];
 for(const layer of track.layers||[])extra.push(...rootPhases(layer));
 if(track.euclidean)extra.push(...RhythmMath.euclidean(track.euclidean.k,track.euclidean.n,track.euclidean.rotation));
 const near=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b))<1e-6;
 const added=RhythmMath.unique(extra);
 const merged=events(track).map(ev=>({
  phase:ev.phase,base:ev.sources.some(s=>s.kind==='base'),added:ev.sources.some(s=>s.kind!=='base'),
  euclidean:ev.sources.some(s=>s.kind==='euclidean')
 }));
 return {base,added,merged,overlaps:merged.filter(v=>v.base&&v.added).length};
}
let selectedRootIndex=0;
const laneModes=['cart','cart','cart','cart'];
const laneUnits=['rad','rad','rad','rad'];
let magnified=false;
function renderTeX(target,latex,displayMode=false) {
 const el=typeof target==='string'?document.getElementById(target):target;
 if(!el)return;
 if(!window.katex){el.textContent='Mathematics rendering unavailable';return}
 window.katex.render(latex,el,{throwOnError:false,strict:'warn',displayMode,output:'htmlAndMathml',trust:false});
}
function complexLaTeX(t) {
 return `${fmt(t.a)}${t.b<0?' - ':' + '}${fmt(Math.abs(t.b))}i`;
}
function initMath() {
 const standard=[
  ['Cartesian form',String.raw`z=a+bi`],
  ['Polar form',String.raw`z=r\left(\cos\theta+i\sin\theta\right)`],
  ['Exponential form',String.raw`z=re^{i\theta}`],
  ['Modulus',String.raw`r=\sqrt{a^2+b^2}`],
  ['Argument',String.raw`\theta=\operatorname{atan2}(b,a)`],
  ['Roots',String.raw`w_k=\sqrt[n]{r}\,e^{i\frac{\theta+2\pi k}{n}}`],
  ['Root set',String.raw`R_n(z)=\{w_0,w_1,\ldots,w_{n-1}\}`],
  ['Root indices',String.raw`k=0,\ldots,n-1`],
  ['Nonzero condition',String.raw`z\ne0`],
  ['Coordinate identities',String.raw`a=\Re(z),\quad b=\Im(z),\quad r=|z|,\quad \theta=\arg(z)`]
 ];
 renderTeX('cartesianHeading',String.raw`z=a+bi`);
 for(const [id,tex] of [
  ['phaseZero',String.raw`0`],
  ['phaseQuarter',String.raw`\dfrac{1}{4}`],
  ['phaseHalf',String.raw`\dfrac{1}{2}`],
  ['phaseThreequarters',String.raw`\dfrac{3}{4}`]
 ])renderTeX(id,tex);
 const wrap=$('formulaReference');wrap.replaceChildren();
 for(const [name,tex] of standard) {
  const row=document.createElement('div'),nameEl=document.createElement('span'),math=document.createElement('span');
  nameEl.className='formula-name';nameEl.textContent=name;
  math.className='formula-math math-notation';renderTeX(math,tex);
  row.append(nameEl,math);wrap.append(row);
 }
}
function updateSelectedRootMath() {
 const t=tracks[selectedTrack];if(!t)return;
 const r=Math.hypot(t.a,t.b);
 if(r===0){
  renderTeX('selectedRootFormula',String.raw`z=0\implies w_k=0`);
  renderTeX('rootPhaseFormula',String.raw`\arg(0)\text{ is undefined; no rhythm event}`);
  return;
 }
 const k=Math.max(0,Math.min(t.n-1,selectedRootIndex));
 const theta=principalArg(t.b,t.a);
 const p=rootPhases(t)[k];
 renderTeX('selectedRootFormula',String.raw`w_{${k}}=\sqrt[${t.n}]{${fmt(r)}}\,e^{i\frac{${fmt(theta)}+2\pi\cdot ${k}}{${t.n}}}`);
 renderTeX('rootPhaseFormula',String.raw`\operatorname{phase}(w_{${k}})=\frac{\theta+2\pi\cdot${k}}{2\pi\cdot${t.n}}\bmod 1=${fmt(p)}`);
}
function principalArg(b,a) {
 const theta=Math.atan2(b,a);
 return theta<=-Math.PI+1e-12?Math.PI:theta;
}
function fmt(n){return Number(n.toFixed(3)).toString().replace('-', '−')}
function complexDisplay(t){return `${fmt(t.a)} ${t.b<0?'−':'+'} ${fmt(Math.abs(t.b))}i`}
function hitLabel(n){return `${n} ${n===1?'hit':'hits'}`}
function applyRotation(t,ang){const radius=Math.hypot(t.a,t.b);if(!radius)return false;const snap=x=>Math.abs(x)<radius*1e-12?0:Number(x.toPrecision(10));t.a=snap(radius*Math.cos(ang));t.b=snap(radius*Math.sin(ang));return true}
function renderPresets(){ $('presetCount').textContent=`${PRESETS.length} rhythm examples · ${new Set(PRESETS.map(p=>p.category)).size} categories`; $('categorySelect').value=activeCategory;const select=$('presetSelect');select.replaceChildren();if(!activePresetId){const x=document.createElement('option');x.value='__custom__';x.textContent='Custom rhythm';select.append(x)}for(const p of PRESETS.filter(p=>p.category===activeCategory)){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;select.append(o)}select.value=activePresetId||'__custom__';const p=PRESETS.find(x=>x.id===activePresetId);$('presetInfo').textContent=p?.character&&p?.mathNote?`${p.character} Mathematical structure: ${p.mathNote}`:''}
function syncVisibleInputs(i) {
 const t=tracks[i],mode=laneModes[i],unit=laneUnits[i],polar=RhythmMath.polarOf(t.a,t.b);
 const values=mode==='cart'?{a:t.a,b:t.b,n:t.n}:{r:polar.r,theta:polar.theta===null?null:polar.theta*(unit==='deg'?180/Math.PI:1),n:t.n};
 for(const [k,v] of Object.entries(values)){
  const el=$('track'+k[0].toUpperCase()+k.slice(1)+i);if(!el)continue;
  if(document.activeElement!==el)el.value=v===null?'':String(Number(v.toFixed(6)));
  if(k==='theta'){el.disabled=v===null;el.placeholder=v===null?'undefined':''}
 }
}
function updateLaneAlt(i) {
 const el=$('laneAlt'+i);if(!el)return;
 const t=tracks[i],polar=RhythmMath.polarOf(t.a,t.b);
 if(laneModes[i]==='cart'){
  renderTeX(el,polar.theta===null?String.raw`r=0,\;\arg(0)\text{ is undefined}`:String.raw`r=${fmt(polar.r)},\;\theta=${fmt(polar.theta)},\quad z=re^{i\theta}`);
 }else renderTeX(el,String.raw`z=${complexLaTeX(t)},\quad z=re^{i\theta}`);
}
function buildLaneFields(row,t,i) {
 const modeBar=document.createElement('div');modeBar.className='lane-modes';modeBar.setAttribute('role','group');modeBar.setAttribute('aria-label','Coordinate form for lane '+(i+1));
 const cart=document.createElement('button'),polar=document.createElement('button'),unit=document.createElement('button');
 for(const [btn,label,mode] of [[cart,'Cartesian','cart'],[polar,'Polar','polar']]){
  btn.type='button';btn.textContent=label;btn.className='mode-button';btn.setAttribute('aria-pressed',String(laneModes[i]===mode));
  btn.addEventListener('click',()=>{laneModes[i]=mode;refresh();cart.setAttribute('aria-pressed',String(mode==='cart'));polar.setAttribute('aria-pressed',String(mode==='polar'))});
 }
 unit.type='button';unit.className='unit-button';unit.addEventListener('click',()=>{laneUnits[i]=laneUnits[i]==='rad'?'deg':'rad';refresh()});
 modeBar.append(cart,polar,unit);row.append(modeBar);
 const fields=document.createElement('div');fields.className='lane-fields';row.append(fields);
 const alt=document.createElement('div');alt.id='laneAlt'+i;alt.className='lane-alternate-math math-notation';row.append(alt);
 const exp=document.createElement('details');exp.className='expression-entry';
 const summary=document.createElement('summary');summary.textContent='Enter a complex expression';exp.append(summary);
 const wrap=document.createElement('div');wrap.className='expression-controls';
 const input=document.createElement('input');input.type='text';input.id='trackExpression'+i;input.maxLength=140;input.placeholder='cos(pi/3)+i sin(pi/3)';input.setAttribute('aria-label','Complex expression for lane '+(i+1));
 const apply=document.createElement('button');apply.type='button';apply.textContent='Apply';apply.className='secondary-btn';
 const error=document.createElement('p');error.className='expression-error';error.setAttribute('role','status');
 const enter=()=>{
  try{
   const z=RhythmMath.parseComplex(input.value);
   if(!Number.isFinite(z.a)||!Number.isFinite(z.b)||Math.max(Math.abs(z.a),Math.abs(z.b))>10000)throw Error('Result is outside the supported range');
   t.a=z.a;t.b=z.b;error.textContent='';syncVisibleInputs(i);updateLaneStatus(i);if(selectedTrack===i)renderReadout();markCustom();
  }catch(e){error.textContent=e.message}
 };
 apply.addEventListener('click',enter);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();enter()}});
 wrap.append(input,apply);exp.append(wrap,error);row.append(exp);
 function refresh() {
  const mode=laneModes[i],value=RhythmMath.polarOf(t.a,t.b);
  fields.replaceChildren();unit.hidden=mode!=='polar';unit.textContent=laneUnits[i]==='rad'?'radians':'degrees';
  for(const key of (mode==='cart'?['a','b','n']:['r','theta','n'])){
   const label=document.createElement('label');
   label.textContent=key==='a'?'a · real':key==='b'?'b · imag':key==='n'?'n · degree':key==='r'?'r · modulus':laneUnits[i]==='rad'?'θ · radians':'θ · degrees';
   const el=document.createElement('input');el.type='number';el.step=key==='n'?'1':'any';el.inputMode=key==='n'?'numeric':'decimal';
   el.id='track'+key[0].toUpperCase()+key.slice(1)+i;
   const v=key==='a'?t.a:key==='b'?t.b:key==='n'?t.n:key==='r'?value.r:value.theta===null?null:value.theta*(laneUnits[i]==='deg'?180/Math.PI:1);
   el.value=v===null?'':String(Number(v.toFixed(6)));el.disabled=key==='theta'&&value.theta===null;if(el.disabled)el.placeholder='undefined';
   el.min=key==='n'?'1':key==='r'?'0':key==='theta'?'-360':'-10000';
   el.max=key==='n'?'64':key==='r'?'14142.136':key==='theta'?'360':'10000';
   el.setAttribute('aria-label',`Lane ${i+1} ${key}`);
   el.addEventListener('input',()=>{
    const raw=el.value.trim(),v=Number(raw);
    const valid=raw!==''&&Number.isFinite(v)&&(key==='n'?Number.isInteger(v)&&v>=1&&v<=64:key==='r'?v>=0&&v<=14142.136:key==='theta'?Math.abs(v)<=360:Math.abs(v)<=10000);
    el.setAttribute('aria-invalid',String(!valid));if(!valid)return;
    if(key==='n')t.n=v;
    else if(key==='a'||key==='b')t[key]=v;
    else {
     const p=RhythmMath.polarOf(t.a,t.b),r=key==='r'?v:p.r,theta=key==='theta'?v*(laneUnits[i]==='deg'?Math.PI/180:1):(p.theta??0);
     const z=RhythmMath.fromPolar(r,theta);
     if(Math.max(Math.abs(z.a),Math.abs(z.b))>10000){el.setAttribute('aria-invalid','true');return}
     t.a=z.a;t.b=z.b;
     if(key==='r'&&p.theta===null&&v>0){const angle=$('trackTheta'+i);if(angle){angle.disabled=false;angle.placeholder='';angle.value='0'}}
    }
    updateLaneStatus(i);if(selectedTrack===i)renderReadout();markCustom();
   });
   el.addEventListener('change',()=>{if(el.getAttribute('aria-invalid')==='true'){el.setAttribute('aria-invalid','false');syncVisibleInputs(i)}});
   label.append(el);fields.append(label);
  }
  updateLaneStatus(i);
 }
 refresh();
}
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
  sound.value=t.sound;sound.addEventListener('change',e=>{t.sound=e.target.value;if(audio)loadSamples(prioritySampleKeys());if(i===selectedTrack)renderEditor();markCustom()});
  const mute=document.createElement('button');mute.type='button';mute.className='lane-mute';mute.id='laneMute'+i;
  const updateMute=()=>{mute.title=t.muted?'Unmute':'Mute';mute.textContent=t.muted?'×':'♫';mute.setAttribute('aria-pressed',String(t.muted));mute.setAttribute('aria-label',(t.muted?'Unmute':'Mute')+' lane '+(i+1));row.classList.toggle('muted',t.muted)};
  updateMute();mute.addEventListener('click',()=>{t.muted=!t.muted;updateMute();markCustom()});
  head.append(pick,sound,mute);row.append(head);
  buildLaneFields(row,t,i);
  const length=document.createElement('div');length.className='lane-length';
  const lengthLabel=document.createElement('label');lengthLabel.htmlFor='laneBars'+i;lengthLabel.textContent='Cycle length · bars';
  const lengthInput=document.createElement('input');lengthInput.id='laneBars'+i;lengthInput.type='number';lengthInput.inputMode='numeric';
  lengthInput.min='1';lengthInput.max='16';lengthInput.step='1';lengthInput.value=String(t.cycleBars||1);
  lengthInput.setAttribute('aria-label','Lane '+(i+1)+' cycle length in bars');
  lengthInput.addEventListener('input',()=>{
   const v=Number(lengthInput.value);
   if(!Number.isInteger(v)||v<1||v>16){lengthInput.setAttribute('aria-invalid','true');lengthInput.value=String(t.cycleBars);return}
   lengthInput.removeAttribute('aria-invalid');
   if(!playing){const old=cycleSeconds();pausedPhase=pausedPhase*old;}
   t.cycleBars=v;
   if(!playing)pausedPhase=((pausedPhase/cycleSeconds())%1+1)%1;
   else if(audio){cancelVoices();scheduledUntil=audio.currentTime+.008;}
   markCustom();renderWindowTimeline();
  });
  lengthInput.addEventListener('change',()=>{if(lengthInput.getAttribute('aria-invalid')==='true'){lengthInput.value=String(t.cycleBars);lengthInput.removeAttribute('aria-invalid')}});
  length.append(lengthLabel,lengthInput);row.append(length);
  const foot=document.createElement('div');foot.className='lane-bottom';
  const eq=document.createElement('span');eq.className='lane-equation';eq.id='laneEq'+i;
  const count=document.createElement('span');count.className='lane-count';count.id='laneCount'+i;
  foot.append(eq,count);row.append(foot);wrap.append(row);updateLaneStatus(i);
 });
}
function updateLaneStatus(i) {
 const t=tracks[i];if(!t)return;
 const eq=$('laneEq'+i),count=$('laneCount'+i);
 if(eq)renderTeX(eq,String.raw`R_{${t.n}}\!\left(${complexLaTeX(t)}\right)`+(t.layers.length?String.raw`\;\cup\; ${t.layers.length}\ \text{additional set(s)}`:''));
 if(count)count.textContent=hitLabel(events(t).length);
 updateLaneAlt(i);
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
function renderSoundControls() {
 const wrap=$('patchControls');if(!wrap)return;wrap.replaceChildren();
 const t=tracks[selectedTrack];if(!t)return;
 const h=document.createElement('h4');h.textContent='Instrument dynamics';wrap.append(h);
 const row=document.createElement('label');row.className='patch-control';
 const label=document.createElement('span');label.textContent='Lane gain';
 const output=document.createElement('output');output.textContent=(t.gain??1).toFixed(2);
 const input=document.createElement('input');input.type='range';input.id='laneGain';input.min='.05';input.max='1.5';input.step='.01';input.value=String(t.gain??1);input.setAttribute('aria-label','Selected lane gain');
 input.addEventListener('input',()=>{t.gain=Number(input.value);output.textContent=t.gain.toFixed(2);markCustom()});
 row.append(label,output,input);wrap.append(row);
 const defaults=window.RhythmVoices?.definitions?.[t.sound];if(!defaults)return;
 const sub=document.createElement('h4');sub.textContent='Sound synthesis · '+SOUNDS[t.sound];wrap.append(sub);
 const p=document.createElement('p');p.className='small-explain';p.textContent='These controls modify the actual Web Audio voice for this instrument.';wrap.append(p);
 const grid=document.createElement('div');grid.className='patch-grid';
 const settings=[
  ['cutoff','Filter cutoff (Hz)',70,10000,10],
  ['q','Resonance',.2,25,.1],
  ['decay','Decay (s)',.06,.8,.01],
  ['accent','Accent',0,1,.01],
  ['slide','Slide (s)',0,.5,.01],
  ['drive','Saturation',.2,5,.1],
  ['modulation','Pitch / FM modulation',0,5,.05],
  ['depth','Filter envelope',0,9000,50]
 ];
 const oscLabel=document.createElement('label');oscLabel.className='patch-osc';oscLabel.textContent='Oscillator';
 const osc=document.createElement('select');osc.id='patchOsc';osc.setAttribute('aria-label','Synthesizer oscillator type');
 for(const type of ['sine','triangle','sawtooth','square']){
  const op=document.createElement('option');op.value=type;op.textContent=type;osc.append(op);
 }
 osc.value=t.patch?.osc||defaults.osc;osc.addEventListener('change',()=>{t.patch={...(t.patch||{}),osc:osc.value};markCustom()});
 oscLabel.append(osc);grid.append(oscLabel);
 for(const [key,title,min,max,step] of settings){
  const label=document.createElement('label');label.className='patch-control';
  const name=document.createElement('span');name.textContent=title;
  const out=document.createElement('output');const initial=t.patch?.[key]??defaults[key]??0;out.textContent=String(initial);
  const slider=document.createElement('input');slider.type='range';slider.id='patch'+key;slider.min=min;slider.max=max;slider.step=step;slider.value=initial;
  slider.setAttribute('aria-label',title);
  slider.addEventListener('input',()=>{const n=Number(slider.value);t.patch={...(t.patch||{}),[key]:n};out.textContent=String(n);markCustom()});
  label.append(name,out,slider);grid.append(label);
 }
 wrap.append(grid);
}
function renderSpecialRhythms() {
 const wrap=$('specialRhythms');if(!wrap)return;wrap.replaceChildren();
 const t=tracks[selectedTrack];if(!t)return;
 const heading=document.createElement('h4');heading.textContent='Mathematical operations';wrap.append(heading);
 const opRow=document.createElement('label');opRow.className='math-option';opRow.textContent='Set operation';
 const choice=document.createElement('select');choice.id='setOperation';choice.setAttribute('aria-label','Root set operation');
 for(const [value,text] of [['union','Union ∪'],['intersection','Intersection ∩']]){const opt=document.createElement('option');opt.value=value;opt.textContent=text;choice.append(opt)}
 choice.value=t.operation||'union';
 choice.addEventListener('change',()=>{t.operation=choice.value;updateLaneStatus(selectedTrack);renderReadout();markCustom()});
 opRow.append(choice);wrap.append(opRow);
 const euRow=document.createElement('label');euRow.className='math-check';
 const cb=document.createElement('input');cb.type='checkbox';cb.id='euclidEnabled';cb.checked=Boolean(t.euclidean);cb.setAttribute('aria-label','Enable Euclidean rhythm generator');
 const cap=document.createElement('span');cap.textContent='Euclidean rhythm E(k, N)';
 euRow.append(cb,cap);wrap.append(euRow);
 const info=document.createElement('p');info.className='small-explain';info.textContent='An independent evenly distributed grid pattern, not the roots of a single complex number.';wrap.append(info);
 const fields=document.createElement('div');fields.className='euclidean-fields';wrap.append(fields);
 function fillFields(){
  fields.replaceChildren();fields.hidden=!t.euclidean;if(!t.euclidean)return;
  for(const [key,title,min,max] of [['k','Pulses k',0,256],['n','Positions N',1,256],['rotation','Shift (steps)',-256,256],['velocity','Velocity',.1,1]]){
   const label=document.createElement('label');label.textContent=title;
   const el=document.createElement('input');el.id='euclid'+key[0].toUpperCase()+key.slice(1);el.type='number';el.step=key==='velocity'?'0.05':'1';el.min=min;el.max=max;el.value=String(t.euclidean[key]??(key==='velocity'?.58:0));
   el.setAttribute('aria-label','Euclidean '+title);
   el.addEventListener('change',()=>{
    const v=Number(el.value),integer=key==='velocity'||Number.isInteger(v);
    const valid=Number.isFinite(v)&&integer&&v>=min&&v<=max&&(key==='k'?v<=t.euclidean.n:key==='n'?v>=t.euclidean.k:true);
    if(!valid){el.value=String(t.euclidean[key]);el.setAttribute('aria-invalid','true');return}
    el.removeAttribute('aria-invalid');t.euclidean[key]=v;updateLaneStatus(selectedTrack);renderReadout();markCustom();
   });
   label.append(el);fields.append(label);
  }
 }
 cb.addEventListener('change',()=>{t.euclidean=cb.checked?{k:5,n:16,rotation:0,velocity:.58}:null;fillFields();updateLaneStatus(selectedTrack);renderReadout();markCustom()});
 fillFields();
}
function renderEditor() {renderReadout();renderLayers();renderSoundControls();renderSpecialRhythms()}
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
 const setSymbol=t.operation==='intersection'?String.raw`\cap`:String.raw`\cup`;
  renderTeX('compositionEquation',String.raw`R_{${t.n}}(z)`+(t.layers.length?t.layers.map((l,j)=>String.raw`\;${setSymbol}\;R_{${l.n}}(u_{${j+1}})`).join(''):'')+(t.euclidean?String.raw`\;${setSymbol}\;E(${t.euclidean.k},${t.euclidean.n})`:''));
  const resultLabel=$('unionStrip')?.parentElement?.querySelector('.phase-label span');if(resultLabel)resultLabel.textContent=t.operation==='intersection'?'Intersection':'Union';
 updateSelectedRootMath();
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
  for(const key of ['a','b','n']){const item=document.createElement('div'),label=document.createElement('label'),input=document.createElement('input');label.textContent=key==='n'?'Root degree n':key;label.htmlFor=`layer${i}${key}`;input.id=label.htmlFor;input.type='number';input.step=key==='n'?'1':'any';input.value=key==='n'?layer[key]:Number(layer[key].toFixed(3));input.setAttribute('aria-label',`Extra root set ${i+1}: ${key}`);input.addEventListener('change',()=>{const raw=Number(input.value);if(!Number.isFinite(raw)||(key==='n'&&(!Number.isInteger(raw)||raw<1||raw>64))||(key!=='n'&&Math.abs(raw)>10000)){input.value=String(layer[key]);showToast('Invalid number or root degree');return}layer[key]=raw;renderTracks();renderReadout();markCustom()});item.append(label,input);group.append(item)}
  const remove=document.createElement('button');remove.type='button';remove.className='layer-remove';remove.textContent='×';remove.title='Remove this root set';remove.setAttribute('aria-label',`Remove extra root set ${i+1}`);remove.addEventListener('click',()=>{t.layers.splice(i,1);renderLayers();renderTracks();renderReadout();markCustom()});group.append(remove);
  const velocity=document.createElement('label');velocity.className='layer-velocity';velocity.textContent='Set volume';const volume=document.createElement('input');volume.type='range';volume.min='10';volume.max='100';volume.value=String(Math.round(layer.velocity*100));volume.setAttribute('aria-label',`Volume of extra root set ${i+1}`);volume.addEventListener('input',()=>{layer.velocity=Number(volume.value)/100;markCustom()});velocity.append(volume);group.append(velocity);wrap.append(group)
 })}

function renderWindowTimeline() {
 const summary=$('commonCycle');if(!summary||!tracks.length)return;
 const common=RhythmMath.commonCycle(tracks);
 summary.textContent=`Common period: ${common} ${common===1?'bar':'bars'}`;
 const slider=$('windowStart');slider.max=String(Math.max(0,common-4));
 windowStartBar=Math.max(0,Math.min(windowStartBar,Number(slider.max)));
 slider.value=String(windowStartBar);
 $('windowStartText').textContent=String(windowStartBar+1);
 if(!$('windowPanel').open)return;
 const start=windowStartBar,span=4,secPerBar=barSeconds();
 const lanes=tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,events:events(t)}));
 const scheduled=RhythmMath.planEvents(lanes,secPerBar,start*secPerBar,(start+span)*secPerBar);
 const container=$('windowTimeline');container.replaceChildren();
 let simultaneous=0,lastIndex=0;
 while(lastIndex<scheduled.length){
  const first=scheduled[lastIndex];let j=lastIndex+1,uniqueLanes=new Set([first.lane]);
  while(j<scheduled.length&&Math.abs(scheduled[j].time-first.time)<1e-6){
   uniqueLanes.add(scheduled[j].lane);j++;
  }
  if(uniqueLanes.size>1)simultaneous++;
  lastIndex=j;
 }
 for(let i=0;i<tracks.length;i++){
  const row=document.createElement('div');row.className='window-lane';
  row.style.setProperty('--lane-color',COLORS[i]);
  const label=document.createElement('span');label.className='window-lane-label';label.textContent=`Lane ${i+1}`;
  const markers=document.createElement('div');markers.className='window-lane-events';
  markers.setAttribute('role','img');
  const current=scheduled.filter(event=>event.lane===i);
  markers.setAttribute('aria-label',`${current.length} events on lane ${i+1} over four bars beginning at bar ${start+1}`);
  const fragment=document.createDocumentFragment();
  for(const event of current){
   const dot=document.createElement('span');dot.className='window-mark';
   dot.style.left=(100*(event.time/secPerBar-start)/span)+'%';
   dot.title=`Bar ${(event.time/secPerBar+1).toFixed(3)} · source ${event.sourceEvent+1}`;
   fragment.append(dot);
  }
  markers.append(fragment);
  const count=document.createElement('span');count.className='window-count';count.textContent=`${current.length} hits`;
  row.append(label,markers,count);container.append(row);
 }
 $('windowCounts').textContent=`${scheduled.length} scheduled lane events · ${simultaneous} simultaneous cross-lane ${simultaneous===1?'moment':'moments'} in this four-bar window.`;
}
function markCustom(){if(activePresetId!==null){activePresetId=null;renderPresets()}renderWindowTimeline()}
function applyPreset(p){const phase=transportPhase(),oldCycle=cycleSeconds();const cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/oldCycle):0;
 cycleBars=p.bars===2?2:1;tracks=p.tracks.map((t,i)=>cleanTrack({...t,cycleBars:t.cycleBars??cycleBars},i));bpm=p.bpm;activePresetId=p.id;activeCategory=p.category;$('bpm').value=String(bpm);$('bpmText').textContent=String(bpm);
 if(audio){loadSamples(prioritySampleKeys())}
 if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();scheduledUntil=audio.currentTime+.006}
 renderPresets();renderTracks();renderEditor();renderWindowTimeline()}
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
        master.connect(compressor);
         subFilter=audio.createBiquadFilter();subFilter.type='highpass';subFilter.frequency.value=20;subFilter.Q.value=.707;
         limiter=audio.createWaveShaper();const ceiling=new Float32Array(4096);
         for(let i=0;i<ceiling.length;i++){const x=2*i/(ceiling.length-1)-1;ceiling[i]=.84*Math.tanh(3.2*x)/Math.tanh(3.2)}
         limiter.curve=ceiling;limiter.oversample='2x';
         compressor.connect(subFilter);subFilter.connect(limiter);limiter.connect(audio.destination);
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
      function hit(sound, at, velocity=1, index=0, patch=null) {
        // Real recorded/rended one-shots first; use local synthesis when unavailable.
        const t=Math.max(at,audio.currentTime+.002);
        if(playSample(sound,t,velocity,index))return;
        perHitBus=audio.createGain();perHitBus.gain.value=Math.max(.05,Math.min(1,velocity));perHitBus.connect(voiceBus||master);
         if(window.RhythmVoices?.play(audio,perHitBus,sound,t,velocity,index,patch)){perHitBus=null;return}
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
function cycleSeconds(){return barSeconds()*(tracks.length?RhythmMath.commonCycle(tracks):cycleBars)}
function laneSeconds(track){return barSeconds()*(track.cycleBars||1)}
function playbackElapsed(){return playing&&audio?Math.max(0,audio.currentTime-beatEpoch):pausedPhase*cycleSeconds()}
function lanePhase(track){return RhythmMath.phaseAt(playbackElapsed(),track.cycleBars||1,barSeconds())}
function transportPhase(){if(!playing||!audio)return pausedPhase;return ((Math.max(0,audio.currentTime-beatEpoch)/cycleSeconds())%1+1)%1}
function cancelVoices(){
 if(voiceBus&&audio){try{const old=voiceBus;old.gain.setValueAtTime(old.gain.value,audio.currentTime);old.gain.setTargetAtTime(.0001,audio.currentTime,.006);setTimeout(()=>{try{old.disconnect()}catch(_){}},100)}catch(_){}}
 voiceBus=audio?audio.createGain():null;if(voiceBus)voiceBus.connect(master);
}
function scheduleAhead(){
 if(!playing||!audio||audio.state!=='running')return;
 const now=audio.currentTime,from=Math.max(scheduledUntil,now+.001),to=now+.09;
 if(to<=from)return;
 const relFrom=Math.max(0,from-beatEpoch),relTo=Math.max(0,to-beatEpoch);
 if(relTo<=relFrom)return;
 const lanes=tracks.map(t=>({cycleBars:t.cycleBars,muted:t.muted,events:events(t)}));
 const future=RhythmMath.planEvents(lanes,barSeconds(),relFrom,relTo);
 for(const hitEvent of future){
  const tr=tracks[hitEvent.lane],at=beatEpoch+hitEvent.time;
  if(at>=from&&at<to)hit(tr.sound,at,hitEvent.velocity*(tr.gain??1),
    hitEvent.cycle*lanes[hitEvent.lane].events.length+hitEvent.sourceEvent,tr.patch);
 }
 scheduledUntil=to;
}
function updateTransportText(){const button=$('playBtn');button.textContent=playing?'Ⅱ Pause':'▶ Play';button.setAttribute('aria-pressed',String(playing));const ready=prioritySampleKeys().filter(k=>sampleBuffers.has(k)).length;const all=prioritySampleKeys().length;$('audioState').textContent=playing?(`Playing · samples ${ready}/${all}`):'Ready to play'}
async function togglePlay(){if(playing){pausedPhase=transportPhase();playing=false;clearInterval(timerId);timerId=null;cancelVoices();if(audio)await audio.suspend();updateTransportText();return}
 if(!initAudio())return;try{await audio.resume()}catch(err){showToast('Audio could not start: '+err.message);return}
 const ready=prioritySampleKeys();if(ready.length){$('audioState').textContent='Loading sounds…';await Promise.race([loadSamples(ready),new Promise(resolve=>setTimeout(resolve,2800))]);}
 cancelVoices();beatEpoch=audio.currentTime+.055-pausedPhase*cycleSeconds();scheduledUntil=audio.currentTime;playing=true;updateTransportText();scheduleAhead();timerId=setInterval(scheduleAhead,25)}
function reset(){pausedPhase=0;cycles=1;if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime+.06;scheduledUntil=audio.currentTime}}
async function previewSound(){if(!initAudio())return;try{await audio.resume();const t=tracks[selectedTrack];await Promise.race([loadSamples([sampleKey(t.sound),...(t.sound==='jazzshaker'?['jazzshaker-alt']:[])]),new Promise(resolve=>setTimeout(resolve,1600))]);hit(t.sound,audio.currentTime+.014,t.gain??1,0,t.patch)}catch(err){showToast('Preview failed: '+err.message)}}
function resizeCanvas(){const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;cvWidth=width;cvHeight=height;pixelRatio=Math.min(2.5,devicePixelRatio||1);
 canvas.width=Math.max(1,Math.round(width*pixelRatio));canvas.height=Math.max(1,Math.round(height*pixelRatio));ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0)}
function refreshPlotZoom(){
 const plot=$('plotArea'),btn=$('zoomBtn');
 if(!plot||!btn)return;
 plot.classList.toggle('focused',magnified);
 btn.setAttribute('aria-pressed',String(magnified));
 btn.textContent=magnified?'Fit entire cycle':'Magnify plot';
 if(magnified){
  const ratios=[1,.78,.56,.34],lane=selectedTrack;
  const n=Math.max(1,tracks[lane]?.n||1);
  const size=Math.max(900,Math.ceil(34*n/(TAU*.427*ratios[lane])));
  canvas.style.width=size+'px';canvas.style.height=size+'px';
  requestAnimationFrame(()=>{plot.scrollLeft=Math.max(0,(size-plot.clientWidth)/2);plot.scrollTop=Math.max(0,(size-plot.clientHeight)/2);resizeCanvas()});
 }else{
  canvas.style.width='';canvas.style.height='';
  requestAnimationFrame(resizeCanvas);
 }
}
function selectRootIndexAtPoint(p,t,r) {
 if(t.a===0&&t.b===0)return -1;
 const phases=rootPhases(t);
 let best=-1,distance=Infinity;
 phases.forEach((phase,k)=>{
  const a=-Math.PI/2+TAU*phase;
  const d=Math.hypot(p.x-Math.cos(a)*r,p.y-Math.sin(a)*r);
  if(d<distance){distance=d;best=k}
 });
 return distance<=Math.max(20,p.side*.03)?best:-1;
}
function rgba(i,alpha){const c=RGB[i];return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`}
function getRadii(side){const outer=side*.427;return [outer,outer*.78,outer*.56,outer*.34]}
function draw() {
 const w=cvWidth,h=cvHeight;if(w<2||h<2){requestAnimationFrame(draw);return}
 ctx.clearRect(0,0,w,h);
 const dark=theme==='dark',side=Math.min(w,h),cx=w/2,cy=h/2,radii=getRadii(side),outer=radii[0],elapsed=playbackElapsed(),selectedPhase=lanePhase(tracks[selectedTrack]);
 ctx.fillStyle=dark?'#20221d':'#faf8f3';ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(cx,cy);ctx.textAlign='center';ctx.textBaseline='middle';
 const guide=dark?'#4d5046':'#d8d5cd',baseInk=dark?'#dcded3':'#55584f';
 for(let q=0;q<16;q++){
  const a=-Math.PI/2+TAU*q/16;
  ctx.beginPath();ctx.moveTo(Math.cos(a)*(outer+6),Math.sin(a)*(outer+6));
  ctx.lineTo(Math.cos(a)*(outer+(q%4===0?15:10)),Math.sin(a)*(outer+(q%4===0?15:10)));
  ctx.strokeStyle=guide;ctx.lineWidth=q%4===0?1.35:.7;ctx.stroke();
 }
 // The quarter-cycle fractions are separate live KaTeX DOM labels, not Canvas text.
 tracks.forEach((t,i)=>{
  const r=radii[i],chosen=i===selectedTrack;
  ctx.beginPath();ctx.arc(0,0,r,0,TAU);
  ctx.strokeStyle=chosen?COLORS[i]:(dark?'#63675e':'#c4c5bc');ctx.lineWidth=chosen?2:1.2;ctx.stroke();
 });
 const angle=-Math.PI/2+TAU*(reducedMotion?Math.floor(selectedPhase*16)/16:selectedPhase);
 ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(angle)*radii[selectedTrack],Math.sin(angle)*radii[selectedTrack]);
 ctx.strokeStyle=playing?(dark?'#c4c9ba':'#676d62'):(dark?'#5a5e54':'#cfcec5');ctx.lineWidth=1.3;ctx.stroke();
 if(rootDrag&&rootDrag.moved){
  const i=rootDrag.track,r=radii[i],arg=rootDrag.startArg,n=rootDrag.n;
  ctx.save();ctx.setLineDash([2,4]);ctx.strokeStyle=COLORS[i];
  for(let k=0;k<n;k++){const a=-Math.PI/2+(arg+TAU*k)/n;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,TAU);ctx.stroke()}
  ctx.restore();
 }
 tracks.forEach((t,i)=>{
  const r=radii[i],c=composePhases(t),spacing=c.merged.length?TAU*r/c.merged.length:40;
  const phase=RhythmMath.phaseAt(elapsed,t.cycleBars||1,barSeconds()),duration=laneSeconds(t);
  const size=14; // 28px visible event diameter, at least twice the original 12–14px
  for(const mark of c.merged){
   const a=-Math.PI/2+TAU*mark.phase,x=Math.cos(a)*r,y=Math.sin(a)*r;
   const proximity=((phase-mark.phase)%1+1)%1*duration;
   const pulse=playing&&!t.muted&&proximity<.16&&!reducedMotion?6*Math.pow(1-proximity/.16,2):0;
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
 ctx.font='18px system-ui';ctx.fillText('events',0,29);
 ctx.restore();
 if(playing&&audio){cycles=Math.floor(elapsed/cycleSeconds())+1}
 const common=RhythmMath.commonCycle(tracks);
 const currentBar=Math.floor(elapsed/barSeconds())%common;
 const label=`Bar ${currentBar+1} / ${common} · 4/4`;
 if(label!==lastCycleText){$('timeDisplay').textContent=label;lastCycleText=label}
 requestAnimationFrame(draw);
}
function saveJson(){const data={format:'roots-rhythm/1',name:activePresetId?PRESETS.find(p=>p.id===activePresetId)?.name:'My complex rhythm',bpm,bars:cycleBars,tracks};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='complex-rhythm.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function loadJson(file){try{if(file.size>100000)throw Error('File is too large');const d=JSON.parse(await file.text());if(d?.format!=='roots-rhythm/1'||!Array.isArray(d.tracks)||d.tracks.length!==4)throw Error('Expected roots-rhythm/1 with four tracks');
 if(d.tracks.some(t=>!t||typeof t!=='object'||(t.cycleBars!==undefined&&(!Number.isInteger(t.cycleBars)||t.cycleBars<1||t.cycleBars>16))||!Number.isFinite(Number(t.a))||!Number.isFinite(Number(t.b))||Math.abs(Number(t.a))>10000||Math.abs(Number(t.b))>10000||!Number.isInteger(Number(t.n))||Number(t.n)<1||Number(t.n)>64||!Object.hasOwn(SOUNDS,t.sound)||t.layers!==undefined&&(!Array.isArray(t.layers)||t.layers.length>5||t.layers.some(l=>!l||!Number.isFinite(Number(l.a))||!Number.isFinite(Number(l.b))||Math.abs(Number(l.a))>10000||Math.abs(Number(l.b))>10000||!Number.isInteger(Number(l.n))||Number(l.n)<1||Number(l.n)>64||!Number.isFinite(Number(l.velocity))||Number(l.velocity)<.1||Number(l.velocity)>1))))throw Error('Check a, b, n and sound for every track');
 const phase=transportPhase(),oldCycle=cycleSeconds(),cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/oldCycle):0;cycleBars=d.bars===2?2:1;tracks=d.tracks.map((t,i)=>cleanTrack({...t,cycleBars:t.cycleBars??cycleBars},i));bpm=safeInt(d.bpm,50,260,138);if(audio)loadSamples(prioritySampleKeys());$('bpm').value=String(bpm);$('bpmText').textContent=String(bpm);if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();scheduledUntil=audio.currentTime+.008}
 activePresetId=null;renderPresets();renderTracks();renderEditor();renderWindowTimeline();showToast('Imported rhythm: '+(typeof d.name==='string'?d.name.slice(0,45):file.name))}catch(e){showToast('Import failed: '+e.message)}}
function setupEvents() {
 $('categorySelect').addEventListener('change',e=>{activeCategory=e.target.value;const first=PRESETS.find(p=>p.category===activeCategory);if(first)applyPreset(first)});
 $('presetSelect').addEventListener('change',e=>{const p=PRESETS.find(p=>p.id===e.target.value);if(p)applyPreset(p)});
 $('playBtn').addEventListener('click',togglePlay);
 $('resetBtn').addEventListener('click',reset);
 $('previewBtn').addEventListener('click',previewSound);
 $('argumentAngle').addEventListener('input',e=>{
  const t=tracks[selectedTrack];if(!applyRotation(t,Number(e.target.value)*Math.PI/180))return;
  syncVisibleInputs(selectedTrack);
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
 $('zoomBtn').addEventListener('click',()=>{magnified=!magnified;refreshPlotZoom()});
 $('windowStart').addEventListener('input',e=>{windowStartBar=Math.max(0,Math.trunc(Number(e.target.value)||0));renderWindowTimeline()});
 $('windowPanel').addEventListener('toggle',renderWindowTimeline);
 function canvasPoint(e){const b=canvas.getBoundingClientRect();return{x:e.clientX-b.left-b.width/2,y:e.clientY-b.top-b.height/2,side:Math.min(b.width,b.height)}}
 function wrapAngle(x){return Math.atan2(Math.sin(x),Math.cos(x))}
 function onRootDot(p,t,r){return t.a===0&&t.b===0?false:rootPhases(t).some(ph=>{const a=-Math.PI/2+TAU*ph;return Math.hypot(p.x-Math.cos(a)*r,p.y-Math.sin(a)*r)<=Math.max(15,p.side*.025)})}
 canvas.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  const p=canvasPoint(e),dist=Math.hypot(p.x,p.y);
  const near=getRadii(p.side).map((r,i)=>({r,i,gap:Math.abs(r-dist)})).sort((a,b)=>a.gap-b.gap)[0];
  if(near.gap>Math.max(15,p.side*.06))return;
  chooseTrack(near.i);const t=tracks[near.i];const k=selectRootIndexAtPoint(p,t,near.r);if(k<0)return;selectedRootIndex=k;updateSelectedRootMath();
  rootDrag={id:e.pointerId,track:near.i,n:t.n,startArg:Math.atan2(t.b,t.a),startPointer:Math.atan2(p.y,p.x),moved:false};
  canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  if(!rootDrag||rootDrag.id!==e.pointerId)return;
  const p=canvasPoint(e),delta=wrapAngle(Math.atan2(p.y,p.x)-rootDrag.startPointer);
  if(!rootDrag.moved&&Math.abs(delta)<.004)return;
  rootDrag.moved=true;const t=tracks[rootDrag.track];
  applyRotation(t,rootDrag.startArg+t.n*delta);
  syncVisibleInputs(rootDrag.track);
  updateLaneStatus(rootDrag.track);renderReadout();markCustom();canvas.classList.add('is-dragging');
 });
 function finishDrag(e){if(!rootDrag||rootDrag.id!==e.pointerId)return;rootDrag=null;canvas.classList.remove('is-dragging')}
 canvas.addEventListener('pointerup',finishDrag);canvas.addEventListener('pointercancel',finishDrag);canvas.addEventListener('lostpointercapture',finishDrag);
 canvas.addEventListener('keydown',e=>{
  if(e.shiftKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){
   e.preventDefault();const t=tracks[selectedTrack];
   if(applyRotation(t,Math.atan2(t.b,t.a)+(e.key==='ArrowRight'?1:-1)*t.n*5*Math.PI/180)){
    syncVisibleInputs(selectedTrack);updateLaneStatus(selectedTrack);renderReadout();markCustom()
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
// Read-only research/CI snapshots; never expose writable runtime state.
window.RhythmResearch=Object.freeze({
 presets:()=>PRESETS.map(p=>({
  id:p.id,name:p.name,category:p.category,bpm:p.bpm,bars:p.bars||1,
  character:p.character||'',mathNote:p.mathNote||'',
  tracks:p.tracks.map((t,i)=>cleanTrack({...t,cycleBars:t.cycleBars??(p.bars===2?2:1)},i))
 })),
 events:track=>events(cleanTrack(track,0)).map(e=>({phase:e.phase,velocity:e.velocity})),
 rootPhases:track=>rootPhases(cleanTrack(track,0))
});
let savedTheme='light';
try{savedTheme=localStorage.getItem('roots-rhythm-theme')||'light'}catch(_){}
initMath();setupEvents();applyPreset(PRESETS.find(p=>p.id==='afro')||PRESETS[0]);setTheme(savedTheme);
resizeCanvas();requestAnimationFrame(draw);
})();
