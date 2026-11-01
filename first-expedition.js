'use strict';
// First visit: coach real game actions. Never teleport, steer, or grant discoveries.
const FirstExpedition={
 key:'deogi-first-expedition-v1',active:false,index:-1,done:false,highlighted:null,
 steps:[
  {title:'지구를 관측해 보세요',tool:'observe',text:'지구 관측 장비 → 관측 망원경을 열어요. 사진을 마우스나 손가락으로 탐색하고, 나타난 번호를 눌러 보세요.',success:'지구의 관측 자료를 찾았어요. 읽은 내용을 기록하고 다음 도구를 사용해 보세요.'},
  {title:'지구의 지름을 재 보세요',tool:'measure',text:'지름 측정기를 열고 양쪽 눈금선을 지구 본체의 가장자리에 맞추세요. 아래 슬라이더나 눈금선의 ← → 키도 쓸 수 있어요.',success:'지구의 양 끝을 맞췄어요. 만 km 단위의 측정값을 기록해 다른 행성과 비교해 보세요.'},
  {title:'지구에서 추를 달아 보세요',tool:'gravity',text:'용수철저울에서 추를 고르고 ‘지구 저울에 추 달기’를 누르세요. 추를 저울로 끌어 놓아도 돼요.',success:'추를 달았어요. 추의 총질량과 N 눈금을 기록하세요. 다른 행성에서도 같은 질량의 추로 비교해요.'},
  {title:'지구의 위성을 찾아보세요',tool:'moons',text:'위성 탐지기를 열고 ‘위성계 스캔 시작’을 누르세요. 잠시 후 위성 수와 대표 위성 자료가 나타나요.',success:'지구의 위성 자료를 확인했어요. 사진과 특징을 살펴본 뒤 다음으로 가세요.'},
  {title:'계산기를 꺼내 보세요',text:'화면의 계산기 버튼 또는 C 키로 계산기를 여세요. 간단한 식을 입력하고 = 또는 Enter를 눌러 보세요. 예: 12 ÷ 3.',success:'계산식과 결과가 계산 기록에 남았어요. 실제 측정값을 비교할 때도 활용할 수 있어요.'},
  {title:'지구 곁의 미확인 신호',text:'창을 닫고 조종석으로 돌아와, 테두리가 빛나는 미확인 통신 신호 버튼을 누르세요. 주변의 인공 천체가 보내는 신호예요.',success:'실제 신호를 목적지로 정했어요. 시선은 자동으로 바뀌지 않아요. 이제 직접 찾아가 보세요.'},
  {title:'신호 방향으로 직접 비행하세요',text:'← →로 현재 방향을 목적지 방향에 맞춘 뒤 ↑를 눌러 접근하세요. 화면의 화살표 버튼도 사용할 수 있어요. 손을 떼면 천천히 감속해요.',success:'허블 우주망원경을 발견했어요! 이제 가까이 있는 허블의 관측 장비를 열어 보세요.'},
  {title:'허블을 직접 관찰해 보세요',tool:'observe',text:'허블 우주망원경 관측 장비 → 관측 망원경을 열어요. 사진 위에서 번호를 찾아 눌러 보세요.',success:'첫 탐사를 마쳤어요. 발견 기록에서 지구와 허블을 다시 확인할 수 있어요. 이제 다른 천체를 자유롭게 탐사해 보세요.'}
 ],
 setup(){
  const panel=document.createElement('aside');panel.id='firstCoach';panel.hidden=true;panel.setAttribute('aria-label','첫 탐사 안내');
  panel.innerHTML='<div class="tutorial-top"><span id="firstCount"></span><button class="text-btn" id="firstExit">안내 건너뛰기</button></div><h2 id="firstTitle"></h2><p id="firstText"></p><p id="firstHint" role="status" aria-live="polite"></p><p id="firstBearing"></p><div class="tutorial-actions"><button id="firstStepSkip" class="ghost">이 단계 건너뛰기</button><button id="firstNext" class="primary">지구 탐사 시작</button></div>';
  document.body.append(panel);$('firstExit').onclick=()=>this.finish('skipped');$('firstStepSkip').onclick=()=>this.advance(true);$('firstNext').onclick=()=>this.advance();
  new ResizeObserver(()=>document.body.style.setProperty('--first-coach-height',Math.ceil(panel.getBoundingClientRect().height)+'px')).observe(panel);
  const track=e=>{if(!this.active||this.index!==1)return;if(['leftMarker','leftRange'].includes(e.target.id))this.touched.add('left');if(['rightMarker','rightRange'].includes(e.target.id))this.touched.add('right');};
  for(const type of ['pointerdown','input','keydown'])document.addEventListener(type,track);
  // Keep the actual Hubble signal discoverable among nearby signals during this journey.
  const updateSignals=EncounterUI.update;
  EncounterUI.update=function(){updateSignals.call(this);if(!FirstExpedition.active||FirstExpedition.index<5||FirstExpedition.index>6)return;if(current()===HUBBLE){this.signal=null;$('signalBtn').hidden=true;return;}if(FlightView.mode!=='cockpit'||FlightView.distance(HUBBLE)>=HUBBLE.signalRange)return;this.signal=HUBBLE;const button=$('signalBtn');button.hidden=false;button.textContent='◌ '+(record(HUBBLE.id).visited?HUBBLE.name:'미확인 통신 신호')+' · '+bearing(HUBBLE)+'° · 목적지 선택';};
  const manual=help;help=()=>{if(this.active)this.finish('skipped');manual();};$('helpBtn').onclick=help;
  let seen=false;try{seen=['completed','skipped'].includes(localStorage.getItem(this.key));}catch{}
  if(!seen)this.start();
 },
 start(){
  this.active=true;this.index=-1;this.done=false;this.touched=new Set();document.body.classList.add('first-guide');$('firstCoach').hidden=false;
  $('firstCount').textContent='첫 탐사 · 지구에서 출발';$('firstTitle').textContent='지구부터 함께 탐사해 볼까요?';$('firstText').textContent='지금 보이는 지구를 직접 관측하고 측정해요. 그다음 지구 곁의 미확인 신호를 따라 새로운 대상을 찾아가요.';$('firstHint').textContent='실제 조종석과 관측 장비를 사용해요. 익숙하다면 안내를 건너뛰어도 좋아요.';$('firstStepSkip').hidden=true;$('firstNext').disabled=false;
  this.timer=setInterval(()=>this.update(),160);
 },
 closePanels(){CockpitUI.returnPanel=null;if($('modal').open)$('modal').close();CockpitUI.closePanel(false);if($('calculator')&&!$('calculator').hidden)Calculator.close();},
 advance(skip=false){
  if(!this.active||(this.index>=0&&!this.done&&!skip))return;
  if(this.index===7){this.finish(skip&&!this.done?'skipped':'completed');return;}
  // Closing an instrument returns to its real equipment drawer, as in normal exploration.
  if(this.index>=0&&this.index<3&&$('modal').open)$('modal').close();
  if(this.index>=3)this.closePanels();
  this.index++;this.done=false;this.touched=new Set();Calculator.loadHistory();this.lastCalculation=Calculator.history.at(-1);
  const step=this.steps[this.index];$('firstCount').textContent=(this.index+1)+' / '+this.steps.length+' · 첫 탐사';$('firstTitle').textContent=step.title;$('firstText').textContent=step.text;$('firstNext').textContent=this.index===7?'자유 탐사 시작':'다음';$('firstNext').disabled=true;$('firstStepSkip').hidden=false;$('firstBearing').textContent='';this.update();
 },
 highlight(selector){const el=selector?document.querySelector(selector):null;if(this.highlighted===el)return;this.highlighted?.classList.remove('first-highlight');this.highlighted=el;el?.classList.add('first-highlight');},
 hint(text){if($('firstHint').textContent!==text)$('firstHint').textContent=text;},
 toolOpen(tool,body){const selectors={observe:'#scopeStage',measure:'#measureStage',gravity:'#planetStation',moons:'#scanBtn'};return $('modal').open&&$('modalTitle').textContent.startsWith(body.name+' ·')&&!!document.querySelector(selectors[tool]);},
 guideTool(step,body){
  if($('modal').open){this.highlight('#closeModal');return '현재 창의 ×를 눌러 닫고 '+(step.tool==='observe'?'관측 망원경':EQUIPMENT.find(e=>e.id===step.tool)?.name)+'을 선택하세요.';}
  if($('drawer').open){if(!$('labPanel').hidden&&observationBody===body){this.highlight('[data-tool="'+step.tool+'"]');return '테두리가 빛나는 도구를 눌러 보세요.';}this.highlight('#closeDrawer');return '패널을 닫고 '+body.name+' 관측 장비를 열어 주세요.';}
  if(observationBody===body){this.highlight('#observeBtn');return body.name+' 관측 장비 버튼을 눌러 보세요.';}
  this.highlight('#destinationsBtn');return body.name+'의 관측 구역으로 돌아오세요. 목적지와 현재 관측 대상은 서로 다를 수 있어요.';
 },
 update(){
  if(!this.active)return;
  const calcOpen=!!$('calculator')&&!$('calculator').hidden;
  document.body.classList.toggle('first-tools',$('modal').open||$('drawer').open||calcOpen);
  document.body.classList.toggle('first-flying',this.index===6);
  if(this.index<0)return;
  const step=this.steps[this.index],body=this.index===7?HUBBLE:PLANETS[2];let ok=false,hint='';
  if(step.tool){
   if(!this.toolOpen(step.tool,body)){hint=this.guideTool(step,body);}
   else{
    this.highlight(null);
    if(this.index===0||this.index===7){ok=!!document.querySelector('#scopeStage .hotspot.done');hint='사진 위를 천천히 탐색해서 번호를 눌러 보세요.';}
    if(this.index===1){const w=$('measureStage').clientWidth;ok=this.touched.size===2&&Math.abs(+$('leftRange').value*w/100-(w/2-90))<=7&&Math.abs(+$('rightRange').value*w/100-(w/2+90))<=7;hint='양쪽 눈금을 모두 움직여 본체의 양 끝에 맞춰 보세요.';}
    if(this.index===2){ok=!!document.querySelector('#planetLoads [data-remove]');hint='추를 고르고 저울에 달아 보세요. 눈금 단위는 N이에요.';}
    if(this.index===3){ok=!!document.querySelector('#moonResults .readout');hint='스캔을 누르고 위성 자료를 확인하세요.';this.highlight('#scanBtn');}
   }
  }
  if(this.index===4){this.highlight(calcOpen?'#calcInput':'#calculatorBtn');ok=Calculator.history.at(-1)!==this.lastCalculation&&Calculator.history.length>0;hint=calcOpen?'식을 입력하고 = 또는 Enter를 누르세요.':'화면의 계산기 버튼을 눌러 보세요.';}
  if(this.index===5){
   ok=current()===HUBBLE;
   if($('modal').open||$('drawer').open||calcOpen){this.highlight($('modal').open?'#closeModal':$('drawer').open?'#closeDrawer':'#calcClose');hint='창을 닫고 조종석의 신호 버튼을 확인하세요.';}
   else if(FlightView.mode==='map'){this.highlight('#cockpitView');hint='1인칭 조종석으로 돌아오면 신호 버튼이 보여요.';}
   else if(FlightView.distance(HUBBLE)<HUBBLE.signalRange){this.highlight('#signalBtn');hint='지구 곁의 통신 신호를 목적지로 정해 보세요. 알려진 대상이면 이름이 표시돼요.';}
   else{this.highlight('#destinationsBtn');hint='지구 근처로 돌아오면 통신 신호를 다시 찾을 수 있어요.';}
  }
  if(this.index===6){
   ok=observationBody===HUBBLE&&!!record(HUBBLE.id).visited;
   if(current()!==HUBBLE){this.highlight('#signalBtn');hint='지구 곁의 통신 신호를 목적지로 다시 선택하세요.';}
   else if(FlightView.mode==='map'){this.highlight('#cockpitView');hint='1인칭 조종석 버튼을 눌러 비행 화면으로 돌아오세요.';}
   else if($('modal').open||$('drawer').open||calcOpen){this.highlight($('modal').open?'#closeModal':$('drawer').open?'#closeDrawer':'#calcClose');hint='열려 있는 창을 닫고 직접 비행해 보세요.';}
   else{const delta=FlightView.wrap(Math.atan2(HUBBLE.y-ship.y,HUBBLE.x-ship.x)-FlightView.yaw);this.highlight(Math.abs(delta)<.1?'[data-dir="up"]':delta>0?'[data-dir="right"]':'[data-dir="left"]');hint=Math.abs(delta)<.1?'방향이 맞아요. ↑를 짧게 눌러 접근하고, 이동하며 방향을 다시 확인하세요.':(delta>0?'→':'←')+'로 회전해서 현재 방향을 목적지 방향과 비슷하게 맞추세요.';}
   $('firstBearing').textContent='현재 '+headingDegrees(FlightView.yaw)+'° · 목적지 '+bearing(HUBBLE)+'° · 남은 거리 '+FlightView.distance(HUBBLE).toFixed(3)+' AU';
  }
  if(ok)this.done=true;
  if(this.done){this.hint('✓ '+step.success);$('firstNext').disabled=false;this.highlight(null);}else this.hint(hint);
 },
 finish(status){
  if(!this.active)return;this.active=false;clearInterval(this.timer);this.highlight(null);$('firstCoach').hidden=true;document.body.classList.remove('first-guide','first-tools','first-flying');
  try{localStorage.setItem(this.key,status);}catch{}
  if(status==='completed'){this.closePanels();toast('첫 탐사 완료 · 발견 기록에서 지구와 허블을 확인하세요.');}
 }
};
FirstExpedition.setup();
