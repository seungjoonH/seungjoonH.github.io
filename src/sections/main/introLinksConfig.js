export const INTRO_LINK_DEFINITIONS = {
  portfolio: {
    kind: 'search',
    rows: [{ query: 'title:"개인 포트폴리오"|title:"Personal Portfolio"', labelKey: 'main.introLink.rowPortfolio' }],
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

export function getIntroLinkDefinition(id) {
  return INTRO_LINK_DEFINITIONS[id] ?? null;
}
