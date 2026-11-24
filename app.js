const skills=[['◎','Web Strategy & UX','Nutzerinterviews, Informationsarchitektur, Seitenstrukturen, User Flows und Customer Journeys.'],['◇','UI Design & Prototyping','Wireframes, UI-Design, Designsysteme, interaktive Prototypen, Usability-Tests und Übergabe an Entwicklungsteams.'],['▤','Content, CMS & SEO','Landingpages und Inhalte konzipieren, umsetzen und pflegen. Suchintention, Onpage-SEO und technische SEO-Prüfungen.'],['⌁','Tracking, Analytics & CRO','Eventbasiertes Tracking mit GA4 und Google Tag Manager, KPI-Analysen, Reporting, A/B-Tests und Optimierung.'],['◈','Website Quality & Performance','Responsive Design, Barrierefreiheit, Core Web Vitals, Browser- und Gerätetests sowie Qualitätssicherung.'],['✳','AI-supported Design Workflows','Designsysteme, interaktive Prototypen und Website-Audits mit Codex und Claude AI in Kombination mit Figma.']];
document.querySelector('#skillcards').innerHTML=skills.map(([i,t,d])=>`<article class="skill"><span class="skill-icon" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p></article>`).join('');
const projects=[['epea','EPEA','Kreislauffähiges Bauen beginnt in der Gebäudeplanung. Ein individueller Materialpass dokumentiert Materialwerte und verbaute Baustoffe.'],['healthy','Healthy Printing','Gesundheitsverträgliche Druckprodukte und geeignete Lieferanten sichtbar machen und miteinander verbinden.'],['anchor','Anchor Decisions','Entscheidungen strukturiert vorbereiten, Beteiligte einbinden, Entscheidungswege dokumentieren und Verzögerungen reduzieren.']];
document.querySelector('#wordpress').innerHTML=projects.map(([id,t,d])=>`<article class="project"><button class="preview" data-image="${id}" aria-label="${t}: vollständige Website-Vorschau öffnen"><img loading="lazy" src="assets/${id}.png" alt="Website von ${t}"></button><div class="project-body"><span class="eyebrow">WORDPRESS · LANDINGPAGE</span><h3>${t}</h3><p>${d}</p></div></article>`).join('');
const groups=[['Design & Content',['Figma','Adobe XD','Photoshop','Canva','Premiere Pro']],['CMS & Website Management',['TYPO3','WordPress','Webflow','SharePoint']],['Analytics, Tracking & SEO',['Google Analytics / GA4','Google Tag Manager','Google Search Console','PageSpeed Insights']],['AI & Digital Workflows',['Codex','Claude AI','Nano Banana','Kling','Higgsfield']]];
document.querySelector('#toolgroups').innerHTML=groups.map(([t,items])=>`<div class="tool-row"><h3>${t}</h3><div class="tool-list">${items.map(x=>`<span>${x}</span>`).join('')}</div></div>`).join('');
const viewer=document.querySelector('#viewer');
const refinementStyles=document.createElement('link');refinementStyles.rel='stylesheet';refinementStyles.href='refinements.css?v=portrait-studio-1';document.head.append(refinementStyles);
// Studio portrait uses one responsive image without duplicate exposure layers.
const hero=document.querySelector('.lcmd-art');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const reviewStyles=document.createElement('link');reviewStyles.rel='stylesheet';reviewStyles.href='review.css';document.head.append(reviewStyles);
const iconPaths=[
'<rect x="8" y="3" width="8" height="5" rx="1"/><path d="M12 8v5M4 16v-3h16v3"/><rect x="1" y="16" width="6" height="5" rx="1"/><rect x="9" y="16" width="6" height="5" rx="1"/><rect x="17" y="16" width="6" height="5" rx="1"/>',
'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12M13 13l5 3-3 1-1 3z"/>',
'<path d="M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l4 4v4M13 3v5h5M7 12h4M7 16h3"/><circle cx="17" cy="16" r="4"/><path d="m20 19 3 3"/>',
'<path d="M3 3v18h18M7 17v-4M12 17V9M17 17V5"/><path d="m6 9 5-4 4 1 5-4"/>',
'<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6z"/><path d="m8 12 3 3 5-6"/>',
'<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4m-13-3 2 2 4-4"/>'
];
document.querySelectorAll('.skill-icon').forEach((el,i)=>{el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconPaths[i]}</svg>`});
// Supporting section entrances remain unchanged. LCMD has its own controlled timeline.
const scrollAnimations=new Set();
function playScrollMotion(element,frames,delay=0,duration=440,easing='cubic-bezier(.16,1,.3,1)'){
 if(!element||reduced.matches||document.hidden||typeof element.animate!=='function')return;
 const animation=element.animate(frames,{duration,delay,easing,fill:'backwards'});
 scrollAnimations.add(animation);
 const release=()=>scrollAnimations.delete(animation);
 animation.onfinish=release;animation.oncancel=release;
 return animation;
}
function stopScrollMotion(){scrollAnimations.forEach(animation=>animation.cancel())}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopScrollMotion()});
function installScrollMotion(){
 if(!('IntersectionObserver' in window)||reduced.matches)return;
 const entrances=new IntersectionObserver(entries=>entries.forEach(async entry=>{
  if(!entry.isIntersecting)return;
  const target=entry.target;entrances.unobserve(target);
  if(target.matches('.skill')){
   // Stagger only siblings entering together; mobile cards reveal independently.
   const siblings=entries.filter(item=>item.isIntersecting&&item.target.matches('.skill'));
   playScrollMotion(target,[{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'none'}],Math.max(0,siblings.findIndex(item=>item.target===target))*35,380);
  }else if(target.matches('.project')){
   playScrollMotion(target,[{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'none'}],0,440);
  }else if(target.matches('.dreso-art')){
   playScrollMotion(target.querySelector('img'),[{opacity:.5,clipPath:'inset(0 0 12% 0)'},{opacity:1,clipPath:'inset(0)'}],0,560);
  }else{
   // Tool rows communicate workflow groups without moving text spatially.
   playScrollMotion(target,[{opacity:.4},{opacity:1}],0,320);
  }
 }),{threshold:.15,rootMargin:'0px 0px -24px 0px'});
 [...document.querySelectorAll('.skill,.project,.dreso-art,.tool-row')].forEach(el=>entrances.observe(el));
 reduced.addEventListener('change',()=>{if(reduced.matches){entrances.disconnect();stopScrollMotion()}},{once:true});
}
// Start after the stylesheet links and final layout have settled.
function startScrollMotion(){
 const styles=[...document.querySelectorAll('link[rel="stylesheet"]')];
 Promise.all(styles.map(link=>new Promise(resolve=>{
  if(link.sheet){resolve();return}
  const finish=()=>{clearTimeout(timeout);link.removeEventListener('load',finish);link.removeEventListener('error',finish);resolve()};
  const timeout=setTimeout(finish,2500);
  link.addEventListener('load',finish,{once:true});link.addEventListener('error',finish,{once:true});
 }))).then(()=>requestAnimationFrame(installScrollMotion));
}
// DOM is ready before deferred stylesheet checks; large portrait images do not block motion.
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startScrollMotion,{once:true});
else queueMicrotask(startScrollMotion);
const editorialStyles=document.createElement('link');editorialStyles.rel='stylesheet';editorialStyles.href='editorial.css';document.head.append(editorialStyles);
const accentStyles=document.createElement('link');accentStyles.rel='stylesheet';accentStyles.href='accent.css';document.head.append(accentStyles);
const polishStyles=document.createElement('link');polishStyles.rel='stylesheet';polishStyles.href='polish.css';document.head.append(polishStyles);
document.querySelectorAll('.feature').forEach(feature=>{
 const copy=feature.querySelector('.project-copy'),art=feature.querySelector('.lcmd-art,.dreso-art');
 const label=document.createElement('div');label.className='case-title';const meta=copy.querySelector('.eyebrow');meta.className='case-meta';label.append(copy.querySelector('h3'),meta);
 const info=document.createElement('div');info.className='case-info';info.append(copy.querySelector(':scope > p'));
 const actions=document.createElement('div');actions.className='case-actions';actions.append(copy.querySelector('details'),copy.querySelector('.text-link'));
 copy.querySelector('.tags')?.remove();
 info.append(actions);copy.replaceChildren(label,info);
 const link=copy.querySelector('.text-link');link.classList.add('seal-link');link.innerHTML='Website<br>ansehen';
});
const shared=document.querySelector('.shared');shared.querySelector('summary').textContent='Projekt im Detail';
const sharedTitle=document.createElement('span');sharedTitle.className='shared-label';sharedTitle.textContent='Drei Projekte. Von der Konzeption bis zur Pflege.';shared.before(sharedTitle);
document.querySelectorAll('.eyebrow').forEach(el=>el.remove());
// Image-only lightbox with a persistent, accessible close target.
viewer.querySelector('.close').innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
viewer.querySelector('.close').setAttribute('title','Schließen (Esc)');
viewer.setAttribute('aria-label','Vergrößerte Projektansicht');
// One focal transition: carry the selected preview into its full-size view.
let imageOrigin=null,returnFocus=null,closing=false,imageAnimation=null;
const previewImage=viewer.querySelector('img');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
 imageOrigin=button.querySelector('img').getBoundingClientRect();returnFocus=button;closing=false;
 previewImage.src=`assets/${button.dataset.image}.png`;previewImage.alt=button.querySelector('img').alt;
 viewer.showModal();document.body.style.overflow='hidden';viewer.scrollTop=0;viewer.scrollLeft=0;
 const animateImage=()=>{if(!viewer.open||closing)return;const end=previewImage.getBoundingClientRect();const dx=imageOrigin.left-end.left,dy=imageOrigin.top-end.top;
 imageAnimation=previewImage.animate(reduced.matches?[{opacity:.35},{opacity:1}]:[{transformOrigin:'top left',transform:`translate(${dx}px,${dy}px) scale(${imageOrigin.width/end.width},${imageOrigin.height/end.height})`,opacity:.65},{transformOrigin:'top left',transform:'none',opacity:1}],{duration:reduced.matches?100:360,easing:'cubic-bezier(.16,1,.3,1)'});
 };if(previewImage.complete&&previewImage.naturalWidth)requestAnimationFrame(animateImage);else previewImage.onload=animateImage;
}));
function closeViewer(){if(closing||!viewer.open)return;closing=true;imageAnimation?.cancel();
 imageAnimation=previewImage.animate([{opacity:1},{opacity:0}],{duration:reduced.matches?80:140,easing:'ease-out'});
 imageAnimation.onfinish=()=>viewer.close();
}
viewer.querySelector('.close').addEventListener('click',closeViewer);
viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer()});
viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();else if(e.target===previewImage){imageAnimation?.cancel();viewer.classList.toggle('image-zoomed')}});
viewer.addEventListener('close',()=>{closing=false;imageAnimation?.cancel();viewer.classList.remove('image-zoomed');document.body.style.overflow='';returnFocus?.focus({preventScroll:true})});
// Native details remain accessible; animate only the content being opened.
document.querySelectorAll('details').forEach(details=>{
 const summary=details.querySelector('summary'),panel=document.createElement('div');panel.className='disclosure-content';
 [...details.children].filter(el=>el!==summary).forEach(el=>panel.append(el));details.append(panel);
 const plus=document.createElement('span');plus.className='disclosure-icon';plus.setAttribute('aria-hidden','true');plus.innerHTML='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10h12"/><path class="vertical" d="M10 4v12"/></svg>';summary.append(plus);
 let animation=null,wantsOpen=details.open;
 summary.addEventListener('click',e=>{e.preventDefault();wantsOpen=!wantsOpen;animation?.cancel();details.classList.toggle('opening',wantsOpen);
 if(wantsOpen){details.open=true;animation=panel.animate(reduced.matches?[{opacity:.4},{opacity:1}]:[{opacity:0,transform:'translateY(-6px)',clipPath:'inset(0 0 100% 0)'},{opacity:1,transform:'none',clipPath:'inset(0)'}],{duration:reduced.matches?90:240,easing:'cubic-bezier(.16,1,.3,1)'});}
 else{animation=panel.animate([{opacity:1},{opacity:0}],{duration:reduced.matches?70:120});animation.onfinish=()=>{if(!wantsOpen)details.open=false}} });
});
reduced.addEventListener('change',()=>{if(reduced.matches)scrollAnimations.forEach(animation=>animation.cancel());imageAnimation?.cancel();if(closing)viewer.close()});
