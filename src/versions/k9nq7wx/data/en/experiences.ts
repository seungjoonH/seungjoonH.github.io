// 영문 Experience 섹션 경력 데이터
import commonExperiences from '../../../../data/en/experiences.ts';

const boostcampSections = [
  {
    title: 'SSR vs CSR with Express - hands-on comparison',
    items: [
      'Built both EJS-based SSR and static-serving + REST API-based CSR from scratch to compare how rendering responsibility is split between server and client',
      'Hand-rolled core Express server pieces: session middleware, auth routing, and static file serving',
    ],
  },
  {
    title: 'SPA core architecture from scratch in Vanilla JS',
    items: [
      'Built History API-based client-side routing, declarative DOM assembly helpers, and an Observer-pattern global store - all without touching any external libraries',
    ],
  },
  {
    title: 'REST API and WebSocket server design with NestJS',
    items: [
      'Designed and implemented REST APIs following a clean Controller/Service/Repository layered architecture',
      'Handled real-time event processing via WebSocket Gateway',
      'Designed MySQL schemas with TypeORM and modeled real-time data structures using Redis Hash, Set, and ZSet',
    ],
  },
  {
    title: 'Frontend architecture with Next.js 15 App Router',
    items: [
      'Handled SEO/OG metadata and crawling policy setup in RSC using generateMetadata and server-only HTTP routes',
      "Kept real-time, stateful, and socket-heavy logic in 'use client' components to maintain a clear boundary between server and client rendering",
    ],
  },
  {
    title: 'Testing with Vitest and Playwright',
    items: [
      'Wrote unit tests for utility functions and service-layer logic with Vitest',
      'Covered key user flows with E2E tests in Playwright',
      'Set up API mocking with MSW for local development and worked through RSC compatibility issues',
    ],
  },
  {
    title: 'Docker, CI/CD, and cloud deployment',
    items: [
      'Unified local dev environments with Docker Compose and set up CI/CD pipelines via GitHub Actions',
      'Deployed and managed servers on AWS EC2 and NCP',
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