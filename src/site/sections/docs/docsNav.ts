// Docs 폴더 펼침·행 포커스·소스 칩 이동 헬퍼
import { parseArray } from '@utils/parse';
import type { DocItem, DocSource, DocsCollection } from './getDocById';

export const DOC_CATEGORIES = {
  portfolio: { label: 'Portfolio', icon: 'pano' },
  notion: { label: 'Notion', icon: 'notion' },
  githubWiki: { label: 'Github Wiki', icon: 'github' },
  tistory: { label: 'Tistory', icon: 'tistory' },
} as const;

export type DocCategoryKey = keyof typeof DOC_CATEGORIES;

export const DOC_CATEGORY_KEYS = Object.keys(DOC_CATEGORIES) as DocCategoryKey[];

export type ExpandedFolders = Record<DocCategoryKey, boolean>;

export type { DocItem, DocSource };

/**
 * 해당 카테고리만 열린 펼침 상태.
 * @param openKey - 열어 둘 카테고리
 */
export function expandOnly(openKey: DocCategoryKey): ExpandedFolders {
  return {
    portfolio: openKey === 'portfolio',
    notion: openKey === 'notion',
    githubWiki: openKey === 'githubWiki',
    tistory: openKey === 'tistory',
  };
}

/**
 * doc id가 들어 있는 카테고리를 찾는다.
 * @param docs - 카테고리별 문서
 * @param id - 문서 id
 * @returns 카테고리 키. 없으면 null
 */
export function findCategoryForDoc(docs: DocsCollection, id: string): DocCategoryKey | null {
  for (const key of DOC_CATEGORY_KEYS) {
    if (parseArray<DocItem>(docs[key]).some((doc) => doc.id === id)) return key;
  }
  return null;
}

/** 카테고리에 문서가 하나라도 로드됐는지 */
export function hasAnyDocs(docs: DocsCollection): boolean {
  return DOC_CATEGORY_KEYS.some((key) => parseArray<DocItem>(docs[key]).length > 0);
}

/**
 * @param elementId - DOM id
 * @param block - scrollIntoView block
 */
export function scrollToId(elementId: string, block: ScrollLogicalPosition = 'start'): void {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block });
}

export interface DocSourceNavigation {
  setExperienceIdToFocus: (id: string | null) => void;
  setQueryFromShortcut: (query: string) => void;
}

/**
 * 문서 소스 칩 클릭 시 experience/project로 스크롤·포커스.
 * @param source - 문서 source
 * @param nav - 포커스/검색 세터
 */
export function navigateFromDocSource(source: DocSource, nav: DocSourceNavigation): void {
  if (source.type === 'experience' && source.experienceId) {
    nav.setExperienceIdToFocus(source.experienceId);
    scrollToId('experience');
    return;
  }
  if (source.type === 'project' && source.searchQuery) {
    nav.setQueryFromShortcut(source.searchQuery);
    scrollToId('project');
  }
}
