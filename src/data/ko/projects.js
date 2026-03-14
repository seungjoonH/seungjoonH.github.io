const projects = [
  {
    id: 'mbwt',
    teamSize: 4,
    hidden: false,
    type: 'group',
    title: '물방울톡',
    period: { start: '2026-01', end: 'present' },
    summary: '가벼운 미니게임으로 시작해 자연스러운 대화로 이어지는 실시간 음성 소셜 서비스',
    tags: [
      '실시간통신',
      '음성채팅',
      { name: '실시간게임', show: false },
      { name: '소셜', show: false },
      '유지보수',
      { name: '테스트', show: false },
      { name: 'CI/CD', show: false },
      { name: '최적화', show: false },
      { name: 'OAuth', show: false },
      { name: 'JWT', show: false },
      '디자인',
      '네이버부스트캠프',
      { name: '풀스택', show: false },
      { name: 'Docker', show: false },
      { name: '모노레포', show: false },
    ],
    techStack: [
      'TypeScript',
      'Next.js',
      'NestJS',
      'Redis',
      'MySQL',
      'Socket.io',
      { name: 'React', show: false },
      { name: 'Node.js', show: false },
      { name: 'Zustand', show: false },
      { name: 'mediasoup', show: false },
      { name: 'WebRTC', show: false },
      { name: 'TypeORM', show: false },
      { name: 'Passport', show: false },
      { name: 'Docker', show: false },
      { name: 'Playwright', show: false },
      { name: 'Vitest', show: false },
      { name: 'Jest', show: false },
    ],
    links: [
      { type: 'deploy', title: '배포 링크', href: 'https://moolbangwool.duckdns.org/home' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/boostcampwm2025/web26-2Ryuk' },
      { type: 'notion', title: '패치노트', href: 'https://rapid-bubble-113.notion.site/2fe207f233418064a95be845fe26ec3e' },
    ],
    sections: [
      {
        title: '디자인 시스템 구축 및 컴포넌트 설계 원칙 수립',
        items: [
          '개발자별 스타일 정의 방식이 달라 전체적인 시각적 조화가 깨지는 문제 발생',
          '컴포넌트별 디자인 규격을 사전 정의하고 **개발자가 정해진 타입 내에서만 선택하도록 구조화한 컴포넌트 설계 철학** 수립 및 문서화 공유',
          '협업 간 디자인 편차를 최소화하여 **디자인 완성도와 신규 UI 구현 속도 향상**',
        ],
        links: [{ type: 'doc', id: 'component-design-philosophy' }],
      },
      {
        title: '부동형 컴포넌트 설계 및 상태 복원 로직 최적화',
        items: [
          '자유로운 드래그 앤 드롭이 가능한 부동형 채팅 패널 구현',
          '**위치 제어 로직을 별도 훅으로 모듈화**하여 UI 컴포넌트와의 의존성 분리 및 복잡도 해결',
          'Zustand Persist의 partialize/merge를 활용해 새로고침 후에도 좌표 유지 및 상태 복원 로직 구현',
          '**기획 및 디자인 의도에 부합하는 UI/UX 구현 달성**',
        ],
        links: [{ type: 'doc', id: 'floating-component-spec' }],
      },
      {
        title: '실시간 게임 최적화 및 과도한 입력 대응',
        items: [
          '다중 사용자 환경에서 프레임 드랍 발생, 사용자 테스트 중 렌더링 끊김 현상 확인',
          'Playwright 및 socket.io-client 기반 **부하 실험**과 **FPS / Performance 프로파일링**으로 병목 구간 분석',
          '입력마다 N×N 브로드캐스트 발생에 따른 이벤트 급증으로 메인 스레드 과점유 발생',
          'Client에서 100ms 단위로 입력을 누적(delta) 후 묶어 전송하도록 변경',
          'Server에서 입력 처리와 상태 전파를 분리하고 300ms 고정 주기로 브로드캐스트하도록 구조 개선',
          '초당 수신 이벤트 **약 2,937건 → 32건 감소**, FPS 평균 **30.7 → 60.5 개선**',
        ],
        links: [{ type: 'doc', id: 'rendering-optimization-input-burst' }],
      },
      {
        title: 'QA 체계 및 검증 프로세스 구축',
        items: [
          '사용자 상태 및 경로에 따른 입장 로직을 체계적으로 구조화',
          'QA 프로세스를 정립하여 **시스템 동작 신뢰성과 기술적 완성도 확보**',
        ],
        links: [{ type: 'doc', id: 'qa-checklist' }],
      },
    ],
  },
  {
    id: 'portfolio',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: '포트폴리오',
    period: { start: '2026-03', end: 'present' },
    summary: '데이터 구조화, 검색 UX, 접근성, 다국어, 인터랙티브 디자인을 반영한 개인 포트폴리오 웹사이트',
    tags: [
      'UI',
      'UX',
      '접근성',
      '다국어',
      '테마 전환',
      { name: '검색', show: false },
      { name: 'i18n', show: false },
      { name: '인터랙티브', show: false },
    ],
    techStack: ['Javascript', 'React'],
    links: [
      { type: 'deploy', title: '배포 링크', href: 'https://seungjoonh.github.io' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/seungjoonH.github.io' },
    ],
    sections: [
      {
        title: '데이터 단위 관리 가능하도록 구조화',
        items: [
          '프로젝트/경력/학력/스킬 등 콘텐츠를 **도메인별 데이터 파일로 분리**하고, 언어별(ko/en) 디렉터리 구조로 관리',
          '**Repository 레이어**를 두어 화면과 데이터를 분리하고, 필요 시 확장 및 교체가 쉽도록 구조화',
        ],
      },
      {
        title: 'UX를 고려한 검색 기능',
        items: [
          'Extify 프로젝트에서 구현한 한글 자모/초성 처리 로직을 JS로 옮겨 활용하여, 프로젝트 섹션에 **한글 초성/자모/영어 통합 검색**을 적용해 사용자가 입력한 키워드로 프로젝트를 빠르게 필터링',
          '디바운스 및 정규화된 쿼리 처리, 스택/태그 매핑, 검색어 하이라이트 등으로 **발견성과 가독성**을 높임',
        ],
      },
      {
        title: '접근성 고려',
        items: [
          '**폰트 크기 조절**, 시맨틱 태그(header, nav, main, section, article 등) 사용, **ARIA 및 data 속성**으로 역할과 상태 전달',
          '키보드 포커스와 포커스 트랩, 스크린 리더 친화적인 마크업과 라벨을 적용해 **다양한 사용 환경**을 고려',
        ],
      },
      {
        title: '다국어 지원',
        items: [
          '**i18n**으로 한국어/영어 전환을 지원하고, **문자열, 프로젝트, 경력, 학력, 스킬 등 데이터를 언어별로 분리 관리**',
          'locale 기반 리소스 로딩과 공통 키 체계를 사용해 번역 일관성과 유지보수성을 확보',
        ],
      },
      {
        title: '인터랙티브 디자인',
        items: [
          '파노라마 스크롤, 카드 호버 및 포커스 반응, 모달과 팝업 전환 등 **시각적 피드백과 애니메이션**으로 탐색 경험을 강화',
          '반응형 레이아웃과 브레이크포인트 훅을 활용해 **다양한 화면 크기**에서 일관된 UX 제공',
        ],
      },
    ],
  },
  {
    id: 'acommit',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'Acommit',
    period: { start: '2025-11', end: 'present' },
    summary: 'AI 기반 Git 협업 자동화 CLI',
    tags: [
      '오픈소스',
      'npm',
      'Git',
      'CLI',
      { name: '커밋메시지', show: false },
      { name: 'AI', show: false },
      { name: '자동화', show: false },
      { name: '단독기획', show: false },
      { name: '바이브코딩', show: false },
      { name: '불편해소', show: false },
      { name: '유지보수', show: false },
      { name: '배포', show: false },
    ],
    techStack: ['Javascript', 'Node.js'],
    links: [
      { type: 'npm', title: 'npm 배포 링크', href: 'https://www.npmjs.com/package/acommit' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/acommit' },
    ],
    sections: [
      {
        title: 'git diff 기반 커밋 메시지 자동 생성 CLI 설계 및 구현',
        items: [
          '다량의 파일 변경이 발생할 때 커밋을 적절히 분리하고 팀의 Commit 컨벤션을 일관되게 유지하기 어려운 문제를 해결하기 위해 git diff 분석 기반 커밋 메시지 자동 생성 CLI 개발',
          '**상세 기획 후 바이브 코딩 방식** 으로 구현하여 멀티 LLM 연동부터 CLI 배포까지 전 과정을 빠르게 구축',
        ],
      },
      {
        title: '팀 커밋 컨벤션을 적용하기 위한 rules.yml 기반 자동화 구조 설계',
        items: [
          'rules.yml 설정을 통해 팀의 Commit 컨벤션을 정의하고 해당 **규칙에 맞는 Commit 메시지** 를 자동 생성하도록 설계',
          'git diff로 변경된 파일을 분석하여 유사도/태그/디렉토리 기반 등 **5가지 전략으로 파일을 그룹화** 하고 적절한 Commit 단위를 자동으로 구성하도록 설계',
          'OpenAI와 Gemini 모델을 모두 사용할 수 있도록 구성하고 토큰 제한 및 LLM 관련 설정을 rules.yml에서 직접 제어할 수 있는 구조 설계',
        ],
      },
      {
        title: 'npm 오픈소스 패키지 배포 및 실제 프로젝트 적용',
        items: [
          'npm 공식 패키지로 배포하여 CLI 환경에서 **누구나 쉽게 설치하고 사용** 할 수 있도록 공개',
          '실제 프로젝트 개발 과정에 직접 도입하여 Commit 메시지 작성과 변경 내용 정리를 자동화하고 커밋 작성 과정의 **속도 향상을 체감**',
        ],
      },
    ],
  },
  {
    id: 'extify',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'Extify',
    period: { start: '2024-11', end: 'present' },
    summary: 'Dart 종합 유틸리티 패키지',
    tags: [
      '오픈소스',
      'pub.dev',
      '배포',
      '라이브러리',
      { name: '유지보수', show: false },
      { name: '단독기획', show: false },
      { name: '경량-유틸리티', show: false },
      { name: '풀어쓰기', show: false },
      { name: '모아쓰기', show: false },
      { name: '한국어조사', show: false },
      { name: '문자열처리', show: false },
      { name: '테스트', show: false },
      { name: '개인프로젝트', show: false },
      { name: '불편해소', show: false },
    ],
    "techStack": ["Dart"],
    links: [
      { type: 'pubdev', title: 'pub.dev 배포 링크', href: 'https://pub.dev/packages/extify' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/extify' },
    ],
    sections: [
      {
        title: '반복 유틸 로직 통합 및 Dart 패키지 설계',
        items: [
          '서로 다른 프로젝트에서 반복적으로 구현되는 유틸리티 로직의 비효율을 해결하기 위해, 자주 사용되는 핵심 기능을 하나로 모아 직접 설계하고 배포한 Dart 전용 패키지',
        ],
      },
      {
        title: '한글 조사, 자모 분리, 문자열 케이스 변환 등 핵심 기능',
        items: [
          { title: '한글 조사 자동 처리 및 자모 분리', items: ['"은/는", "이/가" 등 까다로운 한국어 조사 규칙을 자동화하고, 초·중·종성 분리 및 조합 로직 구현 및 문서화'], links: [{ type: 'doc', id: 'flutter-hangeul' }] },
          { title: '문자열 케이스 변환기', items: ['snake_case, camelCase, PascalCase 등 다양한 명명 규칙 간의 상호 변환 기능 구현 및 문서화'], links: [{ type: 'doc', id: 'flutter-string-case-converter' }] },
        ],
      },
      {
        title: 'pub.dev 오픈소스 배포 및 코드 중복 제거 및 라이브러리 운영',
        items: [
          '**pub.dev 공식 패키지 오픈소스 배포**를 통해 누구나 pubspec.yaml 설정으로 쉽게 설치 가능',
          '**프로젝트 간 코드 중복**을 제거하고 외부에서 신뢰할 만한 수준의 라이브러리 설계 및 관리 프로세스 경험',
        ],
      },
    ],
  },
  {
    id: 'foodrain',
    teamSize: 3,
    hidden: true,
    type: 'group',
    title: 'Foodrain',
    period: { start: '2024-09', end: 'present' },
    summary: '소상공인 통합 물류 고도화 웹 서비스 유지보수',
    tags: ['유지보수', 'Flutter Web', '프론트엔드'],
    techStack: ['Flutter', 'Dart'],
    links: [
      { type: 'external', title: 'Foodrain 서비스', href: 'https://foodrain.com/main' },
    ],
    sections: [
      {
        title: '사용자용 웹 유지보수 및 기능 추가',
        items: [
          '**Flutter Web** 기반 Frontend 개발',
          '신규 UI/UX 화면 개발 및 성능 개선',
          'Backend API 연동 및 Client 요구사항 반영',
        ],
      },
      {
        title: '관리자용 웹 유지보수 및 기능 추가',
        items: [
          '**Flutter Web** 기반 Frontend 개발',
          '신규 UI/UX 화면 개발 및 성능 개선',
          'Backend API 연동 및 Client 요구사항 반영',
        ],
      },
    ],
  },
  {
    id: 'fitween',
    teamSize: 5,
    hidden: false,
    type: 'group',
    title: 'Fitween',
    period: { start: '2023-06', end: '2023-12' },
    summary: 'AI 모션 인식과 게임 요소를 활용한 운동 동기부여 어플리케이션',
    tags: ['기획', '개발', '출시', '버전관리', '유지보수'],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    links: [
      { type: 'appstore', title: 'App Store 링크', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/fitween' },
    ],
    sections: [
      { title: '디자인 스프린트를 통한 제품 리스크 최소화', items: ['실제 앱 기능을 **프로토타입으로 구현하고 UT를 통해 검증**', '실시간 자세 피드백에 대한 사용자 니즈 및 피드백 수집', '불필요한 기능 제외 및 핵심 개발 우선순위 확정'], links: [{ type: 'doc', id: 'fitween-design-sprint' }] },
      { title: '정확한 스쿼트 자세 가이드를 위한 TensorFlow MoveNet 기술 도입', items: ['다리 골격의 각도 및 움직임을 실시간 추적하는 Pose Estimation 기술 적용', 'Flutter 공식 라이브러리 부재, **유지보수가 중단된 오픈소스를 직접 분석**하고 프로젝트 사양에 맞춰 재가공, 해당 과정 문서화'], links: [{ type: 'doc', id: 'movenet-flutter' }] },
      { title: '관련 패키지가 부재에 따른 UI 컴포넌트 자체 개발', items: ['디자인 명세를 충실히 반영하기 위해 Circular Carousel 위젯을 직접 개발', '해당 개발 과정을 문서화'], links: [{ type: 'doc', id: 'flutter-circular-carousel' }] },
    ],
  },
  {
    id: '3d-renderer',
    teamSize: 1,
    hidden: false,
    type: 'toy',
    title: '3D Renderer',
    period: { start: '2024-05', end: '2024-05' },
    summary: '수학 기반 3D → 2D 투영 원리를 직접 구현한 Python 3D 렌더링 실험 프로젝트',
    tags: ['그래픽스', '수학', '렌더링엔진', '단독기획'],
    techStack: ['Python', 'Pygame', 'Numpy'],
    links: [
      { type: 'github', title: '3D Renderer Github 저장소 링크', href: 'https://github.com/seungjoonH/3d-renderer' },
    ],
    sections: [
      {
        title: '렌더링 엔진 없이 직접 구현한 3D → 2D 투영 파이프라인',
        items: [
          'Unity, OpenGL 등의 엔진 없이 **3차원 공간의 점을 2차원 화면으로 투영하는 수학적 원리를 직접 구현**',
          '카메라 위치(V)와 물체 좌표(A)를 기반으로 직선 VA를 정의하고 **화면 평면과의 교점을 계산하여 화면 좌표로 변환하는 렌더링 파이프라인 설계**',
          '벡터 연산과 평면 방정식을 활용해 **3D 좌표 → 스크린 좌표 변환 과정 전체를 직접 계산**',
        ],
        links: [
          { type: 'doc', id: 'project-3d-renderer' },
        ],
      },
      {
        title: '실시간 카메라 시스템 및 3차원 이동 구현',
        items: [
          '마우스 입력을 기반으로 **시선 벡터 회전을 계산하여 자유로운 카메라 시점 제어 시스템 구현**',
          'WASD 및 수직 이동 키를 활용해 **3차원 공간을 자유롭게 탐색할 수 있는 이동 로직 구현**',
          '벡터 기반 이동과 회전 계산을 통해 **FPS 스타일의 카메라 조작 경험 구현**',
        ],
      },
      {
        title: '벡터 연산 기반 렌더링 구조 설계',
        items: [
          'numpy를 활용해 **벡터 내적(dot product) 기반의 화면 좌표 계산 로직 구현**',
          '화면 좌표계 단위벡터(i\', j\')를 정의하고 **투영된 점을 화면 좌표로 변환하는 구조 설계**',
          '그래픽 엔진 내부 동작을 이해하기 위해 **렌더링의 기초 수학 구조를 직접 구현하고 실험**',
        ],
      },
    ],
  },
];

export default projects;