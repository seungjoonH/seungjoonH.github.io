// 학력 항목 id·연도·내용을 담는 모델

export interface EducationModelInput {
  id?: string | number;
  year?: string | number;
  content?: string;
}

export default class EducationModel {
  id: string | number | undefined;
  year: string | number | undefined;
  content: string | undefined;

  constructor({ id, year, content }: EducationModelInput = {}) {
    this.id = id;
    this.year = year;
    this.content = content;
  }

  static fromJson(json: EducationModelInput): EducationModel {
    return new EducationModel(json);
  }
}
