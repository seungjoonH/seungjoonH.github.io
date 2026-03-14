import EducationModel from '../models/education.js';
import educationsEn from '../data/en/educations.js';
import educationsKo from '../data/ko/educations.js';

const dataByLang = { en: educationsEn, ko: educationsKo };

export default class EducationRepository {
  constructor() { this.list = []; }

  async load(lang = 'en') {
    const data = Array.isArray(dataByLang[lang]) ? dataByLang[lang] : (dataByLang.en ?? []);
    this.list = data.map((json) => EducationModel.fromJson(json));
  }

  get all() { return this.list; }
  getById(id) { return this.list.find((education) => education.id === id); }
}