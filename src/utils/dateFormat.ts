// 경력 날짜 문자열을 짧은/전체 표시 형식으로 포맷

/**
 * `YYYY-MM`을 `YYYY. MM` 형식으로 포맷한다.
 * @param dateStr - `YYYY-MM` 또는 `YYYY-MM-DD`
 * @returns 짧은 표시 문자열. 비어 있으면 빈 문자열.
 */
export function formatExperienceDateShort(dateStr?: string): string {
  if (!dateStr) return '';
  const [y, m] = dateStr.trim().split('-');
  if (!y || !m) return dateStr;
  return `${y}. ${m.padStart(2, '0')}`;
}

/**
 * `YYYY-MM(-DD)`를 `YYYY. MM. DD` 형식으로 포맷한다. 일이 없으면 `01`.
 * @param dateStr - `YYYY-MM` 또는 `YYYY-MM-DD`
 * @returns 전체 표시 문자열. 비어 있으면 빈 문자열.
 */
export function formatExperienceDateFull(dateStr?: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.trim().split('-');
  if (!y || !m) return dateStr;
  return `${y}. ${m.padStart(2, '0')}. ${(d ?? '01').padStart(2, '0')}`;
}

/**
 * 프로젝트 period용. 일이 있으면 `YYYY. MM. DD`, 없으면 `YYYY. MM`.
 * @param dateStr - `present` | `YYYY-MM` | `YYYY-MM-DD`
 */
export function formatProjectPeriodPart(dateStr?: string): string {
  if (!dateStr) return '';
  if (String(dateStr).toLowerCase() === 'present') return 'Present';
  const [y, m, d] = dateStr.trim().split('-');
  if (!y || !m) return dateStr;
  if (d) return `${y}. ${m.padStart(2, '0')}. ${d.padStart(2, '0')}`;
  return `${y}. ${m.padStart(2, '0')}`;
}
