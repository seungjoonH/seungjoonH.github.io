function collectFromItems(items) {
  if (!Array.isArray(items)) return '';
  const parts = [];
  for (const item of items) {
    if (typeof item === 'string') {
      parts.push(item);
      continue;
    }
    if (item && typeof item === 'object') {
      if (item.title) parts.push(item.title);
      if (Array.isArray(item.items)) {
        for (const sub of item.items) {
          if (typeof sub === 'string') parts.push(sub);
        }
      }
      if (Array.isArray(item.links)) {
        for (const link of item.links) {
          if (link && link.title) parts.push(link.title);
        }
      }
    }
  }
  return parts.join(' ');
}

function collectLinkTitles(links) {
  if (!Array.isArray(links)) return '';
  return links.map((l) => (l && l.title ? l.title : '')).filter(Boolean).join(' ');
}

export function getSearchableText(project) {
  if (!project) return '';
  const parts = [];
  if (project.title) parts.push(project.title);
  if (project.summary) parts.push(project.summary);
  const tagNames = project.tagNames || project.tags || [];
  const stackNames = project.techStackNames || project.techStacks || [];
  if (tagNames.length) parts.push(tagNames.join(' '));
  if (stackNames.length) parts.push(stackNames.join(' '));
  if (Array.isArray(project.links)) parts.push(collectLinkTitles(project.links));

  const sections = project.sections || [];
  for (const sec of sections) {
    if (sec && sec.title) parts.push(sec.title);
    if (Array.isArray(sec.items)) parts.push(collectFromItems(sec.items));
    if (Array.isArray(sec.links)) parts.push(collectLinkTitles(sec.links));
  }

  return parts.join(' ');
}

export function getDescText(project) {
  if (!project) return '';
  const parts = [];
  if (project.summary) parts.push(project.summary);
  const tagNames = project.tagNames || project.tags || [];
  const stackNames = project.techStackNames || project.techStacks || [];
  if (tagNames.length) parts.push(tagNames.join(' '));
  if (stackNames.length) parts.push(stackNames.join(' '));
  if (Array.isArray(project.links)) parts.push(collectLinkTitles(project.links));

  const sections = project.sections || [];
  for (const sec of sections) {
    if (sec && sec.title) parts.push(sec.title);
    if (Array.isArray(sec.items)) parts.push(collectFromItems(sec.items));
    if (Array.isArray(sec.links)) parts.push(collectLinkTitles(sec.links));
  }

  return parts.join(' ');
}

export function getProjectLinkTypes(project) {
  if (!project) return [];
  const types = [];
  const add = (links) => {
    if (!Array.isArray(links)) return;
    for (const l of links) {
      if (l && l.type) types.push(String(l.type).toLowerCase());
    }
  };
  add(project.links);
  const sections = project.sections || [];
  for (const sec of sections) {
    add(sec.links);
    if (Array.isArray(sec.items)) {
      for (const item of sec.items) {
        if (item && typeof item === 'object' && Array.isArray(item.links)) add(item.links);
      }
    }
  }
  return types;
}
