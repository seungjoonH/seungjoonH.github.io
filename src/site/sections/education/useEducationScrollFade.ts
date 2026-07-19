// Education 이력 항목 스크롤 opacity 페이드
import { useRef } from 'react';
import { fadeOpacity, useScrollEffect } from '@hooks/viewportFade';

const FADE_START = 0.8;
const FADE_END = 0.5;

/** Education 이력 카드가 뷰포트에 들어올 때 opacity를 페이드인한다. */
export function useEducationScrollFade(itemCount: number): {
  historyRefs: { current: (HTMLDivElement | null)[] };
} {
  const historyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollEffect(() => {
    const wh = window.innerHeight;
    historyRefs.current.forEach((history) => {
      if (!history) return;
      history.style.opacity = String(
        fadeOpacity(history.getBoundingClientRect().top, wh, FADE_START, FADE_END)
      );
    });
  }, [itemCount]);

  return { historyRefs };
}
