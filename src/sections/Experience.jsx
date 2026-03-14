import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Header } from '@components/layout/Header';
import { ExperienceCard } from '@sections/experience/ExperienceCard';
import { ExperiencePano } from '@sections/experience/ExperiencePano';
import { ExperienceDetailPopup } from '@sections/experience/ExperienceDetailPopup';

import ExperienceRepository from '../repositories/experience.js';
import styles from './experience.module.css';
import { buildCls } from '../utils/cssUtil';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Icon } from '@components/shared/icon/Icon';
import { useConfigStore } from '../stores/configStore';
import { useExperienceFocusStore } from '../stores/experienceFocusStore';

export function Experience() {
  const { type: breakpointType } = useBreakpoint();
  const language = useConfigStore((s) => s.language);
  const experienceIdToFocus = useExperienceFocusStore((s) => s.experienceIdToFocus);
  const clearExperienceIdToFocus = useExperienceFocusStore((s) => s.clearExperienceIdToFocus);
  const [experiences, setExperiences] = useState([]);
  const [hidden, setHidden] = useState([true]);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const [popupExperience, setPopupExperience] = useState(null);
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const experienceReturnFocusRef = useRef(null);
  const idleSnapTimeoutRef = useRef(null);

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

  useEffect(() => {
    const repository = new ExperienceRepository();

    const fetchData = async () => {
      await repository.load(language || 'en');
      setExperiences(repository.all);
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const windowHeight = window.innerHeight;

      cardRefs.current.forEach((card) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top;

        const startFade = windowHeight * 0.7; 
        const endFade = windowHeight * 0.5;
        let opacity = 0;

        if (cardTop <= endFade) { opacity = 1; setHidden(false); }
        else if (cardTop > startFade) { opacity = 0; setHidden(true); }
        else opacity = 1 - (cardTop - endFade) / (startFade - endFade);
        card.style.opacity = opacity;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [experiences]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || experiences.length === 0) return;

    const focusNearestCard = () => {
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - centerX);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setFocusedCardIndex(nearestIndex);

      if (nearestDistance < 8) return;

      const targetCard = cards[nearestIndex];
      if (!targetCard) return;
      const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;

      isAutoAdjustingRef.current = true;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      setTimeout(() => { isAutoAdjustingRef.current = false; }, 260);
    };

    const handleHorizontalScroll = () => {
      if (isAutoAdjustingRef.current) return;
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
      idleSnapTimeoutRef.current = setTimeout(focusNearestCard, 140);
    };

    const initialTimer = setTimeout(focusNearestCard, 60);
    container.addEventListener('scroll', handleHorizontalScroll, { passive: true });

    return () => {
      clearTimeout(initialTimer);
      container.removeEventListener('scroll', handleHorizontalScroll);
      if (idleSnapTimeoutRef.current) clearTimeout(idleSnapTimeoutRef.current);
    };
  }, [experiences]);

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
    } else clearExperienceIdToFocus();
  }, [experienceIdToFocus, experiences, clearExperienceIdToFocus]);

  return (
    <div className={styles.experienceSection} data-breakpoint={breakpointType}>
      <div className="columnContainer">
      <div className={buildCls(styles.experienceHeader, hidden && styles.hidden)}>
        <Header text="Experience" align="center" className={styles.experienceHeaderTitle} />
      </div>
      <div className={styles.experienceContainer}>
        <div className="stackContainer" style={{ '--stack-height': 'calc(100vw / var(--experience-pano-ratio))', '--stack-z-0': 0, '--stack-z-1': 1 }}>
          <div className="stackItem"><ExperiencePano /></div>
          <div className="stackItem">
          <div className={styles.experienceScrollContainer} ref={scrollContainerRef}>
            <div className={styles.experienceScroll}>
              <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true"></div>
              <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true"></div>
              {experiences.map((experience, index) => (
                <div
                key={experience.id ?? index}
                data-interactive-card="experience"
                className={buildCls(styles.experienceCard, focusedCardIndex === index && styles.focused)}
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => {
                  setFocusedCardIndex(index);
                  centerCardInView(cardRefs.current[index]);
                  experienceReturnFocusRef.current = cardRefs.current[index];
                  setPopupExperience(experience);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setPopupExperience(experience);
                  }
                }}
                aria-label={`${experience.company}, ${experience.position}. 세부 정보 보기`}
                >
                  <ExperienceCard experience={experience} />
                </div>
              ))}
              <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true"></div>
              <div className={buildCls(styles.experienceCard, styles.ghost)} aria-hidden="true"></div>
            </div>
          </div>
          </div>
        </div>
        <div className={buildCls(styles.experienceNav, hidden && styles.navHidden)}>
          {hasPrev ? (
            <button
              className={buildCls(styles.experienceNavBtn, styles.navBtnLeft)}
              aria-label="Previous experience"
              onClick={() => moveFocusBy(-1)}
            >
              <Icon name="angle-left" />
            </button>
          ) : null}
          {hasNext ? (
            <button
              className={buildCls(styles.experienceNavBtn, styles.navBtnRight)}
              aria-label="Next experience"
              onClick={() => moveFocusBy(1)}
            >
              <Icon name="angle-right" />
            </button>
          ) : null}
</div>
        </div>
      </div>
      {popupExperience && createPortal(
        <ExperienceDetailPopup
          experience={popupExperience}
          onClose={() => setPopupExperience(null)}
          returnFocusRef={experienceReturnFocusRef}
        />,
        document.body
      )}
    </div>
  );
}