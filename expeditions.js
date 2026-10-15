'use strict';
// Discoverable spacecraft use enlarged, fixed game positions, not real-time ephemerides.
const HUBBLE={id:'hubble',name:'허블 우주망원경',en:'HUBBLE',type:'우주망원경',artificial:true,secret:true,signalCode:'03',signalRange:.28,x:Math.cos(.55)-.15,y:Math.sin(.55)+.07,radius:.004,zone:.025,au:1,tools:['observe','profile'],tagline:'지구 주변에서 우주를 바라보는 눈',mirror:'2.4 m',orbit:'지구 저궤도',wavelength:'자외선 · 가시광선 · 근적외선',source:'https://science.nasa.gov/mission/hubble/overview/about-hubble/',facts:[['지구 곁의 망원경','허블은 지구를 도는 우주망원경이에요. 지구 대기의 영향을 피해 멀리 있는 별과 은하를 관측해요.'],['지름 2.4 m의 거울','주거울의 지름은 2.4 m예요. 주로 자외선과 가시광선을 관측하며 근적외선도 관측할 수 있어요.'],['우주에서 고친 망원경','1990년 우주왕복선으로 발사됐어요. 우주비행사들이 다섯 차례 방문해 장비를 수리하고 개선했어요.']]};
const WEBB={id:'webb',name:'제임스 웹 우주망원경',en:'WEBB',type:'우주망원경',artificial:true,secret:true,signalCode:'04',signalRange:.35,x:1.3*Math.cos(.55),y:1.3*Math.sin(.55),radius:.005,zone:.03,au:1.01,tools:['observe','profile'],tagline:'차가운 우주에서 적외선을 모으는 금빛 거울',mirror:'6.5 m',orbit:'태양–지구 L2 부근 · 지구에서 약 150만 km',wavelength:'주로 적외선',source:'https://science.nasa.gov/mission/webb/fact-sheet/',facts:[['금빛 육각형 거울','주거울은 금으로 코팅한 육각형 거울 18개로 이루어져 있어요. 전체 주거울의 지름은 약 6.5 m예요.'],['적외선으로 보는 우주','주로 적외선을 관측해 초기 우주의 은하, 별의 탄생, 외계행성의 대기 등을 연구해요. 허블과 서로 다른 빛으로 우주를 살펴봐요.'],['지구에서 멀리, 차갑게','지구에서 태양 반대쪽으로 약 150만 km 떨어진 L2 부근을 돌며 태양을 공전해요. 다섯 겹의 차양이 열을 막아 관측 장비를 차갑게 유지해요.']]};
ENCOUNTERS.push(HUBBLE,WEBB);
Object.assign(PHOTOS,{
 hubble:{src:'assets/hubble.webp',source:HUBBLE.source,credit:'NASA',note:'지구 궤도에서 촬영한 허블 우주망원경의 실제 사진.',bodyFraction:1},
 webb:{src:'webb-photo.jpg',source:'https://www.nasa.gov/missions/nasas-webb-sunshield-successfully-unfolds-and-tensions-in-final-tests/',credit:'NASA/Chris Gunn',note:'발사 전 차양 전개 시험 중 촬영한 실제 사진. 우주에서 촬영한 모습은 아니에요.',bodyFraction:1}
});
const Observatory={
 profile(p){openModal(p.name+' · 탐사 자료','<div class="body-profile"><div class="profile-visual">'+PhotoLibrary.markup(p.id,p.name)+'<p class="photo-credit">'+PhotoLibrary.credit(p.id)+'</p></div><section><span class="eyebrow">SPACE OBSERVATORY</span><h3>'+p.tagline+'</h3><dl class="observatory-specs"><dt>주거울 지름</dt><dd>'+p.mirror+'</dd><dt>관측하는 빛</dt><dd>'+p.wavelength+'</dd><dt>실제 궤도</dt><dd>'+p.orbit+'</dd></dl><a href="'+p.source+'" target="_blank" rel="noopener">NASA 탐사 자료 ↗</a></section></div><details class="science-details"><summary>망원경과 배치 모형</summary><p>조종석의 기체 이미지는 NASA 사진을 바탕으로 배경을 제거·보정한 탐사용 이미지예요. 아래 사진은 원본 자료예요. 허블은 지구 주변, 웹은 태양 반대쪽이라는 관계를 보여 주되, 발견할 수 있도록 지구와의 거리·크기·접근 구역을 확대했어요. 실제 축척이나 현재 위치가 아니에요.</p></details>','OBSERVATORY ARCHIVE');},
 sprites:new Map(),
 paint(ctx,p,x,y,size){
  if(!this.sprites.has(p.id)){const image=new Image();image.src=p.id+'-flight.png';this.sprites.set(p.id,image);}const img=this.sprites.get(p.id);if(!img.complete||!img.naturalWidth)return;
  const width=Math.max(3,size*1.5),height=width*img.naturalHeight/img.naturalWidth;ctx.save();ctx.drawImage(img,x-width/2,y-height/2,width,height);ctx.restore();
 }
};
const AsteroidBelt={
 rocks:[],inside:false,lastSide:null,entrySide:null,near:null,approaching:false,
 init(){let seed=45219;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<520;i++){const a=random()*Math.PI*2,r=2.23+random()*.94;this.rocks.push({id:'rock-'+i,name:'소행성',x:Math.cos(a)*r,y:Math.sin(a)*r,radius:.008+random()*.014,shape:Array.from({length:9},()=>.78+random()*.22),phase:random()*6.28});}},
 contains(){const r=Math.hypot(ship.x,ship.y);return r>2.2&&r<3.2;},
 gap(r=Math.hypot(ship.x,ship.y)){return Math.max(2.2-r,r-3.2,0);},
 smooth(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);},
 visibility(distance){return 1-this.smooth((distance-.35)/1.25);},
 clipBodies(ctx,w,h,distance){for(const p of FlightView.bodies()){if(p.artificial||FlightView.distance(p)>=distance)continue;const rel=FlightView.wrap(Math.atan2(p.y-ship.y,p.x-ship.x)-FlightView.yaw);if(Math.abs(rel)>1.1)continue;const x=w/2+Math.tan(rel)*w*.72,r=Math.min(h*.29,p.radius/Math.max(FlightView.distance(p),.001)*w*.72);ctx.beginPath();ctx.rect(0,0,w,h);ctx.moveTo(x+r,h*.44);ctx.arc(x,h*.44,r,0,Math.PI*2,true);ctx.clip('evenodd');}},
 speedLimit(cruise){return Math.min(cruise,.18+Math.max(0,cruise-.18)*this.smooth(this.gap()/.8));},
 obstacles(){const r=Math.hypot(ship.x,ship.y);return r>1.8&&r<3.6?this.rocks:[];},
 tick(time){const r=Math.hypot(ship.x,ship.y),inside=this.contains(),gap=this.gap(r);if(gap>.75)this.approaching=false;if(!inside&&!this.inside&&gap<.55&&!this.approaching){this.approaching=true;FlightView.notify('소행성대 접근 · 전방의 작은 천체를 확인하세요 · 서서히 감속 중',time);}if(inside&&!this.inside){this.entrySide=this.lastSide;this.approaching=true;FlightView.notify('소행성대 진입 · 전방 레이더 확인 · 감속하여 틈으로 이동',time);}if(!inside&&this.inside){const side=r<=2.2?'inner':'outer';FlightView.notify(side!==this.entrySide?'소행성대 통과 · 항로 확보':'소행성대 이탈 · 다시 항로를 정하세요',time);}this.inside=inside;if(!inside)this.lastSide=r<=2.2?'inner':'outer';this.near=inside?this.rocks.reduce((a,b)=>FlightView.distance(a)<FlightView.distance(b)?a:b):null;},
 draw(ctx,w,h){if(this.gap()>1.6)return;const horizon=h*.44,focal=w*.72;const visible=this.rocks.map(p=>({p,d:FlightView.distance(p),rel:FlightView.wrap(Math.atan2(p.y-ship.y,p.x-ship.x)-FlightView.yaw)})).filter(o=>o.d<1.6&&Math.abs(o.rel)<1.1).sort((a,b)=>b.d-a.d);
  for(const {p,d,rel} of visible){const x=w/2+Math.tan(rel)*focal,rad=Math.min(h*.45,p.radius/Math.max(d,.002)*focal);ctx.save();this.clipBodies(ctx,w,h,d);ctx.globalAlpha=this.visibility(d);ctx.translate(x,horizon);ctx.rotate(p.phase);const g=ctx.createLinearGradient(-rad,-rad,rad,rad);g.addColorStop(0,'#b6a593');g.addColorStop(.48,'#645c54');g.addColorStop(1,'#282b31');ctx.fillStyle=g;ctx.strokeStyle='#a7978280';ctx.lineWidth=1;ctx.beginPath();p.shape.forEach((v,i)=>{const a=i/p.shape.length*Math.PI*2,px=Math.cos(a)*rad*v,py=Math.sin(a)*rad*v;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#25262b66';for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(Math.cos(i*2.2)*rad*.4,Math.sin(i*2.2)*rad*.38,rad*.12,rad*.085,i,0,Math.PI*2);ctx.fill();}ctx.restore();}
  // Forward-looking radar uses the same positions and radii as collision detection.
  const radarAlpha=this.smooth((.65-this.gap())/.45);if(!radarAlpha)return;ctx.save();ctx.globalAlpha=radarAlpha;
  const rw=Math.min(230,w*.4),rx=w-rw-48,ry=170,rh=105;ctx.fillStyle='#07141ee8';ctx.fillRect(rx,ry,rw,rh);ctx.strokeStyle='#617988';ctx.strokeRect(rx,ry,rw,rh);ctx.fillStyle='#d7bd89';ctx.font='10px sans-serif';ctx.textAlign='left';ctx.fillText(w<750?'소행성 레이더':'전방 레이더 · 소행성대',rx+9,ry+16);const ox=rx+rw/2,oy=ry+rh-12,scale=rw/.7;
  for(const p of this.rocks){const dx=p.x-ship.x,dy=p.y-ship.y,front=dx*Math.cos(FlightView.yaw)+dy*Math.sin(FlightView.yaw),side=-dx*Math.sin(FlightView.yaw)+dy*Math.cos(FlightView.yaw);if(front<0||front>.65||Math.abs(side)>.31)continue;ctx.fillStyle=Math.abs(side)<p.radius+.008?'#ff947c':'#9f9a87';ctx.beginPath();ctx.arc(ox+side*scale,oy-front*(rh-30)/.65,Math.max(2,p.radius*scale),0,Math.PI*2);ctx.fill();}ctx.fillStyle='#99efd0';ctx.beginPath();ctx.moveTo(ox,oy-5);ctx.lineTo(ox-4,oy+3);ctx.lineTo(ox+4,oy+3);ctx.closePath();ctx.fill();ctx.fillStyle='#b2a695';ctx.font='10px sans-serif';ctx.fillText('크기·밀도 확대 모형',rx,ry+rh+17);ctx.restore();
 }
};
AsteroidBelt.init();
