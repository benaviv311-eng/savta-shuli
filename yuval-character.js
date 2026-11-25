(function(){
'use strict';
const people=document.getElementById('people');
if(!people || document.getElementById('yuval'))return;
const card=document.createElement('article');
card.id='yuval';card.className='person';card.setAttribute('aria-label','כרטיס דמות: יובל');
const wrap=document.createElement('div');wrap.className='yuval-layout';
const figure=document.createElement('figure');figure.className='yuval-portrait';
const img=document.createElement('img');img.id='yuvalHero';img.src='assets/yuval-character.png';
img.alt='יובל כילד, דמות מלאה בחולצה לבנה פתוחה מעל חולצה כהה ומכנסיים חומים';img.loading='lazy';img.decoding='async';
figure.append(img);
const description=document.createElement('div');description.className='yuval-description';
const kicker=document.createElement('small');kicker.textContent='דמות מתוך האלבום המשפחתי';
const title=document.createElement('h3');title.textContent='יובל';
const text=document.createElement('p');text.textContent='הנכד שסבתא שולי הגיעה לכיתתו וסיפרה איך נראו החיים בירושלים של פעם.';
const memory=document.createElement('blockquote');
memory.textContent='״מה, לא לכולם יש סבתא כזאת מרשימה?״';
const note=document.createElement('p');note.className='yuval-note';
note.textContent='הזיכרון מהביקור בכיתה – ארבעה פאנלים מאוירים שנוכל לשלב כאן כעמוד קומיקס.';
description.append(kicker,title,text,memory,note);
wrap.append(figure,description);card.append(wrap);
const ben=document.getElementById('ben');
if(ben&&ben.parentNode===people)ben.insertAdjacentElement('afterend',card);
else people.append(card);
if(new URLSearchParams(location.search).get('person')==='yuval'){
  if(typeof selectTab==='function')selectTab('people');
  window.setTimeout(()=>card.scrollIntoView({block:'start',behavior:'auto'}),550);
}
})();