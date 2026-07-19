// 언어·버전별 skills 데이터를 SkillModel 목록으로 변환
import SkillModel from '@models/skill';
import { parseArray, parseRecord } from '@utils/parse';
import { DATA_FILE, loadData } from '@versioning';
import type { RepositoryLoadOptions } from './types';

type SkillsByCategory = Record<string, string[]>;

export default class SkillRepository {
  list: SkillModel[];

  constructor() {
    this.list = [];
  }

  async load({ lang = 'en', hash = '' }: RepositoryLoadOptions = {}): Promise<void> {
    const data = await loadData({ hash, lang, file: DATA_FILE.skills });
    const categories = parseRecord<SkillsByCategory>(data);

    this.list = Object.entries(categories).flatMap(([category, names]) =>
      parseArray<string>(names).map((name) => SkillModel.fromJson(category, name))
    );
  }

  get all(): SkillModel[] {
    return this.list;
  }

  getByCategory(category: string): SkillModel[] {
    return this.list.filter((skill) => skill.category === category);
  }
}
