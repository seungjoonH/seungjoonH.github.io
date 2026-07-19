// Main 히어로 패럴럭스 opacity/오프셋
import { useEffect, useRef } from 'react';
import { setCssVars } from '@hooks/useCssVars';

const FADE_MAX_PX = 500;
const TITLE_RATIO = 0.5;
const INTRO_RATIO = 0.3;

export interface UseMainParallaxResult {
  titleRef: React.RefObject<HTMLDivElement>;
  introRef: React.RefObject<HTMLDivElement>;
}

/** Main 스크롤에 따라 intro opacity와 title/intro 패럴럭스 오프셋을 갱신한다. */
export function useMainParallax(): UseMainParallaxResult {
  const titleRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const title = titleRef.current;
      const intro = introRef.current;
      if (!title || !intro) return;
      setCssVars(title, {
        '--parallax-title-offset-y': `${scrollY * TITLE_RATIO}px`,
      });
      setCssVars(intro, {
        '--parallax-intro-offset-y': `${-scrollY * INTRO_RATIO}px`,
        '--parallax-intro-opacity': Math.max(1 - scrollY / FADE_MAX_PX, 0),
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { titleRef, introRef };
}
