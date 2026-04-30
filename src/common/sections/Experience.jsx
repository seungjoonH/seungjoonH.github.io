import { useState, useRef, useEffect } from 'react';
import styles from './experience.module.css';
import { buildCls } from '../../utils/cssUtil';
import { useResponsive } from '../../hooks/useResponsive';
import { useConfigStore } from '../../stores/configStore';
import { useExperienceFocusStore } from '../../stores/experienceFocusStore';
import { useA11y } from '../../hooks/useA11y';
import { useVersionHash } from '../../versioning/VersionContext.jsx';
import { useAnalytics } from '../../hooks/useAnalytics.js';
import { useExperienceData } from './experience/useExperienceData';
import { useExperienceLongPress } from './experience/useExperienceLongPress';
import { useExperienceScroll } from './experience/useExperienceScroll';
import {
  ExperienceSectionHeader,
  ExperienceStackSection,
  ExperienceSectionNav,
  ExperiencePopupPortal,
} from './experience/ExperienceSectionView';

const FOCUS_RESET_MS = 400;
const ENTER_KEYS = new Set(['Enter', ' ']);

export function Experience() {
  const a11y = useA11y();
  const { type: breakpointType, isMobile, a11yCardSuffix } = useResponsive();
  const language = useConfigStore((s) => s.language);
  const { trackExperienceClick } = useAnalytics();
  const experienceIdToFocus = useExperienceFocusStore((s) => s.experienceIdToFocus);
  const clearExperienceIdToFocus = useExperienceFocusStore((s) => s.clearExperienceIdToFocus);

  const experiences = useExperienceData(language);
  const {
    scrollContainerRef,
    cardRefs,
    isAutoAdjustingRef,
    hidden,
    focusedCardIndex,
    setFocusedCardIndex,
    centerCardInView,
    moveFocusBy,
  } = useExperienceScroll(experiences, breakpointType, isMobile);

  const [popupExperience, setPopupExperience] = useState(null);
  const [mobileHoveredCardIndex, setMobileHoveredCardIndex] = useState(null);
  const experienceReturnFocusRef = useRef(null);

  const handleOpenPopup = (experience, index) => {
    experienceReturnFocusRef.current = cardRefs.current[index];
    setPopupExperience(experience);
  };

  const {
    longPressFiredRef,
    touchWasScrollRef,
    handleCardTouchStart,
    handleCardTouchMove,
    handleCardTouchEnd,
    handleCardTouchCancel,
  } = useExperienceLongPress(isMobile, (experience, index) => {
    setMobileHoveredCardIndex(null);
    handleOpenPopup(experience, index);
  });

  const handleFocusCard = (index) => {
    setFocusedCardIndex(index);
    centerCardInView(cardRefs.current[index]);
  };

  const handleCardClick = (experience, index) => () => {
    if (isMobile && longPressFiredRef.current) {
      longPressFiredRef.current = false;
      return;
    }
    if (!isMobile) {
      trackExperienceClick(experience?.id);
      handleFocusCard(index);
      handleOpenPopup(experience, index);
      return;
    }
    if (touchWasScrollRef.current) {
      touchWasScrollRef.current = false;
      setFocusedCardIndex(index);
      return;
    }
    if (mobileHoveredCardIndex === index) {
      trackExperienceClick(experience?.id);
      handleOpenPopup(experience, index);
      setMobileHoveredCardIndex(null);
      return;
    }
    trackExperienceClick(experience?.id);
    setMobileHoveredCardIndex(index);
    handleFocusCard(index);
  };

  const handleCardKeyDown = (experience, index) => (e) => {
    if (!ENTER_KEYS.has(e.key)) return;
    e.preventDefault();
    trackExperienceClick(experience?.id);
    handleOpenPopup(experience, index);
    if (isMobile && mobileHoveredCardIndex === index) setMobileHoveredCardIndex(null);
  };

  const getCardAriaLabel = (experience) => a11y(`experience.card${a11yCardSuffix}`, {
    company: experience.company,
    position: experience.position,
  });

  useEffect(() => {
    if (!experienceIdToFocus || experiences.length === 0) return;
    const index = experiences.findIndex((e) => e.id === experienceIdToFocus);
    if (index < 0) return clearExperienceIdToFocus();
    const card = cardRefs.current[index];
    setFocusedCardIndex(index);
    if (card) {
      isAutoAdjustingRef.current = true;
      centerCardInView(card);
      setTimeout(() => { isAutoAdjustingRef.current = false; clearExperienceIdToFocus(); }, FOCUS_RESET_MS);
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

  const hasPrev = focusedCardIndex > 0;
  const hasNext = focusedCardIndex < experiences.length - 1;
  const headerCls = buildCls(styles.experienceHeader, hidden && styles.hidden);
  const ghostCardCls = buildCls(styles.experienceCard, styles.ghost);
  const navCls = buildCls(styles.experienceNav, hidden && styles.navHidden);
  const navLeftCls = buildCls(styles.experienceNavBtn, styles.navBtnLeft);
  const navRightCls = buildCls(styles.experienceNavBtn, styles.navBtnRight);

  return (
    <div className={styles.experienceSection} data-breakpoint={breakpointType}>
      <div className="columnContainer">
        <ExperienceSectionHeader headerCls={headerCls} />
        <div className={styles.experienceContainer}>
          <ExperienceStackSection
            scrollContainerRef={scrollContainerRef}
            experiences={experiences}
            isMobile={isMobile}
            ghostCardCls={ghostCardCls}
            cardRefs={cardRefs}
            focusedCardIndex={focusedCardIndex}
            mobileHoveredCardIndex={mobileHoveredCardIndex}
            handleCardTouchStart={handleCardTouchStart}
            handleCardTouchMove={handleCardTouchMove}
            handleCardTouchEnd={handleCardTouchEnd}
            handleCardTouchCancel={handleCardTouchCancel}
            handleCardClick={handleCardClick}
            handleCardKeyDown={handleCardKeyDown}
            getCardAriaLabel={getCardAriaLabel}
          />
          <ExperienceSectionNav
            navCls={navCls}
            navLeftCls={navLeftCls}
            navRightCls={navRightCls}
            hasPrev={hasPrev}
            hasNext={hasNext}
            moveFocusBy={moveFocusBy}
            a11y={a11y}
          />
        </div>
        <ExperiencePopupPortal
          popupExperience={popupExperience}
          onClose={() => setPopupExperience(null)}
          returnFocusRef={experienceReturnFocusRef}
        />
      </div>
    </div>
  );
}

export default Experience;
