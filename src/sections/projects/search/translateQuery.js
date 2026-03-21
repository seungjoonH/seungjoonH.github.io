import projectsEn from '../../../data/en/projects.js';
import projectsKo from '../../../data/ko/projects.js';
import { parseQuery } from './parseQuery.js';

const DATA = { en: projectsEn, ko: projectsKo };

function getTagNames(proj) {
  const raw = proj?.tags ?? [];
  return raw.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean);
}

function getStackNames(proj) {
  const raw = proj?.techStack ?? [];
  return raw.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
}

function getTranslationMaps(fromLang, toLang) {
  const tagMap = new Map();
  const stackMap = new Map();
  if (fromLang === toLang) return { tag: tagMap, stack: stackMap };

  const fromList = Array.isArray(DATA[fromLang]) ? DATA[fromLang] : [];
  const toList = Array.isArray(DATA[toLang]) ? DATA[toLang] : [];
  const len = Math.min(fromList.length, toList.length);

  for (let i = 0; i < len; i++) {
    const fromTags = getTagNames(fromList[i]);
    const toTags = getTagNames(toList[i]);
    for (let j = 0; j < Math.min(fromTags.length, toTags.length); j++) {
      tagMap.set(fromTags[j], toTags[j]);
    }
    const fromStacks = getStackNames(fromList[i]);
    const toStacks = getStackNames(toList[i]);
    for (let j = 0; j < Math.min(fromStacks.length, toStacks.length); j++) {
      stackMap.set(fromStacks[j], toStacks[j]);
    }
  }
  return { tag: tagMap, stack: stackMap };
}

function translateTagValue(value, tagMap) {
  if (value == null || value === '') return value;
  const s = String(value).trim();
  return tagMap.get(s) ?? s;
}

function translateStackValue(value, stackMap) {
  if (value == null) return value;
  if (typeof value === 'string') return stackMap.get(String(value).trim()) ?? value;
  if (value.and && Array.isArray(value.and)) {
    return { and: value.and.map((v) => translateStackValue(v, stackMap)) };
  }
  if (value.or && Array.isArray(value.or)) {
    return { or: value.or.map((v) => translateStackValue(v, stackMap)) };
  }
  return value;
}

function quoteIfExact(value, exact) {
  const s = String(value);
  return exact ? `"${s}"` : s;
}

function conditionToToken(cond, tagMap, stackMap) {
  const { type, value, exact } = cond;
  switch (type) {
    case 'tag': {
      const v = translateTagValue(value, tagMap);
      return `#${quoteIfExact(v, exact)}`;
    }
    case 'stack': {
      const v = translateStackValue(value, stackMap);
      if (typeof v === 'string') return `stack:${quoteIfExact(v, exact)}`;
      if (v?.and?.length) return `stack:${v.and.join(',')}`;
      if (v?.or?.length) return `stack:${v.or.join('|')}`;
      return `stack:${quoteIfExact(value, exact)}`;
    }
    case 'title': return `title:${quoteIfExact(value, exact)}`;
    case 'desc': return `desc:${quoteIfExact(value, exact)}`;
    case 'team': return `team:${quoteIfExact(value, exact)}`;
    case 'link': return `link:${quoteIfExact(value, exact)}`;
    case 'is': {
      const neg = cond.negate ? '!' : '';
      const v = Array.isArray(value) ? value.join('|') : value;
      return `type:${neg}${v}`;
    }
    case 'show': return `show:${value}`;
    case 'sort': return `sort:${value}`;
    case 'fullText': return value;
    default: return '';
  }
}

function serializeClause(conditions, tagMap, stackMap) {
  const tokens = conditions
    .map((c) => conditionToToken(c, tagMap, stackMap))
    .filter(Boolean);
  return tokens.join(' ');
}

function serializeQuery(parsedClauses, tagMap, stackMap) {
  const parts = parsedClauses.map((conds) => serializeClause(conds, tagMap, stackMap));
  return parts.join('|');
}

/** Round-trip filter clauses to raw query (identity tag/stack maps). Sort tokens should be stripped before calling. */
export function serializeParsedClauses(parsedClauses) {
  const empty = new Map();
  return serializeQuery(parsedClauses || [], empty, empty);
}

export function translateProjectSearchQuery(rawQuery, fromLang, toLang) {
  const q = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  if (!q || fromLang === toLang) return q;

  const { tag: tagMap, stack: stackMap } = getTranslationMaps(fromLang, toLang);
  const parsed = parseQuery(q, (s) => s);
  if (!parsed.length) return q;

  return serializeQuery(parsed, tagMap, stackMap);
}

export default translateProjectSearchQuery;
