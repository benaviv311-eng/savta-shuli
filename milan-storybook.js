(function () {
  'use strict';
  const story=document.getElementById('braidsStory');
  const grid=document.getElementById('storyPanels');
  if(!story || !grid || grid.dataset.storybookReady) return;
  const pages=Array.from(grid.children).filter(node=>node.matches('figure.panel'));
  if(pages.length!==4) return;
  grid.dataset.storybookReady='true';
  const wrap=document.createElement('div');wrap.className='storybook-book';
  wrap.setAttribute('role','region');wrap.setAttribute('aria-label','ספרון דפדוף: צמה לכל יום');
  const cover=document.createElement('div');cover.className='storybook-cover';
  const stage=document.createElement('div');stage.className='storybook-stage';
  grid.parentNode.insertBefore(wrap,grid);
  wrap.append(cover);
  cover.append(stage);
  stage.append(grid);
  const controls=document.createElement('div');controls.className='storybook-controls';
  const prev=document.createElement('button');prev.type='button';prev.textContent='→ הקודם';prev.setAttribute('aria-label','מעבר לפאנל הקודם');
  const progress=document.createElement('span');progress.className='storybook-progress';progress.setAttribute('role','status');progress.setAttribute('aria-live','polite');
  const next=document.createElement('button');next.type='button';next.textContent='הבא ←';next.setAttribute('aria-label','מעבר לפאנל הבא');
  controls.append(prev,progress,next);
  const dots=document.createElement('div');dots.className='storybook-dots';dots.setAttribute('aria-label','בחירת פאנל');
  const dotButtons=pages.map((p,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','פאנל '+(i+1)+' מתוך '+pages.length);dots.append(b);return b;});
  const help=document.createElement('p');help.className='storybook-help';help.textContent='דפדפו בין העמודים בנגיעה, בחצים או בנקודות · לחצו על התמונה להגדלה';
  wrap.append(controls,dots,help);
  let current=0,busy=false;
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  pages.forEach((p,i)=>{
    const button=p.querySelector('button');
    const img=p.querySelector('img');
    if(img){img.loading='eager';img.decoding='async';}
    p.classList.toggle('storybook-active',i===0);
    p.setAttribute('aria-hidden',i===0?'false':'true');
    if(button)button.tabIndex=i===0?0:-1;
  });
  function refreshControls(){
    progress.textContent=(current+1)+' מתוך '+pages.length;
    prev.disabled=current===0;next.disabled=current===pages.length-1;
    dotButtons.forEach((b,i)=>b.setAttribute('aria-current',i===current?'page':'false'));
  }
  function goTo(target){
    if(busy||target<0||target>=pages.length||target===current)return;
    const from=pages[current];const to=pages[target];
    const direction=target>current?'next':'prev';
    current=target;
    to.classList.add('storybook-active');
    to.setAttribute('aria-hidden','false');
    const toButton=to.querySelector('button');if(toButton)toButton.tabIndex=0;
    from.setAttribute('aria-hidden','true');
    const fromButton=from.querySelector('button');if(fromButton)fromButton.tabIndex=-1;
    refreshControls();
    if(reduced){
      from.classList.remove('storybook-active');
      return;
    }
    busy=true;
    from.classList.remove('storybook-active');
    from.classList.add('storybook-exit','storybook-exit-'+direction);
    to.classList.add('storybook-enter-'+direction);
    window.setTimeout(()=>{
      from.classList.remove('storybook-exit','storybook-exit-'+direction);
      to.classList.remove('storybook-enter-'+direction);
      busy=false;
    },560);
  }
  prev.addEventListener('click',()=>goTo(current-1));
  next.addEventListener('click',()=>goTo(current+1));
  dotButtons.forEach((b,i)=>b.addEventListener('click',()=>goTo(i)));
  wrap.addEventListener('keydown',e=>{
    if(document.getElementById('viewer')?.open)return;
    if(e.key==='ArrowRight'){e.preventDefault();goTo(current+1)}
    if(e.key==='ArrowLeft'){e.preventDefault();goTo(current-1)}
    if(e.key==='Home'){e.preventDefault();goTo(0)}
    if(e.key==='End'){e.preventDefault();goTo(pages.length-1)}
  });
  let touchStart=null;
  stage.addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!touchStart||!e.changedTouches.length)return;
    const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.35){
      if(dx>0)goTo(current+1);else goTo(current-1);
      // prevent the tap/click from opening the full-size viewer after a swipe
      e.preventDefault();
    }
  },{passive:false});
  refreshControls();
})();