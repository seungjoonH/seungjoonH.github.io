export function normalizeType(type) {
  return String(type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const linkTypeLabel = {
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

export function getLinkTypeLabel(type) {
  return linkTypeLabel[normalizeType(type)] ?? 'Link';
}

export function linkIconNameByType(type) {
  const key = normalizeType(type);
  if (key === 'github') return 'github';
  return '';
}

export function deployLabelByType(type) {
  const key = normalizeType(type);
  if (key === 'appstore') return 'Appstore 배포 링크';
  if (key === 'deploy') return '배포 링크';
  if (key === 'pubdev') return 'pub.dev 배포 링크';
  if (key === 'npm') return 'npm 배포 링크';
  return '';
}
