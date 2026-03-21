import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './projectCard.module.css';
import { ProjectDetailPopup } from './ProjectDetailPopup';
import { ProjectDetailContent } from './ProjectDetailContent';
import { Icon } from '@components/shared/icon/Icon';
import { toHashTag } from './utils/tagUtil';
import { buildCls } from '../../utils/cssUtil';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { useProjectCardFlipStore } from '../../stores/projectCardFlipStore';
import { useResponsive } from '../../hooks/useResponsive';
import { useConfigStore } from '../../stores/configStore';
import config from '../../config.js';
import { getMaxVisibleChips } from '../../utils/getMaxVisibleChips.js';
import { parseQuery } from './search/parseQuery';
import { normalizeStackToken, getStackIconName } from './search/stackMapping';
import { getHighlightTerms, getEffectiveTagsSorted, getEffectiveStacksSorted, highlightText } from './search/highlight';
import { isStackMatchedByQuery } from './search/filterProjects';
import { useStackChipsOverflow } from './useStackChipsOverflow';
import { useA11y } from '../../hooks/useA11y';
import { StatusChip } from './StatusChip';

export function ProjectCard({ project, showAll = false }) {
  const a11y = useA11y();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const appendShortcutToQuery = useProjectSearchStore((s) => s.appendShortcutToQuery);
  const { type: breakpointType, isMobile, a11yCardSuffix } = useResponsive();
  const typographyScale = useConfigStore((s) => s.typographyScale) ?? config.typography.scale;
  const { maxTags: maxVisibleTags, maxStacks: maxVisibleStacks } = getMaxVisibleChips(breakpointType, typographyScale);
  const flippedProjectId = useProjectCardFlipStore((s) => s.flippedProjectId);
  const setFlippedProjectId = useProjectCardFlipStore((s) => s.setFlippedProjectId);

  const parsedClauses = useMemo(
    () => (rawQuery ? parseQuery(String(rawQuery).trim(), normalizeStackToken) : []),
    [rawQuery]
  );
  const { titleTerms } = useMemo(
    () => getHighlightTerms(parsedClauses),
    [parsedClauses]
  );
  const effectiveTags = useMemo(
    () => getEffectiveTagsSorted(project.tags || [], project.tagNames || [], parsedClauses),
    [project.tags, project.tagNames, parsedClauses]
  );
  const effectiveStacks = useMemo(
    () => getEffectiveStacksSorted(project.techStacks || [], project.techStackNames || [], parsedClauses),
    [project.techStacks, project.techStackNames, parsedClauses]
  );
  const visibleStacks = effectiveStacks.stacks.slice(0, maxVisibleStacks);
  const { useEvenSplit, lineRef, chipsContainerRef } = useStackChipsOverflow(visibleStacks.length);

  const [thumbnailError, setThumbnailError] = useState(false);
  useEffect(() => setThumbnailError(false), [project.coverImage]);

  const showThumbnail = project.coverImage && !thumbnailError;

  const [popupOpen, setPopupOpen] = useState(false);
  const cardRef = useRef(null);

  const isFlipped = isMobile ? flippedProjectId === project.id : popupOpen;

  const handleCardClick = () => {
    if (!isMobile) return setPopupOpen(true);
    if (!isFlipped) return setFlippedProjectId(project.id);
    setPopupOpen(true);
    setFlippedProjectId(null);
  };

  return (
    <>
      <div
        ref={cardRef}
        data-interactive-card="project"
        className={buildCls(styles.card, isFlipped && styles.flipped)}
        aria-label={a11y(`project.card${a11yCardSuffix}`, { title: project.title || '' })}
        onClick={handleCardClick}
        onContextMenu={(e) => isMobile && e.preventDefault()}
      >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          {showAll && project.hidden && (
            <span className={styles.hiddenBadge} aria-hidden="true">
              <Icon name="eye-open" />
            </span>
          )}
          <div className={styles.thumbnailWrap}>
            {project.status ? (
              <span className={styles.thumbnailStatusChip}>
                <StatusChip status={project.status} variant="card" />
              </span>
            ) : null}
            {showThumbnail ? (
              project.coverImage.toLowerCase().endsWith('.svg') ? (
                <Icon
                  src={project.coverImage}
                  className={styles.thumbnail}
                  onError={() => setThumbnailError(true)}
                  alt={a11y('project.thumbnail', { title: project.title || 'project' })}
                />
              ) : (
                <img
                  src={project.coverImage}
                  alt={a11y('project.thumbnail', { title: project.title || 'project' })}
                  className={styles.thumbnail}
                  onError={() => setThumbnailError(true)}
                />
              )
            ) : (
              <span className={styles.thumbnailPlaceholder} aria-hidden="true">
                {project.title?.slice(0, 1) || '?'}
              </span>
            )}
          </div>

          <div className={styles.frontMeta}>
            <div className={styles.titleRow}>
              <h3>{titleTerms.length ? highlightText(project.title || '', titleTerms, styles.highlight) : (project.title || '')}</h3>
              <span>{project.yearLabel}</span>
            </div>
            <div className={buildCls(styles.tagsWrap, styles.frontTagsWrap)}>
              <div className={styles.tagsScroll}>
                {effectiveTags.tags.slice(0, maxVisibleTags).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={styles.tagButton}
                    onClick={(e) => (e.stopPropagation(), appendShortcutToQuery(`#${tag}`))}
                    aria-label={a11y('project.searchByTag', { tag })}
                  >
                    {effectiveTags.tagsToHighlight.includes(tag) ? (
                      <mark className={styles.highlight}>{toHashTag(tag)}</mark>
                    ) : (
                      toHashTag(tag)
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.languageLine} ref={lineRef}>
              {(() => {
                const visible = visibleStacks;
                const twoRows = useEvenSplit && visible.length >= 2;
                const row1 = twoRows ? visible.slice(0, Math.floor(visible.length / 2)) : visible;
                const row2 = twoRows ? visible.slice(Math.floor(visible.length / 2)) : [];
                const renderChip = (stack) => (
                  <button
                    key={stack}
                    type="button"
                    className={buildCls(styles.stackChip, isStackMatchedByQuery(stack, parsedClauses, normalizeStackToken) && styles.stackChipHighlighted)}
                    onClick={(e) => (e.stopPropagation(), appendShortcutToQuery(`stack:"${stack}"`))}
                    aria-label={a11y('project.searchByStack', { stack })}
                  >
                    {getStackIconName(stack) && (
                      <Icon name={getStackIconName(stack)} className={styles.stackChipIcon} aria-hidden />
                    )}
                    <span className={styles.stackChipText}>{stack}</span>
                  </button>
                );
                if (visible.length === 0) return <span className={styles.languageStacks}>-</span>;
                if (twoRows) {
                  return (
                    <span className={styles.languageStacksTwoRows}>
                      <span className={styles.languageStacksRow}>{row1.map(renderChip)}</span>
                      <span className={styles.languageStacksRow}>{row2.map(renderChip)}</span>
                    </span>
                  );
                }
                return (
                  <span ref={chipsContainerRef} className={styles.languageStacks}>
                    {row1.map(renderChip)}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        <div className={styles.cardBack}>
          <ProjectDetailContent project={project} variant="card" isMobile={isMobile} />
        </div>
      </div>
    </div>

      {popupOpen && createPortal(
        <ProjectDetailPopup
          project={project}
          onClose={() => setPopupOpen(false)}
          returnFocusRef={cardRef}
        />,
        document.body
      )}
    </>
  );
}
