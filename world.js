(()=>{
'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STORE='tejaswinni-living-atlas-v2';
const places={
 garden:{number:'01',title:'The Wild Garden',eyebrow:'A LITTLE THING THAT GROWS',description:'A tiny seed, a little patience, and a moment to notice something bloom. Give this one a few gentle taps.',symbol:'✿',hint:'GROW A LITTLE SOMETHING'},
 cafe:{number:'02',title:'Cloud Nine Café',eyebrow:'A WINDOW SEAT FOR EVERY KIND OF DAY',description:'The café does not serve coffee. It serves a change of weather. Choose the kind of day you would like to step into.',symbol:'☁',hint:'CHOOSE YOUR SKY'},
 trail:{number:'03',title:'The Long Way Round',eyebrow:'THE SCENIC ROUTE',description:'Three paths leave the valley. Pick one, then follow the little footprints. The best discoveries are not always on the shortest way.',symbol:'⌁',hint:'FOLLOW THE LITTLE FOOTPRINTS'},
 sky:{number:'04',title:'The Quiet Observatory',eyebrow:'WHEN THE WORLD GOES QUIET',description:'A few stars have wandered away from their places. Bring them together and leave a small wish in the night.',symbol:'✧',hint:'CONNECT THE LITTLE STARS'}
};
const state={found:[],gardenTaps:0,mood:'',trail:'',trailSteps:[],stars:[]};
try{
 const saved=JSON.parse(localStorage.getItem(STORE)||'null');
 if(saved&&typeof saved==='object'){
  state.found=Array.isArray(saved.found)?saved.found.filter(x=>places[x]):[];
  state.gardenTaps=Math.min(3,Math.max(0,Number(saved.gardenTaps)||0));
  state.mood=typeof saved.mood==='string'?saved.mood:'';
  state.trail=typeof saved.trail==='string'?saved.trail:'';
  state.trailSteps=Array.isArray(saved.trailSteps)?saved.trailSteps.filter(x=>Number.isInteger(x)&&x>=0&&x<3):[];
  state.stars=Array.isArray(saved.stars)?saved.stars.filter(x=>Number.isInteger(x)&&x>=0&&x<5):[];
 }
}catch(error){}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch(error){}};
let toastTimer=null;
function toast(message){
 const el=$('#toast');el.textContent=message;el.classList.add('show');
 window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('show'),2600);
}
function showScreen(id){
 $$('.screen').forEach(screen=>{const active=screen.id===id;screen.hidden=!active;screen.classList.toggle('active',active)});
 window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});
}
function updateWeather(){
 const labels={clear:'A CLEAR LITTLE DAY',soft:'A SOFTER KIND OF DAY',bright:'A BRIGHT LITTLE DAY',quiet:'A QUIET BLUE HOUR'};
 document.body.dataset.weather=state.mood||'clear';
 $('#weatherLabel').innerHTML='<i></i> '+(labels[state.mood]||labels.clear);
}
function updateMap(){
 const count=state.found.length;
 $('#atlasProgress').textContent=count+' / 4 FOUND';
 $('#journalCount').textContent=count+'/4';
 $$('[data-place]').forEach(button=>{
  const found=state.found.includes(button.dataset.place);
  button.classList.toggle('found',found);
  button.setAttribute('aria-label',places[button.dataset.place].title+(found?' — discovered':''));
 });
 $('#openFinale').hidden=count!==4;
 updateJournal();
}
function updateJournal(){
 const count=state.found.length;
 $('#journalMeterFill').style.width=(count/4*100)+'%';
 $('#journalMeterLabel').textContent=count+' OF 4 PLACES DISCOVERED';
 const list=$('#journalList');
 if(!count){list.innerHTML='<p class="journal-empty">Your first little discovery is waiting somewhere on the map.</p>';return}
 list.innerHTML=state.found.map(id=>'<div class="journal-entry"><span>'+places[id].symbol+'</span><div><b>'+places[id].title.toUpperCase()+'</b><small>'+places[id].hint+'</small></div></div>').join('');
}
function markFound(id){
 if(!state.found.includes(id)){state.found.push(id);save();updateMap();toast('A little discovery for your field notes. ✧')}
 const status=$('#placeStatus');
 if(status){status.textContent='FOUND · ADDED TO YOUR FIELD NOTES';status.classList.add('place-status-done')}
 if(state.found.length===4){toast('All four places are in your field notes. The last page is ready.')}
}
function artMarkup(id){
 const stars='<span class="art-star s1">✦</span><span class="art-star s2">✧</span><span class="art-star s3">✦</span>';
 return '<span class="art-sun"></span><span class="art-mountain back"></span><span class="art-mountain"></span><span class="art-ground"></span>'+
  (id==='sky'?stars:'<span class="art-tree one">♠</span><span class="art-tree two">♠</span>')+
  (id==='cafe'?'<span class="art-cottage"></span><span class="art-flower f1">☕</span><span class="art-flower f2">✿</span>':
   id==='garden'?'<span class="art-flower f1">✿</span><span class="art-flower f2">✿</span><span class="art-flower f3">✿</span>':
   id==='trail'?'<span class="art-cottage"></span><span class="art-flower f1">⌁</span>':'');
}
function gardenInteraction(){
 return '<div class="garden-game"><p class="interaction-kicker">A SEED IS A SMALL BEGINNING</p><div class="garden-stage"><button class="seed-button" id="gardenSeed" type="button" aria-label="Help the little flower grow"><span class="seed-flower" id="seedFlower">✿</span><span class="seed-stem"></span><span>🌱</span></button><p class="garden-instruction" id="gardenInstruction">TAP THE LITTLE SEED THREE TIMES</p></div><div class="interaction-progress"><i id="gardenProgress"></i></div><p class="interaction-result" id="gardenResult">Some lovely things take a little time.</p></div>';
}
function cafeInteraction(){
 const moods=[
  ['soft','☁','SOFT','A gentle sky, a slow breath, and permission to take today one little step at a time.'],
  ['bright','☀','BRIGHT','A little sunshine for the ordinary bits. May something unexpectedly lovely find you today.'],
  ['quiet','☾','QUIET','A blue-hour kind of calm. Let the noise settle; nothing needs solving this very second.'],
  ['curious','✧','CURIOUS','A sky full of somewhere-new. Keep noticing, keep wondering, and follow the next interesting path.']
 ];
 return '<div class="cafe-game"><p class="interaction-kicker">PICK THE WEATHER YOU NEED</p><div class="mood-options">'+moods.map(m=>'<button class="mood-option" data-mood="'+m[0]+'" type="button"><span>'+m[1]+'</span><b>'+m[2]+'</b><small>choose this sky</small></button>').join('')+'</div><div class="mood-weather" id="moodWeather">The café is listening. Choose a sky and the whole little world will change with it.</div></div>';
}
function trailInteraction(){
 const routes=[
  ['ridge','↗','THE HIGH RIDGE','For the wide-open kind of day.'],
  ['lake','⌁','THE QUIET LAKE','For when everything can wait.'],
  ['woods','✳','THE LITTLE WOODS','For a bit of delightful mystery.']
 ];
 return '<div class="trail-game"><p class="interaction-kicker">CHOOSE A WAY THROUGH THE VALLEY</p><div class="trail-options">'+routes.map(r=>'<button class="trail-option" data-route="'+r[0]+'" type="button"><span>'+r[1]+'</span><b>'+r[2]+'</b><small>'+r[3]+'</small></button>').join('')+'</div><div id="trailFollow" hidden><p class="interaction-kicker" style="margin-top:20px">FOLLOW THE FOOTPRINTS IN ORDER</p><div class="footstep-track"><button data-step="0" type="button" aria-label="First footprint">⌁</button><button data-step="1" type="button" aria-label="Second footprint">⌁</button><button data-step="2" type="button" aria-label="Third footprint">⌁</button><span id="trailCount">0 / 3 FOUND</span></div><p class="interaction-result" id="trailResult">The path will show itself one step at a time.</p></div></div>';
}
function skyInteraction(){
 return '<div class="sky-game"><p class="interaction-kicker">CONNECT FIVE STARS TO FINISH THE PATTERN</p><div class="star-board"><svg viewBox="0 0 500 190" preserveAspectRatio="none" aria-hidden="true"><path id="starPath" d="M65 126 L155 45 L255 105 L365 35 L445 132"/></svg><button class="sky-star-button" data-star="0" type="button" aria-label="Star one">✦</button><button class="sky-star-button" data-star="1" type="button" aria-label="Star two">✧</button><button class="sky-star-button" data-star="2" type="button" aria-label="Star three">✦</button><button class="sky-star-button" data-star="3" type="button" aria-label="Star four">✧</button><button class="sky-star-button" data-star="4" type="button" aria-label="Star five">✦</button></div><p class="sky-instruction" id="skyInstruction">0 / 5 STARS CONNECTED</p><p class="sky-reveal" id="skyReveal">A little wish is waiting in the quiet.</p></div>';
}
function openPlace(id){
 const place=places[id];if(!place)return;
 $('#placeNumber').textContent='PLACE '+place.number+' / 04';
 $('#placeEyebrow').textContent=place.eyebrow;
 $('#placeTitle').textContent=place.title;
 $('#placeDescription').textContent=place.description;
 $('#placeArt').dataset.art=id;
 $('#placeArt').innerHTML=artMarkup(id);
 $('#placeStatus').textContent=state.found.includes(id)?'FOUND · ADDED TO YOUR FIELD NOTES':'A SMALL DISCOVERY IS WAITING';
 $('#placeStatus').classList.toggle('place-status-done',state.found.includes(id));
 const mount=$('#placeInteraction');
 mount.innerHTML=id==='garden'?gardenInteraction():id==='cafe'?cafeInteraction():id==='trail'?trailInteraction():skyInteraction();
 if(id==='garden')bindGarden();
 if(id==='cafe')bindCafe();
 if(id==='trail')bindTrail();
 if(id==='sky')bindSky();
 showScreen('placeScreen');
}
function bindGarden(){
 const button=$('#gardenSeed');
 const taps=Math.min(3,state.gardenTaps);
 const flower=$('#seedFlower'),instruction=$('#gardenInstruction'),progress=$('#gardenProgress'),result=$('#gardenResult');
 function render(){
  progress.style.width=(state.gardenTaps/3*100)+'%';
  if(state.gardenTaps>=3){button.classList.add('bloomed');instruction.textContent='A LITTLE FLOWER, JUST LIKE THAT';result.textContent='Some things bloom quietly, and that is lovely too.';markFound('garden')}
  else{instruction.textContent='TAP THE LITTLE SEED '+(3-state.gardenTaps)+' MORE TIME'+(3-state.gardenTaps===1?'':'S');result.textContent=state.gardenTaps?'A tiny bit of green is showing.':'Some lovely things take a little time.'}
 }
 button.addEventListener('click',()=>{
  if(state.gardenTaps>=3)return;
  state.gardenTaps++;save();render();
  if(state.gardenTaps<3)button.animate([{transform:'scale(1)'},{transform:'scale(1.12) rotate(-5deg)'},{transform:'scale(1)'}],{duration:360});
 });
 render();
}
function bindCafe(){
 const messages={
  soft:'A gentle sky, a slow breath, and permission to take today one little step at a time.',
  bright:'A little sunshine for the ordinary bits. May something unexpectedly lovely find you today.',
  quiet:'A blue-hour kind of calm. Let the noise settle; nothing needs solving this very second.',
  curious:'A sky full of somewhere-new. Keep noticing, keep wondering, and follow the next interesting path.'
 };
 $$('[data-mood]').forEach(button=>{
  button.addEventListener('click',()=>{
   state.mood=button.dataset.mood;save();updateWeather();
   $$('[data-mood]').forEach(other=>other.classList.toggle('selected',other===button));
   $('#moodWeather').textContent=messages[state.mood];
   markFound('cafe');
  });
  if(state.mood===button.dataset.mood)button.classList.add('selected');
 });
 if(state.mood){$('#moodWeather').textContent=messages[state.mood]}
}
function bindTrail(){
 const follow=$('#trailFollow');
 $$('[data-route]').forEach(button=>{
  button.addEventListener('click',()=>{
   if(state.trail!==button.dataset.route){state.trail=button.dataset.route;state.trailSteps=[];save()}
   $$('[data-route]').forEach(other=>other.classList.toggle('selected',other===button));
   follow.hidden=false;renderTrailSteps();
  });
  if(state.trail===button.dataset.route)button.classList.add('selected');
 });
 if(state.trail)follow.hidden=false;
 function renderTrailSteps(){
  $$('[data-step]').forEach(button=>button.classList.toggle('found',state.trailSteps.includes(Number(button.dataset.step))));
  $('#trailCount').textContent=state.trailSteps.length+' / 3 FOUND';
  $('#trailResult').textContent=state.trailSteps.length===3?'You found the quiet little shortcut. The view was worth it.':'One footprint at a time. No need to hurry.';
  if(state.trailSteps.length===3)markFound('trail');
 }
 $$('[data-step]').forEach(button=>{
  button.addEventListener('click',()=>{
   const step=Number(button.dataset.step);
   if(state.trailSteps.includes(step))return;
   if(step!==state.trailSteps.length){toast('Follow the little footprints in order.');return}
   state.trailSteps.push(step);save();renderTrailSteps();
  });
 });
 if(state.trail)renderTrailSteps();
}
function bindSky(){
 const pattern=[0,1,2,3,4];
 $$('[data-star]').forEach(button=>{
  const index=Number(button.dataset.star);
  if(state.stars.includes(index))button.classList.add('found');
  button.addEventListener('click',()=>{
   if(state.stars.includes(index))return;
   state.stars.push(index);save();button.classList.add('found');
   $('#skyInstruction').textContent=state.stars.length+' / 5 STARS CONNECTED';
   if(state.stars.length===5){
    $('#starPath').style.strokeDasharray='none';
    $('#skyReveal').textContent='There. A little constellation, holding a wish for all the lovely things still ahead.';
    markFound('sky');
   }else{$('#skyReveal').textContent='One more little light in the right place.'}
  });
 });
 $('#skyInstruction').textContent=state.stars.length+' / 5 STARS CONNECTED';
 if(state.stars.length===5){$('#starPath').style.strokeDasharray='none';$('#skyReveal').textContent='There. A little constellation, holding a wish for all the lovely things still ahead.'}
}
function openDialog(dialog){if(!dialog.open)dialog.showModal()}
function closeDialog(dialog){if(dialog.open)dialog.close()}
function resetJourney(){
 Object.assign(state,{found:[],gardenTaps:0,mood:'',trail:'',trailSteps:[],stars:[]});
 save();updateWeather();updateMap();showScreen('mapScreen');toast('A fresh little wander. Take it at your own pace.');
}
$('#enterWorld').addEventListener('click',()=>showScreen('mapScreen'));
$('#openEnvelope').addEventListener('click',()=>openDialog($('#noteDialog')));
$('#noteEnter').addEventListener('click',()=>{closeDialog($('#noteDialog'));showScreen('mapScreen')});
$$('[data-close-note]').forEach(button=>button.addEventListener('click',()=>closeDialog($('#noteDialog'))));
$('#mapNoteOpen').addEventListener('click',()=>openDialog($('#noteDialog')));
$('#journalOpen').addEventListener('click',()=>{updateJournal();openDialog($('#journalDialog'))});
$$('[data-close-journal]').forEach(button=>button.addEventListener('click',()=>closeDialog($('#journalDialog'))));
$('#journalClose').addEventListener('click',()=>closeDialog($('#journalDialog')));
$('#exploreOpen').addEventListener('click',()=>{openDialog($('#exploreDialog'));$('#exploreSearch').focus()});
$$('[data-close-explore]').forEach(button=>button.addEventListener('click',()=>closeDialog($('#exploreDialog'))));
$('#exploreSearch').addEventListener('input',event=>{
 const query=event.target.value.trim().toLowerCase();
 $$('#exploreResults button').forEach(button=>{button.hidden=!button.textContent.toLowerCase().includes(query)});
});
$$('[data-jump]').forEach(button=>button.addEventListener('click',()=>{closeDialog($('#exploreDialog'));openPlace(button.dataset.jump)}));
$$('[data-place]').forEach(button=>button.addEventListener('click',()=>openPlace(button.dataset.place)));
$('#backToMap').addEventListener('click',()=>{updateMap();showScreen('mapScreen')});
$('#nextPlace').addEventListener('click',()=>{updateMap();showScreen('mapScreen')});
$('#openFinale').addEventListener('click',()=>{if(state.found.length===4)showScreen('finaleScreen');else toast('There are still a few little places to discover.')});
$('#wanderAgain').addEventListener('click',()=>showScreen('mapScreen'));
$('#makeKeepsake').addEventListener('click',()=>{
 const messages={soft:'A softer sky, a quieter moment, and a little room to breathe.',bright:'A little sunshine from a little world. May something good find you today.',quiet:'A quiet blue hour, a small wish, and all the time in the world.',curious:'Greetings from somewhere new. Keep wondering, keep wandering.'};
 $('#keepsakeMessage').textContent=messages[state.mood]||'A little hello from somewhere lovely. May something good find you today.';
 openDialog($('#keepsakeDialog'));
});
$$('[data-close-keepsake]').forEach(button=>button.addEventListener('click',()=>closeDialog($('#keepsakeDialog'))));
$('#downloadKeepsake').addEventListener('click',()=>{
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;
 const ctx=canvas.getContext('2d');
 if(!ctx){$('#keepsakeStatus').textContent='This browser could not prepare the card.';return}
 const gradient=ctx.createLinearGradient(0,0,1200,800);
 gradient.addColorStop(0,'#f0dfca');gradient.addColorStop(.55,'#f9f4e7');gradient.addColorStop(1,'#dce5d7');
 ctx.fillStyle=gradient;ctx.fillRect(0,0,1200,800);
 ctx.strokeStyle='#fffaf0';ctx.lineWidth=24;ctx.strokeRect(14,14,1172,772);
 ctx.setLineDash([8,8]);ctx.strokeStyle='#bcae91';ctx.lineWidth=2;ctx.strokeRect(42,42,1116,716);ctx.setLineDash([]);
 ctx.fillStyle='#9a806c';ctx.font='24px monospace';ctx.fillText('GREETINGS FROM',92,185);
 ctx.fillStyle='#405b4b';ctx.font='58px Georgia';ctx.fillText('THE VALLEY OF',92,285);ctx.fillText('LITTLE WONDERS',92,355);
 ctx.fillStyle='#7c786b';ctx.font='italic 30px Georgia';
 const words=$('#keepsakeMessage').textContent.split(/\s+/);let line='',y=455;
 words.forEach(word=>{const next=line?line+' '+word:word;if(ctx.measureText(next).width>900){ctx.fillText(line,92,y);line=word;y+=48}else line=next});
 ctx.fillText(line,92,y);
 ctx.fillStyle='#a2776b';ctx.font='italic 26px Georgia';ctx.fillText('— with a little care',92,690);
 ctx.fillStyle='#c68f85';ctx.font='56px Georgia';ctx.fillText('✿',1040,690);
 const link=document.createElement('a');link.download='a-little-keepsake.png';link.href=canvas.toDataURL('image/png');link.click();
 $('#keepsakeStatus').textContent='Your little card has been saved.';
});
$('#bunnyGuide').addEventListener('click',()=>{
 const hints=['The garden grows when you give it a little attention.','The café can change the weather of this whole little world.','The long way round has three footprints to follow.','The observatory stars can be connected in any order.'];
 const index=state.found.length%hints.length;$('#bunnyHint').textContent=hints[index];toast(hints[index]);
});
$$('.art-spark').forEach(button=>button.addEventListener('click',()=>toast('You noticed a tiny detail. That is how every good adventure starts. ✧')));
$('#wanderAgain').addEventListener('dblclick',resetJourney);
function updateReadingProgress(){
 const max=document.documentElement.scrollHeight-window.innerHeight;
 $('#readingProgress').style.width=(max>0?window.scrollY/max*100:0)+'%';
}
window.addEventListener('scroll',updateReadingProgress,{passive:true});updateReadingProgress();
updateWeather();updateMap();
if(state.found.length===4)$('#openFinale').hidden=false;
function startAmbient(){
 const canvas=$('#ambientCanvas'),ctx=canvas.getContext('2d');if(!ctx||reduced)return;
 let width=0,height=0,frame=0;
 const dots=Array.from({length:34},()=>({x:Math.random(),y:Math.random(),r:1+Math.random()*1.8,vx:(Math.random()-.5)*.00012,vy:(Math.random()-.5)*.00012,a:.18+Math.random()*.38,phase:Math.random()*6.28}));
 function resize(){const ratio=Math.min(window.devicePixelRatio||1,1.5);width=window.innerWidth;height=window.innerHeight;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0)}
 function draw(){
  ctx.clearRect(0,0,width,height);frame++;
  for(const dot of dots){dot.x+=dot.vx;dot.y+=dot.vy;if(dot.x<0||dot.x>1)dot.vx*=-1;if(dot.y<0||dot.y>1)dot.vy*=-1;
   const alpha=dot.a*(.55+.45*Math.sin(frame*.012+dot.phase));ctx.beginPath();ctx.arc(dot.x*width,dot.y*height,dot.r,0,Math.PI*2);ctx.fillStyle='rgba(245,220,173,'+alpha+')';ctx.fill();
  }
  requestAnimationFrame(draw);
 }
 resize();window.addEventListener('resize',resize,{passive:true});draw();
}
startAmbient();
})();