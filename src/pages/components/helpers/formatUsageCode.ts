// 갤러리 usage 코드 포맷 + grayscale 토큰 분리
export type UsageTokenKind = 'tag' | 'attr' | 'equal' | 'value' | 'comment' | 'plain';

export interface UsageToken {
  kind: UsageTokenKind;
  text: string;
}

/** JSX attribute 문자열을 토큰 배열로 분리 */
function splitAttrs(raw: string): string[] {
  const attrs: string[] = [];
  let i = 0;
  const s = raw.trim();
  while (i < s.length) {
    while (/\s/.test(s[i] ?? '')) i += 1;
    if (i >= s.length) break;

    const nameMatch = s.slice(i).match(/^[A-Za-z_][\w-]*/);
    if (!nameMatch) break;
    const name = nameMatch[0];
    i += name.length;

    while (/\s/.test(s[i] ?? '')) i += 1;
    if (s[i] !== '=') {
      attrs.push(name);
      continue;
    }
    i += 1;
    while (/\s/.test(s[i] ?? '')) i += 1;

    if (s[i] === '"' || s[i] === "'") {
      const quote = s[i]!;
      i += 1;
      let end = i;
      while (end < s.length && s[end] !== quote) end += 1;
      attrs.push(`${name}=${quote}${s.slice(i, end)}${quote}`);
      i = end + 1;
      continue;
    }

    if (s[i] === '{') {
      let depth = 0;
      let end = i;
      while (end < s.length) {
        const ch = s[end]!;
        if (ch === '{') depth += 1;
        else if (ch === '}') {
          depth -= 1;
          if (depth === 0) {
            end += 1;
            break;
          }
        }
        end += 1;
      }
      attrs.push(`${name}=${s.slice(i, end)}`);
      i = end;
      continue;
    }

    const bare = s.slice(i).match(/^[^\s]+/);
    if (!bare) {
      attrs.push(name);
      break;
    }
    attrs.push(`${name}=${bare[0]}`);
    i += bare[0].length;
  }
  return attrs;
}

/**
 * `<Foo a="1" b="2" />` → props별 여러 줄.
 * props가 없으면 한 줄 유지.
 */
export function formatUsageCode(code: string): string {
  const trimmed = code.trim();
  if (/<\/[A-Za-z][\w.]*>$/.test(trimmed)) return trimmed;

  const match = trimmed.match(/^<([A-Za-z][\w.]*)(\s[\s\S]*?)?\s*(\/)?>$/);
  if (!match) return trimmed;

  const tag = match[1]!;
  const attrsRaw = (match[2] ?? '').trim();
  const selfClosing = Boolean(match[3]) || trimmed.endsWith('/>');

  if (!attrsRaw) {
    return selfClosing ? `<${tag} />` : `<${tag}>`;
  }

  const attrs = splitAttrs(attrsRaw);
  if (attrs.length === 0) return trimmed;

  const body = attrs.map((attr) => `  ${attr}`).join('\n');
  return selfClosing ? `<${tag}\n${body}\n/>` : `<${tag}\n${body}\n>`;
}

/** 포맷된 usage 코드를 tag/attr/equal/value 토큰으로 분리 */
export function tokenizeUsageCode(code: string): UsageToken[] {
  const s = formatUsageCode(code);
  const tokens: UsageToken[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i]!;

    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /\s/.test(s[j]!)) j += 1;
      tokens.push({ kind: 'plain', text: s.slice(i, j) });
      i = j;
      continue;
    }

    // 주석은 내부 숫자·문자열까지 한 덩어리로 (하이라이트 분리 방지)
    if (s.startsWith('//', i)) {
      let j = i + 2;
      while (j < s.length && s[j] !== '\n') j += 1;
      tokens.push({ kind: 'comment', text: s.slice(i, j) });
      i = j;
      continue;
    }

    if (s.startsWith('/*', i)) {
      let j = i + 2;
      while (j < s.length && !s.startsWith('*/', j)) j += 1;
      if (s.startsWith('*/', j)) j += 2;
      tokens.push({ kind: 'comment', text: s.slice(i, j) });
      i = j;
      continue;
    }

    if (s.startsWith('/>', i)) {
      tokens.push({ kind: 'tag', text: '/>' });
      i += 2;
      continue;
    }

    if (ch === '>') {
      tokens.push({ kind: 'tag', text: '>' });
      i += 1;
      continue;
    }

    if (ch === '<') {
      const tagMatch = s.slice(i).match(/^<\/?[A-Za-z][\w.]*/);
      if (tagMatch) {
        tokens.push({ kind: 'tag', text: tagMatch[0] });
        i += tagMatch[0].length;
        continue;
      }
    }

    const nameMatch = s.slice(i).match(/^[A-Za-z_][\w-]*/);
    if (nameMatch) {
      tokens.push({ kind: 'attr', text: nameMatch[0] });
      i += nameMatch[0].length;

      while (s[i] === ' ') {
        tokens.push({ kind: 'plain', text: ' ' });
        i += 1;
      }

      if (s[i] === '=') {
        tokens.push({ kind: 'equal', text: '=' });
        i += 1;

        while (s[i] === ' ') {
          tokens.push({ kind: 'plain', text: ' ' });
          i += 1;
        }

        if (s[i] === '"' || s[i] === "'") {
          const quote = s[i]!;
          let end = i + 1;
          while (end < s.length && s[end] !== quote) end += 1;
          tokens.push({ kind: 'value', text: s.slice(i, end + 1) });
          i = end + 1;
        } else if (s[i] === '{') {
          let depth = 0;
          let end = i;
          while (end < s.length) {
            if (s[end] === '{') depth += 1;
            else if (s[end] === '}') {
              depth -= 1;
              if (depth === 0) {
                end += 1;
                break;
              }
            }
            end += 1;
          }
          tokens.push({ kind: 'value', text: s.slice(i, end) });
          i = end;
        }
      }
      continue;
    }

    tokens.push({ kind: 'plain', text: ch });
    i += 1;
  }

  return tokens;
}
