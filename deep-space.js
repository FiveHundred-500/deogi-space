'use strict';
// Deterministic world-space scenery: neighbouring cells persist as the ship moves.
// Display sizes/density are exaggerated. These particles are not collision walls.
const DeepSpaceScenery={
 hash(x,y,z,n){const v=Math.sin(x*127.1+y*311.7+z*74.7+n*19.19)*43758.5453;return v-Math.floor(v);},
 particles(kind){
  const oort=kind==='oort',cell=oort?32:2.4,reach=oort?160:12,out=[],cx=Math.floor(ship.x/cell),cy=Math.floor(ship.y/cell),span=Math.ceil(reach/cell);
  for(let ix=cx-span;ix<=cx+span;ix++)for(let iy=cy-span;iy<=cy+span;iy++)for(let iz=oort?-3:0;iz<=(oort?3:2);iz++){
   const hash=n=>this.hash(ix,iy,iz,n),x=(ix+hash(1))*cell,y=(iy+hash(2))*cell,z=oort?(iz+hash(3))*cell:(hash(3)-.5)*.8,r=Math.hypot(x,y,z);
   if(oort?(r<2000||r>2360):(r<30||r>50))continue;
   const dx=x-ship.x,dy=y-ship.y,d=Math.hypot(dx,dy,z);if(d>reach||d<cell*.08)continue;
   const forward=dx*Math.cos(FlightView.yaw)+dy*Math.sin(FlightView.yaw),side=-dx*Math.sin(FlightView.yaw)+dy*Math.cos(FlightView.yaw);
   if(forward<=0||Math.abs(side)>forward*1.1)continue;
   const alpha=(1-AsteroidBelt.smooth((d/reach-.5)/.5))*AsteroidBelt.smooth(d/(cell*.6));
   out.push({forward,side,z,d,alpha,radius:cell*(.012+hash(4)*.035),angle:hash(5)*6.28,shape:Array.from({length:7},(_,i)=>.7+hash(8+i)*.3)});
  }
  return out.sort((a,b)=>b.d-a.d);
 },
 draw(ctx,w,h){
  const r=Math.hypot(ship.x,ship.y),oort=r>1820;if(!oort&&(r<18||r>62))return;
  const focal=w*.72,horizon=h*.44;ctx.save();ctx.beginPath();ctx.rect(35,70,w-70,Math.max(1,h-260));ctx.clip();
  for(const p of this.particles(oort?'oort':'kuiper')){
   const x=w/2+p.side/p.forward*focal,y=horizon-p.z/p.forward*focal,size=Math.min(38,Math.max(1,p.radius/p.forward*focal));
   if(x<-size||x>w+size||y<-size||y>h-170+size)continue;
   ctx.globalAlpha=p.alpha*.86;ctx.save();ctx.translate(x,y);ctx.rotate(p.angle);
   const shade=ctx.createLinearGradient(-size,-size,size,size);shade.addColorStop(0,oort?'#ddd5ed':'#d1edf1');shade.addColorStop(.4,oort?'#827b9b':'#789da9');shade.addColorStop(1,'#263543');ctx.fillStyle=shade;ctx.strokeStyle=oort?'#e0d4fc88':'#b7e4ed88';ctx.lineWidth=.7;ctx.beginPath();
   for(let j=0;j<7;j++){const a=j/7*Math.PI*2,px=Math.cos(a)*size*p.shape[j],py=Math.sin(a)*size*p.shape[j]*.75;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();if(size>3)ctx.stroke();
   if(size>7){ctx.strokeStyle='#e2f4ff33';ctx.beginPath();ctx.moveTo(-size*.5,-size*.3);ctx.lineTo(size*.1,size*.2);ctx.lineTo(size*.6,-size*.2);ctx.stroke();}ctx.restore();
  }
  ctx.restore();
 }
};

const VoyagerVoice={
 audio:null,enabled:true,activated:false,near:false,manual:false,suppressed:false,blocked:false,request:0,status:'골든레코드 · 55개 언어의 인사',
 setup(){
  try{this.enabled=localStorage.getItem('deogi-greeting-muted')!=='true';}catch{}
  this.audio=document.createElement('audio');this.audio.id='goldenAudio';this.audio.src='golden-greetings.mp3';this.audio.preload='none';this.audio.volume=0;this.audio.loop=true;document.body.append(this.audio);
  const toggle=document.createElement('button');toggle.id='greetingSound';toggle.onclick=()=>{this.enabled=!this.enabled;try{localStorage.setItem('deogi-greeting-muted',String(!this.enabled));}catch{}if(!this.enabled)this.stop();else {this.suppressed=false;this.blocked=false;if(this.near)this.play(false);}this.labels();};$('soundBtn').after(toggle);
  const panel=document.createElement('div');panel.id='voyagerMessage';panel.hidden=true;panel.innerHTML='<span class="eyebrow">A MESSAGE FROM EARTH</span><strong>지구에서 온 인사</strong><span id="greetingStatus" role="status"></span><div class="signal-volume" aria-hidden="true"><i id="greetingLevel"></i></div><button id="greetingReplay">▶ 인사 듣기</button>';document.querySelector('.flight').append(panel);
  $('greetingReplay').onclick=()=>{if(!this.audio.paused){this.suppressed=true;this.stop();}else{this.suppressed=false;this.play(false,true);}};
  const activate=e=>{if(e.type==='keydown'&&e.repeat)return;this.activated=true;this.blocked=false;};document.addEventListener('pointerdown',activate,{passive:true});document.addEventListener('keydown',activate);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();});$('modal').addEventListener('close',()=>{if(this.manual){this.stop();this.suppressed=true;}});
  this.audio.addEventListener('error',()=>{this.blocked=true;this.status='음성을 불러오지 못했어요 · 다시 듣기';this.labels();});this.labels();
 },
 stop(){this.request++;if(this.audio)this.audio.pause();this.manual=false;},
 async play(manual=false,force=false){
  if(!this.audio)return;if(force){this.enabled=true;this.blocked=false;try{localStorage.setItem('deogi-greeting-muted','false');}catch{}}
  if(!this.enabled)return;this.manual=manual;this.blocked=true;const request=++this.request;if(manual)this.audio.volume=.6;this.status='골든레코드 · 55개 언어의 인사';
  try{await this.audio.play();if(request!==this.request)return;this.blocked=false;}catch(e){if(request!==this.request)return;this.status=e.name==='NotAllowedError'?'▶ 인사 듣기를 눌러 주세요':'음성을 불러오지 못했어요 · 다시 듣기';}this.labels();
 },
 volumeAt(distance){return .7*Math.pow(Math.max(0,1-distance/10),1.6);},
 update(){
  if(!this.audio)return;const d=FlightView.distance(VOYAGER),near=d<(this.near?11:10);if(!near&&this.near){this.suppressed=false;this.blocked=false;}this.near=near;
  if(!this.manual){
   const active=near&&FlightView.mode==='cockpit'&&!document.hidden&&this.enabled&&!this.suppressed;
   const target=active?this.volumeAt(d):0;this.audio.volume+= (target-this.audio.volume)*.3;
   if(active&&this.activated&&this.audio.paused&&!this.blocked)this.play(false);
   if(!active&&this.audio.volume<.008&&!this.audio.paused)this.stop();
   if(FlightView.mode!=='cockpit'||document.hidden){this.audio.volume=0;if(!this.audio.paused)this.stop();}
  }
  this.labels();
 },
 labels(){
  const toggle=$('greetingSound');if(!toggle)return;toggle.textContent=this.enabled?'인사음 켜짐':'인사음 꺼짐';toggle.setAttribute('aria-pressed',String(this.enabled));
  $('voyagerMessage').hidden=!this.near||FlightView.mode!=='cockpit';$('greetingStatus').textContent=!this.enabled?'인사음 꺼짐':this.suppressed?'인사 재생 일시정지':this.status;
  $('greetingReplay').textContent=this.audio&&!this.audio.paused?'Ⅱ 인사 일시정지':'▶ 인사 이어 듣기';$('greetingLevel').style.width=((this.audio?.volume||0)/.7*100)+'%';
  const status=$('recordAudioStatus');if(status)status.textContent=this.enabled?this.status:'인사음 꺼짐';
 },
 archive(){return '<div class="record-audio"><button id="recordPlay">▶ 55개 언어의 인사 듣기</button><button id="recordRestart">↻ 처음부터</button><button id="recordStop">Ⅱ 일시정지</button><p id="recordAudioStatus" role="status"></p><p class="tiny">한국어를 포함한 55개 언어의 실제 인사 녹음 · 약 4분 25초<br>가까이 다가갈수록 조종석의 재생음이 커져요. 보이저가 우주 공간에 소리를 방송하는 것은 아니에요.</p><a href="https://science.nasa.gov/mission/voyager/golden-record-contents/greetings/" target="_blank" rel="noopener">NASA 인사 자료 ↗</a></div>';},
 bindArchive(){$('recordPlay').onclick=()=>{this.suppressed=false;this.play(true,true);};$('recordRestart').onclick=()=>{this.audio.currentTime=0;this.suppressed=false;this.play(true,true);};$('recordStop').onclick=()=>{this.suppressed=true;this.stop();this.status='인사 재생 일시정지';this.labels();};this.labels();}
};
