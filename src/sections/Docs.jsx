import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@components/layout/Header';
import { Icon } from '@components/shared/icon/Icon';
import { useDocs } from '../hooks/useDocs';
import { useProjectSearchStore } from '../stores/projectSearchStore';
import { useExperienceFocusStore } from '../stores/experienceFocusStore';
import styles from './docs.module.css';
import { buildCls } from '../utils/cssUtil';
import { useA11y } from '../hooks/useA11y';

const CATEGORIES = {
  notion:     { label: 'Notion',      icon: 'notion'   },
  githubWiki: { label: 'Github Wiki', icon: 'github'   },
  tistory:    { label: 'Tistory',     icon: 'tistory'  },
};

const HEADER_FADE_START  = 0.82;
const HEADER_FADE_END    = 0.50;
const CONTENT_FADE_START = 0.85;
const CONTENT_FADE_END   = 0.52;

function calcOpacity(rectTop, windowHeight, fadeStart, fadeEnd) {
  if (rectTop <= windowHeight * fadeEnd) return 1;
  if (rectTop >= windowHeight * fadeStart) return 0;
  return (windowHeight * fadeStart - rectTop) / (windowHeight * (fadeStart - fadeEnd));
}

export function Docs() {
  const a11y = useA11y();
  const docs = useDocs();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const setExperienceIdToFocus = useExperienceFocusStore((s) => s.setExperienceIdToFocus);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [expanded, setExpanded] = useState(() => ({ notion: true, githubWiki: false, tistory: false }));

  const categories = useMemo(
    () => Object.entries(CATEGORIES)
      .map(([key, { label, icon }]) => ({
        key,
        label,
        platformIcon: icon,
        items: Array.isArray(docs[key]) ? docs[key] : [],
      }))
      .filter((cat) => cat.items.length > 0),
    [docs]
  );

  useEffect(() => {
    const handleHeaderScroll = () => {
      const windowHeight = window.innerHeight;
      if (!sectionRef.current) return;
      const { top } = sectionRef.current.getBoundingClientRect();
      setHeaderOpacity(calcOpacity(top, windowHeight, HEADER_FADE_START, HEADER_FADE_END));
    };
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();
    return () => window.removeEventListener('scroll', handleHeaderScroll);
  }, []);

  useEffect(() => {
    const handleContentScroll = () => {
      const windowHeight = window.innerHeight;
      if (!contentRef.current) return;
      const { top } = contentRef.current.getBoundingClientRect();
      setContentOpacity(calcOpacity(top, windowHeight, CONTENT_FADE_START, CONTENT_FADE_END));
    };
    window.addEventListener('scroll', handleContentScroll);
    handleContentScroll();
    return () => window.removeEventListener('scroll', handleContentScroll);
  }, []);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleChipClick = (e, doc) => {
    e.preventDefault();
    e.stopPropagation();
    const src = doc.source;
    if (!src) return;
    switch (src.type) {
      case 'experience':
        if (src.experienceId) {
          setExperienceIdToFocus(src.experienceId);
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      case 'project':
        if (src.searchQuery) {
          setQueryFromShortcut(src.searchQuery);
          document.getElementById('project')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      default:
        break;
    }
  };

  const docsHeaderCls = buildCls(styles.docsHeaderBlock, headerOpacity === 0 && styles.docsHeaderBlockHidden);

  return (
    <div className={styles.docsContainer} ref={sectionRef}>
      <div
        className={docsHeaderCls}
        style={{ '--header-opacity': headerOpacity }}
      >
        <div className={styles.docsHeaderWrap}>
          <div className={styles.docsTitle}>
            <Header text="Docs" align="center" />
          </div>
        </div>
      </div>

      <nav
        ref={contentRef}
        className={styles.docsNav}
        aria-label={a11y('docs.nav')}
        style={{ '--content-opacity': contentOpacity }}
      >
        {categories.map(({ key, label, platformIcon, items }) => {
          const isOpen = expanded[key];
          const chevronCls = buildCls(styles.chevron, isOpen && styles.chevronOpen);
          const docListCls = buildCls(styles.docListWrap, isOpen && styles.docListWrapOpen);
          return (
            <div key={key} className={styles.folderBlock}>
              <button
                type="button"
                className={styles.folderRow}
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                aria-controls={`docs-list-${key}`}
              >
                <span className={chevronCls} aria-hidden="true" />
                <span className={styles.folderIcon} aria-hidden="true">
                  <Icon name={isOpen ? 'dir-open' : 'dir-close'} />
                </span>
                <span className={styles.platformIcon} aria-hidden="true">
                  <Icon name={platformIcon} />
                </span>
                <span className={styles.folderLabel}>{label}</span>
              </button>
              <section
                id={`docs-list-${key}`}
                className={docListCls}
                aria-label={a11y('docs.folderRegion', { label })}
              >
                <div className={styles.docListTrack}>
                  {items.map((doc) => (
                    <div key={doc.id} className={styles.docRow}>
                      <span className={styles.docIcon} aria-hidden="true">
                        <Icon name="document" />
                      </span>
                      {doc.source && doc.chipLabel && (
                        <button
                          type="button"
                          className={styles.docChip}
                          onClick={(e) => handleChipClick(e, doc)}
                          aria-label={a11y('docs.chipNavigate', { chip: doc.chipLabel })}
                        >
                          <span className={styles.docChipIcon} aria-hidden="true">
                            <Icon name="search" />
                          </span>
                          {doc.chipLabel}
                        </button>
                      )}
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.docRowLink}
                      >
                        <span className={styles.docTitle}>{doc.title}</span>
                        <div className={styles.docRowIconWrapper}>
                          <span className={styles.docRowArrow} aria-hidden="true">
                            <Icon name="angle-right" />
                          </span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Docs;
