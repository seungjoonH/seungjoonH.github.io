// CycleIconButton의 다음 value 계산 (순수)
export function nextCycleValue<T extends string>(value: T, options: readonly { value: T }[]): T {
  if (options.length === 0) return value;
  const i = options.findIndex((o) => o.value === value);
  const next = i < 0 ? 0 : (i + 1) % options.length;
  return options[next].value;
}
