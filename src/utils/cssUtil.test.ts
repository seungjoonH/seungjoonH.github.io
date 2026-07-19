// buildCls의 truthy 필터링·공백 결합 규칙 검증
import { describe, expect, it } from 'vitest';
import { buildCls } from '@utils/cssUtil';

describe('buildCls', () => {
  it('truthy 문자열만 공백으로 이어 붙인다', () => {
    expect(buildCls('root', 'open')).toBe('root open');
  });

  it('false/null/undefined 인자를 제외한다', () => {
    expect(buildCls('root', false, null, undefined, 'open')).toBe('root open');
  });

  it('조건부 variant 클래스 토글을 반영한다', () => {
    const selected = true;
    expect(buildCls('segment', selected && 'segmentActive')).toBe('segment segmentActive');
    expect(buildCls('segment', !selected && 'segmentActive')).toBe('segment');
  });

  it('인자가 없으면 빈 문자열을 반환한다', () => {
    expect(buildCls()).toBe('');
  });
});
