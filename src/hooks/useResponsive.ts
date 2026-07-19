// 뷰포트 너비 기반 브레이크포인트를 제공하는 훅
import { useState, useEffect } from 'react';
import config, { type ScreenSizeType } from '../config';

const { widths, screenSizeTypes } = config.breakpoints;

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const index = widths.reduce(
    (matchedIndex, minWidth, currentIndex) => (width >= minWidth ? currentIndex + 1 : matchedIndex),
    0,
  );
  const type = screenSizeTypes[index] as ScreenSizeType | undefined;
  if (type == null) {
    throw new Error(`breakpoints.screenSizeTypes missing index ${index}`);
  }
  const isMobile = type === 'mobile';
  const isTablet = type === 'tablet';
  const isDesktop = type === 'desktop';
  const isWide = type === 'wide';

  return {
    width,
    index,
    type,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
  };
}
