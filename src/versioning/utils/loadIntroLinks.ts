// 버전 introLinks 로드 (merge: 공통 정의 위에 버전 패치 shallow merge)
import {
  INTRO_LINK_DEFINITIONS,
  type IntroLinkDefinitions,
} from '../../site/sections/main/introLinksConfig';
import { versionIntroLinks } from '../globs';
import { versionIntroLinksPath } from './paths';

export interface LoadIntroLinksOptions {
  hash: string;
}

/**
 * 공통 introLinks와 버전 패치를 shallow merge해 반환한다.
 * @param options.hash - 사이트 버전 해시. 빈 문자열이거나 패치 파일이 없으면 공통 정의만 반환한다.
 * @returns 공통 정의 위에 버전 패치를 덮어쓴 introLinks 맵
 */
export async function loadIntroLinks({
  hash,
}: LoadIntroLinksOptions): Promise<IntroLinkDefinitions> {
  const base: IntroLinkDefinitions = { ...INTRO_LINK_DEFINITIONS };
  if (!hash) return base;

  const loadVersionLinks = versionIntroLinks[versionIntroLinksPath(hash)];
  if (!loadVersionLinks) return base;

  const { default: versionPatch } = await loadVersionLinks();
  return {
    ...base,
    ...versionPatch,
  };
}
