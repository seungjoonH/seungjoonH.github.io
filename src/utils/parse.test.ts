// parseRecord / parseArray / isRecord 단위 테스트
import { describe, expect, it } from 'vitest';
import { isRecord, parseArray, parseRecord, parseString, parseTrimmedString } from './parse';

describe('isRecord', () => {
  it('순수 객체만 true', () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isRecord([])).toBe(false);
    expect(isRecord('x')).toBe(false);
  });
});

describe('parseRecord', () => {
  it('객체면 그대로, 아니면 fallback', () => {
    const obj = { a: 1 };
    expect(parseRecord(obj)).toBe(obj);
    expect(parseRecord(null)).toEqual({});
    expect(parseRecord([], { empty: true })).toEqual({ empty: true });
  });
});

describe('parseArray', () => {
  it('배열이면 그대로, 아니면 fallback', () => {
    const list = [1, 2];
    expect(parseArray(list)).toBe(list);
    expect(parseArray(undefined)).toEqual([]);
    expect(parseArray('x', [0])).toEqual([0]);
  });
});

describe('parseString', () => {
  it('문자열이면 그대로, 아니면 fallback', () => {
    expect(parseString('hi')).toBe('hi');
    expect(parseString(null)).toBe('');
    expect(parseString(1, 'x')).toBe('x');
  });
});

describe('parseTrimmedString', () => {
  it('문자열이면 trim, 아니면 fallback', () => {
    expect(parseTrimmedString('  a  ')).toBe('a');
    expect(parseTrimmedString(undefined)).toBe('');
  });
});
