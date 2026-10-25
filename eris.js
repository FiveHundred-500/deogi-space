'use strict';
// Discovery-only body. Average solar distance is used for a fixed, coplanar
// game placement; this is not a current ephemeris or Eris's tilted orbit.
const ERIS={
 id:'eris',name:'에리스',en:'ERIS',type:'왜소행성',secret:true,signalCode:'06',
 tagline:'명왕성 너머에서 만난 또 하나의 얼음 세계',
 x:68*Math.cos(140*Math.PI/180),y:68*Math.sin(140*Math.PI/180),au:68,radius:.012,zone:.45,
 diameter:2326,meanDiameter:true,mass:1.66e22,
 tools:['observe','measure','profile'],
 measurementNote:'지름 측정에는 상상도를 자료에 맞춰 보정한 축척 모형을 사용해요. 허블 사진의 빛점 크기는 천체의 실제 지름이 아니에요.',
 surfaceTitle:'밝은 얼음으로 덮인 먼 세계',
 surface:'관측한 빛에서 메테인 얼음의 흔적을 찾았어요. 표면의 자세한 지형은 아직 알지 못해요. 조종석의 모습은 상상도이며 실제 지형을 촬영한 사진이 아니에요.',
 facts:[
  ['밝은 얼음 세계','관측한 빛을 분석해 표면의 메테인 얼음을 알아냈어요. 허블 사진의 밝은 빛점으로는 표면 지형을 구분할 수 없어요.'],
  ['또 하나의 왜소행성','에리스는 명왕성과 함께 왜소행성으로 분류해요. 에리스의 발견은 행성의 정의를 다시 논의하는 계기가 되었어요.'],
  ['작은 동반자','에리스에는 디스노미아라는 위성이 하나 알려져 있어요. 위성의 움직임을 조사하면 에리스의 질량을 알아낼 수 있어요.']
 ]
};
ENCOUNTERS.push(ERIS);
// Observation images and flight/measurement illustrations have separate roles.
PHOTOS.eris={
 src:'assets/eris-hubble.jpg',
 source:'https://science.nasa.gov/resource/hubble-view-of-eris-and-dysnomia/',
 credit:'NASA, ESA, M. Brown (Caltech) · 허블 우주망원경',
 alt:'허블이 촬영한 에리스와 왼쪽 아래의 디스노미아 · 위치와 궤도 안내가 덧붙은 실제 관측 사진',
 note:'2006년 8월 30일 촬영. 밝은 빛점이 에리스이고 왼쪽 아래의 작은 빛점이 디스노미아예요. 글자·화살표·궤도선은 설명을 위해 덧붙였어요. 표면 지형을 보여 주는 근접 사진은 아니에요.',
 bodyFraction:1,centerX:.5,centerY:.5,
 illustration:{
  src:'assets/eris-artist.jpg',source:'https://esahubble.org/images/opo0724e/',
  credit:'NASA, ESA, Adolph Schaller (STScI)',
  alt:'에리스 상상도 · 실제 표면 사진 아님',
  // Pixel crop of the complete Eris disc in the unmodified 800 × 600 artwork.
  crop:[360,278,288,288],width:800,height:600
 }
};
