(function(){
'use strict';
const card=document.getElementById('eyal');
if(!card || document.getElementById('eyalStory'))return;
const assets=[
 {src:'assets/stories/eyal-memory-1.png',label:'כבר אין זמן... למה אתחפש?!'},
 {src:'assets/stories/eyal-memory-2.png',label:'אייל מגיע לסבתא עם משחק פלונטר'},
 {src:'assets/stories/eyal-memory-3.png',label:'ההברקה של סבתא שולי: פטנט!'},
 {src:'assets/stories/eyal-memory-4.png',label:'רגע הניצחון של אייל: פטנט!'}
];
const chapter=document.createElement('section');
chapter.id='eyalStory';
chapter.className='eyal-story';
chapter.setAttribute('aria-label','סיפור ארבעת הפאנלים של אייל וסבתא שולי');
const heading=document.createElement('div');heading.className='eyal-story-header';
const title=document.createElement('h4');title.textContent='הפטנט של סבתא שולי';
const subtitle=document.createElement('p');subtitle.textContent='הזיכרון של אייל · ארבעה פאנלים מצוירים';
heading.append(title,subtitle);
const stage=document.createElement('div');stage.className='eyal-story-stage';
const photo=document.createElement('a');
photo.className='eyal-story-photo';photo.target='_blank';photo.rel='noopener noreferrer';
photo.setAttribute('aria-label','פתיחת פאנל הסיפור באיכות מלאה');
const img=document.createElement('img');img.id='eyalStoryImage';img.alt='';img.loading='lazy';img.decoding='async';
photo.append(img);stage.append(photo);
const details=document.createElement('div');details.className='eyal-story-details';
const label=document.createElement('span');label.className='eyal-story-caption';
const count=document.createElement('span');count.className='eyal-story-count';
details.append(label,count);
const controls=document.createElement('div');controls.className='eyal-story-controls';
const previous=document.createElement('button');previous.type='button';previous.textContent='→ הקודם';previous.setAttribute('aria-label','לפאנל הקודם');
const next=document.createElement('button');next.type='button';next.textContent='הבא ←';next.setAttribute('aria-label','לפאנל הבא');
const dots=document.createElement('div');dots.className='eyal-story-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','בחירת פאנל');
const dotButtons=assets.map((p,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','פאנל '+(i+1)+' מתוך ארבעה: '+p.label);dots.append(b);return b;});
controls.append(previous,next);
const note=document.createElement('p');note.className='eyal-story-note';note.textContent='דפדפו באמצעות החצים או בהחלקת אצבע · לחצו על התמונה להגדלה';
chapter.append(heading,stage,details,controls,dots,note);
const layout=card.querySelector('.eyal-layout');
if(layout)layout.insertAdjacentElement('afterend',chapter);
else card.append(chapter);
const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let selected=0;
function show(index){
 if(index<0||index>=assets.length)return;
 selected=index;
 const current=assets[selected];
 photo.href=current.src;
 img.src=current.src;
 img.alt='פאנל '+(selected+1)+': '+current.label;
 label.textContent=current.label;
 count.textContent=(selected+1)+' / '+assets.length;
 previous.disabled=selected===0;
 next.disabled=selected===assets.length-1;
 dotButtons.forEach((button,i)=>button.setAttribute('aria-current',i===selected?'step':'false'));
 if(!reduced){img.classList.remove('eyal-story-transition');void img.offsetWidth;img.classList.add('eyal-story-transition')}
}
previous.addEventListener('click',()=>show(selected-1));
next.addEventListener('click',()=>show(selected+1));
dotButtons.forEach((button,i)=>button.addEventListener('click',()=>show(i)));
let start=null;
stage.addEventListener('touchstart',e=>{
 if(e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY}
},{passive:true});
stage.addEventListener('touchend',e=>{
 if(!start||!e.changedTouches.length)return;
 const dx=e.changedTouches[0].clientX-start.x;
 const dy=e.changedTouches[0].clientY-start.y;
 start=null;
 if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.35){
   e.preventDefault();
   if(dx>0)show(selected+1);else show(selected-1);
 }
},{passive:false});
chapter.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight'){e.preventDefault();show(selected+1)}
 if(e.key==='ArrowLeft'){e.preventDefault();show(selected-1)}
 if(e.key==='Home'){e.preventDefault();show(0)}
 if(e.key==='End'){e.preventDefault();show(assets.length-1)}
});
show(0);
if(new URLSearchParams(location.search).get('story')==='eyal'){
 if(typeof selectTab==='function')selectTab('people');
 window.setTimeout(()=>chapter.scrollIntoView({block:'start',behavior:'auto'}),500);
}
})();