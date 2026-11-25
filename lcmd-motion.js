/* LCMD: one interruptible timeline. Default HTML is the complete original artwork. */
(() => {
 'use strict';
 const stage=document.querySelector('.lcmd-art .hero-stage');
 const artwork=window.LCMD_ARTWORK;
 if(!stage||!artwork||!('IntersectionObserver' in window))return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const originals=[stage.querySelector('img.hero-main'),stage.querySelector('img.hero-status'),stage.querySelector('img.hero-float')];
 if(originals.some(image=>!image))return;
 const NS='http://www.w3.org/2000/svg',TOTAL=3200;
 // Browser scroll restoration can run before the existing page adds its skill cards/CSS.
 // Settle a direct project link after that layout, unless the visitor has already navigated.
 const directProjectLink=location.hash==='#projects';
 let visitorNavigated=false;
 const noteNavigation=()=>{visitorNavigated=true};
 ['wheel','touchstart','pointerdown','keydown'].forEach(type=>window.addEventListener(type,noteNavigation,{passive:true,once:true}));
 function alignProjectLink(){
  if(directProjectLink&&!visitorNavigated&&location.hash==='#projects')document.querySelector('#projects')?.scrollIntoView({block:'start',behavior:'instant'});
 }
 window.addEventListener('pageshow',alignProjectLink,{once:true});
 let ready=false,started=false,finished=false,elapsed=0,previous=null,raf=0,dwell=0,dwellStart=0;
 let observer,resizeObserver,views=[];
 const clamp=x=>Math.max(0,Math.min(1,x));
 const progress=(t,start,duration)=>clamp((t-start)/duration);
 const node=(tag,attrs={},parent)=>{const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));parent?.append(el);return el};
 const source=(url,parent,w,h)=>node('image',{href:url,width:w,height:h},parent);
 const rect=(bounds,parent,attrs={})=>node('rect',{x:bounds[0],y:bounds[1],width:bounds[2]-bounds[0],height:bounds[3]-bounds[1],...attrs},parent);
 function panel(name,image){
  const a=artwork[name],svg=node('svg',{viewBox:`0 0 ${a.width} ${a.height}`,class:`lcmd-motion lcmd-motion-${name}`,'aria-hidden':'true',focusable:'false'});
  const defs=node('defs',{},svg);
  source(image.src,defs,a.width,a.height).id=`lcmd-${name}-original`;
  const base=source(a.base,svg,a.width,a.height);
  views.push(svg);stage.append(svg);return {svg,defs,a,base};
 }
 function clippedOriginal(name,bounds,defs,svg,id){
  const clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);
  const box=rect(bounds,clip);
  const use=node('use',{href:`#lcmd-${name}-original`,'clip-path':`url(#${id})`},svg);
  return {box,use};
 }
 let bars=[],ringClip,numberLayer,numberCounter,status,comparison,lines=[];
 function build(){
  const plan=panel('plan',originals[0]);
  const cut=node('mask',{id:'lcmd-base-cut',maskUnits:'userSpaceOnUse',x:0,y:0,width:plan.a.width,height:plan.a.height},plan.defs);
  rect([0,0,plan.a.width,plan.a.height],cut,{fill:'white'});plan.base.setAttribute('mask','url(#lcmd-base-cut)');
  const ordered=[...plan.a.bars].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  bars=ordered.map((bounds,i)=>({...clippedOriginal('plan',bounds,plan.defs,plan.svg,`lcmd-task-${i}`),cut:rect(bounds,cut,{fill:'black'}),width:bounds[2]-bounds[0],delay:i*1450/(ordered.length-1)}));
  const toolbar=clippedOriginal('plan',plan.a.toolbar,plan.defs,plan.svg,'lcmd-toolbar');toolbar.box.setAttribute('rx',18);rect(plan.a.toolbar,cut,{fill:'black',rx:18});
  const s=panel('status',originals[1]);status=s.svg;
  const clip=node('clipPath',{id:'lcmd-ring',clipPathUnits:'userSpaceOnUse'},s.defs);
  ringClip=node('path',{},clip);
  source(s.a.ring,s.svg,s.a.width,s.a.height).setAttribute('clip-path','url(#lcmd-ring)');
  numberLayer=clippedOriginal('status',s.a.number,s.defs,s.svg,'lcmd-percentage').use;
  numberCounter=node('text',{x:s.a.center[0],y:s.a.center[1],'text-anchor':'middle','dominant-baseline':'central','font-family':'Arial, sans-serif','font-size':54,'font-weight':400,fill:'#fff',class:'lcmd-status-counter'},s.svg);
  numberCounter.style.fontVariantNumeric='tabular-nums';
  const c=panel('comparison',originals[2]);comparison=c.svg;
  lines=c.a.paths.map((points,i)=>{
   const mask=node('mask',{id:`lcmd-curve-${i}`,maskUnits:'userSpaceOnUse',x:0,y:0,width:c.a.width,height:c.a.height,'mask-type':'alpha'},c.defs);
   // The path is measured from the original curve pixels; the mask reveals original color/anti-aliasing.
   const path=node('path',{d:points.map((p,j)=>`${j?'L':'M'}${p.join(' ')}`).join(' '),fill:'none',stroke:'white','stroke-width':18,'stroke-linecap':'round','stroke-linejoin':'round'},mask);
   const length=path.getTotalLength();path.style.strokeDasharray=`${length} ${length}`;
   const layer=source(c.a.lines[i],c.svg,c.a.width,c.a.height);layer.setAttribute('mask',`url(#lcmd-curve-${i})`);
   return {path,length,layer};
  });
  layout();render(0);
 }
 function layout(){
  const parent=stage.getBoundingClientRect();
  views.forEach((svg,i)=>{const b=originals[i].getBoundingClientRect();Object.assign(svg.style,{left:`${b.left-parent.left}px`,top:`${b.top-parent.top}px`,width:`${b.width}px`,height:`${b.height}px`})});
 }
 function render(t){
  bars.forEach(bar=>{const width=bar.width*progress(t,bar.delay,650);bar.box.setAttribute('width',width);bar.cut.setAttribute('width',width)});
  status.style.opacity=progress(t,2100,180);
  const sweep=progress(t,2230,850),[cx,cy]=artwork.status.center,r=230;
  if(sweep>=1)ringClip.setAttribute('d',`M0 0H498V568H0Z`);
  else if(sweep<=0)ringClip.setAttribute('d','M0 0');
  else{
   // Start at the leading edge of the light-lilac segment (lower right).
   // The colored segments span about 270 degrees, including their original gaps.
   const start=18*Math.PI/180,arc=sweep*270*Math.PI/180,angle=start+arc;
   ringClip.setAttribute('d',`M${cx} ${cy}L${cx+Math.cos(start)*r} ${cy+Math.sin(start)*r}A${r} ${r} 0 ${arc>Math.PI?1:0} 1 ${cx+Math.cos(angle)*r} ${cy+Math.sin(angle)*r}Z`);
  }
  numberCounter.textContent=`${Math.round(67*sweep)}%`;
  const settledNumber=progress(t,3080,120);
  numberCounter.style.opacity=1-settledNumber;
  numberLayer.style.opacity=settledNumber;
  comparison.style.opacity=progress(t,2100,180);
  // Both curves share the status sweep and counter's progress, with no stagger.
  lines.forEach(line=>{line.path.style.strokeDashoffset=line.length*(1-sweep);line.layer.style.opacity=sweep>0?1:0});
  stage.dataset.lcmdTime=Math.round(t);
  stage.dataset.lcmdPhase=t<2100?'planning':'status-comparison';
 }
 function exposure(){
  // Use the actual dashboard rather than the heading/large enclosing section.
  const r=originals[0].getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=innerHeight;
  const width=Math.max(0,Math.min(r.right,vw)-Math.max(r.left,0));
  const height=Math.max(0,Math.min(r.bottom,vh)-Math.max(r.top,0));
  const possible=Math.min(r.width,vw)*Math.min(r.height,vh);
  const b=stage.getBoundingClientRect();
  return {eligible:possible>0&&width*height/possible>=.5,visible:b.bottom>0&&b.top<vh&&b.right>0&&b.left<vw};
 }
 function cancelDwell(){clearTimeout(dwell);dwell=0;dwellStart=0}
 function pause(){cancelAnimationFrame(raf);raf=0;previous=null;if(started&&!finished)stage.dataset.lcmdState='paused'}
 function dispose(){
  cancelDwell();pause();observer?.disconnect();resizeObserver?.disconnect();
  window.removeEventListener('scroll',check);window.removeEventListener('resize',resized);
  document.removeEventListener('visibilitychange',check);window.removeEventListener('pageshow',check);
 }
 function complete(reason='finished'){
  finished=true;dispose();stage.classList.remove('lcmd-active');views.forEach(el=>el.remove());views=[];
  stage.dataset.lcmdState=reason;stage.dataset.lcmdTime=TOTAL;stage.dataset.lcmdPhase='complete';
 }
 function tick(now){
  raf=0;if(finished)return;
  if(document.hidden||!exposure().visible){pause();return}
  if(previous!==null)elapsed+=now-previous;
  previous=now;
  try{render(Math.min(TOTAL,elapsed))}catch{complete('static-error');return}
  if(elapsed>=TOTAL){complete();return}
  raf=requestAnimationFrame(tick);
 }
 function resume(){if(raf||finished)return;previous=null;stage.dataset.lcmdState='playing';raf=requestAnimationFrame(tick)}
 function check(){
  if(finished)return;
  if(preference.matches){complete('reduced-motion');return}
  const e=exposure();
  if(started){if(document.hidden||!e.visible)pause();else resume();return}
  if(!ready||document.hidden||!e.eligible){cancelDwell();return}
  if(!dwell){dwellStart=performance.now();dwell=setTimeout(()=>{
   dwell=0;
   // Assets, active tab and geometry are checked again after continuous dwell.
   if(!ready||document.hidden||preference.matches||!exposure().eligible||performance.now()-dwellStart<200){check();return}
   started=true;cancelDwell();resume();
  },210)}
 }
 function resized(){layout();check()}
 function decode(url){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>img.decode().then(resolve,reject);img.onerror=reject;img.src=url})}
 async function prepare(){
  stage.dataset.lcmdState='loading';
  if(preference.matches){complete('reduced-motion');return}
  try{
   // There is no readiness timeout that silently spends the one-shot trigger.
   const urls=Object.values(artwork).flatMap(a=>[a.base,a.ring,...(a.lines||[])]).filter(Boolean);
   await Promise.all([...urls,...originals.map(img=>img.src)].map(decode));
   await Promise.all([...document.querySelectorAll('link[rel="stylesheet"]')].map(link=>link.sheet?Promise.resolve():new Promise(resolve=>{link.addEventListener('load',resolve,{once:true});link.addEventListener('error',resolve,{once:true})})));
   if(!document.querySelector('link[href*="lcmd-motion.css"]')?.sheet)throw new Error('LCMD stylesheet unavailable');
   if(finished||preference.matches){complete('reduced-motion');return}
   alignProjectLink();build();ready=true;stage.classList.add('lcmd-active');stage.dataset.lcmdState='armed';
   observer=new IntersectionObserver(check,{threshold:[0,.25,.5,.75,1]});observer.observe(originals[0]);observer.observe(stage);
   if('ResizeObserver' in window){resizeObserver=new ResizeObserver(resized);resizeObserver.observe(stage)}
   window.addEventListener('scroll',check,{passive:true});window.addEventListener('resize',resized,{passive:true});
   document.addEventListener('visibilitychange',check);window.addEventListener('pageshow',check);
   check();
  }catch{complete('static-error')}
 }
 preference.addEventListener('change',()=>{if(preference.matches)complete('reduced-motion')});
 prepare();
})();
