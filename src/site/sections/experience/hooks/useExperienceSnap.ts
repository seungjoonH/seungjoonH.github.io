// 경력 카드 가로 스크롤 스냅·포커스
import { useEffect, useRef, useState, type RefObject } from 'react';

const SNAP_DISTANCE_THRESHOLD_PX = 8;
const SNAP_IDLE_DELAY_MS = 140;
const SNAP_INITIAL_DELAY_MS = 60;
const AUTO_ADJUST_RESET_MS = 260;

export function useExperienceSnap(
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  cardRefs: RefObject<(HTMLDivElement | null)[]>,
  length: number,
  deps: unknown[]
) {
  const isAutoAdjustingRef = useRef(false);
  const idleSnapTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  function centerCardInView(card: HTMLDivElement | null) {
    const container = scrollContainerRef.current;
    if (!container || !card) return;
    const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }

  function moveFocusBy(delta: number) {
    if (length === 0) return;
    const nextIndex = Math.min(length - 1, Math.max(0, focusedCardIndex + delta));
    setFocusedCardIndex(nextIndex);
    centerCardInView(cardRefs.current?.[nextIndex] ?? null);
  }

  function focusNearestCardInContainer(container: HTMLDivElement) {
    const cards = (cardRefs.current ?? []).filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const centerX = container.getBoundingClientRect().left + container.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = idx;
      }
    });

    setFocusedCardIndex(nearestIndex);
    if (nearestDistance < SNAP_DISTANCE_THRESHOLD_PX) return;

    const targetCard = cards[nearestIndex];
    if (!targetCard) return;
    const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
    isAutoAdjustingRef.current = true;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setTimeout(() => {
      isAutoAdjustingRef.current = false;
    }, AUTO_ADJUST_RESET_MS);
  }

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || length === 0) return undefined;

    const handleHorizontalScroll = () => {
      if (isAutoAdjustingRef.current) return;
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
      idleSnapTimeoutRef.current = setTimeout(
        () => focusNearestCardInContainer(container),
        SNAP_IDLE_DELAY_MS
      );
    };

    const initialTimer = setTimeout(() => focusNearestCardInContainer(container), SNAP_INITIAL_DELAY_MS);
    container.addEventListener('scroll', handleHorizontalScroll, { passive: true });
    return () => {
      clearTimeout(initialTimer);
      container.removeEventListener('scroll', handleHorizontalScroll);
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, ...deps]);

  return {
    isAutoAdjustingRef,
    focusedCardIndex,
    setFocusedCardIndex,
    centerCardInView,
    moveFocusBy,
  };
}
