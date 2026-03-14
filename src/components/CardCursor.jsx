import React, { useEffect, useRef, useState } from 'react';
import styles from './cardCursor.module.css';
import { useBreakpoint } from '../hooks/useBreakpoint';

const CARD_SELECTOR = '[data-interactive-card]';

function isOverCard(clientX, clientY) {
  if (typeof document === 'undefined') return false;
  const el = document.elementFromPoint(clientX, clientY);
  return !!el?.closest(CARD_SELECTOR);
}

export function CardCursor() {
  const { type: breakpointType } = useBreakpoint();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      posRef.current = { x, y };
      setPos({ x, y });
      setVisible(!!e.target.closest(CARD_SELECTOR));
    };
    const handleLeave = () => setVisible(false);

    const syncVisibleFromPoint = () => {
      const { x, y } = posRef.current;
      setVisible(isOverCard(x, y));
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
  }, []);

  if (breakpointType === 'mobile' || !visible) return null;

  return (
    <div
      className={styles.ring}
      style={{ left: pos.x, top: pos.y }}
      aria-hidden="true"
    >
      <span className={styles.ringInner} />
    </div>
  );
}
