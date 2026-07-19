// 프로젝트 카드 영역 밖 터치/클릭 시 flip 해제
import { useEffect, type RefObject } from 'react';
import { useResponsive } from '@hooks/useResponsive';
import { useProjectCardFlipStore } from '@stores/projectCardFlipStore';

/** 모바일에서 그리드 컨테이너 밖을 누르면 flip을 닫는다. */
export function useProjectCardFlipOutside(containerRef: RefObject<HTMLElement | null>) {
  const { isMobile } = useResponsive();
  const setFlippedProjectId = useProjectCardFlipStore((s) => s.setFlippedProjectId);

  useEffect(() => {
    if (!isMobile) return;
    const clearFlipIfOutside = (e: Event) => {
      const container = containerRef.current;
      if (!container || container.contains(e.target as Node)) return;
      setFlippedProjectId(null);
    };
    document.addEventListener('touchstart', clearFlipIfOutside, true);
    document.addEventListener('mousedown', clearFlipIfOutside, true);
    return () => {
      document.removeEventListener('touchstart', clearFlipIfOutside, true);
      document.removeEventListener('mousedown', clearFlipIfOutside, true);
    };
  }, [isMobile, setFlippedProjectId, containerRef]);
}
