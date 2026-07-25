// 영문 Experience 섹션 경력 데이터
const experiences = [
  { 
    id: 'fitween', 
    company: 'Fitween', 
    position: 'Employee', 
    startDate: '2023-06-01', 
    endDate: '2023-12-31',
    shortcut: '#fitween',
    projectSearchQuery: 'title:Fitween show:all',
    details: {
      sections: [
        {
          title: 'App launch and release management',
          items: [
            'Led Flutter development in a five-member team, building an AI motion-recognition fitness app with game-driven motivation mechanics end-to-end',
            'Drove product direction from problem definition to MVP, then ran scenario-based tests with 14 users',
            'Iterated on UI clarity and feature priorities from test feedback, then managed v1.0 stabilization and release',
            'Launched on the App Store and kept improving based on real usage data from ~100 early users',
          ],
          links: [
            { type: 'appstore', title: 'AppStore', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
            { type: 'notion', title: 'Fitween Customer Support', href: 'https://fitween.notion.site/Fitween-8bef341ef8904eed894c79b259903675?pvs=74' },
            { type: 'notion', title: 'Fitween Release Notes', href: 'https://fitween.notion.site/aa14492c494943ad803d15d30cb0b34b' },
          ],
        },
        {
          title: 'Government and private startup programs',
          items: [
            'Selected for the Ministry of SMEs and Startups pre-founder program (2023.06-2023.12)',
            'Selected for the MSIT I-Corps lab startup exploration team (2023.06-2024.02)',
            'Validated the hypothesis that comparing daily activity metrics to real-world benchmarks could drive workout motivation - via surveys, interviews, and prototype demos',
            'After a team pivot, took sole ownership of the product - refactored the codebase, redesigned the UI, shipped a friend-vs-friend feature, and relaunched as v2.0',
          ],
          links: [
            { type: 'news', title: 'Handong University startup teams selected - KSM News', href: 'https://www.ksmnews.co.kr/news/view.php?idx=427141' },
          ],
        },
      ]
    }
  },
  { 
    id: 'software-factory', 
    company: 'Software Factory', 
    position: 'Intern', 
    startDate: '2024-08-20', 
    endDate: '2024-12-31',
    shortcut: '#foodrain',
    projectSearchQuery: 'title:"Foodrain" | title:"Extify" show:all',
    details: {
      sections: [
        {
          title: 'Foodrain user/admin web maintenance',
          items: [
            'Maintained user and admin interfaces for a Flutter Web-based logistics platform serving small business merchants, handling live operational issues as they came in',
            'Built a **product image magnifier interaction** on the detail page to improve how users explore product visuals',
            'Implemented an **ad modal management feature** where admin-uploaded images reflect on the user-facing page instantly',
            'Integrated backend APIs, built new screens, and addressed production bugs and performance issues throughout the internship',
          ],
        },
        {
          title: 'Internal Flutter utility package',
          items: [
            'Extracted **common utilities shared across internal projects** into a standalone package',
            'Designed and implemented the **Flutter package structure** from scratch',
            'Set up and maintained a **GitHub repository for internal package distribution**',
          ]
        }
      ]
    } 
  },
  { 
    id: 'naver-boostcamp', 
    company: 'NAVER Boostcamp 10th', 
    position: 'Web Fullstack', 
    startDate: '2025-06-23', 
    endDate: '2026-02-06', 
    shortcut: '#mbwt',
    projectSearchQuery: 'title:"Moolbangwool Talk" show:all',
    details: {
      sections: [
        {
          title: 'From imperative DOM manipulation in Vanilla JS to declarative rendering in React',
          items: [
            'Hit readability walls where UI hierarchy got buried inside imperative DOM manipulation code',
            'Wrapped DOM creation into custom helper functions to shift toward a more declarative structure',
            'Dug into Vite build output to see firsthand how JSX compiles down to jsx / jsxs function calls',
          ],
        },
        {
          title: 'From a hand-rolled Vanilla JS Store to understanding Zustand',
          items: [
            'Felt the pain of managing UI state without tooling in Vanilla JS, then built an Observer-pattern Store from scratch',
            'Wired up a unidirectional flow: state change → subscription → DOM update',
            'Compared object, class, and closure-based Store patterns, then traced how Zustand applies the same closure approach with selector-driven subscriptions',
          ],
        },
      ],
    },
  },
];

export default experiences;