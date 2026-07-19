// Experience 섹션 스크롤·스냅·터치·모달 대응 훅
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import ExperienceModel from '@models/experience';
import { useResponsive } from '@hooks/useResponsive';
import { useAnalytics } from '@hooks/useAnalytics';
import { useA11y } from '@hooks/useA11y';
import { onActivateKeyDown } from '@hooks/onActivateKeyDown';
import { useExperienceFocusStore } from '@stores/focusIdStore';
import { useExperienceScroll } from './useExperienceScroll';

const LONG_PRESS_MS = 2000;
const SCROLL_THRESHOLD_PX = 10;
const FOCUS_RESET_MS = 400;

/** Experience 섹션 기능(스크롤·인터랙션·포커스 점프)만 담당한다. */
export function useExperienceSection(experiences: ExperienceModel[]) {
  const { isMobile } = useResponsive();
  const { trackExperienceClick } = useAnalytics();
  const a11y = useA11y();
  const experienceIdToFocus = useExperienceFocusStore((s) => s.idToFocus);
  const clearExperienceIdToFocus = useExperienceFocusStore((s) => s.clearIdToFocus);

  const {
    scrollContainerRef,
    cardRefs,
    isAutoAdjustingRef,
    hidden,
    focusedCardIndex,
    setFocusedCardIndex,
    centerCardInView,
    moveFocusBy,
  } = useExperienceScroll(experiences);

  const [modalExperience, setModalExperience] = useState<ExperienceModel | null>(null);
  const [mobileHoveredCardIndex, setMobileHoveredCardIndex] = useState<number | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const longPressFiredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const touchWasScrollRef = useRef(false);

  function clearTimer() {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  useEffect(() => () => clearTimer(), []);

  function openModal(experience: ExperienceModel, index: number) {
    returnFocusRef.current = cardRefs.current?.[index] ?? null;
    setModalExperience(experience);
  }

  function closeModal() {
    setModalExperience(null);
  }

  function handleFocusCard(index: number) {
    setFocusedCardIndex(index);
    centerCardInView(cardRefs.current?.[index] ?? null);
  }

  function handleCardTouchStart(experience: ExperienceModel, index: number) {
    return (e: TouchEvent) => {
      if (!isMobile) return;
      longPressFiredRef.current = false;
      touchWasScrollRef.current = false;
      const t = e.touches[0];
      if (t) startPosRef.current = { x: t.clientX, y: t.clientY };
      clearTimer();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        longPressFiredRef.current = true;
        setMobileHoveredCardIndex(null);
        openModal(experience, index);
      }, LONG_PRESS_MS);
    };
  }

  function handleCardTouchMove(e: TouchEvent) {
    if (!isMobile) return;
    const t = e.touches[0];
    if (!t) return;
    const dx = t.clientX - startPosRef.current.x;
    const dy = t.clientY - startPosRef.current.y;
    if (Math.hypot(dx, dy) <= SCROLL_THRESHOLD_PX) return;
    touchWasScrollRef.current = true;
    clearTimer();
  }

  const handleCardClick = (experience: ExperienceModel, index: number) => () => {
    if (isMobile && longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (!isMobile) {
      trackExperienceClick(experience?.id);
      handleFocusCard(index);
      openModal(experience, index);
      return;
    }
    if (touchWasScrollRef.current) {
      touchWasScrollRef.current = false;
      setFocusedCardIndex(index);
      return;
    }
    if (mobileHoveredCardIndex === index) {
      trackExperienceClick(experience?.id);
      openModal(experience, index);
      setMobileHoveredCardIndex(null);
      return;
    }
    trackExperienceClick(experience?.id);
    setMobileHoveredCardIndex(index);
    handleFocusCard(index);
  };

  const handleCardKeyDown = (experience: ExperienceModel, index: number) => (e: KeyboardEvent) => {
    onActivateKeyDown(e, () => {
      trackExperienceClick(experience?.id);
      openModal(experience, index);
      if (isMobile && mobileHoveredCardIndex === index) setMobileHoveredCardIndex(null);
    });
  };

  const getCardAriaLabel = (experience: ExperienceModel) =>
    a11y(`experience.card${isMobile ? 'Mobile' : 'Desktop'}`, {
      company: experience.company,
      position: experience.position,
    });

  useEffect(() => {
    if (!isMobile) return;
    const clearHoverIfOutside = (e: Event) => {
      const container = scrollContainerRef.current;
      if (!container || (e.target instanceof Node && container.contains(e.target))) return;
      setMobileHoveredCardIndex(null);
    };
    document.addEventListener('touchstart', clearHoverIfOutside, true);
    document.addEventListener('mousedown', clearHoverIfOutside, true);
    return () => {
      document.removeEventListener('touchstart', clearHoverIfOutside, true);
      document.removeEventListener('mousedown', clearHoverIfOutside, true);
    };
  }, [isMobile, scrollContainerRef]);

  useEffect(() => {
    if (!experienceIdToFocus || experiences.length === 0) return;
    const index = experiences.findIndex((e) => e.id === experienceIdToFocus);
    if (index < 0) return clearExperienceIdToFocus();
    const card = cardRefs.current[index];
    setFocusedCardIndex(index);
    if (card) {
      isAutoAdjustingRef.current = true;
      centerCardInView(card);
      setTimeout(() => {
        isAutoAdjustingRef.current = false;
        clearExperienceIdToFocus();
      }, FOCUS_RESET_MS);
    } else {
      clearExperienceIdToFocus();
    }
  }, [
    experienceIdToFocus,
    experiences,
    clearExperienceIdToFocus,
    cardRefs,
    centerCardInView,
    isAutoAdjustingRef,
    setFocusedCardIndex,
  ]);

  return {
    scrollContainerRef,
    cardRefs,
    hidden,
    focusedCardIndex,
    moveFocusBy,
    modalExperience,
    closeModal,
    returnFocusRef,
    mobileHoveredCardIndex,
    handleCardTouchStart,
    handleCardTouchMove,
    handleCardTouchEnd: clearTimer,
    handleCardTouchCancel: clearTimer,
    handleCardClick,
    handleCardKeyDown,
    getCardAriaLabel,
  };
}
