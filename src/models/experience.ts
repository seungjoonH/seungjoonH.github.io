// 경력 항목과 상세 섹션·링크를 담는 모델
import { parseArray } from '@utils/parse';

export interface ExperienceLink {
  type?: string;
  title?: string;
  href?: string;
  [key: string]: unknown;
}

export interface ExperienceDetailSection {
  title?: string;
  items?: string[];
  links?: ExperienceLink[];
  [key: string]: unknown;
}

export interface ExperienceDetails {
  sections?: ExperienceDetailSection[];
  [key: string]: unknown;
}

export interface ExperienceModelInput {
  id?: string;
  company?: string;
  position?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  details?: ExperienceDetails;
  shortcut?: string;
  searchTag?: string;
  projectSearchQuery?: string;
  links?: ExperienceLink[];
}

export default class ExperienceModel {
  id: string | undefined;
  company: string | undefined;
  position: string | undefined;
  imageUrl: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  details: ExperienceDetails | undefined;
  shortcut: string | null;
  searchTag: string | null;
  projectSearchQuery: string | null;
  links: ExperienceLink[];

  constructor({
    id,
    company,
    position,
    imageUrl,
    startDate,
    endDate,
    details,
    shortcut,
    searchTag,
    projectSearchQuery,
    links,
  }: ExperienceModelInput = {}) {
    this.id = id;
    this.company = company;
    this.position = position;
    this.imageUrl = imageUrl;
    this.startDate = startDate;
    this.endDate = endDate;
    this.details = details;
    this.shortcut = shortcut ?? null;
    this.searchTag = searchTag ?? null;
    this.projectSearchQuery = projectSearchQuery ?? null;
    this.links = parseArray(links);
  }

  get hasProjectShortcut(): boolean {
    return !!(this.shortcut || this.projectSearchQuery);
  }

  get sections(): ExperienceDetailSection[] {
    return this.details?.sections ?? [];
  }

  static fromJson(json: ExperienceModelInput): ExperienceModel {
    return new ExperienceModel(json);
  }

  getImageUrl(): string | null {
    if (this.imageUrl === '') return null;
    if (this.imageUrl) return this.imageUrl;
    if (this.id) return `/assets/experiences/${this.id}.svg`;
    return null;
  }
}
