// data-cursor-ring 대상 위에서 커서 링 오버레이를 표시함
import { useEffect, useRef, type ReactNode } from 'react';
import { useResponsive } from '@hooks/useResponsive';
import { setCssVars } from '@hooks/useCssVars';
import styles from './cursorRing.module.css';

const CURSOR_RING_SELECTOR = '[data-cursor-ring]';

function isOverTarget(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY);
  return !!el?.closest(CURSOR_RING_SELECTOR);
}

export interface CursorRingTargetProps {
  children: ReactNode;
}

function CursorRingTarget({ children }: CursorRingTargetProps): ReactNode {
  return <div className={styles.target} data-cursor-ring="">{children}</div>;
}

function setRingVisible(el: HTMLElement | null, visible: boolean) {
  if (!el) return;
  el.toggleAttribute('data-visible', visible);
}

function CursorRingRoot(): ReactNode {
  const { isMobile } = useResponsive();
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);

  useEffect(() => {
    if (isMobile) return undefined;

    const applyVisible = (next: boolean) => {
      if (next === visibleRef.current) return;
      visibleRef.current = next;
      setRingVisible(ringRef.current, next);
    };

    const handleMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      posRef.current = { x, y };
      setCssVars(ringRef.current, {
        '--cursor-ring-x': `${x}px`,
        '--cursor-ring-y': `${y}px`,
      });
      const target = e.target;
      applyVisible(!!(target instanceof Element && target.closest(CURSOR_RING_SELECTOR)));
    };
    const handleLeave = () => applyVisible(false);

    const syncVisibleFromPoint = () => {
      const { x, y } = posRef.current;
      applyVisible(isOverTarget(x, y));
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('scroll', syncVisibleFromPoint, { passive: true, capture: true });
    window.addEventListener('resize', syncVisibleFromPoint);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('scroll', syncVisibleFromPoint, { capture: true });
      window.removeEventListener('resize', syncVisibleFromPoint);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div ref={ringRef} className={styles.ring} aria-hidden="true">
      <span className={styles.ringInner} />
    </div>
  );
}

export const CursorRing = Object.assign(CursorRingRoot, {
  Target: CursorRingTarget,
});
