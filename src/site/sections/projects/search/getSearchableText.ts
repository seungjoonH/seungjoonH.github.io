// 프로젝트 검색·필터용 텍스트·링크 type 수집
import type ProjectModel from '@models/project';

interface LinkLike {
  title?: string;
  type?: string;
}

interface SectionLike {
  title?: string;
  items?: unknown[];
  links?: LinkLike[];
}

function collectFromItems(items: unknown[]): string {
  if (!Array.isArray(items)) return '';
  const parts: string[] = [];
  for (const item of items) {
    if (typeof item === 'string') {
      parts.push(item);
      continue;
    }
    if (item && typeof item === 'object') {
      const obj = item as { title?: string; items?: unknown[]; links?: LinkLike[] };
      if (obj.title) parts.push(obj.title);
      if (Array.isArray(obj.items)) {
        for (const sub of obj.items) {
          if (typeof sub === 'string') parts.push(sub);
        }
      }
      if (Array.isArray(obj.links)) {
        for (const link of obj.links) {
          if (link && link.title) parts.push(link.title);
        }
      }
    }
  }
  return parts.join(' ');
}

function collectLinkTitles(links: LinkLike[] | unknown): string {
  if (!Array.isArray(links)) return '';
  return links.map((l) => (l && (l as LinkLike).title ? (l as LinkLike).title : '')).filter(Boolean).join(' ');
}

export function getSearchableText(project: ProjectModel | null): string {
  if (!project) return '';
  const parts: string[] = [];
  if (project.title) parts.push(project.title);
  if (project.summary) parts.push(project.summary);
  const tagNames = project.tagNames || project.tags || [];
  const stackNames = project.techStackNames || project.techStacks || [];
  if (tagNames.length) parts.push(tagNames.join(' '));
  if (stackNames.length) parts.push(stackNames.join(' '));
  if (Array.isArray(project.links)) parts.push(collectLinkTitles(project.links));

  const sections = (project.sections || []) as SectionLike[];
  for (const sec of sections) {
    if (sec && sec.title) parts.push(sec.title);
    if (Array.isArray(sec.items)) parts.push(collectFromItems(sec.items));
    if (Array.isArray(sec.links)) parts.push(collectLinkTitles(sec.links));
  }

  return parts.join(' ');
}

export function getDescText(project: ProjectModel | null): string {
  if (!project) return '';
  const parts: string[] = [];
  if (project.summary) parts.push(project.summary);
  const tagNames = project.tagNames || project.tags || [];
  const stackNames = project.techStackNames || project.techStacks || [];
  if (tagNames.length) parts.push(tagNames.join(' '));
  if (stackNames.length) parts.push(stackNames.join(' '));
  if (Array.isArray(project.links)) parts.push(collectLinkTitles(project.links));

  const sections = (project.sections || []) as SectionLike[];
  for (const sec of sections) {
    if (sec && sec.title) parts.push(sec.title);
    if (Array.isArray(sec.items)) parts.push(collectFromItems(sec.items));
    if (Array.isArray(sec.links)) parts.push(collectLinkTitles(sec.links));
  }

  return parts.join(' ');
}

export function getProjectLinkTypes(project: ProjectModel | null): string[] {
  if (!project) return [];
  const types: string[] = [];
  const add = (links: LinkLike[] | unknown) => {
    if (!Array.isArray(links)) return;
    for (const l of links) {
      if (l && (l as LinkLike).type) types.push(String((l as LinkLike).type).toLowerCase());
    }
  };
  add(project.links);
  const sections = (project.sections || []) as SectionLike[];
  for (const sec of sections) {
    add(sec.links);
    if (Array.isArray(sec.items)) {
      for (const item of sec.items) {
        if (item && typeof item === 'object' && Array.isArray((item as { links?: LinkLike[] }).links)) {
          add((item as { links?: LinkLike[] }).links);
        }
      }
    }
  }
  return types;
}
