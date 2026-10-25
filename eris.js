'use strict';
// Discovery-only body. Average solar distance is used for a fixed, coplanar
// game placement; this is not a current ephemeris or Eris's tilted orbit.
const ERIS={
 id:'eris',name:'에리스',en:'ERIS',type:'왜소행성',secret:true,signalCode:'06',
 tagline:'명왕성 너머에서 만난 또 하나의 얼음 세계',
 x:68*Math.cos(.18),y:68*Math.sin(.18),au:68,radius:.012,zone:.45,
 diameter:2326,meanDiameter:true,mass:1.66e22,
 tools:['observe','measure','profile'],
 surfaceTitle:'밝은 얼음으로 덮인 먼 세계',
 surface:'관측한 빛에서 메테인 얼음의 흔적을 찾았어요. 표면의 자세한 지형은 아직 알지 못해요. 화면의 구체는 관측 자료를 참고한 모형이에요.',
 facts:[
  ['밝은 얼음 세계','관측한 빛을 분석해 표면의 메테인 얼음을 알아냈어요. 이 화면의 표면 무늬는 실제 지형 사진이 아닌 모형이에요.'],
  ['또 하나의 왜소행성','에리스는 명왕성과 함께 왜소행성으로 분류해요. 에리스의 발견은 행성의 정의를 다시 논의하는 계기가 되었어요.'],
  ['작은 동반자','에리스에는 디스노미아라는 위성이 하나 알려져 있어요. 위성의 움직임을 조사하면 에리스의 질량을 알아낼 수 있어요.']
 ]
};
ENCOUNTERS.push(ERIS);
// An intentionally low-detail illustration: no invented craters or terrain.
// The circle occupies 90% of the square, matching the measurement calibration.
const erisModel='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs><radialGradient id="ice" cx="32%" cy="28%" r="78%"><stop stop-color="#fafbf3"/><stop offset=".45" stop-color="#d9e0dd"/><stop offset=".78" stop-color="#a2b0b8"/><stop offset="1" stop-color="#46566b"/></radialGradient></defs><circle cx="256" cy="256" r="230.4" fill="url(#ice)"/></svg>';
PHOTOS.eris={
 src:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(erisModel),
 source:'https://science.nasa.gov/dwarf-planets/eris/',
 credit:'덕이 탐사대 · 관측 자료 기반 모형',mediaLabel:'모형',
 alt:'에리스의 밝은 얼음 표면을 표현한 구체 모형 · 실제 관측 사진 아님',
 note:'태양에서 약 68 AU, 공전면 위에 고정 배치한 탐사용 모형이며 실제 현재 위치가 아니에요. 지름·질량: ESO 관측 자료(2011), 약 0.2326만 km·0.166억 조 톤. https://www.eso.org/public/news/eso1142/',
 bodyFraction:.9,centerX:.5,centerY:.5
};
