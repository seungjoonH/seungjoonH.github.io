// 프로젝트 데이터 모델 — tags/stack 정규화 및 표시용 getter 제공
import { isRecord, parseArray } from '@utils/parse';
import { formatProjectPeriodPart } from '@utils/dateFormat';

export interface TagOrStackItem {
  name: string;
  show: boolean;
}

type RawTagOrStack = string | { name: string; show?: boolean };

export interface ProjectPeriod {
  start?: string;
  end?: string;
}

export interface ProjectModelInput {
  id?: string | number;
  teamSize?: number;
  type?: string;
  hidden?: boolean;
  title?: string;
  status?: string;
  period?: ProjectPeriod;
  summary?: string;
  tags?: RawTagOrStack[];
  techStack?: RawTagOrStack[];
  links?: unknown[];
  relatedLinks?: unknown[];
  sections?: unknown[];
  images?: unknown[];
}

function normalizeTagOrStackItem(item: RawTagOrStack | null): TagOrStackItem | null {
  if (item == null) return null;
  if (typeof item === 'string') {
    const name = String(item).trim();
    return name ? { name, show: true } : null;
  }
  if (isRecord(item) && item.name != null) {
    const name = String(item.name).trim();
    return name ? { name, show: item.show !== false } : null;
  }
  return null;
}

export default class ProjectModel {
  id: string | number | undefined;
  teamSize: number;
  type: string | null;
  hidden: boolean;
  title: string;
  status: string | null;
  period: ProjectPeriod;
  summary: string;
  links: unknown[];
  relatedLinks: unknown[];
  sections: unknown[];
  images: unknown[];

  private _tags: TagOrStackItem[];
  private _techStacks: TagOrStackItem[];

  constructor({
    id,
    teamSize = 1,
    type,
    hidden = false,
    title = '',
    status,
    period = {},
    summary = '',
    tags = [],
    techStack = [],
    links = [],
    relatedLinks = [],
    sections = [],
    images = [],
  }: ProjectModelInput = {}) {
    const rawTags = parseArray<RawTagOrStack>(tags);
    const rawStack = parseArray<RawTagOrStack>(techStack);
    this._tags = rawTags.map(normalizeTagOrStackItem).filter((item): item is TagOrStackItem => item != null);
    this._techStacks = rawStack.map(normalizeTagOrStackItem).filter((item): item is TagOrStackItem => item != null);

    this.id = id;
    this.teamSize = Math.max(1, Number(teamSize) || 1);
    this.type = type ?? null;
    this.hidden = Boolean(hidden);
    this.title = title;
    this.status = status ?? null;
    this.period = period || {};
    this.summary = summary;
    this.links = parseArray(links);
    this.relatedLinks = parseArray(relatedLinks);
    this.sections = parseArray(sections);
    this.images = images;
  }

  get displayTags(): string[] {
    return this._tags.filter((t) => t.show).map((t) => t.name);
  }

  get displayTechStacks(): string[] {
    return this._techStacks.filter((s) => s.show).map((s) => s.name);
  }

  get tagNames(): string[] {
    return this._tags.map((t) => t.name);
  }

  get techStackNames(): string[] {
    return this._techStacks.map((s) => s.name);
  }

  get tags(): string[] {
    return this.displayTags;
  }

  get techStacks(): string[] {
    return this.displayTechStacks;
  }

  static fromJson(json: ProjectModelInput): ProjectModel {
    return new ProjectModel(json);
  }

  get coverImage(): unknown {
    if (this.images?.[0]) return this.images[0];
    if (this.id) return `/assets/projects/${this.id}.svg`;
    return null;
  }

  get yearLabel(): string {
    const source = this.period?.start || this.period?.end;
    if (!source || source.length < 4) return '';
    return source.slice(0, 4);
  }

  get periodLabel(): string {
    const start = formatProjectPeriodPart(this.period?.start);
    const end = formatProjectPeriodPart(this.period?.end);
    if (!start && !end) return '';
    return `${start} ~ ${end}`;
  }

  get isGroup(): boolean {
    return this.teamSize > 1;
  }

  get typeLabel(): string {
    const raw = this.type ?? (this.isGroup ? 'group' : 'personal');
    const s = String(raw).toLowerCase();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }
}
