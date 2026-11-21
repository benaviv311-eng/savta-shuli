(function(){
  'use strict';
  const photo = document.getElementById('malinBig');
  const thumbnails = document.querySelectorAll('#malinThumbs .thumb');
  const originals = document.getElementById('malinThumbs');
  if(!photo || !originals || thumbnails.length < 2) return;
  const items = Array.from(thumbnails);
  const labels = items.map(el => (el.querySelector('span')?.textContent || 'תמונה של מילן').trim());
  const carousel = document.createElement('div');
  carousel.className = 'milan-carousel';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'תמונות מתחלפות של מילן חן');
  const stage = document.createElement('div');
  stage.className = 'milan-carousel-stage';
  photo.parentElement.insertBefore(carousel, photo);
  carousel.append(stage);
  stage.append(photo);
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'milan-carousel-arrow prev';
  prev.textContent = '→';
  prev.setAttribute('aria-label','תמונה קודמת');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'milan-carousel-arrow next';
  next.textContent = '←';
  next.setAttribute('aria-label','תמונה הבאה');
  stage.append(prev,next);
  const footer = document.createElement('div');
  footer.className = 'milan-carousel-footer';
  const caption = document.createElement('span');
  caption.className = 'milan-carousel-caption';
  const counter = document.createElement('span');
  counter.className = 'milan-carousel-count';
  footer.append(caption,counter);
  const dots = document.createElement('div');
  dots.className = 'milan-carousel-dots';
  const dotButtons = items.map((_,i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label','הצגת תמונה '+(i+1)+': '+labels[i]);
    btn.setAttribute('aria-current',i===0?'true':'false');
    dots.append(btn);
    return btn;
  });
  carousel.append(footer,dots);
  originals.style.display = 'none';
  originals.setAttribute('aria-hidden','true');
  let selected=0;
  let paused=false;
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function display(index){
    selected=(index+items.length)%items.length;
    items[selected].click();
    caption.textContent=labels[selected];
    counter.textContent=(selected+1)+' / '+items.length;
    dotButtons.forEach((button,i)=>button.setAttribute('aria-current',String(i===selected)));
    if(!reduced){
      photo.classList.remove('milan-photo-animate');
      void photo.offsetWidth;
      photo.classList.add('milan-photo-animate');
    }
  }
  function manual(index){display(index)}
  prev.addEventListener('click',()=>manual(selected-1));
  next.addEventListener('click',()=>manual(selected+1));
  dotButtons.forEach((button,i)=>button.addEventListener('click',()=>manual(i)));
  carousel.addEventListener('mouseenter',()=>{paused=true});
  carousel.addEventListener('mouseleave',()=>{paused=false});
  carousel.addEventListener('focusin',()=>{paused=true});
  carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget))paused=false});
  display(0);
  if(!reduced){
    window.setInterval(()=>{
      if(!paused && !document.hidden && !document.getElementById('people')?.hidden && !document.getElementById('viewer')?.open){
        display(selected+1);
      }
    },5000);
  }
})();