// 스크롤 뷰포트 페이드 opacity 계산·리스너 유틸
import { useEffect } from 'react';

/**
 * 요소 top이 start→end 구간에 있을 때 0~1 opacity를 보간한다.
 * @param top - getBoundingClientRect().top
 * @param windowHeight - window.innerHeight
 * @param startRatio - fade 시작 (비율, top이 여기 이상이면 0)
 * @param endRatio - fade 끝 (비율, top이 여기 이하면 1)
 */
export function fadeOpacity(
  top: number,
  windowHeight: number,
  startRatio: number,
  endRatio: number
): number {
  const start = windowHeight * startRatio;
  const end = windowHeight * endRatio;
  if (top <= end) return 1;
  if (top >= start) return 0;
  return (start - top) / (start - end);
}

/** scroll 이벤트에 effect를 연결하고 즉시 한 번 실행한다. */
export function useScrollEffect(effect: () => void, deps: unknown[]): void {
  useEffect(() => {
    window.addEventListener('scroll', effect);
    effect();
    return () => window.removeEventListener('scroll', effect);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns deps
  }, deps);
}
