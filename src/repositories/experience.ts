// 언어·버전별 experiences를 ExperienceModel 목록으로 제공
import ExperienceModel, { type ExperienceModelInput } from '@models/experience';
import { parseArray } from '@utils/parse';
import { DATA_FILE, loadData } from '@versioning';
import type { RepositoryLoadOptions } from './types';

export default class ExperienceRepository {
  list: ExperienceModel[];

  constructor() {
    this.list = [];
  }

  async load({ lang = 'en', hash = '' }: RepositoryLoadOptions = {}): Promise<void> {
    const data = await loadData({ hash, lang, file: DATA_FILE.experiences });
    const models = parseArray(data).map((json) => ExperienceModel.fromJson(json as ExperienceModelInput));
    this.list = models.sort((a, b) =>
      (b.startDate || '').localeCompare(a.startDate || '', undefined, { numeric: true })
    );
  }

  get all(): ExperienceModel[] {
    return this.list;
  }

  getById(id: string): ExperienceModel | undefined {
    return this.list.find((experience) => experience.id === id);
  }
}
