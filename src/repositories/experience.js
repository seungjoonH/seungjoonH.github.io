import ExperienceModel from '../models/experience.js';
import experiencesEn from '../data/en/experiences.js';
import experiencesKo from '../data/ko/experiences.js';

const dataByLang = { en: experiencesEn, ko: experiencesKo };

export default class ExperienceRepository {
  constructor() { this.list = []; }

  async load(lang = 'en') {
    const data = Array.isArray(dataByLang[lang]) ? dataByLang[lang] : (dataByLang.en ?? []);
    const list = data.map((json) => ExperienceModel.fromJson(json));
    this.list = list.sort((a, b) => (b.startDate || '').localeCompare(a.startDate || '', undefined, { numeric: true }));
  }

  get all() { return this.list; }
  getById(id) { return this.list.find((experience) => experience.id === id); }
}