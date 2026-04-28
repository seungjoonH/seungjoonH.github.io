export function stripSortFromParsedClauses(parsedClauses) {
  if (!parsedClauses || parsedClauses.length === 0) {
    return { filterClauses: [], sortMode: null };
  }
  let sortMode = null;
  const filterClauses = parsedClauses.map((conds) => {
    const out = [];
    for (const c of conds) {
      switch (c.type) {
        case 'sort': sortMode = c.value; break;
        default: out.push(c);break;
      }
    }
    return out;
  });
  return { filterClauses, sortMode };
}
