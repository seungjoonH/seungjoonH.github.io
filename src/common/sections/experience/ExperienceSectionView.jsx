import { createPortal } from 'react-dom';
import { Header } from '@components/layout/Header';
import { ExperienceCard } from './ExperienceCard';
import { ExperiencePano } from './ExperiencePano';
import { ExperienceDetailPopup } from './ExperienceDetailPopup';
import { Icon } from '@components/shared/icon/Icon';
import { buildCls } from '../../../utils/cssUtil';
import styles from '../experience.module.css';

const EXPERIENCE_STACK_STYLE = {
  '--stack-height': 'calc(100vw / var(--experience-pano-ratio))',
  '--stack-z-0': 0,
  '--stack-z-1': 1,
};

export function ExperienceSectionHeader({ headerCls }) {
  return (
    <div className={headerCls}>
      <div className={styles.experienceHeaderTitle}>
        <Header text="Experience" align="center" />
      </div>
    </div>
  );
}

export function ExperienceStackSection({
  scrollContainerRef,
  experiences,
  isMobile,
  ghostCardCls,
  cardRefs,
  focusedCardIndex,
  mobileHoveredCardIndex,
  handleCardTouchStart,
  handleCardTouchMove,
  handleCardTouchEnd,
  handleCardTouchCancel,
  handleCardClick,
  handleCardKeyDown,
  getCardAriaLabel,
}) {
  return (
    <div className="stackContainer" style={EXPERIENCE_STACK_STYLE}>
      <div className="stackItem">
        <ExperiencePano />
      </div>
      <div className="stackItem">
        <div className={styles.experienceScrollContainer} ref={scrollContainerRef}>
          <div className={styles.experienceScroll}>
            {!isMobile && (
              <>
                <div className={ghostCardCls} aria-hidden="true" />
                <div className={ghostCardCls} aria-hidden="true" />
              </>
            )}
            {experiences.map((experience, index) => {
              const cardCls = buildCls(styles.experienceCard, focusedCardIndex === index && styles.focused);
              return (
                <div
                  key={experience.id ?? index}
                  data-interactive-card="experience"
                  className={cardCls}
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
              );
            })}
            {!isMobile && (
              <>
                <div className={ghostCardCls} aria-hidden="true" />
                <div className={ghostCardCls} aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceSectionNav({
  navCls,
  navLeftCls,
  navRightCls,
  hasPrev,
  hasNext,
  moveFocusBy,
  a11y,
}) {
  return (
    <div className={navCls}>
      {hasPrev && (
        <button
          type="button"
          className={navLeftCls}
          aria-label={a11y('experience.prev')}
          onClick={() => moveFocusBy(-1)}
        >
          <Icon name="angle-left" aria-hidden />
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          className={navRightCls}
          aria-label={a11y('experience.next')}
          onClick={() => moveFocusBy(1)}
        >
          <Icon name="angle-right" aria-hidden />
        </button>
      )}
    </div>
  );
}

export function ExperiencePopupPortal({ popupExperience, onClose, returnFocusRef }) {
  if (!popupExperience) return null;
  return createPortal(
    <ExperienceDetailPopup
      experience={popupExperience}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    />,
    document.body
  );
}
