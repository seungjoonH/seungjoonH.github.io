// 검색 하이라이트 용어 추출 및 텍스트/리치텍스트 mark 렌더
import React, { type ReactNode } from 'react';
import { tokenizeRichText, type RichTextToken } from '../utils/richText';
import { normalizeStackToken } from './stackMapping';
import { isSingleChoseong, hasHangeul, findPuleossugiMatchRanges, tagMatchesQuery } from './hangul';
import type { ParsedClauses, StackConditionValue } from './parseQuery';
import { stackHasAnd, stackHasOr } from './parseQuery';

export function getHighlightTerms(parsedClauses: ParsedClauses) {
  const titleTerms: string[] = [];
  const descTerms: string[] = [];
  const stackTerms: string[] = [];
  if (!Array.isArray(parsedClauses)) return { titleTerms, descTerms, stackTerms };

  for (const conditions of parsedClauses) {
    for (const c of conditions) {
      switch (c.type) {
        case 'sort': continue;
        case 'title':
          if (c.value && !isSingleChoseong(String(c.value))) titleTerms.push(String(c.value));
          break;
        case 'desc':
          if (c.value && !isSingleChoseong(String(c.value))) descTerms.push(String(c.value));
          break;
        case 'fullText': {
          if (!c.value || isSingleChoseong(String(c.value))) break;
          const v = String(c.value);
          titleTerms.push(v);
          descTerms.push(v);
          stackTerms.push(normalizeStackToken(v));
          break;
        }
        case 'stack': {
          const v = c.value as StackConditionValue;
          if (typeof v === 'string') stackTerms.push(normalizeStackToken(v));
          else if (stackHasAnd(v)) v.and.forEach((t) => stackTerms.push(normalizeStackToken(t)));
          else if (stackHasOr(v)) v.or.forEach((t) => stackTerms.push(normalizeStackToken(t)));
          break;
        }
        default: break;
      }
    }
  }
  return { titleTerms, descTerms, stackTerms };
}

function stackContainsQuery(stackLower: string, queryLower: string): boolean {
  return stackLower.includes(queryLower) || queryLower.includes(stackLower);
}

function getStacksToHighlight(stacks: string[], parsedClauses: ParsedClauses): string[] {
  if (!Array.isArray(stacks) || !Array.isArray(parsedClauses)) return [];
  const { stackTerms } = getHighlightTerms(parsedClauses);
  const out: string[] = [];
  for (const stack of stacks) {
    const s = String(stack);
    const norm = normalizeStackToken(s).toLowerCase();
    for (const term of stackTerms) {
      const t = String(term).toLowerCase();
      if (t && stackContainsQuery(norm, t)) {
        out.push(s);
        break;
      }
    }
  }
  return out;
}

function getTagsToHighlight(tags: string[], parsedClauses: ParsedClauses): string[] {
  if (!Array.isArray(tags) || !Array.isArray(parsedClauses)) return [];
  const out: string[] = [];
  for (const tag of tags) {
    const tagStr = String(tag);
    for (const conditions of parsedClauses) {
      condLoop: for (const c of conditions) {
        switch (c.type) {
          case 'tag':
            if (c.value) {
              const v = String(c.value);
              if (c.exact && v.toLowerCase() === tagStr.toLowerCase()) {
                out.push(tagStr);
                break condLoop;
              }
              if (!c.exact && tagMatchesQuery(tagStr, v)) {
                out.push(tagStr);
                break condLoop;
              }
            }
            break;
          case 'fullText':
            if (c.value && !isSingleChoseong(String(c.value))) {
              const v = String(c.value);
              if (hasHangeul(v) ? tagMatchesQuery(tagStr, v) : tagStr.toLowerCase().includes(v.toLowerCase())) {
                out.push(tagStr);
                break condLoop;
              }
            }
            break;
          default:
            break;
        }
      }
    }
  }
  return out;
}

export function getEffectiveTagsSorted(displayTags: string[], tagNames: string[], parsedClauses: ParsedClauses) {
  const display = Array.isArray(displayTags) ? displayTags : [];
  const all = Array.isArray(tagNames) ? tagNames : [];
  const highlightedFromAll = getTagsToHighlight(all, parsedClauses);
  const effectiveSet = new Set([...display, ...highlightedFromAll]);
  const effective = [...effectiveSet];
  const toHighlight = getTagsToHighlight(effective, parsedClauses);
  const highlightSet = new Set(toHighlight);
  effective.sort((a, b) => {
    const aHit = highlightSet.has(a);
    const bHit = highlightSet.has(b);
    if (aHit && !bHit) return -1;
    if (!aHit && bHit) return 1;
    return 0;
  });
  return { tags: effective, tagsToHighlight: toHighlight };
}

export function getEffectiveStacksSorted(displayStacks: string[], techStackNames: string[], parsedClauses: ParsedClauses) {
  const display = Array.isArray(displayStacks) ? displayStacks : [];
  const all = Array.isArray(techStackNames) ? techStackNames : [];
  const highlightedFromAll = getStacksToHighlight(all, parsedClauses);
  const effectiveSet = new Set([...display, ...highlightedFromAll]);
  const effective = [...effectiveSet];
  const toHighlight = getStacksToHighlight(effective, parsedClauses);
  const highlightSet = new Set(toHighlight);
  effective.sort((a, b) => {
    const aHit = highlightSet.has(a);
    const bHit = highlightSet.has(b);
    if (aHit && !bHit) return -1;
    if (!aHit && bHit) return 1;
    return 0;
  });
  return { stacks: effective, stacksToHighlight: toHighlight };
}

function escapeRegex(s: string): string {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  if (ranges.length === 0) return [];
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s > last[1]) out.push([s, e]);
    else if (e > last[1]) last[1] = e;
  }
  return out;
}

function getHighlightRanges(text: string, terms: string[]): [number, number][] {
  const ranges: [number, number][] = [];
  const safe = terms.filter((t) => t && String(t).length > 0);
  for (const term of safe) {
    if (!hasHangeul(term) || isSingleChoseong(term)) {
      const re = new RegExp(escapeRegex(term), 'gi');
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) ranges.push([m.index, m.index + m[0].length]);
      continue;
    }
    ranges.push(...(findPuleossugiMatchRanges(text, term) as [number, number][]));
  }
  return mergeRanges(ranges);
}

export function highlightText(text: string, terms: string[], markClassName: string): ReactNode[] {
  if (!text || typeof text !== 'string') return [text as unknown as ReactNode];
  const safe = terms.filter((t) => t && String(t).length > 0);
  if (safe.length === 0) return [text];

  const ranges = getHighlightRanges(text, safe);
  if (ranges.length === 0) return [text];

  const parts: { key: string; mark: boolean; value: string }[] = [];
  let last = 0;
  for (let i = 0; i < ranges.length; i++) {
    const [s, e] = ranges[i];
    if (s > last) {
      parts.push({ key: `t-${i}`, mark: false, value: text.slice(last, s) });
    }
    parts.push({ key: `m-${i}`, mark: true, value: text.slice(s, e) });
    last = e;
  }
  if (last < text.length) {
    parts.push({ key: 't-end', mark: false, value: text.slice(last) });
  }
  return parts.map((p) =>
    p.mark
      ? React.createElement('mark', { key: p.key, className: markClassName }, p.value)
      : p.value,
  );
}

type RenderRichTextFn = (value: unknown) => ReactNode;

export function highlightRichText(
  text: string,
  terms: string[],
  markClassName: string,
  renderRichText: RenderRichTextFn,
): ReactNode {
  if (!text || typeof text !== 'string') return renderRichText(text);
  const safe = terms.filter((t) => t && String(t).length > 0);
  if (safe.length === 0) return renderRichText(text);

  const hasRichSyntax = text.includes('**') || text.includes('`') || text.includes('$');
  if (!hasRichSyntax) return highlightText(text, terms, markClassName);

  return tokenizeRichText(text).map((token, idx) =>
    renderHighlightedRichToken(token, `hr-${idx}`, terms, markClassName, renderRichText),
  );
}

function renderHighlightedPlainText(
  text: string,
  keyPrefix: string,
  terms: string[],
  markClassName: string,
  renderRichText: RenderRichTextFn,
): ReactNode[] {
  const value = String(text ?? '');
  const hasRichSyntax = value.includes('**') || value.includes('`') || value.includes('$');
  if (hasRichSyntax) {
    return tokenizeRichText(value).map((token, idx) =>
      renderHighlightedRichToken(token, `${keyPrefix}-n-${idx}`, terms, markClassName, renderRichText),
    );
  }

  const parts = highlightText(value, terms, markClassName);
  return parts.map((part, i) =>
    React.isValidElement(part)
      ? React.cloneElement(part, { key: `${keyPrefix}-p-${i}` })
      : part,
  );
}

function renderHighlightedRichToken(
  token: RichTextToken,
  key: string,
  terms: string[],
  markClassName: string,
  renderRichText: RenderRichTextFn,
): ReactNode {
  switch (token.type) {
    case 'strong':
      return React.createElement(
        'strong',
        { key },
        ...renderHighlightedPlainText(token.value, `${key}-s`, terms, markClassName, renderRichText),
      );
    case 'code':
      return React.createElement('code', { key }, token.value);
    case 'math': {
      const raw = token.displayMode ? `$$${token.value}$$` : `$${token.value}$`;
      return React.createElement(React.Fragment, { key }, renderRichText(raw));
    }
    default:
      return React.createElement(
        React.Fragment,
        { key },
        ...renderHighlightedPlainText(token.value, `${key}-t`, terms, markClassName, renderRichText),
      );
  }
}
