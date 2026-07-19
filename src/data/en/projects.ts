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
    summary: 'A real-time voice social app that breaks the ice with minigames and flows naturally into conversation',
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
      { type: 'deploy', title: 'Web', href: 'https://moolbangwool.duckdns.org/home' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/boostcampwm2025/web26-2Ryuk' },
      { type: 'notion', title: 'Patch notes', href: 'https://rapid-bubble-113.notion.site/2fe207f233418064a95be845fe26ec3e' },
    ],
    sections: [
      {
        title: '**Establishing and documenting component design principles**',
        items: [
          'Constrained styles to `variant`/`size` union types so **arbitrary px and colors are blocked at the type level**',
          'Reduced UI implementation drift across developers and **kept collaboration consistent**',
        ],
        links: [{ type: 'doc', id: 'component-design-philosophy' }],
      },
      {
        title: '**Modularizing floating chat panel position control**',
        items: [
          'Extracted position control into a dedicated hook and restored coordinates after refresh with `Zustand Persist`',
          'Removed UI-component coupling and cut boilerplate by **~38%**',
        ],
        links: [{ type: 'doc', id: 'floating-component-spec' }],
      },
      {
        title: '**Optimizing real-time game input**',
        items: [
          'Profiled bottlenecks with Playwright + FPS, then **batched inputs before send**',
          'Cut incoming events/sec from **2,937 → 32** and raised average FPS from **30.7 → 60.5**',
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
    summary: 'An algorithm debugger where AI completes visualizations from executable code',
    tags: ['web', 'algorithm', 'visualization', 'ai', { name: 'vibe-coding', show: false }, { name: 'real-time', show: false }],
    techStack: ['Next.js', 'Typescript', 'D3', 'Three.js', 'Pyodide', 'Acorn', 'GCP', 'Gemini API', 'Vercel'],
    images: ['/assets/projects/frogger.svg'],
    links: [
      { type: 'deploy', title: 'Frogger service link', href: 'https://frogger-six.vercel.app/' },
      { type: 'github', title: 'Frogger GitHub repository link', href: 'https://github.com/ultra-ai-dle/frogger' },
    ],
    sections: [
      {
        title: '**Algorithm execution flow visual debugger**: planning and implementation',
        items: [
          'Planned the project to solve the difficulty of intuitively understanding how code executes while solving algorithm problems',
          'Designed a debugger architecture that visualizes execution flow from Stack to DP using graphs and tables',
        ],
      },
      {
        title: '**3D array visualization**: multiple display modes with Three.js',
        items: [
          'Designed Three.js-based views so 1D and 2D arrays—and 3D arrays—are easier to read at a glance',
          'Supported **multiple display modes**—graphs, tables, and 3D views—matched to data structure and execution context',
        ],
      },
      {
        title: '**Unified runtime integration** for three languages: Python / Javascript / Java',
        items: [
          'Executed Python and JS directly in browser Web Workers using Pyodide (WebAssembly) and Acorn AST',
          'Because JVM cannot run natively in browser, provisioned a separate JVM runtime on a GCP VM (e2-micro) for Java execution',
        ],
      },
      {
        title: '**Improved AI visualization strategy accuracy**',
        items: [
          'Observed incorrect visual strategy decisions when relying on variable names',
          'Improved accuracy by applying a **"real operation pattern-based decision principle"** across prompt design and post-processing',
        ],
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
    summary: 'An algorithm debugger where AI completes visualizations from executable code',
    tags: ['web', 'algorithm', 'visualization', 'ai', { name: 'vibe-coding', show: false }, { name: 'real-time', show: false }],
    techStack: ['Next.js', 'Typescript', 'D3', 'Three.js', 'Pyodide', 'Acorn', 'GCP', 'Gemini API', 'Vercel'],
    images: ['/assets/projects/frogger.svg'],
    links: [
      { type: 'deploy', title: 'Frogger service link', href: 'https://frogger-six.vercel.app/' },
      { type: 'github', title: 'Frogger GitHub repository link', href: 'https://github.com/ultra-ai-dle/frogger' },
    ],
    sections: [
      {
        title: '**Algorithm execution flow visual debugger**: planning and implementation',
        items: [
          'Planned the project to solve the difficulty of intuitively understanding how code executes while solving algorithm problems',
          'Designed a debugger architecture that visualizes execution flow from Stack to DP using graphs and tables',
        ],
      },
      {
        title: '**3D array visualization**: multiple display modes with Three.js',
        items: [
          'Designed Three.js-based views so 1D and 2D arrays—and 3D arrays—are easier to read at a glance',
          'Supported **multiple display modes**—graphs, tables, and 3D views—matched to data structure and execution context',
        ],
      },
      {
        title: '**Unified runtime integration** for three languages: Python / Javascript / Java',
        items: [
          'Executed Python and JS directly in browser Web Workers using Pyodide (WebAssembly) and Acorn AST',
          'Because JVM cannot run natively in browser, provisioned a separate JVM runtime on a GCP VM (e2-micro) for Java execution',
        ],
      },
      {
        title: '**Improved AI visualization strategy accuracy**',
        items: [
          'Observed incorrect visual strategy decisions when relying on variable names',
          'Improved accuracy by applying a **"real operation pattern-based decision principle"** across prompt design and post-processing',
        ],
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
    summary: 'A personal portfolio site with structured data, search UX, accessibility, i18n, and interactive design baked in',
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
      },
      {
        title: '**Project search**: Hangul jamo decomposition and choseong matching',
        searchChip: { label: 'Extify', searchQuery: 'title:Extify show:all' },
        items: [
          'Ported **Hangul jamo decomposition and choseong matching algorithms** from Extify into JavaScript to enable typo-tolerant search UX',
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
    id: 'ps-studio',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'PS Studio',
    status: 'live',
    period: { start: '2026-05', end: 'present' },
    summary: 'An integrated platform for PS study management, code review, and AI feedback',
    tags: ['web', 'vibe-coding', 'ai-usage', 'maintenance', 'in-production', 'toy'],
    techStack: ['Next.js', 'NestJS', 'Supabase', 'PostgreSQL', 'Redis', 'BullMQ', 'Canny', 'GCP', 'OpenRouter'],
    images: ['/assets/projects/psstudio.svg'],
    links: [
      { type: 'deploy', title: 'PS Studio service link', href: 'https://psstudio.dev/landing' },
      { type: 'github', title: 'PS Studio GitHub repository link', href: 'https://github.com/seungjoonH/psstudio' },
    ],
    sections: [
      {
        title: '**Compared Google Free / Paid and OpenRouter across 24 scenarios**',
        items: [
          'Judged the Free tier unusable at **11.5%** success rate',
          'Confirmed Paid and OpenRouter both hit **100%** success/accuracy with similar cost',
          'Chose **OpenRouter** on evidence for single-API multi-model operation',
        ],
        links: [{ type: 'doc', id: 'ai-gemini-api-openrouter' }],
      },
      {
        title: '**Validated and applied optimal LLMs by task difficulty**',
        items: [
          'Switched light tasks to `gpt-4o-mini`, keeping accuracy while cutting **cost by 73%**',
          'Switched hard tasks to `llama-4-maverick`, raising accuracy **94% → 100%** and cutting **cost by 88%**',
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
    summary: 'A service that finds and preserves first BOJ submission records before service shutdown',
    tags: ['web', 'vibe-coding', 'deployment', 'live', 'toy'],
    techStack: ['Next.js', 'Upstash Redis', 'Vercel'],
    images: ['/assets/projects/my-first-boj.svg'],
    links: [
      { type: 'deploy', title: 'My First BOJ service link', href: 'https://my-first-boj.vercel.app/' },
      { type: 'github', title: 'My First BOJ GitHub repository link', href: 'https://github.com/seungjoonH/my-first-boj' },
    ],
    sections: [
      {
        title: '**Preserving first submissions before BOJ shutdown: planning and build**',
        items: [
          'Identified the need to find records before they vanish, and designed caching so results remain queryable after shutdown',
          'Reached about **500** cumulative visitors and **1,000** collected records via SEO and Baekjoon forum promotion',
        ],
      },
      {
        title: '**Minimizing BOJ server load** by improving first-submission search',
        items: [
          'Replaced unbounded sequential search with binary search: **O(log N, max 27 requests)**',
          'Further cut it to near **O(1)** using `top=1` and `prev_page` links',
        ],
      },
      {
        title: '**Realtime chat** on Vercel Serverless + Upstash Redis without always-on server cost',
        items: [
          'Replaced unsupported resident WebSocket with **SSE + Redis polling**',
          'Auto-closed SSE after 1 minute idle or inactive chat tab, cutting Upstash requests by **49% (17,900 → 9,070)**',
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
    summary: 'A CLI that auto-generates project rule docs for AI coding agents',
    tags: ['cli', 'vibe-coding', 'ai-usage', 'maintenance'],
    techStack: ['Javascript', { name: 'Node.js', show: false }, { name: 'Inquirer.js', show: false }],
    images: ['/assets/projects/mykit.svg'],
    links: [{ type: 'github', title: 'Mykit GitHub repository link', href: 'https://github.com/seungjoonH/mykit' }],
    sections: [
      {
        title: '**Built a CLI that auto-generates per-stack AI agent rule files**',
        items: [
          'Saw repeated setup cost from hand-written rules and **token waste** from one monolith rule dump',
          'Designed a **rule-file workflow** to steer agents, plus a CLI that selectively generates stack-specific docs',
          'Auto-generates Codex/Claude/Cursor rule files and **indexes** them so agents only load what they need',
        ],
      },
      {
        title: '**Cross-tested split instruction loading vs single-file full load** on Codex and Claude Code',
        items: [
          'Split loading cut static instruction context by **56%** on Codex and **72%** on Claude',
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
    summary: 'An integrated platform for PS study management, code review, and AI feedback',
    tags: ['web', 'study', 'ai', 'production-use', { name: 'maintenance', show: false }, { name: 'vibe-coding', show: false }],
    techStack: ['Next.js', 'NestJS', 'Supabase', 'PostgreSQL', 'Redis', 'BullMQ', 'Canny', 'GCP', 'OpenRouter'],
    images: ['/assets/projects/psstudio.svg'],
    links: [
      { type: 'deploy', title: 'PS Studio service link', href: 'https://psstudio.dev/landing' },
      { type: 'github', title: 'PS Studio GitHub repository link', href: 'https://github.com/seungjoonH/psstudio' },
    ],
    sections: [
      {
        title: '**Integrated platform for code review, AI feedback, and deadline management**',
        items: [
          'Experienced the limits of line-level feedback and deadline management in a Notion-based study workflow',
          'Built and actively used a dedicated study platform with line review, versioning, AI feedback, and deadline reminders',
        ],
      },
      {
        title: '**Deadline alert reliability**',
        items: [
          'Introduced BullMQ delayed jobs to deliver deadline alerts precisely on time without loss',
          'Designed a structure that reduces unnecessary DB load compared to polling and survives server restarts',
        ],
      },
      {
        title: '**LLM cost control and stability improvements**',
        items: [
          'Faced frequent 429 errors and poor cost predictability when calling Gemini directly',
          {
            title: 'Function-level model routing',
            items: [
              'Used lower-cost models for simple summaries and higher-capability models for long-context code feedback',
              'Adopted OpenRouter to improve model-switching flexibility and operational stability',
            ],
          },
          'Improved cost predictability through prepaid billing and usage dashboards',
        ],
      },
      {
        title: '**GitHub Actions + GCE CI/CD pipeline**',
        items: [
          'Built and operated a deployment pipeline that auto-builds FE/BE/Worker images on `main` push and deploys them to a GCE VM',
        ],
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
    period: { start: '2026-04', end: '2026-04' },
    summary: 'A service that finds and preserves first BOJ submission records before service shutdown',
    tags: ['web', 'archiving', 'deployment', 'live', { name: 'vibe-coding', show: false }],
    techStack: ['Next.js', 'Upstash Redis', 'Vercel'],
    images: ['/assets/projects/my-first-boj.svg'],
    links: [
      { type: 'deploy', title: 'My First BOJ service link', href: 'https://my-first-boj.vercel.app/' },
      { type: 'github', title: 'My First BOJ GitHub repository link', href: 'https://github.com/seungjoonH/my-first-boj' },
    ],
    sections: [
      {
        title: '**First-submission record preservation service**: planning and development',
        items: [
          'Identified the need to preserve first submission records before they disappear, and designed a cache-backed structure that remains queryable after shutdown',
          'Reached about 500 cumulative visitors and 1,000 collected records through SEO and community promotion',
        ],
      },
      {
        title: '**Search algorithm improvements** to minimize BOJ server load',
        items: [
          {
            title: 'Search strategy optimization',
            items: [
              'Improved unbounded sequential search requests with binary search: O(log N), max 27 requests',
              'Further reduced it to near O(1) by leveraging `top=1` and `prev_page` links',
            ],
          },
        ],
      },
      {
        title: '**Nickname ownership issue** in anonymous chat',
        items: [
          'Encountered a nickname ownership problem in a login-free anonymous environment',
          'Solved it by designing an IP-based random nickname assignment strategy for BOJ users',
        ],
      },
      {
        title: '**Real-time chat** with Vercel serverless + Upstash Redis',
        items: [
          'Replaced persistent WebSocket connections with SSE + Redis polling due to serverless constraints',
          'Reduced Redis load by disconnecting on inactive tabs and auto-closing after 1 minute of inactivity',
        ],
      },
    ],
  },
  {
    id: 'mykit',
    teamSize: 1,
    hidden: false,
    type: 'personal',
    title: 'mykit',
    status: 'maintained',
    period: { start: '2026-05', end: 'present' },
    summary: 'A CLI that auto-generates project rules and docs for AI coding agents',
    tags: ['cli', 'ai', 'automation', 'maintenance', { name: 'vibe-coding', show: false }],
    techStack: ['Node.js', 'Javascript', 'Inquirer.js'],
    images: ['/assets/projects/mykit.svg'],
    links: [{ type: 'github', title: 'mykit GitHub repository link', href: 'https://github.com/seungjoonH/mykit' }],
    sections: [
      {
        title: '**Rule-file driven workflow** design and automation',
        items: [
          'Repeatedly observed AI agents generating unnecessary code due to missing project context, then designed a rules-driven workflow to constrain agent behavior',
          'Built a CLI that auto-generates only the rule documents needed for a selected tech-stack combination, reducing setup overhead',
          'With a single `mykit init`, automatically generates tool-specific rule files for Codex, Claude, and Cursor in the project root',
          'Used **PLAYBOOK.index.yaml** to structure agent entry points, domain document paths, and task-specific navigation routes for faster context discovery',
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
    summary: 'An AI-powered CLI for Git collaboration automation',
    tags: ['cli', 'vibe-coding', 'ai-usage', 'release', 'maintenance'],
    techStack: ['Javascript', { name: 'Node.js', show: false }],
    links: [
      { type: 'npm', title: 'npm release link', href: 'https://www.npmjs.com/package/acommit' },
      { type: 'github', title: 'Acommit GitHub repository link', href: 'https://github.com/seungjoonH/acommit' },
    ],
    sections: [
      {
        title:
          '**Built an AI commit-message CLI, published it on npm, and keep shipping features, performance work, and maintenance**',
        items: [],
      },
      {
        title: '**Iterative improvement driven by quantitative LLM output quality measurement**',
        items: [
          'Designed **22 test cases** covering tag format, language, grouping, and real commit scenarios against configured rules',
          'Verified quality with rule-based auto and manual scoring, running 5 trials per case for reliability',
          'Fixed failures via prompt/config iteration and cut error rate from **35% → 0%** as of v0.3.1',
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
      'maintenance',
      { name: 'solo-planning', show: false },
      { name: 'lightweight-utilities', show: false },
      { name: 'disassembled-input', show: false },
      { name: 'composed-syllables', show: false },
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
          'Got tired of re-implementing the same utility logic across projects, so packaged the core pieces into a dedicated Dart library and published it',
        ],
      },
      {
        title: '**Core features**: Korean particles, jamo processing, and string transformation',
        items: [
          {
            title: 'Korean particle handling and jamo decomposition',
            items: ['Automated tricky particle rules like "eun/neun" and "i/ga", and implemented choseong/jungseong/jongseong decomposition and composition with full documentation'],
            links: [{ type: 'doc', id: 'flutter-hangeul' }],
          },
          {
            title: 'String case converter',
            items: ['Implemented bidirectional conversion across naming conventions - snake_case, camelCase, PascalCase, and more - with full documentation'],
            links: [{ type: 'doc', id: 'flutter-string-case-converter' }],
          },
        ],
      },
      {
        title: '**Release and maintenance**: open-sourced on pub.dev',
        items: [
          '**Published as an open-source package on pub.dev** - installable via `pubspec.yaml` with no friction',
          '**Eliminated repeated boilerplate** across projects',
          'Gained hands-on experience designing and maintaining a library to a standard that external users can rely on',
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
    summary: 'Official Handong University Glocal website (Legacy)',
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
        title: '**Official university website**: solo development and production deployment',
        items: [
          'Took a direct commission from the university to **build the official Glocal website solo** and deployed it to the real school domain',
          'Wired up the frontend (`Next.js`) and backend (`Spring Boot`) end-to-end, implementing a full **university site structure** with boards, notices, and resource sections',
          'Iterated on features continuously based on feedback from the university',
        ],
      },
      {
        title: '**Responsive layout**: device-aware screen adaptation',
        items: [
          'Designed a **responsive layout** so content stays intact across desktop, tablet, and mobile',
          'Built a `useResponsive` hook to track `width`, `height`, and `status (desktop/tablet/mobile)` and update on resize',
          'Used **CSS class composition** where layout structure was shared, and **device-specific component branching** where it diverged',
          'Achieved **consistent UI/UX and stable rendering** across screen sizes',
        ],
        links: [{ type: 'doc', id: 'web-responsive' }],
      },
      {
        title: '**Multilingual support**: i18n-based language switching',
        items: [
          'Built a **bilingual site (Korean/English)** to serve both domestic and international users',
          'Created a `useLanguage` hook that loads the initial language from storage and exposes `switchLanguage()` / `toggleLanguage()` for control',
          'Integrated `react-i18next` to handle not just plain strings but also **multiline text and object-shaped translation data**',
          'Kept the home screen and key UI text in sync on language switch to deliver a **consistent experience in both Korean and English**',
        ],
        links: [{ type: 'external', title: 'Related post', href: 'https://seungjoonh.tistory.com/entry/web-i18n' }],
      },
      {
        title: '**Boards and resource sections**: file uploads with AWS S3',
        items: [
          'Implemented **board-style content management** (notices, resources, etc.) so the university could manage content without developer involvement',
          'Used **AWS S3 for file storage**, linking uploaded attachments to posts for retrieval and download',
          'Kept static assets and uploaded files separate to reduce server storage dependency and keep file handling stable in production',
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
    summary: 'Maintenance of a Flutter Web logistics platform for small business merchants',
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
          'Integrated backend APIs and addressed client requirements',
        ],
      },
      {
        title: '**Admin web maintenance**: feature additions and UI improvements',
        items: [
          '**Flutter Web** frontend development',
          'Built new UI/UX screens and improved performance',
          'Integrated backend APIs and addressed client requirements',
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
      { type: 'appstore', title: 'AppStore', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/fitween' },
    ],
    sections: [
      {
        title: '**Design sprint**: de-risking the product early',
        items: [
          '**Built working prototypes of core features and validated them through user testing**',
          'Gathered user needs and feedback around real-time pose feedback',
          'Cut unnecessary features and locked in development priorities for the core experience',
        ],
        links: [{ type: 'doc', id: 'fitween-design-sprint' }],
      },
      {
        title: '**Motion recognition**: integrating TensorFlow MoveNet',
        items: [
          'Applied pose estimation to track leg angles and movement in real time',
          'No official Flutter library existed, so **reverse-engineered an unmaintained open-source project**, adapted it to fit the product, and documented the whole process',
        ],
        links: [{ type: 'doc', id: 'movenet-flutter' }],
      },
      {
        title: '**Custom UI component**: built from scratch due to missing package support',
        items: [
          'Rolled a Circular Carousel widget from scratch to match the design spec exactly',
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
    summary: 'An experimental project where I implemented 3D-to-2D projection from scratch in Python to understand how rendering actually works',
    tags: ['graphics', 'math', 'rendering-engine', 'solo-planning'],
    techStack: ['Python', 'Pygame', 'Numpy'],
    links: [
      { type: 'github', title: 'GitHub', href: 'https://github.com/seungjoonH/3d-renderer' },
    ],
    sections: [
      {
        title: '**Rendering engine**: 3D → 2D projection pipeline from scratch',
        items: [
          'Dug into **how spatial coordinates pass through a camera and land on a 2D screen** - no Unity, no OpenGL, just math',
          'Defined the line of sight from camera position ($V$) to object coordinate ($A$), then **computed the intersection with the projection plane using vector math and plane equations to get screen coordinates**',
        ],
        links: [{ type: 'doc', id: 'project-3d-renderer' }],
      },
      {
        title: '**Camera system**: real-time view control and free 3D movement',
        items: [
          'Built a free-look camera by computing **view vector rotation from mouse input**',
          'Implemented **WASD and vertical movement** for freely navigating 3D space',
          'Combined vector-based movement and rotation for a smooth **FPS-style camera feel**',
        ],
      },
      {
        title: '**Rendering math**: vector-based coordinate computation',
        items: [
          'Implemented **dot product-based screen coordinate calculation** with NumPy',
          'Defined screen-space unit vectors ($i\'$, $j\'$) and built the structure that **maps projected points to pixel coordinates**',
          'Implemented the **mathematical core of a rendering pipeline from scratch** to understand how graphics engines work under the hood',
        ],
      },
    ],
  },
];

export default projects;