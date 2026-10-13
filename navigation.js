'use strict';
// World positions, radii and velocities use AU and simulated seconds, all in one plane.
const FlightView={
 mode:'cockpit',yaw:0,speed:0,cruise:0.8,mapExtent:42,warning:'',event:'지구 관측 구역에서 출발합니다',eventUntil:0,visited:new Set(),cooldown:0,mapPoints:[],audio:null,sound:false,
 wrap(a){return Math.atan2(Math.sin(a),Math.cos(a));},
 distance(p=current()){return Math.hypot(p.x-ship.x,p.y-ship.y);},
 aim(){this.yaw=Math.atan2(current().y-ship.y,current().x-ship.x);},
 bodies(){return [...ENCOUNTERS,...PLANETS];},
 hazards(){return [...this.bodies(),...AsteroidBelt.obstacles()];},
 segmentHit(ax,ay,bx,by,p,r=p.radius){const dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy,t=den?Math.max(0,Math.min(1,((p.x-ax)*dx+(p.y-ay)*dy)/den)):0;return Math.hypot(ax+dx*t-p.x,ay+dy*t-p.y)<r;},
 setup(){
  const bar=document.createElement('div');bar.className='view-switch';bar.innerHTML='<button id="cockpitView" aria-pressed="true">1인칭 조종석</button><button id="mapView" aria-pressed="false">항법 지도</button>';$('space').after(bar);
  const controls=document.createElement('div');controls.className='flight-controls';controls.innerHTML='<label>순항 속도 <select id="cruiseSpeed"><option value="0.1">정밀 · 0.1 AU/s</option><option value="0.8" selected>순항 · 0.8 AU/s</option><option value="3">고속 · 3 AU/s</option></select></label><button id="brakeBtn">■ 제동</button><button id="soundBtn" aria-pressed="false">경보음 꺼짐</button><label id="zoomControl" hidden>지도 범위 <select id="mapZoom"><option value="2">내행성 · 2 AU</option><option value="12">중간 · 12 AU</option><option value="34" selected>전체 · 34 AU</option></select></label>';
  document.querySelector('.workspace').after(controls);
  const status=document.createElement('div');status.id='flightAlert';status.className='flight-alert';status.setAttribute('role','status');document.querySelector('.flight').append(status);
  $('cockpitView').onclick=()=>this.set('cockpit');$('mapView').onclick=()=>this.set('map');$('cruiseSpeed').onchange=e=>{this.cruise=+e.target.value;};$('mapZoom').onchange=e=>{this.mapExtent=+e.target.value;};$('brakeBtn').onclick=()=>this.brake();$('soundBtn').onclick=()=>{this.sound=!this.sound;if(this.sound){try{this.audio||=new (window.AudioContext||window.webkitAudioContext)();this.audio.resume();this.beep();}catch{this.sound=false;}}$('soundBtn').textContent=this.sound?'경보음 켜짐':'경보음 꺼짐';$('soundBtn').setAttribute('aria-pressed',String(this.sound));};
  this.aim();this.set('cockpit');
 },
 beep(){if(!this.sound||!this.audio)return;const a=this.audio,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(620,a.currentTime);o.frequency.linearRampToValueAtTime(380,a.currentTime+.18);g.gain.setValueAtTime(.035,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.24);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.25);},
 brake(){this.speed=0;keys.clear();this.event='제동 완료 · 방향을 정하고 다시 출발하세요';this.eventUntil=performance.now()+3000;updateFlightLabels();},
 set(mode){this.mode=mode;keys.clear();if(mode==='map'){this.speed=0;}$('cockpitView').setAttribute('aria-pressed',String(mode==='cockpit'));$('mapView').setAttribute('aria-pressed',String(mode==='map'));document.querySelector('.flight').classList.toggle('cockpit-mode',mode==='cockpit');document.querySelector('.dpad').hidden=mode==='map';$('zoomControl').hidden=mode!=='map';document.querySelector('.map-caption').innerHTML=mode==='cockpit'?'DEOGI-01 · 공전면 비행<span>별빛을 따라, 다음 발견으로</span>':'항법 지도 · 목적지와 항로 확인<span>궤도 반지름은 실제 평균 거리 비율 · 원형 궤도 모형</span>';document.querySelector('.flight-bottom>span').innerHTML=mode==='cockpit'?'<kbd>↑↓</kbd> 추진·후진 <kbd>←→</kbd> 회전 <kbd>Space</kbd> 제동':'행성 선택 → 조종석으로 돌아가 탐사 · 지도에서는 비행 정지';$('space').setAttribute('aria-label',mode==='cockpit'?'공전면 위를 비행하는 우주선 조종석. 위아래 추진, 좌우 회전, 스페이스 제동.':'태양계 항법 지도. 행성을 눌러 목적지를 고르고 목록으로도 선택할 수 있습니다.');updateFlightLabels();},
 notify(msg,time){this.event=msg;this.eventUntil=time+5500;toast(msg);},
 tick(dt,time){
  this.cooldown=Math.max(0,this.cooldown-dt);this.warning='';
  if(this.mode==='map')return;this.remember(dt);if(this.recovery>0)return;
  const bodies=this.bodies(),nearest=bodies.reduce((a,b)=>this.distance(a)-a.radius<this.distance(b)-b.radius?a:b),clearance=this.distance(nearest)-nearest.radius;
  // Time is compressed; the approach limiter keeps detailed manoeuvres controllable.
  const limit=Math.min(AsteroidBelt.speedLimit(this.cruise),Math.max(.009,clearance*1.2));
  const turn=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0),thrust=(keys.has('ArrowUp')||keys.has('w')?1:0)-(keys.has('ArrowDown')||keys.has('s')?1:0);
  this.yaw=this.wrap(this.yaw+turn*dt*1.15);const desired=thrust*limit;this.speed+=(desired-this.speed)*Math.min(1,dt*(thrust?2.4:3.5));
  const nx=ship.x+Math.cos(this.yaw)*this.speed*dt,ny=ship.y+Math.sin(this.yaw)*this.speed*dt;
  const hazards=this.hazards(),hit=hazards.find(b=>this.segmentHit(ship.x,ship.y,nx,ny,b));
  if(hit){this.rewind();this.beep();this.notify('충돌 감지 · 조금 전 안전한 위치로 복귀했어요. 방향을 바꿔 출발하세요.',time);this.cooldown=3;}
  else{ship.x=nx;ship.y=ny;}
  const heading=this.yaw+(this.speed<0?Math.PI:0),look=Math.max(.018,Math.abs(this.speed)*2.5),threat=hazards.find(b=>this.segmentHit(ship.x,ship.y,ship.x+Math.cos(heading)*look,ship.y+Math.sin(heading)*look,b,b.radius+.006));
  if(threat&&Math.abs(this.speed)>.002){this.warning='⚠ '+bodyName(threat)+' 충돌 주의 · Space / 제동';if(!this.cooldown){this.beep();this.cooldown=2;}}
  else if(Math.hypot(ship.x,ship.y)<.18)this.warning='☀ 태양 근접 · 열 경보 · 반대 방향으로 이동';
  if(Math.hypot(ship.x,ship.y)>42){const a=Math.atan2(ship.y,ship.x);ship.x=Math.cos(a)*41.9;ship.y=Math.sin(a)*41.9;this.brake();this.notify('탐사 범위 경계 · 태양계 방향으로 돌아가세요',time);}
  for(const p of this.bodies())if(this.distance(p)<p.radius+p.zone&&!record(p.id).visited){record(p.id).visited=true;save();this.notify('✦ '+p.name+' 식별 완료 · 관측 신호 확보',time);updateUI();}
  AsteroidBelt.tick(time);
 },
 labels(){const p=current(),q=observationBody,d=this.distance(),time=performance.now();
  $('flightStatus').textContent=paused?'비행 일시정지':this.mode==='map'?'항법 지도 · 정지':q?'관측 구역 · '+bodyName(q):'공전면 자유 비행';
  $('targetName').textContent=q?bodyName(q):'관측 대상 없음';
  $('observationLabel').textContent=q?'현재 관측 대상':'관측 신호 대기';
  $('flightHint').textContent=q?'관측 거리 안 · 장비 사용 가능':'천체에 가까이 다가가세요';
  $('navigationTarget').textContent='항법 목적지 · '+bodyName(p);
  $('navigationDetails').textContent=bearing(p)+'° · 남은 거리 '+d.toFixed(3)+' AU';
  $('distance').textContent='현재 방향 '+headingDegrees(this.yaw)+'° · 속도 '+Math.abs(this.speed).toFixed(3)+' AU/s';
  $('equipmentStatus').innerHTML=q?'<i class="live-dot"></i> 관측 대상 · '+bodyName(q):'가까운 천체가 없어요';
  $('observeBtn').hidden=!q;$('observeBtn').textContent=q?bodyName(q)+' 관측 장비':'관측 장비';
  $('pauseBtn').textContent=paused?'▶':'Ⅱ';$('pauseBtn').setAttribute('aria-label',paused?'비행 재개':'비행 일시정지');if($('flightAlert')){$('flightAlert').textContent=this.warning||(time<this.eventUntil?this.event:'');$('flightAlert').classList.toggle('danger',!!this.warning);}},
 mapClick(x,y){if(this.mode!=='map')return;const found=this.mapPoints.filter(p=>p.i>=0&&Math.hypot(p.sx-x,p.sy-y)<20).sort((a,b)=>Math.hypot(a.sx-x,a.sy-y)-Math.hypot(b.sx-x,b.sy-y))[0];if(found)selectPlanet(found.i);},
 render(ctx,w,h,time){if(this.mode==='map'){this.renderMap(ctx,w,h);return;}
  const horizon=h*.44,focal=w*.72;ctx.fillStyle='#02050c';ctx.fillRect(0,0,w,h);
  // Stable celestial panorama: all scenery rotates with heading, never with the ship's roll.
  for(let i=0;i<9;i++){const a=i*.79+1.4,rel=this.wrap(a-this.yaw);if(Math.abs(rel)>1.2)continue;const x=w/2+Math.tan(rel)*focal,y=h*.16+(i%4)*h*.08,r=w*.55,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%2?'#403c711e':'#1d68732b');g.addColorStop(1,'#03071000');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
  for(let i=0;i<1400;i++){const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};const a=hash(i+1)*Math.PI*2,rel=this.wrap(a-this.yaw);if(Math.abs(rel)>1.1)continue;const elevation=(hash(i+1703)-.5)*1.2,x=w/2+Math.tan(rel)*focal,y=horizon+elevation*h; if(y<0||y>h-155)continue;const size=i%29===0?1.8:i%7===0?1.1:.65;ctx.fillStyle=i%19===0?'#ffe8b5':i%3?'#a8cae4aa':'#f5f7ff';ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();if(size>1.5){ctx.globalAlpha=.23;ctx.fillRect(x-4,y-.5,8,1);ctx.fillRect(x-.5,y-4,1,8);ctx.globalAlpha=1;}}
  const objects=this.bodies().map(p=>({...p,d:this.distance(p),rel:this.wrap(Math.atan2(p.y-ship.y,p.x-ship.x)-this.yaw)})).sort((a,b)=>b.d-a.d);
  for(const p of objects){if(Math.abs(p.rel)>1.1)continue;const x=w/2+Math.tan(p.rel)*focal,size=Math.min(h*.58,Math.max(p.id==='sun'?8:2,2*p.radius/Math.max(p.d,.001)*focal));if(p.id==='sun'){const g=ctx.createRadialGradient(x,horizon,0,x,horizon,size*1.6);g.addColorStop(0,'#fffbe4');g.addColorStop(.26,'#ffd77c');g.addColorStop(.36,'#e8953480');g.addColorStop(1,'#d7740000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,horizon,size*1.6,0,Math.PI*2);ctx.fill();}else if(p.artificial){Observatory.paint(ctx,p,x,horizon,size);}else if(OrbitalView.config[p.id]){OrbitalView.paint(ctx,p,x,horizon,size);}else {ctx.fillStyle='#02050c';ctx.beginPath();ctx.arc(x,horizon,size/2,0,Math.PI*2);ctx.fill();PhotoLibrary.paint(ctx,p.id,x,horizon,size/(PHOTOS[p.id]?.bodyFraction||1));}
   if(p.id===current().id){const r=Math.max(20,size/2+10);ctx.strokeStyle='#9effd499';ctx.setLineDash([5,7]);ctx.strokeRect(x-r,horizon-r,r*2,r*2);ctx.setLineDash([]);ctx.fillStyle='#c0ffe8';ctx.textAlign='center';ctx.font='11px sans-serif';ctx.fillText('목적지 · '+bodyName(p)+' · '+p.d.toFixed(3)+' AU',Math.max(70,Math.min(w-70,x)),horizon+r+19);}
  }
  const p=current(),rel=this.wrap(Math.atan2(p.y-ship.y,p.x-ship.x)-this.yaw);if(Math.abs(rel)>.85){ctx.fillStyle='#a4f2d6';ctx.textAlign=rel<0?'left':'right';ctx.font='12px sans-serif';ctx.fillText((rel<0?'◀ ':'')+'목적지 · '+bodyName(p)+(rel>0?' ▶':''),rel<0?40:w-40,horizon);}
  AsteroidBelt.draw(ctx,w,h);
  // Fixed horizon and heading ticks make coplanar turns easy to read.
  ctx.strokeStyle='#9bc5ca55';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w/2-17,horizon);ctx.lineTo(w/2-6,horizon);ctx.moveTo(w/2+6,horizon);ctx.lineTo(w/2+17,horizon);ctx.moveTo(w/2,horizon-10);ctx.lineTo(w/2,horizon+10);ctx.stroke();
  ctx.fillStyle='#111e2d';ctx.strokeStyle='#486171';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(25,0);ctx.lineTo(35,h-190);ctx.lineTo(75,h-157);ctx.lineTo(w-75,h-157);ctx.lineTo(w-35,h-190);ctx.lineTo(w-25,0);ctx.lineTo(w,0);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#83baad';ctx.font='9px monospace';ctx.textAlign='left';ctx.fillText('HEADING '+((this.yaw*180/Math.PI+360)%360).toFixed(0)+'°',48,h-178);ctx.textAlign='right';ctx.fillText('PLANE LOCK · 공전면 고정',w-48,h-178);
 },
 renderMap(ctx,w,h){ctx.fillStyle='#060d19';ctx.fillRect(0,0,w,h);const top=154,bottom=h-175,cx=w/2,cy=(top+bottom)/2,s=Math.min(w-65,bottom-top)/(this.mapExtent*2);ctx.save();ctx.beginPath();ctx.rect(18,top-8,w-36,bottom-top+27);ctx.clip();ctx.strokeStyle='#1f3545';ctx.lineWidth=1;for(const p of PLANETS){ctx.beginPath();ctx.arc(cx,cy,p.au*s,0,Math.PI*2);ctx.stroke();}
  ctx.strokeStyle='#b99d6240';ctx.lineWidth=Math.max(1,s);ctx.beginPath();ctx.arc(cx,cy,2.7*s,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;ctx.fillStyle='#ffd381';ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#bbaf94';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('태양',cx,cy+17);
  const sx=cx+ship.x*s,sy=cy+ship.y*s,tx=cx+current().x*s,ty=cy+current().y*s;ctx.strokeStyle='#8af3ce80';ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);this.mapPoints=[];
  PLANETS.forEach((p,i)=>{const x=cx+p.x*s,y=cy+p.y*s;if(x<18||x>w-18||y<top-8||y>bottom+19)return;this.mapPoints.push({i,sx:x,sy:y});const selected=p===current();ctx.fillStyle=selected?'#a2ffda':p.color;ctx.beginPath();ctx.arc(x,y,selected?5:3,0,Math.PI*2);ctx.fill();if(selected){ctx.strokeStyle='#9affd6';ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.stroke();}ctx.fillStyle=selected?'#caffec':'#a5b6ca';ctx.textAlign='center';ctx.font='10px sans-serif';if(p.au>.1*this.mapExtent||this.mapExtent===2)ctx.fillText(p.name,x,y-14);});
  ctx.save();ctx.translate(sx,sy);ctx.rotate(this.yaw);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-6,-5);ctx.lineTo(-3,0);ctx.lineTo(-6,5);ctx.closePath();ctx.fill();ctx.restore();ctx.restore();
  ctx.textAlign='left';ctx.font='10px sans-serif';ctx.fillStyle='#b7d1d8';ctx.fillText('반지름 '+this.mapExtent+' AU · 1 AU ≈ 1억 5천만 km',24,bottom+10);ctx.fillStyle='#8399ae';ctx.fillText(this.mapExtent===34?'내행성은 밀집해 있어요. 지도 범위를 2 AU로 확대해 보세요.':'목적지 '+current().name+' · 태양까지 평균 '+current().au+' AU',24,bottom+25);
 }
};
