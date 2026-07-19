// raw 쿼리의 sort 모드 파싱·갱신
import { parseQuery } from './parseQuery';
import { stripSortFromParsedClauses, type SortMode } from './stripSort';
import { serializeParsedClauses } from './translateQuery';

export function getSortModeFromRawQuery(rawQuery: string): SortMode {
  const q = rawQuery.trim();
  if (!q) return null;
  return stripSortFromParsedClauses(parseQuery(q, (s) => s)).sortMode;
}

export function nextSortModeAfterClick(currentSortMode: SortMode): SortMode {
  if (currentSortMode == null || currentSortMode === 'recent') return 'oldest';
  if (currentSortMode === 'oldest') return 'status';
  return null;
}

export function applySortModeToRawQuery(rawQuery: string, sortMode: SortMode): string {
  const { filterClauses } = stripSortFromParsedClauses(parseQuery(rawQuery.trim(), (s) => s));
  const base = serializeParsedClauses(filterClauses).trim();
  if (sortMode !== 'oldest' && sortMode !== 'status') return base;
  return base ? `${base} sort:${sortMode}` : `sort:${sortMode}`;
}
