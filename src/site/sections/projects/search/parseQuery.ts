// 프로젝트 검색 raw 쿼리를 OR/AND 조건 배열로 파싱
const PREFIXES = ['title:', 'desc:', 'stack:', 'type:', 'team:', 'link:', 'tag:', 'show:', 'sort:'] as const;

export type StackConditionValue =
  | string
  | { and: string[] }
  | { or: string[] };

export function stackHasAnd(value: StackConditionValue): value is { and: string[] } {
  return typeof value === 'object' && value !== null && 'and' in value;
}

export function stackHasOr(value: StackConditionValue): value is { or: string[] } {
  return typeof value === 'object' && value !== null && 'or' in value;
}
export type TypeConditionValue = string | string[];

export interface QueryCondition {
  type: string;
  value?: string | StackConditionValue | TypeConditionValue;
  exact?: boolean;
  negate?: boolean;
}

export type ParsedClauses = QueryCondition[][];
export type NormalizeStackFn = (token: string) => string;

function splitByOrKeepingQuotes(str: string): string[] {
  const trimmed = str.trim();
  if (!trimmed) return [];
  const clauses: string[] = [];
  let current = '';
  let inDouble = false;

  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c === '"') {
      inDouble = !inDouble;
      current += c;
      continue;
    }
    if (inDouble) {
      current += c;
      continue;
    }
    if (c === '|' && current.trim().startsWith('type:')) {
      current += c;
      continue;
    }
    if (c === '|') {
      if (current.trim()) clauses.push(current.trim());
      current = '';
      continue;
    }
    current += c;
  }

  if (current.trim()) clauses.push(current.trim());
  return clauses;
}

function parseQuotedOrWord(part: string): { value: string; exact: boolean } {
  const p = part.trim();
  if (p.startsWith('"') && p.endsWith('"') && p.length >= 2) return { value: p.slice(1, -1), exact: true };
  return { value: p, exact: false };
}

function parseOneToken(token: string): QueryCondition | null {
  const t = token.trim();
  if (!t) return null;

  if (t.startsWith('#"') && t.endsWith('"')) return { type: 'tag', value: t.slice(2, -1), exact: true };
  if (t.startsWith('#')) return { type: 'tag', value: t.slice(1).trim(), exact: false };

  for (const prefix of PREFIXES) {
    if (!t.startsWith(prefix)) continue;
    const rest = t.slice(prefix.length).trim();
    const { value, exact } = parseQuotedOrWord(rest);
    if (!value) return null;

    switch (prefix) {
      case 'title:': return { type: 'title', value, exact };
      case 'desc:': return { type: 'desc', value, exact };
      case 'tag:': return { type: 'tag', value, exact };
      case 'stack:': {
        const parts = value.split(/\|/).map((s) => s.trim()).filter(Boolean);
        const andParts = parts.map((p) => p.split(',').map((s) => s.trim()).filter(Boolean));
        if (andParts.length === 1 && andParts[0].length === 1) return { type: 'stack', value: andParts[0][0], exact };
        if (andParts.length === 1) return { type: 'stack', value: { and: andParts[0] }, exact };
        return { type: 'stack', value: { or: parts }, exact };
      }
      case 'type:': {
        const negate = value.startsWith('!');
        const v = negate ? value.slice(1).trim() : value;
        const parts = v.split(/\|/).map((s) => s.trim()).filter(Boolean);
        const typeValue: TypeConditionValue = parts.length === 1 ? parts[0] : parts;
        return { type: 'is', value: typeValue, negate };
      }
      case 'team:': return { type: 'team', value: value.trim(), exact: false };
      case 'link:': return { type: 'link', value: value.trim().toLowerCase(), exact: false };
      case 'show:': {
        const v = value.trim().toLowerCase();
        if (v === 'public' || v === 'hidden' || v === 'all') return { type: 'show', value: v };
        return null;
      }
      case 'sort:': {
        const v = value.trim().toLowerCase();
        if (v === 'old') return { type: 'sort', value: 'oldest' };
        if (v === 'recent' || v === 'oldest' || v === 'status') return { type: 'sort', value: v };
        return null;
      }
      default: return null;
    }
  }

  const { value } = parseQuotedOrWord(t);
  if (value) return { type: 'fullText', value, exact: false };
  return null;
}

function splitAndTokens(clauseStr: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inDouble = false;
  for (let i = 0; i < clauseStr.length; i++) {
    const c = clauseStr[i];
    if (c === '"') { inDouble = !inDouble; current += c; }
    else if (inDouble) current += c;
    else if (', \t'.includes(c)) { if (current.trim()) tokens.push(current.trim()); current = ''; }
    else current += c;
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens;
}

function normalizeStackInCondition(cond: QueryCondition, normalizeStack: NormalizeStackFn): QueryCondition {
  if (cond.type !== 'stack') return cond;
  const v = cond.value;
  if (typeof v === 'string') return { ...cond, value: normalizeStack(v) };
  if (v && typeof v === 'object' && 'and' in v && Array.isArray(v.and)) {
    return { ...cond, value: { and: v.and.map(normalizeStack) } };
  }
  if (v && typeof v === 'object' && 'or' in v && Array.isArray(v.or)) {
    return { ...cond, value: { or: v.or.map(normalizeStack) } };
  }
  return cond;
}

export function parseQuery(query: string, normalizeStack: NormalizeStackFn = (s) => s): ParsedClauses {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const orClauses = splitByOrKeepingQuotes(trimmed);
  const result: ParsedClauses = [];

  for (const clauseStr of orClauses) {
    const tokens = splitAndTokens(clauseStr);
    const conditions: QueryCondition[] = [];
    for (const token of tokens) {
      const cond = parseOneToken(token);
      if (cond) conditions.push(normalizeStackInCondition(cond, normalizeStack));
    }
    if (conditions.length) result.push(conditions);
  }

  return result;
}

