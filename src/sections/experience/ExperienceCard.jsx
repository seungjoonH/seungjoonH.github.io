import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../../hooks/useA11y';
import { Icon, SvgIcon } from '@components/shared/icon/Icon';
import { buildCls } from '../../utils/cssUtil';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { formatExperienceDateShort } from '../../utils/dateFormat';
import styles from './experienceCard.module.css';

const EXPERIENCE_PLACEHOLDER_SRC = '/assets/images/experience-placeholder.svg';

const DefaultImage = () => (
  <div className={styles.placeholderImage} aria-hidden="true">
    <img src={EXPERIENCE_PLACEHOLDER_SRC} alt="" className={styles.placeholderGraphic} />
  </div>
);

export function ExperienceCard({ experience, mobileHovered = false }) {
  const { t } = useTranslation();
  const a11y = useA11y();
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

  const handleProjectShortcutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (projectSearchQuery) setQueryFromShortcut(projectSearchQuery);
    const el = document.getElementById('project');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cardCls = buildCls(styles.card, mobileHovered && styles.mobileHovered);
  const thumbWrapCls = buildCls(styles.experienceThumbWrap, hoveredReady && styles.hasHovered);

  return (
    <div className={cardCls}>
      <div className="columnContainer">
        {showSvg ? (
          <div className={thumbWrapCls}>
            <span className={styles.experienceThumbDefault}>
              <span className={styles.experienceThumbSvg}>
                <SvgIcon
                  src={imageUrl}
                  onError={() => setImageError(true)}
                  alt={a11y('experience.logo', { company: experience.company })}
                />
              </span>
            </span>
            {hoveredUrl && (
              <span className={styles.experienceThumbHovered} aria-hidden="true">
                <span className={styles.experienceThumbSvg}>
                  <SvgIcon
                    src={hoveredUrl}
                    onLoad={() => setHoveredReady(true)}
                    alt=""
                  />
                </span>
              </span>
            )}
          </div>
        ) : showImg ? (
          <img
            src={imageUrl}
            alt={a11y('experience.logo', { company: experience.company })}
            onError={() => setImageError(true)}
          />
        ) : (
          <DefaultImage />
        )}
        <div className={styles.content}>
          <div className={styles.company}>{experience.company}</div>
          <div className={styles.positionRow}>
            <span className={styles.position}>{experience.position}</span>
            <span className={styles.duration}>{formatExperienceDateShort(experience.startDate)} ~ {formatExperienceDateShort(experience.endDate)}</span>
          </div>
          {sections.length > 0 && (
            <ul className={styles.sectionTitles} aria-label={a11y('experience.sectionList')}>
              {sections.map((sec, i) => (
                <li key={i} title={sec.title}>{sec.title}</li>
              ))}
            </ul>
          )}
        </div>
        {hasProjectShortcut && (
          <a
            href="#project"
            className={styles.shortcutLink}
            onClick={handleProjectShortcutClick}
            aria-label={a11y('experience.toProjects')}
          >
            <span className={styles.shortcutText}>{t('experience.toProjectLink')}</span>
            <div className={styles.iconWrapper}>
              <span className={styles.shortcutIcon} aria-hidden="true">
                <Icon name="angle-right" />
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}