export default class EducationModel {
  constructor({ 
    id,
    year,
    content,
  } = {}) {
    this.id = id;
    this.year = year;
    this.content = content;
  }

  static fromJson(json) { return new EducationModel(json); }
}