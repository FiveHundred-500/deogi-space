'use strict';
// Planet descent is an optional, separate probe simulation. No study progress gates.
const DESCENT_WORLDS={
 mercury:{sky:['#05070d','#313034'],ground:[113,107,100],kind:'crater',sites:[['충돌구 가장자리','움푹 파인 바닥과 높아진 테두리가 보여요. 가까이 이동하며 높낮이를 살펴보세요.'],['돌과 바닥','작은 돌들이 바닥에 놓여 있어요. 탐사정의 바퀴도 지면에 닿아 움직여요.'],['어두운 하늘','지표 위에서도 하늘이 어둡게 보여요. 지구에서 본 하늘과 비교해 보세요.']]},
 venus:{sky:['#604423','#c48b44'],ground:[146,102,57],kind:'volcano',sites:[['바퀴 아래 암석','흐린 시야 아래로 울퉁불퉁한 암석 바닥이 나타나요.'],['가려지는 먼 지형','가까운 돌은 보이지만 먼 지형의 윤곽은 흐릿해요.'],['솟아 있는 지형','주변 평원보다 높게 솟은 지형이 보여요. 이 풍경은 금성의 특정 장소를 재현한 것은 아니에요.']]},
 earth:{sky:['#1a537d','#bfd9dc'],ground:[89,116,81],kind:'coast',sites:[['움직이는 물결','해안 옆 물이 움직여요. 탐사정의 바퀴로는 물 위를 달릴 수 없어요.'],['밝은 하늘','지면 위로 밝은 하늘이 펼쳐져 있어요.'],['바퀴가 닿는 땅','단단한 땅에 작은 돌들이 놓여 있어요. 가까이에서 모양을 살펴보세요.']]},
 mars:{sky:['#4c3330','#c58b66'],ground:[159,86,57],kind:'mars',sites:[['붉은 흙과 돌','붉은색의 바닥에 크기가 다른 돌들이 흩어져 있어요. 바퀴를 움직이며 가까이 살펴보세요.'],['높고 낮은 지형','앞에는 높은 산, 옆에는 낮게 파인 지형이 보여요. 이곳은 탐험을 위해 만든 가상의 장소예요.'],['골짜기','주변보다 낮게 패인 길이 이어져 있어요. 모양만 보고 과거에 무엇이 흘렀는지 단정할 수는 없어요.'],['큐리오시티의 사진 기록','NASA의 큐리오시티가 화성 몽 메르쿠 앞에서 촬영한 사진을 이어 붙인 셀피예요. 바퀴 주변의 돌과 흙, 뒤편의 층진 암석을 살펴보세요. 기록을 여는 위치는 실제 탐사차의 위치가 아니에요.']]},
 jupiter:{"sky":["#302b29","#b4a392"],"ground":[174,156,137],"kind":"cloud","sites":[]},
 saturn:{"sky":["#34312a","#bcb29c"],"ground":[184,174,150],"kind":"cloud","sites":[]},
 uranus:{"sky":["#263638","#99b6b7"],"ground":[145,171,172],"kind":"cloud","sites":[]},
 neptune:{"sky":["#202c36","#849aa9"],"ground":[124,147,163],"kind":"cloud","sites":[]}
};
const PlanetDescent={
 scanned:new Set(),
 loadScans(){try{const saved=JSON.parse(localStorage.getItem('deogi-probe-scans-v1')||'[]');if(Array.isArray(saved))for(const key of saved){if(typeof key!=='string')continue;const [mode,id,index]=key.split(':');if(!DESCENT_WORLDS[id])continue;if(['local','visual'].includes(mode)&&key===mode+':'+id||mode==='site'&&DESCENT_WORLDS[id].sites[Number(index)]&&key==='site:'+id+':'+Number(index))this.scanned.add(key);}}catch{}},
 scanKey(mode,index){return mode+':'+this.body.id+(mode==='site'?':'+index:'');},
 active:false,held:new Set(),x:0,z:0,yaw:0,depth:0,verticalSpeed:0,maxDepth:0,holdingAltitude:false,shakeEnabled:true,phase:0,inspection:false,clock:0,
 eligible(p){return !!p&&!!DESCENT_WORLDS[p.id];},
 setup(){
  const launch=document.createElement('button');launch.id='descentLaunch';launch.className='descent-launch';launch.hidden=true;launch.onclick=()=>this.enter();document.querySelector('.flight').append(launch);
  const panel=document.createElement('dialog');panel.id='descent';panel.setAttribute('aria-label','행성 근접 탐사');panel.innerHTML=`<canvas id="descentCanvas" tabindex="0" aria-label="탐사정 시야. 방향키로 이동하고 회전하세요."></canvas><header class="descent-head"><div><small>DEOGI / DESCENT PROBE</small><h1 id="descentTitle"></h1><span id="descentMode"></span></div><button id="descentReturn">↑ 우주선으로 복귀 <kbd>Esc</kbd></button></header><div class="descent-reticle" aria-hidden="true">＋</div><div id="descentPoints"></div><section class="descent-readout"><small>PROBE / LOCAL SENSORS</small><strong id="descentAir"></strong><span id="descentStatus" role="status"></span><strong id="descentContact"></strong><div class="descent-actions"><button id="descentObserve">주변 관찰</button><button id="descentSurface">대기 스캔</button><button id="descentRecords">관찰 기록</button></div><div id="descentDepthLabel"><span id="descentVertical"></span><button id="descentShake" aria-pressed="true">시야 흔들림 켜짐</button></div></section><section id="descentNote" hidden><button id="descentNoteClose" aria-label="관찰 자료 닫기">×</button><small>PROBE / FIELD NOTES</small><h2 id="descentNoteTitle"></h2><p id="descentNoteText" role="status"></p><progress id="descentScan" max="1" value="0" aria-label="현장 스캔 진행" hidden></progress><div id="descentArchive" hidden></div><figure id="descentPhoto" hidden><img src="assets/curiosity-mont-mercou.jpg" alt="화성의 암석 지형 앞에 선 큐리오시티 탐사차의 셀피"><figcaption>NASA/JPL-Caltech/MSSS · 2021 · PIA24543<br><a href="https://science.nasa.gov/photojournal/curiositys-selfie-at-mont-mercou/" target="_blank" rel="noopener">사진 원본과 촬영 정보 ↗</a></figcaption></figure></section><footer class="descent-foot"><p id="descentControls"></p><div class="descent-buttons"><button data-probe="ArrowLeft" aria-label="탐사정 왼쪽 회전">←</button><button data-probe="ArrowUp" aria-label="탐사정 전진">↑</button><button data-probe="ArrowDown" aria-label="탐사정 후진">↓</button><button data-probe="ArrowRight" aria-label="탐사정 오른쪽 회전">→</button><button id="descentStop">■ 정지</button></div><details><summary>관측 자료 기반 환경 모형</summary><p>장소·지형·색·기류·이동은 탐험을 위해 재구성했어요. 큐리오시티 현장 모습은 NASA 사진을 바탕으로 배경과 시점을 AI로 조정한 이미지예요. 원본 사진은 탐사차를 누르면 볼 수 있어요. 실제 착륙·대기 촬영 영상이 아니며, 고도 조종과 복귀도 체험용 기능이에요. 실제 구름의 두께와 분포는 장소에 따라 달라요. 하강에 따른 밝기·밀도 변화는 구름 통과를 느끼기 위한 연출이며 실제 깊이별 구름 지도가 아니에요.</p><a id="descentSource" target="_blank" rel="noopener">NASA 행성 자료 ↗</a></details></footer><div id="descentTransition" aria-hidden="true"><span id="descentTransitionText"></span></div>`;document.body.append(panel);
  this.shakeEnabled=true;this.panel=panel;this.canvas=$('descentCanvas');this.ctx=this.canvas.getContext('2d');
  $('descentReturn').onclick=()=>this.leave();panel.addEventListener('cancel',e=>{e.preventDefault();this.inspection?this.closeNote():this.leave();});
  $('descentSurface').onclick=()=>this.inspectLocal();$('descentObserve').onclick=()=>this.inspectSurroundings();$('descentRecords').onclick=()=>this.openRecords();$('descentNoteClose').onclick=()=>this.closeNote();$('descentStop').onclick=()=>{this.held.clear();this.verticalSpeed=0;this.holdingAltitude=true;};$('descentShake').onclick=()=>{this.shakeEnabled=!this.shakeEnabled;this.updateShake();};this.updateShake();
  panel.querySelectorAll('[data-probe]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.held.add(b.dataset.probe);if(['ArrowUp','ArrowDown'].includes(b.dataset.probe))this.holdingAltitude=false;};for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>this.held.delete(b.dataset.probe));});
  const normalize=k=>({w:'ArrowUp',s:'ArrowDown',a:'ArrowLeft',d:'ArrowRight'}[k.toLowerCase()]||k);
  window.addEventListener('keydown',e=>{if(!this.active)return;if(e.key==='Tab')return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();this.inspection?this.closeNote():this.leave();return;}if(e.target.tagName==='INPUT')return;const k=normalize(e.key);if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(k)){if(e.key===' '&&e.target.tagName==='BUTTON')return;e.preventDefault();k===' '?(this.held.clear(),this.verticalSpeed=0,this.holdingAltitude=true):(this.held.add(k),(['ArrowUp','ArrowDown'].includes(k)?this.holdingAltitude=false:0));}e.stopImmediatePropagation();},true);
  window.addEventListener('keyup',e=>{if(this.active){this.held.delete(normalize(e.key));e.stopImmediatePropagation();}},true);
  window.addEventListener('blur',()=>{this.held.clear();this.verticalSpeed=0;});document.addEventListener('visibilitychange',()=>{this.held.clear();this.verticalSpeed=0;});
  let drag=null;this.canvas.addEventListener('pointerdown',e=>{if(!this.active)return;drag={x:e.clientX,id:e.pointerId};this.canvas.setPointerCapture(e.pointerId);this.canvas.focus();});this.canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;this.yaw-=(e.clientX-drag.x)*.004;drag.x=e.clientX;});for(const event of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(event,()=>drag=null);
  new ResizeObserver(()=>this.resize()).observe(this.canvas);
  const oldLabels=FlightView.labels;FlightView.labels=function(){oldLabels.call(this);PlanetDescent.launchLabel();};
  const oldRender=FlightView.render;FlightView.render=function(...args){if(!PlanetDescent.active)oldRender.apply(this,args);};
  const oldTick=FlightView.tick;FlightView.tick=function(...args){if(!PlanetDescent.active)oldTick.apply(this,args);};this.launchLabel();
 },
 launchLabel(){const p=observationBody,b=$('descentLaunch');b.hidden=this.active||FlightView.mode!=='cockpit'||!this.eligible(p);if(!b.hidden)b.textContent=p.name+' · 탐사정 보내기 ↘';},
 enter(){
  updateRange();const p=observationBody;if(this.active||!this.eligible(p)||FlightView.mode!=='cockpit')return false;
  this.body=p;this.world=DESCENT_WORLDS[p.id];this.cloud=this.world.kind==='cloud';this.saved={x:ship.x,y:ship.y,yaw:FlightView.yaw,paused};paused=true;keys.clear();FlightView.speed=0;VoyagerVoice.stop();
  CockpitUI.returnPanel=null;CockpitUI.closePanel(false);if($('modal').open)$('modal').close();this.active=true;this.scan=null;this.localScanned=this.scanned.has("local:"+p.id);this.noteMode=null;this.cloudTextures=null;this.x=0;this.z=0;this.yaw=0;this.depth=0;this.verticalSpeed=0;this.maxDepth=0;this.holdingAltitude=false;this.phase=0;this.clock=0;this.waterBlocked=false;this.held.clear();this.inspection=false;
  $('descentTitle').textContent=p.name;$('descentMode').textContent='근접 탐사 · 무인 탐사정';$('descentAir').textContent='주변 환경 확인 중';this.panel.classList.toggle('cloud-mode',this.cloud);$('descentDepthLabel').hidden=!this.cloud;$('descentStop').textContent=this.cloud?'■ 고도 유지':'■ 정지';$('descentNote').hidden=true;$('descentPhoto').hidden=true;$('descentScan').hidden=true;
  $('descentControls').textContent=this.cloud?'자동 하강 · ↑ 역추진 상승 · ↓ 빠른 하강 · ←→ 회전 · Space 고도 유지':'↑↓ / W·S 전후 이동 · ←→ / A·D 회전 · 드래그로 둘러보기 · ◇ 관찰';
  for(const [key,ground,air] of [['ArrowUp','전진','상승'],['ArrowDown','후진','하강']]){const b=this.panel.querySelector('[data-probe="'+key+'"]');b.setAttribute('aria-label','탐사정 '+(this.cloud?air:ground));b.textContent=(key==='ArrowUp'?'↑':'↓')+' '+(this.cloud?air:ground);}
  $('descentSource').href='https://science.nasa.gov/'+p.id+'/facts/';$('descentTransitionText').textContent='탐사정 분리 · 접근 중';
  $('descentPoints').innerHTML=this.world.sites.map((_,i)=>'<button class="descent-point '+(p.id==='mars'&&i===3?'descent-rover':'')+'" data-site="'+i+'" aria-label="'+(p.id==='mars'&&i===3?'큐리오시티 사진 기록':'관찰 지점 '+(i+1))+'">'+(p.id==='mars'&&i===3?'<img src="assets/curiosity-grounded.png" alt="화성 지면 위의 큐리오시티 탐사차"><span>큐리오시티':'◇ <span>관찰')+'</span></button>').join('');
  this.points=[...$('descentPoints').children];this.points.forEach((b,i)=>b.onclick=()=>this.inspect(i));this.panel.showModal();this.resize();this.canvas.focus();this.previous=performance.now();this.launchLabel();this.animation=requestAnimationFrame(t=>this.frame(t));return true;
 },
 leave(){if(!this.active)return;this.active=false;this.scan=null;cancelAnimationFrame(this.animation);this.held.clear();this.verticalSpeed=0;keys.clear();Object.assign(ship,{x:this.saved.x,y:this.saved.y});FlightView.yaw=this.saved.yaw;FlightView.speed=0;paused=this.saved.paused;this.panel.close();updateRange();updateUI();$('space').focus();},
 remember(mode,index=null){this.scanned.add(this.scanKey(mode,index));try{localStorage.setItem('deogi-probe-scans-v1',JSON.stringify([...this.scanned]));}catch{}},
 prepareNote(mode){this.scan=null;this.inspection=true;this.noteMode=mode;$('descentArchive').hidden=true;$('descentScan').hidden=true;$('descentPhoto').hidden=true;$('descentNote').hidden=false;$('descentNoteClose').focus();},
 inspect(i){if(this.phase<1||!this.world.sites[i])return;this.prepareNote('site');this.remember('site',i);this.showScanResult('site',i);},
 inspectSurroundings(){if(this.phase<1)return;this.prepareNote('visual');this.remember('visual');this.renderSurroundings();},
 openRecords(){
  if(this.phase<1)return;this.prepareNote('records');$('descentNoteTitle').textContent=this.body.name+' · 관찰 기록';
  const entries=this.world.sites.map((site,i)=>({title:site[0],index:i})).filter(e=>this.scanned.has(this.scanKey('site',e.index))),visual=this.scanned.has(this.scanKey('visual'));
  $('descentNoteText').textContent=(!this.localScanned&&!visual&&!entries.length)?'아직 저장된 기록이 없어요. 주변을 직접 관찰하거나 대기를 스캔해 보세요.':'직접 관찰한 내용과 대기 스캔 결과예요.';
  $('descentArchive').hidden=false;$('descentArchive').innerHTML=(visual?'<button data-record="visual">주변 · 지표 관찰</button>':'')+(this.localScanned?'<button data-record="local">대기 · 스캔 결과</button>':'')+entries.map(e=>'<button data-record="'+e.index+'">'+e.title+'</button>').join('');
  $('descentArchive').querySelectorAll('[data-record]').forEach(b=>b.onclick=()=>{this.prepareNote('record-detail');b.dataset.record==='local'?this.renderLocalNote():b.dataset.record==='visual'?this.renderSurroundings():this.showScanResult('site',Number(b.dataset.record));});
 },
 updateShake(){const b=$('descentShake');b.textContent=this.shakeEnabled?'시야 흔들림 켜짐':'시야 흔들림 꺼짐';b.setAttribute('aria-pressed',String(this.shakeEnabled));},
 inspectLocal(){
  if(this.phase<1)return;this.startScan('local');
 },
 startScan(mode,index=null){
  if(this.scan)return;this.prepareNote(mode);
  if(this.scanned.has(this.scanKey(mode,index))){$('descentScan').hidden=true;this.showScanResult(mode,index);$('descentNote').hidden=false;$('descentNoteClose').focus();return;}
  this.scan={mode,index,elapsed:0,bodyId:this.body.id};
  $('descentPhoto').hidden=true;$('descentNoteTitle').textContent=this.body.name+' · 대기 스캔 중';$('descentNoteText').textContent='대기 성분을 분석하고 있어요.';
  $('descentScan').hidden=false;$('descentScan').value=0;$('descentNote').hidden=false;$('descentNoteClose').focus();
 },
 advanceScan(dt){
  const scan=this.scan;if(!scan)return;scan.elapsed+=dt;$('descentScan').value=Math.min(1,scan.elapsed/3);
  if(scan.elapsed<3)return;this.scan=null;$('descentScan').hidden=true;
  if(scan.bodyId!==this.body.id||!this.inspection)return;
  this.remember(scan.mode,scan.index);
  this.showScanResult(scan.mode,scan.index);
 },
 showScanResult(mode,index){
  $('descentPhoto').hidden=true;
  if(mode==='local'){this.localScanned=true;ProbeFindings.confirm(this.body.id);this.renderLocalNote();}
  else {const note=this.world.sites[index];$('descentNoteTitle').textContent=note[0];$('descentNoteText').textContent=note[1];$('descentPhoto').hidden=!(this.body.id==='mars'&&index===3);}
 },
 renderSurroundings(){
  const ground={mercury:['암석 지표에 접지','단단한 암석 지표에 닿았어요. 주변에는 돌과 충돌구가 보여요.'],venus:['구름 아래 암석 지표','구름 아래로 내려오니 단단한 암석 지표에 닿았어요.'],earth:['암석 지표와 액체 물','단단한 땅 위로 이동할 수 있어요. 옆에는 액체 상태의 물이 보여요.'],mars:['붉은 흙과 암석 지표','단단한 지면 위로 이동할 수 있어요. 주변에는 붉은 흙과 암석이 보여요.']};
  const note=this.cloud?['구름 속에서 받은 신호','구름이 시야를 가렸다가 지나가요. 이번 탐사 범위에서는 지면이 검출되지 않았어요.\n\n연구 자료와 연결: '+this.body.name+'에는 내려앉을 단단한 지표가 없어요.']:ground[this.body.id];
  $('descentNoteTitle').textContent=note[0];$('descentNoteText').textContent=note[1];
 },
 renderLocalNote(){
  const atmosphere={mercury:'대기가 거의 없어요.',venus:'주로 이산화 탄소 · 두꺼운 대기',earth:'주로 질소와 산소',mars:'주로 이산화 탄소 · 희박한 대기',jupiter:'주로 수소와 헬륨',saturn:'주로 수소와 헬륨',uranus:'주로 수소와 헬륨',neptune:'주로 수소와 헬륨'};
  $('descentNoteTitle').textContent=this.body.name+' · 대기 스캔 결과';$('descentNoteText').textContent='대기 · 주요 성분\n'+atmosphere[this.body.id];
 },
 closeNote(){this.scan=null;this.inspection=false;$('descentNote').hidden=true;$('descentScan').hidden=true;this.canvas.focus();},
 resize(){if(!this.active)return;this.w=innerWidth;this.h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);},
 step(dt){if(document.hidden)return;this.clock+=dt;this.phase=Math.min(1,this.phase+dt/3.5);if(this.phase<1)return;const turn=(this.held.has('ArrowRight')?1:0)-(this.held.has('ArrowLeft')?1:0),move=this.cloud?0:(this.held.has('ArrowUp')?1:0)-(this.held.has('ArrowDown')?1:0);this.yaw+=turn*dt*.85;
 if(this.cloud){const up=this.held.has('ArrowUp'),down=this.held.has('ArrowDown'),target=up&&down?0:up?-.07:down?.1:this.holdingAltitude?0:.045;this.verticalSpeed+=(target-this.verticalSpeed)*(1-Math.exp(-dt*8));this.depth=Math.max(0,this.depth+this.verticalSpeed*dt);if(this.depth===0)this.verticalSpeed=0;this.maxDepth=Math.max(this.maxDepth,this.depth);}
 const nx=Math.max(-150,Math.min(150,this.x+Math.sin(this.yaw)*move*dt*12)),nz=Math.max(-150,Math.min(150,this.z+Math.cos(this.yaw)*move*dt*12));this.waterBlocked=this.world.kind==='coast'&&nx< -24;if(!this.waterBlocked){this.x=nx;this.z=nz;}this.advanceScan(dt);},
 frame(t){if(!this.active)return;const dt=Math.min(.04,Math.max(0,(t-this.previous)/1000));this.previous=t;this.step(dt);this.draw();this.animation=requestAnimationFrame(time=>this.frame(time));},
 height(x,z){let v=Math.sin(x*.04)*1.8+Math.cos(z*.055)*1.4+Math.sin(x*.13+z*.07)*.5;const crater=Math.hypot(x+30,z-75);if(this.world.kind==='crater')v+=5*Math.exp(-Math.pow((crater-18)/4,2))-5*Math.exp(-Math.pow(crater/13,4));if(['volcano','mars'].includes(this.world.kind))v+=22*Math.exp(-((x-18)**2+(z-115)**2)/950)-4*Math.exp(-((x-18)**2+(z-115)**2)/70);if(this.world.kind==='mars')v-=3*Math.exp(-Math.pow((x-35*Math.sin(z*.018)-25)/8,2));if(this.world.kind==='coast'&&x< -25)v=-1;return v;},
 project(x,z,y=0){const dx=x-this.x,dz=z-this.z,c=Math.cos(this.yaw),s=Math.sin(this.yaw),side=dx*c-dz*s,forward=dx*s+dz*c;if(forward<1)return null;const f=this.w*.75;return {x:this.w/2+side/forward*f,y:this.h*.43+(this.eye-y)/forward*f,d:forward};},
 draw(){const c=this.ctx,w=this.w,h=this.h,k=this.world,sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,k.sky[0]);sky.addColorStop(1,k.sky[1]);c.fillStyle=sky;c.fillRect(0,0,w,h);this.eye=this.cloud?8:this.height(this.x,this.z)+3+(1-this.phase)**2*65;
  if(this.cloud){c.save();if(this.shakeEnabled){const a=3+Math.min(3,Math.abs(this.verticalSpeed)*40);c.translate(w/2+Math.sin(this.clock*7.1)*a,h/2+Math.sin(this.clock*9.3)*a*.7);c.rotate(Math.sin(this.clock*2.7)*.004);c.translate(-w/2,-h/2);}this.drawClouds(c,w,h);c.restore();}else {this.drawGround(c,w,h);this.drawRocks(c,w,h);}
  this.drawPoints();c.strokeStyle='#e2f3e52a';c.lineWidth=1;c.strokeRect(18,18,w-36,h-36);c.fillStyle='#d4e8df';c.font='11px monospace';c.textAlign='center';c.fillText('PROBE / '+String((this.yaw*180/Math.PI%360+360)%360|0).padStart(3,'0')+'°',w/2,40);
  $('descentTransition').style.opacity=String(Math.max(0,1-this.phase*2));$('descentTransition').hidden=this.phase>=.5;
  $('descentSurface').disabled=this.phase<1||!!this.scan||this.localScanned;$('descentSurface').textContent=this.scan?'대기 스캔 중…':this.localScanned?'대기 스캔 완료':'대기 스캔';
  $('descentObserve').disabled=this.phase<1;$('descentRecords').disabled=this.phase<1;
  $('descentAir').textContent=this.phase<1?'카메라 연결 중':this.cloud?'카메라 · 주변 구름 속':'카메라 · 지면 위';
  if(this.cloud)$('descentVertical').textContent=this.verticalSpeed>.002?'↓ 하강 중':this.verticalSpeed<-.002?'↑ 역추진 상승 중':'고도 유지';

  const surfaces={mercury:'접지 · 충돌구가 있는 암석 지표',venus:'접지 · 뜨거운 암석 지표',earth:'접지 · 암석 해안과 액체 바다',mars:'접지 · 붉은 토양과 암석'};
  $('descentContact').textContent=this.phase<.45?'탐사정 하강 중':this.phase<1?(this.cloud?'하방 지면 신호 탐색 중':'지형이 가까워지는 중'):this.cloud?'하방 지면 미검출 · 접지 신호 없음':surfaces[this.body.id];
  const edge=Math.abs(this.x)>=149||Math.abs(this.z)>=149;$('descentStatus').textContent=this.phase<1?'진입 중…':this.waterBlocked?'해안 경계 · 액체 물 위로 주행할 수 없어요':edge?'탐사 구역 가장자리 · 방향을 돌려주세요':this.cloud?(this.cloudEnvironment().label):'지표 이동 · '+(this.held.size?'탐사정 운행 중':'정지');
 },
 drawGround(c,w,h){
  const f=w*.75,horizon=h*.43,cos=Math.cos(this.yaw),sin=Math.sin(this.yaw),base=this.world.ground;
  // Sample a fixed height field in world coordinates; nearby features retain parallax.
  for(let row=44;row>=0;row--){const near=2+row*row*.12,far=2+(row+1)*(row+1)*.12;for(let col=0;col<42;col++){
   const a=(col/42-.5)*w/f*1.25,b=((col+1)/42-.5)*w/f*1.25;
   const vertices=[[a,near],[b,near],[b,far],[a,far]].map(([side,d])=>{const x=this.x+sin*d+cos*side*d,z=this.z+cos*d-sin*side*d,y=this.height(x,z);return {x,y,z,sx:w/2+side*f,sy:horizon+(this.eye-y)/d*f};});
   const center=vertices[0],water=this.world.kind==='coast'&&center.x< -25;
   let shade=.84+(this.height(center.x,center.z+1)-this.height(center.x,center.z-1))*.1-(this.height(center.x+1,center.z)-this.height(center.x-1,center.z))*.08;shade=Math.max(.48,Math.min(1.3,shade));let rgb=water?[31,105+Math.sin(center.z*.9+this.clock)*8,132]:base.map(v=>v*shade);const fog=Math.min(.8,near/290)*(this.body.id==='venus'?.98:.45);rgb=rgb.map((v,i)=>Math.round(v*(1-fog)+[180,152,128][i]*fog));c.fillStyle='rgb('+rgb.join(',')+')';c.beginPath();vertices.forEach((p,i)=>i?c.lineTo(p.sx,p.sy):c.moveTo(p.sx,p.sy));c.closePath();c.fill();c.strokeStyle=c.fillStyle;c.lineWidth=.6;c.stroke();
  }}
  // A soft atmosphere blends the horizon without obscuring near-ground movement.
  if(this.body.id!=='mercury'){const fog=c.createLinearGradient(0,h*.28,0,h*.62);fog.addColorStop(0,'#ffffff00');fog.addColorStop(.5,this.body.id==='venus'?'#bb8b5066':'#b7ac9620');fog.addColorStop(1,'#ffffff00');c.fillStyle=fog;c.fillRect(0,h*.28,w,h*.34);}
 },
 drawRocks(c,w,h){
  const rocks=[],hash=(x,z)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5;return n-Math.floor(n);};
  for(let i=-7;i<=7;i++)for(let j=-7;j<=7;j++){const ix=Math.floor(this.x/8)+i,iz=Math.floor(this.z/8)+j,a=hash(ix,iz),x=(ix+a)*8,z=(iz+hash(iz,ix+9))*8;if(this.world.kind==='coast'&&x< -25)continue;const p=this.project(x,z,this.height(x,z));if(!p||p.d>65||p.d<2||p.x< -40||p.x>w+40)continue;rocks.push({...p,a,size:Math.min(90,(.2+a*.65)/p.d*w*.75)});}
  rocks.sort((a,b)=>b.d-a.d);for(const p of rocks){const x=p.x,y=p.y,r=p.size;if(y<100||y>h+50)continue;c.fillStyle='#191a1824';c.beginPath();c.ellipse(x+r*.4,y+r*.1,r*1.2,r*.22,0,0,Math.PI*2);c.fill();const rgb=this.world.ground.map(v=>Math.round(v*.65));c.fillStyle='rgb('+rgb.join(',')+')';c.beginPath();c.moveTo(x-r,y);c.lineTo(x-r*.75,y-r*.6);c.lineTo(x+r*.1,y-r);c.lineTo(x+r*.8,y-r*.5);c.lineTo(x+r,y);c.closePath();c.fill();c.fillStyle='#ffffff12';c.beginPath();c.moveTo(x-r*.75,y-r*.6);c.lineTo(x+r*.1,y-r);c.lineTo(x+r*.3,y-r*.3);c.lineTo(x-r*.3,y-r*.2);c.closePath();c.fill();}
 },
 cloudEnvironment(){const d=Math.max(0,this.depth);return {dim:1-.55*(1-Math.exp(-d*.65)),density:.45+.5*(1-Math.exp(-d*.8)),label:d<.45?'옅은 구름 사이 · 빛이 퍼지는 시야':d<1.2?'짙은 구름층 · 시야가 가려졌다 열려요':'빛이 희미한 구름층 · 접지 신호 탐색 중'};},
 makeCloudTextures(){
  const W=256,H=160,base=this.world.ground,hash=(x,y,seed)=>{const n=Math.sin(x*127.1+y*311.7+seed*79.3)*43758.5453;return n-Math.floor(n);};
  const noise=(x,y,seed)=>{const ix=Math.floor(x),iy=Math.floor(y);let u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return (hash(ix,iy,seed)*(1-u)+hash(ix+1,iy,seed)*u)*(1-v)+(hash(ix,iy+1,seed)*(1-u)+hash(ix+1,iy+1,seed)*u)*v;};
  this.cloudTextures=[1,2,3].map(seed=>{const tile=document.createElement('canvas');tile.width=W;tile.height=H;const ctx=tile.getContext('2d'),img=ctx.createImageData(W,H);
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){const u=x/W,v=y/H;let n=0,weight=.55;
    for(let octave=0;octave<4;octave++){const f=3*Math.pow(2,octave);n+=noise(u*f,v*f,seed)*weight;weight*=.5;}
    const center=.5+Math.sin(u*9+seed)*.085+Math.sin(u*21+seed*3)*.035;
    const edge=Math.max(0,Math.min(1,(.38-Math.abs(v-center)+(n-.5)*.28)*9)),alpha=edge*edge*(3-2*edge)*Math.min(1,u*18,(1-u)*18)*Math.min(1,v*12,(1-v)*12);
    const light=.54+n*.68+(center-v)*.2,idx=(y*W+x)*4;
    for(let k=0;k<3;k++)img.data[idx+k]=Math.min(255,base[k]*light+22);img.data[idx+3]=Math.round(alpha*255);
   }ctx.putImageData(img,0,0);return tile;});
 },
 drawClouds(c,w,h){
  if(!this.cloudTextures)this.makeCloudTextures();const env=this.cloudEnvironment(),d=this.depth,t=this.clock;
  c.fillStyle='rgb('+this.world.ground.map(v=>Math.round(v*.5*env.dim)).join(',')+')';c.fillRect(-30,-30,w+60,h+60);
  // Three irregular, continuous banks replace the thin rain-like tracers.
  // Their opaque centers cover the view; their lower edges rise out of the frame.
  for(let layer=0;layer<3;layer++){
   const speed=[1.4,5,9][layer],height=h*[1.15,1.85,1.65][layer],width=w*[1.6,1.5,1.7][layer],period=height+h*[.9,.85,1.25][layer];
   // Wrap the panorama and overlap feathered edges: unlimited turns never expose a blank side.
   const span=width*.8,drift=Math.sin(t*.11+layer)*w*.06-this.yaw/(Math.PI*2)*span;
   const start=((drift%span)+span)%span-span;
   const y=((layer*period*.31-d*h*speed)%period+period)%period-height;
   c.globalAlpha=([.42,.9,.98][layer])*(.72+env.density*.28);
   for(const shift of [0,period])for(let x=start-span;x<w+30;x+=span)c.drawImage(this.cloudTextures[layer],x,y+shift,width,height);
  }
  c.globalAlpha=1;
  // Scattered light inside a passing bank briefly obscures all distant detail.
  const passage=Math.pow(Math.max(0,Math.sin(d*17-.8)),4),fog=c.createLinearGradient(0,h,0,0);
  fog.addColorStop(0,'rgba(204,201,190,'+(passage*env.density*.45)+')');fog.addColorStop(1,'rgba(204,201,190,'+(passage*env.density*.16)+')');c.fillStyle=fog;c.fillRect(-20,-20,w+40,h+40);
  c.fillStyle='rgba(5,9,16,'+(1-env.dim)+')';c.fillRect(-20,-20,w+40,h+40);
 },
 roverPlacement(x,z){const p=this.project(x,z,this.height(x,z));return p?{...p,width:Math.min(this.w*.6,this.w*.75*8/p.d)}:null;},
 drawPoints(){const locations=this.cloud?[[0,35],[-40,55],[45,65]]:this.world.kind==='coast'?[[-36,42],[15,65],[35,45]]:[[0,32],[18,100],[-30,70],[14,38]];this.points.forEach((b,i)=>{const [x,z]=locations[i],rover=this.body.id==='mars'&&i===3,p=rover?this.roverPlacement(x,z):this.project(x,z,this.cloud?7:this.height(x,z)+2),visible=this.phase===1&&p&&p.x>35&&p.x<this.w-35&&p.y>130&&p.y<this.h-170;b.hidden=!visible;if(!visible)return;b.style.left=p.x+'px';b.style.top=p.y+'px';if(rover)b.style.width=p.width+'px';b.classList.toggle('near',Math.abs(p.x-this.w/2)<65);});}
};
PlanetDescent.loadScans();
PlanetDescent.setup();
