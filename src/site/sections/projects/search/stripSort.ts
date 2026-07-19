// parse 결과에서 sort 조건을 분리해 필터 절과 정렬 모드를 반환
import type { ParsedClauses, QueryCondition } from './parseQuery';

export type SortMode = 'recent' | 'oldest' | 'status' | null;

export function stripSortFromParsedClauses(parsedClauses: ParsedClauses | null): {
  filterClauses: ParsedClauses;
  sortMode: SortMode;
} {
  if (!parsedClauses || parsedClauses.length === 0) {
    return { filterClauses: [], sortMode: null };
  }
  let sortMode: SortMode = null;
  const filterClauses = parsedClauses.map((conds) => {
    const out: QueryCondition[] = [];
    for (const c of conds) {
      switch (c.type) {
        case 'sort': sortMode = c.value as SortMode; break;
        default: out.push(c); break;
      }
    }
    return out;
  });
  return { filterClauses, sortMode };
}
