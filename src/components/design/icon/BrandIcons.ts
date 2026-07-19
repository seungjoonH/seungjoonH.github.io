// 브랜드·제품·기술 로고 마크 이름 상수 (assets/icons/brand)
export const BrandIcons = {
  appstore: 'appstore',
  aws: 'aws',
  c: 'c',
  cpp: 'cpp',
  css: 'css',
  dart: 'dart',
  docker: 'docker',
  firebase: 'firebase',
  flutter: 'flutter',
  git: 'git',
  github: 'github',
  html5: 'html5',
  java: 'java',
  javascript: 'javascript',
  linkedin: 'linkedin',
  mariadb: 'mariadb',
  mysql: 'mysql',
  nestjs: 'nestjs',
  nextjs: 'nextjs',
  nodejs: 'nodejs',
  notion: 'notion',
  postgresql: 'postgresql',
  python: 'python',
  react: 'react',
  redis: 'redis',
  s3: 's3',
  socketio: 'socketio',
  springboot: 'springboot',
  tistory: 'tistory',
  typescript: 'typescript',
} as const;

export type BrandIconName = (typeof BrandIcons)[keyof typeof BrandIcons];

export const BRAND_ICON_NAMES = Object.values(BrandIcons);
