// Main Intro 인라인 링크 id별 검색·스크롤 행 정의
export interface IntroLinkRowDefinition {
  query?: string;
  targetId?: string;
  labelKey?: string;
  icon?: string;
  docId?: string;
  label?: string;
}

export interface IntroLinkDefinition {
  kind: 'search' | 'scroll' | string;
  rows: IntroLinkRowDefinition[];
}

export type IntroLinkDefinitions = Record<string, IntroLinkDefinition>;

export const INTRO_LINK_DEFINITIONS: IntroLinkDefinitions = {
  portfolio: {
    kind: 'search',
    rows: [{ query: 'title:"포트폴리오"|title:"Portfolio"', labelKey: 'main.introLink.rowPortfolio' }],
  },
  ai: {
    kind: 'search',
    rows: [{ query: 'title:"Acommit"', labelKey: 'main.introLink.rowAcommit' }],
  },
  dx: {
    kind: 'search',
    rows: [
      { query: 'title:"Acommit"', labelKey: 'main.introLink.rowAcommit' },
      { query: 'title:"Extify"', labelKey: 'main.introLink.rowExtify' },
      { query: 'title:"물방울톡"|title:"Moolbangwool Talk"', labelKey: 'main.introLink.rowMulbangultalk' },
    ],
  },
  renderer: {
    kind: 'search',
    rows: [{ query: 'title:"3D Renderer"', labelKey: 'main.introLink.rowRenderer3d' }],
  },
  docs: {
    kind: 'scroll',
    rows: [{ targetId: 'docs', labelKey: 'main.introLink.rowDocs', icon: 'document' }],
  },
};
