// versioning/utils 단위 테스트 (paths / replace / merge)
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  commonDataPath,
  siteSectionPath,
  versionAppPath,
  versionDataPath,
  versionIntroLinksPath,
  versionSectionPath,
} from './paths';
import { DATA_FILE } from '../files';

const versionDataModules: Record<string, () => Promise<{ default: unknown }>> = {};
const commonDataModules: Record<string, () => Promise<{ default: unknown }>> = {};
const versionSections: Record<string, () => Promise<{ default: unknown }>> = {};
const siteSections: Record<string, () => Promise<{ default: unknown }>> = {};
const versionIntroLinks: Record<string, () => Promise<{ default: unknown }>> = {};

vi.mock('../globs', () => ({
  get versionDataModules() {
    return versionDataModules;
  },
  get commonDataModules() {
    return commonDataModules;
  },
  get versionSections() {
    return versionSections;
  },
  get siteSections() {
    return siteSections;
  },
  get versionIntroLinks() {
    return versionIntroLinks;
  },
  versionApps: {},
}));

vi.mock('../../site/sections/main/introLinksConfig', () => ({
  INTRO_LINK_DEFINITIONS: {
    portfolio: { kind: 'search', rows: [{ query: 'base' }] },
    shared: { kind: 'search', rows: [{ query: 'keep' }] },
  },
}));

describe('paths', () => {
  it('버전·공통 키를 globs.ts 기준 상대경로로 만든다', () => {
    expect(versionAppPath('abc')).toBe('../versions/abc/App.tsx');
    expect(versionSectionPath('abc', 'Main.tsx')).toBe('../versions/abc/sections/Main.tsx');
    expect(siteSectionPath('Main.tsx')).toBe('../site/sections/Main.tsx');
    expect(versionDataPath('abc', 'en', 'projects.ts')).toBe(
      '../versions/abc/data/en/projects.ts'
    );
    expect(commonDataPath('ko', 'docs.ts')).toBe('../data/ko/docs.ts');
    expect(versionIntroLinksPath('abc')).toBe('../versions/abc/data/introLinks.ts');
  });
});

describe('loadData (replace)', () => {
  beforeEach(() => {
    for (const key of Object.keys(versionDataModules)) delete versionDataModules[key];
    for (const key of Object.keys(commonDataModules)) delete commonDataModules[key];
  });

  it('버전 파일이 있으면 버전 default를 반환한다', async () => {
    const { loadData } = await import('./loadData');
    const key = versionDataPath('v1', 'en', DATA_FILE.projects);
    versionDataModules[key] = async () => ({ default: [{ id: 'version' }] });

    await expect(
      loadData({ hash: 'v1', lang: 'en', file: DATA_FILE.projects })
    ).resolves.toEqual([{ id: 'version' }]);
  });

  it('버전 파일이 없으면 common으로 폴백한다', async () => {
    const { loadData } = await import('./loadData');
    const key = commonDataPath('en', DATA_FILE.projects);
    commonDataModules[key] = async () => ({ default: [{ id: 'common' }] });

    await expect(
      loadData({ hash: 'missing', lang: 'en', file: DATA_FILE.projects })
    ).resolves.toEqual([{ id: 'common' }]);
  });

  it('둘 다 없으면 에러를 던진다', async () => {
    const { loadData } = await import('./loadData');
    await expect(
      loadData({ hash: '', lang: 'en', file: DATA_FILE.docs })
    ).rejects.toThrow('Missing data file: en/docs.ts');
  });
});

describe('loadSection (replace)', () => {
  beforeEach(() => {
    for (const key of Object.keys(versionSections)) delete versionSections[key];
    for (const key of Object.keys(siteSections)) delete siteSections[key];
  });

  it('버전 섹션이 있으면 버전 모듈을 반환한다', async () => {
    const { loadSection } = await import('./loadSection');
    const key = versionSectionPath('v1', 'Main.tsx');
    const mod = { default: () => null };
    versionSections[key] = async () => mod;

    await expect(loadSection({ hash: 'v1', path: 'Main.tsx' })).resolves.toBe(mod);
  });

  it('없으면 site로 폴백한다', async () => {
    const { loadSection } = await import('./loadSection');
    const key = siteSectionPath('Main.tsx');
    const mod = { default: () => null };
    siteSections[key] = async () => mod;

    await expect(loadSection({ hash: 'v1', path: 'Main.tsx' })).resolves.toBe(mod);
  });
});

describe('loadIntroLinks (merge)', () => {
  beforeEach(() => {
    for (const key of Object.keys(versionIntroLinks)) delete versionIntroLinks[key];
  });

  it('패치가 없으면 공통 정의만 반환한다', async () => {
    const { loadIntroLinks } = await import('./loadIntroLinks');
    const result = await loadIntroLinks({ hash: '' });
    expect(result.portfolio).toEqual({ kind: 'search', rows: [{ query: 'base' }] });
    expect(result.shared).toEqual({ kind: 'search', rows: [{ query: 'keep' }] });
  });

  it('버전 패치를 shallow merge한다', async () => {
    const { loadIntroLinks } = await import('./loadIntroLinks');
    const key = versionIntroLinksPath('v1');
    versionIntroLinks[key] = async () => ({
      default: {
        portfolio: { kind: 'search', rows: [{ query: 'patched' }] },
      },
    });

    const result = await loadIntroLinks({ hash: 'v1' });
    expect(result.portfolio).toEqual({ kind: 'search', rows: [{ query: 'patched' }] });
    expect(result.shared).toEqual({ kind: 'search', rows: [{ query: 'keep' }] });
  });
});
