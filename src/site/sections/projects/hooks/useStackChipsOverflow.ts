// 스택 칩 줄바꿈 시 두 줄 균등 분할 여부를 측정하는 훅
import { useState, useRef, useLayoutEffect } from 'react';

export function useStackChipsOverflow(visibleCount: number) {
  const [useEvenSplit, setUseEvenSplit] = useState(false);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const chipsContainerRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (visibleCount < 2) return setUseEvenSplit(false);
    if (useEvenSplit) return;
    const chipsEl = chipsContainerRef.current;

    if (!chipsEl) return;
    const buttons = chipsEl.querySelectorAll('button');
    if (buttons.length < 2) return;

    const tops = Array.from(buttons).map((btn) => btn.offsetTop);
    const distinctTops = new Set(tops);
    if (distinctTops.size >= 2) setUseEvenSplit(true);
  }, [visibleCount, useEvenSplit]);

  const widthRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    const lineEl = lineRef.current;
    if (!lineEl) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (widthRef.current != null && w !== widthRef.current) setUseEvenSplit(false);
      widthRef.current = w;
    });
    ro.observe(lineEl);
    return () => ro.disconnect();
  }, []);

  return { useEvenSplit, lineRef, chipsContainerRef };
}
