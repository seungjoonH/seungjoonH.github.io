import ExperienceModel from '../models/experience.js';
import { loadDataFile } from '../versioning/loadDataModule.js';

export default class ExperienceRepository {
  constructor() {
    this.list = [];
  }

  async load(lang = 'en', versionHash = '') {
    const data = await loadDataFile({ versionHash, lang, fileName: 'experiences.js' });
    const list = Array.isArray(data) ? data : [];
    const models = list.map((json) => ExperienceModel.fromJson(json));
    this.list = models.sort((a, b) =>
      (b.startDate || '').localeCompare(a.startDate || '', undefined, { numeric: true })
    );
  }

  get all() {
    return this.list;
  }
  getById(id) {
    return this.list.find((experience) => experience.id === id);
  }
}
