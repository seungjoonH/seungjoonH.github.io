// 언어·버전별 educations를 EducationModel 목록으로 제공
import EducationModel, { type EducationModelInput } from '@models/education';
import { parseArray } from '@utils/parse';
import { DATA_FILE, loadData } from '@versioning';
import type { RepositoryLoadOptions } from './types';

export default class EducationRepository {
  list: EducationModel[];

  constructor() {
    this.list = [];
  }

  async load({ lang = 'en', hash = '' }: RepositoryLoadOptions = {}): Promise<void> {
    const data = await loadData({ hash, lang, file: DATA_FILE.educations });
    this.list = parseArray(data).map((json) => EducationModel.fromJson(json as EducationModelInput));
  }

  get all(): EducationModel[] {
    return this.list;
  }

  getById(id: string | number): EducationModel | undefined {
    return this.list.find((education) => education.id === id);
  }
}
