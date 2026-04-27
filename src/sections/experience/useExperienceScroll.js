import { useState, useRef, useEffect } from 'react';

const SNAP_DISTANCE_THRESHOLD_PX = 8;
const SNAP_IDLE_DELAY_MS = 140;
const SNAP_INITIAL_DELAY_MS = 60;
const AUTO_ADJUST_RESET_MS = 260;

const MOBILE_IN_VIEW_RATIO = 0.95;
const CARD_FADE_START_RATIO = 0.7;
const CARD_FADE_END_RATIO = 0.5;

export function useExperienceScroll(experiences, breakpointType, isMobile) {
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const isAutoAdjustingRef = useRef(false);
  const idleSnapTimeoutRef = useRef(null);
  const [hidden, setHidden] = useState(true);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  const centerCardInView = (card) => {
    const container = scrollContainerRef.current;
    if (!container || !card) return;
    const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  };

  const moveFocusBy = (delta) => {
    if (experiences.length === 0) return;
    const nextIndex = Math.min(experiences.length - 1, Math.max(0, focusedCardIndex + delta));
    setFocusedCardIndex(nextIndex);
    centerCardInView(cardRefs.current[nextIndex]);
  };

  const getNearestCardIndex = (container) => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return { index: 0, distance: Number.POSITIVE_INFINITY, cards };
    const centerX = container.getBoundingClientRect().left + container.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centerX);
      if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = idx; }
    });
    return { index: nearestIndex, distance: nearestDistance, cards };
  };

  const focusNearestCardInContainer = (container) => {
    const { index, distance, cards } = getNearestCardIndex(container);
    setFocusedCardIndex(index);
    if (distance < SNAP_DISTANCE_THRESHOLD_PX) return;
    const targetCard = cards[index];
    if (!targetCard) return;
    const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
    isAutoAdjustingRef.current = true;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setTimeout(() => isAutoAdjustingRef.current = false, AUTO_ADJUST_RESET_MS);
  };

  const updateCardsOpacity = (container) => {
    if (isMobile) {
      const inView = container.getBoundingClientRect().top < window.innerHeight * MOBILE_IN_VIEW_RATIO;
      const opacity = inView ? 1 : 0;
      cardRefs.current.forEach((card) => { if (card) card.style.opacity = opacity; });
      setHidden(!inView);
      return;
    }
    const windowHeight = window.innerHeight;
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const cardTop = card.getBoundingClientRect().top;
      const startFade = windowHeight * CARD_FADE_START_RATIO;
      const endFade = windowHeight * CARD_FADE_END_RATIO;
      let opacity = 0;
      if (cardTop <= endFade) { opacity = 1; setHidden(false); }
      else if (cardTop > startFade) { opacity = 0; setHidden(true); }
      else opacity = 1 - (cardTop - endFade) / (startFade - endFade);
      card.style.opacity = opacity;
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => updateCardsOpacity(container);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [experiences, breakpointType]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || experiences.length === 0) return;
    const handleHorizontalScroll = () => {
      if (isAutoAdjustingRef.current) return;
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
      idleSnapTimeoutRef.current = setTimeout(() => focusNearestCardInContainer(container), SNAP_IDLE_DELAY_MS);
    };
    const initialTimer = setTimeout(() => focusNearestCardInContainer(container), SNAP_INITIAL_DELAY_MS);
    container.addEventListener('scroll', handleHorizontalScroll, { passive: true });
    return () => {
      clearTimeout(initialTimer);
      container.removeEventListener('scroll', handleHorizontalScroll);
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
    };
  }, [experiences, breakpointType]);

  return {
    scrollContainerRef,
    cardRefs,
    isAutoAdjustingRef,
    hidden,
    focusedCardIndex,
    setFocusedCardIndex,
    centerCardInView,
    moveFocusBy,
  };
}
