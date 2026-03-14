import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './projectCard.module.css';
import { ProjectDetailPopup } from './ProjectDetailPopup';
import { ProjectDetailContent } from './ProjectDetailContent';
import { Icon } from '@components/shared/icon/Icon';
import { toHashTag } from './utils/tagUtil';
import { buildCls } from '../../utils/cssUtil';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { parseQuery } from './search/parseQuery';
import { normalizeStackToken } from './search/stackMapping';
import { getHighlightTerms, getTagsToHighlight, getEffectiveTagsSorted, getEffectiveStacksSorted, highlightText } from './search/highlight';

export function ProjectCard({ project, showAll = false }) {
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const parsedClauses = useMemo(
    () => (rawQuery ? parseQuery(String(rawQuery).trim(), normalizeStackToken) : []),
    [rawQuery]
  );
  const { titleTerms, stackTerms } = useMemo(
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

  const [thumbnailError, setThumbnailError] = useState(false);
  useEffect(() => setThumbnailError(false), [project.coverImage]);

  const showThumbnail = project.coverImage && !thumbnailError;

  const [popupOpen, setPopupOpen] = useState(false);
  const cardRef = useRef(null);

  const frontTagsWrapRef = useRef(null);
  const [frontTagsOverflow, setFrontTagsOverflow] = useState(false);
  const frontTagsList = effectiveTags.tags;
  useEffect(() => {
    const el = frontTagsWrapRef.current;
    if (!el || frontTagsList.length === 0) return;
    const scroll = el.firstElementChild;
    if (!scroll) return;
    const check = () => {
      if (!el.firstElementChild) return;
      const contentW = el.firstElementChild.scrollWidth;
      const visibleW = el.clientWidth;
      setFrontTagsOverflow(contentW > visibleW);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frontTagsList.length, project.id]);

  return (
    <>
      <div
        ref={cardRef}
        data-interactive-card="project"
        className={buildCls(styles.card, popupOpen && styles.flipped)}
        aria-label={`${project.title}, 클릭 시 상세 팝업`}
        onClick={() => setPopupOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setPopupOpen(true);
          }
        }}
      >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          {showAll && project.hidden ? (
            <span className={styles.hiddenBadge} aria-hidden="true">
              <Icon name="eye-open" />
            </span>
          ) : null}
          <div className={styles.thumbnailWrap}>
            {showThumbnail ? (
              project.coverImage.toLowerCase().endsWith('.svg') ? (
                <Icon
                  src={project.coverImage}
                  className={styles.thumbnail}
                  onError={() => setThumbnailError(true)}
                  alt=""
                />
              ) : (
                <img
                  src={project.coverImage}
                  alt=""
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
            <div
              ref={frontTagsWrapRef}
              className={buildCls(styles.tagsWrap, styles.frontTagsWrap, frontTagsOverflow && styles.tagsOverflow)}
              aria-hidden={frontTagsOverflow}
            >
              <div className={styles.tagsScroll}>
                {effectiveTags.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={styles.tagButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQueryFromShortcut(`#${tag}`);
                    }}
                    aria-label={`태그 ${tag}로 검색`}
                  >
                    {effectiveTags.tagsToHighlight.includes(tag) ? (
                      <mark className={styles.highlight}>{toHashTag(tag)}</mark>
                    ) : (
                      toHashTag(tag)
                    )}
                  </button>
                ))}
                {frontTagsOverflow && effectiveTags.tags.map((tag) => (
                  <button
                    key={`dup-${tag}`}
                    type="button"
                    className={styles.tagButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQueryFromShortcut(`#${tag}`);
                    }}
                    aria-label={`태그 ${tag}로 검색`}
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
            <div className={styles.languageLine}>
              <span className={styles.languageStacks}>
                {effectiveStacks.stacks.length > 0
                  ? effectiveStacks.stacks.map((stack, i) => (
                      <span key={stack}>
                        {i > 0 ? ' / ' : ''}
                        {stackTerms.length
                          ? highlightText(stack, stackTerms, styles.highlight)
                          : stack}
                      </span>
                    ))
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardBack}>
          <ProjectDetailContent project={project} variant="card" />
        </div>
      </div>
    </div>

      {popupOpen && createPortal(
        <ProjectDetailPopup
          project={project}
          onClose={() => {
            setPopupOpen(false);
            setTimeout(() => cardRef.current?.blur(), 0);
          }}
          returnFocusRef={cardRef}
        />,
        document.body
      )}
    </>
  );
}
