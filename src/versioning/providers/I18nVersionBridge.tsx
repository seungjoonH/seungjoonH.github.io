// 버전 hash가 바뀌면 해당 번역을 i18n 번들에 deep-merge하는 브리지 (렌더 UI 없음)
import { useEffect } from 'react';
import i18n from '../../i18n';
import { parseRecord } from '@utils/parse';
import { DATA_FILE } from '../files';
import { loadData } from '../utils';
import { useVersion } from './VersionContext';

const LANGS = ['ko', 'en'] as const;
const I18N_NAMESPACE = 'translation';

/**
 * 버전 locale translations를 불러 i18n에 합친다.
 * @param hash - 사이트 버전 해시
 * @param isCancelled - cleanup 후 true면 번들 반영을 중단한다
 */
async function mergeVersionTranslations(
  hash: string,
  isCancelled: () => boolean
): Promise<void> {
  for (const lang of LANGS) {
    const data = await loadData({ hash, lang, file: DATA_FILE.translations });
    if (isCancelled()) return;

    i18n.addResourceBundle(
      lang,
      I18N_NAMESPACE,
      parseRecord(data),
      true, // deep merge
      true // overwrite existing keys
    );
  }
}

/** 버전 전환 시 i18n 리소스를 갱신한다. */
export function I18nVersionBridge(): null {
  const { hash } = useVersion();

  useEffect(() => {
    let cancelled = false;
    void mergeVersionTranslations(hash, () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [hash]);

  return null;
}
