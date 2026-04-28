import EducationModel from '../models/education.js';
import { loadDataFile } from '../versioning/loadDataModule.js';

export default class EducationRepository {
  constructor() {
    this.list = [];
  }

  async load(lang = 'en', versionHash = '') {
    const data = await loadDataFile({ versionHash, lang, fileName: 'educations.js' });
    const arr = Array.isArray(data) ? data : [];
    this.list = arr.map((json) => EducationModel.fromJson(json));
  }

  get all() {
    return this.list;
  }
  getById(id) {
    return this.list.find((education) => education.id === id);
  }
}
