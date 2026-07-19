// nextCycleValue 순환 단위 테스트
import { describe, expect, it } from 'vitest';
import { nextCycleValue } from './nextCycleValue';

const OPTIONS = [{ value: 'a' }, { value: 'b' }, { value: 'c' }] as const;

describe('nextCycleValue', () => {
  it('순서를 따라 다음 값으로 이동한다', () => {
    expect(nextCycleValue('a', OPTIONS)).toBe('b');
    expect(nextCycleValue('b', OPTIONS)).toBe('c');
  });

  it('마지막에서 처음으로 돌아간다', () => {
    expect(nextCycleValue('c', OPTIONS)).toBe('a');
  });

  it('없는 값이면 첫 옵션으로 간다', () => {
    expect(nextCycleValue('x', OPTIONS)).toBe('a');
  });
});
