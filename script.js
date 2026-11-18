const notes = {
  sad: {title:"For the days that feel heavy",text:"Hey, it's okay if today isn't your day. You don't have to have everything figured out, and you don't have to pretend to be okay all the time. Take a breath, drink some water, and be a little gentle with yourself. The cloudy days pass too. And somewhere in the middle of an ordinary day, a reason to smile will find you again. ♡"},
  sleep: {title:"A thought for a quiet night",text:"Put the overthinking down for a little while. The things you couldn't finish today can wait for tomorrow. Let your shoulders relax, take one slow breath, and remember that you deserve rest just as much as you deserve all your dreams. I hope your sleep is peaceful and your dreams are kind. 🌙"},
  reminder: {title:"Please don't forget this",text:"You are allowed to take up space, to have big dreams, to make mistakes, and to begin again. You don't need to be perfect to be wonderful. Keep being your own kind of lovely. The world is a little brighter with your smile in it. 🌷"}
};
const modal = document.getElementById('modal');
const title = document.getElementById('modalTitle');
const text = document.getElementById('modalText');
function openModal(t,m){title.textContent=t;text.textContent=m;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-note]').forEach(card=>card.addEventListener('click',()=>{const n=notes[card.dataset.note];openModal(n.title,n.text)}));
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
document.getElementById('exploreBtn').addEventListener('click',()=>document.getElementById('inside').scrollIntoView({behavior:'smooth'}));
document.querySelectorAll('[data-flower]').forEach(f=>f.addEventListener('click',()=>{document.getElementById('flowerMessage').textContent=f.dataset.flower+' ♡';f.animate([{transform:'scale(1)'},{transform:'scale(1.2) rotate(12deg)'},{transform:'scale(1)'}],{duration:420})}));
const giftMessage="Surprise! 🎀 Your gift is a tiny reminder to keep a little space in your day for things that make you happy. Keep collecting silly laughs, pretty sunsets, favourite songs, warm hugs, and moments that feel like magic. You deserve all of it — and then some. ♡";
document.getElementById('giftBtn').addEventListener('click',()=>openModal('A little gift for you 🎁',giftMessage));
document.getElementById('giftArt').addEventListener('click',()=>openModal('A little gift for you 🎁',giftMessage));
document.getElementById('surpriseBtn').addEventListener('click',()=>openModal('P.S. Tejaswinni… ♡','If this little website made you smile even for a second, then it has done exactly what it came here to do. Never stop being wonderfully, unapologetically you. The world needs your kind of sparkle. ✨'));
function makePetal(){const p=document.createElement('span');p.className='petal';p.textContent=['♡','✿','·','✧'][Math.floor(Math.random()*4)];p.style.left=Math.random()*100+'vw';p.style.fontSize=(10+Math.random()*13)+'px';const duration=8+Math.random()*8;p.style.animationDuration=duration+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),duration*1000)}
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(makePetal,950);for(let i=0;i<8;i++)setTimeout(makePetal,i*250)}