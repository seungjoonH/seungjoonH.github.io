import { useMemo } from 'react';
import { useConfigStore } from '../stores/configStore';
import { getDocsForLanguage } from '../repositories/docs';

export function useDocs() {
  const language = useConfigStore((s) => s.language);
  return useMemo(() => getDocsForLanguage(language || 'en'), [language]);
}
