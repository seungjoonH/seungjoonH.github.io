import React from 'react';
import { normalizeStackToken } from './stackMapping.js';
import { isSingleChoseong, hasHangeul, findPuleossugiMatchRanges, containsHangeul, tagMatchesQuery } from './hangul.js';

export function getHighlightTerms(parsedClauses) {
  const titleTerms = [];
  const descTerms = [];
  const stackTerms = [];
  if (!Array.isArray(parsedClauses)) return { titleTerms, descTerms, stackTerms };

  for (const conditions of parsedClauses) {
    for (const c of conditions) {
      if (c.type === 'sort') continue;
      if (c.type === 'title' && c.value && !isSingleChoseong(String(c.value))) titleTerms.push(String(c.value));
      if (c.type === 'desc' && c.value && !isSingleChoseong(String(c.value))) descTerms.push(String(c.value));
      if (c.type === 'fullText' && c.value && !isSingleChoseong(String(c.value))) {
        const v = String(c.value);
        titleTerms.push(v);
        descTerms.push(v);
        stackTerms.push(normalizeStackToken(v));
      }
      if (c.type === 'stack') {
        const v = c.value;
        if (typeof v === 'string') stackTerms.push(normalizeStackToken(v));
        else if (v.and) v.and.forEach((t) => stackTerms.push(normalizeStackToken(t)));
        else if (v.or) v.or.forEach((t) => stackTerms.push(normalizeStackToken(t)));
      }
    }
  }
  return { titleTerms, descTerms, stackTerms };
}

function stackContainsQuery(stackLower, queryLower) {
  return stackLower.includes(queryLower) || queryLower.includes(stackLower);
}

export function getStacksToHighlight(stacks, parsedClauses) {
  if (!Array.isArray(stacks) || !Array.isArray(parsedClauses)) return [];
  const { stackTerms } = getHighlightTerms(parsedClauses);
  const out = [];
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

export function getTagsToHighlight(tags, parsedClauses) {
  if (!Array.isArray(tags) || !Array.isArray(parsedClauses)) return [];
  const out = [];
  for (const tag of tags) {
    const tagStr = String(tag);
    for (const conditions of parsedClauses) {
      for (const c of conditions) {
        if (c.type === 'tag' && c.value) {
          const v = String(c.value);
          if (c.exact && v.toLowerCase() === tagStr.toLowerCase()) {
            out.push(tagStr);
            break;
          }
          if (!c.exact && tagMatchesQuery(tagStr, v)) {
            out.push(tagStr);
            break;
          }
        }
        if (c.type === 'fullText' && c.value && !isSingleChoseong(String(c.value))) {
          const v = String(c.value);
          if (hasHangeul(v) ? tagMatchesQuery(tagStr, v) : tagStr.toLowerCase().includes(v.toLowerCase())) {
            out.push(tagStr);
            break;
          }
        }
      }
    }
  }
  return out;
}

export function getEffectiveTagsSorted(displayTags, tagNames, parsedClauses) {
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

export function getEffectiveStacksSorted(displayStacks, techStackNames, parsedClauses) {
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

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s > last[1]) out.push([s, e]);
    else if (e > last[1]) last[1] = e;
  }
  return out;
}

function getHighlightRanges(text, terms) {
  const ranges = [];
  const safe = terms.filter((t) => t && String(t).length > 0);
  for (const term of safe) {
    if (!hasHangeul(term) || isSingleChoseong(term)) {
      const re = new RegExp(escapeRegex(term), 'gi');
      let m;
      while ((m = re.exec(text)) !== null) ranges.push([m.index, m.index + m[0].length]);
      continue;
    }
    ranges.push(...findPuleossugiMatchRanges(text, term));
  }
  return mergeRanges(ranges);
}

export function highlightStackText(text, terms, markClassName, normalizeStack) {
  if (!text || typeof text !== 'string') return [text];
  const safe = terms.filter((t) => t && String(t).length > 0);
  if (safe.length === 0) return [text];

  const norm = (normalizeStack && typeof normalizeStack === 'function' ? normalizeStack(text) : text).toLowerCase();
  for (const term of safe) {
    if (String(term).toLowerCase() !== norm) continue;
    return [React.createElement('mark', { key: 'stack', className: markClassName }, text)];
  }

  return highlightText(text, terms, markClassName);
}

export function highlightText(text, terms, markClassName) {
  if (!text || typeof text !== 'string') return [text];
  const safe = terms.filter((t) => t && String(t).length > 0);
  if (safe.length === 0) return [text];

  const ranges = getHighlightRanges(text, safe);
  if (ranges.length === 0) return [text];

  const parts = [];
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
      : p.value
  );
}

export function highlightRichText(text, terms, markClassName, renderRichText) {
  if (!text || typeof text !== 'string') return renderRichText(text);
  const safe = terms.filter((t) => t && String(t).length > 0);
  if (safe.length === 0) return renderRichText(text);

  const parts = highlightText(text, terms, markClassName);
  return parts.map((part, i) =>
    React.isValidElement(part)
      ? React.cloneElement(part, { key: `hr-${i}` })
      : React.createElement(React.Fragment, { key: `hr-${i}` }, renderRichText(part))
  );
}
