// 언어·버전에 맞는 docs 데이터를 로드해 반환
import { DATA_FILE, loadData } from '@versioning';
import { parseRecord } from '@utils/parse';
import { useVersionedLoad } from '@hooks/useVersionedLoad';
import type { DocsCollection } from './getDocById';

export function useDocs(): DocsCollection {
  return useVersionedLoad(async ({ lang, hash }) => {
    const data = await loadData({ hash, lang, file: DATA_FILE.docs });
    return parseRecord<DocsCollection>(data);
  }, {});
}
