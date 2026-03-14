import { useState, useEffect } from 'react';
import config from '../config.js';

const { widths, screenSizeTypes, projectsGrid } = config.breakpoints;

export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let index = 0;
  for (let i = 0; i < widths.length; i++) {
    if (width >= widths[i]) index = i + 1;
  }
  const type = screenSizeTypes[index] ?? screenSizeTypes[0];
  const projectsGridBounds = projectsGrid[type] ?? projectsGrid[screenSizeTypes[0]];

  return { index, type, projectsGridBounds };
}

export default useBreakpoint;
