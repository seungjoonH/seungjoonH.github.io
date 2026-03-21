import React from 'react';
import katex from 'katex';

function renderKatex(latex, displayMode, key) {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
    });
    return (
      <span
        key={key}
        className={displayMode ? 'richTextKatex richTextKatex--display' : 'richTextKatex richTextKatex--inline'}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  catch {
    return (
      <code key={key} className="richTextKatex--error">
        {latex}
      </code>
    );
  }
}

function tokenizeRichText(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const boldAt = s.indexOf('**', i);
    const codeAt = s.indexOf('`', i);
    const dollarAt = s.indexOf('$', i);

    const candidates = [];
    if (boldAt >= 0) candidates.push({ pos: boldAt, type: 'bold' });
    if (codeAt >= 0) candidates.push({ pos: codeAt, type: 'code' });
    if (dollarAt >= 0) {
      candidates.push({
        pos: dollarAt,
        type: s.startsWith('$$', dollarAt) ? 'displayMath' : 'inlineMath',
      });
    }
    candidates.sort((a, b) => a.pos - b.pos);
    const first = candidates[0];

    if (!first || first.pos > i) {
      const end = first ? first.pos : s.length;
      if (end > i) tokens.push({ type: 'text', value: s.slice(i, end) });
      if (!first) break;
      i = first.pos;
      continue;
    }

    if (first.type === 'bold') {
      const end = s.indexOf('**', i + 2);
      if (end < 0) {
        tokens.push({ type: 'text', value: s.slice(i) });
        break;
      }
      tokens.push({ type: 'strong', value: s.slice(i + 2, end) });
      i = end + 2;
    }
    else if (first.type === 'code') {
      const end = s.indexOf('`', i + 1);
      if (end < 0) {
        tokens.push({ type: 'text', value: s.slice(i) });
        break;
      }
      tokens.push({ type: 'code', value: s.slice(i + 1, end) });
      i = end + 1;
    }
    else if (first.type === 'inlineMath') {
      const end = s.indexOf('$', i + 1);
      if (end < 0) {
        tokens.push({ type: 'text', value: s.slice(i) });
        break;
      }
      tokens.push({ type: 'math', displayMode: false, value: s.slice(i + 1, end).trim() });
      i = end + 1;
    }
    else if (first.type === 'displayMath') {
      const end = s.indexOf('$$', i + 2);
      if (end < 0) {
        tokens.push({ type: 'text', value: s.slice(i) });
        break;
      }
      tokens.push({ type: 'math', displayMode: true, value: s.slice(i + 2, end).trim() });
      i = end + 2;
    }
  }
  return tokens;
}

function tokensToNodes(tokens, keyPrefix = '') {
  return tokens.map((item, idx) => {
    const key = `${keyPrefix}${idx}`;
    if (item.type === 'strong') {
      const inner = item.value;
      const nested =
        inner.includes('$') || inner.includes('**') || inner.includes('`')
          ? tokensToNodes(tokenizeRichText(inner), `${key}-`)
          : inner;
      return <strong key={key}>{nested}</strong>;
    }
    if (item.type === 'code') return <code key={key}>{item.value}</code>;
    if (item.type === 'math') return renderKatex(item.value, item.displayMode, key);
    return <span key={key}>{item.value}</span>;
  });
}

export function renderRichText(value) {
  const text = String(value ?? '');
  const hasSpecial = text.includes('**') || text.includes('`') || text.includes('$');
  if (!hasSpecial) return text;

  return tokensToNodes(tokenizeRichText(text));
}

export function renderLinkTitle(value, linkSepClassName) {
  const text = String(value ?? '');
  const pipeIndex = text.indexOf('|');
  if (pipeIndex < 0) return renderRichText(text);
  const left = text.slice(0, pipeIndex).trim();
  const right = text.slice(pipeIndex + 1).trim();
  return (
    <>
      <span>{renderRichText(left)}</span>
      {linkSepClassName != null ? <span className={linkSepClassName}> | </span> : ' | '}
      <strong>{renderRichText(right)}</strong>
    </>
  );
}
