(function(){
 'use strict';
 const people=document.getElementById('people');
 const milen=document.getElementById('malin');
 if(!people || !milen || document.getElementById('eyal'))return;
 const figures=[
  {src:'assets/eyal-casual.png',title:'אייל בבגדים רגילים',short:'בגדים רגילים'},
  {src:'assets/eyal-plonter.png',title:'אייל בתחפושת פלונטר צבעונית',short:'תחפושת פלונטר'}
 ];
 const card=document.createElement('article');
 card.className='person';
 card.id='eyal';
 card.setAttribute('aria-label','דמות: אייל');
 card.innerHTML='<div class="eyal-layout">'+
 '<div class="eyal-carousel" role="region" aria-label="גלריית שתי תמונות של אייל">'+
 ' <div class="eyal-stage"><img id="eyalHero" src="assets/eyal-casual.png" alt="איור גוף מלא של אייל בבגדים רגילים">'+
 '  <button type="button" class="eyal-arrow prev" aria-label="לתמונה הקודמת">→</button>'+
 '  <button type="button" class="eyal-arrow next" aria-label="לתמונה הבאה">←</button></div>'+
 ' <div class="eyal-counter"><strong id="eyalCaption">בגדים רגילים</strong><span id="eyalCount" dir="ltr">1 / 2</span></div>'+
 ' <div class="eyal-dots" role="group" aria-label="בחירת תמונה">'+
 '  <button type="button" aria-label="בגדים רגילים" aria-current="true"></button>'+
 '  <button type="button" aria-label="תחפושת פלונטר" aria-current="false"></button>'+
 ' </div></div>'+
 '<div class="eyal-identity">'+
 ' <small>דמות מתוך הסיפורים של סבתא שולי</small>'+
 ' <h3>אייל</h3>'+
 ' <p>מהרעיון להתחפש למשחק פלונטר ועד לתחפושת הצבעונית שסבתא שולי יצרה — זיכרון של יצירתיות, אהבה וגאווה.</p>'+
 ' <div class="eyal-labels"><span>פלונטר</span><span>תחפושת בעבודת יד</span><span>הפטנט של סבתא</span></div>'+
 ' <div class="eyal-highlight"><h4>הפטנט של סבתא שולי</h4><p>ברגע האחרון אייל מחפש תחפושת לפורים. הוא מגיע לסבתא שולי עם משחק פלונטר, והיא יוצרת ממנו תחפושת מיוחדת במינה. ארבעת הפאנלים של הזיכרון מוצגים בכרטיס ממש כאן למטה.</p></div>'+
 ' <a class="eyal-link" href="#comics" id="eyalComicsLink">למדור עמודי הקומיקס</a>'+
 '</div></div>';
 milen.insertAdjacentElement('afterend',card);
 const img=card.querySelector('#eyalHero'),caption=card.querySelector('#eyalCaption'),counter=card.querySelector('#eyalCount');
 const dots=Array.from(card.querySelectorAll('.eyal-dots button'));
 let index=0,paused=false;
 const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function select(i){
  index=(i+figures.length)%figures.length;
  const v=figures[index];
  img.src=v.src;img.alt=v.title;caption.textContent=v.short;counter.textContent=(index+1)+' / '+figures.length;
  dots.forEach((b,j)=>b.setAttribute('aria-current',String(j===index)));
 }
 card.querySelector('.eyal-arrow.prev').addEventListener('click',()=>select(index-1));
 card.querySelector('.eyal-arrow.next').addEventListener('click',()=>select(index+1));
 dots.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
 const carousel=card.querySelector('.eyal-carousel');
 carousel.addEventListener('pointerenter',()=>paused=true);
 carousel.addEventListener('pointerleave',()=>paused=false);
 carousel.addEventListener('focusin',()=>paused=true);
 carousel.addEventListener('focusout',event=>{if(!carousel.contains(event.relatedTarget))paused=false});
 const link=card.querySelector('#eyalComicsLink');
 link.addEventListener('click',event=>{event.preventDefault();if(typeof selectTab==='function')selectTab('comics');window.setTimeout(()=>document.getElementById('eyal-comic')?.scrollIntoView({behavior:'smooth',block:'start'}),80)});
 if(!reduceMotion){window.setInterval(()=>{if(!paused&&!document.hidden&&!document.getElementById('people')?.hidden)select(index+1)},6000)}
 if(new URLSearchParams(location.search).get('person')==='eyal'){
   if(typeof selectTab==='function')selectTab('people');
   window.setTimeout(()=>card.scrollIntoView({block:'start',behavior:'auto'}),450);
 }
})();