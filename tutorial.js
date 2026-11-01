'use strict';
// Guided practice reuses the live instruments without moving the ship or unlocking bodies.
const DeogiTutorial={
 key:'deogi-tutorial-v1',active:false,index:-1,done:false,
 steps:[
  {title:'사진 속 관측 지점 찾기',text:'사진 위로 마우스를 천천히 움직이거나 손가락으로 쓸어 보세요. 나타나는 번호를 하나 눌러 보세요. Tab 키로도 찾을 수 있어요.',open:()=>observe(PLANETS[2]),success:'관측 자료를 열었어요. 내용을 읽고 다음 도구로 가세요.'},
  {title:'지름의 양 끝 맞추기',text:'두 눈금선을 지구 본체의 왼쪽·오른쪽 가장자리로 끌어 보세요. 아래 슬라이더나 눈금선의 ← → 키도 사용할 수 있어요.',open:()=>measure(PLANETS[2]),success:'양 끝을 맞췄어요. 아래 측정값의 단위는 만 km예요. 토성에서는 고리를 제외하고 본체를 재요.'},
  {title:'추를 달아 눈금 읽기',text:'100 g, 200 g, 500 g 중 추를 고른 뒤 ‘지구 저울에 추 달기’를 누르세요. 추를 저울로 끌어 놓아도 돼요.',open:()=>gravity(PLANETS[2]),success:'추를 달았어요. 빨간 지시선의 N 눈금을 읽어 보세요. 다른 행성과 비교할 때는 같은 질량의 추를 사용해요.'},
  {title:'위성 탐지기 작동하기',text:'‘위성계 스캔 시작’을 누르고 자료가 나타날 때까지 잠깐 기다려 보세요.',open:()=>moons(PLANETS[2]),success:'위성 자료가 나타났어요. 위성 수와 대표 위성의 사진·특징을 확인할 수 있어요.'},
  {title:'계산하고 기록 확인하기',text:'계산기를 열고 간단한 식을 계산해 보세요. 예: 12 ÷ 3. = 버튼이나 Enter 키로 계산합니다. 이전 식은 아래 계산 기록에 남아요.',open(){openModal('계산기를 꺼내 보세요','<p>측정값을 비교할 때 계산기를 함께 사용할 수 있어요.</p><button class="primary" id="tutorialCalcOpen">▦ 계산기 열기</button><p>실제 탐사에서는 화면의 계산기 버튼 또는 C 키로 열어요. 위쪽 손잡이를 끌면 위치를 옮길 수 있어요.</p>','조작 연습');$('tutorialCalcOpen').onclick=()=>Calculator.open();},success:'계산 기록이 남았어요. 나중에 ‘식 불러오기’로 다시 사용할 수 있어요.'},
  {title:'반사 신호의 방향 따라가기',text:'① 연습용 반사 신호를 눌러 목적지로 정하세요. ② ← →로 현재 방향을 목적지 방향에 맞추세요. ③ ↑로 접근해 보세요.',open(){DeogiTutorial.openSignal();},success:'신호 방향으로 접근했어요. 실제 탐사에서도 가까이 가면 정체를 발견하고 관측 장비를 사용할 수 있어요.'}
 ],
 setup(){
  const coach=document.createElement('aside');coach.id='tutorialCoach';coach.hidden=true;coach.setAttribute('aria-label','조작 튜토리얼');
  coach.innerHTML='<div class="tutorial-top"><span id="tutorialCount"></span><button id="tutorialExit" class="text-btn">건너뛰고 탐사하기</button></div><h2 id="tutorialTitle"></h2><p id="tutorialText"></p><p id="tutorialFeedback" role="status" aria-live="polite"></p><div class="tutorial-actions"><button id="tutorialStepSkip" class="ghost">이 단계 건너뛰기</button><button id="tutorialNext" class="primary">다음</button></div>';
  document.body.append(coach);$('tutorialExit').onclick=()=>this.finish('skipped');$('tutorialNext').onclick=()=>this.advance();$('tutorialStepSkip').onclick=()=>this.advance(true);
  new ResizeObserver(()=>document.body.style.setProperty('--tutorial-coach-height',Math.ceil(coach.getBoundingClientRect().height)+'px')).observe(coach);
  document.addEventListener('keydown',e=>{
   if(!this.active)return;
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();this.finish('skipped');return;}
   if(e.key.toLowerCase()==='c'&&this.index!==4){e.preventDefault();e.stopImmediatePropagation();return;}
   if(this.index===5&&['ArrowLeft','ArrowRight','ArrowUp'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();this.signalMove(e.key);}
  },true);
  const trackMeasurement=e=>{if(!this.active||this.index!==1)return;const id=e.target.id;if(['leftMarker','leftRange'].includes(id))this.measureTouched.add('left');if(['rightMarker','rightRange'].includes(id))this.measureTouched.add('right');};
  for(const type of ['pointerdown','input','keydown'])document.addEventListener(type,trackMeasurement);
  const originalHelp=help;
  help=()=>{originalHelp();const button=document.createElement('button');button.className='primary full';button.textContent='조작 튜토리얼 다시 시작';button.onclick=()=>this.start();$('modalBody').prepend(button);};
  $('helpBtn').onclick=help;
  // This separate practice course is launched only from Help.
 },
 closeTools(){CockpitUI.returnPanel=null;if($('drawer').open)$('drawer').close();if($('modal').open)$('modal').close();if($('calculator'))$('calculator').hidden=true;$('calculatorBtn').hidden=false;keys.clear();FlightView.speed=0;},
 start(){
  if(this.active)return;
  this.savedCalc={expression:Calculator.expression,answer:Calculator.answer};this.closeTools();this.active=true;this.index=-1;
  this.inertState=[...document.body.children].filter(el=>!['modal','tutorialCoach','calculator','toast'].includes(el.id)&&!['SCRIPT','LINK'].includes(el.tagName)).map(el=>[el,el.inert]);
  this.inertState.forEach(([el])=>el.inert=true);document.body.classList.add('tutorial-active');$('tutorialCoach').hidden=false;
  openModal('탐사 도구를 직접 써 보세요','<div class="tutorial-welcome"><span class="eyebrow">DEOGI · FIRST EXPLORATION</span><h3>작은 연습으로 시작하는 우주 탐사</h3><p>지구의 관측 도구로 연습한 뒤, 신호 방향을 따라가는 방법을 익혀요.</p><ol><li>관측 지점 찾기</li><li>지름 측정하기</li><li>추 달고 눈금 읽기</li><li>위성 스캔하기</li><li>계산기 사용하기</li><li>반사 신호 따라가기</li></ol><p>실제 탐사에서는 천체 가까이에 나타나는 <b>관측 장비</b> 버튼으로 도구를 열어요. 관측 대상은 목적지와 관계없이 지금 가까이에 있는 천체예요.</p></div>','조작 튜토리얼');
  $('tutorialCount').textContent='처음 오셨나요?';$('tutorialTitle').textContent='한 단계씩 해 볼까요?';$('tutorialText').textContent='도구를 직접 움직이며 익혀요. 이미 익숙하다면 바로 탐사를 시작해도 좋아요.';$('tutorialFeedback').textContent='나중에 ? 도움말에서 다시 시작할 수 있어요.';$('tutorialNext').textContent='연습 시작';$('tutorialNext').disabled=false;$('tutorialStepSkip').hidden=true;$('tutorialNext').focus();
  this.timer=setInterval(()=>this.check(),180);
 },
 advance(skip=false){
  if(!this.active||(this.index>=0&&!this.done&&!skip))return;
  if(this.index===this.steps.length-1){this.finish('completed');return;}
  this.closeTools();this.index++;this.done=false;this.measureTouched=new Set();const step=this.steps[this.index];
  Calculator.loadHistory();this.lastCalculation=Calculator.history.at(-1);
  $('tutorialCount').textContent=(this.index+1)+' / '+this.steps.length+' · 조작 연습';$('tutorialTitle').textContent=step.title;$('tutorialText').textContent=step.text;$('tutorialFeedback').textContent='직접 조작해 보세요.';$('tutorialNext').textContent=this.index===5?'탐사 시작':'다음';$('tutorialNext').disabled=true;$('tutorialStepSkip').hidden=false;
  step.open();$('modal').scrollTop=0;
 },
 check(){
  if(!this.active||this.index<0||this.done)return;
  let ok=false;
  if(this.index===0)ok=!!document.querySelector('#scopeStage .hotspot.done');
  if(this.index===1){const stage=$('measureStage');if(stage){const w=stage.clientWidth;ok=this.measureTouched.size===2&&w>0&&Math.abs(+$('leftRange').value*w/100-(w/2-90))<=7&&Math.abs(+$('rightRange').value*w/100-(w/2+90))<=7;}}
  if(this.index===2)ok=!!document.querySelector('#planetLoads [data-remove]');
  if(this.index===3)ok=!!document.querySelector('#moonResults .readout');
  if(this.index===4)ok=Calculator.history.at(-1)!==this.lastCalculation&&Calculator.history.length>0;
  if(this.index===5)ok=this.signal?.distance===0;
  if(ok){this.done=true;$('tutorialFeedback').textContent='✓ '+this.steps[this.index].success;$('tutorialNext').disabled=false;}
 },
 openSignal(){
  this.signal={selected:false,yaw:0,bearing:60,distance:3};
  openModal('반사 신호 추적 연습','<p>근처의 미확인 천체는 <b>반사 신호</b>로 나타날 수 있어요. 인공 탐사선은 <b>통신 신호</b>로 표시돼요. 버튼을 누르면 목적지로 정해지고, 직접 방향을 맞춰 이동해야 해요.</p><div class="tutorial-signal-stage"><span class="eyebrow">연습용 신호 · 실제 천체 위치와 무관</span><button id="tutorialSignal" class="ghost">◌ 연습용 반사 신호 · 60° · 목적지 선택</button><div class="tutorial-compass" role="img" aria-label="우주선 방향 연습"><span class="tutorial-signal-dot">✧</span><span id="tutorialShip">➤</span></div><div id="tutorialBearing" role="status"></div><div class="tutorial-steering"><button id="tutorialLeft" aria-label="연습 우주선 왼쪽 회전">←</button><button id="tutorialForward" aria-label="연습 우주선 앞으로 이동">↑</button><button id="tutorialRight" aria-label="연습 우주선 오른쪽 회전">→</button></div><p id="tutorialSignalHint" aria-live="polite">먼저 위의 반사 신호 버튼을 눌러 보세요.</p></div><p>항법 지도는 위치를 확인하는 화면이에요. 비행할 때는 <b>1인칭 조종석</b>으로 돌아오세요. 이동 중에는 목적지 방향이 달라질 수 있으니 다시 확인하세요.</p>','조작 연습');
  $('tutorialSignal').onclick=()=>{this.signal.selected=true;$('tutorialSignal').textContent='✓ 연습용 반사 신호 · 목적지 선택됨';this.renderSignal();};
  $('tutorialLeft').onclick=()=>this.signalMove('ArrowLeft');$('tutorialRight').onclick=()=>this.signalMove('ArrowRight');$('tutorialForward').onclick=()=>this.signalMove('ArrowUp');this.renderSignal();
 },
 signalMove(key){
  const s=this.signal;if(!s||s.distance===0)return;
  if(!s.selected){$('tutorialSignalHint').textContent='먼저 반사 신호 버튼을 눌러 목적지로 정하세요.';return;}
  if(key==='ArrowLeft')s.yaw=(s.yaw+345)%360;
  if(key==='ArrowRight')s.yaw=(s.yaw+15)%360;
  const aligned=Math.abs(((s.bearing-s.yaw+540)%360)-180)<=10;
  if(key==='ArrowUp'&&aligned)s.distance--;
  this.renderSignal();if(key==='ArrowUp'&&!aligned)$('tutorialSignalHint').textContent='아직 신호 방향과 달라요. ← →로 현재 방향을 60°에 맞춰 보세요.';
  this.check();
 },
 renderSignal(){const s=this.signal;$('tutorialShip').style.transform='rotate('+s.yaw+'deg)';$('tutorialBearing').textContent='현재 방향 '+s.yaw+'°'+(s.selected?' · 목적지 방향 60°':' · 목적지 미선택');if(s.selected)$('tutorialSignalHint').textContent=s.distance===0?'신호 위치에 도달했어요!':s.yaw===60?'방향이 맞았어요. ↑를 '+s.distance+'번 눌러 접근하세요.':'← →로 현재 방향을 목적지 방향에 맞춰 보세요.';document.querySelector('.tutorial-signal-dot').style.scale=String(1+(3-s.distance)*.3);},
 finish(status){
  if(!this.active)return;clearInterval(this.timer);this.active=false;this.closeTools();
  Object.assign(Calculator,this.savedCalc);this.inertState.forEach(([el,value])=>el.inert=value);document.body.classList.remove('tutorial-active');$('tutorialCoach').hidden=true;
  try{localStorage.setItem(this.key,status);}catch{}
  $('space').focus();toast('탐사를 시작해 보세요. 조작 연습은 ? 도움말에서 다시 열 수 있어요.');
 }
};
DeogiTutorial.setup();
