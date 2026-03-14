export function tagToSlug(tag) {
  return String(tag)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function toHashTag(tag) {
  const text = String(tag).trim();
  return text ? `#${text}` : '#';
}
