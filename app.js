const skills=[['◎','Web Strategy & UX','Nutzerinterviews, Informationsarchitektur, Seitenstrukturen, User Flows und Customer Journeys.'],['◇','UI Design & Prototyping','Wireframes, UI-Design, Designsysteme, interaktive Prototypen, Usability-Tests und Übergabe an Entwicklungsteams.'],['▤','Content, CMS & SEO','Landingpages und Inhalte konzipieren, umsetzen und pflegen. Suchintention, Onpage-SEO und technische SEO-Prüfungen.'],['⌁','Tracking, Analytics & CRO','Eventbasiertes Tracking mit GA4 und Google Tag Manager, KPI-Analysen, Reporting, A/B-Tests und Optimierung.'],['◈','Website Quality & Performance','Responsive Design, Barrierefreiheit, Core Web Vitals, Browser- und Gerätetests sowie Qualitätssicherung.'],['✳','AI-supported Design Workflows','Designsysteme, interaktive Prototypen und Website-Audits mit Codex und Claude AI in Kombination mit Figma.']];
document.querySelector('#skillcards').innerHTML=skills.map(([i,t,d])=>`<article class="skill"><span class="skill-icon" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p></article>`).join('');
const projects=[['epea','EPEA','Kreislauffähiges Bauen beginnt in der Gebäudeplanung. Ein individueller Materialpass dokumentiert Materialwerte und verbaute Baustoffe.'],['healthy','Healthy Printing','Gesundheitsverträgliche Druckprodukte und geeignete Lieferanten sichtbar machen und miteinander verbinden.'],['anchor','Anchor Decisions','Entscheidungen strukturiert vorbereiten, Beteiligte einbinden, Entscheidungswege dokumentieren und Verzögerungen reduzieren.']];
document.querySelector('#wordpress').innerHTML=projects.map(([id,t,d])=>`<article class="project"><button class="preview" data-image="${id}" aria-label="${t}: vollständige Website-Vorschau öffnen"><img loading="lazy" src="assets/${id}.png" alt="Website von ${t}"></button><div class="project-body"><span class="eyebrow">WORDPRESS · LANDINGPAGE</span><h3>${t}</h3><p>${d}</p></div></article>`).join('');
const groups=[['Design & Content',['Figma','Adobe XD','Photoshop','Canva','Premiere Pro']],['CMS & Website Management',['TYPO3','WordPress','Webflow','SharePoint']],['Analytics, Tracking & SEO',['Google Analytics / GA4','Google Tag Manager','Google Search Console','PageSpeed Insights']],['AI & Digital Workflows',['Codex','Claude AI','Nano Banana','Kling','Higgsfield']]];
document.querySelector('#toolgroups').innerHTML=groups.map(([t,items])=>`<div class="tool-row"><h3>${t}</h3><div class="tool-list">${items.map(x=>`<span>${x}</span>`).join('')}</div></div>`).join('');
const viewer=document.querySelector('#viewer');
const refinementStyles=document.createElement('link');refinementStyles.rel='stylesheet';refinementStyles.href='refinements.css';document.head.append(refinementStyles);
// A restrained exposure trail keeps the real portrait recognizable.
const portrait=document.querySelector('.portrait');
['trail-far','trail-near'].forEach(name=>{const layer=portrait.querySelector('img').cloneNode();layer.alt='';layer.setAttribute('aria-hidden','true');layer.className=name;portrait.append(layer)});
const hero=document.querySelector('.lcmd-art');
hero.innerHTML=`<div class="hero-top"><span class="project-logo">lcmd<span> simplify projects</span></span></div><h3>The Enterprise Platform<br>for your Construction Projects</h3><p class="hero-sub">Industrial-Grade Productivity Software for Construction.</p><div class="hero-phases" aria-label="Projektphasen"><span>Planning</span><span>Design</span><span>Management</span><span>Execution</span><span>Delivery</span></div><div class="hero-stage"><img class="hero-main" src="https://cdn.prod.website-files.com/65fd31d519cdd770990dd460/69ebc7763364a0a4e1b1e5c4_en-final-hero.webp" alt="lcmd Plattform für Planung und Steuerung von Bauprojekten"><img class="hero-float" src="https://cdn.prod.website-files.com/65fd31d519cdd770990dd460/69de73a64561947f1f393238_soll-ist-EN.webp" alt="Soll-Ist-Vergleich im lcmd Dashboard"></div><a class="hero-source" href="https://www.lcmd.io/en" target="_blank" rel="noopener">Original-Website ansehen</a>`;
hero.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;hero.classList.add('media-unavailable')}));
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
hero.classList.add('visual-hero');
hero.querySelector('h3').remove();hero.querySelector('.hero-sub').remove();hero.querySelector('.hero-phases').remove();hero.querySelector('.hero-source').remove();
const statusImage=document.createElement('img');statusImage.className='hero-status';statusImage.alt='lcmd Status-Tracking';statusImage.src='https://cdn.prod.website-files.com/65fd31d519cdd770990dd460/6989df83077dab4e5dde6786_Home%20Status%20Tracking%20DE.webp';hero.querySelector('.hero-stage').append(statusImage);
// Scroll-triggered composition: planning canvas first, analysis panels second.
// Default styles stay visible, including when observers or scripts are unavailable.
const scrollAnimations=new Set();
function playScrollMotion(element,frames,delay=0,duration=480){
 if(reduced.matches||document.hidden||typeof element.animate!=='function')return;
 const animation=element.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
 scrollAnimations.add(animation);
 const release=()=>scrollAnimations.delete(animation);
 animation.onfinish=release;animation.oncancel=release;
}
if('IntersectionObserver' in window){
 const entrances=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entrances.unobserve(entry.target);
  if(entry.target===hero){
   playScrollMotion(hero.querySelector('.hero-main'),[{clipPath:'inset(0 90% 0 0)',opacity:.5},{clipPath:'inset(0)',opacity:1}],0,720);
   [hero.querySelector('.hero-status'),hero.querySelector('.hero-float')].forEach((panel,i)=>playScrollMotion(panel,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],180+i*100,460));
  }else if(entry.target.id==='wordpress'){
   entry.target.querySelectorAll('.project').forEach((project,i)=>playScrollMotion(project,[{opacity:.25,transform:'translateY(14px)'},{opacity:1,transform:'none'}],i*65));
  }else{
   playScrollMotion(entry.target,[{opacity:.35,clipPath:'inset(0 0 8% 0)'},{opacity:1,clipPath:'inset(0)'}],0,560);
  }
 }),{threshold:.12,rootMargin:'0px 0px -32px 0px'});
 [hero,document.querySelector('#wordpress'),document.querySelector('.dreso-art>img')].filter(Boolean).forEach(el=>entrances.observe(el));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)scrollAnimations.forEach(animation=>animation.cancel())});
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
const shared=document.querySelector('.shared');shared.querySelector('summary').textContent='Mein Beitrag';
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
