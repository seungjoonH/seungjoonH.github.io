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
          title: 'Fitween App Launch and Release Management',
          items: [
            'Led development of the **Fitween fitness tracking application**',
            'Performed **feature improvements and stabilization after v1.0 launch**',
            'Managed **version releases and release notes for service updates**',
            'Conducted **code refactoring and performance optimization**'
          ],
          links: [
            { type: 'appstore', title: 'Fitween App Store', href: 'https://apps.apple.com/kr/app/fitween/id1671114122?l=ko-KR' },
            { type: 'notion', title: 'Fitween Customer Support', href: 'https://fitween.notion.site/Fitween-8bef341ef8904eed894c79b259903675?pvs=74' },
            { type: 'notion', title: 'Fitween Release Notes', href: 'https://fitween.notion.site/aa14492c494943ad803d15d30cb0b34b' },
          ],
        },
        {
          title: 'Government and private startup support programs',
          items: [
            'Selected for MOVE (Ministry of SMEs and Startups) university startup program',
            'Selected for I-Corps lab-based startup exploration team (MSIT/IITP)',
          ],
          links: [
            { type: 'news', title: 'Handong University 2 startup teams selected - KSM News', href: 'https://www.ksmnews.co.kr/news/view.php?idx=427141' },
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
    links: [
      { type: 'external', title: 'Foodrain Service', href: 'https://foodrain.com/main' },
    ],
    details: {
      sections: [
        {
          title: 'Foodrain User and Admin Web Maintenance',
          items: [
            'Frontend development based on **Flutter Web**',
            'Implemented **new UI/UX screens and feature improvements** for user and admin web',
            'Integrated backend APIs and **implemented client requirements**',
            'Resolved service issues and **improved performance during operation**'
          ],
          links: [
            { type: 'external', title: 'Foodrain Service', href: 'https://foodrain.com/main' },
          ]
        },
        {
          title: 'Internal Flutter Utility Package Development',
          items: [
            'Modularized **common utility functions used across internal projects**',
            'Designed and implemented **Flutter Package structure**',
            'Configured **GitHub repository for reusable internal package management**'
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
          title: 'DOM manipulation and declarative UI',
          items: [
            'Explored Vanilla JS-based DOM manipulation and declarative UI expression',
            'Encapsulated DOM creation in a custom helper for declarative UI',
            'Confirmed JSX transformation to jsx/jsxs calls via Vite build output',
          ],
          links: [
            { type: 'tistory', title: '[Web] DOM manipulation - createElement to JSX', href: 'https://seungjoonh.tistory.com/entry/web-dom' },
          ],
        },
        {
          title: 'State management',
          items: [
            'Implemented Vanilla JS state management and Observer-pattern Store',
            'Unidirectional flow: state change → subscribe → DOM update',
            'Compared Store implementations: object, class, and closure (functional)',
          ],
          links: [
            { type: 'tistory', title: '[Web] Observer pattern and Store - state management', href: 'https://seungjoonh.tistory.com/entry/web-observer-store' },
          ],
        },
      ],
    },
  },
];

export default experiences;