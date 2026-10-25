'use strict';
// Optional navigation records, separate from telescope observations and targets.
const RouteArchive={
 key:'deogi-route-archive-v1',unlocked:new Set(),
 entries:[
  {id:'outer-ice',origin:'pluto',title:'또 하나의 얼음 세계',
   text:'명왕성과 비슷한 작은 얼음 천체가 다른 방향에도 있어요. 함선의 위치 자료에는 태양에서 약 68 AU 떨어진 곳으로 표시되어 있어요.',
   target:()=>ERIS},
  {id:'earth-voices',origin:'neptune',title:'지구의 목소리를 실은 항해',
   text:'행성들 너머로 여행을 계속하는 오래된 탐사선이 있어요. 여러 언어의 인사와 지구의 소리를 담은 금빛 원반을 싣고 떠났지요. 함선에 보관된 항로를 따라가 볼까요?',
   tip:'가까워지면 인사음을 켜고 귀 기울여 보세요.',target:()=>VOYAGER}
 ],
 observed(p){const entry=this.entries.find(e=>e.origin===p.id);if(!entry)return;
  if(!this.unlocked.has(entry.id)){this.unlocked.add(entry.id);try{localStorage.setItem(this.key,JSON.stringify([...this.unlocked]));}catch{}toast('함선 항로 기록 추가 · 발견 기록에서 확인하세요');}
  const notice=$('routeArchiveNotice');if(!notice)return;
  notice.innerHTML='<aside class="muted-box" aria-label="함선 기록 안내"><b>함선 항로 기록</b><p>이번 탐사와 관련된 항로 자료를 함선 기록에서 확인할 수 있어요.</p><button class="ghost" id="openRouteArchive">함선 항로 기록 열기</button></aside>';
  $('openRouteArchive').onclick=()=>notebook();
 },
 markup(){const entries=this.entries.filter(e=>this.unlocked.has(e.id));if(!entries.length)return '';
  return '<section aria-label="함선 항로 기록" style="margin-bottom:24px"><h3>함선 항로 기록</h3><p class="instrument-tip">함선에 저장된 위치 자료를 활용하는 선택 탐사 안내입니다. 천체 사진에서 검출한 신호가 아니에요.</p>'+entries.map(e=>'<article class="muted-box" style="margin:12px 0"><b>'+e.title+'</b><p>'+e.text+'</p>'+(e.tip?'<p>'+e.tip+'</p>':'')+'<button class="ghost" data-route-direction="'+e.id+'" aria-controls="routeBearing-'+e.id+'">신호 방향 확인</button><p id="routeBearing-'+e.id+'" role="status" aria-live="polite"></p></article>').join('')+'</section>';
 },
 bearing(target){const degrees=(Math.atan2(target.y-ship.y,target.x-ship.x)*180/Math.PI+360)%360;return (Math.round(degrees*10)/10)%360;},
 bind(){$('modalBody').querySelectorAll('[data-route-direction]').forEach(button=>{const entry=this.entries.find(e=>e.id===button.dataset.routeDirection);if(!entry)return;button.onclick=()=>{$('routeBearing-'+entry.id).textContent='현재 우주선 위치 기준 · 방향 '+this.bearing(entry.target()).toFixed(1)+'°';};});}
};
try{const saved=JSON.parse(localStorage.getItem(RouteArchive.key)||'[]');if(Array.isArray(saved))for(const id of saved)if(RouteArchive.entries.some(e=>e.id===id))RouteArchive.unlocked.add(id);}catch{}
