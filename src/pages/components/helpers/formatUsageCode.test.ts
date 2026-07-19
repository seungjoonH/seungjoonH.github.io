// formatUsageCode / tokenizeUsageCode 단위 테스트
import { describe, expect, it } from 'vitest';
import { formatUsageCode, tokenizeUsageCode } from './formatUsageCode';

describe('formatUsageCode', () => {
  it('props 없으면 한 줄', () => {
    expect(formatUsageCode('<ThemeToggleButton />')).toBe('<ThemeToggleButton />');
  });

  it('props를 세로로 펼친다', () => {
    expect(formatUsageCode('<TextButton variant="outlined" size="medium" />')).toBe(
      `<TextButton
  variant="outlined"
  size="medium"
/>`
    );
  });

  it('boolean·표현식 props를 유지한다', () => {
    expect(
      formatUsageCode('<ToggleIconButton name="sun" pressed={false} shape="full" />')
    ).toBe(
      `<ToggleIconButton
  name="sun"
  pressed={false}
  shape="full"
/>`
    );
  });

  it('점 표기 컴포넌트명을 유지한다', () => {
    expect(formatUsageCode('<Chip.Secondary label="React" />')).toBe(
      `<Chip.Secondary
  label="React"
/>`
    );
  });

  it('이미 여러 줄인 props도 모두 유지한다', () => {
    expect(
      formatUsageCode(`<FieldCard
  iconName="deploy"
  label="Deploy"
  value="staging-ready"
/>`)
    ).toBe(
      `<FieldCard
  iconName="deploy"
  label="Deploy"
  value="staging-ready"
/>`
    );
  });

  it('children이 있는 JSX는 children까지 유지한다', () => {
    expect(
      formatUsageCode(`<Stack direction="vertical" gap="medium">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`)
    ).toBe(
      `<Stack direction="vertical" gap="medium">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`
    );
  });
});

describe('tokenizeUsageCode', () => {
  it('tag / attr / equal / value 를 분리한다', () => {
    expect(tokenizeUsageCode('<Icon name="angle-left" kind="outline" />')).toEqual([
      { kind: 'tag', text: '<Icon' },
      { kind: 'plain', text: '\n  ' },
      { kind: 'attr', text: 'name' },
      { kind: 'equal', text: '=' },
      { kind: 'value', text: '"angle-left"' },
      { kind: 'plain', text: '\n  ' },
      { kind: 'attr', text: 'kind' },
      { kind: 'equal', text: '=' },
      { kind: 'value', text: '"outline"' },
      { kind: 'plain', text: '\n' },
      { kind: 'tag', text: '/>' },
    ]);
  });

  it('boolean·표현식도 토큰화한다', () => {
    expect(tokenizeUsageCode('<ToggleIconButton pressed={false} shape="full" />')).toEqual([
      { kind: 'tag', text: '<ToggleIconButton' },
      { kind: 'plain', text: '\n  ' },
      { kind: 'attr', text: 'pressed' },
      { kind: 'equal', text: '=' },
      { kind: 'value', text: '{false}' },
      { kind: 'plain', text: '\n  ' },
      { kind: 'attr', text: 'shape' },
      { kind: 'equal', text: '=' },
      { kind: 'value', text: '"full"' },
      { kind: 'plain', text: '\n' },
      { kind: 'tag', text: '/>' },
    ]);
  });

  it('주석 안 숫자·문자열도 comment 한 덩어리로 둔다', () => {
    expect(
      tokenizeUsageCode(`/* config: 860 / 1240 */
// type → "desktop"`)
    ).toEqual([
      { kind: 'comment', text: '/* config: 860 / 1240 */' },
      { kind: 'plain', text: '\n' },
      { kind: 'comment', text: '// type → "desktop"' },
    ]);
  });
});
