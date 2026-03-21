import { useState, useEffect } from 'react';
import config from '../config.js';

const { widths, screenSizeTypes, projectsGrid } = config.breakpoints;

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let index = 0;
  for (let i = 0; i < widths.length; i++) {
    if (width >= widths[i]) index = i + 1;
  }
  const type = screenSizeTypes[index] ?? screenSizeTypes[0];
  const projectsGridBounds = projectsGrid[type] ?? projectsGrid[screenSizeTypes[0]];
  const isMobile = type === 'mobile';
  const isTablet = type === 'tablet';
  const isDesktop = type === 'desktop' || type === 'wide';

  return {
    width,
    index,
    type,
    projectsGridBounds,
    isMobile,
    isTablet,
    isDesktop,
    a11yCardSuffix: isMobile ? 'Mobile' : 'Desktop',
  };
}

export default useResponsive;
