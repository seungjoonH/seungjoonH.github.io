import ProjectModel from '../models/project.js';
import projectsEn from '../data/en/projects.js';
import projectsKo from '../data/ko/projects.js';

const dataByLang = { en: projectsEn, ko: projectsKo };

export default class ProjectRepository {
  constructor() {
    this.list = [];
  }

  async load(lang = 'en') {
    const projects = dataByLang[lang] ?? dataByLang.en;
    this.list = (Array.isArray(projects) ? projects : []).map((json, i) =>
      ProjectModel.fromJson({ id: i + 1, ...json })
    );
  }

  get all() {
    return this.list;
  }
}
