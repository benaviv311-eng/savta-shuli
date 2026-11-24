(function(){
  'use strict';
  if(document.querySelector('.album-card-grid[data-compact-ready="true"]'))return;
  const q=new URLSearchParams(location.search);
  const album=new Map();

  function node(tag,className,text){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=text;
    return el;
  }
  function registerCard(card,{id,title,subtitle,kicker,source,groups}){
    if(!card || card.classList.contains('album-card'))return null;
    if(id&&!card.id)card.id=id;
    const key=card.id||id;
    if(!key)return null;
    const body=node('div','album-card-body');
    body.id='album-card-body-'+key;
    while(card.firstChild)body.append(card.firstChild);
    const preview=node('button','album-card-preview');
    preview.type='button';
    preview.setAttribute('aria-controls',body.id);
    preview.setAttribute('aria-expanded','false');
    preview.setAttribute('aria-label','פתיחת כרטיס '+title);
    const thumb=document.createElement('img');
    thumb.className='album-card-cover';
    thumb.src=source||'';
    thumb.alt='';
    thumb.loading='lazy';
    const content=node('span','album-card-preview-content');
    content.append(node('span','album-card-kicker',kicker||'האלבום המשפחתי'));
    content.append(node('span','album-card-title',title));
    if(subtitle)content.append(node('span','album-card-teaser',subtitle));
    const action=node('span','album-card-action');
    const verb=node('span','album-card-action-label','פתיחת הכרטיס');
    const chevron=node('span','album-card-chevron','⌄');
    chevron.setAttribute('aria-hidden','true');
    action.append(verb,chevron);content.append(action);
    preview.append(thumb,content);
    const close=node('button','album-card-close','סגירת הכרטיס ↑');
    close.type='button';

    card.classList.add('album-card');
    card.dataset.open='false';
    card.append(preview,body);
    body.hidden=true;
    const tabs=new Map();
    if(groups && groups.length){
      const present=groups.map(group=>({
        ...group,
        els:group.selectors.flatMap(sel=>Array.from(body.querySelectorAll(':scope > '+sel)))
      })).filter(group=>group.els.length>0);
      if(present.length>1){
        const tablist=node('div','album-inner-tabs');
        tablist.setAttribute('role','tablist');
        tablist.setAttribute('aria-label','תוכן הכרטיס של '+title);
        const panels=[];
        for(const group of present){
          const button=node('button','',group.label);
          button.type='button';
          button.id='album-tab-'+key+'-'+group.id;
          button.setAttribute('role','tab');
          button.setAttribute('aria-controls','album-panel-'+key+'-'+group.id);
          const panel=node('div','album-inner-panel');
          panel.id='album-panel-'+key+'-'+group.id;
          panel.dataset.albumPane=group.id;
          panel.setAttribute('role','tabpanel');
          panel.setAttribute('aria-labelledby',button.id);
          group.els.forEach(el=>panel.append(el));
          panels.push(panel);
          tablist.append(button);
          tabs.set(group.id,{button,panel});
          button.addEventListener('click',()=>activate(group.id));
        }
        // Keep any unclassified existing content in the first pane, never discard it.
        for(const el of Array.from(body.children))panels[0].append(el);
        body.append(tablist,...panels);
        const order=Array.from(tabs.keys());
        tablist.addEventListener('keydown',event=>{
          if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight'&&event.key!=='Home'&&event.key!=='End')return;
          event.preventDefault();
          const current=order.findIndex(k=>tabs.get(k).button.getAttribute('aria-selected')==='true');
          let next=current;
          if(event.key==='Home')next=0;
          else if(event.key==='End')next=order.length-1;
          else next=(current+(event.key==='ArrowLeft'?1:-1)+order.length)%order.length;
          activate(order[next]);
          tabs.get(order[next]).button.focus();
        });
        activate(order[0]);
      }
    }
    body.append(close);
    function activate(name){
      if(!tabs.has(name))return;
      for(const [key,value] of tabs.entries()){
        const active=key===name;
        value.button.setAttribute('aria-selected',String(active));
        value.button.tabIndex=active?0:-1;
        value.panel.hidden=!active;
      }
      card.dataset.activePane=name;
    }
    function setOpen(value,tab){
      if(value){
        const parent=card.parentElement;
        for(const sibling of parent.querySelectorAll(':scope > .album-card.is-open')){
          if(sibling!==card && typeof sibling.albumSetOpen==='function')sibling.albumSetOpen(false);
        }
      }
      if(!value && body.contains(document.activeElement))preview.focus({preventScroll:true});
      body.hidden=!value;
      card.classList.toggle('is-open',value);
      card.dataset.open=String(value);
      preview.setAttribute('aria-expanded',String(value));
      preview.setAttribute('aria-label',(value?'סגירת':'פתיחת')+' כרטיס '+title);
      verb.textContent=value?'סגירת הכרטיס':'פתיחת הכרטיס';
      if(value&&tab)activate(tab);
    }
    card.albumSetOpen=setOpen;
    card.albumActivate=activate;
    preview.addEventListener('click',()=>setOpen(card.dataset.open!=='true'));
    close.addEventListener('click',()=>{
      setOpen(false);
      preview.focus({preventScroll:true});
      card.scrollIntoView({behavior:'smooth',block:'start'});
    });
    album.set(key,card);
    return card;
  }
  function open(id,pane,scroll=false){
    const card=album.get(id);
    if(!card)return false;
    card.albumSetOpen(true,pane);
    if(scroll)window.setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'start'}),90);
    return true;
  }
  function packSection(section,cardSelector,params){
    if(!section)return;
    const cards=Array.from(section.querySelectorAll(cardSelector.split(',').map(part=>':scope > '+part.trim()).join(', ')));
    if(!cards.length)return;
    const grid=node('div','album-card-grid');
    grid.dataset.compactReady='true';
    cards[0].before(grid);
    cards.forEach(card=>{
      grid.append(card);
      registerCard(card,params(card));
    });
  }

  const people=document.getElementById('people');
  if(people){
    packSection(people,'article.person',card=>{
      let id=card.id;
      if(!id){id='shuli';card.id=id;}
      const eyal=id==='eyal';
      const ben=id==='ben';
      const milen=id==='malin';
      const title=eyal?'אייל':ben?'בן':milen?'מילן חן':'סבתא שולי';
      const image=card.querySelector(eyal?'#eyalHero':ben?'#benHero':'img.person-cover');
      const description=eyal?'הפטנט של סבתא שולי · תמונות וזיכרונות':ben?'בן בילדותו · תמונות וזיכרונות':milen?'צמה לכל יום · רגע מיוחד עם סבתא':'הלב של האלבום המשפחתי';
      return {
        id,title,subtitle:description,source:image?.getAttribute('src'),kicker:'הדמויות שלנו',
        groups:[
          {id:'character',label:'דמות ותמונות',selectors:['.person-head','.eyal-layout','.ben-layout']},
          {id:'memory',label:'זיכרון',selectors:['.eyal-memory-poster']},
          {id:'comic',label:'ספרון קומיקס',selectors:['#braidsStory','#eyalStory','#benKneidlachStory']}
        ]
      };
    });
  }
  const comics=document.getElementById('comics');
  const shelf=document.getElementById('comicsShelf');
  if(shelf){
    packSection(shelf,'section, article',card=>({
      id:card.id,title:card.id==='ben-kneidlach-comic'?'הקניידלך של סבתא שולי':card.id==='eyal-comic'?'הפטנט של סבתא':'צמה לכל יום',
      subtitle:card.id==='ben-kneidlach-comic'?'בן וסבתא מכינים קניידלך · העולם הוא שלך!':card.id==='eyal-comic'?'הסיפור של אייל וסבתא שולי':'הזיכרון של מילן וסבתא שולי',
      source:card.querySelector('img')?.getAttribute('src'),
      kicker:'עמוד קומיקס',groups:[]
    }));
  }
  const quotes=document.getElementById('quotes');
  if(quotes){
    packSection(quotes,'.quotehero, .eyal-quote-feature',card=>{
      if(!card.id)card.id='braids-quote';
      return {id:card.id,title:card.querySelector('h3')?.textContent?.trim()||'משפטי מחץ',
        subtitle:card.id==='eyal-patent-quote'?'הפטנט של סבתא ואייל':'צמה לכל יום · מילן וסבתא שולי',
        source:card.querySelector('img')?.getAttribute('src'),kicker:'משפטי המחץ',groups:[]};
    });
  }
  // Locally saved memories are dynamic; preserve the add-memory form and all data.
  const memoryHost=document.getElementById('memoriesList');
  if(memoryHost){
    let serial=0;
    function packMemories(){
      memoryHost.querySelectorAll(':scope > article.memory:not(.album-card)').forEach(card=>{
        serial++;
        const title=card.querySelector('h3')?.textContent?.trim()||'רגע מהעבר';
        registerCard(card,{
          id:'memory-'+serial,title,
          subtitle:card.querySelector('p')?.textContent?.trim()||'זיכרון משפחתי',
          source:card.querySelector('img')?.getAttribute('src'),
          kicker:'רגעים מהעבר',groups:[]
        });
      });
    }
    packMemories();
    const observer=new MutationObserver(packMemories);
    observer.observe(memoryHost,{childList:true});
  }
  // Deep links also reveal the original content, instead of scrolling to hidden elements.
  if(q.get('story')==='eyal')open('eyal','comic');
  else if(q.get('person')==='eyal')open('eyal','character');
  else if(['malin','milan','milen'].includes(q.get('person')))open('malin','character');
  else if(q.get('person')==='shuli')open('shuli');
  else if(q.get('person')==='ben')open('ben','character');
  if(q.get('comic')==='eyal')open('eyal-comic');
  if(q.get('comic')==='ben')open('ben-kneidlach-comic');
  if(['1','milen','malin'].includes(q.get('comic')))open('milenComicPage');
  document.getElementById('gotoStory')?.addEventListener('click',()=>open('malin','comic'),true);
  document.querySelector('#comics .comic-story-link button')?.addEventListener('click',()=>open('malin','comic'),true);
  document.querySelector('#braidsStory .comic-section-link button')?.addEventListener('click',()=>open('milenComicPage'),true);
  document.getElementById('eyalComicsLink')?.addEventListener('click',()=>open('eyal-comic'),true);
  window.addEventListener('hashchange',()=>{
    if(location.hash==='#people'&&q.get('person'))open(['eyal','ben','shuli'].includes(q.get('person'))?q.get('person'):'malin');
  });
})();