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
          title: 'Understanding the DOM rendering flow from Vanilla JS imperative DOM manipulation to React declarative rendering',
          items: [
            'Experienced readability issues where UI hierarchy became buried within imperative DOM manipulation code flow',
            'Encapsulated DOM creation logic into custom helper functions to achieve a more declarative UI structure',
            'Analyzed Vite build output to confirm that JSX is transformed into jsx / jsxs function calls',
          ],
        },
        {
          title: 'Understanding the state management flow from Vanilla JS Store to Zustand',
          items: [
            'Recognized the need for UI state management in Vanilla JS and implemented an Observer-pattern–based Store architecture',
            'Designed a unidirectional update flow: state change → subscription → DOM update',
            'Compared Store implementations using object, class, and closure patterns, then extended the flow toward Zustand’s closure-based store structure and selector-based subscription model',
          ],
        },
      ],
    },
  },
];

export default experiences;