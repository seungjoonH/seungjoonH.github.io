function normalizeTagOrStackItem(item) {
  if (item == null) return null;
  if (typeof item === 'string') {
    const name = String(item).trim();
    return name ? { name, show: true } : null;
  }
  if (typeof item === 'object' && item.name != null) {
    const name = String(item.name).trim();
    return name ? { name, show: item.show !== false } : null;
  }
  return null;
}

export default class ProjectModel {
  constructor({
    id,
    teamSize = 1,
    type,
    hidden = false,
    title = '',
    status = null,
    period = {},
    summary = '',
    tags = [],
    techStack = [],
    links = [],
    relatedLinks = [],
    sections = [],
    images = [],
  } = {}) {
    const rawTags = Array.isArray(tags) ? tags : [];
    const rawStack = Array.isArray(techStack) ? techStack : [];
    this._tags = rawTags.map(normalizeTagOrStackItem).filter(Boolean);
    this._techStacks = rawStack.map(normalizeTagOrStackItem).filter(Boolean);

    this.id = id;
    this.teamSize = Math.max(1, Number(teamSize) || 1);
    this.type = type ?? null;
    this.hidden = Boolean(hidden);
    this.title = title;
    this.status = status ?? null;
    this.period = period || {};
    this.summary = summary;
    this.links = Array.isArray(links) ? links : [];
    this.relatedLinks = Array.isArray(relatedLinks) ? relatedLinks : [];
    this.sections = Array.isArray(sections) ? sections : [];
    this.images = images;
  }

  get displayTags() {
    return this._tags.filter((t) => t.show).map((t) => t.name);
  }

  get displayTechStacks() {
    return this._techStacks.filter((s) => s.show).map((s) => s.name);
  }

  get tagNames() {
    return this._tags.map((t) => t.name);
  }

  get techStackNames() {
    return this._techStacks.map((s) => s.name);
  }

  get tags() {
    return this.displayTags;
  }

  get techStacks() {
    return this.displayTechStacks;
  }

  static fromJson(json) {
    return new ProjectModel(json);
  }

  get coverImage() {
    if (this.images?.[0]) return this.images[0];
    if (this.id) return `/assets/projects/${this.id}.svg`;
    return null;
  }

  get yearLabel() {
    const source = this.period?.start || this.period?.end;
    if (!source || source.length < 4) return '';
    return source.slice(0, 4);
  }

  get periodLabel() {
    const start = this.period?.start || '';
    const endRaw = this.period?.end || '';
    if (!start && !endRaw) return '';
    const end = String(endRaw).toLowerCase() === 'present' ? 'Present' : endRaw;
    return `${start.replace('-', '.')} ~ ${end}`;
  }

  get isGroup() {
    return this.teamSize > 1;
  }

  get typeLabel() {
    const raw = this.type ?? (this.isGroup ? 'group' : 'personal');
    const s = String(raw).toLowerCase();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

}
