(function(){
'use strict';
const people=document.getElementById('people');
const ben=document.getElementById('ben');
const shelf=document.getElementById('comicsShelf');
if(!ben||!shelf||document.getElementById('ben-kneidlach-comic'))return;
const src='assets/comics/ben-kneidlach-comic.png';
const article=document.createElement('article');
article.id='ben-kneidlach-comic';
article.className='ben-kneidlach-comic';
article.setAttribute('aria-label','קומיקס בן וסבתא שולי: נכין קניידלך');
const title=document.createElement('h3');title.textContent='הקניידלך של סבתא שולי';
const intro=document.createElement('p');intro.textContent='בן וסבתא שולי במטבח · ארבעה פאנלים · הזיכרון של ״העולם הוא שלך!״';
const anchor=document.createElement('a');anchor.href=src;anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.className='ben-kneidlach-cover';anchor.setAttribute('aria-label','פתיחת הקומיקס של בן וסבתא שולי בגודל מלא');
const image=document.createElement('img');image.src=src;image.alt='ארבעת הפאנלים המקוריים: מכינים קניידלך, מציעים צורות מיוחדות, שואלים כל דבר?, וסבתא אומרת העולם הוא שלך!';image.loading='lazy';image.decoding='async';anchor.append(image);
const actions=document.createElement('div');actions.className='ben-kneidlach-actions';
const full=document.createElement('a');full.href=src;full.target='_blank';full.rel='noopener noreferrer';full.textContent='פתיחת הקומיקס בגודל מלא';
const download=document.createElement('a');download.href=src;download.download='קומיקס-בן-וסבתא-שולי-קניידלך.png';download.textContent='שמירת עמוד הקומיקס';
actions.append(full,download);article.append(title,intro,anchor,actions);shelf.append(article);
if(!document.getElementById('benKneidlachStory')){
  const memory=document.createElement('section');memory.id='benKneidlachStory';memory.className='ben-kneidlach-story';
  const h=document.createElement('h3');h.textContent='הקניידלך של סבתא שולי';
  const p=document.createElement('p');p.textContent='רגע במטבח עם סבתא שולי, שהופך לזיכרון מתוק.';
  const picture=document.createElement('a');picture.href=src;picture.target='_blank';picture.rel='noopener noreferrer';picture.setAttribute('aria-label','הגדלת עמוד הקומיקס של בן וסבתא');
  const img=document.createElement('img');img.src=src;img.alt='עמוד הקומיקס המלא של בן וסבתא מכינים קניידלך';img.loading='lazy';picture.append(img);
  const more=document.createElement('a');more.className='ben-kneidlach-more';more.href='?comic=ben#comics';more.textContent='למדור עמודי הקומיקס';
  more.addEventListener('click',function(e){e.preventDefault();if(typeof selectTab==='function')selectTab('comics');const card=document.getElementById('ben-kneidlach-comic');if(card && typeof card.albumSetOpen==='function')card.albumSetOpen(true);window.setTimeout(()=>card?.scrollIntoView({behavior:'smooth',block:'start'}),60);});
  memory.append(h,p,picture,more);ben.append(memory);
}
if(new URLSearchParams(location.search).get('comic')==='ben'){
 if(typeof selectTab==='function')selectTab('comics');
 window.setTimeout(()=>article.scrollIntoView({behavior:'auto',block:'start'}),500);
}
})();