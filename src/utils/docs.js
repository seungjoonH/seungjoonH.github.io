export function getDocById(docs, id) {
  if (!docs || !id) return null;
  const keys = ['notion', 'githubWiki', 'tistory'];
  const matched = keys
    .map((key) => ({ key, list: Array.isArray(docs[key]) ? docs[key] : [] }))
    .find(({ list }) => list.some((doc) => doc.id === id));
  if (!matched) return null;
  const doc = matched.list.find((item) => item.id === id);
  if (!doc) return null;
  return { ...doc, platform: matched.key };
}
