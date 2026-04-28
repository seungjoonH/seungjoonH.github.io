import { useEffect } from 'react';
import i18n from '../i18n.js';
import { useVersionHash } from './VersionContext.jsx';
import { loadDataFile } from './loadDataModule.js';

const LANGS = ['ko', 'en'];

async function buildMergedTranslation(versionHash, lng) {
  const tr = await loadDataFile({ versionHash, lang: lng, fileName: 'translations.js' });
  const a11y = await loadDataFile({ versionHash, lang: lng, fileName: 'accessabilities.json' });
  return { ...tr, a11y };
}

/** Merges version-specific translation bundles over common for all supported langs. */
export function I18nVersionBridge() {
  const versionHash = useVersionHash();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const lng of LANGS) {
        const merged = await buildMergedTranslation(versionHash, lng);
        if (cancelled) return;
        i18n.addResourceBundle(lng, 'translation', merged, true, true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [versionHash]);

  return null;
}
