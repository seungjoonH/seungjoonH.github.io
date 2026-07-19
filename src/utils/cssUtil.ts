// className 조각을 공백으로 이어 하나의 문자열로 만듦

/**
 * truthy className 조각만 이어 붙인다.
 * @param args - className 후보들
 * @returns 공백으로 이어진 className 문자열
 */
export function buildCls(...args: unknown[]): string {
  return args.filter(Boolean).join(' ').trim();
}
