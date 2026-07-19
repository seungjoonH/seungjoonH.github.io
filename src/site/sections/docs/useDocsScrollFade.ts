// Docs 섹션 헤더/콘텐츠 스크롤 페이드 opacity
import { useRef } from 'react';
import { setCssVars } from '@hooks/useCssVars';
import { fadeOpacity, useScrollEffect } from '@hooks/viewportFade';

const HEADER_START = 0.82;
const HEADER_END = 0.5;
const CONTENT_START = 0.85;
const CONTENT_END = 0.52;

export interface UseDocsScrollFadeResult {
  sectionRef: React.RefObject<HTMLDivElement>;
  headerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLElement>;
}

/** Docs 헤더/본문이 뷰포트에 들어올 때 opacity를 페이드인한다. */
export function useDocsScrollFade(): UseDocsScrollFadeResult {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useScrollEffect(() => {
    const wh = window.innerHeight;
    if (sectionRef.current && headerRef.current) {
      const opacity = fadeOpacity(
        sectionRef.current.getBoundingClientRect().top,
        wh,
        HEADER_START,
        HEADER_END
      );
      setCssVars(headerRef.current, { '--header-opacity': opacity });
      headerRef.current.toggleAttribute('data-hidden', opacity === 0);
    }
    if (contentRef.current) {
      const opacity = fadeOpacity(
        contentRef.current.getBoundingClientRect().top,
        wh,
        CONTENT_START,
        CONTENT_END
      );
      setCssVars(contentRef.current, { '--content-opacity': opacity });
    }
  }, []);

  return { sectionRef, headerRef, contentRef };
}
