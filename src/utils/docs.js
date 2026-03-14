export function getDocById(docs, id) {
  if (!docs || !id) return null;
  const keys = ['notion', 'githubWiki', 'tistory'];
  for (const key of keys) {
    const list = docs[key];
    if (Array.isArray(list)) {
      const doc = list.find((d) => d.id === id);
      if (doc) return { ...doc, platform: key };
    }
  }
  return null;
}
