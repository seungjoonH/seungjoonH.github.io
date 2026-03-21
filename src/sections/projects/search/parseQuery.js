const PREFIXES = ['title:', 'desc:', 'stack:', 'type:', 'team:', 'link:', 'tag:', 'show:', 'sort:'];

function splitByOrKeepingQuotes(str) {
  const trimmed = str.trim();
  if (!trimmed) return [];
  const clauses = [];
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

function parseQuotedOrWord(part) {
  const p = part.trim();
  if (p.startsWith('"') && p.endsWith('"') && p.length >= 2) return { value: p.slice(1, -1), exact: true };
  return { value: p, exact: false };
}

function parseOneToken(token) {
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
        const typeValue = parts.length === 1 ? parts[0] : parts;
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

function splitAndTokens(clauseStr) {
  const tokens = [];
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

function normalizeStackInCondition(cond, normalizeStack) {
  if (cond.type !== 'stack') return cond;
  const v = cond.value;
  if (typeof v === 'string') return { ...cond, value: normalizeStack(v) };
  if (v.and) return { ...cond, value: { and: v.and.map(normalizeStack) } };
  if (v.or) return { ...cond, value: { or: v.or.map(normalizeStack) } };
  return cond;
}

export function parseQuery(query, normalizeStack = (s) => s) {
  const raw = typeof query === 'string' ? query : '';
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const orClauses = splitByOrKeepingQuotes(trimmed);
  const result = [];

  for (const clauseStr of orClauses) {
    const tokens = splitAndTokens(clauseStr);
    const conditions = [];
    for (const token of tokens) {
      const cond = parseOneToken(token);
      if (cond) conditions.push(normalizeStackInCondition(cond, normalizeStack));
    }
    if (conditions.length) result.push(conditions);
  }

  return result;
}

export default parseQuery;
