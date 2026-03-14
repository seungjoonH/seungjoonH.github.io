import docsEn from '../data/en/docs.js';
import docsKo from '../data/ko/docs.js';

const dataByLang = { en: docsEn, ko: docsKo };

export function getDocsForLanguage(lang) {
  return dataByLang[lang] ?? dataByLang.en;
}

export default class DocsRepository {
  constructor() {
    this._docs = null;
  }

  load(lang = 'en') {
    this._docs = getDocsForLanguage(lang);
  }

  get docs() {
    return this._docs;
  }
}
