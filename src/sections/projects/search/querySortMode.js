import { parseQuery } from './parseQuery.js';
import { stripSortFromParsedClauses } from './stripSort.js';
import { serializeParsedClauses } from './translateQuery.js';

export function getSortModeFromRawQuery(rawQuery) {
  const q = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  if (!q) return null;
  const parsed = parseQuery(q, (s) => s);
  return stripSortFromParsedClauses(parsed).sortMode;
}

export function nextSortModeAfterClick(currentSortMode) {
  const m = currentSortMode == null || currentSortMode === 'recent' ? null : currentSortMode;
  if (m == null) return 'oldest';
  if (m === 'oldest') return 'status';
  return null;
}

export function applySortModeToRawQuery(rawQuery, sortMode) {
  const q = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  const parsed = parseQuery(q, (s) => s);
  const { filterClauses } = stripSortFromParsedClauses(parsed);
  const base = serializeParsedClauses(filterClauses).trim();
  if (sortMode == null) return base;
  if (sortMode === 'oldest' || sortMode === 'status') {
    return base ? `${base} sort:${sortMode}` : `sort:${sortMode}`;
  }
  return base;
}
