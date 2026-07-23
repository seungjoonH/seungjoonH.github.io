// ExperienceModel을 ExperienceSlotCard 슬롯에 매핑하는 Feature 카드
import type { ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import { useResponsive } from '@hooks/useResponsive';
import { ExperienceSlotCard } from '@components/composed/card/ExperienceSlotCard';
import { TwoLineText } from '@components/composed/text/TwoLineText';
import { ExperienceThumbnail } from '@sections/experience/ExperienceThumbnail';
import { GotoProjects } from '@sections/experience/GotoProjects';
import { formatExperienceDateShort } from '@utils/dateFormat';
import ExperienceModel from '@models/experience';
import styles from '@components/composed/card/experienceSlotCard.module.css';

interface ExperienceCardProps {
  experience: ExperienceModel;
  mobileHovered?: boolean;
}

export function ExperienceCard({ experience, mobileHovered = false }: ExperienceCardProps): ReactNode {
  const a11y = useA11y();
  const { isMobile } = useResponsive();
  const imageUrl = experience.getImageUrl();
  const sections = experience.sections;
  const hasProjectShortcut = experience.hasProjectShortcut;

  return (
    <ExperienceSlotCard
      mobileHovered={mobileHovered}
      media={
        <ExperienceThumbnail
          experienceId={experience.id ?? ''}
          imageUrl={imageUrl}
        />
      }
      title={experience.company}
      meta={
        <>
          <span className={styles.position}>{experience.position}</span>
          <span className={styles.duration}>
            {formatExperienceDateShort(experience.startDate)} ~ {formatExperienceDateShort(experience.endDate)}
          </span>
        </>
      }
      content={
        sections.length > 0 ? (
          <ul className={styles.sectionTitles} aria-label={a11y('experience.sectionList')}>
            {sections.slice(0, 3).map((sec, i) => {
              const title = sec.title ?? '';
              return (
                <li key={i} title={title}>
                  <TwoLineText text={title} forceSingleLine={isMobile} />
                </li>
              );
            })}
          </ul>
        ) : null
      }
      footer={
        hasProjectShortcut ? (
          <GotoProjects projectSearchQuery={experience.projectSearchQuery} />
        ) : null
      }
    />
  );
}
