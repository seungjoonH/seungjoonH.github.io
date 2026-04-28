import ProjectModel from '../models/project.js';
import { loadDataFile } from '../versioning/loadDataModule.js';

export default class ProjectRepository {
  constructor() {
    this.list = [];
  }

  /**
   * @param {string} lang
   * @param {string} [versionHash] site version id; empty uses common data only
   */
  async load(lang = 'en', versionHash = '') {
    const projects = await loadDataFile({ versionHash, lang, fileName: 'projects.js' });
    const arr = Array.isArray(projects) ? projects : [];
    this.list = arr.map((json, i) => ProjectModel.fromJson({ id: i + 1, ...json }));
  }

  get all() {
    return this.list;
  }
}
