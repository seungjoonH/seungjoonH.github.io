// 빌드 산출물 크기 비교 막대의 너비(%) 계산 — 순수 로직
export function scaleWidthPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}
