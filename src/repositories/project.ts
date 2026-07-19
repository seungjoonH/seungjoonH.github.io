// 언어·버전별 projects.ts를 불러 ProjectModel 목록으로 제공
import ProjectModel, { type ProjectModelInput } from '@models/project';
import { parseArray } from '@utils/parse';
import { DATA_FILE, loadData } from '@versioning';
import type { RepositoryLoadOptions } from './types';

export default class ProjectRepository {
  list: ProjectModel[];

  constructor() {
    this.list = [];
  }

  async load({ lang = 'en', hash = '' }: RepositoryLoadOptions = {}): Promise<void> {
    const projects = await loadData({ hash, lang, file: DATA_FILE.projects });
    this.list = parseArray(projects).map((json, i) =>
      ProjectModel.fromJson({ id: i + 1, ...(json as ProjectModelInput) })
    );
  }

  get all(): ProjectModel[] {
    return this.list;
  }
}
