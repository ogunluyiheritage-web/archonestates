document.addEventListener('DOMContentLoaded',()=>{const els=document.querySelectorAll('.archon-reveal');if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('is-visible'));return;}const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12});els.forEach(e=>io.observe(e));});

document.addEventListener('DOMContentLoaded',()=>{
 const section=document.querySelector('.archon-video-tour');
 const video=document.querySelector('.archon-tour-video');
 const intro=document.querySelector('.archon-tour-intro');
 const label=document.querySelector('.archon-room-label');
 const progressBar=document.querySelector('.archon-tour-progress span');
 const counter=document.querySelector('.archon-tour-bottom span:last-child');
 if(section&&video){
  let targetProgress=0, ticking=false;
  const scenes=[
   {at:.14,n:'01 / ARRIVAL',title:'The Entrance',desc:'A considered approach, framed by stone, glass, and landscape.'},
   {at:.28,n:'02 / GATHER',title:'The Living Room',desc:'Open, calm living spaces where natural light and generous proportions do the work.'},
   {at:.52,n:'03 / CONNECT',title:'Dining & Kitchen',desc:'An open-plan heart of the home, designed for everyday rituals and shared moments.'},
   {at:.70,n:'04 / OUTDOORS',title:'The Garden & Pool',desc:'The architecture opens to landscaped grounds and a quiet outdoor retreat.'}
  ];
  const update=()=>{
   ticking=false;
   const rect=section.getBoundingClientRect();
   const range=section.offsetHeight-window.innerHeight;
   targetProgress=range>0?Math.max(0,Math.min(1,-rect.top/range)):0;
   if(video.readyState>=1&&Number.isFinite(video.duration)&&video.duration>0){const t=targetProgress*video.duration;if(Math.abs(video.currentTime-t)>.035)video.currentTime=t;}
   const opacity=Math.max(0,Math.min(1,(.17-targetProgress)/.055));
   if(intro){intro.style.opacity=opacity;intro.style.transform=`translateY(${(1-opacity)*18}px)`;}
   if(progressBar)progressBar.style.transform=`scaleX(${targetProgress})`;
   const index=targetProgress<.14?-1:scenes.findIndex((s,i)=>targetProgress>=s.at&&(i===scenes.length-1||targetProgress<scenes[i+1].at));
   if(index>=0&&label){const s=scenes[index];if(label.dataset.scene!==s.title){label.dataset.scene=s.title;label.innerHTML=`<span class="archon-eyebrow">${s.n}</span><h2>${s.title}</h2><p>${s.desc}</p>`;label.classList.remove('is-active');void label.offsetWidth;label.classList.add('is-active');}label.style.opacity='1';}else if(label){label.style.opacity='0';}
   if(counter)counter.textContent=`${String(Math.min(4,Math.floor(targetProgress*4)+1)).padStart(2,'0')} / 04`;
  };
  const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}};
  video.addEventListener('loadedmetadata',update);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);update();
 }
 const toggle=document.querySelector('.archon-menu-toggle'),nav=document.querySelector('.archon-nav');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');toggle.textContent=open?'×':'☰';});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';}));}
});
