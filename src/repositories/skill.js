import SkillModel from '../models/skill.js';
import config from '../config.js';

export default class SkillRepository {
  constructor() { this.list = []; }

  async load(_lang = 'en') {
    const jsonData = config.skills ?? [{}];
    const data = Array.isArray(jsonData) && jsonData.length > 0 ? jsonData[0] : {};
    this.list = Object.entries(data).flatMap(([category, names]) =>
      (names || []).map((name) => SkillModel.fromJson(category, name))
    );
  }

  get all() {
    return this.list;
  }

  getByCategory(category) {
    return this.list.filter((skill) => skill.category === category);
  }
}