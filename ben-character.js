(function(){
  'use strict';
  const people=document.getElementById('people');
  const after=document.getElementById('eyal');
  if(!people || document.getElementById('ben'))return;
  const figures=[
    {src:'assets/ben-child-white.png',label:'בן בחולצה לבנה',short:'חולצה לבנה'},
    {src:'assets/ben-child-blue.png',label:'בן בחולצת כדורגל כחולה',short:'חולצה כחולה'}
  ];
  const card=document.createElement('article');
  card.id='ben';
  card.className='person';
  card.setAttribute('aria-label','דמות: בן');
  card.innerHTML='<div class="ben-layout">'+
    '<div class="ben-gallery" role="region" aria-label="תמונות מתחלפות של בן כילד">'+
    '<div class="ben-photo-frame">'+
    '<img id="benHero" src="assets/ben-child-white.png" alt="בן בילדותו, בחולצה לבנה" loading="lazy" decoding="async">'+
    '<button type="button" class="ben-arrow ben-prev" aria-label="התמונה הקודמת">→</button>'+
    '<button type="button" class="ben-arrow ben-next" aria-label="התמונה הבאה">←</button></div>'+
    '<div class="ben-gallery-caption"><strong id="benCaption">חולצה לבנה</strong><span id="benCount" dir="ltr">1 / 2</span></div>'+
    '<div class="ben-gallery-dots" role="group" aria-label="בחירת התמונה של בן">'+
    '<button type="button" aria-label="בן בחולצה לבנה" aria-current="true"></button>'+
    '<button type="button" aria-label="בן בחולצה כחולה" aria-current="false"></button></div></div>'+
    '<div class="ben-identity"><small>דמות מתוך האלבום המשפחתי</small>'+
    '<h3>בן</h3><p>בן בילדותו — שתי תמונות מאוירות המבוססות על צילומי המשפחה.</p>'+
    '<p class="ben-placeholder">כאן נוסיף בהמשך זיכרונות וסיפורים משותפים עם סבתא שולי.</p>'+
    '</div></div>';
  if(after && after.parentNode===people)after.insertAdjacentElement('afterend',card);
  else people.append(card);
  const img=card.querySelector('#benHero');
  const caption=card.querySelector('#benCaption');
  const count=card.querySelector('#benCount');
  const buttons=Array.from(card.querySelectorAll('.ben-gallery-dots button'));
  let current=0,paused=false;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function select(index){
    current=(index+figures.length)%figures.length;
    const figure=figures[current];
    img.src=figure.src;img.alt=figure.label;caption.textContent=figure.short;
    count.textContent=(current+1)+' / '+figures.length;
    buttons.forEach((btn,i)=>btn.setAttribute('aria-current',String(i===current)));
  }
  card.querySelector('.ben-prev').addEventListener('click',()=>select(current-1));
  card.querySelector('.ben-next').addEventListener('click',()=>select(current+1));
  buttons.forEach((btn,i)=>btn.addEventListener('click',()=>select(i)));
  const gallery=card.querySelector('.ben-gallery');
  gallery.addEventListener('mouseenter',()=>paused=true);
  gallery.addEventListener('mouseleave',()=>paused=false);
  gallery.addEventListener('focusin',()=>paused=true);
  gallery.addEventListener('focusout',ev=>{if(!gallery.contains(ev.relatedTarget))paused=false;});
  if(!reduceMotion)window.setInterval(()=>{
    if(!paused&&!document.hidden&&!document.getElementById('people')?.hidden
      &&card.dataset.open==='true')select(current+1);
  },5500);
  if(new URLSearchParams(location.search).get('person')==='ben'){
    if(typeof selectTab==='function')selectTab('people');
    window.setTimeout(()=>card.scrollIntoView({block:'start',behavior:'auto'}),500);
  }
})();