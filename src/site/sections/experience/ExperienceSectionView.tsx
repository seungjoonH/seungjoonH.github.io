// 경력 섹션 헤더·카드 스택·네비·모달 포털 서브뷰 컴포넌트
import { createPortal } from 'react-dom';
import { type RefObject, type TouchEvent, type KeyboardEvent, type Ref } from 'react';
import { Heading } from '@components/design/heading/Heading';
import { ExperienceCard } from './ExperienceCard';
import { ExperiencePano } from './ExperiencePano';
import { ExperienceDetailModal } from './ExperienceDetailModal';
import { Icon } from '@components/design/icon/Icon';
import { buildCls } from '@utils/cssUtil';
import { useResponsive } from '@hooks/useResponsive';
import ExperienceModel from '../../../models/experience';
import styles from '../experience.module.css';

interface ExperienceSectionHeaderProps {
  headerCls: string;
}

export function ExperienceSectionHeader({ headerCls }: ExperienceSectionHeaderProps) {
  return (
    <div className={headerCls}>
      <div className={styles.experienceHeaderTitle}>
        <Heading text="Experience" align="center" />
      </div>
    </div>
  );
}

interface ExperienceStackSectionProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  experiences: ExperienceModel[];
  ghostCardCls: string;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
  focusedCardIndex: number;
  mobileHoveredCardIndex: number | null;
  handleCardTouchStart: (experience: ExperienceModel, index: number) => (e: TouchEvent) => void;
  handleCardTouchMove: (e: TouchEvent) => void;
  handleCardTouchEnd: () => void;
  handleCardTouchCancel: () => void;
  handleCardClick: (experience: ExperienceModel, index: number) => () => void;
  handleCardKeyDown: (experience: ExperienceModel, index: number) => (e: KeyboardEvent) => void;
  getCardAriaLabel: (experience: ExperienceModel) => string;
}

export function ExperienceStackSection({
  scrollContainerRef,
  experiences,
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
}: ExperienceStackSectionProps) {
  const { isMobile } = useResponsive();
  return (
    <div className={buildCls('stackContainer', styles.experienceStack)}>
      <div className="stackItem">
        <ExperiencePano />
      </div>
      <div className="stackItem">
        <div className={styles.experienceScrollContainer} ref={scrollContainerRef as Ref<HTMLDivElement>}>
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
                  data-cursor-ring="experience"
                  className={cardCls}
                  ref={(el) => {
                    if (cardRefs.current) cardRefs.current[index] = el;
                  }}
                  onTouchStart={handleCardTouchStart(experience, index)}
                  onTouchMove={handleCardTouchMove}
                  onTouchEnd={handleCardTouchEnd}
                  onTouchCancel={handleCardTouchCancel}
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

interface ExperienceSectionNavProps {
  navCls: string;
  navLeftCls: string;
  navRightCls: string;
  hasPrev: boolean;
  hasNext: boolean;
  moveFocusBy: (delta: number) => void;
  a11y: (key: string, options?: Record<string, unknown>) => string;
}

export function ExperienceSectionNav({
  navCls,
  navLeftCls,
  navRightCls,
  hasPrev,
  hasNext,
  moveFocusBy,
  a11y,
}: ExperienceSectionNavProps) {
  return (
    <div className={navCls}>
      {hasPrev && (
        <button
          type="button"
          className={navLeftCls}
          aria-label={a11y('experience.prev')}
          onClick={() => moveFocusBy(-1)}
        >
          <span className={styles.experienceNavGlyph} aria-hidden="true">
            <Icon.Primary name="angle-left" embedded />
          </span>
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          className={navRightCls}
          aria-label={a11y('experience.next')}
          onClick={() => moveFocusBy(1)}
        >
          <span className={styles.experienceNavGlyph} aria-hidden="true">
            <Icon.Primary name="angle-right" embedded />
          </span>
        </button>
      )}
    </div>
  );
}

interface ExperienceModalPortalProps {
  modalExperience: ExperienceModel | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

export function ExperienceModalPortal({ modalExperience, onClose, returnFocusRef }: ExperienceModalPortalProps) {
  if (!modalExperience) return null;
  return createPortal(
    <ExperienceDetailModal
      experience={modalExperience}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
    />,
    document.body,
  );
}
