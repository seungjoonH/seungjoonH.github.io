// 해시태그 문자열 앞에 #을 붙이는 유틸
export function toHashTag(tag: string): string {
  const text = tag.trim();
  return text ? `#${text}` : '#';
}
