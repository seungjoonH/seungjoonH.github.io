// 섹션 모듈 로드 (replace: 버전 우선, 없으면 site)
import { siteSections, versionSections, type SectionModule } from '../globs';
import { siteSectionPath, versionSectionPath } from './paths';

export type { SectionModule };

export interface LoadSectionOptions {
  hash: string;
  path: string;
}

/**
 * 버전→site 순으로 섹션 모듈을 반환한다.
 * @param options.hash - 사이트 버전 해시. 빈 문자열이면 버전을 건너뛴다.
 * @param options.path - 섹션 파일 상대경로 (예: `Projects.tsx`)
 * @returns 동적 import된 섹션 모듈
 * @throws site에도 없으면 `Missing site section: {path}`
 */
export async function loadSection({ hash, path }: LoadSectionOptions): Promise<SectionModule> {
  if (hash) {
    const loadVersion = versionSections[versionSectionPath(hash, path)];
    if (loadVersion) return loadVersion();
  }

  const loadSite = siteSections[siteSectionPath(path)];
  if (!loadSite) throw new Error(`Missing site section: ${path}`);

  return loadSite();
}
