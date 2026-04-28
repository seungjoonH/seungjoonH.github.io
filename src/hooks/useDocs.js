import { useEffect, useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { loadDocsForLanguage } from '../repositories/docs';
import { useVersionHash } from '../versioning/VersionContext.jsx';

export function useDocs() {
  const language = useConfigStore((s) => s.language);
  const versionHash = useVersionHash();
  const [docs, setDocs] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const d = await loadDocsForLanguage(language || 'en', versionHash);
      if (cancelled) return;
      setDocs(d && typeof d === 'object' && !Array.isArray(d) ? d : {});
    })();
    return () => {
      cancelled = true;
    };
  }, [language, versionHash]);

  return docs;
}
