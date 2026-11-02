'use strict';
// First visit: coach real game actions. Never teleport, steer, or grant discoveries.
const FirstExpedition={
 key:'deogi-first-expedition-v1',active:false,index:-1,done:false,highlighted:null,
 steps:[
  {id:'observe',title:'지구를 관측해 보세요',tool:'observe',text:'지구 관측 장비 → 관측 망원경을 열어요. 사진을 마우스나 손가락으로 탐색하고, 나타난 번호를 눌러 보세요.',success:'지구의 관측 자료를 찾았어요. 읽은 내용을 기록하고 다음 도구를 사용해 보세요.'},
  {id:'measure',title:'지구의 지름을 재 보세요',tool:'measure',text:'지름 측정기를 열고 양쪽 눈금선을 지구 본체의 가장자리에 맞추세요. 아래 슬라이더나 눈금선의 ← → 키도 쓸 수 있어요.',success:'지구의 양 끝을 맞췄어요. 만 km 단위의 측정값을 기록해 다른 행성과 비교해 보세요.'},
  {id:'gravity',title:'지구에서 추를 달아 보세요',tool:'gravity',text:'용수철저울에서 추를 고르고 ‘지구 저울에 추 달기’를 누르세요. 추를 저울로 끌어 놓아도 돼요.',success:'추를 달았어요. 추의 총질량과 N 눈금을 기록하세요. 다른 행성에서도 같은 질량의 추로 비교해요.'},
  {id:'moons',title:'지구의 위성을 찾아보세요',tool:'moons',text:'위성 탐지기를 열고 ‘위성계 스캔 시작’을 누르세요. 잠시 후 위성 수와 대표 위성 자료가 나타나요.',success:'지구의 위성 자료를 확인했어요. 사진과 특징을 살펴본 뒤 다음으로 가세요.'},
  {id:'mass',title:'지구의 질량을 확인하세요',tool:'profile',text:'지구 관측 장비 → 천체 자료를 열고 질량과 단위를 확인하세요. 천체 전체의 질량은 연구 자료로 알아봐요. 용수철저울로 읽는 힘(N)과 구별해 보세요.',success:'지구 질량을 찾았어요. 숫자와 억 조 톤 단위를 함께 기록하세요. 다른 천체도 같은 단위이므로 숫자끼리 나누어 비교할 수 있어요.'},
  {id:'calculator',title:'계산기를 꺼내 보세요',text:'화면의 계산기 버튼 또는 C 키로 계산기를 여세요. 간단한 식을 입력하고 = 또는 Enter를 눌러 보세요. 예: 12 ÷ 3.',success:'계산식과 결과가 계산 기록에 남았어요. 실제 측정값을 비교할 때도 활용할 수 있어요.'},
  {id:'probe-launch',title:'지구에 탐사정을 보내세요',text:'창을 닫고 조종석의 ‘지구 · 탐사정 보내기’를 누르세요. 접근이 끝나면 ↑로 조금 움직이고 ← → 또는 화면 드래그로 둘러보세요.',success:'탐사정을 움직였어요. 이제 눈앞의 관찰 지점을 찾아보세요.'},
  {id:'probe-site',title:'눈앞의 관찰 지점을 찾으세요',text:'◇ 관찰 표시를 찾아 눌러 보세요. ← →로 회전하거나 화면을 드래그하면 다른 지점도 찾을 수 있어요. 직접 보는 관찰에는 스캔이 필요 없어요.',success:'관찰한 지점에 ✓가 생겼어요. 다른 지점도 자유롭게 살펴보고 다음으로 가세요.'},
  {id:'probe-surface',title:'땅과 물을 살펴보세요',text:'‘주변 관찰’을 눌러 탐사정이 닿은 곳을 확인하세요. 바퀴가 닿는 땅이 있는지, 주변에는 무엇이 보이는지 살펴보세요.',success:'표면 상태를 확인했어요. 다른 행성에서도 탐사정을 보내 같은 방법으로 비교해 보세요.'},
  {id:'probe-air',title:'대기를 스캔해 보세요',text:'‘대기 스캔’을 누르고 잠시 기다리면 주요 성분이 나와요. 이미 스캔했다면 관찰 기록 → 대기 · 스캔 결과에서 다시 볼 수 있어요.',success:'대기 자료를 확인했어요. 직접 본 모습과 스캔 자료를 함께 기록해 보세요.'},
  {id:'probe-records',title:'관찰 기록을 다시 열어 보세요',text:'‘관찰 기록’을 눌러 방금 살펴본 내용이 남아 있는지 확인하세요. 목록을 누르면 다시 볼 수 있고, 완료한 대기 스캔을 반복할 필요도 없어요.',success:'관찰한 내용을 다시 찾았어요. 이제 우주선으로 돌아가요.'},
  {id:'probe-return',title:'우주선으로 복귀하세요',text:'화면 위의 ‘우주선으로 복귀’를 누르세요. 탐사정을 보내기 전의 우주선 위치로 돌아와요.',success:'조종석으로 돌아왔어요. 다음은 지구 곁의 미확인 통신 신호를 찾아볼 차례예요.'},
  {id:'signal',title:'지구 곁의 미확인 신호',text:'창을 닫고 조종석으로 돌아와, 테두리가 빛나는 미확인 통신 신호 버튼을 누르세요. 주변의 인공 천체가 보내는 신호예요.',success:'실제 신호를 목적지로 정했어요. 시선은 자동으로 바뀌지 않아요. 이제 직접 찾아가 보세요.'},
  {id:'flight',title:'신호 방향으로 직접 비행하세요',text:'← →로 현재 방향을 목적지 방향에 맞춘 뒤 ↑를 눌러 접근하세요. 화면의 화살표 버튼도 사용할 수 있어요. 손을 떼면 천천히 감속해요.',success:'허블 우주망원경을 발견했어요! 이제 가까이 있는 허블의 관측 장비를 열어 보세요.'},
  {id:'hubble',title:'허블을 직접 관찰해 보세요',tool:'observe',text:'허블 우주망원경 관측 장비 → 관측 망원경을 열어요. 사진 위에서 번호를 찾아 눌러 보세요.',success:'허블의 관측 자료를 확인했어요. 이제 항법지도로 다음에 탐사할 행성을 정해 보세요.'},
  {id:'map',title:'항법지도를 열어 보세요',text:'항법 지도 버튼 또는 M 키를 눌러 태양계의 위치를 살펴보세요. 지도에서는 비행이 멈춰요.',success:'항법지도를 열었어요. 다음에는 지도에서 행성을 직접 눌러 목적지를 정해요.'},
  {id:'destination',title:'다음 행성으로 경로를 정하세요',text:'지도 위에서 지구 이외의 행성 점이나 이름을 눌러 보세요. 점이 겹치면 나타나는 목록에서 골라요. 휠 또는 ＋·−로 확대·축소하고, 드래그로 지도를 옮길 수 있어요.',success:'새 목적지를 정했어요. 지도에 나타난 항로와 목적지 이름을 확인하세요. 우주선은 아직 이동하지 않았어요.'},
  {id:'cockpit',title:'1인칭 조종석으로 돌아오세요',text:'1인칭 조종석 버튼을 누르세요. 목적지 방향을 확인하고 직접 회전·추진해서 다음 행성으로 출발해요.',success:'탐사 준비가 됐어요! 다른 행성에서도 질량·지름·중력을 확인하고 탐사정으로 주변을 살펴보세요. 목적지와 현재 관측 대상은 다를 수 있어요.'}
 ],
 stepId(){return this.steps[this.index]?.id;},
 setup(){
  const panel=document.createElement('aside');panel.id='firstCoach';panel.hidden=true;panel.setAttribute('aria-label','첫 탐사 안내');
  panel.innerHTML='<div class="tutorial-top"><span id="firstCount"></span><button class="text-btn" id="firstExit">안내 건너뛰기</button></div><h2 id="firstTitle"></h2><p id="firstText"></p><p id="firstHint" role="status" aria-live="polite"></p><p id="firstBearing"></p><div class="tutorial-actions"><button id="firstStepSkip" class="ghost">이 단계 건너뛰기</button><button id="firstNext" class="primary">지구 탐사 시작</button></div>';
  document.body.append(panel);$('firstExit').onclick=()=>this.finish('skipped');$('firstStepSkip').onclick=()=>this.advance(true);$('firstNext').onclick=()=>this.advance();
  new ResizeObserver(()=>document.body.style.setProperty('--first-coach-height',Math.ceil(panel.getBoundingClientRect().height)+'px')).observe(panel);
  const track=e=>{if(!this.active||this.stepId()!=='measure')return;if(['leftMarker','leftRange'].includes(e.target.id))this.touched.add('left');if(['rightMarker','rightRange'].includes(e.target.id))this.touched.add('right');};
  for(const type of ['pointerdown','input','keydown'])document.addEventListener(type,track);
  // Keep the actual Hubble signal discoverable among nearby signals during this journey.
  const selectOnMap=MapInput.select;
  MapInput.select=function(...args){const result=selectOnMap.apply(this,args),guide=FirstExpedition;if(guide.active&&guide.stepId()==='destination'&&FlightView.mode==='map'){const accept=()=>{const p=current();if(PLANETS.includes(p)&&p!==PLANETS[2])guide.mapChoice=p;};const menu=$('mapPicker');if(menu)menu.addEventListener('click',accept);else if(this.candidates(...args).length===1)accept();}return result;};
  const updateSignals=EncounterUI.update;
  EncounterUI.update=function(){updateSignals.call(this);if(!FirstExpedition.active||!['signal','flight'].includes(FirstExpedition.stepId()))return;if(current()===HUBBLE){this.signal=null;$('signalBtn').hidden=true;return;}if(FlightView.mode!=='cockpit'||FlightView.distance(HUBBLE)>=HUBBLE.signalRange)return;this.signal=HUBBLE;const button=$('signalBtn');button.hidden=false;button.textContent='◌ '+(record(HUBBLE.id).visited?HUBBLE.name:'미확인 통신 신호')+' · '+bearing(HUBBLE)+'° · 목적지 선택';};
  const manual=help;help=()=>{if(this.active)this.finish('skipped');manual();const button=document.createElement('button');button.className='ghost full';button.textContent='지구 첫 탐사 안내 다시 시작 · 질량·탐사정·항법지도';button.onclick=()=>{this.closePanels();this.start();};$('modalBody').prepend(button);};$('helpBtn').onclick=help;
  let seen=false;try{seen=['completed','skipped'].includes(localStorage.getItem(this.key));}catch{}
  if(!seen)this.start();
 },
 start(){
  if(this.active)return;this.active=true;this.index=-1;this.done=false;this.mapChoice=null;this.touched=new Set();document.body.classList.add('first-guide');$('firstCoach').hidden=false;
  $('firstCount').textContent='첫 탐사 · 지구에서 출발';$('firstTitle').textContent='지구부터 함께 탐사해 볼까요?';$('firstText').textContent='지구를 관측·측정하고 탐사정으로 주변을 살펴봐요. 지구 곁의 신호를 찾은 뒤, 항법지도로 다음 행성을 정해요.';$('firstHint').textContent='실제 조종석과 관측 장비를 사용해요. 익숙하다면 안내를 건너뛰어도 좋아요.';$('firstStepSkip').hidden=true;$('firstNext').textContent='지구 탐사 시작';$('firstNext').disabled=false;
  $('firstBearing').textContent='';this.update();this.timer=setInterval(()=>this.update(),160);
 },
 closePanels(){CockpitUI.returnPanel=null;if($('modal').open)$('modal').close();CockpitUI.closePanel(false);if($('calculator')&&!$('calculator').hidden)Calculator.close();},
 advance(skip=false){
  if(!this.active||(this.index>=0&&!this.done&&!skip))return;
  if(this.index===this.steps.length-1){this.finish(skip&&!this.done?'skipped':'completed');return;}
  // Closing an instrument returns to its real equipment drawer, as in normal exploration.
  const next=this.steps[this.index+1];
  if(PlanetDescent.active){if(next.id.startsWith('probe-'))PlanetDescent.closeNote();else PlanetDescent.leave();}
  if(this.steps[this.index]?.tool&&next.tool){if($('modal').open)$('modal').close();}else this.closePanels();
  this.index++;this.done=false;this.probeOrigin=null;this.touched=new Set();Calculator.loadHistory();this.lastCalculation=Calculator.history.at(-1);
  const step=this.steps[this.index];$('firstCount').textContent=(this.index+1)+' / '+this.steps.length+' · 첫 탐사';$('firstTitle').textContent=step.title;$('firstText').textContent=step.text;$('firstNext').textContent=this.index===this.steps.length-1?'자유 탐사 시작':'다음';$('firstNext').disabled=true;$('firstStepSkip').hidden=false;$('firstBearing').textContent='';this.update();
 },
 highlight(selector){const el=selector?document.querySelector(selector):null;if(this.highlighted===el)return;this.highlighted?.classList.remove('first-highlight');this.highlighted=el;el?.classList.add('first-highlight');},
 hint(text){if($('firstHint').textContent!==text)$('firstHint').textContent=text;},
 toolOpen(tool,body){const selectors={observe:'#scopeStage',measure:'#measureStage',gravity:'#planetStation',moons:'#scanBtn',profile:'.mass-reading'};return $('modal').open&&$('modalTitle').textContent.startsWith(body.name+' ·')&&!!document.querySelector(selectors[tool]);},
 guideTool(step,body){
  if($('modal').open){this.highlight('#closeModal');return '현재 창의 ×를 눌러 닫고 '+(step.tool==='observe'?'관측 망원경':EQUIPMENT.find(e=>e.id===step.tool)?.name)+'을 선택하세요.';}
  if($('drawer').open){if(!$('labPanel').hidden&&observationBody===body){this.highlight('[data-tool="'+step.tool+'"]');return '테두리가 빛나는 도구를 눌러 보세요.';}this.highlight('#closeDrawer');return '패널을 닫고 '+body.name+' 관측 장비를 열어 주세요.';}
  if(observationBody===body){this.highlight('#observeBtn');return body.name+' 관측 장비 버튼을 눌러 보세요.';}
  this.highlight('#destinationsBtn');return body.name+'의 관측 구역으로 돌아오세요. 목적지와 현재 관측 대상은 서로 다를 수 있어요.';
 },
 update(){
  if(!this.active)return;
  const coach=$('firstCoach'),host=PlanetDescent.active?$('descent'):document.body;if(coach.parentElement!==host)host.append(coach);document.body.classList.toggle('first-probe',PlanetDescent.active);document.body.classList.toggle('first-launch',this.stepId()?.startsWith('probe-')&&!PlanetDescent.active);document.body.classList.toggle('first-map',['map','destination'].includes(this.stepId()));
  const calcOpen=!!$('calculator')&&!$('calculator').hidden;
  document.body.classList.toggle('first-tools',$('modal').open||$('drawer').open||calcOpen);
  document.body.classList.toggle('first-flying',this.stepId()==='flight');
  if(this.index<0)return;
  const step=this.steps[this.index],body=this.stepId()==='hubble'?HUBBLE:PLANETS[2];let ok=false,hint='';
  if(step.tool){
   if(!this.toolOpen(step.tool,body)){hint=this.guideTool(step,body);}
   else{
    this.highlight(null);
    if(this.stepId()==='observe'||this.stepId()==='hubble'){ok=!!document.querySelector('#scopeStage .hotspot.done');hint='사진 위를 천천히 탐색해서 번호를 눌러 보세요.';}
    if(this.stepId()==='measure'){const w=$('measureStage').clientWidth;ok=this.touched.size===2&&Math.abs(+$('leftRange').value*w/100-(w/2-90))<=7&&Math.abs(+$('rightRange').value*w/100-(w/2+90))<=7;hint='양쪽 눈금을 모두 움직여 본체의 양 끝에 맞춰 보세요.';}
    if(this.stepId()==='gravity'){ok=!!document.querySelector('#planetLoads [data-remove]');hint='추를 고르고 저울에 달아 보세요. 눈금 단위는 N이에요.';}
    if(this.stepId()==='mass'){ok=!!document.querySelector('.mass-reading');hint='질량의 숫자와 단위를 확인하세요.';this.highlight('.mass-reading');}
    if(this.stepId()==='moons'){ok=!!document.querySelector('#moonResults .readout');hint='스캔을 누르고 위성 자료를 확인하세요.';this.highlight('#scanBtn');}
   }
  }
  if(this.stepId()==='calculator'){this.highlight(calcOpen?'#calcInput':'#calculatorBtn');ok=Calculator.history.at(-1)!==this.lastCalculation&&Calculator.history.length>0;hint=calcOpen?'식을 입력하고 = 또는 Enter를 누르세요.':'화면의 계산기 버튼을 눌러 보세요.';}
  if(step.id.startsWith('probe-')){({ok,hint}=this.guideProbe(step));}
  if(['map','destination','cockpit'].includes(step.id)){({ok,hint}=this.guideMap(step));}
  if(this.stepId()==='signal'){
   ok=current()===HUBBLE;
   if($('modal').open||$('drawer').open||calcOpen){this.highlight($('modal').open?'#closeModal':$('drawer').open?'#closeDrawer':'#calcClose');hint='창을 닫고 조종석의 신호 버튼을 확인하세요.';}
   else if(FlightView.mode==='map'){this.highlight('#cockpitView');hint='1인칭 조종석으로 돌아오면 신호 버튼이 보여요.';}
   else if(FlightView.distance(HUBBLE)<HUBBLE.signalRange){this.highlight('#signalBtn');hint='지구 곁의 통신 신호를 목적지로 정해 보세요. 알려진 대상이면 이름이 표시돼요.';}
   else{this.highlight('#destinationsBtn');hint='지구 근처로 돌아오면 통신 신호를 다시 찾을 수 있어요.';}
  }
  if(this.stepId()==='flight'){
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
 guideProbe(step){
  const probe=PlanetDescent;
  if(!probe.active){
   if(step.id==='probe-return'){this.highlight(null);return {ok:true,hint:''};}
   if($('modal').open||$('drawer').open){this.highlight($('modal').open?'#closeModal':'#closeDrawer');return {ok:false,hint:'창을 닫고 조종석의 탐사정 보내기를 누르세요.'};}
   if(FlightView.mode==='map'){this.highlight('#cockpitView');return {ok:false,hint:'1인칭 조종석으로 돌아오세요.'};}
   this.highlight(observationBody===PLANETS[2]?'#descentLaunch':'#destinationsBtn');return {ok:false,hint:observationBody===PLANETS[2]?'지구 · 탐사정 보내기를 누르세요.':'지구 가까이에서 탐사정을 보내세요.'};
  }
  if(probe.body!==PLANETS[2]){this.highlight('#descentReturn');return {ok:false,hint:'우주선으로 복귀한 뒤 지구에서 탐사정을 보내세요.'};}
  if(probe.phase<1){this.highlight(null);return {ok:false,hint:'탐사정이 접근 중이에요. 잠시 기다리세요.'};}
  let ok=false,hint='';
  if(step.id==='probe-launch'){
   this.probeOrigin||={x:probe.x,z:probe.z,yaw:probe.yaw};const origin=this.probeOrigin;
   ok=Math.hypot(probe.x-origin.x,probe.z-origin.z)>.3||Math.abs(probe.yaw-origin.yaw)>.08;
   this.highlight('[data-probe="ArrowUp"]');hint='↑로 조금 이동하거나 ← →로 둘러보세요.';
  }
  if(step.id==='probe-site'){ok=probe.noteMode==='site'&&!$('descentNote').hidden;this.highlight(null);hint='화면을 둘러보며 ◇ 관찰 표시를 누르세요. 이미 본 지점을 다시 눌러도 좋아요.';}
  if(step.id==='probe-surface'){ok=probe.noteMode==='visual'&&!$('descentNote').hidden;this.highlight('#descentObserve');hint='주변 관찰을 눌러 지표 모습을 살펴보세요.';}
  if(step.id==='probe-air'){ok=probe.localScanned&&!$('descentNote').hidden&&$('descentNoteTitle').textContent===probe.body.name+' · 대기 스캔 결과';this.highlight(probe.localScanned?(probe.noteMode==='records'?'[data-record="local"]':'#descentRecords'):'#descentSurface');hint=probe.localScanned?'관찰 기록에서 대기 · 스캔 결과를 열어 보세요.':probe.scan?'대기 성분을 분석하는 동안 잠시 기다리세요.':'대기 스캔을 눌러 보세요.';}
  if(step.id==='probe-records'){ok=probe.noteMode==='records'&&!$('descentNote').hidden;this.highlight('#descentRecords');hint='관찰 기록 버튼을 누르세요.';}
  if(step.id==='probe-return'){this.highlight('#descentReturn');hint='우주선으로 복귀 버튼을 누르세요.';}
  return {ok,hint};
 },
 guideMap(step){
  if($('modal').open||$('drawer').open){this.highlight($('modal').open?'#closeModal':'#closeDrawer');return {ok:false,hint:'열려 있는 창을 닫고 지도를 살펴보세요.'};}
  if(step.id==='map'){this.highlight('#mapView');return {ok:FlightView.mode==='map',hint:'항법 지도 버튼을 누르세요.'};}
  if(step.id==='destination'){
   if(FlightView.mode!=='map'){this.highlight('#mapView');return {ok:false,hint:'항법지도를 열어 목적지를 정하세요.'};}
   this.highlight(null);return {ok:!!this.mapChoice&&current()===this.mapChoice,hint:'지도에서 지구 이외의 행성 점 또는 이름을 누르세요. 겹친 점은 확대하거나 선택 목록을 이용하세요.'};
  }
  this.highlight('#cockpitView');return {ok:FlightView.mode==='cockpit',hint:'1인칭 조종석 버튼을 눌러 직접 비행할 화면으로 돌아오세요.'};
 },
 finish(status){
  if(!this.active)return;this.active=false;clearInterval(this.timer);this.highlight(null);$('firstCoach').hidden=true;document.body.append($('firstCoach'));document.body.classList.remove('first-guide','first-tools','first-flying','first-probe','first-map','first-launch');
  try{localStorage.setItem(this.key,status);}catch{}
  if(status==='completed'){this.closePanels();toast('첫 탐사 완료 · 목적지 방향을 확인하고 다음 행성으로 출발해 보세요.');}
 }
};
FirstExpedition.setup();
