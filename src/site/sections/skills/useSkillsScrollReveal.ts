// Skills 카테고리 행의 가로 스크롤 reveal
import { useEffect, useRef } from 'react';

const SKILLS_FADE_START_RATIO = 0.76;
const SKILLS_FADE_END_RATIO = 0.28;
const SKILLS_TRANSLATE_PX = 220;
const SKILLS_SEGMENT_COUNT_BASE = 2;
const SKILLS_SEGMENT_STRIDE = 0.5;

/** 카테고리 행을 세그먼트 stagger로 opacity + translateX reveal 한다. */
export function useSkillsScrollReveal(rowCount: number): {
  categoryRefs: { current: (HTMLDivElement | null)[] };
} {
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const rows = categoryRefs.current.filter(Boolean) as HTMLDivElement[];
      if (rows.length === 0) return;

      const firstRect = rows[0].getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * SKILLS_FADE_START_RATIO;
      const end = windowHeight * SKILLS_FADE_END_RATIO;
      const rawProgress = (start - firstRect.top) / (start - end);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const segmentLength = SKILLS_SEGMENT_COUNT_BASE / (rows.length + 1);
      const segmentStride = segmentLength * SKILLS_SEGMENT_STRIDE;

      rows.forEach((row, index) => {
        const rowStart = index * segmentStride;
        const rowProgress = Math.max(0, Math.min(1, (progress - rowStart) / segmentLength));
        const eased = 1 - (1 - rowProgress) ** 2;
        row.style.transform = `translate3d(${(1 - eased) * SKILLS_TRANSLATE_PX}px, 0, 0)`;
        row.style.opacity = `${eased}`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [rowCount]);

  return { categoryRefs };
}
