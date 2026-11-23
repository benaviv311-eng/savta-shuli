(function(){
  'use strict';
  const shelf=document.getElementById('comicsShelf');
  if(!shelf||document.getElementById('eyal-comic'))return;
  const article=document.createElement('article');
  article.className='eyal-comic';
  article.id='eyal-comic';
  article.setAttribute('aria-label','עמוד הקומיקס של אייל: הפטנט של סבתא');
  const title=document.createElement('h3');title.textContent='הפטנט של סבתא';
  const sub=document.createElement('p');sub.className='eyal-comic-sub';sub.textContent='הסיפור של אייל וסבתא שולי · ארבעה פאנלים מאוירים';
  const cover=document.createElement('a');cover.className='eyal-comic-cover';cover.href='eyal-comic-page.png';cover.target='_blank';cover.rel='noopener noreferrer';cover.setAttribute('aria-label','פתיחת עמוד קומיקס אייל באיכות מלאה');
  const img=document.createElement('img');img.src='eyal-comic-page.webp';img.loading='lazy';img.alt='עמוד קומיקס של אייל וסבתא שולי: הרעיון למשחק פלונטר, התפירה, המקום השלישי והקריאה פטנט!';
  cover.append(img);
  const actions=document.createElement('div');actions.className='eyal-comic-actions';
  const full=document.createElement('a');full.href='eyal-comic-page.png';full.target='_blank';full.rel='noopener noreferrer';full.textContent='פתיחת עמוד הקומיקס';
  const save=document.createElement('a');save.href='eyal-comic-page.png';save.download='הפטנט_של_סבתא_אייל_קומיקס.png';save.textContent='שמירה באיכות מלאה';
  actions.append(full,save);
  const details=document.createElement('details');
  const summary=document.createElement('summary');summary.textContent='צפייה בכל פאנל בנפרד';
  const gallery=document.createElement('div');gallery.className='eyal-comic-panels';
  ['אייל מציע את הרעיון','הפטנט של סבתא שולי','המקום השלישי בתחרות','פטנט!'].forEach((label,i)=>{
    const n=i+1;
    const anchor=document.createElement('a');
    anchor.href='assets/comics/eyal-panel-'+n+'.png';
    anchor.target='_blank';anchor.rel='noopener noreferrer';
    anchor.setAttribute('aria-label','הגדלת פאנל '+n+': '+label);
    const pic=document.createElement('img');pic.src='assets/comics/eyal-panel-'+n+'.png';pic.loading='lazy';pic.alt=label;
    const text=document.createElement('span');text.textContent=n+'. '+label;
    anchor.append(pic,text);gallery.append(anchor);
  });
  details.append(summary,gallery);
  article.append(title,sub,cover,actions,details);
  shelf.append(article);
  if(new URLSearchParams(location.search).get('comic')==='eyal'){
    if(typeof selectTab==='function')selectTab('comics');
    window.setTimeout(()=>article.scrollIntoView({behavior:'auto',block:'start'}),550);
  }
})();