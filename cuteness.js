(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s);
const buddy=document.createElement('aside');buddy.className='pocket-buddy';buddy.innerHTML=`
 <div class="cute-panel" id="cutePanel" aria-hidden="true">
  <h4>Your tiny comfort corner ♡</h4><p>Pick the kind of moment you're having. I'll find a little note for it.</p>
  <div class="mood-row">
   <button class="mood-choice" data-mood="sunny" aria-label="Feeling happy">☀️<span>happy</span></button>
   <button class="mood-choice" data-mood="cloudy" aria-label="Feeling low">☁️<span>low</span></button>
   <button class="mood-choice" data-mood="sleepy" aria-label="Feeling sleepy">🌙<span>sleepy</span></button>
   <button class="mood-choice" data-mood="dreamy" aria-label="Feeling dreamy">🦋<span>dreamy</span></button>
  </div>
  <div class="buddy-foot"><span>Collect 5 floating hearts for a secret ♡</span><b id="loveCount">0 / 5</b></div>
  <div class="buddy-foot"><button id="dailyWhisper">a tiny daily whisper ✧</button><button id="closeBuddy">close ×</button></div>
 </div>
 <div class="buddy-bubble" id="buddyBubble" role="status">psst… I saved a little smile for you ♡</div>
 <button class="buddy-toggle" id="buddyToggle" aria-label="Open your tiny comfort corner" aria-expanded="false"><span class="buddy-face"><i class="buddy-eyes"></i><i class="buddy-nose"></i><i class="buddy-blush"></i></span><span class="buddy-heart">♥</span></button>`;
document.body.appendChild(buddy);
const toast=document.createElement('div');toast.className='candy-toast';toast.setAttribute('role','status');document.body.appendChild(toast);
let toastTimer;function say(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2500)}
const toggle=$('#buddyToggle'),panel=$('#cutePanel'),bubble=$('#buddyBubble');
function showBubble(msg){bubble.textContent=msg;bubble.classList.add('show');setTimeout(()=>bubble.classList.remove('show'),3600)}
toggle.addEventListener('click',()=>{const on=panel.classList.toggle('open');panel.setAttribute('aria-hidden',String(!on));toggle.setAttribute('aria-expanded',String(on));if(on)showBubble('I am all ears. What kind of day is it? ♡')});
$('#closeBuddy').addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');toggle.setAttribute('aria-expanded','false')});
const moods={sunny:'A little sunshine looks good on you. Keep a pocketful of this feeling. ☀️',cloudy:'Cloudy days are allowed. You do not have to bloom every single day. Sending a soft little hug. ☁️',sleepy:'Rest your lovely brain. The stars can keep watch while you sleep. 🌙',dreamy:'May your day have pretty skies, kind surprises and butterflies. 🦋'};
$$('[data-mood]').forEach(b=>b.addEventListener('click',()=>{showBubble(moods[b.dataset.mood]);say('A tiny note for your '+b.dataset.mood+' moment ♡');burst(innerWidth-58,innerHeight-55,8)}));
const whispers=['I hope something unexpectedly lovely happens to you today. ✿','You deserve the same kindness you give so easily. ♡','Tiny steps still take you somewhere beautiful. 🌷','May you find a reason to giggle today. 🎀','You make ordinary little moments feel special. ✨'];
$('#dailyWhisper').addEventListener('click',()=>showBubble(whispers[Math.floor(Math.random()*whispers.length)]));
function burst(x,y,n=7){if(reduce)return;const glyphs=['♡','✿','✧','♥','⋆','୨୧'];for(let i=0;i<n;i++){const el=document.createElement('span');el.className='heart-pop';el.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];el.style.left=(x+(Math.random()-.5)*50)+'px';el.style.top=(y+(Math.random()-.5)*24)+'px';el.style.setProperty('--drift',((Math.random()-.5)*100)+'px');el.style.color=['#ffb8cf','#d8c6ff','#ffe6a6','#bcebd9'][i%4];document.body.appendChild(el);setTimeout(()=>el.remove(),1200)}}
let collected=0;const count=$('#loveCount');let nextHeart=0;
function collect(x,y,node){if(node){node.remove()}collected++;count.textContent=Math.min(collected,5)+' / 5';burst(x,y,9);if(collected===5){say('You found all five little hearts! A secret is yours ♡');showBubble('You found my tiny secret! You deserve a thousand little happy things. ♡');setTimeout(()=>{const d=document.createElement('div');d.className='heart-pop';d.textContent='💌';d.style.cssText='left:50%;top:48%;font-size:58px;animation:rise .8s forwards';document.body.appendChild(d);setTimeout(()=>d.remove(),1000);const unlock=$('#unlockBtn');if(unlock)unlock.click();else if(typeof window.openCuteSecret==='function')window.openCuteSecret()},450)}}
function makeHeart(){if(reduce||document.hidden||collected>=5)return;const h=document.createElement('button');h.type='button';h.className='floating-love-heart';h.textContent=['♡','♥','💗','✿'][Math.floor(Math.random()*4)];h.setAttribute('aria-label','Collect a floating little heart');h.style.left=(8+Math.random()*84)+'vw';h.style.setProperty('--heart-time',(8+Math.random()*5)+'s');h.style.setProperty('--heart-size',(15+Math.random()*12)+'px');document.body.appendChild(h);h.addEventListener('click',e=>{e.stopPropagation();const r=h.getBoundingClientRect();collect(r.left+r.width/2,r.top+r.height/2,h)});setTimeout(()=>h.remove(),14000)}
const style=document.createElement('style');style.textContent=`.floating-love-heart{position:fixed;z-index:12;bottom:-45px;left:20vw;border:0;background:none;color:#ffc5d8;font-size:var(--heart-size,20px);cursor:pointer;filter:drop-shadow(0 0 10px #f5b4ce99);animation:floatHeart var(--heart-time,10s) linear forwards;transition:transform .2s}.floating-love-heart:hover{transform:scale(1.5)}@keyframes floatHeart{0%{transform:translateY(0) rotate(-15deg);opacity:0}10%{opacity:.85}85%{opacity:.8}100%{transform:translateY(-115vh) rotate(35deg);opacity:0}}`;document.head.appendChild(style);
if(!reduce){setTimeout(makeHeart,1800);setInterval(makeHeart,6800);if(matchMedia('(pointer:fine)').matches){let last=0;addEventListener('pointermove',e=>{const now=performance.now();if(now-last<85)return;last=now;const c=document.createElement('span');c.className='cursor-charm';c.textContent=['✧','·','♡','✿'][Math.floor(Math.random()*4)];c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';document.body.appendChild(c);setTimeout(()=>c.remove(),800)},{passive:true})}}
document.addEventListener('click',e=>{if(e.target.closest('button,.nav-link,a,.pocket-buddy,.floating-love-heart'))return;if(!reduce&&Math.random()>.45)burst(e.clientX,e.clientY,4)});
const existingUnlock=$('#unlockBtn');if(existingUnlock){const original=existingUnlock.onclick;existingUnlock.addEventListener('click',()=>burst(innerWidth/2,innerHeight/2,24))}
setTimeout(()=>showBubble('hello, Tejaswinni! tap me if you need a tiny smile ♡'),1800);
})();