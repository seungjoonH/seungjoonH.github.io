// 한국어 Project 섹션 프로젝트 데이터
const projects = [
  {
    id: 'mbwt',
    teamSize: 4,
    hidden: false,
    type: 'group',
    title: '물방울톡',
    status: 'live',
    period: { start: '2025-12', end: '2026-02' },
    summary: '가벼운 미니게임으로 시작해 자연스러운 대화로 이어지는 실시간 음성 소셜 서비스',
    tags: [
      '네이버부스트캠프',
      '음성채팅',
      '디자인',
      '기획',
      '실시간통신',
      { name: '실시간게임', show: false },
      { name: '소셜', show: false },
      { name: '테스트', show: false },
      { name: 'CI/CD', show: false },
      { name: '최적화', show: false },
      { name: 'OAuth', show: false },
      { name: 'JWT', show: false },
      { name: '풀스택', show: false },
      { name: '모노레포', show: false },
    ],
    techStack: [
      'Typescript',
      'Next.js',
      'CSS Modules',
      'Zustand',
      'Socket.io',
      'WebRTC',
      { name: 'NestJS', show: false },
      { name: 'Redis', show: false },
      { name: 'MySQL', show: false },
      { name: 'React', show: false },
      { name: 'Node.js', show: false },
      { name: 'mediasoup', show: false },
      { name: 'TypeORM', show: false },
      { name: 'Passport', show: false },
      { name: 'Docker', show: false },
      { name: 'Playwright', show: false },
      { name: 'Vitest', show: false },
      { name: 'Jest', show: false },
      { name: 'Docker', show: false },
    ],
    links: [
      { type: 'deploy', title: '배포 링크', href: 'https://moolbangwool.duckdns.org/home' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/boostcampwm2025/web26-2Ryuk' },
      { type: 'notion', title: '패치노트', href: 'https://rapid-bubble-113.notion.site/2fe207f233418064a95be845fe26ec3e' },
    ],
    sections: [
      {
        title: '**컴포넌트 설계 원칙 수립 및 문서화**',
        items: [
          '`variant`/`size` 유니온 타입으로 허용된 스타일만 선택 가능하게 해 임의 px 색 사용을 코드 레벨에서 차단',
          '**개발자 간 UI 구현 편차를 줄여 협업 시 일관성 확보**',
        ],
        links: [{ type: 'doc', id: 'component-design-philosophy' }],
      },
      {
        title: '**부동형 채팅 패널 위치 제어 로직 모듈화**',
        items: [
          '위치 제어를 별도 훅으로 분리하고 `Zustand Persist`로 **새로고침 후 좌표 복원**',
          'UI 컴포넌트 의존성 제거로 **보일러플레이트 코드 약 38% 감소**',
        ],
        links: [{ type: 'doc', id: 'floating-component-spec' }],
      },
      {
        title: '**실시간 게임 입력 최적화**',
        items: [
          'Playwright + FPS 프로파일링으로 병목 분석 후, **입력을 누적해 묶어 전송**하도록 구조 개선',
          '초당 수신 이벤트 **2,937건 → 32건 감소**, FPS 평균 **30.7 → 60.5 개선**',
        ],
        links: [{ type: 'doc', id: 'rendering-optimization-input-burst' }],
      },
    ],
  },
  {
    id: 'frogger',
    teamSize: 4,
    hidden: false,
    type: 'group',
    title: 'Frogger',
    status: 'live',
    period: { start: '2026-04', end: '2026-04' },
    summary: '코드를 실행하면 AI가 시각화를 완성하는 알고리즘 디버거',
    tags: ['웹', '알고리즘', '시각화', 'AI', { name: '바이브코딩', show: false }, { name: '실시간', show: false }],
    techStack: ['Next.js', 'Typescript', 'D3', 'Three.js', 'Pyodide', 'Acorn', 'GCP', 'Gemini API', 'Vercel'],
    images: ['/assets/projects/frogger.svg'],
    links: [
      { type: 'deploy', title: 'Frogger 서비스 링크', href: 'https://frogger-six.vercel.app/' },
      { type: 'github', title: 'Frogger Github 저장소 링크', href: 'https://github.com/ultra-ai-dle/frogger' },
    ],
    sections: [
      {
        title: '**알고리즘 실행 흐름 시각화 디버거** 기획 및 구현',
        items: [
          'PS 문제 풀이 시 코드가 어떻게 동작하는지 직관적으로 확인하기 어려운 문제를 해결하기 위해 기획',
          'Stack부터 DP까지 실행 흐름을 그래프와 표로 보여주는 **알고리즘 디버거 구조** 설계',
        ],
      },
      {
        title: '**3D 배열 시각화**: Three.js 기반 다양한 표현 방식 지원',
        items: [
          '1차원·2차원 배열뿐 아니라 3차원 배열도 직관적으로 파악할 수 있도록 Three.js 기반 시각화 방식 설계',
          '데이터 구조와 연산 맥락에 맞춰 그래프·표·3D 뷰 등 **여러 표현 방식**을 지원',
        ],
      },
      {
        title: '**3개 언어 실행 환경 통합**: Python / Javascript / Java',
        items: [
          'Python과 JS는 Pyodide(WebAssembly)와 Acorn AST를 활용해 브라우저 Web Worker에서 직접 실행',
          'Java는 브라우저에서 JVM 구성이 불가해 GCP VM(e2-micro)에 JVM 환경을 별도로 구성',
        ],
      },
      {
        title: '**AI 기반 시각화 전략 정확도 개선**',
        items: [
          '변수명에 의존해 시각화 전략을 결정하면 실제 동작과 달라지는 문제 발생',
          '프롬프트와 후처리 로직 전반에 **"실제 연산 패턴 기준 판단 원칙"**을 적용해 정확도 개선',
        ],
      },
    ],
  },
  {
    id: 'portfolio',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: '포트폴리오',
    status: 'maintained',
    period: { start: '2026-03', end: 'present' },
    summary: '데이터 구조화, 검색 UX, 접근성, 다국어, 인터랙티브 디자인을 반영한 포트폴리오 웹사이트',
    tags: [
      '반응형',
      '검색',
      'UX',
      '접근성',
      '다국어',
      { name: '인터랙션', show: false },
      { name: '테마전환', show: false },
      { name: '툴팁', show: false },
      { name: 'ARIA', show: false },
      { name: '라이트모드', show: false },
      { name: '다크모드', show: false },
      { name: '시맨틱', show: false },
      { name: '애니메이션', show: false },
      { name: '스크린리더', show: false },
      { name: '폰트스케일', show: false },
      { name: 'i18next', show: false },
      { name: 'WCAG', show: false },
      { name: 'CSS', show: false },
    ],
    techStack: ['Javascript', 'React'],
    links: [
      { type: 'deploy', title: '배포 링크', href: 'https://seungjoonh.github.io' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/seungjoonH.github.io' },
    ],
    sections: [
      {
        title: '**접근성 개선**: 시맨틱 구조 및 ARIA 설계',
        items: [
          '`header`, `nav`, `main`, `section`, `article` 등 **시맨틱 태그**로 구조를 잡고, 태그만으로 부족한 곳은 **ARIA로 역할/이름/상태**를 보완. **의도를 알 수 없는 안내 문구**를 직접 확인하며 수정하고, 스크린 리더로 **보조 문구 및 포커스 순서**를 UI와 맞춤',
          '`useConfigStore` 훅으로 **라이트/다크 전환**상태를 전역 상태에 두고, 모드마다 **CSS 변수**을 한 세트로 묶어 **일관된 디자인 시스템**을 적용',
          '설정에서 **Font Scale**을 조절할 수 있는 기능을 제공하고, `clamp` / `cq` 등을 사용해 배율을 키워도 **레이아웃이 깨지지 않도록** 구성',
        ],
      },
      {
        title: '**사용자 경험 개선**: 사용자 친화적 UI/UX 구성',
        items: [
          '한 번에 의도 파악이 힘든 UI에는 **Tooltip**으로 다음 행동이나 설정 경로를 짚어 **사용자를 유도**',
          '버튼/링크/입력에는 Label과 보조 문구로 **역할을 바로 이해**할 수 있게 하고, title 및 ARIA로 **맥락을 보강**',
        ],
      },
      {
        title: '**반응형 레이아웃 설계**: 구간별 화면 대응',
        items: [
          '**mobile, tablet, desktop, wide** 네 구간을 두고, 구간별로 **레이아웃이 깨지지 않도록** 그리드 열 수와 타이포그래피 설계',
          '`useResponsive` 훅으로 현재 구간을 판별해 **그리드 열 수, 카드 내부 태그/스택 표시 개수**에 반영한 구현',
        ],
      },
      {
        title: '**프로젝트 검색 구현**: 풀어쓰기·모아쓰기 기반',
        searchChip: { label: 'Extify', searchQuery: 'title:Extify show:all' },
        items: [
          '의 개발 경험을 바탕으로, **한글 자모 분리 및 초성 매칭 알고리즘**을 JavaScript로 이식하여 오타에 강한 검색 UX 구현',
          '쿼리 정규화, 스택/태그 별칭 매핑, 결과 하이라이트로 **검색 결과 찾기와 스캔**을 보조',
        ],
      },
      {
        title: '**다국어 지원**: react-i18next 기반 리소스 구조 설계',
        items: [
          '`react-i18next`로 UI 문자열을 로드하고, 프로젝트/경력 등 **도메인 데이터는 `ko`/`en` 디렉터리**로 나눠 동일 스키마를 유지',
          '공통 키 네이밍과 **`{{variable}}` 치환**으로 동적 값(숫자/날짜 등)을 넣을 수 있게 하고, 접근성 전용 문구는 **`a11y` 하위 키**로 묶어 언어 전환 시 스크린 리더 문구도 UI와 맞춤',
        ],
      },
      {
        title: '**인터랙션 구현**: 애니메이션 기반 피드백 설계',
        items: [
          '스크롤에 따라 **fade-in/out**을 두어 **스크롤 진행감**을 주고, **히어로 영역**은 **parallax scrolling**으로 구성',
          '**Header Nav**의 버튼을 통해 **부드러운 스크롤**로 섹션으로 이동할 수 있도록 구성',
          '프로젝트 카드 **hover**/**focus** 시 앞면에서 뒷면으로 **Flip**되는 애니메이션, 모달/팝업 **전환 애니메이션**으로 클릭/키보드 탐색 시 **즉각적인 피드백** 제공',
        ],
      },
    ],
  },
  {
    id: 'ps-studio',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'PS Studio',
    status: 'live',
    period: { start: '2026-05', end: 'present' },
    summary: 'PS 스터디를 위한 과제 관리, 코드 리뷰, AI 피드백 통합 플랫폼',
    tags: ['웹', '바이브코딩', 'AI활용', '유지보수', '실사용중', '토이'],
    techStack: ['Next.js', 'NestJS', 'Supabase', 'PostgreSQL', 'Redis', 'BullMQ', 'Canny', 'GCP', 'OpenRouter'],
    images: ['/assets/projects/psstudio.svg'],
    links: [
      { type: 'deploy', title: 'PS Studio 서비스 링크', href: 'https://psstudio.dev/landing' },
      { type: 'github', title: 'PS Studio Github 저장소 링크', href: 'https://github.com/seungjoonH/psstudio' },
    ],
    sections: [
      {
        title: '**Google Free / Paid, OpenRouter 3종을 24개 시나리오로 비교 실험**',
        items: [
          'Free 티어는 성공률 **11.5%**로 실사용 불가 판정',
          'Paid와 OpenRouter는 성공률·정확도 **100%**로 동일, 비용도 유사함을 확인',
          '단일 API로 다중 모델 운영이 가능한 **OpenRouter 도입**을 근거 기반으로 확정',
        ],
        links: [{ type: 'doc', id: 'ai-gemini-api-openrouter' }],
      },
      {
        title: '**작업 난이도별 최적 LLM 모델 검증 및 적용**',
        items: [
          '경량 작업을 `gpt-4o-mini`로 전환해 정확도 유지 + **비용 73% 절감**',
          '고난이도 작업을 `llama-4-maverick`로 전환해 정확도 **94% → 100%**, **비용 88% 절감**',
        ],
        links: [{ type: 'doc', id: 'ai-openrouter-model-comparison' }],
      },
    ],
  },
  {
    id: 'my-first-boj',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'My First BOJ',
    status: 'live',
    period: { start: '2026-04-15', end: '2026-04-28' },
    summary: 'BOJ 서비스 종료 전 첫 제출 기록을 찾아 보존하는 서비스',
    tags: ['웹', '바이브코딩', '배포', '서비스중', '토이'],
    techStack: ['Next.js', 'Upstash Redis', 'Vercel'],
    images: ['/assets/projects/my-first-boj.svg'],
    links: [
      { type: 'deploy', title: 'My First BOJ 서비스 링크', href: 'https://my-first-boj.vercel.app/' },
      { type: 'github', title: 'My First BOJ Github 저장소 링크', href: 'https://github.com/seungjoonH/my-first-boj' },
    ],
    sections: [
      {
        title: '**BOJ 서비스 종료 전, 첫 제출 기록 보존 서비스 기획 및 제작**',
        items: [
          '첫 제출 기록 소멸 전 찾아두려는 니즈를 발견해, 검색 결과를 캐싱하고 종료 후에도 조회 가능한 구조 설계',
          'SEO 적용 및 백준 게시판 홍보로 누적 방문자 약 **500**명, 수집 데이터 **1,000**건 달성',
        ],
      },
      {
        title: '**첫 제출 탐색 알고리즘 개선으로 BOJ 서버 부하 최소화**',
        items: [
          '순차 탐색의 무한정 요청 문제를 이진 탐색으로 개선해 **O(log N, 최대 27회)**로 축소',
          '`top=1`과 `prev_page` 링크 활용 방식으로 재개선해 **O(1)** 수준으로 단축',
        ],
      },
      {
        title: '**서버 상주 비용 없이 Vercel Serverless + Upstash Redis로 실시간 채팅 구현**',
        items: [
          'Serverless에서 WebSocket 상주 연결이 불가해 **SSE + Redis polling** 구조로 대체',
          '탭 비활성·1분 무활동 시 SSE 자동 해제로 Upstash 요청 **49% 감소 (17,900 → 9,070)**',
        ],
      },
    ],
  },
  {
    id: 'mykit',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'Mykit',
    status: 'maintained',
    period: { start: '2026-05', end: 'present' },
    summary: 'AI 코딩 에이전트용 프로젝트 규칙 문서 자동 생성 CLI',
    tags: ['CLI', '바이브코딩', 'AI활용', '유지보수'],
    techStack: ['Javascript', { name: 'Node.js', show: false }, { name: 'Inquirer.js', show: false }],
    images: ['/assets/projects/mykit.svg'],
    links: [{ type: 'github', title: 'Mykit Github 저장소 링크', href: 'https://github.com/seungjoonH/mykit' }],
    sections: [
      {
        title: '**기술 스택별 AI 에이전트 규칙 파일 자동 생성 CLI 개발**',
        items: [
          '프로젝트마다 규칙 수동 작성으로 세팅 비용 과다, 단일 합본 구조로 **토큰 낭비** 반복 경험',
          '에이전트 행동 제어용 **규칙 파일 기반 워크플로우** 설계, 기술 스택별 규칙 문서 선택 생성 CLI 개발',
          'Codex/Claude/Cursor 등 AI별 규칙 파일 자동 생성, 필요한 문서만 탐색하도록 **인덱스 구조화**',
        ],
      },
      {
        title: '**Codex/Claude Code 두 에이전트로 지침 분할 로딩 vs 단일 파일 전체 로딩 조건에서 교차 실험**',
        items: [
          '분할 로딩 방식이 정적 지침 컨텍스트를 Codex 기준 **56%**, Claude 기준 **72%** 절감',
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
    status: 'maintained',
    period: { start: '2025-11', end: 'present' },
    summary: 'AI 기반 Git 협업 자동화 CLI',
    tags: ['CLI', '바이브코딩', 'AI활용', '배포', '유지보수'],
    techStack: ['Javascript', { name: 'Node.js', show: false }],
    links: [
      { type: 'npm', title: 'npm 배포 링크', href: 'https://www.npmjs.com/package/acommit' },
      { type: 'github', title: 'Acommit Github 저장소 링크', href: 'https://github.com/seungjoonH/acommit' },
    ],
    sections: [
      {
        title: '**AI 커밋 메시지 자동 생성 CLI 개발 및 npm 오픈소스 배포, 기능 추가 및 성능 개선, 유지보수 중**',
        items: [],
      },
      {
        title: '**LLM 출력 품질 정량 측정 기반 반복 개선**',
        items: [
          '태그 포맷, 언어, 그룹화, 실제 커밋 시나리오 등 설정 준수 여부를 검증하는 **22개 테스트 케이스 설계**',
          '규칙 기반 자동/수동 두 채점 방식으로 품질 검증, 케이스당 5회 반복 측정으로 신뢰도 확보',
          '채점 결과로 실패 항목 특정 후 프롬프트 및 설정 개선 반복, v0.3.1 기준 **오류율 35% → 0% 달성**',
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
    status: 'maintained',
    period: { start: '2024-11', end: 'present' },
    summary: 'Dart 기반 경량 유틸리티 확장 패키지',
    tags: [
      '오픈소스',
      'pub.dev',
      '배포',
      '라이브러리',
      '유지보수',
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
    techStack: ['Dart'],
    links: [
      { type: 'pubdev', title: 'pub.dev 배포 링크', href: 'https://pub.dev/packages/extify' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/extify' },
    ],
    sections: [
      {
        title: '**패키지 설계**: 반복 유틸 로직 통합',
        items: [
          '서로 다른 프로젝트에서 반복적으로 구현되는 유틸리티 로직의 비효율을 해결하기 위해, 자주 사용되는 핵심 기능을 하나로 모아 직접 설계하고 배포한 Dart 전용 패키지',
        ],
      },
      {
        title: '**핵심 기능 구현**: 한글 조사, 자모 분리, 문자열 변환',
        items: [
          {
            title: '한글 조사 자동 처리 및 자모 분리',
            items: ['"은/는", "이/가" 등 까다로운 한국어 조사 규칙을 자동화하고, 초성/중성/종성 분리 및 조합 로직 구현 및 문서화'],
            links: [{ type: 'doc', id: 'flutter-hangeul' }],
          },
          {
            title: '문자열 케이스 변환기',
            items: ['snake_case, camelCase, PascalCase 등 다양한 명명 규칙 간의 상호 변환 기능 구현 및 문서화'],
            links: [{ type: 'doc', id: 'flutter-string-case-converter' }],
          },
        ],
      },
      {
        title: '**패키지 배포 및 운영**: pub.dev 오픈소스 공개',
        items: [
          '**pub.dev 공식 패키지 오픈소스 배포**를 통해 누구나 pubspec.yaml 설정으로 쉽게 설치 가능',
          '**프로젝트 간 반복되는 코드**를 최소화',
          '외부에서 신뢰할 만한 수준의 라이브러리 설계 및 관리 프로세스 경험',
        ],
      },
    ],
  },
  {
    id: 'hgu-glocal',
    teamSize: 4,
    hidden: true,
    type: 'group',
    title: '한동대학교 글로컬 홈페이지',
    status: 'support-ended',
    period: { start: '2025-02', end: '2025-08' },
    summary: '한동대학교 공식 글로컬 홈페이지 (Legacy)',
    tags: [
      '공식홈페이지',
      '반응형',
      '다국어',
      '게시판',
      '파일업로드',
    ],
    techStack: [
      'Typescript',
      'Next.js',
      'SpringBoot',
      'JPA',
      'PostgreSQL',
      'AWS',
      'S3',
      'Docker',
      { name: 'JWT', show: false },
      { name: 'React', show: false },
      { name: 'GitHub Actions', show: false },
      { name: 'Terraform', show: false },
      { name: 'EC2', show: false },
      { name: 'RDS', show: false },
      { name: 'Swagger', show: false },
      { name: 'Google OAuth', show: false },
    ],
    links: [
      { type: 'deploy', title: '서비스 링크', href: 'https://glocal.handong.edu' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/D-Moong' },
    ],
    sections: [
      {
        title: '**학교 공식 홈페이지 개발**: 실제 운영 환경 배포 경험',
        items: [
          '학교 측의 공식 의뢰를 받아 **글로컬대학 공식 홈페이지를 단독 개발**하고 실제 학교 도메인에 배포하여 운영',
          '프론트엔드(`Next.js`)와 백엔드(`Spring Boot`)를 직접 연동하고, 게시판/공지/자료실 등 **학교 홈페이지형 서비스 구조**를 구현',
          '학교 측 피드백을 반영하며 기능을 지속적으로 개선',
        ],
      },
      {
        title: '**반응형 레이아웃 설계**: 디바이스별 화면 대응',
        items: [
          '데스크탑, 태블릿, 모바일에서 콘텐츠가 깨지지 않도록 **반응형 레이아웃 구조**를 설계',
          '`useResponsive` 훅을 구현해 `width`, `height`, `status(desktop/tablet/mobile)`를 추적하고, 리사이즈 이벤트에 따라 상태를 갱신하도록 구성',
          'UI 구조가 동일한 영역은 **CSS 클래스 조합 방식**으로 대응하고, 구조 자체가 달라지는 영역은 **디바이스별 컴포넌트 분기 방식**으로 처리',
          '이를 통해 다양한 화면 크기에서도 **일관된 UI/UX와 안정적인 렌더링**을 제공',
        ],
        links: [{ type: 'doc', id: 'web-responsive' }],
      },
      {
        title: '**다국어 지원**: i18n 기반 언어 전환 구조 구현',
        items: [
          '글로벌 사용자를 고려해 한국어와 영어를 모두 지원하는 **다국어 웹 구조**를 구현',
          '`useLanguage` 훅을 구성해 초기 언어를 저장소에서 불러오고, `switchLanguage()` / `toggleLanguage()`로 언어 전환을 제어',
          '`react-i18next`와 연동하여 일반 문자열뿐 아니라 **개행이 포함된 텍스트와 객체형 번역 데이터**까지 자연스럽게 렌더링할 수 있도록 처리',
          '언어 전환 시 홈 화면과 주요 UI 텍스트가 일관되게 바뀌도록 설계하여 **국문/영문 사용자 경험을 모두 확보**',
        ],
        links: [{ type: 'external', title: '관련 포스트', href: 'https://seungjoonh.tistory.com/entry/web-i18n' }],
      },
      {
        title: '**게시판 및 자료실 구현**: AWS S3 기반 파일 업로드 처리',
        items: [
          '공지사항, 자료실 등 **게시판형 콘텐츠 관리 기능**을 구현하여 학교 측이 직접 콘텐츠를 운영할 수 있도록 구성',
          '자료실 첨부파일 업로드를 위해 **AWS S3 기반 파일 저장 구조**를 적용하고, 업로드된 파일을 게시글과 연계해 조회 가능하도록 설계',
          '정적 자산과 첨부파일을 분리 관리해 서버 저장소 의존도를 낮추고, 실제 운영 환경에서 파일 관리의 안정성을 확보',
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
    status: 'contribution-ended',
    period: { start: '2024-09', end: '2024-12' },
    summary: '소상공인 통합 물류 고도화 웹 서비스 유지보수',
    tags: ['유지보수', 'Flutter Web', '프론트엔드'],
    techStack: ['Flutter', 'Dart'],
    links: [
      { type: 'external', title: 'Foodrain 서비스', href: 'https://foodrain.com/main' },
    ],
    sections: [
      {
        title: '**사용자 웹 유지보수**: 기능 추가 및 UI 개선',
        items: [
          '**Flutter Web** 기반 Frontend 개발',
          '신규 UI/UX 화면 개발 및 성능 개선',
          'Backend API 연동 및 Client 요구사항 반영',
        ],
      },
      {
        title: '**관리자 웹 유지보수**: 기능 추가 및 UI 개선',
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
    status: 'support-ended',
    period: { start: '2022-07', end: '2023-12' },
    summary: 'AI 모션 인식과 게임 요소를 활용한 운동 동기부여 어플리케이션',
    tags: ['기획', '개발', '출시', '버전관리'],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    links: [
      { type: 'appstore', title: 'App Store 링크', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
      { type: 'github', title: 'Github 저장소 링크', href: 'https://github.com/seungjoonH/fitween' },
    ],
    sections: [
      {
        title: '**디자인 스프린트 수행**: 제품 리스크 최소화',
        items: [
          '실제 앱 기능을 **프로토타입으로 구현하고 UT를 통해 검증**',
          '실시간 자세 피드백에 대한 사용자 니즈 및 피드백 수집',
          '불필요한 기능 제외 및 핵심 개발 우선순위 확정',
        ],
        links: [{ type: 'doc', id: 'fitween-design-sprint' }],
      },
      {
        title: '**모션 인식 기능 구현**: TensorFlow MoveNet 기술 도입',
        items: [
          '다리 골격의 각도 및 움직임을 실시간 추적하는 Pose Estimation 기술 적용',
          'Flutter 공식 라이브러리 부재, **유지보수가 중단된 오픈소스를 직접 분석**하고 프로젝트 사양에 맞춰 재가공, 해당 과정 문서화',
        ],
        links: [{ type: 'doc', id: 'movenet-flutter' }],
      },
      {
        title: '**UI 컴포넌트 개발**: 패키지 부재에 따른 자체 구현',
        items: [
          '디자인 명세를 충실히 반영하기 위해 Circular Carousel 위젯을 직접 개발',
          '해당 개발 과정을 문서화',
        ],
        links: [{ type: 'doc', id: 'flutter-circular-carousel' }],
      },
    ],
  },
  {
    id: '3d-renderer',
    teamSize: 1,
    hidden: false,
    type: 'toy',
    title: '3D Renderer',
    status: 'ended',
    period: { start: '2024-05', end: '2024-05' },
    summary: '3차원 공간의 도형을 2차원 화면에 투영하는 방식을 Python 으로 직접 구현해본 3D 렌더링 실험 프로젝트',
    tags: ['그래픽스', '수학', '렌더링엔진', '단독기획'],
    techStack: ['Python', 'Pygame', 'Numpy'],
    links: [
      { type: 'github', title: '3D Renderer Github 저장소 링크', href: 'https://github.com/seungjoonH/3d-renderer' },
    ],
    sections: [
      {
        title: '**렌더링 엔진 구현**: 3D → 2D 화면 변환 파이프라인 설계',
        items: [
          'Unity, OpenGL 등의 엔진 없이 **공간 좌표가 카메라를 거쳐 화면의 평면 좌표로 바뀌는 원리를 학습 및 구현**',
          '카메라 위치($V$)와 물체 좌표($A$)로 시선(직선 $\\overrightarrow{VA}$)을 정의하고, 벡터 연산 및 평면 방정식으로 **사영 평면과의 교점을 구해 화면 좌표로 변환하는 파이프라인 구성**',
        ],
        links: [{ type: 'doc', id: 'project-3d-renderer' }],
      },
      {
        title: '**카메라 시스템 구현**: 실시간 시점 제어 및 3차원 이동',
        items: [
          '마우스 입력을 기반으로 **시선 벡터 회전을 계산하여 자유로운 카메라 시점 제어 시스템 구현**',
          'WASD 및 수직 이동 키를 활용해 **3차원 공간을 자유롭게 탐색할 수 있는 이동 로직 구현**',
          '벡터 기반 이동과 회전 계산을 통해 **FPS 스타일의 카메라 조작 경험 구현**',
        ],
      },
      {
        title: '**렌더링 구조 설계**: 벡터 연산 기반 좌표 계산',
        items: [
          'numpy 를 활용해 **벡터 내적 기반의 화면 좌표 계산 로직 구현**',
          '화면 좌표계 단위벡터($i\'$, $j\'$)를 정의하고 **사영된 점을 화면 좌표로 변환하는 구조 설계**',
          '그래픽 엔진 내부 동작을 이해하기 위해 **렌더링의 기초 수학 구조를 직접 구현하고 실험**',
        ],
      },
    ],
  },
];

export default projects;