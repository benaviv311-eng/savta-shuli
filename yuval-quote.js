(function(){
'use strict';
const section=document.getElementById('quotes');
if(!section||document.getElementById('yuval-remark-quote'))return;
const file='assets/quotes/yuval-grandma-remark.png';
const card=document.createElement('article');
card.className='yuval-quote-feature';
card.id='yuval-remark-quote';
card.setAttribute('aria-label','משפט המחץ של יובל על סבתא שולי');
const descriptor=document.createElement('small');
descriptor.textContent='יובל וסבתא שולי · זיכרון מבית הספר';
const heading=document.createElement('h3');
heading.textContent='״מה, לא לכולם יש סבתא כזאת מרשימה?״';
const link=document.createElement('a');
link.className='yuval-quote-art';
link.href=file;
link.target='_blank';
link.rel='noopener noreferrer';
link.setAttribute('aria-label','הגדלת האיור של יובל וסבתא שולי');
const image=document.createElement('img');
image.src=file;
image.loading='lazy';
image.decoding='async';
image.alt='יובל מחייך בגאווה כשסבתא שולי משוחחת עם חבריו לכיתה, וחושב: מה, לא לכולם יש סבתא כזאת מרשימה?';
image.width=1536;
image.height=1024;
link.append(image);
const hint=document.createElement('p');
hint.className='yuval-quote-hint';
hint.textContent='לחצו על התמונה לצפייה בגודל מלא';
card.append(descriptor,heading,link,hint);
const previous=section.querySelector('.eyal-quote-feature');
if(previous)previous.insertAdjacentElement('afterend',card);
else section.append(card);
const yuval=document.getElementById('yuval');
if(yuval && !document.getElementById('yuvalQuoteShortcut')){
 const shortcut=document.createElement('a');
 shortcut.id='yuvalQuoteShortcut';
 shortcut.href='?quote=yuval#quotes';
 shortcut.className='yuval-quote-shortcut';
 shortcut.textContent='למשפט של יובל במדור משפטי המחץ';
 shortcut.addEventListener('click',event=>{
   event.preventDefault();
   if(typeof selectTab==='function')selectTab('quotes');
   if(typeof card.albumSetOpen==='function')card.albumSetOpen(true);
   window.setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'start'}),80);
 });
 const desc=yuval.querySelector('.yuval-description');
 if(desc)desc.append(shortcut);
}
if(new URLSearchParams(location.search).get('quote')==='yuval'){
 if(typeof selectTab==='function')selectTab('quotes');
 window.setTimeout(()=>card.scrollIntoView({behavior:'auto',block:'start'}),550);
}
})();