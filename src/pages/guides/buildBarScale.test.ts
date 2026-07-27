// buildBarScale 순수 로직 단위 테스트
import { describe, expect, it } from 'vitest';
import { scaleWidthPercent } from './buildBarScale';

describe('scaleWidthPercent', () => {
  it('value를 max 기준 백분율로 변환한다', () => {
    expect(scaleWidthPercent(113, 323)).toBeCloseTo(34.98, 1);
    expect(scaleWidthPercent(323, 323)).toBe(100);
  });

  it('max를 초과하면 100으로 clamp한다', () => {
    expect(scaleWidthPercent(400, 323)).toBe(100);
  });

  it('음수는 0으로 clamp한다', () => {
    expect(scaleWidthPercent(-10, 323)).toBe(0);
  });

  it('max가 0이면 0을 반환한다 (0으로 나누기 방지)', () => {
    expect(scaleWidthPercent(10, 0)).toBe(0);
  });
});
