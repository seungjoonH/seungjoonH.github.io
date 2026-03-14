export default class SkillModel {
  static baseUrl = "/assets/icons";
  
  constructor({ category, name }) {
    this.category = category;
    this.name = name;
    const camelCaseName = name.replace(/\s+/g, '')
      .toLowerCase()
      .replaceAll('+', 'p')
      .replaceAll('\.', '');

    this.imageUrl = `${SkillModel.baseUrl}/${camelCaseName}.svg`;
  }

  static fromJson(category, name) {
    return new SkillModel({ category, name });
  }
}