import { useState, useRef, useLayoutEffect } from 'react';

export function useStackChipsOverflow(visibleCount) {
  const [useEvenSplit, setUseEvenSplit] = useState(false);
  const lineRef = useRef(null);
  const chipsContainerRef = useRef(null);

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

  const widthRef = useRef(null);
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
