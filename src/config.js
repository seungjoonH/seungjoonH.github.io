const animation = {
  nav: {
    clickScrollMs: 2000,
  },
  hero: {
    panoGrowFromSmallS: 0.35,
    panoFrameChangeS: 0.4,
    panoGrowToFullS: 0.5,
  },
  project: {
    cardFlipS: 0.62,
    cardHoverLiftS: 0.25,
    popupBackdropFadeS: 0.2,
    popupSlideUpS: 0.25,
  },
};

const breakpoints = {
  widths: [860, 1240, 1700],
  screenSizeTypes: ['mobile', 'tablet', 'desktop', 'wide'],
  projectsGrid: {
    mobile: { min: 1, max: 2 },
    tablet: { min: 2, max: 4 },
    desktop: { min: 2, max: 4 },
    wide: { min: 3, max: 5 },
  },
};

const ui = {
  skillsChipBorderRadius: '4px',
};

const typography = {
  scale: 1,
};

const theme = {
  initial: 'dark',
};

const language = {
  initial: 'ko',
  fallback: 'ko',
};

const version = {
  number: '1.0.6',
  buildDate: '20260321',
};

const contact = {
  email: 'hsj6831@gmail.com',
  github: 'https://github.com/seungjoonH',
  linkedin: 'https://www.linkedin.com/in/seungjoonh',
  tel: '010 4044 6831'
};

const skills = [
  {
    'Web - Frontend': ['Typescript', 'Next.js', 'React'],
    'Web - Backend': ['NestJS', 'Node.js', 'SpringBoot'],
    Mobile: ['Flutter'],
    Database: ['Firebase', 'Redis', 'MySQL', 'PostgreSQL'],
    Language: ['Javascript', 'Python', 'Java', 'C'],
  },
];

const searchPlaceholderExamples = {
  ko: [
    '최적화',
    'title:물방울톡',
    'desc:"컴포넌트 설계"',
    '#바이브코딩',
    'stack:TS',
    'type:group',
  ],
  en: [
    'optimization',
    'title:Fitween',
    'desc:"component design"',
    '#vibe-coding',
    'stack:TS',
    'type:group',
  ],
};

const projectCard = {
  fontScaleSteps: [0.5, 0.75, 1, 1.25, 1.5],
  maxVisibleTags: {
    mobile: [8, 7, 6, 6, 5],
    tablet: [10, 9, 8, 7, 6],
    desktop: [12, 10, 9, 8, 7],
    wide: [14, 12, 10, 9, 8],
  },
  maxVisibleStacks: {
    mobile: [8, 7, 6, 6, 5],
    tablet: [10, 9, 8, 7, 6],
    desktop: [12, 10, 9, 8, 7],
    wide: [14, 12, 10, 9, 8],
  },
};

const TYPO_SCALE_MIN = 0.5;
const TYPO_SCALE_MAX = 1.5;

const config = {
  animation,
  breakpoints,
  ui,
  typography,
  theme,
  language,
  version,
  contact,
  skills,
  searchPlaceholderExamples,
  projectCard,
};

export default config;
export { 
  animation, 
  breakpoints, 
  ui, 
  typography, 
  theme, 
  language, 
  version,
  contact, 
  skills, 
  searchPlaceholderExamples, 
  projectCard, 
  TYPO_SCALE_MIN,
  TYPO_SCALE_MAX,
};
