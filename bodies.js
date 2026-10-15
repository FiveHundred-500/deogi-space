'use strict';
const bodyName=p=>p.secret&&!record(p.id).visited?(p.artificial?'미확인 통신원 '+p.signalCode:p.id==='pluto'?'미확인 천체 02':'미확인 천체 01'):p.name;
const headingDegrees=angle=>Math.round((angle*180/Math.PI+360)%360)%360;
const bearing=p=>headingDegrees(Math.atan2(p.y-ship.y,p.x-ship.x));
// NASA JPL masses rounded for this instrument; kg. Surface summaries: NASA Science.
const BODY_DATA={
 moon:{mass:7.35e22,surfaceTitle:'암석과 고운 먼지로 덮인 표면',surface:'고체 암석 표면 위에 충돌구, 밝은 고지, 어두운 현무암 평원이 있어요. 달의 바다에는 액체 바다가 없어요. 대기가 매우 희박하여 충돌 흔적이 오랫동안 남아요.'},
 mercury:{mass:3.30103e23,surfaceTitle:'단단한 암석 표면',surface:'크레이터와 넓은 용암 평원, 절벽이 있어요. 대기가 거의 없어 낮과 밤의 표면 온도 차가 약 600°C에 이르러요.'},
 venus:{mass:4.86731e24,surfaceTitle:'뜨거운 암석 지표',surface:'암석 평원과 산, 화산 지형이 있어요. 두꺼운 구름이 지표를 가리므로 레이더로 지형을 조사해요. 표면은 약 465°C로 매우 뜨거워요.'},
 earth:{mass:5.97217e24,surfaceTitle:'암석 대륙과 액체 바다',surface:'단단한 지각 위에 대륙과 바다가 있어요. 표면의 약 71%는 액체 상태의 물로 덮여 있으며 극지방에는 얼음도 있어요.'},
 mars:{mass:6.41691e23,surfaceTitle:'붉은 먼지와 암석',surface:'철 산화물 때문에 붉게 보이는 먼지와 암석으로 덮여 있어요. 올림푸스산 같은 거대한 화산과 협곡, 크레이터가 있고 과거 물이 흐른 흔적이 남아 있어요. 극지방에는 얼음과 드라이아이스로 된 흰색 극관이 있어요.'},
 jupiter:{mass:1.898125e27,surfaceTitle:'착륙할 단단한 표면 없음',surface:'보이는 무늬는 암석 지표가 아니라 대기의 구름 띠와 폭풍이에요. 아래로 내려갈수록 압력과 온도가 높아지고 물질의 상태가 달라져요.',rings:'희미한 먼지 고리. 토성처럼 밝은 얼음 고리가 아니에요.'},
 saturn:{mass:5.68317e26,surfaceTitle:'착륙할 단단한 표면 없음',surface:'보이는 줄무늬는 수소·헬륨 중심 대기의 구름층에서 나타나요. 깊이 들어갈수록 압력과 온도가 높아져요. 단단한 땅에 내려앉을 수 없어요.',rings:'수많은 얼음 입자와 일부 암석·먼지로 이루어진 넓고 밝은 고리예요.'},
 uranus:{mass:8.68099e25,surfaceTitle:'구름층 아래 고압의 내부',surface:'딛고 설 단단한 표면은 없어요. 보이는 것은 대기의 윗부분이에요. 내부에는 물·암모니아·메테인 성분이 많지만, 거대 얼음 행성이라는 이름이 얼음 바닥을 뜻하지는 않아요.',rings:'가늘고 어두운 고리. 크게 기울어진 자전축의 적도 둘레를 둘러싸요.'},
 neptune:{mass:1.024092e26,surfaceTitle:'강한 바람이 부는 구름층',surface:'단단한 지표가 없고, 보이는 것은 구름과 대기예요. 대기에서 매우 강한 바람과 대흑점 같은 거대한 소용돌이가 관측돼요. 소용돌이는 생겨나고 사라지며 고정된 표면 무늬가 아니에요. 내부의 물·암모니아·메테인 성분은 높은 압력과 온도 아래에 있어요.',rings:'먼지가 섞인 희미한 고리. 일부에는 더 밝고 조밀한 고리 호가 있어요.'},
 sun:{mass:1.9884e30,surfaceTitle:'고체 지표가 없는 항성',surface:'눈에 보이는 경계는 광구예요. 암석 표면이 아니라 뜨거운 기체와 플라스마로 이루어진 층이며 온도는 약 5,500°C예요.'},
 pluto:{mass:1.30246e22,surfaceTitle:'얼음 평원과 얼음 산',surface:'질소·메테인·일산화 탄소 얼음과 단단한 물얼음이 있어요. 넓은 얼음 평원과 물얼음으로 이루어진 산이 관측됐어요.'},
 comet:{mass:1e13,surfaceTitle:'먼지로 덮인 불규칙한 핵',surface:'67P의 핵은 얼음과 먼지·암석이 섞인 두 덩어리가 이어진 모양이에요. 표면에는 먼지층, 절벽과 구덩이가 있으며 태양 가까이에서 기체와 먼지를 방출해요.'}
};
for(const p of [...PLANETS,...ENCOUNTERS]){Object.assign(p,BODY_DATA[p.id]);if(p.tools&&!p.tools.includes('profile'))p.tools.push('profile');}
EQUIPMENT.push({id:'profile',name:'천체 자료',sub:'질량 · 표면 상태 · 고리',icon:'◈'});
// Satellite masses derived from NASA JPL GM (km³/s²), G = 6.67430 × 10^-20 km³ kg^-1 s^-2.
const MOON_GM={'달':4902.800,'포보스':.0007087,'데이모스':.0000962,'이오':5959.91547,'유로파':3202.71210,'가니메데':9887.83275,'칼리스토':7179.28340,'타이탄':8978.13710,'엔셀라두스':7.21037,'레아':153.94175,'티타니아':226.9,'오베론':205.3,'미란다':4.3,'트리톤':1428.49546,'프로테우스':2.58342,'카론':106.1};
const MOON_MASSES=Object.fromEntries(Object.entries(MOON_GM).map(([k,v])=>[k,Number((v/6.67430e-20).toPrecision(k==='프로테우스'?1:3))]));
MOON.mass=MOON_MASSES['달'];
// Shared display units; source data remain in kg and km.
function decimalText(value){const s=String(value);if(!/e/i.test(s))return s;const [mantissa,power]=s.toLowerCase().split('e'),negative=mantissa.startsWith('-'),m=negative?mantissa.slice(1):mantissa,parts=m.split('.'),digits=parts.join(''),point=parts[0].length+Number(power);return (negative?'-':'')+(point<=0?'0.'+'0'.repeat(-point)+digits:point>=digits.length?digits+'0'.repeat(point-digits.length):digits.slice(0,point)+'.'+digits.slice(point));}
const StudyUnits={
 massValue(kg){return decimalText(Number((kg/1e23).toPrecision(3)));},
 diameterValue(km){return decimalText(Number((km/10000).toFixed(6)));}
};
function massMarkup(value){return Number.isFinite(value)?StudyUnits.massValue(value)+' <small>억 조 톤</small>':'자료 없음';}
const BodyProfile={
 open(p){if(p.artificial)return Observatory.profile(p);openModal(p.name+' · 천체 자료','<div class="body-profile"><div class="profile-visual">'+PhotoLibrary.markup(p.id,p.name)+'<p class="photo-credit">'+PhotoLibrary.credit(p.id)+'</p></div><section><span class="eyebrow">MASS · 질량</span><div class="mass-reading">약 '+massMarkup(p.mass)+'</div><p class="instrument-tip">아주 큰 질량을 같은 크기의 묶음으로 나타낸 단위예요. 모든 천체에 같은 단위를 사용해요.</p><button class="ghost" id="massToCalc">질량을 계산기에 넣기</button><p class="instrument-tip">지구 탐사 기록과 비교하세요.</p><span class="eyebrow">SURFACE · 표면 상태</span><h3>'+p.surfaceTitle+'</h3><p>'+p.surface+'</p></section></div>'+(p.rings?'<section class="ring-section"><span class="eyebrow">RING SYSTEM · 고리</span><p>'+p.rings+'</p><canvas id="ringModel" width="600" height="260" aria-label="'+p.name+' 고리 모습"></canvas><p class="tiny">'+(p.id==='saturn'?'실제 관측 사진 · 고리를 포함한 모습':'고리 모형 · 밝기와 두께, 보는 각도를 조정해 표시했어요.')+'</p></section>':'')+'<details class="science-details"><summary>자료 안내</summary><p>질량은 탐사선의 궤도와 중력 관측 등으로 얻은 연구 자료의 근삿값이에요. 이 자료창은 저울로 천체 전체를 직접 재는 장비가 아니에요. 천체 질량은 억 조 톤, 용수철저울의 힘은 N으로 표시해요. 질량과 힘을 구별해 보세요.</p></details>','BODY REFERENCE');$('massToCalc').onclick=()=>Calculator.use(StudyUnits.massValue(p.mass));if(p.rings){const c=$('ringModel'),ctx=c.getContext('2d'),draw=()=>{if(!c.isConnected)return;ctx.clearRect(0,0,600,260);RingVisual.paint(ctx,p.id,300,130,110);};const img=PhotoLibrary.image(p.id);draw();if(img&&!img.complete)img.addEventListener('load',draw,{once:true});}}
};
const RingVisual={
 config:{jupiter:{outer:1.9,tilt:-.13,flat:.24,color:'#b3a895',alpha:.23,count:1},saturn:{outer:2.25,tilt:-.13,flat:.36,color:'#ddcba6',alpha:.92,count:24},uranus:{outer:2.05,tilt:1.24,flat:.46,color:'#b4cecc',alpha:.23,count:1},neptune:{outer:2.15,tilt:-.38,flat:.32,color:'#a0c0d8',alpha:.23,count:1}},
 has(id){return !!this.config[id];},
 paint(ctx,id,x,y,diameter){const cfg=this.config[id],rad=diameter/2;if(!cfg)return;if(id==='saturn'){const meta=PHOTOS[id],size=diameter/meta.bodyFraction;PhotoLibrary.paint(ctx,id,x+(.5-meta.centerX)*size,y,size);return;}const half=front=>{ctx.save();ctx.translate(x,y);ctx.rotate(cfg.tilt);ctx.strokeStyle=cfg.color;ctx.globalAlpha=cfg.alpha;for(let i=0;i<cfg.count;i++){const r=rad*cfg.outer;ctx.lineWidth=Math.max(.65,rad*(id==='saturn'?.028:.009));ctx.beginPath();ctx.ellipse(0,0,r,r*cfg.flat,0,front?0:Math.PI,front?Math.PI:Math.PI*2);ctx.stroke();}ctx.restore();};half(false);ctx.save();ctx.beginPath();ctx.ellipse(x,y,rad,rad*(id==='saturn'?.91:.97),0,0,Math.PI*2);ctx.clip();ctx.fillStyle='#02050c';ctx.fillRect(x-rad,y-rad,diameter,diameter);const img=PhotoLibrary.image(id),meta=PHOTOS[id];if(img?.complete&&img.naturalWidth){const size=diameter/(meta.bodyFraction||1);ctx.drawImage(img,x-(meta.centerX||.5)*size,y-(meta.centerY||.5)*size,size,size);}ctx.restore();half(true);}
};
