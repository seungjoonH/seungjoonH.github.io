import { loadDataFile } from '../versioning/loadDataModule.js';

export async function loadDocsForLanguage(lang = 'en', versionHash = '') {
  return loadDataFile({ versionHash, lang, fileName: 'docs.js' });
}

export default class DocsRepository {
  constructor() {
    this._docs = null;
  }

  async load(lang = 'en', versionHash = '') {
    this._docs = await loadDocsForLanguage(lang, versionHash);
  }

  get docs() {
    return this._docs;
  }
}
