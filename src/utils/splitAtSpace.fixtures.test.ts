// experience section title 분할 fixture (폭은 문자 길이 measure)
import { describe, expect, it } from 'vitest';
import { splitAtSpaceFittingWidth } from './splitAtSpace';

const measure = (s: string) => s.length;

/** 실제 experiences section titles */
export const EXPERIENCE_TITLE_FIXTURES = {
  ko: [
    'Fitween 앱 출시 및 버전 릴리즈 관리',
    '정부 및 민간 창업 지원 사업 출전',
    'Foodrain 사용자/관리자 웹 유지보수',
    '사내 공통 유틸리티 Flutter 패키지 개발',
    'Vanilla JS 의 명령형 DOM 조작부터 React 의 선언적 렌더링까지 이어지는 DOM 렌더링 흐름 이해',
    'Vanilla JS Store 부터 Zustand 까지 이어지는 상태 관리 흐름 이해',
  ],
  en: [
    'App launch and release management',
    'Government and private startup programs',
    'Foodrain user/admin web maintenance',
    'Internal Flutter utility package',
    'From imperative DOM manipulation in Vanilla JS to declarative rendering in React',
    'From a hand-rolled Vanilla JS Store to understanding Zustand',
  ],
} as const;

describe('experience title fixtures', () => {
  it('짧은 폭에서도 L1은 maxWidth를 넘지 않거나 wrap이다', () => {
    for (const title of [...EXPERIENCE_TITLE_FIXTURES.ko, ...EXPERIENCE_TITLE_FIXTURES.en]) {
      for (const w of [12, 18, 24, 40, 80]) {
        const r = splitAtSpaceFittingWidth(title, measure, w, 0.65);
        if (r.mode === 'single') {
          expect(measure(r.first)).toBeLessThanOrEqual(w);
        } else if (r.mode === 'split') {
          expect(measure(r.first)).toBeLessThanOrEqual(w);
          expect(r.first.length).toBeGreaterThanOrEqual(r.second!.length);
        } else {
          expect(r.mode).toBe('wrap');
          expect(r.first).toBe(title);
        }
      }
    }
  });

  it('KO Vanilla DOM — 넉넉한 폭에서 L1≥60% split', () => {
    const title = EXPERIENCE_TITLE_FIXTURES.ko[4];
    const r = splitAtSpaceFittingWidth(title, measure, 50, 0.65);
    expect(r.mode).toBe('split');
    expect(r.first.length / title.length).toBeGreaterThanOrEqual(0.6);
    expect(r.first.length).toBeGreaterThanOrEqual(r.second!.length);
    expect(r.second).toBe('이어지는 DOM 렌더링 흐름 이해');
  });

  it('KO Zustand — 넉넉한 폭에서 L1이 더 긴 split', () => {
    const title = EXPERIENCE_TITLE_FIXTURES.ko[5];
    const r = splitAtSpaceFittingWidth(title, measure, 40, 0.65);
    expect(r.mode).toBe('split');
    expect(r.first.length).toBeGreaterThanOrEqual(r.second!.length);
    expect(r.first).toContain('Zustand');
    expect(r.second).toBe('이어지는 상태 관리 흐름 이해');
  });

  it('전체 길이 ≤ 폭이면 single', () => {
    const title = EXPERIENCE_TITLE_FIXTURES.ko[1];
    const r = splitAtSpaceFittingWidth(title, measure, title.length + 5, 0.65);
    expect(r).toEqual({ mode: 'single', first: title });
  });
});
