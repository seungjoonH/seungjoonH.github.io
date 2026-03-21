const experiences = [
  { 
    id: 'fitween', 
    company: '피트윈',
    position: '사원', 
    startDate: '2023-06-01', 
    endDate: '2023-12-31',
    shortcut: '#fitween',
    projectSearchQuery: 'title:Fitween show:all',
    details: {
      sections: [
        {
          title: 'Fitween 앱 출시 및 버전 릴리즈 관리',
          items: [
            '**피트니스 기록 및 관리 서비스 Fitween 앱 개발 총괄**',
            '**v1.0 출시 이후 기능 개선 및 안정화 작업 진행**',
            '서비스 업데이트에 따른 **버전 릴리즈 관리 및 릴리즈 노트 작성**',
            '성능 개선 및 코드 구조 정리를 위한 **리팩토링 진행**'
          ],
          links: [
            { type: 'appstore', title: 'Fitween 앱 다운로드', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
            { type: 'notion', title: 'Fitween 고객지원', href: 'https://fitween.notion.site/Fitween-8bef341ef8904eed894c79b259903675?pvs=74' },
            { type: 'notion', title: 'Fitween 릴리즈 노트', href: 'https://fitween.notion.site/aa14492c494943ad803d15d30cb0b34b' },
          ],
        },
        {
          title: '정부 및 민간 창업 지원 사업 출전',
          items: [
            '중소벤처기업부 주관 창업중심대학 프로그램 선정',
            '과학기술정보통신부 주관 I-Corps (아이코어) 실험실창업탐색팀 선정',
          ],
          links: [
            { type: 'news', title: '한동대 2개 창업팀, 예비창업패키지 선발 - 경상매일신문', href: 'https://www.ksmnews.co.kr/news/view.php?idx=427141' },
          ],
        },
      ]
    }
  },
  { 
    id: 'software-factory', 
    company: '소프트웨어팩토리', 
    position: '인턴', 
    startDate: '2024-08-20', 
    endDate: '2024-12-31',
    shortcut: '#foodrain',
    projectSearchQuery: 'title:"Foodrain" | title:"Extify" show:all',
    links: [
      { type: 'external', title: 'Foodrain 서비스', href: 'https://foodrain.com/main' },
    ],
    details: {
      sections: [
        {
          title: 'Foodrain 사용자/관리자 웹 유지보수',
          items: [
            '**Flutter Web 기반 프론트엔드 개발**',
            '사용자 및 관리자용 웹 **신규 UI/UX 화면 개발 및 기능 개선**',
            '백엔드 API 연동 및 **클라이언트 요구사항 반영**',
            '서비스 운영 과정에서 발생한 **버그 수정 및 성능 개선**'
          ],
          links: [
            { type: 'external', title: 'Foodrain 서비스', href: 'https://foodrain.com/main' },
          ],
        },
        {
          title: '사내 공통 유틸리티 Flutter 패키지 개발',
          items: [
            '사내 프로젝트에서 공통적으로 사용하는 **유틸리티 기능을 패키지 형태로 모듈화**',
            '**Flutter Package 구조 설계 및 기능 구현**',
            '재사용 가능한 형태로 **Github Repository 구성 및 관리**'
          ]
        }
      ]
    } 
  },
  { 
    id: 'naver-boostcamp', 
    company: '네이버 부스트캠프 10기', 
    position: '웹 풀스택', 
    startDate: '2025-06-23', 
    endDate: '2026-02-06', 
    shortcut: '#mbwt',
    projectSearchQuery: 'title:"물방울톡" show:all',
    details: {
      sections: [
        {
          title: 'Vanilla JS 의 명령형 DOM 조작부터 React 의 선언적 렌더링까지 이어지는 DOM 렌더링 흐름 이해',
          items: [
            'Vanilla JS 명령형 DOM 조립 과정에서 UI 계층 구조가 코드 흐름에 묻히는 가독성 문제 경험',
            'DOM 생성 로직을 자체 제작 헬퍼 함수로 캡슐화하여 선언적 UI 표현 방식으로 개선',
            'Vite 빌드 파일을 분석하며 JSX가 jsx / jsxs 함수 호출 형태로 변환되는 구조 확인',
          ],
          links: [
            { type: 'tistory', title: '[Web] 여러 방식으로 DOM 조작하기 - createElement 에서 JSX 까지', href: 'https://seungjoonh.tistory.com/entry/web-dom' },
          ],
        },
        {
          title: 'Vanilla JS Store 부터 Zustand 까지 이어지는 상태 관리 흐름 이해',
          items: [
            'Vanilla JS 환경에서 UI 상태 관리 필요성을 경험하며 Observer 패턴 기반 Store 구조 구현',
            '상태 변경 → 구독 → DOM 갱신으로 이어지는 단방향 업데이트 흐름 구성',
            'Store 구현 방식을 객체 / 클래스 / 클로저 형태로 비교하고, Zustand의 클로저 기반 Store 구조와 selector 기반 구독 방식까지 흐름 확장',
          ],
          links: [
            { type: 'tistory', title: '[Web] Observer 패턴과 Store - 직접 구현하며 이해한 상태 관리', href: 'https://seungjoonh.tistory.com/entry/web-observer-store' },
          ],
        },
      ],
    },
  },
];

export default experiences;