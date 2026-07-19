// 경력 카드 스크롤·포커스·모달 인터랙션을 조율하는 Experience 섹션
import styles from './experience.module.css';
import { buildCls } from '@utils/cssUtil';
import { useResponsive } from '@hooks/useResponsive';
import { useA11y } from '@hooks/useA11y';
import { useExperienceData } from './experience/hooks/useExperienceData';
import { useExperienceSection } from './experience/hooks/useExperienceSection';
import {
  ExperienceSectionHeader,
  ExperienceStackSection,
  ExperienceSectionNav,
  ExperienceModalPortal,
} from './experience/ExperienceSectionView';

export function Experience() {
  const a11y = useA11y();
  const { type: breakpointType } = useResponsive();
  const experiences = useExperienceData();
  const {
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
    handleCardTouchEnd,
    handleCardTouchCancel,
    handleCardClick,
    handleCardKeyDown,
    getCardAriaLabel,
  } = useExperienceSection(experiences);

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
        <ExperienceModalPortal
          modalExperience={modalExperience}
          onClose={closeModal}
          returnFocusRef={returnFocusRef}
        />
      </div>
    </div>
  );
}

export default Experience;
