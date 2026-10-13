// Actual NASA mission photographs, cropped and resized for offline use.
// bodyFraction and center coordinates are approximate display measurements of the photographed body.
const PHOTOS = {
  "mercury": {
    "src": "assets/mercury.jpg",
    "credit": "NASA/Johns Hopkins APL/Carnegie Institution of Washington",
    "source": "https://science.nasa.gov/mercury/",
    "original": "https://science.nasa.gov/wp-content/uploads/2023/11/mercury-messenger-globe-pia15162.jpg",
    "note": "MESSENGER의 실제 표면 사진을 연결하고 구형으로 투영한 전구 모자이크입니다.",
    "bodyFraction": 0.92,
    "alt": "mercury 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "venus": {
    "src": "assets/venus.jpg",
    "credit": "NASA/JPL-Caltech · Kevin M. Gill",
    "source": "https://science.nasa.gov/venus/",
    "original": "https://science.nasa.gov/wp-content/uploads/2023/05/venus-mariner-10-pia23791-1920x640-1.jpg?w=1200",
    "note": "마리너 10호의 1974년 사진. 구름을 보기 위해 주황색·자외선 영상을 합성한 색상 처리 사진입니다.",
    "bodyFraction": 0.91,
    "alt": "venus 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "earth": {
    "src": "assets/earth.jpg",
    "credit": "NASA · Apollo 17",
    "source": "https://www.nasa.gov/image-article/blue-marble-view-from-apollo-17/",
    "original": "https://www.nasa.gov/wp-content/uploads/2023/03/as17-148-22727_lrg_0.jpg",
    "note": "아폴로 17호 승무원이 1972년 12월 7일 촬영했습니다.",
    "bodyFraction": 0.93,
    "alt": "earth 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "mars": {
    "src": "assets/mars.jpg",
    "credit": "NASA/USGS",
    "source": "https://science.nasa.gov/mars/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/mars/resources/detail_files/7/7668_Mars-viking-2-orbiter-global-view-partial-valles-marinares-PIA04304-full2.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "바이킹 탐사선의 실제 관측 사진을 연결한 전구 모자이크입니다.",
    "bodyFraction": 0.91,
    "alt": "mars 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "jupiter": {
    "src": "assets/jupiter.jpg",
    "credit": "NASA/JPL-Caltech/SwRI/MSSS · Kevin M. Gill (CC BY)",
    "source": "https://science.nasa.gov/jupiter/",
    "original": "https://science.nasa.gov/wp-content/uploads/2024/03/jupiter-marble-pia22946.jpg?w=1536",
    "note": "주노가 2019년 촬영한 세 장을 합성하고 색상을 강조한 사진입니다.",
    "bodyFraction": 0.91,
    "alt": "jupiter 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "saturn": {
    "src": "assets/saturn.jpg",
    "credit": "NASA/JPL/Space Science Institute",
    "source": "https://images.nasa.gov/details/PIA05380",
    "original": "https://images-assets.nasa.gov/image/PIA05380/PIA05380~orig.jpg",
    "note": "카시니가 2004년 촬영한 여러 필터 사진의 합성. 색상·대비를 약간 강조했습니다.",
    "bodyFraction": 0.375,
    "alt": "saturn 실제 관측 사진",
    "centerX": 0.532,
    "centerY": 0.5
  },
  "uranus": {
    "src": "assets/uranus.jpg",
    "credit": "NASA/JPL-Caltech",
    "source": "https://science.nasa.gov/uranus/",
    "original": "https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg",
    "note": "보이저 2호가 1986년 촬영한 천왕성입니다.",
    "bodyFraction": 0.92,
    "alt": "uranus 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "neptune": {
    "src": "assets/neptune.jpg",
    "credit": "NASA/JPL",
    "source": "https://science.nasa.gov/neptune/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/p/i/a/0/PIA01492-1.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "보이저 2호의 1989년 필터별 사진 합성. 파란색이 강조되어 육안으로 보이는 색과 다릅니다.",
    "bodyFraction": 0.92,
    "alt": "neptune 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "달": {
    "src": "assets/moon.jpg",
    "credit": "NASA/JPL/USGS",
    "source": "https://science.nasa.gov/photojournal/earths-moon/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia00/pia00405/PIA00405.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "갈릴레오의 1992년 사진. 가시광선·근적외선 필터를 합성하여 색상을 강조했습니다.",
    "bodyFraction": 0.94,
    "alt": "달 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "포보스": {
    "src": "assets/phobos.jpg",
    "credit": "NASA/JPL-Caltech/University of Arizona",
    "source": "https://science.nasa.gov/mars/moons/phobos/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/phobosincolor_pia10369.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "화성 정찰 궤도선(MRO)이 2008년 촬영한 색상 사진입니다.",
    "bodyFraction": 0.92,
    "alt": "포보스 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "데이모스": {
    "src": "assets/deimos.jpg",
    "credit": "NASA/JPL-Caltech/University of Arizona",
    "source": "https://science.nasa.gov/mars/moons/deimos/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/internal_resources/435/Deimos732X520-1.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "화성 정찰 궤도선(MRO)의 실제 관측 사진. 색상은 관측 자료 처리의 영향을 받습니다.",
    "bodyFraction": 0.88,
    "alt": "데이모스 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "이오": {
    "src": "assets/io.jpg",
    "credit": "NASA/JPL/University of Arizona",
    "source": "https://images.nasa.gov/details/PIA02308",
    "original": "https://images-assets.nasa.gov/image/PIA02308/PIA02308~orig.jpg",
    "note": "갈릴레오의 관측 사진을 합성한 자연색 전구 영상입니다.",
    "bodyFraction": 0.95,
    "alt": "이오 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "유로파": {
    "src": "assets/europa.jpg",
    "credit": "NASA/JPL/DLR",
    "source": "https://images.nasa.gov/details/PIA00502",
    "original": "https://images-assets.nasa.gov/image/PIA00502/PIA00502~orig.jpg",
    "note": "갈릴레오의 1996년 비교 영상 중 왼쪽 자연색 사진을 잘라 사용했습니다.",
    "bodyFraction": 0.93,
    "alt": "유로파 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "가니메데": {
    "src": "assets/ganymede.jpg",
    "credit": "NASA/JPL-Caltech/SwRI/MSSS",
    "source": "https://science.nasa.gov/jupiter/moons/ganymede/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/p/i/a/2/PIA24681_Juno_Ganymede_Close-Up.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "주노가 2021년 6월 7일 촬영한 녹색 필터 자료의 흑백 영상입니다.",
    "bodyFraction": 0.9,
    "alt": "가니메데 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "칼리스토": {
    "src": "assets/callisto.jpg",
    "credit": "NASA/JPL/DLR",
    "source": "https://science.nasa.gov/jupiter/moons/callisto/",
    "original": "https://images-assets.nasa.gov/image/PIA03456/PIA03456~orig.jpg",
    "note": "갈릴레오가 촬영한 전구 색상 사진입니다.",
    "bodyFraction": 0.94,
    "alt": "칼리스토 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "타이탄": {
    "src": "assets/titan.jpg",
    "credit": "NASA/JPL/Space Science Institute",
    "source": "https://images.nasa.gov/details/PIA06122",
    "original": "https://images-assets.nasa.gov/image/PIA06122/PIA06122~orig.jpg",
    "note": "카시니가 촬영한 구름과 높은 대기 연무입니다. 두꺼운 대기가 표면을 가립니다.",
    "bodyFraction": 0.68,
    "alt": "타이탄 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "엔셀라두스": {
    "src": "assets/enceladus.jpg",
    "credit": "NASA/JPL/Space Science Institute",
    "source": "https://science.nasa.gov/saturn/moons/enceladus/",
    "original": "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/PIA11133.jpg?w=1972&h=2848&fit=clip&crop=faces%2Cfocalpoint",
    "note": "카시니가 2008년 10월 9일 촬영한 사진들을 연결한 모자이크입니다.",
    "bodyFraction": 0.9,
    "alt": "엔셀라두스 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "레아": {
    "src": "assets/rhea.jpg",
    "credit": "NASA/JPL/Space Science Institute",
    "source": "https://science.nasa.gov/saturn/moons/rhea/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/PIA12648.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "카시니가 촬영한 충돌구와 밝은 균열이 보이는 사진입니다.",
    "bodyFraction": 0.91,
    "alt": "레아 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "티타니아": {
    "src": "assets/titania.jpg",
    "credit": "NASA/JPL",
    "source": "https://science.nasa.gov/uranus/moons/titania/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/PIA00036.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "보이저 2호가 1986년 촬영한 자료로 만든 색상 합성 사진입니다.",
    "bodyFraction": 0.88,
    "alt": "티타니아 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "오베론": {
    "src": "assets/oberon.jpg",
    "credit": "NASA/JPL",
    "source": "https://science.nasa.gov/uranus/moons/oberon/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/Oberon_732.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "보이저 2호가 1986년 촬영했습니다. 당시 관측 해상도를 유지합니다.",
    "bodyFraction": 0.86,
    "alt": "오베론 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "미란다": {
    "src": "assets/miranda.jpg",
    "credit": "NASA/JPL-Caltech",
    "source": "https://images.nasa.gov/details/PIA18185",
    "original": "https://images-assets.nasa.gov/image/PIA18185/PIA18185~orig.jpg",
    "note": "보이저 2호가 1986년 1월 24일 촬영했습니다.",
    "bodyFraction": 0.95,
    "alt": "미란다 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "트리톤": {
    "src": "assets/triton.jpg",
    "credit": "NASA/JPL/USGS",
    "source": "https://science.nasa.gov/neptune/moons/triton/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/PIA00317_modest.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "보이저 2호의 1989년 사진 모자이크. 주황색·보라색·자외선 필터를 색상으로 합성했습니다.",
    "bodyFraction": 0.95,
    "alt": "트리톤 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  },
  "프로테우스": {
    "src": "assets/proteus.jpg",
    "credit": "NASA/JPL",
    "source": "https://science.nasa.gov/neptune/moons/proteus/",
    "original": "https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/07/Proteus732X520.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg",
    "note": "보이저 2호가 촬영했습니다. 원래 사진의 낮은 해상도 때문에 흐릿하게 보입니다.",
    "bodyFraction": 0.88,
    "alt": "프로테우스 실제 관측 사진",
    "centerX": 0.5,
    "centerY": 0.5
  }
};

Object.assign(PHOTOS,{
  "sun": {
    "src": "assets/sun.jpg",
    "source": "https://sdo.gsfc.nasa.gov/data/channels.php",
    "original": "https://sdo.gsfc.nasa.gov/assets/img/browse/2026/07/30/20260730_000000_1024_HMIIC.jpg",
    "credit": "NASA/SDO/HMI",
    "note": "SDO/HMI의 2026년 7월 30일 가시광 연속광 관측 사진. 표면의 밝기를 주황색으로 표현한 영상이며, 어두운 점은 흑점이다. 웹 표시용 크기 축소.",
    "bodyFraction": 0.917,
    "centerX": 0.5,
    "centerY": 0.5
  },
  "pluto": {
    "src": "assets/pluto.jpg",
    "source": "https://science.nasa.gov/resource/pluto-in-true-color/",
    "original": "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/i/a/1/PIA19857-1.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1080&w=1920",
    "credit": "NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute",
    "note": "뉴허라이즌스 LORRI 사진과 Ralph 색상 자료를 합성한 자연색에 가까운 명왕성 전경. 오른쪽 아래 가장자리는 고해상도 색상 자료가 부족하다. 검은 여백을 잘라 웹 표시용 크기로 조정.",
    "bodyFraction": 0.878,
    "centerX": 0.5,
    "centerY": 0.5
  },
  "comet": {
    "src": "assets/comet.jpg",
    "source": "https://www.esa.int/ESA_Multimedia/Images/2014/08/Comet_on_3_August_2014",
    "original": "https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2014/08/comet_on_3_august_2014/14707891-1-eng-GB/Comet_on_3_August_2014_pillars.png",
    "credit": "ESA/Rosetta/MPS for OSIRIS Team MPS/UPD/LAM/IAA/SSO/INTA/UPM/DASP/IDA",
    "note": "로제타 OSIRIS가 2014년 8월 3일 약285km 거리에서 촬영한 67P 혜성의 핵. 흑백 관측 사진을 크기 축소하고 검은 여백을 추가했다.",
    "license": "https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website",
    "bodyFraction": 0.91,
    "centerX": 0.505,
    "centerY": 0.486
  },
  "charon": {
    "src": "assets/charon.jpg",
    "source": "https://science.nasa.gov/resource/charon-in-enhanced-color/",
    "original": "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/i/a/PIA19968-1.jpg?crop=faces%2Cfocalpoint&fit=clip&h=2000&w=2000",
    "credit": "NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute",
    "note": "뉴허라이즌스가 2015년 7월 14일 촬영한 카론. 파랑·빨강·적외선 자료를 합성하고 표면 차이가 잘 보이도록 색을 강조했다. 웹 표시용 크기 축소.",
    "bodyFraction": 0.835,
    "centerX": 0.5,
    "centerY": 0.486
  },
  "카론": {
    "src": "assets/charon.jpg",
    "source": "https://science.nasa.gov/resource/charon-in-enhanced-color/",
    "original": "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/i/a/PIA19968-1.jpg?crop=faces%2Cfocalpoint&fit=clip&h=2000&w=2000",
    "credit": "NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute",
    "note": "뉴허라이즌스가 2015년 7월 14일 촬영한 카론. 파랑·빨강·적외선 자료를 합성하고 표면 차이가 잘 보이도록 색을 강조했다. 웹 표시용 크기 축소.",
    "bodyFraction": 0.835,
    "centerX": 0.5,
    "centerY": 0.486
  }
});
