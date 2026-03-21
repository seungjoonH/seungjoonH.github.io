/**
 * Removes `sort` conditions from parsed clauses (sort is handled after filtering).
 * Last `sort` token in query order wins (OR-clauses left-to-right, AND left-to-right).
 */
export function stripSortFromParsedClauses(parsedClauses) {
  if (!parsedClauses || parsedClauses.length === 0) {
    return { filterClauses: [], sortMode: null };
  }
  let sortMode = null;
  const filterClauses = parsedClauses.map((conds) => {
    const out = [];
    for (const c of conds) {
      if (c.type === 'sort') sortMode = c.value;
      else out.push(c);
    }
    return out;
  });
  return { filterClauses, sortMode };
}
