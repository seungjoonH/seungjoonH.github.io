const projects = [
  {
    id: 'mbwt',
    teamSize: 4,
    hidden: false,
    type: 'group',
    title: 'Moolbangwool Talk',
    period: { start: '2026-01', end: 'present' },
    summary: 'Real-time voice social service that starts with light minigames and flows into natural conversation',
    tags: [
      'WebSocket',
      'Real-time communication',
      'Voice chat',
      { name: 'Real-time game', show: false },
      { name: 'Social', show: false },
      'Maintenance',
      { name: 'Testing', show: false },
      { name: 'CI/CD', show: false },
      { name: 'Optimization', show: false },
      { name: 'OAuth', show: false },
      { name: 'JWT', show: false },
      'Design',
      'NAVER Boostcamp',
      { name: 'Full-stack', show: false },
      { name: 'Docker', show: false },
      { name: 'Monorepo', show: false },
    ],
    techStack: [
      'TypeScript',
      'Next.js',
      'NestJS',
      'Redis',
      'MySQL',
      'Socket.io',
      { name: 'React', show: false },
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
      { type: 'deploy', title: 'deploy link', href: 'https://moolbangwool.duckdns.org/home' },
      { type: 'github', title: 'GitHub repository', href: 'https://github.com/boostcampwm2025/web26-2Ryuk' },
      { type: 'notion', title: 'Patch Notes', href: 'https://rapid-bubble-113.notion.site/2fe207f233418064a95be845fe26ec3e' },
    ],
    sections: [
      {
        title: 'Design system and component design principles',
        items: [
          'Inconsistent styling across developers caused visual disharmony',
          'Defined design specs per component and documented a **component design philosophy** so developers choose only from defined types',
          'Minimized design variance across collaboration to **improve design quality and speed of new UI implementation**',
        ],
        links: [{ type: 'doc', id: 'component-design-philosophy' }],
      },
      {
        title: 'Floating component design and state restore optimization',
        items: [
          'Implemented a floating chat panel with free drag-and-drop',
          '**Modularized position control in a dedicated hook** to decouple from UI and reduce complexity',
          'Used Zustand Persist partialize/merge to persist coordinates and restore state after refresh',
          '**Delivered UI/UX aligned with product and design intent**',
        ],
        links: [{ type: 'doc', id: 'floating-component-spec' }],
      },
      {
        title: 'Real-time game optimization and input throttling',
        items: [
          'Frame drops in multi-user environment and rendering stutter during user testing',
          'Identified bottlenecks via **load testing** (Playwright, socket.io-client) and **FPS / Performance profiling**',
          'N×N broadcast per input caused event surge and main-thread saturation',
          'Client: accumulate inputs in 100ms windows and send in batches',
          'Server: separate input handling from state broadcast; fixed 300ms broadcast interval',
          'Events per second **~2,937 → 32**, average FPS **30.7 → 60.5**',
        ],
        links: [{ type: 'doc', id: 'rendering-optimization-input-burst' }],
      },
      {
        title: 'QA and verification process',
        items: [
          'Structured entry logic by user state and route',
          'Established QA process for **reliable system behavior and technical completeness**',
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
    title: 'Portfolio',
    period: { start: '2026-03', end: 'present' },
    summary: 'Personal portfolio site with structured data, search UX, accessibility, i18n, and interactive design',
    tags: [
      'UI',
      'UX',
      'accessibility',
      'i18n',
      'light/dark theme',
      { name: 'search', show: false },
      { name: 'interactive', show: false },
    ],
    techStack: ['Javascript', 'React'],
    links: [
      { type: 'deploy', title: 'Deploy link', href: 'https://seungjoonh.github.io' },
      { type: 'github', title: 'GitHub repository', href: 'https://github.com/seungjoonH/seungjoonH.github.io' },
    ],
    sections: [
      {
        title: 'Structured data and domain separation',
        items: [
          'Content (projects, experience, education, skills) is **split by domain into data files**, with **per-language (ko/en) directories** for maintainability',
          'A **repository layer** decouples UI from data so sources can be extended or swapped without touching the views',
        ],
      },
      {
        title: 'Search UX',
        items: [
          '**Unified search** in the projects section: Hangul jamo/chosung and Latin text are normalized so users can filter projects by keyword quickly',
          'Debounced query, stack/tag mapping, and **search-term highlighting** improve discoverability and readability',
        ],
      },
      {
        title: 'Accessibility',
        items: [
          '**Font size control**, **semantic HTML** (header, nav, main, section, article), and **ARIA/data attributes** for roles and state',
          'Keyboard focus, focus trapping, and screen-reader–friendly labels and markup for **diverse user environments**',
        ],
      },
      {
        title: 'Internationalization (i18n)',
        items: [
          '**i18n** for Korean/English with **translations and domain data (projects, experience, education, skills) kept per locale**',
          'Locale-based resource loading and a shared key scheme keep translations consistent and maintainable',
        ],
      },
      {
        title: 'Interactive design',
        items: [
          'Panorama scroll, card hover/focus states, modal and popup transitions for **clear visual feedback and motion**',
          'Responsive layout and breakpoint hooks for **consistent UX across screen sizes**',
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
    summary: 'AI-powered Git collaboration automation CLI',
    tags: ['personal-project', 'vibe-coding', 'maintenance'],
    techStack: ['Javascript', 'Node.js'],
    links: [
      { type: 'npm', title: 'npm package link', href: 'https://www.npmjs.com/package/acommit' },
      { type: 'github', title: 'Acommit GitHub repository', href: 'https://github.com/seungjoonH/acommit' },
    ],
    sections: [
      {
        title: 'Commit message auto-gen from git diff: planning and vibe-coding',
        items: [
          'Built a tool that generates commit message drafts from git diff to **ease commit splitting and convention compliance** on large changes',
          '**Detailed planning then vibe coding**: from multi-LLM integration to publish, completed quickly',
        ],
      },
      {
        title: 'rules.yml convention, 5 file-grouping strategies, multi-LLM (OpenAI/Gemini)',
        items: [
          'Commit messages **follow team rules defined in rules.yml**',
          'Five strategies (similarity, tags, folders, etc.) for **optimal commit granularity**',
          'OpenAI/Gemini support; token limits and env **controlled via rules**',
        ],
      },
      {
        title: 'npm open-source release and real-project adoption',
        items: [
          '**Published on npm** for easy CLI install',
          'Adopted in real projects for **shorter docs and higher commit quality**',
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
    summary: 'Dart utility package',
    tags: ['personal-project', 'maintenance'],
    techStack: ['Dart'],
    links: [
      { type: 'pubdev', title: 'pub.dev package link', href: 'https://pub.dev/packages/extify' },
      { type: 'github', title: 'Extify GitHub repository', href: 'https://github.com/seungjoonH/extify' },
    ],
    sections: [
      {
        title: 'Shared utility logic consolidated into a Dart package',
        items: [
          'Designed and published a Dart package of shared utilities to reduce repeated logic across projects',
        ],
      },
      {
        title: 'Korean particles, jamo, string case conversion and more',
        items: [
          { title: 'Korean particle handling and jamo split/join', items: ['Automated Korean particle rules (e.g. "eun/neun", "i/ga") and jamo split/join with docs'], links: [{ type: 'doc', id: 'flutter-hangeul' }] },
          { title: 'String case converter', items: ['snake_case, camelCase, PascalCase conversion with docs'], links: [{ type: 'doc', id: 'flutter-string-case-converter' }] },
        ],
      },
      {
        title: 'pub.dev release, less duplication, library maintenance',
        items: [
          '**Published on pub.dev** for install via pubspec.yaml',
          '**Reduced code duplication** and gained library design and maintenance experience',
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
    summary: 'Maintenance of an SMB integrated logistics optimization web service',
    tags: ['maintenance', 'flutter-web', 'frontend'],
    techStack: ['Flutter', 'Dart'],
    links: [
      { type: 'external', title: 'Foodrain service', href: 'https://foodrain.com/main' },
    ],
    sections: [
      {
        title: 'User-facing web maintenance and feature development',
        items: [
          '**Flutter Web** frontend development',
          'New UI/UX screens and performance improvements',
          'Backend API integration and client requirement implementation',
        ],
      },
      {
        title: 'Admin web maintenance and feature development',
        items: [
          '**Flutter Web** frontend development',
          'New UI/UX screens and performance improvements',
          'Backend API integration and client requirement implementation',
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
    summary: 'Fitness motivation app using AI motion recognition and game elements',
    tags: ['planning', 'development', 'release', 'version-control', 'maintenance'],
    techStack: ['Flutter', 'Dart', 'Firebase'],
    links: [
      { type: 'appstore', title: 'App Store link', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
      { type: 'github', title: 'GitHub repository', href: 'https://github.com/seungjoonH/fitween' },
    ],
    sections: [
      { title: 'Reducing product risk via design sprint', items: ['Prototyped app features and ran user tests', 'Collected needs and feedback on real-time pose feedback', 'Dropped unnecessary features and set development priorities'], links: [{ type: 'doc', id: 'fitween-design-sprint' }] },
      { title: 'TensorFlow MoveNet for squat pose guidance', items: ['Applied pose estimation for leg angle and motion in real time', 'No official Flutter lib; analyzed and adapted an unmaintained OSS and documented the process'], links: [{ type: 'doc', id: 'movenet-flutter' }] },
      { title: 'Custom UI components in absence of packages', items: ['Built Circular Carousel widget to match design spec', 'Documented the implementation'], links: [{ type: 'doc', id: 'flutter-circular-carousel' }] },
    ],
  },
  {
    id: '3d-renderer',
    teamSize: 1,
    hidden: false,
    type: 'toy',
    title: '3D Renderer',
    period: { start: '2024-05', end: '2024-05' },
    summary: 'Python 3D rendering experiment that implements 3D → 2D projection from first-principles math',
    tags: ['graphics', 'math', 'rendering-engine', 'solo-project'],
    techStack: ['Python', 'Pygame', 'Numpy'],
    links: [
      { type: 'github', title: '3D Renderer GitHub repository', href: 'https://github.com/seungjoonH/3d-renderer' },
    ],
    sections: [
      {
        title: '3D → 2D projection pipeline implemented without a rendering engine',
        items: [
          'Implemented **the math behind projecting 3D points onto a 2D screen** without Unity, OpenGL, or any engine',
          'Defined the ray from camera (V) to object (A) and **computed the intersection with the screen plane to get screen coordinates**',
          'Used vector math and plane equations to **compute the full 3D → screen coordinate transform by hand**',
        ],
        links: [
          { type: 'doc', id: 'project-3d-renderer' },
        ],
      },
      {
        title: 'Real-time camera system and 3D movement',
        items: [
          '**Mouse-based view vector rotation** for free camera control',
          '**WASD and vertical movement** for 3D navigation',
          'Vector-based movement and rotation for **FPS-style camera controls**',
        ],
      },
      {
        title: 'Vector-math rendering structure',
        items: [
          '**Dot-product–based screen coordinate computation** using NumPy',
          'Defined screen frame unit vectors (i′, j′) and **mapped projected points to screen space**',
          '**Implemented and experimented with the basic math of rendering** to understand how graphics engines work',
        ],
      },
    ],
  },
];

export default projects;
