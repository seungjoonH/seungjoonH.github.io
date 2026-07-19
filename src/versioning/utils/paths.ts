// glob 결과 키와 동일한 상대경로 문자열 (globs.ts 기준 ../)

/**
 * 버전별 루트 App 모듈 경로를 만든다.
 * @param hash - 사이트 버전 해시
 * @returns glob 키 형식의 App 모듈 경로
 */
export function versionAppPath(hash: string): string {
  return `../versions/${hash}/App.tsx`;
}

/**
 * 버전별 섹션 모듈 경로를 만든다.
 * @param hash - 사이트 버전 해시
 * @param path - 섹션 파일 상대경로 (예: `Projects.tsx`)
 * @returns glob 키 형식의 버전 섹션 경로
 */
export function versionSectionPath(hash: string, path: string): string {
  return `../versions/${hash}/sections/${path}`;
}

/**
 * site 공통 섹션 모듈 경로를 만든다.
 * @param path - 섹션 파일 상대경로 (예: `Projects.tsx`)
 * @returns glob 키 형식의 site 섹션 경로
 */
export function siteSectionPath(path: string): string {
  return `../site/sections/${path}`;
}

/**
 * 버전 locale data 모듈 경로를 만든다.
 * @param hash - 사이트 버전 해시
 * @param lang - locale (`ko` | `en` 등)
 * @param file - 데이터 파일명 (예: `projects.ts`)
 * @returns glob 키 형식의 버전 data 경로
 */
export function versionDataPath(hash: string, lang: string, file: string): string {
  return `../versions/${hash}/data/${lang}/${file}`;
}

/**
 * 공통 locale data 모듈 경로를 만든다.
 * @param lang - locale (`ko` | `en` 등)
 * @param file - 데이터 파일명 (예: `projects.ts`)
 * @returns glob 키 형식의 common data 경로
 */
export function commonDataPath(lang: string, file: string): string {
  return `../data/${lang}/${file}`;
}

/**
 * 버전 introLinks 패치 모듈 경로를 만든다.
 * @param hash - 사이트 버전 해시
 * @returns glob 키 형식의 introLinks 패치 경로
 */
export function versionIntroLinksPath(hash: string): string {
  return `../versions/${hash}/data/introLinks.ts`;
}
