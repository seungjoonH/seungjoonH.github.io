// docs 컬렉션에서 id로 문서 항목과 platform 키를 찾음
import { parseArray } from '@utils/parse';

export interface DocSource {
  type?: string;
  experienceId?: string;
  searchQuery?: string;
}

export interface DocItem {
  id: string;
  link?: string;
  title?: string;
  source?: DocSource;
  chipLabel?: string;
  platform?: string;
  /** 외부 링크 여부 — 새 탭 오픈. 기본 true (사이트 내부 라우트는 false) */
  external?: boolean;
  [key: string]: unknown;
}

export interface DocsCollection {
  portfolio?: DocItem[];
  notion?: DocItem[];
  githubWiki?: DocItem[];
  tistory?: DocItem[];
}

const DOC_PLATFORM_KEYS = ['portfolio', 'notion', 'githubWiki', 'tistory'] as const;

/**
 * docs 컬렉션에서 id로 문서 항목을 찾고 platform 키를 붙인다.
 * @param docs - 플랫폼별 문서 목록
 * @param id - 문서 id
 * @returns platform이 포함된 DocItem. 없으면 null
 */
export function getDocById(docs: DocsCollection | null, id: string): DocItem | null {
  if (!docs || !id) return null;
  const matched = DOC_PLATFORM_KEYS.map((key) => ({
    key,
    list: parseArray<DocItem>(docs[key]),
  })).find(({ list }) => list.some((doc) => doc.id === id));
  if (!matched) return null;
  const doc = matched.list.find((item) => item.id === id);
  if (!doc) return null;
  return { ...doc, platform: matched.key };
}
