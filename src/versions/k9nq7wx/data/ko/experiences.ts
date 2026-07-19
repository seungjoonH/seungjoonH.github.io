// 한국어 Experience 섹션 경력 데이터
import commonExperiences from '../../../../data/ko/experiences.ts';

const boostcampSections = [
  {
    title: 'Express 기반 SSR/CSR 구조 구현 및 비교',
    items: [
      'EJS 템플릿 기반 SSR과 정적 서빙 + REST API 기반 CSR 구조를 각각 직접 구현하여 렌더링 책임 분리 방식 비교',
      '세션 미들웨어, 인증 라우팅, 정적 파일 서빙 등 Express 서버 구성 요소 직접 작성',
    ],
  },
  {
    title: 'Vanilla JS로 SPA 핵심 구조 직접 구현',
    items: [
      'History API 기반 클라이언트 라우팅, 선언적 DOM 조립 헬퍼, Observer 패턴 전역 Store를 외부 라이브러리 없이 구현',
    ],
  },
  {
    title: 'NestJS 기반 REST API 및 WebSocket 서버 설계',
    items: [
      'Controller/Service/Repository 계층 분리 구조로 REST API 설계 및 구현',
      'WebSocket Gateway로 실시간 이벤트 처리 구현',
      'TypeORM 기반 MySQL ERD 설계 및 연동, Redis Hash/Set/ZSet 자료구조 기반 실시간 데이터 구조 설계 및 연동',
    ],
  },
  {
    title: 'Next.js 15 App Router 기반 프론트엔드 구성',
    items: [
      'RSC에서 generateMetadata와 서버 전용 HTTP 경로로 SEO/OG 메타 생성 및 크롤링 정책 설정',
      "실시간/상태/소켓이 필요한 영역은 'use client'로 분리하여 서버/클라이언트 컴포넌트 역할 구분",
    ],
  },
  {
    title: 'Vitest/Playwright 기반 테스트 작성',
    items: [
      'Vitest로 유틸 함수 및 서비스 레이어 단위 테스트 작성',
      'Playwright로 주요 사용자 플로우 E2E 테스트 작성',
      'MSW로 개발 환경 API 목킹 적용, RSC 환경에서의 호환 이슈 대응 경험',
    ],
  },
  {
    title: 'Docker/CI-CD 및 클라우드 배포',
    items: [
      'Docker Compose 기반 개발 환경 통일 및 GitHub Actions를 활용한 CI/CD 파이프라인 구축',
      'AWS EC2 및 NCP 환경에서 서버 배포 경험',
    ],
  },
];

const experiences = commonExperiences.map((experience) => {
  if (experience?.id !== 'naver-boostcamp') return experience;
  return {
    ...experience,
    details: {
      ...(experience.details || {}),
      sections: boostcampSections,
    },
  };
});

export default experiences;
