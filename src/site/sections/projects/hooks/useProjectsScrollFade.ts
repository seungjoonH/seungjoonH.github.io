// 헤더/행 스크롤 페이드를 DOM에 직접 반영
import { useRef } from 'react';
import { setCssVars } from '@hooks/useCssVars';
import { fadeOpacity, useScrollEffect } from '@hooks/viewportFade';

const HEADER_START = 0.82;
const HEADER_END = 0.5;
const ROW_START = 0.85;
const ROW_END = 0.52;
const ROW_TRANSLATE_PX = 18;

/** 헤더/행이 뷰포트에 들어올 때 opacity와 위치를 페이드인한다. */
export function useProjectsScrollFade(rows: unknown[]) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useScrollEffect(() => {
    const wh = window.innerHeight;
    const sectionEl = sectionRef.current;
    const headerEl = headerRef.current;
    if (sectionEl && headerEl) {
      const opacity = fadeOpacity(sectionEl.getBoundingClientRect().top, wh, HEADER_START, HEADER_END);
      setCssVars(headerEl, { '--header-opacity': opacity });
      headerEl.toggleAttribute('data-hidden', opacity === 0);
    }

    rowRefs.current.forEach((row) => {
      if (!row) return;
      const top = row.getBoundingClientRect().top;
      const opacity = fadeOpacity(top, wh, ROW_START, ROW_END);
      const translateY = (1 - opacity) * ROW_TRANSLATE_PX;
      row.style.opacity = `${opacity}`;
      row.style.transform = `translateY(${translateY}px)`;
    });
  }, [rows]);

  return { rowRefs, sectionRef, headerRef };
}
