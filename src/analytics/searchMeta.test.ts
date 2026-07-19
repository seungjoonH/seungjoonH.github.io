// buildSearchSubmitMeta 단위 테스트
import { describe, expect, it } from 'vitest';
import { buildSearchSubmitMeta } from './track';

describe('buildSearchSubmitMeta', () => {
  it('빈 쿼리면 빈 메타', () => {
    expect(buildSearchSubmitMeta('')).toEqual({
      queryBucket: '',
      tokenCount: 0,
      operatorUsed: [],
    });
    expect(buildSearchSubmitMeta(null)).toEqual({
      queryBucket: '',
      tokenCount: 0,
      operatorUsed: [],
    });
  });

  it('길이 버킷과 토큰·연산자를 계산한다', () => {
    expect(buildSearchSubmitMeta('ab')).toMatchObject({
      queryBucket: '1-5',
      tokenCount: 1,
      operatorUsed: [],
    });
    expect(buildSearchSubmitMeta('abcdef')).toMatchObject({ queryBucket: '6-10' });
    expect(buildSearchSubmitMeta('abcdefghijk')).toMatchObject({ queryBucket: '11+' });

    const meta = buildSearchSubmitMeta('title:foo stack:ts tag:bar');
    expect(meta.tokenCount).toBe(3);
    expect(meta.operatorUsed).toEqual(['title', 'stack', 'tag']);
  });
});
