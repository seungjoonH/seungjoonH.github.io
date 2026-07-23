// 영문 Project 섹션 프로젝트 데이터
const projects = [
  {
    id: 'mbwt',
    teamSize: 4,
    hidden: false,
    type: 'group',
    title: 'Moolbangwool Talk',
    status: 'live',
    period: { start: '2025-12', end: '2026-02' },
    summary:
      'A real-time voice social service that starts with light minigames and flows naturally into conversation',
    tags: [
      'naver-boostcamp',
      'voice-chat',
      'design',
      'planning',
      'real-time-communication',
      { name: 'real-time-game', show: false },
      { name: 'social', show: false },
      { name: 'testing', show: false },
      { name: 'ci-cd', show: false },
      { name: 'optimization', show: false },
      { name: 'oauth', show: false },
      { name: 'jwt', show: false },
      { name: 'full-stack', show: false },
      { name: 'monorepo', show: false },
    ],
    techStack: [
      'Next.js',
      'NestJS',
      'Socket.io',
      'TypeORM',
      'MySQL',
      'Redis',
      'Zustand',
      'Playwright',
      'Vitest',
      'Docker',
      'GitHub Actions',
      'NCP',
      { name: 'Typescript', show: false },
      { name: 'React', show: false },
      { name: 'Node.js', show: false },
      { name: 'mediasoup', show: false },
      { name: 'WebRTC', show: false },
      { name: 'Passport', show: false },
      { name: 'Jest', show: false },
    ],
    links: [
      { type: 'deploy', title: 'Web', href: 'https://moolbangwool.duckdns.org/home' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/boostcampwm2025/web26-2Ryuk' },
      { type: 'notion', title: 'Patch notes', href: 'https://rapid-bubble-113.notion.site/2fe207f233418064a95be845fe26ec3e' },
    ],
    sections: [
      {
        title:
          '**Draggable floating chat panel**, position control via custom hook, Zustand Persist for coordinate restoration',
        items: [
          'Extracted drag, edge clamping, and pointer events into a custom hook so components stay focused on rendering',
          'Classified position changes into three causes — drag, resize correction, and panel expansion correction — and selectively persisted coordinates to Zustand based on the cause',
          'When expansion pushed the panel off-screen, skipped persisting the corrected coordinates so collapsing the panel restores the original position',
        ],
        links: [{ type: 'doc', id: 'floating-component-spec' }],
      },
      {
        title:
          '**Playwright and socket.io load testing** to optimize game input and rendering',
        items: [
          'Identified that broadcasting every input to N clients could cause received event counts to grow at O(N²)',
          'Reproduced 10 concurrent players using Playwright and socket.io-client, then measured bottlenecks with FPS logs and Chrome Performance profiling',
          'Batched client input into 100ms windows before sending, and had the server broadcast scores and rankings on a fixed 300ms interval',
          'Reduced client received events from **~2,937/s to 32/s**, improved average FPS from **30.7 to 60.5**, and reduced broadcast complexity from **O(N²) to O(N)**',
        ],
        links: [{ type: 'doc', id: 'rendering-optimization-input-burst' }],
      },
      {
        title: '**Real-time chat** with NestJS WebSocket Gateway',
        items: [
          'Joined and left Socket.io rooms on room enter/exit to keep broadcasts room-scoped and minimize global propagation',
          'Validated JWT on handshake and checked room membership before allowing message sends; applied profanity filtering and stored the last 30 messages in Redis for reconnect restoration',
          'Used the Redis Adapter to keep room membership and events synchronized across multiple instances',
        ],
      },
      {
        title:
          '**Docker Compose** for unified local and production environments, GitHub Actions build pipeline, NCP VPC network separation',
        items: [
          'Ran Server, Client, Redis, and MySQL in a single Docker Compose configuration; separated MySQL into a Private Subnet in production',
          'Built images in GitHub Actions, pushed to Docker Hub, and deployed by pulling on production servers inside NCP VPC',
          'Placed the web tier in a Public Subnet and MySQL in a Private Subnet to avoid exposing the database directly to the internet',
        ],
        links: [{ type: 'doc', id: 'mbwt-service-architecture' }],
      },
    ],
  },
  {
    id: 'portfolio',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'Portfolio',
    status: 'maintained',
    period: { start: '2026-03', end: 'present' },
    summary: 'A personal portfolio website incorporating structured data, search UX, accessibility, internationalization, and interactive design',
    tags: [
      'responsive',
      'search',
      'ux',
      'accessibility',
      'i18n',
      { name: 'interaction', show: false },
      { name: 'theme-switching', show: false },
      { name: 'tooltip', show: false },
      { name: 'aria', show: false },
      { name: 'light-mode', show: false },
      { name: 'dark-mode', show: false },
      { name: 'semantic', show: false },
      { name: 'animation', show: false },
      { name: 'screen-reader', show: false },
      { name: 'font-scale', show: false },
      { name: 'i18next', show: false },
      { name: 'wcag', show: false },
      { name: 'css', show: false },
    ],
    techStack: ['Javascript', 'React'],
    links: [
      { type: 'deploy', title: 'Web', href: 'https://seungjoonh.github.io' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/seungjoonH.github.io' },
    ],
    sections: [
      {
        title: '**Accessibility**: semantic structure and ARIA design',
        items: [
          'Built page structure with **semantic tags** (`header`, `nav`, `main`, `section`, `article`) and filled gaps with **ARIA roles, names, and states**. Reviewed unclear copy firsthand and aligned **screen reader announcements and focus order** with the visual UI',
          'Managed **light/dark mode** state globally via `useConfigStore` and applied a **consistent design system** using grouped **CSS variable sets** per mode',
          'Exposed a **Font Scale** setting and used `clamp` / `cq` so the **layout holds even when text size is cranked up**',
        ],
        links: [{ type: 'doc', id: 'portfolio-accessibility-design' }],
      },
      {
        title: '**User experience**: user-friendly UI/UX',
        items: [
          'Added **tooltips** on non-obvious UI to nudge users toward the next action or the right setting',
          'Gave buttons, links, and inputs clear labels and helper text so their **purpose is obvious at a glance**, with `title` and ARIA for added context',
        ],
      },
      {
        title: '**Responsive layout**: breakpoint-based adaptation',
        items: [
          'Defined **four breakpoints — mobile, tablet, desktop, and wide** — with grid columns and typography tuned so nothing breaks at any size',
          'Built a `useResponsive` hook to track the active breakpoint and apply it to **grid column counts and visible tag/stack counts inside cards**',
        ],
        links: [{ type: 'doc', id: 'portfolio-responsive-design' }],
      },
      {
        title: '**Project search**: Hangul jamo decomposition and choseong matching',
        searchChip: { label: 'Extify', searchQuery: 'title:Extify show:all' },
        items: [
          'Ported **Hangul jamo decomposition and choseong matching algorithms** into JavaScript to enable typo-tolerant search UX',
          'Layered on query normalization, stack/tag alias mapping, and result highlighting to make **results easy to find and scan**',
        ],
      },
      {
        title: '**Multilingual support**: react-i18next resource structure',
        items: [
          'Loaded UI strings via `react-i18next` and split **domain data (projects, experiences, etc.) into `ko` / `en` directories** under a shared schema',
          'Used consistent key naming and `{{variable}}` interpolation for dynamic values, and grouped accessibility-only copy under an **`a11y` subtree** so screen reader text tracks the active language',
        ],
      },
      {
        title: '**Interactions**: animation-driven feedback',
        items: [
          'Added scroll-based **fade-in/out** for a sense of progress, and set up **parallax scrolling** in the hero section',
          'Wired header nav buttons to trigger **smooth scrolling** to each section',
          'Built a **card flip animation** on hover/focus and added modal **transition animations** for snappy feedback on both mouse and keyboard interactions',
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
    summary: 'An AI-powered CLI tool for automating Git collaboration workflows',
    tags: [
      'open-source',
      'npm',
      'git',
      'cli',
      'collaboration-tool',
      { name: 'commit-messages', show: false },
      { name: 'ai', show: false },
      { name: 'automation', show: false },
      { name: 'solo-planning', show: false },
      { name: 'vibe-coding', show: false },
      { name: 'pain-point-driven', show: false },
      { name: 'maintenance', show: false },
      { name: 'release', show: false },
    ],
    techStack: ['Javascript', 'Node.js'],
    links: [
      { type: 'npm', title: 'npm', href: 'https://www.npmjs.com/package/acommit' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/acommit' },
    ],
    sections: [
      {
        title: '**CLI design and implementation**: automatic commit message generation from git diff',
        items: [
          'Built a CLI that analyzes git diff to auto-generate commit messages, solving the difficulty of splitting large change sets into meaningful commits and maintaining consistent team conventions',
          'Delivered the full pipeline — from multi-LLM integration to CLI publication — through **vibe coding grounded in detailed upfront planning**',
        ],
      },
      {
        title: '**Automation architecture**: extensibility through user-defined rules',
        items: [
          'Designed the tool to read team commit conventions from `rules.yml` and generate **commit messages that conform to those rules**',
          'Analyzed changed files from git diff and designed **five grouping strategies** — including similarity, tags, and directory structure — to automatically form sensible commit units',
          'Supported both OpenAI and Gemini, with token limits and other LLM settings configurable directly in `rules.yml`',
        ],
      },
      {
        title: '**npm package release**: adopted in real projects',
        items: [
          'Published as an **official npm package** so anyone can install and use the CLI with a single command',
          'Applied it directly in ongoing development to automate commit message writing and change summarization, and **noticed a clear improvement in commit workflow speed**',
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
    summary: 'A lightweight Dart utility extension package',
    tags: [
      'open-source',
      'pub.dev',
      'release',
      'library',
      { name: 'maintenance', show: false },
      { name: 'solo-planning', show: false },
      { name: 'lightweight-utilities', show: false },
      { name: 'jamo-decomposition', show: false },
      { name: 'syllable-composition', show: false },
      { name: 'korean-particles', show: false },
      { name: 'string-processing', show: false },
      { name: 'testing', show: false },
      { name: 'personal-project', show: false },
      { name: 'pain-point-driven', show: false },
    ],
    techStack: ['Dart'],
    links: [
      { type: 'pubdev', title: 'pub.dev', href: 'https://pub.dev/packages/extify' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/extify' },
    ],
    sections: [
      {
        title: '**Package design**: consolidating repeated utility logic',
        items: [
          'Designed and published a Dart-specific package that bundles frequently used core utilities, eliminating the need to reimplement the same logic across different projects',
        ],
      },
      {
        title: '**Core feature implementation**: Korean particles, jamo processing, and string transformation',
        items: [
          {
            title: 'Automatic Korean particle handling and jamo decomposition',
            items: ['Automated complex Korean particle selection rules such as "eun/neun" and "i/ga", and implemented and documented choseong/jungseong/jongseong decomposition and composition logic'],
            links: [{ type: 'doc', id: 'flutter-hangeul' }],
          },
          {
            title: 'String case converter',
            items: ['Implemented and documented bidirectional conversion across naming conventions including snake_case, camelCase, and PascalCase'],
            links: [{ type: 'doc', id: 'flutter-string-case-converter' }],
          },
        ],
      },
      {
        title: '**Package release and maintenance**: open-source publication on pub.dev',
        items: [
          '**Published as an open-source package on pub.dev**, installable by anyone via `pubspec.yaml`',
          '**Reduced repeated boilerplate across projects**',
          'Gained experience designing and maintaining a library to a standard that external users can rely on',
        ],
      },
    ],
  },
  {
    id: 'hgu-glocal',
    teamSize: 4,
    hidden: true,
    type: 'group',
    title: 'Handong Glocal Website',
    status: 'support-ended',
    period: { start: '2025-02', end: '2025-08' },
    summary: 'Official Glocal University website built under a direct commission from Handong University (Legacy)',
    tags: [
      'official-site',
      'responsive',
      'i18n',
      'board',
      'file-upload',
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
      { type: 'deploy', title: 'Web', href: 'https://glocal.handong.edu' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/D-Moong' },
    ],
    sections: [
      {
        title: '**Official website development**: production deployment for a university',
        items: [
          'Built the **official Glocal University website as a solo developer** under a direct commission from the university and deployed it to the university\'s production domain',
          'Integrated the frontend (`Next.js`) and backend (`Spring Boot`) end-to-end and implemented a **university website structure** covering boards, notices, and resource sections',
          'Iterated on features continuously by incorporating feedback from the university',
        ],
      },
      {
        title: '**Responsive layout design**: device-aware screen adaptation',
        items: [
          'Designed a **responsive layout structure** to keep content intact across desktop, tablet, and mobile',
          'Implemented a `useResponsive` hook to track `width`, `height`, and `status (desktop/tablet/mobile)`, updating state on resize events',
          'Applied **CSS class composition** where the UI structure was shared across breakpoints, and **device-specific component branching** where the structure itself differed',
          'Delivered **consistent UI/UX and stable rendering** across a wide range of screen sizes',
        ],
        links: [{ type: 'doc', id: 'web-responsive' }],
      },
      {
        title: '**Internationalization**: i18n-based language switching',
        items: [
          'Implemented a **bilingual structure supporting Korean and English** for a global audience',
          'Built a `useLanguage` hook to load the initial language from storage and control switching via `switchLanguage()` / `toggleLanguage()`',
          'Integrated `react-i18next` to handle not only plain strings but also **multiline text and object-based translation data**',
          'Ensured the home screen and primary UI text stay in sync on language change, providing a **consistent experience in both Korean and English**',
        ],
        links: [{ type: 'external', title: 'Related post', href: 'https://seungjoonh.tistory.com/entry/web-i18n' }],
      },
      {
        title: '**Boards and resource sections**: AWS S3-based file upload handling',
        items: [
          'Implemented **board-style content management** — notices, resource sections, and more — so the university could manage content directly',
          'Applied an **AWS S3-based file storage structure** for resource uploads, linking uploaded files to posts for retrieval and download',
          'Separated static assets from attachments to reduce server storage dependency and ensure reliable file management in production',
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
    summary: 'Maintenance of an integrated logistics web service for small business owners',
    tags: ['maintenance', 'flutter-web', 'frontend'],
    techStack: ['Flutter', 'Dart'],
    links: [
      { type: 'external', title: 'Foodrain service', href: 'https://foodrain.com/main' },
    ],
    sections: [
      {
        title: '**User web maintenance**: feature additions and UI improvements',
        items: [
          '**Flutter Web** frontend development',
          'Built new UI/UX screens and improved performance',
          'Integrated backend APIs and reflected client requirements',
        ],
      },
      {
        title: '**Admin web maintenance**: feature additions and UI improvements',
        items: [
          '**Flutter Web** frontend development',
          'Built new UI/UX screens and improved performance',
          'Integrated backend APIs and reflected client requirements',
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
    summary: 'A fitness motivation app combining AI motion recognition with game mechanics',
    tags: ['planning', 'development', 'release', 'version-control'],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    links: [
      { type: 'appstore', title: 'App Store', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/fitween' },
    ],
    sections: [
      {
        title: '**Design sprint**: minimizing product risk',
        items: [
          '**Prototyped real app features and validated them through user testing**',
          'Collected user needs and feedback on real-time pose feedback',
          'Cut unnecessary features and finalized development priorities for the core experience',
        ],
        links: [{ type: 'doc', id: 'fitween-design-sprint' }],
      },
      {
        title: '**Motion recognition**: adopting TensorFlow MoveNet',
        items: [
          'Applied pose estimation to track leg skeletal angles and movement in real time',
          'With no official Flutter library available, **analyzed an unmaintained open-source project directly**, adapted it to fit project requirements, and documented the process',
        ],
        links: [{ type: 'doc', id: 'movenet-flutter' }],
      },
      {
        title: '**UI component development**: custom implementation due to missing packages',
        items: [
          'Built a Circular Carousel widget from scratch to faithfully match the design specification',
          'Documented the implementation process',
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
    summary: 'An experimental project implementing 3D-to-2D projection from scratch in Python, without relying on any graphics engine',
    tags: ['graphics', 'math', 'rendering-engine', 'solo-planning'],
    techStack: ['Python', 'Pygame', 'Numpy'],
    links: [
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/3d-renderer' },
    ],
    sections: [
      {
        title: '**Rendering engine**: designing a 3D → 2D projection pipeline',
        items: [
          'Studied and implemented **the principle of transforming spatial coordinates into 2D screen coordinates through a camera** without using Unity, OpenGL, or any other engine',
          'Defined the ray from camera position ($V$) through object coordinate ($A$), then built a pipeline that **finds the intersection with the projection plane using vector math and the plane equation, and converts it into screen coordinates**',
        ],
        links: [{ type: 'doc', id: 'project-3d-renderer' }],
      },
      {
        title: '**Camera system**: real-time view control and 3D movement',
        items: [
          'Implemented free camera control by computing **view vector rotation from mouse input**',
          'Implemented movement through **3D space using WASD and vertical movement keys**',
          'Delivered an **FPS-style camera control experience** through vector-based movement and rotation',
        ],
      },
      {
        title: '**Rendering structure**: vector-based coordinate computation',
        items: [
          'Implemented **dot-product-based screen coordinate calculation** using NumPy',
          'Defined screen-space unit vectors ($i\'$, $j\'$) and designed a pipeline that **maps projected points into screen coordinates**',
          'Directly implemented **the mathematical foundation of rendering** to understand how graphics engines work internally',
        ],
      },
    ],
  },
];

export default projects;