// CodeBlock / CodeField 공용 grayscale syntax 토큰 — 원문 보존
export type CodeLanguage = 'tsx' | 'css' | 'html';

export type CodeTokenKind = 'tag' | 'attr' | 'equal' | 'value' | 'comment' | 'plain';

export interface CodeToken {
  kind: CodeTokenKind;
  text: string;
}

function pushPlain(tokens: CodeToken[], text: string): void {
  if (!text) return;
  tokens.push({ kind: 'plain', text });
}

function takeComment(s: string, i: number): { text: string; end: number } | null {
  if (s.startsWith('//', i)) {
    let j = i + 2;
    while (j < s.length && s[j] !== '\n') j += 1;
    return { text: s.slice(i, j), end: j };
  }
  if (s.startsWith('/*', i)) {
    let j = i + 2;
    while (j < s.length && !s.startsWith('*/', j)) j += 1;
    if (s.startsWith('*/', j)) j += 2;
    return { text: s.slice(i, j), end: j };
  }
  return null;
}

function takeString(s: string, i: number): { text: string; end: number } | null {
  const q = s[i];
  if (q !== '"' && q !== "'" && q !== '`') return null;
  let j = i + 1;
  while (j < s.length) {
    if (s[j] === '\\' && j + 1 < s.length) {
      j += 2;
      continue;
    }
    if (s[j] === q) {
      j += 1;
      break;
    }
    j += 1;
  }
  return { text: s.slice(i, j), end: j };
}

function takeBraceValue(s: string, i: number): { text: string; end: number } | null {
  if (s[i] !== '{') return null;
  let depth = 0;
  let j = i;
  while (j < s.length) {
    if (s[j] === '{') depth += 1;
    else if (s[j] === '}') {
      depth -= 1;
      if (depth === 0) {
        j += 1;
        break;
      }
    } else {
      const str = takeString(s, j);
      if (str) {
        j = str.end;
        continue;
      }
    }
    j += 1;
  }
  return { text: s.slice(i, j), end: j };
}

/** JSX / HTML — tag · attr · = · value · comment */
function tokenizeMarkup(s: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i]!;

    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /\s/.test(s[j]!)) j += 1;
      pushPlain(tokens, s.slice(i, j));
      i = j;
      continue;
    }

    const comment = takeComment(s, i);
    if (comment) {
      tokens.push({ kind: 'comment', text: comment.text });
      i = comment.end;
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
      const tagMatch = s.slice(i).match(/^<\/?[A-Za-z][\w.:-]*/);
      if (tagMatch) {
        tokens.push({ kind: 'tag', text: tagMatch[0] });
        i += tagMatch[0].length;
        continue;
      }
    }

    const nameMatch = s.slice(i).match(/^[A-Za-z_][\w:-]*/);
    if (nameMatch) {
      tokens.push({ kind: 'attr', text: nameMatch[0] });
      i += nameMatch[0].length;

      while (s[i] === ' ' || s[i] === '\t') {
        pushPlain(tokens, s[i]!);
        i += 1;
      }

      if (s[i] === '=') {
        tokens.push({ kind: 'equal', text: '=' });
        i += 1;

        while (s[i] === ' ' || s[i] === '\t') {
          pushPlain(tokens, s[i]!);
          i += 1;
        }

        const str = takeString(s, i);
        if (str) {
          tokens.push({ kind: 'value', text: str.text });
          i = str.end;
        } else {
          const brace = takeBraceValue(s, i);
          if (brace) {
            tokens.push({ kind: 'value', text: brace.text });
            i = brace.end;
          }
        }
      }
      continue;
    }

    pushPlain(tokens, ch);
    i += 1;
  }

  return tokens;
}

/** CSS — 선택자(tag) · 속성(attr) · : (equal) · 값(value) · 주석 */
function tokenizeCss(s: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;
  let inRule = false;

  while (i < s.length) {
    const ch = s[i]!;

    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < s.length && /\s/.test(s[j]!)) j += 1;
      pushPlain(tokens, s.slice(i, j));
      i = j;
      continue;
    }

    const comment = takeComment(s, i);
    if (comment) {
      tokens.push({ kind: 'comment', text: comment.text });
      i = comment.end;
      continue;
    }

    const str = takeString(s, i);
    if (str) {
      tokens.push({ kind: 'value', text: str.text });
      i = str.end;
      continue;
    }

    if (ch === '{') {
      inRule = true;
      pushPlain(tokens, ch);
      i += 1;
      continue;
    }

    if (ch === '}') {
      inRule = false;
      pushPlain(tokens, ch);
      i += 1;
      continue;
    }

    if (ch === ';' || ch === ',' || ch === '(' || ch === ')' || ch === '[' || ch === ']') {
      pushPlain(tokens, ch);
      i += 1;
      continue;
    }

    if (ch === ':') {
      tokens.push({ kind: 'equal', text: ':' });
      i += 1;
      continue;
    }

    const ident = s.slice(i).match(/^[#.@]?[A-Za-z_][\w-]*|^[0-9]+(?:\.[0-9]+)?[a-z%]*|^[*&+>~]/);
    if (ident) {
      const text = ident[0];
      if (!inRule) {
        tokens.push({ kind: 'tag', text });
      } else {
        let k = i + text.length;
        while (k < s.length && (s[k] === ' ' || s[k] === '\t')) k += 1;
        if (s[k] === ':') tokens.push({ kind: 'attr', text });
        else tokens.push({ kind: 'value', text });
      }
      i += text.length;
      continue;
    }

    pushPlain(tokens, ch);
    i += 1;
  }

  return tokens;
}

/** 언어별 grayscale 토큰. 조인 시 원문과 동일해야 함. */
export function tokenizeCode(code: string, language: CodeLanguage): CodeToken[] {
  if (language === 'css') return tokenizeCss(code);
  return tokenizeMarkup(code);
}

/** 테스트용 — 토큰을 다시 이어붙여 원문과 같은지 */
export function joinTokens(tokens: CodeToken[]): string {
  return tokens.map((t) => t.text).join('');
}
