// 버전 locale data 로드 (replace: 버전 우선, 없으면 common)
import type { DataFileName } from '../files';
import { commonDataModules, versionDataModules } from '../globs';
import { commonDataPath, versionDataPath } from './paths';

export interface LoadDataOptions {
  hash: string;
  lang: string;
  file: DataFileName;
}

/**
 * 버전→common 순으로 data 모듈 default export를 반환한다.
 * @param options.hash - 사이트 버전 해시. 빈 문자열이면 버전을 건너뛴다.
 * @param options.lang - locale (`ko` | `en` 등)
 * @param options.file - DATA_FILE에 정의된 파일명
 * @returns data 모듈의 default export
 * @throws 버전·common 모두 없으면 `Missing data file: {lang}/{file}`
 */
export async function loadData({ hash, lang, file }: LoadDataOptions): Promise<unknown> {
  if (hash) {
    const loadVersionFile = versionDataModules[versionDataPath(hash, lang, file)];
    if (loadVersionFile) {
      const { default: data } = await loadVersionFile();
      return data;
    }
  }

  const loadCommonFile = commonDataModules[commonDataPath(lang, file)];
  if (loadCommonFile) {
    const { default: data } = await loadCommonFile();
    return data;
  }

  throw new Error(`Missing data file: ${lang}/${file}`);
}
