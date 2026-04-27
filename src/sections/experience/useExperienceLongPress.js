import { useRef, useEffect } from 'react';

const LONG_PRESS_MS = 2000;
const LONG_PRESS_SCROLL_THRESHOLD_PX = 10;

export function useExperienceLongPress(isMobile, onLongPress) {
  const longPressFiredRef = useRef(false);
  const longPressTimerRef = useRef(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const touchWasScrollRef = useRef(false);

  const clearTimer = () => {
    if (!longPressTimerRef.current) return;
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const startTimer = (experience, index) => {
    clearTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null;
      longPressFiredRef.current = true;
      onLongPress(experience, index);
    }, LONG_PRESS_MS);
  };

  useEffect(() => () => clearTimer(), []);

  const handleCardTouchStart = (experience, index) => (e) => {
    if (!isMobile) return;
    longPressFiredRef.current = false;
    touchWasScrollRef.current = false;
    const t = e.touches?.[0];
    if (t) touchStartPosRef.current = { x: t.clientX, y: t.clientY };
    startTimer(experience, index);
  };

  const handleCardTouchMove = () => (e) => {
    if (!isMobile) return;
    const t = e.touches?.[0];
    if (!t) return;
    const dx = t.clientX - touchStartPosRef.current.x;
    const dy = t.clientY - touchStartPosRef.current.y;
    if (Math.hypot(dx, dy) <= LONG_PRESS_SCROLL_THRESHOLD_PX) return;
    touchWasScrollRef.current = true;
    clearTimer();
  };

  const handleCardTouchEnd = () => () => clearTimer();
  const handleCardTouchCancel = () => () => clearTimer();

  return {
    longPressFiredRef,
    touchWasScrollRef,
    handleCardTouchStart,
    handleCardTouchMove,
    handleCardTouchEnd,
    handleCardTouchCancel,
  };
}
