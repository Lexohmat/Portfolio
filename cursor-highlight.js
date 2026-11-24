/* Optional pointer feedback, independent of LCMD's scroll timeline. */
(() => {
 'use strict';
 const pointer=matchMedia('(hover: hover) and (pointer: fine)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const records=[];
 const targets=[document.querySelector('.lcmd-art'),document.querySelector('.dreso-art>img')].filter(Boolean);
 let active=null,mouse=null,frame=0,geometryFrame=0,lastTime=0,suspended=false;
 let x=0,y=0,targetX=0,targetY=0;
 const allowed=()=>pointer.matches&&!reduced.matches&&!document.hidden&&!suspended&&!document.querySelector('dialog[open]');
 for(const target of targets){
  const host=target.matches('img')?target.parentElement:target;
  const clip=document.createElement('span'),light=document.createElement('span');
  host.classList.add('cursor-highlight-host');clip.className='cursor-highlight-clip';light.className='cursor-highlight-light';
  clip.setAttribute('aria-hidden','true');clip.append(light);host.append(clip);
  records.push({host,target,clip,light,bounds:null});
 }
 function readGeometry(record){
  const b=record.target.getBoundingClientRect();record.bounds=b;
  if(record.host!==record.target){
   const h=record.host.getBoundingClientRect();
   Object.assign(record.clip.style,{inset:'auto',left:`${b.left-h.left}px`,top:`${b.top-h.top}px`,width:`${b.width}px`,height:`${b.height}px`,borderRadius:getComputedStyle(record.target).borderRadius});
  }
 }
 function position(){
  // Percent translation refers to the light itself; its responsive diameter needs no JS reads.
  active.light.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
 }
 function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0}
 function hide(){
  stop();
  if(active){active.light.style.transitionDuration='250ms';active.light.style.opacity='0';active=null}
 }
 function tick(now){
  frame=0;if(!active||!allowed()){hide();return}
  const dt=Math.min(64,Math.max(0,now-lastTime));lastTime=now;
  // 95% convergence in 135ms, without overshoot. Stop entirely once settled.
  const blend=1-Math.exp(-dt/45);
  x+=(targetX-x)*blend;y+=(targetY-y)*blend;
  if(Math.hypot(targetX-x,targetY-y)<.15){x=targetX;y=targetY;position();lastTime=0;return}
  position();frame=requestAnimationFrame(tick);
 }
 function moveTo(record){
  targetX=mouse.x-record.bounds.left;targetY=mouse.y-record.bounds.top;
  if(active!==record){
   hide();active=record;x=targetX;y=targetY;position();
   record.light.style.transitionDuration='200ms';record.light.style.opacity='.06';
   return;
  }
  if(!frame&&Math.hypot(targetX-x,targetY-y)>=.15){lastTime=performance.now();frame=requestAnimationFrame(tick)}
 }
 function route(hit,refresh=false){
  if(!mouse||!allowed()){hide();return}
  const record=records.find(r=>r.target===hit||r.target.contains(hit));
  if(!record){hide();return}
  if(refresh||!record.bounds||record!==active)readGeometry(record);
  const b=record.bounds;
  if(mouse.x<b.left||mouse.x>b.right||mouse.y<b.top||mouse.y>b.bottom){hide();return}
  moveTo(record);
 }
 function onMove(event){
  if(event.pointerType!=='mouse'){mouse=null;hide();return}
  mouse={x:event.clientX,y:event.clientY};route(event.target);
 }
 function refreshGeometry(){
  if(geometryFrame||!mouse)return;
  // Only geometry events schedule a read pass; the follow loop writes transforms only.
  geometryFrame=requestAnimationFrame(()=>{
   geometryFrame=0;
   if(!allowed()){hide();return}
   records.forEach(r=>r.bounds=null);
   route(document.elementFromPoint(mouse.x,mouse.y),true);
  });
 }
 function suspend(){suspended=true;mouse=null;hide();cancelAnimationFrame(geometryFrame);geometryFrame=0}
 document.addEventListener('pointermove',onMove,{passive:true});
 document.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'){mouse=null;hide()}},{passive:true});
 document.addEventListener('pointerleave',()=>{mouse=null;hide()});
 document.addEventListener('pointercancel',()=>{mouse=null;hide()});
 document.addEventListener('keydown',()=>{mouse=null;hide()},{passive:true});
 window.addEventListener('scroll',refreshGeometry,{passive:true,capture:true});
 window.addEventListener('resize',refreshGeometry,{passive:true});
 window.addEventListener('blur',suspend);
 window.addEventListener('focus',()=>{suspended=false});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else suspended=false});
 const changed=()=>{if(!pointer.matches||reduced.matches){mouse=null;hide();cancelAnimationFrame(geometryFrame);geometryFrame=0}};
 pointer.addEventListener('change',changed);reduced.addEventListener('change',changed);
 if('ResizeObserver' in window){const observer=new ResizeObserver(refreshGeometry);records.forEach(r=>observer.observe(r.target))}
})();
