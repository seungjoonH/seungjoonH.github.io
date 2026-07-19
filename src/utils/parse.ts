// 알 수 없는 값을 안전한 record·array로 파싱하는 util

/**
 * null·배열을 제외한 순수 객체인지 판별한다.
 * @param value - 검사할 값
 * @returns 순수 객체이면 true
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 순수 객체면 그대로 반환하고, 아니면 fallback을 반환한다.
 * @param value - 검사할 값
 * @param fallback - 객체가 아닐 때 반환할 값 (기본 `{}`)
 * @returns 순수 객체이거나 fallback
 */
export function parseRecord<T>(value: unknown, fallback: T = {} as T): T {
  return isRecord(value) ? (value as T) : fallback;
}

/**
 * 배열이면 그대로 반환하고, 아니면 fallback을 반환한다.
 * @param value - 검사할 값
 * @param fallback - 배열이 아닐 때 반환할 값 (기본 `[]`)
 * @returns 배열이거나 fallback
 */
export function parseArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

/**
 * 문자열이면 그대로 반환하고, 아니면 fallback을 반환한다.
 * @param value - 검사할 값
 * @param fallback - 문자열이 아닐 때 반환할 값 (기본 `''`)
 * @returns 문자열이거나 fallback
 */
export function parseString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/**
 * 문자열이면 trim 결과를 반환하고, 아니면 fallback을 반환한다.
 * @param value - 검사할 값
 * @param fallback - 문자열이 아닐 때 반환할 값 (기본 `''`)
 * @returns trim된 문자열이거나 fallback
 */
export function parseTrimmedString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}
