// loadData에 넘기는 locale data 파일명 상수
export const DATA_FILE = {
  translations: 'translations.ts',
  projects: 'projects.ts',
  educations: 'educations.ts',
  experiences: 'experiences.ts',
  docs: 'docs.ts',
  skills: 'skills.ts',
} as const;

export type DataFileName = (typeof DATA_FILE)[keyof typeof DATA_FILE];
