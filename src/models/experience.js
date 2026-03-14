export default class ExperienceModel {
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
  } = {}) {
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
    this.links = Array.isArray(links) ? links : [];
  }

  get hasProjectShortcut() {
    return !!(this.shortcut || this.projectSearchQuery);
  }

  get sections() {
    return this.details?.sections ?? [];
  }

  static fromJson(json) { return new ExperienceModel(json); }

  getImageUrl() {
    if (this.imageUrl === '') return null;
    if (this.imageUrl) return this.imageUrl;
    if (this.id) return `/assets/experiences/${this.id}.svg`;
    return null;
  }
}