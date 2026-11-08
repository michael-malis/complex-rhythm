'use strict';
(() => {
const TAU=2*Math.PI;
let COLORS=['#ab5847','#567a63','#967438','#80618a'];
let RGB=[[171,88,71],[86,122,99],[150,116,56],[128,97,138]];
let theme='light';
const SOUNDS={kick:'Kick',snare:'Snare',clap:'Clap',hat:'Closed hat',openhat:'Open hat',rim:'Rim click',tom:'Tom',bass:'Sub bass',shaker:'Shaker',reese:'Reese bass',acid:'Acid synth',surdo:'Surdo',agogo:'Agogô',tamborim:'Tamborim',jazzkick:'Soft acoustic kick',crossstick:'Jazz cross-stick',jazzshaker:'Natural shaker',jazzhat:'Jazz hi-hat',jazzsnare:'Acoustic snare',claves:'Wooden claves',bongo:'Natural bongo',bongoLow:'Acoustic bongo · low',bongoHigh:'Acoustic bongo · high',berlinrumble:'Berlin sub-rumble',technoKick:'Techno kick',hardcoreKick:'Distorted hardcore kick',gabberKick:'Gabber kick',frenchcoreKick:'Frenchcore pitched kick',metallic:'Industrial metallic percussion',fmPerc:'FM percussion',noiseBurst:'Noise burst',hoover:'Hoover bass',raveStab:'Rave stab',acidClassic:'Classic 303 Acid',acidHard:'Hard Acid',acidScreaming:'Screaming Acid',acidDark:'Dark Acid',acidIndustrial:'Industrial Acid',acidPsychedelic:'Psychedelic Acid'};
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
 {id:'minimal',category:'poly',name:'Polyrhythm · 5 : 7',bpm:124,tracks:[P(1,0,5,'tom'),P(1,0,7,'rim'),P(1,0,8,'hat'),P(1,0,1,'kick')],character:'Five equally spaced tom hits oppose seven rim hits; hats give an eight-pulse reference and the kick marks the cycle start.',mathNote:'The first two tracks construct a 5:7 polyrhythm from R₅(1) and R₇(1). Only their cycle-start events coincide.'},
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
// Four musically distinct acid roles; each note remains an nth-root event.
// Separate voice definitions already implement six proven, measurable acid spectra.
 {id:'acid-303',category:'acid',name:'Acid 303 · Classic',bpm:128,
  character:'Sparse classic sawtooth 303 steps against a four-to-the-floor kick and restrained offbeat hats.',
  mathNote:'Six lead phases from the union of R4(-1) and two single-root accents.',
  tracks:[P(1,0,4,'kick'),P(-1,0,2,'clap'),P(-1,0,4,'hat'),
   P(-1,0,4,'acidClassic',[L(3,.65),L(11,.66)])]},
 {id:'resonance-rush',category:'acid',name:'Resonance · Twister',bpm:134,
  character:'Fast, animated psychedelic squelch over an eighth-note hi-hat roll and extra kick pickup.',
  mathNote:'Five rotated lead roots from R5(i), with two independently phased single-root syncopations.',
  tracks:[P(1,0,4,'kick',[L(14,.45)]),P(-1,0,2,'clap'),
   P(1,0,8,'hat',[L(3,.4)]),P(0,1,5,'acidPsychedelic',[L(7,.55),L(13,.42)])]},
 {id:'liquid-corrosion',category:'acid',name:'Liquid · Acid Dub',bpm:124,
  character:'Space between low, dark square-wave acid phrases, broken half-time kick and long open hats.',
  mathNote:'A deliberately sparse two-root bass family with two soft displaced accents.',
  tracks:[P(1,0,2,'kick',[L(12,.54)]),P(-1,0,2,'rim'),
   P(-1,0,4,'openhat'),P(1,0,2,'acidDark',[L(3,.42),L(11,.52)])]},
 {id:'303-pressure',category:'acid',name:'303 Pressure · Peak',bpm:140,
  character:'Dense distorted hard-acid stabs fight two snare backbeats and a rapid hi-hat line.',
  mathNote:'Seven equally spaced off-axis lead roots, plus two sixteenth-grid high-pressure accents.',
  tracks:[P(1,0,4,'kick',[L(14,.54)]),P(-1,0,2,'snare'),
   P(1,0,8,'hat',[L(5,.33)]),P(-1,0,7,'acidHard',[L(1,.56),L(9,.7)])]}
];
// Research-informed experimental studies. Original 35 records remain unmodified.
// Each n-th-root set is still exactly uniform; the combined ensemble is not a single arbitrary root set.
const EXPERIMENTAL_STUDIES=[{"id":"industrial-fracture","name":"Industrial Fracture","bpm":155,"degrees":[5,7,11,9],"sounds":["hardcoreKick","metallic","hat","reese"],"offs":[0,0.02857142857142857,0.025974025974025976,0.04938271604938271],"category":"experimental","character":"Dry broken-pressure impacts against metal clicks and a slow detuned bass contour.","mathNote":"5:7:11 polyrhythm in the first three lanes, supported by a shifted nine-root bass contour.","acc":[0.75,0.5,0.24,0.28]},{"id":"acid-reactor","name":"Acid Reactor","bpm":148,"degrees":[3,5,7,11],"sounds":["technoKick","acidHard","metallic","hat"],"offs":[0,0.06666666666666667,0.08571428571428572,0.05194805194805195],"category":"experimental","character":"Three anchor kicks, agitated hard-acid response and scattered metallic shrapnel.","mathNote":"Relatively prime 3:5:7:11 periodicities with displaced phases.","acc":[0.82,0.45,0.29,0.2]},{"id":"rotterdam-collision","name":"Rotterdam Collision","bpm":180,"degrees":[4,7,11,3],"sounds":["gabberKick","metallic","noiseBurst","hoover"],"offs":[0,0.03571428571428571,0.045454545454545456,0.1111111111111111],"category":"hardcore","character":"Four relentless gabber pulses clash with seven metallic spikes and eleven noisy accents.","mathNote":"4:7:11:3 exact-root collision study, with offset root families.","acc":[0.62,0.26,0.19,0.2]},{"id":"schranz-machinery","name":"Schranz Machinery","bpm":158,"degrees":[7,9,11,13],"sounds":["hardcoreKick","metallic","fmPerc","acidIndustrial"],"offs":[0,0.031746031746031744,0.01818181818181818,0.03296703296703297],"category":"hardcore","character":"Mechanistic distorted kick punctuated by inharmonic percussive metallic events.","mathNote":"Odd-meter 7:9:11:13 layers, with substantial drift between collisions.","acc":[0.42,0.22,0.2,0.16]},{"id":"broken-reactor","name":"Broken Reactor","bpm":172,"degrees":[5,11,7,13],"sounds":["technoKick","snare","noiseBurst","acidScreaming"],"offs":[0.04,0.03636363636363636,0.047619047619047616,0.02197802197802198],"category":"experimental","character":"Five-beat broken low-end structure under thin snare splinters and screaming acid.","mathNote":"Five against eleven against seven against thirteen, with asymmetrical offsets.","acc":[0.65,0.31,0.18,0.15]},{"id":"frenchcore-spiral","name":"Frenchcore Spiral","bpm":205,"degrees":[4,7,5,11],"sounds":["frenchcoreKick","acidHard","metallic","hat"],"offs":[0,0.03571428571428571,0.05,0.03636363636363636],"category":"hardcore","character":"Pitched frenchcore kick with seven hard-acid notes and metallic syncopation.","mathNote":"4:7:5:11 with pitched root families and near-aligned source cycles.","acc":[0.58,0.27,0.3,0.15]},{"id":"acid-singularity","name":"Acid Singularity","bpm":162,"degrees":[7,11,13,5],"sounds":["technoKick","acidPsychedelic","fmPerc","acidDark"],"offs":[0.02857142857142857,0.025974025974025976,0.03296703296703297,0.04],"category":"experimental","character":"Narrow techno foundation against two contrasting resonant acid patches.","mathNote":"Prime periods 7:11:13:5 with separately shifted arguments.","acc":[0.44,0.22,0.17,0.23]},{"id":"prime-number-riot","name":"Prime Number Riot","bpm":175,"degrees":[3,5,7,11],"sounds":["gabberKick","metallic","raveStab","acidClassic"],"offs":[0,0.06666666666666667,0.05714285714285714,0.012987012987012988],"category":"experimental","character":"Three robust gabber accents chase five metal beats and a terse melodic rave stab.","mathNote":"3:5:7:11 — all prime root degrees, unlike the related Acid Reactor arrangement.","acc":[0.7,0.35,0.26,0.19]},{"id":"eleven-against-seven","name":"Eleven Against Seven","bpm":146,"degrees":[7,11,5,13],"sounds":["hardcoreKick","fmPerc","hat","acidIndustrial"],"offs":[0,0.03896103896103896,0.04,0.04395604395604396],"category":"experimental","character":"Sparse heavy low-frequency events and rapidly shifting light FM patterns.","mathNote":"Seven against eleven is the foreground relation; five and thirteen form a subdued counter-layer.","acc":[0.42,0.25,0.2,0.16]},{"id":"mechanical-paradox","name":"Mechanical Paradox","bpm":168,"degrees":[9,13,7,11],"sounds":["technoKick","metallic","raveStab","noiseBurst"],"offs":[0.037037037037037035,0.02197802197802198,0.047619047619047616,0.04132231404958678],"category":"experimental","character":"Rotating machinery pulses and destabilized metallic accents.","mathNote":"9:13:7:11, with nonzero phases to avoid universal downbeat collisions.","acc":[0.48,0.23,0.18,0.14]},{"id":"terror-geometry","name":"Terror Geometry","bpm":220,"degrees":[4,7,9,13],"sounds":["gabberKick","noiseBurst","acidScreaming","metallic"],"offs":[0,0.03571428571428571,0.044444444444444446,0.02197802197802198],"category":"hardcore","character":"Fast low-end impacts and densely shifting high-frequency shards, peak-controlled.","mathNote":"4:7:9:13 four-lane polyrhythm: a fixed four-root kick against independently offset seven, nine and thirteen-root layers.","acc":[0.55,0.23,0.13,0.11]},{"id":"complex-roots-overload","name":"Complex Roots Overload","bpm":186,"degrees":[7,11,13,17],"sounds":["hardcoreKick","fmPerc","hoover","metallic"],"offs":[0.02040816326530612,0.01652892561983471,0.01775147928994083,0.01730103806228374],"category":"experimental","character":"Intentionally dense prime-degree texture, with reduced per-lane gain for clarity.","mathNote":"7:11:13:17 – four individually uniform but collectively intricate time sets.","acc":[0.34,0.18,0.14,0.13]},{"id":"hardtek-mobius","name":"Hardtek Möbius","bpm":178,"degrees":[5,7,9,4],"sounds":["frenchcoreKick","raveStab","fmPerc","acidHard"],"offs":[0,0.02857142857142857,0.037037037037037035,0.0625],"category":"hardcore","character":"Hardtek bounce, pitched kick contour and short saturated acid responses.","mathNote":"5:7:9:4, with a four-root accompaniment countering the odd cycles.","acc":[0.5,0.33,0.19,0.22]},{"id":"breakcore-prime-shards","name":"Breakcore Prime Shards","bpm":190,"degrees":[7,5,11,3],"sounds":["hardcoreKick","snare","noiseBurst","reese"],"offs":[0.02040816326530612,0.04,0.008264462809917356,0.1111111111111111],"category":"experimental","character":"Dislocated kick and snare accents interleave with high-rate percussive noise.","mathNote":"7:5:11:3 and independent cyclic offsets, not a conventional 16-step break.","acc":[0.44,0.42,0.15,0.24]},{"id":"euclidean-fragments","name":"Euclidean Fragments","bpm":170,"degrees":[7,11,13,5],"sounds":["technoKick","metallic","acidDark","shaker"],"offs":[0,0.012987012987012988,0.011834319526627219,0.04],"category":"experimental","character":"Prime pulse layers with a distinct five-out-of-sixteen Euclidean accent line.","mathNote":"7:11:13:5 nth-root base sets plus explicit E(5,16) on the last instrument.","acc":[0.52,0.25,0.17,0.17],"euclidean":{"k":5,"n":16,"rotation":2,"velocity":0.38}}];
// A musical accent is a separate *first-degree complex root*, not a second
// sequencer grid. Every original n-root set and phase remains unchanged.
// One shared phase between kick and response gives an intentional cross-lane
// collision; two quiet between-root pickups add velocity contrast without
// increasing the fundamental density or destroying each prime-degree pattern.
function studyAccentRoot(phase,velocity){
 const angle=2*Math.PI*(((phase%1)+1)%1);
 const a=Number(Math.cos(angle).toPrecision(12)),b=Number(Math.sin(angle).toPrecision(12));
 return {a:Math.abs(a)<1e-11?0:a,b:Math.abs(b)<1e-11?0:b,n:1,velocity};
}
for(const study of EXPERIMENTAL_STUDIES){
 const tracksForStudy=study.degrees.map((degree,i)=>{
  const arg=2*Math.PI*degree*study.offs[i],a=Number(Math.cos(arg).toPrecision(12)),b=Number(Math.sin(arg).toPrecision(12));
  const t=P(Math.abs(a)<1e-11?0:a,Math.abs(b)<1e-11?0:b,degree,study.sounds[i]);
  t.gain=study.acc[i];if(study.euclidean&&i===3)t.euclidean={...study.euclidean};
  return t;
 });
 // The first kick is already a mathematical root. Do not double-trigger it.
 // Add exactly the same phase to lane 2 as a soft response: different lanes
 // can sound together, while a union within any single lane deduplicates.
 const anchor=study.offs[0];
 tracksForStudy[1].layers.push(studyAccentRoot(anchor,.7));
 // Halfway between adjacent base roots is guaranteed not to be a base root,
 // so these are genuine quieter pickups rather than ineffective gain labels.
 tracksForStudy[0].layers.push(studyAccentRoot(anchor+1/(2*study.degrees[0]),.46));
 tracksForStudy[1].layers.push(studyAccentRoot(study.offs[1]+1/(2*study.degrees[1]),.38));
 PRESETS.push({id:study.id,category:study.category,name:study.name,bpm:study.bpm,tracks:tracksForStudy,
   character:study.character,
   mathNote:study.mathNote+' A shared kick/response phase and two half-step single-root ghost accents add measured contrast without changing the original root families.'});
}

// Separately curated song studies are user-provided interpretations, not audio
// recordings or claimed exact transcriptions. The original 50 catalog entries
// remain unchanged for the historical diversity/source audit.
const SONG_EXAMPLES=Object.freeze([
 {id:'prodigy-boom-boom-tap-study',category:'songs',
  name:'Prodigy Boom Boom Tap (study)',
  displayName:'Prodigy · Boom Boom Tap (Rhythm Study)',
  bpm:160,bars:1,
  character:'User-supplied, one-bar electronic breakbeat study: kick accents, ghost snare, steady eighth-note hats and Reese bass.',
  mathNote:'All events are exact complex-root phases. This educational reconstruction is not an official or verified transcription of any recording.',
  tracks:[
   {...P(1,0,1,'kick',[
    {a:-0.382683432365,b:0.923879532511,n:1,velocity:0.45},
    {a:-0.707106781187,b:-0.707106781187,n:1,velocity:0.9},
    {a:0.707106781187,b:-0.707106781187,n:1,velocity:0.42}
   ]),cycleBars:1,operation:'union',gain:0.85},
   {...P(-1,0,2,'snare',[
    {a:-0.923879532511,b:0.382683432365,n:1,velocity:0.28},
    {a:0.923879532511,b:-0.382683432365,n:1,velocity:0.32}
   ]),cycleBars:1,operation:'union',gain:0.62},
   {...P(1,0,8,'hat'),cycleBars:1,operation:'union',gain:0.22},
   {...P(1,0,1,'reese',[
    {a:0.382683432365,b:0.923879532511,n:1,velocity:0.52},
    {a:-0.707106781187,b:-0.707106781187,n:1,velocity:0.78},
    {a:0.382683432365,b:-0.923879532511,n:1,velocity:0.55}
   ]),cycleBars:1,operation:'union',gain:0.3}
  ]
 }
]);
const BROWSE_PRESETS=Object.freeze([...PRESETS,...SONG_EXAMPLES]);

// These six genre-diverse grooves remain real canonical mathematical presets.
// Curated browsing adds a view, never a second preset-loading algorithm.
const GROOVE_IDS=Object.freeze(['berlin-bass-wall','concrete','shaft','dust','iron','bossa-classic']);
const GROOVE_LABELS=Object.freeze({
 'berlin-bass-wall':'01 · Bass Wall · relentless kick / deep rumble',
 'concrete':'02 · Drive · clap and rolling bass',
 'shaft':'03 · Machinery · snare, hats and toms',
 'dust':'04 · Half-light · sparse bass and open hats',
 'iron':'05 · Peak · relentless acid pressure',
 'bossa-classic':'06 · Acoustic · bongo and cross-stick'
});
// One visible Category picker and one Preset picker. Source categories remain
// unchanged for sample routing and old JSON; only the browser groups them.
const PRESET_CATEGORIES=Object.freeze({
 grooves:'Featured Grooves',bunker:'Bunker Techno',hardhouse:'Hard House',
 acid:'Acid / 303',hardcore:'Hardcore / Gabber',dnb:'Drum & Bass',
 jungle:'Jungle',brazil:'Brazilian & Acoustic',other:'House & Dub',
 poly:'Polyrhythms',experimental:'Mathematical Experiments',songs:'Song Examples'
});
const categoryForPreset=preset=>preset.category;
const inBrowse=(preset,category)=>category==='grooves'
 ? GROOVE_IDS.includes(preset.id):preset.category===category;
const MATH_PRESET_RATIOS=Object.freeze({
 minimal:'5:7', 'schranz-machinery':'7:9', 'eleven-against-seven':'7:11',
 'acid-singularity':'11:13', 'industrial-fracture':'5:7:11',
 'acid-reactor':'3:5:7:11', 'complex-roots-overload':'7:11:13:17',
 'terror-geometry':'4:7:9:13'
});
const presetLabel=(preset,category)=>category==='grooves'?GROOVE_LABELS[preset.id]:
 MATH_PRESET_RATIOS[preset.id]
 ? MATH_PRESET_RATIOS[preset.id]+' · '+preset.name
 : preset.displayName||preset.name;
const $=id=>document.getElementById(id);
// Wheel changes are opt-in: only a clicked/focused input consumes scrolling.
// Native keyboard and pointer behavior stays intact, as does page scrolling
// everywhere outside the focused control.
function enableFocusedWheel(input,onStep=null){
 input.title=(input.title?input.title+'. ':'')+'Click to focus, then scroll to adjust';
 input.addEventListener('wheel',e=>{
  if(document.activeElement!==input||input.disabled||e.ctrlKey||!e.deltaY)return;
  e.preventDefault();
  const direction=e.deltaY<0?1:-1;
  if(onStep){onStep(direction);return}
  const step=Number(input.step)||1,old=Number(input.value);
  if(!Number.isFinite(old))return;
  const min=input.min!==''?Number(input.min):-Infinity;
  const max=input.max!==''?Number(input.max):Infinity;
  const next=Math.max(min,Math.min(max,Number((old+direction*step).toFixed(8))));
  if(next===old)return;
  input.value=String(next);
  input.dispatchEvent(new Event('input',{bubbles:true}));
 },{passive:false});
}

const canvas=$('orbitCanvas'), ctx=canvas.getContext('2d');
const orbitInstructions=canvas.getAttribute('aria-label');
let tracks=[], selectedTrack=0, bpm=146, cycleBars=1, volume=.65, activePresetId='berlin-bass-wall',activeCategory='bunker',browseCategory='poly';
let presetModified=false,importedProjectName=null;
const OUTPUT_CHAIN_COMPENSATION=0.005; // measured 2x waveshaper group delay; preserve accurate beat onsets
let playing=false,pausedPhase=0,beatEpoch=0,scheduledUntil=0,timerId=null,windowStartBar=0;
let transportWanted=false,transportTicket=0,pauseBarrier=Promise.resolve();
let schedulerIntervalsCreated=0,schedulerIntervalsCleared=0;
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
function rootPhases({a,b,n}){return RhythmMath.rootPhases(a,b,n)}
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
 if(track.operation==='intersection'){
  // True intersection of ALL explicitly supplied sets, not base ∩ union(extras).
  return merged.filter(event=>
    event.sources.some(s=>s.kind==='base')&&
    (track.layers||[]).every((_,index)=>event.sources.some(s=>s.kind==='additional'&&s.sourceIndex===index))&&
    (!track.euclidean||event.sources.some(s=>s.kind==='euclidean'))
  );
 }
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
  euclidean:ev.sources.some(s=>s.kind==='euclidean'),
  shared:ev.sources.length>1
 }));
 return {base,added,merged,overlaps:merged.filter(v=>v.shared).length};
}
let selectedRootIndex=0;
let inspectedRoot=null;
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
 return `${fmtMath(t.a)}${t.b<0?' - ':' + '}${fmtMath(Math.abs(t.b))}i`;
}
// Compact rounded values are display-only, not edits to the canonical complex numbers.
function compactComplexLaTeX(t){
 const n=v=>{
  if(Math.abs(v)<1e-12)return '0';
  if(Math.abs(v)>=1e5||Math.abs(v)<.0001){
   const [a,e]=v.toExponential(2).split('e');
   return a+String.raw`\cdot10^{${Number(e)}}`;
  }
  return String(Number(v.toPrecision(4)));
 };
 return n(t.a)+(t.b<0?' - ':' + ')+n(Math.abs(t.b))+'i';
}
function renderLaneEquation(node,track){
 const op=track.operation==='intersection'?String.raw`\cap`:String.raw`\cup`;
 const terms=[String.raw`R_{${track.n}}\!\left(${compactComplexLaTeX(track)}\right)`,
  ...track.layers.map(layer=>String.raw`R_{${layer.n}}\!\left(${compactComplexLaTeX(layer)}\right)`)];
 if(track.euclidean)terms.push(String.raw`E(${track.euclidean.k},${track.euclidean.n})`);
 node.replaceChildren();
 node.setAttribute('aria-label','Root sets with numeric complex coordinates');
 node.title='Displayed coordinates are rounded; edit fields and project JSON keep full precision.';
 for(let j=0;j<terms.length;j++){
  const term=document.createElement('span');
  term.className='lane-math-term';
  renderTeX(term,(j?String.raw`\;${op}\;`:'')+terms[j]);
  node.append(term);
 }
 const width=node.getBoundingClientRect().width;
 if(width>0)for(const term of node.children){
  for(let px=18;px>=14;px--){
   term.style.fontSize=px+'px';
   if(term.scrollWidth<=width+1)break;
  }
 }
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
 renderTeX('argMathLabel',String.raw`\arg(z)`);
 renderTeX('mathExampleUnion',String.raw`R_4(1)\cup R_3(1)`);
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
 renderTeX('selectedRootFormula',String.raw`w_{${k}}\approx\sqrt[${t.n}]{${fmtMath(r)}}\,e^{i\frac{${fmtMath(theta)}+2\pi\cdot ${k}}{${t.n}}}`);
 renderTeX('rootPhaseFormula',String.raw`\operatorname{phase}(w_{${k}})=\frac{\theta+2\pi\cdot${k}}{2\pi\cdot${t.n}}\bmod 1\approx${fmtMath(p)}`);
}
// Root inspection follows its actual generator when n, angle or layer geometry
// changes. A compound event keeps distinct provenance, not a fake base root.
function inspectionPhase(t,selection){
 if(!t||!selection||!Number.isInteger(selection.index))return undefined;
 if(selection.kind==='additional'){
  const layer=t.layers[selection.sourceIndex];
  return layer?rootPhases(layer)[selection.index]:undefined;
 }
 if(selection.kind==='euclidean'){
  const e=t.euclidean;
  return e?RhythmMath.euclidean(e.k,e.n,e.rotation)[selection.index]:undefined;
 }
 return rootPhases(t)[selection.index];
}
// Draw one mathematical selection consistently on the three composition
// strips. These dots are read-only representations of the canonical events.
function syncInspectedPhaseMarks(phase){
 const valid=Number.isFinite(phase);
 for(const mark of document.querySelectorAll('.composition-strips .phase-mark')){
  const p=Number(mark.dataset.phase),d=Math.abs(p-phase);
  const selected=valid&&Math.min(d,1-d)<1e-6;
  mark.classList.toggle('is-inspected',selected);
 }
}
// A timeline event identifies one specific recurrence; ring/phase-strip
// selection defaults to the first occurrence. Retain a selected absolute bar
// only while it is still an actual occurrence of this canonical source phase.
function inspectionOccurrence(track,selection,phase){
 const firstBars=phase*(track.cycleBars||1);
 const requested=selection?.atBars;
 const repeat=Number.isFinite(requested)?requested/(track.cycleBars||1)-phase:NaN;
 const selected=Number.isFinite(requested)&&requested>=0&&
  Math.round(repeat)>=0&&Math.abs(repeat-Math.round(repeat))<1e-6;
 return {absoluteBars:selected?requested:firstBars,selected};
}
// A mathematical coincidence must occur at the SAME absolute bar position,
// not merely at the same normalized angle on rings with different lengths.
function coincidentLaneEvents(absoluteBars,sourceLane){
 const result=[];
 for(let lane=0;lane<tracks.length;lane++){
  if(lane===sourceLane)continue;
  const t=tracks[lane],length=t.cycleBars||1;
  const target=((absoluteBars/length)%1+1)%1;
  const event=events(t).find(e=>{
   const delta=Math.abs(e.phase-target);
   return Math.min(delta,1-delta)<1e-6;
  });
  if(event)result.push({lane,phase:event.phase,muted:t.muted});
 }
 return result;
}
// A selected angular root may appear several times in the visible four-bar
// window. Match the lane AND canonical phase, not screen position or color.
function syncInspectedWindowMarks(phase=NaN,lane=-1,atBars=NaN){
 for(const dot of document.querySelectorAll('#windowTimeline .window-mark')){
  const current=Number(dot.dataset.phase),delta=Math.abs(current-phase);
  const selected=Number.isFinite(phase)&&Number(dot.dataset.lane)===lane&&
   Math.min(delta,1-delta)<1e-6;
  dot.classList.toggle('window-inspected',selected);
  dot.classList.toggle('window-occurrence-focused',selected&&Number.isFinite(atBars)&&
   Math.abs(Number(dot.dataset.absoluteBars)-atBars)<1e-6);
 }
}
function renderRootInspection(){
 const panel=$('rootInspection'),selection=inspectedRoot;
 if(!panel)return;
 const t=selection&&tracks[selection.lane];
 const phase=inspectionPhase(t,selection);
 const match=Number.isFinite(phase)?events(t).find(ev=>{
  const gap=Math.abs(ev.phase-phase);
  return Math.min(gap,1-gap)<1e-6;
 }):null;
 const sourceKind=selection?.kind||'base';
 const sourceValid=!!match?.sources.some(s=>s.kind===sourceKind&&s.index===selection.index&&
  (sourceKind!=='additional'||s.sourceIndex===selection.sourceIndex));
 if(!Number.isFinite(phase)||selection.lane!==selectedTrack||!sourceValid){
  panel.hidden=true;
  syncInspectedPhaseMarks(NaN);
  syncInspectedWindowMarks();
  if(selection){inspectedRoot=null;$('rootInspectionAnnouncement').textContent='Root inspection cleared';}
  return;
 }
 const bars=t.cycleBars||1;
 const occurrence=inspectionOccurrence(t,selection,phase);
 // A live root or loop-length edit can make the previously inspected
 // absolute timestamp invalid. Fall back to the first valid occurrence.
 if(!occurrence.selected&&Number.isFinite(selection.atBars))delete selection.atBars;
 const elapsedBars=occurrence.absoluteBars;
 const loopBar=Math.floor(((elapsedBars%bars)+bars)%bars)+1;
 const beat=1+4*(elapsedBars-Math.floor(elapsedBars));
 const seconds=elapsedBars*240/bpm;
 const simultaneous=coincidentLaneEvents(elapsedBars,selection.lane);
 const simultaneousText=simultaneous.length
  ?'Same-time mathematical events: '+simultaneous.map(v=>
     'Lane '+(v.lane+1)+(v.muted?' (muted)':'')).join(' · ')
  :occurrence.selected?'No other lane has a hit at this selected occurrence.':
   'No other lane has a hit at this first occurrence.';
 const kinds=[...new Set((match?.sources||[]).map(s=>s.kind==='base'?'base':
  s.kind==='additional'?'family '+(s.sourceIndex+1):'Euclidean'))];
 let description='root '+(selection.index+1)+'/'+t.n;
 if(selection.kind==='additional')description='added root '+(selection.index+1)+'/'+t.layers[selection.sourceIndex].n+' · family '+(selection.sourceIndex+1);
 if(selection.kind==='euclidean')description='Euclidean hit '+(selection.index+1)+'/'+RhythmMath.euclidean(t.euclidean.k,t.euclidean.n,t.euclidean.rotation).length;
 if(kinds.length>1)description+=' · shared: '+kinds.join(' + ');
 $('rootInspectionLane').textContent='Lane '+(selection.lane+1)+' · '+description;
 renderTeX('rootInspectionAngle','\\theta_{'+selection.index+'}='+window.RootAngleInfo.piTeX(phase*TAU));
 $('rootInspectionTime').textContent='Phase '+Number((phase*100).toFixed(3))+
  '% · loop bar '+loopBar+'/'+bars+' · beat '+Number(beat.toFixed(3))+
  '/4 · '+(occurrence.selected?
   'selected occurrence · absolute bar '+(elapsedBars+1).toFixed(3):
   'first occurrence')+' · '+seconds.toFixed(3)+' s after start';
 $('rootInspectionCoincidences').textContent=simultaneousText;
 panel.style.setProperty('--root-inspection-color',COLORS[selection.lane]);
 panel.hidden=false;
 $('rootInspectionAnnouncement').textContent=$('rootInspectionLane').textContent+
  '. Angle '+Number((phase*360).toFixed(3))+' degrees. '+$('rootInspectionTime').textContent+
  '. '+simultaneousText;
 syncInspectedPhaseMarks(phase);
 syncInspectedWindowMarks(phase,selection.lane,occurrence.selected?elapsedBars:NaN);
}
// Keyboard inspection walks the canonical visible set, including muted lanes.
// It never edits the root generator, the audio clock, or the preset identity.
function inspectNeighborEvent(direction,edge=null){
 const lane=selectedTrack,t=tracks[lane],all=events(t);
 if(!all.length){inspectedRoot=null;renderRootInspection();return;}
 const phase=inspectedRoot?.lane===lane?inspectionPhase(t,inspectedRoot):undefined;
 const at=Number.isFinite(phase)?all.findIndex(ev=>{
  const d=Math.abs(ev.phase-phase);return Math.min(d,1-d)<1e-6;
 }): -1;
 const next=edge==='first'?0:edge==='last'?all.length-1:
  at<0?(direction<0?all.length-1:0):(at+direction+all.length)%all.length;
 inspectCanonicalEvent(all[next]);
}
// The result strip has one large 48px interaction target rather than tiny
// per-marker buttons. It uses the same events and provenance as the audio clock.
function inspectCanonicalEvent(event,atBars){
 if(!event)return;
 const source=event.sources.find(s=>s.kind==='base')||event.sources[0];
 inspectedRoot={lane:selectedTrack,kind:source.kind,index:source.index,sourceIndex:source.sourceIndex};
 if(Number.isFinite(atBars))inspectedRoot.atBars=atBars;
 if(source.kind==='base'){selectedRootIndex=source.index;updateSelectedRootMath();}
 renderRootInspection();
}
function inspectResultPhase(phase){
 const all=events(tracks[selectedTrack]);
 if(!all.length)return;
 const nearest=all.reduce((best,event)=>{
  const delta=Math.abs(event.phase-phase),distance=Math.min(delta,1-delta);
  return distance<best.distance?{event,distance}:best;
 },{event:null,distance:Infinity});
 inspectCanonicalEvent(nearest.event);
}
function principalArg(b,a){return RhythmMath.principalArg(b,a)}
function fmt(n){
 if(n===0)return '0';
 const x=Math.abs(n);
 if(x<.001||x>=1e6)return n.toExponential(3).replace(/e\+?/,'e').replace('e-','e−');
 return Number(n.toPrecision(6)).toString().replace('-', '−');
}
function fmtMath(n){
 if(n===0)return '0';
 if(Math.abs(n)<.001||Math.abs(n)>=1e6){
  const [m,e]=n.toExponential(3).split('e');
  return Number(m)+'\\times10^{'+Number(e)+'}';
 }
 return Number(n.toPrecision(6)).toString();
}
function inputNumber(n){return n===0?'0':Number(n.toPrecision(12)).toString()}
function complexDisplay(t){return `${fmt(t.a)} ${t.b<0?'−':'+'} ${fmt(Math.abs(t.b))}i`}
function hitLabel(n){return `${n} ${n===1?'hit':'hits'}`}
function applyRotation(t,ang){const radius=Math.hypot(t.a,t.b);if(!radius)return false;const snap=x=>Math.abs(x)<radius*1e-12?0:Number(x.toPrecision(10));t.a=snap(radius*Math.cos(ang));t.b=snap(radius*Math.sin(ang));return true}
// An explicit reproducible index for the eight mandatory mathematical relations.
// Ratios describe the foreground degrees; accompaniment can include other root sets.
function renderPresets(){
 $('presetCount').textContent=`${BROWSE_PRESETS.length} rhythm examples · ${Object.keys(PRESET_CATEGORIES).length} categories`;
 $('categorySelect').value=browseCategory;
 const select=$('presetSelect');select.replaceChildren();
 const selected=BROWSE_PRESETS.find(p=>p.id===activePresetId);
 const inBrowseCategory=selected?inBrowse(selected,browseCategory):false;
 if(activePresetId&&!inBrowseCategory){
  const option=document.createElement('option');
  option.value='__browse__';option.textContent='Choose a preset in this category';
  option.disabled=true;select.append(option);
 }else if(!activePresetId){
  const option=document.createElement('option');option.value='__custom__';
  option.textContent=importedProjectName||'Custom rhythm';select.append(option);
 }
 for(const p of BROWSE_PRESETS.filter(p=>inBrowse(p,browseCategory))){
  const option=document.createElement('option');option.value=p.id;
  option.textContent=presetLabel(p,browseCategory)+
    (p.id===activePresetId&&presetModified?' · Modified':'');
  select.append(option);
 }
 select.value=inBrowseCategory?activePresetId:activePresetId?'__browse__':'__custom__';
 const description=selected?
  (presetModified?'Modified version of '+selected.name+'. ':'')+
  (selected.character&&selected.mathNote?`${selected.character} Mathematical structure: ${selected.mathNote}`:''):
  (importedProjectName?'Imported project: '+importedProjectName:'');
 $('presetInfo').textContent=selected&&!inBrowseCategory?
  `Currently loaded: ${selected.name}${presetModified?' · Modified':''}. Switching categories does not change the rhythm. Select an example to load it. `+description:
  description;
}

function parseEditorRadians(raw){
 const value=RhythmMath.parseAngle(String(raw).replace(/π/g,'pi').replace(/−/g,'-'));
 if(!Number.isFinite(value)||Math.abs(value)>1e6)throw Error('Angle must be finite and within 1,000,000 radians');
 return value;
}
function formatEditorRadians(theta){
 const ratio=theta/Math.PI;
 for(const d of [1,2,3,4,6,8,12]){
  const n=Math.round(ratio*d);
  if(n===0&&Math.abs(ratio)>1e-11)continue;
  if(Math.abs(n/d-ratio)<1e-9){
   if(n===0)return '0';
   const gcd=(a,b)=>b?gcd(b,a%b):a,divisor=gcd(Math.abs(n),d),p=n/divisor,q=d/divisor;
   return (p===1?'':p===-1?'-':String(p))+'π'+(q===1?'':'/'+q);
  }
 }
 return inputNumber(theta);
}
function syncPrimaryAngles(i,fields=null){
 const track=tracks[i],p=RhythmMath.polarOf(track.a,track.b);
 const radians=fields?.rad??$('trackAngleRad'+i),degrees=fields?.deg??$('trackAngleDeg'+i),
  degree=fields?.degree??$('trackN'+i);
 if(radians&&document.activeElement!==radians){
  radians.value=p.theta===null?'':formatEditorRadians(p.theta);
  radians.placeholder=p.theta===null?'undefined for z=0':'e.g. 2π/3';
  radians.setAttribute('aria-invalid','false');
 }
 if(degrees&&document.activeElement!==degrees){
  degrees.value=p.theta===null?'':inputNumber(p.theta*180/Math.PI);
  degrees.placeholder=p.theta===null?'undefined for z=0':'e.g. 120';
  degrees.setAttribute('aria-invalid','false');
 }
 if(degree&&document.activeElement!==degree)degree.value=String(track.n);
}
function fitRootMath(id,max=18,min=16){
 const el=$(id);if(!el)return;
 const katex=el.querySelector('.katex-html');
 if(!katex)return;
 for(let px=max;px>=min;px--){
  el.style.fontSize=px+'px';
  if(katex.scrollWidth<=el.clientWidth+1)break;
 }
}
function renderRootRule(){
 const track=tracks[selectedTrack];if(!track)return;
 const model=window.RootAngleInfo.model(track.a,track.b,track.n);
 document.querySelector('.root-rule')?.style.setProperty('--selected-lane-color',COLORS[selectedTrack]);
 renderTeX('rootRuleEquation','\\theta_k=\\frac{\\theta+2\\pi k}{n}\\pmod{2\\pi}',true);
 if(model.zero)renderTeX('rootRuleValues','z=0,\\quad \\arg(0)\\text{ is undefined}');
 else renderTeX('rootRuleValues','\\theta='+window.RootAngleInfo.piTeX(model.theta)+
  '\\,('+Number(model.thetaDeg.toFixed(3))+'^\\circ),\\quad n='+track.n+
  ',\\quad k=0,\\ldots,'+(track.n-1));
 renderTeX('rootRuleSpacing','\\Delta='+window.RootAngleInfo.piTeX(model.spacing)+
  '\\,('+Number(model.spacingDeg.toFixed(3))+'^\\circ)');
 fitRootMath('rootRuleEquation',23,16);
 fitRootMath('rootRuleValues',18,16);
 fitRootMath('rootRuleSpacing',18,16);
 // Mathematical symbols in educational explanations must be KaTeX+MathML
 // just like the reference equations: no text-only δ/n or 2π/n shortcuts.
 const caption=$('rootRuleCaption');
 caption.replaceChildren();
 const captionText=value=>caption.append(document.createTextNode(value));
 const captionMath=latex=>{
  const span=document.createElement('span');span.className='math-notation';
  renderTeX(span,latex);caption.append(span);
 };
 if(model.zero){
  captionText('For ');captionMath(String.raw`z=0`);
  captionText(', ');captionMath(String.raw`\arg(0)`);
  captionText(' is undefined and there are no rhythm events.');
 }else{
  captionText('Changing the argument by ');captionMath(String.raw`\delta`);
  captionText(' rotates each root by ');captionMath(String.raw`\frac{\delta}{n}`);
  captionText('; spacing stays ');captionMath(String.raw`\frac{2\pi}{n}`);
  captionText('. The circle represents time, not ');captionMath(String.raw`|z|`);
  captionText('.');
 }
 window.RootAngleInfo.render(model,{
  panel:$('rootRuleInfoPanel'),diagram:$('rootRuleDiagram'),input:$('rootRuleInput'),
  delta:$('rootRuleDelta'),formula:$('rootRuleFormula'),list:$('rootRuleAngleList'),
  lane:selectedTrack
 },renderTeX);
}

function syncVisibleInputs(i) {
 const t=tracks[i],mode=laneModes[i],unit=laneUnits[i],polar=RhythmMath.polarOf(t.a,t.b);
 const values=mode==='cart'?{a:t.a,b:t.b,n:t.n}:{r:polar.r,theta:polar.theta===null?null:polar.theta*(unit==='deg'?180/Math.PI:1),n:t.n};
 for(const [k,v] of Object.entries(values)){
  const el=$('track'+k[0].toUpperCase()+k.slice(1)+i);if(!el)continue;
  if(document.activeElement!==el)el.value=v===null?'':inputNumber(v);
  if(k==='theta'){el.disabled=v===null;el.placeholder=v===null?'undefined':''}
 }
 syncPrimaryAngles(i);
}

function updateLaneAlt(i) {
 const el=$('laneAlt'+i);if(!el)return;
 const t=tracks[i],polar=RhythmMath.polarOf(t.a,t.b);
 renderTeX(el,polar.theta===null?
  'z=0,\\quad \\arg(0)\\text{ is undefined}':
  'z='+complexLaTeX(t)+',\\quad |z|\\approx'+fmtMath(polar.r));
}
function buildLaneFields(row,t,i) {

 const angular=document.createElement('div');angular.className='angle-fields';
 const title=document.createElement('div');title.className='angle-title';title.textContent='Complex argument θ';angular.append(title);
 const addInput=(id,name)=>{
  const label=document.createElement('label');label.textContent=name;label.htmlFor=id;
  const el=document.createElement('input');el.id=id;el.type='text';el.inputMode='decimal';
  el.autocomplete='off';el.spellcheck=false;el.setAttribute('aria-label','Lane '+(i+1)+' '+name);
  el.setAttribute('aria-invalid','false');label.append(el);angular.append(label);return el;
 };
 const rad=addInput('trackAngleRad'+i,'Radians · π allowed');
 const deg=addInput('trackAngleDeg'+i,'Degrees · °');
 rad.maxLength=80;deg.maxLength=32;
 // Both fields step through the SAME mathematical angle: 1° = π/180 rad.
 // A text field is required to retain symbolic values such as 2π/3.
 for(const [input,isDegrees] of [[rad,false],[deg,true]]){
  enableFocusedWheel(input,direction=>{
   const base=Math.atan2(t.b,t.a)||0;
   const angle=base+direction*Math.PI/180;
   input.value=isDegrees?inputNumber(angle*180/Math.PI):formatEditorRadians(angle);
   input.dispatchEvent(new Event('input',{bubbles:true}));
  });
 }
 const nLabel=document.createElement('label');nLabel.className='root-degree';nLabel.textContent='Root degree n';
 const nInput=document.createElement('input');nInput.id='trackN'+i;nInput.type='number';nInput.min='1';nInput.max='64';
 nInput.step='1';nInput.inputMode='numeric';nInput.value=String(t.n);
 nInput.setAttribute('aria-label','Lane '+(i+1)+' root degree n');
 enableFocusedWheel(nInput);
 nLabel.append(nInput);angular.append(nLabel);row.append(angular);
 const editAngle=(input,isDegrees)=>{
  const raw=input.value.trim(),numeric=Number(raw);
  let theta;
  try{
   if(isDegrees){
    if(raw===''||!Number.isFinite(numeric)||Math.abs(numeric)>1e8)throw Error('Enter a finite degree value');
    theta=numeric*Math.PI/180;
   }else theta=parseEditorRadians(raw);
  }catch(_){input.setAttribute('aria-invalid','true');return}
  input.setAttribute('aria-invalid','false');
  // Changing an argument preserves its original nonzero modulus.
   // A zero complex value has undefined argument; an explicit angle creates a unit value.
   const modulus=Math.hypot(t.a,t.b)||1;
   const z=RhythmMath.fromPolar(modulus,theta%(2*Math.PI));
   t.a=z.a;t.b=z.b;
  if(isDegrees)rad.value=formatEditorRadians(theta);
  else deg.value=inputNumber(theta*180/Math.PI);
  syncVisibleInputs(i);
  updateLaneStatus(i);
  if(selectedTrack===i)renderReadout();
  markCustom();
 };
 rad.addEventListener('input',()=>editAngle(rad,false));
 deg.addEventListener('input',()=>editAngle(deg,true));
 nInput.addEventListener('input',()=>{
  const n=Number(nInput.value),valid=nInput.value.trim()!==''&&Number.isInteger(n)&&n>=1&&n<=64;
  nInput.setAttribute('aria-invalid',String(!valid));if(!valid)return;
  t.n=n;updateLaneStatus(i);if(selectedTrack===i)renderReadout();
  if(magnified&&selectedTrack===i)refreshPlotZoom();
  markCustom();
 });
 nInput.addEventListener('change',()=>{if(nInput.getAttribute('aria-invalid')==='true'){
  nInput.value=String(t.n);nInput.setAttribute('aria-invalid','false');
 }});
 // Initial construction occurs before the card is connected to document.
 // Write both angle fields from canonical state using local references.
 syncPrimaryAngles(i,{rad,deg,degree:nInput});
 const advanced=document.createElement('details');advanced.className='advanced-coordinates';
 const advancedSummary=document.createElement('summary');advancedSummary.textContent='Advanced · Cartesian / legacy polar';
 advanced.append(advancedSummary);row.append(advanced);
 const modeBar=document.createElement('div');modeBar.className='lane-modes';modeBar.setAttribute('role','group');modeBar.setAttribute('aria-label','Coordinate form for lane '+(i+1));
 const cart=document.createElement('button'),polar=document.createElement('button'),unit=document.createElement('button');
 for(const [btn,label,mode] of [[cart,'Cartesian','cart'],[polar,'Polar','polar']]){
  btn.type='button';btn.textContent=label;btn.className='mode-button';btn.setAttribute('aria-pressed',String(laneModes[i]===mode));
  btn.addEventListener('click',()=>{laneModes[i]=mode;refresh();cart.setAttribute('aria-pressed',String(mode==='cart'));polar.setAttribute('aria-pressed',String(mode==='polar'))});
 }
 unit.type='button';unit.className='unit-button';unit.addEventListener('click',()=>{laneUnits[i]=laneUnits[i]==='rad'?'deg':'rad';refresh()});
 modeBar.append(cart,polar,unit);advanced.append(modeBar);
 const fields=document.createElement('div');fields.className='lane-fields';advanced.append(fields);
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
 wrap.append(input,apply);exp.append(wrap,error);advanced.append(exp);
 function refresh() {
  const mode=laneModes[i],value=RhythmMath.polarOf(t.a,t.b);
  fields.replaceChildren();unit.hidden=mode!=='polar';unit.textContent=laneUnits[i]==='rad'?'radians':'degrees';
  for(const key of (mode==='cart'?['a','b']:['r','theta'])){
   const label=document.createElement('label');
   label.textContent=key==='a'?'a · real':key==='b'?'b · imag':key==='n'?'n · degree':key==='r'?'r · modulus':laneUnits[i]==='rad'?'θ · radians':'θ · degrees';
   const el=document.createElement('input');el.type='number';el.step=key==='n'?'1':'any';el.inputMode=key==='n'?'numeric':'decimal';
   el.id='track'+key[0].toUpperCase()+key.slice(1)+i;
   const v=key==='a'?t.a:key==='b'?t.b:key==='n'?t.n:key==='r'?value.r:value.theta===null?null:value.theta*(laneUnits[i]==='deg'?180/Math.PI:1);
   el.value=v===null?'':inputNumber(v);el.disabled=key==='theta'&&value.theta===null;if(el.disabled)el.placeholder='undefined';
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
    syncPrimaryAngles(i);updateLaneStatus(i);if(selectedTrack===i)renderReadout();
    if(key==='n'&&magnified&&selectedTrack===i)refreshPlotZoom();
    markCustom();
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
  sound.value=t.sound;sound.addEventListener('change',e=>{t.sound=e.target.value;if(audio)loadSamples(prioritySampleKeys());if(i===selectedTrack){updateOrbitSummary();renderEditor()}if($('advancedSoundDetails').open&&soundLabLane===i)refreshSoundLab(true);markCustom()});
  const mute=document.createElement('button');mute.type='button';mute.className='lane-mute';mute.id='laneMute'+i;
  const updateMute=()=>{mute.title=t.muted?'Unmute':'Mute';mute.textContent=t.muted?'×':'♫';mute.setAttribute('aria-pressed',String(t.muted));mute.setAttribute('aria-label',(t.muted?'Unmute':'Mute')+' lane '+(i+1));row.classList.toggle('muted',t.muted)};
  updateMute();mute.addEventListener('click',()=>{t.muted=!t.muted;updateMute();if(i===selectedTrack)updateOrbitSummary();if(inspectedRoot)renderRootInspection();markCustom()});
  head.append(pick,sound,mute);row.append(head);
  // Always-visible instrument gain in each lane. The selected-lane advanced
  // editor keeps a synchronized secondary mirror for backward compatibility.
  const gainRow=document.createElement('label');gainRow.className='lane-volume';
  gainRow.htmlFor='laneGain'+i;
  const gainName=document.createElement('span');gainName.textContent='Instrument volume';
  const gainReadout=document.createElement('output');gainReadout.id='laneGainValue'+i;
  gainReadout.htmlFor='laneGain'+i;gainReadout.textContent=Math.round((t.gain??1)*100)+'%';
  const gainSlider=document.createElement('input');gainSlider.type='range';
  gainSlider.id='laneGain'+i;gainSlider.min='5';gainSlider.max='150';gainSlider.step='1';
  gainSlider.value=String(Math.round((t.gain??1)*100));
  gainSlider.setAttribute('aria-label','Instrument volume, lane '+(i+1));
  enableFocusedWheel(gainSlider);
  gainSlider.addEventListener('input',()=>{
   t.gain=Number(gainSlider.value)/100;
   gainReadout.textContent=gainSlider.value+'%';
   const mirror=$('laneGain'),mirrorOutput=$('selectedGainValue');
   if(i===selectedTrack&&mirror){mirror.value=String(t.gain);if(mirrorOutput)mirrorOutput.textContent=t.gain.toFixed(2);}
   markCustom();
  });
  gainRow.append(gainName,gainReadout,gainSlider);row.append(gainRow);
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
   updateLaneStatus(i);
   if(!playing)pausedPhase=((pausedPhase/cycleSeconds())%1+1)%1;
   else if(audio){cancelVoices();scheduledUntil=audio.currentTime+.006;}
   markCustom(false);
  });
  lengthInput.addEventListener('change',()=>{if(lengthInput.getAttribute('aria-invalid')==='true'){lengthInput.value=String(t.cycleBars);lengthInput.removeAttribute('aria-invalid')}});
  length.append(lengthLabel,lengthInput);row.append(length);
  const foot=document.createElement('div');foot.className='lane-bottom';
  const eq=document.createElement('span');eq.className='lane-equation';eq.id='laneEq'+i;
  const count=document.createElement('span');count.className='lane-count';count.id='laneCount'+i;
  foot.append(eq,count);row.append(foot);wrap.append(row);updateLaneStatus(i);
 });
}
function updateOrbitSummary(){
 const t=tracks[selectedTrack];if(!t)return;
 const hits=events(t).length,bars=t.cycleBars||1;
 const description='Selected lane '+(selectedTrack+1)+' of 4, '+SOUNDS[t.sound]+
  ', '+hits+' visible '+(hits===1?'event':'events')+' in '+bars+' '+(bars===1?'bar':'bars')+
  (t.muted?', muted':'')+'. ';
 canvas.setAttribute('aria-label',description+orbitInstructions);
}
function updateLaneStatus(i) {
 const t=tracks[i];if(!t)return;
 const eq=$('laneEq'+i),count=$('laneCount'+i);
 if(eq)renderLaneEquation(eq,t);
 if(count)count.textContent=hitLabel(events(t).length)+' / '+(t.cycleBars===1?'bar':t.cycleBars+' bars');
 updateLaneAlt(i);
 if(i===selectedTrack){updateOrbitSummary();renderRootRule();renderRootInspection()}
 else if(inspectedRoot?.lane===selectedTrack)renderRootInspection();
}
function chooseTrack(i,fromTrackList=false) {
 if(i!==selectedTrack)inspectedRoot=null;
 selectedTrack=Math.max(0,Math.min(3,i));
 document.querySelectorAll('.lane').forEach((row,j)=>{
  row.classList.toggle('selected',j===selectedTrack);
  row.querySelector('.lane-select')?.setAttribute('aria-pressed',String(j===selectedTrack));
 });
 renderEditor();
 updateOrbitSummary();
 if(magnified)refreshPlotZoom();
 if(fromTrackList&&$('compositionPanel').open)$('compositionHeading').focus({preventScroll:true});
}
// Waveform editing is deliberately optional: a single bottom details panel.
// The active waveform lane is NOT coupled to the mathematical selection.
let soundLabLane=0,soundLabTrackRef=null,soundLabSound='',soundLabTimer=null,soundLabToken=0;
const soundLabSampleCache=new Map();
function renderSoundControls(){
 const basic=$('laneGainControls');if(!basic)return;basic.replaceChildren();
 const t=tracks[selectedTrack];if(!t)return;
 const h=document.createElement('h4');h.textContent='Lane volume';basic.append(h);
 const row=document.createElement('label');row.className='patch-control';
 const label=document.createElement('span');label.textContent='Lane gain';
 const output=document.createElement('output');output.id='selectedGainValue';output.textContent=(t.gain??1).toFixed(2);
 const input=document.createElement('input');input.type='range';input.id='laneGain';input.min='.05';input.max='1.5';input.step='.01';input.value=String(t.gain??1);input.setAttribute('aria-label','Selected lane gain');
 enableFocusedWheel(input);
 input.addEventListener('input',()=>{
  t.gain=Number(input.value);output.textContent=t.gain.toFixed(2);
  const slider=$('laneGain'+selectedTrack),value=$('laneGainValue'+selectedTrack);
  if(slider)slider.value=String(Math.round(t.gain*100));
  if(value)value.textContent=Math.round(t.gain*100)+'%';
  markCustom();
 });
 row.append(label,output,input);basic.append(row);
}
function refreshSoundLab(force=false){
 const panel=$('advancedSoundDetails');if(!panel?.open)return;
 const t=tracks[soundLabLane];if(!t)return;
 const picker=$('soundLabLane'),wrap=$('patchControls'),reset=$('soundLabReset');
 for(let i=0;i<4;i++){
  const option=picker.options[i];
  option.textContent='Lane '+(i+1)+' · '+SOUNDS[tracks[i].sound];
 }
 picker.value=String(soundLabLane);
 const defaults=window.RhythmVoices?.definitions?.[t.sound];
 const changed=force||soundLabTrackRef!==t||soundLabSound!==t.sound;
 if(!changed)return;
 soundLabTrackRef=t;soundLabSound=t.sound;
 wrap.replaceChildren();wrap.hidden=!defaults;reset.hidden=!defaults;
 if(defaults){
  reset.disabled=!t.patch;
  const sub=document.createElement('h4');sub.textContent='Shape '+SOUNDS[t.sound];wrap.append(sub);
  const p=document.createElement('p');p.className='small-explain';
  p.textContent='These oscillator, filter and envelope controls affect this lane only. The graph above is re-rendered from the actual synthesis engine.';wrap.append(p);
  const grid=document.createElement('div');grid.className='patch-grid';
  const settings=[
   ['cutoff','Filter cutoff (Hz)',70,10000,10],
   ['q','Resonance',.2,25,.1],['decay','Decay (s)',.06,.8,.01],
   ['accent','Accent',0,1,.01],['slide','Slide (s)',0,.5,.01],
   ['drive','Saturation',.2,5,.1],['modulation','Pitch / FM modulation',0,5,.05],
   ['depth','Filter envelope',0,9000,50]
  ];
  const oscLabel=document.createElement('label');oscLabel.className='patch-osc';oscLabel.textContent='Oscillator waveform';
  const osc=document.createElement('select');osc.id='patchOsc';osc.setAttribute('aria-label','Synthesizer oscillator type');
  for(const type of ['sine','triangle','sawtooth','square']){
   const op=document.createElement('option');op.value=type;op.textContent=type;osc.append(op);
  }
  osc.value=t.patch?.osc||defaults.osc;
  osc.addEventListener('change',()=>{
   t.patch={...(t.patch||{}),osc:osc.value};
   reset.disabled=false;markCustom();scheduleSoundWavePreview();
  });
  oscLabel.append(osc);grid.append(oscLabel);
  for(const [key,title,min,max,step] of settings){
   const label=document.createElement('label');label.className='patch-control';
   const name=document.createElement('span');name.textContent=title;
   const out=document.createElement('output');const initial=t.patch?.[key]??defaults[key]??0;out.textContent=String(initial);
   const slider=document.createElement('input');slider.type='range';slider.id='patch'+key;slider.min=min;slider.max=max;slider.step=step;slider.value=initial;
   slider.setAttribute('aria-label',title);
   enableFocusedWheel(slider);
   slider.addEventListener('input',()=>{
    const value=Number(slider.value);
    t.patch={...(t.patch||{}),[key]:value};out.textContent=String(value);
    reset.disabled=false;markCustom();scheduleSoundWavePreview();
   });
   label.append(name,out,slider);grid.append(label);
  }
  wrap.append(grid);
 }
 scheduleSoundWavePreview();
}
// Shared fallback engine for the six synthesized voices with no recording or
// RhythmVoices definition. Live playback and the inspector use identical Web
// Audio oscillator/filter/envelope graphs; noise is one random realization.
function playNativeLegacy(ctx,out,sound,at,index=0,noiseBufferForLive=null){
 if(!['bass','reese','acid','surdo','agogo','tamborim'].includes(sound))return false;
 const envelope=(gain,peak,release,attack=.002)=>{
  gain.gain.setValueAtTime(.0001,at);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),at+attack);
  gain.gain.exponentialRampToValueAtTime(.0001,at+Math.max(release,attack+.01));
 };
 const oscillator=(start,end,type,peak,length)=>{
  const osc=ctx.createOscillator();osc.type=type;
  osc.frequency.setValueAtTime(start,at);
  if(end!==start)osc.frequency.exponentialRampToValueAtTime(Math.max(1,end),at+length);
  const amp=ctx.createGain();envelope(amp,peak,length);
  osc.connect(amp);amp.connect(out);osc.start(at);osc.stop(at+length+.025);
 };
 const noise=(length,peak,cutoff,type='highpass')=>{
  const source=ctx.createBufferSource();
  if(noiseBufferForLive)source.buffer=noiseBufferForLive;
  else {
   const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate),ctx.sampleRate),data=buffer.getChannelData(0);
   let seed=0x5f3759df+index;
   for(let i=0;i<data.length;i++){
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    data[i]=((seed>>>0)/2147483648)-1;
   }
   source.buffer=buffer;
  }
  const filter=ctx.createBiquadFilter();filter.type=type;filter.frequency.value=cutoff;
  const gain=ctx.createGain();envelope(gain,peak,length);
  source.connect(filter);filter.connect(gain);gain.connect(out);
  source.start(at,noiseBufferForLive?Math.random()*.45:0);
  source.stop(at+length+.03);
 };
 switch(sound){
  case 'bass':{
   oscillator(80,54,'triangle',.55,.36);
   oscillator(80,54,'sine',.21,.38);
   break;
  }
  case 'reese':{
   const filter=ctx.createBiquadFilter();filter.type='lowpass';
   filter.frequency.setValueAtTime(1100,at);
   filter.frequency.exponentialRampToValueAtTime(280,at+.3);filter.Q.value=1.1;
   const amp=ctx.createGain();envelope(amp,.24,.36,.008);
   filter.connect(amp);amp.connect(out);
   for(const detune of [-9,9]){
    const osc=ctx.createOscillator();osc.type='sawtooth';
    osc.frequency.setValueAtTime(53,at);osc.detune.value=detune;
    osc.connect(filter);osc.start(at);osc.stop(at+.39);
   }
   break;
  }
  case 'acid':{
   const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.Q.value=11;
   filter.frequency.setValueAtTime(2800,at);
   filter.frequency.exponentialRampToValueAtTime(210,at+.20);
   const amp=ctx.createGain();envelope(amp,.15,.26,.003);
   filter.connect(amp);amp.connect(out);
   const osc=ctx.createOscillator();osc.type='sawtooth';
   osc.frequency.setValueAtTime([82.41,98.00,110,123.47,146.83,164.81][index%6],at);
   osc.connect(filter);osc.start(at);osc.stop(at+.28);
   break;
  }
  case 'surdo':
   oscillator(114,58,'sine',.69,.38);noise(.018,.07,600,'lowpass');break;
  case 'agogo':
   oscillator(770,700,'sine',.20,.17);oscillator(1155,1010,'sine',.13,.12);break;
  case 'tamborim':
   oscillator(315,240,'triangle',.12,.065);noise(.06,.24,2200,'highpass');break;
 }
 return true;
}
async function waveLabData(track){
 const rate=24000,seconds=.65;
 const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext;
 if(!Offline)throw Error('Offline audio rendering is not supported by this browser');
 const ctx=new Offline(1,Math.round(rate*seconds),rate);
 const definition=window.RhythmVoices?.definitions?.[track.sound];
 if(definition){
  const bus=ctx.createGain();bus.connect(ctx.destination);
  if(!window.RhythmVoices.play(ctx,bus,track.sound,.012,.82,2,track.patch))
   throw Error('Selected synth could not be rendered');
  const rendered=await ctx.startRendering();
  return {samples:rendered.getChannelData(0),kind:'Synthesized',seconds};
 }
 if(['bass','reese','acid','surdo','agogo','tamborim'].includes(track.sound)){
  const bus=ctx.createGain();bus.gain.value=.82;bus.connect(ctx.destination);
  playNativeLegacy(ctx,bus,track.sound,.012,2);
  const rendered=await ctx.startRendering();
  return {samples:rendered.getChannelData(0),kind:'Synthesized fallback',seconds};
 }
 const key=sampleKey(track.sound,0,.82),url=SAMPLE_FILES[key];
 if(!url)throw Error('No recorded source waveform for this instrument. Use Preview to hear its fallback.');
 if(!soundLabSampleCache.has(key)){
  const fetchSample=fetch(url).then(response=>{
    if(!response.ok)throw Error('Sample unavailable ('+response.status+')');
    return response.arrayBuffer();
   }).then(bytes=>ctx.decodeAudioData(bytes));
  soundLabSampleCache.set(key,fetchSample);
  fetchSample.catch(()=>soundLabSampleCache.delete(key));
 }
 const buffer=await soundLabSampleCache.get(key);
 const length=Math.round(rate*seconds),result=new Float32Array(length);
 const speed=track.sound==='bongoLow'?.79:track.sound==='bongoHigh'?1.27:1;
 for(let i=0;i<length;i++){
  const j=Math.round(i*buffer.sampleRate/rate*speed);
  if(j>=buffer.length)break;
  for(let channel=0;channel<buffer.numberOfChannels;channel++)
   result[i]+=buffer.getChannelData(channel)[j]/buffer.numberOfChannels;
 }
 return {samples:result,kind:'Recorded sample',seconds};
}
function paintSoundWave(data){
 const canvas=$('soundWaveCanvas'),bounds=canvas.getBoundingClientRect();
 const width=Math.max(200,bounds.width||960),height=Math.max(120,bounds.height||200);
 const ratio=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
 const c=canvas.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);
 c.clearRect(0,0,width,height);
 const ink=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#567a63';
 c.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--line').trim()||'#888';
 c.lineWidth=1;c.beginPath();c.moveTo(0,height/2);c.lineTo(width,height/2);c.stroke();
 const samples=data.samples,maxBins=Math.min(Math.round(width),samples.length);
 let peak=0;for(let i=0;i<samples.length;i++)peak=Math.max(peak,Math.abs(samples[i]));
 const scale=Math.max(.00001,peak)*1.12;
 c.strokeStyle=ink;c.lineWidth=1.4;c.beginPath();
 for(let bin=0;bin<maxBins;bin++){
  const from=Math.floor(bin*samples.length/maxBins),to=Math.max(from+1,Math.floor((bin+1)*samples.length/maxBins));
  let lo=0,hi=0;for(let j=from;j<to;j++){lo=Math.min(lo,samples[j]);hi=Math.max(hi,samples[j]);}
  const x=(bin+.5)*width/maxBins;
  c.moveTo(x,height/2-hi/scale*(height*.45));
  c.lineTo(x,height/2-lo/scale*(height*.45));
 }
 c.stroke();
 const label=Number.isFinite(peak)?peak.toFixed(3):'0';
 $('soundWaveStatus').textContent=data.kind+' · '+data.seconds.toFixed(2)+' s · peak '+label+' · normalized waveform before master output.';
}
function scheduleSoundWavePreview(){
 if(soundLabTimer!==null)clearTimeout(soundLabTimer);
 const token=++soundLabToken,panel=$('advancedSoundDetails');
 if(!panel?.open)return;
 const track=tracks[soundLabLane];
 if(!track)return;
 const snapshot={sound:track.sound,patch:track.patch?{...track.patch}:null};
 $('soundWaveStatus').textContent='Rendering '+SOUNDS[track.sound]+' waveform…';
 soundLabTimer=setTimeout(async()=>{
  soundLabTimer=null;
  try{
   const result=await waveLabData(snapshot);
   if(token===soundLabToken&&panel.open)paintSoundWave(result);
  }catch(error){
   if(token===soundLabToken&&panel.open){
    const canvas=$('soundWaveCanvas');canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    $('soundWaveStatus').textContent='Waveform unavailable: '+error.message;
   }
  }
 },90);
}
function renderSpecialRhythms() {
 const wrap=$('specialRhythms');if(!wrap)return;wrap.replaceChildren();
 const t=tracks[selectedTrack];if(!t)return;
 const heading=document.createElement('h4');heading.textContent='Mathematical operations';wrap.append(heading);
 const opRow=document.createElement('label');opRow.className='math-option';opRow.textContent='Set operation';
 const choice=document.createElement('select');choice.id='setOperation';choice.setAttribute('aria-label','Root set operation');
 for(const [value,text] of [['union','Union ∪'],['intersection','Intersection ∩']]){const opt=document.createElement('option');opt.value=value;opt.textContent=text;choice.append(opt)}
 choice.value=t.operation||'union';
 // Intersection is available for advanced mathematics but does not obscure
 // the default union-of-points model.
 if(t.operation==='intersection'||t.euclidean)$('advancedMathDetails').open=true;
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
function renderEditor() {renderReadout();renderLayers();renderSoundControls();renderSpecialRhythms();refreshSoundLab()}
function renderReadout() {
 const t=tracks[selectedTrack];if(!t)return;
 const a=t.a===0&&t.b===0?null:Math.atan2(t.b,t.a)*180/Math.PI;
 const slider=$('argumentAngle');slider.disabled=a===null;slider.value=a===null?'0':String(Math.round(a));
 $('argumentText').textContent=a===null?'—':`${fmt(a)}°`;renderComposition();renderRootRule();renderRootInspection();
}
function renderComposition() {
 const t=tracks[selectedTrack];if(!t)return;
 const c=composePhases(t),i=selectedTrack;
 $('compositionPanel').style.setProperty('--selected-lane-color',COLORS[i]);
 $('compositionHeading').textContent=`Lane ${i+1} · ${SOUNDS[t.sound]}`;
 const setSymbol=t.operation==='intersection'?String.raw`\cap`:String.raw`\cup`;
  renderTeX('compositionEquation',String.raw`R_{${t.n}}\!\left(${complexLaTeX(t)}\right)`+(t.layers.length?t.layers.map(l=>String.raw`\;${setSymbol}\;R_{${l.n}}\!\left(${complexLaTeX(l)}\right)`).join(''):'')+(t.euclidean?String.raw`\;${setSymbol}\;E(${t.euclidean.k},${t.euclidean.n})`:''));
  const resultLabel=$('unionStrip')?.parentElement?.querySelector('.phase-label span');if(resultLabel)resultLabel.textContent=t.operation==='intersection'?'Intersection':'Union';
 updateSelectedRootMath();
 $('compositionMetrics').textContent=`${c.merged.length} distinct points · ${t.layers.length} added set${t.layers.length===1?'':'s'}`;
 $('baseCount').textContent=String(c.base.length);$('addedCount').textContent=String(c.added.length);$('unionCount').textContent=String(c.merged.length);
 // A collision is an event with multiple mathematical sources, independent
 // of whether its roots came from base vs added, added vs added, or Euclidean.
 // The display uses exactly the canonical per-lane union/intersection events.
 const shared=events(t).filter(event=>event.sources.length>1);
 $('overlapSummary').textContent=shared.length===0?
  'Each phase appears once in the result.':
  `${shared.length} shared phase${shared.length===1?'':'s'} · merged into one point and one hit.`;
 const phaseFormula=$('sharedPhaseFormula');
 phaseFormula.hidden=shared.length===0;
 if(shared.length){
  // Use a reduced rational only when it represents the actual phase within
  // numeric tolerance. Never mislabel an irrational/rotated phase as 1/n.
  const phaseMath=phase=>{
   const x=((phase%1)+1)%1;
   if(x<1e-8||1-x<1e-8)return '0';
   for(let q=1;q<=64;q++){
    const p=Math.round(x*q);
    if(Math.abs(x-p/q)<1e-8)return q===1?String(p):String.raw`\frac{${p}}{${q}}`;
   }
   return fmtMath(x);
  };
  const visible=shared.slice(0,6).map(e=>phaseMath(e.phase));
  if(shared.length>6)visible.push(String.raw`\ldots`);
  renderTeX(phaseFormula,String.raw`\Phi_{\mathrm{shared}}=\left\{${visible.join(',\\;')}\right\}`);
 }else phaseFormula.replaceChildren();
 const example=$('exampleProof'),exampleMatch=t.operation==='union'&&t.n===4&&t.a===1&&t.b===0&&
 t.layers.length===1&&t.layers[0].n===3&&t.layers[0].a===1&&t.layers[0].b===0&&!t.euclidean;
 if(example){
  example.hidden=!exampleMatch;
  if(exampleMatch)renderTeX(example,String.raw`\Phi(R_4(1)\cup R_3(1))=\left\{0,\frac14,\frac13,\frac12,\frac23,\frac34\right\}`,true);
 }
 const plot=(target,values,mode)=>{
  target.replaceChildren();
  for(const item of values){
   const phase=typeof item==='number'?item:item.phase;
   const marker=document.createElement('span'),overlap=mode==='union'&&item.shared,added=mode==='added'||(mode==='union'&&item.added&&!item.base);
   marker.className='phase-mark '+(overlap?'overlap':added?'added':'base');
   marker.style.left=(2+phase*96)+'%';marker.style.borderColor=COLORS[i];
   marker.dataset.phase=String(phase);marker.setAttribute('aria-hidden','true');
   if(!added&&!overlap)marker.style.backgroundColor=COLORS[i];
   if(overlap)marker.style.setProperty('--mark-color',COLORS[i]);
   marker.title=`${Math.round(phase*3600)/10}°${overlap?' (shared)':''}`;target.append(marker);
  }
 };
 plot($('baseStrip'),c.base,'base');plot($('addedStrip'),c.added,'added');plot($('unionStrip'),c.merged,'union');
 const resultStrip=$('unionStrip');
 resultStrip.setAttribute('aria-label',(t.operation==='intersection'?'Intersection':'Union')+
  ' of lane '+(i+1)+': '+c.merged.length+' distinct phases. Click a phase, use Left and Right arrows, or press Enter to inspect; Home and End jump to the first and last.');
 syncInspectedPhaseMarks(inspectedRoot?.lane===i?inspectionPhase(t,inspectedRoot):NaN);
}

function renderLayers(){
 const track=tracks[selectedTrack],wrap=$('extraLayers');wrap.replaceChildren();
 $('addLayer').disabled=track.layers.length>=5;
 $('addRootFamily').disabled=track.layers.length>=5;
 track.layers.forEach((layer,i)=>{
  const group=document.createElement('div');group.className='layer-row angular-layer';
  group.dataset.layer=String(i);
  const title=document.createElement('div');title.className='layer-angle-title';
  title.textContent=layer.n===1?'Additional angle '+(i+1)+' · single event':'Generated roots '+(i+1)+' · '+layer.n+' events';
  group.append(title);
  // arg(0) is undefined. Imported zero-valued root families are silent
  // and must not pretend that they are at an angle of zero radians.
  const zeroLayer=layer.a===0&&layer.b===0;
  const theta=zeroLayer?null:Math.atan2(layer.b,layer.a);
  if(zeroLayer)title.textContent='Zero complex value · no rhythm events';
  const makeField=(id,text,value)=>{
   const label=document.createElement('label');label.textContent=text;label.htmlFor=id;
   const input=document.createElement('input');input.id=id;input.type='text';input.value=value;
   input.maxLength=80;input.inputMode='decimal';input.setAttribute('aria-label',text+' for addition '+(i+1));
   label.append(input);group.append(label);return input;
  };
  const rad=makeField('layer'+i+'AngleRad','Angle · radians',theta===null?'':formatEditorRadians(theta));
  const deg=makeField('layer'+i+'AngleDeg','Angle · degrees',theta===null?'':inputNumber(theta*180/Math.PI));
  for(const [input,isDegrees] of [[rad,false],[deg,true]]){
   enableFocusedWheel(input,direction=>{
    const angle=(Math.atan2(layer.b,layer.a)||0)+direction*Math.PI/180;
    input.value=isDegrees?inputNumber(angle*180/Math.PI):formatEditorRadians(angle);
    input.dispatchEvent(new Event('input',{bubbles:true}));
   });
  }
  if(zeroLayer){
   rad.placeholder='undefined for z=0';deg.placeholder='undefined for z=0';
  }
  const apply=(input,isDegrees)=>{
   const raw=input.value.trim();let angle;
   try{
    if(isDegrees){
     if(raw===''||!Number.isFinite(Number(raw))||Math.abs(Number(raw))>1e8)throw Error('Invalid angle');
     angle=Number(raw)*Math.PI/180;
    }else angle=parseEditorRadians(raw);
   }catch(_){input.setAttribute('aria-invalid','true');return}
   input.setAttribute('aria-invalid','false');
   // Preserve a stored layer's magnitude when its angle alone is edited.
    const modulus=Math.hypot(layer.a,layer.b)||1;
    const p=RhythmMath.fromPolar(modulus,angle%(2*Math.PI));
    layer.a=p.a;layer.b=p.b;
    title.textContent=layer.n===1?'Additional angle '+(i+1)+' · single event':'Generated roots '+(i+1)+' · '+layer.n+' events';
    rad.placeholder='';deg.placeholder='';
   if(isDegrees)rad.value=formatEditorRadians(angle);
   else deg.value=inputNumber(angle*180/Math.PI);
   updateLaneStatus(selectedTrack);renderReadout();markCustom();
  };
  rad.addEventListener('input',()=>apply(rad,false));
  deg.addEventListener('input',()=>apply(deg,true));
  if(layer.n>1){
   const family=document.createElement('label');family.className='family-degree';family.textContent='Symmetric roots · n';
   const degree=document.createElement('input');degree.id='layer'+i+'n';degree.type='number';degree.min='2';degree.max='64';
   degree.step='1';degree.value=String(layer.n);degree.setAttribute('aria-label','Root family degree '+(i+1));
   degree.addEventListener('input',()=>{
    const n=Number(degree.value),valid=Number.isInteger(n)&&n>=2&&n<=64;
    degree.setAttribute('aria-invalid',String(!valid));
    if(!valid)return;
    layer.n=n;title.textContent=layer.a===0&&layer.b===0?'Zero complex value · no rhythm events':'Generated roots '+(i+1)+' · '+n+' events';
    updateLaneStatus(selectedTrack);renderReadout();markCustom();
   });
   degree.addEventListener('change',()=>{if(degree.getAttribute('aria-invalid')==='true'){
    degree.value=String(layer.n);degree.setAttribute('aria-invalid','false');
   }});
   enableFocusedWheel(degree);
   family.append(degree);group.append(family);
  }else{
   const explanatory=document.createElement('span');explanatory.className='single-angle-note';
   explanatory.textContent='One event at φ (no root family).';group.append(explanatory);
  }
  const del=document.createElement('button');del.type='button';del.className='layer-remove';
  del.textContent='×';del.setAttribute('aria-label','Remove angle or root family '+(i+1));
  del.addEventListener('click',()=>{track.layers.splice(i,1);renderLayers();updateLaneStatus(selectedTrack);renderReadout();markCustom()});
  group.append(del);
  const velocity=document.createElement('label');velocity.className='layer-velocity';velocity.textContent='Accent volume';
  const volume=document.createElement('input');volume.type='range';volume.min='10';volume.max='100';volume.value=String(Math.round(layer.velocity*100));
  volume.setAttribute('aria-label','Volume for additional event group '+(i+1));
  enableFocusedWheel(volume);
  volume.addEventListener('input',()=>{layer.velocity=Number(volume.value)/100;markCustom()});
  velocity.append(volume);group.append(velocity);wrap.append(group);
 });
}

// Canonical four-lane event plan used by both the UI timeline and Web Audio.
// Do not maintain separate phase/event interpretations for presentation and sound.
function currentSchedulerLanes(){
 return tracks.map(t=>({
  cycleBars:t.cycleBars,muted:t.muted,sound:t.sound,
  gain:t.gain??1,patch:t.patch,events:events(t)
 }));
}
function renderWindowTimeline() {
 requestAnimationFrame(positionPhaseLabels);
 updateMagnifyControl();
 const summary=$('commonCycle');if(!summary||!tracks.length)return;
 const common=RhythmMath.commonCycle(tracks);
 summary.textContent=`Common period: ${common} ${common===1?'bar':'bars'}`;
 const slider=$('windowStart');slider.max=String(Math.max(0,common-4));
 windowStartBar=Math.max(0,Math.min(windowStartBar,Number(slider.max)));
 slider.value=String(windowStartBar);
 $('windowStartText').textContent=String(windowStartBar+1);
 // The horizontal grid shows absolute elapsed bars. Its numbers must advance
 // with the four-bar viewport, rather than forever labelling it 0–4.
 const axis=$('windowPanel').querySelector('.window-axis');
 if(axis)[...axis.children].forEach((label,i)=>{
  label.textContent=String(windowStartBar+i)+(i===4?' bars':'');
 });
 const start=windowStartBar,span=4,secPerBar=barSeconds();
 const lanes=currentSchedulerLanes();
 const scheduled=RhythmMath.planEvents(lanes,secPerBar,start*secPerBar,(start+span)*secPerBar);
 const analysis=RhythmMath.analyzeSchedule(scheduled);
 // Exactly the same absolute-time groups used by schedule analysis.
 // Coincidence is about real attack time, NOT equal root angles.
 const simultaneousById=new Map();
 for(let first=0;first<scheduled.length;){
  let end=first+1;
  while(end<scheduled.length&&Math.abs(scheduled[end].time-scheduled[first].time)<1e-6)end++;
  const lanesAtMoment=[...new Set(scheduled.slice(first,end).map(event=>event.lane))];
  if(lanesAtMoment.length>1){
   for(let j=first;j<end;j++)
    simultaneousById.set(scheduled[j].id,lanesAtMoment.filter(lane=>lane!==scheduled[j].lane));
  }
  first=end;
 }
 const eventSummary=$('eventSummary');
 if(eventSummary)eventSummary.textContent=`4-bar view · ${analysis.totalEvents} audible hits · ${analysis.uniqueMoments} distinct times · ${analysis.sharedMoments} shared across lanes`;
 if(!$('windowPanel').open)return;
 const container=$('windowTimeline');container.replaceChildren();
 $('eventInspection').textContent='Select a timeline row, then use arrow keys to inspect individual mathematical events.';
 const simultaneous=analysis.sharedMoments;
 for(let i=0;i<tracks.length;i++){
  const row=document.createElement('div');row.className='window-lane';
  row.style.setProperty('--lane-color',COLORS[i]);
  const label=document.createElement('span');label.className='window-lane-label';label.textContent=`Lane ${i+1}`;
  const markers=document.createElement('div');markers.className='window-lane-events';
  markers.setAttribute('role','button');
  markers.tabIndex=0;
  const current=scheduled.filter(event=>event.lane===i);
  markers.setAttribute('aria-label',`${current.length} events on lane ${i+1} over four bars beginning at bar ${start+1}`);
  const fragment=document.createDocumentFragment();
  for(const event of current){
   const dot=document.createElement('span');dot.className='window-mark';
   dot.dataset.lane=String(i);
   dot.dataset.phase=String(event.phase);
   dot.dataset.absoluteBars=String(event.time/secPerBar);
   dot.style.left=(100*(event.time/secPerBar-start)/span)+'%';
   const sourceDescription=event.sources.map(src=>src.kind==='base'?'base root '+(src.index+1):
     src.kind==='additional'?'extra root set '+(src.sourceIndex+1)+', root '+(src.index+1):
     'Euclidean accent '+(src.index+1)).join(' + ')||'mathematical event';
   const otherLanes=simultaneousById.get(event.id)||[];
   const simultaneousText=otherLanes.length?' · simultaneous with '+otherLanes.map(lane=>'Lane '+(lane+1)).join(', '):'';
   dot.title=`Bar ${(event.time/secPerBar+1).toFixed(3)} · ${event.instrument||'instrument'} · ${sourceDescription}${simultaneousText}`;
   dot.classList.toggle('window-shared',event.sources.length>1);
   dot.classList.toggle('window-cross-lane',otherLanes.length>0);
   fragment.append(dot);
  }
  markers.append(fragment);
  const describeSource=src=>src.kind==='base'?'base root '+(src.index+1):
   src.kind==='additional'?'additional root set '+(src.sourceIndex+1)+', root '+(src.index+1):
   'Euclidean accent '+(src.index+1);
  let focusedEvent=0;
  const inspect=(index)=>{
   if(!current.length){$('eventInspection').textContent='Lane '+(i+1)+' is silent in this four-bar window.';return}
   focusedEvent=((index%current.length)+current.length)%current.length;
   const event=current[focusedEvent];
   [...markers.children].forEach((dot,k)=>dot.classList.toggle('window-selected',k===focusedEvent));
   const bar=event.time/secPerBar+1;
   const coinciding=simultaneousById.get(event.id)||[];
   const coincidenceLabel=coinciding.length?' · simultaneous with '+coinciding.map(lane=>'Lane '+(lane+1)).join(', '):'';
   $('eventInspection').textContent=`Lane ${i+1} · bar ${bar.toFixed(3)} · ${SOUNDS[tracks[i].sound]} · velocity ${event.velocity.toFixed(2)} · ${event.sources.map(describeSource).join(' + ')}${coincidenceLabel}`;
   markers.setAttribute('aria-label','Inspect lane '+(i+1)+', event '+(focusedEvent+1)+' of '+current.length+'. '+$('eventInspection').textContent);
   // The time-window and ring are two views of the SAME source event.
   // Selection is read-only; the AudioContext scheduler is untouched.
   if(event.sources.length){
    chooseTrack(i);
    inspectCanonicalEvent(event,event.time/secPerBar);
   }
  };
  markers.addEventListener('click',e=>{
   if(!current.length){inspect(0);return}
   const rect=markers.getBoundingClientRect(),fraction=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
   let nearest=0,distance=Infinity;
   current.forEach((event,k)=>{
    const d=Math.abs((event.time/secPerBar-start)/span-fraction);
    if(d<distance){distance=d;nearest=k}
   });
   inspect(nearest);
  });
  markers.addEventListener('keydown',e=>{
   if(['ArrowRight','ArrowLeft','Home','End','Enter',' '].includes(e.key)){
    e.preventDefault();
    inspect(e.key==='ArrowRight'?focusedEvent+1:e.key==='ArrowLeft'?focusedEvent-1:
      e.key==='End'?current.length-1:e.key==='Home'?0:focusedEvent);
   }
  });
  const count=document.createElement('span');count.className='window-count';count.textContent=`${current.length} hits`;
  row.append(label,markers,count);container.append(row);
 }
 $('windowCounts').textContent=`${scheduled.length} scheduled lane events · ${simultaneous} simultaneous cross-lane ${simultaneous===1?'moment':'moments'} in this four-bar window.`+
  (simultaneous?' Dashed outlines mark cross-lane coincidences.':'');
 // Reapply the selection after a timeline redraw (window scroll, BPM edit,
 // mathematical source edit). Muted lanes have no scheduled audio marks.
 const selection=inspectedRoot;
 const phase=selection?.lane===selectedTrack?inspectionPhase(tracks[selectedTrack],selection):NaN;
 const selectedOccurrence=selection&&Number.isFinite(phase)?
  inspectionOccurrence(tracks[selectedTrack],selection,phase):null;
 syncInspectedWindowMarks(phase,selection?.lane??-1,
  selectedOccurrence?.selected?selectedOccurrence.absoluteBars:NaN);
}
let pendingEditReschedule=false;
function markCustom(reschedule=true){
 if(activePresetId!==null&&!presetModified){presetModified=true;renderPresets()}
 // Invalidate any notes already planned under the old complex-number/patch
 // model. Batch rapid slider/drag inputs into one render-frame update.
 if(reschedule&&playing&&audio&&!pendingEditReschedule){
  pendingEditReschedule=true;
  requestAnimationFrame(()=>{
   pendingEditReschedule=false;
   if(!playing||!audio)return;
   cancelVoices();
   scheduledUntil=audio.currentTime+.006;
   scheduleAhead();
  });
 }
 renderWindowTimeline();
 if(magnified&&!rootDrag)refreshPlotZoom();
}
// Both explicit example selection and JSON import use the same atomic
// audio transition after replacing tracks, tempo and loaded category.
// Browse-only category changes never call this function.
function activateLoadedRhythm(phase,cycle){
 if(audio)loadSamples(prioritySampleKeys());
 if(playing&&audio){
  cancelVoices();
  beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();
  scheduledUntil=audio.currentTime+.006;
 }
}
function applyPreset(p){
 const phase=transportPhase(),oldCycle=cycleSeconds();
 const cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/oldCycle):0;
 cycleBars=p.bars===2?2:1;
 inspectedRoot=null;
 tracks=p.tracks.map((t,i)=>cleanTrack({...t,cycleBars:t.cycleBars??cycleBars},i));
 bpm=p.bpm;activePresetId=p.id;presetModified=false;importedProjectName=null;
 activeCategory=p.category;
 if(!inBrowse(p,browseCategory))browseCategory=categoryForPreset(p);
 $('bpm').value=String(bpm);$('bpmText').textContent=String(bpm);
 activateLoadedRhythm(phase,cycle);
 renderPresets();renderTracks();renderEditor();renderWindowTimeline();
 if(magnified)refreshPlotZoom();
}
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
        if(sound==='bongoLow'||sound==='bongoHigh')return 'bongo';
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
      function triggerSample(key,at,gainValue,index=0,voice=key){
        const buffer=sampleBuffers.get(key);if(!buffer)return false;
        const source=audio.createBufferSource();source.buffer=buffer;
        // Repetition variation is deliberately small; no timing jitter, roots stay exact.
        source.playbackRate.value=(voice==='bongoLow'?.79:voice==='bongoHigh'?1.27:1)*
          (1+([0,-.012,.009,-.007,.004][index%5]));
        const gain=audio.createGain();gain.gain.value=Math.max(.001,gainValue);
        source.connect(gain);gain.connect(voiceBus||master);
        const cleanupNodes=[gain];
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
          cleanupNodes.push(saturation,presenceFilter,presenceGain);
        }
        source.onended=()=>{
          try{source.disconnect()}catch(_){}
          for(const node of cleanupNodes)try{node.disconnect()}catch(_){}
        };
        source.start(Math.max(at,audio.currentTime+.002));return true;
      }
      function playSample(sound,at,velocity,index=0){
        const key=sampleKey(sound,index,velocity);
        const gainTable={kick:.51,snare:.45,clap:.36,hat:.18,openhat:.19,rim:.34,tom:.33,shaker:.21,
           jazzkick:.22,crossstick:.34,jazzshaker:.15,jazzhat:.14,jazzsnare:.28,claves:.26,
         bongo:.25,bongoLow:.32,bongoHigh:.23,berlinrumble:.70};
        const style=activeCategory==='brazil'?.83:1;
        // Bass Wall emphasizes the existing kick/rumble onsets without
        // introducing extra attacks or moving any mathematical root phase.
        const wallBoost=activePresetId==='berlin-bass-wall'&&sound==='kick'?1.12:1;
        const played=triggerSample(key,at,(gainTable[sound]||.32)*velocity*style*wallBoost,index,sound);
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
        // Exactly the same measured high-pass, saturating master ceiling and
        // onset-preserving chain is used in OfflineAudioContext regression.
        const output=window.RhythmVoices.createMasterOutputChain(audio,audio.destination,volume*.8);
        master=output.master;subFilter=output.subFilter;limiter=output.limiter;compressor=null;
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
      const liveHitBuses=new Map();
      let hitCleanupTimer=null,disposedHitBuses=0,peakLiveHitBuses=0;
      function reclaimHitBuses(force=false){
        const now=audio?.currentTime??0;
        for(const [bus,expiry] of liveHitBuses){
          if(force||now>=expiry){
            try{bus.disconnect()}catch(_){}
            liveHitBuses.delete(bus);disposedHitBuses++;
          }
        }
        if(!liveHitBuses.size&&hitCleanupTimer!==null){
          clearInterval(hitCleanupTimer);hitCleanupTimer=null;
        }
      }
      function retainHitBus(bus,time){
        // Bounded, batched cleanup; no timer per oscillator strike.
        liveHitBuses.set(bus,time+1.05);
        peakLiveHitBuses=Math.max(peakLiveHitBuses,liveHitBuses.size);
        if(hitCleanupTimer===null)hitCleanupTimer=setInterval(()=>reclaimHitBuses(),150);
      }
      function hit(sound, at, velocity=1, index=0, patch=null) {
        // Real recorded/rended one-shots first; use local synthesis when unavailable.
        const t=Math.max(at-OUTPUT_CHAIN_COMPENSATION,audio.currentTime+.002);
        if(playSample(sound,t,velocity,index))return;
        perHitBus=audio.createGain();perHitBus.gain.value=1;perHitBus.connect(voiceBus||master);
         // Synthesizers apply velocity in their envelope. A second bus multiplier
         // would square the velocity and make ghost/secondary accents inaudible.
         if(window.RhythmVoices?.play(audio,perHitBus,sound,t,velocity,index,patch)){retainHitBus(perHitBus,t);perHitBus=null;return}
         perHitBus.gain.value=Math.max(.05,Math.min(1,velocity));
         if(playNativeLegacy(audio,perHitBus,sound,t,index,noiseBuffer)){
          retainHitBus(perHitBus,t);perHitBus=null;return;
         }
        const soundFallback={jazzkick:'kick',crossstick:'rim',jazzshaker:'shaker',jazzhat:'hat',
         jazzsnare:'snare',claves:'rim',bongo:'tom',bongoLow:'tom',bongoHigh:'tom'};
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
        }
        retainHitBus(perHitBus,t);
        perHitBus=null;
      }

function barSeconds(){return 240/bpm}
function cycleSeconds(){return barSeconds()*(tracks.length?RhythmMath.commonCycle(tracks):cycleBars)}
function laneSeconds(track){return barSeconds()*(track.cycleBars||1)}
function playbackElapsed(){return playing&&audio?Math.max(0,audio.currentTime-beatEpoch):pausedPhase*cycleSeconds()}
function lanePhase(track){return RhythmMath.phaseAt(playbackElapsed(),track.cycleBars||1,barSeconds())}
// One phase clock for BOTH visible orbit hands and audible hits:
// planEvents() schedules at (cycle + root.phase) * cycleBars * barSeconds.
// The playhead must use the same beatEpoch, bar duration and cycleBars
// instead of the selected lane's angle or a 16-step reduced-motion quantizer.
function orbitHandStates(elapsed=playbackElapsed()){
 return tracks.map((t,i)=>({
  lane:i,cycleBars:t.cycleBars||1,
  phase:RhythmMath.phaseAt(elapsed,t.cycleBars||1,barSeconds()),
  periodSeconds:laneSeconds(t),muted:t.muted,color:COLORS[i]
 }));
}
let lastOrbitalHandFrame=null;
function transportPhase(){if(!playing||!audio)return pausedPhase;return ((Math.max(0,audio.currentTime-beatEpoch)/cycleSeconds())%1+1)%1}
let pendingVoiceBusDisposals=0,completedVoiceBusDisposals=0,voiceBusGenerations=0;
function cancelVoices(){
 if(voiceBus&&audio){
  const old=voiceBus;
  try{
   old.gain.setValueAtTime(old.gain.value,audio.currentTime);
   old.gain.setTargetAtTime(.0001,audio.currentTime,.006);
  }catch(_){}
  pendingVoiceBusDisposals++;
  setTimeout(()=>{
   try{old.disconnect()}catch(_){}
   finally{pendingVoiceBusDisposals--;completedVoiceBusDisposals++}
  },100);
 }
 voiceBus=audio?audio.createGain():null;
 if(voiceBus){voiceBus.connect(master);voiceBusGenerations++}
}
function scheduleAhead(){
 if(!playing||!audio||audio.state!=='running')return;
 const now=audio.currentTime,from=Math.max(scheduledUntil,now+.001),to=now+.09;
 if(to<=from)return;
 const relFrom=Math.max(0,from-beatEpoch),relTo=Math.max(0,to-beatEpoch);
 if(relTo<=relFrom)return;
 const lanes=currentSchedulerLanes();
 const future=RhythmMath.planEvents(lanes,barSeconds(),relFrom,relTo);
 for(const hitEvent of future){
  const at=beatEpoch+hitEvent.time;
  if(at>=from&&at<to)hit(hitEvent.instrument,at,hitEvent.velocity*hitEvent.gain,
    hitEvent.cycle*lanes[hitEvent.lane].events.length+hitEvent.sourceEvent,hitEvent.patch);
 }
 scheduledUntil=to;
}
function updateTransportText(){
 const button=$('playBtn');
 button.textContent=playing?'Ⅱ Pause':transportWanted?'Cancel start':'▶ Play';
 button.setAttribute('aria-pressed',String(playing||transportWanted));
 const ready=prioritySampleKeys().filter(k=>sampleBuffers.has(k)).length,all=prioritySampleKeys().length;
 $('audioState').textContent=playing?('Playing · samples '+ready+'/'+all):
  transportWanted?'Preparing audio…':'Ready to play';
}
async function togglePlay(){
 // Intent changes synchronously, before the first await. Two quick Play clicks
 // must not create duplicate schedulers or start playback after cancellation.
 if(playing||transportWanted){
  transportWanted=false;const ticket=++transportTicket;
  if(playing)pausedPhase=transportPhase();
  playing=false;
  if(timerId!==null){clearInterval(timerId);timerId=null;schedulerIntervalsCleared++}
  if(audio)cancelVoices();
  // A new start waits for this pause to finish; stale starts never change
  // playback state after their ticket has been invalidated.
  pauseBarrier=audio?audio.suspend().catch(()=>{}):Promise.resolve();
  await pauseBarrier;
  if(ticket===transportTicket){reclaimHitBuses(true);updateTransportText()}
  return;
 }
 transportWanted=true;
 const ticket=++transportTicket;
 updateTransportText();
 if(!initAudio()){
  if(ticket===transportTicket){transportWanted=false;updateTransportText()}
  return;
 }
 try{
  await pauseBarrier;
  if(ticket!==transportTicket||!transportWanted)return;
  await audio.resume();
  if(ticket!==transportTicket||!transportWanted)return;
  const ready=prioritySampleKeys();
  if(ready.length){
   $('audioState').textContent='Loading sounds…';
   await Promise.race([loadSamples(ready),new Promise(resolve=>setTimeout(resolve,2800))]);
  }
  if(ticket!==transportTicket||!transportWanted)return;
  cancelVoices();
  beatEpoch=audio.currentTime+.055-pausedPhase*cycleSeconds();
  scheduledUntil=audio.currentTime;
  // The pending-start intent ends atomically when the audio scheduler starts.
  // Keeping this true after PLAY was inaccurate in CI diagnostics and UI state.
  transportWanted=false;
  playing=true;
  updateTransportText();scheduleAhead();
  if(timerId!==null){clearInterval(timerId);schedulerIntervalsCleared++}
  timerId=setInterval(scheduleAhead,25);schedulerIntervalsCreated++;
 }catch(err){
  if(ticket===transportTicket){
   transportWanted=false;playing=false;updateTransportText();
   showToast('Audio could not start: '+err.message);
  }
 }
}
function reset(){pausedPhase=0;cycles=1;if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime+.06;scheduledUntil=audio.currentTime}}
async function previewTrack(index){if(!initAudio())return;try{await audio.resume();const t=tracks[index];await Promise.race([loadSamples([sampleKey(t.sound),...(t.sound==='jazzshaker'?['jazzshaker-alt']:[])]),new Promise(resolve=>setTimeout(resolve,1600))]);hit(t.sound,audio.currentTime+.014,t.gain??1,0,t.patch)}catch(err){showToast('Preview failed: '+err.message)}}
async function previewSound(){return previewTrack(selectedTrack)}
function resizeCanvas(){const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;cvWidth=width;cvHeight=height;pixelRatio=Math.min(2.5,devicePixelRatio||1);
 canvas.width=Math.max(1,Math.round(width*pixelRatio));canvas.height=Math.max(1,Math.round(height*pixelRatio));ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
 requestAnimationFrame(positionPhaseLabels);updateMagnifyControl()}
// Only offer enlargement when the real combined root phases are closer
// than the required 34 CSS-pixel inspection spacing at the current fit size.
// A displayed zoom remains reversible even if a later edit thins the pattern.
function updateMagnifyControl(){
 const controls=$('figureTools'),btn=$('zoomBtn'),plot=$('plotArea');
 if(!controls||!btn||!plot||!tracks.length)return;
 const width=canvas.getBoundingClientRect().width;
 if(!width)return;
 const radii=getRadii(width);
 const dense=tracks.some((track,lane)=>{
  const phases=events(track).map(e=>e.phase);
  if(phases.length<2)return false;
  let gap=1+phases[0]-phases[phases.length-1];
  for(let i=1;i<phases.length;i++)gap=Math.min(gap,phases[i]-phases[i-1]);
  return 2*radii[lane]*Math.sin(Math.PI*gap)<34;
 });
 controls.hidden=!(magnified||dense);
 btn.setAttribute('aria-label',magnified?'Fit all four rhythm rings':'Magnify closely spaced root points');
 const hint=$('zoomHint');
 if(hint)hint.textContent=magnified?'Scroll the enlarged diagram to inspect dense roots.':'Roots overlap at this size. Magnify to separate the points.';
}
function refreshPlotZoom(){
 const plot=$('plotArea'),btn=$('zoomBtn');
 if(!plot||!btn)return;
 plot.classList.toggle('focused',magnified);
 btn.setAttribute('aria-pressed',String(magnified));
 btn.textContent=magnified?'Fit entire cycle':'Magnify dense roots';
 updateMagnifyControl();
 if(magnified){
  // A zoom must make ALL four lanes inspectable, even if the selected lane
  // has only one root. Added root families can have closer adjacent phases
  // than the underlying nth roots, so use the actual merged event phases.
  const minimumGaps=tracks.map(t=>{
   const phases=events(t).map(ev=>ev.phase);
   if(phases.length<2)return Infinity;
   let nearest=1+phases[0]-phases[phases.length-1];
   for(let j=1;j<phases.length;j++)nearest=Math.min(nearest,phases[j]-phases[j-1]);
   return nearest;
  });
  const sufficient=size=>minimumGaps.every((gap,lane)=>
   !Number.isFinite(gap)||2*getRadii(size)[lane]*Math.sin(Math.PI*gap)>=34
  );
  let lo=900,hi=5000;
  while(lo<hi){
   const mid=Math.floor((lo+hi)/2);
   if(sufficient(mid))hi=mid;
   else lo=mid+1;
  }
  const size=lo;
  const previous=canvas.getBoundingClientRect();
  // Keep the user's current pan center when an edit changes the zoom level.
  // Entering magnification from Fit starts at the center by the same rule.
  const focusX=previous.width>0?(plot.scrollLeft+plot.clientWidth/2)/previous.width:.5;
  const focusY=previous.height>0?(plot.scrollTop+plot.clientHeight/2)/previous.height:.5;
  canvas.style.width=size+'px';canvas.style.height=size+'px';
  requestAnimationFrame(()=>{
   const scrollX=Math.max(0,Math.min(plot.scrollWidth-plot.clientWidth,
    size*focusX-plot.clientWidth/2));
   const scrollY=Math.max(0,Math.min(plot.scrollHeight-plot.clientHeight,
    size*focusY-plot.clientHeight/2));
   plot.scrollLeft=scrollX;plot.scrollTop=scrollY;
   resizeCanvas();
  });
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
 return distance<=Math.max(22,p.side*.03)?best:-1;
}
function rgba(i,alpha){const c=RGB[i];return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`}
function getRadii(side){const outer=side*.427,spacing=Math.min(outer/3-7,Math.max(40,side*.095));return [outer,outer-spacing,outer-2*spacing,outer-3*spacing]}
// Responsive mathematical labels are positioned tangentially to the cycle
// axis, keeping the phase direction while avoiding rendered root markers.
// Dynamic placement is required because different presets occupy different
// phases; no root coordinates or time values are modified by this layout.
// Root marker geometry for all four lanes. Keep an actual >=1.4x beat
// diameter at mandatory responsive sizes while not obscuring the neighboring
// ring's simultaneously active markers. The halo is omitted in compact space;
// the brighter center and enlarged root still provide the audible beat cue.
function visualRootMarker(spacing,requestedPulse=0,coincident=false){
 const maximum=Math.min(8,Math.max(5.6,(spacing-.8)/2-14));
 const pulse=Math.max(0,Math.min(maximum,requestedPulse));
 const compact=pulse>0&&spacing<51;
 return {
  pulse,radius:14+pulse,
  strokeWidth:compact?.5:coincident?2.6:1.6,
  glow:pulse>0&&spacing>=56
 };
}
function positionPhaseLabels(){
 const area=$('plotArea');
 if(!area||area.classList.contains('focused')||!tracks.length)return;
 const box=canvas.getBoundingClientRect();
 if(box.width<200||box.height<200)return;
 const side=Math.min(box.width,box.height),radii=getRadii(side);
 const cx=box.left+box.width/2,cy=box.top+box.height/2;
 const dots=[];
 tracks.forEach((track,lane)=>{
  for(const ev of composePhases(track).merged){
   const a=-Math.PI/2+TAU*ev.phase,r=radii[lane];
   dots.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r});
  }
 });
 const options=[
  {id:'phaseZero',axis:'x',dir:1},
  {id:'phaseQuarter',axis:'y',dir:1},
  {id:'phaseHalf',axis:'x',dir:-1},
  {id:'phaseThreequarters',axis:'y',dir:-1}
 ];
 for(const item of options){
  const el=$(item.id);if(!el)continue;
  const label=el.getBoundingClientRect(),w=label.width,h=label.height;
  if(!w||!h)continue;
  const maxShift=Math.max(0,(item.axis==='x'?box.width-w:box.height-h)/2-4);
  const shifts=[55,68,82,96,110,125,140].filter(x=>x<=maxShift);
  if(!shifts.length)shifts.push(maxShift);
  let best=shifts[0],fewest=Infinity;
  for(const shift of shifts){
   let left,top;
   if(item.id==='phaseZero'){left=cx+shift-w/2;top=box.top+4}
   else if(item.id==='phaseHalf'){left=cx-shift-w/2;top=box.bottom-4-h}
   else if(item.id==='phaseQuarter'){left=box.right-4-w;top=cy+shift-h/2}
   else {left=box.left+4;top=cy-shift-h/2}
   let markerConflicts=0;
   for(const dot of dots){
    const nearestX=Math.max(left,Math.min(dot.x,left+w));
    const nearestY=Math.max(top,Math.min(dot.y,top+h));
    if((dot.x-nearestX)**2+(dot.y-nearestY)**2<17**2)markerConflicts++;
   }
   // A label may cover an empty section of a circular ring even when no
   // nearby marker is present. Penalize direct arc/rectangle intersections,
   // including the antialiased ring stroke, not only label-marker crossings.
   const minX=Math.max(left,Math.min(cx,left+w));
   const minY=Math.max(top,Math.min(cy,top+h));
   const closest=Math.hypot(cx-minX,cy-minY);
   const farthest=Math.max(
    Math.hypot(cx-left,cy-top),
    Math.hypot(cx-(left+w),cy-top),
    Math.hypot(cx-left,cy-(top+h)),
    Math.hypot(cx-(left+w),cy-(top+h))
   );
   const ringConflicts=radii.filter(r=>closest<=r+3&&farthest>=r-3).length;
   const score=markerConflicts*100+ringConflicts*20;
   if(score<fewest){best=shift;fewest=score}
   if(!score)break;
  }
  const value='calc(50% '+(item.dir>0?'+ ':'- ')+best+'px)';
  if(item.axis==='x'&&el.style.left!==value)el.style.left=value;
  if(item.axis==='y'&&el.style.top!==value)el.style.top=value;
 }
}
function draw() {
 const w=cvWidth,h=cvHeight;if(w<2||h<2){requestAnimationFrame(draw);return}
 ctx.clearRect(0,0,w,h);
 const dark=theme==='dark',side=Math.min(w,h),cx=w/2,cy=h/2,radii=getRadii(side),outer=radii[0],elapsed=playbackElapsed();
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
  // Each lane stays the same color as its roots, pointer and control card,
  // including when another lane is selected. Selection changes emphasis,
  // never the semantic identity of the three unselected rings.
  ctx.save();
  ctx.strokeStyle=COLORS[i];
  ctx.globalAlpha=chosen?1:(t.muted?.85:.88);
  ctx.lineWidth=chosen?2.5:1.6;
  ctx.stroke();
  ctx.restore();
 });
 if(rootDrag&&rootDrag.moved){
  const i=rootDrag.track,r=radii[i],arg=rootDrag.startArg,n=rootDrag.n;
  ctx.save();ctx.setLineDash([2,4]);ctx.strokeStyle=COLORS[i];
  for(let k=0;k<n;k++){const a=-Math.PI/2+(arg+TAU*k)/n;ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,TAU);ctx.stroke()}
  ctx.restore();
 }
 const ringSpacing=Math.min(radii[0]-radii[1],radii[1]-radii[2],radii[2]-radii[3]);
 tracks.forEach((t,i)=>{
  const r=radii[i],c=composePhases(t);
  const phase=RhythmMath.phaseAt(elapsed,t.cycleBars||1,barSeconds()),duration=laneSeconds(t);
  for(const mark of c.merged){
   const a=-Math.PI/2+TAU*mark.phase,x=Math.cos(a)*r,y=Math.sin(a)*r;
   const proximity=((phase-mark.phase)%1+1)%1*duration;
   // Hold the 1.4x+ beat accent for several animation frames. A one-frame
   // mathematical peak can be missed by 60 Hz displays between audio attacks.
   const beatActive=playing&&audio&&audio.currentTime>=beatEpoch&&!t.muted&&proximity<.18;
   const requestedPulse=beatActive&&!reducedMotion?(proximity<=.05?8:8*Math.pow((.18-proximity)/.13,2)):0;
   const marker=visualRootMarker(ringSpacing,requestedPulse,mark.base&&mark.added);
   const {radius,pulse}=marker;
   if(marker.glow){
    ctx.save();ctx.beginPath();ctx.arc(x,y,radius+4.5,0,TAU);
    ctx.strokeStyle=COLORS[i];ctx.globalAlpha=Math.min(.6,.24+pulse*.035);ctx.lineWidth=2.6;ctx.stroke();ctx.restore();
   }
   ctx.beginPath();ctx.arc(x,y,radius,0,TAU);
   ctx.fillStyle=mark.added&&!mark.base?(dark?'#20221d':'#faf8f3'):COLORS[i];
   ctx.fill();ctx.lineWidth=marker.strokeWidth;ctx.strokeStyle=COLORS[i];ctx.stroke();
   if(mark.base&&mark.added){ctx.beginPath();ctx.arc(x,y,Math.max(1.5,radius*.4),0,TAU);ctx.fillStyle=dark?'#20221d':'#faf8f3';ctx.fill()}
   if(pulse>0){ctx.save();ctx.beginPath();ctx.arc(x,y,Math.max(2,radius*.32),0,TAU);ctx.fillStyle=dark?'rgba(255,255,255,.62)':'rgba(255,248,217,.65)';ctx.fill();ctx.restore()}
   // Reduced-motion users still see the audio-clock beat as a stationary
   // brightness change, without expanding or moving the 28px root.
   if(beatActive&&reducedMotion){
    ctx.save();ctx.beginPath();ctx.arc(x,y,Math.max(4,radius*.52),0,TAU);
    ctx.fillStyle=dark?'rgba(255,255,255,.70)':'rgba(255,248,217,.76)';
    ctx.fill();ctx.restore();
   }
   if(t.muted){ctx.beginPath();ctx.arc(x,y,radius+1.3,0,TAU);ctx.strokeStyle=dark?'#555951':'#b5b5ab';ctx.lineWidth=2;ctx.stroke()}
  }
 });
 // A static selection halo marks the user's inspected root. It never
 // acts as the retired radial playback pointer, nor changes event timing.
 if(inspectedRoot&&inspectedRoot.lane===selectedTrack){
  const t=tracks[inspectedRoot.lane],phase=inspectionPhase(t,inspectedRoot);
  if(Number.isFinite(phase)){
   const angle=-Math.PI/2+TAU*phase,r=radii[inspectedRoot.lane];
   ctx.save();ctx.beginPath();
   ctx.arc(Math.cos(angle)*r,Math.sin(angle)*r,Math.max(19,ringSpacing*.32),0,TAU);
   ctx.strokeStyle=COLORS[inspectedRoot.lane];ctx.lineWidth=2.5;
   ctx.setLineDash([4,3]);ctx.stroke();ctx.restore();
   // A separate static dashed outline shows genuinely simultaneous phases
   // on other independently timed rings. Never draw a radial playback hand.
   const atBars=inspectionOccurrence(t,inspectedRoot,phase).absoluteBars;
   const linked=coincidentLaneEvents(atBars,inspectedRoot.lane);
   for(const match of linked){
    const angle=-Math.PI/2+TAU*match.phase,otherR=radii[match.lane];
    ctx.save();ctx.beginPath();
    ctx.arc(Math.cos(angle)*otherR,Math.sin(angle)*otherR,
     Math.max(16,Math.min(20,ringSpacing*.3)),0,TAU);
    ctx.strokeStyle=COLORS[match.lane];ctx.globalAlpha=match.muted?.72:1;
    ctx.lineWidth=2;ctx.setLineDash([3,5]);ctx.stroke();ctx.restore();
   }
  }
 }
 // Four short, tangential playheads travel ON their own root ring.
 // Draw last: a contrasting triangle remains visible on top of a filled
 // root precisely when that root's sound is scheduled. No radial ray crosses
 // any ring, and equal cycleBars always yield identical clock angles.
 const hands=orbitHandStates(elapsed);
 const pointerEvidence=[];
 hands.forEach(hand=>{
  const r=radii[hand.lane],angle=-Math.PI/2+TAU*hand.phase;
  const arcLength=Math.min(r*.4,21,Math.max(10,r*.16));
  const startAngle=angle-arcLength/r;
  const cos=Math.cos(angle),sin=Math.sin(angle),tx=-sin,ty=cos;
  const x=r*cos,y=r*sin;
  pointerEvidence.push({...hand,radius:r,angle,startAngle,x,y});
  ctx.save();
  ctx.globalAlpha=hand.muted?.45:playing?1:.72;
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.arc(0,0,r,startAngle,angle);
  ctx.strokeStyle=COLORS[hand.lane];ctx.lineWidth=hand.lane===selectedTrack?6.5:5.5;ctx.stroke();
  // Arrow tip is EXACTLY at the root's phase, rather than ahead of it.
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x-tx*13+cos*6,y-ty*13+sin*6);
  ctx.lineTo(x-tx*13-cos*6,y-ty*13-sin*6);
  ctx.closePath();
  ctx.fillStyle=COLORS[hand.lane];
  ctx.fill();
  // While stopped, a hand parked exactly on a root must not recolor that
  // root's mathematical center pixel (all cardinal-marker QA samples).
  // On playback, a contrasting arrowhead outline remains visible over hits.
  if(playing){
   ctx.strokeStyle=dark?'#20221d':'#faf8f3';
   ctx.lineWidth=1.4;ctx.stroke();
  }
  ctx.restore();
 });
 lastOrbitalHandFrame={elapsed,beatEpoch,audioTime:audio?.currentTime??null,
  bpm,barSeconds:barSeconds(),playing,selectedLane:selectedTrack,
  hands:pointerEvidence};
 const count=events(tracks[selectedTrack]).length;
 ctx.font=`650 ${Math.max(14,Math.min(24,side*.044))}px system-ui`;
 ctx.fillStyle=COLORS[selectedTrack];ctx.fillText(String(count),0,-3);
 ctx.font='18px system-ui';ctx.fillStyle=baseInk;ctx.fillText('events',0,29);
 ctx.restore();
 if(playing&&audio){cycles=Math.floor(elapsed/cycleSeconds())+1}
 const common=RhythmMath.commonCycle(tracks);
 const currentBar=Math.floor(elapsed/barSeconds())%common;
 const label=`Bar ${currentBar+1} / ${common} · 4/4`;
 if(label!==lastCycleText){$('timeDisplay').textContent=label;lastCycleText=label}
 requestAnimationFrame(draw);
}
function saveJson(){const data={format:'roots-rhythm/1',name:activePresetId?BROWSE_PRESETS.find(p=>p.id===activePresetId)?.name:(importedProjectName||'My complex rhythm'),bpm,bars:cycleBars,tracks};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='complex-rhythm.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function validateImportedFields(project){
 const validate=(value,allowed,description)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error(description+' must be an object');
  for(const key of Object.keys(value))if(!allowed.has(key))
   throw Error('Unsupported '+description+' field "'+key+'"; import cancelled to preserve data');
 };
 validate(project,new Set(['format','name','bpm','bars','tracks']),'project');
 project.tracks.forEach((t,i)=>{
  validate(t,new Set(['a','b','n','sound','muted','layers','operation','gain',
    'patch','euclidean','cycleBars','laneIndex']),'track '+(i+1));
  if(t.layers!==undefined){
   if(!Array.isArray(t.layers))throw Error('Track '+(i+1)+' layers must be an array');
   t.layers.forEach((l,j)=>validate(l,new Set(['a','b','n','velocity']),
    'track '+(i+1)+' additional root set '+(j+1)));
  }
  if(t.euclidean!=null)validate(t.euclidean,new Set(['k','n','rotation','velocity']),
   'track '+(i+1)+' Euclidean settings');
  if(t.patch!=null)validate(t.patch,new Set(['osc','cutoff','q','decay','accent','slide','drive',
   'modulation','depth','base','start','noise']),'track '+(i+1)+' synthesis patch');
 });
}
async function loadJson(file){try{if(file.size>100000)throw Error('File is too large');const d=JSON.parse(await file.text());if(d?.format!=='roots-rhythm/1'||!Array.isArray(d.tracks)||d.tracks.length!==4)throw Error('Expected roots-rhythm/1 with four tracks');
 validateImportedFields(d);
 if(d.tracks.some(t=>!t||typeof t!=='object'||(t.cycleBars!==undefined&&(!Number.isInteger(t.cycleBars)||t.cycleBars<1||t.cycleBars>16))||!Number.isFinite(Number(t.a))||!Number.isFinite(Number(t.b))||Math.abs(Number(t.a))>10000||Math.abs(Number(t.b))>10000||!Number.isInteger(Number(t.n))||Number(t.n)<1||Number(t.n)>64||!Object.hasOwn(SOUNDS,t.sound)||t.layers!==undefined&&(!Array.isArray(t.layers)||t.layers.length>5||t.layers.some(l=>!l||!Number.isFinite(Number(l.a))||!Number.isFinite(Number(l.b))||Math.abs(Number(l.a))>10000||Math.abs(Number(l.b))>10000||!Number.isInteger(Number(l.n))||Number(l.n)<1||Number(l.n)>64||!Number.isFinite(Number(l.velocity))||Number(l.velocity)<.1||Number(l.velocity)>1))))throw Error('Check a, b, n and sound for every track');
 const phase=transportPhase(),oldCycle=cycleSeconds();
 const cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/oldCycle):0;
 cycleBars=d.bars===2?2:1;
 inspectedRoot=null;
 tracks=d.tracks.map((t,i)=>cleanTrack({...t,cycleBars:t.cycleBars??cycleBars},i));
 bpm=safeInt(d.bpm,50,260,138);
 const importedName=typeof d.name==='string'?d.name.trim().slice(0,45):'';
 const sourcePreset=BROWSE_PRESETS.find(p=>p.name===importedName);
 activePresetId=sourcePreset?.id||null;
 presetModified=Boolean(sourcePreset);
 importedProjectName=sourcePreset?null:(importedName||file.name.slice(0,45));
 // Unnamed imported material has no genre identity: do not inherit a stale
 // previous preset's sample mappings or claim that it is a previous preset.
 activeCategory=sourcePreset?.category||'other';
 browseCategory=sourcePreset?categoryForPreset(sourcePreset):'other';
 $('bpm').value=String(bpm);$('bpmText').textContent=String(bpm);
 activateLoadedRhythm(phase,cycle);
 renderPresets();renderTracks();renderEditor();renderWindowTimeline();
 if(magnified)refreshPlotZoom();
 showToast('Imported rhythm: '+(importedName||file.name))}catch(e){showToast('Import failed: '+e.message)}}
function setupEvents() {
 const resultStrip=$('unionStrip');
 resultStrip.addEventListener('click',e=>{
  const box=resultStrip.getBoundingClientRect();
  if(!box.width)return;
  // The displayed line occupies the inner 96% of the strip.
  const phase=Math.max(0,Math.min(1,((e.clientX-box.left)/box.width-.02)/.96));
  inspectResultPhase(phase);
 });
 resultStrip.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End','Escape','Enter',' '].includes(e.key))return;
  e.preventDefault();
  if(e.key==='Escape'){
   inspectedRoot=null;renderRootInspection();
   $('rootInspectionAnnouncement').textContent='Root inspection cleared';
  }else if(e.key==='Enter'||e.key===' '){
   const all=events(tracks[selectedTrack]);
   const phase=inspectedRoot?.lane===selectedTrack?inspectionPhase(tracks[selectedTrack],inspectedRoot):undefined;
   const current=Number.isFinite(phase)?all.find(item=>{
    const d=Math.abs(item.phase-phase);return Math.min(d,1-d)<1e-6;
   }):null;
   inspectCanonicalEvent(current||all[0]);
  }else inspectNeighborEvent(e.key==='ArrowLeft'?-1:1,
   e.key==='Home'?'first':e.key==='End'?'last':null);
 });
 $('clearRootInspection').addEventListener('click',()=>{inspectedRoot=null;renderRootInspection()});
 $('rootRuleInfoToggle').addEventListener('click',()=>{
  const panel=$('rootRuleInfoPanel'),button=$('rootRuleInfoToggle');
  const open=panel.hidden;panel.hidden=!open;
  button.setAttribute('aria-expanded',String(open));
  button.setAttribute('aria-label',open?'Hide root geometry explanation':'Show root geometry explanation');
  if(open)renderRootRule();
 });
 $('categorySelect').addEventListener('change',e=>{browseCategory=e.target.value;renderPresets()});
 $('presetSelect').addEventListener('change',e=>{const p=BROWSE_PRESETS.find(p=>p.id===e.target.value);if(p)applyPreset(p)});
 $('playBtn').addEventListener('click',togglePlay);
 $('resetBtn').addEventListener('click',reset);
 $('previewBtn').addEventListener('click',previewSound);
 $('advancedSoundDetails').addEventListener('toggle',event=>{
  if(event.target.open)refreshSoundLab(true);
  else {soundLabToken++;if(soundLabTimer!==null){clearTimeout(soundLabTimer);soundLabTimer=null}}
 });
 $('soundLabLane').addEventListener('change',event=>{
  soundLabLane=Number(event.target.value);refreshSoundLab(true);
 });
 $('soundLabPreview').addEventListener('click',()=>previewTrack(soundLabLane));
 $('soundLabReset').addEventListener('click',()=>{
  const track=tracks[soundLabLane];if(!track)return;
  track.patch=null;refreshSoundLab(true);markCustom();
 });
 enableFocusedWheel($('argumentAngle'));
 $('argumentAngle').addEventListener('input',e=>{
  const t=tracks[selectedTrack];if(!applyRotation(t,Number(e.target.value)*Math.PI/180))return;
  syncVisibleInputs(selectedTrack);
  updateLaneStatus(selectedTrack);renderReadout();markCustom();
 });
 $('bpm').addEventListener('input',e=>{
  const phase=transportPhase(),cycle=playing&&audio?Math.floor(Math.max(0,audio.currentTime-beatEpoch)/cycleSeconds()):0;
  bpm=Number(e.target.value);$('bpmText').textContent=String(bpm);
  if(playing&&audio){cancelVoices();beatEpoch=audio.currentTime-(cycle+phase)*cycleSeconds();scheduledUntil=audio.currentTime+.006}
  if(inspectedRoot)renderRootInspection();
  markCustom(false);
 });
 enableFocusedWheel($('volume'));
 $('volume').addEventListener('input',e=>{volume=Number(e.target.value)/100;$('volumeText').textContent=e.target.value+'%';if(master&&audio)window.RhythmVoices.setMasterVolume(master,volume,audio.currentTime)});
 $('loadRootExample').addEventListener('click',()=>{
  const t=tracks[selectedTrack];
  t.a=1;t.b=0;t.n=4;t.operation='union';
  t.layers=[{a:1,b:0,n:3,velocity:.65}];t.euclidean=null;
  selectedRootIndex=0;
  renderTracks();renderEditor();markCustom();
  $('compositionPanel').open=true;
  showToast('4 evenly spaced phases + 3 evenly spaced phases = 6 unique phases');
 });
 $('addLayer').addEventListener('click',()=>{
  const t=tracks[selectedTrack];if(t.layers.length>=5)return;
  const angle=Math.PI/4;const p=RhythmMath.fromPolar(1,angle);
  t.layers.push({a:p.a,b:p.b,n:1,velocity:.65});
  renderLayers();updateLaneStatus(selectedTrack);renderReadout();markCustom();
 });
 $('addRootFamily').addEventListener('click',()=>{
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
 function onRootDot(p,t,r){return t.a===0&&t.b===0?false:rootPhases(t).some(ph=>{const a=-Math.PI/2+TAU*ph;return Math.hypot(p.x-Math.cos(a)*r,p.y-Math.sin(a)*r)<=Math.max(22,p.side*.025)})}
 canvas.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  const p=canvasPoint(e),dist=Math.hypot(p.x,p.y);
  const near=getRadii(p.side).map((r,i)=>({r,i,gap:Math.abs(r-dist)})).sort((a,b)=>a.gap-b.gap)[0];
  if(near.gap>Math.max(22,p.side*.06))return;
  chooseTrack(near.i);const t=tracks[near.i],k=selectRootIndexAtPoint(p,t,near.r);
  const pointDistance=phase=>{
   const a=-Math.PI/2+TAU*phase;
   return Math.hypot(p.x-Math.cos(a)*near.r,p.y-Math.sin(a)*near.r);
  };
  const visibleEvents=events(t);
  const baseDistance=k>=0&&visibleEvents.some(ev=>ev.sources.some(s=>s.kind==='base'&&s.index===k))
   ?pointDistance(rootPhases(t)[k]):Infinity;
  // Only canonical visible events can be inspected. The nearest marker wins,
  // while a shared base marker remains draggable on a geometric tie.
  let extra=null;
  for(const ev of visibleEvents){
   const source=ev.sources.find(s=>s.kind==='additional'||s.kind==='euclidean');
   if(!source)continue;
   const distance=pointDistance(ev.phase);
   if(distance<=Math.max(22,p.side*.03)&&(!extra||distance<extra.distance))
    extra={distance,source};
  }
  if(Number.isFinite(baseDistance)&&(!extra||baseDistance<=extra.distance+1)){
   selectedRootIndex=k;inspectedRoot={lane:near.i,kind:'base',index:k};
   updateSelectedRootMath();renderRootInspection();
   rootDrag={id:e.pointerId,track:near.i,n:t.n,startArg:Math.atan2(t.b,t.a),startPointer:Math.atan2(p.y,p.x),
     centerX:e.clientX-p.x,centerY:e.clientY-p.y,moved:false};
   canvas.setPointerCapture(e.pointerId);
  }else if(extra){
   inspectedRoot={lane:near.i,kind:extra.source.kind,index:extra.source.index,sourceIndex:extra.source.sourceIndex};
   renderRootInspection();
  }
 });
 function updateRootDrag(e){
  if(!rootDrag||rootDrag.id!==e.pointerId)return;
  // Preserve the pointerdown center: dynamic math labels can change layout/scroll anchoring.
  const delta=wrapAngle(Math.atan2(e.clientY-rootDrag.centerY,e.clientX-rootDrag.centerX)-rootDrag.startPointer);
  if(!rootDrag.moved&&Math.abs(delta)<.004)return;
  rootDrag.moved=true;
  const t=tracks[rootDrag.track];
  if(!applyRotation(t,rootDrag.startArg+t.n*delta))return;
  syncVisibleInputs(rootDrag.track);
  updateLaneStatus(rootDrag.track);renderReadout();markCustom();
  canvas.classList.add('is-dragging');
 }
 canvas.addEventListener('pointermove',updateRootDrag);
 // Coalescing may suppress the final pointermove: commit the release coordinate.
 canvas.addEventListener('pointerup',e=>{
  if(!rootDrag||rootDrag.id!==e.pointerId)return;
  updateRootDrag(e);
  rootDrag=null;canvas.classList.remove('is-dragging');
 });
 function cancelRootDrag(e){
  if(!rootDrag||rootDrag.id!==e.pointerId)return;
  rootDrag=null;canvas.classList.remove('is-dragging');
 }
 canvas.addEventListener('pointercancel',cancelRootDrag);
 canvas.addEventListener('lostpointercapture',cancelRootDrag);
 canvas.addEventListener('keydown',e=>{
  // Digit shortcuts are scoped to the focused Canvas, never number editors.
  if(!e.altKey&&!e.ctrlKey&&!e.metaKey&&['1','2','3','4'].includes(e.key)){
   e.preventDefault();chooseTrack(Number(e.key)-1);return;
  }
  if(['[',']','Home','End','Escape'].includes(e.key)){
   e.preventDefault();
   if(e.key==='Escape'){
    inspectedRoot=null;renderRootInspection();
    $('rootInspectionAnnouncement').textContent='Root inspection cleared';
   }else inspectNeighborEvent(e.key==='['?-1:1,e.key==='Home'?'first':e.key==='End'?'last':null);
   return;
  }
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
 if(tracks.length){renderTracks();renderEditor();scheduleSoundWavePreview()}
}
// Read-only research/CI snapshots; never expose writable runtime state.
window.RhythmResearch=Object.freeze({
 current:()=>({bpm,tracks:tracks.map(t=>JSON.parse(JSON.stringify(t)))}),
 transport:()=>({
  playing,audioState:audio?.state||'uninitialized',
  transportWanted,transportTicket,schedulerIntervalsCreated,schedulerIntervalsCleared,
  pendingEditReschedule,phase:transportPhase(),pausedPhase,cycleSeconds:cycleSeconds(),
  timerActive:timerId!==null,
  activePresetId,bpm,
  pendingVoiceBusDisposals,completedVoiceBusDisposals,voiceBusGenerations,
  liveHitBuses:liveHitBuses.size,peakLiveHitBuses,disposedHitBuses,hitCleanupTimerActive:hitCleanupTimer!==null,
  hasLiveVoiceBus:!!voiceBus,scheduledUntil,
  audioTime:audio?.currentTime??0,beatEpoch
 }),

 // Diagnostic snapshot only: tracks and sample-family selection cannot be mutated here.
 samplePlan:()=>({category:activeCategory,keys:[...prioritySampleKeys()]}),
 orbitalHands:()=>({
  // Captures phases and actual Canvas tip geometry from the most recent frame.
  // UI and audio use the same beatEpoch/barSeconds/cycleBars.
  ...(lastOrbitalHandFrame||{elapsed:0,playing:false,hands:[]}),
  hands:(lastOrbitalHandFrame?.hands||[]).map(h=>({...h}))
 }),
 markerVisualForSize:(size,requestedPulse,coincident=false)=>visualRootMarker(getRadii(size)[0]-getRadii(size)[1],requestedPulse,coincident),
 radiiForSize:size=>getRadii(size),
 presets:()=>PRESETS.map(p=>({
  id:p.id,name:p.name,category:p.category,bpm:p.bpm,bars:p.bars||1,
  character:p.character||'',mathNote:p.mathNote||'',
  tracks:p.tracks.map((t,i)=>cleanTrack({...t,cycleBars:t.cycleBars??(p.bars===2?2:1)},i))
 })),
 events:track=>events(cleanTrack(track,0)).map(e=>({phase:e.phase,velocity:e.velocity})),
 eventMetadata:track=>events(cleanTrack(track,0)).map(e=>({phase:e.phase,velocity:e.velocity,sources:e.sources.map(x=>({...x}))})),
 rootPhases:track=>rootPhases(cleanTrack(track,0))
});
let savedTheme='light';
try{savedTheme=localStorage.getItem('roots-rhythm-theme')||'light'}catch(_){}
initMath();setupEvents();applyPreset(PRESETS.find(p=>p.id==='afro')||PRESETS[0]);setTheme(savedTheme);
// Keep the *visible* math fitted after window resizing; layout changes do
// not modify any musical or mathematical source value.
let pendingMathResize=0;
window.addEventListener('resize',()=>{
 if(pendingMathResize)cancelAnimationFrame(pendingMathResize);
 pendingMathResize=requestAnimationFrame(()=>{
  pendingMathResize=0;
  for(let i=0;i<tracks.length;i++){
   const eq=$('laneEq'+i);if(eq)renderLaneEquation(eq,tracks[i]);
  }
  fitRootMath('rootRuleEquation',23,16);
  fitRootMath('rootRuleValues',18,16);
  fitRootMath('rootRuleSpacing',18,16);
 });
});
resizeCanvas();requestAnimationFrame(draw);
})();
