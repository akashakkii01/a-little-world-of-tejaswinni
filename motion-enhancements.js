(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const clamp = (v,min,max) => Math.min(max,Math.max(min,v));

  // Gentle depth response: the photo and the real-time 3D foreground move at different rates.
  if (finePointer && !reduce) {
    let raf = 0, px = 0, py = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', event => {
      tx = (event.clientX / innerWidth - .5) * 13;
      ty = (event.clientY / innerHeight - .5) * 9;
      if (!raf) raf = requestAnimationFrame(function tick() {
        px += (tx-px)*.075; py += (ty-py)*.075;
        document.documentElement.style.setProperty('--scene-x', (px*.22)+'px');
        document.documentElement.style.setProperty('--scene-y', (py*.18)+'px');
        const hero = document.querySelector('.welcome-screen');
        if (hero && !hero.hidden) hero.style.setProperty('--pointer-glow', (50+px*.5)+'% '+(42+py*.6)+'%');
        raf = Math.abs(tx-px)+Math.abs(ty-py)>.08 ? requestAnimationFrame(tick) : 0;
      });
    }, {passive:true});
  }

  // Small tactile response for controls; no layout shifts and no effect on keyboard users.
  document.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target || reduce || target.disabled) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'tap-ripple';
    ripple.style.left = (event.clientX ? event.clientX-rect.left : rect.width/2)+'px';
    ripple.style.top = (event.clientY ? event.clientY-rect.top : rect.height/2)+'px';
    target.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 720);
  });

  // Give each photographed place a little camera-like response, only on desktop.
  if (finePointer && !reduce) {
    document.addEventListener('pointermove', event => {
      const art = document.querySelector('.place-screen.active .place-art');
      if (!art) return;
      const r = art.getBoundingClientRect();
      const x = clamp((event.clientX-r.left)/r.width-.5,-.5,.5);
      const y = clamp((event.clientY-r.top)/r.height-.5,-.5,.5);
      art.style.setProperty('--art-x',(x*-7)+'px');
      art.style.setProperty('--art-y',(y*-5)+'px');
    }, {passive:true});
    document.addEventListener('pointerleave', () => {
      const art = document.querySelector('.place-art');
      if (art) { art.style.setProperty('--art-x','0px'); art.style.setProperty('--art-y','0px'); }
    });
  }

  // Reveal details on entry and keep motion respectful when reduced motion is enabled.
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll('.map-heading,.atlas-board,.place-layout,.finale-letter').forEach(el => observer.observe(el));

  // Add a slow, natural depth shift to the real photo rather than a fast artificial wobble.
  const style = document.createElement('style');
  style.textContent = `
    .tap-ripple{position:absolute;width:8px;height:8px;border-radius:50%;pointer-events:none;z-index:20;background:rgba(255,246,224,.42);transform:translate(-50%,-50%);animation:tap-ripple-out .68s ease-out forwards}
    @keyframes tap-ripple-out{to{width:170px;height:170px;opacity:0}}
    .place-art{transform:translate3d(var(--art-x,0),var(--art-y,0),0)}
    .motion-visible{animation:detail-arrive .8s cubic-bezier(.16,1,.3,1) both}
    @keyframes detail-arrive{from{opacity:0;transform:translateY(18px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
    .welcome-screen:after{background-position:var(--pointer-glow,50% 42%),center}
    button{position:relative;overflow:hidden}
  `;
  document.head.appendChild(style);
})();