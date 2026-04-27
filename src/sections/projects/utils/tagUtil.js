export function toHashTag(tag) {
  const text = String(tag).trim();
  return text ? `#${text}` : '#';
}
