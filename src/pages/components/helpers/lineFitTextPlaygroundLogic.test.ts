// lineFitTextPlaygroundLogic 순수 로직 단위 테스트
import { describe, expect, it } from 'vitest';
import {
  LINE_FIT_TEXT_MIN_LINE_COUNT,
  buildLineFitTextUsageCode,
  parseLineCount,
} from './lineFitTextPlaygroundLogic';

describe('parseLineCount', () => {
  it('유효한 정수 문자열을 파싱한다', () => {
    expect(parseLineCount('3')).toBe(3);
  });

  it('소수 문자열은 내림한다', () => {
    expect(parseLineCount('2.9')).toBe(2);
  });

  it('빈 문자열이면 null', () => {
    expect(parseLineCount('   ')).toBeNull();
  });

  it('숫자가 아니면 null', () => {
    expect(parseLineCount('abc')).toBeNull();
  });

  it('최솟값보다 작으면 null', () => {
    expect(parseLineCount(String(LINE_FIT_TEXT_MIN_LINE_COUNT - 1))).toBeNull();
  });
});

describe('buildLineFitTextUsageCode', () => {
  it('lineCount가 2가 아니면 splitRatio를 생략한다', () => {
    expect(buildLineFitTextUsageCode({ text: 'hello', lineCount: 3 })).toBe(
      '<LineFitText\n  text="hello"\n  lineCount={3}\n/>',
    );
  });

  it('lineCount가 2면 splitRatio를 포함한다', () => {
    expect(
      buildLineFitTextUsageCode({ text: 'hello', lineCount: 2, splitRatio: 0.7 }),
    ).toBe('<LineFitText\n  text="hello"\n  lineCount={2}\n  splitRatio={0.7}\n/>');
  });

  it('샘플 문장의 큰따옴표를 이스케이프한다', () => {
    expect(buildLineFitTextUsageCode({ text: 'say "hi"', lineCount: 1 })).toBe(
      '<LineFitText\n  text="say \\"hi\\""\n  lineCount={1}\n/>',
    );
  });
});
