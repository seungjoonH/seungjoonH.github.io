import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Header } from '@components/layout/Header';
import { ExperienceCard } from '@sections/experience/ExperienceCard';
import { ExperiencePano } from '@sections/experience/ExperiencePano';
import { ExperienceDetailPopup } from '@sections/experience/ExperienceDetailPopup';

import ExperienceRepository from '../repositories/experience.js';
import styles from './experience.module.css';
import { buildCls } from '../utils/cssUtil';
import { useResponsive } from '../hooks/useResponsive';
import { Icon } from '@components/shared/icon/Icon';
import { useConfigStore } from '../stores/configStore';
import { useExperienceFocusStore } from '../stores/experienceFocusStore';
import { useA11y } from '../hooks/useA11y';

const LONG_PRESS_MS = 2000;
const LONG_PRESS_SCROLL_THRESHOLD_PX = 10;
const ENTER_KEYS = new Set(['Enter', ' ']);

export function Experience() {
  const a11y = useA11y();
  const { type: breakpointType, isMobile, a11yCardSuffix } = useResponsive();
  const language = useConfigStore((s) => s.language);
  const experienceIdToFocus = useExperienceFocusStore((s) => s.experienceIdToFocus);
  const clearExperienceIdToFocus = useExperienceFocusStore((s) => s.clearExperienceIdToFocus);
  const [experiences, setExperiences] = useState([]);
  const [hidden, setHidden] = useState([true]);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const [popupExperience, setPopupExperience] = useState(null);
  const [mobileHoveredCardIndex, setMobileHoveredCardIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const experienceReturnFocusRef = useRef(null);
  const idleSnapTimeoutRef = useRef(null);
  const longPressFiredRef = useRef(false);
  const longPressTimerRef = useRef(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const touchWasScrollRef = useRef(false);

  const centerCardInView = (card) => {
    const container = scrollContainerRef.current;
    if (!container || !card) return;

    const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  };
  const isAutoAdjustingRef = useRef(false);
  const moveFocusBy = (delta) => {
    if (experiences.length === 0) return;
    const nextIndex = Math.min(
      experiences.length - 1,
      Math.max(0, focusedCardIndex + delta)
    );
    setFocusedCardIndex(nextIndex);
    centerCardInView(cardRefs.current[nextIndex]);
  };
  const hasPrev = focusedCardIndex > 0;
  const hasNext = focusedCardIndex < experiences.length - 1;

  const getCardAriaLabel = (experience) => {
    return a11y(`experience.card${a11yCardSuffix}`, {
      company: experience.company,
      position: experience.position,
    });
  };

  const openPopup = (experience, index) => {
    experienceReturnFocusRef.current = cardRefs.current[index];
    setPopupExperience(experience);
  };

  const focusCard = (index) => {
    setFocusedCardIndex(index);
    centerCardInView(cardRefs.current[index]);
  };

  const clearLongPressTimer = () => {
    if (!longPressTimerRef.current) return;
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const startLongPressTimer = (experience, index) => {
    clearLongPressTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null;
      longPressFiredRef.current = true;
      setMobileHoveredCardIndex(null);
      openPopup(experience, index);
    }, LONG_PRESS_MS);
  };

  const handleCardTouchStart = (experience, index) => (e) => {
    if (!isMobile) return;
    longPressFiredRef.current = false;
    touchWasScrollRef.current = false;
    const t = e.touches?.[0];
    if (t) touchStartPosRef.current = { x: t.clientX, y: t.clientY };
    startLongPressTimer(experience, index);
  };

  const handleCardTouchMove = () => (e) => {
    if (!isMobile) return;
    const t = e.touches?.[0];
    if (!t) return;
    const dx = t.clientX - touchStartPosRef.current.x;
    const dy = t.clientY - touchStartPosRef.current.y;
    if (Math.hypot(dx, dy) <= LONG_PRESS_SCROLL_THRESHOLD_PX) return;
    touchWasScrollRef.current = true;
    clearLongPressTimer();
  };

  const handleCardTouchEnd = () => () => clearLongPressTimer();
  const handleCardTouchCancel = () => () => clearLongPressTimer();

  const handleCardClick = (experience, index) => () => {
    if (isMobile && longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }

    if (!isMobile) {
      focusCard(index);
      openPopup(experience, index);
      return;
    }

    if (touchWasScrollRef.current) {
      touchWasScrollRef.current = false;
      setFocusedCardIndex(index);
      return;
    }

    if (mobileHoveredCardIndex === index) {
      openPopup(experience, index);
      setMobileHoveredCardIndex(null);
      return;
    }

    setMobileHoveredCardIndex(index);
    focusCard(index);
  };

  const handleCardKeyDown = (experience, index) => (e) => {
    if (!ENTER_KEYS.has(e.key)) return;
    e.preventDefault();
    openPopup(experience, index);
    if (isMobile && mobileHoveredCardIndex === index) setMobileHoveredCardIndex(null);
  };

  const getNearestCardIndex = (container) => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return { index: 0, distance: Number.POSITIVE_INFINITY, cards };

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - centerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = idx;
      }
    });

    return { index: nearestIndex, distance: nearestDistance, cards };
  };

  const focusNearestCardInContainer = (container) => {
    const { index, distance, cards } = getNearestCardIndex(container);
    setFocusedCardIndex(index);
    if (distance < 8) return;
    const targetCard = cards[index];
    if (!targetCard) return;

    const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
    isAutoAdjustingRef.current = true;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setTimeout(() => {
      isAutoAdjustingRef.current = false;
    }, 260);
  };

  const updateCardsOpacity = (container) => {
    if (isMobile) {
      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95;
      const opacity = inView ? 1 : 0;
      cardRefs.current.forEach((card) => {
        if (card) card.style.opacity = opacity;
      });
      setHidden(!inView);
      return;
    }

    const windowHeight = window.innerHeight;
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top;
      const startFade = windowHeight * 0.7;
      const endFade = windowHeight * 0.5;
      let opacity = 0;
      if (cardTop <= endFade) { opacity = 1; setHidden(false); }
      if (cardTop > startFade) { opacity = 0; setHidden(true); }
      if (cardTop > endFade && cardTop <= startFade)
        opacity = 1 - (cardTop - endFade) / (startFade - endFade);
      card.style.opacity = opacity;
    });
  };

  useEffect(() => {
    return () => clearLongPressTimer();
  }, []);

  useEffect(() => {
    const repository = new ExperienceRepository();

    const fetchData = async () => {
      await repository.load(language || 'en');
      setExperiences(repository.all);
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateCardsOpacity(container);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [experiences, breakpointType]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || experiences.length === 0) return;

    const handleHorizontalScroll = () => {
      if (isAutoAdjustingRef.current) return;
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
      idleSnapTimeoutRef.current = setTimeout(() => focusNearestCardInContainer(container), 140);
    };

    const initialTimer = setTimeout(() => focusNearestCardInContainer(container), 60);
    container.addEventListener('scroll', handleHorizontalScroll, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      container.removeEventListener('scroll', handleHorizontalScroll);
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
    };
  }, [experiences, breakpointType]);

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
      }, 400);
    }
    else clearExperienceIdToFocus();
  }, [experienceIdToFocus, experiences, clearExperienceIdToFocus]);

  useEffect(() => {
    if (!isMobile) return;
    const clearHoverIfOutside = (e) => {
      const container = scrollContainerRef.current;
      if (!container || container.contains(e.target)) return;
      setMobileHoveredCardIndex(null);
    };
    document.addEventListener('touchstart', clearHoverIfOutside, true);
    document.addEventListener('mousedown', clearHoverIfOutside, true);
    return () => {
      document.removeEventListener('touchstart', clearHoverIfOutside, true);
      document.removeEventListener('mousedown', clearHoverIfOutside, true);
    };
  }, [isMobile]);

  return (
    <div className={styles.experienceSection} data-breakpoint={breakpointType}>
      <div className="columnContainer">
        <div className={buildCls(styles.experienceHeader, hidden && styles.hidden)}>
          <Header text="Experience" align="center" className={styles.experienceHeaderTitle} />
        </div>
        <div className={styles.experienceContainer}>
          <div
            className="stackContainer"
            style={{
              '--stack-height': 'calc(100vw / var(--experience-pano-ratio))',
              '--stack-z-0': 0,
              '--stack-z-1': 1,
            }}
          >
            <div className="stackItem">
              <ExperiencePano />
            </div>
            <div className="stackItem">
              <div className={styles.experienceScrollContainer} ref={scrollContainerRef}>
                <div className={styles.experienceScroll}>
                  {!isMobile && (
                    <>
                      <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true" />
                      <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true" />
                    </>
                  )}
                  {experiences.map((experience, index) => (
                    <div
                      key={experience.id ?? index}
                      data-interactive-card="experience"
                      className={buildCls(styles.experienceCard, focusedCardIndex === index && styles.focused)}
                      ref={(el) => (cardRefs.current[index] = el)}
                      onTouchStart={handleCardTouchStart(experience, index)}
                      onTouchMove={handleCardTouchMove()}
                      onTouchEnd={handleCardTouchEnd()}
                      onTouchCancel={handleCardTouchCancel()}
                      onClick={handleCardClick(experience, index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={handleCardKeyDown(experience, index)}
                      aria-label={getCardAriaLabel(experience)}
                    >
                      <ExperienceCard
                        experience={experience}
                        mobileHovered={isMobile && mobileHoveredCardIndex === index}
                      />
                    </div>
                  ))}
                  {!isMobile && (
                    <>
                      <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true" />
                      <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={buildCls(styles.experienceNav, hidden && styles.navHidden)}>
            {hasPrev && (
              <button
                className={buildCls(styles.experienceNavBtn, styles.navBtnLeft)}
                aria-label={a11y('experience.prev')}
                onClick={() => moveFocusBy(-1)}
              >
                <Icon name="angle-left" aria-hidden />
              </button>
            )}
            {hasNext && (
              <button
                className={buildCls(styles.experienceNavBtn, styles.navBtnRight)}
                aria-label={a11y('experience.next')}
                onClick={() => moveFocusBy(1)}
              >
                <Icon name="angle-right" aria-hidden />
              </button>
            )}
          </div>
        </div>
        {popupExperience &&
          createPortal(
            <ExperienceDetailPopup
              experience={popupExperience}
              onClose={() => setPopupExperience(null)}
              returnFocusRef={experienceReturnFocusRef}
            />,
            document.body
          )}
      </div>
    </div>
  );
}