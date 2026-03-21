import { useState, useEffect, useRef, useMemo } from 'react';
import { parseQuery } from './parseQuery.js';
import { normalizeStackToken } from './stackMapping.js';
import { stripSortFromParsedClauses } from './stripSort.js';

const DEBOUNCE_MS = 1000;

export function useDebouncedNormalizedQuery(rawQuery, delayMs = DEBOUNCE_MS) {
  const [normalizedClauses, setNormalizedClauses] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const q = typeof rawQuery === 'string' ? rawQuery : '';
    const trimmed = q.trim();

    if (!trimmed) {
      setNormalizedClauses([]);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const parsed = parseQuery(trimmed, normalizeStackToken);
      const { filterClauses } = stripSortFromParsedClauses(parsed);
      setNormalizedClauses(filterClauses);
      timerRef.current = null;
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [rawQuery, delayMs]);

  return normalizedClauses;
}

export function getParsedForHighlight(rawQuery) {
  const q = typeof rawQuery === 'string' ? rawQuery : '';
  const trimmed = q.trim();
  if (!trimmed) return [];
  const parsed = parseQuery(trimmed, normalizeStackToken);
  return stripSortFromParsedClauses(parsed).filterClauses;
}

export default useDebouncedNormalizedQuery;
