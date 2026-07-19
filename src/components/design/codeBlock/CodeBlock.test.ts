// splitHighlightWords — 긴 단어 우선·식별자 경계
import { describe, expect, it } from 'vitest';
import { splitHighlightWords } from './CodeBlock';

describe('splitHighlightWords', () => {
  it('지정 단어만 hit 한다', () => {
    const parts = splitHighlightWords('function IconButton() { return <Icon /> }', [
      'IconButton',
      'Icon',
    ]);
    expect(parts.filter((p) => p.hit).map((p) => p.text)).toEqual(['IconButton', 'Icon']);
    expect(parts.map((p) => p.text).join('')).toBe('function IconButton() { return <Icon /> }');
  });

  it('IconButton 안의 Icon은 경계 때문에 매칭하지 않는다', () => {
    const parts = splitHighlightWords('IconButton', ['Icon']);
    expect(parts).toEqual([{ text: 'IconButton', hit: false }]);
  });

  it('긴 단어를 우선한다', () => {
    const parts = splitHighlightWords('SearchChipButton', ['Chip', 'SearchChipButton']);
    expect(parts).toEqual([{ text: 'SearchChipButton', hit: true }]);
  });
});
