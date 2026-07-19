// CodeBlock / CodeField 공용 grayscale 토크나이저 단위 테스트
import { describe, expect, it } from 'vitest';
import { joinTokens, tokenizeCode } from './codeHighlight';

describe('tokenizeCode', () => {
  it('tsx — 원문을 보존한다', () => {
    const code = `<Stack\n  direction="column"\n  gap="md"\n>\n  <Icon name="grid" />\n</Stack>`;
    expect(joinTokens(tokenizeCode(code, 'tsx'))).toBe(code);
  });

  it('tsx — tag/attr/value를 구분한다', () => {
    const tokens = tokenizeCode('<Icon name="grid" />', 'tsx');
    expect(tokens.filter((t) => t.kind === 'tag').map((t) => t.text)).toEqual([
      '<Icon',
      '/>',
    ]);
    expect(tokens.some((t) => t.kind === 'attr' && t.text === 'name')).toBe(true);
    expect(tokens.some((t) => t.kind === 'value' && t.text === '"grid"')).toBe(true);
  });

  it('html — 원문을 보존한다', () => {
    const code = '<div class="card">\n  <span>hi</span>\n</div>';
    expect(joinTokens(tokenizeCode(code, 'html'))).toBe(code);
  });

  it('css — 원문을 보존하고 속성을 구분한다', () => {
    const code = `.root {\n  color: red;\n  /* note */\n  margin: 8px;\n}`;
    expect(joinTokens(tokenizeCode(code, 'css'))).toBe(code);
    const tokens = tokenizeCode(code, 'css');
    expect(tokens.some((t) => t.kind === 'tag' && t.text === '.root')).toBe(true);
    expect(tokens.some((t) => t.kind === 'attr' && t.text === 'color')).toBe(true);
    expect(tokens.some((t) => t.kind === 'equal' && t.text === ':')).toBe(true);
    expect(tokens.some((t) => t.kind === 'comment')).toBe(true);
  });

  it('brace value를 한 덩어리로 잡는다', () => {
    const code = '<Chip label={name} />';
    expect(joinTokens(tokenizeCode(code, 'tsx'))).toBe(code);
    expect(tokenizeCode(code, 'tsx').some((t) => t.kind === 'value' && t.text === '{name}')).toBe(
      true,
    );
  });
});
