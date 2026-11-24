/* One viewport light, masked away from light surfaces; independent of all content motion. */
(() => {
 'use strict';
 const pointer=matchMedia('(hover: hover) and (pointer: fine)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const excludedSelector='.project-copy,.shared,.preview,.portrait,.button';
 const exclusions=[...document.querySelectorAll(excludedSelector)];
 const clip=document.createElement('span'),light=document.createElement('span');
 clip.className='cursor-highlight-clip';light.className='cursor-highlight-light';
 clip.setAttribute('aria-hidden','true');clip.append(light);document.body.append(clip);
 let active=false,mouse=null,frame=0,geometryFrame=0,lastTime=0,suspended=false;
 let x=0,y=0,targetX=0,targetY=0;
 const allowed=()=>pointer.matches&&!reduced.matches&&!document.hidden&&!suspended&&!document.querySelector('dialog[open]');
 function updateMask(){
  // Read only on layout/scroll changes, never inside the pointer-follow loop.
  const width=document.documentElement.clientWidth,height=innerHeight;
  const holes=exclusions.map(element=>{
   const b=element.getBoundingClientRect();
   if(b.bottom<0||b.top>height||b.right<0||b.left>width||!b.width||!b.height)return '';
   const s=getComputedStyle(element);
   const radii=[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomRightRadius,s.borderBottomLeftRadius].map(v=>Math.min(parseFloat(v)||0,b.width/2,b.height/2));
   const [tl,tr,br,bl]=radii,l=b.left,t=b.top,r=b.right,d=b.bottom;
   return `<path fill="black" d="M${l+tl} ${t}H${r-tr}Q${r} ${t} ${r} ${t+tr}V${d-br}Q${r} ${d} ${r-br} ${d}H${l+bl}Q${l} ${d} ${l} ${d-bl}V${t+tl}Q${l} ${t} ${l+tl} ${t}Z"/>`;
  }).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white"/>${holes}</svg>`;
  clip.style.maskImage=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
 }
 function position(){light.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`}
 function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0}
 function hide(){stop();light.style.transitionDuration='250ms';light.style.opacity='0';active=false}
 function tick(now){
  frame=0;if(!active||!allowed()){hide();return}
  const dt=Math.min(64,Math.max(0,now-lastTime));lastTime=now;
  const blend=1-Math.exp(-dt/45);
  x+=(targetX-x)*blend;y+=(targetY-y)*blend;
  if(Math.hypot(targetX-x,targetY-y)<.15){x=targetX;y=targetY;position();lastTime=0;return}
  position();frame=requestAnimationFrame(tick);
 }
 function route(hit){
  if(!mouse||!allowed()||!hit||hit.closest?.(excludedSelector)){hide();return}
  targetX=mouse.x;targetY=mouse.y;
  if(!active){active=true;x=targetX;y=targetY;position();light.style.transitionDuration='200ms';light.style.opacity='.12';return}
  if(!frame&&Math.hypot(targetX-x,targetY-y)>=.15){lastTime=performance.now();frame=requestAnimationFrame(tick)}
 }
 function refreshGeometry(){
  if(!allowed()){hide();return}
  if(geometryFrame)return;
  geometryFrame=requestAnimationFrame(()=>{geometryFrame=0;if(!allowed()){hide();return}updateMask();if(mouse)route(document.elementFromPoint(mouse.x,mouse.y))});
 }
 function suspend(){suspended=true;mouse=null;hide();cancelAnimationFrame(geometryFrame);geometryFrame=0}
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'){mouse=null;hide();return}
  mouse={x:event.clientX,y:event.clientY};route(event.target);
 },{passive:true});
 document.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'){mouse=null;hide()}},{passive:true});
 document.addEventListener('pointerleave',()=>{mouse=null;hide()});
 document.addEventListener('pointercancel',()=>{mouse=null;hide()});
 document.addEventListener('keydown',()=>{mouse=null;hide()},{passive:true});
 window.addEventListener('scroll',refreshGeometry,{passive:true,capture:true});
 window.addEventListener('resize',refreshGeometry,{passive:true});
 window.addEventListener('blur',suspend);
 window.addEventListener('focus',()=>{suspended=false;refreshGeometry()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else{suspended=false;refreshGeometry()}});
 const changed=()=>{if(!pointer.matches||reduced.matches){mouse=null;hide();cancelAnimationFrame(geometryFrame);geometryFrame=0}else refreshGeometry()};
 pointer.addEventListener('change',changed);reduced.addEventListener('change',changed);
 if('ResizeObserver' in window){const observer=new ResizeObserver(refreshGeometry);[document.body,...exclusions].forEach(element=>observer.observe(element))}
 const observer=new MutationObserver(()=>{if(!allowed())hide();refreshGeometry()});
 document.querySelectorAll('dialog,details').forEach(element=>observer.observe(element,{attributes:true,attributeFilter:['open']}));
 updateMask();
})();
