// Stack Playground 스니펫 format/parse
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PLAYGROUND_CHILDREN,
  formatStackSnippet,
  parsePlaygroundChildren,
  parseStackProps,
  parseStackSnippet,
  type StackPlaygroundProps,
} from './stackPlaygroundCode';

const base: StackPlaygroundProps = {
  direction: 'horizontal',
  justify: 'start',
  align: 'center',
  gap: 'medium',
  width: 'stretch',
};

describe('stackPlaygroundCode', () => {
  it('formatStackSnippet이 multiline Stack 스니펫을 만든다', () => {
    const code = formatStackSnippet({ ...base, gap: 'large' });
    expect(code).toContain('direction="horizontal"');
    expect(code).toContain('gap="large"');
    expect(code).toContain('<Icon.Outlined name="settings" size="medium" />');
    expect(code).toContain('<Card>Card</Card>');
    expect(code).toContain('<Chip.Outlined label="chip" size="small" />');
    expect(code).toContain('</Stack>');
  });

  it('parseStackProps가 유효한 props만 반영한다', () => {
    const code = formatStackSnippet({
      direction: 'vertical',
      justify: 'end',
      align: 'stretch',
      gap: 'none',
      width: 'hug',
    });
    expect(parseStackProps(code, base)).toEqual({
      direction: 'vertical',
      justify: 'end',
      align: 'stretch',
      gap: 'none',
      width: 'hug',
    });
  });

  it('잘못된 토큰은 prev를 유지한다', () => {
    const code = `<Stack direction="diagonal" justify="start" gap="huge" width="stretch">`;
    expect(parseStackProps(code, base)).toEqual({
      ...base,
      justify: 'start',
      width: 'stretch',
    });
  });

  it('Icon.Primary로 바꾸면 children variant가 반영된다', () => {
    const code = formatStackSnippet(base).replace('Icon.Outlined', 'Icon.Primary');
    const parsed = parseStackSnippet(code, base, DEFAULT_PLAYGROUND_CHILDREN);
    expect(parsed.errors).toEqual([]);
    expect(parsed.children[0]).toEqual({
      kind: 'icon',
      variant: 'Primary',
      name: 'settings',
      size: 'medium',
    });
  });

  it('Icon.Outline은 에러를 내고 이전 children을 유지한다', () => {
    const code = formatStackSnippet(base).replace('Icon.Outlined', 'Icon.Outline');
    const parsed = parsePlaygroundChildren(code, DEFAULT_PLAYGROUND_CHILDREN);
    expect(parsed.errors[0]).toMatch(/Unknown Icon\.Outline/);
    expect(parsed.children).toEqual(DEFAULT_PLAYGROUND_CHILDREN);
  });
});
