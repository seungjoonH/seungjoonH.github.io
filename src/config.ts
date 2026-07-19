// 앱 전역 설정 값·헬퍼를 export하는 모듈

export const TYPO_SCALE_MIN = 0.5;
export const TYPO_SCALE_MAX = 1.5;
export const SPEED_SCALE_MIN = 0.5;
export const SPEED_SCALE_MAX = 1.5;
export const SCALE_SLIDER_STEP = 0.25;

export type ScreenSizeType = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface GridBounds {
  min: number;
  max: number;
}

export interface Breakpoints {
  widths: number[];
  screenSizeTypes: ScreenSizeType[];
  projectsGrid: Record<ScreenSizeType, GridBounds>;
}

export interface AnimationConfig {
  nav: { clickScrollMs: number };
  hero: {
    panoGrowFromSmallS: number;
    panoFrameChangeS: number;
    panoGrowToFullS: number;
  };
  project: {
    cardFlipS: number;
    cardHoverLiftS: number;
    modalBackdropFadeS: number;
    modalSlideUpS: number;
  };
}

export interface VersionInfo {
  number: string;
  buildDate: string;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  tel: string;
}

export interface SiteVersions {
  defaultHash: string;
  hashes: Record<string, boolean>;
}

export interface ChipBoundsByBreakpoint {
  mobile: number[];
  tablet: number[];
  desktop: number[];
  wide: number[];
}

export interface ProjectCardConfig {
  fontScaleSteps: number[];
  maxVisibleTags: ChipBoundsByBreakpoint;
  maxVisibleStacks: ChipBoundsByBreakpoint;
}

export interface AppConfig {
  animation: AnimationConfig;
  breakpoints: Breakpoints;
  typography: { scale: number };
  theme: { initial: string };
  language: { initial: string; fallback: string };
  version: VersionInfo;
  contact: ContactInfo;
  searchPlaceholderExamples: Record<string, string[]>;
  projectCard: ProjectCardConfig;
  siteVersions: SiteVersions;
}

const animation: AnimationConfig = {
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
    modalBackdropFadeS: 0.2,
    modalSlideUpS: 0.25,
  },
};

const breakpoints: Breakpoints = {
  widths: [860, 1240, 1700],
  screenSizeTypes: ['mobile', 'tablet', 'desktop', 'wide'],
  projectsGrid: {
    mobile: { min: 1, max: 2 },
    tablet: { min: 2, max: 4 },
    desktop: { min: 2, max: 4 },
    wide: { min: 3, max: 5 },
  },
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

const version: VersionInfo = {
  number: '1.1.1',
  buildDate: '20260719',
};

const contact: ContactInfo = {
  email: 'hsj6831@gmail.com',
  github: 'https://github.com/seungjoonH',
  linkedin: 'https://www.linkedin.com/in/seungjoonh',
  tel: '010 4044 6831',
};

const searchPlaceholderExamples: Record<string, string[]> = {
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

const projectCard: ProjectCardConfig = {
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

const siteVersions: SiteVersions = {
  defaultHash: 'n7q4k2w',
  hashes: {
    k9nq7wx: true,
    mg8ozkj: true,
    v3m8rj2: true,
    n7q4k2w: true,
  },
};

const config: AppConfig = {
  animation,
  breakpoints,
  typography,
  theme,
  language,
  version,
  contact,
  searchPlaceholderExamples,
  projectCard,
  siteVersions,
};

export default config;

/**
 * 모바일 상한 너비(px). `breakpoints.widths[0]`(= tablet 시작)와 같다.
 * CSS `@media (max-width: 860px)`와 맞춘다.
 * @returns 모바일로 취급하는 최대 뷰포트 너비
 */
export function getMobileMaxWidthPx(): number {
  return breakpoints.widths[0];
}

/**
 * 모달 slide/close에 쓰는 ms. `animation.project.modalSlideUpS`의 밀리초 환산.
 * @returns 닫기 애니메이션 대기 ms
 */
export function getModalCloseDelayMs(): number {
  return Math.round(animation.project.modalSlideUpS * 1000);
}

/**
 * `:root`에 넣을 animation 토큰 CSS 문자열.
 * @returns `--anim-*` 선언들
 */
export function getAnimationCssVars(): string {
  const { hero, project } = animation;
  return [
    `--anim-pano-grow-from-small: ${hero.panoGrowFromSmallS}s`,
    `--anim-pano-frame-change: ${hero.panoFrameChangeS}s`,
    `--anim-pano-grow-to-full: ${hero.panoGrowToFullS}s`,
    `--anim-card-flip: ${project.cardFlipS}s`,
    `--anim-card-hover-lift: ${project.cardHoverLiftS}s`,
    `--anim-modal-backdrop-fade: ${project.modalBackdropFadeS}s`,
    `--anim-modal-slide: ${project.modalSlideUpS}s`,
  ].join('; ');
}

export function isSiteVersionAllowed(hash: string | undefined): boolean {
  if (!hash) return false;
  return siteVersions.hashes[hash] === true;
}

export function getDefaultSiteHash(): string {
  return siteVersions.defaultHash;
}

export { projectCard };
