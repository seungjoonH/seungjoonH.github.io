// 언어 전환 시 프로젝트 검색 쿼리의 tag/stack 토큰을 번역
import { parseQuery, type ParsedClauses, type QueryCondition, type StackConditionValue } from './parseQuery';
import { stackHasAnd, stackHasOr } from './parseQuery';
import { parseArray } from '@utils/parse';

function getTagNames(proj: { tags?: unknown[] }): string[] {
  const raw = proj?.tags ?? [];
  return raw.map((t) => (typeof t === 'string' ? t : (t as { name?: string })?.name)).filter(Boolean) as string[];
}

function getStackNames(proj: { techStack?: unknown[] }): string[] {
  const raw = proj?.techStack ?? [];
  return raw.map((s) => (typeof s === 'string' ? s : (s as { name?: string })?.name)).filter(Boolean) as string[];
}

function getTranslationMaps(fromLang: string, toLang: string, dataByLang: Record<string, unknown[]>) {
  const tagMap = new Map<string, string>();
  const stackMap = new Map<string, string>();
  if (fromLang === toLang) return { tag: tagMap, stack: stackMap };

  const fromList = parseArray(dataByLang[fromLang]);
  const toList = parseArray(dataByLang[toLang]);
  const len = Math.min(fromList.length, toList.length);

  for (let i = 0; i < len; i++) {
    const fromTags = getTagNames(fromList[i] as { tags?: unknown[] });
    const toTags = getTagNames(toList[i] as { tags?: unknown[] });
    for (let j = 0; j < Math.min(fromTags.length, toTags.length); j++) {
      tagMap.set(fromTags[j], toTags[j]);
    }
    const fromStacks = getStackNames(fromList[i] as { techStack?: unknown[] });
    const toStacks = getStackNames(toList[i] as { techStack?: unknown[] });
    for (let j = 0; j < Math.min(fromStacks.length, toStacks.length); j++) {
      stackMap.set(fromStacks[j], toStacks[j]);
    }
  }
  return { tag: tagMap, stack: stackMap };
}

function translateTagValue(value: unknown, tagMap: Map<string, string>): string {
  if (value == null || value === '') return String(value);
  const s = String(value).trim();
  return tagMap.get(s) ?? s;
}

function translateStackValue(value: StackConditionValue, stackMap: Map<string, string>): StackConditionValue {
  if (value == null) return value;
  if (typeof value === 'string') return stackMap.get(String(value).trim()) ?? value;
  if (stackHasAnd(value)) {
    return { and: value.and.map((v) => translateStackValue(v, stackMap) as string) };
  }
  if (stackHasOr(value)) {
    return { or: value.or.map((v) => translateStackValue(v, stackMap) as string) };
  }
  return value;
}

function quoteIfExact(value: string, exact?: boolean): string {
  const s = String(value);
  return exact ? `"${s}"` : s;
}

function conditionToToken(cond: QueryCondition, tagMap: Map<string, string>, stackMap: Map<string, string>): string {
  const { type, value, exact } = cond;
  switch (type) {
    case 'tag': {
      const v = translateTagValue(value, tagMap);
      return `#${quoteIfExact(v, exact)}`;
    }
    case 'stack': {
      const v = translateStackValue(value as StackConditionValue, stackMap);
      if (typeof v === 'string') return `stack:${quoteIfExact(v, exact)}`;
      if (v && stackHasAnd(v) && v.and?.length) return `stack:${v.and.join(',')}`;
      if (v && stackHasOr(v) && v.or?.length) return `stack:${v.or.join('|')}`;
      return `stack:${quoteIfExact(String(value), exact)}`;
    }
    case 'title': return `title:${quoteIfExact(String(value), exact)}`;
    case 'desc': return `desc:${quoteIfExact(String(value), exact)}`;
    case 'team': return `team:${quoteIfExact(String(value), exact)}`;
    case 'link': return `link:${quoteIfExact(String(value), exact)}`;
    case 'is': {
      const neg = cond.negate ? '!' : '';
      const v = Array.isArray(value) ? value.join('|') : value;
      return `type:${neg}${v}`;
    }
    case 'show': return `show:${value}`;
    case 'sort': return `sort:${value}`;
    case 'fullText': return String(value);
    default: return '';
  }
}

function serializeClause(conditions: QueryCondition[], tagMap: Map<string, string>, stackMap: Map<string, string>): string {
  const tokens = conditions
    .map((c) => conditionToToken(c, tagMap, stackMap))
    .filter(Boolean);
  return tokens.join(' ');
}

function serializeQuery(parsedClauses: ParsedClauses, tagMap: Map<string, string>, stackMap: Map<string, string>): string {
  const parts = parsedClauses.map((conds) => serializeClause(conds, tagMap, stackMap));
  return parts.join('|');
}

export function serializeParsedClauses(parsedClauses: ParsedClauses): string {
  const empty = new Map<string, string>();
  return serializeQuery(parsedClauses || [], empty, empty);
}

export function translateProjectSearchQuery(
  rawQuery: string,
  fromLang: string,
  toLang: string,
  projectsByLang: Record<string, unknown[]>,
): string {
  const q = rawQuery.trim();
  if (!q || fromLang === toLang) return q;

  const { tag: tagMap, stack: stackMap } = getTranslationMaps(fromLang, toLang, projectsByLang);
  const parsed = parseQuery(q, (s) => s);
  if (!parsed.length) return q;

  return serializeQuery(parsed, tagMap, stackMap);
}

