// 프로젝트 링크 type 정규화·라벨·아이콘 이름 매핑
export function normalizeType(type?: string): string {
  return String(type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const linkTypeLabel: Record<string, string> = {
  github: 'Github',
  githubwiki: 'Github Wiki',
  notion: 'Notion',
  tistory: 'Tistory',
  npm: 'NPM',
  pubdev: 'pub.dev',
  deploy: 'Deploy',
  appstore: 'App Store',
  blog: 'Blog',
  external: 'Link',
  news: 'News',
};

export function getLinkTypeLabel(type?: string): string {
  return linkTypeLabel[normalizeType(type)] ?? 'Link';
}

export function linkIconNameByType(type?: string): string {
  const key = normalizeType(type);
  if (key === 'github') return 'github';
  return '';
}

export function deployLabelByType(type?: string): string {
  const key = normalizeType(type);
  if (key === 'appstore') return 'Appstore 배포 링크';
  if (key === 'deploy') return '배포 링크';
  if (key === 'pubdev') return 'pub.dev 배포 링크';
  if (key === 'npm') return 'npm 배포 링크';
  return '';
}
