import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/shared/icon/Icon';
import { buildCls } from '../../utils/cssUtil';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { formatExperienceDateShort } from '../../utils/dateFormat';
import styles from './experienceCard.module.css';

const DefaultImage = () => (
  <div className={styles.placeholderImage} aria-hidden="true">
    <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="40" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M14 6V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M8 12h8M8 16h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  </div>
);

export function ExperienceCard({ experience, mobileHovered = false }) {
  const { t } = useTranslation();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const [imageError, setImageError] = useState(false);
  const [hoveredReady, setHoveredReady] = useState(false);
  const imageUrl = experience.getImageUrl();
  const hoveredUrl = imageUrl && imageUrl.toLowerCase().endsWith('.svg')
    ? imageUrl.replace(/\.svg$/i, '-hovered.svg')
    : null;
  useEffect(() => setImageError(false), [experience.id]);
  useEffect(() => setHoveredReady(false), [experience.id]);
  const showSvg = imageUrl && !imageError && imageUrl.toLowerCase().endsWith('.svg');
  const showImg = imageUrl && !imageError && !showSvg;
  const sections = experience.sections;
  const projectSearchQuery = experience.projectSearchQuery;
  const hasProjectShortcut = experience.hasProjectShortcut;

  return (
    <div className={buildCls(styles.card, mobileHovered && styles.mobileHovered)}>
      <div className="columnContainer">
        {showSvg ? (
          <div className={buildCls(styles.experienceThumbWrap, hoveredReady && styles.hasHovered)}>
            <span className={styles.experienceThumbDefault}>
              <Icon src={imageUrl} className={styles.experienceThumbSvg} onError={() => setImageError(true)} alt="" />
            </span>
            {hoveredUrl ? (
              <span className={styles.experienceThumbHovered} aria-hidden="true">
                <Icon
                  src={hoveredUrl}
                  className={styles.experienceThumbSvg}
                  onLoad={() => setHoveredReady(true)}
                  alt=""
                />
              </span>
            ) : null}
          </div>
        ) : showImg ? (
          <img src={imageUrl} alt="" onError={() => setImageError(true)} />
        ) : (
          <DefaultImage />
        )}
        <div className={styles.content}>
          <div className={styles.company}>{experience.company}</div>
          <div className={styles.positionRow}>
            <span className={styles.position}>{experience.position}</span>
            <span className={styles.duration}>{formatExperienceDateShort(experience.startDate)} ~ {formatExperienceDateShort(experience.endDate)}</span>
          </div>
          {sections.length > 0 ? (
            <ul className={styles.sectionTitles} aria-label={t('experience.sectionTitles', '관련 섹션')}>
              {sections.map((sec, i) => (
                <li key={i} title={sec.title}>{sec.title}</li>
              ))}
            </ul>
          ) : null}
        </div>
        {hasProjectShortcut ? (
          <a
            href="#project"
            className={styles.shortcutLink}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (projectSearchQuery) setQueryFromShortcut(projectSearchQuery);
              const el = document.getElementById('project');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            aria-label={t('experience.toProject', '프로젝트 바로가기')}
          >
            <span className={styles.shortcutText}>{t('experience.toProject', '프로젝트 바로가기')}</span>
            <div className={styles.iconWrapper}>
              <Icon name="angle-right" className={styles.shortcutIcon} aria-hidden="true" />
            </div>
          </a>
        ) : null}
      </div>
    </div>
  );
}